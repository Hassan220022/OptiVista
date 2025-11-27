from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum
import httpx
import logging

logger = logging.getLogger(__name__)


class EmailProvider(Enum):
    RESEND = "resend"
    SENDGRID = "sendgrid"
    SMTP = "smtp"


@dataclass
class EmailMessage:
    """Email message structure."""
    to: List[str]
    subject: str
    html_body: Optional[str] = None
    text_body: Optional[str] = None
    from_email: Optional[str] = None
    from_name: Optional[str] = None
    reply_to: Optional[str] = None
    cc: Optional[List[str]] = None
    bcc: Optional[List[str]] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    template_id: Optional[str] = None
    template_data: Optional[Dict[str, Any]] = None


@dataclass
class EmailResult:
    """Result of sending an email."""
    success: bool
    message_id: Optional[str] = None
    error_message: Optional[str] = None


class EmailClient(ABC):
    """Abstract email client."""
    
    @abstractmethod
    async def send(self, message: EmailMessage) -> EmailResult:
        """Send an email."""
        pass
    
    @abstractmethod
    async def send_template(
        self,
        template_id: str,
        to: List[str],
        data: Dict[str, Any]
    ) -> EmailResult:
        """Send an email using a template."""
        pass


class ResendClient(EmailClient):
    """Resend email client implementation."""
    
    def __init__(self, api_key: str, default_from: str = "noreply@optivista.app"):
        self.api_key = api_key
        self.default_from = default_from
        self.base_url = "https://api.resend.com"
    
    async def send(self, message: EmailMessage) -> EmailResult:
        """Send email via Resend."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/emails",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "from": message.from_email or self.default_from,
                        "to": message.to,
                        "subject": message.subject,
                        "html": message.html_body,
                        "text": message.text_body,
                        "reply_to": message.reply_to,
                        "cc": message.cc,
                        "bcc": message.bcc,
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return EmailResult(
                        success=True,
                        message_id=data.get("id")
                    )
                else:
                    return EmailResult(
                        success=False,
                        error_message=response.text
                    )
        except Exception as e:
            logger.error(f"Email send error: {e}")
            return EmailResult(success=False, error_message=str(e))
    
    async def send_template(
        self,
        template_id: str,
        to: List[str],
        data: Dict[str, Any]
    ) -> EmailResult:
        """Send templated email (using HTML templates stored locally)."""
        # Load and render template
        html_body = await self._render_template(template_id, data)
        
        message = EmailMessage(
            to=to,
            subject=data.get("subject", "OptiVista Notification"),
            html_body=html_body
        )
        
        return await self.send(message)
    
    async def _render_template(
        self,
        template_id: str,
        data: Dict[str, Any]
    ) -> str:
        """Render an email template with data."""
        templates = {
            "order_confirmation": self._order_confirmation_template,
            "order_shipped": self._order_shipped_template,
            "password_reset": self._password_reset_template,
            "welcome": self._welcome_template,
        }
        
        template_func = templates.get(template_id)
        if template_func:
            return template_func(data)
        
        return f"<p>{data}</p>"
    
    def _order_confirmation_template(self, data: Dict[str, Any]) -> str:
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Confirmed!</h1>
            <p>Thank you for your order, {data.get('customer_name', 'Valued Customer')}!</p>
            <p>Your order <strong>#{data.get('order_number')}</strong> has been confirmed.</p>
            <p>Total: <strong>${data.get('total', 0) / 100:.2f}</strong></p>
            <p>We'll send you another email when your order ships.</p>
            <p>Best regards,<br>The OptiVista Team</p>
        </body>
        </html>
        """
    
    def _order_shipped_template(self, data: Dict[str, Any]) -> str:
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Your Order Has Shipped!</h1>
            <p>Great news! Your order <strong>#{data.get('order_number')}</strong> is on its way.</p>
            <p>Tracking Number: <strong>{data.get('tracking_number')}</strong></p>
            <p><a href="{data.get('tracking_url', '#')}">Track Your Package</a></p>
            <p>Best regards,<br>The OptiVista Team</p>
        </body>
        </html>
        """
    
    def _password_reset_template(self, data: Dict[str, Any]) -> str:
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Reset Your Password</h1>
            <p>Click the link below to reset your password:</p>
            <p><a href="{data.get('reset_url')}">Reset Password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
        </html>
        """
    
    def _welcome_template(self, data: Dict[str, Any]) -> str:
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to OptiVista!</h1>
            <p>Hi {data.get('name', 'there')}!</p>
            <p>Thank you for joining OptiVista. We're excited to help you find your perfect eyewear!</p>
            <p>Try our AR feature to see how glasses look on you before you buy.</p>
            <p>Best regards,<br>The OptiVista Team</p>
        </body>
        </html>
        """


def get_email_client(provider: EmailProvider = EmailProvider.RESEND) -> EmailClient:
    """Factory function to get email client."""
    from app.core.config import settings
    
    if provider == EmailProvider.RESEND:
        return ResendClient(api_key=getattr(settings, 'RESEND_API_KEY', ''))
    
    raise ValueError(f"Unsupported email provider: {provider}")
