drop policy "Enable access for all authed users" on "public"."apps";

drop policy "Enable access for all authed users" on "public"."apps_knowledge_bases";

drop policy "Enable access for all authed users" on "public"."knowledge_bases";

alter table "public"."apps_knowledge_bases" drop constraint "apps_knowledge_bases_app_id_fkey";

alter table "public"."apps_knowledge_bases" drop constraint "apps_knowledge_bases_knowledge_base_id_fkey";

alter table "public"."apps_knowledge_bases" drop constraint "apps_knowledge_bases_user_id_fkey";

alter table "public"."knowledge_bases" drop constraint "knowledge_bases_user_id_fkey";

alter table "public"."memory_sessions" drop constraint "memory_sessions_app_id_fkey";

alter table "public"."documents" drop constraint "documents_knowledge_base_id_fkey";

alter table "public"."apps" drop constraint "apps_pkey";

alter table "public"."apps_knowledge_bases" drop constraint "apps_knowledge_bases_pkey";

alter table "public"."knowledge_bases" drop constraint "knowledge_bases_pkey";

drop index if exists "public"."apps_knowledge_bases_pkey";

drop index if exists "public"."apps_pkey";

drop index if exists "public"."knowledge_bases_pkey";

drop table "public"."apps";

drop table "public"."apps_knowledge_bases";

drop table "public"."knowledge_bases";

create table "public"."index" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "user_id" uuid not null default auth.uid(),
    "project_id" uuid
);


alter table "public"."index" enable row level security;

create table "public"."project" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default auth.uid(),
    "name" text not null,
    "api_key" uuid default gen_random_uuid()
);


alter table "public"."project" enable row level security;

alter table "public"."memory_sessions" drop column "app_id";

alter table "public"."memory_sessions" add column "project_id" uuid not null;

CREATE UNIQUE INDEX apps_pkey ON public.project USING btree (id);

CREATE UNIQUE INDEX knowledge_bases_pkey ON public.index USING btree (id);

alter table "public"."index" add constraint "knowledge_bases_pkey" PRIMARY KEY using index "knowledge_bases_pkey";

alter table "public"."project" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."index" add constraint "index_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE not valid;

alter table "public"."index" validate constraint "index_project_id_fkey";

alter table "public"."index" add constraint "index_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."index" validate constraint "index_user_id_fkey";

alter table "public"."memory_sessions" add constraint "memory_sessions_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE not valid;

alter table "public"."memory_sessions" validate constraint "memory_sessions_project_id_fkey";

alter table "public"."documents" add constraint "documents_knowledge_base_id_fkey" FOREIGN KEY (knowledge_base_id) REFERENCES index(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_knowledge_base_id_fkey";

create policy "Enable access for all authed users"
on "public"."index"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable access for all authed users"
on "public"."project"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



