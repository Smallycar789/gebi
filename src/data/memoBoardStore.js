import { memos as seedMemos, currentUser } from './mockData'

const STORAGE_KEY = 'gebi-memo-board'
export const DEFAULT_BOARD_TITLE = 'AAAA景区留言板'

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.messages)) {
        return {
          title: parsed.title?.trim() || DEFAULT_BOARD_TITLE,
          messages: parsed.messages,
        }
      }
    }
  } catch {
    /* ignore */
  }

  return {
    title: DEFAULT_BOARD_TITLE,
    messages: [...seedMemos],
  }
}

function writeState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      title: state.title.trim() || DEFAULT_BOARD_TITLE,
      messages: state.messages,
    })
  )
}

export function getBoardTitle() {
  return readState().title
}

export function getMessages() {
  return readState().messages
}

export function saveBoardTitle(title) {
  const trimmed = title.trim()
  if (!trimmed) {
    return { error: '留言板名称不能为空' }
  }

  const state = readState()
  state.title = trimmed
  writeState(state)
  return { title: state.title }
}

export function postMessage(content) {
  const text = content.trim()
  if (!text) {
    return { error: '请输入留言内容' }
  }

  const state = readState()
  const message = {
    id: `m${Date.now()}`,
    author: currentUser.name,
    content: text,
    createdAt: new Date().toISOString(),
  }

  state.messages = [message, ...state.messages]
  writeState(state)
  return { message }
}
