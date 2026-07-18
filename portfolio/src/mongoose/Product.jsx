import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MongooseLayout, Swatch } from './components.jsx'
import { PRODUCTS, SWATCHES, productBySlug, MONOGRAM_FEE } from './data.js'
import { useCart } from './CartContext.jsx'

// Per-product body copy — plain and simple, matched to each fabric pattern.
const DESCRIPTIONS = {
  'the-original':
    'Solid denim in hard-wearing cotton — the original Mongoose handkerchief. Woven close, hemmed by hand, and pressed flat. The one that started it all.',
  'the-baker':
    'Soft cream-on-cream diagonal stripes in light, breathable cotton. Easy to fold, easy to carry, and clean enough for every day. Hemmed by hand on all four sides.',
  'the-telegraph':
    'A blue-and-cream cross-hatch in tightly woven cotton, made for daily carry. Tough enough to keep in a pocket and soft enough to use. Hand-rolled hem.',
  'chessboard':
    'A classic window-check grid in clean, hard-wearing cotton. Simple, neat, and easy to match with anything. Long-staple cotton, hand-rolled hem.',
  'the-sailor':
    "A sailor's favourite: bold blue-and-cream stripes in water-resistant, hard-wearing cotton. Built to take a beating and hold its shape. Woven flat and hemmed by hand.",
  'polka':
    'One lonely blue polka dot on a cream field, in soft, absorbent cotton. Folds flat and slips into any pocket. Long-staple cotton throughout.',
  'the-banker':
    'A fine vertical pinstripe in crisp cotton, tidy enough for the office. Restrained enough for any pocket or occasion. Hand-rolled on all four sides.',
  'the-traveler':
    'A deep denim twill in tough cotton that holds up on the road. Thick, absorbent, and hard to wear out. Woven close and pressed flat.',
  'herringbone':
    'A denim herringbone weave in thick, long-lasting cotton, built to last. Handles every small emergency without fuss. Hemmed by hand.',
}

