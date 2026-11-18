import { useMemo, useState } from 'react'
import { words, categories } from '../data/words'
import { loadStates, saveStates, review, isDue, type Grade } from '../lib/srs'
import { addXp } from '../lib/stats'

export default function Flashcards() {
  const [states, setStates] = useState(loadStates)
  const [category, setCategory] = useState('All')
  const [flipped, setFlipped] = useState(false)
  const [reverse, setReverse] = useState(false)

  const pool = useMemo(
    () => words.filter((w) => category === 'All' || w.category === category),
    [category],
  )
  const due = pool.filter((w) => isDue(states[w.id]))
  const card = due[0]
  const learned = pool.filter((w) => (states[w.id]?.reps ?? 0) > 0).length

  function grade(g: Grade) {
    if (!card) return
    const next = { ...states, [card.id]: review(states[card.id], g) }
    setStates(next)
    saveStates(next)
    setFlipped(false)
    if (g !== 'again') addXp(g === 'hard' ? 3 : 5)
  }

  function reset() {
    if (!confirm('Reset all flashcard progress?')) return
    setStates({})
    saveStates({})
  }

  const front = card && (reverse ? card.en : card.no)
  const back = card && (reverse ? card.no : card.en)

  return (
    <section>
      <div className="toolbar">
        <select value={category} onChange={(e) => { setCategory(e.target.value); setFlipped(false) }}>
          <option>All</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="check">
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
          English → Norsk
        </label>
        <span className="muted">Due: {due.length} · Learned: {learned}/{pool.length}</span>
      </div>

      {card ? (
        <>
          <button className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <span className="tag">{card.category}</span>
            <span className="front">{front}</span>
            {flipped ? <span className="back">{back}</span> : <span className="hint">tap to reveal</span>}
          </button>
          {flipped && (
            <div className="grades">
              <button className="g again" onClick={() => grade('again')}>Again</button>
              <button className="g hard" onClick={() => grade('hard')}>Hard</button>
              <button className="g good" onClick={() => grade('good')}>Good</button>
              <button className="g easy" onClick={() => grade('easy')}>Easy</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty">
          <h3>Ferdig! 🎉</h3>
          <p>No cards due right now. Come back later or pick another category.</p>
        </div>
      )}

      <button className="link" onClick={reset}>Reset progress</button>
    </section>
  )
}
