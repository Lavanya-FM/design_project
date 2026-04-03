import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

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
  id: string | number;
  title: string;
  description: string;
  price?: number;
  is_customizable?: boolean;
  neck_type?: string;
  sleeve_type?: string;
  back_type?: string;
  work_type?: string;
  fabric?: string;
  occasion?: string;
  images: string[] | string; // Can be JSON string or array
  story_text?: string;
  anatomy_json?: string;
  artisan_name?: string;
  reviews_json?: string;
  created_at?: string;
}

export interface DesignResponse {
  total: number;
  count: number;
  page: number;
  limit: number;
  designs: Blouse[];
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

// Blouse API (Now Design-centric)
export const designAPI = {
  getDesigns: async (filters?: {
    neck?: string;
    sleeve?: string;
    back?: string;
    work?: string;
    fabric?: string;
    occasion?: string;
    page?: number;
    limit?: number;
  }): Promise<DesignResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const response = await api.get(`/api/designs?${params.toString()}`);
    return response.data;
  },

  searchDesigns: async (query: string): Promise<Blouse[]> => {
    const response = await api.get(`/api/designs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getDesignById: async (id: string | number): Promise<Blouse> => {
    const response = await api.get(`/api/designs/${id}`);
    return response.data;
  },

  getSimilarDesigns: async (id: string | number): Promise<Blouse[]> => {
    const response = await api.get(`/api/designs/${id}/similar`);
    return response.data;
  },

  getTrendingDesigns: async (): Promise<Blouse[]> => {
    const response = await api.get('/api/designs/trending');
    return response.data;
  },
  saveCustomization: async (data: any): Promise<any> => {
    const response = await api.post('/api/customize', data);
    return response.data;
  },

  trackWishlist: async (id: string | number): Promise<any> => {
    const response = await api.post(`/api/designs/wishlist/${id}`);
    return response.data;
  },

  createDesign: async (designData: Partial<Blouse>): Promise<Blouse> => {
    const response = await api.post('/api/designs', designData);
    return response.data;
  },
};

// Keep for backward compatibility if needed, but transition to designAPI
export const blouseAPI = designAPI as any;

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
