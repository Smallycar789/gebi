import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ActionButton from '../components/ActionButton'
import { weekSchedule, cleaningAreas, todayDuty } from '../data/mockData'
import './FeaturePage.css'

export default function Cleaning() {
  return (
    <div className="feature-page">
      <PageHeader
        icon="🧹"
        title="清洁值日排班"
        subtitle="公共区域清洁任务按周自动轮换，今日值日一目了然，完成后可打卡确认。"
        badge="演示数据"
      />

      <div className="feature-layout">
        <section className="feature-main">
          <div className="today-duty">
            <div className="today-duty-badge">今日值日</div>
            <div className="today-duty-content">
              <strong>{todayDuty.person}</strong>
              <span>负责：{todayDuty.area}</span>
            </div>
            <Link to="/cleaning/checkin" className="checkin-btn">打卡完成</Link>
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
            <ActionButton icon="📅" label="调整排班" description="手动修改值日安排" disabled />
            <ActionButton icon="🔄" label="自动轮换" description="按成员顺序自动排班" disabled />
            <ActionButton icon="✅" label="值日打卡" description="完成清洁后确认打卡" to="/cleaning/checkin" variant="primary" />
            <ActionButton icon="📋" label="清洁标准" description="查看各区域清洁要求" disabled />
          </div>
        </aside>
      </div>
    </div>
  )
}
