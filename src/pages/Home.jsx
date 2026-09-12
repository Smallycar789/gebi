import FeatureCard from '../components/FeatureCard'
import './Home.css'

const features = [
  {
    icon: '💰',
    title: '费用 AA 分摊',
    description: '房租、水电、网费一键录入，自动计算每人应付金额，告别算账纠纷。',
    to: '/expenses',
    color: '#2563eb',
    stats: [
      { value: '3', label: '待结算' },
      { value: '¥1,280', label: '本月总支出' },
    ],
  },
  {
    icon: '🧹',
    title: '清洁值日排班',
    description: '公共区域清洁任务自动轮换，今日值日一目了然，公平又省心。',
    to: '/cleaning',
    color: '#10b981',
    stats: [
      { value: '小明', label: '今日值日' },
      { value: '4', label: '本周任务' },
    ],
  },
  {
    icon: '📦',
    title: '公共物品登记',
    description: '纸巾、洗洁精等共用消耗品登记入库，余量不足自动提醒补货。',
    to: '/items',
    color: '#f59e0b',
    stats: [
      { value: '12', label: '在库物品' },
      { value: '2', label: '需补货' },
    ],
  },
  {
    icon: '📋',
    title: '室友公约管理',
    description: '安静时段、访客规则、宠物约定等共识条款，共建和谐合租生活。',
    to: '/agreement',
    color: '#8b5cf6',
    stats: [
      { value: '8', label: '公约条款' },
      { value: '4', label: '室友签署' },
    ],
  },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">合租生活，从此清晰</span>
          <h1>合居 · 合租生活管家</h1>
          <p className="hero-desc">
            专为年轻人合租场景设计，解决费用分摊不清、清洁排班混乱、
            共用物品无记录等痛点，让室友关系更透明、生活更和谐。
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>4</strong>
              <span>核心功能</span>
            </div>
            <div className="hero-stat">
              <strong>4</strong>
              <span>室友成员</span>
            </div>
            <div className="hero-stat">
              <strong>阳光公寓 302</strong>
              <span>当前合租房</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">💰 水电费已分摊</div>
          <div className="hero-card hero-card-2">🧹 今日值日：小明</div>
          <div className="hero-card hero-card-3">📦 纸巾余量不足</div>
        </div>
      </section>

      <section className="features-section">
        <h2>功能模块</h2>
        <p className="section-desc">点击进入各功能模块，管理你的合租生活</p>
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.to} {...feature} />
          ))}
        </div>
      </section>

      <section className="quick-tips">
        <h2>合租小贴士</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span>💡</span>
            <p>费用录入后系统会自动按人数 AA，支持自定义分摊比例</p>
          </div>
          <div className="tip-card">
            <span>💡</span>
            <p>清洁排班支持按周轮换，值日完成后可打卡确认</p>
          </div>
          <div className="tip-card">
            <span>💡</span>
            <p>公共物品设置预警阈值，低于余量时推送补货提醒</p>
          </div>
        </div>
      </section>
    </div>
  )
}
