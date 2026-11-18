import { useEffect, useState } from 'react'

type Stats = { xp: number; days: string[]; lessons: string[] }
const KEY = 'norsk-stats-v1'
const EVT = 'norsk-update'

export function loadStats(): Stats {
  try {
    return { xp: 0, days: [], lessons: [], ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { xp: 0, days: [], lessons: [] }
  }
}

function save(s: Stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
  emit()
}

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10)

export function addXp(n: number) {
  const s = loadStats()
  const today = dayKey()
  save({ ...s, xp: s.xp + n, days: s.days.includes(today) ? s.days : [...s.days, today] })
}

export function markLesson(id: string) {
  const s = loadStats()
  if (!s.lessons.includes(id)) save({ ...s, lessons: [...s.lessons, id] })
}

export function streak(days: string[]) {
  const set = new Set(days)
  const d = new Date()
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(dayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export const emit = () => window.dispatchEvent(new Event(EVT))

/** Re-render the caller whenever stats or SRS progress change. */
export function useUpdates() {
  const [, set] = useState(0)
  useEffect(() => {
    const f = () => set((n) => n + 1)
    window.addEventListener(EVT, f)
    return () => window.removeEventListener(EVT, f)
  }, [])
}
