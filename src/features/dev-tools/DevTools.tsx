import { env } from '@/config/env';
import { MonitoringDashboard } from '@/features/monitoring';
import { errorTracker } from '@/shared/utils/errorTracking';
import { performanceTracker } from '@/shared/utils/performance';
import { Activity, Bug, Database, Settings, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (env.DEV_TOOLS && !isInitialized) {
      initializeDevTools();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const initializeDevTools = async () => {
    try {
      // Initialize error tracking
      await errorTracker.initialize();

      // Initialize performance tracking
      await performanceTracker.initialize();

      console.log('🛠️ Dev Tools initialized');
    } catch (error) {
      console.error('Failed to initialize dev tools:', error);
    }
  };

  // Keyboard shortcut to toggle dev tools
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D to toggle dev tools
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === 'D'
      ) {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Don't render in production unless explicitly enabled
  if (!env.DEV_TOOLS) {
    return null;
  }

  const triggerTestError = () => {
    try {
      throw new Error('Test error from DevTools');
    } catch (error) {
      errorTracker.captureError(
        error as Error,
        { component: 'DevTools', action: 'test-error' },
        'medium'
      );
    }
  };

  const clearCache = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      console.log('✅ Cache cleared');
      alert('Cache cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    }
  };

  const exportLogs = () => {
    const logs = {
      timestamp: new Date().toISOString(),
      performance: performanceTracker.getPerformanceSummary(),
      errors: errorTracker.getErrorStats(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        connection: (navigator as any).connection
          ? {
              effectiveType: (navigator as any).connection.effectiveType,
              downlink: (navigator as any).connection.downlink,
            }
          : null,
      },
    };

    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Dev Tools Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-purple-600 p-3 text-white shadow-lg transition-colors hover:bg-purple-700"
          title="Dev Tools (Ctrl+Shift+D)"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className="dark:bg-dark-100 fixed bottom-20 right-4 z-40 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dev Tools
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Monitoring Dashboard */}
            <button
              onClick={() => setShowMonitoring(true)}
              className="flex w-full items-center rounded bg-blue-100 px-3 py-2 text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
            >
              <Activity className="mr-2 h-4 w-4" />
              Performance Monitor
            </button>

            {/* Test Error */}
            <button
              onClick={triggerTestError}
              className="flex w-full items-center rounded bg-red-100 px-3 py-2 text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
            >
              <Bug className="mr-2 h-4 w-4" />
              Trigger Test Error
            </button>

            {/* Clear Cache */}
            <button
              onClick={clearCache}
              className="flex w-full items-center rounded bg-orange-100 px-3 py-2 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:hover:bg-orange-900/50"
            >
              <Database className="mr-2 h-4 w-4" />
              Clear Cache
            </button>

            {/* Export Logs */}
            <button
              onClick={exportLogs}
              className="flex w-full items-center rounded bg-green-100 px-3 py-2 text-green-800 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
            >
              <Zap className="mr-2 h-4 w-4" />
              Export Logs
            </button>

            {/* Environment Info */}
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>Environment: {env.NODE_ENV}</div>
                <div>Version: {env.APP_VERSION}</div>
                <div>Build: {import.meta.env.MODE}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                Quick Actions:
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Reload
                </button>
                <button
                  onClick={() => console.clear()}
                  className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Clear Console
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Dashboard Modal */}
      <MonitoringDashboard
        isVisible={showMonitoring}
        onClose={() => setShowMonitoring(false)}
      />
    </>
  );
};

export default DevTools;
