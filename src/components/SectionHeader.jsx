import React from "react";
import { RED, BLUE, TEXT, MUTED } from "../utils/constants";

export default function SectionHeader({ label, sub, gradient, children }) {
  return (
    <div
      style={{
        background: gradient || `linear-gradient(155deg,#FFF8F5,#FDE8E8)`,
        padding: "52px 22px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `${RED}08`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: `${BLUE}06`,
        }}
      />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 4, letterSpacing: "0.02em" }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: TEXT, letterSpacing: "-0.7px", marginBottom: sub ? 4 : 0 }}>{sub}</div>
        {children}
      </div>
    </div>
  );
}
