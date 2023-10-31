import { OpenAI } from 'openai';

const openAIModels = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k	'];
const anyScaleModels = [
  'mistralai/Mistral-7B-Instruct-v0.1',
  'meta-llama/Llama-2-7b-chat-hf',
  'meta-llama/Llama-2-13b-chat-hf',
  'meta-llama/Llama-2-70b-chat-hf',
];

export const AVAILABLE_MODELS = [anyScaleModels, ...openAIModels];

interface LlmOptions {
  system: string | undefined;
  message: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  model?: string;
}

export async function llm({
  message,
  system = '',
  temperature = 0.7,
  max_tokens = 500,
  stream = false,
  model = 'mistralai/Mistral-7B-Instruct-v0.1',
}: LlmOptions): Promise<OpenAI.Chat.ChatCompletion> {
  const llm = anyScaleModels.includes(model)
    ? // AnyScale is compatible with Open AI API. So all we have to do is change the base API URL.
      new OpenAI({
        baseURL: process.env.ANYSCALE_API_BASE!,
        apiKey: process.env.ANYSCALE_API_KEY!,
      })
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const response = await llm.chat.completions.create({
    model,
    stream,
    messages: [
      {
        role: 'system',
        content: system,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens,
    temperature,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  return response as OpenAI.Chat.ChatCompletion;
}
