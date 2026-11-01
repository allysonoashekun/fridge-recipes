"use client";

import { useEffect, useState } from "react";
import IngredientChips from "@/components/IngredientChips";
import { api, jsonRequest } from "@/lib/api";

export default function PantryPage() {
  const [items, setItems] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ items: string[] }>("/api/pantry")
      .then((result) => setItems(result.items))
      .catch((err: Error) => setError(err.message));
  }, []);

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      await api("/api/pantry", jsonRequest("PUT", { items }));
      setStatus("saved");
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  }

  return (
    <>
      <header>
        <h1 className="text-2xl font-bold">Pantry staples</h1>
        <p className="text-muted">
          Recipes assume you always have these on hand.
        </p>
      </header>

      {!items && !error && <p className="text-muted">Loading…</p>}

      {items && (
        <>
          <IngredientChips
            items={items}
            onChange={(next) => {
              setItems(next);
              setStatus("idle");
            }}
            addLabel="Add a staple"
          />
          <button
            className="h-12 rounded-xl bg-accent font-semibold text-accent-foreground disabled:opacity-50"
            disabled={status !== "idle"}
            onClick={save}
          >
            {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save"}
          </button>
        </>
      )}

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </>
  );
}
