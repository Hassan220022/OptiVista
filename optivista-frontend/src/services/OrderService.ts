import ApiService from './ApiService';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilter {
  customerId?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  minTotal?: number;
  maxTotal?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStatusUpdate {
  status: Order['status'];
  notes?: string;
}

export interface OrderPaymentStatusUpdate {
  paymentStatus: Order['paymentStatus'];
  notes?: string;
}

export interface OrderTrackingUpdate {
  trackingNumber: string;
  status: 'processing' | 'shipped';
  notes?: string;
}

class OrderServiceClass {
  private readonly basePath = '/orders';

  async getOrders(filters: OrderFilter = {}): Promise<OrdersResponse> {
    const params: Record<string, string> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = String(value);
      }
    });
    
    return ApiService.get<OrdersResponse>(this.basePath, params);
  }

  async getOrder(id: string): Promise<Order> {
    return ApiService.get<Order>(`${this.basePath}/${id}`);
  }

  async updateOrderStatus(id: string, update: OrderStatusUpdate): Promise<Order> {
    return ApiService.patch<Order>(`${this.basePath}/${id}/status`, update);
  }

  async updatePaymentStatus(id: string, update: OrderPaymentStatusUpdate): Promise<Order> {
    return ApiService.patch<Order>(`${this.basePath}/${id}/payment-status`, update);
  }

  async updateTrackingInfo(id: string, update: OrderTrackingUpdate): Promise<Order> {
    return ApiService.patch<Order>(`${this.basePath}/${id}/tracking`, update);
  }

  async getOrderAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<any> {
    return ApiService.get<any>(`${this.basePath}/analytics`, { period });
  }
}

const OrderService = new OrderServiceClass();
export default OrderService; 