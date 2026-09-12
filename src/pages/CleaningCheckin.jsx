import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { todayDuty } from '../data/mockData'
import './FeaturePage.css'

export default function CleaningCheckin() {
  return (
    <div className="feature-page">
      <BackLink to="/cleaning" />
      <PageHeader
        icon="✅"
        title="值日打卡"
        subtitle="完成今日清洁任务后打卡确认，记录值日完成情况。"
        badge="演示数据"
      />

      <div className="checkin-card">
        <h2>今日值日：{todayDuty.person}</h2>
        <p>负责区域：{todayDuty.area}</p>
        <div className="photo-placeholder">📷 拍照打卡（即将上线）</div>
        <Button disabled>确认打卡</Button>
      </div>
    </div>
  )
}
