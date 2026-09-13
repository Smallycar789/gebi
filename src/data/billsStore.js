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

function deriveBillStatus(splits) {
  return splits.every((s) => s.paid) ? 'settled' : 'pending'
}

function paidMapFromSplits(splits) {
  return Object.fromEntries(splits.map((s) => [s.name, s.paid]))
}

function buildEqualSplits(total, existingSplits = []) {
  const paidMap = paidMapFromSplits(existingSplits)
  const n = roommates.length
  const base = Math.floor((total / n) * 100) / 100
  return roommates.map((rm, index) => {
    let amount = base
    if (index === n - 1) {
      const allocated = base * (n - 1)
      amount = Math.round((total - allocated) * 100) / 100
    }
    return {
      name: rm.name,
      amount,
      paid: paidMap[rm.name] ?? false,
    }
  })
}

function buildAmountSplits(total, amountByName, existingSplits = []) {
  const paidMap = paidMapFromSplits(existingSplits)
  return roommates.map((rm) => ({
    name: rm.name,
    amount: Math.round(Number(amountByName[rm.name] ?? 0) * 100) / 100,
    paid: paidMap[rm.name] ?? false,
  }))
}

function buildRatioSplits(total, ratioByName, existingSplits = []) {
  const paidMap = paidMapFromSplits(existingSplits)
  const weights = roommates.map((rm) => Math.max(0, Number(ratioByName[rm.name] ?? 0)))
  const weightSum = weights.reduce((a, b) => a + b, 0)
  if (weightSum <= 0) return null

  let allocated = 0
  const splits = roommates.map((rm, index) => {
    if (index === roommates.length - 1) {
      return {
        name: rm.name,
        amount: Math.round((total - allocated) * 100) / 100,
        paid: paidMap[rm.name] ?? false,
      }
    }
    const w = Math.max(0, Number(ratioByName[rm.name] ?? 0))
    const amount = Math.round(((total * w) / weightSum) * 100) / 100
    allocated += amount
    return {
      name: rm.name,
      amount,
      paid: paidMap[rm.name] ?? false,
    }
  })
  return splits
}

function averagePerPerson(splits) {
  if (!splits.length) return 0
  const sum = splits.reduce((acc, s) => acc + s.amount, 0)
  return Math.round((sum / splits.length) * 100) / 100
}

function normalizeBill(bill) {
  return {
    splitMode: bill.splitMode || 'equal',
    ...bill,
  }
}

export function getAllBills() {
  return readBills().map(normalizeBill)
}

export function getBillById(id) {
  const bill = readBills().find((b) => b.id === id)
  return bill ? normalizeBill(bill) : undefined
}

export function addBill({ name, type, amount, date, split }) {
  const bills = readBills()
  const total = Number(amount)
  const splits = buildEqualSplits(total)
  const perPerson = averagePerPerson(splits)

  const newBill = {
    id: String(Date.now()),
    name: name.trim(),
    type,
    amount: total,
    perPerson,
    status: 'pending',
    date,
    splitMode: 'equal',
    splits,
  }

  writeBills([newBill, ...bills])

  if (split?.mode && split.mode !== 'equal') {
    const applied = applyCustomSplit(newBill.id, {
      mode: split.mode,
      values: split.values || {},
    })
    if (applied.error) return applied
    return applied.bill
  }

  return newBill
}

export function updateBillDetails(billId, { name, split }) {
  const bills = readBills()
  const index = bills.findIndex((b) => b.id === String(billId))
  if (index === -1) return { error: '账单不存在' }

  if (name !== undefined) {
    const trimmed = name.trim()
    if (!trimmed) return { error: '请填写账单名称' }
    bills[index] = { ...bills[index], name: trimmed }
    writeBills(bills)
  }

  if (split) {
    return applyCustomSplit(billId, {
      mode: split.mode,
      values: split.mode === 'equal' ? {} : split.values || {},
    })
  }

  return { bill: getBillById(billId) }
}

export function applyCustomSplit(billId, { mode, values }) {
  const bills = readBills()
  const index = bills.findIndex((b) => b.id === String(billId))
  if (index === -1) return { error: '账单不存在' }

  const bill = normalizeBill(bills[index])
  let splits

  if (mode === 'equal') {
    splits = buildEqualSplits(bill.amount, bill.splits)
  } else if (mode === 'amount') {
    splits = buildAmountSplits(bill.amount, values, bill.splits)
    const sum = splits.reduce((acc, s) => acc + s.amount, 0)
    if (Math.abs(sum - bill.amount) > 0.02) {
      return { error: `分摊金额合计 ¥${sum.toFixed(2)}，需等于账单总额 ¥${bill.amount}` }
    }
  } else if (mode === 'ratio') {
    splits = buildRatioSplits(bill.amount, values, bill.splits)
    if (!splits) return { error: '请填写有效的分摊比例' }
  } else {
    return { error: '无效的分摊方式' }
  }

  const updated = {
    ...bill,
    splitMode: mode,
    splits,
    perPerson: averagePerPerson(splits),
    status: deriveBillStatus(splits),
  }

  bills[index] = updated
  writeBills(bills)
  return { bill: updated }
}

export function getSplitModeLabel(mode) {
  if (mode === 'amount') return '自定义金额'
  if (mode === 'ratio') return '按比例'
  return '均分 AA'
}

export function getExpenseSummary() {
  const bills = readBills()
  const pendingCount = bills.filter((b) => b.status === 'pending').length
  const monthTotal = bills.reduce((sum, b) => sum + b.amount, 0)
  const perPerson = roommates.length ? monthTotal / roommates.length : 0
  return { pendingCount, monthTotal, perPerson }
}

export function setSplitPaid(billId, memberName, paid) {
  const bills = readBills()
  const index = bills.findIndex((b) => b.id === billId)
  if (index === -1) return null

  const splits = bills[index].splits.map((s) =>
    s.name === memberName ? { ...s, paid } : s
  )

  const updated = normalizeBill({
    ...bills[index],
    splits,
    status: deriveBillStatus(splits),
  })

  bills[index] = updated
  writeBills(bills)
  return updated
}

export { roommates }
