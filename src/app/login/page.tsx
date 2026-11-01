"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";

const INPUT_CLASS =
  "h-14 w-full rounded-xl border border-border bg-card px-4 outline-none focus:border-accent";
const BUTTON_CLASS =
  "h-14 w-full rounded-xl bg-accent font-semibold text-accent-foreground disabled:opacity-50";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });

    setBusy(false);
    if (error) {
      setError("Couldn't send a code. Check the address and try again.");
    } else {
      setCodeSent(true);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createClient().auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setBusy(false);
      setError("That code didn't work. Check it or request a new one.");
    } else {
      // A full load so proxy sees the new session cookies.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <h1 className="text-3xl font-bold">Fridge Recipes</h1>

      {codeSent ? (
        <form onSubmit={verifyCode} className="flex flex-col gap-3">
          <label htmlFor="code" className="text-muted">
            Enter the code we sent to {email.trim()}
          </label>
          <input
            id="code"
            className={INPUT_CLASS}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <button className={BUTTON_CLASS} disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            className="h-12 text-muted"
            onClick={() => {
              setCodeSent(false);
              setCode("");
              setError(null);
            }}
          >
            Use a different email
          </button>
        </form>
      ) : (
        <form onSubmit={sendCode} className="flex flex-col gap-3">
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
          <button className={BUTTON_CLASS} disabled={busy}>
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
