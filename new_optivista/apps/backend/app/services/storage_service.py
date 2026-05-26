from app.core.supabase_client import supabase
from typing import Optional, Tuple
from fastapi import HTTPException, UploadFile
from datetime import datetime, timedelta
import uuid
import mimetypes


class StorageService:
    """Service for managing file uploads and storage via Supabase Storage."""
    
    # Bucket names
    PRODUCT_IMAGES_BUCKET = "product-images"
    AR_MODELS_BUCKET = "ar-models"
    USER_AVATARS_BUCKET = "user-avatars"
    AR_CAPTURES_BUCKET = "ar-captures"
    
    # Allowed file types
    IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    AR_MODEL_TYPES = ["model/gltf-binary", "model/gltf+json", "application/octet-stream"]
    
    # Size limits (in bytes)
    MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
    MAX_AR_MODEL_SIZE = 50 * 1024 * 1024  # 50MB
    MAX_AVATAR_SIZE = 2 * 1024 * 1024  # 2MB
    
    @staticmethod
    def upload_product_image(
        file: UploadFile,
        product_id: str,
        variant_id: Optional[str] = None
    ) -> str:
        """
        Upload a product image.
        
        Args:
            file: The uploaded file
            product_id: Product UUID
            variant_id: Optional variant UUID
            
        Returns:
            Public URL of uploaded image
        """
        # Validate file type
        if file.content_type not in StorageService.IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(StorageService.IMAGE_TYPES)}"
            )
        
        # Generate path
        file_ext = mimetypes.guess_extension(file.content_type) or ".jpg"
        if variant_id:
            path = f"{product_id}/{variant_id}/{uuid.uuid4()}{file_ext}"
        else:
            path = f"{product_id}/{uuid.uuid4()}{file_ext}"
        
        # Upload to Supabase
        return StorageService._upload_file(
            bucket=StorageService.PRODUCT_IMAGES_BUCKET,
            path=path,
            file=file,
            max_size=StorageService.MAX_IMAGE_SIZE
        )
    
    @staticmethod
    def upload_ar_model(
        file: UploadFile,
        product_id: str,
        variant_id: Optional[str] = None,
        platform: str = "all"
    ) -> str:
        """
        Upload an AR 3D model.
        
        Args:
            file: The uploaded file (.glb, .usdz)
            product_id: Product UUID
            variant_id: Optional variant UUID
            platform: Target platform (ios, android, all)
            
        Returns:
            Storage path of uploaded model
        """
        # Determine file extension
        filename = file.filename or "model"
        ext = filename.split(".")[-1].lower() if "." in filename else "glb"
        
        if ext not in ["glb", "usdz", "gltf"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid AR model format. Allowed: glb, usdz, gltf"
            )
        
        # Generate path
        variant_part = variant_id or "default"
        path = f"{product_id}/{variant_part}/{platform}/model.{ext}"
        
        # Upload to Supabase
        return StorageService._upload_file(
            bucket=StorageService.AR_MODELS_BUCKET,
            path=path,
            file=file,
            max_size=StorageService.MAX_AR_MODEL_SIZE
        )
    
    @staticmethod
    def upload_user_avatar(file: UploadFile, user_id: str) -> str:
        """
        Upload a user avatar.
        
        Args:
            file: The uploaded image file
            user_id: User UUID
            
        Returns:
            Public URL of uploaded avatar
        """
        if file.content_type not in StorageService.IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Invalid image type"
            )
        
        file_ext = mimetypes.guess_extension(file.content_type) or ".jpg"
        path = f"{user_id}/avatar{file_ext}"
        
        return StorageService._upload_file(
            bucket=StorageService.USER_AVATARS_BUCKET,
            path=path,
            file=file,
            max_size=StorageService.MAX_AVATAR_SIZE,
            upsert=True
        )
    
    @staticmethod
    def upload_ar_capture(file: UploadFile, user_id: str) -> str:
        """
        Upload an AR screenshot/capture.
        
        Args:
            file: The captured image
            user_id: User UUID
            
        Returns:
            URL of uploaded capture
        """
        if file.content_type not in StorageService.IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Invalid image type"
            )
        
        file_ext = mimetypes.guess_extension(file.content_type) or ".jpg"
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        path = f"{user_id}/{timestamp}_{uuid.uuid4()}{file_ext}"
        
        return StorageService._upload_file(
            bucket=StorageService.AR_CAPTURES_BUCKET,
            path=path,
            file=file,
            max_size=StorageService.MAX_IMAGE_SIZE
        )
    
    @staticmethod
    def get_signed_url(
        bucket: str,
        path: str,
        expires_in: int = 3600
    ) -> str:
        """
        Generate a signed URL for private file access.
        
        Args:
            bucket: Storage bucket name
            path: File path within bucket
            expires_in: URL expiration in seconds (default 1 hour)
            
        Returns:
            Signed URL string
        """
        response = supabase.storage.from_(bucket).create_signed_url(
            path=path,
            expires_in=expires_in
        )
        
        if not response or "signedURL" not in response:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate signed URL"
            )
        
        return response["signedURL"]
    
    @staticmethod
    def get_public_url(bucket: str, path: str) -> str:
        """Get public URL for a file in a public bucket."""
        response = supabase.storage.from_(bucket).get_public_url(path)
        return response
    
    @staticmethod
    def delete_file(bucket: str, path: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            bucket: Storage bucket name
            path: File path within bucket
            
        Returns:
            True if deleted successfully
        """
        try:
            supabase.storage.from_(bucket).remove([path])
            return True
        except Exception:
            return False
    
    @staticmethod
    def _upload_file(
        bucket: str,
        path: str,
        file: UploadFile,
        max_size: int,
        upsert: bool = False
    ) -> str:
        """
        Internal method to upload a file to Supabase Storage.
        
        Args:
            bucket: Target bucket
            path: File path
            file: The file to upload
            max_size: Maximum file size in bytes
            upsert: Whether to overwrite existing file
            
        Returns:
            Public URL or path of uploaded file
        """
        # Read file content
        content = file.file.read()
        
        # Check size
        if len(content) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {max_size // (1024*1024)}MB"
            )
        
        # Upload
        try:
            options = {"upsert": "true"} if upsert else {}
            supabase.storage.from_(bucket).upload(
                path=path,
                file=content,
                file_options={"content-type": file.content_type, **options}
            )
            
            # Return public URL for public buckets, path for private
            if bucket in [StorageService.USER_AVATARS_BUCKET, StorageService.PRODUCT_IMAGES_BUCKET]:
                return StorageService.get_public_url(bucket, path)
            else:
                return path
                
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file: {str(e)}"
            )
