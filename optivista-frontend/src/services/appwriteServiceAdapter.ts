// Appwrite Service Adapter
// This service adapts between the Appwrite database service and our product service,
// ensuring data consistency and proper field conversions

import { AppwriteProduct, AppwriteProductVariant, appwriteProductService } from './appwrite/appwriteService';
import { Product, ProductFilter } from './productService';
import fileManagerApi from './fileManager';

/**
 * Adapter service to convert between Appwrite data models and our application models
 * This ensures data consistency when switching between storage backends
 */
export const appwriteServiceAdapter = {
  // Convert an Appwrite product to our application Product model
  appwriteToProduct: async (appwriteProduct: AppwriteProduct): Promise<Product> => {
    try {
      // Get image and model URLs
      let imageUrl: string | undefined;
      let modelUrl: string | undefined;
      
      if (appwriteProduct.imageKey) {
        imageUrl = await fileManagerApi.getCachedFileUrl(appwriteProduct.imageKey);
      }
      
      if (appwriteProduct.modelKey) {
        modelUrl = await fileManagerApi.getCachedFileUrl(appwriteProduct.modelKey);
      }
      
      // Get product variants
      const variants = await appwriteProductService.getProductVariants(appwriteProduct.id);
      
      // Convert to application Product model
      return {
        id: appwriteProduct.id,
        name: appwriteProduct.name,
        description: appwriteProduct.description,
        price: appwriteProduct.price,
        category: appwriteProduct.category,
        style: appwriteProduct.style,
        color: appwriteProduct.color,
        size: appwriteProduct.size,
        gender: appwriteProduct.gender,
        material: appwriteProduct.material,
        weight: appwriteProduct.weight,
        inStock: appwriteProduct.inStock,
        stockQuantity: appwriteProduct.stockQuantity,
        discount: appwriteProduct.discount,
        rating: appwriteProduct.rating,
        imageKey: appwriteProduct.imageKey,
        imageUrl,
        modelKey: appwriteProduct.modelKey,
        modelUrl,
        sellerId: appwriteProduct.sellerId,
        dateAdded: appwriteProduct.dateAdded,
        lastUpdated: appwriteProduct.lastUpdated,
        // Convert variants to the expected format
        variants: variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          color: variant.color,
          price: variant.price || appwriteProduct.price,
          stockQuantity: variant.stockQuantity,
          imageKey: variant.imageKey,
          modelKey: variant.modelKey
        }))
      };
    } catch (error) {
      console.error('Error converting Appwrite product to application model:', error);
      throw error;
    }
  },
  
  // Convert multiple Appwrite products to our application Product models
  appwriteToProducts: async (appwriteProducts: AppwriteProduct[]): Promise<Product[]> => {
    return Promise.all(appwriteProducts.map(product => 
      appwriteServiceAdapter.appwriteToProduct(product)
    ));
  },
  
  // Convert our application Product model to Appwrite product format
  productToAppwrite: (product: Omit<Product, 'id' | 'imageUrl' | 'modelUrl' | 'dateAdded' | 'lastUpdated' | 'variants'>): 
    Omit<AppwriteProduct, 'id' | 'dateAdded' | 'lastUpdated'> => {
    
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      style: product.style,
      color: product.color,
      size: product.size,
      gender: product.gender,
      material: product.material,
      weight: product.weight,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      discount: product.discount,
      rating: product.rating,
      imageKey: product.imageKey,
      modelKey: product.modelKey,
      sellerId: product.sellerId
    };
  },
  
  // Convert our application product variant to Appwrite format
  variantToAppwrite: (
    productId: string, 
    variant: { name: string; color: string; price?: number; stockQuantity: number; imageKey?: string; modelKey?: string; }
  ): Omit<AppwriteProductVariant, 'id'> => {
    return {
      productId,
      name: variant.name,
      color: variant.color,
      price: variant.price,
      imageKey: variant.imageKey,
      modelKey: variant.modelKey,
      stockQuantity: variant.stockQuantity
    };
  },
  
  // Convert our application filter format to Appwrite query format
  filterToAppwriteQuery: (filter: ProductFilter): any => {
    const appwriteFilter: any = {};
    
    if (filter.category) {
      appwriteFilter.category = filter.category;
    }
    
    if (filter.style) {
      appwriteFilter.style = filter.style;
    }
    
    if (filter.color) {
      appwriteFilter.color = filter.color;
    }
    
    if (filter.gender) {
      appwriteFilter.gender = filter.gender;
    }
    
    if (filter.material) {
      appwriteFilter.material = filter.material;
    }
    
    if (filter.minPrice !== undefined) {
      appwriteFilter.minPrice = filter.minPrice;
    }
    
    if (filter.maxPrice !== undefined) {
      appwriteFilter.maxPrice = filter.maxPrice;
    }
    
    if (filter.inStock !== undefined) {
      appwriteFilter.inStock = filter.inStock;
    }
    
    return appwriteFilter;
  }
};

/**
 * Enhanced Product Service that uses Appwrite as the backend
 * This implements the same interface as our standard productService,
 * but uses Appwrite for data storage
 */
