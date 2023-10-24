/**
 * @swagger
 * /api/chat/completions:
 *   post:
 *     summary: Get a response from the chat completions
 *     description: Returns a response from the specified model based on the provided messages
 *     tags:
 *       - Chat
 *     requestBody:
 *       description: The messages to send to the chatbot and the model to use
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: The message text
 *                     user:
 *                       type: string
 *                       description: The user ID
 *                   example:
 *                     text: "Hello, how are you?"
 *                     user: "123"
 *               model:
 *                 type: string
 *                 description: The name of the OpenAI model to use
 *                 example: "gpt-3.5-turbo"
 *     responses:
 *       200:
 *         description: Returns a response from the OpenAI chatbot
 *         content:
 *           application/json:
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
  knowledgeBaseId?: string;
  withMemory?: boolean;
}

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: app, error: authError } = await authApiKey(headers());

  if (!app || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { messages, model, knowledgeBaseId }: ChatCompletionRequest =
    await request.json();

  if (!availableModels.includes(model)) {
    return NextResponse.json(
      { error: `Model ${model} not found.` },
      { status: 400 }
    );
  }

  if (knowledgeBaseId && !messages.user.includes('{context}')) {
    const error = `The user message must include {context} placeholder to use a knowledge base.`;
    return NextResponse.json({ error }, { status: 400 });
  }

  let promptMessage = messages.user;
  if (knowledgeBaseId) {
    // If user specifies a knowledge base, we use RAG.
    const openAIEmbeddings = new OpenAIEmbeddings();
    const embeddings = await openAIEmbeddings.embedDocuments([messages.user]);

    const query = `
      select 1 - (embedding <=> '[${embeddings.toString()}]') as cosine_similarity, * 
      from documents
      where knowledge_base_id = '${knowledgeBaseId}'
      order by cosine_similarity desc
      limit 3;
    `;

    const { data, error } = await supabaseExecute<Document>(query);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const context = data[0]?.content || '';
    promptMessage = messages.user.replace('{context}', context);
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

  return NextResponse.json(response);
}
