import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MongooseLayout, Mascot, formatMonogram } from './components.jsx'
import { SWATCHES, productByNo, MONOGRAM_FEE } from './data.js'
import { useCart } from './CartContext.jsx'

const RATING_LABELS = ['DREADFUL', 'PASSABLE', 'PLEASANT', 'SPLENDID', 'IMPECCABLE']
const ORDER_NO = 'MG-1926-042'

const EMPTY_FORM = {
  name: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  card: '',
  exp: '',
  cvc: '',
  cardName: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, monogramFee, shipping, total, clearCart } = useCart()

  const [step, setStep] = useState('counter') // 'counter' | 'sealed'
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')

  // survey
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [surveyDone, setSurveyDone] = useState(false)

  function setField(key) {
    return (e) => {
      const value = e.target.value
      setForm((f) => ({ ...f, [key]: value }))
      setError('') // clear error on any input change
    }
  }

  function submitOrder() {
    const f = form
    const missing = []
    if (!f.name.trim()) missing.push('addressee')
    if (!f.email.trim() || !f.email.includes('@')) missing.push('a proper email')
    if (!f.address.trim()) missing.push('street')
    if (f.card.replace(/\D/g, '').length < 15) missing.push('a full card number')
    if (!f.exp.trim()) missing.push('expiry')
    if (f.cvc.replace(/\D/g, '').length < 3) missing.push('CVC')
    if (missing.length) {
      setError('The ledger is incomplete — we still need ' + missing.join(', ') + '.')
      return
    }
    // Card data is intentionally NOT stored. A real integration would tokenize
    // the card via a payment provider (e.g. Stripe Elements) here before advancing.
    setConfirmEmail(f.email)
    setStep('sealed')
    try {
      window.scrollTo(0, 0)
    } catch {
      /* ignore */
    }
  }

  function submitSurvey() {
    // A real build would POST { rating, feedback } to a backend / analytics here.
    setSurveyDone(true)
  }

  function returnToLobby() {
    clearCart()
    navigate('/mongoose')
  }

  const step1Color = step === 'counter' ? '#2c4a73' : '#b5a27c'
  const step2Color = step === 'sealed' ? '#2c4a73' : '#b5a27c'

  return (
    <MongooseLayout active="cart">
      {/* Step indicator (overrides the standard nav row via the header slot is not
          available, so we render it just under the header) */}
      <div className="mg-divide-b" style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.22em', padding: '16px 40px' }}>
        <span style={{ color: step1Color }}>1 · THE COUNTER</span>
        <span style={{ color: '#b5a27c' }}>———</span>
        <span style={{ color: step2Color }}>2 · SEALED &amp; SENT</span>
      </div>

      {step === 'counter' ? (
        <section className="mg-divide-b mg-checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
          {/* Form */}
          <div style={{ minWidth: 0, borderRight: '1px solid #2c4a73', padding: '40px 44px 46px', display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h1 className="mg-display" style={{ fontSize: 32 }}>The counter.</h1>
              <div className="mg-italic" style={{ fontSize: 14 }}>Fill in the ledger. We handle the rest.</div>
            </div>

            {/* Destination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="mg-section-heading">DESTINATION</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="ADDRESSEE" value={form.name} onChange={setField('name')} placeholder="Margot H. Tenen" />
                <Field label="ELECTRONIC MAIL" value={form.email} onChange={setField('email')} placeholder="margot@example.com" />
              </div>
              <Field label="STREET & NUMBER" value={form.address} onChange={setField('address')} placeholder="111 Archer Avenue, Apt. 2" />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <Field label="CITY" value={form.city} onChange={setField('city')} placeholder="New York" />
                <Field label="POSTAL CODE" value={form.zip} onChange={setField('zip')} placeholder="10024" />
              </div>
            </div>

            {/* Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="mg-section-heading">
                <span>METHOD OF PAYMENT</span>
                <span className="mg-mono" style={{ fontSize: 9, letterSpacing: 0 }}>HELD IN CONFIDENCE · NEVER STORED</span>
              </div>
              <Field label="CARD NUMBER" value={form.card} onChange={setField('card')} placeholder="4242 4242 4242 4242" mono inputMode="numeric" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <Field label="EXPIRES" value={form.exp} onChange={setField('exp')} placeholder="MM / YY" mono />
                <Field label="CVC" value={form.cvc} onChange={setField('cvc')} placeholder="123" mono inputMode="numeric" maxLength={4} />
                <Field label="NAME ON CARD" value={form.cardName} onChange={setField('cardName')} placeholder="M. H. TENEN" />
              </div>
            </div>

            {error ? <div className="mg-error-box">{error}</div> : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <button type="button" onClick={submitOrder} className="mg-btn" style={{ padding: '16px 36px', fontSize: 13, letterSpacing: '.26em' }}>
                SEAL &amp; SEND — ${total}
              </button>
              <Link to="/mongoose/cart" style={{ fontFamily: "'Marcellus SC', serif", fontSize: 11, letterSpacing: '.22em', color: 'var(--mg-taupe)', textDecoration: 'none' }}>
                ← BACK TO PARCEL
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="mg-panel" style={{ minWidth: 0, padding: '40px 40px 46px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.3em', color: 'var(--mg-taupe)', textAlign: 'center', paddingBottom: 14, borderBottom: '1px solid #2c4a73' }}>
              YOUR PARCEL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0 0' }}>
              {items.map((it) => {
                const product = productByNo(it.productNo)
                const swatchBg = SWATCHES[product?.swatch] || product?.swatch
                const meta = [
                  `NO. ${it.productNo}`,
                  it.monogram ? `MONOGRAM ${formatMonogram(it.monogram)}` : null,
                  `QTY ${it.qty}`,
                ].filter(Boolean).join(' · ')
                const line = (it.unitPrice + (it.monogram ? MONOGRAM_FEE : 0)) * it.qty
                return (
                  <div key={it.id} className="mg-dotted-b" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 0' }}>
                    <div style={{ width: 52, height: 52, border: '1px solid #2c4a73', padding: 3, boxSizing: 'border-box', flex: 'none' }}>
                      <div style={{ width: '100%', height: '100%', background: swatchBg }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                      <div style={{ fontFamily: 'Prata, serif', fontSize: 15, color: 'var(--mg-ink)' }}>{it.name}</div>
                      <div className="mg-mono" style={{ fontSize: 9, letterSpacing: '.1em' }}>{meta}</div>
                    </div>
                    <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 13, color: 'var(--mg-denim)' }}>${line}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 0', borderBottom: '1px solid #2c4a73' }}>
              <SummaryRow label="Subtotal & monogram" value={`$${subtotal + monogramFee}`} />
              <SummaryRow label="Post (wax-sealed)" value={shipping === 0 ? 'On the house' : `$${shipping}`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontFamily: "'Marcellus SC', serif", fontSize: 16, letterSpacing: '.12em', color: 'var(--mg-ink)' }}>
              <span>TOTAL</span>
              <span>${total}</span>
            </div>
            <div style={{ fontFamily: 'Marcellus, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--mg-taupe)', textAlign: 'center', lineHeight: 1.6, marginTop: 'auto' }}>
              Orders placed before 3 o’clock are posted the same afternoon.
            </div>
          </div>
        </section>
      ) : (
        <section className="mg-divide-b" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Confirmation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '56px 60px 44px', textAlign: 'center', borderBottom: '1px solid #2c4a73', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ width: 86, height: 86, borderRadius: '50%', background: '#2c4a73', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 0 rgba(34,49,74,.3)' }}>
              <Mascot fill="#f2ead9" width={52} height={28} bg="#2c4a73" />
            </div>
            <h1 className="mg-display" style={{ fontSize: 40 }}>Sealed and sent.</h1>
            <div className="mg-body" style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 460 }}>
              Order <span className="mg-mono" style={{ fontSize: 14, letterSpacing: '.1em', color: 'var(--mg-denim)' }}>{ORDER_NO}</span> is being wrapped as we speak. A confirmation e-mail is on its way to <span style={{ fontStyle: 'italic' }}>{confirmEmail || 'your inbox'}</span>.
            </div>
          </div>

          {/* Survey */}
          {!surveyDone ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '44px 60px 54px', width: '100%', maxWidth: 560, boxSizing: 'border-box' }}>
              <div style={{ fontFamily: "'Marcellus SC', serif", fontSize: 12, letterSpacing: '.3em', color: 'var(--mg-taupe)' }}>BEFORE YOU GO</div>
              <div style={{ fontFamily: 'Prata, serif', fontSize: 24, color: 'var(--mg-ink)', textAlign: 'center' }}>How was your visit?</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {RATING_LABELS.map((label, i) => {
                  const n = i + 1
                  const active = rating === n
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setRating(n)}
                      aria-label={label}
                      aria-pressed={active}
                      className="mg-rating"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: active ? '#2c4a73' : 'rgba(255,255,255,.6)', border: '1px solid #2c4a73', padding: '10px 12px', cursor: 'pointer', minWidth: 74 }}
                    >
                      <span style={{ fontFamily: 'Prata, serif', fontSize: 18, color: active ? '#f2ead9' : '#2c4a73' }}>{n}</span>
                      <span style={{ fontFamily: "'Marcellus SC', serif", fontSize: 9, letterSpacing: '.14em', color: active ? '#cfd9e8' : '#7a6c50' }}>{label}</span>
                    </button>
                  )
                })}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="A line or two for the management…"
                rows={4}
                style={{ width: '100%', background: '#fff', border: '1px solid #2c4a73', color: '#22314a', fontFamily: 'Marcellus, serif', fontSize: 15, lineHeight: 1.6, padding: '14px 16px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
              <button type="button" onClick={submitSurvey} className="mg-btn" style={{ padding: '14px 34px', fontSize: 12, letterSpacing: '.26em' }}>
                 SUBMIT FEEDBACK
              </button>
              <button type="button" onClick={returnToLobby} style={{ fontFamily: "'Marcellus SC', serif", fontSize: 11, letterSpacing: '.22em', color: 'var(--mg-taupe)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
                SKIP — RETURN TO THE MAIN PAGE
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '48px 60px 58px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Prata, serif', fontSize: 24, color: 'var(--mg-ink)' }}>Noted, with thanks.</div>
              <div className="mg-italic" style={{ fontSize: 15, maxWidth: 400, lineHeight: 1.7 }}>
                Your entry has been received. Thank you for your feedback.
              </div>
              <button type="button" onClick={returnToLobby} className="mg-btn" style={{ marginTop: 8, padding: '14px 34px', fontSize: 12, letterSpacing: '.26em' }}>
                RETURN TO THE MAIN PAGE
              </button>
            </div>
          )}
        </section>
      )}

      <style>{`.mongoose .mg-rating:hover { background: rgba(44,74,115,.12); }`}</style>
    </MongooseLayout>
  )
}

function Field({ label, value, onChange, placeholder, mono, inputMode, maxLength }) {
  return (
    <label className="mg-field">
      <span className="mg-label">{label}</span>
      <input
        className={mono ? 'mg-input mg-input-mono' : 'mg-input'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
      />
    </label>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Marcellus, serif', fontSize: 13, color: 'var(--mg-body)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
