export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      apps: {
        Row: {
          api_key: string | null;
          created_at: string;
          id: string;
          name: string;
          user_id: string | null;
        };
        Insert: {
          api_key?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          user_id?: string | null;
        };
        Update: {
          api_key?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      apps_knowledge_bases: {
        Row: {
          app_id: string;
          created_at: string;
          id: string;
          knowledge_base_id: string;
          user_id: string;
        };
        Insert: {
          app_id: string;
          created_at?: string;
          id?: string;
          knowledge_base_id: string;
          user_id?: string;
        };
        Update: {
          app_id?: string;
          created_at?: string;
          id?: string;
          knowledge_base_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'apps_knowledge_bases_app_id_fkey';
            columns: ['app_id'];
            referencedRelation: 'apps';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apps_knowledge_bases_knowledge_base_id_fkey';
            columns: ['knowledge_base_id'];
            referencedRelation: 'knowledge_bases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apps_knowledge_bases_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      documents: {
        Row: {
          content: string;
          created_at: string;
          embedding: string;
          id: string;
          knowledge_base_id: string;
          metadata: Json | null;
          source: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          embedding: string;
          id?: string;
          knowledge_base_id: string;
          metadata?: Json | null;
          source: string;
          user_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          embedding?: string;
          id?: string;
          knowledge_base_id?: string;
          metadata?: Json | null;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_knowledge_base_id_fkey';
            columns: ['knowledge_base_id'];
            referencedRelation: 'knowledge_bases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      knowledge_bases: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_bases_user_id_fkey';
            columns: ['user_id'];
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
            referencedRelation: 'memory_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      memory_sessions: {
        Row: {
          app_id: string;
          created_at: string;
          id: string;
          sumamry: string;
        };
        Insert: {
          app_id: string;
          created_at?: string;
          id?: string;
          sumamry: string;
        };
        Update: {
          app_id?: string;
          created_at?: string;
          id?: string;
          sumamry?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memory_sessions_app_id_fkey';
            columns: ['app_id'];
            referencedRelation: 'apps';
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buckets_owner_fkey';
            columns: ['owner'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
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
