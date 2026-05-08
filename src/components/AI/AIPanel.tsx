import { motion, AnimatePresence } from 'framer-motion'
import { useAIStore } from '@/stores/aiStore'
import { ZONE_ICONS } from '@/utils/colorUtils'
import { Brain, FileCheck, Loader2 } from 'lucide-react'

const PLANNING_CONTEXT: Record<string, { dept: string; detail: string; cost: string; impact: string }> = {
  HEALTH_HOSPITAL: { dept: 'Public Health', detail: '22,000 projected residents lack clinic access', cost: '$18M', impact: 'Emergency Access +24%' },
  EDU_HIGH: { dept: 'Education', detail: '15,400 projected residents lack school access', cost: '$32M', impact: 'School Coverage +31%' },
  BUS_STATION: { dept: 'Transit', detail: '38,000 projected residents in transit gap zone', cost: '$45M', impact: 'Transit Coverage +18%' },
  PARK_SMALL: { dept: 'Parks', detail: '9,200 residents with no green space within 800m', cost: '$14M', impact: 'Green Space +12%' },
  RES_HIGH_TOWER: { dept: 'Housing', detail: '11,800 projected residents in underserved area', cost: '$22M', impact: 'Community Access +19%' },
}

export function AIPanel() {
  const { explanations, latestExplanation, isGenerating, totalExplanations, cachedCount } = useAIStore()

  const ctx = latestExplanation ? PLANNING_CONTEXT[latestExplanation.zone_type] : undefined

  return (
    <div className="p-3 space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={<Brain size={11} />} label="Analyzed" value={totalExplanations.toString()} />
        <StatCard icon={<FileCheck size={11} />} label="Cached" value={cachedCount.toString()} color="text-accent-cyan" />
        <StatCard icon={<Loader2 size={11} />} label="Live" value={(totalExplanations - cachedCount).toString()} color="text-accent-green" />
      </div>

      {/* Generating indicator */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs"
            style={{ color: 'var(--color-brand-primary)' }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-brand-primary)' }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Planning assistant analyzing gap data...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latest explanation */}
      {latestExplanation && (
        <motion.div
          key={latestExplanation.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--color-bg-card)', borderRadius: 8, padding: 12, border: '1px solid rgba(46,134,193,0.2)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{ZONE_ICONS[latestExplanation.zone_type as keyof typeof ZONE_ICONS] ?? '🏗️'}</span>
              {ctx && (
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'rgba(46,134,193,0.15)', color: 'var(--color-brand-primary)', fontWeight: 700 }}>
                  {ctx.dept}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Year {latestExplanation.year}</span>
          </div>

          {ctx && (
            <div style={{ marginBottom: 8, padding: '8px 10px', background: 'rgba(13,17,23,0.4)', borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>Planning Rationale</div>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.5 }}>
                {ctx.dept} should be routed this infrastructure because {ctx.detail}. Estimated cost is {ctx.cost} and expected improvement is {ctx.impact}.
              </p>
            </div>
          )}

          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
            {latestExplanation.explanation}
          </p>
        </motion.div>
      )}

      {/* History */}
      {explanations.length > 1 && (
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Previous Analyses</div>
          <div style={{ display: 'grid', gap: 8, maxHeight: 280, overflow: 'auto' }}>
            {explanations.slice(1, 8).map((exp) => (
              <div key={exp.id} style={{ borderLeft: '2px solid var(--color-border-subtle)', paddingLeft: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11 }}>{ZONE_ICONS[exp.zone_type as keyof typeof ZONE_ICONS] ?? '🏗️'}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{exp.zone_type} — Year {exp.year}</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{exp.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 12px' }}>
          <Brain size={28} style={{ color: 'var(--color-text-muted)', margin: '0 auto 10px' }} />
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 6 }}>
            Run analysis to generate infrastructure recommendations
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
            AI assistant will identify service gaps and routing decisions
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color = 'text-text-primary' }: {
  icon: React.ReactNode
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="bg-bg-card rounded-lg p-2 text-center">
      <div className={`flex items-center justify-center gap-1 text-text-muted mb-1 ${color}`}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
    </div>
  )
}
