import { useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import {
  getRules,
  getSignatures,
  getAgreementSummary,
} from '../data/agreementStore'
import './FeaturePage.css'

export default function Agreement() {
  const location = useLocation()
  const rules = getRules()
  const signatures = getSignatures()
  const { signedCount, totalMembers, lastUpdated } = getAgreementSummary()

  return (
    <div className="feature-page">
      {location.state?.ruleAdded && (
        <p className="toast-success" role="status">新条款已添加，请发起投票表决</p>
      )}
      {location.state?.ruleUpdated && (
        <p className="toast-success" role="status">条款已更新，请室友重新签署</p>
      )}
      {location.state?.voteDone && (
        <p className="toast-success" role="status">投票已记录</p>
      )}
      {location.state?.signed && (
        <p className="toast-success" role="status">公约签署成功</p>
      )}

      <PageHeader
        icon="📋"
        title="室友公约管理"
        subtitle="共同制定并维护合租生活规则，所有室友签署确认，共建和谐居住环境。"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">公约条款</span>
              <strong className="summary-value">{rules.length}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">已签署</span>
              <strong className="summary-value">{signedCount} / {totalMembers}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">最近更新</span>
              <strong className="summary-value">{lastUpdated}</strong>
            </div>
          </div>

          <div className="section-block">
            <h2>公约条款</h2>
            <div className="rule-list">
              {rules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <span className="rule-category">{rule.category}</span>
                  <p className="rule-content">{rule.content}</p>
                  <span className="rule-votes">
                    {rule.votes} 人同意
                    {rule.status === 'pending' && (
                      <span className="rule-pending-badge"> · 待表决</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>签署状态</h2>
            <div className="sign-list">
              {signatures.map((rm) => (
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
            <ActionButton
              icon="➕"
              label="新增条款"
              description="添加新的公约规则"
              to="/agreement/new"
              variant="primary"
            />
            <ActionButton
              icon="✏️"
              label="编辑条款"
              description="修改已有公约内容"
              to="/agreement/edit"
            />
            <ActionButton
              icon="🗳️"
              label="发起投票"
              description="对新条款进行表决"
              to="/agreement/vote"
            />
            <ActionButton
              icon="✍️"
              label="签署公约"
              description="确认并签署当前公约"
              to="/agreement/sign"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
