import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_CALLS_PER_HOUR = 20;
const HOUR_MS = 60 * 60 * 1000;

export type Authed = { supabase: SupabaseClient; user: User };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Verifies the session with Supabase and checks it against ALLOWED_EMAIL. */
export async function requireUser(): Promise<Authed | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = process.env.ALLOWED_EMAIL?.trim().toLowerCase();
  if (!user || !allowed || user.email?.toLowerCase() !== allowed) {
    return errorResponse("Unauthorized", 401);
  }

  return { supabase, user };
}

/**
 * Counts this call against the hourly limit. Returns a response when the call
 * must not go ahead, and fails closed if usage can't be read or recorded.
 */
export async function consumeQuota({
  supabase,
  user,
}: Authed): Promise<NextResponse | null> {
  const since = new Date(Date.now() - HOUR_MS).toISOString();
  const { count, error } = await supabase
    .from("api_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);

  if (error || count === null) {
    console.error("Failed to read api_usage", error);
    return errorResponse("Could not check usage", 500);
  }
  if (count >= MAX_CALLS_PER_HOUR) {
    return errorResponse("Hourly limit reached. Try again later.", 429);
  }

  const { error: insertError } = await supabase
    .from("api_usage")
    .insert({ user_id: user.id });

  if (insertError) {
    console.error("Failed to record api_usage", insertError);
    return errorResponse("Could not record usage", 500);
  }

  return null;
}
