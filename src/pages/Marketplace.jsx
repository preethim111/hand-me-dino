import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Heart, CheckCircle, MapPin, Star, ChevronDown, SlidersHorizontal, Tag } from 'lucide-react'
import { listings, categories } from '../data/mockListings'

const conditions  = ['All', 'Like New', 'Excellent', 'Good', 'Fair']
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Saved']

function TypeBadge({ type }) {
  const m = {
    buy:    { label:'Buy',    cls:'bg-brand-teal-pale   text-brand-teal    border-brand-teal/30'  },
    rent:   { label:'Rent',   cls:'bg-brand-green-pale  text-brand-green-dark border-brand-green/30'},
    borrow: { label:'Borrow', cls:'bg-amber-50           text-amber-700     border-amber-200'     },
  }
  const { label, cls } = m[type]
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

function ConditionDot({ condition }) {
  const c = {
    'Like New': 'bg-brand-teal',
    'Excellent':'bg-brand-green-dark',
    'Good':     'bg-yellow-500',
    'Fair':     'bg-amber-500',
  }[condition] || 'bg-gray-400'
  return (
    <span className="flex items-center gap-1.5 text-xs text-brand-teal-dark">
      <span className={`w-2 h-2 rounded-full ${c}`} />
      {condition}
    </span>
  )
}

function ProductModal({ listing, onClose }) {
  if (!listing) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <div className={`${listing.bgColor} h-52 flex items-center justify-center relative`}>
          <span className="text-9xl">{listing.emoji}</span>
          {listing.certified && (
            <div className="absolute top-4 left-4 bg-brand-teal text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle size={13} /> Certified
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display font-bold text-xl text-brand-dark leading-snug">{listing.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <TypeBadge type={listing.type} />
                <ConditionDot condition={listing.condition} />
              </div>
            </div>
            <div className="text-right">
              {listing.type === 'borrow' ? (
                <span className="text-2xl font-bold text-amber-600">Free</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-brand-dark">
                    ${listing.price}
                    {listing.priceUnit && <span className="text-base font-normal text-brand-teal-dark">/{listing.priceUnit}</span>}
                  </span>
                  <div className="text-xs text-gray-400 line-through">${listing.originalPrice} retail</div>
                </>
              )}
            </div>
          </div>

          <p className="text-brand-teal-dark text-sm leading-relaxed mb-4">{listing.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-brand-cream rounded-xl p-3">
              <div className="text-xs text-brand-beige mb-0.5 font-medium">Age Range</div>
              <div className="font-semibold text-brand-dark">{listing.ageRange}</div>
            </div>
            <div className="bg-brand-cream rounded-xl p-3">
              <div className="text-xs text-brand-beige mb-0.5 font-medium">Location</div>
              <div className="font-semibold text-brand-dark flex items-center gap-1">
                <MapPin size={12} /> {listing.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <div className="text-2xl">{listing.emoji}</div>
            <div>
              <div className="font-semibold text-brand-dark text-sm">{listing.seller}</div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-brand-teal-dark">{listing.sellerRating} · Listed {listing.listed}</span>
              </div>
            </div>
            <div className="ml-auto bg-brand-teal-pale text-brand-teal text-xs font-semibold px-3 py-1.5 rounded-xl">
              🌿 {listing.plasticSaved} plastic saved
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {listing.tags.map(tag => (
              <span key={tag} className="bg-brand-cream text-brand-teal-dark text-xs px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors">
              {listing.type === 'buy' ? '🛒 Buy Now' : listing.type === 'rent' ? '📅 Rent Now' : '🤝 Request Borrow'}
            </button>
            <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ listing, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-brand-teal/10 overflow-hidden card-hover flex flex-col cursor-pointer"
      onClick={() => onClick(listing)}
    >
      <div className={`${listing.bgColor} h-44 flex items-center justify-center relative`}>
        <span className="text-7xl">{listing.emoji}</span>
        {listing.certified && (
          <span className="absolute top-3 left-3 bg-brand-teal text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Certified
          </span>
        )}
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
        >
          <Heart size={14} className="text-gray-400" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <TypeBadge type={listing.type} />
          <ConditionDot condition={listing.condition} />
        </div>
        <h3 className="font-semibold text-brand-dark text-sm leading-snug mb-1">{listing.title}</h3>
        <p className="text-xs text-brand-teal-dark mb-3 line-clamp-2 flex-1">{listing.description}</p>
        <div className="text-xs text-brand-beige flex items-center gap-1 mb-3">
          <MapPin size={11} /> {listing.location} · {listing.listed}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-brand-cream">
          <div>
            {listing.type === 'borrow' ? (
              <span className="text-base font-bold text-amber-600">Free Borrow</span>
            ) : (
              <span className="text-base font-bold text-brand-dark">
                ${listing.price}
                {listing.priceUnit && <span className="text-sm font-normal text-brand-teal-dark">/{listing.priceUnit}</span>}
              </span>
            )}
          </div>
          <span className="text-xs text-brand-teal font-medium">🌿 {listing.plasticSaved}</span>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('all')
  const [catFilter,   setCatFilter]   = useState('All')
  const [condFilter,  setCondFilter]  = useState('All')
  const [sort,        setSort]        = useState('Newest')
  const [selected,    setSelected]    = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let r = [...listings]
    if (search)
      r = r.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
      )
    if (typeFilter !== 'all') r = r.filter(l => l.type === typeFilter)
    if (catFilter  !== 'All') r = r.filter(l => l.category === catFilter)
    if (condFilter !== 'All') r = r.filter(l => l.condition === condFilter)
    if (sort === 'Price: Low to High')  r.sort((a,b) => (a.price||0)-(b.price||0))
    if (sort === 'Price: High to Low')  r.sort((a,b) => (b.price||0)-(a.price||0))
    if (sort === 'Most Saved')          r.sort((a,b) => b.saved-a.saved)
    return r
  }, [search, typeFilter, catFilter, condFilter, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
          🛒 Marketplace
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl text-brand-dark">Baby Gear, Renewed.</h1>
            <p className="text-brand-teal-dark mt-1">{listings.length} certified listings · All professionally cleaned</p>
          </div>
          <Link
            to="/sell"
            className="flex items-center gap-2 bg-brand-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors shadow-sm whitespace-nowrap"
          >
            <Tag size={16} /> Sell Your Gear
          </Link>
        </div>
      </div>

      {/* Sell CTA banner */}
      <div className="bg-brand-teal-pale border border-brand-teal/20 rounded-2xl px-6 py-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-brand-dark text-sm">Have gear your baby has outgrown?</p>
          <p className="text-brand-teal-dark text-xs mt-0.5">Upload a photo — our AI handles the listing. We pick it up for free.</p>
        </div>
        <Link to="/sell" className="flex-shrink-0 bg-brand-teal text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-teal-dark transition-colors">
          List Your Items →
        </Link>
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all','buy','rent','borrow'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              typeFilter === t
                ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                : 'bg-white text-brand-dark border-brand-teal/20 hover:border-brand-teal hover:text-brand-teal'
            }`}
          >
            {t === 'all' ? '🔍 All' : t === 'buy' ? '🛒 Buy' : t === 'rent' ? '📅 Rent' : '🤝 Borrow'}
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-beige" />
          <input
            type="text"
            placeholder="Search products, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-teal/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-beige hover:text-brand-dark">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            showFilters ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white border-brand-teal/20 text-brand-dark hover:border-brand-teal'
          }`}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="appearance-none pl-4 pr-8 py-3 rounded-xl border border-brand-teal/20 bg-white text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-teal/30 cursor-pointer"
          >
            {sortOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-beige pointer-events-none" />
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white border border-brand-teal/10 rounded-2xl p-5 mb-5 shadow-sm animate-fadeInUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      catFilter === c
                        ? 'bg-brand-teal text-white border-brand-teal'
                        : 'bg-brand-cream text-brand-dark border-brand-teal/10 hover:border-brand-teal'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map(c => (
                  <button
                    key={c}
                    onClick={() => setCondFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      condFilter === c
                        ? 'bg-brand-teal text-white border-brand-teal'
                        : 'bg-brand-cream text-brand-dark border-brand-teal/10 hover:border-brand-teal'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(catFilter !== 'All' || condFilter !== 'All') && (
            <button
              onClick={() => { setCatFilter('All'); setCondFilter('All') }}
              className="mt-4 text-xs text-red-500 font-semibold flex items-center gap-1 hover:underline"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-brand-teal-dark">
          Showing <span className="font-semibold text-brand-dark">{filtered.length}</span> of {listings.length} listings
        </p>
        {(search || typeFilter !== 'all' || catFilter !== 'All' || condFilter !== 'All') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setCatFilter('All'); setCondFilter('All') }}
            className="text-xs text-red-500 font-semibold flex items-center gap-1 hover:underline"
          >
            <X size={13} /> Clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(l => <ProductCard key={l.id} listing={l} onClick={setSelected} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🦕</div>
          <h3 className="font-display font-bold text-xl text-brand-dark mb-2">No listings found</h3>
          <p className="text-brand-teal-dark mb-6">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setCatFilter('All'); setCondFilter('All') }}
            className="bg-brand-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-teal-dark transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <ProductModal listing={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
