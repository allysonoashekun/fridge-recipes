"use client";

import { useState, type FormEvent } from "react";
import Fridge, { SpeechBubble } from "@/components/Fridge";
import { createClient } from "@/lib/supabase/browser";

const INPUT_CLASS =
  "h-14 w-full rounded-xl border-2 border-border bg-card px-4 outline-none focus:border-accent";
const BUTTON_CLASS =
  "h-14 w-full rounded-xl bg-accent font-semibold text-accent-foreground disabled:opacity-50";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setBusy(false);
      setError("That email and password didn't match. Try again.");
    } else {
      // A full load so proxy sees the new session cookies.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex items-start gap-1">
        <Fridge pose="wave" className="h-36 w-28 shrink-0" />
        <SpeechBubble className="pop-in mt-4">hi!</SpeechBubble>
      </div>
      <h1 className="text-3xl font-bold">Fridge Recipes</h1>

      <form onSubmit={signIn} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-muted">
          Email
        </label>
        <input
          id="email"
          className={INPUT_CLASS}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password" className="text-muted">
          Password
        </label>
        <input
          id="password"
          className={INPUT_CLASS}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className={BUTTON_CLASS} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
