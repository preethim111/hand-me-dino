import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Leaf, Star, ShoppingBag, RefreshCw } from 'lucide-react'
import { listings } from '../data/mockListings'

/* Baby development stages with product focus areas */
const stages = [
  {
    id: 'newborn',
    label: 'Newborn',
    range: '0–3 months',
    months: [0, 3],
    emoji: '👶',
    color: 'bg-pink-50 border-pink-200',
    accent: 'text-pink-700',
    essentials: ['Bouncer', 'Swing', 'Monitor', 'Feeding', 'Crib'],
    upcoming: ['Carrier', 'Activity Gym'],
    tip: 'Babies grow so fast in the first 3 months — renting swings and bouncers is almost always more cost-effective than buying.',
  },
  {
    id: 'early_infant',
    label: 'Early Infant',
    range: '3–6 months',
    months: [3, 6],
    emoji: '🤲',
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-700',
    essentials: ['Carrier', 'Toys', 'Bouncer'],
    upcoming: ['High Chair', 'Bath'],
    tip: 'Carriers are wonderful now but babies outgrow them in a few months. Consider a certified secondhand ergobaby to save 60%+.',
  },
  {
    id: 'sitting',
    label: 'Sitting Stage',
    range: '6–9 months',
    months: [6, 9],
    emoji: '🧸',
    color: 'bg-yellow-50 border-yellow-200',
    accent: 'text-yellow-700',
    essentials: ['High Chair', 'Bath', 'Toys'],
    upcoming: ['Travel', 'Toys'],
    tip: 'Starting solids? A quality high chair is one worth buying secondhand — you\'ll use it for 2+ years.',
  },
  {
    id: 'crawler',
    label: 'Crawler',
    range: '9–12 months',
    months: [9, 12],
    emoji: '🏃',
    color: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-700',
    essentials: ['Toys', 'Travel'],
    upcoming: ['Stroller', 'Clothing'],
    tip: 'The crawler stage is all about exploration. Borrowing toy sets for 2–3 months is perfect at this age.',
  },
  {
    id: 'toddler_young',
    label: 'Young Toddler',
    range: '12–18 months',
    months: [12, 18],
    emoji: '🚶',
    color: 'bg-purple-50 border-purple-200',
    accent: 'text-purple-700',
    essentials: ['Stroller', 'Clothing', 'Toys'],
    upcoming: ['Car Seat'],
    tip: 'Time for a convertible car seat upgrade! Buy certified secondhand and save hundreds vs. retail.',
  },
  {
    id: 'toddler',
    label: 'Toddler',
    range: '18–36 months',
    months: [18, 36],
    emoji: '🎒',
    color: 'bg-green-50 border-green-200',
    accent: 'text-green-700',
    essentials: ['Toys', 'Clothing', 'Car Seat'],
    upcoming: [],
    tip: 'Toddlers destroy (and love) toys. Buying certified secondhand toys saves money and keeps plastic in circulation.',
  },
]

const envBenefits = [
  { icon: '🌊', stat: '~2.4 kg', label: 'plastic diverted from oceans' },
  { icon: '💰', stat: '~65%',   label: 'saved vs. buying new' },
  { icon: '♻️', stat: '4–6',   label: 'products renewed this year' },
]

function ProductRecommendation({ listing, type }) {
  const typeLabel = type === 'rent' ? 'Rent' : type === 'borrow' ? 'Borrow' : 'Buy'
  const typeColor =
    type === 'rent'   ? 'bg-blue-100  text-blue-700'   :
    type === 'borrow' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`${listing.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
        {listing.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColor}`}>{typeLabel}</span>
          {listing.certified && (
            <span className="text-xs text-green-700 font-semibold flex items-center gap-0.5">
              <CheckCircle size={10} /> Certified
            </span>
          )}
        </div>
        <p className="font-semibold text-gray-900 text-sm leading-snug truncate">{listing.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">🌿 {listing.plasticSaved} plastic saved</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-gray-900">
          {listing.type === 'borrow' ? 'Free'
            : `$${listing.price}${listing.priceUnit ? `/${listing.priceUnit}` : ''}`}
        </div>
        <Link
          to="/marketplace"
          className="text-xs text-green-700 font-semibold hover:underline"
        >
          View →
        </Link>
      </div>
    </div>
  )
}

