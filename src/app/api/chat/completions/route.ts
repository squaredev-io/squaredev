import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { OpenAI } from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const availableModels = ['gpt-3.5-turbo'];

interface ChatCompletionRequest {
  messages: {
    system?: string;
    user: string;
  };
  model: string;
}

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { messages, model }: ChatCompletionRequest = await request.json();

  if (!availableModels.includes(model)) {
    return NextResponse.json(
      { error: `Model ${model} not found.` },
      { status: 400 }
    );
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
        content: messages.user,
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
  });
}
