import './ToggleSwitch.css'

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-switch-track" aria-hidden="true">
        <span className="toggle-switch-thumb" />
      </span>
    </button>
  )
}
