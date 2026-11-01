import "server-only";
import type { Authed } from "@/lib/guard";

const DEFAULT_STAPLES = [
  "salt",
  "pepper",
  "oil",
  "butter",
  "garlic",
  "onion",
  "rice",
  "pasta",
  "flour",
  "sugar",
  "common spices",
];

export async function getStaples({ supabase, user }: Authed) {
  const { data, error } = await supabase
    .from("pantry_staples")
    .select("items")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return (data?.items as string[] | undefined) ?? DEFAULT_STAPLES;
}
