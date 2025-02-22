import { NextRequest, NextResponse } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'

export async function middleware(request: NextRequest) {
  //if user is sign-in and still trying to access the sign in page we redierct them to home page
  //for this check if user is already signed in by token and see where te use is tryimg to go by url

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET! })
  const url = request.nextUrl
  if (
    token && (
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/login')
    )
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(token?.role === "FOUNDER" && url.pathname === "/startups"){
    return NextResponse.redirect(new URL('/', request.url))
  }

  const currentUserid = token?.id as string


  

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