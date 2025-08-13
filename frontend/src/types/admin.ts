export interface UserListItem {
  id: number;
  name: string;
  email: string;
  user_type: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  employers: number;
  candidates: number;
  admins: number;
  verified_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
}

export interface PlatformAnalytics {
  user_stats: UserStatistics;
}

export interface AuditLogItem {
  id: number;
  admin_id: number;
  action: string;
  target_type: string;
  target_id?: number;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserUpdateRequest {
  name?: string;
  is_active?: boolean;
  is_verified?: boolean;
  admin_role?: string;
  department?: string;
}

export type AdminPermission = 
  | 'user.read' 
  | 'user.write' 
  | 'user.delete'
  | 'admin.read' 
  | 'admin.write' 
  | 'admin.delete'
  | 'analytics.read' 
  | 'system.write' 
  | 'audit.read';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  user_type: 'admin';
  admin_role: string;
  department?: string;
  permissions?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}