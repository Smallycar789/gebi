import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import './FeaturePage.css'

export default function ExpenseNew() {
  return (
    <div className="feature-page">
      <BackLink to="/expenses" />
      <PageHeader
        icon="➕"
        title="新增账单"
        subtitle="录入房租、水电、网费等合租支出，系统将自动按人数 AA 分摊。"
        badge="演示数据"
      />

      <div className="form-card">
        <div className="form-group">
          <label htmlFor="bill-name">账单名称</label>
          <input id="bill-name" type="text" placeholder="例如：3月水电费" />
        </div>
        <div className="form-group">
          <label htmlFor="bill-type">费用类型</label>
          <select id="bill-type" defaultValue="水电">
            <option value="房租">房租</option>
            <option value="水电">水电</option>
            <option value="网费">网费</option>
            <option value="燃气">燃气</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bill-amount">总金额（元）</label>
          <input id="bill-amount" type="number" placeholder="0.00" />
        </div>
        <div className="form-group">
          <label htmlFor="bill-date">账单日期</label>
          <input id="bill-date" type="date" />
        </div>
        <div className="form-actions">
          <Button disabled>提交账单</Button>
          <Button as="Link" to="/expenses" variant="ghost">取消</Button>
        </div>
      </div>
    </div>
  )
}
