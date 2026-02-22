export const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes popIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes barFill { from { width: 0; } to { width: 100%; } }
  @keyframes ringFill { from { stroke-dashoffset: var(--circumference); } to { stroke-dashoffset: var(--gap); } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
  @keyframes lift { from { transform: translateY(0); } to { transform: translateY(-2px); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .tap { transition: all 0.16s ease; }
  .tap:active { transform: scale(0.96); }
  .lift { transition: all 0.18s cubic-bezier(0.34, 1.5, 0.64, 1); }
  .lift:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.1) !important; }
  .bar { animation: barFill 0.85s cubic-bezier(.34,1.1,.64,1) both; }
  .ring { animation: ringFill 1.3s cubic-bezier(.34,1.02,.64,1) both; }
  .shake { animation: shake 0.4s ease both; }
  input:focus, select:focus { outline: none; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`;
