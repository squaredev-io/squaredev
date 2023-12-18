import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return NextResponse.redirect(
      `${requestUrl.origin}?error=${error.message}`
    );
  }

  return NextResponse.redirect(`${requestUrl.origin}/thank-you`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
