import { Database } from './supabase';

export type Project = Database['public']['Tables']['projects']['Row'];
export type Index = Database['public']['Tables']['indexes']['Row'];
export type IndexInsert = Database['public']['Tables']['indexes']['Insert'];

export type DocumentInsert =
  Database['public']['Tables']['documents']['Insert'];
export type Document = Database['public']['Tables']['documents']['Row'];
