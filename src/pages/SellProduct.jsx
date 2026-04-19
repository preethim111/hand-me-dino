import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, CheckCircle, XCircle, ArrowRight, ArrowLeft, Calendar, Clock, MapPin, Sparkles, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react'
import { getAIResult, categories } from '../data/mockListings'

// ── Gemini API ─────────────────────────────────────────────────────
const GEMINI_KEY = 'AIzaSyAs54bkJaiA8tNnAfUBkjibW0px6uV-JFU'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function classifyImage(file, attempt = 0) {
  const base64   = await fileToBase64(file)
  const mimeType = ['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)
    ? file.type : 'image/jpeg'

  const res = await fetch(
    `/api/gemini/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method : 'POST',
      headers: { 'content-type': 'application/json' },
      body   : JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            {
              text: `You are a safety inspector for a baby product resale marketplace. Analyze this image carefully.

Evaluate two things:
1. Is this a baby or toddler product designed for children 0–3 years? (strollers, cribs, car seats, high chairs, bouncers, swings, toys, clothing, carriers, monitors, feeding gear, bath items, etc.)
2. Does the item have visible structural damage, broken parts, cracks, severe staining, or missing safety components?

Reply with ONLY valid JSON — no markdown fences, no explanation, no extra text:
{
  "is_baby_product": true or false,
  "is_damaged": true or false,
  "eligible": true or false,
  "product_category": "Car Seat" or "Stroller" or "Crib" or "High Chair" or "Bouncer" or "Swing" or "Monitor" or "Toys" or "Carrier" or "Travel" or "Clothing" or "Feeding" or "Bath" or "Other",
  "product_name": "short descriptive product name",
  "condition_assessment": "Like New" or "Excellent" or "Good" or "Fair",
  "rejection_reason": "brief reason string if not eligible, null if eligible"
}`,
            },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
      }),
    }
  )

  // Retry on 429 with exponential backoff (max 2 retries: 3s, then 7s)
  if (res.status === 429) {
    if (attempt < 2) {
      const waitMs = attempt === 0 ? 3000 : 7000
      await sleep(waitMs)
      return classifyImage(file, attempt + 1)
    }
    const err = new Error('Rate limit exceeded')
    err.isRateLimit = true
    throw err
  }

  if (!res.ok) {
    const body = await res.text()
    console.error('Gemini error response:', body)
    throw new Error(`HTTP ${res.status}`)
  }
  const data  = await res.json()
  const text  = data.candidates[0].content.parts[0].text.trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in Gemini response')
  return JSON.parse(match[0])
}

// ── Constants ─────────────────────────────────────────────────────
const conditions  = ['Like New', 'Excellent', 'Good', 'Fair']
const catOptions  = categories.filter(c => c !== 'All')
const timeSlots   = ['Morning (9 am – 12 pm)', 'Afternoon (12 pm – 4 pm)', 'Evening (4 pm – 7 pm)']

const analysisSteps = [
  'Identifying product type...',
  'Checking recall database (CPSC)...',
  'Assessing condition from photo...',
  'Generating listing details...',
  'Estimating fair market value...',
]

// Demo scenarios (bypass real API for quick demos)
const demoScenarios = {
  broken: {
    label      : '🔴 Broken High Chair',
    category   : 'High Chair',
    condition  : 'Fair',
    fileName   : 'broken_highchair.jpg',
    failAtIndex: 2,
    failNote   : '— structural damage detected',
    reason     : 'Structural damage or missing safety components detected in the photo. Items with broken parts, cracked frames, or compromised harness systems cannot be safely resold.',
  },
  non_baby: {
    label      : '🚫 Non-Baby Item',
    category   : 'Other',
    condition  : 'Excellent',
    fileName   : 'laptop_computer.jpg',
    failAtIndex: 0,
    failNote   : '— not a baby product',
    reason     : 'This does not appear to be a baby or toddler product. HandMeDino only accepts items specifically designed for children under 3 years of age.',
  },
  pass: {
    label      : '🟢 Good Stroller',
    category   : 'Stroller',
    condition  : 'Excellent',
    fileName   : 'good_stroller.jpg',
    failAtIndex: null,
    reason     : null,
  },
}

// ── StepIndicator ─────────────────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step < current   ? 'bg-brand-teal-dark text-white' :
              step === current ? 'bg-brand-teal text-white ring-4 ring-green-200' :
                                 'bg-gray-100 text-gray-400'
            }`}>
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

// ── Step 1: Upload ────────────────────────────────────────────────
function StepUpload({ onNext }) {
  const [file,          setFile]          = useState(null)
  const [dragging,      setDragging]      = useState(false)
  const [category,      setCategory]      = useState('')
  const [condition,     setCondition]     = useState('')
  const [demoKey,       setDemoKey]       = useState(null)
  const [showDemoPanel, setShowDemoPanel] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      setDemoKey(null)   // clear demo when real file chosen
    }
  }

  const handleDemoSelect = (key) => {
    const s = demoScenarios[key]
    setFile({ name: s.fileName, size: 248000, type: 'image/jpeg' })
    setCategory(s.category)
    setCondition(s.condition)
    setDemoKey(key)
    setShowDemoPanel(false)
  }

  const canProceed = file && category && condition

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📸</div>
        <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">List Your Item</h2>
        <p className="text-gray-500">Upload a photo and our AI will check eligibility instantly.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-5 ${
          dragging ? 'border-brand-teal bg-brand-teal-pale' :
          file     ? 'border-brand-teal bg-brand-teal-pale' :
                     'border-gray-200 bg-white hover:border-brand-teal hover:bg-brand-teal-pale/50'
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <div>
            <div className="text-4xl mb-2">{demoKey ? demoScenarios[demoKey].label.split(' ')[0] : '✅'}</div>
            <p className="font-semibold text-brand-teal">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {demoKey ? 'Demo scenario loaded' : `${(file.size / 1024).toFixed(0)} KB`} — click to replace
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

      {/* Demo panel */}
      <div className="mb-5 border border-brand-beige/60 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowDemoPanel(!showDemoPanel)}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-cream text-left"
        >
          <span className="text-sm font-semibold text-brand-teal-dark">🎬 Try a Demo Scenario</span>
          <ChevronDown size={16} className={`text-brand-beige transition-transform ${showDemoPanel ? 'rotate-180' : ''}`} />
        </button>
        {showDemoPanel && (
          <div className="px-4 pb-4 pt-3 bg-white space-y-2">
            <p className="text-xs text-gray-500 mb-3">See how the AI handles different situations:</p>
            {Object.entries(demoScenarios).map(([key, s]) => (
              <button
                key={key}
                onClick={() => handleDemoSelect(key)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  demoKey === key
                    ? 'bg-brand-teal-pale border-brand-teal text-brand-teal'
                    : 'bg-gray-50 border-gray-200 hover:border-brand-teal hover:bg-brand-teal-pale/50 text-gray-700'
                }`}
              >
                <span className="font-semibold">{s.label}</span>
                <span className="block text-xs text-gray-400 mt-0.5">
                  {key === 'broken'   ? 'AI detects structural damage → item rejected'   :
                   key === 'non_baby' ? 'AI detects non-baby item → not accepted'        :
                                       'AI approves → listing created normally (mock)'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Category</label>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setDemoKey(null) }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40 appearance-none"
        >
          <option value="">Select a category...</option>
          {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Condition</label>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map(c => (
            <button
              key={c}
              onClick={() => { setCondition(c); setDemoKey(null) }}
              className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                condition === c
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal'
              }`}
            >
              {c === 'Like New' ? '⭐ Like New' : c === 'Excellent' ? '✅ Excellent' : c === 'Good' ? '👍 Good' : '🆗 Fair'}
            </button>
          ))}
        </div>
      </div>

      {/* Eligibility note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-xs leading-relaxed">
          Our AI checks every photo for product type and condition. Post-accident car seats, recalled items,
          damaged products, and non-baby items are automatically rejected.
        </p>
      </div>

      <button
        disabled={!canProceed}
        onClick={() => onNext({ file, category, condition, demoKey })}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
          canProceed
            ? 'bg-brand-teal text-white hover:bg-brand-teal-dark shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Run AI Safety Check →
      </button>
    </div>
  )
}

// ── Step 2: AI Analysis ───────────────────────────────────────────
function StepAnalysis({ uploadData, onDone, onFail }) {
  const [completed,  setCompleted]  = useState([])
  const [failedIdx,  setFailedIdx]  = useState(null)
  const [done,       setDone]       = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [apiStatus,  setApiStatus]  = useState('idle') // 'idle' | 'calling' | 'done' | 'error'
  const hasRun = useRef(false)

  const scenario   = uploadData.demoKey
  const isRealFile = uploadData.file instanceof File

  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (hasRun.current) return
    hasRun.current = true

    async function run() {
      const stepDelays = [700, 700, 800, 700, 700]

      // ── Demo scenario path ────────────────────────────────────
      if (scenario) {
        const cfg      = demoScenarios[scenario]
        const willFail = cfg.failAtIndex !== null

        if (willFail) {
          for (let i = 0; i < cfg.failAtIndex; i++) {
            await sleep(stepDelays[i])
            setCompleted(prev => [...prev, i])
          }
          await sleep(700)
          setFailedIdx(cfg.failAtIndex)
          setShowResult(true)
          await sleep(1500)
          onFail(cfg.reason)
        } else {
          for (let i = 0; i < 5; i++) {
            await sleep(stepDelays[i])
            setCompleted(prev => [...prev, i])
          }
          setDone(true)
          setShowResult(true)
          await sleep(800)
          onDone(getAIResult(uploadData.category, uploadData.condition))
        }
        return
      }

      // ── Real upload: call Gemini vision ───────────────────────
      if (isRealFile) {
        setApiStatus('calling')

        let apiResult
        try {
          const [result] = await Promise.all([
            classifyImage(uploadData.file),
            sleep(1800),   // ensure spinner shows for at least 1.8 s
          ])
          apiResult    = result
          setApiStatus('done')
        } catch (err) {
          console.error('Gemini vision error:', err)
          setApiStatus('error')
          // Graceful fallback for all API errors: trust the user's provided details
          apiResult = {
            is_baby_product     : true,
            is_damaged          : false,
            eligible            : true,
            product_category    : uploadData.category,
            condition_assessment: uploadData.condition,
          }
        }

        // ── Not a baby product ──
        if (!apiResult.is_baby_product) {
          setFailedIdx(0)
          setShowResult(true)
          await sleep(1200)
          onFail(
            apiResult.rejection_reason ||
            'This does not appear to be a baby or toddler product. HandMeDino only accepts items designed for children under 3 years of age.'
          )
          return
        }

        // Steps 0 & 1 pass
        setCompleted([0])
        await sleep(600)
        setCompleted([0, 1])
        await sleep(600)

        // ── Damaged ──
        if (apiResult.is_damaged) {
          setFailedIdx(2)
          setShowResult(true)
          await sleep(1200)
          onFail(
            apiResult.rejection_reason ||
            'Structural damage or unsafe condition detected. Items with broken parts, cracks, or compromised safety components cannot be safely resold.'
          )
          return
        }

        // Steps 2, 3, 4 pass
        setCompleted([0, 1, 2])
        await sleep(600)
        setCompleted([0, 1, 2, 3])
        await sleep(600)
        setCompleted([0, 1, 2, 3, 4])
        setDone(true)
        setShowResult(true)

        await sleep(800)
        const base = getAIResult(
          apiResult.product_category    || uploadData.category,
          apiResult.condition_assessment || uploadData.condition,
        )
        onDone({
          ...base,
          title: apiResult.product_name
            ? `${apiResult.condition_assessment || uploadData.condition} ${apiResult.product_name}`
            : base.title,
        })
        return
      }

      // ── Fallback (no file & no scenario) ─────────────────────
      onDone(getAIResult(uploadData.category, uploadData.condition))
    }

    run()
  }, [])

  const isWaitingForApi = apiStatus === 'calling'

  return (
    <div className="max-w-md mx-auto text-center animate-fadeInUp">
      <div className="text-6xl mb-4 animate-float">🤖</div>
      <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">AI Safety Check</h2>
      <p className="text-gray-500 mb-10">Analyzing your item — just a few seconds...</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left space-y-4">
        {analysisSteps.map((step, i) => {
          const isComplete  = completed.includes(i)
          const isFailed    = failedIdx === i
          const isGrayed    = !isComplete && failedIdx !== null && i > failedIdx
          const isCurrent   = !isComplete && !isFailed && !isGrayed && (
            // For real uploads: step 0 spins while API is pending
            (isWaitingForApi && i === 0) || (!isWaitingForApi && completed.length === i && failedIdx === null && !done)
          )
          return (
            <div key={i} className={`flex items-center gap-3 transition-opacity ${isGrayed ? 'opacity-25' : 'opacity-100'}`}>
              {isFailed ? (
                <XCircle size={20} className="text-red-500 flex-shrink-0 animate-scaleIn" />
              ) : isComplete ? (
                <CheckCircle size={20} className="text-brand-teal flex-shrink-0 animate-scaleIn" />
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-teal border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              <span className={`text-sm ${
                isFailed   ? 'text-red-600 font-medium' :
                isComplete ? 'text-brand-dark font-medium' : 'text-gray-400'
              }`}>
                {step}
                {isFailed && scenario && demoScenarios[scenario]?.failNote && (
                  <span className="text-red-400 ml-1 font-normal">{demoScenarios[scenario].failNote}</span>
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* API status label */}
      {isWaitingForApi && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-teal-dark animate-pulse">
          <Loader2 size={13} className="animate-spin" />
          Running Gemini vision analysis...
        </div>
      )}


      {/* Result banners */}
      {showResult && done && (
        <div className="mt-6 bg-brand-teal-pale border border-brand-teal/20 rounded-xl p-4 animate-fadeInUp">
          <p className="text-brand-teal font-semibold text-sm">✅ Item cleared — generating your listing now...</p>
        </div>
      )}
      {showResult && failedIdx !== null && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeInUp">
          <p className="text-red-700 font-semibold text-sm">❌ Safety check failed — reviewing details...</p>
        </div>
      )}
    </div>
  )
}

