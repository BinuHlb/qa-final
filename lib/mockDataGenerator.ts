import { QAReview, Reviewer, MemberFirm, User } from '@/types/qaReview';

// Base data arrays for generating realistic mock data
const firmNames = [
  'Smith & Associates LLP', 'Global Partners Inc', 'European Consulting Group',
  'Asia Pacific Advisors', 'London Bridge Partners', 'Atlantic Financial Group',
  'Pacific Rim Consultants', 'Continental Advisory Services', 'Metropolitan Business Partners',
  'International Trade Associates', 'Strategic Planning Group', 'Premier Advisory Network',
  'Elite Financial Services', 'Professional Consulting Firm', 'Global Business Solutions',
  'Advanced Analytics Group', 'Innovation Partners LLP', 'Excellence Advisory Services',
  'Premium Business Consultants', 'Strategic Growth Partners', 'International Finance Group',
  'Professional Services Network', 'Global Advisory Solutions', 'Premier Consulting Group',
  'Advanced Business Partners', 'Strategic Investment Group', 'Professional Advisory Network',
  'Global Financial Partners', 'Excellence Consulting Group', 'Premium Advisory Services'
];

const reviewerNames = [
  'Sarah Johnson', 'David Wilson', 'Emma Thompson', 'Michael Brown', 'Lisa Anderson',
  'Robert Chen', 'Jennifer Martinez', 'Christopher Lee', 'Amanda Davis', 'James Wilson',
  'Michelle Garcia', 'Daniel Rodriguez', 'Ashley Miller', 'Matthew Taylor', 'Jessica White',
  'Andrew Jackson', 'Stephanie Harris', 'Kevin Martin', 'Rachel Thompson', 'Brandon Anderson',
  'Nicole Martinez', 'Ryan Clark', 'Samantha Lewis', 'Tyler Walker', 'Brittany Hall',
  'Jordan Young', 'Kayla Allen', 'Zachary King', 'Megan Wright', 'Cameron Lopez'
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Singapore', 'Japan', 'South Korea',
  'Italy', 'Spain', 'Brazil', 'Mexico', 'India',
  'China', 'Hong Kong', 'Switzerland', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Belgium', 'Austria', 'Poland'
];

const firmTypes = ['Current Members', 'Prospect'] as const;
const reviewerStatuses = ['Active', '⛔'] as const;
const partnerStatuses = ['Approved', '⛔'] as const;
const qaReviewStatuses = ['Not Started', 'In Progress', 'Completed'] as const;
const gradings = ['1', '2', '3', '4', '5'] as const;

