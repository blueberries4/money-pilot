import React, { useState } from "react";
import { RED, SOFT, TEXT, MUTED, CARD, CAT_COLOR, CAT_ICON } from "../utils/constants";

export default function BudgetSheet({ cat, current, onSave, onClose }) {
  const [val, setVal] = useState(String(current));
  const [err, setErr] = useState(null);
  const parsed = parseFloat(val);

  const handleSave = () => {
    if (!val || isNaN(parsed) || parsed <= 0) {
      setErr("Enter a budget greater than $0");
      return;
    }
    if (parsed > 9999) {
      setErr("Budget seems too high — double check");
      return;
    }
    onSave(parsed);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "fadeIn 0.16s ease",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }} />
      <div
        style={{
          position: "relative",
          background: CARD,
          borderRadius: "24px 24px 0 0",
          padding: "20px 22px 36px",
          animation: "slideUp 0.28s cubic-bezier(.34,1.2,.64,1) both",
          boxShadow: "0 -8px 36px rgba(0,0,0,0.13)",
        }}
      >
        <div style={{ width: 34, height: 4, background: "#E0D8D0", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: CAT_COLOR[cat] + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{CAT_ICON[cat]}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{cat} Budget</div>
            <div style={{ fontSize: 12, color: MUTED }}>Set your monthly limit</div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: SOFT, borderRadius: 14, padding: "4px 16px", border: err ? `1.5px solid ${RED}` : "1.5px solid transparent" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: MUTED }}>$</span>
            <input
              type="number"
              value={val}
              min="1"
              step="1"
              autoFocus
              onChange={(e) => {
                setVal(e.target.value);
                setErr(null);
              }}
              style={{ flex: 1, background: "transparent", border: "none", fontSize: 24, fontWeight: 800, fontFamily: "'DM Mono',monospace", color: TEXT, padding: "12px 0" }}
            />
          </div>
          {err && <div style={{ fontSize: 11, color: RED, marginTop: 6, marginLeft: 4 }}>{err}</div>}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            className="tap"
            onClick={onClose}
            style={{
              flex: 1,
              background: SOFT,
              color: MUTED,
              border: "none",
              borderRadius: 50,
              padding: "14px 0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            className="tap"
            onClick={handleSave}
            style={{
              flex: 2,
              background: CAT_COLOR[cat],
              color: "#fff",
              border: "none",
              borderRadius: 50,
              padding: "14px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
}
