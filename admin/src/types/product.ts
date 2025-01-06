export type ProductCategory = 'Sunglasses' | 'Reading Glasses' | 'Sports Eyewear' | 'Designer Frames';

export interface Product {
  id: number;
  categoryId?: number; // Added to match backend schema
  name: string;
  style?: string; // Added to match backend schema
  color?: string; // Added to match backend schema
  size?: string; // Added to match backend schema
  price: number;
  description: string;
  brand?: string; // Added to match backend schema
  arSupported: boolean; // Added to match backend schema
  stock: number;
  imageUrl?: string; // Added to match backend schema
  arModelUrl?: string; // Added to match backend schema
  frameWidth?: number; // Added to match backend schema
  templeLength?: number; // Added to match backend schema
  lensHeight?: number; // Added to match backend schema
  bridgeWidth?: number; // Added to match backend schema
  materials?: string[]; // Added to match backend schema
  availableColors?: string[]; // Added to match backend schema
}