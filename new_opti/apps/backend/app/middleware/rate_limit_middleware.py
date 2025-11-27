from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict, Optional
import asyncio


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiting middleware.
    For production, consider using Redis-based rate limiting.
    """
    
    def __init__(
        self,
        app,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
        burst_limit: int = 10,
    ):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.burst_limit = burst_limit
        
        # In-memory storage (use Redis in production)
        self._minute_counts: Dict[str, list] = {}
        self._hour_counts: Dict[str, list] = {}
        self._lock = asyncio.Lock()
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier (IP or user ID if authenticated)."""
        # Try to get user ID from state (if auth middleware ran first)
        user_id = getattr(request.state, 'user_id', None)
        if user_id:
            return f"user:{user_id}"
        
        # Fall back to IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"ip:{forwarded.split(',')[0].strip()}"
        
        return f"ip:{request.client.host}" if request.client else "ip:unknown"
    
    async def _cleanup_old_entries(self, entries: list, cutoff: datetime) -> list:
        """Remove entries older than cutoff."""
        return [ts for ts in entries if ts > cutoff]
    
    async def _check_rate_limit(
        self,
        client_id: str,
        counts: Dict[str, list],
        limit: int,
        window: timedelta
    ) -> tuple[bool, int]:
        """
        Check if client is within rate limit.
        
        Returns:
            (is_allowed, remaining_requests)
        """
        now = datetime.utcnow()
        cutoff = now - window
        
        async with self._lock:
            if client_id not in counts:
                counts[client_id] = []
            
            # Cleanup old entries
            counts[client_id] = await self._cleanup_old_entries(
                counts[client_id], cutoff
            )
            
            current_count = len(counts[client_id])
            
            if current_count >= limit:
                return False, 0
            
            # Record this request
            counts[client_id].append(now)
            return True, limit - current_count - 1
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/", "/health"]:
            return await call_next(request)
        
        client_id = self._get_client_id(request)
        
        # Check minute limit
        allowed, remaining_minute = await self._check_rate_limit(
            client_id,
            self._minute_counts,
            self.requests_per_minute,
            timedelta(minutes=1)
        )
        
        if not allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "status": "error",
                    "detail": "Rate limit exceeded. Please try again later.",
                    "code": "RATE_LIMIT_EXCEEDED"
                },
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self.requests_per_minute),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((datetime.utcnow() + timedelta(minutes=1)).timestamp()))
                }
            )
        
        # Check hour limit
        allowed, remaining_hour = await self._check_rate_limit(
            client_id,
            self._hour_counts,
            self.requests_per_hour,
            timedelta(hours=1)
        )
        
        if not allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "status": "error",
                    "detail": "Hourly rate limit exceeded. Please try again later.",
                    "code": "RATE_LIMIT_EXCEEDED"
                },
                headers={
                    "Retry-After": "3600",
                    "X-RateLimit-Limit": str(self.requests_per_hour),
                    "X-RateLimit-Remaining": "0"
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit-Minute"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining-Minute"] = str(remaining_minute)
        
        return response


class EndpointRateLimiter:
    """
    Decorator for per-endpoint rate limiting.
    
    Usage:
        rate_limiter = EndpointRateLimiter(requests_per_minute=10)
        
        @app.get("/expensive-operation")
        @rate_limiter.limit
        async def expensive_operation():
            ...
    """
    
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self._counts: Dict[str, Dict[str, list]] = {}
        self._lock = asyncio.Lock()
    
    async def check_limit(self, endpoint: str, client_id: str) -> bool:
        """Check if request is allowed."""
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=1)
        
        async with self._lock:
            if endpoint not in self._counts:
                self._counts[endpoint] = {}
            
            if client_id not in self._counts[endpoint]:
                self._counts[endpoint][client_id] = []
            
            # Cleanup
            self._counts[endpoint][client_id] = [
                ts for ts in self._counts[endpoint][client_id]
                if ts > cutoff
            ]
            
            if len(self._counts[endpoint][client_id]) >= self.requests_per_minute:
                return False
            
            self._counts[endpoint][client_id].append(now)
            return True
