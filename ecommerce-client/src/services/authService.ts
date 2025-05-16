import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },
  
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): { id: string; username: string; email: string; role: string } | null => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      return JSON.parse(userJSON);
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService; 