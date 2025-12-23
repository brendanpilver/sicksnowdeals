import { supabaseServer } from "@/lib/supabase/server";

export type QuizCategory = "all" | "board" | "boots" | "bindings";
export type Ability = "beginner" | "intermediate" | "advanced";
export type Terrain = "groomers" | "park" | "powder" | "all_mountain";
export type FlexPref = "soft" | "medium" | "stiff";

export type QuizAnswers = {
  category: QuizCategory;
  ability: Ability;
  terrain: Terrain;
  flex: FlexPref;
  budgetMaxDollars: number; // e.g. 450
};

export type ProductWithAttrs = {
  id: string;
  category: "board" | "boots" | "bindings";
  brand: string | null;
  title: string;
  image_url: string | null;
  price_cents: number | null;
  sale_price_cents: number | null;
  merchant_name: string | null;
  attrs: Record<string, any>;
};

export type Scored = ProductWithAttrs & {
  score: number;
  why: string[];
};

function priceCents(p: ProductWithAttrs) {
  return p.sale_price_cents ?? p.price_cents ?? null;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Simple heuristic: map quiz flex to target numeric flex (if feed contains it)
function flexTarget(pref: FlexPref) {
  if (pref === "soft") return 3;
  if (pref === "medium") return 6;
  return 8;
}

function scoreOne(a: QuizAnswers, p: ProductWithAttrs): { score: number; why: string[] } {
  const why: string[] = [];
  let score = 0;

  // Budget
  const cents = priceCents(p);
  if (cents != null) {
    const budgetCents = Math.round(a.budgetMaxDollars * 100);
    if (cents <= budgetCents) {
      score += 25;
      why.push("Within your budget");
    } else {
      // penalize over-budget but don’t zero it out
      const over = cents - budgetCents;
      const penalty = clamp(Math.round(over / 5000), 5, 25); // ~5k cents = $50 steps
      score -= penalty;
      why.push("Over budget");
    }
  } else {
    score += 5;
    why.push("Price not listed");
  }

  // Category fit
  if (a.category === "all" || a.category === p.category) {
    score += 10;
  }

  // Terrain/ability rules (very light MVP)
  // Boards: prefer softer for beginners/park, stiffer for advanced/powder/groomers
  const attrs = p.attrs ?? {};
  const flexVal = typeof attrs.flex === "number" ? attrs.flex : null;

  if (flexVal != null) {
    const target = flexTarget(a.flex);
    const diff = Math.abs(flexVal - target);
    const flexScore = clamp(20 - diff * 5, 0, 20);
    score += flexScore;
    why.push(`Flex close to your preference (${a.flex})`);
  } else {
    score += 6;
    why.push("Flex not listed (still considering)");
  }

  // Ability nudges
  if (a.ability === "beginner") {
    if (flexVal != null && flexVal <= 5) score += 8;
    if (p.category === "board") why.push("Beginner-friendly bias");
  } else if (a.ability === "advanced") {
    if (flexVal != null && flexVal >= 7) score += 8;
    if (p.category === "board") why.push("Advanced rider bias");
  } else {
    score += 4;
  }

  // Terrain nudges (if a few common keys exist)
  const profile = typeof attrs.profile === "string" ? attrs.profile.toLowerCase() : "";
  const shape = typeof attrs.shape === "string" ? attrs.shape.toLowerCase() : "";

  if (a.terrain === "powder") {
    if (shape.includes("directional")) score += 8, why.push("Directional bias for powder");
    if (profile.includes("rocker")) score += 6, why.push("Rocker bias for float");
  } else if (a.terrain === "park") {
    if (shape.includes("twin")) score += 8, why.push("Twin-ish bias for park");
    if (flexVal != null && flexVal <= 6) score += 4;
  } else if (a.terrain === "groomers") {
    if (profile.includes("camber")) score += 8, why.push("Camber bias for edge hold");
    if (flexVal != null && flexVal >= 6) score += 4;
  } else {
    score += 5;
    why.push("All-mountain friendly scoring");
  }

  return { score, why };
}

export async function fetchCandidates(category?: "board" | "boots" | "bindings") {
  const supabase = await supabaseServer();

  // Pull products + merchant name + attrs in one go
  let q = supabase
    .from("products")
    .select(
      `
      id, category, brand, title, image_url, price_cents, sale_price_cents,
      merchants:merchant_id ( name ),
      product_attributes ( attrs )
    `
    );

  if (category) q = q.eq("category", category);

  const { data, error } = await q.limit(250);
  if (error) throw new Error(error.message);

  const rows = (data ?? []).map((r: any) => {
    const attrs = r.product_attributes?.[0]?.attrs ?? {};
    return {
      id: r.id,
      category: r.category,
      brand: r.brand ?? null,
      title: r.title,
      image_url: r.image_url ?? null,
      price_cents: r.price_cents ?? null,
      sale_price_cents: r.sale_price_cents ?? null,
      merchant_name: r.merchants?.name ?? null,
      attrs,
    } as ProductWithAttrs;
  });

  return rows;
}

export async function recommend(a: QuizAnswers): Promise<Scored[]> {
  const cat =
    a.category === "all" ? undefined : (a.category as "board" | "boots" | "bindings");

  const candidates = await fetchCandidates(cat);

  const scored = candidates.map((p) => {
    const { score, why } = scoreOne(a, p);
    return { ...p, score, why };
  });

  scored.sort((x, y) => y.score - x.score);
  return scored;
}
