import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, CheckCircle, ArrowRight, ArrowLeft, Edit2, Calendar, Clock, MapPin, Sparkles, AlertTriangle } from 'lucide-react'
import { getAIResult, categories } from '../data/mockListings'

const conditions  = ['Like New', 'Excellent', 'Good', 'Fair']
const catOptions  = categories.filter(c => c !== 'All')
const timeSlots   = ['Morning (9 am – 12 pm)', 'Afternoon (12 pm – 4 pm)', 'Evening (4 pm – 7 pm)']

const analysisSteps = [
  'Identifying product type...',
  'Checking eligibility criteria...',
  'Assessing condition from photo...',
  'Generating listing details...',
  'Estimating fair market value...',
]

// Products ineligible for resale (safety/hygiene reasons)
const ineligible = ['car seat (post-accident)', 'crib (drop-side)', 'recalled product']

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step < current  ? 'bg-brand-teal-dark text-white'     :
                step === current? 'bg-brand-teal text-white ring-4 ring-green-200' :
                                  'bg-gray-100 text-gray-400'
              }`}
            >
              {step < current ? <CheckCircle size={18} /> : step}
            </div>
            {step < total && (
              <div className={`h-1 w-10 rounded-full transition-all ${step < current ? 'bg-brand-teal-dark' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ───────────── Step 1: Upload ───────────── */
function StepUpload({ onNext }) {
  const [file,       setFile]       = useState(null)
  const [dragging,   setDragging]   = useState(false)
  const [category,   setCategory]   = useState('')
  const [condition,  setCondition]  = useState('')
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) setFile(f)
  }

  const canProceed = file && category && condition

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📸</div>
        <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">List Your Item</h2>
        <p className="text-gray-500">Upload a photo and our AI will take care of the rest.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-5 ${
          dragging
            ? 'border-brand-teal bg-brand-teal-pale'
            : file
            ? 'border-brand-teal bg-brand-teal-pale'
            : 'border-gray-200 bg-white hover:border-brand-teal hover:bg-brand-teal-pale/50'
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
        {file ? (
          <div>
            <div className="text-4xl mb-2">✅</div>
            <p className="font-semibold text-brand-teal">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(0)} KB — click to replace
            </p>
          </div>
        ) : (
          <div>
            <Upload size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-700">Drop your photo here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Category</label>
        <div className="relative">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40 appearance-none"
          >
            <option value="">Select a category...</option>
            {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Condition</label>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map(c => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                condition === c
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal'
              }`}
            >
              {c === 'Like New'  ? '⭐ Like New'  :
               c === 'Excellent' ? '✅ Excellent' :
               c === 'Good'      ? '👍 Good'      :
                                   '🆗 Fair'}
            </button>
          ))}
        </div>
      </div>

      {/* Eligibility note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-xs leading-relaxed">
          We only accept items that can be safely resold, rented, or refurbished.
          Post-accident car seats, recalled items, and certain hygiene products are not eligible.
        </p>
      </div>

      <button
        disabled={!canProceed}
        onClick={() => onNext({ file, category, condition })}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
          canProceed
            ? 'bg-brand-teal text-white hover:bg-brand-teal-dark shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Check Eligibility & Analyze →
      </button>
    </div>
  )
}

/* ───────────── Step 2: AI Analysis ───────────── */
function StepAnalysis({ uploadData, onDone }) {
  const [completed, setCompleted] = useState([])
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const delays = [600, 1300, 2100, 2900, 3600]
    const timers = delays.map((d, i) =>
      setTimeout(() => setCompleted(prev => [...prev, i]), d)
    )
    const finish = setTimeout(() => {
      setDone(true)
      setTimeout(() => onDone(getAIResult(uploadData.category, uploadData.condition)), 800)
    }, 4600)
    return () => { timers.forEach(clearTimeout); clearTimeout(finish) }
  }, [])

  return (
    <div className="max-w-md mx-auto text-center animate-fadeInUp">
      <div className="text-6xl mb-4 animate-float">🤖</div>
      <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">
        AI is Analyzing Your Item
      </h2>
      <p className="text-gray-500 mb-10">This takes just a few seconds...</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left space-y-4">
        {analysisSteps.map((step, i) => {
          const isComplete = completed.includes(i)
          const isCurrent  = !isComplete && completed.length === i
          return (
            <div key={i} className={`flex items-center gap-3 transition-opacity ${
              i > completed.length ? 'opacity-30' : 'opacity-100'
            }`}>
              {isComplete ? (
                <CheckCircle size={20} className="text-brand-teal flex-shrink-0 animate-scaleIn" />
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-teal border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              <span className={`text-sm ${isComplete ? 'text-brand-dark font-medium' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>

      {done && (
        <div className="mt-6 bg-brand-teal-pale border border-brand-teal/20 rounded-xl p-4 animate-fadeInUp">
          <p className="text-brand-teal font-semibold text-sm">
            ✅ Analysis complete! Your item is eligible for listing.
          </p>
        </div>
      )}
    </div>
  )
}

/* ───────────── Step 3: Review ───────────── */
function StepReview({ aiResult, onNext, onBack }) {
  const [title,       setTitle]       = useState(aiResult.title)
  const [description, setDescription] = useState(aiResult.description)
  const [listingType, setListingType] = useState(aiResult.listingType)
  const [buyPrice,    setBuyPrice]    = useState(aiResult.buyPrice)
  const [rentPrice,   setRentPrice]   = useState(aiResult.rentPrice || '')

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Sparkles size={14} /> AI Generated — Review & Edit
        </div>
        <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">Your Listing</h2>
        <p className="text-gray-500">Our AI has pre-filled your listing. Adjust any details you like.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Product Title
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40 resize-none"
          />
        </div>

        {/* Listing type */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Listing Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['buy', 'rent', 'both'].map(t => (
              <button
                key={t}
                onClick={() => setListingType(t)}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  listingType === t
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal'
                }`}
              >
                {t === 'buy' ? '🛒 Sell' : t === 'rent' ? '📅 Rent' : '♻️ Both'}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          {(listingType === 'buy' || listingType === 'both') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Sale Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={e => setBuyPrice(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
                />
              </div>
            </div>
          )}
          {(listingType === 'rent' || listingType === 'both') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Rent Price ($/week)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={rentPrice}
                  onChange={e => setRentPrice(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
                />
              </div>
            </div>
          )}
        </div>

        {/* AI price note */}
        <div className="bg-brand-teal-pale border border-brand-teal/10 rounded-xl p-3 flex gap-2 items-start">
          <Sparkles size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
          <p className="text-brand-teal text-xs leading-relaxed">
            Prices estimated by AI based on market data for {aiResult.condition.toLowerCase()} condition items.
            You can adjust these freely — Hand Me Dino will honor your preferred pricing.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => onNext({ title, description, listingType, buyPrice, rentPrice })}
          className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors"
        >
          Confirm Listing →
        </button>
      </div>
    </div>
  )
}

/* ───────────── Step 4: Schedule Pickup ───────────── */
function StepSchedule({ onNext, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [timeSlot,     setTimeSlot]     = useState('')
  const [address,      setAddress]      = useState('')

  // Build next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: d.toISOString().split('T')[0],
    }
  })

  const canProceed = selectedDate && timeSlot && address.length > 5

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🚚</div>
        <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">Schedule Your Pickup</h2>
        <p className="text-gray-500">We come to you — free of charge. No drop-offs ever.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar size={14} /> Select Pickup Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            {days.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                  selectedDate === d.value
                    ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-teal'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time slot */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock size={14} /> Preferred Time Window
          </label>
          <div className="space-y-2">
            {timeSlots.map(t => (
              <button
                key={t}
                onClick={() => setTimeSlot(t)}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                  timeSlot === t
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-teal'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin size={14} /> Pickup Address
          </label>
          <input
            type="text"
            placeholder="123 Ocean View Dr, San Diego, CA"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 flex gap-3">
        <span className="text-blue-500 text-xl">ℹ️</span>
        <p className="text-blue-800 text-xs leading-relaxed">
          Our pickup team will send a confirmation and 1-hour heads-up text. Pickups are always free.
          We operate in the San Diego metro area.
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          disabled={!canProceed}
          onClick={() => onNext({ selectedDate, timeSlot, address })}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            canProceed
              ? 'bg-brand-teal text-white hover:bg-brand-teal-dark'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Schedule Pickup →
        </button>
      </div>
    </div>
  )
}

/* ───────────── Step 5: Confirmation ───────────── */
function StepConfirmation({ listingData, scheduleData }) {
  return (
    <div className="max-w-md mx-auto text-center animate-scaleIn">
      <div className="text-8xl mb-4">🦕</div>
      <div className="bg-brand-teal-pale text-brand-teal text-sm font-bold px-5 py-2 rounded-full inline-block mb-4">
        🎉 Submission Received!
      </div>
      <h2 className="font-display font-bold text-3xl text-brand-dark mb-3">
        You're Making a Difference!
      </h2>
      <p className="text-gray-500 mb-8">
        Your item has been submitted and is on its way to a new family. Here's what happens next.
      </p>

      {/* Summary card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Item</span>
          <span className="font-semibold text-brand-dark">{listingData.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pickup Date</span>
          <span className="font-semibold text-brand-dark">
            {new Date(scheduleData.selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Time Window</span>
          <span className="font-semibold text-brand-dark">{scheduleData.timeSlot}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Address</span>
          <span className="font-semibold text-brand-dark text-right max-w-48">{scheduleData.address}</span>
        </div>
      </div>

      {/* Next steps */}
      <div className="text-left space-y-3 mb-8">
        {[
          { icon: '🚚', text: 'We pick up your item on the scheduled date.' },
          { icon: '🧼', text: 'It gets sanitized, repaired, and Dino Certified.' },
          { icon: '🛒', text: 'Your listing goes live on our marketplace.' },
          { icon: '💚', text: 'You earn credits toward your next purchase!' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm text-gray-700">{s.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/marketplace"
          className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors text-center"
        >
          Browse Marketplace
        </Link>
        <Link
          to="/sell"
          className="flex-1 border-2 border-brand-teal text-brand-teal py-3 rounded-xl font-bold hover:bg-brand-teal-pale transition-colors text-center"
          onClick={() => window.location.reload()}
        >
          List Another Item
        </Link>
      </div>
    </div>
  )
}

/* ───────────── Main Page ───────────── */
export default function SellProduct() {
  const [step,         setStep]         = useState(1)
  const [uploadData,   setUploadData]   = useState(null)
  const [aiResult,     setAiResult]     = useState(null)
  const [listingData,  setListingData]  = useState(null)
  const [scheduleData, setScheduleData] = useState(null)

  const handleUploadNext = (data) => {
    setUploadData(data)
    setStep(2)
  }

  const handleAnalysisDone = (result) => {
    setAiResult(result)
    setStep(3)
  }

  const handleReviewNext = (data) => {
    setListingData(data)
    setStep(4)
  }

  const handleScheduleNext = (data) => {
    setScheduleData(data)
    setStep(5)
  }

  const stepLabels = ['Upload', 'AI Analysis', 'Review', 'Pickup', 'Done']

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ♻️ Sell / Donate Your Baby Items
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-dark">
            Turn Outgrown Items into Impact
          </h1>
          <p className="text-gray-500 mt-2">Upload once. We handle the rest.</p>
        </div>

        {step < 5 && <StepIndicator current={step} total={5} />}

        {/* Step labels */}
        {step < 5 && (
          <div className="flex justify-center gap-1 mb-10 -mt-4">
            {stepLabels.map((label, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  i + 1 === step
                    ? 'bg-brand-teal text-white'
                    : i + 1 < step
                    ? 'text-brand-teal'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Step content */}
        {step === 1 && <StepUpload    onNext={handleUploadNext} />}
        {step === 2 && <StepAnalysis  uploadData={uploadData} onDone={handleAnalysisDone} />}
        {step === 3 && aiResult && (
          <StepReview
            aiResult={aiResult}
            onNext={handleReviewNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 4 && (
          <StepSchedule
            onNext={handleScheduleNext}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && listingData && scheduleData && (
          <StepConfirmation listingData={listingData} scheduleData={scheduleData} />
        )}
      </div>
    </div>
  )
}
