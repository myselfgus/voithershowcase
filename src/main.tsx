import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import '@/index.css';
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
export const PageLoader = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-healthos-porcelain">
    <div className="w-16 h-16 border-4 border-healthos-ice border-t-healthos-prism-start rounded-full animate-spin"></div>
  </div>
);
export const AnimatedOutlet = () => (
  <AnimatePresence mode="wait">
    <Outlet />
  </AnimatePresence>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <AnimatedOutlet />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "dashboard/*",
        element: (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        ),
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