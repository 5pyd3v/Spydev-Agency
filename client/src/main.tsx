import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './index.css';
import { router } from './routes/router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider>
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-right"
                theme="system"
                toastOptions={{
                  classNames: {
                    toast: 'rounded-2xl border border-border bg-surface text-foreground shadow-soft',
                  },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
