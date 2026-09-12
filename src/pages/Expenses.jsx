import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import './FeaturePage.css'

const mockBills = [
  { id: 1, name: '3月房租', amount: 4800, perPerson: 1200, status: 'pending', date: '2026-03-01' },
  { id: 2, name: '2月水电费', amount: 186, perPerson: 46.5, status: 'settled', date: '2026-02-28' },
  { id: 3, name: '2月网费', amount: 129, perPerson: 32.25, status: 'settled', date: '2026-02-15' },
]

const roommates = ['小明', '小红', '小刚', '小丽']

export default function Expenses() {
  return (
    <div className="feature-page">
      <PageHeader
        icon="💰"
        title="费用 AA 分摊"
        subtitle="录入合租期间的各项支出，系统自动按人数均摊，清晰记录每笔费用的分摊明细。"
        badge="演示数据"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">本月总支出</span>
              <strong className="summary-value">¥1,280</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">人均应付</span>
              <strong className="summary-value">¥320</strong>
            </div>
            <div className="summary-card highlight">
              <span className="summary-label">待结算</span>
              <strong className="summary-value">1 笔</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>账单列表</h2>
            <div className="bill-list">
              {mockBills.map((bill) => (
                <div key={bill.id} className="bill-item">
                  <div className="bill-info">
                    <strong>{bill.name}</strong>
                    <span className="bill-date">{bill.date}</span>
                  </div>
                  <div className="bill-amount">
                    <span>总计 ¥{bill.amount}</span>
                    <span className="per-person">人均 ¥{bill.perPerson}</span>
                  </div>
                  <span className={`bill-status bill-status--${bill.status}`}>
                    {bill.status === 'pending' ? '待结算' : '已结清'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>分摊成员</h2>
            <div className="member-tags">
              {roommates.map((name) => (
                <span key={name} className="member-tag">{name}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton icon="➕" label="新增账单" description="录入房租、水电、网费等" />
            <ActionButton icon="🧮" label="自定义分摊" description="按房间或比例分摊" />
            <ActionButton icon="📊" label="导出明细" description="导出 Excel 对账表" />
            <ActionButton icon="🔔" label="催缴提醒" description="向室友发送结算提醒" />
          </div>
        </aside>
      </div>
    </div>
  )
}
