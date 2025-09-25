export interface QAReview {
  id: string;
  memberFirmIntranetName: string;
  type: 'Prospect' | 'Current Members';
  memberContact: string;
  reviewerName: string;
  country: string;
  reviewerStatus: '⛔' | 'Active';
  partnerStatus: '⛔' | 'Approved';
  reviewPlanned: string;
  reviewEndDate: string;
  currentGrading: string;
  previousGrading: string;
  qaReviewStatus: 'Not Started' | 'In Progress' | 'Completed';
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  specializations: string[];
  assignedReviews: number;
}

export interface MemberFirm {
  id: string;
  name: string;
  intranetName: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  totalReviews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Technical Director' | 'Reviewer' | 'User';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}