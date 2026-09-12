import { Link } from 'react-router-dom'
import './FeatureCard.css'

export default function FeatureCard({ icon, title, description, to, color, stats }) {
  return (
    <Link to={to} className="feature-card" style={{ '--card-accent': color }}>
      <div className="feature-card-icon">{icon}</div>
      <div className="feature-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        {stats && (
          <div className="feature-card-stats">
            {stats.map((stat, i) => (
              <span key={i} className="stat">
                <strong>{stat.value}</strong> {stat.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="feature-card-arrow">→</span>
    </Link>
  )
}
