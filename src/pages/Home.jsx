import { Link } from 'react-router-dom'
import { ArrowRight, Check, Sparkles, Truck, Shield, Star } from 'lucide-react'

/* ── Baby-motif decorative background ── */
function Motifs() {
  const items = [
    { emoji:'🍼', top:'8%',  left:'4%',  size:'3xl', delay:'0s',   opacity:'opacity-20' },
    { emoji:'🌙', top:'12%', right:'6%', size:'4xl', delay:'1s',   opacity:'opacity-15' },
    { emoji:'🧸', bottom:'18%',left:'3%',size:'3xl', delay:'2s',   opacity:'opacity-20' },
    { emoji:'⭐', bottom:'10%',right:'5%',size:'3xl',delay:'0.5s', opacity:'opacity-15' },
    { emoji:'🎀', top:'45%', left:'2%',  size:'2xl', delay:'1.5s', opacity:'opacity-10' },
    { emoji:'🦆', top:'30%', right:'2%', size:'2xl', delay:'2.5s', opacity:'opacity-10' },
    { emoji:'🍭', bottom:'35%',right:'3%',size:'xl', delay:'3s',   opacity:'opacity-10' },
    { emoji:'🎵', top:'65%', left:'5%',  size:'xl',  delay:'3.5s', opacity:'opacity-10' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {items.map((m, i) => (
        <span
          key={i}
          className={`motif text-${m.size} ${m.opacity} animate-float hidden lg:block`}
          style={{
            top: m.top, bottom: m.bottom,
            left: m.left, right: m.right,
            animationDelay: m.delay,
          }}
        >
          {m.emoji}
        </span>
      ))}
    </div>
  )
}

/* ── Age bundle data ── */
const bundles = [
  {
    age: '0–3 months',
    name: 'Newborn Nest',
    emoji: '🛏️',
    color: 'bg-brand-teal-pale border-brand-teal/30',
    headerBg: 'bg-brand-teal',
    price: 89,
    savings: 620,
    items: [
      '🛏️  Bassinet',
      '🍼  4× Baby Bottles',
      '🪀  Bouncer Seat',
      '🧣  3× Swaddle Wraps',
      '😴  2× Sleep Sacks',
      '📟  Baby Monitor',
    ],
  },
  {
    age: '3–6 months',
    name: 'Little Explorer',
    emoji: '🧸',
    color: 'bg-brand-green-pale border-brand-green/30',
    headerBg: 'bg-brand-green-dark',
    price: 79,
    savings: 490,
    items: [
      '🤸  Activity Gym',
      '🎒  Baby Carrier',
      '🦷  2× Teethers',
      '🧸  3× Soft Toys',
      '🪑  Bumbo Floor Seat',
    ],
  },
  {
    age: '6–9 months',
    name: 'Growing Adventurer',
    emoji: '🪑',
    color: 'bg-amber-50 border-brand-beige/40',
    headerBg: 'bg-brand-beige',
    price: 99,
    savings: 730,
    items: [
      '🪑  High Chair',
      '🛁  Baby Bath Seat',
      '🐠  Bath Toy Set (5pc)',
      '📚  5× Board Books',
      '🏗️  Stacking Blocks',
    ],
  },
  {
    age: '9–12 months',
    name: 'First Steps',
    emoji: '🚶',
    color: 'bg-rose-50 border-rose-200/50',
    headerBg: 'bg-rose-400',
    price: 109,
    savings: 810,
    items: [
      '🚶  Push Walker',
      '🎭  Play Yard / Gate',
      '🔵  Shape Sorter',
      '🎵  Musical Toy',
      '🧩  Baby-safe Puzzles',
    ],
  },
]

/* ── How it works ── */
const steps = [
  { icon:'🛒', title:'Browse & Select', desc:'Pick the bundle that matches your baby\'s age. We bring it to your door.' },
  { icon:'✨', title:'Arrive Spotless',  desc:'Every item is professionally cleaned and safety-checked before delivery.' },
  { icon:'♻️', title:'Return & Renew',  desc:'Outgrown it? Schedule a free pickup. Items go to the next family.' },
]

export default function Home() {
  return (
    <div>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative hero-bg py-24 md:py-32 overflow-hidden">
        <Motifs />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-brand-teal/30 text-brand-teal px-5 py-2 rounded-full text-sm font-semibold shadow-sm mb-8">
            <span>🦕</span>
            HandMeDino · San Diego, CA
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-6xl md:text-7xl text-brand-dark leading-tight mb-4">
            Easy Secondhand
            <br />
            <span className="text-gradient-teal">Baby Gear.</span>
          </h1>

          {/* Tagline */}
          <p className="font-display text-2xl md:text-3xl text-brand-beige font-semibold italic mb-6">
            "It's Just a Phase."
          </p>

          {/* Sub */}
          <p className="text-brand-teal-dark text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Rent, borrow, or buy certified-clean baby products for every stage of your little one's first year.
            We deliver. You enjoy. We take back and renew. No waste, no clutter, no stress.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="#bundles" className="flex items-center gap-2 bg-brand-teal text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-teal-dark transition-colors shadow-md">
              Shop Age Bundles <ArrowRight size={20} />
            </a>
            <Link to="/sell" className="flex items-center gap-2 bg-white text-brand-teal border-2 border-brand-teal px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-teal-pale transition-colors">
              Sell Your Gear
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm text-brand-teal-dark">
            {['🧼 All orders professionally cleaned','🚚 Free pickup & delivery','⭐ Certified quality guarantee'].map((t,i)=>(
              <span key={i} className="bg-white/80 border border-brand-teal/20 px-4 py-1.5 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS (brief)
      ══════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-3xl text-brand-dark text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brand-teal-pale rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">{s.title}</h3>
                <p className="text-brand-teal-dark text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AGE BUNDLES
      ══════════════════════════════════════ */}
      <section id="bundles" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              🧸 Age-Based Bundles
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-dark mb-4">
              Everything They Need,<br />For Every Phase.
            </h2>
            <p className="text-brand-teal-dark max-w-xl mx-auto leading-relaxed">
              Curated sets of cleaned, certified gear delivered right to your door.
              Return when they outgrow it — we take care of the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((b, i) => (
              <div
                key={i}
                className={`${b.color} border rounded-3xl overflow-hidden shadow-sm card-hover flex flex-col`}
              >
                {/* Card header */}
                <div className={`${b.headerBg} px-5 py-5 text-white`}>
                  <div className="text-4xl mb-2">{b.emoji}</div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">{b.age}</div>
                  <div className="font-display font-bold text-xl">{b.name}</div>
                </div>

                {/* Items list */}
                <div className="px-5 py-5 flex-1">
                  <ul className="space-y-2">
                    {b.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-brand-dark">
                        <span className="text-brand-teal flex-shrink-0">
                          <Check size={14} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="px-5 pb-5">
                  <div className="bg-white/80 rounded-2xl p-4 mb-4">
                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-display font-bold text-3xl text-brand-dark">${b.price}</span>
                      <span className="text-brand-teal-dark text-sm mb-1 font-medium">/month</span>
                    </div>
                    <div className="text-xs text-brand-beige font-semibold">
                      Save ~${b.savings} vs. buying new
                    </div>
                  </div>
                  <Link
                    to="/marketplace"
                    className="block w-full bg-brand-teal text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-brand-teal-dark transition-colors"
                  >
                    Get This Bundle
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* All orders cleaned badge */}
          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-brand-teal/20 text-brand-teal px-6 py-3 rounded-full text-sm font-semibold shadow-sm">
              🧼 Every order — subscription or not — includes our professional cleaning &amp; sanitization service.
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUBSCRIPTION PLAN
      ══════════════════════════════════════ */}
      <section className="py-20 bg-brand-teal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                <Sparkles size={14} /> HandMeDino+
              </div>
              <h2 className="font-display font-bold text-4xl mb-4">
                Subscribe &amp; Save
              </h2>
              <p className="text-teal-100 leading-relaxed mb-6 text-lg">
                For just $10/month, unlock free shipping on every order you place —
                whether it's a full bundle, individual items, or accessories.
              </p>
              <div className="bg-white/15 border border-white/20 rounded-2xl p-4 mb-6">
                <p className="text-teal-100 text-sm leading-relaxed">
                  <strong className="text-white">Reminder:</strong> Every single order — subscriber or not —
                  includes our professional cleaning service. HandMeDino+ simply adds free shipping on top.
                </p>
              </div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-white text-brand-teal px-7 py-3.5 rounded-xl font-bold hover:bg-brand-cream transition-colors shadow-md"
              >
                Start Your Subscription <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-brand-cream-dark">
                <div className="text-5xl mb-2 select-none">✨</div>
                <div className="font-display font-bold text-5xl text-brand-dark">
                  $10
                  <span className="text-xl font-normal text-brand-teal-dark">/month</span>
                </div>
                <div className="text-brand-teal text-sm font-semibold mt-1">HandMeDino+ Membership</div>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 mb-6">
                {[
                  { icon:'🚚', text:'Free shipping on ALL orders'          },
                  { icon:'⚡', text:'Priority access to new arrivals'      },
                  { icon:'🔔', text:'Early sale notifications'             },
                  { icon:'🎁', text:'Members-only discounts'               },
                  { icon:'🧼', text:'Pro cleaning included (everyone gets this!)'},
                ].map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-8 h-8 bg-brand-teal-pale rounded-lg flex items-center justify-center text-base flex-shrink-0">
                      {b.icon}
                    </span>
                    <span className="text-brand-dark font-medium">{b.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/marketplace"
                className="block w-full bg-brand-teal text-white text-center py-4 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors"
              >
                Subscribe for $10/mo
              </Link>
              <p className="text-center text-xs text-brand-teal-dark mt-3">
                Cancel anytime · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY HANDMEDINO TEASER
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green-pale text-brand-green-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🌊 The Bigger Picture
          </div>
          <h2 className="font-display font-bold text-4xl text-brand-dark mb-5">
            Baby Products Are Quietly<br />Polluting Our Planet
          </h2>
          <p className="text-brand-teal-dark max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            90% of toys are plastic. Each person generates 122 kg of plastic waste per year.
            Baby gear has the shortest lifecycle of any consumer category — most lasts less than 6 months
            before it's discarded. HandMeDino keeps it in circulation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/impact"
              className="flex items-center gap-2 bg-brand-teal text-white px-7 py-3.5 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors shadow-md"
            >
              See Our Impact Data <ArrowRight size={18} />
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 border-2 border-brand-teal text-brand-teal px-7 py-3.5 rounded-xl font-bold hover:bg-brand-teal-pale transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-3xl text-brand-dark text-center mb-12">
            What Parents Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                q: '"Saved us over $700 in the first year. The bundles are exactly what you need and nothing you don\'t."',
                name: 'Jessica T.', role: 'Mom of 2, San Diego', emoji: '👩‍👧', stars: 5,
              },
              {
                q: '"I love that I can return when my baby outgrows something. Nothing ends up in a landfill."',
                name: 'Marcus R.', role: 'Dad of twins, La Jolla', emoji: '👨‍👦‍👦', stars: 5,
              },
              {
                q: '"Everything arrived spotlessly clean. I was impressed by the quality of secondhand gear."',
                name: 'Priya K.', role: 'First-time mom, Chula Vista', emoji: '👩', stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-brand-teal/10 rounded-3xl p-7 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-brand-dark text-sm leading-relaxed mb-5 italic">{t.q}</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.emoji}</span>
                  <div>
                    <p className="font-bold text-brand-dark text-sm">{t.name}</p>
                    <p className="text-brand-teal-dark text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
