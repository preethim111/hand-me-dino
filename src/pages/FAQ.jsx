import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  /* ── What We Accept ── */
  {
    section: 'What We Accept',
    icon: '✅',
    items: [
      {
        q: 'What baby products do you accept?',
        a: (
          <div className="space-y-3 text-sm text-brand-teal-dark leading-relaxed">
            <p>We accept gently used baby products that can be safely resold, rented, or refurbished. This includes:</p>
            <ul className="space-y-1.5 ml-4">
              {[
                '🛒  Strollers and travel systems (within manufacturer lifespan)',
                '🚗  Car seats (no accidents, within expiry date)',
                '🛏️  Cribs and bassinets (meeting current safety standards)',
                '🪑  High chairs, bouncers, swings, and rockers',
                '🧸  Toys — hard plastic, wooden, and soft (in good condition)',
                '👕  Clothing (0–24 months, clean, minimal wear)',
                '🍼  Bottles, pumps, and feeding accessories',
                '🎒  Carriers and wraps',
                '📟  Baby monitors and tech accessories',
                '🛁  Bath seats and items',
              ].map((i, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-teal mt-0.5">•</span> {i}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        q: 'What condition do items need to be in?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            We accept items in <strong>Fair to Like New</strong> condition. "Fair" means the item is fully
            functional with minor cosmetic wear. Items with heavy staining, broken parts, missing safety
            components, or strong odors will not pass our eligibility check and will be returned to you
            (or responsibly disposed of with your permission).
          </p>
        ),
      },
      {
        q: "What don't you accept?",
        a: (
          <div className="space-y-2 text-sm text-brand-teal-dark leading-relaxed">
            <p>For safety and hygiene reasons, we cannot accept:</p>
            <ul className="space-y-1.5 ml-4">
              {[
                '❌  Car seats involved in any accident (even minor ones)',
                '❌  Recalled products (we check against the CPSC recall database)',
                '❌  Drop-side cribs (banned since 2011)',
                '❌  Mattresses older than 2 years or with visible wear',
                '❌  Items with mold, heavy staining, or persistent odors',
                '❌  Broken or structurally compromised items missing safety parts',
                '❌  Breast shields or personal-contact pump parts (tubing/motors are fine)',
              ].map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
  },

  /* ── Getting Rid of Products ── */
  {
    section: 'Getting Rid of Your Baby Products',
    icon: '♻️',
    items: [
      {
        q: 'How can I get rid of my unused baby products?',
        a: (
          <div className="space-y-3 text-sm text-brand-teal-dark leading-relaxed">
            <p>There are three easy ways to get your unused gear into the hands of another family:</p>
            <div className="space-y-3">
              {[
                { step:'1', title:'Submit online',   desc:'Use our Sell Your Gear flow — upload a photo and our AI creates the listing for you in seconds. We\'ll confirm eligibility and reach out to schedule pickup.' },
                { step:'2', title:'Schedule pickup', desc:'Once confirmed, we schedule a free doorstep pickup at your convenience. No need to drop anything off.' },
                { step:'3', title:'We take it from here', desc:'We inspect, clean, certify, and list your item. You earn HandMeDino credits toward future rentals or purchases.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 bg-brand-cream rounded-xl p-3">
                  <span className="w-6 h-6 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <strong className="text-brand-dark">{s.title}</strong>
                    <p className="mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        q: 'What happens to items I submit?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            After we pick up your item, it goes through our 6-step certification process: inspection,
            sanitization, repair/renewal, and a final quality check. Certified items are listed on the
            HandMeDino marketplace. If an item doesn't pass inspection, we'll notify you — and can either
            return it or responsibly recycle it. We <strong>never</strong> landfill items we can recycle.
          </p>
        ),
      },
      {
        q: 'Do I get anything for selling my gear?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            Yes! You earn <strong>HandMeDino Credits</strong> for every item we successfully list. Credits can
            be redeemed toward rental bundles, individual product purchases, or subscription fees. The credit
            amount depends on the item's condition and market value — our AI estimates this when you submit.
          </p>
        ),
      },
    ],
  },

  /* ── Subscriptions & Pricing ── */
  {
    section: 'Subscriptions & Pricing',
    icon: '💳',
    items: [
      {
        q: "What's included in the HandMeDino+ subscription?",
        a: (
          <div className="text-sm text-brand-teal-dark leading-relaxed space-y-2">
            <p>HandMeDino+ is our $10/month membership. It includes:</p>
            <ul className="space-y-1.5 ml-4">
              {[
                '🚚  Free shipping on every order (saves $8–$15 per order)',
                '⚡  Priority access to new arrivals before general listing',
                '🔔  Early notifications on sales and limited availability items',
                '🎁  Members-only discounts on select bundles',
              ].map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        q: 'Does every order include cleaning?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            <strong>Yes — absolutely.</strong> Every single order, whether you're a subscriber or not,
            includes our professional cleaning and sanitization service. HandMeDino+ does not gate
            the cleaning service — it simply adds free shipping on top of it.
          </p>
        ),
      },
      {
        q: 'How long can I keep a rental?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            Rentals are billed monthly with no fixed end date. Keep items as long as you need them
            and return them whenever your baby outgrows the phase. We recommend returning items within
            the listed age range so the next family can get full use from them. There's no penalty
            for keeping items longer — just continued monthly billing.
          </p>
        ),
      },
      {
        q: 'Is there a security deposit for rentals?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            No security deposit required. We trust our community. In the event of significant damage
            beyond normal wear, we may apply a small restoration fee (never more than 30% of the item's
            market value). Normal use wear is always expected and covered — babies are messy!
          </p>
        ),
      },
    ],
  },

  /* ── Quality & Safety ── */
  {
    section: 'Quality & Safety',
    icon: '🛡️',
    items: [
      {
        q: 'How do you clean and sanitize products?',
        a: (
          <div className="text-sm text-brand-teal-dark leading-relaxed space-y-2">
            <p>Our cleaning process uses hospital-grade, EPA-registered disinfectants that are non-toxic
            and baby-safe. The process includes:</p>
            <ul className="space-y-1 ml-4">
              {[
                'Surface disinfection with UV sterilization for hard plastics',
                'Machine washing for fabric components (hypoallergenic, fragrance-free detergent)',
                'Steam cleaning for upholstery and soft structures',
                'Mechanical parts lubricated and tested',
                'Final inspection under UV light for any missed spots',
              ].map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        ),
      },
      {
        q: 'Are items safety-checked before delivery?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            Every item goes through our 25-point safety checklist before earning the HandMeDino Certified badge.
            We cross-reference every product against the CPSC recall database. Car seats are checked against
            manufacturer expiry dates. Structural integrity, harness function, brake mechanisms, and all safety
            features are tested individually.
          </p>
        ),
      },
      {
        q: 'What if a rented item breaks or has an issue?',
        a: (
          <p className="text-sm text-brand-teal-dark leading-relaxed">
            Contact us within 48 hours of delivery if you discover any issues. We'll arrange a same-week
            exchange at no cost. For issues that arise during normal use, reach out anytime — we'll assess
            and either repair the item in-place or swap it out. Your baby's safety is our top priority.
          </p>
        ),
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-brand-teal/15 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-brand-teal-pale transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-brand-dark text-sm leading-snug">{q}</span>
        <span className="flex-shrink-0 text-brand-teal">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 pt-2 border-t border-brand-teal/10 animate-fadeInUp">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-teal text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4 select-none">🦕</div>
          <h1 className="font-display font-bold text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-teal-100 text-lg">
            Everything you need to know about HandMeDino — from what we accept to how we clean.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-14">
        {faqs.map((section, si) => (
          <div key={si}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="font-display font-bold text-2xl text-brand-dark">{section.section}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item, qi) => (
                <FAQItem key={qi} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="bg-brand-teal-pale border border-brand-teal/20 rounded-3xl p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-display font-bold text-xl text-brand-dark mb-2">
            Still have questions?
          </h3>
          <p className="text-brand-teal-dark text-sm mb-5">
            Our team typically responds within a few hours. We'd love to help.
          </p>
          <a
            href="mailto:hello@handmedino.com"
            className="inline-flex items-center gap-2 bg-brand-teal text-white px-7 py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors"
          >
            Contact Us →
          </a>
        </div>

        {/* Nav CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/marketplace"
            className="flex items-center justify-between bg-white border border-brand-teal/20 rounded-2xl p-5 hover:bg-brand-teal-pale transition-colors group"
          >
            <div>
              <div className="font-semibold text-brand-dark text-sm">Browse the Marketplace</div>
              <div className="text-brand-teal-dark text-xs mt-1">15+ certified listings</div>
            </div>
            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
          </Link>
          <Link
            to="/sell"
            className="flex items-center justify-between bg-white border border-brand-teal/20 rounded-2xl p-5 hover:bg-brand-teal-pale transition-colors group"
          >
            <div>
              <div className="font-semibold text-brand-dark text-sm">Sell Your Gear</div>
              <div className="text-brand-teal-dark text-xs mt-1">Free pickup · AI listing</div>
            </div>
            <span className="text-2xl group-hover:scale-110 transition-transform">🍼</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
