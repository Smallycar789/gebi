import { useState } from 'react'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { group } from '../data/mockData'
import { getCurrentUser, updateUserProfile } from '../data/userProfileStore'
import { getDaysSince } from '../utils/date'
import './FeaturePage.css'

export default function Profile() {
  const [user, setUser] = useState(() => getCurrentUser())
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [avatar, setAvatar] = useState(user.avatar)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const daysJoined = getDaysSince(group.joinedAt)

  function startEdit() {
    setName(user.name)
    setPhone(user.phone)
    setAvatar(user.avatar)
    setError('')
    setSaved(false)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError('')
  }

  function handleSave(e) {
    e.preventDefault()
    const result = updateUserProfile({ name, phone, avatar })
    if (result.error) {
      setError(result.error)
      return
    }
    setUser(result.user)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="feature-page">
      <PageHeader
        icon="👤"
        title="个人中心"
        subtitle="查看与编辑个人信息，或进入各模块快捷入口。"
        action={
          !editing ? (
            <button type="button" className="page-header-edit-btn" onClick={startEdit}>
              编辑
            </button>
          ) : null
        }
      />

      {saved && !editing && (
        <p className="toast-success" role="status">
          个人信息已保存
        </p>
      )}

      {editing ? (
        <form className="profile-edit-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="profile-avatar">头像（emoji）</label>
            <input
              id="profile-avatar"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              maxLength={8}
              placeholder="例如 😊"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-name">昵称</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={20}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-phone">手机号</label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="138****1234"
              maxLength={20}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <Button type="submit" variant="primary">
              保存
            </Button>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              取消
            </Button>
          </div>
        </form>
      ) : (
        <div className="profile-header">
          <span className="profile-avatar">{user.avatar}</span>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.phone || '未填写手机号'}</p>
            <p>
              所属集体：{group.name} · 已加入 {daysJoined} 天
            </p>
          </div>
        </div>
      )}

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
