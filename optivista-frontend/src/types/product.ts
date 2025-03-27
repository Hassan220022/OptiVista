export type ProductCategory = 'Sunglasses' | 'Reading Glasses' | 'Sports Eyewear' | 'Designer Frames';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  arModelUrl?: string;
  features?: string[];
  dimensions?: {
    frameWidth: number;
    templeLength: number;
    lensHeight: number;
    bridgeWidth: number;
  };
  materials?: string[];
  colors: string[];
}