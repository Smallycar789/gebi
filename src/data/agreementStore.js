import { agreementRules as seedRules, roommates as seedRoommates } from './mockData'
import { getCurrentUser } from './userProfileStore'

const STORAGE_KEY = 'gebi-agreement'

function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const MAJORITY = Math.ceil(seedRoommates.length / 2)

function normalizeRule(rule) {
  const voters = rule.voters || []
  const votes = voters.length > 0 ? voters.length : (rule.votes ?? 0)
  const status =
    rule.status ||
    (votes >= MAJORITY || votes >= seedRoommates.length ? 'active' : 'pending')
  return {
    id: String(rule.id),
    category: rule.category,
    content: rule.content,
    votes,
    voters,
    status,
  }
}

function defaultSignatures() {
  return seedRoommates.map((rm) => ({
    id: rm.id,
    name: rm.name,
    signed: rm.signed,
    signedDate: rm.signedDate || null,
  }))
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.rules && parsed.signatures) {
        return {
          rules: parsed.rules.map(normalizeRule),
          signatures: parsed.signatures,
          lastUpdated: parsed.lastUpdated || todayStr(),
        }
      }
    }
  } catch {
    /* ignore */
  }

  return {
    rules: seedRules.map((r) =>
      normalizeRule({
        ...r,
        voters: [],
        status: 'active',
      })
    ),
    signatures: defaultSignatures(),
    lastUpdated: '2026-02-01',
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function withUnsignedSignatures(state) {
  return {
    ...state,
    signatures: state.signatures.map((s) => ({
      ...s,
      signed: false,
      signedDate: null,
    })),
    lastUpdated: todayStr(),
  }
}

function syncRuleVotes(rule) {
  const votes = rule.voters.length
  const status = votes >= MAJORITY ? 'active' : 'pending'
  return { ...rule, votes, status }
}

export function getRules() {
  return readState().rules
}

export function getRuleById(id) {
  return getRules().find((r) => r.id === String(id))
}

export function getSignatures() {
  return readState().signatures
}

export function getAgreementSummary() {
  const state = readState()
  return {
    ruleCount: state.rules.length,
    signedCount: state.signatures.filter((s) => s.signed).length,
    totalMembers: state.signatures.length,
    lastUpdated: state.lastUpdated,
  }
}

export function addRule({ category, content }) {
  if (!category.trim() || !content.trim()) {
    return { error: '请填写分类和条款内容' }
  }

  let state = readState()
  const newRule = syncRuleVotes({
    id: String(Date.now()),
    category: category.trim(),
    content: content.trim(),
    votes: 0,
    voters: [],
    status: 'pending',
  })

  state = withUnsignedSignatures(state)
  state.rules = [newRule, ...state.rules]
  writeState(state)
  return { rule: newRule }
}

export function updateRule(id, { category, content }) {
  if (!category.trim() || !content.trim()) {
    return { error: '请填写分类和条款内容' }
  }

  let state = readState()
  const index = state.rules.findIndex((r) => r.id === String(id))
  if (index === -1) return { error: '条款不存在' }

  state = withUnsignedSignatures(state)
  state.rules[index] = {
    ...state.rules[index],
    category: category.trim(),
    content: content.trim(),
  }
  writeState(state)
  return { rule: state.rules[index] }
}

export function voteAgree(ruleId, userId = getCurrentUser().id) {
  const state = readState()
  const index = state.rules.findIndex((r) => r.id === String(ruleId))
  if (index === -1) return { error: '条款不存在' }

  const voter = seedRoommates.find((r) => r.id === userId)
  if (!voter) return { error: '无效的投票人' }

  const rule = state.rules[index]
  if (rule.voters.includes(userId)) {
    return { error: `${voter.name} 已经对该条款投过票了` }
  }

  const updated = syncRuleVotes({
    ...rule,
    voters: [...rule.voters, userId],
  })

  state.rules[index] = updated
  writeState(state)
  return { rule: updated }
}

export function signAgreement(signerId = getCurrentUser().id) {
  const state = readState()
  const me = state.signatures.find((s) => s.id === signerId)
  if (!me) return { error: '签署人不在合租组中' }
  if (me.signed) return { error: `${me.name} 已经签署过公约` }

  const pendingRules = state.rules.filter((r) => r.status === 'pending')
  if (pendingRules.length > 0) {
    return { error: '仍有待表决条款，请先完成投票表决' }
  }

  state.signatures = state.signatures.map((s) =>
    s.id === signerId
      ? { ...s, signed: true, signedDate: todayStr() }
      : s
  )
  writeState(state)
  return { success: true }
}

export { getCurrentUser, seedRoommates as roommates }
