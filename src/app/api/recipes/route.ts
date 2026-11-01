import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/guard";
import { RecipeSchema } from "@/lib/schema";

export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const { data, error } = await auth.supabase
    .from("recipes")
    .select(
      "id, name, time_minutes, ingredients_used, missing_ingredients, steps, created_at",
    )
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load recipes", error);
    return NextResponse.json({ error: "Couldn't load recipes" }, { status: 500 });
  }

  return NextResponse.json({ recipes: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const input = RecipeSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "Invalid recipe" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("recipes")
    .insert({
      ...input.data,
      time_minutes: Math.round(input.data.time_minutes),
      user_id: auth.user.id,
    });

  if (error) {
    console.error("Failed to save recipe", error);
    return NextResponse.json({ error: "Couldn't save recipe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
