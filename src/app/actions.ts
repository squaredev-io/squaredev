'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import bcrypt from 'bcrypt';
import { Database } from '@/types/supabase';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

export const createProject = async (prevState: any, formData: FormData) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const name = formData.get('project-name') as string;
  const description = formData.get('project-description') as string;

  const apiKey = await generateApiKey();

  const salt = await bcrypt.genSalt(10);
  const encryptedApiKey = await bcrypt.hash(apiKey, salt);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not found' };
  }

  try {
    const results = await supabase
      .from('projects')
      .insert({ name, description, api_key: encryptedApiKey, user_id: user.id })
      .select();

    if (results.error) {
      throw `Error fetching data: projects: ${results.error?.message}`;
    }

    return { success: true, api_key: apiKey };
  } catch (error: any) {
    console.log(error);
    return { error };
  }
};

export const deleteProject = async (prevState: any, formData: FormData) => {
  const projectId = formData.get('project-id') as string;
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    const results = await supabase
      .from('projects')
      .delete()
      .match({ id: projectId })
      .select();

    if (results.error) {
      throw `Error fetching data: projects: ${results.error?.message}`;
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};
