import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: product, error } = await supabase
    .from("products")
    .select("id, merchant_id, canonical_url, affiliate_url")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sessionId = req.cookies.get("sb_session")?.value ?? crypto.randomUUID();
  const ua = req.headers.get("user-agent") ?? "";
  const ref = req.headers.get("referer") ?? "";

  // Fire-and-forget click log
  supabase
    .from("click_events")
    .insert({
      session_id: sessionId,
      product_id: product.id,
      merchant_id: product.merchant_id,
      referrer_path: ref,
      user_agent: ua,
    })
    .then(() => {})
    .catch(() => {});

  const dest = product.affiliate_url || product.canonical_url;
  if (!dest) {
    return NextResponse.redirect(new URL(`/gear/${product.id}`, req.url));
  }

  const res = NextResponse.redirect(dest, { status: 302 });

  if (!req.cookies.get("sb_session")) {
    res.cookies.set("sb_session", sessionId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
