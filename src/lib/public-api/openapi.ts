import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  CreateDocumentRequest,
  CreateIndexRequest,
  CreateIndexResponse,
  ErrorResponse,
  GetIndexesResponse,
  RagCompletionRequest,
  RagCompletionResponse,
  SimilarDocumentsResponse,
} from './validation';
import { ZodSchema, ZodType, ZodTypeDef } from 'zod';

const errorResponse = {
  400: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: ErrorResponse,
      },
    },
  },
};

const request = (
  schema: ZodType<any, ZodTypeDef, any>,
  description: string = ''
) => ({
  body: {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  },
});

const response = (
  schema: ZodType<any, ZodTypeDef, any>,
  description: string = ''
) => ({
  200: {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  },
});

// Docs: https://www.npmjs.com/package/@asteasolutions/zod-to-openap
export const publicAPIRegistry = new OpenAPIRegistry();

const bearerAuth = publicAPIRegistry.registerComponent(
  'securitySchemes',
  'bearerAuth',
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Bearer',
  }
);

publicAPIRegistry.registerPath({
  method: 'get',
  path: '/indexes',
  tags: ['Indexes'],
  description: 'Get all indexes',
  summary: 'Get all indexes',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    ...response(GetIndexesResponse, 'Array with all the indexes'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/indexes',
  tags: ['Indexes'],
  description: 'Create new index',
  summary: 'Create new index',
  security: [{ [bearerAuth.name]: [] }],
  request: request(CreateIndexRequest, 'The index name'),
  responses: {
    ...response(CreateIndexResponse, 'The newly created index'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/indexes/search',
  tags: ['Indexes'],
  description: 'Contextually search an index',
  summary: 'Contextually search an index',
  security: [{ [bearerAuth.name]: [] }],
  // request: request(Do, 'The index name'),
  responses: {
    ...response(SimilarDocumentsResponse, 'Similar documents found'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/documents',
  tags: ['Documents'],
  description: 'Load a document into an index.',
  summary: 'Load a document into an index.',
  security: [{ [bearerAuth.name]: [] }],
  request: request(CreateDocumentRequest, 'The new document'),
  responses: {
    ...response(CreateDocumentRequest, 'Newly created document'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/chat/completions',
  tags: ['Language models'],
  description:
    'Given a prompt, the model will return one or more predicted completions',
  summary:
    'Given a prompt, the model will return one or more predicted completions',
  security: [{ [bearerAuth.name]: [] }],
  request: request(ChatCompletionRequest, 'The new document'),
  responses: {
    ...response(ChatCompletionResponse, 'Newly created document'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/chat/rag',
  tags: ['Language models'],
  description:
    'Given a prompt, the model will return one or more predicted completions',
  summary:
    'Given a prompt, the model will return one or more predicted completions',
  security: [{ [bearerAuth.name]: [] }],
  request: request(RagCompletionRequest, 'The retrieval request object.'),
  responses: {
    ...response(
      RagCompletionResponse,
      'Response object containing completions and sources'
    ),
    ...errorResponse,
  },
});

export function generateOpenApi() {
  return new OpenApiGeneratorV3(publicAPIRegistry.definitions).generateDocument(
    {
      openapi: '3.0.0',
      info: {
        version: '0.1.0-alpha',
        title: 'SquareDev API',
        description:
          'This is the SquareDev API. It still in alpha phase so it may change',
      },
      tags: [
        {
          name: 'Indexes',
          description: 'string',
        },
      ],
      servers: [{ url: 'api' }],
    }
  );
}
