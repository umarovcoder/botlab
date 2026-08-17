# BotLab Production Checklist

## Required secrets

- `OPENAI_API_KEY`
- `FIRECRAWL_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server/Edge Functions only)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Current production boundaries

- Browser uses Supabase publishable/anon key only.
- Service role is used only inside trusted Edge Functions.
- RLS is enabled on tenant tables.
- Chat retrieval is scoped by `bot_id` and authorized workspace membership.
- AI instructions explicitly reject secret/system-prompt extraction and cross-tenant data requests.

## Before selling to customers

1. Configure Supabase Auth email settings.
2. Configure Edge Function secrets.
3. Run security and performance advisors.
4. Add rate limiting for chat and ingestion endpoints.
5. Encrypt Telegram bot tokens at rest or move them to a managed secret store.
6. Add Telegram webhook signature/secret-token validation.
7. Add usage quotas and per-tenant AI cost tracking.
8. Add automated tests for RLS and tenant isolation.
9. Add error monitoring and structured logs.
10. Add backup/restore procedure.
11. Verify privacy policy and customer-data retention requirements.
