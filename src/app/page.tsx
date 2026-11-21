"use client";

import { useState } from "react";
import FridgeIntro from "@/components/FridgeIntro";
import IngredientChips from "@/components/IngredientChips";
import RecipeCard from "@/components/RecipeCard";
import SnapButton from "@/components/SnapButton";
import { api, jsonRequest } from "@/lib/api";
import { resizeImage } from "@/lib/resizeImage";
import type { Analysis, Recipe } from "@/lib/schema";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function analyze(file: File) {
    return run(async () => {
      let image: Blob;
      try {
        image = await resizeImage(file);
      } catch {
        throw new Error("Couldn't read that photo. Try taking it again.");
      }

      const form = new FormData();
      form.append("image", image, "fridge.jpg");
      const result = await api<Analysis>("/api/analyze", {
        method: "POST",
        body: form,
      });

      setIngredients(result.ingredients);
      setRecipes(result.recipes);
      setHasResult(true);
    });
  }

  function regenerate() {
    return run(async () => {
      const result = await api<{ recipes: Recipe[] }>(
        "/api/regenerate",
        jsonRequest("POST", { ingredients }),
      );
      setRecipes(result.recipes);
    });
  }

  return (
    <>
      <FridgeIntro busy={busy} hasResult={hasResult} />
      <SnapButton busy={busy} onPhoto={analyze} />

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}

      {hasResult && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          {ingredients.length === 0 && (
            <p className="text-muted">
              No food spotted. Add some below or try another photo.
            </p>
          )}
          <IngredientChips
            items={ingredients}
            onChange={setIngredients}
            addLabel="Add an ingredient"
          />
          <button
            className="h-12 rounded-xl border-2 border-accent font-semibold text-accent disabled:opacity-50"
            disabled={busy || ingredients.length === 0}
            onClick={regenerate}
          >
            Regenerate recipes
          </button>
        </section>
      )}

      {recipes.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Recipes</h2>
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${index}-${recipe.name}`} recipe={recipe} canSave />
          ))}
        </section>
      )}
    </>
  );
}
