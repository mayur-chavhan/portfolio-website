/**
 * Error tracking and monitoring utilities
 * Provides centralized error handling and reporting
 */

import { env } from '@/config/env';
import { logger } from '@/shared/utils/logger';
import React from 'react';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fingerprint?: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errorQueue: ErrorReport[] = [];
  private isInitialized = false;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize error tracking service (e.g., Sentry)
      if (env.SENTRY_DSN && env.isProduction) {
        // Sentry initialization would go here
        logger.info('Error tracking initialized with Sentry');
      }

      // Set up global error handlers
      this.setupGlobalErrorHandlers();

      this.isInitialized = true;
      logger.info('Error tracking system initialized');
    } catch (error) {
      logger.error(
        'Failed to initialize error tracking',
        undefined,
        error as Error
      );
    }
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          component: 'Global',
          action: 'unhandledrejection',
          additionalData: { reason: event.reason },
        },
        'high'
      );
    });

    // Handle global JavaScript errors
    window.addEventListener('error', event => {
      this.captureError(
        event.error || new Error(event.message),
        {
          component: 'Global',
          action: 'javascript-error',
          url: event.filename,
          additionalData: {
            line: event.lineno,
            column: event.colno,
            message: event.message,
          },
        },
        'high'
      );
    });

    // Handle resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          const target = event.target as HTMLElement;
          this.captureError(
            new Error(`Resource loading failed: ${target.tagName}`),
            {
              component: 'ResourceLoader',
              action: 'resource-error',
              additionalData: {
                tagName: target.tagName,
                src: (target as any).src || (target as any).href,
              },
            },
            'medium'
          );
        }
      },
      true
    );
  }

  captureError(
    error: Error,
    context: ErrorContext = {},
    severity: ErrorReport['severity'] = 'medium'
  ): void {
    const errorReport: ErrorReport = {
      error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      severity,
      fingerprint: this.generateFingerprint(error, context),
    };

    // Add to queue
    this.errorQueue.push(errorReport);

    // Log locally
    logger.error(
      `Error captured: ${error.message}`,
      {
        severity,
        context,
        fingerprint: errorReport.fingerprint,
      },
      error
    );

    // Send to external service
    this.sendErrorReport(errorReport);

    // Keep queue size manageable
    if (this.errorQueue.length > 100) {
      this.errorQueue.shift();
    }
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    const key = `${error.name}-${error.message}-${context.component || 'unknown'}`;
    return btoa(key)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 16);
  }

  private async sendErrorReport(report: ErrorReport): Promise<void> {
    try {
      if (env.SENTRY_DSN && env.isProduction) {
        // Send to Sentry or other error tracking service
        // This would be implemented based on the chosen service
        console.log('Would send error report to Sentry:', report);
      }

      // Send to custom API endpoint if available
      if (env.API_BASE_URL) {
        // Custom error reporting endpoint
        // await this.sendToCustomEndpoint(report);
      }
    } catch (error) {
      logger.error('Failed to send error report', undefined, error as Error);
    }
  }

  getErrorStats(): {
    totalErrors: number;
    errorsBySeverity: Record<string, number>;
    recentErrors: ErrorReport[];
  } {
    const errorsBySeverity = this.errorQueue.reduce(
      (acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalErrors: this.errorQueue.length,
      errorsBySeverity,
      recentErrors: this.errorQueue.slice(-10),
    };
  }

  clearErrors(): void {
    this.errorQueue = [];
  }

  // User context management
  setUserContext(userId: string, additionalData?: Record<string, any>): void {
    // Set user context for error tracking
    if (env.SENTRY_DSN) {
      // Sentry user context would be set here
    }

    logger.info('User context set for error tracking', {
      userId,
      ...additionalData,
    });
  }

  // Custom error types
  captureException(error: Error, context?: ErrorContext): void {
    this.captureError(error, context, 'high');
  }

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ): void {
    const error = new Error(message);
    const severity =
      level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low';
    this.captureError(error, context, severity);
  }

  // Performance error tracking
  capturePerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context?: ErrorContext
  ): void {
    if (value > threshold) {
      this.captureError(
        new Error(
          `Performance threshold exceeded: ${metric} (${value}ms > ${threshold}ms)`
        ),
        {
          ...context,
          component: 'Performance',
          action: 'threshold-exceeded',
          additionalData: { metric, value, threshold },
        },
        'medium'
      );
    }
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// React Error Boundary helper
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: {
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
): React.ComponentType<T> {
  const WrappedComponent: React.FC<T> = (props: T) => {
    return React.createElement(
      ErrorBoundaryWrapper,
      {
        fallback: errorBoundaryProps?.fallback,
        onError: errorBoundaryProps?.onError,
      },
      React.createElement(Component, props)
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Unknown'})`;

  return WrappedComponent;
}

// Error boundary wrapper component
interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundaryWrapper extends React.Component<
  ErrorBoundaryWrapperProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to error tracking
    errorTracker.captureError(
      error,
      {
        component: 'ErrorBoundary',
        action: 'component-error',
        additionalData: { componentStack: errorInfo.componentStack },
      },
      'high'
    );

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return React.createElement(FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError,
        });
      }

      // Default fallback
      return React.createElement(
        'div',
        { className: 'error-boundary' },
        React.createElement('h2', null, 'Something went wrong'),
        React.createElement('button', { onClick: this.resetError }, 'Try again')
      );
    }

    return this.props.children;
  }
}

export default ErrorTracker;
