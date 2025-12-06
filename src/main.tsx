import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { StageViewer } from '@/pages/StageViewer';
import { ScriptEditor } from '@/pages/ScriptEditor';
import { Marketplace } from '@/pages/Marketplace';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/stages",
    element: <StageViewer />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/scripts",
    element: <ScriptEditor />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)