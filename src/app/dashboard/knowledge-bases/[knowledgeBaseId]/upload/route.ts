import { NextRequest, NextResponse } from 'next/server';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { DocumentInsert } from '@/types/supabase-entities';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { knowledgeBaseId: string } }
) {
  // TODO: This should be also consider the api key
  const supabase = createRouteHandlerClient({ cookies });

  const formData = await request.formData();
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
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
    knowledge_base_id: params.knowledgeBaseId,
    source: file.name,
  }));

  const { data, error } = await supabase
    .from('documents')
    .insert(documentInsert)
    .select();

  if (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}
