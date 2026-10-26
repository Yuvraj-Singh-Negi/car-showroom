'use client';

import React from 'react';

interface ModelErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (path: string, error: unknown) => void;
}

interface State {
  hasError: boolean;
  error: unknown;
  path: string | null;
}

/**
 * Error boundary for Three.js / React Three Fiber model failures.
 * Catches rendering errors thrown by asynchronous GLB loading so a
 * missing model cannot break the whole page.
 */
class ModelErrorBoundary extends React.Component<
  ModelErrorBoundaryProps,
  State
> {
  state: State = {
    hasError: false,
    error: null,
    path: null,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true, error: null, path: null };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(errorInfo.componentStack ?? 'unknown', error);
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('[AURA] 3D model render error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default ModelErrorBoundary;
