import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left__orb auth-left__orb--signup-1" />
        <div className="auth-left__orb auth-left__orb--signup-2" />

        <Link to="/" className="auth-brand">
          <div className="auth-brand__icon"><Zap size={18} color="#fff" /></div>
          <span className="auth-brand__name">Gymkhana IIITV</span>
        </Link>

        <div className="auth-left__hero">
          <h2 className="auth-left__headline">
            Join the<br />
            <span className="auth-headline-accent">community.</span>
          </h2>
          <p className="auth-left__sub">Create your account with your IIITV institute email and unlock all Gymkhana features.</p>
          <div className="signup-stats-grid">
            {[{ label: 'Events', value: '20+' }, { label: 'Clubs', value: '10+' }, { label: 'Students', value: '500+' }].map((s, i) => (
              <div key={i} className="signup-stat">
                <p className="signup-stat__val">{s.value}</p>
                <p className="signup-stat__label">{s.label}</p>
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

        <SignUp
          routing="hash"
          afterSignUpUrl="/dashboard"
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
          Already have an account? <Link to="/sign-in" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

/* ── SignUpPage-specific Styles (auth-page base is in SignInPage) ── */
const _css = `
.auth-left__orb--signup-1 {
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,101,132,0.18), transparent 70%);
}
.auth-left__orb--signup-2 {
  bottom: -80px; left: -80px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%);
}
.auth-headline-accent {
  background: linear-gradient(135deg, #7C74FF, #A78BFA, #FF6584);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.signup-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 36px;
  max-width: 280px;
}
.signup-stat {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
}
.signup-stat__val {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 26px;
  background: linear-gradient(135deg, #7C74FF, #A78BFA);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.signup-stat__label { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
`