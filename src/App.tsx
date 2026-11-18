import { useState } from 'react'
import Flashcards from './components/Flashcards'
import Quiz from './components/Quiz'
import Grammar from './components/Grammar'
import Dashboard from './components/Dashboard'
import Icon from './components/Icon'
import { words } from './data/words'
import { loadStats, streak, useUpdates } from './lib/stats'
import './App.css'

export type View = 'home' | 'cards' | 'quiz' | 'grammar'

const nav: { view: View; label: string; icon: string }[] = [
  { view: 'home', label: 'Dashboard', icon: 'home' },
  { view: 'cards', label: 'Flashcards', icon: 'cards' },
  { view: 'quiz', label: 'Quiz', icon: 'quiz' },
  { view: 'grammar', label: 'Grammar', icon: 'grammar' },
]

export default function App() {
  useUpdates()
  const [view, setView] = useState<View>('home')
  const [lesson, setLesson] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const stats = loadStats()
  const days = streak(stats.days)

  function go(v: View, l?: string) {
    setView(v)
    setLesson(l ?? null)
    setQ('')
    window.scrollTo({ top: 0 })
  }

  const hits = q.trim()
    ? words.filter((w) => (w.no + ' ' + w.en).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6)
    : []

  return (
    <div className="page">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">norsk</div>
          <nav>
            {nav.map((n) => (
              <button key={n.view} className={view === n.view ? 'on' : ''} onClick={() => go(n.view)}>
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </nav>
          <div className="promo">
            <span className="promo-flame"><Icon name="flame" size={28} /></span>
            <b>Keep your<br />streak alive</b>
            <button onClick={() => go('cards')}>Practice now <Icon name="arrow" size={13} /></button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <label className="search">
              <Icon name="search" size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a word…" />
              {hits.length > 0 && (
                <ul className="hits">
                  {hits.map((w) => (
                    <li key={w.id}><b>{w.no}</b><span>{w.en}</span><small>{w.category}</small></li>
                  ))}
                </ul>
              )}
            </label>
            <div className="chips">
              <span className="chip"><i className="chip-ico accent"><Icon name="bolt" size={11} /></i>{stats.xp.toLocaleString('en')} XP</span>
              <span className="chip"><i className="chip-ico ink"><Icon name="flame" size={11} /></i>{days} {days === 1 ? 'day' : 'days'}</span>
              <span className="avatar">N</span>
            </div>
          </div>

          <div className="content">
            {view === 'home' && <Dashboard go={go} />}
            {view !== 'home' && (
              <section className="module">
                <h2>{nav.find((n) => n.view === view)!.label}<span className="light"> — øv hver dag</span></h2>
                {view === 'cards' && <Flashcards />}
                {view === 'quiz' && <Quiz />}
                {view === 'grammar' && <Grammar key={lesson ?? 'list'} initial={lesson} />}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
