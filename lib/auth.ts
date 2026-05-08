import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'meigong_auth';

const DEFAULT_LOGIN_PASSWORD = 'csch9001';
const DEFAULT_AUTH_TOKEN = 'meigong-authenticated';

export function isValidLoginPassword(password: string): boolean {
  const expectedPassword = process.env.APP_LOGIN_PASSWORD || DEFAULT_LOGIN_PASSWORD;
  return password === expectedPassword;
}

export function getAuthToken(): string {
  return process.env.APP_AUTH_TOKEN || DEFAULT_AUTH_TOKEN;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value === getAuthToken();
}
