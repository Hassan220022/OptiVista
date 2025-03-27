// File Management API Service
// Implements the OptiVista File Management API as documented in api_docs.md

import { apiRequest } from './api';

const FILE_API_BASE = '/uploads';

// Helper function to create FormData for file uploads
const createFormData = (file: File, folder?: string): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }
  return formData;
};

// Custom file upload API request to handle FormData
const fileApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  formData?: FormData
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type header for FormData - browser will set it with boundary
  
  const config: RequestInit = {
    method,
    headers,
    body: formData,
  };
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        throw new Error('Unauthorized access. Please log in again.');
      }
      
      if (response.status === 413) {
        throw new Error('File exceeds maximum size limit.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
    
  } catch (error) {
    console.error('File API request failed:', error);
    throw error;
  }
};

// Type definitions
export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  url: string;
  key: string;
}

export interface FileListItem {
  key: string;
  size: number;
  lastModified: string;
  url: string;
}

export interface FileListResponse {
  files: FileListItem[];
}

// File Management API service
export const fileManagerApi = {
  // Single file upload
  uploadFile: async (file: File, folder?: string): Promise<{ message: string, file: FileMetadata }> => {
    const formData = createFormData(file, folder);
    return fileApiRequest(`${FILE_API_BASE}/file`, 'POST', formData);
  },
  
  // Multiple files upload
  uploadFiles: async (files: File[], folder?: string): Promise<{ message: string, files: FileMetadata[] }> => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    
    if (folder) {
      formData.append('folder', folder);
    }
    
    return fileApiRequest(`${FILE_API_BASE}/files`, 'POST', formData);
  },
  
  // Specialized upload for images
  uploadImage: async (imageFile: File, folder?: string): Promise<{ message: string, file: FileMetadata }> => {
    // Validate file type before uploading
    const validImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = `.${imageFile.name.split('.').pop()?.toLowerCase()}`;
    
    if (!validImageTypes.includes(fileExtension)) {
      throw new Error(`File type not supported. Allowed types: ${validImageTypes.join(', ')}`);
    }
    
    const formData = createFormData(imageFile, folder);
    return fileApiRequest(`${FILE_API_BASE}/image`, 'POST', formData);
  },
  
  // Specialized upload for 3D models (crucial for AR eyewear visualization)
  uploadModel: async (modelFile: File, folder?: string): Promise<{ message: string, file: FileMetadata }> => {
    // Validate file type before uploading
    const validModelTypes = ['.glb', '.gltf', '.usdz', '.obj'];
    const fileExtension = `.${modelFile.name.split('.').pop()?.toLowerCase()}`;
    
    if (!validModelTypes.includes(fileExtension)) {
      throw new Error(`File type not supported. Allowed types: ${validModelTypes.join(', ')}`);
    }
    
    const formData = createFormData(modelFile, folder);
    return fileApiRequest(`${FILE_API_BASE}/model`, 'POST', formData);
  },
  
  // File retrieval (returns presigned URL)
  getFileUrl: async (filePath: string): Promise<{ url: string }> => {
    return apiRequest(`${FILE_API_BASE}/file/${filePath}`, 'GET');
  },
  
  // File listing
  listFiles: async (folder?: string): Promise<FileListResponse> => {
    const endpoint = folder ? `${FILE_API_BASE}/files/${folder}` : `${FILE_API_BASE}/files`;
    return apiRequest(endpoint, 'GET');
  },
  
  // File deletion
  deleteFile: async (filePath: string): Promise<{ message: string }> => {
    return apiRequest(`${FILE_API_BASE}/file/${filePath}`, 'DELETE');
  },
  
  // Utility: File URL caching system as recommended in the docs
  // Cache file URLs for 50 minutes (presigned URLs valid for 60)
  _urlCache: new Map<string, { url: string, timestamp: number }>(),
  _urlCacheTTL: 50 * 60 * 1000, // 50 minutes in ms
  
  getCachedFileUrl: async (fileKey: string): Promise<string> => {
    // Check cache first
    const cachedUrl = fileManagerApi._urlCache.get(fileKey);
    const now = Date.now();
    
    if (cachedUrl && now - cachedUrl.timestamp < fileManagerApi._urlCacheTTL) {
      return cachedUrl.url;
    }
    
    // Fetch fresh URL if not in cache or expired
    try {
      const { url } = await fileManagerApi.getFileUrl(fileKey);
      
      // Update cache
      fileManagerApi._urlCache.set(fileKey, {
        url,
        timestamp: now
      });
      
      return url;
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw error;
    }
  },
  
  // Utility: File type validation
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return allowedTypes.includes(fileExt);
  }
};

export default fileManagerApi; 