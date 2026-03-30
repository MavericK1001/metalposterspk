const TABS = [
  "All",
  "Anime",
  "Cars",
  "Islamic",
  "Motivational",
  "Sports",
  "Gaming",
  "Superheroes",
  "Movies",
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
              border: `1px solid ${isActive ? "var(--copper)" : "var(--muted)"}`,
              padding: "6px 14px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              color: isActive ? "white" : "var(--steel)",
              background: isActive ? "var(--copper)" : "transparent",
              borderRadius: 0,
              transition: "all 0.12s",
              fontWeight: 500,
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
