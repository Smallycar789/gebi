import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { roommates } from '../data/mockData'
import {
  applyCustomSplit,
  getAllBills,
  getSplitModeLabel,
} from '../data/billsStore'
import './FeaturePage.css'

const MODES = [
  { id: 'equal', label: '均分 AA' },
  { id: 'amount', label: '按金额' },
  { id: 'ratio', label: '按比例' },
]

function previewEqualSplit(total) {
  const n = roommates.length
  const base = Math.floor((total / n) * 100) / 100
  return roommates.map((rm, index) => {
    let amount = base
    if (index === n - 1) {
      amount = Math.round((total - base * (n - 1)) * 100) / 100
    }
    return { name: rm.name, amount }
  })
}

function valuesFromBill(bill, mode) {
  const map = {}
  for (const rm of roommates) {
    const split = bill.splits.find((s) => s.name === rm.name)
    if (mode === 'ratio') {
      map[rm.name] = split ? '1' : '1'
    } else if (mode === 'amount') {
      map[rm.name] = split ? String(split.amount) : '0'
    }
  }
  if (mode === 'ratio') {
    for (const rm of roommates) {
      if (!map[rm.name]) map[rm.name] = '1'
    }
  }
  return map
}

export default function ExpenseCustomSplit() {
  const navigate = useNavigate()
  const location = useLocation()
  const bills = getAllBills()

  const [billId, setBillId] = useState(
    location.state?.billId || bills[0]?.id || ''
  )
  const bill = bills.find((b) => b.id === billId)

  const [mode, setMode] = useState(bill?.splitMode || 'equal')
  const [values, setValues] = useState(() =>
    bill ? valuesFromBill(bill, bill.splitMode === 'equal' ? 'amount' : bill.splitMode) : {}
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const next = getAllBills().find((b) => b.id === billId)
    if (!next) return
    setMode(next.splitMode || 'equal')
    setValues(
      valuesFromBill(
        next,
        next.splitMode === 'equal' ? 'amount' : next.splitMode
      )
    )
    setError('')
  }, [billId])

  const previewSum = useMemo(() => {
    if (!bill || mode !== 'amount') return null
    return roommates.reduce(
      (sum, rm) => sum + (Number(values[rm.name]) || 0),
      0
    )
  }, [bill, mode, values])

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setError('')
    if (bill) {
      if (nextMode === 'equal') {
        setValues(valuesFromBill(bill, 'amount'))
      } else {
        setValues(valuesFromBill(bill, nextMode))
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!billId) {
      setError('请选择要分摊的账单')
      return
    }

    setSubmitting(true)
    setError('')

    const payload =
      mode === 'equal'
        ? { mode: 'equal', values: {} }
        : {
            mode,
            values: Object.fromEntries(
              roommates.map((rm) => [rm.name, Number(values[rm.name] || 0)])
            ),
          }

    const result = applyCustomSplit(billId, payload)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/expenses', { state: { splitUpdated: true, billId } })
  }

  if (bills.length === 0) {
    return (
      <div className="feature-page">
        <BackLink to="/expenses" />
        <PageHeader icon="🧮" title="自定义分摊" subtitle="请先新增账单后再设置分摊方式。" />
        <Button as="Link" to="/expenses/new">新增账单</Button>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <BackLink to="/expenses" />
      <PageHeader
        icon="🧮"
        title="自定义分摊"
        subtitle="选择账单并按均分、固定金额或比例，为每位室友设置应付金额。"
      />

      <form className="form-card split-form" onSubmit={handleSubmit}>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="split-bill">选择账单</label>
          <select
            id="split-bill"
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
          >
            {bills.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} · ¥{b.amount} · {getSplitModeLabel(b.splitMode)}
              </option>
            ))}
          </select>
        </div>

        {bill && (
          <p className="form-hint">
            账单总额 <strong>¥{bill.amount}</strong>
            {bill.splitMode !== 'equal' && (
              <> · 当前方式：{getSplitModeLabel(bill.splitMode)}</>
            )}
          </p>
        )}

        <div className="split-mode-tabs" role="tablist">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={`split-mode-tab ${mode === m.id ? 'active' : ''}`}
              onClick={() => handleModeChange(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'equal' && bill && (
          <div className="detail-card">
            <p className="split-equal-desc">
              将 <strong>¥{bill.amount}</strong> 平均分配给 {roommates.length} 位室友，余数计入最后一位室友。
            </p>
            <div className="split-preview-list">
              {previewEqualSplit(bill.amount).map((s) => (
                <div key={s.name} className="split-preview-row">
                  <span>{s.name}</span>
                  <span>¥{s.amount}</span>
                </div>
              ))}
            </div>
            <p className="form-hint">保存后将重置为均分 AA。</p>
          </div>
        )}

        {mode === 'amount' && (
          <div className="split-input-grid">
            {roommates.map((rm) => (
              <div key={rm.id} className="form-group">
                <label htmlFor={`amt-${rm.id}`}>{rm.name} 应付（元）</label>
                <input
                  id={`amt-${rm.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={values[rm.name] ?? ''}
                  onChange={(e) =>
                    setValues({ ...values, [rm.name]: e.target.value })
                  }
                />
              </div>
            ))}
            {bill && previewSum !== null && (
              <p
                className={`split-sum-hint ${
                  Math.abs(previewSum - bill.amount) > 0.02 ? 'split-sum-hint--warn' : ''
                }`}
              >
                合计 ¥{previewSum.toFixed(2)} / 总额 ¥{bill.amount}
              </p>
            )}
          </div>
        )}

        {mode === 'ratio' && (
          <div className="split-input-grid">
            <p className="form-hint">填写相对比例（如 1:1:2:1），系统按总额自动换算金额。</p>
            {roommates.map((rm) => (
              <div key={rm.id} className="form-group">
                <label htmlFor={`ratio-${rm.id}`}>{rm.name} 比例</label>
                <input
                  id={`ratio-${rm.id}`}
                  type="number"
                  min="0"
                  step="0.1"
                  value={values[rm.name] ?? '1'}
                  onChange={(e) =>
                    setValues({ ...values, [rm.name]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <Button type="submit" disabled={submitting || !billId}>
            {submitting ? '保存中…' : '保存分摊方案'}
          </Button>
          {billId && (
            <Button as="Link" to={`/expenses/${billId}`} variant="ghost">
              查看账单详情
            </Button>
          )}
          <Button as="Link" to="/expenses" variant="ghost">
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
