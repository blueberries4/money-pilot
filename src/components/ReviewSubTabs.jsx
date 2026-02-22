import React from "react";
import { RED, MUTED, SOFT } from "../utils/constants";

export default function ReviewSubTabs({ sub, setSub }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "0 22px 20px" }}>
      {[
        ["score", "Score"],
        ["compare", "vs Last Mo"],
        ["velocity", "Velocity"],
      ].map(([id, label]) => (
        <button
          key={id}
          className="tap"
          onClick={() => setSub(id)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 50,
            border: "none",
            cursor: "pointer",
            background: sub === id ? RED : SOFT,
            color: sub === id ? "#fff" : MUTED,
            fontSize: 12,
            fontWeight: sub === id ? 700 : 500,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            transition: "background 0.18s,color 0.18s",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
