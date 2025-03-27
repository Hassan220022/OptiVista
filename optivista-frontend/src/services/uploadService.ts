import { API_BASE_URL } from './api';

/**
 * Service for handling file uploads to the server
 */
export const uploadService = {
  /**
   * Upload a single file to the server
   * @param file File object to upload
   * @param folder Optional folder to store the file in
   * @returns Promise with the uploaded file data
   */
  async uploadFile(file: File, folder: string = 'uploads'): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      return data.file;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },
  
  /**
   * Upload an image file to the server
   * @param file Image file object to upload
   * @param folder Optional folder to store the file in
   * @returns Promise with the uploaded file data
   */
  async uploadImage(file: File, folder: string = 'images'): Promise<UploadedFile> {
    // Validate image type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      throw new Error('Invalid image type. Supported types: JPG, PNG, GIF, WebP');
    }
    
    // Use specialized endpoint for images
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Image upload failed');
      }
      
      const data = await response.json();
      return data.file;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },
  
  /**
   * Upload a 3D model file to the server
   * @param file 3D model file object to upload
   * @param folder Optional folder to store the file in
   * @returns Promise with the uploaded file data
   */
  async uploadModel(file: File, folder: string = 'models'): Promise<UploadedFile> {
    // Validate model type
    const validModelTypes = ['.glb', '.gltf', '.usdz', '.obj'].map(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!validModelTypes.includes(true)) {
      throw new Error('Invalid model type. Supported types: GLB, GLTF, USDZ, OBJ');
    }
    
    // Use specialized endpoint for 3D models
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/model`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Model upload failed');
      }
      
      const data = await response.json();
      return data.file;
    } catch (error) {
      console.error('Model upload error:', error);
      throw error;
    }
  },
  
  /**
   * Get a file URL using the file key
   * @param fileKey Key of the file to retrieve
   * @returns Promise with the file URL
   */
  async getFileUrl(fileKey: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/file/${fileKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve file URL');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },
  
  /**
   * List files in a folder
   * @param folder Folder to list files from
   * @returns Promise with an array of files
   */
  async listFiles(folder: string = 'uploads'): Promise<UploadedFile[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/files/${folder}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to list files');
      }
      
      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },
  
  /**
   * Delete a file using its key
   * @param fileKey Key of the file to delete
   * @returns Promise with success message
   */
  async deleteFile(fileKey: string): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/file/${fileKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Type definitions
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url: string;
  key: string;
} 