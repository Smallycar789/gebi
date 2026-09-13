import {
  weekSchedule as seedWeekSchedule,
  todayDuty as seedTodayDuty,
  cleaningAreas as seedAreas,
  roommates,
} from './mockData'

const STORAGE_KEY = 'gebi-cleaning'

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function defaultAssignments() {
  return {
    小明: ['客厅'],
    小红: ['厨房'],
    小刚: ['卫生间', '阳台'],
    小丽: ['走廊'],
  }
}

function areasToLabel(areas) {
  return areas.length ? areas.join(' + ') : '—'
}

function getTodayDayName() {
  return DAY_NAMES[new Date().getDay()]
}

function buildWeekSchedule(assignments, previousSchedule = []) {
  const names = roommates.map((r) => r.name)
  const prevDone = Object.fromEntries(previousSchedule.map((row) => [row.day, row.done]))
  const todayName = getTodayDayName()

  const workDays = ['周一', '周二', '周三', '周四', '周五']
  const rows = workDays.map((day, index) => {
    const person = names[index % names.length]
    const area = areasToLabel(assignments[person] || [])
    return {
      day,
      area,
      person,
      done: prevDone[day] ?? false,
      today: day === todayName,
    }
  })

  rows.push({
    day: '周六',
    area: '全屋大扫除',
    person: '全员',
    done: prevDone['周六'] ?? false,
    today: todayName === '周六',
  })

  rows.push({
    day: '周日',
    area: '休息',
    person: '—',
    done: prevDone['周日'] ?? false,
    today: todayName === '周日',
  })

  return rows
}

function deriveTodayDuty(weekSchedule) {
  const todayRow = weekSchedule.find((row) => row.today)
  if (!todayRow || todayRow.person === '—') {
    return { person: '—', area: '休息' }
  }
  return { person: todayRow.person, area: todayRow.area }
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.assignments && parsed.weekSchedule) {
        const weekSchedule = refreshTodayFlags(parsed.weekSchedule, parsed.assignments)
        return {
          assignments: parsed.assignments,
          weekSchedule,
          todayDuty: deriveTodayDuty(weekSchedule),
        }
      }
    }
  } catch {
    /* ignore */
  }

  const assignments = defaultAssignments()
  const weekSchedule = buildWeekSchedule(assignments, seedWeekSchedule)
  return {
    assignments,
    weekSchedule,
    todayDuty: deriveTodayDuty(weekSchedule) || seedTodayDuty,
  }
}

function refreshTodayFlags(weekSchedule, assignments) {
  const todayName = getTodayDayName()
  const rebuilt = buildWeekSchedule(
    assignments,
    weekSchedule.map((row) => ({ ...row, today: false }))
  )
  return rebuilt.map((row) => ({ ...row, today: row.day === todayName }))
}

function writeState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      assignments: state.assignments,
      weekSchedule: state.weekSchedule,
    })
  )
}

export function getCleaningAreas() {
  return [...seedAreas]
}

export function getWeekSchedule() {
  return readState().weekSchedule
}

export function getTodayDuty() {
  return readState().todayDuty
}

export function getAssignments() {
  return { ...readState().assignments }
}

export function saveAssignments(assignments) {
  const areas = getCleaningAreas()
  const assigned = new Set()
  for (const name of roommates.map((r) => r.name)) {
    for (const area of assignments[name] || []) {
      assigned.add(area)
    }
  }

  if (assigned.size !== areas.length) {
    return { error: '请将所有清洁区域分配到室友列中' }
  }

  for (const area of areas) {
    if (!assigned.has(area)) {
      return { error: '请将所有清洁区域分配到室友列中' }
    }
  }

  const prev = readState().weekSchedule
  const weekSchedule = buildWeekSchedule(assignments, prev)
  const todayDuty = deriveTodayDuty(weekSchedule)

  writeState({ assignments, weekSchedule })
  return { assignments, weekSchedule, todayDuty }
}

export { roommates }
