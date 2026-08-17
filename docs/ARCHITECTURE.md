# BotLab Architecture

## Product goal

BotLab is a multi-tenant SaaS for creating business AI assistants that can answer customer questions from trusted business knowledge, capture leads, and operate through Telegram and a website widget.

## Core boundaries

- **Workspace**: tenant boundary. Every business owns one or more bots and all customer data.
- **Bot**: AI configuration, channels, language, system instructions.
- **Knowledge**: source documents, website crawls, FAQs, chunks and embeddings.
- **Conversation**: channel-specific customer session.
- **Lead**: qualified customer record extracted from conversations.

## Data isolation

Every tenant-owned table carries `workspace_id`. Supabase Row Level Security is mandatory for all tenant tables. Service-role operations are restricted to trusted server-side jobs and must never expose the service key to browsers.

## AI request flow

1. Receive a Telegram/web message.
2. Resolve the bot and workspace from the trusted integration identity.
3. Load bot configuration.
4. Retrieve relevant knowledge chunks for that bot.
5. Build a constrained system prompt containing only the bot's approved business context.
6. Generate the answer with the configured LLM.
7. Persist user/assistant messages.
8. Detect lead intent and capture structured lead fields when appropriate.
9. Return the response to the originating channel.

## Knowledge ingestion flow

Website URL / FAQ / file -> ingestion worker -> cleaned text -> chunks -> embeddings -> pgvector -> bot-scoped retrieval.

Firecrawl is an ingestion tool, not the source of truth. Supabase/Postgres is the source of truth for indexed knowledge.

## Security principles

- Never trust a workspace_id supplied by an end user without authorization checks.
- Never put service-role keys in client code.
- Telegram webhook secrets/tokens must be encrypted or stored in a dedicated secret manager in production.
- Retrieval is always scoped to bot_id and therefore to a tenant.
- Do not expose raw system prompts, internal metadata, credentials or other tenant data to the model or customer.
- Treat customer messages as untrusted input; defend against prompt injection.
- Apply rate limits and abuse controls at channel and workspace level.

## MVP sequence

1. Auth + workspace onboarding
2. Bot CRUD
3. FAQ knowledge ingestion
4. Website ingestion
5. Retrieval + AI response engine
6. Telegram webhook/integration
7. Conversations and leads
8. Dashboard
9. Web widget
10. Billing/usage limits
