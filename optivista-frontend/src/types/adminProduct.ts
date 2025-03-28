import Product from './product';

interface AdminProduct {
  id?: string; // Make id optional for creation
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl: string;
  sellerId: string;
}

/**
 * Converts a Product to a simplified AdminProduct
 */
export function toAdminProduct(product: Product): AdminProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stockQuantity || product.stock || 0,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl || '',
    sellerId: product.sellerId,
  };
}

/**
 * Converts an array of Products to AdminProducts
 */
export function toAdminProducts(products: Product[]): AdminProduct[] {
  return products.map(toAdminProduct);
}

/**
 * Converts an AdminProduct back to a Product (for API requests)
 */
export function fromAdminProduct(adminProduct: AdminProduct): Partial<Product> {
  const now = new Date().toISOString();
  
  return {
    id: adminProduct.id,
    name: adminProduct.name,
    description: adminProduct.description,
    price: adminProduct.price,
    sellerId: adminProduct.sellerId,
    category: adminProduct.category,
    imageUrl: adminProduct.imageUrl,
    stockQuantity: adminProduct.stock,
    inStock: adminProduct.stock > 0,
    // Set default values for required fields
    dateAdded: now,
    lastUpdated: now,
    // Set required but default values
    style: "Standard",
    color: "Black",
    size: "Medium",
    gender: "unisex",
    material: "Plastic",
    weight: 0,
    imageKey: "",
  };
}

export default AdminProduct; 