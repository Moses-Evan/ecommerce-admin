import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import {
  isInvalidAdminSession,
  validateAdminSession,
} from "../../services/authService";

export default function RequireAdmin() {
  const { token, signOut } = useAuth();
  const location = useLocation();
  const [validatedPath, setValidatedPath] = useState<string | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    setValidatedPath(null);
    setValidationError(false);

    validateAdminSession(token)
      .then(() => {
        if (active) {
          setValidatedPath(location.pathname);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          if (isInvalidAdminSession(error)) {
            signOut();
          } else {
            setValidationError(true);
          }
        }
      });

    return () => {
      active = false;
    };
  }, [token, location.pathname, retryCount, signOut]);

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (validationError) {
    return (
      <div className="admin-session-enter flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center text-sm text-gray-500">
        <p role="alert" className="text-gray-700 dark:text-gray-300">
          Unable to verify your admin session. Check your connection and try again.
        </p>
        <button
          type="button"
          className="text-brand-500 transition-colors duration-200 hover:text-brand-600"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (validatedPath !== location.pathname) {
    return (
      <div className="admin-session-enter flex min-h-[40vh] flex-col items-center justify-center gap-4 text-sm text-gray-500">
        <span className="relative size-10" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-brand-500/10" />
          <span className="absolute inset-0 rounded-full border-2 border-brand-100 border-t-brand-500 motion-safe:animate-spin motion-reduce:animate-none dark:border-brand-500/20 dark:border-t-brand-400" />
        </span>
        <p role="status" aria-live="polite">
          Validating admin session...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-session-enter">
      <Outlet />
    </div>
  );
}
