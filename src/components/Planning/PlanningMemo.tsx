import { motion, AnimatePresence } from 'framer-motion'
import { Clipboard, Download, Printer, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useCityStore } from '@/stores/cityStore'

const RECOMMENDATIONS = [
  { name: 'South Emergency Gap Clinic', dept: 'Public Health', cost: '$18M', phase: 1, residents: 22000, impact: 'Emergency Access +24%' },
  { name: 'East Education District School', dept: 'Education', cost: '$32M', phase: 2, residents: 15400, impact: 'School Access +31%' },
  { name: 'North Transit Hub', dept: 'Transit', cost: '$45M', phase: 3, residents: 38000, impact: 'Transit Coverage +18%' },
  { name: 'Central Green Corridor', dept: 'Parks', cost: '$14M', phase: 1, residents: 9200, impact: 'Green Space +12%' },
  { name: 'New Housing Community Center', dept: 'Housing', cost: '$22M', phase: 2, residents: 11800, impact: 'Community Access +19%' },
]

const BUDGET = [
  { dept: 'Public Health', amount: '$18M', pct: 13 },
  { dept: 'Education', amount: '$32M', pct: 23 },
  { dept: 'Transit', amount: '$45M', pct: 33 },
  { dept: 'Parks', amount: '$14M', pct: 10 },
  { dept: 'Community Services', amount: '$22M', pct: 16 },
  { dept: 'Mobility', amount: '$6M', pct: 4 },
]

const DEPT_COLORS: Record<string, string> = {
  'Public Health': '#E74C3C',
  'Education': '#3498DB',
  'Transit': '#9B59B6',
  'Parks': '#27AE60',
  'Housing': '#E67E22',
  'Community Services': '#1ABC9C',
  'Mobility': '#95A5A6',
  'Public Works': '#7F8C8D',
}

