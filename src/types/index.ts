
// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Scan Types
export interface ScanResult {
  id: number;
  url: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' | 'UNKNOWN';
  createdAt: string;
  completedAt?: string;
}

export interface ScanProgress {
  scanResultId: number;
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  message?: string;
}

export interface StartScanResponse {
  siteId: number;
  scanResultId: number;
}

// Reports Types
export interface ReportHtml {
  content: string;
}

// Stats Types
export interface ScanStats {
  byType: {
    type: string;
    count: number;
  }[];
  bySeverity: {
    severity: string;
    count: number;
  }[];
  scanCount: number;
}

// Admin Types
export interface AdminUser extends User {
  scanCount: number;
}