function PlanResults({ name, ageMonths }) {
  const stage = stages.find(s => ageMonths >= s.months[0] && ageMonths < s.months[1]) || stages[stages.length - 1]
  const nextStageIdx = stages.findIndex(s => s.id === stage.id) + 1
  const nextStage = stages[nextStageIdx] || null

  // Filter marketplace listings relevant to current stage
  const currentListings = listings.filter(l =>
    stage.essentials.some(cat => l.category === cat)
  ).slice(0, 4)

  const upcomingListings = nextStage
    ? listings.filter(l => nextStage.essentials.some(cat => l.category === cat)).slice(0, 3)
    : []

  // Recommend rent vs buy
  const withRecommendation = currentListings.map(l => {
    const usageMonths = stage.months[1] - stage.months[0]
    const rentVsBuyBetter = l.rentPrice && l.rentPrice * usageMonths < l.price
    return {
      ...l,
      recommended: rentVsBuyBetter ? 'rent' : l.price === 0 ? 'borrow' : 'buy',
    }
  })

  return (
    <div className="animate-fadeInUp">
      {/* Stage banner */}
      <div className={`${stage.color} border rounded-2xl p-6 mb-8 text-center`}>
        <div className="text-5xl mb-2">{stage.emoji}</div>
        <h3 className="font-display font-bold text-2xl text-gray-900">
          {name ? `${name} is in the ` : 'Your baby is in the '}
          <span className={stage.accent}>{stage.label} Stage</span>
        </h3>
        <p className="text-gray-600 text-sm mt-1">{stage.range}</p>
        <div className="bg-white/70 border border-white rounded-xl p-3 mt-4 max-w-md mx-auto">
          <p className="text-gray-700 text-sm leading-relaxed italic">💡 {stage.tip}</p>
        </div>
      </div>

      {/* Environmental impact of this plan */}
      <div className="bg-green-800 text-white rounded-2xl p-6 mb-8">
        <h3 className="font-display font-bold text-lg mb-4 text-center">
          Your Estimated Annual Impact
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {envBenefits.map((b, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="font-display font-bold text-xl text-green-300">{b.stat}</div>
              <div className="text-green-200 text-xs mt-1">{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current stage recommendations */}
      <div className="mb-8">
        <h3 className="font-display font-bold text-xl text-gray-900 mb-1 flex items-center gap-2">
          <span className="text-2xl">🛒</span> For Right Now
        </h3>
        <p className="text-gray-500 text-sm mb-4">Products perfect for the {stage.label} stage.</p>
        <div className="space-y-3">
          {withRecommendation.length > 0
            ? withRecommendation.map(l => (
                <ProductRecommendation key={l.id} listing={l} type={l.recommended} />
              ))
            : <p className="text-gray-400 text-sm">No matching listings right now — check back soon!</p>
          }
        </div>
      </div>

      {/* Upcoming recommendations */}
      {nextStage && upcomingListings.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display font-bold text-xl text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-2xl">⏭️</span> Coming Up: {nextStage.label} Stage
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Start planning ahead for {nextStage.range}.
          </p>
          <div className="space-y-3">
            {upcomingListings.map(l => (
              <ProductRecommendation key={l.id} listing={l} type={l.type} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🦕</div>
        <h4 className="font-display font-bold text-lg text-gray-900 mb-2">
          Ready to start saving?
        </h4>
        <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
          Browse your personalized picks in the marketplace or list items your baby has outgrown.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/marketplace"
            className="flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <ShoppingBag size={16} /> Shop Now
          </Link>
          <Link
            to="/sell"
            className="flex items-center justify-center gap-2 border-2 border-green-800 text-green-800 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
          >
            <RefreshCw size={16} /> Sell Your Items
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PersonalizedPlan() {
  const [step,       setStep]       = useState(1)
  const [babyName,   setBabyName]   = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear,  setBirthYear]  = useState('')

  const getAgeMonths = () => {
    if (!birthMonth || !birthYear) return 0
    const now   = new Date()
    const birth = new Date(parseInt(birthYear), parseInt(birthMonth) - 1)
    const diff  = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    return Math.max(0, Math.min(diff, 36))
  }

  const ageMonths = getAgeMonths()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i)
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]

  const canSubmit = birthMonth && birthYear

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Star size={14} /> Personalized Baby Plan
        </div>
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-3">
          Your Baby's Circular Journey
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Tell us about your baby and we'll create a personalized sustainable product plan —
          showing you what to rent, borrow, or buy at every stage.
        </p>
      </div>

      {step === 1 ? (
        <div className="max-w-md mx-auto animate-fadeInUp">
          <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
            {/* Baby name */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Baby's Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="E.g. Oliver, Luna..."
                value={babyName}
                onChange={e => setBabyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Birth month */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Birth Month <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setBirthMonth(String(i + 1))}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                      birthMonth === String(i + 1)
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-600'
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth year */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Birth Year <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => setBirthYear(String(y))}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      birthYear === String(y)
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-600'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Age preview */}
            {canSubmit && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-5 flex items-center gap-2">
                <Leaf size={16} className="text-green-600" />
                <p className="text-green-800 text-sm font-semibold">
                  {ageMonths === 0
                    ? 'Welcome to the world, little one! 🎉'
                    : `${babyName || 'Your baby'} is about ${ageMonths} months old.`}
                </p>
              </div>
            )}

            <button
              disabled={!canSubmit}
              onClick={() => setStep(2)}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                canSubmit
                  ? 'bg-green-800 text-white hover:bg-green-700 shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Generate My Plan <ArrowRight className="inline ml-1" size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 font-medium"
            >
              ← Edit Profile
            </button>
            <div className="text-sm text-gray-500">
              Plan for <strong className="text-gray-900">{babyName || 'your baby'}</strong> · {ageMonths} months old
            </div>
          </div>
          <PlanResults name={babyName} ageMonths={ageMonths} />
        </div>
      )}
    </div>
  )
}
