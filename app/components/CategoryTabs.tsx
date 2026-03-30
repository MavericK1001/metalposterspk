const TABS = [
  "All",
  "Music",
  "Movies & TV",
  "Sports",
  "Nature",
  "Architecture",
  "Abstract",
  "Custom",
];

export function CategoryTabs({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 24,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            style={{
              border: `1px solid ${isActive ? "var(--ink)" : "var(--mid)"}`,
              padding: "6px 14px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              color: isActive ? "white" : "var(--muted)",
              background: isActive ? "var(--ink)" : "transparent",
              borderRadius: 0,
              transition: "all 0.12s",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
