import React, { useState, useEffect, useMemo } from "react";
import { CATS, CAT_COLOR, CAT_ICON, RED, GREEN, BLUE, AMBER, BG, CARD, TEXT, MUTED, BORDER, SOFT } from "./utils/constants";
import { fmt, mKey, mLbl, calcScore, gradeInfo, coachingLine, getBudgetSuggestions } from "./utils/helpers";
import { styles } from "./utils/styles";
import { api } from "./api/mockApi";
import AddSheet from "./components/AddSheet";
import BudgetSheet from "./components/BudgetSheet";
import BottomNav from "./components/BottomNav";
import BigRing from "./components/BigRing";
import CoachBanner from "./components/CoachBanner";
import InsightCard from "./components/InsightCard";
import SectionHeader from "./components/SectionHeader";
import CatCard from "./components/CatCard";
import ReviewSubTabs from "./components/ReviewSubTabs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [purchases, setPurchases] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [tab, setTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [reviewSub, setReviewSub] = useState("score");
  const [animKey, setAnimKey] = useState(0);

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [purchasesRes, budgetsRes] = await Promise.all([api.getPurchases(), api.getBudgets()]);
        if (purchasesRes.success) setPurchases(purchasesRes.data);
        if (budgetsRes.success) setBudgets(budgetsRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = styles;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => setAnimKey((k) => k + 1), [tab]);

  /* DATE */
  const now = useMemo(() => new Date(), []);
  const curKey = mKey(now.toISOString());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysLeft = daysInMonth - daysPassed;
  const timePct = daysPassed / daysInMonth;

  const prevKey = useMemo(() => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return mKey(d.toISOString());
  }, [now]);

  /* DATA */
  const curP = useMemo(() => purchases.filter((p) => mKey(p.date) === curKey), [purchases, curKey]);
  const prevP = useMemo(() => purchases.filter((p) => mKey(p.date) === prevKey), [purchases, prevKey]);

  const totalMo = useMemo(() => curP.reduce((s, p) => s + p.amount, 0), [curP]);
  const totalBudget = useMemo(() => CATS.reduce((s, c) => s + budgets[c], 0), [budgets]);

  const catSpend = useMemo(() => {
    const m = {};
    CATS.forEach((c) => (m[c] = 0));
    curP.forEach((p) => {
      m[p.category] = (m[p.category] || 0) + p.amount;
    });
    return m;
  }, [curP]);

  const prevCatSpend = useMemo(() => {
    const m = {};
    CATS.forEach((c) => (m[c] = 0));
    prevP.forEach((p) => {
      m[p.category] = (m[p.category] || 0) + p.amount;
    });
    return m;
  }, [prevP]);

  /* SCORE */
  const score = useMemo(() => calcScore(catSpend, budgets), [catSpend, budgets]);
  const scoreInfo = useMemo(() => gradeInfo(score), [score]);

  /* VELOCITY */
  const velMap = useMemo(() => {
    const m = {};
    CATS.forEach((c) => {
      const sp = catSpend[c],
        bu = budgets[c];
      if (sp === 0) {
        m[c] = "none";
        return;
      }
      const ratio = (sp / bu) / Math.max(timePct, 0.01);
      m[c] = ratio > 1.25 ? "fast" : ratio > 0.75 ? "on-track" : "slow";
    });
    return m;
  }, [catSpend, budgets, timePct]);
  const velStatus = (c) => velMap[c] || "none";

  /* MoM delta */
  const momMap = useMemo(() => {
    const m = {};
    CATS.forEach((c) => {
      const cur = catSpend[c],
        prev = prevCatSpend[c];
      m[c] = prev === 0 ? null : ((cur - prev) / prev) * 100;
    });
    return m;
  }, [catSpend, prevCatSpend]);
  const momDelta = (c) => momMap[c] ?? null;

  /* TREND */
  const trend = useMemo(() => {
    const m = {};
    purchases.forEach((p) => {
      const k = mKey(p.date);
      m[k] = (m[k] || 0) + p.amount;
    });
    return Object.keys(m)
      .sort()
      .map((k) => ({ month: mLbl(k), total: parseFloat(m[k].toFixed(2)) }));
  }, [purchases]);

  /* PRODUCTS */
  const productStats = useMemo(() => {
    const map = {};
    purchases.forEach((p) => {
      const k = p.item.trim().toLowerCase();
      if (!map[k]) map[k] = { name: p.item.trim(), count: 0, totalSpent: 0, category: p.category, lastDate: p.date };
      map[k].count++;
      map[k].totalSpent += p.amount;
      if (p.date > map[k].lastDate) map[k].lastDate = p.date;
    });
    return Object.values(map)
      .map((p) => ({ ...p, avgPrice: p.totalSpent / p.count }))
      .sort((a, b) => b.count - a.count);
  }, [purchases]);

  /* COACHING LINE */
  const coachLine = useMemo(() => coachingLine(catSpend, budgets, timePct, daysLeft, totalMo, totalBudget), [catSpend, budgets, timePct, daysLeft, totalMo, totalBudget]);

  /* BUDGET SUGGESTIONS */
  const budgetSuggestions = useMemo(() => getBudgetSuggestions(purchases, budgets), [purchases, budgets]);

  /* INSIGHTS */
  const insights = useMemo(() => {
    const list = [];
    const expected = totalBudget * timePct;
    if (totalMo > expected * 1.1) list.push({ icon: "🚨", col: RED, text: `You've spent ${fmt(totalMo - expected)} more than expected for this point in February.` });
    else list.push({ icon: "💚", col: GREEN, text: `You're ${fmt(expected - totalMo)} under pace — great discipline this month!` });
    CATS.filter((c) => momMap[c] !== null && momMap[c] > 25)
      .slice(0, 2)
      .forEach((c) => {
        list.push({ icon: "⚠️", col: AMBER, text: `${c} is up ${momMap[c].toFixed(0)}% vs last month.` });
      });
    CATS.filter((c) => momMap[c] !== null && momMap[c] < -20)
      .slice(0, 1)
      .forEach((c) => {
        list.push({ icon: "🎉", col: GREEN, text: `${c} spending is down ${Math.abs(momMap[c]).toFixed(0)}% vs January.` });
      });
    if (budgetSuggestions.length > 0) {
      const sug = budgetSuggestions[0];
      list.push({ icon: "💡", col: AMBER, text: `Consider raising ${sug.category} budget from ${fmt(sug.currentBudget)} to ${fmt(sug.suggestedBudget)}.`, suggestion: sug });
    }
    if (productStats[0]) list.push({ icon: "📦", col: BLUE, text: `Most-bought: "${productStats[0].name}" — ${productStats[0].count} times, ${fmt(productStats[0].totalSpent)} total.` });
    return list.slice(0, 4);
  }, [totalMo, totalBudget, timePct, productStats, momMap, budgetSuggestions]);

  const alerts = useMemo(() => CATS.filter((c) => catSpend[c] > budgets[c]), [catSpend, budgets]);

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", background: "#E5DED4" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: BG, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.2)" }}>
        <div style={{ overflowY: "auto", height: "100vh", paddingBottom: 96, scrollbarWidth: "none" }}>
          {/* HOME */}
          {tab === "home" && (
            <div key={`h-${animKey}`}>
              <div style={{ background: "linear-gradient(155deg,#FFF8F5 0%,#FDEAEA 100%)", padding: "52px 22px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: `${RED}08` }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 4 }}>Good morning 👋</div>
                <div style={{ fontSize: 25, fontWeight: 900, color: TEXT, letterSpacing: "-0.6px", marginBottom: 20 }}>
                  Your February
                  <br />
                  spending so far
                </div>
                <BigRing score={score} grade={scoreInfo.grade} emoji={scoreInfo.emoji} col={scoreInfo.col} msg={scoreInfo.msg} monthTotal={fmt(totalMo)} daysLeft={daysLeft} />
              </div>

              <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                <CoachBanner line={coachLine} />

                <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginTop: 4, marginBottom: 2 }}>What to know</div>
                {insights.map((ins, i) => (
                  <InsightCard 
                    key={i} 
                    icon={ins.icon} 
                    text={ins.text} 
                    color={ins.col} 
                    delay={0.05 + i * 0.07}
                    onClick={ins.suggestion ? () => setEditBudget(ins.suggestion.category) : undefined}
                  />
                ))}

                <div style={{ background: CARD, borderRadius: 20, padding: "18px 18px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.4s 0.38s ease both", marginTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Monthly trend</div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>Last 5 months</div>
                  <ResponsiveContainer width="100%" height={96}>
                    <AreaChart data={trend.slice(-5)}>
                      <defs>
                        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={RED} stopOpacity={0.22} />
                          <stop offset="100%" stopColor={RED} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 10, fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: CARD, border: "none", borderRadius: 10, boxShadow: "0 4px 14px rgba(0,0,0,0.09)", fontSize: 12, fontFamily: "Plus Jakarta Sans" }} formatter={(v) => [fmt(v), "Spent"]} />
                      <Area type="monotone" dataKey="total" stroke={RED} strokeWidth={2.5} fill="url(#gr)" dot={false} activeDot={{ r: 4, fill: RED, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {alerts.length > 0 && (
                  <div style={{ background: RED, borderRadius: 18, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", animation: "fadeUp 0.4s 0.46s ease both", boxShadow: `0 5px 18px ${RED}44`, marginTop: 2 }}>
                    <div style={{ fontSize: 22 }}>⚠️</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Over budget in {alerts.length} {alerts.length === 1 ? "category" : "categories"}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 1 }}>{alerts.join(" · ")}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SPENDING */}
          {tab === "spending" && (
            <div key={`s-${animKey}`}>
              <SectionHeader label="February 2026" sub="Spending" gradient="linear-gradient(155deg,#FFF8F5,#EEF4FF)">
                <div style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
                  <span style={{ color: TEXT, fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{fmt(totalMo)}</span>
                  {" of "}
                  <span style={{ fontWeight: 700 }}>{fmt(totalBudget)}</span> budget used
                </div>
                <div style={{ height: 5, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden", marginTop: 12 }}>
                  <div style={{ height: "100%", background: totalMo > totalBudget ? RED : BLUE, borderRadius: 3, width: `${Math.min((totalMo / totalBudget) * 100, 100)}%`, transition: "width 0.8s ease" }} />
                </div>
              </SectionHeader>

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 11 }}>
                {CATS.map((c, i) => (
                  <CatCard key={c} cat={c} spent={catSpend[c]} budget={budgets[c]} momDelta={momDelta(c)} velocity={velStatus(c)} delay={i * 0.055} onEditBudget={(c) => setEditBudget(c)} />
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <div key={`p-${animKey}`}>
              <SectionHeader label="All time" sub="Products" gradient="linear-gradient(155deg,#FFF8F5,#F0FFF4)">
                <div style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>{productStats.length} unique items tracked</div>
              </SectionHeader>

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 11 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Most bought", emoji: "🏆", col: RED, p: productStats[0] },
                    { label: "Least bought", emoji: "💤", col: BLUE, p: productStats[productStats.length - 1] },
                  ].map(({ label, emoji, col, p }) =>
                    p ? (
                      <div key={label} style={{ background: CARD, borderRadius: 18, padding: "16px 14px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", border: `1px solid ${col}16` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>
                          {emoji} {label}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, lineHeight: 1.25, marginBottom: 10 }}>{p.name}</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: col, fontFamily: "'DM Mono',monospace" }}>{p.count}×</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{fmt(p.totalSpent)} total</div>
                      </div>
                    ) : null
                  )}
                </div>

                <div style={{ background: CARD, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.055)" }}>
                  <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>Purchase Frequency</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Ranked by times bought</div>
                  </div>
                  {productStats.map((p, i) => {
                    const maxC = productStats[0]?.count || 1;
                    const isFirst = i === 0,
                      isLast = i === productStats.length - 1;
                    return (
                      <div key={p.name} style={{ padding: "13px 18px", borderBottom: i < productStats.length - 1 ? `1px solid ${BORDER}` : "none", animation: `fadeUp 0.3s ${0.04 + i * 0.04}s ease both` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: CAT_COLOR[p.category] + "16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                              {CAT_ICON[p.category]}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                              <div style={{ fontSize: 10, color: MUTED }}>
                                {fmt(p.avgPrice)} avg · last {p.lastDate}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, fontFamily: "'DM Mono',monospace" }}>{p.count}×</div>
                            {isFirst && <span>🏆</span>}
                            {isLast && productStats.length > 1 && <span>💤</span>}
                          </div>
                        </div>
                        <div style={{ height: 4, background: SOFT, borderRadius: 2, overflow: "hidden" }}>
                          <div className="bar" style={{ height: "100%", borderRadius: 2, width: `${(p.count / maxC) * 100}%`, background: `linear-gradient(90deg,${RED},${BLUE})`, animationDelay: `${0.08 + i * 0.04}s` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* REVIEW */}
          {tab === "review" && (
            <div key={`r-${animKey}`}>
              <SectionHeader label="Retrospection" sub="Review" gradient="linear-gradient(155deg,#FFF8F5,#FDEAEA)">
                <div style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
                  {daysLeft} days left · {Math.round(timePct * 100)}% through February
                </div>
              </SectionHeader>

              <div style={{ padding: "16px 20px 4px" }}>
                <ReviewSubTabs sub={reviewSub} setSub={setReviewSub} />
              </div>

              <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 11 }}>
                {/* Score sub-tab */}
                {reviewSub === "score" && (
                  <>
                    <div style={{ background: CARD, borderRadius: 20, padding: "22px 20px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.35s ease both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <div style={{ fontSize: 44 }}>{scoreInfo.emoji}</div>
                        <div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: scoreInfo.col, lineHeight: 1, letterSpacing: "-1px" }}>{scoreInfo.grade}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginTop: 2 }}>{scoreInfo.msg}</div>
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{score}/100</div>
                        </div>
                      </div>
                      <div style={{ height: 7, background: SOFT, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${score}%`, borderRadius: 4, background: `linear-gradient(90deg,${RED},${scoreInfo.col})`, transition: "width 1s ease", boxShadow: `0 0 8px ${scoreInfo.col}44` }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: MUTED }}>
                        {["F", "D", "C", "B", "A", "A+"].map((g) => (
                          <span key={g}>{g}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: CARD, borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.35s 0.1s ease both" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Category breakdown</div>
                      {CATS.map((c, i) => {
                        const sp = catSpend[c],
                          bu = budgets[c],
                          ov = sp > bu;
                        const catScore = bu === 0 ? null : sp === 0 ? 100 : sp <= bu ? 100 : Math.max(0, Math.round(100 - ((sp - bu) / bu) * 120));
                        return (
                          <div key={c} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11, animation: `fadeUp 0.3s ${0.12 + i * 0.04}s ease both` }}>
                            <span style={{ fontSize: 15, width: 22 }}>{CAT_ICON[c]}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, flex: 1 }}>{c}</span>
                            <div style={{ width: 70, height: 4, background: SOFT, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 2, width: `${catScore ?? 0}%`, background: ov ? RED : GREEN }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: ov ? RED : GREEN, width: 28, textAlign: "right", fontFamily: "'DM Mono',monospace" }}>{catScore ?? "-"}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ background: CARD, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.35s 0.18s ease both" }}>
                      <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Recent Purchases</div>
                      </div>
                      {[...purchases]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 7)
                        .map((p, i) => (
                          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: i < 6 ? `1px solid ${BORDER}` : "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: 11, background: CAT_COLOR[p.category] + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                                {CAT_ICON[p.category]}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{p.item}</div>
                                <div style={{ fontSize: 11, color: MUTED }}>{p.date}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, fontFamily: "'DM Mono',monospace" }}>{fmt(p.amount)}</div>
                              <button
                                className="tap"
                                onClick={async () => {
                                  const res = await api.deletePurchase(p.id);
                                  if (res.success) setPurchases((pr) => pr.filter((x) => x.id !== p.id));
                                }}
                                style={{ background: SOFT, border: "none", color: MUTED, width: 24, height: 24, borderRadius: 7, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Compare sub-tab */}
                {reviewSub === "compare" && (
                  <div style={{ background: CARD, borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.35s ease both" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, marginBottom: 4 }}>vs January</div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 20 }}>Left bar = Jan · Right = Feb · Color shows direction</div>
                    {CATS.filter((c) => catSpend[c] > 0 || prevCatSpend[c] > 0).map((c, i) => {
                      const cur = catSpend[c],
                        prev = prevCatSpend[c];
                      const delta = prev > 0 ? ((cur - prev) / prev) * 100 : null;
                      const worse = delta !== null && delta > 0,
                        better = delta !== null && delta < 0;
                      return (
                        <div key={c} style={{ marginBottom: 18, animation: `fadeUp 0.3s ${0.06 + i * 0.06}s ease both` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 15 }}>{CAT_ICON[c]}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{c}</span>
                            </div>
                            {delta !== null ? (
                              <span style={{ fontSize: 11, fontWeight: 700, color: worse ? RED : GREEN, background: worse ? RED + "10" : GREEN + "10", padding: "2px 10px", borderRadius: 20 }}>
                                {worse ? "↑" : "↓"}
                                {Math.abs(delta).toFixed(0)}%
                              </span>
                            ) : (
                              <span style={{ fontSize: 11, color: MUTED }}>New</span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ height: 5, background: SOFT, borderRadius: 3, overflow: "hidden" }}>
                                {prev > 0 && (
                                  <div style={{ height: "100%", background: "#C8BEB5", borderRadius: 3, width: `${Math.min((prev / budgets[c]) * 100, 100)}%` }} />
                                )}
                              </div>
                              <div style={{ fontSize: 9, color: MUTED, marginTop: 3, textAlign: "center", fontFamily: "'DM Mono',monospace" }}>{prev > 0 ? fmt(prev) : "—"}</div>
                            </div>
                            <span style={{ fontSize: 12, color: MUTED }}>→</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ height: 5, background: SOFT, borderRadius: 3, overflow: "hidden" }}>
                                {cur > 0 && <div style={{ height: "100%", borderRadius: 3, background: worse ? RED : better ? GREEN : CAT_COLOR[c], width: `${Math.min((cur / budgets[c]) * 100, 100)}%` }} />}
                              </div>
                              <div style={{ fontSize: 9, fontWeight: 600, marginTop: 3, textAlign: "center", fontFamily: "'DM Mono',monospace", color: worse ? RED : better ? GREEN : MUTED }}>
                                {cur > 0 ? fmt(cur) : "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Velocity sub-tab */}
                {reviewSub === "velocity" && (
                  <div style={{ background: CARD, borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)", animation: "fadeUp 0.35s ease both" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Spending Velocity</div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 20 }}>
                      You're {Math.round(timePct * 100)}% through the month. The line marks where your spend should be right now.
                    </div>
                    {CATS.map((c, i) => {
                      const sp = catSpend[c],
                        bu = budgets[c];
                      const budPct = Math.min((sp / bu) * 100, 100);
                      const status = velStatus(c);
                      const cfg = {
                        fast: { label: "Spending fast", col: RED },
                        "on-track": { label: "On track", col: GREEN },
                        slow: { label: "Under pace", col: BLUE },
                        none: { label: "No spend", col: MUTED },
                      }[status];
                      return (
                        <div key={c} style={{ marginBottom: 18, animation: `fadeUp 0.3s ${0.06 + i * 0.05}s ease both` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 14 }}>{CAT_ICON[c]}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{c}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: cfg.col }}>{cfg.label}</span>
                          </div>
                          <div style={{ height: 7, background: SOFT, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                            <div style={{ position: "absolute", left: `${timePct * 100}%`, top: 0, bottom: 0, width: 2, background: "rgba(0,0,0,0.18)", zIndex: 2, borderRadius: 1 }} />
                            <div style={{ height: "100%", width: `${budPct}%`, borderRadius: 4, background: status === "fast" ? RED : cfg.col, transition: "width 0.8s ease", boxShadow: `0 0 5px ${cfg.col}44` }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginTop: 4 }}>
                            <span>{fmt(sp)} spent</span>
                            <span>{fmt(Math.max(0, bu - sp))} left</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <BottomNav tab={tab} setTab={setTab} onAdd={() => setShowAdd(true)} />
      </div>

      {showAdd && <AddSheet onAdd={async (p) => {
        const res = await api.addPurchase(p);
        if (res.success) setPurchases((pr) => [...pr, res.data]);
        setShowAdd(false);
      }} onClose={() => setShowAdd(false)} />}
      {editBudget && (
        <BudgetSheet
          cat={editBudget}
          current={budgets[editBudget]}
          onSave={async (v) => {
            const res = await api.updateBudgetCategory(editBudget, v);
            if (res.success) setBudgets(res.data);
            setEditBudget(null);
          }}
          onClose={() => setEditBudget(null)}
        />
      )}
    </div>
  );
}
