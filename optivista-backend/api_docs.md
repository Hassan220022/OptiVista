
# OptiVista File Management API

## Overview

High-performance file management microservice built on Express.js with S3-compatible object storage (MinIO). Features JWT auth, presigned URLs, comprehensive validation, and configurable storage policies.

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

Token acquisition via `/api/auth/login` endpoint. Tokens valid for 24h.

## Endpoints

### File Upload

#### Single File Upload

```
POST /api/uploads/file
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:**
- `file`: File object (required)
- `folder`: Target folder (optional, defaults to "uploads")

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "name": "example.jpg",
    "type": "image/jpeg",
    "size": 1024,
    "url": "http://localhost:9000/optivista-files/uploads/uuid.jpg",
    "key": "uploads/uuid.jpg"
  }
}
```

#### Multiple Files Upload

```
POST /api/uploads/files
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:**
- `files[]`: Array of file objects (required)
- `folder`: Target folder (optional, defaults to "uploads")

**Response:** Array of file objects with metadata

### Specialized Upload Endpoints

- **Images:** `POST /api/uploads/image` (10MB max, image formats only)
- **3D Models:** `POST /api/uploads/model` (50MB max, 3D model formats only)

### File Retrieval

```
GET /api/uploads/file/:path
```

Path parameter supports nested paths. Returns presigned URL valid for 1 hour:

```json
{
  "url": "http://localhost:9000/optivista-files/path/to/file.jpg?X-Amz-Algorithm=..."
}
```

### File Listing

```
GET /api/uploads/files/:folder?
```

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "files": [
    {
      "key": "folder/file1.jpg",
      "size": 1024,
      "lastModified": "2025-03-27T05:49:31.883Z",
      "url": "http://localhost:9000/optivista-files/folder/file1.jpg"
    }
  ]
}
```

### File Deletion

```
DELETE /api/uploads/file/:path
```

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

## Validation

### Size Limits
- General files: 50MB
- Images: 10MB 
- 3D Models: 50MB

### Supported File Types

- **Images:** .jpg, .jpeg, .png, .gif, .webp
- **3D Models:** .glb, .gltf, .usdz, .obj
- **Documents:** .pdf, .doc, .docx, .txt

## Security Architecture

- All write operations require authentication
- File retrieval uses presigned URLs with 1-hour expiration
- Granular role-based permissions (customer/seller/admin)
- Input validation for all endpoints
- Sanitized file names via UUID generation
- Content-Type verification

## Advanced Usage

### Efficient File Handling Pattern

```javascript
// 1. Get upload URL
const response = await fetch('/api/uploads/file', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}` 
  },
  body: formData
});
const { file } = await response.json();

// 2. Store key for future retrieval
await storeFileReference(file.key);

// 3. Retrieve file URL when needed (just-in-time)
const { url } = await fetch(`/api/uploads/file/${fileKey}`, {
  method: 'GET'
}).then(res => res.json());
```

### Chunked Upload Strategy

For files approaching size limits, implement chunked upload:

1. Split file client-side (5MB chunks recommended)
2. Upload each chunk sequentially with retry logic
3. Track progress via client-side state

## Performance Optimization

- MinIO connection pooling enabled
- Temporary files auto-cleaned
- Efficient folder-based listing via S3 prefix filtering
- Configurable MaxKeys parameter (default: 1000)
- Content streaming for minimal memory footprint

## Error Codes

- `400`: Invalid input (file missing, wrong format)
- `401`: Authentication error
- `403`: Permission denied (role-based)
- `500`: Server error (details in error.message)

## Implementation Notes

- Storage backend configurable via environment variables
- Connection retries built into S3 client
- Fault tolerance for partial upload failures
- Rate limiting and IP-based throttling recommended for production



# recommendations for frontend

## Frontend Integration Guide

### React Implementation

```jsx
const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('folder', 'user-uploads');
    
    try {
      const response = await fetch('http://localhost:3000/api/uploads/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setFiles(prev => [...prev, result.file]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <span>Uploading...</span>}
      <ul>
        {files.map(file => (
          <li key={file.key}>
            {file.name} - {(file.size/1024).toFixed(2)}KB
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Upload Progress Tracking

```javascript
const uploadFile = async (file) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  
  formData.append('file', file);
  
  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = ((event.loaded / event.total) * 100).toFixed(2);
        // Update progress UI
        updateProgressBar(percentComplete);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    
    xhr.open('POST', 'http://localhost:3000/api/uploads/file');
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
    xhr.send(formData);
  });
};
```

### File Type Validation

```javascript
const validateFileType = (file, allowedTypes) => {
  const fileExt = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(`.${fileExt}`)) {
    throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }
  return true;
};

// Usage example
try {
  validateFileType(file, ['.jpg', '.png', '.pdf']);
  // Proceed with upload
} catch (error) {
  displayError(error.message);
}
```

### Image Preview Component

```jsx
const ImagePreview = ({ fileKey }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/uploads/file/${fileKey}`);
        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error('Failed to fetch image URL:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUrl();
  }, [fileKey]);
  
  if (loading) return <div>Loading image...</div>;
  if (!imageUrl) return <div>Failed to load image</div>;
  
  return <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%' }} />;
};
```

### Error Handling Patterns

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with non-2xx status
    switch (error.response.status) {
      case 401:
        // Redirect to login
        redirectToLogin();
        return 'Session expired. Please login again.';
      
      case 403:
        return 'You do not have permission to perform this action.';
        
      case 413:
        return 'File exceeds maximum size limit.';
        
      default:
        return error.response.data.message || 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Error setting up request
    return 'Could not process request. Please try again.';
  }
};
```

### Caching Strategy

```javascript
// Cache file URLs for 50 minutes (presigned URLs valid for 60)
const FILE_URL_CACHE = new Map();
const URL_CACHE_TTL = 50 * 60 * 1000; // 50 minutes in ms

const getFileUrl = async (fileKey) => {
  // Check cache first
  const cachedUrl = FILE_URL_CACHE.get(fileKey);
  const now = Date.now();
  
  if (cachedUrl && now - cachedUrl.timestamp < URL_CACHE_TTL) {
    return cachedUrl.url;
  }
  
  // Fetch fresh URL
  try {
    const response = await fetch(`http://localhost:3000/api/uploads/file/${fileKey}`);
    const data = await response.json();
    
    // Update cache
    FILE_URL_CACHE.set(fileKey, {
      url: data.url,
      timestamp: now
    });
    
    return data.url;
  } catch (error) {
    console.error('Failed to get file URL:', error);
    throw error;
  }
};
```

### User Experience Best Practices

1. **Drag and Drop Interface**: Implement drag-and-drop zones for intuitive file uploading
2. **Retry Mechanism**: Auto-retry uploads on temporary network failures
3. **Throttling**: Limit concurrent uploads to 3-5 for optimal performance
4. **Client-side Compression**: Consider image compression before upload for images
5. **Preview Generation**: Generate thumbnails client-side before upload for instant feedback
6. **Upload Queue**: Implement queuing for batch uploads to prevent overwhelming server

### Mobile Considerations

1. **Connection Awareness**: Detect network type (WiFi/Cellular) and adjust upload behavior
2. **Background Upload**: Support background upload on mobile devices
3. **Resume Upload**: Implement resumable uploads for mobile networks
4. **Reduced Quality Option**: Offer quality reduction option for constrained bandwidth

### Security Considerations

1. Verify token expiration before upload attempts
2. Sanitize filenames client-side for better error reporting
3. Implement content hash verification for critical files
4. Secure token storage in HttpOnly cookies or secure storage
