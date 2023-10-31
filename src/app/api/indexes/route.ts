import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { authApiKey } from '@/lib/public-api/auth';
import { supabaseExecute } from '@/lib/public-api/database';
import { Index } from '@/types/supabase-entities';

export async function GET(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const query = `select * from indexes where project_id = '${project.id}'`;

  const { data, error } = await supabaseExecute<Index>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { name } = await request.json();

  const query = `insert into indexes (name, project_id, user_id) 
    values ('${name}', '${project.id}', '${project.user_id}') returning *`;

  const { data, error } = await supabaseExecute<Index>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data[0]);
}
