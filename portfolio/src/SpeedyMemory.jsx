import { useState, useEffect, useRef } from 'react'

import butterflyImg from './assets/butterfly.png'
import dogImg from './assets/dog.png'
import dolphinImg from './assets/dolphin.png'
import duckImg from './assets/duck.png'
import elephantImg from './assets/elephant.png'
import flamingoImg from './assets/flamingo.png'
import gooseImg from './assets/goose.png'
import koalaImg from './assets/koala.png'
import leopardImg from './assets/leopard.png'
import lionImg from './assets/lion.png'
import parrotImg from './assets/parrot.png'
import tigerImg from './assets/tiger.png'

const ANIMALS = [
  { id: 'butterfly', src: butterflyImg, label: 'Butterfly' },
  { id: 'dog',       src: dogImg,       label: 'Dog' },
  { id: 'dolphin',   src: dolphinImg,   label: 'Dolphin' },
  { id: 'duck',      src: duckImg,      label: 'Duck' },
  { id: 'elephant',  src: elephantImg,  label: 'Elephant' },
  { id: 'flamingo',  src: flamingoImg,  label: 'Flamingo' },
  { id: 'goose',     src: gooseImg,     label: 'Goose' },
  { id: 'koala',     src: koalaImg,     label: 'Koala' },
  { id: 'leopard',   src: leopardImg,   label: 'Leopard' },
  { id: 'lion',      src: lionImg,      label: 'Lion' },
  { id: 'parrot',    src: parrotImg,    label: 'Parrot' },
  { id: 'tiger',     src: tigerImg,     label: 'Tiger' },
]

// Easy: 6 very distinct colors, simple to match
const COLORS_EASY = [
  { id: 'e1', color: '#e74c3c', label: 'Red' },
  { id: 'e2', color: '#3498db', label: 'Blue' },
  { id: 'e3', color: '#2ecc71', label: 'Green' },
  { id: 'e4', color: '#f39c12', label: 'Orange' },
  { id: 'e5', color: '#9b59b6', label: 'Purple' },
  { id: 'e6', color: '#1abc9c', label: 'Teal' },
]

// Medium: 10 colors in similar pairs, moderate challenge
const COLORS_MEDIUM = [
  { id: 'm1',  color: '#e74c3c', label: 'Red' },
  { id: 'm2',  color: '#c0392b', label: 'Dark Red' },
  { id: 'm3',  color: '#3498db', label: 'Blue' },
  { id: 'm4',  color: '#1a5799', label: 'Dark Blue' },
  { id: 'm5',  color: '#2ecc71', label: 'Green' },
  { id: 'm6',  color: '#1a8a4a', label: 'Dark Green' },
  { id: 'm7',  color: '#9b59b6', label: 'Purple' },
  { id: 'm8',  color: '#6c3483', label: 'Dark Purple' },
  { id: 'm9',  color: '#f39c12', label: 'Orange' },
  { id: 'm10', color: '#d35400', label: 'Dark Orange' },
]

// Hard: 12 extremely similar blue-indigo shades — very hard to distinguish
const COLORS_HARD = [
  { id: 'h1',  color: 'hsl(207, 78%, 58%)', label: 'Azure' },
  { id: 'h2',  color: 'hsl(210, 78%, 58%)', label: 'Sky' },
  { id: 'h3',  color: 'hsl(213, 78%, 58%)', label: 'Cornflower' },
  { id: 'h4',  color: 'hsl(216, 78%, 58%)', label: 'Royal' },
  { id: 'h5',  color: 'hsl(219, 78%, 58%)', label: 'Cobalt' },
  { id: 'h6',  color: 'hsl(222, 78%, 58%)', label: 'Sapphire' },
  { id: 'h7',  color: 'hsl(207, 78%, 44%)', label: 'Deep Azure' },
  { id: 'h8',  color: 'hsl(210, 78%, 44%)', label: 'Deep Sky' },
  { id: 'h9',  color: 'hsl(213, 78%, 44%)', label: 'Deep Cornflower' },
  { id: 'h10', color: 'hsl(216, 78%, 44%)', label: 'Deep Royal' },
  { id: 'h11', color: 'hsl(219, 78%, 44%)', label: 'Deep Cobalt' },
  { id: 'h12', color: 'hsl(222, 78%, 44%)', label: 'Deep Sapphire' },
]

// Easy: 3 cols × 4 rows = 12 cards (6 pairs)
// Medium: 5 cols × 4 rows = 20 cards (10 pairs)
// Hard: 8 cols × 3 rows = 24 cards (12 pairs)
const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   cols: 3, pairs: 6,  cardSize: 140, gap: 16 },
  { key: 'medium', label: 'Medium', cols: 5, pairs: 10, cardSize: 108, gap: 12 },
  { key: 'hard',   label: 'Hard',   cols: 8, pairs: 12, cardSize: 82,  gap: 10 },
]

