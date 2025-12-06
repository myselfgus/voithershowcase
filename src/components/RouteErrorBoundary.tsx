import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { ErrorFallback } from './ErrorFallback';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Oops! Something went wrong";
  let message = "We're aware of the issue and actively working to fix it.";
  let errorDetails: Error | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you're looking for doesn't exist or has been moved.";
    } else if (error.status === 401) {
      title = "Unauthorized";
      message = "You need to be logged in to access this page.";
    } else if (error.status === 403) {
      title = "Access Denied";
      message = "You don't have permission to access this page.";
    } else if (error.status === 503) {
      title = "Service Unavailable";
      message = "The service is temporarily unavailable. Please try again later.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || "An unexpected error occurred.";
    }
  } else if (error instanceof Error) {
    errorDetails = error;
    message = error.message;
  }

  return (
    <ErrorFallback
      title={title}
      message={message}
      error={errorDetails}
      onRetry={() => window.location.reload()}
      onGoHome={() => navigate('/')}
    />
  );
}