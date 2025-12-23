"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuizPage() {
  const router = useRouter();

  const [category, setCategory] = useState("all");
  const [ability, setAbility] = useState("intermediate");
  const [terrain, setTerrain] = useState("all_mountain");
  const [flex, setFlex] = useState("medium");
  const [budget, setBudget] = useState(500);

  function go() {
    const sp = new URLSearchParams();
    sp.set("category", category);
    sp.set("ability", ability);
    sp.set("terrain", terrain);
    sp.set("flex", flex);
    sp.set("budget", String(budget));
    router.push(`/quiz/results?${sp.toString()}`);
  }

  return (
    <main style={{ padding: 18, maxWidth: 720, margin: "0 auto", display: "grid", gap: 14 }}>
      <h1>Rider Quiz</h1>
      <p>Answer a few questions and we’ll rank gear picks for you.</p>

      <label style={{ display: "grid", gap: 6 }}>
        <b>Category</b>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="board">Boards</option>
          <option value="boots">Boots</option>
          <option value="bindings">Bindings</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <b>Ability</b>
        <select value={ability} onChange={(e) => setAbility(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <b>Terrain</b>
        <select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
          <option value="groomers">Groomers</option>
          <option value="park">Park</option>
          <option value="powder">Powder</option>
          <option value="all_mountain">All-mountain</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <b>Flex preference</b>
        <select value={flex} onChange={(e) => setFlex(e.target.value)}>
          <option value="soft">Soft</option>
          <option value="medium">Medium</option>
          <option value="stiff">Stiff</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <b>Budget (max)</b>
        <input
          type="number"
          min={50}
          step={25}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </label>

      <button onClick={go} style={{ padding: "10px 12px", fontWeight: 700 }}>
        See my matches →
      </button>

      <a href="/gear" style={{ marginTop: 6 }}>
        ← Back to Gear Finder
      </a>
    </main>
  );
}
