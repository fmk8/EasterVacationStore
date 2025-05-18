import api from './api';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  },

  createCategory: async (category: CategoryCreateRequest): Promise<Category> => {
    const response = await api.post<Category>('/category', category);
    return response.data;
  },

  updateCategory: async (id: number, category: Partial<CategoryCreateRequest>): Promise<Category> => {
    const response = await api.put<Category>(`/category/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/category/${id}`);
  }
};

export default categoryService; 