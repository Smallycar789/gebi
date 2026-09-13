import './PageHeader.css'

export default function PageHeader({ icon, title, subtitle, badge, action }) {
  return (
    <div className="page-header">
      <div className="page-header-icon">{icon}</div>
      <div className="page-header-body">
        <div className="page-header-title-row">
          <h1>{title}</h1>
          {badge && <span className="page-header-badge">{badge}</span>}
        </div>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}
