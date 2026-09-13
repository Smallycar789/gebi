import { bills as seedBills, roommates } from './mockData'

const STORAGE_KEY = 'gebi-bills'

function readBills() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore corrupt storage */
  }
  return [...seedBills]
}

function writeBills(bills) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
}

export function getAllBills() {
  return readBills()
}

export function getBillById(id) {
  return readBills().find((b) => b.id === id)
}

export function addBill({ name, type, amount, date }) {
  const bills = readBills()
  const total = Number(amount)
  const perPerson = Math.round((total / roommates.length) * 100) / 100

  const newBill = {
    id: String(Date.now()),
    name: name.trim(),
    type,
    amount: total,
    perPerson,
    status: 'pending',
    date,
    splits: roommates.map((rm) => ({
      name: rm.name,
      amount: perPerson,
      paid: false,
    })),
  }

  writeBills([newBill, ...bills])
  return newBill
}

export function getExpenseSummary() {
  const bills = readBills()
  const pendingCount = bills.filter((b) => b.status === 'pending').length
  const monthTotal = bills.reduce((sum, b) => sum + b.amount, 0)
  const perPerson = roommates.length ? monthTotal / roommates.length : 0
  return { pendingCount, monthTotal, perPerson }
}

function deriveBillStatus(splits) {
  return splits.every((s) => s.paid) ? 'settled' : 'pending'
}

export function setSplitPaid(billId, memberName, paid) {
  const bills = readBills()
  const index = bills.findIndex((b) => b.id === billId)
  if (index === -1) return null

  const splits = bills[index].splits.map((s) =>
    s.name === memberName ? { ...s, paid } : s
  )

  const updated = {
    ...bills[index],
    splits,
    status: deriveBillStatus(splits),
  }

  bills[index] = updated
  writeBills(bills)
  return updated
}
