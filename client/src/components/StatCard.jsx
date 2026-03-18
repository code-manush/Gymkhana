export default function StatCard({ icon: Icon, label, value, sub, color = '#6C63FF', delay = 0 }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}s` }}>
      <div className="stat-card__icon" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value" style={{ color }}>{value}</p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  )
}

/*  ── StatCard Styles ── */
const _css = `
.stat-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  animation: fadeUp 0.5s var(--ease) both;
  transition: border-color 0.25s var(--ease), transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
}
.stat-card:hover {
  border-color: var(--border-mid);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.stat-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.stat-card__label {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 4px;
  letter-spacing: 0.01em;
}
.stat-card__value {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1;
}
.stat-card__sub {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 6px;
}
`