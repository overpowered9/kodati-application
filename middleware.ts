import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import User from './database/models/user';
import { NextResponse } from 'next/server';
import moment from 'moment';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const user = request.nextauth.token?.user as User;
      if (user?.role !== 'admin') {
        return NextResponse.rewrite(new URL('/denied', request.url));
      }
    }
    if (request.nextUrl.pathname.startsWith('/merchant')) {
      const user = request.nextauth.token?.user as User;
      if (user?.role !== 'user') {
        return NextResponse.rewrite(new URL('/denied', request.url));
      }
    }
    if (request.nextUrl.pathname === '/merchant/link-products') { // chcek using ".includes()" method for other routes
      const user = request.nextauth.token?.user as User;
      if (user.access_token_expired) {
        const isExpired = moment(user.access_token_expired) <= moment();
        if (isExpired) {
          return NextResponse.rewrite(new URL('/merchant/session-expired', request.url));
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return Boolean(token);
      }
    }
  })

export const config = { matcher: ['/dashboard', '/products', '/admin/:path*', '/merchant/:path*', '/orders', '/statistics', '/settings'] };