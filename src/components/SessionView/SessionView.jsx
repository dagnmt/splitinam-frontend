import { useState, useEffect } from "react";
import "./SessionView.css";
import NameSelectionView from "../NameSelectionView/NameSelectionView";
import avatarColor from "../../utils/AvatarColor";

const API = "http://localhost:8080/api/sessions";

export default function SessionView({ session: initial, onReset }) {
  const [session, setSession] = useState(initial);
  const [copied, setCopied]   = useState(false);
  const params = new URLSearchParams(window.location.search);
  const nameFromUrl = params.get("name");

  const [myName, setMyName] = useState(nameFromUrl || "");
  const [nameSet, setNameSet] = useState(!!nameFromUrl);

  useEffect(() => {
    const t = setInterval(async () => {
      const res = await fetch(`${API}/${session.sessionCode}`);
      if (res.ok) setSession(await res.json());
    }, 3000);
    return () => clearInterval(t);
  }, [session.sessionCode]);

  const paid      = session.payments || {};
  const others    = session.people.filter(p => p !== session.paidBy);
  const paidCount = others.filter(p => paid[p]).length;
  const progress  = others.length ? (paidCount / others.length) * 100 : 0;
  const amIpayer  = myName === session.paidBy;
  const myStatus  = paid[myName];

  const markPaid = async () => {
    if (!myName || amIpayer) return;
    const res = await fetch(`${API}/${session.sessionCode}/pay?person=${myName}`, {
      method: "PATCH",
    });
    if (res.ok) setSession(await res.json());
  };

  const copyLink = () => {
    const url = `${window.location.origin}?id=${session.sessionCode}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!nameSet) {
    return (
      <NameSelectionView
        session={session}
        myName={myName}
        setMyName={setMyName}
        setNameSet={setNameSet}
      />
    );
  }

  return (
    <div className="session-view">

      <div className="session-header">
        <div className="session-header-top">
          <div>
            <span className="session-code">Sesija #{session.sessionCode}</span>
            <h2>{session.title}</h2>
            <p>Sumokėjo <strong>{session.paidBy}</strong></p>
          </div>
          <div className="session-amount">
            <div className="session-amount-value">€{session.perPerson.toFixed(2)}</div>
            <div className="session-amount-label">kiekvienam</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="progress-labels">
          <span>{paidCount} iš {others.length} sumokėjo</span>
          <span>{progress >= 100 ? "✓ Visi sumokėjo!" : `€${(paidCount * session.perPerson).toFixed(2)} / €${(others.length * session.perPerson).toFixed(2)}`}</span>
        </div>
      </div>

      {!amIpayer && (
        <div className={`my-status ${myStatus ? "paid" : ""}`}>
          <div className="avatar" style={{ background: avatarColor(myName) }}>
            {myName[0].toUpperCase()}
          </div>
          <div className="my-status-info">
            <div className="my-status-name">{myName}</div>
            <div className="my-status-amount">Tavo dalis: €{session.perPerson.toFixed(2)}</div>
          </div>
          {myStatus
            ? <span className="tag-paid">✓ Sumokėjai</span>
            : <button className="btn-pay" onClick={markPaid}>✓ Sumokėjau</button>}
        </div>
      )}

      <div className="people-list">
        {others.map(person => (
          <div key={person} className={`person-row ${paid[person] ? "paid" : ""}`}>
            <div className="avatar" style={{ background: avatarColor(person) }}>
              {person[0].toUpperCase()}
            </div>
            <div className="person-info">
              <div className="person-name">{person}</div>
              <div className="person-amount">€{session.perPerson.toFixed(2)}</div>
            </div>
            <div className={`person-status ${paid[person] ? "paid" : ""}`}>
              {paid[person] ? "✓ Sumokėjo" : "Laukiam…"}
            </div>
          </div>
        ))}
      </div>

      <div className="share-buttons">
        <button className={`btn-share ${copied ? "success" : "dark"}`} onClick={copyLink}>
          {copied ? "✓ Nukopijuota!" : "📋 Kopijuoti linką"}
        </button>
      </div>

      <div className="session-footer">
        Informacija atnaujinama kas 3 sek.
      </div>

    </div>
  );
}