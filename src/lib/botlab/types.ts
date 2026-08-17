export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type BotStatus = 'draft' | 'active' | 'paused';
export type BotChannel = 'telegram' | 'web';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
}

export interface Bot {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  description: string | null;
  system_prompt: string | null;
  language: string;
  status: BotStatus;
  channels: BotChannel[];
  created_at: string;
  updated_at: string;
}
