drop policy "Enable access for all authed users" on "public"."index";

drop policy "Enable access for all authed users" on "public"."project";

alter table "public"."index" drop constraint "index_project_id_fkey";

alter table "public"."index" drop constraint "index_user_id_fkey";

alter table "public"."documents" drop constraint "documents_knowledge_base_id_fkey";

alter table "public"."memory_sessions" drop constraint "memory_sessions_project_id_fkey";

alter table "public"."index" drop constraint "knowledge_bases_pkey";

alter table "public"."project" drop constraint "apps_pkey";

drop index if exists "public"."apps_pkey";

drop index if exists "public"."knowledge_bases_pkey";

drop table "public"."index";

drop table "public"."project";

create table "public"."indexes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "user_id" uuid not null default auth.uid(),
    "project_id" uuid
);


alter table "public"."indexes" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default auth.uid(),
    "name" text not null,
    "api_key" uuid default gen_random_uuid()
);


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX apps_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX knowledge_bases_pkey ON public.indexes USING btree (id);

alter table "public"."indexes" add constraint "knowledge_bases_pkey" PRIMARY KEY using index "knowledge_bases_pkey";

alter table "public"."projects" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."indexes" add constraint "indexes_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."indexes" validate constraint "indexes_project_id_fkey";

alter table "public"."indexes" add constraint "indexes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."indexes" validate constraint "indexes_user_id_fkey";

alter table "public"."documents" add constraint "documents_knowledge_base_id_fkey" FOREIGN KEY (knowledge_base_id) REFERENCES indexes(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_knowledge_base_id_fkey";

alter table "public"."memory_sessions" add constraint "memory_sessions_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."memory_sessions" validate constraint "memory_sessions_project_id_fkey";

create policy "Enable access for all authed users"
on "public"."indexes"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable access for all authed users"
on "public"."projects"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



