import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="dash-root">
      <Sidebar />
      <main className="dash-main">
        <div className="dash-content">
          {children}
        </div>
      </main>
    </div>
  )
}

/* ── DashboardLayout Styles ── */
const _css = `
.dash-root {
  min-height: 100vh;
  background: var(--bg);
}
.dash-main {
  margin-left: 260px;
  min-height: 100vh;
}
.dash-content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 36px;
}
@media (max-width: 900px) {
  .dash-main { margin-left: 0; }
  .dash-content { padding: 24px 20px; }
}
`