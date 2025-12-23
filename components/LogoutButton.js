import { getSupabase } from "../lib/supabaseClient";

export default function LogoutButton() {
  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("simbapdf_email");
    window.location.reload();
  }

  return (
    <button className="secondary-btn" onClick={logout}>
      Log out
    </button>
  );
}
