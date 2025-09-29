/**
 * Testing Utilities
 * Comprehensive testing utilities and mock data generators
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

// ============================================================================
// TEST PROVIDERS
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
  queryClient?: QueryClient;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function AllTheProviders({ 
  children, 
  theme = 'light',
  queryClient = createTestQueryClient()
}: { 
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  queryClient?: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { theme, queryClient, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders theme={theme} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

export interface MockQAReview {
  id: string;
  memberFirm: string;
  country: string;
  qaReviewStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  type: 'Annual Review' | 'Quarterly Review' | 'Special Review';
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  reviewer: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technical_director' | 'reviewer' | 'member_firm' | 'ceo';
  isActive: boolean;
  lastLogin: string;
  avatar?: string;
}

export interface MockMemberFirm {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  type: 'Current Members' | 'Prospect';
  isActive: boolean;
  joinedDate: string;
}

export interface MockExcelFile {
  id: string;
  fileName: string;
  status: 'uploaded' | 'under_review' | 'approved' | 'rejected';
  uploadedAt: string;
  fileSize: number;
  metadata: {
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    checksum: string;
  };
}

// ============================================================================
// MOCK DATA FACTORY
// ============================================================================

export class MockDataFactory {
  private static idCounter = 1;

  static generateId(): string {
    return `mock-${this.idCounter++}`;
  }

  static generateDate(daysAgo: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  static generateQAReview(overrides: Partial<MockQAReview> = {}): MockQAReview {
    const countries = ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Vietnam'];
    const reviewers = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson'];
    const memberFirms = ['ABC Accounting', 'XYZ Finance', 'DEF Consulting', 'GHI Advisory'];
    const statuses: MockQAReview['qaReviewStatus'][] = ['Not Started', 'In Progress', 'Completed', 'Overdue'];
    const types: MockQAReview['type'][] = ['Annual Review', 'Quarterly Review', 'Special Review'];
    const grades: MockQAReview['grade'][] = ['A', 'B', 'C', 'D', 'F'];

    return {
      id: this.generateId(),
      memberFirm: this.randomChoice(memberFirms),
      country: this.randomChoice(countries),
      qaReviewStatus: this.randomChoice(statuses),
      type: this.randomChoice(types),
      grade: this.randomChoice(grades),
      reviewer: this.randomChoice(reviewers),
      dueDate: this.generateDate(Math.floor(Math.random() * 30)),
      createdAt: this.generateDate(Math.floor(Math.random() * 90)),
      updatedAt: this.generateDate(Math.floor(Math.random() * 7)),
      ...overrides,
    };
  }

  static generateUser(overrides: Partial<MockUser> = {}): MockUser {
    const names = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Garcia'];
    const roles: MockUser['role'][] = ['admin', 'technical_director', 'reviewer', 'member_firm', 'ceo'];

    return {
      id: this.generateId(),
      name: this.randomChoice(names),
      email: `${this.randomChoice(names).toLowerCase().replace(' ', '.')}@example.com`,
      role: this.randomChoice(roles),
      isActive: Math.random() > 0.2, // 80% active
      lastLogin: this.generateDate(Math.floor(Math.random() * 7)),
      ...overrides,
    };
  }

  static generateMemberFirm(overrides: Partial<MockMemberFirm> = {}): MockMemberFirm {
    const firmNames = ['ABC Accounting', 'XYZ Finance', 'DEF Consulting', 'GHI Advisory', 'JKL Services'];
    const contactPersons = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const countries = ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Vietnam'];
    const types: MockMemberFirm['type'][] = ['Current Members', 'Prospect'];

    return {
      id: this.generateId(),
      name: this.randomChoice(firmNames),
      contactPerson: this.randomChoice(contactPersons),
      email: `contact@${this.randomChoice(firmNames).toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+65 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      country: this.randomChoice(countries),
      type: this.randomChoice(types),
      isActive: Math.random() > 0.1, // 90% active
      joinedDate: this.generateDate(Math.floor(Math.random() * 365)),
      ...overrides,
    };
  }

  static generateExcelFile(overrides: Partial<MockExcelFile> = {}): MockExcelFile {
    const fileNames = ['financial_report.xlsx', 'audit_trail.xlsx', 'compliance_data.xlsx', 'quarterly_results.xlsx'];
    const statuses: MockExcelFile['status'][] = ['uploaded', 'under_review', 'approved', 'rejected'];
    const processingStatuses: MockExcelFile['metadata']['processingStatus'][] = ['pending', 'processing', 'completed', 'failed'];

    return {
      id: this.generateId(),
      fileName: this.randomChoice(fileNames),
      status: this.randomChoice(statuses),
      uploadedAt: this.generateDate(Math.floor(Math.random() * 30)),
      fileSize: Math.floor(Math.random() * 10000000) + 1000000, // 1MB to 10MB
      metadata: {
        processingStatus: this.randomChoice(processingStatuses),
        checksum: this.generateChecksum(),
      },
      ...overrides,
    };
  }

  static generateQAReviews(count: number, overrides: Partial<MockQAReview> = {}): MockQAReview[] {
    return Array.from({ length: count }, () => this.generateQAReview(overrides));
  }

  static generateUsers(count: number, overrides: Partial<MockUser> = {}): MockUser[] {
    return Array.from({ length: count }, () => this.generateUser(overrides));
  }

  static generateMemberFirms(count: number, overrides: Partial<MockMemberFirm> = {}): MockMemberFirm[] {
    return Array.from({ length: count }, () => this.generateMemberFirm(overrides));
  }

  static generateExcelFiles(count: number, overrides: Partial<MockExcelFile> = {}): MockExcelFile[] {
    return Array.from({ length: count }, () => this.generateExcelFile(overrides));
  }

  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static generateChecksum(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// ============================================================================
// TEST HELPERS
// ============================================================================

export function createMockProps<T>(defaultProps: T, overrides: Partial<T> = {}): T {
  return { ...defaultProps, ...overrides };
}

export function createMockEvent(overrides: Partial<React.SyntheticEvent> = {}): React.SyntheticEvent {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    currentTarget: document.createElement('div'),
    target: document.createElement('div'),
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    nativeEvent: new Event('mock'),
    timeStamp: Date.now(),
    type: 'mock',
    ...overrides,
  } as React.SyntheticEvent;
}

export function createMockFormData(overrides: Record<string, any> = {}): FormData {
  const formData = new FormData();
  Object.entries(overrides).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

export function createMockFile(name: string, type: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'): File {
  const content = 'mock file content';
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

// ============================================================================
// ASYNC TEST HELPERS
// ============================================================================

export function waitForNextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

export function waitFor(condition: () => boolean, timeout: number = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    
    check();
  });
}

export function createMockPromise<T>(value: T, delay: number = 0): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay);
  });
}

export function createMockRejectedPromise(error: Error, delay: number = 0): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay);
  });
}

// ============================================================================
// MOCK API HELPERS
// ============================================================================

export class MockAPI {
  private static delay = 100;

  static setDelay(delay: number): void {
    this.delay = delay;
  }

  static async mockFetch<T>(data: T, status: number = 200): Promise<Response> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: new Headers(),
      url: 'http://localhost:3000/api/mock',
      redirected: false,
      statusText: status === 200 ? 'OK' : 'Error',
      type: 'basic' as ResponseType,
      body: null,
      bodyUsed: false,
      clone: () => this.mockFetch(data, status),
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    } as Response;
  }

  static async mockError(status: number = 500, message: string = 'Internal Server Error'): Promise<Response> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    return {
      ok: false,
      status,
      json: async () => ({ error: message }),
      text: async () => JSON.stringify({ error: message }),
      headers: new Headers(),
      url: 'http://localhost:3000/api/mock',
      redirected: false,
      statusText: 'Error',
      type: 'basic' as ResponseType,
      body: null,
      bodyUsed: false,
      clone: () => this.mockError(status, message),
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    } as Response;
  }
}

// ============================================================================
// COMPONENT TEST HELPERS
// ============================================================================

export function createTestComponent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  defaultProps: T
) {
  return function TestComponent(props: Partial<T> = {}) {
    return <Component {...defaultProps} {...props} />;
  };
}

export function withTestProviders<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: CustomRenderOptions = {}
) {
  return function WrappedComponent(props: T) {
    return (
      <AllTheProviders theme={options.theme} queryClient={options.queryClient}>
        <Component {...props} />
      </AllTheProviders>
    );
  };
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

export function expectToBeInDocument(element: HTMLElement | null): void {
  expect(element).toBeInTheDocument();
}

export function expectToHaveTextContent(element: HTMLElement | null, text: string): void {
  expect(element).toHaveTextContent(text);
}

export function expectToHaveClass(element: HTMLElement | null, className: string): void {
  expect(element).toHaveClass(className);
}

export function expectToBeVisible(element: HTMLElement | null): void {
  expect(element).toBeVisible();
}

export function expectToBeDisabled(element: HTMLElement | null): void {
  expect(element).toBeDisabled();
}

export function expectToBeEnabled(element: HTMLElement | null): void {
  expect(element).toBeEnabled();
}

// ============================================================================
// PERFORMANCE TEST HELPERS
// ============================================================================

export function measureRenderTime<T>(renderFn: () => T): { result: T; renderTime: number } {
  const start = performance.now();
  const result = renderFn();
  const renderTime = performance.now() - start;
  
  return { result, renderTime };
}

export function measureAsyncTime<T>(asyncFn: () => Promise<T>): Promise<{ result: T; asyncTime: number }> {
  const start = performance.now();
  return asyncFn().then(result => ({
    result,
    asyncTime: performance.now() - start,
  }));
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from '@testing-library/react';
export { customRender as render };
export { MockDataFactory, MockAPI };
export { createTestQueryClient };
