import { z } from 'zod';

export const workspaceCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const botCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional(),
  language: z.enum(['uz', 'ru', 'en']).default('uz'),
  system_prompt: z.string().trim().max(10000).optional(),
});

export type WorkspaceCreateInput = z.infer<typeof workspaceCreateSchema>;
export type BotCreateInput = z.infer<typeof botCreateSchema>;
