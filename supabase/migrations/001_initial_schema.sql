-- BotLab SaaS foundation
-- Multi-tenant schema with RLS. Apply through Supabase migrations.

create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.workspace_role as enum ('owner','admin','member');
create type public.bot_channel as enum ('telegram','web');
create type public.bot_status as enum ('draft','active','paused');
create type public.knowledge_source_type as enum ('text','faq','url','file');
create type public.conversation_status as enum ('open','closed','handoff');
create type public.message_role as enum ('user','assistant','system','operator');
create type public.lead_status as enum ('new','contacted','qualified','won','lost');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.bots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  system_prompt text,
  language text not null default 'uz',
  status public.bot_status not null default 'draft',
  channels public.bot_channel[] not null default array['telegram']::public.bot_channel[],
  telegram_bot_token_encrypted text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bot_id uuid not null references public.bots(id) on delete cascade,
  type public.knowledge_source_type not null,
  title text not null,
  source_url text,
  source_file_path text,
  raw_text text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bot_id uuid not null references public.bots(id) on delete cascade,
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bot_id uuid not null references public.bots(id) on delete cascade,
  channel public.bot_channel not null,
  external_user_id text,
  external_chat_id text,
  customer_name text,
  customer_phone text,
  status public.conversation_status not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role public.message_role not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bot_id uuid not null references public.bots(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  name text,
  phone text,
  email text,
  interest text,
  status public.lead_status not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_workspace_members_user on public.workspace_members(user_id);
create index idx_bots_workspace on public.bots(workspace_id);
create index idx_sources_bot on public.knowledge_sources(bot_id);
create index idx_chunks_bot on public.knowledge_chunks(bot_id);
create index idx_conversations_bot on public.conversations(bot_id, last_message_at desc);
create index idx_messages_conversation on public.messages(conversation_id, created_at);
create index idx_leads_workspace on public.leads(workspace_id, created_at desc);
create index idx_chunks_embedding on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = auth.uid()
  );
$$;

create or replace function public.has_workspace_role(target_workspace uuid, allowed_roles public.workspace_role[])
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = auth.uid()
      and wm.role = any(allowed_roles)
  );
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.bots enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_chunks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.leads enable row level security;

create policy "profiles own access" on public.profiles
for all using (id = auth.uid()) with check (id = auth.uid());

create policy "workspace members can read workspace" on public.workspaces
for select using (public.is_workspace_member(id));
create policy "workspace owner can create workspace" on public.workspaces
for insert with check (owner_id = auth.uid());
create policy "workspace admins can update" on public.workspaces
for update using (public.has_workspace_role(id, array['owner','admin']::public.workspace_role[]));

create policy "members can read memberships" on public.workspace_members
for select using (public.is_workspace_member(workspace_id));
create policy "admins manage memberships" on public.workspace_members
for all using (public.has_workspace_role(workspace_id, array['owner','admin']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, array['owner','admin']::public.workspace_role[]));

create policy "members access bots" on public.bots
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members access sources" on public.knowledge_sources
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members access chunks" on public.knowledge_chunks
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members access conversations" on public.conversations
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members access messages" on public.messages
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members access leads" on public.leads
for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_bot_id uuid,
  match_count int default 8,
  match_threshold float default 0.72
)
returns table (id uuid, content text, source_id uuid, similarity float)
language sql stable security definer set search_path = public
as $$
  select kc.id, kc.content, kc.source_id,
         1 - (kc.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks kc
  where kc.bot_id = match_bot_id
    and kc.embedding is not null
    and 1 - (kc.embedding <=> query_embedding) >= match_threshold
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
