// components/logoutbutton.js
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabaseClient";  // ← this must match your actual path

export default function LogoutButton({ className = "" }) {
  const router = useRouter();

  const handleLogout = async () => {
    // Optional: ask for confirmation
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    try {
      // This is the important line — create the Supabase client
      const supabase = getSupabase();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        alert("Could not log out. Please try again.");
        return;
      }

      // Clean up local storage
      localStorage.removeItem("simbapdf_email");

      // Redirect to login page (preferred over reload in Next.js)
      router.push("/login");

      // Alternative (if you really want to force a full page reload):
      // window.location.href = "/login";
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`primary-btn ${className}`.trim()}   // reuse your existing button style
      // or use a danger style:
      // style={{ backgroundColor: "#e53935", color: "white", border: "none" }}
    >
      Log Out
    </button>
  );
}