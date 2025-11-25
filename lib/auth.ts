type LoginResponse = { message: string; user?: { id: string; firstName: string; lastName: string; email: string } };

export async function login(values: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export async function register(values: { firstName: string; lastName: string; email: string; phoneNumber?: string; password: string; confirmPassword: string }): Promise<any> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export async function me(): Promise<{ user?: { id: string; firstName: string; lastName: string; email: string } }> {
  const res = await fetch("/api/auth/me", { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export async function logout(): Promise<any> {
  const res = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}
