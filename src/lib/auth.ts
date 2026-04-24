import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { Session, User } from "@supabase/supabase-js";

import { demoUser } from "../data/mockData";
import type { AppUser } from "../types/models";
import { isSupabaseConfigured, supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

function toAppUser(user: User | null): AppUser | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "member@lumina.fit",
    name: metadata.full_name ?? metadata.name ?? "Lumina Member",
    avatar:
      metadata.avatar_url ??
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    membership: metadata.membership ?? "Studio Member"
  };
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    return demoUser;
  }

  const redirectTo = Linking.createURL("auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    return null;
  }

  const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (authResult.type !== "success" || !authResult.url) {
    return null;
  }

  const { queryParams } = Linking.parse(authResult.url);
  const accessToken = typeof queryParams?.access_token === "string" ? queryParams.access_token : null;
  const refreshToken =
    typeof queryParams?.refresh_token === "string" ? queryParams.refresh_token : null;

  if (!accessToken || !refreshToken) {
    const { data: sessionData } = await supabase.auth.getSession();
    return toAppUser(sessionData.session?.user ?? null);
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError) {
    throw sessionError;
  }

  return toAppUser(sessionData.session?.user ?? null);
}

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    return demoUser;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  return toAppUser(data.user);
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    return demoUser;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  return toAppUser(data.user);
}

export async function sendMagicLink(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    return true;
  }

  const redirectTo = Linking.createURL("auth/callback");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });

  if (error) {
    throw error;
  }

  return true;
}

export async function signOutSupabase() {
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut();
}

export async function getStoredSession(): Promise<Session | null> {
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function mapSessionToUser(session: Session | null) {
  return toAppUser(session?.user ?? null);
}
