from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID

class ARAssetResponse(BaseModel):
    id: UUID
    product_id: UUID
    model_url: str
    texture_url: Optional[str] = None
    scale_factor: float = 1.0
    offset_x: float = 0.0
    offset_y: float = 0.0
    offset_z: float = 0.0
    platform_notes: Optional[str] = None

class ARTelemetryRequest(BaseModel):
    product_id: UUID
    duration_seconds: float
    success: bool
    device_info: Optional[Dict[str, Any]] = None
