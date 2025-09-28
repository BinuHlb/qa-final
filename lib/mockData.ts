import { QAReview, Reviewer, MemberFirm, User } from '@/types/qaReview';
import { 
  generateMockQAReviews, 
  generateMockReviewers, 
  generateMockMemberFirms, 
  generateMockUsers 
} from './mockDataGenerator';

// Generate 100 mock QA reviews for comprehensive testing
export const mockQAReviews: QAReview[] = generateMockQAReviews();

// Generate additional mock data for other entities
export const mockReviewers: Reviewer[] = generateMockReviewers();
export const mockMemberFirms: MemberFirm[] = generateMockMemberFirms();
export const mockUsers: User[] = generateMockUsers();