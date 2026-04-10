import { Link } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound__orb" />
      <div className="notfound__content">
        <div className="notfound__brand">
          <div className="notfound__brand-icon"><Zap size={15} color="#fff" /></div>
          <span className="notfound__brand-name">Gymkhana IIITV</span>
        </div>
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">Page not found</h1>
        <p className="notfound__sub">Looks like this page took a wrong turn. It doesn't exist or may have been moved.</p>
        <div className="notfound__actions">
          <Link to="/"          className="btn-primary">Go Home</Link>
          <Link to="/dashboard" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={15} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── NotFoundPage Styles ── */
const _nfCss = `
.notfound {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--bg);
  position: relative;
  padding: 24px;
  overflow: hidden;
}
.notfound__orb {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 480px; height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%);
  pointer-events: none;
}
.notfound__content { position: relative; z-index: 1; }
.notfound__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}
.notfound__brand-icon {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6C63FF, #FF6584);
  display: flex; align-items: center; justify-content: center;
}
.notfound__brand-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}
.notfound__code {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 120px;
  line-height: 1;
  background: linear-gradient(135deg, #7C74FF, #A78BFA, #FF6584);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}
.notfound__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--text);
  margin-bottom: 12px;
}
.notfound__sub {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 380px;
  margin: 0 auto 36px;
  line-height: 1.6;
}
.notfound__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
`