export function PlanningMemo() {
  const isOpen = useUIStore((state) => state.isMemoOpen)
  const close = useUIStore((state) => state.closeMemo)
  const city = useCityStore((state) => state.selectedCity)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const handleCopy = () => {
    const text = buildMemoText(city?.name ?? 'District', today)
    navigator.clipboard.writeText(text)
  }

  const handleDownload = () => {
    const json = {
      memo: 'Internal Planning Memo',
      district: city?.name,
      date: today,
      recommendations: RECOMMENDATIONS,
      budget: BUDGET,
      totalCost: '$137M',
      phases: 3,
    }
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `civicops-planning-memo-${(city?.name ?? 'district').toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(6px)', overflow: 'auto', padding: '32px 24px' }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              width: 'min(860px, 100%)', margin: '0 auto',
              background: 'var(--color-bg-panel)',
              borderRadius: 12, border: '1px solid var(--color-border-subtle)',
              overflow: 'hidden',
            }}
          >
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Internal Planning Memo — Draft</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: '1px solid var(--color-border-subtle)', borderRadius: 6, background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <Clipboard size={13} /> Copy Memo
                </button>
                <button
                  onClick={handleDownload}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: '1px solid var(--color-border-subtle)', borderRadius: 6, background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <Download size={13} /> Download JSON
                </button>
                <button
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: '1px solid var(--color-border-subtle)', borderRadius: 6, background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <Printer size={13} /> Print Memo
                </button>
                <button className="icon-btn" onClick={close} aria-label="Close memo"><X size={16} /></button>
              </div>
            </div>

            {/* Memo body */}
            <div style={{ padding: '32px 36px', maxHeight: '80vh', overflow: 'auto' }}>
              {/* Header */}
              <div style={{ borderBottom: '2px solid var(--color-border-subtle)', paddingBottom: 20, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 style={{ margin: 0, color: 'white', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
                      Internal Planning Memo
                    </h1>
                    <p style={{ margin: '6px 0 0', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      CivicOps Planner · Infrastructure Gap Analysis
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Date</div>
                    <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{today}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4 }}>District</div>
                    <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{city?.name ?? 'Fremont, CA'}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
                  <MemoField label="To" value="City Planning Department, Dept. Directors" />
                  <MemoField label="From" value="Infrastructure Planning Division" />
                  <MemoField label="Classification" value="INTERNAL — For Staff Use Only" />
                </div>
              </div>

              {/* Section 1: Summary */}
              <MemoSection title="1. Summary">
                <p style={bodyText}>
                  This memo presents the results of an AI-assisted infrastructure gap analysis for {city?.name ?? 'the district'}.
                  The analysis identified {RECOMMENDATIONS.length} high-priority service gaps affecting approximately{' '}
                  <strong style={{ color: 'white' }}>96,400 projected residents</strong>. Recommended infrastructure investments
                  total <strong style={{ color: 'white' }}>$137M</strong> across 3 implementation phases.
                </p>
              </MemoSection>

              {/* Section 2: Service Gaps */}
              <MemoSection title="2. Service Gaps Identified">
                <div style={{ display: 'grid', gap: 8 }}>
                  {RECOMMENDATIONS.map((rec) => (
                    <div key={rec.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(13,17,23,0.4)', borderRadius: 6, border: '1px solid var(--color-border-subtle)', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{rec.name}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 12, marginLeft: 10 }}>
                          {rec.residents.toLocaleString()} residents underserved
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: `${DEPT_COLORS[rec.dept] ?? '#666'}22`, color: DEPT_COLORS[rec.dept] ?? '#aaa', fontWeight: 700 }}>
                          {rec.dept}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 11, minWidth: 60, textAlign: 'right' }}>{rec.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </MemoSection>

              {/* Section 3: Recommended Infrastructure */}
              <MemoSection title="3. Recommended Infrastructure">
                <p style={bodyText}>Based on gap analysis, population projections, and service coverage modeling, the following infrastructure is recommended:</p>
                <ul style={{ margin: '12px 0', paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
                  {RECOMMENDATIONS.map((rec) => (
                    <li key={rec.name}>
                      <strong style={{ color: 'white' }}>{rec.name}</strong> — {rec.impact} · Phase {rec.phase}
                    </li>
                  ))}
                </ul>
              </MemoSection>

              {/* Section 4: Department Responsibilities */}
              <MemoSection title="4. Department Responsibilities">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {RECOMMENDATIONS.map((rec) => (
                    <div key={rec.name} style={{ padding: '10px 14px', background: 'rgba(13,17,23,0.4)', borderRadius: 6, border: `1px solid ${DEPT_COLORS[rec.dept] ?? '#666'}44` }}>
                      <div style={{ color: DEPT_COLORS[rec.dept] ?? '#aaa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{rec.dept}</div>
                      <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{rec.name}</div>
                    </div>
                  ))}
                </div>
              </MemoSection>

              {/* Section 5: Budget Breakdown */}
              <MemoSection title="5. Budget Breakdown">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Total Plan Cost</span>
                  <span style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>$137M</span>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {BUDGET.map((item) => (
                    <div key={item.dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{item.dept}</span>
                        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{item.amount}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-card)', overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: DEPT_COLORS[item.dept] ?? 'var(--color-brand-accent)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </MemoSection>

              {/* Section 6: Implementation Timeline */}
              <MemoSection title="6. Implementation Timeline">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { phase: 1, label: 'Phase 1 (Years 0–15)', items: ['South Emergency Gap Clinic', 'Bus Stop Network', 'Central Green Corridor'] },
                    { phase: 2, label: 'Phase 2 (Years 15–30)', items: ['East Education District School', 'New Housing Community Center'] },
                    { phase: 3, label: 'Phase 3 (Years 30–50)', items: ['North Transit Hub', 'Housing Support Infrastructure'] },
                  ].map((p) => (
                    <div key={p.phase} style={{ padding: '12px 14px', background: 'rgba(46,134,193,0.06)', borderRadius: 8, border: '1px solid rgba(46,134,193,0.2)' }}>
                      <div style={{ color: 'var(--color-brand-primary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{p.label}</div>
                      <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.7 }}>
                        {p.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </MemoSection>

              {/* Section 7: Risk and Assumptions */}
              <MemoSection title="7. Risk and Assumptions">
                <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.9 }}>
                  <li>Population projections assume 2.3% annual growth rate based on current trends.</li>
                  <li>Cost estimates are preliminary; detailed feasibility studies required before budget approval.</li>
                  <li>Phase 3 (Transit Hub) is contingent on regional transit authority coordination.</li>
                  <li>Land acquisition timelines may affect Phase 2 delivery schedule.</li>
                  <li>Federal infrastructure funding eligibility should be assessed for Transit and Housing components.</li>
                </ul>
              </MemoSection>

              {/* Section 8: Next Steps */}
              <MemoSection title="8. Next Steps">
                <div style={{ display: 'grid', gap: 8 }}>
                  {[
                    { step: '1', action: 'Department directors to review assigned gap recommendations', dept: 'All Departments', deadline: 'Within 30 days' },
                    { step: '2', action: 'Public Health to commission site assessment for South Clinic', dept: 'Public Health', deadline: 'Q1' },
                    { step: '3', action: 'Transit team to begin feasibility study for North Hub', dept: 'Transit', deadline: 'Q2' },
                    { step: '4', action: 'Budget office to review Phase 1 cost estimates', dept: 'Finance / Public Works', deadline: 'Q1' },
                    { step: '5', action: 'Planning commission briefing on full infrastructure plan', dept: 'Planning Division', deadline: 'Q2' },
                  ].map((item) => (
                    <div key={item.step} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'rgba(13,17,23,0.3)', borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'rgba(46,134,193,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', fontSize: 11, fontWeight: 800 }}>{item.step}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.action}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 2 }}>Assigned: {item.dept} · {item.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </MemoSection>

              <div style={{ marginTop: 32, padding: '14px 18px', background: 'rgba(13,17,23,0.4)', borderRadius: 6, border: '1px solid var(--color-border-subtle)', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Generated by CivicOps Planner · Internal use only · AI-assisted analysis — verify all data before submission
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ margin: '0 0 12px', color: 'white', fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 8 }}>{title}</h2>
      {children}
    </section>
  )
}

function MemoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{value}</div>
    </div>
  )
}

const bodyText: React.CSSProperties = { margin: 0, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.7 }

function buildMemoText(district: string, date: string) {
  return `INTERNAL PLANNING MEMO
CivicOps Planner · Infrastructure Gap Analysis
Date: ${date}
District: ${district}

TO: City Planning Department, Dept. Directors
FROM: Infrastructure Planning Division
CLASSIFICATION: INTERNAL — For Staff Use Only

1. SUMMARY
This memo presents the results of an AI-assisted infrastructure gap analysis. The analysis identified 5 high-priority service gaps affecting approximately 96,400 projected residents. Recommended infrastructure investments total $137M across 3 implementation phases.

2. SERVICE GAPS IDENTIFIED
- South Emergency Gap Clinic (Public Health) — 22,000 residents, $18M
- East Education District School (Education) — 15,400 residents, $32M
- North Transit Hub (Transit) — 38,000 residents, $45M
- Central Green Corridor (Parks) — 9,200 residents, $14M
- New Housing Community Center (Housing) — 11,800 residents, $22M

3. BUDGET BREAKDOWN
Total: $137M
Public Health: $18M | Education: $32M | Transit: $45M
Parks: $14M | Community Services: $22M | Mobility: $6M

4. IMPLEMENTATION PHASES
Phase 1: Clinic, Bus Stop Network, Green Corridor
Phase 2: School, Community Center
Phase 3: Transit Hub, Housing Support

5. NEXT STEPS
- Department directors to review assigned recommendations (within 30 days)
- Public Health to commission site assessment for South Clinic (Q1)
- Transit to begin feasibility study for North Hub (Q2)
- Budget office to review Phase 1 cost estimates (Q1)
- Planning commission briefing on full infrastructure plan (Q2)

Generated by CivicOps Planner · Internal use only
`
}
