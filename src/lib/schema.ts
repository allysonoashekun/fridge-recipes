import { z } from "zod";

export const RecipeSchema = z.object({
  name: z.string(),
  time_minutes: z.number(),
  ingredients_used: z.array(z.string()),
  missing_ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export const RecipesSchema = z.object({
  recipes: z.array(RecipeSchema),
});

export const AnalysisSchema = RecipesSchema.extend({
  ingredients: z.array(z.string()),
});

const ItemList = z.array(z.string().trim().min(1).max(100)).max(200);

export const IngredientsInputSchema = z.object({
  ingredients: ItemList.min(1),
});

export const PantryInputSchema = z.object({
  items: ItemList,
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type SavedRecipe = Recipe & { id: string; created_at: string };
export type Analysis = z.infer<typeof AnalysisSchema>;
