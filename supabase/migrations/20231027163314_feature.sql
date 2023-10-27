alter table "public"."documents" drop constraint "documents_knowledge_base_id_fkey";

alter table "public"."documents" drop column "knowledge_base_id";

alter table "public"."documents" add column "index_id" uuid not null;

alter table "public"."documents" add constraint "documents_index_id_fkey" FOREIGN KEY (index_id) REFERENCES indexes(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_index_id_fkey";