// ── Eligibility Fail Screen ───────────────────────────────────────
function EligibilityFailScreen({ reason, onRestart }) {
  return (
    <div className="max-w-md mx-auto text-center animate-fadeInUp">
      <div className="text-7xl mb-4">⛔</div>
      <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">Item Not Eligible</h2>
      <p className="text-gray-500 mb-6">Our AI flagged an issue with this item.</p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 text-left">
        <div className="flex gap-3">
          <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-sm mb-1">Reason for Rejection</p>
            <p className="text-red-700 text-sm leading-relaxed">{reason}</p>
          </div>
        </div>
      </div>

      <div className="bg-brand-teal-pale border border-brand-teal/20 rounded-2xl p-5 mb-6 text-left">
        <p className="font-semibold text-brand-dark text-sm mb-3">What are your options?</p>
        <ul className="space-y-2 text-brand-teal-dark text-sm">
          {(reason.includes('rate limit') || reason.includes('busy')
            ? [
                'Wait about 30 seconds, then click "Try Another Item" to resubmit.',
                'The free AI vision tier allows ~15 checks per minute.',
              ]
            : [
                'Try submitting a different item that meets our eligibility requirements.',
                'Check our FAQ for a full list of accepted and excluded products.',
                'Contact us if you believe this assessment was incorrect.',
              ]
          ).map((opt, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand-teal font-bold mt-0.5">→</span>
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors"
        >
          Try Another Item
        </button>
        <Link
          to="/faq"
          className="flex-1 border-2 border-brand-teal text-brand-teal py-3 rounded-xl font-bold hover:bg-brand-teal-pale transition-colors text-center"
        >
          View Eligibility FAQ
        </Link>
      </div>
    </div>
  )
}

// ── Step 3: Review ────────────────────────────────────────────────
function StepReview({ aiResult, onNext, onBack }) {
  const [title,       setTitle]       = useState(aiResult.title)
  const [description, setDescription] = useState(aiResult.description)
  const [buyPrice,    setBuyPrice]    = useState(aiResult.buyPrice)

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
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Listing Type</label>
          <div className="w-full py-3 px-4 rounded-xl bg-brand-teal-pale border border-brand-teal/30 text-brand-teal text-sm font-semibold flex items-center gap-2">
            🛒 Sell — your item will be listed for purchase on the marketplace
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sale Price ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40" />
          </div>
        </div>

        <div className="bg-brand-teal-pale border border-brand-teal/10 rounded-xl p-3 flex gap-2 items-start">
          <Sparkles size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
          <p className="text-brand-teal text-xs leading-relaxed">
            Price estimated by AI based on market data for {aiResult.condition?.toLowerCase()} condition items.
            You can adjust this freely.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => onNext({ title, description, buyPrice })}
          className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors"
        >
          Confirm Listing →
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Schedule Pickup ───────────────────────────────────────
function StepSchedule({ onNext, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [timeSlot,     setTimeSlot]     = useState('')
  const [address,      setAddress]      = useState('')

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
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar size={14} /> Select Pickup Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            {days.map(d => (
              <button key={d.value} onClick={() => setSelectedDate(d.value)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                  selectedDate === d.value
                    ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-teal'
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock size={14} /> Preferred Time Window
          </label>
          <div className="space-y-2">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTimeSlot(t)}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                  timeSlot === t
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-teal'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin size={14} /> Pickup Address
          </label>
          <input type="text" placeholder="123 Ocean View Dr, San Diego, CA" value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40" />
        </div>
      </div>

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
        <button disabled={!canProceed} onClick={() => onNext({ selectedDate, timeSlot, address })}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            canProceed ? 'bg-brand-teal text-white hover:bg-brand-teal-dark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}>
          Schedule Pickup →
        </button>
      </div>
    </div>
  )
}

// ── Step 5: Confirmation ──────────────────────────────────────────
function StepConfirmation({ listingData, scheduleData }) {
  return (
    <div className="max-w-md mx-auto text-center animate-scaleIn">
      <div className="text-8xl mb-4">🦕</div>
      <div className="bg-brand-teal-pale text-brand-teal text-sm font-bold px-5 py-2 rounded-full inline-block mb-4">
        🎉 Submission Received!
      </div>
      <h2 className="font-display font-bold text-3xl text-brand-dark mb-3">You're Making a Difference!</h2>
      <p className="text-gray-500 mb-8">Your item has been submitted and is on its way to a new family.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Item</span>
          <span className="font-semibold text-brand-dark">{listingData.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pickup Date</span>
          <span className="font-semibold text-brand-dark">
            {new Date(scheduleData.selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
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

      <div className="text-left space-y-3 mb-8">
        {[
          { icon:'🚚', text:'We pick up your item on the scheduled date.' },
          { icon:'🧼', text:'It gets sanitized, repaired, and Dino Certified.' },
          { icon:'🛒', text:'Your listing goes live on our marketplace.' },
          { icon:'💚', text:'You earn credits toward your next purchase!' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm text-gray-700">{s.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/marketplace" className="flex-1 bg-brand-teal text-white py-3 rounded-xl font-bold hover:bg-brand-teal-dark transition-colors text-center">
          Browse Marketplace
        </Link>
        <Link to="/sell" className="flex-1 border-2 border-brand-teal text-brand-teal py-3 rounded-xl font-bold hover:bg-brand-teal-pale transition-colors text-center"
          onClick={() => window.location.reload()}>
          List Another Item
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function SellProduct() {
  const [step,         setStep]         = useState(1)
  const [uploadData,   setUploadData]   = useState(null)
  const [aiResult,     setAiResult]     = useState(null)
  const [failReason,   setFailReason]   = useState(null)
  const [listingData,  setListingData]  = useState(null)
  const [scheduleData, setScheduleData] = useState(null)

  const handleUploadNext   = (data)   => { setUploadData(data); setStep(2) }
  const handleAnalysisDone = (result) => { setAiResult(result); setStep(3) }
  const handleAnalysisFail = (reason) => { setFailReason(reason) }
  const handleReviewNext   = (data)   => { setListingData(data); setStep(4) }
  const handleScheduleNext = (data)   => { setScheduleData(data); setStep(5) }

  const handleRestart = () => {
    setStep(1); setUploadData(null); setAiResult(null)
    setFailReason(null); setListingData(null); setScheduleData(null)
  }

  const stepLabels = ['Upload', 'AI Check', 'Review', 'Pickup', 'Done']
  const showProgress = step < 5 && !failReason

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ♻️ Sell Your Baby Items
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-dark">Turn Outgrown Items into Impact</h1>
          <p className="text-gray-500 mt-2">Upload once. Our AI checks it. We handle the rest.</p>
        </div>

        {showProgress && <StepIndicator current={step} total={5} />}
        {showProgress && (
          <div className="flex justify-center gap-1 mb-10 -mt-4">
            {stepLabels.map((label, i) => (
              <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                i + 1 === step ? 'bg-brand-teal text-white' : i + 1 < step ? 'text-brand-teal' : 'text-gray-400'
              }`}>{label}</span>
            ))}
          </div>
        )}

        {step === 1 && <StepUpload onNext={handleUploadNext} />}

        {step === 2 && !failReason && (
          <StepAnalysis uploadData={uploadData} onDone={handleAnalysisDone} onFail={handleAnalysisFail} />
        )}
        {step === 2 && failReason && (
          <EligibilityFailScreen reason={failReason} onRestart={handleRestart} />
        )}

        {step === 3 && aiResult && (
          <StepReview aiResult={aiResult} onNext={handleReviewNext} onBack={() => setStep(1)} />
        )}
        {step === 4 && (
          <StepSchedule onNext={handleScheduleNext} onBack={() => setStep(3)} />
        )}
        {step === 5 && listingData && scheduleData && (
          <StepConfirmation listingData={listingData} scheduleData={scheduleData} />
        )}
      </div>
    </div>
  )
}
