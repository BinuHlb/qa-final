import { User, MemberFirm, UserRole, FileUpload, ReviewWorkflow, ReviewAssignment, ExcelFile, FileReviewHistory } from '@/types/user';
import { ExtractedExcelData, ExcelValidationResult } from '@/types/fileManagement';

// Seeded random number generator for consistent data
let seed = 12345;
function seededRandom(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(seededRandom() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom() * (end.getTime() - start.getTime()));
}

// Mock member firms
export const mockMemberFirms: MemberFirm[] = [
  {
    id: '1',
    name: 'Global Financial Services Ltd',
    intranetName: 'GFS-London',
    country: 'United Kingdom',
    contactEmail: 'contact@gfs-london.com',
    contactPerson: 'Sarah Johnson',
    isActive: true,
    type: 'Current Members',
    joinedDate: new Date('2020-01-15')
  },
  {
    id: '2',
    name: 'Asia Pacific Advisory Group',
    intranetName: 'APAG-Singapore',
    country: 'Singapore',
    contactEmail: 'info@apag-sg.com',
    contactPerson: 'Michael Chen',
    isActive: true,
    type: 'Current Members',
    joinedDate: new Date('2019-06-20')
  },
  {
    id: '3',
    name: 'Continental Business Partners',
    intranetName: 'CBP-Frankfurt',
    country: 'Germany',
    contactEmail: 'contact@cbp-frankfurt.de',
    contactPerson: 'Anna Mueller',
    isActive: true,
    type: 'Current Members',
    joinedDate: new Date('2021-03-10')
  },
  {
    id: '4',
    name: 'Strategic Investment Solutions',
    intranetName: 'SIS-NewYork',
    country: 'United States',
    contactEmail: 'info@sis-ny.com',
    contactPerson: 'David Wilson',
    isActive: true,
    type: 'Prospect',
    joinedDate: new Date('2023-01-05')
  },
  {
    id: '5',
    name: 'Nordic Consulting Group',
    intranetName: 'NCG-Stockholm',
    country: 'Sweden',
    contactEmail: 'contact@ncg-stockholm.se',
    contactPerson: 'Erik Andersson',
    isActive: true,
    type: 'Current Members',
    joinedDate: new Date('2020-09-15')
  }
];

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hlb.com',
    name: 'System Administrator',
    role: 'admin',
    isActive: true,
    permissions: [],
    lastLogin: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    email: 'ceo@hlb.com',
    name: 'John Smith',
    role: 'ceo',
    isActive: true,
    permissions: [],
    lastLogin: new Date('2024-01-15T09:15:00Z')
  },
  {
    id: '3',
    email: 'tech.director@hlb.com',
    name: 'Dr. Emily Rodriguez',
    role: 'tech_director',
    isActive: true,
    permissions: [],
    lastLogin: new Date('2024-01-15T08:45:00Z')
  },
  {
    id: '4',
    email: 'sarah.johnson@gfs-london.com',
    name: 'Sarah Johnson',
    role: 'member_firm',
    isActive: true,
    permissions: [],
    memberFirmId: '1',
    lastLogin: new Date('2024-01-14T16:20:00Z')
  },
  {
    id: '5',
    email: 'michael.chen@apag-sg.com',
    name: 'Michael Chen',
    role: 'member_firm',
    isActive: true,
    permissions: [],
    memberFirmId: '2',
    lastLogin: new Date('2024-01-14T14:30:00Z')
  },
  {
    id: '6',
    email: 'anna.mueller@cbp-frankfurt.de',
    name: 'Anna Mueller',
    role: 'member_firm',
    isActive: true,
    permissions: [],
    memberFirmId: '3',
    lastLogin: new Date('2024-01-14T11:15:00Z')
  }
];