const CATEGORIES = [
  { key: 'animals', label: 'Animals' },
  { key: 'colors',  label: 'Colors' },
]

function fmt(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(difficulty, category) {
  const { pairs } = DIFFICULTIES.find(d => d.key === difficulty)
  const pool = category === 'animals' ? ANIMALS :
    difficulty === 'easy'   ? COLORS_EASY :
    difficulty === 'medium' ? COLORS_MEDIUM : COLORS_HARD
  const items = pool.slice(0, pairs)
  return shuffle(
    items.flatMap((item, i) => [
      { uid: `${i}-a`, pairId: item.id, item, flipped: false, matched: false },
      { uid: `${i}-b`, pairId: item.id, item, flipped: false, matched: false },
    ])
  )
}

// Persistent nav bar shown on all screens
function NavBar({ onLogoClick, centerText, pb, elapsed, showTimer }) {
  return (
    <nav className="sm-nav">
      <button className="sm-nav__logo" onClick={onLogoClick} aria-label="Go to setup">
        <span className="sm-nav__logo-speedy">Speedy</span>Memory
      </button>
      <div className="sm-nav__center">
        {centerText && <span className="sm-nav__level">{centerText}</span>}
      </div>
      <div className="sm-nav__right">
        {pb !== undefined && (
          <span className="sm-nav__pb">
            PB&nbsp;<span className="sm-nav__time-val">{fmt(pb)}</span>
          </span>
        )}
        {showTimer && (
          <span className="sm-nav__timer">{fmt(elapsed)}</span>
        )}
      </div>
    </nav>
  )
}

function MemoryCard({ card, category, size, onClick, showX }) {
  const revealed = card.flipped || card.matched
  return (
    <div
      className={`sm-card${revealed ? ' sm-card--revealed' : ''}${card.matched ? ' sm-card--matched' : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={revealed ? card.item.label : 'Hidden card'}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="sm-card__inner">
        <div className="sm-card__face sm-card__face--down">
          <div className="sm-card-back" />
        </div>
        <div className="sm-card__face sm-card__face--up">
          {category === 'animals' ? (
            <div className={`sm-card-animal${card.matched ? ' sm-card-animal--matched' : ''}`}>
              <img src={card.item.src} alt={card.item.label} />
            </div>
          ) : (
            <div
              className={`sm-card-color${card.matched ? ' sm-card-color--matched' : ''}`}
              style={{ backgroundColor: card.item.color }}
            />
          )}
        </div>
      </div>
      {showX && (
        <div className="sm-wrong-x" aria-hidden="true">✕</div>
      )}
    </div>
  )
}

function SpeedyMemory() {
  const [screen, setScreen]             = useState('setup')
  const [difficulty, setDifficulty]     = useState('easy')
  const [category, setCategory]         = useState('animals')
  const [cards, setCards]               = useState([])
  const [flipped, setFlipped]           = useState([])
  const [matchedCount, setMatchedCount] = useState(0)
  const [locked, setLocked]             = useState(false)
  const [timerActive, setTimerActive]   = useState(false)
  const [elapsed, setElapsed]           = useState(0)
  const [wonStats, setWonStats]         = useState(null)
  const [wrongCards, setWrongCards]     = useState([])
  const [personalBests, setPersonalBests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('speedymemory_pb') ?? '{}') }
    catch { return {} }
  })

  const timerRef    = useRef(null)
  const startRef    = useRef(null)
  const config      = DIFFICULTIES.find(d => d.key === difficulty)
  const pbKey       = `${difficulty}_${category}`
  const currentBest = personalBests[pbKey]

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(
        () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
        250
      )
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  const startGame = () => {
    clearInterval(timerRef.current)
    setCards(buildDeck(difficulty, category))
    setFlipped([])
    setMatchedCount(0)
    setLocked(false)
    setTimerActive(false)
    setElapsed(0)
    setWonStats(null)
    setWrongCards([])
    startRef.current = null
    setScreen('game')
  }

  const goToSetup = () => {
    clearInterval(timerRef.current)
    setTimerActive(false)
    setScreen('setup')
  }

  const handleCardClick = (index) => {
    if (locked || cards[index].flipped || cards[index].matched || flipped.length >= 2) return

    if (!timerActive) {
      startRef.current = Date.now()
      setTimerActive(true)
    }

    const newCards   = cards.map((c, i) => i === index ? { ...c, flipped: true } : c)
    const newFlipped = [...flipped, index]
    setCards(newCards)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped
      if (newCards[i1].pairId === newCards[i2].pairId) {
        setTimeout(() => {
          const newCount = matchedCount + 1
          setCards(prev => prev.map((c, i) =>
            i === i1 || i === i2 ? { ...c, matched: true } : c
          ))
          setMatchedCount(newCount)
          setFlipped([])

          if (newCount === config.pairs) {
            clearInterval(timerRef.current)
            setTimerActive(false)
            const final = Math.floor((Date.now() - startRef.current) / 1000)
            setElapsed(final)
            const prevBest = personalBests[pbKey]
            const isNew    = prevBest === undefined || final < prevBest
            setWonStats({ elapsed: final, isNewBest: isNew, previousBest: prevBest })
            if (isNew) {
              const updated = { ...personalBests, [pbKey]: final }
              localStorage.setItem('speedymemory_pb', JSON.stringify(updated))
              setPersonalBests(updated)
            }
            setTimeout(() => setScreen('won'), 400)
          }
        }, 180)
      } else {
        setLocked(true)
        setWrongCards([i1, i2])
        setTimeout(() => {
          setWrongCards([])
          setCards(prev => prev.map((c, i) =>
            i === i1 || i === i2 ? { ...c, flipped: false } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 600)
      }
    }
  }

  // ── Setup screen ─────────────────────────────────────────────────────────────
  if (screen === 'setup') {
    const hasBests = Object.keys(personalBests).length > 0
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white flex flex-col">
        <NavBar onLogoClick={() => {}} centerText={null} pb={undefined} elapsed={0} showTimer={false} />

        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-6">

          <div className="w-full max-w-md space-y-6">
            {/* Difficulty */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7db5b0] mb-3">Difficulty</p>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.key}
                    onClick={() => setDifficulty(d.key)}
                    className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                      difficulty === d.key
                        ? 'bg-[#b0d4d0] text-[#1a3330] shadow-lg shadow-[#0d1e1c]/50'
                        : 'bg-[#1a3330] text-[#b0d4d0] hover:bg-[#2D5C59] hover:text-white'
                    }`}
                  >
                    <div>{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7db5b0] mb-3">Category</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      category === c.key
                        ? 'bg-[#b0d4d0] text-[#1a3330] shadow-lg shadow-[#0d1e1c]/50'
                        : 'bg-[#1a3330] text-[#b0d4d0] hover:bg-[#2D5C59] hover:text-white'
                    }`}
                  >
                    <div>{c.icon} {c.label}</div>
                    <div className={`text-xs mt-1 ${category === c.key ? 'text-blue-200' : 'text-[#5a9490]'}`}>
                      {c.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal bests */}
            {hasBests && (
              <div className="rounded-xl border border-[#2D5C59] overflow-hidden">
                <div className="bg-[#1a3330] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#7db5b0]">
                  Personal Records
                </div>
                <div className="divide-y divide-[#2D5C59]/50">
                  {DIFFICULTIES.map(d => CATEGORIES.map(c => {
                    const key  = `${d.key}_${c.key}`
                    const best = personalBests[key]
                    if (!best) return null
                    const active = key === pbKey
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between px-4 py-2 text-sm ${
                          active ? 'bg-[#2D5C59]/20 text-white' : 'text-[#b0d4d0]'
                        }`}
                      >
                        <span>{c.label} ({d.label})</span>
                        <span className="font-mono text-blue-300">{fmt(best)}</span>
                      </div>
                    )
                  }))}
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-[#2D5C59] hover:bg-[#3a7570] text-white text-lg font-bold tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Win screen ────────────────────────────────────────────────────────────────
  if (screen === 'won') {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white flex flex-col">
        <NavBar
          onLogoClick={goToSetup}
          centerText={`${category} (${difficulty})`}
          pb={undefined}
          elapsed={0}
          showTimer={false}
        />

        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-400">Success!</h2>
          </div>

          <div className="bg-[#1a3330] rounded-2xl p-8 text-center min-w-[280px]">
            <p className="text-[#7db5b0] text-xs uppercase tracking-[0.2em] mb-1">Your Time</p>
            <p className="text-5xl font-mono font-bold">
              {wonStats ? fmt(wonStats.elapsed) : '--:--'}
            </p>
            {wonStats?.isNewBest && (
              <p className="mt-3 text-yellow-400 font-semibold text-sm">New Personal Best!</p>
            )}
            {!wonStats?.isNewBest && wonStats?.previousBest !== undefined && (
              <p className="mt-3 text-[#7db5b0] text-sm">
                Best: <span className="font-mono text-blue-300">{fmt(wonStats.previousBest)}</span>
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-[#b0d4d0] hover:bg-[#b0d4d0] text-[#1a3330] font-semibold transition-all hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
            <button
              onClick={goToSetup}
              className="px-8 py-3 rounded-xl bg-[#2D5C59] hover:bg-[#3a7570] font-semibold transition-all hover:scale-105 active:scale-95"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Game screen ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white flex flex-col">
      <NavBar
        onLogoClick={goToSetup}
        centerText={`${category} (${difficulty})`}
        pb={currentBest}
        elapsed={elapsed}
        showTimer={true}
      />

      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, ${config.cardSize}px)`,
            gap: config.gap,
          }}
        >
          {cards.map((card, index) => (
            <MemoryCard
              key={card.uid}
              card={card}
              category={category}
              size={config.cardSize}
              showX={wrongCards.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpeedyMemory
