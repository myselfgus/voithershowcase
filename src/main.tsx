import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, lazy, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { useRoleStore, UserRole } from '@/stores/useRoleStore';
import '@/index.css';
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
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
  useEffect(() => {
    const initialRole = searchParams.get('role');
    if (initialRole && ['patient', 'professional', 'service'].includes(initialRole)) {
      setRole(initialRole as UserRole);
    }
  }, [searchParams, setRole]);
  return <>{children}</>;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppInitializer><AnimatedOutlet /></AppInitializer>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "dashboard/*",
        element: <Dashboard />,
      },
      { path: "*", element: <Navigate to="/" replace /> }
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
        </Suspense>
      </ErrorBoundary>
    </StrictMode>,
  );
}