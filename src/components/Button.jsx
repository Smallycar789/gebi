import { Link } from 'react-router-dom'
import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  to,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = `btn btn--${variant} ${className}`.trim()

  if (as === 'Link' && to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
