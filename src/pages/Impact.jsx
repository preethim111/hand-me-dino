import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/* ── Animated counter hook ── */
function useCounter(target, duration = 2200, decimals = 0, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    const stepMs  = 16
    const steps   = duration / stepMs
    const inc     = target / steps
    let current   = 0
    const timer   = setInterval(() => {
      current += inc
      if (current >= target) {
        setVal(parseFloat(target.toFixed(decimals)))
        clearInterval(timer)
      } else {
        setVal(parseFloat(current.toFixed(decimals)))
      }
    }, stepMs)
    return () => clearInterval(timer)
  }, [target, duration, decimals, start])
  return val
}

/* ── Single animated metric card ── */
function MetricCard({ icon, prefix, number, suffix, decimals, label, source, sourceUrl, description, color, textColor, start }) {
  const count = useCounter(number, 2200, decimals, start)
  return (
    <div className={`${color} rounded-3xl p-8 text-center flex flex-col items-center`}>
      <div className="text-5xl mb-4">{icon}</div>
      <div className={`font-display font-bold text-6xl md:text-7xl ${textColor} mb-2 leading-none`}>
        {prefix}{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}
      </div>
      <div className="font-semibold text-brand-dark text-lg mb-3">{label}</div>
      <p className="text-brand-teal-dark text-sm leading-relaxed max-w-xs mb-4">{description}</p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-brand-teal underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        Source: {source}
      </a>
    </div>
  )
}

/* ── Animated progress bar ── */
function StatBar({ label, percent, color, start }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-brand-dark">{label}</span>
        <span className="font-bold text-brand-dark">{percent}%</span>
      </div>
      <div className="h-5 bg-brand-cream-dark rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1500 ease-out`}
          style={{ width: start ? `${percent}%` : '0%', transitionDuration: '1.5s' }}
        />
      </div>
    </div>
  )
}

const certSteps = [
  { icon:'📦', title:'Collection',    desc:'Free doorstep pickup. We come to you — no drop-off ever required.'              },
  { icon:'🔍', title:'Inspection',    desc:'Each item is checked against our safety and eligibility checklist.'              },
  { icon:'🧼', title:'Sanitization',  desc:'Hospital-grade eco-friendly cleaning and disinfection of every product.'         },
  { icon:'🔧', title:'Repair & Renew',desc:'Minor repairs, part replacements, and refurbishment where needed.'               },
  { icon:'✅', title:'Certification', desc:'25-point quality and safety sign-off earns the HandMeDino Certified badge.'      },
  { icon:'🚚', title:'Re-Delivery',   desc:'Certified items are delivered to the next family — zero negotiation required.'   },
]

