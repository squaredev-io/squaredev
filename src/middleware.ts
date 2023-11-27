import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const whoami = await fetch(`${process.env.PLATFORM_API!}/users/whoami`, {
    headers: {
      Authorization: `Bearer ${req.cookies.get('access_token')?.value}`,
    },
  });

  if (whoami.status !== 200) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: '/dashboard/:path*',
};
