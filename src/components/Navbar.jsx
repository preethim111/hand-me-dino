import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname }    = useLocation()

  const links = [
    { to: '/',            label: 'Home'        },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/impact',      label: 'Why Us'      },
    { to: '/faq',         label: 'FAQ'         },
  ]

  const active = (path) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-brand-teal/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110 select-none">🦕</span>
            <div className="leading-tight">
              <span className="font-display font-bold text-xl text-brand-teal">HandMe</span>
              <span className="font-display font-bold text-xl text-brand-green-dark">Dino</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active(l.to)
                    ? 'bg-brand-teal-pale text-brand-teal-dark font-semibold'
                    : 'text-brand-dark hover:bg-brand-teal-pale hover:text-brand-teal'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/sell"
              className="flex items-center gap-2 bg-brand-teal text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-teal-dark transition-colors shadow-sm"
            >
              Sell Your Gear 🍼
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-brand-dark hover:bg-brand-teal-pale transition-colors"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-brand-teal/10 animate-fadeInUp">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  active(l.to)
                    ? 'bg-brand-teal-pale text-brand-teal-dark font-semibold'
                    : 'text-brand-dark hover:bg-brand-teal-pale'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/sell"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center mt-2 bg-brand-teal text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-brand-teal-dark transition-colors"
            >
              Sell Your Gear 🍼
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
