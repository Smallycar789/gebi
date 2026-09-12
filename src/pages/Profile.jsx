import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { currentUser, group } from '../data/mockData'
import { getDaysSince } from '../utils/date'
import './FeaturePage.css'

export default function Profile() {
  const daysJoined = getDaysSince(group.joinedAt)

  return (
    <div className="feature-page">
      <PageHeader
        icon="👤"
        title="个人中心"
        subtitle="查看个人信息与快捷入口。"
      />

      <div className="profile-header">
        <span className="profile-avatar">{currentUser.avatar}</span>
        <div className="profile-info">
          <h1>{currentUser.name}</h1>
          <p>{currentUser.phone}</p>
          <p>所属集体：{group.name} · 已加入 {daysJoined} 天</p>
        </div>
      </div>

      <div className="profile-links">
        <Button as="Link" to="/room/settings" variant="secondary" className="btn--block">
          合租房设置
        </Button>
        <Button as="Link" to="/agreement" variant="secondary" className="btn--block">
          室友公约
        </Button>
        <Button as="Link" to="/expenses" variant="ghost" className="btn--block">
          费用分摊
        </Button>
        <Button as="Link" to="/cleaning" variant="ghost" className="btn--block">
          清洁排班
        </Button>
      </div>
    </div>
  )
}
