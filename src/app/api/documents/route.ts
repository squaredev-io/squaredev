/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents from a knowledge base
 *     description: Returns all documents from the specified knowledge base
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: query
 *         name: knowledge_base_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the knowledge base to retrieve documents from
 *     responses:
 *       200:
 *         description: Returns all documents from the specified knowledge base
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
 *
 *   post:
 *     summary: Add documents to a knowledge base
 *     description: Adds new documents to the specified knowledge base
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: query
 *         name: knowledge_base_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the knowledge base to add documents to
 *     requestBody:
 *       description: The document content, source, and metadata
 *       required: true
 *     responses:
 *       200:
 *         description: Returns the inserted document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
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
import { authApiKey } from '@/lib/public-api/auth';
import { Document, DocumentInsert } from '@/types/supabase-entities';
import { supabaseExecute } from '@/lib/public-api/database';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

// Get all documents from a knowledge base
export async function GET(request: NextRequest) {
  const { data: app, error: authError } = await authApiKey(headers());

  if (!app || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const knowledgeBaseId = request.nextUrl.searchParams.get('knowledge_base_id');
  if (!knowledgeBaseId) {
    return NextResponse.json(
      { error: 'Missing knowledge_base_id query parameter' },
      { status: 400 }
    );
  }

  const query = `
    SELECT *
    FROM documents
    WHERE knowledge_base_id = '${knowledgeBaseId}'
  `;

  const { data, error } = await supabaseExecute<Document>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}

interface DocumentPostRequest {
  content: string;
  source: string;
  metadata: any;
}

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: app, error: authError } = await authApiKey(headers());

  if (!app || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const knowledgeBaseId = request.nextUrl.searchParams.get('knowledge_base_id');

  if (!knowledgeBaseId) {
    return NextResponse.json(
      { error: 'Missing knowledge_base_id query parameter' },
      { status: 400 }
    );
  }

  const documents = (await request.json()) as DocumentPostRequest[];
  // TODO: Validate documents

  if (!documents || !documents.length) {
    return NextResponse.json(
      { error: 'Missing documents in request body' },
      { status: 400 }
    );
  }

  const openAIEmbeddings = new OpenAIEmbeddings({
    batchSize: 512, // Default value if omitted is 512. Max is 2048
  });

  const embeddings = await openAIEmbeddings.embedDocuments(
    documents.map((doc) => doc.content)
  );

  const documentInsert: DocumentInsert[] = documents.map((doc, index) => ({
    embedding: embeddings[index] as unknown as string, // This is not right. The type generation from supabase is wrong here.
    content: doc.content,
    metadata: doc.metadata,
    knowledge_base_id: knowledgeBaseId,
    source: doc.source,
    user_id: app.user_id as string,
  }));

  const query = `
  INSERT INTO documents (embedding, content, metadata, knowledge_base_id, source, user_id)
  VALUES ${documentInsert
    .map(
      (doc) =>
        `('[${doc.embedding.toString()}]', '${doc.content}', '${JSON.stringify(
          doc.metadata
        )}', '${doc.knowledge_base_id}', '${doc.source}', '${doc.user_id}')`
    )
    .join(',')}
  RETURNING *`;

  const { data, error } = await supabaseExecute<Document>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}
