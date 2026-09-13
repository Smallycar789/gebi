import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import MemoBoard from '../components/MemoBoard'
import { group } from '../data/mockData'
import { getExpenseSummary } from '../data/billsStore'
import { getDaysSince } from '../utils/date'
import './Home.css'

const { pendingCount, monthTotal } = getExpenseSummary()

const features = [
  {
    icon: '💰',
    title: '费用 AA 分摊',
    description: '房租、水电、网费一键录入，自动计算每人应付金额。',
    to: '/expenses',
    color: '#f59e0b',
    stats: [
      { value: String(pendingCount), label: '待结算' },
      { value: `¥${monthTotal.toLocaleString()}`, label: '本月总支出' },
    ],
  },
  {
    icon: '🧹',
    title: '清洁值日排班',
    description: '公共区域清洁任务自动轮换，今日值日一目了然。',
    to: '/cleaning',
    color: '#6ee7b7',
    stats: [
      { value: '小刚', label: '今日值日' },
      { value: '4', label: '本周任务' },
    ],
  },
  {
    icon: '📦',
    title: '公共物品登记',
    description: '共用消耗品登记入库，余量不足自动提醒补货。',
    to: '/items',
    color: '#fde047',
    stats: [
      { value: '6', label: '在库物品' },
      { value: '3', label: '需补货' },
    ],
  },
  {
    icon: '📋',
    title: '室友公约管理',
    description: '安静时段、访客规则等共识条款，共建和谐合租生活。',
    to: '/agreement',
    color: '#fdba74',
    stats: [
      { value: '8', label: '公约条款' },
      { value: '4', label: '室友签署' },
    ],
  },
]

export default function Home() {
  const daysJoined = getDaysSince(group.joinedAt)

  return (
    <div className="home">
      <div className="dashboard">
        <section className="dashboard-main">
          <div className="join-card">
            <span className="join-badge">欢迎回来</span>
            <h1>
              你已加入「<em>{group.name}</em>」
              <strong className="join-days">{daysJoined}</strong> 天
            </h1>
            <p className="join-desc">
              隔壁·合租生活伙伴，让费用、排班、物品和公约都清清楚楚。
            </p>
            <div className="join-meta">
              <Link to="/room/settings" className="join-meta-link">
                集体设置 →
              </Link>
              <span>成员 4 人 · 入组日期 {group.joinedAt}</span>
            </div>
          </div>

          <div className="features-section">
            <h2>功能入口</h2>
            <div className="features-grid">
              {features.map((feature) => (
                <FeatureCard key={feature.to} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <MemoBoard />
      </div>
    </div>
  )
}
