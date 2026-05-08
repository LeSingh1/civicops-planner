import { ClipboardList, DollarSign, FileText, Search } from 'lucide-react'
import { useCityStore } from '@/stores/cityStore'
import { useScenarioStore } from '@/stores/scenarioStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { useNotification } from '@/hooks/useNotification'
import { useUIStore } from '@/stores/uiStore'
import { CivicOpsLogo } from '@/components/UI/LandingScreen'

export function TopBar({ onHome }: { onHome: () => void }) {
  const selectedCity = useCityStore((state) => state.selectedCity)
  const activeScenario = useScenarioStore((state) => state.activeScenario)
  const { planning, analyzeDemo } = useSimulationStore()
  const notify = useNotification((state) => state.notify)
  const openMemo = useUIStore((state) => state.openMemo)
  const openWorkQueue = useUIStore((state) => state.openWorkQueue)
  const openBudget = useUIStore((state) => state.openBudget)
  const workTasks = useUIStore((state) => state.workTasks)
  const pendingCount = workTasks.filter((t) => t.status === 'Pending').length

  const handleAnalyze = () => {
    if (!selectedCity) {
      notify('warning', 'Choose a district before running infrastructure analysis.', 2400)
      return
    }
    analyzeDemo(selectedCity.id, activeScenario)
    notify('success', 'Service gaps detected. Review tasks in Work Queue.', 2400)
  }

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-4 px-5"
      style={{
        background: 'var(--color-bg-sidebar)',
        borderBottom: '1px solid var(--color-border-subtle)',
        boxShadow: '0 2px 14px rgba(0,0,0,0.18)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onHome}
          className="rounded-lg px-1 py-1"
          style={{ border: '1px solid transparent', background: 'transparent' }}
          aria-label="Go to home page"
          title="Home"
        >
          <CivicOpsLogo />
        </button>
      </div>

      <div className="h-8 w-px" style={{ background: 'var(--color-border-subtle)' }} />

      <div className="min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Active District
        </div>
        <div className="truncate text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {selectedCity?.name ?? 'No district loaded'}
        </div>
      </div>

      <span
        className="hidden rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider md:inline-flex"
        style={{
          color: 'var(--color-accent-green)',
          border: '1px solid rgba(0,184,148,0.28)',
          background: 'rgba(0,184,148,0.07)',
        }}
      >
        Internal · Staff Only
      </span>

      <div className="flex-1" />

      {/* CivicOps action buttons */}
      <button
        onClick={openWorkQueue}
        className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
        style={{
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-panel)',
        }}
        title="Work Queue"
      >
        <ClipboardList size={14} />
        Work Queue
        {pendingCount > 0 && (
          <span
            className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold"
            style={{ background: '#E74C3C', color: 'white' }}
          >
            {pendingCount}
          </span>
        )}
      </button>

      <button
        onClick={openBudget}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
        style={{
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-panel)',
        }}
        title="Budget Impact"
      >
        <DollarSign size={14} />
        Budget
      </button>

      <button
        onClick={handleAnalyze}
        disabled={!selectedCity}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          color: 'var(--color-accent-cyan)',
          border: '1px solid rgba(0,212,255,0.35)',
          background: 'var(--color-bg-hover)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Search size={15} />
        {planning.hasAnalyzed ? 'Reanalyze' : 'Analyze Service Gaps'}
      </button>

      <button
        onClick={openMemo}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
        style={{
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-panel)',
        }}
        title="Planning Memo"
      >
        <FileText size={15} />
        Planning Memo
      </button>
    </header>
  )
}
