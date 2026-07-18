import { Link } from 'react-router-dom'
import { useCart } from './CartContext.jsx'
import { SWATCHES } from './data.js'
import './mongoose.css'

// Mongoose running-mascot path, copied verbatim from the design file header.
const MASCOT_PATH =
  'M115,28 C112,24.5 106,22 99,22 C96,15.5 89,15.5 88,20 C81,26 70,28 58,28 C46,28 38,30 31,34 C27,26 19,18 11,14 C13,10 5,10 7,16 C15,22 23,30 28,38 C29,44 29,48 28,52 L33,52 C34,47 35,44 37,42 C46,44 60,44 72,41 C73,45 72,49 71,52 L76,52 C77,47 79,43 82,39 C88,36 93,34 96,32 C102,32 108,31 115,28 Z'

/**
 * Mascot — inline mongoose SVG (viewBox 0 0 120 60).
 * @param {string} fill   body fill color (default denim).
 * @param {string} bg     eye color (matches the background it sits on).
 * @param {number} width / height  render size (defaults 74×40, header size).
 */
export function Mascot({ fill = '#2c4a73', bg = '#faf6ec', width = 74, height = 40, ...rest }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 60"
      aria-label="Mongoose mascot"
      style={{ flex: 'none' }}
      {...rest}
    >
      <path fill={fill} d={MASCOT_PATH} />
      <circle cx="97" cy="25" r="1.6" fill={bg} />
    </svg>
  )
}

/** Format up to 3 letters as stitched monogram "A.B.C". */
export function formatMonogram(str) {
  const letters = String(str || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
  return letters ? letters.split('').join('.') : ''
}

/**
 * Swatch — framed product "photo" (deckle frame: denim border + white padding +
 * inner dashed rule). Optionally renders a stitched monogram preview bottom-right.
 * @param {string} swatch    key into SWATCHES (or a raw CSS background value).
 * @param {number} size      px size of the square (default 200).
 * @param {string} monogram  up to 3 letters; rendered as "A.B.C".
 * @param {number} monogramSize  font-size of the preview (default 22).
 * @param {ReactNode} children  extra overlay content (e.g. thumbnails not needed here).
 */
export function Swatch({ swatch, size = 200, monogram, monogramSize = 22, children, style }) {
  const bg = SWATCHES[swatch] || swatch
  const mono = formatMonogram(monogram)
  return (
    <div
      className="mg-swatch"
      style={{ width: size, height: size, ...style }}
    >
      <div className="mg-swatch-inner" style={{ background: bg }} />
      {mono ? (
        <div className="mg-swatch-monogram" style={{ fontSize: monogramSize }}>
          {mono}
        </div>
      ) : null}
      {children}
    </div>
  )
}

const NAV_LINKS = [
  { key: 'shop', label: 'SHOP', to: '/mongoose/shop' },
  { key: 'monogram', label: 'MONOGRAM', to: '/mongoose#monogram' },
  { key: 'story', label: 'STORY', to: '/mongoose#story' },
]

function MongooseHeader({ active }) {
  const { count } = useCart()
  return (
    <header className="mg-header mg-divide-b">
      <Link to="/mongoose" className="mg-logo">
        <Mascot />
        <div className="mg-wordmark">mongoose</div>
      </Link>
      <div className="mg-tagline">THE REMEDY TO CROCODILE TEARS</div>
      <nav className="mg-nav">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.key}
            to={l.to}
            className={active === l.key ? 'mg-active' : undefined}
          >
            {l.label}
          </Link>
        ))}
        <Link
          to="/mongoose/cart"
          className={active === 'cart' ? 'mg-active' : undefined}
        >
          {`CART${count === 0 ? '' : ` (${count})`}`}
        </Link>
      </nav>
    </header>
  )
}

function MongooseFooter() {
  return (
    <footer className="mg-footer">
      <Mascot fill="#7a6c50" width={52} height={28} bg="#faf6ec" />
      <div className="mg-footer-links">
        <span>© MONGOOSE MMXXVI</span>
      </div>
    </footer>
  )
}

/**
 * MongooseLayout — full page shell (wallpaper → double frame → header / content / footer).
 * @param {string} active   one of 'shop' | 'monogram' | 'story' | 'cart' to underline the nav link.
 * @param {string} wallpaper  'picnic' | 'cream' | 'dusk' (theming knob; default picnic).
 * @param {string} frame      'double' | 'hairline' | 'open' (theming knob; default double).
 * @param {ReactNode} children  page body (sections between header and footer).
 */
export function MongooseLayout({ active, wallpaper = 'picnic', frame = 'double', children }) {
  const wallClass = 'mg-wall-dusk'
  const frameClass = 'mg-frame-double'
  return (
    <div className="mongoose">
      <div className={`mg-wallpaper ${wallClass}`}>
        <div className={`mg-frame-outer ${frameClass}`}>
          <div className="mg-frame-inner">
            <MongooseHeader active={active} />
            {children}
            <MongooseFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
