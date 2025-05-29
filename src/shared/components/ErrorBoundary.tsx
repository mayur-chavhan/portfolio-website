import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Here you could also log the error to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="dark:bg-dark-200 flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="dark:bg-dark-100 w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mb-4 flex justify-center">
              <AlertTriangle className="text-error-500 h-12 w-12" />
            </div>

            <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Oops! Something went wrong
            </h1>

            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 flex w-full items-center justify-center rounded-md px-4 py-2 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="dark:bg-dark-200 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Error Details (Development)
                </summary>
                <div className="dark:bg-dark-200 mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-3 font-mono text-xs text-gray-800 dark:text-gray-200">
                  <div className="mb-2 font-semibold">Error:</div>
                  <div className="mb-2">{this.state.error.toString()}</div>
                  {this.state.errorInfo && (
                    <>
                      <div className="mb-2 font-semibold">Component Stack:</div>
                      <div>{this.state.errorInfo.componentStack}</div>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
