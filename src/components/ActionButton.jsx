import { Link } from 'react-router-dom'
import './ActionButton.css'

export default function ActionButton({
  icon,
  label,
  description,
  variant = 'default',
  to,
  disabled = false,
}) {
  const content = (
    <>
      <span className="action-btn-icon">{icon}</span>
      <span className="action-btn-content">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      {!to && disabled && <span className="action-btn-tag">即将上线</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`action-btn action-btn--${variant} action-btn--link`}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={`action-btn action-btn--${variant}`}
      disabled={disabled}
      title={disabled ? '功能开发中，敬请期待' : undefined}
    >
      {content}
    </button>
  )
}
