/**
 * @swagger
 * /api/knowledge-bases:
 *   get:
 *     summary: Get all knowledge bases for an app
 *     description: Returns all knowledge bases associated with the specified app
 *     tags:
 *       - Knowledge Bases
 *     responses:
 *       200:
 *         description: Returns all knowledge bases associated with the specified app
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
import { KnowledgeBase } from '@/types/supabase-entities';

export async function GET(request: NextRequest) {
  const { data: app, error: authError } = await authApiKey(headers());

  if (!app || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const query = `
    SELECT knowledge_bases.*
    FROM knowledge_bases
    JOIN apps_knowledge_bases ON knowledge_bases.id = apps_knowledge_bases.knowledge_base_id
    JOIN apps ON apps_knowledge_bases.app_id = apps.id
    WHERE apps.api_key = '${app.api_key}'
  `;

  const { data, error } = await supabaseExecute<KnowledgeBase>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}
