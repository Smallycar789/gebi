import { items as seedItems, roommates } from './mockData'
import { getCurrentUser } from './userProfileStore'

const STORAGE_KEY = 'gebi-items'

export function deriveItemStatus(quantity, threshold) {
  if (quantity <= 0) return 'empty'
  if (quantity < threshold) return 'low'
  return 'ok'
}

export function getItemStatusLabel(status) {
  if (status === 'empty') return '已用完'
  if (status === 'low') return '需补货'
  return '充足'
}

function readItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore corrupt storage */
  }
  return [...seedItems]
}

function writeItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getAllItems() {
  return readItems()
}

export function getItemById(id) {
  return readItems().find((i) => i.id === id)
}

export function addItem({ name, unit, quantity, threshold }) {
  const items = readItems()
  const qty = Number(quantity)
  const thr = Number(threshold)

  const newItem = {
    id: String(Date.now()),
    name: name.trim(),
    unit: unit.trim() || '个',
    quantity: qty,
    threshold: thr,
    status: deriveItemStatus(qty, thr),
    consumptionLogs: [],
  }

  writeItems([newItem, ...items])
  return newItem
}

export function updateItem(itemId, { name, unit, quantity, threshold }) {
  const items = readItems()
  const index = items.findIndex((i) => i.id === String(itemId))
  if (index === -1) return { error: '物品不存在' }

  const trimmedName = name.trim()
  const qty = Number(quantity)
  const thr = Number(threshold)

  if (!trimmedName) return { error: '请填写物品名称' }
  if (!Number.isFinite(qty) || qty < 0) return { error: '请填写有效的余量（0 或正数）' }
  if (!Number.isFinite(thr) || thr < 0) return { error: '请填写有效的预警阈值（0 或正数）' }

  const prev = items[index]
  const updated = {
    ...prev,
    name: trimmedName,
    unit: unit.trim() || '个',
    quantity: qty,
    threshold: thr,
    status: deriveItemStatus(qty, thr),
  }

  items[index] = updated
  writeItems(items)
  return { item: updated }
}

export function recordConsumption(itemId, { amount, user }) {
  const items = readItems()
  const index = items.findIndex((i) => i.id === itemId)
  if (index === -1) return { error: '物品不存在' }

  const useAmount = Number(amount)
  if (!Number.isFinite(useAmount) || useAmount <= 0) {
    return { error: '请填写有效的消耗数量' }
  }

  const item = items[index]
  if (useAmount > item.quantity) {
    return { error: `消耗数量不能超过当前余量（${item.quantity} ${item.unit}）` }
  }

  const nextQty = item.quantity - useAmount
  const log = {
    id: `c${Date.now()}`,
    user: user || getCurrentUser().name,
    amount: useAmount,
    unit: item.unit,
    date: new Date().toISOString(),
  }

  const updated = {
    ...item,
    quantity: nextQty,
    status: deriveItemStatus(nextQty, item.threshold),
    consumptionLogs: [log, ...item.consumptionLogs],
  }

  items[index] = updated
  writeItems(items)
  return { item: updated }
}

export function getItemsSummary() {
  const items = readItems()
  const lowCount = items.filter((i) => i.status === 'low' || i.status === 'empty').length

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  let monthConsumption = 0
  for (const item of items) {
    for (const log of item.consumptionLogs) {
      if (new Date(log.date) >= monthStart) monthConsumption += 1
    }
  }

  return { total: items.length, lowCount, monthConsumption }
}

export { roommates, getCurrentUser }
