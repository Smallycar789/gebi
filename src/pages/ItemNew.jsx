import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { addItem } from '../data/itemsStore'
import './FeaturePage.css'

const unitOptions = ['包', '瓶', '个', '卷', '袋', '盒', '提']

export default function ItemNew() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('个')
  const [quantity, setQuantity] = useState('')
  const [threshold, setThreshold] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const qty = Number(quantity)
    const thr = Number(threshold)

    if (!trimmedName) {
      setError('请填写物品名称')
      return
    }
    if (!Number.isFinite(qty) || qty < 0) {
      setError('请填写有效的初始库存（0 或正数）')
      return
    }
    if (!Number.isFinite(thr) || thr < 0) {
      setError('请填写有效的预警阈值（0 或正数）')
      return
    }

    setSubmitting(true)
    addItem({ name: trimmedName, unit, quantity: qty, threshold: thr })
    navigate('/items', { state: { itemAdded: true } })
  }

  return (
    <div className="feature-page">
      <BackLink to="/items" />
      <PageHeader
        icon="➕"
        title="登记物品"
        subtitle="添加新的公共消耗品，设置初始库存与余量预警阈值。"
      />

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="item-name">物品名称</label>
          <input
            id="item-name"
            type="text"
            placeholder="例如：抽纸"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-unit">计量单位</label>
          <select id="item-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {unitOptions.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="item-quantity">初始库存</label>
          <input
            id="item-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-threshold">预警阈值</label>
          <input
            id="item-threshold"
            type="number"
            min="0"
            step="1"
            placeholder="低于此数量时将提醒补货"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? '提交中…' : '登记物品'}
          </Button>
          <Button as="Link" to="/items" variant="ghost">取消</Button>
        </div>
      </form>
    </div>
  )
}
