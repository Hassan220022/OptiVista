from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID

class CreateFeedbackRequest(BaseModel):
    type: str = "general"
    rating: int = 5
    message: Optional[str] = None
    device_info: Optional[Dict[str, Any]] = None
