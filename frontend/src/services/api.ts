import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'fabric' | 'occasion';
}

export interface Blouse {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
};

// Blouse API
export const blouseAPI = {
  getBlouses: async (filters?: {
    fabric_type?: string;
    occasion?: string;
  }): Promise<Blouse[]> => {
    const params = new URLSearchParams();
    if (filters?.fabric_type && filters.fabric_type !== 'All Fabrics') {
      params.append('fabric_type', filters.fabric_type);
    }
    if (filters?.occasion) {
      params.append('occasion', filters.occasion);
    }
    
    const url = params.toString() ? `/api/blouses?${params}` : '/api/blouses';
    const response = await api.get(url);
    return response.data;
  },

  getBlouse: async (id: number): Promise<Blouse> => {
    const response = await api.get(`/api/blouses/${id}`);
    return response.data;
  },

  createBlouse: async (formData: FormData): Promise<Blouse> => {
    const response = await api.post('/api/blouses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  createCategory: async (name: string, type: 'fabric' | 'occasion'): Promise<Category> => {
    const response = await api.post('/api/categories', { name, type });
    return response.data;
  },
};

export default api;
