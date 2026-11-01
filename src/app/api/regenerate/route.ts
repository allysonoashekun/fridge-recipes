import { NextResponse, type NextRequest } from "next/server";
import { claudeErrorResponse, suggestRecipes } from "@/lib/claude";
import { consumeQuota, requireUser } from "@/lib/guard";
import { getStaples } from "@/lib/pantry";
import { IngredientsInputSchema } from "@/lib/schema";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const input = IngredientsInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!input.success) {
    return NextResponse.json({ error: "Invalid ingredients" }, { status: 400 });
  }

  const blocked = await consumeQuota(auth);
  if (blocked) return blocked;

  try {
    const staples = await getStaples(auth);
    return NextResponse.json(
      await suggestRecipes(input.data.ingredients, staples),
    );
  } catch (error) {
    return claudeErrorResponse(error);
  }
}
