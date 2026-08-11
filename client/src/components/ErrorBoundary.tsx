import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen-safe flex-col items-center justify-center bg-background px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-danger">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. Try reloading the page — if this keeps happening, please get in touch.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reload page
        </button>
      </div>
    );
  }
}
