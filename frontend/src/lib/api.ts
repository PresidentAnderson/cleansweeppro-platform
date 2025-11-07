import axios from 'axios';
import type {
  User,
  Customer,
  Staff,
  Service,
  Appointment,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers/');
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
    const response = await api.post<Customer>('/customers/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

// Staff API
export const staffApi = {
  getAll: async (activeOnly = false): Promise<Staff[]> => {
    const response = await api.get<Staff[]>('/staff/', {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Staff> => {
    const response = await api.get<Staff>(`/staff/${id}`);
    return response.data;
  },

  create: async (data: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> => {
    const response = await api.post<Staff>('/staff/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Staff>): Promise<Staff> => {
    const response = await api.put<Staff>(`/staff/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/staff/${id}`);
  },
};

// Services API
export const servicesApi = {
  getAll: async (activeOnly = false): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services/', {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Service> => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  create: async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
    const response = await api.post<Service>('/services/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Service>): Promise<Service> => {
    const response = await api.put<Service>(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async (filters?: {
    customer_id?: number;
    staff_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments/', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

export default api;
