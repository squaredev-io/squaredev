import { Chat } from 'openai/resources';
import { supabaseExecute } from '../../src/lib/public-api/database';
import {
  DocumentsResponse,
  CreateIndexResponse,
  GetIndexesResponse,
  ChatCompletionResponse,
  RagCompletionResponse,
  SimilarDocumentsResponse,
} from '../../src/lib/public-api/validation';
import { Project, Index } from '../../src/types/supabase-entities';

let state = {
  project: null as Project | null,
  index: null as Index | null,
};

const routes = {
  getIndexes: '/api/indexes',
  searchIndex: '/api/indexes/search',
  postDocuments: '/api/documents',
  getDocuments: '/api/documents',
  searchDocuments: '/api/documents/search',
  chat: '/api/chat/completions',
  rag: '/api/chat/rag',
};

context('Test Public API', () => {
  before(async () => {});

  it('gets the project to be tested from database', () => {
    const query = `select * from projects where name = 'Test project'`;
    cy.task('supabaseExecute', query).then(({ data, error }: any) => {
      expect(data[0].name).to.eq('Test project');
      state.project = data[0];
    });
  });

  context(`POST ${routes.getIndexes}`, () => {
    it('should fail when there are no correct headers', () => {
      cy.request({
        method: 'POST',
        url: routes.getIndexes,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should create a new index', () => {
      const name = `Test index ${new Date().getTime()}`;
      cy.request({
        method: 'POST',
        url: routes.getIndexes,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: {
          name,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(name);
        CreateIndexResponse.parse(response.body);
      });
    });
  });

  context(`GET ${routes.getIndexes}`, () => {
    it('should fail when there are no correct headers', () => {
      cy.request({
        method: 'GET',
        url: routes.getIndexes,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should return the indexes', () => {
      cy.request({
        method: 'GET',
        url: routes.getIndexes,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.greaterThan(0);
        GetIndexesResponse.parse(response.body);
        state.index = response.body[0];
      });
    });
  });

  context(`POST ${routes.postDocuments}`, () => {
    it('should load documents to an index along with metadata ', () => {
      cy.request({
        method: 'POST',
        url: `${routes.postDocuments}?index_id=${state.index?.id}`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: [
          {
            content: 'The name of the company is SquareDev.',
            source: 'the founders',
            metadata: { string: 'string' },
          },
        ],
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.greaterThan(0);
        DocumentsResponse.parse(response.body);
      });
    });

    it('should fail when there is no content in the document', () => {
      cy.request({
        failOnStatusCode: false,
        method: 'POST',
        url: `${routes.postDocuments}?index_id=${state.index?.id}`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: [
          {
            source: 'string',
            metadata: { string: 'string' },
          },
        ],
      }).then((response) => {
        // TODO: This should be 400
        expect(response.status).to.eq(500);
      });
    });
  });

  context(`POST ${routes.postDocuments}/upload`, () => {
    it.skip('json', () => {});
    it.skip('pdf', () => {});
  });

  context(`POST ${routes.postDocuments}/web`, () => {});

  context(`GET ${routes.getDocuments}`, () => {
    it('should get the documents of an index', () => {
      cy.request({
        method: 'GET',
        url: `${routes.postDocuments}?index_id=${state.index?.id}`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.greaterThan(0);
        DocumentsResponse.parse(response.body);
      });
    });

    it.skip('return the correct error for wrong indexes', () => {});
  });

  context(`GET ${routes.searchIndex}`, () => {
    it('should get the documents of an index that are contextually similar to the search term', () => {
      cy.request({
        method: 'GET',
        url: `${routes.searchIndex}?index_id=${state.index?.id}&search=A random`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.greaterThan(0);
        SimilarDocumentsResponse.parse(response.body);
      });
    });

    it.skip('return the correct error for wrong indexes', () => {});
    it.skip('return the correct error for no search term', () => {});
  });

  context(`POST /chat/completions`, () => {
    it('should chat with the LLM, only completing the requested prompt', () => {
      cy.request({
        method: 'POST',
        url: `/api/chat/completions?model=gpt-3.5-turbo`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: {
          model: 'gpt-3.5-turbo',
          messages: {
            system: 'Hello, how are you?',
            user: 'I am fine, how are you?',
          },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        ChatCompletionResponse.parse(response.body);
      });
    });
  });

  context(`POST ${routes.rag}`, () => {
    it('chats with RAG', () => {
      cy.request({
        method: 'POST',
        url: `${routes.rag}?model=gpt-3.5-turbo`,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: {
          model: 'gpt-3.5-turbo',
          messages: {
            system:
              'You are a helpful assistant. Try to answer the question using the given context.',
            user: 'Context: {context} \nQuestion: What is the name of the company?',
          },
          indexId: state.index?.id,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include('SquareDev');
        console.log(response.body);
        RagCompletionResponse.parse(response.body);
      });
    });

    it('returns an error if no {context} placeholder', () => {
      cy.request({
        method: 'POST',
        url: `${routes.rag}`,
        failOnStatusCode: false,
        headers: {
          authentication: `Bearer ${state.project?.api_key}`,
        },
        body: {
          model: 'gpt-3.5-turbo',
          messages: {
            system:
              'You are a helpful assistant. Try to answer the question using the given context.',
            user: 'Context: no context placeholder \nQuestion: What is the name of the company?',
          },
          indexId: state.index?.id,
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
