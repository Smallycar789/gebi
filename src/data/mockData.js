export const group = {
  id: 'g1',
  name: '阳光公寓302集体',
  inviteCode: 'GEBI-302',
  joinedAt: '2026-01-15',
}

export const currentUser = {
  id: 'u1',
  name: '小明',
  avatar: '😊',
  phone: '138****1234',
}

export const roommates = [
  { id: 'u1', name: '小明', signed: true, signedDate: '2026-01-15', joinedAt: '2026-01-15' },
  { id: 'u2', name: '小红', signed: true, signedDate: '2026-01-15', joinedAt: '2026-01-15' },
  { id: 'u3', name: '小刚', signed: true, signedDate: '2026-01-16', joinedAt: '2026-01-16' },
  { id: 'u4', name: '小丽', signed: true, signedDate: '2026-01-15', joinedAt: '2026-01-15' },
]

export const memos = [
  { id: 'm1', author: '小明', content: '这周末大家一起大扫除，记得把阳台也清理一下～', createdAt: '2026-03-10T09:30:00' },
  { id: 'm2', author: '小红', content: '3月水电费账单已出，记得本周内转账哦', createdAt: '2026-03-09T20:15:00' },
  { id: 'm3', author: '小刚', content: '厨房洗洁精快用完了，谁方便去超市顺便带一瓶？', createdAt: '2026-03-08T18:40:00' },
  { id: 'm4', author: '小丽', content: '下周三有访客，会提前告知大家，打扰啦', createdAt: '2026-03-07T12:00:00' },
]

export const bills = [
  {
    id: '1',
    name: '3月房租',
    type: '房租',
    amount: 4800,
    perPerson: 1200,
    status: 'pending',
    date: '2026-03-01',
    splits: [
      { name: '小明', amount: 1200, paid: false },
      { name: '小红', amount: 1200, paid: true },
      { name: '小刚', amount: 1200, paid: false },
      { name: '小丽', amount: 1200, paid: true },
    ],
  },
  {
    id: '2',
    name: '2月水电费',
    type: '水电',
    amount: 186,
    perPerson: 46.5,
    status: 'settled',
    date: '2026-02-28',
    splits: [
      { name: '小明', amount: 46.5, paid: true },
      { name: '小红', amount: 46.5, paid: true },
      { name: '小刚', amount: 46.5, paid: true },
      { name: '小丽', amount: 46.5, paid: true },
    ],
  },
  {
    id: '3',
    name: '2月网费',
    type: '网费',
    amount: 129,
    perPerson: 32.25,
    status: 'settled',
    date: '2026-02-15',
    splits: [
      { name: '小明', amount: 32.25, paid: true },
      { name: '小红', amount: 32.25, paid: true },
      { name: '小刚', amount: 32.25, paid: true },
      { name: '小丽', amount: 32.25, paid: true },
    ],
  },
]

export const weekSchedule = [
  { day: '周一', area: '客厅 + 厨房', person: '小明', done: true },
  { day: '周二', area: '卫生间', person: '小红', done: true },
  { day: '周三', area: '客厅 + 阳台', person: '小刚', done: false, today: true },
  { day: '周四', area: '厨房 + 冰箱', person: '小丽', done: false },
  { day: '周五', area: '卫生间 + 走廊', person: '小明', done: false },
  { day: '周六', area: '全屋大扫除', person: '全员', done: false },
  { day: '周日', area: '休息', person: '—', done: false },
]

export const cleaningAreas = ['客厅', '厨房', '卫生间', '阳台', '走廊']

export const todayDuty = {
  person: '小刚',
  area: '客厅 + 阳台',
}

export const items = [
  {
    id: '1',
    name: '抽纸',
    quantity: 2,
    unit: '包',
    threshold: 3,
    status: 'low',
    consumptionLogs: [
      { id: 'c1', user: '小红', amount: 1, unit: '包', date: '2026-03-08T10:00:00' },
      { id: 'c2', user: '小明', amount: 1, unit: '包', date: '2026-03-05T19:30:00' },
    ],
  },
  {
    id: '2',
    name: '洗洁精',
    quantity: 1,
    unit: '瓶',
    threshold: 1,
    status: 'low',
    consumptionLogs: [
      { id: 'c3', user: '小刚', amount: 1, unit: '瓶', date: '2026-03-01T12:00:00' },
    ],
  },
  {
    id: '3',
    name: '垃圾袋',
    quantity: 15,
    unit: '个',
    threshold: 10,
    status: 'ok',
    consumptionLogs: [
      { id: 'c4', user: '小丽', amount: 3, unit: '个', date: '2026-03-09T08:00:00' },
    ],
  },
  {
    id: '4',
    name: '洗衣液',
    quantity: 1,
    unit: '瓶',
    threshold: 1,
    status: 'ok',
    consumptionLogs: [],
  },
  {
    id: '5',
    name: '卷纸',
    quantity: 4,
    unit: '卷',
    threshold: 6,
    status: 'ok',
    consumptionLogs: [
      { id: 'c5', user: '小明', amount: 2, unit: '卷', date: '2026-03-07T21:00:00' },
    ],
  },
  {
    id: '6',
    name: '消毒液',
    quantity: 0,
    unit: '瓶',
    threshold: 1,
    status: 'empty',
    consumptionLogs: [
      { id: 'c6', user: '小红', amount: 1, unit: '瓶', date: '2026-02-28T16:00:00' },
    ],
  },
]

export const agreementRules = [
  { id: 1, category: '安静时段', content: '工作日 22:00 - 08:00、周末 23:00 - 09:00 保持安静', votes: 4 },
  { id: 2, category: '访客规定', content: '留宿访客需提前 1 天在群内告知所有室友', votes: 4 },
  { id: 3, category: '公共区域', content: '用完厨房、客厅后及时整理，不遗留个人物品', votes: 4 },
  { id: 4, category: '宠物相关', content: '禁止在合租房内饲养宠物', votes: 3 },
  { id: 5, category: '费用结算', content: '公共费用需在账单发布后 3 日内完成转账', votes: 4 },
  { id: 6, category: '卫生标准', content: '值日未完成的室友需请其他人代班或支付代班费', votes: 4 },
  { id: 7, category: '快递包裹', content: '快递统一放置门口快递架，取件后及时清理外包装', votes: 4 },
  { id: 8, category: '钥匙管理', content: '最后出门者负责锁门，钥匙不得外借非室友人员', votes: 4 },
]

export function getBillById(id) {
  return bills.find((b) => b.id === id)
}

export function getItemById(id) {
  return items.find((i) => i.id === id)
}

export function getExpenseSummary() {
  const pendingCount = bills.filter((b) => b.status === 'pending').length
  const monthTotal = bills.reduce((sum, b) => sum + b.amount, 0)
  const perPerson = monthTotal / roommates.length
  return { pendingCount, monthTotal, perPerson }
}

export function getItemStatusLabel(status) {
  if (status === 'empty') return '已用完'
  if (status === 'low') return '需补货'
  return '充足'
}
