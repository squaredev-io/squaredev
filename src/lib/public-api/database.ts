import { Client } from 'pg';

export interface ResultError {
  data: null;
  error: {
    code: string;
    hint: string;
    message: string;
  };
}

export interface ResultSuccess<T> {
  data: T;
  error: null;
}

export type Result<T> = ResultSuccess<T> | ResultError;

export async function supabaseExecute<T>(
  query: string,
  parameters: any[] = []
): Promise<Result<T[]>> {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:54322/postgres',
  });
  try {
    await client.connect();
    const result = await client.query(query, parameters);
    await client.end();

    return { data: result.rows, error: null };
  } catch (err: any) {
    console.error('Error executing query: ', query, parameters);
    console.error(err);
    await client.end();

    return {
      data: null,
      error: { code: err.code, hint: err.hint, message: err.message },
    };
  }
}
