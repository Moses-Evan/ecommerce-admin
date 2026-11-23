import axios from "axios";
import { API_ORIGIN } from "./api";

interface LoginResponse {
  token?: unknown;
  role?: unknown;
}

interface CurrentUser {
  roles?: Array<string | { authority?: string }>;
}

function hasAdminRole(user: CurrentUser) {
  return user.roles?.some((role) =>
    typeof role === "string"
      ? role === "ROLE_ADMIN"
      : role.authority === "ROLE_ADMIN",
  ) ?? false;
}

const authApi = axios.create({
  baseURL: API_ORIGIN,
  headers: { "Content-Type": "application/json" },
});

export async function loginAdmin(username: string, password: string) {
  const { data } = await authApi.post<LoginResponse>("/api/auth/login", {
    username,
    password,
  });

  if (typeof data.token !== "string" || data.role !== "ROLE_ADMIN") {
    throw new Error("Invalid username or password.");
  }

  const user = await validateAdminSession(data.token);
  return { token: data.token, user };
}

export async function validateAdminSession(token: string) {
  const { data } = await authApi.get<CurrentUser>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!hasAdminRole(data)) {
    throw new Error("This account is not authorized to access the admin area.");
  }

  return data;
}

export function isInvalidAdminSession(error: unknown) {
  return (
    (axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)) ||
    (error instanceof Error &&
      error.message === "This account is not authorized to access the admin area.")
  );
}

export function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Invalid username or password.";
    }

    if (!error.response) {
      return "Unable to reach the authentication server. Please try again.";
    }
  }

  return error instanceof Error ? error.message : "Sign in failed. Please try again.";
}
