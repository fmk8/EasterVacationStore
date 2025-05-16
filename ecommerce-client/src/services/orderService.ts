import api from './api';
import type { Product } from './productService';

export interface OrderItem {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  orderDate: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderCreateRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/order');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },

  createOrder: async (order: OrderCreateRequest): Promise<Order> => {
    const response = await api.post<Order>('/order', order);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export default orderService; 