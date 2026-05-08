import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getAuthToken,
  isValidLoginPassword,
} from '@/lib/auth';

interface LoginRequest {
  password?: string;
}

export async function POST(request: NextRequest) {
  const body: LoginRequest = await request.json().catch(() => ({}));

  if (!body.password || !isValidLoginPassword(body.password)) {
    return NextResponse.json(
      { success: false, error: '密码错误' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, getAuthToken(), getAuthCookieOptions());
  return response;
}
