import React from "react";
import { RED, GREEN } from "../utils/constants";

export default function CoachBanner({ line }) {
  const isWarn = line.startsWith("⚠️") || line.startsWith("🔥");
  const col = isWarn ? RED : GREEN;
  return (
    <div
      style={{
        background: col + "12",
        border: `1px solid ${col}28`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        animation: "fadeUp 0.4s 0.1s ease both",
      }}
    >
      <div style={{ fontSize: 13, color: col, fontWeight: 600, lineHeight: 1.5 }}>{line}</div>
    </div>
  );
}
