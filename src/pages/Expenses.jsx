import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import { roommates } from '../data/mockData'
import { getAllBills, getExpenseSummary, getSplitModeLabel } from '../data/billsStore'
import './FeaturePage.css'

export default function Expenses() {
  const location = useLocation()
  const bills = getAllBills()
  const { pendingCount, monthTotal, perPerson } = getExpenseSummary()
  const justAdded = location.state?.billAdded
  return (
    <div className="feature-page">
      {justAdded && (
        <p className="toast-success" role="status">
          账单已添加，列表已更新
        </p>
      )}
      <PageHeader
        icon="💰"
        title="费用 AA 分摊"
        subtitle="录入合租支出，新增时可选择分摊方式；点击账单查看明细与付款状态。"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">本月总支出</span>
              <strong className="summary-value">¥{monthTotal.toLocaleString()}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">人均应付</span>
              <strong className="summary-value">¥{perPerson.toFixed(2)}</strong>
            </div>
            <div className="summary-card highlight">
              <span className="summary-label">待结算</span>
              <strong className="summary-value">{pendingCount} 笔</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>账单列表</h2>
            <div className="bill-list">
              {bills.map((bill) => (
                <Link
                  key={bill.id}
                  to={`/expenses/${bill.id}`}
                  className="bill-item bill-item--link"
                >
                  <div className="bill-info">
                    <strong>{bill.name}</strong>
                    <span className="bill-date">
                      {bill.date}
                      {bill.splitMode && bill.splitMode !== 'equal' && (
                        <> · {getSplitModeLabel(bill.splitMode)}</>
                      )}
                    </span>
                  </div>
                  <div className="bill-amount">
                    <span>总计 ¥{bill.amount}</span>
                    <span className="per-person">
                      {bill.splitMode !== 'equal' ? '参考人均' : '人均'} ¥{bill.perPerson}
                    </span>
                  </div>
                  <span className={`bill-status bill-status--${bill.status}`}>
                    {bill.status === 'pending' ? '待结算' : '已结清'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>分摊成员</h2>
            <div className="member-tags">
              {roommates.map((rm) => (
                <span key={rm.id} className="member-tag">{rm.name}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton icon="➕" label="新增账单" description="录入账单并设置分摊方式" to="/expenses/new" variant="primary" />
            <ActionButton icon="📊" label="导出明细" description="导出 Excel 对账表" disabled />
            <ActionButton icon="🔔" label="催缴提醒" description="向室友发送结算提醒" disabled />
          </div>
        </aside>
      </div>
    </div>
  )
}
