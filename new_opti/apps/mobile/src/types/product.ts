export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  brand: string;
  model_number: string;
  frame_color: string;
  lens_color: string;
  frame_material: string;
  style: string;
  gender: string;
  face_shape: string;
  images: string[];
  is_virtual_try_on_enabled: boolean;
  rating: number;
  review_count: number;
}

export interface CatalogFilterState {
  shapes: string[];
  colors: string[];
  brands: string[];
  gender?: string;
  min_price?: number;
  max_price?: number;
  ar_only: boolean;
  search_query?: string;
  sort_by: SortOption;
}

export type SortOption = 'newest' | 'price_lowest' | 'price_highest' | 'rating' | 'popular';

export interface FilterOptions {
  shapes: string[];
  colors: string[];
  brands: string[];
  genders: string[];
  min_price: number;
  max_price: number;
}
