import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { OpenAI } from 'openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { supabaseExecute } from '@/lib/public-api/database';
import { Document } from '@/types/supabase-entities';
import { AVAILABLE_MODELS, llm } from '@/lib/public-api/llm';
import { RagCompletionRequestType } from '@/lib/public-api/validation';

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { messages, model, indexId }: RagCompletionRequestType =
    await request.json();

  if (!AVAILABLE_MODELS.includes(model)) {
    return NextResponse.json(
      { error: `Model ${model} not found.` },
      { status: 400 }
    );
  }

  if (indexId && !messages.user.includes('{context}')) {
    const error = `The user message must include {context} placeholder to use an index.`;
    return NextResponse.json({ error }, { status: 400 });
  }

  let promptMessage = messages.user;
  let sources: Document[] = [];
  if (indexId) {
    // If user specifies a knowledge base, we use RAG.
    const openAIEmbeddings = new OpenAIEmbeddings();
    const embeddings = await openAIEmbeddings.embedDocuments([messages.user]);

    const query = `
      select 1 - (embedding <=> '[${embeddings.toString()}]') as similarity, content, id, metadata, source
      from documents
      where index_id = '${indexId}'
      order by similarity desc
      limit 3;
    `;

    const { data: relevantDocuments, error } = await supabaseExecute<Document>(
      query
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const context = relevantDocuments[0]?.content || '';
    promptMessage = messages.user.replace('{context}', context);
    sources = [...relevantDocuments];
  }

  const response = await llm({
    message: promptMessage,
    system: messages.system,
    model,
  });

  return NextResponse.json({
    message: response.choices[0].message.content,
    model: response.model,
    sources,
  });
}
