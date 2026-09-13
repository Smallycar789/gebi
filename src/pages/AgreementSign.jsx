import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import {
  getRules,
  getSignatures,
  signAgreement,
  currentUser,
  getAgreementSummary,
  roommates,
} from '../data/agreementStore'
import './FeaturePage.css'

export default function AgreementSign() {
  const navigate = useNavigate()
  const rules = getRules()
  const signatures = getSignatures()
  const { signedCount, totalMembers } = getAgreementSummary()
  const [signerId, setSignerId] = useState(currentUser.id)
  const me = signatures.find((s) => s.id === signerId)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const pendingCount = rules.filter((r) => r.status === 'pending').length

  function handleSign() {
    setError('')
    if (!confirmed) {
      setError('请先勾选确认已阅读并同意全部公约条款')
      return
    }
    const result = signAgreement(signerId)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/agreement', { state: { signed: true } })
  }

  return (
    <div className="feature-page">
      <BackLink to="/agreement" />
      <PageHeader
        icon="✍️"
        title="签署公约"
        subtitle="确认并签署当前公约。"
      />

      <div className="form-card" style={{ marginBottom: 20, maxWidth: 560 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="sign-as">签署身份</label>
          <select id="sign-as" value={signerId} onChange={(e) => { setSignerId(e.target.value); setConfirmed(false); setError('') }}>
            {roommates.map((rm) => (
              <option key={rm.id} value={rm.id}>{rm.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="detail-card sign-preview">
        <h2>当前公约摘要</h2>
        <p className="sign-meta">
          共 {rules.length} 条条款 · 已签署 {signedCount}/{totalMembers} 人
          {pendingCount > 0 && (
            <span className="sign-warn"> · {pendingCount} 条待表决</span>
          )}
        </p>
        <ul className="sign-rule-list">
          {rules.map((rule) => (
            <li key={rule.id}>
              <strong>{rule.category}</strong>
              <span>{rule.content}</span>
              {rule.status === 'pending' && (
                <em className="sign-pending-tag">待表决</em>
              )}
            </li>
          ))}
        </ul>
      </div>

      {me?.signed ? (
        <div className="checkin-card" style={{ marginTop: 20 }}>
          <p className="checkin-success-text">你已于 {me.signedDate} 签署公约</p>
          <Button as="Link" to="/agreement">返回公约</Button>
        </div>
      ) : (
        <div className="form-card">
          {error && <p className="form-error" role="alert">{error}</p>}
          <label className="sign-confirm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            我已阅读并同意以上全部公约条款
          </label>
          <div className="form-actions">
            <Button type="button" onClick={handleSign}>确认签署</Button>
            <Button as="Link" to="/agreement" variant="ghost">取消</Button>
          </div>
        </div>
      )}
    </div>
  )
}
