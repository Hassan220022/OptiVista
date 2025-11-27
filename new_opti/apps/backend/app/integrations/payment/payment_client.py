from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import httpx
import logging

logger = logging.getLogger(__name__)


class PaymentProvider(Enum):
    STRIPE = "stripe"
    PAYMOB = "paymob"
    PAYPAL = "paypal"


@dataclass
class PaymentResult:
    """Result of a payment operation."""
    success: bool
    transaction_id: Optional[str] = None
    client_secret: Optional[str] = None  # Used as payment_key for Paymob
    payment_url: Optional[str] = None    # For redirect-based payments
    error_message: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


@dataclass
class RefundResult:
    """Result of a refund operation."""
    success: bool
    refund_id: Optional[str] = None
    amount_refunded: Optional[int] = None
    error_message: Optional[str] = None


class PaymentClient(ABC):
    """Abstract base class for payment providers."""
    
    @abstractmethod
    async def create_payment_intent(
        self,
        amount_cents: int,
        currency: str,
        customer_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        billing_data: Optional[Dict[str, Any]] = None
    ) -> PaymentResult:
        """Create a payment intent for client-side confirmation."""
        pass
    
    @abstractmethod
    async def confirm_payment(
        self,
        payment_intent_id: str
    ) -> PaymentResult:
        """Confirm a payment was successful."""
        pass
    
    @abstractmethod
    async def refund_payment(
        self,
        payment_intent_id: str,
        amount_cents: Optional[int] = None,
        reason: Optional[str] = None
    ) -> RefundResult:
        """Refund a payment (full or partial)."""
        pass
    
    @abstractmethod
    async def get_payment_status(
        self,
        payment_intent_id: str
    ) -> Dict[str, Any]:
        """Get the status of a payment."""
        pass


class PaymentMethod(Enum):
    CARD = "card"
    APPLE_PAY = "apple_pay"
    WALLET = "wallet"


