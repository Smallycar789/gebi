import { useRef, useState } from 'react'
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
import { compressImageFile } from '../utils/compressImage'
import './FeaturePage.css'

const MAX_PHOTO_BYTES = 8 * 1024 * 1024

export default function CleaningCheckin() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const todayDuty = getTodayDuty()
  const existingCheckin = getTodayCheckin()

  const [preview, setPreview] = useState(existingCheckin?.photo ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingPhoto, setLoadingPhoto] = useState(false)

  const alreadyCheckedIn = Boolean(existingCheckin)

  async function handleFileChange(e) {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG 等）')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('图片大小请控制在 8MB 以内')
      return
    }

    setLoadingPhoto(true)
    try {
      const dataUrl = await compressImageFile(file)
      setPreview(dataUrl)
    } catch {
      try {
        const fallback = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('read failed'))
          reader.readAsDataURL(file)
        })
        setPreview(fallback)
      } catch {
        setError('图片读取失败，请重试')
      }
    } finally {
      setLoadingPhoto(false)
      e.target.value = ''
    }
  }

  function handleSubmit() {
    setError('')
    if (!preview) {
      setError('请先上传打卡照片')
      return
    }

    setSubmitting(true)
    const result = submitCheckin(preview)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/cleaning', { state: { checkinSuccess: true } })
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  if (alreadyCheckedIn) {
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
          <p className="checkin-success-text">今日已打卡成功</p>
          {existingCheckin.checkedInAt && (
            <p className="checkin-time">打卡时间：{formatDateTime(existingCheckin.checkedInAt)}</p>
          )}
          <img
            src={existingCheckin.photo}
            alt="打卡照片"
            className="checkin-photo-preview"
          />
          <div className="form-actions checkin-actions">
            <Button as="Link" to="/cleaning">返回清洁排班</Button>
          </div>
        </div>
      </div>
    )
  }

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
        {todayDuty.person === '—' && (
          <p className="checkin-rest-hint">今日为休息日，仍可上传照片完成自愿打卡记录。</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="photo-upload-input"
          onChange={handleFileChange}
        />

        <div className="checkin-photo-area">
          {preview ? (
            <img src={preview} alt="预览" className="checkin-photo-preview" />
          ) : (
            <div className="photo-placeholder">
              <span>📷 尚未选择照片</span>
              <small>支持 JPG / PNG，将自动压缩后保存</small>
            </div>
          )}
        </div>

        <div className="checkin-photo-toolbar">
          <Button type="button" variant="ghost" onClick={openFilePicker} disabled={loadingPhoto}>
            {loadingPhoto ? '处理中…' : preview ? '更换照片' : '选择照片'}
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
              清除
            </Button>
          )}
        </div>

        {error && <p className="form-error checkin-error" role="alert">{error}</p>}

        <div className="form-actions checkin-actions">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!preview || submitting || loadingPhoto}
          >
            {submitting ? '提交中…' : '确认打卡'}
          </Button>
        </div>
      </div>
    </div>
  )
}
