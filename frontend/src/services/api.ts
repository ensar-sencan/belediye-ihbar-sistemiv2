import axiosInstance from '../lib/axios';
import type {
  User,
  Report,
  Municipality,
  LoginCredentials,
  AuthResponse,
  DashboardStats,
  ReportCategory,
  ReportStatus,
  ReportPriority
} from '../types';

// Auth API
export const authAPI = {
  testLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/test-login', credentials);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    category?: ReportCategory;
    status?: ReportStatus;
    priority?: ReportPriority;
  }): Promise<Report[]> => {
    const response = await axiosInstance.get('/reports/', { params });
    return response.data.items || response.data;
  },

  getById: async (id: string): Promise<Report> => {
    const response = await axiosInstance.get(`/reports/${id}`);
    return response.data;
  },

  create: async (data: Partial<Report>): Promise<Report> => {
    const response = await axiosInstance.post('/reports/', data);
    return response.data;
  },

  update:  async (id: string, data:  Partial<Report>): Promise<Report> => {
    const response = await axiosInstance.patch(`/reports/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/reports/${id}`);
  }
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (skip = 0, limit = 100): Promise<User[]> => {
    const response = await axiosInstance.get('/admin/users/', {
      params: { skip, limit }
    });
    return response.data;
  },

  updateReportStatus: async (
    reportId: string,
    status:  ReportStatus
  ): Promise<Report> => {
    const response = await axiosInstance.patch(
      `/admin/reports/${reportId}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  }
};

// Municipalities API
export const municipalitiesAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Municipality[]> => {
    const response = await axiosInstance.get('/municipalities/', {
      params: { skip, limit }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Municipality> => {
    const response = await axiosInstance.get(`/municipalities/${id}`);
    return response.data;
  }
};