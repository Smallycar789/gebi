import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import ExpenseSplitEditor, { defaultSplitValues } from '../components/ExpenseSplitEditor'
import { addBill, roommates } from '../data/billsStore'
import './FeaturePage.css'

function todayInputValue() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildSplitPayload(mode, values) {
  if (mode === 'equal') {
    return { mode: 'equal', values: {} }
  }
  return {
    mode,
    values: Object.fromEntries(
      roommates.map((rm) => [rm.name, Number(values[rm.name] || 0)])
    ),
  }
}

export default function ExpenseNew() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState('水电')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayInputValue())
  const [splitMode, setSplitMode] = useState('equal')
  const [splitValues, setSplitValues] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleModeChange(nextMode) {
    setSplitMode(nextMode)
    const total = Number(amount)
    setSplitValues(defaultSplitValues(nextMode, total))
  }

  function handleAmountChange(value) {
    setAmount(value)
    if (splitMode === 'amount') {
      const total = Number(value)
      if (total > 0) {
        setSplitValues(defaultSplitValues('amount', total))
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const numAmount = Number(amount)

    if (!trimmedName) {
      setError('请填写账单名称')
      return
    }
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError('请填写有效的总金额（大于 0）')
      return
    }
    if (!date) {
      setError('请选择账单日期')
      return
    }

    setSubmitting(true)
    const result = addBill({
      name: trimmedName,
      type,
      amount: numAmount,
      date,
      split: buildSplitPayload(splitMode, splitValues),
    })

    if (result?.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    navigate('/expenses', { state: { billAdded: true } })
  }

  return (
    <div className="feature-page">
      <BackLink to="/expenses" />
      <PageHeader
        icon="➕"
        title="新增账单"
        subtitle="录入账单信息并选择分摊方式，提交后出现在账单列表。"
      />

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="bill-name">账单名称</label>
          <input
            id="bill-name"
            type="text"
            placeholder="例如：3月水电费"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bill-type">费用类型</label>
          <select
            id="bill-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="房租">房租</option>
            <option value="水电">水电</option>
            <option value="网费">网费</option>
            <option value="燃气">燃气</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bill-amount">总金额（元）</label>
          <input
            id="bill-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bill-date">账单日期</label>
          <input
            id="bill-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <ExpenseSplitEditor
          mode={splitMode}
          onModeChange={handleModeChange}
          values={splitValues}
          onValuesChange={setSplitValues}
          totalAmount={amount}
        />

        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? '提交中…' : '提交账单'}
          </Button>
          <Button as="Link" to="/expenses" variant="ghost">
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
