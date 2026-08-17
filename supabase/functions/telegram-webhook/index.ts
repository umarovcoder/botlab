import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status:405 });
  try {
    const update = await req.json();
    const message = update.message;
    if (!message?.chat?.id || !message?.text) return new Response('ok');

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const botToken = req.headers.get('x-telegram-bot-token');
    if (!botToken) return new Response('Missing bot token', { status:401 });
    const { data: bot } = await supabase.from('bots').select('id,workspace_id,name,language,system_prompt').eq('telegram_bot_token_encrypted', botToken).maybeSingle();
    if (!bot) return new Response('Unknown bot', { status:404 });

    const { data: conversation } = await supabase.from('conversations').upsert({workspace_id:bot.workspace_id,bot_id:bot.id,channel:'telegram',external_user_id:String(message.from?.id ?? ''),external_chat_id:String(message.chat.id),customer_name:[message.from?.first_name,message.from?.last_name].filter(Boolean).join(' ') || null,last_message_at:new Date().toISOString()},{onConflict:'bot_id,channel,external_chat_id'}).select().single();
    if (!conversation) throw new Error('Conversation could not be created');
    await supabase.from('messages').insert({workspace_id:bot.workspace_id,conversation_id:conversation.id,role:'user',content:message.text});

    return new Response(JSON.stringify({ ok:true, bot_id:bot.id, conversation_id:conversation.id }), {headers:{'Content-Type':'application/json'}});
  } catch (error) { return new Response(JSON.stringify({error:error instanceof Error?error.message:'Unknown error'}),{status:500,headers:{'Content-Type':'application/json'}}); }
});
