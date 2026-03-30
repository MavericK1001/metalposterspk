const TICKER_ITEMS = [
  "FREE SHIPPING OVER £50",
  "PREMIUM ALUMINIUM PRINT",
  "30-DAY RETURNS",
  "SHIPS IN 3–5 DAYS",
  "12,000+ CUSTOMERS",
];

function TickerContent() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 2,
              color: "var(--white)",
              padding: "0 32px",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>✦</span>
        </span>
      ))}
    </>
  );
}

export function Ticker() {
  return (
    <div
      style={{
        background: "var(--copper)",
        height: 36,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        className="ticker-track"
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}
