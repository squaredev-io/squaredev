'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const createApiKey = async (prevState: any, formData: FormData) => {
  const projectName = formData.get('name');
  const res = await fetch(`${process.env.PLATFORM_API}/users/api-key`, {
    method: 'POST',
    body: JSON.stringify({ name: projectName }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  if (res.status !== 201) {
    return {
      error: res.text(),
    };
  }

  // revalidatePath('/dashboard/projects');
  return redirect('/dashboard/projects');
};

export { createApiKey };
