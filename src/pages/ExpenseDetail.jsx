import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import PageHeader from '../components/PageHeader'
import ToggleSwitch from '../components/ToggleSwitch'
import { getBillById, setSplitPaid } from '../data/billsStore'
import './FeaturePage.css'

export default function ExpenseDetail() {
  const { id } = useParams()
  const [bill, setBill] = useState(() => getBillById(id))

  useEffect(() => {
    setBill(getBillById(id))
  }, [id])

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

  return (
    <div className="feature-page">
      <BackLink to="/expenses" />
      <PageHeader
        icon="💰"
        title={bill.name}
        subtitle={`${bill.type} · ${bill.date} · 总计 ¥${bill.amount}`}
        badge={bill.status === 'pending' ? '待结算' : '已结清'}
      />

      <div className="feature-main">
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">总金额</span>
            <strong className="summary-value">¥{bill.amount}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">人均应付</span>
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
          <p className="split-hint">滑动开关标记每位室友是否已付款；全员已付后账单自动变为已结清。</p>
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
      </div>
    </div>
  )
}
