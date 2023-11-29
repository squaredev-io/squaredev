import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    database_url: 'postgresql://postgres:postgres@localhost:54322/postgres',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
});
