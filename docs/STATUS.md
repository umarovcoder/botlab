# BotLab Status

## Built

- Landing site
- Supabase multi-tenant schema + RLS
- Auth/service layer
- Workspace and bot CRUD foundations
- Dashboard/application shell
- Knowledge source/chunk model with pgvector
- Firecrawl ingestion Edge Function source
- AI RAG chat Edge Function source
- Supabase project initialized with the core schema
- `botlab-chat` and `botlab-ingest` Edge Functions deployed

## Not yet production-complete

- Telegram webhook must be connected to the deployed chat engine and protected with Telegram secret-token validation.
- Web chat widget needs final UI integration.
- Lead extraction UI and CRM view need completion.
- Billing/usage metering needs implementation.
- Automated test suite and CI need implementation.
- Production secrets need to be configured in Supabase.

This status file intentionally distinguishes deployed foundations from production-complete features.
