import React, { useState } from "react";
import { RED, SOFT, TEXT, MUTED, CARD } from "../utils/constants";
import { today } from "../utils/helpers";
import { CATS, CAT_COLOR, CAT_ICON } from "../utils/constants";

export default function AddSheet({ onAdd, onClose }) {
  const [f, setF] = useState({ date: today(), item: "", category: "Groceries", amount: "" });
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const validate = () => {
    const e = {};
    if (!f.item.trim()) e.item = "Item name is required";
    const amt = parseFloat(f.amount);
    if (!f.amount || isNaN(amt)) e.amount = "Enter a valid amount";
    else if (amt <= 0) e.amount = "Amount must be greater than $0";
    else if (amt > 9999) e.amount = "Amount looks too high — double check";
    if (!f.date) e.date = "Date is required";
    else if (f.date > today()) e.date = "Date can't be in the future";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    onAdd({ ...f, id: Date.now(), amount: parseFloat(f.amount) });
    onClose();
  };

  const inp = (hasErr) => ({
    width: "100%",
    background: hasErr ? "#FFF0F0" : SOFT,
    border: hasErr ? `1.5px solid ${RED}` : "1.5px solid transparent",
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 15,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: TEXT,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(6px)" }} />
      <div
        style={{
          position: "relative",
          background: CARD,
          borderRadius: "26px 26px 0 0",
          padding: "22px 22px 38px",
          animation: "slideUp 0.3s cubic-bezier(.34,1.2,.64,1) both",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.14)",
        }}
      >
        <div style={{ width: 36, height: 4, background: "#E0D8D0", borderRadius: 2, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 21, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Add Purchase</div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Log what you picked up at Costco</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Item */}
          <div>
            <input
              type="text"
              placeholder="What did you buy?"
              value={f.item}
              onChange={(e) => {
                setF((p) => ({ ...p, item: e.target.value }));
                setErrors((p) => ({ ...p, item: null }));
              }}
              style={inp(errors.item)}
            />
            {errors.item && <div style={{ fontSize: 11, color: RED, marginTop: 4, marginLeft: 4 }}>{errors.item}</div>}
          </div>

          {/* Amount + Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <input
                type="number"
                placeholder="$0.00"
                value={f.amount}
                min="0.01"
                step="0.01"
                onChange={(e) => {
                  setF((p) => ({ ...p, amount: e.target.value }));
                  setErrors((p) => ({ ...p, amount: null }));
                }}
                style={inp(errors.amount)}
              />
              {errors.amount && <div style={{ fontSize: 11, color: RED, marginTop: 4, marginLeft: 4 }}>{errors.amount}</div>}
            </div>
            <div>
              <input
                type="date"
                value={f.date}
                max={today()}
                onChange={(e) => {
                  setF((p) => ({ ...p, date: e.target.value }));
                  setErrors((p) => ({ ...p, date: null }));
                }}
                style={inp(errors.date)}
              />
              {errors.date && <div style={{ fontSize: 11, color: RED, marginTop: 4, marginLeft: 4 }}>{errors.date}</div>}
            </div>
          </div>

          {/* Category picker */}
          <div style={{ background: SOFT, borderRadius: 14, padding: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  className="tap"
                  onClick={() => setF((p) => ({ ...p, category: c }))}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 2px",
                    borderRadius: 10,
                    textAlign: "center",
                    background: f.category === c ? CAT_COLOR[c] + "22" : "transparent",
                    transition: "background 0.14s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 2 }}>{CAT_ICON[c]}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: f.category === c ? CAT_COLOR[c] : MUTED }}>{c}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          className={`tap${shake ? " shake" : ""}`}
          onClick={handleSave}
          style={{
            marginTop: 18,
            width: "100%",
            background: RED,
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "16px 0",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            boxShadow: `0 5px 20px ${RED}40`,
          }}
        >
          Save Purchase
        </button>
      </div>
    </div>
  );
}
