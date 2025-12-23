import { supabaseServer } from "./supabase/server";

export type ProductCategory = "board" | "boots" | "bindings";

/**
 * Returns a sorted list of unique brands.
 * If category is undefined, returns brands across ALL categories.
 */
export async function getBrandsForCategory(category?: ProductCategory) {
  const supabase = await supabaseServer();

  let query = supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  // IMPORTANT: only filter by category if it exists
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch brands: ${error.message}`);
  }

  // Deduplicate + sort
  const brands = Array.from(
    new Set((data ?? []).map((row) => row.brand).filter(Boolean))
  ) as string[];

  brands.sort((a, b) => a.localeCompare(b));

  return brands;
}
