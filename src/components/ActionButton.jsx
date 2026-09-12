import './ActionButton.css'

export default function ActionButton({ icon, label, description, variant = 'primary', disabled = true }) {
  return (
    <button className={`action-btn action-btn--${variant}`} disabled={disabled} title="功能开发中，敬请期待">
      <span className="action-btn-icon">{icon}</span>
      <span className="action-btn-content">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      {disabled && <span className="action-btn-tag">即将上线</span>}
    </button>
  )
}
