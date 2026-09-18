import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthGate from "./AuthGate.jsx";
import { supabase } from "./supabaseClient";

function Root() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthGate>
      {(session) => <App user={session.user} onLogout={handleLogout} />}
    </AuthGate>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
