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

function prevRowMeta(previousSchedule) {
  return Object.fromEntries(
    previousSchedule.map((row) => [
      row.day,
      {
        done: row.done,
        checkinPhoto: row.checkinPhoto,
        checkedInAt: row.checkedInAt,
      },
    ])
  )
}

function buildWeekSchedule(assignments, previousSchedule = []) {
  const names = roommates.map((r) => r.name)
  const prev = prevRowMeta(previousSchedule)
  const todayName = getTodayDayName()

  const workDays = ['周一', '周二', '周三', '周四', '周五']
  const rows = workDays.map((day, index) => {
    const person = names[index % names.length]
    const area = areasToLabel(assignments[person] || [])
    const meta = prev[day] || {}
    return {
      day,
      area,
      person,
      done: meta.done ?? false,
      checkinPhoto: meta.checkinPhoto,
      checkedInAt: meta.checkedInAt,
      today: day === todayName,
    }
  })

  rows.push({
    day: '周六',
    area: '全屋大扫除',
    person: '全员',
    done: prev['周六']?.done ?? false,
    checkinPhoto: prev['周六']?.checkinPhoto,
    checkedInAt: prev['周六']?.checkedInAt,
    today: todayName === '周六',
  })

  rows.push({
    day: '周日',
    area: '休息',
    person: '—',
    done: prev['周日']?.done ?? false,
    checkinPhoto: prev['周日']?.checkinPhoto,
    checkedInAt: prev['周日']?.checkedInAt,
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
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        assignments: state.assignments,
        weekSchedule: state.weekSchedule,
      })
    )
  } catch {
    throw new Error('STORAGE_QUOTA')
  }
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

export function getTodayScheduleRow() {
  const todayName = getTodayDayName()
  return readState().weekSchedule.find((row) => row.day === todayName) ?? null
}

export function isTodayCheckedIn() {
  const row = getTodayScheduleRow()
  return Boolean(row?.done && row?.checkinPhoto)
}

export function getTodayCheckin() {
  const row = getTodayScheduleRow()
  if (!row?.done || !row.checkinPhoto) return null
  return {
    person: row.person,
    area: row.area,
    photo: row.checkinPhoto,
    checkedInAt: row.checkedInAt,
  }
}

export function submitCheckin(photoDataUrl) {
  if (!photoDataUrl) {
    return { error: '请上传打卡照片' }
  }

  const state = readState()
  const todayName = getTodayDayName()
  const row = state.weekSchedule.find((r) => r.day === todayName)

  if (!row) {
    return { error: '无法获取今日排班' }
  }
  const weekSchedule = state.weekSchedule.map((r) =>
    r.day === todayName
      ? {
          ...r,
          done: true,
          checkinPhoto: photoDataUrl,
          checkedInAt: new Date().toISOString(),
        }
      : r
  )

  try {
    writeState({
      assignments: state.assignments,
      weekSchedule,
    })
  } catch (err) {
    if (err.message === 'STORAGE_QUOTA') {
      return { error: '照片过大，保存失败，请换一张较小的图片后重试' }
    }
    return { error: '保存失败，请稍后重试' }
  }

  return {
    success: true,
    checkin: getTodayCheckin(),
  }
}

export { roommates }
