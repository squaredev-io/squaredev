import { type } from 'os';
import * as z from 'zod';

/**
 * IMPORTANT
 *
 * This file contains the validation schemas for the API requests and responses.
 * It is used by the API routes and the Cypress tests.
 * Make sure to make every object schema strict and backwards compatible.
 * Zod strict: https://zod.dev/?id=strict
 */

// Documents
// ---

const DocumentBase = z
  .object({
    content: z.string(),
    source: z.string().optional(),
    metadata: z.object({}).optional(),
  })
  .strict();

export const CreateDocumentRequest = z.array(DocumentBase);

export type CreateDocumentRequestType = z.infer<typeof CreateDocumentRequest>;

export const SingleDocumentResponse = DocumentBase.merge(
  DocumentBase.merge(
    z
      .object({
        id: z.string(),
        index_id: z.string(),
        created_at: z.string(),
        user_id: z.string(),
        // Embeddings are not returned by the API
      })
      .strict()
  )
);

export const DocumentsResponse = z.array(SingleDocumentResponse);

export type CreateDocumentResponseType = z.infer<typeof DocumentsResponse>;

export const SimilarDocumentsResponse = z.array(
  SingleDocumentResponse.merge(z.object({ similarity: z.number() }))
);

// Indexes
// ---

export const CreateIndexRequest = z
  .object({
    name: z.string(),
  })
  .strict();

export const CreateIndexResponse = CreateIndexRequest.merge(
  z
    .object({
      id: z.string(),
      project_id: z.string(),
      created_at: z.string(),
      user_id: z.string(),
    })
    .strict()
);

export type CreateIndexRequestType = z.infer<typeof CreateIndexRequest>;

export const GetIndexesResponse = z.array(CreateIndexResponse);

export type GetIndexesResponseType = z.infer<typeof GetIndexesResponse>;

// Chat
// ---

export const ChatCompletionRequest = z
  .object({
    messages: z.object({
      system: z.string().optional(),
      user: z.string(),
    }),
    model: z.string(),
  })
  .strict();

export type ChatCompletionRequestType = z.infer<typeof ChatCompletionRequest>;

export const ChatCompletionResponse = z
  .object({
    message: z.string(),
    model: z.string(),
  })
  .strict();

export type ChatCompletionResponseType = z.infer<typeof ChatCompletionResponse>;

// RAG
// ---

export const RagCompletionRequest = z
  .object({
    messages: z.object({
      system: z.string().optional(),
      user: z.string(),
    }),
    model: z.string(),
    indexId: z.string(),
    withMemory: z.boolean().optional(),
  })
  .strict();

export type RagCompletionRequestType = z.infer<typeof RagCompletionRequest>;

export const RagCompletionResponse = z
  .object({
    message: z.string(),
    model: z.string(),
    sources: z.array(
      DocumentBase.merge(
        z.object({ id: z.string(), similarity: z.number() }).strict()
      )
    ),
  })
  .strict();
