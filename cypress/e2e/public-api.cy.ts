import { supabaseExecute } from '../../src/lib/public-api/database';
import { Project, Index } from '../../src/types/supabase-entities';

let state = {
  project: null as Project | null,
  index: null as Index | null,
};

context('Test API', () => {
  before(async () => {});

  it('gets the project to be tested', () => {
    const query = `select * from projects where name = 'Test project'`;
    cy.task('supabaseExecute', query).then(({ data, error }: any) => {
      expect(data[0].name).to.eq('Test project');
      state.project = data[0];
    });
  });

  it('tests getting the index via the api key ', () => {
    cy.request({
      method: 'GET',
      url: '/api/indexes',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });

    cy.request({
      method: 'GET',
      url: '/api/indexes',
      headers: {
        authentication: `Bearer ${state.project?.api_key}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
      state.index = response.body[0];
    });
  });

  it('uploads documents to a index ', () => {
    cy.request({
      method: 'POST',
      url: `/api/documents?index_id=${state.index?.id}`,
      headers: {
        authentication: `Bearer ${state.project?.api_key}`,
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

  it('gets the documents of an index', () => {
    cy.request({
      method: 'GET',
      url: `/api/documents?index_id=${state.index?.id}`,
      headers: {
        authentication: `Bearer ${state.project?.api_key}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.greaterThan(0);
    });
  });

  it('gets the documents of an index that are contextually similar to the search term', () => {
    cy.request({
      method: 'POST',
      url: `/api/documents/search?index_id=${state.index?.id}&search=A random`,
      headers: {
        authentication: `Bearer ${state.project?.api_key}`,
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
    });
  });

  it('chats with RAG', () => {
    cy.request({
      method: 'POST',
      url: `/api/chat/completions?model=gpt-3.5-turbo`,
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
        knowledgeBaseId: state.index?.id,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('returns an error if no {context} placeholder', () => {
    cy.request({
      method: 'POST',
      url: `/api/chat/completions?model=gpt-3.5-turbo`,
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