// Seeded random number generator for consistent SSR
let seed = 12345;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Helper functions
function getRandomItem<T>(array: readonly T[]): T {
  return array[Math.floor(seededRandom() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + seededRandom() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0].replace(/-/g, '/');
}

function generateEmail(name: string, firm: string): string {
  const firstName = name.split(' ')[0].toLowerCase();
  const domain = firm.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  return `${firstName}@${domain}`;
}

function generatePhone(country: string): string {
  const countryCodes = {
    'United States': '+1-555-',
    'United Kingdom': '+44-20-',
    'Canada': '+1-416-',
    'Australia': '+61-2-',
    'Germany': '+49-30-',
    'France': '+33-1-',
    'Netherlands': '+31-20-',
    'Singapore': '+65-',
    'Japan': '+81-3-',
    'South Korea': '+82-2-',
    'Italy': '+39-06-',
    'Spain': '+34-91-',
    'Brazil': '+55-11-',
    'Mexico': '+52-55-',
    'India': '+91-11-',
    'China': '+86-10-',
    'Hong Kong': '+852-',
    'Switzerland': '+41-44-',
    'Sweden': '+46-8-',
    'Norway': '+47-22-',
    'Denmark': '+45-33-',
    'Finland': '+358-9-',
    'Belgium': '+32-2-',
    'Austria': '+43-1-',
    'Poland': '+48-22-'
  };
  
  const code = countryCodes[country as keyof typeof countryCodes] || '+1-555-';
  const number = Math.floor(seededRandom() * 9000) + 1000;
  return code + number;
}

// Generate 100 QA Reviews
export function generateMockQAReviews(): QAReview[] {
  const reviews: QAReview[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const firmName = getRandomItem(firmNames);
    const reviewerName = getRandomItem(reviewerNames);
    const country = getRandomItem(countries);
    const type = getRandomItem(firmTypes);
    const reviewerStatus = getRandomItem(reviewerStatuses);
    const partnerStatus = getRandomItem(partnerStatuses);
    const qaReviewStatus = getRandomItem(qaReviewStatuses);
    const currentGrading = getRandomItem(gradings);
    const previousGrading = getRandomItem(gradings);
    
    // Generate realistic date ranges
    const reviewPlanned = generateDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    const reviewEndDate = generateDate(new Date(reviewPlanned), new Date(2024, 11, 31));
    
    reviews.push({
      id: i.toString(),
      memberFirmIntranetName: firmName,
      type,
      memberContact: generateEmail(reviewerName, firmName),
      reviewerName,
      country,
      reviewerStatus,
      partnerStatus,
      reviewPlanned,
      reviewEndDate,
      currentGrading,
      previousGrading,
      qaReviewStatus,
    });
  }
  
  return reviews;
}

// Generate additional reviewers
export function generateMockReviewers(): Reviewer[] {
  const reviewers: Reviewer[] = [];
  const specializations = [
    ['Financial Services', 'Risk Management'],
    ['Technology', 'Healthcare'],
    ['Manufacturing', 'Compliance'],
    ['Real Estate', 'Construction'],
    ['Retail', 'E-commerce'],
    ['Energy', 'Utilities'],
    ['Transportation', 'Logistics'],
    ['Education', 'Non-profit'],
    ['Government', 'Public Sector'],
    ['Media', 'Entertainment']
  ];
  
  for (let i = 1; i <= 25; i++) {
    const name = getRandomItem(reviewerNames);
    const email = name.toLowerCase().replace(' ', '.') + '@company.com';
    const status = seededRandom() > 0.2 ? 'Active' : 'Inactive';
    const assignedReviews = Math.floor(seededRandom() * 20) + 1;
    
    reviewers.push({
      id: i.toString(),
      name,
      email,
      status,
      specializations: getRandomItem(specializations),
      assignedReviews,
    });
  }
  
  return reviewers;
}

// Generate additional member firms
export function generateMockMemberFirms(): MemberFirm[] {
  const firms: MemberFirm[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const name = getRandomItem(firmNames);
    const country = getRandomItem(countries);
    const contactPerson = getRandomItem(reviewerNames);
    const email = generateEmail(contactPerson, name);
    const phone = generatePhone(country);
    const status = seededRandom() > 0.1 ? 'Active' : 'Inactive';
    const totalReviews = Math.floor(seededRandom() * 25) + 1;
    
    firms.push({
      id: i.toString(),
      name,
      intranetName: name,
      country,
      contactPerson,
      email,
      phone,
      status,
      totalReviews,
    });
  }
  
  return firms;
}

// Generate additional users
export function generateMockUsers(): User[] {
  const users: User[] = [];
  const roles = ['Admin', 'Technical Director', 'Reviewer', 'User'] as const;
  
  for (let i = 1; i <= 20; i++) {
    const name = getRandomItem(reviewerNames);
    const email = name.toLowerCase().replace(' ', '.') + '@company.com';
    const role = getRandomItem(roles);
    const status = seededRandom() > 0.15 ? 'Active' : 'Inactive';
    const lastLogin = generateDate(new Date(2024, 0, 1), new Date());
    
    users.push({
      id: i.toString(),
      name,
      email,
      role,
      status,
      lastLogin: lastLogin + 'T' + Math.floor(seededRandom() * 24).toString().padStart(2, '0') + ':' + Math.floor(seededRandom() * 60).toString().padStart(2, '0') + ':00Z',
    });
  }
  
  return users;
}
