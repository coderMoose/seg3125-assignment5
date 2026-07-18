// Mongoose storefront data — products, swatch gradients, and pricing constants.
// Swatch gradients are copied verbatim from the design .dc.html logic classes.

export const SWATCHES = {
  // Denim diagonal stripe
  denim:
    'repeating-linear-gradient(45deg,#2c4a73 0,#2c4a73 10px,#3a5a86 10px,#3a5a86 20px)',
  // Cream diagonal stripe
  cream:
    'repeating-linear-gradient(45deg,#e9e2cf 0,#e9e2cf 10px,#d8ceb4 10px,#d8ceb4 20px)',
  // Telegram cross-hatch (mixed)
  mixed:
    'repeating-linear-gradient(0deg,rgba(44,74,115,.35) 0,rgba(44,74,115,.35) 10px,rgba(44,74,115,0) 10px,rgba(44,74,115,0) 20px),repeating-linear-gradient(90deg,#e9e2cf 0,#e9e2cf 10px,#d8ceb4 10px,#d8ceb4 20px)',
  // Window check
  check:
    'repeating-linear-gradient(0deg,rgba(44,74,115,.5) 0,rgba(44,74,115,.5) 2px,rgba(44,74,115,0) 2px,rgba(44,74,115,0) 22px),repeating-linear-gradient(90deg,#e9e2cf 0,#e9e2cf 20px,#c9bd9d 20px,#c9bd9d 22px)',
  // Wide stripe
  stripeWide:
    'repeating-linear-gradient(90deg,#2c4a73 0,#2c4a73 18px,#e9e2cf 18px,#e9e2cf 36px)',
  // Polka dot
  dots:
    'radial-gradient(circle at 10px 10px,#2c4a73 3px,rgba(0,0,0,0) 3.5px),#e9e2cf',
  // Pinstripe
  pinstripe:
    'repeating-linear-gradient(0deg,#2c4a73 0,#2c4a73 26px,#f2ead9 26px,#f2ead9 30px)',
  // Denim diagonal (second act) — used by The Matinée
  border2:
    'repeating-linear-gradient(45deg,#33547f 0,#33547f 14px,#26405f 14px,#26405f 28px)',
  // Denim herringbone
  herring:
    'repeating-linear-gradient(135deg,rgba(233,226,207,.5) 0,rgba(233,226,207,.5) 6px,rgba(233,226,207,0) 6px,rgba(233,226,207,0) 12px),#2c4a73',
}

export const PRODUCTS = [
  { no: 1, slug: 'the-original', name: 'The Original', price: 28, blurb: 'the one that started it all', swatch: 'denim', badge: 'original' },
  { no: 2, slug: 'the-baker', name: 'The Baker', price: 28, blurb: 'soft cream-on-cream stripes', swatch: 'cream'},
  { no: 3, slug: 'the-telegraph', name: 'The Telegraph', price: 32, blurb: 'a crisp blue cross-hatch', swatch: 'mixed', badge: 'new' },
  { no: 4, slug: 'chessboard', name: 'Chessboard', price: 32, blurb: 'a clean window check', swatch: 'check'},
  { no: 5, slug: 'the-sailor', name: 'The Sailor', price: 30, blurb: "a sailor's favourite stripe", swatch: 'stripeWide', badge: 'new' },
  { no: 6, slug: 'polka', name: 'Polka', price: 30, blurb: 'cheerful blue dot on cream', swatch: 'dots' },
  { no: 7, slug: 'the-banker', name: 'The Banker', price: 34, blurb: 'a fine, tidy pinstripe', swatch: 'pinstripe'},
  { no: 8, slug: 'the-traveler', name: 'The Traveler', price: 34, blurb: 'a deep denim twill', swatch: 'border2'},
  { no: 9, slug: 'herringbone', name: 'Herringbone', price: 36, blurb: 'a rugged denim weave', swatch: 'herring', badge: 'new' },
]

export const MONOGRAM_FEE = 6
export const FREE_SHIPPING_THRESHOLD = 60
export const SHIPPING_PRICE = 5

export function productByNo(no) {
  return PRODUCTS.find((p) => p.no === Number(no))
}

export function productBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug)
}
