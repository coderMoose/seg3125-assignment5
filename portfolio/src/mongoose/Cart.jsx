import { Link, useNavigate } from 'react-router-dom'
import { MongooseLayout, Mascot, formatMonogram } from './components.jsx'
import { SWATCHES, productByNo, MONOGRAM_FEE } from './data.js'
import { useCart } from './CartContext.jsx'

export default function Cart() {
  const navigate = useNavigate()
  const { items, setQty, removeItem, count, subtotal, monogramFee, shipping, total } = useCart()
  const empty = items.length === 0

  return (
    <MongooseLayout active="cart">
      <section className="mg-divide-b mg-cart-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
        {/* Items */}
        <div style={{ minWidth: 0, borderRight: '1px solid #2c4a73' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '38px 44px 10px' }}>
            <h1 className="mg-display" style={{ fontSize: 32 }}>Your parcel, so far.</h1>
            <div className="mg-mono" style={{ fontSize: 11, letterSpacing: '.16em' }}>{count} ITEMS</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '14px 44px 40px' }}>
            {items.map((it) => {
              const product = productByNo(it.productNo)
              const swatchBg = SWATCHES[product?.swatch] || product?.swatch
              const line = (it.unitPrice + (it.monogram ? MONOGRAM_FEE : 0)) * it.qty
              return (
                <div key={it.id} className="mg-dotted-b" style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '22px 0' }}>
                  <div style={{ width: 88, height: 88, border: '1px solid #2c4a73', padding: 4, boxSizing: 'border-box', flex: 'none' }}>
                    <div style={{ width: '100%', height: '100%', background: swatchBg }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    <div className="mg-mono" style={{ fontSize: 10, letterSpacing: '.2em' }}>NO. {it.productNo}</div>
                    <div style={{ fontFamily: 'Prata, serif', fontSize: 19, color: 'var(--mg-ink)' }}>{it.name}</div>
                    {it.monogram ? (
                      <div style={{ fontFamily: 'Marcellus, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--mg-denim)' }}>
                        monogrammed “{formatMonogram(it.monogram)}” · +${MONOGRAM_FEE}
                      </div>
                    ) : null}
                  </div>
                  <div className="mg-stepper mg-stepper-sm" style={{ flex: 'none' }}>
                    <button type="button" onClick={() => setQty(it.id, it.qty - 1)} disabled={it.qty <= 1} aria-label="Decrease quantity">−</button>
                    <div className="mg-stepper-val">{it.qty}</div>
                    <button type="button" onClick={() => setQty(it.id, it.qty + 1)} disabled={it.qty >= 9} aria-label="Increase quantity">+</button>
                  </div>
                  <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 15, letterSpacing: '.1em', color: 'var(--mg-denim)', width: 64, textAlign: 'right', flex: 'none' }}>
                    ${line}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    aria-label="Remove item"
                    className="mg-remove"
                    style={{ background: 'none', border: 'none', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: 'var(--mg-taupe)', cursor: 'pointer', flex: 'none', padding: 6 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}

            {empty ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'Marcellus, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--mg-taupe)' }}>
                Your parcel is empty.
              </div>
            ) : null}

            <Link
              to="/mongoose/shop"
              style={{ marginTop: 22, fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.24em', color: 'var(--mg-denim)', textDecoration: 'none', alignSelf: 'flex-start', borderBottom: '1px solid #2c4a73', paddingBottom: 2 }}
            >
              ← CONTINUE BROWSING
            </Link>
          </div>
        </div>

        {/* Receipt */}
        <div className="mg-panel" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', padding: '38px 40px 40px' }}>
          <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.3em', color: 'var(--mg-taupe)', textAlign: 'center', paddingBottom: 14, borderBottom: '1px solid #2c4a73' }}>
            RECEIPT — DRAFT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0', borderBottom: '1px solid #2c4a73' }}>
            <ReceiptRow label="Subtotal" value={`$${subtotal}`} />
            <ReceiptRow label="Monogramming" value={monogramFee ? `$${monogramFee}` : '—'} />
            <ReceiptRow label="Post (wax-sealed)" value={shipping === 0 ? 'On the house' : `$${shipping}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', fontFamily: "'Marcellus SC', serif", fontSize: 17, letterSpacing: '.12em', color: 'var(--mg-ink)' }}>
            <span>TOTAL</span>
            <span>${total}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/mongoose/checkout')}
            disabled={empty}
            className="mg-btn"
            style={{ padding: '16px 20px', fontSize: 13, letterSpacing: '.26em' }}
          >
            PROCEED TO THE COUNTER
          </button>
          <div style={{ fontFamily: 'Marcellus, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--mg-taupe)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Orders placed before 3 o’clock are posted the same afternoon.
          </div>
          <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
            <Mascot fill="#7a6c50" width={46} height={24} bg="rgba(44,74,115,.04)" />
          </div>
        </div>
      </section>

      <style>{`.mongoose .mg-remove:hover { color: #a33; }`}</style>
    </MongooseLayout>
  )
}

function ReceiptRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Marcellus, serif', fontSize: 14, color: 'var(--mg-body)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