// Generate mock Excel files
export const generateMockExcelFiles = (): ExcelFile[] => {
  const fileNames = [
    'Q4_Financial_Report.xlsx',
    'Annual_Audit_Summary.xlsx',
    'Compliance_Checklist.xlsx',
    'Risk_Assessment_Matrix.xlsx',
    'Performance_Metrics.xlsx',
    'Budget_Forecast.xlsx',
    'Client_Portfolio_Analysis.xlsx',
    'Operational_Report.xlsx'
  ];

  const statuses: Array<FileUpload['status']> = ['uploaded', 'under_review', 'approved', 'rejected', 'needs_revision'];
  const reviewers = mockUsers.filter(u => u.role === 'tech_director' || u.role === 'ceo');

  return Array.from({ length: 25 }, (_, i) => {
    const memberFirm = getRandomItem(mockMemberFirms);
    const uploader = mockUsers.find(u => u.memberFirmId === memberFirm.id) || mockUsers[0];
    const status = getRandomItem(statuses);
    const uploadedDate = getRandomDate(new Date('2024-01-01'), new Date());

    return {
      id: `file-${i + 1}`,
      fileName: `file_${i + 1}_${Date.now()}.xlsx`,
      originalName: getRandomItem(fileNames),
      fileSize: Math.floor(seededRandom() * 5000000) + 100000, // 100KB to 5MB
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedBy: uploader.id,
      uploadedAt: uploadedDate,
      status,
      reviewId: status !== 'uploaded' ? `review-${i + 1}` : undefined,
      memberFirmId: memberFirm.id,
      version: Math.floor(seededRandom() * 3) + 1,
      downloadUrl: `/api/files/download/${i + 1}`,
      metadata: {
        sheetCount: Math.floor(seededRandom() * 5) + 1,
        rowCount: Math.floor(seededRandom() * 1000) + 100,
        columnCount: Math.floor(seededRandom() * 20) + 5,
        lastModified: uploadedDate,
        fileHash: `hash_${i + 1}_${Date.now()}`,
        processingStatus: 'completed' as const,
        extractedData: generateExtractedExcelData()
      },
      reviewHistory: generateFileReviewHistory(`file-${i + 1}`)
    };
  });
};

// Generate extracted Excel data
const generateExtractedExcelData = (): ExtractedExcelData => {
  const sheetNames = ['Summary', 'Details', 'Analysis', 'Charts', 'Data'];
  const headers = ['ID', 'Name', 'Value', 'Date', 'Status', 'Category', 'Amount', 'Description'];
  
  return {
    sheets: Array.from({ length: Math.floor(seededRandom() * 3) + 1 }, (_, i) => ({
      name: sheetNames[i] || `Sheet${i + 1}`,
      rowCount: Math.floor(seededRandom() * 500) + 50,
      columnCount: Math.floor(seededRandom() * 8) + 3,
      headers: headers.slice(0, Math.floor(seededRandom() * 6) + 3),
      dataTypes: ['string', 'number', 'date', 'boolean'],
      sampleData: [
        ['Sample1', 123, '2024-01-15', true],
        ['Sample2', 456, '2024-01-16', false]
      ]
    })),
    summary: {
      totalRows: Math.floor(seededRandom() * 1000) + 100,
      totalColumns: Math.floor(seededRandom() * 20) + 5,
      dataQualityScore: Math.floor(seededRandom() * 30) + 70, // 70-100%
      completenessScore: Math.floor(seededRandom() * 25) + 75, // 75-100%
      issuesFound: Math.floor(seededRandom() * 10)
    },
    validationResults: generateValidationResults()
  };
};

// Generate validation results
const generateValidationResults = (): ExcelValidationResult[] => {
  const resultTypes = ['error', 'warning', 'info'] as const;
  const messages = [
    'Missing required field in row 5',
    'Invalid date format in column C',
    'Duplicate entries found',
    'Formula error detected',
    'Data validation failed'
  ];

  return Array.from({ length: Math.floor(seededRandom() * 5) }, (_, i) => ({
    type: getRandomItem(resultTypes),
    message: getRandomItem(messages),
    sheet: `Sheet${Math.floor(seededRandom() * 3) + 1}`,
    row: Math.floor(seededRandom() * 100) + 1,
    column: Math.floor(seededRandom() * 10) + 1,
    severity: getRandomItem(['low', 'medium', 'high'] as const)
  }));
};

// Generate file review history
const generateFileReviewHistory = (fileId: string): FileReviewHistory[] => {
  const stages = ['initial_review', 'technical_review', 'ceo_approval', 'final_approval'] as const;
  const statuses = ['pending', 'in_progress', 'completed', 'rejected'] as const;
  const reviewers = mockUsers.filter(u => u.role === 'tech_director' || u.role === 'ceo');

  return Array.from({ length: Math.floor(seededRandom() * 3) + 1 }, (_, i) => {
    const reviewer = getRandomItem(reviewers);
    const stage = stages[i];
    const status = getRandomItem(statuses);
    const reviewedDate = getRandomDate(new Date('2024-01-01'), new Date());

    return {
      id: `history-${fileId}-${i + 1}`,
      fileId,
      stage,
      reviewerId: reviewer.id,
      reviewerName: reviewer.name,
      reviewedAt: reviewedDate,
      status,
      comments: generateReviewComment(status),
      score: status === 'completed' ? Math.floor(seededRandom() * 30) + 70 : undefined,
      recommendations: status === 'completed' ? generateRecommendations() : undefined
    };
  });
};

