import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}
