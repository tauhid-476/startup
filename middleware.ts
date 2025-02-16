import { NextRequest, NextResponse } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  //if user is sign-in and still trying to access the sign in page we redierct them to home page
  //for this check if user is already signed in by token and see where te use is tryimg to go by url

  const token = await getToken({ req: request })
  const url = request.nextUrl
  if (
    token && (
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/login')
    )
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/startups')))  {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  return NextResponse.next();
  
}



export const config = {
  matcher: [
    '/register',
    '/',
    '/login',
    '/dashboard/:path*',
    '/startups/:path*'
  ]
}