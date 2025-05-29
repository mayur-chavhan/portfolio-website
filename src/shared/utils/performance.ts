/**
 * Performance monitoring and optimization utilities
 * Provides tools for measuring and optimizing application performance
 */

import { errorTracker } from '@/shared/utils/errorTracking';
import { logger, performanceMonitor } from '@/shared/utils/logger';
import React from 'react';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  context?: Record<string, any>;
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  // Performance thresholds
  private readonly thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Web Vitals monitoring
      this.initializeWebVitals();

      // Initialize resource timing monitoring
      this.initializeResourceTiming();

      // Initialize navigation timing
      this.initializeNavigationTiming();

      // Initialize memory monitoring
      this.initializeMemoryMonitoring();

      this.isInitialized = true;
      logger.info('Performance tracking initialized');
    } catch (error) {
      logger.error(
        'Failed to initialize performance tracking',
        undefined,
        error as Error
      );
    }
  }

  private initializeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', entries => {
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime: number;
        loadTime: number;
      };
      const value = lastEntry.renderTime || lastEntry.loadTime;
      this.recordWebVital('LCP', value);
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', entries => {
      const firstEntry = entries[0] as PerformanceEntry & {
        processingStart: number;
      };
      const value = firstEntry.processingStart - firstEntry.startTime;
      this.recordWebVital('FID', value);
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', entries => {
      for (const entry of entries as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.recordWebVital('CLS', clsValue);
    });

    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', entries => {
      const fcpEntry = entries.find(
        entry => entry.name === 'first-contentful-paint'
      );
      if (fcpEntry) {
        this.recordWebVital('FCP', fcpEntry.startTime);
      }
    });
  }

  private observePerformanceEntry(
    type: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver(list => {
        callback(list.getEntries());
      });

      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      logger.warn(`Failed to observe ${type} performance entries`, { error });
    }
  }

  private recordWebVital(name: WebVitalsMetric['name'], value: number): void {
    const threshold = this.thresholds[name];
    let rating: WebVitalsMetric['rating'] = 'good';

    if (threshold) {
      if (value > threshold.poor) {
        rating = 'poor';
      } else if (value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    this.recordMetric({
      name: `webvital.${name.toLowerCase()}`,
      value,
      unit: name === 'CLS' ? 'count' : 'ms',
      timestamp: Date.now(),
      context: { rating, threshold },
    });

    // Report poor performance
    if (rating === 'poor') {
      errorTracker.capturePerformanceIssue(
        name,
        value,
        threshold?.poor || value,
        { component: 'WebVitals', action: 'poor-performance' }
      );
    }

    logger.info(`Web Vital recorded: ${name} = ${value}ms (${rating})`);
  }

  private initializeResourceTiming(): void {
    this.observePerformanceEntry('resource', entries => {
      for (const entry of entries as PerformanceResourceTiming[]) {
        const duration = entry.responseEnd - entry.startTime;

        this.recordMetric({
          name: 'resource.load_time',
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          context: {
            url: entry.name,
            type: this.getResourceType(entry),
            size: entry.transferSize,
          },
        });

        // Alert on slow resources
        if (duration > 5000) {
          logger.warn('Slow resource detected', {
            url: entry.name,
            duration,
            size: entry.transferSize,
          });
        }
      }
    });
  }

  private initializeNavigationTiming(): void {
    this.observePerformanceEntry('navigation', entries => {
      const entry = entries[0] as PerformanceNavigationTiming;

      const metrics = {
        'navigation.dns_lookup':
          entry.domainLookupEnd - entry.domainLookupStart,
        'navigation.tcp_connect': entry.connectEnd - entry.connectStart,
        'navigation.request': entry.responseStart - entry.requestStart,
        'navigation.response': entry.responseEnd - entry.responseStart,
        'navigation.dom_processing':
          entry.domContentLoadedEventStart - entry.responseEnd,
        'navigation.load_complete': entry.loadEventEnd - entry.loadEventStart,
      };

      for (const [name, value] of Object.entries(metrics)) {
        this.recordMetric({
          name,
          value,
          unit: 'ms',
          timestamp: Date.now(),
        });
      }
    });
  }

  private initializeMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;

        this.recordMetric({
          name: 'memory.used',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          timestamp: Date.now(),
        });

        this.recordMetric({
          name: 'memory.total',
          value: memory.totalJSHeapSize,
          unit: 'bytes',
          timestamp: Date.now(),
        });

        // Alert on high memory usage
        const usagePercentage =
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercentage > 80) {
          logger.warn('High memory usage detected', {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            percentage: usagePercentage,
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private getResourceType(entry: PerformanceResourceTiming): string {
    const url = new URL(entry.name);
    const extension = url.pathname.split('.').pop()?.toLowerCase();

    if (['js', 'mjs'].includes(extension || '')) return 'script';
    if (['css'].includes(extension || '')) return 'stylesheet';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || ''))
      return 'image';
    if (['woff', 'woff2', 'ttf', 'eot'].includes(extension || ''))
      return 'font';

    return 'other';
  }

  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    performanceMonitor.recordMetric(metric.name, metric.value);

    // Keep metrics array manageable
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  // Manual timing utilities
  startTiming(label: string): () => number {
    return performanceMonitor.startTimer(label);
  }

  // Component performance tracking
  trackComponentRender(componentName: string): () => void {
    const endTimer = this.startTiming(`component.${componentName}.render`);

    return () => {
      const duration = endTimer();

      if (duration > 16) {
        // More than one frame at 60fps
        logger.warn(`Slow component render: ${componentName}`, { duration });
      }
    };
  }

  // API call performance tracking
  trackApiCall(method: string, url: string): () => void {
    const endTimer = this.startTiming(`api.${method.toLowerCase()}`);

    return () => {
      const duration = endTimer();

      this.recordMetric({
        name: 'api.response_time',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        context: { method, url },
      });

      if (duration > 5000) {
        logger.warn('Slow API call detected', { method, url, duration });
      }
    };
  }

  // Get performance summary
  getPerformanceSummary(): {
    webVitals: Record<string, any>;
    resources: Record<string, any>;
    memory: Record<string, any>;
    api: Record<string, any>;
  } {
    const webVitals = performanceMonitor.getAllMetrics();

    return {
      webVitals: Object.keys(webVitals)
        .filter(key => key.startsWith('webvital.'))
        .reduce(
          (acc, key) => {
            acc[key.replace('webvital.', '')] = webVitals[key];
            return acc;
          },
          {} as Record<string, any>
        ),

      resources: Object.keys(webVitals)
        .filter(key => key.startsWith('resource.'))
        .reduce(
          (acc, key) => {
            acc[key.replace('resource.', '')] = webVitals[key];
            return acc;
          },
          {} as Record<string, any>
        ),

      memory: Object.keys(webVitals)
        .filter(key => key.startsWith('memory.'))
        .reduce(
          (acc, key) => {
            acc[key.replace('memory.', '')] = webVitals[key];
            return acc;
          },
          {} as Record<string, any>
        ),

      api: Object.keys(webVitals)
        .filter(key => key.startsWith('api.'))
        .reduce(
          (acc, key) => {
            acc[key.replace('api.', '')] = webVitals[key];
            return acc;
          },
          {} as Record<string, any>
        ),
    };
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const performanceTracker = PerformanceTracker.getInstance();

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    const endTracking = performanceTracker.trackComponentRender(componentName);
    return endTracking;
  });
}

// HOC for component performance tracking
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const name =
    componentName || Component.displayName || Component.name || 'Unknown';

  const PerformanceTrackedComponent: React.FC<T> = (props: T) => {
    const endTracking = performanceTracker.trackComponentRender(name);

    React.useEffect(() => {
      return endTracking;
    });

    return React.createElement(Component, props);
  };

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${name})`;

  return PerformanceTrackedComponent;
}

export default PerformanceTracker;
