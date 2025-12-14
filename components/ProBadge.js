// components/ProBadge.js
import { useEffect, useState } from "react";
import useProStatus from "./useProStatus";

export default function ProBadge() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("simbapdf_email")
        : "";
    if (saved) setEmail(saved);
  }, []);

  const { isPro, loading } = useProStatus(email);

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
        fontWeight: 600,
        border: "1px solid rgba(46, 204, 113, 0.35)",
      }}
    >
      ✅ Pro Active
    </div>
  );
}
