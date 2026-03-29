'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
              <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-10 leading-relaxed">
              We encountered an unexpected error. This might be due to a connection issue or a temporary glitch.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <RefreshCcw size={20} />
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-secondary rounded-xl text-left text-xs text-red-500 overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
