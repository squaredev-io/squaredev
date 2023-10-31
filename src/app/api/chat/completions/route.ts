import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authApiKey } from '@/lib/public-api/auth';
import { AVAILABLE_MODELS, llm } from '@/lib/public-api/llm';
import { ChatCompletionRequestType } from '@/lib/public-api/validation';

// Add documents to a knowledge base
export async function POST(request: NextRequest) {
  const { data: project, error: authError } = await authApiKey(headers());

  if (!project || authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { messages, model }: ChatCompletionRequestType = await request.json();

  if (!AVAILABLE_MODELS.includes(model)) {
    return NextResponse.json(
      { error: `Model ${model} not found.` },
      { status: 400 }
    );
  }

  const response = await llm({
    message: messages.user,
    system: messages.system,
    model,
  });

  return NextResponse.json({
    message: response.choices[0].message.content,
    model: response.model,
  });
}
