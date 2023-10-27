/**
 * @swagger
 * /api/documents/search:
 *   post:
 *     summary: Search for similar documents
 *     description: Returns the documents that are contextually similar to the search term
 *     tags:
 *       - Documents
 *     requestBody:
 *       description: The search query and knowledge base ID
 *       required: true
 *     responses:
 *       200:
 *         description: Returns the documents that are contextually similar to the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '../../../../lib/public-api/auth';
import { supabaseExecute } from '../../../../lib/public-api/database';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const indexId = request.nextUrl.searchParams.get('index_id');
  if (!indexId) {
    return NextResponse.json(
      { error: 'Missing index_id query parameter' },
      { status: 400 }
    );
  }

  const search = request.nextUrl.searchParams.get('search');
  if (!search) {
    return NextResponse.json(
      { error: 'Missing search query parameter' },
      { status: 400 }
    );
  }

  const openAIEmbeddings = new OpenAIEmbeddings({ batchSize: 512 });
  const embeddings = await openAIEmbeddings.embedDocuments([search]);

  // Search for similar documents using cosine similarity
  const query = `
    select 1 - (embedding <=> '[${embeddings.toString()}]') as cosine_similarity, * 
    from documents
    where index_id = '${indexId}'
    order by cosine_similarity desc
    limit 3;
  `;

  const { data, error } = await supabaseExecute<Document>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}
