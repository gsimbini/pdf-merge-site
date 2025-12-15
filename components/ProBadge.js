// components/ProBadge.js
import useProStatus from "./useProStatus";

export default function ProBadge() {
  const { isPro, loading } = useProStatus();

  // Do not render anything while loading or if not Pro
  if (loading || !isPro) return null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.75rem",
        borderRadius: "999px",
        background: "rgba(46, 204, 113, 0.15)",
        color: "#2ecc71",
        fontSize: "0.85rem",
        fontWeight: 700,
        border: "1px solid rgba(46, 204, 113, 0.35)",
        whiteSpace: "nowrap",
      }}
      title="Your Pro subscription is active"
    >
      ✅ Pro Active
    </div>
  );
}
