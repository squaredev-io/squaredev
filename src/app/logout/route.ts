import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const logout = async () => {
  cookies().delete('access_token');
  redirect('/login');
};

export const GET = logout;
