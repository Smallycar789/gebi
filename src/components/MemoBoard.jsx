import { useState } from 'react'
import { formatDateTime } from '../utils/date'
import Button from './Button'
import {
  getBoardTitle,
  getMessages,
  saveBoardTitle,
  postMessage,
} from '../data/memoBoardStore'
import './MemoBoard.css'

export default function MemoBoard() {
  const [title, setTitle] = useState(() => getBoardTitle())
  const [messages, setMessages] = useState(() => getMessages())
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(title)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function refresh() {
    setTitle(getBoardTitle())
    setMessages(getMessages())
  }

  function handleSaveTitle() {
    setTitleError('')
    const result = saveBoardTitle(titleDraft)
    if (result.error) {
      setTitleError(result.error)
      return
    }
    setTitle(result.title)
    setEditingTitle(false)
  }

  function handleCancelTitleEdit() {
    setTitleDraft(title)
    setTitleError('')
    setEditingTitle(false)
  }

  function handlePublish() {
    setError('')
    setSubmitting(true)
    const result = postMessage(content)
    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }
    setContent('')
    refresh()
    setSubmitting(false)
  }

  return (
    <aside className="memo-board">
      <div className="memo-board-header">
        {editingTitle ? (
          <div className="memo-title-edit">
            <input
              type="text"
              className="memo-title-input"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              aria-label="留言板名称"
              maxLength={40}
            />
            <div className="memo-title-actions">
              <button type="button" className="memo-title-btn" onClick={handleSaveTitle}>
                保存
              </button>
              <button type="button" className="memo-title-btn memo-title-btn--ghost" onClick={handleCancelTitleEdit}>
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="memo-title-row">
            <h2>{title}</h2>
            <button
              type="button"
              className="memo-title-edit-trigger"
              onClick={() => {
                setTitleDraft(title)
                setEditingTitle(true)
              }}
              title="编辑留言板名称"
            >
              ✏️
            </button>
          </div>
        )}
        <span className="memo-board-count">{messages.length} 条</span>
      </div>

      {titleError && <p className="memo-inline-error" role="alert">{titleError}</p>}

      <div className="memo-list">
        {messages.map((memo) => (
          <div key={memo.id} className="memo-item">
            <div className="memo-item-meta">
              <span className="memo-author">{memo.author}</span>
              <span className="memo-time">{formatDateTime(memo.createdAt)}</span>
            </div>
            <p className="memo-content">{memo.content}</p>
          </div>
        ))}
      </div>

      <div className="memo-compose">
        <textarea
          className="memo-input"
          placeholder="写下你的留言…"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="memo-inline-error" role="alert">{error}</p>}
        <Button
          type="button"
          onClick={handlePublish}
          disabled={submitting || !content.trim()}
        >
          {submitting ? '发布中…' : '发布留言'}
        </Button>
      </div>
    </aside>
  )
}
