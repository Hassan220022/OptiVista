const { s3Client, minioConfig } = require('../config/minio.config');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload a single file to MinIO
 */
exports.uploadFile = async (req, res) => {
  try {
    // Check if file was provided
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const file = req.files.file;
    const folder = req.body.folder || 'uploads';
    const fileName = `${folder}/${uuidv4()}${path.extname(file.name)}`;

    // Upload to MinIO
    await s3Client.send(new PutObjectCommand({
      Bucket: minioConfig.bucketName,
      Key: fileName,
      Body: fs.createReadStream(file.tempFilePath),
      ContentType: file.mimetype
    }));

    // Generate the file URL
    const fileUrl = `${minioConfig.useSSL ? 'https' : 'http'}://${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${fileName}`;

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        type: file.mimetype,
        size: file.size,
        url: fileUrl,
        key: fileName
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

/**
 * Upload multiple files to MinIO
 */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    // Check if files were provided
    if (!req.files || !req.files.files) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const folder = req.body.folder || 'uploads';
    const uploadedFiles = [];

    // Upload each file
    for (const file of files) {
      const fileName = `${folder}/${uuidv4()}${path.extname(file.name)}`;

      // Upload to MinIO
      await s3Client.send(new PutObjectCommand({
        Bucket: minioConfig.bucketName,
        Key: fileName,
        Body: fs.createReadStream(file.tempFilePath),
        ContentType: file.mimetype
      }));

      // Generate the file URL
      const fileUrl = `${minioConfig.useSSL ? 'https' : 'http'}://${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${fileName}`;

      uploadedFiles.push({
        name: file.name,
        type: file.mimetype,
        size: file.size,
        url: fileUrl,
        key: fileName
      });
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple files upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};

/**
 * Get a file from MinIO
 */
exports.getFile = async (req, res) => {
  try {
    const path = req.params.path;

    // Generate a signed URL for the file
    const command = new GetObjectCommand({
      Bucket: minioConfig.bucketName,
      Key: path
    });

    // Create a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.status(200).json({
      url: signedUrl
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Error getting file', error: error.message });
  }
};

/**
 * Delete a file from MinIO
 */
exports.deleteFile = async (req, res) => {
  try {
    const path = req.params.path;

    // Delete from MinIO
    await s3Client.send(new DeleteObjectCommand({
      Bucket: minioConfig.bucketName,
      Key: path
    }));

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};

/**
 * List files in a folder
 */
exports.listFiles = async (req, res) => {
  try {
    const folder = req.params.folder || '';
    
    // List objects
    const result = await s3Client.send(new ListObjectsV2Command({
      Bucket: minioConfig.bucketName,
      Prefix: folder,
      MaxKeys: 1000
    }));

    const files = result.Contents ? result.Contents.map(item => {
      return {
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url: `${minioConfig.useSSL ? 'https' : 'http'}://${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${item.Key}`
      };
    }) : [];

    res.status(200).json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
}; 