import { useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import PageHeader from '../components/PageHeader'
import { getItemById, getItemStatusLabel } from '../data/mockData'
import { formatDateTime } from '../utils/date'
import './FeaturePage.css'

export default function ItemDetail() {
  const { id } = useParams()
  const item = getItemById(id)

  if (!item) {
    return (
      <div className="feature-page">
        <BackLink to="/items" />
        <div className="not-found">
          <h2>物品不存在</h2>
          <p>未找到该物品记录</p>
        </div>
      </div>
    )
  }

  const progress = item.threshold > 0
    ? Math.min(100, (item.quantity / item.threshold) * 100)
    : 0
  const progressClass = item.status === 'empty' ? 'empty' : item.status === 'low' ? 'low' : ''

  return (
    <div className="feature-page">
      <BackLink to="/items" />
      <PageHeader
        icon="📦"
        title={item.name}
        subtitle={`预警阈值 ${item.threshold} ${item.unit}`}
        badge={getItemStatusLabel(item.status)}
      />

      <div className="feature-main">
        <div className="detail-card">
          <h2>当前余量</h2>
          <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            {item.quantity} <span style={{ fontSize: '16px', fontWeight: 400 }}>{item.unit}</span>
          </p>
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${progressClass}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            阈值 {item.threshold} {item.unit} · {getItemStatusLabel(item.status)}
          </p>
        </div>

        <div className="detail-card">
          <h2>消耗记录</h2>
          {item.consumptionLogs.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>暂无消耗记录</p>
          ) : (
            <div className="timeline">
              {item.consumptionLogs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <time>{formatDateTime(log.date)}</time>
                  <span>{log.user} 使用了 {log.amount} {log.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
