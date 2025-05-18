import api from './api';
import type { Product } from './productService';

export interface OrderItem {
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderCreateRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/order');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },

  createOrder: async (order: OrderCreateRequest): Promise<Order> => {
    const response = await api.post<Order>('/order', order);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await api.put<Order>(`/order/${id}/status`, { status });
    return response.data;
  }
};

export default orderService;