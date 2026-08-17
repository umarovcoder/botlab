import { requireSupabase } from '../supabase';
import type { Workspace } from './types';
import { workspaceCreateSchema, type WorkspaceCreateInput } from './validation';

export async function createWorkspace(input: WorkspaceCreateInput) {
  const data = workspaceCreateSchema.parse(input);
  const client = requireSupabase();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error('Authentication required');

  const { data: workspace, error } = await client
    .from('workspaces')
    .insert({ name: data.name, slug: data.slug, owner_id: auth.user.id })
    .select('*')
    .single();
  if (error) throw error;

  const { error: membershipError } = await client
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: auth.user.id, role: 'owner' });
  if (membershipError) throw membershipError;

  return workspace as Workspace;
}

export async function listWorkspaces() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('workspace_members')
    .select('workspace:workspaces(*)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => row.workspace).filter(Boolean) as unknown as Workspace[];
}
