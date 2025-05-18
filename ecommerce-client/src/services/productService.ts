import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  stock: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  stock: number;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product');
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/product/category/${categoryId}`);
    return response.data;
  },

  createProduct: async (product: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<Product>('/product', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<ProductCreateRequest>): Promise<Product> => {
    const response = await api.put<Product>(`/product/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`);
  }
};

export default productService; 