// Appwrite Service for OptiVista AR Eyewear Application
// This service sets up and interacts with Appwrite databases for product data

// Constants
const APPWRITE_DATABASE_ID = 'optivista-database';
const PRODUCTS_COLLECTION_ID = 'products';
const PRODUCT_VARIANTS_COLLECTION_ID = 'product-variants';
const PRODUCT_REVIEWS_COLLECTION_ID = 'product-reviews';

// Types for Appwrite database entities
export interface AppwriteProduct {
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
  modelKey?: string;
  sellerId: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface AppwriteProductVariant {
  id: string;
  productId: string;
  name: string;
  color: string;
  price?: number;
  imageKey?: string;
  modelKey?: string;
  stockQuantity: number;
}

export interface AppwriteProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  dateAdded: string;
  arExperienceRating?: number;
  arExperienceComment?: string;
}

/**
 * Creates the initial Appwrite database structure for the OptiVista application
 * This should be run once during application setup
 */
export const setupAppwriteDatabase = async () => {
  try {
    console.log('Setting up Appwrite database structure...');
    
    // 1. Create the main database
    await window.mcp_Appwrite_databases_create({
      database_id: APPWRITE_DATABASE_ID,
      name: 'OptiVista AR Eyewear Database'
    });
    
    // 2. Create Products Collection
    await window.mcp_Appwrite_databases_create_collection({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      name: 'Products'
    });
    
    // Add attributes to Products collection
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'name',
      size: 255,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'description',
      size: 5000,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_float_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'price',
      required: true,
      min: 0
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'category',
      size: 100,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'style',
      size: 100,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'color',
      size: 50,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'size',
      size: 50,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_enum_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'gender',
      elements: ['male', 'female', 'unisex'],
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'material',
      size: 100,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_float_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'weight',
      required: true,
      min: 0
    });
    
    await window.mcp_Appwrite_databases_create_boolean_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'inStock',
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_integer_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'stockQuantity',
      required: true,
      min: 0
    });
    
    await window.mcp_Appwrite_databases_create_float_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'discount',
      required: false,
      min: 0,
      max: 1
    });
    
    await window.mcp_Appwrite_databases_create_float_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'rating',
      required: false,
      min: 0,
      max: 5
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'imageKey',
      size: 255,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'modelKey',
      size: 255,
      required: false
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'sellerId',
      size: 36,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_datetime_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'dateAdded',
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_datetime_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'lastUpdated',
      required: true
    });
    
    // 3. Create Product Variants Collection
    await window.mcp_Appwrite_databases_create_collection({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      name: 'Product Variants'
    });
    
    // Add attributes to Product Variants collection
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'productId',
      size: 36,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'name',
      size: 255,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'color',
      size: 50,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_float_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'price',
      required: false,
      min: 0
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'imageKey',
      size: 255,
      required: false
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'modelKey',
      size: 255,
      required: false
    });
    
    await window.mcp_Appwrite_databases_create_integer_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'stockQuantity',
      required: true,
      min: 0
    });
    
    // 4. Create Product Reviews Collection
    await window.mcp_Appwrite_databases_create_collection({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      name: 'Product Reviews'
    });
    
    // Add attributes to Product Reviews collection
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'productId',
      size: 36,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'userId',
      size: 36,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'userName',
      size: 255,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_integer_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'rating',
      required: true,
      min: 1,
      max: 5
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'comment',
      size: 1000,
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_datetime_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'dateAdded',
      required: true
    });
    
    await window.mcp_Appwrite_databases_create_integer_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'arExperienceRating',
      required: false,
      min: 1,
      max: 5
    });
    
    await window.mcp_Appwrite_databases_create_string_attribute({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'arExperienceComment',
      size: 1000,
      required: false
    });
    
    // 5. Create indexes for efficient querying
    
    // Product search index
    await window.mcp_Appwrite_databases_create_index({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'name_search_idx',
      type: 'fulltext',
      attributes: ['name', 'description']
    });
    
    // Product category index
    await window.mcp_Appwrite_databases_create_index({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'category_idx',
      type: 'key',
      attributes: ['category']
    });
    
    // Product seller index
    await window.mcp_Appwrite_databases_create_index({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCTS_COLLECTION_ID,
      key: 'seller_idx',
      type: 'key',
      attributes: ['sellerId']
    });
    
    // Product variant index
    await window.mcp_Appwrite_databases_create_index({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
      key: 'product_id_idx',
      type: 'key',
      attributes: ['productId']
    });
    
    // Product review index
    await window.mcp_Appwrite_databases_create_index({
      database_id: APPWRITE_DATABASE_ID,
      collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
      key: 'product_id_idx',
      type: 'key',
      attributes: ['productId']
    });
    
    console.log('Appwrite database setup complete!');
    return true;
  } catch (error) {
    console.error('Failed to set up Appwrite database:', error);
    throw error;
  }
};

