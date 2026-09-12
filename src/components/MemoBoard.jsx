import { memos } from '../data/mockData'
import { formatDateTime } from '../utils/date'
import Button from './Button'
import './MemoBoard.css'

export default function MemoBoard() {
  return (
    <aside className="memo-board">
      <div className="memo-board-header">
        <h2>合组备忘录</h2>
        <span className="memo-board-count">{memos.length} 条</span>
      </div>

      <div className="memo-list">
        {memos.map((memo) => (
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
          placeholder="写一条备忘录…"
          rows={3}
          disabled
        />
        <Button disabled title="即将上线">
          发布
        </Button>
      </div>
    </aside>
  )
}
