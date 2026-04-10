import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="auth-page">
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