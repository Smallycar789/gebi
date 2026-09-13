import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import {
  getItemById,
  getItemStatusLabel,
  updateItem,
} from '../data/itemsStore'
import { formatDateTime } from '../utils/date'
import './FeaturePage.css'

const unitOptions = ['包', '瓶', '个', '卷', '袋', '盒', '提']

function formFromItem(item) {
  return {
    name: item.name,
    unit: unitOptions.includes(item.unit) ? item.unit : '个',
    quantity: String(item.quantity),
    threshold: String(item.threshold),
  }
}

export default function ItemDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [item, setItem] = useState(() => getItemById(id))
  const [editing, setEditing] = useState(Boolean(location.state?.edit))
  const [form, setForm] = useState(() => (item ? formFromItem(item) : null))
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const next = getItemById(id)
    setItem(next)
    if (next) setForm(formFromItem(next))
    setEditing(Boolean(location.state?.edit))
    setSaved(false)
    setError('')
  }, [id, location.state?.edit])

  if (!item || !form) {
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

  function handleCancelEdit() {
    setForm(formFromItem(item))
    setError('')
    setEditing(false)
    navigate(`/items/${id}`, { replace: true, state: {} })
  }

  function handleSave(e) {
    e.preventDefault()
    setError('')
    const result = updateItem(id, {
      name: form.name,
      unit: form.unit,
      quantity: form.quantity,
      threshold: form.threshold,
    })
    if (result.error) {
      setError(result.error)
      return
    }
    setItem(result.item)
    setForm(formFromItem(result.item))
    setEditing(false)
    setSaved(true)
    navigate(`/items/${id}`, { replace: true, state: {} })
  }

  return (
    <div className="feature-page">
      <BackLink to="/items" />
      {saved && (
        <p className="toast-success" role="status">物品信息已保存</p>
      )}
      <PageHeader
        icon="📦"
        title={editing ? '编辑物品' : item.name}
        subtitle={
          editing
            ? '修改名称、单位、余量与预警阈值，保存后清单同步更新。'
            : `预警阈值 ${item.threshold} ${item.unit}`
        }
        badge={getItemStatusLabel(item.status)}
      />

      <div className="feature-main">
        {editing ? (
          <form className="form-card item-edit-form" onSubmit={handleSave}>
            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="form-group">
              <label htmlFor="edit-item-name">物品名称</label>
              <input
                id="edit-item-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-item-unit">计量单位</label>
              <select
                id="edit-item-unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
                {!unitOptions.includes(item.unit) && (
                  <option value={item.unit}>{item.unit}</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-item-quantity">当前余量</label>
              <input
                id="edit-item-quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-item-threshold">预警阈值</label>
              <input
                id="edit-item-threshold"
                type="number"
                min="0"
                step="1"
                value={form.threshold}
                onChange={(e) => setForm({ ...form, threshold: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <Button type="submit">保存修改</Button>
              <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                取消
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-card">
              <div className="detail-card-toolbar">
                <h2>当前余量</h2>
                <Button type="button" variant="ghost" onClick={() => setEditing(true)}>
                  编辑物品
                </Button>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                {item.quantity}{' '}
                <span style={{ fontSize: '16px', fontWeight: 400 }}>{item.unit}</span>
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
          </>
        )}
      </div>
    </div>
  )
}
