"use client";

import { useState } from "react";
import { api, jsonRequest } from "@/lib/api";
import type { Recipe } from "@/lib/schema";

type Props = {
  recipe: Recipe;
  canSave?: boolean;
};

export default function RecipeCard({ recipe, canSave = false }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      await api("/api/recipes", jsonRequest("POST", recipe));
      setStatus("saved");
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-4">
      <header>
        <h3 className="text-xl font-semibold">{recipe.name}</h3>
        <p className="text-muted">{recipe.time_minutes} min</p>
      </header>

      <section>
        <h4 className="font-medium">You have</h4>
        <p className="text-muted">{recipe.ingredients_used.join(", ")}</p>
      </section>

      {recipe.missing_ingredients.length > 0 && (
        <section>
          <h4 className="font-medium">You&rsquo;ll need</h4>
          <p className="text-muted">{recipe.missing_ingredients.join(", ")}</p>
        </section>
      )}

      <section>
        <h4 className="font-medium">Steps</h4>
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      {canSave && (
        <button
          className="h-12 rounded-xl bg-accent font-semibold text-accent-foreground disabled:opacity-50"
          disabled={status !== "idle"}
          onClick={save}
        >
          {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save"}
        </button>
      )}
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </article>
  );
}
