export type ProductCategory = 'Sunglasses' | 'Reading Glasses' | 'Sports Eyewear' | 'Designer Frames';

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  price?: number;
  stockQuantity: number;
  imageKey?: string;
  imageUrl?: string;
  modelKey?: string;
  modelUrl?: string;
}

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
  modelKey?: string;
  modelUrl?: string;
  sellerId: string;
  dateAdded: string;
  lastUpdated: string;
  variants?: ProductVariant[];
  
  // Legacy fields for backward compatibility
  features?: string[];
  stock?: number;
  dimensions?: {
    frameWidth: number;
    templeLength: number;
    lensHeight: number;
    bridgeWidth: number;
  };
  materials?: string[];
  colors?: string[];
  arModelUrl?: string;
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
  model?: File;
}

export default Product;