export const appwriteProductServiceImpl = {
  // Get all products with optional filtering and pagination
  getAllProducts: async (
    filters?: ProductFilter,
    page: number = 1,
    pageSize: number = 20
  ) => {
    try {
      // Convert filters to Appwrite format
      const appwriteFilters = filters ? appwriteServiceAdapter.filterToAppwriteQuery(filters) : undefined;
      
      // Get products from Appwrite
      const result = await appwriteProductService.getAllProducts(appwriteFilters, page, pageSize);
      
      // Convert Appwrite products to our application format
      const products = await appwriteServiceAdapter.appwriteToProducts(result.products);
      
      return {
        products,
        totalCount: result.totalCount,
        page,
        pageSize
      };
    } catch (error) {
      console.error('Failed to get products from Appwrite:', error);
      throw error;
    }
  },
  
  // Get a single product by ID
  getProductById: async (id: string) => {
    try {
      // Get product from Appwrite
      const appwriteProduct = await appwriteProductService.getProductById(id);
      
      // Convert to our application format
      return appwriteServiceAdapter.appwriteToProduct(appwriteProduct);
    } catch (error) {
      console.error(`Failed to get product ${id} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Create a new product including image and optional 3D model uploads
  createProduct: async (productUpload: {
    product: Omit<Product, 'id' | 'imageUrl' | 'modelUrl' | 'dateAdded' | 'lastUpdated' | 'variants'>;
    image: File;
    model?: File;
    variants?: Array<{
      name: string;
      color: string;
      price?: number;
      stockQuantity: number;
      image?: File;
      model?: File;
    }>;
  }) => {
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
      
      // 4. Convert to Appwrite format and create in database
      const appwriteProductData = appwriteServiceAdapter.productToAppwrite(productData);
      const createdProduct = await appwriteProductService.createProduct(appwriteProductData);
      
      // 5. Create variants if provided
      if (productUpload.variants && productUpload.variants.length > 0) {
        for (const variant of productUpload.variants) {
          // Upload variant image if provided
          let variantImageKey = undefined;
          if (variant.image) {
            const imageResult = await fileManagerApi.uploadImage(
              variant.image,
              'products/variants/images'
            );
            variantImageKey = imageResult.file.key;
          }
          
          // Upload variant model if provided
          let variantModelKey = undefined;
          if (variant.model) {
            const modelResult = await fileManagerApi.uploadModel(
              variant.model,
              'products/variants/models'
            );
            variantModelKey = modelResult.file.key;
          }
          
          // Create variant in Appwrite
          await appwriteProductService.createProductVariant(
            appwriteServiceAdapter.variantToAppwrite(
              createdProduct.id,
              {
                ...variant,
                imageKey: variantImageKey,
                modelKey: variantModelKey
              }
            )
          );
        }
      }
      
      // 6. Return final product with all data
      return appwriteServiceAdapter.appwriteToProduct(createdProduct);
    } catch (error) {
      console.error('Failed to create product in Appwrite:', error);
      throw error;
    }
  },
  
  // Update an existing product
  updateProduct: async (
    id: string, 
    productData: Partial<Omit<Product, 'id' | 'imageUrl' | 'modelUrl' | 'dateAdded' | 'lastUpdated'>>, 
    newImage?: File,
    newModel?: File
  ) => {
    try {
      const updatedData: any = { ...productData };
      
      // Upload new image if provided
      if (newImage) {
        const imageUploadResult = await fileManagerApi.uploadImage(
          newImage, 
          'products/images'
        );
        updatedData.imageKey = imageUploadResult.file.key;
      }
      
      // Upload new 3D model if provided
      if (newModel) {
        const modelUploadResult = await fileManagerApi.uploadModel(
          newModel,
          'products/models'
        );
        updatedData.modelKey = modelUploadResult.file.key;
      }
      
      // Convert to Appwrite format and update in database
      const appwriteProduct = await appwriteProductService.updateProduct(id, updatedData);
      
      // Return updated product with all data
      return appwriteServiceAdapter.appwriteToProduct(appwriteProduct);
    } catch (error) {
      console.error(`Failed to update product ${id} in Appwrite:`, error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (id: string) => {
    try {
      // Get product to obtain file keys
      const product = await appwriteProductServiceImpl.getProductById(id);
      
      // Delete product from Appwrite
      await appwriteProductService.deleteProduct(id);
      
      // Delete associated files
      if (product.imageKey) {
        await fileManagerApi.deleteFile(product.imageKey);
      }
      
      if (product.modelKey) {
        await fileManagerApi.deleteFile(product.modelKey);
      }
      
      // Delete variant files if any
      if (product.variants) {
        for (const variant of product.variants) {
          if (variant.imageKey) {
            await fileManagerApi.deleteFile(variant.imageKey);
          }
          
          if (variant.modelKey) {
            await fileManagerApi.deleteFile(variant.modelKey);
          }
        }
      }
      
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error(`Failed to delete product ${id} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Get products by seller ID
  getProductsBySellerId: async (sellerId: string) => {
    try {
      const products = await appwriteProductService.getProductsBySellerId(sellerId);
      return appwriteServiceAdapter.appwriteToProducts(products);
    } catch (error) {
      console.error(`Failed to get products for seller ${sellerId} from Appwrite:`, error);
      throw error;
    }
  },
  
  // Search products
  searchProducts: async (searchTerm: string) => {
    try {
      const products = await appwriteProductService.searchProducts(searchTerm);
      return appwriteServiceAdapter.appwriteToProducts(products);
    } catch (error) {
      console.error(`Failed to search products with term "${searchTerm}" in Appwrite:`, error);
      throw error;
    }
  },
  
  // Get featured products for homepage
  getFeaturedProducts: async (limit: number = 8) => {
    try {
      // For featured products, we'll just get the first 'limit' products
      // In a real implementation, you might have a "featured" flag or separate collection
      const result = await appwriteProductService.getAllProducts(undefined, 1, limit);
      return appwriteServiceAdapter.appwriteToProducts(result.products);
    } catch (error) {
      console.error(`Failed to get featured products from Appwrite:`, error);
      throw error;
    }
  },
};

export default appwriteProductServiceImpl; 