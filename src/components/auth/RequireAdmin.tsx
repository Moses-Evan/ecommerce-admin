import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  isInvalidAdminSession,
  validateAdminSession,
} from "../../services/authService";

export default function RequireAdmin({ children }: { children: ReactNode }) {
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-gray-500">
        <p role="alert">Unable to verify your admin session. Check your connection and try again.</p>
        <button
          type="button"
          className="text-brand-500 hover:text-brand-600"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (validatedPath !== location.pathname) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500" role="status">
        Validating admin session...
      </div>
    );
  }

  return children;
}
