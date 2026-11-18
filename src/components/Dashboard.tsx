import { words } from '../data/words'
import { lessons } from '../data/grammar'
import { loadStates, isDue } from '../lib/srs'
import { loadStats } from '../lib/stats'
import Icon from './Icon'
import type { View } from '../App'

const DAY = 864e5

function Art({ kind }: { kind: View }) {
  if (kind === 'cards')
    return (
      <svg viewBox="0 0 120 90" className="tile-art">
        <rect x="30" y="18" width="62" height="44" rx="6" transform="rotate(-8 60 40)" />
        <rect x="24" y="30" width="62" height="44" rx="6" fill="currentColor" fillOpacity=".06" />
        <text x="55" y="58" textAnchor="middle" fontSize="15" fill="currentColor" stroke="none">hei</text>
      </svg>
    )
  if (kind === 'quiz')
    return (
      <svg viewBox="0 0 120 90" className="tile-art">
        <circle cx="60" cy="52" r="34" />
        <path d="M26 52h68M60 18c-12 10-12 58 0 68M60 18c12 10 12 58 0 68M32 36h56M32 68h56" />
      </svg>
    )
  return (
    <svg viewBox="0 0 120 90" className="tile-art">
      <path d="M60 28c-10-8-26-8-38-4v52c12-4 28-4 38 4 10-8 26-8 38-4V24c-12-4-28-4-38 4zM60 28v52" />
      <path d="M32 40h18M32 50h14M70 40h18M70 50h12" />
    </svg>
  )
}

const tiles: { view: View; title: string }[] = [
  { view: 'cards', title: 'Everyday\nwords' },
  { view: 'quiz', title: 'Test\nyourself' },
  { view: 'grammar', title: 'Grammar\nbasics' },
]

type Props = { go: (v: View, lesson?: string) => void }

export default function Dashboard({ go }: Props) {
  const states = loadStates()
  const stats = loadStats()
  const now = Date.now()
  const learned = words.filter((w) => (states[w.id]?.reps ?? 0) > 0).length
  const due = words.filter((w) => isDue(states[w.id], now)).length
  const tomorrow = words.filter((w) => {
    const s = states[w.id]
    return s && s.due > now && s.due <= now + DAY
  }).length
  const done = stats.lessons.length
  const pct = Math.round((done / lessons.length) * 100)

  return (
    <>
      <section className="banner">
        <div className="banner-copy">
          <small>Hei og velkommen!</small>
          <h1>
            {learned > 0 ? <>You've learned {learned} of {words.length} words</> : <>Let's learn your first Norwegian words</>}
          </h1>
          <button className="pill accent" onClick={() => go(learned > 0 ? 'quiz' : 'cards')}>
            {learned > 0 ? 'Test yourself' : 'Start now'} <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="tiles">
          {tiles.map((t, i) => (
            <button key={t.view} className={`tile ${i === 1 ? 'hot' : ''}`} onClick={() => go(t.view)}>
              <span className="tile-num">0{i + 1}</span>
              <b>{t.title}</b>
              <Art kind={t.view} />
            </button>
          ))}
        </div>
      </section>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <small className="muted">Module · Grammar</small>
              <h2>Bokmål foundations</h2>
            </div>
            <div className="meter">
              <span className="track"><span style={{ width: `${pct}%` }} /></span>
              <b>{pct}%</b>
            </div>
          </div>
          <ul className="steps">
            {lessons.map((l) => {
              const ok = stats.lessons.includes(l.id)
              return (
                <li key={l.id}>
                  <button onClick={() => go('grammar', l.id)}>
                    <span className={`step-ico ${ok ? 'ok' : ''}`}>
                      <Icon name="grammar" size={16} />
                      {ok && <i><Icon name="check" size={9} /></i>}
                    </span>
                    <b>{l.title}</b>
                    <small>{l.intro.split('. ')[0]}.</small>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="panel side">
          <div className="panel-head">
            <h2>Scheduled</h2>
            <button className="link" onClick={() => go('cards')}>See all</button>
          </div>
          <small className="muted">Today</small>
          <button className="event" onClick={() => go('cards')}>
            <b>Review flashcards</b>
            <small>{due} cards due now</small>
            <span className="badge"><i className="dot accent" />Flashcards</span>
          </button>
          <button className="event" onClick={() => go('quiz')}>
            <b>Daily quiz</b>
            <small>10 questions · ~3 min</small>
            <span className="badge"><i className="dot blue" />Quiz</span>
          </button>
          <small className="muted">Tomorrow</small>
          <div className="event static">
            <b>Upcoming reviews</b>
            <small>{tomorrow} cards come back within 24h</small>
            <span className="badge"><i className="dot ink" />Flashcards</span>
          </div>
        </aside>
      </div>
    </>
  )
}
