/**
 * Logging utility for the application
 * Provides structured logging with different levels and contexts
 */

import { env } from '@/config/env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

class Logger {
  private level: LogLevel;
  private context: string;

  constructor(context: string = 'App', level: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.level = env.NODE_ENV === 'development' ? LogLevel.DEBUG : level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, data, error } = entry;
    const levelName = LogLevel[level];

    let formatted = `[${timestamp}] ${levelName} [${context}]: ${message}`;

    if (data) {
      formatted += ` | Data: ${JSON.stringify(data)}`;
    }

    if (error) {
      formatted += ` | Error: ${error.message}`;
      if (env.NODE_ENV === 'development' && error.stack) {
        formatted += `\nStack: ${error.stack}`;
      }
    }

    return formatted;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      data,
      error,
    };

    const formatted = this.formatMessage(entry);

    // Console output with appropriate method
    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
    }

    // Send to external logging service in production
    if (env.isProduction && level <= LogLevel.WARN) {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // Example: Send to Sentry, LogRocket, or other logging service
      if (env.SENTRY_DSN) {
        // Sentry integration would go here
        console.log('Would send to Sentry:', entry);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  error(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  // Performance logging
  time(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(`[${this.context}] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(`[${this.context}] ${label}`);
    }
  }

  // Create child logger with additional context
  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.level);
  }
}

// Create default logger instances
export const logger = new Logger('Portfolio');
export const apiLogger = new Logger('API');
export const cacheLogger = new Logger('Cache');
export const performanceLogger = new Logger('Performance');

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      return duration;
    };
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(
    name: string
  ): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, count: values.length };
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = this.getMetrics(name);
      }
    }

    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Error boundary logging
export function logError(
  error: Error,
  context?: string,
  additionalData?: any
): void {
  logger.error(
    `Unhandled error${context ? ` in ${context}` : ''}`,
    additionalData,
    error
  );
}

// User action logging
export function logUserAction(action: string, data?: any): void {
  logger.info(`User action: ${action}`, data);
}

// API call logging
export function logApiCall(
  method: string,
  url: string,
  duration: number,
  status: number
): void {
  const level = status >= 400 ? LogLevel.WARN : LogLevel.INFO;
  apiLogger.log(level, `${method} ${url} - ${status} (${duration}ms)`);
}

export default Logger;
