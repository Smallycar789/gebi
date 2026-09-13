import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import {
  getAllItems,
  recordConsumption,
  currentUser,
  roommates,
} from '../data/itemsStore'
import './FeaturePage.css'

export default function ItemConsume() {
  const navigate = useNavigate()
  const items = getAllItems()
  const [itemId, setItemId] = useState(items[0]?.id ?? '')
  const [amount, setAmount] = useState('1')
  const [user, setUser] = useState(currentUser.name)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selected = items.find((i) => i.id === itemId)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!itemId) {
      setError('请先登记至少一件物品')
      return
    }

    setSubmitting(true)
    const result = recordConsumption(itemId, { amount, user })
    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    navigate('/items', { state: { consumptionRecorded: true } })
  }

  if (items.length === 0) {
    return (
      <div className="feature-page">
        <BackLink to="/items" />
        <PageHeader icon="📉" title="记录消耗" subtitle="使用后扣减库存并留下消耗记录。" />
        <div className="detail-card">
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            暂无物品，请先登记公共消耗品。
          </p>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <Button as="Link" to="/items/new">登记物品</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <BackLink to="/items" />
      <PageHeader
        icon="📉"
        title="记录消耗"
        subtitle="选择物品并填写使用数量，系统将自动扣减余量并更新库存状态。"
      />

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="consume-item">选择物品</label>
          <select
            id="consume-item"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}（余量 {item.quantity} {item.unit}）
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <p className="form-hint">
            当前余量：{selected.quantity} {selected.unit}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="consume-amount">消耗数量</label>
          <input
            id="consume-amount"
            type="number"
            min="0.01"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="consume-user">使用人</label>
          <select id="consume-user" value={user} onChange={(e) => setUser(e.target.value)}>
            {roommates.map((rm) => (
              <option key={rm.id} value={rm.name}>{rm.name}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? '提交中…' : '确认消耗'}
          </Button>
          <Button as="Link" to="/items" variant="ghost">取消</Button>
        </div>
      </form>
    </div>
  )
}
