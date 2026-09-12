import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import { agreementRules, roommates } from '../data/mockData'
import './FeaturePage.css'

export default function Agreement() {
  const signedCount = roommates.filter((rm) => rm.signed).length

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
              <strong className="summary-value">{agreementRules.length}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">已签署</span>
              <strong className="summary-value">{signedCount} / {roommates.length}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">最近更新</span>
              <strong className="summary-value">2026-02-01</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>公约条款</h2>
            <div className="rule-list">
              {agreementRules.map((rule) => (
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
                <div key={rm.id} className="sign-item">
                  <span className="sign-name">{rm.name}</span>
                  <span className={`sign-status ${rm.signed ? 'signed' : ''}`}>
                    {rm.signed ? `✅ 已签署 (${rm.signedDate})` : '⏳ 待签署'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton icon="➕" label="新增条款" description="添加新的公约规则" disabled />
            <ActionButton icon="✏️" label="编辑条款" description="修改已有公约内容" disabled />
            <ActionButton icon="🗳️" label="发起投票" description="对新条款进行表决" disabled />
            <ActionButton icon="✍️" label="签署公约" description="确认并签署当前公约" disabled />
          </div>
        </aside>
      </div>
    </div>
  )
}
