import './PageHeader.css'

export default function PageHeader({ icon, title, subtitle, badge }) {
  return (
    <div className="page-header">
      <div className="page-header-icon">{icon}</div>
      <div>
        <div className="page-header-title-row">
          <h1>{title}</h1>
          {badge && <span className="page-header-badge">{badge}</span>}
        </div>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
