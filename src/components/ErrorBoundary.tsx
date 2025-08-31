import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  storageKey?: string;
  onReset?: () => void;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  failCount: number;
  resetNonce: number;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static MAX_FAIL_COUNT = 2;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, failCount: 0, resetNonce: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, { componentStack: errorInfo.componentStack || '' });
    }

    this.setState((prevState) => ({
      errorInfo: errorInfo,
      failCount: prevState.failCount + 1,
    }));
  }

  handleReset = () => {
    // Clear persisted state
    if (this.props.storageKey) {
      try {
        localStorage.removeItem(this.props.storageKey);
      } catch (e) {
        console.error('Failed to clear localStorage key:', this.props.storageKey, e);
      }
    }

    if (this.props.onReset) {
      this.props.onReset();
    }

    // Reset the error boundary state to remount the children
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      resetNonce: prevState.resetNonce + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const showReloadRecommendation = this.state.failCount > ErrorBoundary.MAX_FAIL_COUNT;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 rounded-lg shadow-md text-red-800">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="mb-6">We're sorry, but an unexpected error occurred.</p>

          {showReloadRecommendation && (
            <p className="text-red-600 font-semibold mb-4">
              It seems the error is persistent. You might need to reload the page.
            </p>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Reload
            </button>
          </div>

          {this.state.errorInfo && (
            <details className="mt-8 p-4 bg-red-100 rounded-md text-sm text-red-900 max-w-lg overflow-auto">
              <summary className="font-semibold cursor-pointer">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // Use resetNonce to force remounting of children on reset
    return <React.Fragment key={this.state.resetNonce}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;
