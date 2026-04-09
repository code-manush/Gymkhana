// ─── SignInPage.jsx ─────────────────────────────────────────────────────────
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function SignInPage() {
  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left__orb auth-left__orb--1" />
        <div className="auth-left__orb auth-left__orb--2" />

        <Link to="/" className="auth-brand">
          <div className="auth-brand__icon"><Zap size={18} color="#fff" /></div>
          <span className="auth-brand__name">Gymkhana IIITV</span>
        </Link>

        <div className="auth-left__hero">
          <h2 className="auth-left__headline">Welcome<br />back.</h2>
          <p className="auth-left__sub">Sign in to access your events, clubs, and Gymkhana activities at IIITV.</p>
          <div className="auth-bullets">
            {['500+ Active Students', '10+ Clubs', '20+ Events Annually'].map((item, i) => (
              <div key={i} className="auth-bullet">
                <div className="auth-bullet__dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="auth-left__footer">© 2025 Gymkhana IIITV — Group 28</p>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <Link to="/" className="auth-brand auth-brand--mobile">
          <div className="auth-brand__icon"><Zap size={16} color="#fff" /></div>
          <span className="auth-brand__name">Gymkhana IIITV</span>
        </Link>

        <SignIn
          routing="hash"
          afterSignInUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#6C63FF', colorBackground: '#111120',
              colorInputBackground: '#161628', colorInputText: '#F0F0FA',
              colorText: '#F0F0FA', colorTextSecondary: '#A0A0C0',
              colorNeutral: '#1A1A30', borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            elements: { card: 'shadow-none' },
          }}
        />

        <p className="auth-footer-note">
          Don't have an account? <Link to="/sign-up" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

/* ── Auth Shared Styles ── */
const _authCss = `
.auth-page {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
}
.auth-left {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 48%;
  padding: 48px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0D0D1A 0%, #121228 100%);
}
@media (min-width: 1024px) { .auth-left { display: flex; } }
.auth-left__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.auth-left__orb--1 {
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%);
}
.auth-left__orb--2 {
  bottom: -80px; left: -80px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(255,101,132,0.12), transparent 70%);
}
.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  position: relative;
  z-index: 1;
}
.auth-brand--mobile {
  display: none;
  margin-bottom: 28px;
}
@media (max-width: 1023px) { .auth-brand--mobile { display: flex; } }
.auth-brand__icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6C63FF, #FF6584);
  display: flex; align-items: center; justify-content: center;
}
.auth-brand__name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}
.auth-left__hero { position: relative; z-index: 1; }
.auth-left__headline {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 52px;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 18px;
  letter-spacing: -0.03em;
}
.auth-left__sub {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.65;
  max-width: 340px;
}
.auth-bullets { margin-top: 36px; display: flex; flex-direction: column; gap: 14px; }
.auth-bullet { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-muted); }
.auth-bullet__dot { width: 6px; height: 6px; border-radius: 50%; background: #7C74FF; flex-shrink: 0; }
.auth-left__footer {
  font-size: 11px;
  color: var(--text-faint);
  position: relative;
  z-index: 1;
}
.auth-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}
.auth-right > div { width: 100%; max-width: 420px; }
.auth-footer-note {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 16px;
}
.auth-link { color: #7C74FF; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
`

export default SignInPage