import { useState } from 'react'
import { lessons, type Lesson } from '../data/grammar'
import { addXp, markLesson } from '../lib/stats'

type CheckProps = Lesson['checks'][number] & { onAnswer: () => void }

function Check({ q, options, answer, onAnswer }: CheckProps) {
  const [picked, setPicked] = useState<number | null>(null)
  function pick(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === answer) addXp(5)
    onAnswer()
  }
  return (
    <div className="gcheck">
      <p>{q}</p>
      <div className="options small">
        {options.map((o, i) => {
          const cls = picked === null ? '' : i === answer ? 'right' : i === picked ? 'wrong' : ''
          return <button key={o} className={`opt ${cls}`} onClick={() => pick(i)}>{o}</button>
        })}
      </div>
    </div>
  )
}

export default function Grammar({ initial = null }: { initial?: string | null }) {
  const [openId, setOpenId] = useState<string | null>(initial)
  const [answered, setAnswered] = useState(0)
  const lesson = lessons.find((l) => l.id === openId)

  function open(id: string | null) {
    setOpenId(id)
    setAnswered(0)
  }

  function onAnswer() {
    if (!lesson) return
    const n = answered + 1
    setAnswered(n)
    if (n >= lesson.checks.length) markLesson(lesson.id)
  }

  if (!lesson) {
    return (
      <section className="lessons">
        {lessons.map((l, i) => (
          <button key={l.id} className="lesson" onClick={() => open(l.id)}>
            <span className="num">{i + 1}</span>
            <span>
              <b>{l.title}</b>
              <small>{l.intro.slice(0, 80)}…</small>
            </span>
          </button>
        ))}
      </section>
    )
  }

  return (
    <section className="lessonview">
      <button className="link" onClick={() => open(null)}>← All lessons</button>
      <h2>{lesson.title}</h2>
      <p>{lesson.intro}</p>
      {lesson.table && (
        <table>
          <thead><tr>{lesson.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {lesson.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
          </tbody>
        </table>
      )}
      <h3>Examples</h3>
      <ul className="examples">
        {lesson.examples.map(([no, en]) => <li key={no}><b>{no}</b><span>{en}</span></li>)}
      </ul>
      <h3>Check yourself</h3>
      {lesson.checks.map((c) => <Check key={lesson.id + c.q} {...c} onAnswer={onAnswer} />)}
    </section>
  )
}
