import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // other wise it will be stuck in a redirect loop
  if (code && !req.url.includes('/auth/callback')) {
    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  }

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data, error } = await supabase.auth.getSession();

  return res;
}
