# BotLab MVP — Milestone 1

## Goal

A business owner can create an account, create a workspace, and create/configure a chatbot without touching code.

## Acceptance criteria

- Authentication is handled by Supabase Auth.
- A new user gets a profile row automatically.
- Workspace creation creates an owner membership.
- Every bot belongs to exactly one workspace.
- Tenant data is protected by PostgreSQL RLS.
- Bot input is validated server-side with Zod.
- Supported initial languages: Uzbek, Russian, English.
- Supported initial channels: Telegram and web.
- No secret/API token is shipped to browser bundles.

## Next implementation order

1. Supabase client/server environment configuration.
2. Auth screens and protected application shell.
3. Workspace onboarding.
4. Bot CRUD.
5. FAQ knowledge ingestion.
6. Firecrawl website ingestion.
7. Embeddings and retrieval.
8. LLM response service.
9. Telegram webhook.
10. Conversations/leads dashboard.
