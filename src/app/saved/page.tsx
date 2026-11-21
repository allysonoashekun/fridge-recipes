"use client";

import { useEffect, useState } from "react";
import Fridge, { SpeechBubble } from "@/components/Fridge";
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
      <header className="flex items-end gap-3">
        <Fridge pose="heart" className="h-20 w-16 shrink-0" />
        <h1 className="pb-2 text-2xl font-bold">Saved recipes</h1>
      </header>

      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      {!recipes && !error && (
        <div className="flex items-center gap-3 text-muted">
          <Fridge pose="think" bobbing className="h-14 w-11" />
          Loading…
        </div>
      )}
      {recipes?.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-8">
          <SpeechBubble className="pop-in">nothing saved yet!</SpeechBubble>
          <Fridge className="h-36 w-28" />
          <p className="text-muted">Recipes you save will show up here.</p>
        </div>
      )}

      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </>
  );
}
