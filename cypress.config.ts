import { defineConfig } from 'cypress';
import { supabaseExecute } from './src/lib/public-api/database';

export default defineConfig({
  env: {
    database_url: 'postgresql://postgres:postgres@localhost:54322/postgres',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here

      on('task', {
        supabaseExecute: supabaseExecute,
      });
    },
  },
});
