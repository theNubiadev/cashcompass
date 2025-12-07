
export interface AuthUser{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse{
  message: string,
  user?: AuthUser;
}

export interface MeResponse { 
  user?: AuthUser;
}

export interface ApiError{
  error: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
}

// login
export async function login(values: {
  email: string; password: string
}): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data as LoginResponse;
}

// Register
export async function register(values: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data as ApiError;
  return data as RegisterResponse;
}

// GET CURRENT USER
export async function me(): Promise<{ user?: { id: string; firstName: string; lastName: string; email: string } }> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data as ApiError;
  return data as MeResponse;
}

export async function logout(): Promise<{message: string}> {
  const res = await fetch("/api/auth/logout",
    { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data as ApiError;
  return data as {message: string};
}
