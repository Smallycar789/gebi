import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { getRules, updateRule } from '../data/agreementStore'
import './FeaturePage.css'

const categoryOptions = [
  '安静时段',
  '访客规定',
  '公共区域',
  '宠物相关',
  '费用结算',
  '卫生标准',
  '快递包裹',
  '钥匙管理',
  '其他',
]

export default function AgreementRuleEdit() {
  const navigate = useNavigate()
  const rules = getRules()
  const [ruleId, setRuleId] = useState(rules[0]?.id ?? '')
  const selected = rules.find((r) => r.id === ruleId) || rules[0]

  const [category, setCategory] = useState(selected?.category ?? '其他')
  const [content, setContent] = useState(selected?.content ?? '')
  const [error, setError] = useState('')

  function handleRuleChange(id) {
    setRuleId(id)
    const rule = rules.find((r) => r.id === id)
    if (rule) {
      setCategory(rule.category)
      setContent(rule.content)
    }
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = updateRule(ruleId, { category, content })
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/agreement', { state: { ruleUpdated: true } })
  }

  if (rules.length === 0) {
    return (
      <div className="feature-page">
        <BackLink to="/agreement" />
        <PageHeader icon="✏️" title="编辑条款" subtitle="暂无条款可编辑。" />
        <Button as="Link" to="/agreement/new">新增条款</Button>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <BackLink to="/agreement" />
      <PageHeader
        icon="✏️"
        title="编辑条款"
        subtitle="修改已有公约内容，保存后室友需重新签署公约。"
      />

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="edit-rule-select">选择条款</label>
          <select
            id="edit-rule-select"
            value={ruleId}
            onChange={(e) => handleRuleChange(e.target.value)}
          >
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                [{rule.category}] {rule.content.slice(0, 24)}
                {rule.content.length > 24 ? '…' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="edit-category">条款分类</label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="edit-content">条款内容</label>
          <textarea
            id="edit-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <Button type="submit">保存修改</Button>
          <Button as="Link" to="/agreement" variant="ghost">取消</Button>
        </div>
      </form>
    </div>
  )
}
