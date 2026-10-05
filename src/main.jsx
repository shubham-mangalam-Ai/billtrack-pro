import React from "react";
import { createRoot } from "react-dom/client";
import AuthGate from "./AuthGate";
import App from "./App";
import { supabase } from "./supabaseClient";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthGate>{(session) => <App user={session.user} onLogout={() => supabase.auth.signOut()} />}</AuthGate>
);