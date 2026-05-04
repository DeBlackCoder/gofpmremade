import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[PROXY] Request to:', pathname);

  // Check if the request is for an admin route (but not /admin-login)
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin-login';
  
  if (isAdminRoute) {
    console.log('[PROXY] Admin route detected:', pathname);
    
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');
    console.log('[PROXY] Session cookie:', adminSession?.value);
    
    // If no session or not authenticated, redirect to login
    if (!adminSession || adminSession.value !== 'authenticated') {
      console.log('[PROXY] No valid session, redirecting to login');
      const loginUrl = new URL('/admin-login', request.url);
      // Add the original URL as a redirect parameter
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('[PROXY] Session valid, allowing access');
  }

  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
