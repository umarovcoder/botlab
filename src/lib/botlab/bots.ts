import { requireSupabase } from '../supabase';
import type { Bot } from './types';
import { botCreateSchema, type BotCreateInput } from './validation';

export async function listBots(workspaceId: string) {
  const { data, error } = await requireSupabase()
    .from('bots')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Bot[];
}

export async function createBot(workspaceId: string, input: BotCreateInput) {
  const data = botCreateSchema.parse(input);
  const { data: bot, error } = await requireSupabase()
    .from('bots')
    .insert({ workspace_id: workspaceId, ...data })
    .select('*')
    .single();
  if (error) throw error;
  return bot as Bot;
}

export async function updateBot(botId: string, patch: Partial<BotCreateInput>) {
  const data = botCreateSchema.partial().parse(patch);
  const { data: bot, error } = await requireSupabase()
    .from('bots')
    .update(data)
    .eq('id', botId)
    .select('*')
    .single();
  if (error) throw error;
  return bot as Bot;
}

export async function deleteBot(botId: string) {
  const { error } = await requireSupabase().from('bots').delete().eq('id', botId);
  if (error) throw error;
}
