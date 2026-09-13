import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import ToggleSwitch from '../components/ToggleSwitch'
import ExpenseSplitEditor, {
  splitValuesFromBill,
  defaultSplitValues,
} from '../components/ExpenseSplitEditor'
import {
  getBillById,
  setSplitPaid,
  getSplitModeLabel,
  updateBillDetails,
  roommates,
} from '../data/billsStore'
import './FeaturePage.css'

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

export default function ExpenseDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [bill, setBill] = useState(() => getBillById(id))
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [splitMode, setSplitMode] = useState('equal')
  const [splitValues, setSplitValues] = useState({})
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(Boolean(location.state?.billUpdated))

  useEffect(() => {
    const next = getBillById(id)
    setBill(next)
    setSaved(Boolean(location.state?.billUpdated))
    setError('')
    if (next) {
      setEditName(next.name)
      const mode = next.splitMode || 'equal'
      setSplitMode(mode)
      setSplitValues(
        mode === 'equal'
          ? defaultSplitValues('amount', next.amount)
          : splitValuesFromBill(next, mode)
      )
      setEditing(Boolean(location.state?.edit))
    } else {
      setEditing(false)
    }
  }, [id, location.state?.billUpdated, location.state?.edit])

  if (!bill) {
    return (
      <div className="feature-page">
        <BackLink to="/expenses" />
        <div className="not-found">
          <h2>账单不存在</h2>
          <p>未找到该账单记录</p>
        </div>
      </div>
    )
  }

  function handlePaidChange(memberName, paid) {
    const updated = setSplitPaid(id, memberName, paid)
    if (updated) setBill(updated)
  }

  function startEdit() {
    setEditName(bill.name)
    const mode = bill.splitMode || 'equal'
    setSplitMode(mode)
    setSplitValues(
      mode === 'equal'
        ? defaultSplitValues('amount', bill.amount)
        : splitValuesFromBill(bill, mode)
    )
    setError('')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError('')
  }

  function handleModeChange(nextMode) {
    setSplitMode(nextMode)
    setSplitValues(
      nextMode === 'equal'
        ? defaultSplitValues('amount', bill.amount)
        : defaultSplitValues(nextMode, bill.amount)
    )
  }

  function handleSaveEdit(e) {
    e.preventDefault()
    setError('')
    const result = updateBillDetails(id, {
      name: editName,
      split: buildSplitPayload(splitMode, splitValues),
    })
    if (result.error) {
      setError(result.error)
      return
    }
    setBill(result.bill)
    setEditing(false)
    setSaved(true)
  }

  return (
    <div className="feature-page">
      <BackLink to="/expenses" />
      {saved && !editing && (
        <p className="toast-success" role="status">账单已更新</p>
      )}
      <PageHeader
        icon="💰"
        title={editing ? '编辑账单' : bill.name}
        subtitle={
          editing
            ? '修改账单名称与分摊方式，保存后分摊明细将更新。'
            : `${bill.type} · ${bill.date} · 总计 ¥${bill.amount} · ${getSplitModeLabel(bill.splitMode)}`
        }
        badge={bill.status === 'pending' ? '待结算' : '已结清'}
        action={
          !editing ? (
            <button type="button" className="page-header-edit-btn" onClick={startEdit}>
              编辑
            </button>
          ) : null
        }
      />

      <div className="feature-main">
        {editing ? (
          <form className="form-card" onSubmit={handleSaveEdit}>
            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="form-group">
              <label htmlFor="edit-bill-name">账单名称</label>
              <input
                id="edit-bill-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <p className="form-hint">
              账单总额 ¥{bill.amount}（编辑页暂不支持改金额，如需调整请重新登记）
            </p>

            <ExpenseSplitEditor
              mode={splitMode}
              onModeChange={handleModeChange}
              values={splitValues}
              onValuesChange={setSplitValues}
              totalAmount={bill.amount}
              compact
            />

            <div className="form-actions">
              <Button type="submit">保存</Button>
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                取消
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <span className="summary-label">总金额</span>
                <strong className="summary-value">¥{bill.amount}</strong>
              </div>
              <div className="summary-card">
                <span className="summary-label">
                  {bill.splitMode !== 'equal' ? '参考人均' : '人均应付'}
                </span>
                <strong className="summary-value">¥{bill.perPerson}</strong>
              </div>
              <div className={`summary-card ${bill.status === 'pending' ? 'highlight' : ''}`}>
                <span className="summary-label">状态</span>
                <strong className="summary-value">
                  {bill.status === 'pending' ? '待结算' : '已结清'}
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <h2>分摊明细</h2>
              <p className="split-hint">
                滑动开关标记每位室友是否已付款；全员已付后账单自动变为已结清。
              </p>
              <div className="split-table">
                {bill.splits.map((split) => (
                  <div key={split.name} className={`split-row ${split.paid ? 'paid' : ''}`}>
                    <div className="split-row-info">
                      <span className="split-name">{split.name}</span>
                      <span className="split-amount">¥{split.amount}</span>
                    </div>
                    <div className="split-row-actions">
                      <span className={`split-status split-status--${split.paid ? 'paid' : 'unpaid'}`}>
                        {split.paid ? '已付款' : '待付款'}
                      </span>
                      <ToggleSwitch
                        checked={split.paid}
                        onChange={(paid) => handlePaidChange(split.name, paid)}
                        label={`${split.name} ${split.paid ? '已付款' : '待付款'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
