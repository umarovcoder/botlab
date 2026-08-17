import { requireSupabase } from '../supabase';

export async function signUp(email: string, password: string) {
  return requireSupabase().auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return requireSupabase().auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return requireSupabase().auth.signOut();
}

export async function getSession() {
  return requireSupabase().auth.getSession();
}
