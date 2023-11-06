import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentInsert } from '../../../../types/supabase-entities';
import { supabaseExecute } from '../../../../lib/public-api/database';

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

  const formData = await request.formData();
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json(
      { error: 'Missing file in request body' },
      { status: 400 }
    );
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'File must be a pdf' }, { status: 400 });
  }

  const loader = new WebPDFLoader(file);

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    // TODO: This should be dynamic
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documents = await splitter.createDocuments(
    docs.map((doc) => doc.pageContent)
  );

  const openAIEmbeddings = new OpenAIEmbeddings({
    batchSize: 512, // Default value if omitted is 512. Max is 2048
  });

  const embeddings = await openAIEmbeddings.embedDocuments(
    documents.map((doc) => doc.pageContent)
  );

  const documentInsert: DocumentInsert[] = documents.map((doc, index) => ({
    embedding: embeddings[index] as unknown as string, // This is not right. The type generation from supabase is wrong here.
    content: doc.pageContent,
    metadata: doc.metadata.loc,
    index_id: indexId,
    source: file.name,
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
    return NextResponse.json({ data: formData, error }, { status: 400 });
  }

  return NextResponse.json(data);
}
