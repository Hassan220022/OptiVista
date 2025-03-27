import React, { useRef, useState } from 'react';
import { X, Upload, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadService, UploadedFile } from '../../services/uploadService';

interface FileUploadProps {
  onFileUploaded: (fileData: UploadedFile) => void;
  fileType: 'image' | 'model' | 'any';
  accept?: string;
  label?: string;
  className?: string;
  maxSizeMB?: number;
  folder?: string;
}

export function FileUpload({
  onFileUploaded,
  fileType = 'any',
  accept,
  label = 'Upload File',
  className = '',
  maxSizeMB = 10,
  folder
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Set the accept attribute based on fileType if not provided
  let acceptTypes = accept;
  if (!acceptTypes) {
    switch (fileType) {
      case 'image':
        acceptTypes = 'image/png,image/jpeg,image/gif,image/webp';
        break;
      case 'model':
        acceptTypes = '.glb,.gltf,.usdz,.obj';
        break;
      default:
        acceptTypes = '*';
    }
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };
  
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    // Validate file type based on fileType prop
    if (fileType === 'image') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(selectedFile.type)) {
        setError('Invalid image type. Supported types: JPG, PNG, GIF, WebP');
        return;
      }
    } else if (fileType === 'model') {
      const validExtensions = ['.glb', '.gltf', '.usdz', '.obj'];
      const hasValidExtension = validExtensions.some(ext => 
        selectedFile.name.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        setError('Invalid model type. Supported types: GLB, GLTF, USDZ, OBJ');
        return;
      }
    }
    
    setFile(selectedFile);
    setUploadSuccess(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      let uploadedFile: UploadedFile;
      
      switch (fileType) {
        case 'image':
          uploadedFile = await uploadService.uploadImage(file, folder || 'images');
          break;
        case 'model':
          uploadedFile = await uploadService.uploadModel(file, folder || 'models');
          break;
        default:
          uploadedFile = await uploadService.uploadFile(file, folder || 'uploads');
      }
      
      setUploadSuccess(true);
      onFileUploaded(uploadedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50'
              : uploadSuccess
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!file ? triggerFileInput : undefined}
        style={{ cursor: !file ? 'pointer' : 'default' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={acceptTypes}
        />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center mb-1">
              Drag and drop a file here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Maximum file size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileIcon className="w-8 h-8 text-blue-500" />
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Uploaded successfully
                </div>
              )}
              
              {!uploadSuccess && !uploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadFile();
                  }}
                  className="mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload
                </button>
              )}
              
              {uploading && (
                <div className="mt-2 flex items-center">
                  <div className="w-4 h-4 mr-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 