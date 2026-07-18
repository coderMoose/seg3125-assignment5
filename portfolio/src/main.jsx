import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CleanBeaks from './CleanBeaks.jsx'
import SpeedyMemory from './SpeedyMemory.jsx'
import { CartProvider } from './mongoose/CartContext.jsx'
import MongooseHome from './mongoose/Home.jsx'
import MongooseShop from './mongoose/Shop.jsx'
import MongooseProduct from './mongoose/Product.jsx'
import MongooseCart from './mongoose/Cart.jsx'
import MongooseCheckout from './mongoose/Checkout.jsx'
import NbaDashboard from './nba/NbaDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/clean-beaks" element={<CleanBeaks />} />
        <Route path="/speedy-memory" element={<SpeedyMemory />} />
        <Route path="/nba-analytics" element={<NbaDashboard />} />
        <Route
          path="/mongoose/*"
          element={
            <CartProvider>
              <Routes>
                <Route index element={<MongooseHome />} />
                <Route path="shop" element={<MongooseShop />} />
                <Route path="product/:slug" element={<MongooseProduct />} />
                <Route path="cart" element={<MongooseCart />} />
                <Route path="checkout" element={<MongooseCheckout />} />
              </Routes>
            </CartProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
