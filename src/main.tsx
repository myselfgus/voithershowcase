import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import '@/index.css';
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const StageViewer = lazy(() => import('@/pages/StageViewer').then(module => ({ default: module.StageViewer })));
const ScriptEditor = lazy(() => import('@/pages/ScriptEditor').then(module => ({ default: module.ScriptEditor })));
const Marketplace = lazy(() => import('@/pages/Marketplace').then(module => ({ default: module.Marketplace })));
const PageLoader = () => (
  <div className="w-screen h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-healthos-ice border-t-healthos-prism-start rounded-full animate-spin"></div>
  </div>
);
const AnimatedOutlet = () => (
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
      { path: "/stages", element: <StageViewer /> },
      { path: "/scripts", element: <ScriptEditor /> },
      { path: "/marketplace", element: <Marketplace /> },
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
export { PageLoader, AnimatedOutlet };