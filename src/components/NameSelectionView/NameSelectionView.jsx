import avatarColor from "../../utils/AvatarColor";

export default function NameSelectionView({
  session,
  myName,
  setMyName,
  setNameSet,
}) {
    return (
        <div className="name-picker">
        <div className="name-picker-header">
            <div className="name-picker-emoji">👋</div>
            <h2>Kas tu?</h2>
            <p>Pasirink savo vardą iš sąrašo</p>
        </div>
        <div className="name-list">
            {session.people.map(p => (
            <button
                key={p}
                className={`name-btn ${myName === p ? "active" : ""}`}
                onClick={() => setMyName(p)}
            >
                <div className="avatar" style={{ background: avatarColor(p) }}>
                {p[0].toUpperCase()}
                </div>
                <div>
                <div className="name-btn-name">{p}</div>
                {p === session.paidBy && <div className="name-btn-sub">Sumokėjo už visus</div>}
                </div>
            </button>
            ))}
        </div>
        <button
            className="btn-primary"
            disabled={!myName}
            onClick={() => {
            window.history.pushState({}, "", `?id=${session.sessionCode}&name=${myName}`);
            setNameSet(true);
            }}
        >
            Tęsti
        </button>
        </div>
    );
}