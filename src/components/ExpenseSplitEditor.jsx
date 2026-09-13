import { useMemo } from 'react'
import { roommates } from '../data/mockData'
import { getSplitModeLabel } from '../data/billsStore'
import './ExpenseSplitEditor.css'

export const SPLIT_MODES = [
  { id: 'equal', label: '均分 AA' },
  { id: 'amount', label: '按金额' },
  { id: 'ratio', label: '按比例' },
]

export function previewEqualSplit(total) {
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

export function splitValuesFromBill(bill, mode) {
  const map = {}
  for (const rm of roommates) {
    const split = bill?.splits?.find((s) => s.name === rm.name)
    if (mode === 'ratio') {
      map[rm.name] = '1'
    } else if (mode === 'amount') {
      map[rm.name] = split ? String(split.amount) : '0'
    }
  }
  return map
}

export function defaultSplitValues(mode, total) {
  if (mode === 'ratio') {
    return Object.fromEntries(roommates.map((rm) => [rm.name, '1']))
  }
  if (mode === 'amount' && total > 0) {
    const rows = previewEqualSplit(total)
    return Object.fromEntries(rows.map((r) => [r.name, String(r.amount)]))
  }
  return {}
}

export default function ExpenseSplitEditor({
  mode,
  onModeChange,
  values,
  onValuesChange,
  totalAmount,
  compact = false,
}) {
  const total = Number(totalAmount) || 0

  const previewSum = useMemo(() => {
    if (mode !== 'amount') return null
    return roommates.reduce(
      (sum, rm) => sum + (Number(values[rm.name]) || 0),
      0
    )
  }, [mode, values])

  const sumMismatch =
    previewSum !== null && total > 0 && Math.abs(previewSum - total) > 0.02

  return (
    <div className={`expense-split-editor ${compact ? 'expense-split-editor--compact' : ''}`}>
      <h3 className="expense-split-editor-title">分摊方式</h3>

      <div className="split-mode-tabs" role="tablist">
        {SPLIT_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={`split-mode-tab ${mode === m.id ? 'active' : ''}`}
            onClick={() => onModeChange(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'equal' && total > 0 && (
        <div className="split-equal-block">
          <p className="split-equal-desc">
            将 <strong>¥{total}</strong> 平均分配给 {roommates.length} 位室友。
          </p>
          <div className="split-preview-list">
            {previewEqualSplit(total).map((s) => (
              <div key={s.name} className="split-preview-row">
                <span>{s.name}</span>
                <span>¥{s.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'equal' && total <= 0 && (
        <p className="form-hint">请先填写账单总金额以预览均分结果。</p>
      )}

      {mode === 'amount' && (
        <div className="split-input-grid">
          {roommates.map((rm) => (
            <div key={rm.id} className="form-group">
              <label htmlFor={`split-amt-${rm.id}`}>{rm.name} 应付（元）</label>
              <input
                id={`split-amt-${rm.id}`}
                type="number"
                min="0"
                step="0.01"
                value={values[rm.name] ?? ''}
                onChange={(e) =>
                  onValuesChange({ ...values, [rm.name]: e.target.value })
                }
              />
            </div>
          ))}
          {total > 0 && previewSum !== null && (
            <p className={`split-sum-hint ${sumMismatch ? 'split-sum-hint--warn' : ''}`}>
              合计 ¥{previewSum.toFixed(2)} / 总额 ¥{total}
            </p>
          )}
        </div>
      )}

      {mode === 'ratio' && (
        <div className="split-input-grid">
          <p className="form-hint">填写相对比例，系统按总额自动换算为每人应付金额。</p>
          {roommates.map((rm) => (
            <div key={rm.id} className="form-group">
              <label htmlFor={`split-ratio-${rm.id}`}>{rm.name} 比例</label>
              <input
                id={`split-ratio-${rm.id}`}
                type="number"
                min="0"
                step="0.1"
                value={values[rm.name] ?? '1'}
                onChange={(e) =>
                  onValuesChange({ ...values, [rm.name]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      )}

      <p className="form-hint split-mode-label-hint">
        当前选择：{getSplitModeLabel(mode)}
      </p>
    </div>
  )
}
