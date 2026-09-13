import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import { getAllItems, getItemsSummary, getItemStatusLabel } from '../data/itemsStore'
import './FeaturePage.css'

export default function Items() {
  const location = useLocation()
  const items = getAllItems()
  const { lowCount, monthConsumption } = getItemsSummary()
  const justAdded = location.state?.itemAdded
  const consumptionRecorded = location.state?.consumptionRecorded

  return (
    <div className="feature-page">
      {justAdded && (
        <p className="toast-success" role="status">物品已登记，清单已更新</p>
      )}
      {consumptionRecorded && (
        <p className="toast-success" role="status">消耗已记录，余量已更新</p>
      )}
      <PageHeader
        icon="📦"
        title="公共物品登记"
        subtitle="登记合租共用消耗品，设置余量预警，低于阈值时自动提醒室友补货。"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">在库物品</span>
              <strong className="summary-value">{items.length}</strong>
            </div>
            <div className="summary-card highlight">
              <span className="summary-label">需补货</span>
              <strong className="summary-value">{lowCount}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">本月消耗</span>
              <strong className="summary-value">{monthConsumption} 次</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>物品清单</h2>
            <div className="item-list">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className={`item-row item-row--link item-row--${item.status}`}
                >
                  <div className="item-info">
                    <strong>{item.name}</strong>
                    <span>预警阈值：{item.threshold} {item.unit}</span>
                  </div>
                  <div className="item-quantity">
                    余量 <strong>{item.quantity}</strong> {item.unit}
                  </div>
                  <span className={`item-status item-status--${item.status}`}>
                    {getItemStatusLabel(item.status)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton
              icon="➕"
              label="登记物品"
              description="添加新的公共消耗品"
              to="/items/new"
              variant="primary"
            />
            <ActionButton
              icon="📉"
              label="记录消耗"
              description="使用后扣减库存"
              to="/items/consume"
            />
            <ActionButton icon="🔔" label="补货提醒" description="通知室友采购物品" disabled />
          </div>
        </aside>
      </div>
    </div>
  )
}
