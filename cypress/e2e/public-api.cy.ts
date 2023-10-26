import { supabaseExecute } from '../../src/lib/public-api/database';
import { App, KnowledgeBase } from '../../src/types/supabase-entities';

let state = {
  app: null as App | null,
  knowledgeBase: null as KnowledgeBase | null,
};

context('GET /kb', () => {
  before(async () => {});

  it('gets the app to be tested', () => {
    const query = `select * from apps where name = 'Test App'`;
    cy.task('supabaseExecute', query).then(({ data, error }: any) => {
      expect(data[0].name).to.eq('Test App');
      state.app = data[0];
    });
  });

  it('tests getting the knowledge base via the api key ', () => {
    cy.request({
      method: 'GET',
      url: '/api/knowledge-bases',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });

    cy.request({
      method: 'GET',
      url: '/api/knowledge-bases',
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
      state.knowledgeBase = response.body[0];
    });
  });

  it('uploads documents to a knowledge base ', () => {
    cy.request({
      method: 'POST',
      url: `/api/documents?knowledge_base_id=${state.knowledgeBase?.id}`,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
      body: [
        {
          content: 'A random sentence about SquareDev',
          source: 'string',
          metadata: { string: 'string' },
        },
      ],
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
    });
  });

  it('gets the documents of a knowledge base', () => {
    cy.request({
      method: 'GET',
      url: `/api/documents?knowledge_base_id=${state.knowledgeBase?.id}`,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
    });
  });

  it('gets the documents of a knowledge base that are contextually similar to the search term', () => {
    cy.request({
      method: 'POST',
      url: `/api/documents/search?knowledge_base_id=${state.knowledgeBase?.id}&search=A random`,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
    }).then((response) => {
      console.log(response.body);

      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
    });
  });

  it('chats without RAG', () => {
    cy.request({
      method: 'POST',
      url: `/api/chat/completions?model=gpt-3.5-turbo`,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: {
          system: 'Hello, how are you?',
          user: 'I am fine, how are you?',
        },
      },
    }).then((response) => {
      console.log(response.body);

      expect(response.status).to.eq(200);
    });
  });

  it('chats with RAG', () => {
    cy.request({
      method: 'POST',
      url: `/api/chat/completions?model=gpt-3.5-turbo`,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: {
          system:
            'You are a helpful assistant. Try to answer the question using the given context.',
          user: 'Context: {context} \nQuestion: What is the name of the company?',
        },
        knowledgeBaseId: state.knowledgeBase?.id,
      },
    }).then((response) => {
      console.log(response.body);

      expect(response.status).to.eq(200);
    });
  });

  it('returns an error if no {context} placeholder', () => {
    cy.request({
      method: 'POST',
      url: `/api/chat/completions?model=gpt-3.5-turbo`,
      failOnStatusCode: false,
      headers: {
        authentication: `Bearer ${state.app?.api_key}`,
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: {
          system:
            'You are a helpful assistant. Try to answer the question using the given context.',
          user: 'Context: no context placeholder \nQuestion: What is the name of the company?',
        },
        knowledgeBaseId: state.knowledgeBase?.id,
      },
    }).then((response) => {
      console.log(response.body);

      expect(response.status).to.eq(400);
    });
  });
});
