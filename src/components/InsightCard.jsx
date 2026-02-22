import React from "react";
import { CARD } from "../utils/constants";

export default function InsightCard({ icon, text, color, delay = 0, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: CARD,
        borderRadius: 18,
        padding: "15px 17px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        animation: `fadeUp 0.38s ${delay}s ease both`,
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "all 0.2s ease" : "none",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div style={{ fontSize: 13, color: "#5A4E47", lineHeight: 1.55, paddingTop: 2, fontWeight: 500 }}>{text}</div>
    </div>
  );
}
