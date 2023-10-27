/**
 * @swagger
 * /api/indexes:
 *   get:
 *     summary: Get all indexes for a project
 *     description: Returns all indexes.
 *     tags:
 *       - Indexes
 *     responses:
 *       200:
 *         description: Returns all indexes associated with the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */

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
