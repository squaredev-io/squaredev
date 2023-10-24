create extension if not exists "vector" with schema "public" version '0.4.0';
create table "public"."apps" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default auth.uid(),
    "name" text not null,
    "api_key" uuid default gen_random_uuid()
);
alter table "public"."apps" enable row level security;
create table "public"."apps_knowledge_bases" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "app_id" uuid not null,
    "knowledge_base_id" uuid not null,
    "user_id" uuid not null
);
alter table "public"."apps_knowledge_bases" enable row level security;
create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "embedding" vector not null,
    "content" text not null,
    "metadata" json,
    "source" text not null,
    "user_id" uuid not null default auth.uid(),
    "knowledge_base_id" uuid not null
);
alter table "public"."documents" enable row level security;
create table "public"."knowledge_bases" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "user_id" uuid not null default auth.uid()
);
alter table "public"."knowledge_bases" enable row level security;
create table "public"."memory_logs" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_question" text not null,
    "user_question_embedding" vector not null,
    "prompt" text not null,
    "session_id" uuid not null,
    "prompt_tokens" bigint not null,
    "response" text not null,
    "response_tokens" bigint not null,
    "latency_milliseconds" bigint not null
);
alter table "public"."memory_logs" enable row level security;
create table "public"."memory_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "sumamry" text not null,
    "app_id" uuid not null
);
alter table "public"."memory_sessions" enable row level security;
CREATE UNIQUE INDEX apps_knowledge_bases_pkey ON public.apps_knowledge_bases USING btree (id);
CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (id);
CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);
CREATE UNIQUE INDEX knowledge_bases_pkey ON public.knowledge_bases USING btree (id);
CREATE UNIQUE INDEX memory_logs_pkey ON public.memory_logs USING btree (id);
CREATE UNIQUE INDEX memory_session_pkey ON public.memory_sessions USING btree (id);
alter table "public"."apps"
add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";
alter table "public"."apps_knowledge_bases"
add constraint "apps_knowledge_bases_pkey" PRIMARY KEY using index "apps_knowledge_bases_pkey";
alter table "public"."documents"
add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";
alter table "public"."knowledge_bases"
add constraint "knowledge_bases_pkey" PRIMARY KEY using index "knowledge_bases_pkey";
alter table "public"."memory_logs"
add constraint "memory_logs_pkey" PRIMARY KEY using index "memory_logs_pkey";
alter table "public"."memory_sessions"
add constraint "memory_session_pkey" PRIMARY KEY using index "memory_session_pkey";
alter table "public"."apps_knowledge_bases"
add constraint "apps_knowledge_bases_app_id_fkey" FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE not valid;
alter table "public"."apps_knowledge_bases" validate constraint "apps_knowledge_bases_app_id_fkey";
alter table "public"."apps_knowledge_bases"
add constraint "apps_knowledge_bases_knowledge_base_id_fkey" FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE not valid;
alter table "public"."apps_knowledge_bases" validate constraint "apps_knowledge_bases_knowledge_base_id_fkey";
alter table "public"."apps_knowledge_bases"
add constraint "apps_knowledge_bases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."apps_knowledge_bases" validate constraint "apps_knowledge_bases_user_id_fkey";
alter table "public"."documents"
add constraint "documents_knowledge_base_id_fkey" FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE not valid;
alter table "public"."documents" validate constraint "documents_knowledge_base_id_fkey";
alter table "public"."documents"
add constraint "documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."documents" validate constraint "documents_user_id_fkey";
alter table "public"."knowledge_bases"
add constraint "knowledge_bases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."knowledge_bases" validate constraint "knowledge_bases_user_id_fkey";
alter table "public"."memory_logs"
add constraint "memory_logs_session_id_fkey" FOREIGN KEY (session_id) REFERENCES memory_sessions(id) ON DELETE CASCADE not valid;
alter table "public"."memory_logs" validate constraint "memory_logs_session_id_fkey";
alter table "public"."memory_sessions"
add constraint "memory_sessions_app_id_fkey" FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE not valid;
alter table "public"."memory_sessions" validate constraint "memory_sessions_app_id_fkey";
create policy "Enable access for all authed users" on "public"."apps" as permissive for all to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Enable access for all authed users" on "public"."apps_knowledge_bases" as permissive for all to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Enable access for all authed users" on "public"."documents" as permissive for all to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Enable access for all authed users" on "public"."knowledge_bases" as permissive for all to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
alter table "public"."documents"
alter column "embedding" type vector(1536);