// File Management API Service
// Implements the OptiVista File Management API as documented in api_docs.md

import { apiRequest } from './api';

// Base URL for the file API
const FILE_API_BASE = process.env.VITE_API_URL ? `${process.env.VITE_API_URL}/files` : '/api/files';

// Configuration for file upload
interface FileUploadConfig {
  file: File;
  path?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

// File manager service with methods for file operations
const fileManager = {
  /**
   * Uploads a file to the server
   * @param config - Upload configuration
   * @returns Promise with uploaded file details
   */
  async uploadFile({ file, path = '', metadata = {}, onProgress }: FileUploadConfig) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (path) {
        formData.append('path', path);
      }
      
      if (Object.keys(metadata).length > 0) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      // Custom implementation to track upload progress
      const endpoint = `${FILE_API_BASE}/upload`;
      
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open('POST', endpoint);
        
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (error) {
              reject(new Error('Failed to parse server response'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error during upload'));
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progressPercent = Math.round((event.loaded / event.total) * 100);
            onProgress(progressPercent);
          }
        };
        
        xhr.send(formData);
      });
      
      return uploadPromise;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },
  
  /**
   * Uploads multiple files to the server
   * @param files - Array of files to upload
   * @param path - Target path on the server
   * @returns Promise with array of uploaded file details
   */
  async uploadMultipleFiles(files: File[], path = '') {
    const uploadPromises = Array.from(files).map((file) => 
      this.uploadFile({ file, path })
    );
    
    return Promise.all(uploadPromises);
  },
  
  /**
   * Lists files in a directory
   * @param path - Directory path to list
   * @returns Promise with array of file details
   */
  async listFiles(path = '') {
    try {
      const endpoint = path 
        ? `${FILE_API_BASE}/list/${path}`
        : `${FILE_API_BASE}/list`;
      
      return await apiRequest({
        method: 'GET',
        url: endpoint
      });
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },
  
  /**
   * Gets details for a specific file
   * @param filePath - Path to the file
   * @returns Promise with file details
   */
  async getFileDetails(filePath: string) {
    return apiRequest({
      method: 'GET',
      url: `${FILE_API_BASE}/file/${filePath}`
    });
  },
  
  /**
   * Gets a public URL for a file
   * @param filePath - Path to the file
   * @returns Promise with public URL
   */
  async getPublicUrl(filePath: string) {
    const endpoint = `${FILE_API_BASE}/public-url/${filePath}`;
    return apiRequest({
      method: 'GET',
      url: endpoint
    });
  },
  
  /**
   * Deletes a file from the server
   * @param filePath - Path to the file to delete
   * @returns Promise indicating success
   */
  async deleteFile(filePath: string) {
    return apiRequest({
      method: 'DELETE',
      url: `${FILE_API_BASE}/file/${filePath}`
    });
  },
  
  /**
   * Renames a file on the server
   * @param filePath - Current path to the file
   * @param newName - New name for the file
   * @returns Promise with updated file details
   */
  async renameFile(filePath: string, newName: string) {
    return apiRequest({
      method: 'PATCH',
      url: `${FILE_API_BASE}/file/${filePath}/rename`,
      data: { newName }
    });
  },
  
  /**
   * Moves a file to a new location
   * @param filePath - Current path to the file
   * @param newPath - New path for the file
   * @returns Promise with updated file details
   */
  async moveFile(filePath: string, newPath: string) {
    return apiRequest({
      method: 'PATCH',
      url: `${FILE_API_BASE}/file/${filePath}/move`,
      data: { newPath }
    });
  },
  
  /**
   * Updates metadata for a file
   * @param filePath - Path to the file
   * @param metadata - New metadata to apply
   * @returns Promise with updated file details
   */
  async updateFileMetadata(filePath: string, metadata: Record<string, any>) {
    return apiRequest({
      method: 'PATCH',
      url: `${FILE_API_BASE}/file/${filePath}/metadata`,
      data: { metadata }
    });
  }
};

export default fileManager; 