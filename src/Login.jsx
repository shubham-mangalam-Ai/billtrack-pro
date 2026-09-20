import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient";
import { LOGO_SRC } from "./logo";

const NAVY = "#1E2530";
const TEAL = "#DE2026";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!id || !password) {
      setError("Enter your ID and password.");
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: id,
        password,
      });
      if (err) throw err;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        fontFamily: "Inter, ui-sans-serif, system-ui",
        background: "linear-gradient(160deg, #FFF5F5 0%, #FAFAFA 45%, #FFF0F0 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={LOGO_SRC} alt="Logo" className="h-16 w-16 rounded-full shadow-md mb-3" />
          <div className="font-bold text-lg" style={{ color: NAVY }}>BillTrack Pro</div>
          <div className="text-xs text-slate-400">Contractor Bill Tracking System</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <div className="text-sm font-semibold text-center py-2 mb-3" style={{ color: NAVY }}>Sign In</div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ID</label>
              <input
                type="email"
                autoComplete="username"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE2026]/30 focus:border-[#DE2026] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE2026]/30 focus:border-[#DE2026] transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 active:opacity-80 transition-opacity shadow-sm"
              style={{ backgroundColor: TEAL }}
            >
              {busy && <Loader2 size={15} className="animate-spin" />}
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Don’t have a login? Ask your admin to add you from the Users page.
        </p>
      </div>
    </div>
  );
}