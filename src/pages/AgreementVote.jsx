import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { getRules, voteAgree, currentUser, roommates } from '../data/agreementStore'
import './FeaturePage.css'

export default function AgreementVote() {
  const navigate = useNavigate()
  const [rules, setRules] = useState(() => getRules())
  const [voterId, setVoterId] = useState(currentUser.id)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function refresh() {
    setRules(getRules())
  }

  function handleVote(ruleId) {
    setError('')
    setMessage('')
    const result = voteAgree(ruleId, voterId)
    if (result.error) {
      setError(result.error)
      return
    }
    refresh()
    const rule = result.rule
    if (rule.status === 'active') {
      setMessage(`「${rule.category}」已获得足够票数，条款已生效`)
    } else {
      setMessage(`已投票同意，当前 ${rule.votes} / ${roommates.length} 人同意`)
    }
  }

  const pendingRules = rules.filter((r) => r.status === 'pending')

  return (
    <div className="feature-page">
      <BackLink to="/agreement" />
      <PageHeader
        icon="🗳️"
        title="发起投票"
        subtitle={`对公约条款进行表决。当前账号：${currentUser.name}。全员同意后条款生效。`}
      />

      {message && <p className="toast-success" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-card" style={{ marginBottom: 20, maxWidth: 560 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="vote-as">投票身份</label>
          <select id="vote-as" value={voterId} onChange={(e) => setVoterId(e.target.value)}>
            {roommates.map((rm) => (
              <option key={rm.id} value={rm.id}>{rm.name}</option>
            ))}
          </select>
        </div>
      </div>

      {pendingRules.length === 0 ? (
        <div className="detail-card">
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            当前没有待表决条款。新增条款后可在此投票。
          </p>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <Button as="Link" to="/agreement">返回公约</Button>
          </div>
        </div>
      ) : (
        <div className="rule-list">
          {pendingRules.map((rule) => {
            const voted = rule.voters.includes(voterId)
            return (
              <div key={rule.id} className="rule-item rule-item--vote">
                <span className="rule-category">{rule.category}</span>
                <p className="rule-content">{rule.content}</p>
                <div className="vote-row">
                  <span className="rule-votes">
                    {rule.votes} / {roommates.length} 人同意
                    {voted ? ' · 你已投票' : ''}
                  </span>
                  <Button
                    type="button"
                    disabled={voted}
                    onClick={() => handleVote(rule.id)}
                  >
                    {voted ? '已同意' : '投赞成票'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="form-actions" style={{ marginTop: 24 }}>
        <Button type="button" variant="ghost" onClick={() => navigate('/agreement', { state: { voteDone: true } })}>
          完成并返回
        </Button>
      </div>
    </div>
  )
}
