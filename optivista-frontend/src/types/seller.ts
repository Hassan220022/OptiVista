export interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended';
  products: number;
  orders: number;
}

export interface SellerStatistics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  salesChange: number;
  ordersChange: number;
}

export default Seller; 