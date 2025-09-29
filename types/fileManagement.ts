import { FileUpload, FileStatus, ReviewStage, WorkflowStatus } from './user';

export interface ExcelFile {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' | 'application/vnd.ms-excel';
  uploadedBy: string;
  uploadedAt: Date;
  status: FileStatus;
  reviewId?: string;
  memberFirmId: string;
  version: number;
  downloadUrl?: string;
  metadata: ExcelMetadata;
  reviewHistory: FileReviewHistory[];
}

export interface ExcelMetadata {
  sheetCount: number;
  rowCount: number;
  columnCount: number;
  lastModified: Date;
  fileHash: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  extractedData?: ExtractedExcelData;
}

export interface ExtractedExcelData {
  sheets: ExcelSheet[];
  summary: ExcelSummary;
  validationResults: ExcelValidationResult[];
}

export interface ExcelSheet {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  dataTypes: string[];
  sampleData: any[][];
}

export interface ExcelSummary {
  totalRows: number;
  totalColumns: number;
  dataQualityScore: number;
  completenessScore: number;
  issuesFound: number;
}

export interface ExcelValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  sheet?: string;
  row?: number;
  column?: number;
  severity: 'low' | 'medium' | 'high';
}

export interface FileReviewHistory {
  id: string;
  fileId: string;
  stage: ReviewStage;
  reviewerId: string;
  reviewerName: string;
  reviewedAt: Date;
  status: WorkflowStatus;
  comments: string;
  score?: number;
  recommendations?: string[];
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  description: string;
  stages: ReviewTemplateStage[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ReviewTemplateStage {
  stage: ReviewStage;
  name: string;
  description: string;
  requiredFields: string[];
  scoringCriteria: ScoringCriteria[];
  estimatedDuration: number; // in hours
  autoAssign: boolean;
  assignedRole?: string;
}

export interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
  category: string;
}

export interface ReviewChecklist {
  id: string;
  name: string;
  category: string;
  items: ChecklistItem[];
  isRequired: boolean;
}

export interface ChecklistItem {
  id: string;
  description: string;
  isRequired: boolean;
  weight: number;
  category: string;
}

export interface FileProcessingJob {
  id: string;
  fileId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  results?: FileProcessingResults;
}

export interface FileProcessingResults {
  extractedData: ExtractedExcelData;
  validationResults: ExcelValidationResult[];
  summary: ExcelSummary;
  recommendations: string[];
  processingTime: number;
}

// File upload configuration
export const EXCEL_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel' // .xls
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_UPLOAD = 5;

export const FILE_STATUS_LABELS: Record<FileStatus, string> = {
  uploaded: 'Uploaded',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_revision: 'Needs Revision'
};

export const FILE_STATUS_COLORS: Record<FileStatus, string> = {
  uploaded: 'bg-blue-500',
  under_review: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  needs_revision: 'bg-orange-500'
};

export const REVIEW_STAGE_LABELS: Record<ReviewStage, string> = {
  initial_review: 'Initial Review',
  technical_review: 'Technical Review',
  ceo_approval: 'CEO Approval',
  final_approval: 'Final Approval'
};

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected'
};
