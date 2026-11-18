// Minimal SM-2 style spaced repetition, stored in localStorage.
import { emit } from './stats'

export type CardState = { ease: number; interval: number; due: number; reps: number }

const KEY = 'norsk-srs-v1'
const DAY = 24 * 60 * 60 * 1000

export function loadStates(): Record<string, CardState> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveStates(s: Record<string, CardState>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
  emit()
}

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export function review(prev: CardState | undefined, grade: Grade, now = Date.now()): CardState {
  const s = prev ?? { ease: 2.5, interval: 0, due: now, reps: 0 }
  if (grade === 'again') {
    return { ease: Math.max(1.3, s.ease - 0.2), interval: 0, due: now + 60 * 1000, reps: 0 }
  }
  const ease = Math.max(1.3, s.ease + (grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0))
  let interval: number
  if (s.reps === 0) interval = grade === 'easy' ? 3 : 1
  else if (s.reps === 1) interval = grade === 'hard' ? 2 : 4
  else interval = Math.round(s.interval * (grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease))
  return { ease, interval, due: now + interval * DAY, reps: s.reps + 1 }
}

export function isDue(s: CardState | undefined, now = Date.now()) {
  return !s || s.due <= now
}
