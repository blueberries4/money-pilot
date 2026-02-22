import React from "react";
import { TEXT, MUTED } from "../utils/constants";

export default function BigRing({ score, grade, emoji, col, msg, monthTotal, daysLeft }) {
  const SZ = 218;
  const R = 88;
  const C = 2 * Math.PI * R;
  const gap = ((100 - score) / 100) * C;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
      <div style={{ position: "relative", width: SZ, height: SZ }}>
        <div
          style={{
            position: "absolute",
            inset: "22%",
            borderRadius: "50%",
            background: `radial-gradient(circle,${col}15 0%,transparent 68%)`,
          }}
        />
        <svg width={SZ} height={SZ} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={SZ / 2} cy={SZ / 2} r={R} fill="none" stroke="#EDE7DF" strokeWidth={13} />
          <circle
            cx={SZ / 2}
            cy={SZ / 2}
            r={R}
            fill="none"
            stroke={col}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={gap}
            className="ring"
            style={{ filter: `drop-shadow(0 0 7px ${col}55)` }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 1, animation: "popIn 0.45s 0.38s cubic-bezier(.34,1.5,.64,1) both" }}>{emoji}</div>
          <div style={{ fontSize: 54, fontWeight: 900, color: col, lineHeight: 1, letterSpacing: "-3px", animation: "countUp 0.45s 0.28s cubic-bezier(.34,1.4,.64,1) both" }}>{grade}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{score}/100</div>
        </div>
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, color: TEXT, marginTop: 2, letterSpacing: "-0.3px", animation: "fadeUp 0.4s 0.5s ease both" }}>{msg}</div>
      <div style={{ display: "flex", gap: 24, marginTop: 14, animation: "fadeUp 0.4s 0.6s ease both" }}>
        {[
          { v: monthTotal, l: "spent this month" },
          { v: `${daysLeft}d`, l: "remaining" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: TEXT, letterSpacing: "-0.5px", fontFamily: "'DM Mono',monospace" }}>{s.v}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
