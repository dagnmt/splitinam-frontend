import { useState, useEffect } from "react";
import "./App.css";
import CreateView from "./components/CreateView/CreateView";
import SessionView from "./components/SessionView/SessionView";

const API = "http://localhost:8080/api/sessions";

export default function App() {
  const [view, setView]       = useState("loading");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      fetch(`${API}/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(s => {
          if (s) { setSession(s); setView("session"); }
          else setView("create");
        });
    } else {
      setView("create");
    }
  }, []);

  const handleCreated = (s) => {
    setSession(s);
    setView("session");
    window.history.pushState({}, "", `?id=${s.sessionCode}`);
  };

  const handleReset = () => {
    setSession(null);
    setView("create");
    window.history.pushState({}, "", "/");
  };

  if (view === "loading") return (
    <div className="loading">Kraunama…</div>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <span className="badge">Splitinam</span>
          <h1>Splitink sąskaitą.</h1>
          <p>Jokių paskyrų. Jokių skaičiavimų.</p>
        </div>
        <div className="card">
          {view === "create" && <CreateView onCreated={handleCreated} />}
          {view === "session" && session && (
            <SessionView session={session} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
}