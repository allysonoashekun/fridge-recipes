"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { api } from "@/lib/api";
import type { SavedRecipe } from "@/lib/schema";

export default function SavedPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ recipes: SavedRecipe[] }>("/api/recipes")
      .then((result) => setRecipes(result.recipes))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">Saved recipes</h1>

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      {!recipes && !error && <p className="text-muted">Loading…</p>}
      {recipes?.length === 0 && (
        <p className="text-muted">Recipes you save will show up here.</p>
      )}

      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </>
  );
}
