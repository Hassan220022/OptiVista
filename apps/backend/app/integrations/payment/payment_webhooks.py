from fastapi import APIRouter, Request, HTTPException, Query
from typing import Dict, Any, Optional
import hmac
import hashlib
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter()


def calculate_hmac(data: Dict[str, Any], hmac_secret: str) -> str:
    """
    Calculate Paymob HMAC for transaction verification.
    Concatenates specific fields in lexicographical order and hashes them.
    """
    # Fields order as per Paymob documentation
    fields = [
        "amount_cents",
        "created_at",
        "currency",
        "error_occured",
        "has_parent_transaction",
        "id",
        "integration_id",
        "is_3d_secure",
        "is_auth",
        "is_capture",
        "is_refunded",
        "is_standalone_payment",
        "is_voided",
        "order",
        "owner",
        "pending",
        "source_data.pan",
        "source_data.sub_type",
        "source_data.type",
        "success",
    ]
    
    concatenated = ""
    for field in fields:
        value = data.get(field)
        
        # Handle nested fields
        if "." in field:
            parts = field.split(".")
            parent = data.get(parts[0], {})
            # source_data can be a string in some cases, guard against it
            if isinstance(parent, dict):
                value = parent.get(parts[1])
            else:
                value = None
        
        # Handle boolean values as string "true"/"false"
        if isinstance(value, bool):
            value = "true" if value else "false"
        elif value is None:
            value = ""
        
        concatenated += str(value)
        
    return hmac.new(
        hmac_secret.encode(),
        concatenated.encode(),
        hashlib.sha512
    ).hexdigest()


@router.get("/paymob")
@router.post("/paymob")
async def handle_paymob_webhook(
    request: Request,
    hmac_param: Optional[str] = Query(None, alias="hmac")
):
    """
    Handle Paymob transaction webhooks.
    Supports both GET (redirection) and POST (server-to-server) callbacks.
    """
    from app.core.config import settings
    # from app.services.order_service import OrderService
    
    # Parse data based on method
    if request.method == "POST":
        try:
            data = await request.json()
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
            
        req_hmac = hmac_param or request.query_params.get("hmac")
        # 'obj' wrapper is common in Paymob POST
        obj = data.get("obj", data) 
    else:
        # GET request (redirection)
        data = dict(request.query_params)
        req_hmac = data.get("hmac")
        obj = data
        
    if not req_hmac:
        # Sometimes Paymob might not send hmac in GET redirect if not configured?
        # But we should enforce it for security.
        raise HTTPException(status_code=400, detail="Missing HMAC signature")
    
    # Verify HMAC
    # Use HMAC_SECRET if available, otherwise use SECRET_KEY
    hmac_secret = settings.PAYMOB_HMAC_SECRET or settings.PAYMOB_SECRET_KEY
    calculated_hmac = calculate_hmac(obj, hmac_secret)
    
    if req_hmac != calculated_hmac:
        logger.warning(f"HMAC mismatch. Calc: {calculated_hmac}, Rec: {req_hmac}")
        raise HTTPException(status_code=400, detail="Invalid HMAC signature")
    
    success = str(obj.get("success")).lower() == "true"
    order_id = obj.get("order") # Paymob Order ID
    transaction_id = obj.get("id") # Paymob Transaction ID
    
    logger.info(f"Processing Paymob transaction {transaction_id} for order {order_id}. Success: {success}")
    
    return {"received": True}
