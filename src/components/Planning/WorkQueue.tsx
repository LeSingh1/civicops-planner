import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Clock, X, AlertCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useUIStore, type WorkTask } from '@/stores/uiStore'

const DEPT_COLORS: Record<WorkTask['department'], string> = {
  'Public Health': '#E74C3C',
  'Education': '#3498DB',
  'Transit': '#9B59B6',
  'Parks': '#27AE60',
  'Housing': '#E67E22',
  'Public Works': '#95A5A6',
}

const STATUS_CONFIG: Record<WorkTask['status'], { color: string; icon: React.ReactNode }> = {
  'Pending': { color: '#95A5A6', icon: <Circle size={13} /> },
  'In Review': { color: '#F39C12', icon: <Clock size={13} /> },
  'Approved': { color: '#27AE60', icon: <CheckCircle2 size={13} /> },
  'Blocked': { color: '#E74C3C', icon: <AlertCircle size={13} /> },
}

const PRIORITY_COLORS: Record<WorkTask['priority'], string> = {
  'High': '#E74C3C',
  'Medium': '#F39C12',
  'Low': '#95A5A6',
}

export function WorkQueue() {
  const isOpen = useUIStore((state) => state.isWorkQueueOpen)
  const close = useUIStore((state) => state.closeWorkQueue)
  const tasks = useUIStore((state) => state.workTasks)
  const updateTaskStatus = useUIStore((state) => state.updateTaskStatus)
  const [filterDept, setFilterDept] = useState<string>('All')
  const [filterPhase, setFilterPhase] = useState<number>(0)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const filtered = tasks.filter((t) => {
    if (filterDept !== 'All' && t.department !== filterDept) return false
    if (filterPhase > 0 && t.phase !== filterPhase) return false
    return true
  })

  const depts = ['All', 'Public Health', 'Education', 'Transit', 'Parks', 'Housing', 'Public Works']

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
            width: 420, background: 'var(--color-bg-panel)',
            borderLeft: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-lg)', overflow: 'auto',
            display: 'flex', flexDirection: 'column',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Work Queue"
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontSize: 17, fontWeight: 700 }}>Work Queue</h2>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: 12 }}>
                  {tasks.filter((t) => t.status === 'Pending').length} pending · {tasks.filter((t) => t.status === 'In Review').length} in review
                </p>
              </div>
              <button className="icon-btn" onClick={close} aria-label="Close work queue"><X size={16} /></button>
            </div>

            {/* Phase filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {[0, 1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPhase(p)}
                  style={{
                    height: 26, padding: '0 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${filterPhase === p ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)'}`,
                    background: filterPhase === p ? 'rgba(46,134,193,0.15)' : 'transparent',
                    color: filterPhase === p ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {p === 0 ? 'All Phases' : `Phase ${p}`}
                </button>
              ))}
            </div>

            {/* Dept filter */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {depts.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDept(d)}
                  style={{
                    height: 22, padding: '0 8px', borderRadius: 3, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${filterDept === d ? (DEPT_COLORS[d as WorkTask['department']] ?? 'var(--color-brand-primary)') : 'var(--color-border-subtle)'}`,
                    background: filterDept === d ? `${(DEPT_COLORS[d as WorkTask['department']] ?? '#2E86C1')}22` : 'transparent',
                    color: filterDept === d ? (DEPT_COLORS[d as WorkTask['department']] ?? 'var(--color-brand-primary)') : 'var(--color-text-muted)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Task list */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px' }}>
            {filtered.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No tasks match filter.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    expanded={expandedTask === task.id}
                    onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    onStatusChange={(s) => updateTaskStatus(task.id, s)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Summary footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-secondary)', flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {(['Pending', 'In Review', 'Approved', 'Blocked'] as WorkTask['status'][]).map((s) => {
                const count = tasks.filter((t) => t.status === s).length
                const cfg = STATUS_CONFIG[s]
                return (
                  <div key={s} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 6, background: 'var(--color-bg-panel)' }}>
                    <div style={{ color: cfg.color, fontSize: 18, fontWeight: 800 }}>{count}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function TaskCard({
  task,
  expanded,
  onToggle,
  onStatusChange,
}: {
  task: WorkTask
  expanded: boolean
  onToggle: () => void
  onStatusChange: (s: WorkTask['status']) => void
}) {
  const deptColor = DEPT_COLORS[task.department]
  const statusCfg = STATUS_CONFIG[task.status]

  return (
    <motion.div
      style={{
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 8,
        background: 'var(--color-bg-card)',
        overflow: 'hidden',
      }}
      whileHover={{ borderColor: 'rgba(46,134,193,0.3)' }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', padding: '12px 14px',
          background: 'transparent', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}
      >
        <div style={{ flexShrink: 0, marginTop: 2, color: statusCfg.color }}>{statusCfg.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              height: 18, padding: '0 7px', borderRadius: 3, fontSize: 10, fontWeight: 700,
              background: `${deptColor}22`, color: deptColor, display: 'inline-flex', alignItems: 'center',
            }}>
              {task.department}
            </span>
            <span style={{ fontSize: 10, color: PRIORITY_COLORS[task.priority], fontWeight: 700 }}>
              {task.priority}
            </span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              Phase {task.phase}
            </span>
          </div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{task.title}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 3 }}>
            Gap: {task.gap} · Est. {task.estimatedCost}
          </div>
        </div>
        <ChevronDown
          size={14}
          style={{ flexShrink: 0, color: 'var(--color-text-muted)', marginTop: 3, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 12 }}>
              <div style={{ marginBottom: 10, color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                Update Status
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['Pending', 'In Review', 'Approved', 'Blocked'] as WorkTask['status'][]).map((s) => {
                  const cfg = STATUS_CONFIG[s]
                  return (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      style={{
                        height: 26, padding: '0 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        border: `1px solid ${task.status === s ? cfg.color : 'var(--color-border-subtle)'}`,
                        background: task.status === s ? `${cfg.color}22` : 'transparent',
                        color: task.status === s ? cfg.color : 'var(--color-text-muted)',
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
