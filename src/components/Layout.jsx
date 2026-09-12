import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/expenses', label: '费用分摊' },
  { to: '/cleaning', label: '清洁排班' },
  { to: '/items', label: '公共物品' },
  { to: '/agreement', label: '室友公约' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">
              <strong>合居</strong>
              <small>合租生活管家</small>
            </span>
          </NavLink>
          <nav className="nav">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>合居 · 让合租生活更清晰、更和谐</p>
      </footer>
    </div>
  )
}
