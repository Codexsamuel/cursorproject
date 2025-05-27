import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  stock: number;
  category: string;
  rating: number;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Order {
  id: string;
  user_id: string;
  products: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// API Client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    return user;
  },

  register: async (userData: Partial<User> & { password: string }) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    return user;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Products
export const products = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    tags?: string[];
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId: string) => {
    const response = await api.get(`/categories/${categoryId}/products`);
    return response.data;
  },
};

// Categories
export const categories = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// Orders
export const orders = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData: {
    products: { product_id: string; quantity: number }[];
    address: string;
    payment_method: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
};

// Favorites
export const favorites = {
  getAll: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  add: async (productId: string) => {
    const response = await api.post('/favorites', { product_id: productId });
    return response.data;
  },

  remove: async (productId: string) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  },
};

// Cart
export const cart = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId: string, quantity: number) => {
    const response = await api.post('/cart/items', { product_id: productId, quantity });
    return response.data;
  },

  updateItem: async (productId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeItem: async (productId: string) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

export default api; 