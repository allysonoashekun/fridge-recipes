import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/guard";
import { getStaples } from "@/lib/pantry";
import { PantryInputSchema } from "@/lib/schema";

export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  try {
    return NextResponse.json({ items: await getStaples(auth) });
  } catch (error) {
    console.error("Failed to load staples", error);
    return NextResponse.json({ error: "Couldn't load staples" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const input = PantryInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!input.success) {
    return NextResponse.json({ error: "Invalid staples" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("pantry_staples")
    .upsert(
      { user_id: auth.user.id, items: input.data.items },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("Failed to save staples", error);
    return NextResponse.json({ error: "Couldn't save staples" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
