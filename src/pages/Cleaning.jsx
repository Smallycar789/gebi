import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import {
  getWeekSchedule,
  getTodayDuty,
  getCleaningAreas,
  isTodayCheckedIn,
} from '../data/cleaningStore'
import './FeaturePage.css'

export default function Cleaning() {
  const location = useLocation()
  const weekSchedule = getWeekSchedule()
  const todayDuty = getTodayDuty()
  const cleaningAreas = getCleaningAreas()
  const scheduleUpdated = location.state?.scheduleUpdated
  const checkinSuccess = location.state?.checkinSuccess
  const todayCheckedIn = isTodayCheckedIn()

  return (
    <div className="feature-page">
      {scheduleUpdated && (
        <p className="toast-success" role="status">排班已更新，本周值日表已刷新</p>
      )}
      {checkinSuccess && (
        <p className="toast-success" role="status">打卡成功，今日值日已标记为已完成</p>
      )}
      <PageHeader
        icon="🧹"
        title="清洁值日排班"
        subtitle="公共区域清洁任务按周自动轮换，今日值日一目了然，完成后可打卡确认。"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className={`today-duty ${todayCheckedIn ? 'today-duty--done' : ''}`}>
            <div className="today-duty-badge">
              {todayCheckedIn ? '已打卡' : '今日值日'}
            </div>
            <div className="today-duty-content">
              <strong>{todayDuty.person}</strong>
              <span>负责：{todayDuty.area}</span>
            </div>
            {todayCheckedIn ? (
              <Link to="/cleaning/checkin" className="checkin-btn checkin-btn--done">
                查看打卡
              </Link>
            ) : (
              <Link to="/cleaning/checkin" className="checkin-btn">打卡完成</Link>
            )}
          </div>

          <div className="section-block">
            <h2>本周排班表</h2>
            <div className="schedule-table">
              {weekSchedule.map((row) => (
                <div
                  key={row.day}
                  className={`schedule-row ${row.today ? 'schedule-row--today' : ''} ${row.done ? 'schedule-row--done' : ''}`}
                >
                  <span className="schedule-day">{row.day}</span>
                  <span className="schedule-area">{row.area}</span>
                  <span className="schedule-person">{row.person}</span>
                  <span className="schedule-status">
                    {row.done ? '✅ 已完成' : row.today ? '⏳ 进行中' : '待完成'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>清洁区域</h2>
            <div className="area-tags">
              {cleaningAreas.map((area) => (
                <span key={area} className="area-tag">{area}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="feature-sidebar">
          <h3>快捷操作</h3>
          <div className="action-list">
            <ActionButton
              icon="📅"
              label="调整排班"
              description="手动修改值日安排"
              to="/cleaning/adjust"
              variant="primary"
            />
            <ActionButton icon="🔄" label="自动轮换" description="按成员顺序自动排班" disabled />
            <ActionButton icon="✅" label="值日打卡" description="完成清洁后确认打卡" to="/cleaning/checkin" />
            <ActionButton icon="📋" label="清洁标准" description="查看各区域清洁要求" disabled />
          </div>
        </aside>
      </div>
    </div>
  )
}
