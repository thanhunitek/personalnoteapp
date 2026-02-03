import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the verify endpoint to be accessed without auth
  if (pathname === '/api/auth/verify') {
    return NextResponse.next();
  }

  // Check for auth cookie
  const isVerified = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

  // If not verified and accessing an API route, return 401
  if (!isVerified && pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For page routes, let the page handle showing the PIN screen
  // by passing auth status via a header that the page can check
  const response = NextResponse.next();
  response.headers.set('x-pin-verified', isVerified ? 'true' : 'false');
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
