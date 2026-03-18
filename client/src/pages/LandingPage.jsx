import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { ArrowRight, Zap, Trophy, Users, Calendar, Star, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: Calendar, title: 'Event Management',  desc: 'Browse, register, and participate in all Gymkhana events seamlessly.', color: '#7C74FF' },
  { icon: Users,    title: 'Club Discovery',    desc: 'Explore technical, cultural, and sports clubs. Find your community.',  color: '#FF6584' },
  { icon: Trophy,   title: 'Live Results',      desc: 'Real-time leaderboards and result publication for all competitions.',   color: '#F5C842' },
  { icon: Shield,   title: 'Role-Based Access', desc: 'Secure platform with distinct views for students, coordinators, and admins.', color: '#4ECDC4' },
  { icon: Star,     title: 'Media Gallery',     desc: 'Relive memories through an organized archive of event photos.',         color: '#FF6B6B' },
  { icon: Zap,      title: 'OAuth Login',       desc: 'Sign in instantly with your IIITV institute email via OAuth 2.0.',      color: '#A78BFA' },
]

const stats = [
  { value: '25+',   label: 'Active Clubs' },
  { value: '500+',  label: 'Students' },
  { value: '100+',  label: 'Events/Year' },
  { value: '99.5%', label: 'Uptime' },
]

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  if (isSignedIn) return <Navigate to="/dashboard" replace />

  return (
    <div className="landing">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>

        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            IIITV Gymkhana Management System
          </div>

          <h1 className="hero__title">
            Your Campus.<br />
            <span className="hero__title-gradient">Your Events.</span>
          </h1>

          <p className="hero__sub">
            One unified platform to discover clubs, register for events, track results,
            and be part of every Gymkhana moment at IIITV.
          </p>

          <div className="hero__actions">
            <Link to="/sign-up" className="btn-primary btn--lg hero__cta-primary">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/sign-in" className="btn-ghost btn--lg">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero__scroll">
          <p className="hero__scroll-text">Scroll to explore</p>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="landing-stats">
        <div className="landing__container">
          <div className="landing-stats__grid">
            {stats.map((s, i) => (
              <div key={i} className="landing-stats__item">
                <p className="landing-stats__value">{s.value}</p>
                <p className="landing-stats__label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <div className="landing__container">
          <div className="landing-features__head">
            <p className="landing-features__eyebrow">Features</p>
            <h2 className="landing-features__title">Everything you need</h2>
            <p className="landing-features__sub">A complete suite of tools to manage and participate in all Gymkhana activities.</p>
          </div>
          <div className="landing-features__grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div
                  className="feature-card__icon"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}22` }}
                >
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <div className="landing__container">
          <div className="landing-cta__card">
            <h2 className="landing-cta__title">Ready to join?</h2>
            <p className="landing-cta__sub">Sign up with your IIITV email and start exploring everything Gymkhana has to offer.</p>
            <Link to="/sign-up" className="btn-primary btn--lg landing-cta__btn">
              Join Gymkhana IIITV <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing__container landing-footer__inner">
          <div className="landing-footer__brand">
            <div className="landing-footer__brand-icon">
              <Zap size={12} color="#fff" />
            </div>
            <span className="landing-footer__brand-name">Gymkhana IIITV</span>
          </div>
          <p className="landing-footer__copy">© 2025 Group 28 — Built with React &amp; CSS</p>
        </div>
      </footer>
    </div>
  )
}

/* ── LandingPage Styles ── */
const _css = `
.landing {
  min-height: 100vh;
  background: var(--bg);
}
.landing__container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 28px;
}

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 62px;
}
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.hero__orb {
  position: absolute;
  border-radius: 50%;
}
.hero__orb--1 {
  top: 20%; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%);
}
.hero__orb--2 {
  bottom: 20%; right: 15%;
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(255,101,132,0.10) 0%, transparent 70%);
}
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(108,99,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,99,255,0.025) 1px, transparent 1px);
  background-size: 64px 64px;
}
.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 820px;
  padding: 0 24px;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: 99px;
  padding: 6px 16px;
  font-size: 12.5px;
  color: var(--text-muted);
  margin-bottom: 36px;
  animation: fadeUp 0.6s var(--ease) both;
}
.hero__badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #10B981;
  animation: pulse 2s ease infinite;
}
.hero__title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(44px, 7vw, 80px);
  color: var(--text);
  line-height: 1.08;
  margin-bottom: 24px;
  animation: fadeUp 0.6s 0.1s var(--ease) both;
  letter-spacing: -0.03em;
}
.hero__title-gradient {
  background: linear-gradient(135deg, #7C74FF 0%, #A78BFA 50%, #FF6584 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero__sub {
  font-size: clamp(15px, 2vw, 18px);
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.7;
  animation: fadeUp 0.6s 0.2s var(--ease) both;
}
.hero__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  animation: fadeUp 0.6s 0.3s var(--ease) both;
}
.hero__cta-primary {
  box-shadow: 0 0 40px rgba(108,99,255,0.35);
}
.hero__scroll {
  position: absolute;
  bottom: 32px; left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: fadeUp 0.6s 0.5s var(--ease) both;
}
.hero__scroll-text {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, var(--text-muted), transparent);
}

/* Stats */
.landing-stats {
  padding: 64px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.landing-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}
.landing-stats__value {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 44px;
  background: linear-gradient(135deg, #7C74FF, #A78BFA, #FF6584);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}
.landing-stats__label {
  font-size: 13px;
  color: var(--text-muted);
}

/* Features */
.landing-features {
  padding: 96px 0;
}
.landing-features__head {
  text-align: center;
  margin-bottom: 60px;
}
.landing-features__eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: #7C74FF;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}
.landing-features__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 40px;
  color: var(--text);
  margin-bottom: 14px;
  letter-spacing: -0.02em;
}
.landing-features__sub {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}
.landing-features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  transition: border-color 0.25s, transform 0.25s;
}
.feature-card:hover {
  border-color: rgba(108,99,255,0.28);
  transform: translateY(-2px);
}
.feature-card__icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.feature-card__title {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 17px;
  color: var(--text);
  margin-bottom: 8px;
  transition: color 0.2s;
}
.feature-card:hover .feature-card__title { color: #9B94FF; }
.feature-card__desc {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* CTA */
.landing-cta {
  padding: 96px 0;
}
.landing-cta__card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: 28px;
  padding: 72px 48px;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}
.landing-cta__title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 44px;
  color: var(--text);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.landing-cta__sub {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 36px;
  line-height: 1.6;
}
.landing-cta__btn {
  box-shadow: 0 0 32px rgba(108,99,255,0.3);
}

/* Footer */
.landing-footer {
  border-top: 1px solid var(--border);
  padding: 28px 0;
}
.landing-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.landing-footer__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.landing-footer__brand-icon {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #6C63FF, #FF6584);
  display: flex;
  align-items: center;
  justify-content: center;
}
.landing-footer__brand-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: var(--text);
}
.landing-footer__copy {
  font-size: 12px;
  color: var(--text-muted);
}
@media (max-width: 900px) {
  .landing-features__grid { grid-template-columns: repeat(2, 1fr); }
  .landing-stats__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .landing-features__grid { grid-template-columns: 1fr; }
  .landing-cta__card { padding: 40px 24px; }
}
`