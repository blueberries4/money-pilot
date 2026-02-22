import { CATS } from "./constants";

/* ─── HELPERS ────────────────────────────────────────────────── */
export const fmt = (n) => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const mKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

export const mLbl = (k) => {
  const [y, m] = k.split("-");
  return new Date(y, m - 1).toLocaleString("default", { month: "short" });
};

export const today = () => new Date().toISOString().split("T")[0];

/* ─── SCORING LOGIC ────────────────────────────────────────────── */
export function calcScore(catSpend, budgets) {
  const scores = CATS.map((c) => {
    const sp = catSpend[c] || 0;
    const bu = budgets[c] || 0;
    if (bu === 0) return null;
    if (sp === 0) return 100;
    if (sp <= bu) return 100;
    const overRatio = (sp - bu) / bu;
    return Math.max(0, Math.round(100 - overRatio * 120));
  }).filter((s) => s !== null);

  if (!scores.length) return 100;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function gradeInfo(score) {
  if (score >= 93) return { grade: "A+", emoji: "🏆", msg: "You're crushing it.", col: "#16a34a" };
  if (score >= 82) return { grade: "A", emoji: "🎉", msg: "Really strong month.", col: "#22c55e" };
  if (score >= 70) return { grade: "B", emoji: "👍", msg: "Good — room to grow.", col: "#84cc16" };
  if (score >= 55) return { grade: "C", emoji: "😐", msg: "A few categories slipped.", col: "#d97706" };
  if (score >= 38) return { grade: "D", emoji: "😬", msg: "Budget needs attention.", col: "#f97316" };
  return { grade: "F", emoji: "🚨", msg: "Seriously over budget.", col: "#D92B3A" };
}

/* ─── COACHING LINE ──────────────────────────────────────────── */
export function coachingLine(catSpend, budgets, timePct, daysLeft, totalMo, totalBudget) {
  const expected = totalBudget * timePct;
  const overCats = CATS
    .filter((c) => catSpend[c] > budgets[c])
    .sort((a, b) => (catSpend[b] - budgets[b]) - (catSpend[a] - budgets[a]));

  if (overCats.length > 0) {
    const worst = overCats[0];
    const over = catSpend[worst] - budgets[worst];
    return `⚠️ ${worst} is ${fmt(over)} over — avoid it for the rest of the month.`;
  }

  const fastCats = CATS
    .filter((c) => catSpend[c] > 0 && catSpend[c] <= budgets[c])
    .map((c) => ({ c, ratio: (catSpend[c] / budgets[c]) / Math.max(timePct, 0.01) }))
    .filter((x) => x.ratio > 1.15)
    .sort((a, b) => b.ratio - a.ratio);

  if (fastCats.length > 0) {
    const { c } = fastCats[0];
    const left = budgets[c] - catSpend[c];
    return `🔥 ${c} is burning fast — only ${fmt(left)} left with ${daysLeft} days to go.`;
  }

  if (totalMo < expected * 0.85) {
    const saved = expected - totalMo;
    return `💚 You're ${fmt(saved)} under pace — great discipline this month!`;
  }

  return `✓ You're on track — ${daysLeft} days left, stay steady.`;
}
/* ─── BUDGET SUGGESTIONS ──────────────────────────────────────── */
export function getBudgetSuggestions(purchases, budgets) {
  // Build spending by category by month
  const monthlyByCategory = {};
  CATS.forEach((c) => {
    monthlyByCategory[c] = {};
  });

  purchases.forEach((p) => {
    const k = mKey(p.date);
    if (!monthlyByCategory[p.category][k]) {
      monthlyByCategory[p.category][k] = 0;
    }
    monthlyByCategory[p.category][k] += p.amount;
  });

  const suggestions = [];

  CATS.forEach((cat) => {
    const months = Object.entries(monthlyByCategory[cat])
      .sort(([k1], [k2]) => k1.localeCompare(k2))
      .slice(-3); // Last 3 months

    if (months.length < 2) return; // Need at least 2 months of data

    const budgetAmount = budgets[cat];
    const overBudgetCount = months.filter(([_, spend]) => spend > budgetAmount).length;

    // If over budget in at least 2 of last 3 months
    if (overBudgetCount >= 2) {
      const avgSpend = months.reduce((sum, [_, spend]) => sum + spend, 0) / months.length;
      const suggestedBudget = Math.ceil(avgSpend * 1.15); // 15% buffer
      const increase = suggestedBudget - budgetAmount;

      suggestions.push({
        category: cat,
        currentBudget: budgetAmount,
        suggestedBudget,
        increase,
        avgSpend,
        overBudgetMonths: overBudgetCount,
      });
    }
  });

  return suggestions.sort((a, b) => b.increase - a.increase);
}