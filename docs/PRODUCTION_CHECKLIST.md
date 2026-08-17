# BotLab Production Checklist

## Required secrets
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server/Edge Functions only)
- `OPENAI_API_KEY`
- `FIRECRAWL_API_KEY`
- Telegram bot tokens per tenant, stored server-side only

## Current production boundaries
- Browser uses only the Supabase publishable/anon key.
- Service role is restricted to trusted Edge Functions.
- RLS is enabled on tenant tables.
- Retrieval is scoped to `bot_id` and authorized workspace membership.
- AI instructions reject secret/system-prompt extraction and cross-tenant requests.

## Final MVP definition of done
A customer can sign up, create a workspace, create a bot, add business knowledge, connect Telegram or the web widget, receive grounded AI answers, view conversations, and capture leads without developer intervention.

## Before public launch
1. Configure Supabase Auth email/redirect settings.
2. Configure all Edge Function secrets.
3. Deploy and verify all migrations/functions.
4. Add rate limiting for chat and ingestion endpoints.
5. Encrypt Telegram tokens at rest or move them to a managed secret store.
6. Validate Telegram webhook secret tokens server-side.
7. Add usage quotas and per-tenant AI cost tracking.
8. Add automated RLS/tenant-isolation tests.
9. Add structured logs and error monitoring.
10. Configure backups and restore testing.
11. Verify privacy policy, retention, and customer-data deletion flows.
