export function getDaysSince(dateStr) {
  const start = new Date(dateStr)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = today - start
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function formatDateTime(dateStr) {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}