const THUMB_LABELS = ['folded shot', 'in pocket', 'detail weave']

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = productBySlug(slug)

  const [initials, setInitials] = useState('')
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)

  if (!product) {
    return (
      <MongooseLayout active="shop">
        <section style={{ padding: '64px 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div className="mg-mono">NOT IN THE LEDGER</div>
          <h1 className="mg-display" style={{ fontSize: 34 }}>No such handkerchief.</h1>
          <Link to="/mongoose/shop" className="mg-link">← BACK TO THE COLLECTION</Link>
        </section>
      </MongooseLayout>
    )
  }

  const clean = initials.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
  const unit = product.price + (clean ? MONOGRAM_FEE : 0)
  const total = unit * qty
  const swatchBg = SWATCHES[product.swatch] || product.swatch

  const idx = PRODUCTS.findIndex((p) => p.no === product.no)
  const related = [1, 2, 3].map((offset) => PRODUCTS[(idx + offset) % PRODUCTS.length])

  function onInitials(e) {
    setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))
  }

  function addToCart() {
    addItem({ productNo: product.no, qty, monogram: clean || null })
    navigate('/mongoose/cart')
  }

  const thumbBase = { width: 64, height: 64, padding: 3, boxSizing: 'border-box', cursor: 'pointer', background: 'none' }

  return (
    <MongooseLayout active="shop">
      {/* Breadcrumb */}
      <div
        className="mg-divide-b"
        style={{ display: 'flex', gap: 10, padding: '18px 48px', fontFamily: "'Marcellus SC', serif", fontSize: 11, letterSpacing: '.2em' }}
      >
        <Link to="/mongoose/shop" style={{ color: 'var(--mg-taupe)', textDecoration: 'none' }}>
          THE COLLECTION
        </Link>
        <span style={{ color: 'var(--mg-taupe)' }}>/</span>
        <span style={{ color: 'var(--mg-denim)' }}>
          NO. {product.no} — {product.name.toUpperCase()}
        </span>
      </div>

      {/* Product */}
      <section
        className="mg-divide-b mg-product-grid"
        style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', position: 'relative' }}
      >
        {product.badge ? (
          <span className={`mg-badge mg-badge-${product.badge}`}>{product.badge}</span>
        ) : null}
        {/* Left — imagery */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '52px 40px', borderRight: '1px solid #2c4a73' }}>
          <Swatch swatch={product.swatch} size={340} monogram={clean} monogramSize={22} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setActiveThumb(0)}
              aria-label="Product photo"
              style={{ ...thumbBase, border: activeThumb === 0 ? '1px solid #2c4a73' : '1px solid rgba(44,74,115,.35)' }}
            >
              <div style={{ width: '100%', height: '100%', background: swatchBg }} />
            </button>
            {THUMB_LABELS.map((label, i) => {
              const ti = i + 1
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => setActiveThumb(ti)}
                  aria-label={`${label} — coming soon`}
                  style={{ ...thumbBase, border: activeThumb === ti ? '1px solid #2c4a73' : '1px solid rgba(44,74,115,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 8, color: 'var(--mg-taupe)', textAlign: 'center' }}
                >
                  <span>{label}</span>
                  <span style={{ fontSize: 6.5, letterSpacing: '.06em', color: 'var(--mg-denim)', border: '1px solid rgba(44,74,115,.4)', padding: '1px 3px' }}>
                    COMING SOON
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mg-mono" style={{ fontSize: 10, letterSpacing: '.16em' }}>
            40 × 40 cm · long-staple cotton · hand-rolled hem
          </div>
        </div>

        {/* Right — details */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18, padding: '52px 48px' }}>
          <div className="mg-mono" style={{ fontSize: 11, letterSpacing: '.2em' }}>NO. {product.no} OF 9</div>
          <h1 className="mg-display" style={{ fontSize: 38, lineHeight: 1.15 }}>{product.name}</h1>
          <div className="mg-italic" style={{ fontSize: 15 }}>{product.blurb}</div>
          <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 20, letterSpacing: '.14em', color: 'var(--mg-denim)' }}>${product.price}</div>
          <p className="mg-body" style={{ fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 400 }}>
            {DESCRIPTIONS[product.slug]}
          </p>

          {/* Monogram box */}
          <div style={{ border: '1px dashed #2c4a73', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(44,74,115,.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.24em', color: 'var(--mg-denim)' }}>MONOGRAM — SERVICE NO. 10</div>
              <div className="mg-mono" style={{ fontSize: 10, letterSpacing: 0 }}>+ ${MONOGRAM_FEE}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <input
                maxLength={3}
                value={initials}
                onChange={onInitials}
                aria-label="Your initials"
                placeholder="ABC"
                style={{ background: '#fff', border: '1px solid #2c4a73', color: '#2c4a73', fontFamily: "'Marcellus SC', serif", fontSize: 16, letterSpacing: '.4em', padding: '10px 14px', width: 100, textTransform: 'uppercase', outline: 'none', boxSizing: 'border-box' }}
              />
              <div className="mg-body" style={{ fontSize: 12, color: 'var(--mg-taupe)', lineHeight: 1.5 }}>
                Three letters, chain-stitched in denim thread. Preview appears on the handkerchief.
              </div>
            </div>
          </div>

          {/* Qty + add */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            <div className="mg-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
              <div className="mg-stepper-val">{qty}</div>
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} disabled={qty >= 9} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" onClick={addToCart} className="mg-btn" style={{ flex: 1, padding: '14px 20px', fontSize: 13, letterSpacing: '.26em' }}>
              ADD TO CART — ${total}
            </button>
          </div>
        </div>
      </section>

      {/* Filed nearby */}
      <section className="mg-divide-b">
        <div style={{ textAlign: 'center', padding: '36px 40px 6px', fontFamily: 'Prata, serif', fontSize: 24, color: 'var(--mg-ink)' }}>
         Related items 
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {related.map((p, i) => (
            <Link
              key={p.no}
              to={`/mongoose/product/${p.slug}`}
              className="mg-related-cell"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 30px 34px', borderRight: i === related.length - 1 ? 'none' : '1px solid #2c4a73', textDecoration: 'none', cursor: 'pointer', transition: 'background 120ms ease' }}
            >
              <div className="mg-mono" style={{ fontSize: 10, letterSpacing: '.2em' }}>NO. {p.no}</div>
              <Swatch swatch={p.swatch} size={140} />
              <div style={{ fontFamily: 'Prata, serif', fontSize: 17, color: 'var(--mg-ink)' }}>{p.name}</div>
              <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.18em', color: 'var(--mg-denim)' }}>${p.price}</div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`.mongoose .mg-related-cell:hover { background: rgba(44,74,115,.05); }`}</style>
    </MongooseLayout>
  )
}
