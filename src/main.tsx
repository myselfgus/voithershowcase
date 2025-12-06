import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { useRoleStore, UserRole } from '@/stores/useRoleStore';
import { RoleSelector } from '@/components/RoleSelector';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import '@/index.css';
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
export const PageLoader = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-healthos-porcelain dark:bg-healthos-ink">
    <div className="w-16 h-16 border-4 border-healthos-ice border-t-healthos-prism-start rounded-full animate-spin"></div>
  </div>
);
export const AnimatedOutlet = () => (
  <AnimatePresence mode="wait">
    <Outlet />
  </AnimatePresence>
);
function AppInitializer({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const setRole = useRoleStore((state) => state.setRole);
  const [showSelector, setShowSelector] = useState(false);
  useEffect(() => {
    const initialRole = searchParams.get('role');
    if (initialRole && ['patient', 'professional', 'service'].includes(initialRole)) {
      setRole(initialRole as UserRole);
    } else if (!localStorage.getItem('voither-healthos-role')) {
      setRole('professional'); // Default to professional
      setShowSelector(true);
    }
  }, [searchParams, setRole]);
  if (showSelector) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-healthos-porcelain dark:bg-healthos-ink">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 p-8 rounded-2xl glass-card-styles"
        >
          <h1 className="text-2xl font-bold font-display">Selecione seu Ponto de Vista</h1>
          <p className="text-muted-foreground max-w-sm text-center">
            A interface do HealthOS se adapta à sua função. Escolha um papel para começar.
          </p>
          <RoleSelector />
          <Button onClick={() => setShowSelector(false)}>Entrar no HealthOS</Button>
        </motion.div>
      </div>
    );
  }
  return <>{children}</>;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppInitializer>
        <AppLayout>
          <AnimatedOutlet />
        </AppLayout>
      </AppInitializer>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard/*",
        element: <Dashboard />,
      },
      { path: "*", element: <Navigate to="/dashboard" replace /> }
    ]
  }
]);
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
          <Toaster richColors />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>,
  );
}