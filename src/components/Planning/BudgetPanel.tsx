import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

const BUDGET_LINES = [
  { dept: 'Transit', amount: 45, color: '#9B59B6', items: ['North Transit Hub', 'Bus Stop Network expansion'] },
  { dept: 'Education', amount: 32, color: '#3498DB', items: ['East Education District School'] },
  { dept: 'Community Services', amount: 22, color: '#1ABC9C', items: ['New Housing Community Center'] },
  { dept: 'Public Health', amount: 18, color: '#E74C3C', items: ['South Emergency Gap Clinic'] },
  { dept: 'Parks', amount: 14, color: '#27AE60', items: ['Central Green Corridor'] },
  { dept: 'Mobility', amount: 6, color: '#95A5A6', items: ['Pedestrian infrastructure', 'Active transportation'] },
]

const TOTAL = 137

const OPS_METRICS = [
  { label: 'Residents Served', value: '96,400', sub: 'projected' },
  { label: 'Service Gaps Fixed', value: '5', sub: 'identified gaps' },
  { label: 'Departments Involved', value: '6', sub: 'dept. leads' },
  { label: 'Implementation Phases', value: '3', sub: 'over 50 years' },
  { label: 'Estimated Cost', value: '$137M', sub: 'total plan' },
  { label: 'Priority Score', value: '87/100', sub: 'AI assessment' },
]

export function BudgetPanel() {
  const isOpen = useUIStore((state) => state.isBudgetOpen)
  const close = useUIStore((state) => state.closeBudget)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 480 }}
          animate={{ x: 0 }}
          exit={{ x: 480 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', top: 56, right: 0, bottom: 64, zIndex: 45,
            width: 400, background: 'var(--color-bg-panel)',
            borderLeft: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-lg)', overflow: 'auto',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Budget Impact"
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontSize: 17, fontWeight: 700 }}>Budget Impact</h2>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: 12 }}>5-year capital plan · All figures in USD</p>
              </div>
              <button className="icon-btn" onClick={close} aria-label="Close budget panel"><X size={16} /></button>
            </div>
          </div>

          <div style={{ padding: '16px 20px' }}>
            {/* Total */}
            <div style={{ padding: '16px 18px', background: 'rgba(46,134,193,0.08)', border: '1px solid rgba(46,134,193,0.2)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(46,134,193,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} style={{ color: 'var(--color-brand-primary)' }} />
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Total Plan Cost</div>
                  <div style={{ color: 'white', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>$137M</div>
                </div>
              </div>
            </div>

            {/* Budget bars */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>By Department</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {BUDGET_LINES.map((line) => {
                  const pct = (line.amount / TOTAL) * 100
                  return (
                    <div key={line.dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{line.dept}</span>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 1 }}>
                            {line.items.join(' · ')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>${line.amount}M</span>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>{pct.toFixed(0)}%</div>
                        </div>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-card)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                          style={{ height: '100%', background: line.color, borderRadius: 4 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stacked bar */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 10px', color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Allocation</h3>
              <div style={{ height: 20, borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                {BUDGET_LINES.map((line) => (
                  <motion.div
                    key={line.dept}
                    initial={{ flex: 0 }}
                    animate={{ flex: line.amount }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ background: line.color }}
                    title={`${line.dept}: $${line.amount}M`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {BUDGET_LINES.map((line) => (
                  <div key={line.dept} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: line.color }} />
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>{line.dept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Metrics */}
            <div>
              <h3 style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Operational Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {OPS_METRICS.map((m) => (
                  <div key={m.label} style={{ padding: '12px 14px', background: 'var(--color-bg-card)', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{m.value}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 11, marginTop: 2 }}>{m.label}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
