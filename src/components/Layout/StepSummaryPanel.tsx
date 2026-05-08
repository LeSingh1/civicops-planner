import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'
import { useCityStore } from '@/stores/cityStore'
import { useScenarioStore } from '@/stores/scenarioStore'
import { useSimulationStore } from '@/stores/simulationStore'

export function StepSummaryPanel() {
  const frame = useSimulationStore((state) => state.currentFrame)
  const city = useCityStore((state) => state.selectedCity)
  const scenario = useScenarioStore((state) => state.activeScenario)
  const fetchExplanation = useAIStore((state) => state.fetchExplanation)
  const [summary, setSummary] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!frame || frame.type !== 'SIM_FRAME') return
    const timer = window.setTimeout(async () => {
      const text = await fetchExplanation({
        type: 'annual_summary',
        zone_type_id: 'ANNUAL_SUMMARY',
        zone_display_name: `Year ${frame.year} summary`,
        city_name: city?.name ?? 'the district',
        surrounding_context: JSON.stringify(frame.agent_actions.slice(0, 3)),
        metrics_delta: frame.metrics_snapshot,
        scenario_goal: scenario,
      })
      setSummary(text.split(/[.;]\s+/).filter(Boolean).slice(0, 3))
      setVisible(true)
      window.setTimeout(() => setVisible(false), 6000)
    }, 500)
    return () => window.clearTimeout(timer)
  }, [city?.name, fetchExplanation, frame, scenario])

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          style={{
            position: 'fixed', top: 68, left: 340, right: 32, zIndex: 42,
            borderRadius: 8, padding: 14,
            background: 'rgba(13,17,23,0.95)', border: '1px solid rgba(46,134,193,0.25)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}
        >
          <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6, background: 'rgba(46,134,193,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} style={{ color: 'var(--color-brand-primary)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <strong style={{ color: 'white', fontSize: 13 }}>Planning Update — Year {frame?.year}</strong>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{city?.name}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.7 }}>
              {summary.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <button className="icon-btn" onClick={() => setVisible(false)} style={{ flexShrink: 0, width: 26, height: 26 }} aria-label="Dismiss update">
            <X size={13} />
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
