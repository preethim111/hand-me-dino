import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Impact from './pages/Impact'
import SellProduct from './pages/SellProduct'
import FAQ from './pages/FAQ'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-brand-cream">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<Home />}        />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/impact"      element={<Impact />}      />
            <Route path="/sell"        element={<SellProduct />} />
            <Route path="/faq"         element={<FAQ />}         />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
