import { Link } from 'react-router-dom'
import { MongooseLayout, Swatch } from './components.jsx'
import { PRODUCTS } from './data.js'

/**
 * Shop — "All nine, filed in order." Full 3x3 catalog grid.
 * Divider logic matches the design file: right border on every cell except
 * the last column, bottom border on every cell except the last row.
 */
export default function Shop() {
  return (
    <MongooseLayout active="shop">
      {/* Page title */}
      <section
        className="mg-divide-b"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          padding: '48px 60px 12px',
          textAlign: 'center',
        }}
      >
        <div className="mg-kicker">THE COLLECTION · SUMMER MMXXVI</div>
        <h1 className="mg-display" style={{ fontSize: 44 }}>
          Our handkerchiefs
        </h1>
        <div
          className="mg-body"
          style={{ fontSize: 16, color: 'var(--mg-taupe)', maxWidth: 520, lineHeight: 1.6 }}
        >
          * Each available with our three-letter monogram service.
        </div>
      </section>

      {/* 3x3 grid of all nine products */}
      <div className="mg-grid-3">
        {PRODUCTS.map((p, i) => (
          <Link
            key={p.no}
            to={`/mongoose/product/${p.slug}`}
            className="mg-cell"
            style={{
              borderRight: i % 3 === 2 ? 'none' : '1px solid #2c4a73',
              borderBottom: i < 6 ? '1px solid #2c4a73' : 'none',
            }}
          >
            {p.badge ? (
              <span className={`mg-badge mg-badge-${p.badge}`}>{p.badge}</span>
            ) : null}
            <div className="mg-mono">NO. {p.no}</div>
            <Swatch swatch={p.swatch} size={200} />
            <div className="mg-cell-name">{p.name}</div>
            <div className="mg-cell-blurb">{p.blurb}</div>
            <div className="mg-cell-price">${p.price}</div>
          </Link>
        ))}
      </div>
    </MongooseLayout>
  )
}
