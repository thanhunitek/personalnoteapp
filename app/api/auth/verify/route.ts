import { NextRequest, NextResponse } from 'next/server';
import { verifyPin, AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    const storedHash = process.env.APP_PIN_HASH;
    if (!storedHash) {
      console.error('APP_PIN_HASH environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const isValid = await verifyPin(pin, storedHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return NextResponse.json(
      { error: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
