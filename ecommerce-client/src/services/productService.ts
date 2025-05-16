import api from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product');
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/product/category/${categoryId}`);
    return response.data;
  },

  createProduct: async (product: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<Product>('/product', product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<ProductCreateRequest>): Promise<Product> => {
    const response = await api.put<Product>(`/product/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/product/${id}`);
  }
};

export default productService; 