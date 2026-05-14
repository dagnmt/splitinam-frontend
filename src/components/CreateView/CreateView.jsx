import { useState } from "react";
import "./CreateView.css";

export default function CreateView({ onCreated }) {
  const [title, setTitle]   = useState("");
  const [total, setTotal]   = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [people, setPeople] = useState(["", ""]);
  const [saving, setSaving] = useState(false);

  const updatePerson = (i, v) => { const p = [...people]; p[i] = v; setPeople(p); };
  const addPerson    = () => setPeople([...people, ""]);
  const rmPerson     = (i) => setPeople(people.filter((_, j) => j !== i));

  const allPeople = [...new Set([paidBy.trim(), ...people.map(p => p.trim())].filter(Boolean))];
  const base      = parseFloat(total || 0);
  const perPerson = allPeople.length > 1 ? base / allPeople.length : 0;
  const valid     = title.trim() && base > 0 && paidBy.trim() && allPeople.length >= 2;

  const handleCreate = async () => {
    if (!valid || saving) return;
    setSaving(true);
    const res = await fetch("http://localhost:8080/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        total: base,
        paidBy: paidBy.trim(),
        people: allPeople,
      }),
    });
    const session = await res.json();
    onCreated(session);
    setSaving(false);
  };

  return (
    <div className="create-view">
      <div className="field">
        <label>Renginio pavadinimas</label>
        <input
          placeholder="Penktadienio vakaras; Reginos kebabai..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Suma (€)</label>
        <input
          type="number"
          placeholder="0.00"
          value={total}
          onChange={e => setTotal(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Kas sumokėjo?</label>
        <input
          placeholder="Tavo vardas"
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="field-header">
          <label>Kas dalyvavo?</label>
          <button className="btn-add" onClick={addPerson}>+ Pridėti</button>
        </div>
        {people.map((p, i) => (
          <div key={i} className="person-row">
            <input
              placeholder={`Asmuo ${i + 1}`}
              value={p}
              onChange={e => updatePerson(i, e.target.value)}
            />
            {people.length > 1 &&
              <button className="btn-remove" onClick={() => rmPerson(i)}>×</button>}
          </div>
        ))}
      </div>

      {base > 0 && allPeople.length >= 2 && (
        <div className="preview">
          <span>Kiekvienam ({allPeople.length} žm.)</span>
          <strong>€{perPerson.toFixed(2)}</strong>
        </div>
      )}

      <button className="btn-primary" onClick={handleCreate} disabled={!valid || saving}>
        {saving ? "Saugoma…" : "Sukurti sesiją"}
      </button>
    </div>
  );
}