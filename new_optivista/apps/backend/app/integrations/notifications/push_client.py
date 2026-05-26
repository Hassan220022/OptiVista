from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum
import httpx
import json
import logging

logger = logging.getLogger(__name__)


class PushProvider(Enum):
    FIREBASE = "firebase"
    ONESIGNAL = "onesignal"
    EXPO = "expo"


@dataclass
class PushNotification:
    """Push notification structure."""
    title: str
    body: str
    data: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    action_url: Optional[str] = None
    badge_count: Optional[int] = None
    sound: Optional[str] = "default"
    priority: str = "high"


@dataclass
class PushResult:
    """Result of sending a push notification."""
    success: bool
    message_id: Optional[str] = None
    failed_tokens: Optional[List[str]] = None
    error_message: Optional[str] = None


class PushClient(ABC):
    """Abstract push notification client."""
    
    @abstractmethod
    async def send_to_device(
        self,
        device_token: str,
        notification: PushNotification
    ) -> PushResult:
        """Send notification to a single device."""
        pass
    
    @abstractmethod
    async def send_to_devices(
        self,
        device_tokens: List[str],
        notification: PushNotification
    ) -> PushResult:
        """Send notification to multiple devices."""
        pass
    
    @abstractmethod
    async def send_to_topic(
        self,
        topic: str,
        notification: PushNotification
    ) -> PushResult:
        """Send notification to a topic."""
        pass


class FirebaseClient(PushClient):
    """Firebase Cloud Messaging client."""
    
    def __init__(self, server_key: str, project_id: str):
        self.server_key = server_key
        self.project_id = project_id
        self.base_url = f"https://fcm.googleapis.com/v1/projects/{project_id}/messages:send"
    
    async def _get_access_token(self) -> str:
        """Get OAuth2 access token for FCM v1 API."""
        # In production, use google-auth library with service account
        # For now, using legacy API with server key
        return self.server_key
    
    async def send_to_device(
        self,
        device_token: str,
        notification: PushNotification
    ) -> PushResult:
        """Send notification to a single device."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://fcm.googleapis.com/fcm/send",
                    headers={
                        "Authorization": f"key={self.server_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "to": device_token,
                        "notification": {
                            "title": notification.title,
                            "body": notification.body,
                            "image": notification.image_url,
                            "sound": notification.sound
                        },
                        "data": notification.data or {},
                        "priority": notification.priority
                    }
                )
                
                data = response.json()
                
                if data.get("success", 0) > 0:
                    return PushResult(
                        success=True,
                        message_id=data.get("results", [{}])[0].get("message_id")
                    )
                else:
                    return PushResult(
                        success=False,
                        error_message=data.get("results", [{}])[0].get("error")
                    )
        except Exception as e:
            logger.error(f"FCM send error: {e}")
            return PushResult(success=False, error_message=str(e))
    
    async def send_to_devices(
        self,
        device_tokens: List[str],
        notification: PushNotification
    ) -> PushResult:
        """Send notification to multiple devices."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://fcm.googleapis.com/fcm/send",
                    headers={
                        "Authorization": f"key={self.server_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "registration_ids": device_tokens,
                        "notification": {
                            "title": notification.title,
                            "body": notification.body,
                            "image": notification.image_url,
                            "sound": notification.sound
                        },
                        "data": notification.data or {},
                        "priority": notification.priority
                    }
                )
                
                data = response.json()
                
                # Collect failed tokens
                failed_tokens = []
                results = data.get("results", [])
                for i, result in enumerate(results):
                    if "error" in result:
                        failed_tokens.append(device_tokens[i])
                
                return PushResult(
                    success=data.get("success", 0) > 0,
                    failed_tokens=failed_tokens if failed_tokens else None,
                    error_message=None if data.get("success", 0) > 0 else "All sends failed"
                )
        except Exception as e:
            logger.error(f"FCM batch send error: {e}")
            return PushResult(success=False, error_message=str(e))
    
    async def send_to_topic(
        self,
        topic: str,
        notification: PushNotification
    ) -> PushResult:
        """Send notification to a topic."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://fcm.googleapis.com/fcm/send",
                    headers={
                        "Authorization": f"key={self.server_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "to": f"/topics/{topic}",
                        "notification": {
                            "title": notification.title,
                            "body": notification.body,
                            "image": notification.image_url
                        },
                        "data": notification.data or {}
                    }
                )
                
                data = response.json()
                return PushResult(
                    success="message_id" in data,
                    message_id=data.get("message_id")
                )
        except Exception as e:
            logger.error(f"FCM topic send error: {e}")
            return PushResult(success=False, error_message=str(e))


class ExpoClient(PushClient):
    """Expo Push Notification client for React Native/Expo apps."""
    
    def __init__(self):
        self.base_url = "https://exp.host/--/api/v2/push/send"
    
    async def send_to_device(
        self,
        device_token: str,
        notification: PushNotification
    ) -> PushResult:
        """Send notification to a single Expo device."""
        return await self.send_to_devices([device_token], notification)
    
    async def send_to_devices(
        self,
        device_tokens: List[str],
        notification: PushNotification
    ) -> PushResult:
        """Send notification to multiple Expo devices."""
        try:
            messages = [
                {
                    "to": token,
                    "title": notification.title,
                    "body": notification.body,
                    "data": notification.data or {},
                    "sound": notification.sound,
                    "badge": notification.badge_count
                }
                for token in device_tokens
            ]
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={"Content-Type": "application/json"},
                    json=messages
                )
                
                data = response.json()
                
                if "data" in data:
                    failed = [
                        device_tokens[i]
                        for i, item in enumerate(data["data"])
                        if item.get("status") == "error"
                    ]
                    return PushResult(
                        success=len(failed) < len(device_tokens),
                        failed_tokens=failed if failed else None
                    )
                
                return PushResult(success=False, error_message="Unknown response format")
        except Exception as e:
            logger.error(f"Expo push error: {e}")
            return PushResult(success=False, error_message=str(e))
    
    async def send_to_topic(
        self,
        topic: str,
        notification: PushNotification
    ) -> PushResult:
        """Expo doesn't support topics directly."""
        return PushResult(
            success=False,
            error_message="Expo doesn't support topic subscriptions"
        )


def get_push_client(provider: PushProvider = PushProvider.FIREBASE) -> PushClient:
    """Factory function to get push notification client."""
    from app.core.config import settings
    
    if provider == PushProvider.FIREBASE:
        return FirebaseClient(
            server_key=getattr(settings, 'FCM_SERVER_KEY', ''),
            project_id=getattr(settings, 'FIREBASE_PROJECT_ID', '')
        )
    
    if provider == PushProvider.EXPO:
        return ExpoClient()
    
    raise ValueError(f"Unsupported push provider: {provider}")