/**
 * Appwrite Product Service
 * Handles interactions with the Appwrite database for product data
 */
export const appwriteProductService = {
  // Create a new product
  createProduct: async (productData: Omit<AppwriteProduct, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<AppwriteProduct> => {
    try {
      // Generate a product ID
      const productId = crypto.randomUUID();
      
      // Prepare the product document with timestamps
      const now = new Date().toISOString();
      const productDocument = {
        ...productData,
        dateAdded: now,
        lastUpdated: now
      };
      
      // Create the product document in Appwrite
      const result = await window.mcp_Appwrite_databases_create_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        document_id: productId,
        data: productDocument
      });
      
      return result as unknown as AppwriteProduct;
    } catch (error) {
      console.error('Failed to create product in Appwrite:', error);
      throw error;
    }
  },
  
  // Get a product by ID
  getProductById: async (productId: string): Promise<AppwriteProduct> => {
    try {
      const result = await window.mcp_Appwrite_databases_get_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        document_id: productId
      });
      
      return result as unknown as AppwriteProduct;
    } catch (error) {
      console.error(`Failed to get product ${productId} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Update a product
  updateProduct: async (
    productId: string, 
    productData: Partial<Omit<AppwriteProduct, 'id' | 'dateAdded' | 'lastUpdated'>>
  ): Promise<AppwriteProduct> => {
    try {
      // Add the last updated timestamp
      const updateData = {
        ...productData,
        lastUpdated: new Date().toISOString()
      };
      
      // Update the product document in Appwrite
      const result = await window.mcp_Appwrite_databases_update_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        document_id: productId,
        data: updateData
      });
      
      return result as unknown as AppwriteProduct;
    } catch (error) {
      console.error(`Failed to update product ${productId} in Appwrite:`, error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (productId: string): Promise<void> => {
    try {
      await window.mcp_Appwrite_databases_delete_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        document_id: productId
      });
      
      // Also delete related variants and reviews
      const variants = await appwriteProductService.getProductVariants(productId);
      for (const variant of variants) {
        await appwriteProductService.deleteProductVariant(variant.id);
      }
      
      const reviews = await appwriteProductService.getProductReviews(productId);
      for (const review of reviews) {
        await appwriteProductService.deleteProductReview(review.id);
      }
    } catch (error) {
      console.error(`Failed to delete product ${productId} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Get all products with optional filters
  getAllProducts: async (
    filters?: any,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ products: AppwriteProduct[], totalCount: number }> => {
    try {
      // Build query parameters based on filters
      const queries = [];
      
      // Add pagination queries
      const offset = (page - 1) * pageSize;
      queries.push(`limit(${pageSize})`);
      queries.push(`offset(${offset})`);
      
      // Add filter queries if provided
      if (filters) {
        if (filters.category) {
          queries.push(`equal("category", "${filters.category}")`);
        }
        
        if (filters.style) {
          queries.push(`equal("style", "${filters.style}")`);
        }
        
        if (filters.gender) {
          queries.push(`equal("gender", "${filters.gender}")`);
        }
        
        if (filters.minPrice !== undefined) {
          queries.push(`greaterThanEqual("price", ${filters.minPrice})`);
        }
        
        if (filters.maxPrice !== undefined) {
          queries.push(`lessThanEqual("price", ${filters.maxPrice})`);
        }
        
        if (filters.inStock !== undefined) {
          queries.push(`equal("inStock", ${filters.inStock})`);
        }
      }
      
      // Get products from Appwrite with queries
      const result = await window.mcp_Appwrite_databases_list_documents({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        queries: queries
      });
      
      return {
        products: result.documents as unknown as AppwriteProduct[],
        totalCount: result.total
      };
    } catch (error) {
      console.error('Failed to get products from Appwrite:', error);
      throw error;
    }
  },
  
  // Search products by keyword
  searchProducts: async (searchTerm: string): Promise<AppwriteProduct[]> => {
    try {
      // Use the full-text search index to search for products
      const result = await window.mcp_Appwrite_databases_list_documents({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        queries: [`search("name_search_idx", "${searchTerm}")`]
      });
      
      return result.documents as unknown as AppwriteProduct[];
    } catch (error) {
      console.error(`Failed to search products with term "${searchTerm}":`, error);
      throw error;
    }
  },
  
  // Get products by seller ID
  getProductsBySellerId: async (sellerId: string): Promise<AppwriteProduct[]> => {
    try {
      const result = await window.mcp_Appwrite_databases_list_documents({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCTS_COLLECTION_ID,
        queries: [`equal("sellerId", "${sellerId}")`]
      });
      
      return result.documents as unknown as AppwriteProduct[];
    } catch (error) {
      console.error(`Failed to get products for seller ${sellerId}:`, error);
      throw error;
    }
  },
  
  // Product Variants API
  
  // Create a product variant
  createProductVariant: async (variantData: Omit<AppwriteProductVariant, 'id'>): Promise<AppwriteProductVariant> => {
    try {
      // Generate a variant ID
      const variantId = crypto.randomUUID();
      
      // Create the variant document in Appwrite
      const result = await window.mcp_Appwrite_databases_create_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
        document_id: variantId,
        data: variantData
      });
      
      return result as unknown as AppwriteProductVariant;
    } catch (error) {
      console.error('Failed to create product variant in Appwrite:', error);
      throw error;
    }
  },
  
  // Get product variants by product ID
  getProductVariants: async (productId: string): Promise<AppwriteProductVariant[]> => {
    try {
      const result = await window.mcp_Appwrite_databases_list_documents({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
        queries: [`equal("productId", "${productId}")`]
      });
      
      return result.documents as unknown as AppwriteProductVariant[];
    } catch (error) {
      console.error(`Failed to get variants for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Update a product variant
  updateProductVariant: async (
    variantId: string, 
    variantData: Partial<Omit<AppwriteProductVariant, 'id'>>
  ): Promise<AppwriteProductVariant> => {
    try {
      // Update the variant document in Appwrite
      const result = await window.mcp_Appwrite_databases_update_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
        document_id: variantId,
        data: variantData
      });
      
      return result as unknown as AppwriteProductVariant;
    } catch (error) {
      console.error(`Failed to update variant ${variantId} in Appwrite:`, error);
      throw error;
    }
  },
  
  // Delete a product variant
  deleteProductVariant: async (variantId: string): Promise<void> => {
    try {
      await window.mcp_Appwrite_databases_delete_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_VARIANTS_COLLECTION_ID,
        document_id: variantId
      });
    } catch (error) {
      console.error(`Failed to delete variant ${variantId} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Product Reviews API
  
  // Create a product review
  createProductReview: async (reviewData: Omit<AppwriteProductReview, 'id' | 'dateAdded'>): Promise<AppwriteProductReview> => {
    try {
      // Generate a review ID
      const reviewId = crypto.randomUUID();
      
      // Prepare the review document with timestamp
      const reviewDocument = {
        ...reviewData,
        dateAdded: new Date().toISOString()
      };
      
      // Create the review document in Appwrite
      const result = await window.mcp_Appwrite_databases_create_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
        document_id: reviewId,
        data: reviewDocument
      });
      
      // After creating the review, update the product's average rating
      await appwriteProductService.updateProductRating(reviewData.productId);
      
      return result as unknown as AppwriteProductReview;
    } catch (error) {
      console.error('Failed to create product review in Appwrite:', error);
      throw error;
    }
  },
  
  // Get product reviews by product ID
  getProductReviews: async (productId: string): Promise<AppwriteProductReview[]> => {
    try {
      const result = await window.mcp_Appwrite_databases_list_documents({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
        queries: [
          `equal("productId", "${productId}")`,
          `orderDesc("dateAdded")`
        ]
      });
      
      return result.documents as unknown as AppwriteProductReview[];
    } catch (error) {
      console.error(`Failed to get reviews for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Delete a product review
  deleteProductReview: async (reviewId: string): Promise<void> => {
    try {
      // Get the review to get the productId
      const review = await window.mcp_Appwrite_databases_get_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
        document_id: reviewId
      }) as unknown as AppwriteProductReview;
      
      // Delete the review
      await window.mcp_Appwrite_databases_delete_document({
        database_id: APPWRITE_DATABASE_ID,
        collection_id: PRODUCT_REVIEWS_COLLECTION_ID,
        document_id: reviewId
      });
      
      // Update the product's average rating
      await appwriteProductService.updateProductRating(review.productId);
    } catch (error) {
      console.error(`Failed to delete review ${reviewId} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Utility method to update a product's average rating
  updateProductRating: async (productId: string): Promise<void> => {
    try {
      // Get all reviews for the product
      const reviews = await appwriteProductService.getProductReviews(productId);
      
      // Calculate the average rating
      if (reviews.length === 0) {
        // No reviews, reset rating to null
        await appwriteProductService.updateProduct(productId, { rating: null });
      } else {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        // Update the product's rating
        await appwriteProductService.updateProduct(productId, { rating: averageRating });
      }
    } catch (error) {
      console.error(`Failed to update rating for product ${productId}:`, error);
      throw error;
    }
  }
};

export default {
  setupAppwriteDatabase,
  appwriteProductService
}; 