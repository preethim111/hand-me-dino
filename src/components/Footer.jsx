import { Link } from 'react-router-dom'
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-teal-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl select-none">🦕</span>
              <div>
                <span className="font-display font-bold text-2xl text-white">HandMe</span>
                <span className="font-display font-bold text-2xl text-brand-green">Dino</span>
              </div>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed max-w-xs mb-2">
              Easy secondhand baby gear.
            </p>
            <p className="text-brand-green font-semibold italic mb-5 text-sm">
              "It's Just a Phase."
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-brand-teal rounded-lg hover:bg-brand-teal-light transition-colors">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4 text-teal-200 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2 text-teal-300 text-sm">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/sell"        className="hover:text-white transition-colors">Sell Your Gear</Link></li>
              <li><Link to="/impact"      className="hover:text-white transition-colors">Why HandMeDino?</Link></li>
              <li><Link to="/faq"         className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-teal-200 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2 text-teal-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cleaning Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-brand-teal mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-teal-400 text-xs">© 2026 HandMeDino, Inc. · San Diego, CA</p>
          <p className="text-teal-400 text-xs flex items-center gap-1.5">
            Made with <Heart size={12} className="text-brand-beige fill-brand-beige" /> for a greener future
          </p>
        </div>
      </div>
    </footer>
  )
}
