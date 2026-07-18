import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MongooseLayout, Swatch, formatMonogram } from './components.jsx'
import { PRODUCTS } from './data.js'
import heroImage from '../assets/mongoose-hero-image.png'

const VOICE = {
  'Concierge formal': {
    heroHeadline: 'Your own hankie for any emergency.',
    ctaLabel: 'BROWSE COLLECTION',
    storyQuote:
      '“We have been weaving handkerchiefs by hand since 1914. If need be, feel free to contact us by traditional post. We answer every letter.”',
  },
  'Dry wit': {
    heroHeadline: 'For tears, sneezes, and dramatic exits.',
    ctaLabel: 'INSPECT THE NINE',
    storyQuote:
      '“A handkerchief will not solve your problems. It will, however, make you look remarkably composed while you have them.”',
  },
}

function Knob({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mg-mono" style={{ letterSpacing: '.16em' }}>
        {label}
      </span>
      <div style={{ display: 'flex', border: '1px solid #2c4a73' }}>
        {options.map(([lbl, val]) => {
          const active = value === val
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              style={{
                border: 'none',
                borderRight: '1px solid #2c4a73',
                padding: '6px 12px',
                cursor: 'pointer',
                fontFamily: "'Marcellus SC',serif",
                fontSize: 11,
                letterSpacing: '.16em',
                background: active ? '#2c4a73' : 'transparent',
                color: active ? '#f2ead9' : '#2c4a73',
              }}
            >
              {lbl}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const location = useLocation()
  const [initials, setInitials] = useState('D.F')
  const [wallpaper, setWallpaper] = useState('picnic')
  const [frame, setFrame] = useState('double')
  const [voiceName, setVoiceName] = useState('Concierge formal')
  const voice = VOICE[voiceName]

  // Support in-page anchor navigation (#monogram / #story) from the nav.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  const preview = PRODUCTS.slice(0, 3)
  const stitched = formatMonogram(initials) || 'A.B.C'

  return (
    <MongooseLayout active="shop" wallpaper={wallpaper} frame={frame}>
      {/* Hero */}
      <section
        className="mg-divide-b"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 26,
          padding: '64px 60px 58px',
          textAlign: 'center',
        }}
      >
        <div className="mg-kicker" style={{ letterSpacing: '.34em', fontSize: 13 }}>
          FINE COTTON HANDKERCHIEFS
        </div>
        <h1
          className="mg-display"
          style={{ fontSize: 58, lineHeight: 1.18, maxWidth: 720, textWrap: 'balance' }}
        >
          {voice.heroHeadline}
        </h1>
        <div
          style={{
            width: 380,
            height: 300,
            borderRadius: '50%',
            border: '1px solid #d3d3d3',
            padding: 10,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '1px dashed #f2ead9',
              overflow: 'hidden',
            }}
          >
            <img
              src={heroImage}
              alt="mongoose-hero-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
        <Link to="/mongoose/shop" className="mg-btn">
          {voice.ctaLabel}
        </Link>
      </section>

      {/* Products preview */}
      <section id="shop" className="mg-divide-b">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '44px 40px 8px',
          }}
        >
          <div className="mg-kicker">THE COLLECTION</div>
          <h2 className="mg-display" style={{ fontSize: 34 }}>
            Nine handkerchiefs, numbered.
          </h2>
        </div>
        <div className="mg-grid-3" style={{ padding: '34px 0 0' }}>
          {preview.map((p, i) => (
            <Link
              key={p.no}
              to={`/mongoose/product/${p.slug}`}
              className="mg-cell"
              style={{ borderRight: i === 2 ? 'none' : '1px solid #2c4a73' }}
            >
              <div className="mg-mono">NO. {p.no}</div>
              <Swatch swatch={p.swatch} size={200} />
              <div className="mg-cell-name">{p.name}</div>
              <div className="mg-cell-price">${p.price}</div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 44px' }}>
          <Link to="/mongoose/shop" className="mg-link">
            VIEW ALL →
          </Link>
        </div>
      </section>

      {/* Monogram band */}
      <section
        id="monogram"
        className="mg-divide-b"
        style={{
          background: '#2c4a73',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            padding: '56px 20px 56px 70px',
          }}
        >
          <div
            className="mg-kicker"
            style={{ color: '#a8b8cf' }}
          >
            SERVICE NO. 10
          </div>
          <h2
            className="mg-display"
            style={{ fontSize: 32, lineHeight: 1.3, color: '#f2ead9', maxWidth: 380 }}
          >
            Have it monogrammed. Three letters, hand-stitched.
          </h2>
          <div
            className="mg-body"
            style={{ fontSize: 15, color: '#cfd9e8', maxWidth: 360 }}
          >
            Type your initials to see them settle into the corner.
          </div>
          <input
            maxLength={3}
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            aria-label="Your initials"
            className="mg-monogram-input mg-monogram-input-denim"
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 40px',
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              background:
                'repeating-linear-gradient(0deg,rgba(250,246,236,.07) 0,rgba(250,246,236,.07) 14px,rgba(250,246,236,0) 14px,rgba(250,246,236,0) 28px),repeating-linear-gradient(90deg,#33547f 0,#33547f 14px,#2a4569 14px,#2a4569 28px)',
              border: '1px dashed #cfd9e8',
              position: 'relative',
              transform: 'rotate(-2deg)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 22,
                bottom: 18,
                fontFamily: 'Prata,serif',
                fontSize: 30,
                letterSpacing: '.14em',
                color: '#f2ead9',
                textShadow: '0 1px 0 rgba(0,0,0,.25)',
              }}
            >
              {stitched}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section
        id="story"
        className="mg-divide-b"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          padding: '58px 60px',
          textAlign: 'center',
        }}
      >
        <div className="mg-kicker">A NOTE FOR OUR CUSTOMARY KERCHIEF ENJOYERS</div>
        <p
          className="mg-display"
          style={{ fontSize: 26, lineHeight: 1.5, maxWidth: 640, textWrap: 'balance' }}
        >
          {voice.storyQuote}
        </p>
        <div
          className="mg-kicker"
          style={{ color: '#2c4a73', letterSpacing: '.24em' }}
        >
          — MONGOOSE MANAGEMENT
        </div>
      </section>
    </MongooseLayout>
  )
}
