import { Link } from 'react-router-dom'
import './BackLink.css'

export default function BackLink({ to, children = '返回' }) {
  return (
    <Link to={to} className="back-link">
      ← {children}
    </Link>
  )
}
