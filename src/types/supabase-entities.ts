import { Database } from './supabase';

export type App = Database['public']['Tables']['apps']['Row'];
export type KnowledgeBase =
  Database['public']['Tables']['knowledge_bases']['Row'];

export type DocumentInsert =
  Database['public']['Tables']['documents']['Insert'];
export type Document = Database['public']['Tables']['documents']['Row'];
