import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import './FeaturePage.css'

const mockItems = [
  { id: 1, name: '抽纸', quantity: 2, unit: '包', threshold: 3, status: 'low' },
  { id: 2, name: '洗洁精', quantity: 1, unit: '瓶', threshold: 1, status: 'low' },
  { id: 3, name: '垃圾袋', quantity: 15, unit: '个', threshold: 10, status: 'ok' },
  { id: 4, name: '洗衣液', quantity: 1, unit: '瓶', threshold: 1, status: 'ok' },
  { id: 5, name: '卷纸', quantity: 4, unit: '卷', threshold: 6, status: 'ok' },
  { id: 6, name: '消毒液', quantity: 0, unit: '瓶', threshold: 1, status: 'empty' },
]

function getStatusLabel(status) {
  if (status === 'empty') return '已用完'
  if (status === 'low') return '需补货'
  return '充足'
}

export default function Items() {
  const lowCount = mockItems.filter((i) => i.status === 'low' || i.status === 'empty').length

  return (
    <div className="feature-page">
      <PageHeader
        icon="📦"
        title="公共物品登记"
        subtitle="登记合租共用消耗品，设置余量预警，低于阈值时自动提醒室友补货。"
        badge="演示数据"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">在库物品</span>
              <strong className="summary-value">{mockItems.length}</strong>
            </div>
            <div className="summary-card highlight">
              <span className="summary-label">需补货</span>
              <strong className="summary-value">{lowCount}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">本月消耗</span>
              <strong className="summary-value">8 次</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>物品清单</h2>
            <div className="item-list">
              {mockItems.map((item) => (
                <div key={item.id} className={`item-row item-row--${item.status}`}>
                  <div className="item-info">
                    <strong>{item.name.trim()}</strong>
                    <span>预警阈值：{item.threshold} {item.unit}</span>
                  </div>
                  <div className="item-quantity">
                    余量 <strong>{item.quantity}</strong> {item.unit}
                  </div>
                  <span className={`item-status item-status--${item.status}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton icon="➕" label="登记物品" description="添加新的公共消耗品" />
            <ActionButton icon="📉" label="记录消耗" description="使用后扣减库存" />
            <ActionButton icon="🛒" label="补货登记" description="采购后更新库存" />
            <ActionButton icon="🔔" label="补货提醒" description="通知室友采购物品" />
          </div>
        </aside>
      </div>
    </div>
  )
}
