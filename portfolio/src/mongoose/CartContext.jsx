import { createContext, useContext, useMemo, useState } from 'react'
import {
  MONOGRAM_FEE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_PRICE,
  productByNo,
} from './data.js'

const CartContext = createContext(null)

function normalizeMonogram(monogram) {
  if (!monogram) return null
  const clean = String(monogram)
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
  return clean.length ? clean : null
}

function clampQty(qty) {
  const n = Math.round(Number(qty) || 1)
  return Math.max(1, Math.min(9, n))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem({ productNo, qty = 1, monogram = null }) {
    const product = productByNo(productNo)
    if (!product) return
    const mono = normalizeMonogram(monogram)
    const id = `${productNo}${mono ? `-${mono}` : ''}`
    const addQty = clampQty(qty)
    setItems((prev) => {
      const existing = prev.find((it) => it.id === id)
      if (existing) {
        return prev.map((it) =>
          it.id === id ? { ...it, qty: clampQty(it.qty + addQty) } : it,
        )
      }
      return [
        ...prev,
        {
          id,
          productNo: product.no,
          name: product.name,
          unitPrice: product.price,
          qty: addQty,
          monogram: mono,
        },
      ]
    })
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function setQty(id, qty) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: clampQty(qty) } : it)),
    )
  }

  function clearCart() {
    setItems([])
  }

  const derived = useMemo(() => {
    const count = items.reduce((sum, it) => sum + it.qty, 0)
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0)
    const monogrammedQty = items.reduce(
      (sum, it) => sum + (it.monogram ? it.qty : 0),
      0,
    )
    const monogramFee = MONOGRAM_FEE * monogrammedQty
    const shipping =
      subtotal + monogramFee >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE
    const total = subtotal + monogramFee + shipping
    return { count, subtotal, monogramFee, shipping, total }
  }, [items])

  const value = {
    items,
    addItem,
    removeItem,
    setQty,
    clearCart,
    ...derived,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
