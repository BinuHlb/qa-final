import { User, UserRole, Permission, ROLE_PERMISSIONS } from '@/types/user';
import { mockUsers } from './mockUserData';

// Mock authentication service
export class AuthService {
  private static currentUser: User | null = null;
  private static isAuthenticated = false;

  // Login with email and password
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email && u.isActive);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In real app, verify password hash here
    if (password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    this.isAuthenticated = true;

    // Generate mock JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  // Logout current user
  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  static isLoggedIn(): boolean {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Check if user has specific permission
  static hasPermission(resource: string, action: string): boolean {
    if (!this.currentUser) return false;

    const userPermissions = ROLE_PERMISSIONS[this.currentUser.role];
    
    return userPermissions.some(permission => 
      (permission.resource === '*' || permission.resource === resource) &&
      (permission.action === '*' || permission.action === action)
    );
  }

  // Check if user has specific role
  static hasRole(role: UserRole | UserRole[]): boolean {
    if (!this.currentUser) return false;

    if (Array.isArray(role)) {
      return role.includes(this.currentUser.role);
    }

    return this.currentUser.role === role;
  }

  // Check if user can access resource
  static canAccess(resource: string, action: string = 'read'): boolean {
    return this.isLoggedIn() && this.hasPermission(resource, action);
  }

  // Get user's accessible routes based on role
  static getAccessibleRoutes(): string[] {
    if (!this.currentUser) return ['/login'];

    const roleRoutes: Record<UserRole, string[]> = {
      admin: [
        '/dashboard',
        '/admin',
        '/qa-reviews',
        '/reviewer',
        '/technical-director',
        '/member-firm',
        '/ceo',
        '/users',
        '/reports',
        '/settings'
      ],
      ceo: [
        '/dashboard',
        '/ceo',
        '/qa-reviews',
        '/reports'
      ],
      tech_director: [
        '/dashboard',
        '/technical-director',
        '/qa-reviews',
        '/reviewer',
        '/reports'
      ],
      member_firm: [
        '/dashboard',
        '/member-firm',
        '/qa-reviews'
      ]
    };

    return roleRoutes[this.currentUser.role] || ['/dashboard'];
  }

  // Generate mock JWT token
  private static generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('mock_signature');

    return `${header}.${payload}.${signature}`;
  }

  // Initialize auth state from localStorage
  static initializeAuth(): void {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user = JSON.parse(userData) as User;
        this.currentUser = user;
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      this.logout();
    }
  }

  // Save auth state to localStorage
  static saveAuthState(user: User, token: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Refresh user data
  static async refreshUser(): Promise<User | null> {
    if (!this.currentUser) return null;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = mockUsers.find(u => u.id === this.currentUser!.id);
    
    if (updatedUser) {
      this.currentUser = updatedUser;
      this.saveAuthState(updatedUser, localStorage.getItem('auth_token') || '');
    }

    return this.currentUser;
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (!this.currentUser) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In real app, verify current password and hash new password
    if (currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }

    return true;
  }

  // Update user profile
  static async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) return null;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser = { ...this.currentUser, ...updates };
    this.currentUser = updatedUser;
    this.saveAuthState(updatedUser, localStorage.getItem('auth_token') || '');

    return updatedUser;
  }
}

// Role-based access control helpers
export const AccessControl = {
  // Check if user can view admin panel
  isAdmin: () => AuthService.hasRole('admin'),

  // Check if user can view CEO panel
  isCEO: () => AuthService.hasRole('ceo'),

  // Check if user can view tech director panel
  isTechDirector: () => AuthService.hasRole('tech_director'),

  // Check if user can view member firm panel
  isMemberFirm: () => AuthService.hasRole('member_firm'),

  // Check if user can manage users
  canManageUsers: () => AuthService.hasPermission('users', '*'),

  // Check if user can manage reviews
  canManageReviews: () => AuthService.hasPermission('reviews', '*'),

  // Check if user can upload files
  canUploadFiles: () => AuthService.hasPermission('files', 'upload'),

  // Check if user can download files
  canDownloadFiles: () => AuthService.hasPermission('files', 'download'),

  // Check if user can approve reviews
  canApproveReviews: () => AuthService.hasPermission('reviews', 'approve'),

  // Check if user can assign reviews
  canAssignReviews: () => AuthService.hasPermission('reviews', 'assign'),

  // Check if user can view reports
  canViewReports: () => AuthService.hasPermission('reports', 'read'),

  // Check if user can access system configuration
  canConfigureSystem: () => AuthService.hasPermission('system', '*')
};

// Route protection helper
export const requireAuth = (callback: () => void) => {
  if (!AuthService.isLoggedIn()) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return;
  }
  callback();
};

// Role-based route protection
export const requireRole = (roles: UserRole | UserRole[], callback: () => void) => {
  if (!AuthService.hasRole(roles)) {
    // Redirect to unauthorized page or dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
    return;
  }
  callback();
};

// Permission-based access control
export const requirePermission = (resource: string, action: string, callback: () => void) => {
  if (!AuthService.hasPermission(resource, action)) {
    // Redirect to unauthorized page or dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
    return;
  }
  callback();
};
