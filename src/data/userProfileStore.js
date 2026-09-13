import { currentUser as seedUser } from './mockData'

const STORAGE_KEY = 'gebi-user-profile'
const AGREEMENT_STORAGE_KEY = 'gebi-agreement'

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...seedUser,
        ...parsed,
        id: seedUser.id,
      }
    }
  } catch {
    /* ignore */
  }
  return { ...seedUser }
}

function syncRoommateDisplayName(name) {
  try {
    const raw = localStorage.getItem(AGREEMENT_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.signatures)) return
    parsed.signatures = parsed.signatures.map((s) =>
      s.id === seedUser.id ? { ...s, name } : s
    )
    localStorage.setItem(AGREEMENT_STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    /* ignore */
  }
}

export function updateUserProfile({ name, phone, avatar }) {
  const trimmedName = name?.trim()
  if (!trimmedName) {
    return { error: '请填写昵称' }
  }

  const next = {
    name: trimmedName,
    phone: phone?.trim() || '',
    avatar: avatar?.trim() || seedUser.avatar,
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next)
  )
  syncRoommateDisplayName(trimmedName)

  return { user: getCurrentUser() }
}
