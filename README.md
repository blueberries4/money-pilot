# Money Pilot

A beautiful, responsive React app for tracking your spending and managing budgets by category.

**🔗 [Live Demo](https://money-manager-ten-iota.vercel.app/)**

## Project Structure

```
money-pilot/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddSheet.jsx         # Modal for adding new purchases
│   │   ├── BudgetSheet.jsx      # Modal for editing category budgets
│   │   ├── BigRing.jsx          # Score ring visualization
│   │   ├── BottomNav.jsx        # Navigation bar
│   │   ├── CatCard.jsx          # Category spending card
│   │   ├── CoachBanner.jsx      # Coaching tips banner
│   │   ├── InsightCard.jsx      # Insight/stats card
│   │   ├── ReviewSubTabs.jsx    # Sub-tab switcher for review
│   │   └── SectionHeader.jsx    # Section header with gradients
│   ├── utils/
│   │   ├── constants.js         # Color tokens, categories, sample data
│   │   ├── helpers.js           # Formatting, calculations, scoring logic
│   │   └── styles.js            # Animation and styling constants
│   ├── App.jsx                  # Main app component with state & logic
│   ├── index.js                 # React entry point
│   ├── index.css                # Global styles
│   └── App.jsx
├── package.json
└── README.md
```

## Features

- **Home Tab**: Overview with score ring, coaching tips, insights, and monthly trend chart
- **Spending Tab**: Category-based spending breakdown with budget status
- **Products Tab**: Purchase history ranked by frequency
- **Review Tab**: Score breakdown, month-over-month comparison, and spending velocity

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- **React 18** - UI library
- **Recharts** - Chart visualization
- **Plus Jakarta Sans & DM Mono** - Typography

## Key Components

### Utilities

- `constants.js` - Color palette, category definitions, sample data
- `helpers.js` - Formatting, date calculations, scoring algorithm
- `styles.js` - CSS animations and utility classes

### Components

Each component is self-contained and responsible for its own styling and logic:

- Modal sheets for adding purchases and editing budgets
- Cards for displaying category and product information
- Navigation and tab management

## Customization

- **Colors**: Edit color tokens in `src/utils/constants.js`
- **Sample Data**: Modify `SAMPLE` array in `src/utils/constants.js`
- **Budgets**: Change `DEF_BUDGETS` in `src/utils/constants.js`
- **Scoring Logic**: Adjust `calcScore()` in `src/utils/helpers.js`

## License

MIT

# money-pilot
