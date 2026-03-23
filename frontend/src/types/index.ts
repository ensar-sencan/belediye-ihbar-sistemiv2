// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?:  string;
  role: 'CITIZEN' | 'MUNICIPALITY_STAFF' | 'ADMIN';
  is_active: boolean;
  municipality_id?:  string;
  created_at:  string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Report types
export const ReportCategory = {
  POTHOLE: 'pothole',
  LIGHTING: 'lighting',
  CLEANING: 'cleaning',
  PARK: 'park',
  WATER: 'water',
  ROAD: 'road',
  OTHER: 'other'
} as const;
export type ReportCategory = typeof ReportCategory[keyof typeof ReportCategory];

export const ReportStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
} as const;
export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export const ReportPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;
export type ReportPriority = typeof ReportPriority[keyof typeof ReportPriority];

export interface Report {
  id: string;
  user_id: string;
  municipality_id?:  string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  latitude?:  number;
  longitude?: number;
  address?: string;
  image_urls:  string[];
  upvotes: number;
  downvotes: number;
  is_anonymous: boolean;
  created_at: string;
  updated_at?:  string;
  resolved_at?: string;
}

// Municipality types
export interface Municipality {
  id: string;
  name:  string;
  district:  string;
  city: string;
  contact_email?:  string;
  contact_phone?:  string;
  website?: string;
  is_active: boolean;
}

// Dashboard stats
export interface DashboardStats {
  total_reports: number;
  status_distribution: {
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
  };
  category_distribution: {
    [key: string]: number;
  };
  priority_distribution: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  recent_reports: Report[];
  top_municipalities: {
    municipality_name: string;
    report_count: number;
  }[];
}