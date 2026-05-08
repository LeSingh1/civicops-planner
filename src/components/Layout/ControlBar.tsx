import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Pause, Play, RotateCcw, Settings, SkipBack, SkipForward } from 'lucide-react'
import { CivicOpsLogo } from '@/components/UI/LandingScreen'
import { useCityStore } from '@/stores/cityStore'
import { useScenarioStore } from '@/stores/scenarioStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { useSimulation } from '@/hooks/useSimulation'
import { useUIStore } from '@/stores/uiStore'

export function ControlBar({ connectionState }: { connectionState: string }) {
  const selectedCity = useCityStore((state) => state.selectedCity)
  const currentYear = useSimulationStore((state) => state.currentYear)
  const frameHistory = useSimulationStore((state) => state.frameHistory)
  const isRunning = useSimulationStore((state) => state.isRunning)
  const isPaused = useSimulationStore((state) => state.isPaused)
  const speed = useSimulationStore((state) => state.speed)
  const setSpeed = useSimulationStore((state) => state.setSpeed)
  const scrubToYear = useSimulationStore((state) => state.scrubToYear)
  const reset = useSimulationStore((state) => state.reset)
  const activeScenario = useScenarioStore((state) => state.activeScenario)
  const { start, pause, resume } = useSimulation()
  const openMemo = useUIStore((state) => state.openMemo)

  const play = () => {
    if (!selectedCity) return
    if (isPaused) resume()
    else if (!isRunning) start(selectedCity.id, activeScenario)
    else pause()
  }

  const step = (direction: 1 | -1) => {
    const years = frameHistory.map((frame) => frame.year)
    const index = Math.max(0, years.indexOf(currentYear))
    const next = years[Math.max(0, Math.min(years.length - 1, index + direction))]
    if (next !== undefined) scrubToYear(next)
  }

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 50,
        background: 'var(--color-bg-sidebar)', borderBottom: '1px solid var(--color-border-subtle)',
      }}
      onKeyDown={(event) => {
        if (event.code === 'Space') { event.preventDefault(); play() }
        if (event.key === 'ArrowLeft') step(-1)
        if (event.key === 'ArrowRight') step(1)
      }}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 18 }}>
        {/* Logo + city */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 280 }}>
          <CivicOpsLogo />
          <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: 14 }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>Active District</div>
            <div style={{ color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600 }}>{selectedCity?.name ?? '—'}</div>
          </div>
        </div>

        {/* Phase indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Phase 1', 'Phase 2', 'Phase 3'].map((phase, i) => {
            const phaseYear = (i + 1) * 15
            const active = currentYear >= phaseYear - 15 && currentYear < phaseYear
            const done = currentYear >= phaseYear
            return (
              <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {i > 0 && <div style={{ width: 20, height: 1, background: done ? 'var(--color-brand-accent)' : 'var(--color-border-subtle)' }} />}
                <div style={{
                  height: 26, padding: '0 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center',
                  background: active ? 'rgba(46,134,193,0.15)' : done ? 'rgba(23,165,137,0.12)' : 'transparent',
                  color: active ? 'var(--color-brand-primary)' : done ? 'var(--color-brand-accent)' : 'var(--color-text-muted)',
                  border: `1px solid ${active ? 'rgba(46,134,193,0.4)' : done ? 'rgba(23,165,137,0.3)' : 'var(--color-border-subtle)'}`,
                }}>
                  {phase}
                </div>
              </div>
            )
          })}
        </div>

        {/* Year + playback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>Plan Year</div>
            <AnimatePresence mode="popLayout">
              <motion.strong
                key={currentYear}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ fontSize: 22, lineHeight: 1, fontWeight: 800, color: 'white' }}
                aria-live="polite"
              >
                {currentYear}
              </motion.strong>
            </AnimatePresence>
          </div>
          <button className="icon-btn" aria-label="Reset" onClick={reset}><RotateCcw size={15} /></button>
          <button className="icon-btn" aria-label="Step back" onClick={() => step(-1)}><SkipBack size={15} /></button>
          <button
            className="icon-btn" aria-label="Run or pause analysis" onClick={play}
            style={{ width: 40, height: 40, color: 'white', borderColor: 'var(--color-brand-primary)', background: 'var(--color-brand-primary)' }}
          >
            {isRunning && !isPaused ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button className="icon-btn" aria-label="Step forward" onClick={() => step(1)}><SkipForward size={15} /></button>
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            style={{ height: 34, border: '1px solid var(--color-border-subtle)', borderRadius: 6, background: 'var(--color-bg-panel)', color: 'var(--color-brand-secondary)', padding: '0 8px', fontWeight: 700, fontSize: 12 }}
          >
            {[1, 5, 10, 50].map((value) => <option key={value} value={value}>{value}x</option>)}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180, justifyContent: 'flex-end' }}>
          <span style={{ color: connectionState === 'connected' ? 'var(--color-brand-accent)' : 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {connectionState === 'connected' ? 'Live' : connectionState}
          </span>
          <button
            className="icon-btn"
            aria-label="Open Planning Memo"
            onClick={openMemo}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', width: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}
          >
            <FileText size={15} />
            Planning Memo
          </button>
          <button className="icon-btn" aria-label="Export data" onClick={() => {
            const session = useSimulationStore.getState().sessionId
            if (session) window.open(`/api/simulation/${session}/export`, '_blank')
          }}>
            <Download size={15} />
          </button>
          <button className="icon-btn" aria-label="Settings"><Settings size={15} /></button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: `${Math.min(100, (currentYear / 50) * 100)}%`, background: 'var(--color-brand-accent)', transition: 'width 400ms ease' }} />
    </header>
  )
}
