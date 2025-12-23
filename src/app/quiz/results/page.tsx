import { recommend, type QuizAnswers } from "@/lib/recommend";
import { ProductCard } from "@/components/ProductCard";

function safeNum(v: unknown, def: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export default async function QuizResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const answers: QuizAnswers = {
    category:
      typeof sp.category === "string" ? (sp.category as any) : "all",
    ability:
      typeof sp.ability === "string" ? (sp.ability as any) : "intermediate",
    terrain:
      typeof sp.terrain === "string" ? (sp.terrain as any) : "all_mountain",
    flex: typeof sp.flex === "string" ? (sp.flex as any) : "medium",
    budgetMaxDollars: safeNum(sp.budget, 500),
  };

  const scored = await recommend(answers);
  const top = scored.slice(0, 12);

  return (
    <main style={{ padding: 18, display: "grid", gap: 12 }}>
      <a href="/quiz">← Back to quiz</a>

      <h1>Your Matches</h1>

      <div style={{ color: "#666" }}>
        Category: <b>{answers.category}</b> · Ability: <b>{answers.ability}</b> · Terrain:{" "}
        <b>{answers.terrain}</b> · Flex: <b>{answers.flex}</b> · Budget:{" "}
        <b>${answers.budgetMaxDollars}</b>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {top.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>
              Score: <b>{p.score}</b>
            </div>

            <ProductCard product={p} showCategory={answers.category === "all"} />

            <ul style={{ margin: 0, paddingLeft: 18, color: "#555", fontSize: 13 }}>
              {p.why.slice(0, 3).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>

            <a href={`/gear/p/${p.id}`} style={{ fontWeight: 700 }}>
              View details →
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}
