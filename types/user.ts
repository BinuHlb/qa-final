export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
  permissions: Permission[];
  memberFirmId?: string; // For member firm users
}

export type UserRole = 'admin' | 'member_firm' | 'tech_director' | 'ceo';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface MemberFirm {
  id: string;
  name: string;
  intranetName: string;
  country: string;
  contactEmail: string;
  contactPerson: string;
  isActive: boolean;
  type: 'Current Members' | 'Prospect';
  joinedDate: Date;
}

export interface FileUpload {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: FileStatus;
  reviewId?: string;
  memberFirmId: string;
  version: number;
  downloadUrl?: string;
}

export type FileStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'needs_revision';

export interface ReviewWorkflow {
  id: string;
  reviewId: string;
  currentStage: ReviewStage;
  stages: ReviewStage[];
  assignedTo: string;
  dueDate: Date;
  status: WorkflowStatus;
  comments: WorkflowComment[];
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewStage = 'initial_review' | 'technical_review' | 'ceo_approval' | 'final_approval';
export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface WorkflowComment {
  id: string;
  stage: ReviewStage;
  comment: string;
  commentedBy: string;
  commentedAt: Date;
  isInternal: boolean;
}

export interface ReviewAssignment {
  id: string;
  reviewId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  notes?: string;
}

// Role-based access control
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { id: 'admin_all', name: 'Full System Access', resource: '*', action: '*' },
    { id: 'user_manage', name: 'User Management', resource: 'users', action: '*' },
    { id: 'review_manage', name: 'Review Management', resource: 'reviews', action: '*' },
    { id: 'file_manage', name: 'File Management', resource: 'files', action: '*' },
    { id: 'workflow_manage', name: 'Workflow Management', resource: 'workflows', action: '*' },
    { id: 'report_view', name: 'Reports View', resource: 'reports', action: 'read' },
    { id: 'system_config', name: 'System Configuration', resource: 'system', action: '*' }
  ],
  ceo: [
    { id: 'ceo_approval', name: 'Final Approval', resource: 'reviews', action: 'approve' },
    { id: 'ceo_dashboard', name: 'Executive Dashboard', resource: 'dashboard', action: 'read' },
    { id: 'report_view', name: 'Reports View', resource: 'reports', action: 'read' },
    { id: 'workflow_approve', name: 'Workflow Approval', resource: 'workflows', action: 'approve' }
  ],
  tech_director: [
    { id: 'tech_review', name: 'Technical Review', resource: 'reviews', action: 'review' },
    { id: 'file_download', name: 'File Download', resource: 'files', action: 'download' },
    { id: 'review_assign', name: 'Review Assignment', resource: 'reviews', action: 'assign' },
    { id: 'workflow_manage', name: 'Workflow Management', resource: 'workflows', action: 'manage' },
    { id: 'report_view', name: 'Reports View', resource: 'reports', action: 'read' }
  ],
  member_firm: [
    { id: 'file_upload', name: 'File Upload', resource: 'files', action: 'upload' },
    { id: 'file_view', name: 'File View', resource: 'files', action: 'read' },
    { id: 'review_status', name: 'Review Status', resource: 'reviews', action: 'read' },
    { id: 'profile_manage', name: 'Profile Management', resource: 'profile', action: 'update' }
  ]
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  member_firm: 'Member Firm',
  tech_director: 'Technical Director',
  ceo: 'Chief Executive Officer'
};

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-500',
  member_firm: 'bg-blue-500',
  tech_director: 'bg-purple-500',
  ceo: 'bg-green-500'
};
