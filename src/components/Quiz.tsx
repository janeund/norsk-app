import { useState } from 'react'
import { words, type Word } from '../data/words'
import { addXp } from '../lib/stats'

type Mode = 'choice' | 'type'
type Question = { word: Word; options: Word[]; toNo: boolean }

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
const norm = (s: string) =>
  s.toLowerCase().trim().replace(/^(å|en|ei|et|ei\/en)\s+/, '').replace(/[.!?]/g, '')

function makeQuestion(): Question {
  const word = words[Math.floor(Math.random() * words.length)]
  const others = shuffle(words.filter((w) => w.id !== word.id && w.category === word.category)).slice(0, 3)
  return { word, options: shuffle([word, ...others]), toNo: Math.random() < 0.5 }
}

const LEN = 10

export default function Quiz() {
  const [mode, setMode] = useState<Mode>('choice')
  const [q, setQ] = useState(makeQuestion)
  const [picked, setPicked] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [n, setN] = useState(1)
  const [score, setScore] = useState(0)
  const done = n > LEN

  const prompt = q.toNo ? q.word.en : q.word.no
  const answer = q.toNo ? q.word.no : q.word.en
  const typedOk = answer.split('/').some((a) => norm(a) === norm(typed)) || norm(answer) === norm(typed)

  function pick(w: Word) {
    if (picked) return
    setPicked(w.id)
    if (w.id === q.word.id) {
      setScore(score + 1)
      addXp(10)
    }
  }

  function check(e: React.FormEvent) {
    e.preventDefault()
    if (checked) return next()
    setChecked(true)
    if (typedOk) {
      setScore(score + 1)
      addXp(15)
    }
  }

  function next() {
    setQ(makeQuestion())
    setPicked(null)
    setTyped('')
    setChecked(false)
    setN(n + 1)
  }

  function restart() {
    setN(1)
    setScore(0)
    setQ(makeQuestion())
    setPicked(null)
    setTyped('')
    setChecked(false)
  }

  if (done) {
    return (
      <section className="empty">
        <h3>Score: {score} / {LEN}</h3>
        <p>{score >= 8 ? 'Kjempebra! 🇳🇴' : score >= 5 ? 'Bra jobba!' : 'Øvelse gjør mester — keep practicing.'}</p>
        <button className="primary" onClick={restart}>Try again</button>
      </section>
    )
  }

  return (
    <section>
      <div className="toolbar">
        <div className="seg">
          <button className={mode === 'choice' ? 'on' : ''} onClick={() => setMode('choice')}>Multiple choice</button>
          <button className={mode === 'type' ? 'on' : ''} onClick={() => setMode('type')}>Type answer</button>
        </div>
        <span className="muted">Question {n}/{LEN} · Score {score}</span>
      </div>

      <div className="prompt">
        <span className="muted">Translate {q.toNo ? 'to Norwegian' : 'to English'}</span>
        <h2>{prompt}</h2>
      </div>

      {mode === 'choice' ? (
        <>
          <div className="options">
            {q.options.map((o) => {
              const cls = picked ? (o.id === q.word.id ? 'right' : o.id === picked ? 'wrong' : '') : ''
              return (
                <button key={o.id} className={`opt ${cls}`} onClick={() => pick(o)}>
                  {q.toNo ? o.no : o.en}
                </button>
              )
            })}
          </div>
          {picked && <button className="primary" onClick={next}>Next →</button>}
        </>
      ) : (
        <form onSubmit={check} className="typeform">
          <input
            autoFocus
            value={typed}
            disabled={checked}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Your answer…"
          />
          {checked && (
            <p className={typedOk ? 'ok' : 'bad'}>
              {typedOk ? 'Riktig! ✓' : <>Correct answer: <b>{answer}</b></>}
            </p>
          )}
          <button className="primary" type="submit">{checked ? 'Next →' : 'Check'}</button>
          {!checked && (
            <div className="keys">
              {['æ', 'ø', 'å'].map((k) => (
                <button type="button" key={k} onClick={() => setTyped(typed + k)}>{k}</button>
              ))}
            </div>
          )}
        </form>
      )}
    </section>
  )
}
