import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { AnalysisSchema, RecipesSchema } from "@/lib/schema";

const MODEL = "claude-sonnet-5-5";

// Kept below the routes' 60 second maxDuration.
const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });

const SYSTEM_PROMPT = `You help a home cook decide what to make from what is in their fridge.

Suggest exactly 3 different recipes that use mostly the ingredients they have. The pantry staples they list are always available, so never put a staple in missing_ingredients.

For each recipe:
- ingredients_used lists what the recipe uses from their ingredients and staples.
- missing_ingredients lists anything else it needs. Keep this as short as possible.
- time_minutes is the total time, including prep.
- steps are short, imperative instructions in cooking order.

If you were given a photo, ingredients lists only the food you can see in it, using plain names like "cheddar" or "red bell pepper". Leave out non-food items and anything you can't identify. If you can't see any food, return empty lists.`;

class RefusalError extends Error {}

async function generate<Schema extends z.ZodType>(
  schema: Schema,
  content: Anthropic.Beta.Messages.BetaContentBlockParam[],
): Promise<z.infer<Schema>> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
        output_config: {
          effort: "medium",
          format: betaZodOutputFormat(schema),
        },
      });

      if (response.stop_reason === "refusal") {
        throw new RefusalError();
      }
      if (response.parsed_output) {
        return response.parsed_output as z.infer<Schema>;
      }
    } catch (error) {
      // The SDK raises a plain AnthropicError when output fails Zod validation.
      // Anything else, including API errors, isn't a parse failure.
      const isParseFailure =
        error instanceof Anthropic.AnthropicError &&
        !(error instanceof Anthropic.APIError);
      if (!isParseFailure) throw error;
    }
    console.warn(`Claude output failed validation (attempt ${attempt})`);
  }

  throw new Error("Claude output failed validation twice");
}

export function analyzeImage(
  image: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  staples: string[],
) {
  return generate(AnalysisSchema, [
    { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
    {
      type: "text",
      text: `This is a photo of my fridge.\n\nPantry staples: ${staples.join(", ")}`,
    },
  ]);
}

export function suggestRecipes(ingredients: string[], staples: string[]) {
  return generate(RecipesSchema, [
    {
      type: "text",
      text: `Ingredients I have: ${ingredients.join(", ")}\n\nPantry staples: ${staples.join(", ")}`,
    },
  ]);
}

export function claudeErrorResponse(error: unknown) {
  console.error("Claude request failed", error);

  if (error instanceof RefusalError) {
    return NextResponse.json(
      { error: "Claude declined this request. Try another photo." },
      { status: 422 },
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    return NextResponse.json(
      { error: "Claude is rate limited. Try again in a minute." },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { error: "Couldn't get recipes. Try again." },
    { status: 502 },
  );
}