class PaymobClient(PaymentClient):
    """Paymob payment client implementation."""
    
    def __init__(
        self, 
        api_key: str, 
        secret_key: str,
        public_key: str,
        iframe_id: str,
        integration_id: Optional[str] = None,
        apple_pay_integration_id: Optional[str] = None
    ):
        self.api_key = api_key
        self.secret_key = secret_key
        self.public_key = public_key
        self.iframe_id = iframe_id
        self.integration_id = integration_id
        self.apple_pay_integration_id = apple_pay_integration_id
        self.base_url = "https://accept.paymob.com/api"
        self._auth_token = None
    
    def get_integration_id(self, payment_method: PaymentMethod = PaymentMethod.CARD) -> Optional[str]:
        """Get the integration ID for a specific payment method."""
        if payment_method == PaymentMethod.APPLE_PAY:
            return self.apple_pay_integration_id
        return self.integration_id
    
    async def _get_auth_token(self) -> str:
        """Get authentication token using legacy API key."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/auth/tokens",
                json={"api_key": self.api_key}
            )
            response.raise_for_status()
            return response.json()["token"]
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for new API using secret key."""
        return {
            "Authorization": f"Token {self.secret_key}",
            "Content-Type": "application/json"
        }

    async def create_payment_intent(
        self,
        amount_cents: int,
        currency: str,
        customer_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        billing_data: Optional[Dict[str, Any]] = None,
        payment_method: str = "card"
    ) -> PaymentResult:
        """Create a Paymob payment key."""
        try:
            # Determine which integration to use
            if payment_method == "apple_pay":
                integration_id = self.apple_pay_integration_id
                if not integration_id:
                    return PaymentResult(
                        success=False,
                        error_message="Apple Pay not configured. Add PAYMOB_APPLE_PAY_INTEGRATION_ID to .env"
                    )
            else:
                integration_id = self.integration_id
            
            token = await self._get_auth_token()
            
            # 1. Register Order
            async with httpx.AsyncClient() as client:
                order_res = await client.post(
                    f"{self.base_url}/ecommerce/orders",
                    json={
                        "auth_token": token,
                        "delivery_needed": "false",
                        "amount_cents": str(amount_cents),
                        "currency": currency,
                        "merchant_order_id": metadata.get("session_id") if metadata else None,
                        "items": []
                    }
                )
                order_res.raise_for_status()
                order_id = order_res.json()["id"]
                
                # 2. Request Payment Key
                billing = billing_data or {}
                billing_payload = {
                    "apartment": billing.get("apartment", "NA"),
                    "email": billing.get("email", "customer@example.com"),
                    "floor": billing.get("floor", "NA"),
                    "first_name": billing.get("first_name", "Customer"),
                    "street": billing.get("street", "NA"),
                    "building": billing.get("building", "NA"),
                    "phone_number": billing.get("phone_number", "+201234567890"),
                    "shipping_method": "NA",
                    "postal_code": billing.get("postal_code", "NA"),
                    "city": billing.get("city", "Cairo"),
                    "country": billing.get("country", "EG"),
                    "last_name": billing.get("last_name", "Name"),
                    "state": billing.get("state", "NA")
                }
                
                key_res = await client.post(
                    f"{self.base_url}/acceptance/payment_keys",
                    json={
                        "auth_token": token,
                        "amount_cents": str(amount_cents),
                        "expiration": 3600,
                        "order_id": str(order_id),
                        "billing_data": billing_payload,
                        "currency": currency,
                        "integration_id": int(integration_id),
                        "lock_order_when_paid": "false"
                    }
                )
                key_res.raise_for_status()
                payment_key = key_res.json()["token"]
                
                # Build appropriate payment URL based on method
                if payment_method == "apple_pay":
                    # Apple Pay uses a different endpoint
                    payment_url = f"https://accept.paymob.com/api/acceptance/applepay/{payment_key}"
                else:
                    payment_url = f"https://accept.paymob.com/api/acceptance/iframes/{self.iframe_id}?payment_token={payment_key}"
                
                return PaymentResult(
                    success=True,
                    transaction_id=str(order_id),
                    client_secret=payment_key,
                    payment_url=payment_url,
                    raw_response={
                        "order_id": order_id,
                        "payment_key": payment_key,
                        "payment_method": payment_method,
                        "integration_id": integration_id
                    }
                )
                
        except Exception as e:
            logger.error(f"Paymob error: {e}")
            return PaymentResult(
                success=False,
                error_message=str(e)
            )

    async def confirm_payment(self, payment_intent_id: str) -> PaymentResult:
        """
        Verify payment status. 
        Note: payment_intent_id here is treated as Paymob Order ID or Transaction ID.
        """
        try:
            token = await self._get_auth_token()
            async with httpx.AsyncClient() as client:
                # Get transaction by ID
                response = await client.get(
                    f"{self.base_url}/acceptance/transactions/{payment_intent_id}",
                    headers={"Authorization": f"Bearer {token}"}
                )
                # Note: Paymob API might differ for retrieving by order ID vs transaction ID.
                # Typically we get transaction ID from webhook.
                # For now, assuming payment_intent_id is transaction_id
                
                if response.status_code == 404:
                     return PaymentResult(success=False, error_message="Transaction not found")
                     
                data = response.json()
                success = data.get("success", "false") == "true"
                
                return PaymentResult(
                    success=success,
                    transaction_id=str(data.get("id")),
                    raw_response=data,
                    error_message=None if success else "Payment not successful"
                )
        except Exception as e:
            return PaymentResult(success=False, error_message=str(e))

    async def refund_payment(
        self,
        payment_intent_id: str,
        amount_cents: Optional[int] = None,
        reason: Optional[str] = None
    ) -> RefundResult:
        """Refund a transaction."""
        try:
            token = await self._get_auth_token()
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/acceptance/void_refund/refund",
                    json={
                        "auth_token": token,
                        "transaction_id": payment_intent_id,
                        "amount_cents": amount_cents
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                return RefundResult(
                    success=data.get("success", False),
                    refund_id=str(data.get("id")),
                    amount_refunded=data.get("amount_cents")
                )
        except Exception as e:
            return RefundResult(success=False, error_message=str(e))

    async def get_payment_status(self, payment_intent_id: str) -> Dict[str, Any]:
        token = await self._get_auth_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/acceptance/transactions/{payment_intent_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            return response.json()


def get_payment_client(provider: PaymentProvider = PaymentProvider.PAYMOB) -> PaymentClient:
    """Factory function to get payment client."""
    from app.core.config import settings
    
    if provider == PaymentProvider.PAYMOB:
        return PaymobClient(
            api_key=settings.PAYMOB_API_KEY,
            secret_key=settings.PAYMOB_SECRET_KEY,
            public_key=settings.PAYMOB_PUBLIC_KEY,
            iframe_id=settings.PAYMOB_IFRAME_ID,
            integration_id=settings.PAYMOB_INTEGRATION_ID,
            apple_pay_integration_id=settings.PAYMOB_APPLE_PAY_INTEGRATION_ID
        )
    
    raise ValueError(f"Unsupported payment provider: {provider}")


def get_available_payment_methods() -> Dict[str, bool]:
    """Get available payment methods based on configuration."""
    from app.core.config import settings
    
    return {
        "card": bool(settings.PAYMOB_INTEGRATION_ID),
        "apple_pay": bool(settings.PAYMOB_APPLE_PAY_INTEGRATION_ID),
    }
