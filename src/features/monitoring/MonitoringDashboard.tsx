import { env } from '@/config/env';
import { errorTracker } from '@/shared/utils/errorTracking';
import { performanceTracker } from '@/shared/utils/performance';
import { cache } from '@/shared/utils/redis';
import {
  Activity,
  AlertTriangle,
  Clock,
  Database,
  Globe,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MonitoringDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  isVisible,
  onClose,
}) => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isVisible]);

  const fetchData = async () => {
    try {
      // Get performance data
      const perfData = performanceTracker.getPerformanceSummary();
      setPerformanceData(perfData);

      // Get error data
      const errData = errorTracker.getErrorStats();
      setErrorData(errData);

      // Get cache stats
      const cacheData = await cache.getStats();
      setCacheStats(cacheData);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    }
  };

  if (!isVisible || !env.DEV_TOOLS) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="dark:bg-dark-100 max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Activity className="mr-2" />
            Performance Monitoring Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Web Vitals */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Zap className="mr-2 text-yellow-500" />
              Web Vitals
            </h3>
            {performanceData?.webVitals ? (
              <div className="space-y-2">
                {Object.entries(performanceData.webVitals).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {key.toUpperCase()}:
                      </span>
                      <span className="font-mono text-sm">
                        {value?.avg ? `${value.avg.toFixed(2)}ms` : 'N/A'}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
          </div>

          {/* Error Statistics */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <AlertTriangle className="mr-2 text-red-500" />
              Error Statistics
            </h3>
            {errorData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Errors:
                  </span>
                  <span className="font-mono text-sm">
                    {errorData.totalErrors}
                  </span>
                </div>
                {Object.entries(errorData.errorsBySeverity).map(
                  ([severity, count]: [string, any]) => (
                    <div key={severity} className="flex justify-between">
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                        {severity}:
                      </span>
                      <span className="font-mono text-sm">{count}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
          </div>

          {/* Cache Statistics */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Database className="mr-2 text-blue-500" />
              Cache Statistics
            </h3>
            {cacheStats ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span className="font-mono text-sm text-green-600">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Memory:
                  </span>
                  <span className="font-mono text-sm">Available</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Redis not available</p>
            )}
          </div>

          {/* Resource Performance */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Globe className="mr-2 text-green-500" />
              Resource Performance
            </h3>
            {performanceData?.resources ? (
              <div className="space-y-2">
                {Object.entries(performanceData.resources).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {key}:
                      </span>
                      <span className="font-mono text-sm">
                        {value?.avg ? `${value.avg.toFixed(2)}ms` : 'N/A'}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>

          {/* API Performance */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Clock className="mr-2 text-purple-500" />
              API Performance
            </h3>
            {performanceData?.api ? (
              <div className="space-y-2">
                {Object.entries(performanceData.api).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {key}:
                      </span>
                      <span className="font-mono text-sm">
                        {value?.avg ? `${value.avg.toFixed(2)}ms` : 'N/A'}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No API calls recorded</p>
            )}
          </div>

          {/* Memory Usage */}
          <div className="dark:bg-dark-200 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Activity className="mr-2 text-orange-500" />
              Memory Usage
            </h3>
            {performanceData?.memory ? (
              <div className="space-y-2">
                {Object.entries(performanceData.memory).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {key}:
                      </span>
                      <span className="font-mono text-sm">
                        {value?.avg
                          ? `${(value.avg / 1024 / 1024).toFixed(2)}MB`
                          : 'N/A'}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Memory data not available</p>
            )}
          </div>
        </div>

        {/* Recent Errors */}
        {errorData?.recentErrors && errorData.recentErrors.length > 0 && (
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h3 className="mb-3 text-lg font-semibold">Recent Errors</h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {errorData.recentErrors.map((error: any, index: number) => (
                <div
                  key={index}
                  className="rounded bg-red-50 p-3 text-sm dark:bg-red-900/20"
                >
                  <div className="font-semibold text-red-800 dark:text-red-200">
                    {error.error.message}
                  </div>
                  <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {error.context.component} • {error.severity} •{' '}
                    {new Date(error.context.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => errorTracker.clearErrors()}
              className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Clear Errors
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
