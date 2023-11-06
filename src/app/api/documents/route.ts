import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { Document, DocumentInsert } from '@/types/supabase-entities';
import { supabaseExecute } from '@/lib/public-api/database';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { CreateDocumentRequestType } from '@/lib/public-api/validation';

// Get all documents from a index
export async function GET(request: NextRequest) {
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

  const query = `select id, content, metadata, index_id, source, user_id, created_at
   from documents where index_id = '${indexId}' limit 50;`;

  const { data, error } = await supabaseExecute<Document>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}

// Add documents to a index
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

  const documents = (await request.json()) as CreateDocumentRequestType;
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
    index_id: indexId,
    source: doc.source,
    user_id: project.user_id as string,
  }));

  const query = `
  INSERT INTO documents (embedding, content, metadata, index_id, source, user_id)
  VALUES ${documentInsert
    .map(
      (doc) =>
        `('[${doc.embedding.toString()}]', '${doc.content}', '${JSON.stringify(
          doc.metadata
        )}', '${doc.index_id}', '${doc.source}', '${doc.user_id}')`
    )
    .join(',')}
  RETURNING content, metadata, index_id, source, user_id, created_at, id;`;

  const { data, error } = await supabaseExecute<Document>(query);

  if (error) {
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json(data);
}
