import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { addRule } from '../data/agreementStore'
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

export default function AgreementRuleNew() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('其他')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = addRule({ category, content })
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/agreement', { state: { ruleAdded: true } })
  }

  return (
    <div className="feature-page">
      <BackLink to="/agreement" />
      <PageHeader
        icon="➕"
        title="新增条款"
        subtitle="添加新的公约规则，提交后需室友投票表决并重新签署公约。"
      />

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="rule-category">条款分类</label>
          <select
            id="rule-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="rule-content">条款内容</label>
          <textarea
            id="rule-content"
            rows={5}
            placeholder="描述具体的公约规则…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <Button type="submit">提交条款</Button>
          <Button as="Link" to="/agreement" variant="ghost">取消</Button>
        </div>
      </form>
    </div>
  )
}
