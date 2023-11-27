'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const signup = async (prevState: any, formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    };
  }

  const response = await fetch(`${process.env.PLATFORM_API!}/users/sign-up`, {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 201) {
    return {
      error: await response.text(),
    };
  }

  const signinFormData = new FormData();
  signinFormData.append('email', email);
  signinFormData.append('password', password);
  return await signin(prevState, signinFormData);
};

const signin = async (prevState: any, formData: FormData) => {
  formData.set('username', formData.get('email') as string);
  formData.delete('email');

  const signinResponse = await fetch(
    `${process.env.PLATFORM_API!}/users/sign-in`,
    {
      method: 'POST',
      body: new URLSearchParams(formData as any),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (signinResponse.status !== 200) {
    return {
      error: await signinResponse.text(),
    };
  }

  const { access_token } = await signinResponse.json();
  cookies().set('access_token', access_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect('/dashboard');
};

export { signup, signin };
