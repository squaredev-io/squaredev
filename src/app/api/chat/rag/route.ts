import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { OpenAI } from 'openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { supabaseExecute } from '@/lib/public-api/database';
import { Document } from '@/types/supabase-entities';
// import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const availableModels = ['gpt-3.5-turbo'];

interface ChatCompletionRequest {
  messages: {
    system?: string;
    user: string;
  };
  model: string;
  indexId?: string;
  withMemory?: boolean;
}

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { messages, model, indexId }: ChatCompletionRequest =
    await request.json();

  if (!availableModels.includes(model)) {
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

  const response = await openai.chat.completions.create({
    model: model || 'gpt-3.5-turbo',
    stream: false,
    messages: [
      {
        role: 'system',
        content: messages.system || '',
      },
      {
        role: 'user',
        content: promptMessage,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  return NextResponse.json({
    message: response.choices[0].message.content,
    model: response.model,
    sources,
  });
}
