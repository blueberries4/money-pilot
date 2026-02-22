import React from "react";
import { CAT_COLOR, CAT_ICON, RED, GREEN, BLUE, MUTED, TEXT, CARD, SOFT } from "../utils/constants";
import { fmt } from "../utils/helpers";

export default function CatCard({ cat, spent, budget, momDelta, velocity, delay = 0, onEditBudget }) {
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  const col = CAT_COLOR[cat];
  const momUp = momDelta !== null && momDelta > 0;
  const velCfg = {
    fast: { label: "🔥 Spending fast", col: RED },
    "on-track": { label: "✓ On track", col: GREEN },
    slow: { label: "💚 Under pace", col: BLUE },
    none: { label: "No spend yet", col: MUTED },
  }[velocity];

  return (
    <div
      className="lift"
      style={{
        background: CARD,
        borderRadius: 20,
        padding: "18px 18px",
        boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        animation: `fadeUp 0.38s ${delay}s ease both`,
        border: over ? `1px solid ${RED}22` : `1px solid transparent`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: col + "14",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 21,
            }}
          >
            {CAT_ICON[cat]}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{cat}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: velCfg.col, marginTop: 1 }}>{velCfg.label}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: over ? RED : TEXT, letterSpacing: "-0.4px", fontFamily: "'DM Mono',monospace" }}>{fmt(spent)}</div>
          <button
            className="tap"
            onClick={() => onEditBudget(cat)}
            style={{
              fontSize: 11,
              color: MUTED,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              marginTop: 1,
              textDecoration: "underline",
              textDecorationColor: "rgba(155,142,133,0.4)",
            }}
          >
            of {fmt(budget)}
          </button>
        </div>
      </div>

      <div style={{ height: 7, background: SOFT, borderRadius: 4, overflow: "hidden", marginBottom: 9 }}>
        <div
          className="bar"
          style={{
            height: "100%",
            width: `${pct}%`,
            background: over ? RED : col,
            borderRadius: 4,
            boxShadow: over ? `0 0 8px ${RED}44` : `0 0 6px ${col}33`,
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: over ? RED : MUTED, fontWeight: over ? 600 : 400 }}>
          {over ? `${fmt(spent - budget)} over budget` : `${fmt(budget - spent)} left`}
        </span>
        {momDelta !== null && (
          <span style={{ fontSize: 11, fontWeight: 700, color: momUp ? RED : GREEN, background: momUp ? RED + "10" : GREEN + "10", padding: "2px 9px", borderRadius: 20 }}>
            {momUp ? "↑" : "↓"}{Math.abs(momDelta).toFixed(0)}% vs Jan
          </span>
        )}
        {momDelta === null && <span style={{ fontSize: 11, color: MUTED }}>No prior data</span>}
      </div>
    </div>
  );
}
