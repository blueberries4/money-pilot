import React from "react";
import { RED, MUTED } from "../utils/constants";

export default function BottomNav({ tab, setTab, onAdd }) {
  const TABS = [
    { id: "home", icon: "◉", label: "Home" },
    { id: "spending", icon: "◈", label: "Spending" },
    { id: "products", icon: "★", label: "Products" },
    { id: "review", icon: "↺", label: "Review" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(252,249,246,0.94)",
        backdropFilter: "blur(18px)",
        borderTop: `1px solid rgba(0,0,0,0.07)`,
        paddingBottom: 6,
      }}
    >
      <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)" }}>
        <button
          className="tap"
          onClick={onAdd}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: RED,
            border: "3px solid #F0EBE3",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#fff",
            boxShadow: `0 5px 20px ${RED}55`,
          }}
        >
          +
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 4px 0" }}>
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "3px 0",
                color: on ? RED : MUTED,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                transition: "color 0.16s ease",
              }}
            >
              <div style={{ fontSize: 19, transition: "transform 0.18s cubic-bezier(.34,1.5,.64,1)", transform: on ? "scale(1.22)" : "scale(1)" }}>{t.icon}</div>
              <div style={{ fontSize: 10, fontWeight: on ? 700 : 500 }}>{t.label}</div>
              {on && <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
