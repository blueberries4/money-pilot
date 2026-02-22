/* ─── MOCK API ──────────────────────────────────────────────── */

const SAMPLE_PURCHASES = [
  { id: 1, date: "2025-10-05", item: "Kirkland Mixed Nuts", category: "Groceries", amount: 24.99 },
  { id: 2, date: "2025-10-05", item: "Gas Fill-Up", category: "Gas", amount: 62.40 },
  { id: 3, date: "2025-10-12", item: "Tide Pods 152ct", category: "Household", amount: 29.99 },
  { id: 4, date: "2025-10-18", item: "Atlantic Salmon", category: "Groceries", amount: 34.99 },
  { id: 5, date: "2025-11-02", item: "Gas Fill-Up", category: "Gas", amount: 58.10 },
  { id: 6, date: "2025-11-10", item: "AirPods Pro", category: "Electronics", amount: 149.99 },
  { id: 7, date: "2025-11-15", item: "Organic Chicken Breast", category: "Groceries", amount: 22.49 },
  { id: 8, date: "2025-11-22", item: "Bounty Paper Towels", category: "Household", amount: 27.99 },
  { id: 9, date: "2025-12-01", item: "Kirkland Vitamins", category: "Health", amount: 31.99 },
  { id: 10, date: "2025-12-07", item: "Gas Fill-Up", category: "Gas", amount: 55.30 },
  { id: 11, date: "2025-12-14", item: "Levi's Jeans 2-Pack", category: "Clothing", amount: 39.99 },
  { id: 12, date: "2025-12-20", item: "Kirkland Olive Oil", category: "Groceries", amount: 19.99 },
  { id: 13, date: "2026-01-03", item: "Gas Fill-Up", category: "Gas", amount: 61.80 },
  { id: 14, date: "2026-01-10", item: "Tide Pods 152ct", category: "Household", amount: 29.99 },
  { id: 15, date: "2026-01-18", item: "Prime Ribeye 4-Pack", category: "Groceries", amount: 47.99 },
  { id: 16, date: "2026-01-22", item: "Kirkland Mixed Nuts", category: "Groceries", amount: 24.99 },
  { id: 17, date: "2026-01-25", item: "Kirkland Vitamins", category: "Health", amount: 28.49 },
  { id: 18, date: "2026-02-01", item: "Gas Fill-Up", category: "Gas", amount: 59.20 },
  { id: 19, date: "2026-02-05", item: "Kirkland Mixed Nuts", category: "Groceries", amount: 24.99 },
  { id: 20, date: "2026-02-08", item: "Kirkland Coffee 3lb", category: "Groceries", amount: 39.99 },
  { id: 21, date: "2026-02-10", item: "Organic Chicken Breast", category: "Groceries", amount: 22.49 },
  { id: 22, date: "2026-02-15", item: "Glad Trash Bags 200ct", category: "Household", amount: 22.99 },
  { id: 23, date: "2026-02-18", item: "Snack Variety Pack", category: "Groceries", amount: 16.99 },
  { id: 24, date: "2026-02-19", item: "Atlantic Salmon", category: "Groceries", amount: 36.49 },
];

const DEFAULT_BUDGETS = {
  Groceries: 150,
  Household: 100,
  Gas: 200,
  Electronics: 100,
  Clothing: 80,
  Health: 80,
  Other: 60,
};

// Helper to simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/* ─── PURCHASE ENDPOINTS ──────────────────────────────────────── */
export const api = {
  // Get all purchases
  getPurchases: async () => {
    await delay();
    return {
      success: true,
      data: SAMPLE_PURCHASES,
    };
  },

  // Add a new purchase
  addPurchase: async (purchase) => {
    await delay();
    const newPurchase = {
      id: Math.max(...SAMPLE_PURCHASES.map((p) => p.id), 0) + 1,
      ...purchase,
    };
    SAMPLE_PURCHASES.push(newPurchase);
    return {
      success: true,
      data: newPurchase,
    };
  },

  // Update a purchase
  updatePurchase: async (id, updates) => {
    await delay();
    const index = SAMPLE_PURCHASES.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Purchase not found",
      };
    }
    SAMPLE_PURCHASES[index] = { ...SAMPLE_PURCHASES[index], ...updates };
    return {
      success: true,
      data: SAMPLE_PURCHASES[index],
    };
  },

  // Delete a purchase
  deletePurchase: async (id) => {
    await delay();
    const index = SAMPLE_PURCHASES.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Purchase not found",
      };
    }
    SAMPLE_PURCHASES.splice(index, 1);
    return {
      success: true,
      data: { id },
    };
  },

  /* ─── BUDGET ENDPOINTS ──────────────────────────────────────── */
  // Get all budgets
  getBudgets: async () => {
    await delay();
    return {
      success: true,
      data: DEFAULT_BUDGETS,
    };
  },

  // Update budgets
  updateBudgets: async (budgets) => {
    await delay();
    Object.assign(DEFAULT_BUDGETS, budgets);
    return {
      success: true,
      data: DEFAULT_BUDGETS,
    };
  },

  // Update a single budget category
  updateBudgetCategory: async (category, amount) => {
    await delay();
    if (!DEFAULT_BUDGETS.hasOwnProperty(category)) {
      return {
        success: false,
        error: "Category not found",
      };
    }
    DEFAULT_BUDGETS[category] = amount;
    return {
      success: true,
      data: DEFAULT_BUDGETS,
    };
  },
};

/* ─── MIGRATION NOTES ──────────────────────────────────────────
   To migrate to real API endpoints:
   
   1. Replace each function with actual API calls
   2. Update the endpoint URLs (e.g., api.getPurchases → fetch('/api/purchases'))
   3. Handle real error responses
   4. Remove the delay() calls
   
   Example:
   export const api = {
     getPurchases: async () => {
       const response = await fetch('http://your-backend.com/api/purchases');
       if (!response.ok) throw new Error('Failed to fetch purchases');
       return await response.json();
     },
     ...
   }
────────────────────────────────────────────────────────────────── */
