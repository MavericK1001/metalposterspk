/**
 * Typographic placeholder for products without images.
 * Dark background with oversized Anton text.
 */
export function PosterPreview({
  title,
  style,
}: {
  title: string;
  style?: React.CSSProperties;
}) {
  // Take first 2 words max for a clean look
  const words = title.split(" ").slice(0, 2).join("\n").toUpperCase();

  return (
    <div
      className="poster-shine"
      style={{
        background: "#0D0D14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "rgba(255,255,255,0.12)",
          letterSpacing: 4,
          textAlign: "center",
          lineHeight: 1.1,
          whiteSpace: "pre-line",
          userSelect: "none",
        }}
      >
        {words}
      </span>
    </div>
  );
}
