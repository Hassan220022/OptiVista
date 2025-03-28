import { apiRequest, API_BASE_URL } from './api';
import Product from '../types/product';
import fileManager from './fileManager';

// Base URL for the products API
const PRODUCTS_API_BASE = `${API_BASE_URL}/products`;

// Product service with methods for product operations
export const productService = {
  /**
   * Gets all products with optional filtering
   * @param filters - Optional filters for products
   * @returns Promise with array of products
   */
  async getAllProducts(filters = {}) {
    try {
      // Build query string from filters
      const queryParams = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      const url = queryParams 
        ? `${PRODUCTS_API_BASE}?${queryParams}`
        : PRODUCTS_API_BASE;
      
      return await apiRequest({
        method: 'GET',
        url
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * Gets a product by its ID
   * @param id - The product ID
   * @returns Promise with product details
   */
  async getProductById(id: string) {
    try {
      return await apiRequest({
        method: 'GET',
        url: `${PRODUCTS_API_BASE}/${id}`
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Handles file uploads for products (images, models)
   * @param file - The file to upload
   * @param type - The type of file ('image' or 'model')
   * @returns Promise with uploaded file details
   */
  async uploadProductFile(file: File, type: 'image' | 'model') {
    try {
      // Validate file type
      const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const modelTypes = ['.glb', '.gltf', '.usdz', '.obj'];
      const allowedTypes = type === 'image' ? imageTypes : modelTypes;
      
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedTypes.includes(fileExt)) {
        throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
      }
      
      // Upload to appropriate path
      const path = type === 'image' ? 'products/images' : 'products/models';
      const result = await fileManager.uploadFile({
        file,
        path,
        metadata: { type }
      });
      
      return result;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  },
  
  /**
   * Creates a new product
   * @param productData - The product data
   * @returns Promise with created product
   */
  async createProduct(productData: Partial<Product>) {
    try {
      // Validate required fields
      if (!productData.name || !productData.price) {
        throw new Error('Product name and price are required');
      }
      
      // Transform data if needed
      const processedData = {
        ...productData,
        price: typeof productData.price === 'string' 
          ? parseFloat(productData.price) 
          : productData.price,
        stock: typeof productData.stock === 'string' 
          ? parseInt(productData.stock, 10) 
          : productData.stock,
      };
      
      // Create the product
      const createdProduct = await apiRequest({
        method: 'POST',
        url: PRODUCTS_API_BASE,
        data: processedData
      });
      
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  /**
   * Updates an existing product
   * @param id - The product ID
   * @param updates - The product updates
   * @returns Promise with updated product
   */
  async updateProduct(id: string, updates: Partial<Product>) {
    try {
      // Validate ID
      if (!id) {
        throw new Error('Product ID is required for update');
      }
      
      // Transform data if needed
      const updatedData = {
        ...updates,
        price: typeof updates.price === 'string' 
          ? parseFloat(updates.price) 
          : updates.price,
        stock: typeof updates.stock === 'string' 
          ? parseInt(updates.stock, 10) 
          : updates.stock,
      };
      
      // Update the product
      const updatedProduct = await apiRequest({
        method: 'PUT',
        url: `${PRODUCTS_API_BASE}/${id}`,
        data: updatedData
      });
      
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Deletes a product
   * @param id - The product ID
   * @returns Promise with success status
   */
  async deleteProduct(id: string) {
    try {
      const result = await apiRequest({
        method: 'DELETE',
        url: `${PRODUCTS_API_BASE}/${id}`
      });
      
      return result;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Gets products by seller ID
   * @param sellerId - The seller ID
   * @returns Promise with array of products
   */
  async getProductsBySeller(sellerId: string) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${PRODUCTS_API_BASE}?sellerId=${sellerId}`
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      throw error;
    }
  },
  
  /**
   * Gets products by seller ID (alias for getProductsBySeller)
   * @param sellerId - The seller ID
   * @returns Promise with array of products
   */
  async getProductsBySellerId(sellerId: string) {
    return this.getProductsBySeller(sellerId);
  },
  
  /**
   * Searches products by term
   * @param searchTerm - The search term
   * @returns Promise with array of matching products
   */
  async searchProducts(searchTerm: string) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${PRODUCTS_API_BASE}/search?q=${encodeURIComponent(searchTerm)}`
      });
      
      return response;
    } catch (error) {
      console.error(`Error searching products for term ${searchTerm}:`, error);
      throw error;
    }
  },
  
  /**
   * Gets featured products
   * @param limit - Maximum number of products to return
   * @returns Promise with array of featured products
   */
  async getFeaturedProducts(limit = 10) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${PRODUCTS_API_BASE}/featured?limit=${limit}`
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
  
  /**
   * Updates product inventory
   * @param id - The product ID
   * @param stockChange - The stock quantity change
   * @returns Promise with updated product
   */
  async updateInventory(id: string, stockChange: number) {
    try {
      const response = await apiRequest({
        method: 'PATCH',
        url: `${PRODUCTS_API_BASE}/${id}/inventory`,
        data: { stockChange }
      });
      
      return response;
    } catch (error) {
      console.error(`Error updating inventory for product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Gets a file URL
   * @param fileKey - The file key
   * @returns Promise with file URL
   */
  async getFileUrl(fileKey: string) {
    try {
      if (!fileKey) return '';
      
      const result = await fileManager.getPublicUrl(fileKey);
      return result;
    } catch (error) {
      console.error(`Error getting file URL for ${fileKey}:`, error);
      return '';
    }
  }
};

export default productService;
