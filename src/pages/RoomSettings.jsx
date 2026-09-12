import BackLink from '../components/BackLink'
import PageHeader from '../components/PageHeader'
import { group, roommates } from '../data/mockData'
import './FeaturePage.css'

export default function RoomSettings() {
  return (
    <div className="feature-page">
      <BackLink to="/" />
      <PageHeader
        icon="🏠"
        title="合租房设置"
        subtitle="管理合租集体信息、成员与邀请码。"
        badge="演示数据"
      />

      <div className="feature-main">
        <div className="settings-card">
          <h2>集体信息</h2>
          <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{group.name}</p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            创建于 {group.joinedAt} · 共 {roommates.length} 名成员
          </p>
        </div>

        <div className="settings-card">
          <h2>邀请码</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            分享邀请码，邀请室友加入集体
          </p>
          <div className="invite-code">{group.inviteCode}</div>
        </div>

        <div className="settings-card">
          <h2>成员列表</h2>
          <div className="member-list">
            {roommates.map((member) => (
              <div key={member.id} className="member-row">
                <span>{member.name}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  加入于 {member.joinedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
