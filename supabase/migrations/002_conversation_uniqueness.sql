-- Prevent duplicate channel sessions for the same external chat.
alter table public.conversations
  add constraint conversations_bot_channel_chat_unique
  unique (bot_id, channel, external_chat_id);

-- Fast lookup for Telegram bot credentials. In production, replace plaintext token storage
-- with a dedicated secret store or application-layer encryption.
create index if not exists idx_bots_telegram_token on public.bots(telegram_bot_token_encrypted) where telegram_bot_token_encrypted is not null;
