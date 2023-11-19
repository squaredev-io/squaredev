export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          content: string;
          created_at: string;
          embedding: string;
          id: string;
          index_id: string;
          metadata: Json | null;
          source: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          embedding: string;
          id?: string;
          index_id: string;
          metadata?: Json | null;
          source: string;
          user_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          embedding?: string;
          id?: string;
          index_id?: string;
          metadata?: Json | null;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_index_id_fkey';
            columns: ['index_id'];
            isOneToOne: false;
            referencedRelation: 'indexes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      indexes: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          project_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          project_id?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          project_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'indexes_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'indexes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      memory_logs: {
        Row: {
          created_at: string;
          id: string;
          latency_milliseconds: number;
          prompt: string;
          prompt_tokens: number;
          response: string;
          response_tokens: number;
          session_id: string;
          user_question: string;
          user_question_embedding: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          latency_milliseconds: number;
          prompt: string;
          prompt_tokens: number;
          response: string;
          response_tokens: number;
          session_id: string;
          user_question: string;
          user_question_embedding: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          latency_milliseconds?: number;
          prompt?: string;
          prompt_tokens?: number;
          response?: string;
          response_tokens?: number;
          session_id?: string;
          user_question?: string;
          user_question_embedding?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memory_logs_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'memory_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      memory_sessions: {
        Row: {
          created_at: string;
          id: string;
          project_id: string;
          sumamry: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          project_id: string;
          sumamry: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          project_id?: string;
          sumamry?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memory_sessions_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          }
        ];
      };
      projects: {
        Row: {
          api_key: string | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          user_id: string | null;
        };
        Insert: {
          api_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          user_id?: string | null;
        };
        Update: {
          api_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
