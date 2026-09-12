import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import './FeaturePage.css'

const mockRules = [
  { id: 1, category: '安静时段', content: '工作日 22:00 - 08:00、周末 23:00 - 09:00 保持安静', votes: 4 },
  { id: 2, category: '访客规定', content: '留宿访客需提前 1 天在群内告知所有室友', votes: 4 },
  { id: 3, category: '公共区域', content: '用完厨房、客厅后及时整理，不遗留个人物品', votes: 4 },
  { id: 4, category: '宠物相关', content: '禁止在合租房内饲养宠物', votes: 3 },
  { id: 5, category: '费用结算', content: '公共费用需在账单发布后 3 日内完成转账', votes: 4 },
  { id: 6, category: '卫生标准', content: '值日未完成的室友需请其他人代班或支付代班费', votes: 4 },
  { id: 7, category: '快递包裹', content: '快递统一放置门口快递架，取件后及时清理外包装', votes: 4 },
  { id: 8, category: '钥匙管理', content: '最后出门者负责锁门，钥匙不得外借非室友人员', votes: 4 },
]

const roommates = [
  { name: '小明', signed: true, date: '2026-01-15' },
  { name: '小红', signed: true, date: '2026-01-15' },
  { name: '小刚', signed: true, date: '2026-01-16' },
  { name: '小丽', signed: true, date: '2026-01-15' },
]

export default function Agreement() {
  return (
    <div className="feature-page">
      <PageHeader
        icon="📋"
        title="室友公约管理"
        subtitle="共同制定并维护合租生活规则，所有室友签署确认，共建和谐居住环境。"
        badge="演示数据"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">公约条款</span>
              <strong className="summary-value">{mockRules.length}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">已签署</span>
              <strong className="summary-value">4 / 4</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">最近更新</span>
              <strong className="summary-value">2026-02-01</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>公约条款</h2>
            <div className="rule-list">
              {mockRules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <span className="rule-category">{rule.category}</span>
                  <p className="rule-content">{rule.content}</p>
                  <span className="rule-votes">{rule.votes} 人同意</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>签署状态</h2>
            <div className="sign-list">
              {roommates.map((rm) => (
                <div key={rm.name} className="sign-item">
                  <span className="sign-name">{rm.name}</span>
                  <span className={`sign-status ${rm.signed ? 'signed' : ''}`}>
                    {rm.signed ? `✅ 已签署 (${rm.date})` : '⏳ 待签署'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton icon="➕" label="新增条款" description="添加新的公约规则" />
            <ActionButton icon="✏️" label="编辑条款" description="修改已有公约内容" />
            <ActionButton icon="🗳️" label="发起投票" description="对新条款进行表决" />
            <ActionButton icon="✍️" label="签署公约" description="确认并签署当前公约" />
          </div>
        </aside>
      </div>
    </div>
  )
}