// Generate review comments
const generateReviewComment = (status: string): string => {
  const comments = {
    completed: [
      'File meets all requirements and standards.',
      'Excellent work, approved for next stage.',
      'All data validation checks passed successfully.'
    ],
    rejected: [
      'File does not meet quality standards.',
      'Multiple validation errors found.',
      'Incomplete data submission.'
    ],
    pending: [
      'Review in progress...',
      'Awaiting additional documentation.',
      'Under technical review.'
    ],
    in_progress: [
      'Reviewing data quality and completeness.',
      'Checking compliance with standards.',
      'Analyzing file structure and content.'
    ]
  };

  return getRandomItem(comments[status as keyof typeof comments] || comments.pending);
};

// Generate recommendations
const generateRecommendations = (): string[] => {
  const recommendations = [
    'Consider adding more detailed analysis',
    'Include additional supporting documentation',
    'Improve data visualization',
    'Add executive summary',
    'Include risk assessment details'
  ];

  return Array.from({ length: Math.floor(seededRandom() * 3) + 1 }, () => 
    getRandomItem(recommendations)
  );
};

// Generate mock review workflows
export const generateMockReviewWorkflows = (): ReviewWorkflow[] => {
  const stages = ['initial_review', 'technical_review', 'ceo_approval', 'final_approval'] as const;
  const statuses = ['pending', 'in_progress', 'completed', 'rejected'] as const;
  const techDirectors = mockUsers.filter(u => u.role === 'tech_director');

  return Array.from({ length: 15 }, (_, i) => {
    const currentStage = getRandomItem(stages);
    const status = getRandomItem(statuses);
    const assignedTo = getRandomItem(techDirectors);
    const dueDate = getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    return {
      id: `workflow-${i + 1}`,
      reviewId: `review-${i + 1}`,
      currentStage,
      stages: stages.slice(0, Math.floor(seededRandom() * 3) + 2),
      assignedTo: assignedTo.id,
      dueDate,
      status,
      comments: Array.from({ length: Math.floor(seededRandom() * 3) }, (_, j) => ({
        id: `comment-${i + 1}-${j + 1}`,
        stage: getRandomItem(stages),
        comment: generateReviewComment(status),
        commentedBy: getRandomItem(mockUsers).id,
        commentedAt: getRandomDate(new Date('2024-01-01'), new Date()),
        isInternal: seededRandom() > 0.5
      })),
      createdAt: getRandomDate(new Date('2024-01-01'), new Date()),
      updatedAt: new Date()
    };
  });
};

// Generate mock review assignments
export const generateMockReviewAssignments = (): ReviewAssignment[] => {
  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  const statuses = ['pending', 'accepted', 'in_progress', 'completed'] as const;
  const reviewers = mockUsers.filter(u => u.role === 'tech_director');
  const assigners = mockUsers.filter(u => u.role === 'admin' || u.role === 'tech_director');

  return Array.from({ length: 20 }, (_, i) => {
    const reviewer = getRandomItem(reviewers);
    const assigner = getRandomItem(assigners);
    const priority = getRandomItem(priorities);
    const status = getRandomItem(statuses);
    const assignedDate = getRandomDate(new Date('2024-01-01'), new Date());
    const dueDate = getRandomDate(assignedDate, new Date(assignedDate.getTime() + 14 * 24 * 60 * 60 * 1000));

    return {
      id: `assignment-${i + 1}`,
      reviewId: `review-${i + 1}`,
      assignedTo: reviewer.id,
      assignedBy: assigner.id,
      assignedAt: assignedDate,
      dueDate,
      priority,
      status,
      notes: status === 'completed' ? 'Review completed successfully' : 
             status === 'in_progress' ? 'Review in progress' : 
             'Assignment pending'
    };
  });
};

export const mockExcelFiles = generateMockExcelFiles();
export const mockReviewWorkflows = generateMockReviewWorkflows();
export const mockReviewAssignments = generateMockReviewAssignments();
