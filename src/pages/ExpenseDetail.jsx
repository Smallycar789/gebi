import { useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import PageHeader from '../components/PageHeader'
import { getBillById } from '../data/mockData'
import './FeaturePage.css'

export default function ExpenseDetail() {
  const { id } = useParams()
  const bill = getBillById(id)

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
          <div className="split-table">
            {bill.splits.map((split) => (
              <div key={split.name} className={`split-row ${split.paid ? 'paid' : ''}`}>
                <span>{split.name}</span>
                <span>¥{split.amount}</span>
                <span className={`split-status split-status--${split.paid ? 'paid' : 'unpaid'}`}>
                  {split.paid ? '已付款' : '待付款'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
