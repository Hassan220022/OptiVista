const { pool } = require('../config/db.config');
const { s3Client, minioConfig } = require('../config/minio.config');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all products with optional filtering
 */
exports.getAllProducts = async (req, res) => {
  try {
    let query = 'SELECT p.*, pc.name as categoryName FROM products p LEFT JOIN product_categories pc ON p.categoryId = pc.id';
    const queryParams = [];
    const filters = [];

    // Apply category filter if provided
    if (req.query.categoryId) {
      filters.push('p.categoryId = ?');
      queryParams.push(req.query.categoryId);
    }

    // Apply brand filter if provided
    if (req.query.brand) {
      filters.push('p.brand = ?');
      queryParams.push(req.query.brand);
    }

    // Apply price filter if provided
    if (req.query.minPrice) {
      filters.push('p.price >= ?');
      queryParams.push(parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      filters.push('p.price <= ?');
      queryParams.push(parseFloat(req.query.maxPrice));
    }

    // Apply frameShape filter if provided
    if (req.query.frameShape) {
      filters.push('p.frameShape = ?');
      queryParams.push(req.query.frameShape);
    }

    // Apply frameColor filter if provided
    if (req.query.frameColor) {
      filters.push('p.frameColor = ?');
      queryParams.push(req.query.frameColor);
    }

    // Apply gender filter if provided
    if (req.query.gender) {
      filters.push('p.gender = ?');
      queryParams.push(req.query.gender);
    }

    // Apply stock status filter if provided
    if (req.query.status) {
      filters.push('p.status = ?');
      queryParams.push(req.query.status);
    }

    // Add WHERE clause if filters exist
    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    // Apply sorting
    const sortBy = req.query.sortBy || 'p.createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Execute query
    const [products] = await pool.query(query, queryParams);
    
    // Get images for each product
    const productsWithImages = await Promise.all(products.map(async (product) => {
      const [images] = await pool.query(
        'SELECT * FROM product_images WHERE productId = ? ORDER BY isPrimary DESC, sortOrder ASC',
        [product.id]
      );
      
      const [arModels] = await pool.query(
        'SELECT * FROM ar_models WHERE productId = ?',
        [product.id]
      );
      
      return {
        ...product,
        images: images || [],
        arModels: arModels || []
      };
    }));

    // Get total count for pagination
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM products p');
    const total = countResult[0].total;

    res.status(200).json({
      products: productsWithImages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

/**
 * Get a single product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, pc.name as categoryName 
       FROM products p 
       LEFT JOIN product_categories pc ON p.categoryId = pc.id 
       WHERE p.id = ?`, 
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    
    // Get images for the product
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE productId = ? ORDER BY isPrimary DESC, sortOrder ASC',
      [product.id]
    );
    
    // Get AR models for the product
    const [arModels] = await pool.query(
      'SELECT * FROM ar_models WHERE productId = ?',
      [product.id]
    );
    
    // Get feedback for the product
    const [feedback] = await pool.query(
      `SELECT f.*, u.firstName, u.lastName 
       FROM feedback f 
       JOIN users u ON f.userId = u.id 
       WHERE f.productId = ? 
       ORDER BY f.createdAt DESC`,
      [product.id]
    );
    
    res.status(200).json({
      product: {
        ...product,
        images: images || [],
        arModels: arModels || [],
        feedback: feedback || []
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

/**
 * Create a new product
 */
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, description, price, discount, categoryId, brand, model,
      material, frameShape, frameColor, lensColor, gender, size, weight, stock, status
    } = req.body;
    
    // Check required fields
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Name, price, and categoryId are required' });
    }
    
    // Insert product with UUID
    const productId = uuidv4();
    const sellerId = req.userId; // Assuming user ID is set in auth middleware
    
    // Insert product into database
    await pool.query(
      `INSERT INTO products 
       (id, name, description, price, discount, categoryId, sellerId, brand, model,
        material, frameShape, frameColor, lensColor, gender, size, weight, stock, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, description, price, discount || 0, categoryId, sellerId, brand, model,
       material, frameShape, frameColor, lensColor, gender, size, weight, stock || 0, status || 'active']
    );
    
    // Handle product images if provided
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFileName = `products/images/${uuidv4()}${path.extname(image.name)}`;
        
        // Upload to MinIO
        await s3Client.send(new PutObjectCommand({
          Bucket: minioConfig.bucketName,
          Key: imageFileName,
          Body: fs.createReadStream(image.tempFilePath),
          ContentType: image.mimetype
        }));
        
        const imageUrl = `${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${imageFileName}`;
        const imageId = uuidv4();
        const isPrimary = i === 0; // First image is primary
        
        // Insert image record
        await pool.query(
          `INSERT INTO product_images (id, productId, imageUrl, isPrimary, sortOrder) 
           VALUES (?, ?, ?, ?, ?)`,
          [imageId, productId, imageUrl, isPrimary, i]
        );
      }
    }
    
    // Handle AR model if provided
    if (req.files && req.files.arModel) {
      const arModel = req.files.arModel;
      const modelFileName = `products/models/${uuidv4()}${path.extname(arModel.name)}`;
      
      // Upload to MinIO
      await s3Client.send(new PutObjectCommand({
        Bucket: minioConfig.bucketName,
        Key: modelFileName,
        Body: fs.createReadStream(arModel.tempFilePath),
        ContentType: arModel.mimetype
      }));
      
      const modelUrl = `${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${modelFileName}`;
      const modelId = uuidv4();
      
      // Insert AR model record
      await pool.query(
        `INSERT INTO ar_models (id, productId, modelUrl, fileFormat, fileSize) 
         VALUES (?, ?, ?, ?, ?)`,
        [modelId, productId, modelUrl, path.extname(arModel.name).substring(1), arModel.size]
      );
    }
    
    res.status(201).json({
      message: 'Product created successfully',
      productId
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

/**
 * Update an existing product
 */
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { 
      name, description, price, discount, categoryId, brand, model,
      material, frameShape, frameColor, lensColor, gender, size, weight, stock, status
    } = req.body;
    
    // Check if product exists
    const [existingProducts] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const existingProduct = existingProducts[0];
    
    // Update product in database
    await pool.query(
      `UPDATE products SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        discount = COALESCE(?, discount),
        categoryId = COALESCE(?, categoryId),
        brand = COALESCE(?, brand),
        model = COALESCE(?, model),
        material = COALESCE(?, material),
        frameShape = COALESCE(?, frameShape),
        frameColor = COALESCE(?, frameColor),
        lensColor = COALESCE(?, lensColor),
        gender = COALESCE(?, gender),
        size = COALESCE(?, size),
        weight = COALESCE(?, weight),
        stock = COALESCE(?, stock),
        status = COALESCE(?, status),
        updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name, description, price, discount, categoryId, brand, model,
        material, frameShape, frameColor, lensColor, gender, size, weight, 
        stock, status, productId
      ]
    );
    
    // Handle product images if provided
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      // If replaceImages is true, delete existing images
      if (req.body.replaceImages === 'true') {
        // Get existing images
        const [existingImages] = await pool.query(
          'SELECT * FROM product_images WHERE productId = ?',
          [productId]
        );
        
        // Delete existing images from MinIO
        for (const image of existingImages) {
          const imageKey = image.imageUrl.split('/').pop();
          await s3Client.send(new DeleteObjectCommand({
            Bucket: minioConfig.bucketName,
            Key: `products/images/${imageKey}`
          }));
        }
        
        // Delete image records
        await pool.query('DELETE FROM product_images WHERE productId = ?', [productId]);
      }
      
      // Upload new images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFileName = `products/images/${uuidv4()}${path.extname(image.name)}`;
        
        // Upload to MinIO
        await s3Client.send(new PutObjectCommand({
          Bucket: minioConfig.bucketName,
          Key: imageFileName,
          Body: fs.createReadStream(image.tempFilePath),
          ContentType: image.mimetype
        }));
        
        const imageUrl = `${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${imageFileName}`;
        const imageId = uuidv4();
        const isPrimary = i === 0 && req.body.replaceImages === 'true'; // First image is primary if replacing all
        
        // Insert image record
        await pool.query(
          `INSERT INTO product_images (id, productId, imageUrl, isPrimary, sortOrder) 
           VALUES (?, ?, ?, ?, ?)`,
          [imageId, productId, imageUrl, isPrimary, i]
        );
      }
    }
    
    // Handle AR model if provided
    if (req.files && req.files.arModel) {
      // Delete existing AR model if exists
      const [existingModels] = await pool.query(
        'SELECT * FROM ar_models WHERE productId = ?',
        [productId]
      );
      
      // Delete existing model from MinIO
      for (const model of existingModels) {
        const modelKey = model.modelUrl.split('/').pop();
        await s3Client.send(new DeleteObjectCommand({
          Bucket: minioConfig.bucketName,
          Key: `products/models/${modelKey}`
        }));
      }
      
      // Delete model records
      await pool.query('DELETE FROM ar_models WHERE productId = ?', [productId]);
      
      // Upload new AR model
      const arModel = req.files.arModel;
      const modelFileName = `products/models/${uuidv4()}${path.extname(arModel.name)}`;
      
      // Upload to MinIO
      await s3Client.send(new PutObjectCommand({
        Bucket: minioConfig.bucketName,
        Key: modelFileName,
        Body: fs.createReadStream(arModel.tempFilePath),
        ContentType: arModel.mimetype
      }));
      
      const modelUrl = `${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${modelFileName}`;
      const modelId = uuidv4();
      
      // Insert AR model record
      await pool.query(
        `INSERT INTO ar_models (id, productId, modelUrl, fileFormat, fileSize) 
         VALUES (?, ?, ?, ?, ?)`,
        [modelId, productId, modelUrl, path.extname(arModel.name).substring(1), arModel.size]
      );
    }
    
    res.status(200).json({
      message: 'Product updated successfully',
      productId
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

/**
 * Delete a product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [existingProducts] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get product images
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE productId = ?',
      [productId]
    );
    
    // Delete images from MinIO
    for (const image of images) {
      const imageKey = image.imageUrl.split('/').pop();
      await s3Client.send(new DeleteObjectCommand({
        Bucket: minioConfig.bucketName,
        Key: `products/images/${imageKey}`
      }));
    }
    
    // Get AR models
    const [models] = await pool.query(
      'SELECT * FROM ar_models WHERE productId = ?',
      [productId]
    );
    
    // Delete models from MinIO
    for (const model of models) {
      const modelKey = model.modelUrl.split('/').pop();
      await s3Client.send(new DeleteObjectCommand({
        Bucket: minioConfig.bucketName,
        Key: `products/models/${modelKey}`
      }));
    }
    
    // Delete product and related records from database
    // Note: Using ON DELETE CASCADE in the database schema allows us to just delete the product
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
}; 