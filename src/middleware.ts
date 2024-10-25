import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, getRoleRedirectPath } from './lib/auth-utils'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value

  const protectedPaths = ['/dashboard', '/profile', '/provider', '/admin']
  const authPaths = ['/auth/login', '/auth/register']
  
  const isAuthPath = authPaths.some(ap => path.startsWith(ap))
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp))

  try {
    const payload = token ? await verifyToken(token) : null
    const isAuthenticated = !!payload

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPath) {
      const redirectPath = getRoleRedirectPath(payload.role as string)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated && isProtectedPath) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/provider/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ],
}
