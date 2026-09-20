import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import { LOGO_SRC } from "./logo";

const NAVY = "#1E2530";
const TEAL = "#DE2026";

function SetNewPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don\u2019t match.");
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      onDone();
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
          <div className="text-xs text-slate-400">Set a new password</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE2026]/30 focus:border-[#DE2026] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type it again"
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
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecovering(true);
      }
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (recovering) {
    return <SetNewPasswordScreen onDone={() => setRecovering(false)} />;
  }

  if (!session) {
    return <Login />;
  }

  return children(session);
}