export default function Impact() {
  const [started, setStarted] = useState(false)
  const metricsRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.2 }
    )
    if (metricsRef.current) obs.observe(metricsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="bg-brand-teal-dark text-white py-20 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-teal rounded-full opacity-30 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-teal-light rounded-full opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-teal-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🌊 Why HandMeDino?
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-5">
            The Problem is Bigger<br />
            <span className="text-brand-green">Than You Think.</span>
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto leading-relaxed">
            The baby industry mass-produces plastic-heavy items with some of the shortest product
            lifecycles on the planet. And most of it ends up in our oceans.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          THREE ANIMATED METRICS
      ══════════════════════════════════════ */}
      <section ref={metricsRef} className="py-20 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-brand-dark mb-3">
              The Numbers Don't Lie
            </h2>
            <p className="text-brand-teal-dark max-w-xl mx-auto">
              Data-driven reasons why a circular baby economy isn't just nice-to-have — it's urgent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Metric 1 */}
            <MetricCard
              icon="🗑️"
              prefix=""
              number={122}
              suffix=" kg"
              decimals={0}
              label="Plastic per person per year"
              description="The average person generates 122 kilograms of plastic waste annually — and baby products are among the fastest-cycling contributors."
              source="Jambeck et al., Science (2015)"
              sourceUrl="https://www.science.org/doi/10.1126/science.1260352"
              color="bg-brand-teal-pale border border-brand-teal/20"
              textColor="text-brand-teal"
              start={started}
            />

            {/* Metric 2 */}
            <MetricCard
              icon="🧸"
              prefix=""
              number={90}
              suffix="%"
              decimals={0}
              label="of toys are made of plastic"
              description="Nine out of ten toys globally are made from plastic. Most have a useful life under 12 months before being discarded."
              source="Beyond Plastics.org"
              sourceUrl="https://www.beyondplastics.org"
              color="bg-brand-green-pale border border-brand-green/20"
              textColor="text-brand-green-dark"
              start={started}
            />

            {/* Metric 3 */}
            <MetricCard
              icon="🌡️"
              prefix="+"
              number={2}
              suffix="°F"
              decimals={0}
              label="ocean temperature rise in 50 years"
              description="The ocean has warmed by 2°F over the last 50 years — disrupting wind patterns, marine ecosystems, and the entire food chain."
              source="CalCOFI Long-Term Data"
              sourceUrl="https://calcofi.org"
              color="bg-blue-50 border border-blue-200"
              textColor="text-blue-600"
              start={started}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLASTIC BREAKDOWN CHART
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                🧪 Baby Industry Breakdown
              </div>
              <h2 className="font-display font-bold text-4xl text-brand-dark mb-5">
                Plastic-Heavy Products<br />
                <span className="text-red-500">With Tiny Lifecycles</span>
              </h2>
              <p className="text-brand-teal-dark leading-relaxed mb-4">
                Baby gear is outgrown in as little as <strong>3–6 months</strong>. The plastic in those products
                will persist for <strong>hundreds of years</strong>. Without a circular model, each year of babyhood
                adds pounds of plastic to our waste stream.
              </p>
              <p className="text-brand-teal-dark leading-relaxed">
                HandMeDino keeps products in circulation — each item gets cleaned, certified, and passed
                to the next family before it ever reaches a landfill or waterway.
              </p>
            </div>
            <div className="bg-brand-cream rounded-3xl p-8">
              <h3 className="font-display font-bold text-lg text-brand-dark mb-6">
                % Made from Plastic
              </h3>
              <StatBar label="Baby Bottles (globally)"        percent={82} color="bg-red-400"          start={started} />
              <StatBar label="Toys (globally)"                percent={90} color="bg-brand-teal"        start={started} />
              <StatBar label="Soft Toys (synthetic fabric)"   percent={95} color="bg-brand-green-dark"  start={started} />
              <StatBar label="Feeding Accessories"            percent={75} color="bg-brand-beige"       start={started} />
              <StatBar label="Bath Products"                  percent={70} color="bg-blue-400"          start={started} />
              <p className="text-xs text-brand-beige mt-4">
                Sources: Babies vs. Plastics Report (Earth Day) · NOAA National Ocean Service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OCEAN / MICROPLASTICS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-brand-teal-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-800/60 text-blue-200 px-5 py-2 rounded-full text-sm font-semibold mb-5">
              🌊 Ocean Impact
            </div>
            <h2 className="font-display font-bold text-4xl mb-4">
              What Microplastics Do to Our Oceans
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto text-lg">
              Discarded baby products break into microplastics that infiltrate every level of marine life —
              and ultimately end up in our food and bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon:'🐟', title:'Marine Life Ingestion',   color:'bg-blue-800/50 border-blue-700',
                desc:'Fish, oysters, and mussels mistake microplastics for food, causing blockages, reduced energy, and internal injury.' },
              { icon:'⚗️', title:'Toxic Chemical Transfer', color:'bg-teal-800/50 border-teal-700',
                desc:'Microplastics absorb PCBs and other pollutants, concentrating toxins and releasing them inside organisms.' },
              { icon:'🔗', title:'Bioaccumulation',         color:'bg-indigo-800/50 border-indigo-700',
                desc:'Toxins climb the food chain — from plankton to fish to human plates. Our health is directly at risk.' },
              { icon:'🌬️', title:'Oxygen Disruption',       color:'bg-cyan-800/50 border-cyan-700',
                desc:'Microplastics disrupt zooplankton activity, increasing surface organic matter and reducing dissolved oxygen levels.' },
            ].map((h, i) => (
              <div key={i} className={`${h.color} border rounded-2xl p-6`}>
                <div className="text-4xl mb-3">{h.icon}</div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{h.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-800/40 border border-blue-700 rounded-2xl p-8 mt-10 text-center max-w-3xl mx-auto">
            <p className="text-blue-100 text-lg leading-relaxed">
              "Microplastics have been found in human blood, lungs, and placentas.
              The products we discard today are the microplastics our children will ingest tomorrow."
            </p>
            <p className="text-blue-400 text-sm mt-3">— NOAA National Ocean Service</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CERTIFICATION PROCESS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-teal-pale text-brand-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              ✅ Our Process
            </div>
            <h2 className="font-display font-bold text-4xl text-brand-dark">
              The HandMeDino Certification Process
            </h2>
            <p className="text-brand-teal-dark mt-3 max-w-xl mx-auto">
              Every HandMeDino Certified item has passed our rigorous 6-step renewal process
              before it reaches your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certSteps.map((s, i) => (
              <div key={i} className="bg-white border border-brand-teal/10 rounded-2xl p-6 relative shadow-sm">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                  {i + 1}
                </div>
                <div className="text-4xl mb-3 mt-1">{s.icon}</div>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">{s.title}</h3>
                <p className="text-brand-teal-dark text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HANDMEDINO IMPACT STATS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-brand-teal text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-4xl mb-10">
            HandMeDino by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { n:'12,847', label:'Products Saved', icon:'♻️' },
              { n:'8,234',  label:'Families Served', icon:'👨‍👩‍👧' },
              { n:'24.5 T', label:'Plastic Diverted', icon:'🌊' },
              { n:'$1.2M',  label:'Family Savings',  icon:'💚' },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 border border-white/20 rounded-2xl p-5">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-display font-bold text-3xl text-white">{s.n}</div>
                <div className="text-teal-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-white text-brand-teal px-8 py-4 rounded-xl font-bold hover:bg-brand-cream transition-colors shadow-lg"
          >
            Start Making an Impact <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
