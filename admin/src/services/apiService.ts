import axios from 'axios';

const API_BASE_URL = 'http://196.221.151.195:3000/api'; // Replace with your backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define API methods
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', userData),
};

export const productApi = {
  getProducts: () => api.get('/products'),
  addProduct: (productData: any) => api.post('/products', productData),
  updateProduct: (id: number, productData: any) => api.put(`/products/${id}`, productData),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

export const orderApi = {
  getOrders: () => api.get('/orders'),
  updateOrder: (id: number, orderData: { status: string }) => api.put(`/orders/${id}`, orderData),
};

export const userApi = {
  getUsers: () => api.get('/users'),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

export const dashboardApi = {
  getAdminStats: () => api.get('/admin/stats'),
  getSellerStats: () => api.get('/seller/stats'),
};