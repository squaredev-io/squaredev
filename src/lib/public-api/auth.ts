import { App } from '@/types/supabase-entities';
import { Result, supabaseExecute } from './database';

export function getApiKey(headers: any) {
  const authorization = headers.get('authentication');
  if (!authorization) {
    return null;
  }

  const [type, key] = authorization.split(' ');
  if (type !== 'Bearer') {
    return null;
  }

  return key;
}

export async function authApiKey(headers: any): Promise<Result<App>> {
  const apiKey = getApiKey(headers);
  if (!apiKey) {
    return {
      data: null,
      error: {
        code: '401',
        hint: 'Did you forget to add headers?',
        message: 'No Bearer token found in Headers',
      },
    };
  }

  const query = `select * from apps where api_key = '${apiKey}'`;
  const { data, error } = await supabaseExecute<App>(query);
  if (error) {
    return { data, error };
  }

  if (!data.length) {
    return {
      data: null,
      error: {
        code: '401',
        hint: '',
        message: 'App not found.',
      },
    };
  }

  return { data: data[0], error: null };
}
