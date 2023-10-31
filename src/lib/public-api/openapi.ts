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
  summary: 'Get all indexes',
  description: 'Get all indexes of the current project.',
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
  summary: 'Create new index',
  description: 'Create new index under the current project.',
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
  summary: 'Search for similar documents',
  description:
    'Contextually search an index for similar documents. The search is done by comparing the embeddings of the documents using cosine similarity.',
  security: [{ [bearerAuth.name]: [] }],
  // TODO:
  // request: request(____, ''),
  responses: {
    ...response(SimilarDocumentsResponse, 'Similar documents found'),
    ...errorResponse,
  },
});

publicAPIRegistry.registerPath({
  method: 'post',
  path: '/documents',
  tags: ['Documents'],
  summary: 'Load document',
  description:
    'Load a document into an index. Before the document is loaded, SquareDev creates embeddings for the document so that it can be contextually searched later.',
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
  summary: 'Chat',
  description:
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
  summary: 'Retrieval augmented generation (RAG)',
  description:
    'SquareDev contextually searches for related documents in the specified index and uses them to improve the generation of the completion.',
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
          name: 'Authorization',
          description: `Authorization is done via a Bearer token in the Authorization header. Your API token can be found in your project via the studio.          
          `,
        },
        {
          name: 'Indexes',
          description: `Indexes are the main way to store and organize documents. 
          They contain the documents, their content, embeddings and metadata.`,
        },
        {
          name: 'Documents',
          description: `Documents are the main way content is stored in SquareDev. They are stored in Indexes and contain the content, embeddings and metadata.
            Usually documents are created from files or unstructured data. After a file is uploaded in SquareDev platform it is splitted into documents,
            and these documents along with their embeddings (vector representations of the content) are stored in the index.
            After that documents can be searched and retrieved contextually.
          `,
        },
        {
          name: 'Language models',
          description: `Language model endpoints are the main way to interact with a LLMs. They can be used to generate simple completions from an input, 
          or combined with documents for retrieval augmented generation (RAG). The RAG endpoint can be used to generate completions from a prompt, that
          are also context aware from the documents in the index that best answer the prompt (user question).
          .`,
        },
      ],
      servers: [{ url: 'api' }],
    }
  );
}
