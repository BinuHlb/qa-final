/**
 * Comprehensive Error Handling System
 * Centralized error management, logging, and user feedback
 */

import { toast } from 'sonner';
import React, { useRef, useCallback, useState } from 'react';

// ============================================================================
// ERROR TYPES
// ============================================================================

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  stack?: string;
  context?: Record<string, any>;
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class BaseError extends Error implements AppError {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code?: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    options: {
      code?: string;
      details?: any;
      context?: Record<string, any>;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.severity = severity;
    this.code = options.code;
    this.details = options.details;
    this.context = options.context;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, details?: any) {
    super(ErrorType.NETWORK, message, ErrorSeverity.HIGH, { details });
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: any) {
    super(ErrorType.VALIDATION, message, ErrorSeverity.MEDIUM, { details });
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication required') {
    super(ErrorType.AUTHENTICATION, message, ErrorSeverity.HIGH);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = 'Insufficient permissions') {
    super(ErrorType.AUTHORIZATION, message, ErrorSeverity.HIGH);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = 'Resource not found') {
    super(ErrorType.NOT_FOUND, message, ErrorSeverity.MEDIUM);
  }
}

export class ServerError extends BaseError {
  constructor(message: string, details?: any) {
    super(ErrorType.SERVER, message, ErrorSeverity.CRITICAL, { details });
  }
}

export class ClientError extends BaseError {
  constructor(message: string, details?: any) {
    super(ErrorType.CLIENT, message, ErrorSeverity.MEDIUM, { details });
  }
}

// ============================================================================
// ERROR HANDLER
// ============================================================================

export interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  logToService?: boolean;
  redirectOnAuthError?: boolean;
  retryAttempts?: number;
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      showToast: true,
      logToConsole: true,
      logToService: false,
      redirectOnAuthError: true,
      retryAttempts: 3,
      ...config,
    };
  }

  handle(error: unknown, context?: Record<string, any>): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log error
    this.logError(appError);
    
    // Show user feedback
    if (this.config.showToast) {
      this.showErrorToast(appError);
    }
    
    // Handle special cases
    this.handleSpecialCases(appError);
    
    return appError;
  }

  private normalizeError(error: unknown, context?: Record<string, any>): AppError {
    if (error instanceof BaseError) {
      return {
        ...error,
        context: { ...error.context, ...context },
      };
    }

    if (error instanceof Error) {
      return new BaseError(
        ErrorType.UNKNOWN,
        error.message,
        ErrorSeverity.MEDIUM,
        {
          details: { originalError: error },
          context,
        }
      );
    }

    return new BaseError(
      ErrorType.UNKNOWN,
      'An unknown error occurred',
      ErrorSeverity.MEDIUM,
      {
        details: { originalError: error },
        context,
      }
    );
  }

  private logError(error: AppError): void {
    // Add to local log
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }

    // Console logging
    if (this.config.logToConsole) {
      const logLevel = this.getLogLevel(error.severity);
      console[logLevel](`[${error.type}] ${error.message}`, {
        code: error.code,
        details: error.details,
        context: error.context,
        timestamp: error.timestamp,
        stack: error.stack,
      });
    }

    // Service logging (would integrate with external service)
    if (this.config.logToService) {
      this.logToService(error);
    }
  }

  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'log';
    }
  }

  private showErrorToast(error: AppError): void {
    const toastConfig = this.getToastConfig(error);
    toast.error(toastConfig.title, {
      description: toastConfig.description,
      duration: toastConfig.duration,
      ...((toastConfig as any).action && { action: (toastConfig as any).action }),
    });
  }

  private getToastConfig(error: AppError) {
    const configs = {
      [ErrorType.NETWORK]: {
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        duration: 5000,
      },
      [ErrorType.VALIDATION]: {
        title: 'Validation Error',
        description: error.message,
        duration: 4000,
      },
      [ErrorType.AUTHENTICATION]: {
        title: 'Authentication Required',
        description: 'Please log in to continue.',
        duration: 5000,
        action: {
          label: 'Login',
          onClick: () => {
            // Redirect to login
            window.location.href = '/login';
          },
        },
      },
      [ErrorType.AUTHORIZATION]: {
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
        duration: 4000,
      },
      [ErrorType.NOT_FOUND]: {
        title: 'Not Found',
        description: 'The requested resource could not be found.',
        duration: 3000,
      },
      [ErrorType.SERVER]: {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        duration: 6000,
      },
      [ErrorType.CLIENT]: {
        title: 'Error',
        description: error.message,
        duration: 4000,
      },
      [ErrorType.UNKNOWN]: {
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
        duration: 4000,
      },
    };

    return configs[error.type] || configs[ErrorType.UNKNOWN];
  }

  private handleSpecialCases(error: AppError): void {
    // Handle authentication errors
    if (error.type === ErrorType.AUTHENTICATION && this.config.redirectOnAuthError) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    // Handle critical errors
    if (error.severity === ErrorSeverity.CRITICAL) {
      // Could trigger error reporting service
      this.reportCriticalError(error);
    }
  }

  private async logToService(error: AppError): Promise<void> {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      console.log('Logging to external service:', error);
    } catch (serviceError) {
      console.error('Failed to log to service:', serviceError);
    }
  }

  private async reportCriticalError(error: AppError): Promise<void> {
    try {
      // Critical error reporting logic
      console.error('Critical error reported:', error);
    } catch (reportError) {
      console.error('Failed to report critical error:', reportError);
    }
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  updateConfig(newConfig: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: any;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: AppError, retry: () => void) => React.ReactNode;
  onError?: (error: AppError, errorInfo: any) => void;
  errorHandler?: ErrorHandler;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: ErrorHandler;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.errorHandler = props.errorHandler || new ErrorHandler();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: new BaseError(
        ErrorType.CLIENT,
        error.message,
        ErrorSeverity.HIGH,
        { details: { originalError: error } }
      ),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = new BaseError(
      ErrorType.CLIENT,
      error.message,
      ErrorSeverity.HIGH,
      {
        details: { originalError: error, errorInfo },
        context: { componentStack: errorInfo.componentStack },
      }
    );

    this.setState({ errorInfo });
    this.errorHandler.handle(appError);
    this.props.onError?.(appError, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error.message}</p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// HOOKS
// ============================================================================

export function useErrorHandler(config?: Partial<ErrorHandlerConfig>) {
  const errorHandler = useRef(new ErrorHandler(config));

  const handleError = useCallback((error: unknown, context?: Record<string, any>) => {
    return errorHandler.current.handle(error, context);
  }, []);

  const getErrorLog = useCallback(() => {
    return errorHandler.current.getErrorLog();
  }, []);

  const clearErrorLog = useCallback(() => {
    errorHandler.current.clearErrorLog();
  }, []);

  return {
    handleError,
    getErrorLog,
    clearErrorLog,
    errorHandler: errorHandler.current,
  };
}

export function useAsyncError() {
  const [, setError] = useState();
  
  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function createErrorHandler(config?: ErrorHandlerConfig): ErrorHandler {
  return new ErrorHandler(config);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof BaseError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function createErrorFromResponse(response: Response, context?: Record<string, any>): AppError {
  const status = response.status;
  
  if (status >= 500) {
    return new ServerError(`Server error: ${status}`, { status, context });
  }
  
  if (status === 404) {
    return new NotFoundError('Resource not found');
  }
  
  if (status === 401) {
    return new AuthenticationError('Authentication required');
  }
  
  if (status === 403) {
    return new AuthorizationError('Access denied');
  }
  
  if (status >= 400) {
    return new ClientError(`Client error: ${status}`, { status, context });
  }
  
  return new BaseError(
    ErrorType.UNKNOWN,
    `Unexpected error: ${status}`,
    ErrorSeverity.MEDIUM,
    { details: { status, context } }
  );
}

// ============================================================================
// LOADING STATES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
  progress?: number;
}

export function useLoadingState(initialState: Partial<LoadingState> = {}) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    progress: undefined,
    ...initialState,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  const setError = useCallback((error: AppError | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, progress: undefined });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setProgress,
    reset,
  };
}

// ============================================================================
// RETRY MECHANISM
// ============================================================================

export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  errorHandler?: ErrorHandler
): Promise<T> {
  const { maxAttempts, delay, backoffMultiplier = 2, maxDelay = 10000 } = config;
  
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        break;
      }
      
      const currentDelay = Math.min(
        delay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  const appError = errorHandler?.handle(lastError!) || new BaseError(
    ErrorType.UNKNOWN,
    lastError!.message,
    ErrorSeverity.HIGH,
    { details: { originalError: lastError } }
  );
  
  throw appError;
}
