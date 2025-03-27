// Product Service
// Provides functionality to manage eyewear products with database integration
// and AR model handling using the FileManager API

import { apiRequest } from './api';
import fileManagerApi, { FileMetadata } from './fileManager';

const PRODUCTS_API_BASE = '/products';

// Type definitions for product data
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  style: string;
  color: string;
  size: string;
  gender: 'male' | 'female' | 'unisex';
  material: string;
  weight: number;
  inStock: boolean;
  stockQuantity: number;
  discount?: number;
  rating?: number;
  imageKey: string;
  imageUrl?: string;
  modelKey?: string; // 3D model key for AR visualization
  modelUrl?: string;
  sellerId: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface ProductFilter {
  category?: string;
  style?: string;
  color?: string;
  gender?: 'male' | 'female' | 'unisex';
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ProductUpload {
  product: Omit<Product, 'id' | 'imageUrl' | 'modelUrl' | 'dateAdded' | 'lastUpdated'>;
  image: File;
  model?: File; // 3D model for AR visualization is optional
}

// Product Service API
export const productService = {
  // Get all products with optional filtering and pagination
  getAllProducts: async (
    filters?: ProductFilter,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ProductsResponse> => {
    let queryParams = `?page=${page}&pageSize=${pageSize}`;
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams += `&${key}=${encodeURIComponent(String(value))}`;
        }
      });
    }
    
    const response = await apiRequest(`${PRODUCTS_API_BASE}${queryParams}`);
    
    // Process products to include presigned URLs for images and models
    const productsWithUrls = await productService.enhanceProductsWithUrls(response.products);
    
    return {
      ...response,
      products: productsWithUrls
    };
  },
  
  // Get a single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const product = await apiRequest(`${PRODUCTS_API_BASE}/${id}`);
    
    // Enhance product with presigned URLs for image and 3D model
    return await productService.enhanceProductWithUrls(product);
  },
  
  // Create a new product including image and optional 3D model uploads
  createProduct: async (productUpload: ProductUpload): Promise<Product> => {
    try {
      // 1. Upload product image
      const imageUploadResult = await fileManagerApi.uploadImage(
        productUpload.image, 
        'products/images'
      );
      
      // 2. Upload 3D model if provided
      let modelUploadResult = null;
      if (productUpload.model) {
        modelUploadResult = await fileManagerApi.uploadModel(
          productUpload.model,
          'products/models'
        );
      }
      
      // 3. Create product data with file keys
      const productData = {
        ...productUpload.product,
        imageKey: imageUploadResult.file.key,
        ...(modelUploadResult && { modelKey: modelUploadResult.file.key }),
      };
      
      // 4. Save product to database via API
      const createdProduct = await apiRequest(PRODUCTS_API_BASE, 'POST', productData);
      
      // 5. Return product with URLs included
      return await productService.enhanceProductWithUrls(createdProduct);
      
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },
  
  // Update an existing product
  updateProduct: async (
    id: string, 
    productData: Partial<Product>, 
    newImage?: File,
    newModel?: File
  ): Promise<Product> => {
    try {
      const updatedData: any = { ...productData };
      
      // 1. Upload new image if provided
      if (newImage) {
        const imageUploadResult = await fileManagerApi.uploadImage(
          newImage, 
          'products/images'
        );
        updatedData.imageKey = imageUploadResult.file.key;
      }
      
      // 2. Upload new 3D model if provided
      if (newModel) {
        const modelUploadResult = await fileManagerApi.uploadModel(
          newModel,
          'products/models'
        );
        updatedData.modelKey = modelUploadResult.file.key;
      }
      
      // 3. Update product in database
      const updatedProduct = await apiRequest(`${PRODUCTS_API_BASE}/${id}`, 'PUT', updatedData);
      
      // 4. Return product with URLs included
      return await productService.enhanceProductWithUrls(updatedProduct);
      
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (id: string): Promise<{ message: string }> => {
    try {
      // 1. Get product to obtain file keys
      const product = await productService.getProductById(id);
      
      // 2. Delete product from database
      const result = await apiRequest(`${PRODUCTS_API_BASE}/${id}`, 'DELETE');
      
      // 3. Delete associated files
      if (product.imageKey) {
        await fileManagerApi.deleteFile(product.imageKey);
      }
      
      if (product.modelKey) {
        await fileManagerApi.deleteFile(product.modelKey);
      }
      
      return result;
      
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  },
  
  // Get products by seller ID
  getProductsBySellerId: async (sellerId: string): Promise<Product[]> => {
    const response = await apiRequest(`${PRODUCTS_API_BASE}?sellerId=${sellerId}`);
    return await productService.enhanceProductsWithUrls(response.products);
  },
  
  // Search products
  searchProducts: async (searchTerm: string): Promise<Product[]> => {
    const response = await apiRequest(`${PRODUCTS_API_BASE}/search?q=${encodeURIComponent(searchTerm)}`);
    return await productService.enhanceProductsWithUrls(response.products);
  },
  
  // Get featured products for homepage
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiRequest(`${PRODUCTS_API_BASE}/featured?limit=${limit}`);
    return await productService.enhanceProductsWithUrls(response.products);
  },
  
  // Utility function to enhance a product with file URLs
  enhanceProductWithUrls: async (product: Product): Promise<Product> => {
    try {
      const enhancedProduct = { ...product };
      
      // Get image URL
      if (product.imageKey) {
        enhancedProduct.imageUrl = await fileManagerApi.getCachedFileUrl(product.imageKey);
      }
      
      // Get 3D model URL if exists
      if (product.modelKey) {
        enhancedProduct.modelUrl = await fileManagerApi.getCachedFileUrl(product.modelKey);
      }
      
      return enhancedProduct;
    } catch (error) {
      console.error('Error enhancing product with URLs:', error);
      // Return original product if URL enhancement fails
      return product;
    }
  },
  
  // Utility function to enhance multiple products with file URLs
  enhanceProductsWithUrls: async (products: Product[]): Promise<Product[]> => {
    return Promise.all(products.map(product => productService.enhanceProductWithUrls(product)));
  }
};

export default productService; 