"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Filters({
  category,
  brands = [],
  basePath,
}: {
  category: string;
  brands: string[];
  basePath?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const path = basePath ?? `/${category}`;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    const target = qs ? `${path}?${qs}` : path;
    router.push(target);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input
        placeholder="Search…"
        defaultValue={sp.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
      />

      <select
        defaultValue={sp.get("brand") ?? ""}
        onChange={(e) => setParam("brand", e.target.value)}
      >
        <option value="">All brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Min $"
          defaultValue={sp.get("min") ?? ""}
          onChange={(e) => setParam("min", e.target.value)}
        />
        <input
          placeholder="Max $"
          defaultValue={sp.get("max") ?? ""}
          onChange={(e) => setParam("max", e.target.value)}
        />
      </div>

      <select
        defaultValue={sp.get("sort") ?? "best_deal"}
        onChange={(e) => setParam("sort", e.target.value)}
      >
        <option value="best_deal">Best deal (low to high)</option>
        <option value="price_asc">Price (low to high)</option>
        <option value="price_desc">Price (high to low)</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
