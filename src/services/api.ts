
import axios from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ScanResult, 
  StartScanResponse, 
  ScanProgress, 
  ReportHtml, 
  ScanStats, 
  AdminUser 
} from '@/types';

const API_URL = 'http://localhost:8081';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/api/auth/register', userData);
  },
};

// Scan services
export const scanService = {
  getUserScans: async (): Promise<ScanResult[]> => {
    const response = await api.get<ScanResult[]>('/api/scan/user/scans');
    return response.data;
  },
  startScan: async (url: string): Promise<StartScanResponse> => {
    const response = await api.post<StartScanResponse>('/api/scan/start', { url });
    return response.data;
  },
  getScanProgress: async (scanResultId: number): Promise<ScanProgress> => {
    const response = await api.get<ScanProgress>(`/api/scan/progress/${scanResultId}`);
    return response.data;
  },
  getHtmlReport: async (scanResultId: number): Promise<ReportHtml> => {
    const response = await api.get<ReportHtml>(`/api/scan/rapports/generer-html/${scanResultId}`);
    return response.data;
  },
  downloadPdfReport: async (scanResultId: number): Promise<Blob> => {
    const response = await api.get(`/api/scan/rapports/generer/${scanResultId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Stats services
export const statsService = {
  getStats: async (): Promise<ScanStats> => {
    const response = await api.get<ScanStats>('/api/scan/stats');
    return response.data;
  },
};

// Admin services
export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>('/api/admin/users');
    return response.data;
  },
  getUserScans: async (userId: number): Promise<ScanResult[]> => {
    const response = await api.get<ScanResult[]>(`/api/admin/users/${userId}/scans`);
    return response.data;
  },
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/api/admin/users/${userId}`);
  },
};

export default api;
