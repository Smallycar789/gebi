import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import {
  getTodayDuty,
  getTodayCheckin,
  submitCheckin,
} from '../data/cleaningStore'
import { formatDateTime } from '../utils/date'
import './FeaturePage.css'

const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024

export default function CleaningCheckin() {
  const navigate = useNavigate()
  const todayDuty = getTodayDuty()
  const existingCheckin = getTodayCheckin()

  const [preview, setPreview] = useState(existingCheckin?.photo ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(Boolean(existingCheckin))

  function handleFileChange(e) {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG 等）')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('图片大小请控制在 1.5MB 以内')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(String(reader.result))
      setCompleted(false)
    }
    reader.onerror = () => setError('图片读取失败，请重试')
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    setError('')
    if (!preview) {
      setError('请先上传打卡照片')
      return
    }

    setSubmitting(true)
    const result = submitCheckin(preview)
    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    setCompleted(true)
    navigate('/cleaning', { state: { checkinSuccess: true } })
  }

  const checkin = existingCheckin || (completed ? getTodayCheckin() : null)

  return (
    <div className="feature-page">
      <BackLink to="/cleaning" />
      <PageHeader
        icon="✅"
        title="值日打卡"
        subtitle="上传清洁完成照片并确认打卡，记录今日值日完成情况。"
      />

      <div className="checkin-card">
        <h2>今日值日：{todayDuty.person}</h2>
        <p>负责区域：{todayDuty.area}</p>

        {checkin ? (
          <>
            <p className="checkin-success-text">今日已打卡成功</p>
            {checkin.checkedInAt && (
              <p className="checkin-time">打卡时间：{formatDateTime(checkin.checkedInAt)}</p>
            )}
            <img
              src={checkin.photo}
              alt="打卡照片"
              className="checkin-photo-preview"
            />
            <div className="form-actions checkin-actions">
              <Button as="Link" to="/cleaning">返回清洁排班</Button>
            </div>
          </>
        ) : (
          <>
            <label className="photo-upload">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="photo-upload-input"
                onChange={handleFileChange}
              />
              {preview ? (
                <img src={preview} alt="预览" className="checkin-photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <span>📷 点击上传打卡照片</span>
                  <small>支持 JPG / PNG，最大 1.5MB</small>
                </div>
              )}
            </label>

            {error && <p className="form-error checkin-error" role="alert">{error}</p>}

            <div className="form-actions checkin-actions">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!preview || submitting || todayDuty.person === '—'}
              >
                {submitting ? '提交中…' : '确认打卡'}
              </Button>
              {preview && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setPreview('')
                    setError('')
                  }}
                >
                  重新选择
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
