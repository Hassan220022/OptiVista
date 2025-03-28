import ApiService from './ApiService';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilter {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

class CustomerServiceClass {
  private readonly basePath = '/customers';

  async getCustomers(filters: CustomerFilter = {}): Promise<CustomersResponse> {
    const params: Record<string, string> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = String(value);
      }
    });
    
    return ApiService.get<CustomersResponse>(this.basePath, params);
  }

  async getCustomer(id: string): Promise<Customer> {
    return ApiService.get<Customer>(`${this.basePath}/${id}`);
  }

  async createCustomer(customer: CustomerCreateInput): Promise<Customer> {
    return ApiService.post<Customer>(this.basePath, customer);
  }

  async updateCustomer(id: string, customer: Partial<CustomerCreateInput>): Promise<Customer> {
    return ApiService.put<Customer>(`${this.basePath}/${id}`, customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.basePath}/${id}`);
  }

  async getCustomerOrders(id: string): Promise<any[]> {
    return ApiService.get<any[]>(`${this.basePath}/${id}/orders`);
  }
}

const CustomerService = new CustomerServiceClass();
export default CustomerService; 