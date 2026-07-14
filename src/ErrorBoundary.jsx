import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-lg p-6 max-w-lg w-full text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600 mb-2">Configuration Required</h1>
            <p className="text-slate-600 mb-4">
              The application failed to load Clerk Authentication. This usually happens when the <code className="bg-slate-100 px-1 rounded text-slate-800">VITE_CLERK_PUBLISHABLE_KEY</code> in your <code className="bg-slate-100 px-1 rounded text-slate-800">.env.local</code> file is invalid or missing.
            </p>
            <div className="bg-slate-100 rounded text-left p-4 overflow-x-auto text-xs text-slate-700 font-mono mb-4">
              {this.state.error?.toString()}
            </div>
            <p className="text-sm text-slate-500">
              Please update your <code className="bg-slate-100 px-1 rounded text-slate-800">.env.local</code> file with your actual Publishable Key from the Clerk Dashboard and restart the development server.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
