import { useCallback, useMemo, useState, type ReactNode } from "react";
import { loginAdmin } from "../services/authService";
import { setApiAuthToken } from "../services/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const signIn = useCallback(async (username: string, password: string) => {
    const session = await loginAdmin(username, password);
    setApiAuthToken(session.token);
    setToken(session.token);
  }, []);

  const signOut = useCallback(() => {
    setApiAuthToken(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({ token, signIn, signOut }), [token, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
