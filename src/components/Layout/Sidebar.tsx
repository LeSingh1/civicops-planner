import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ClipboardList, DollarSign, FileText, Pause, RotateCcw, Undo2 } from 'lucide-react'
import * as d3 from 'd3'
import { useCityStore } from '@/stores/cityStore'
import { scenarioColors, scenarioLabels, useScenarioStore } from '@/stores/scenarioStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { useUIStore } from '@/stores/uiStore'
import { getZoneColor } from '@/utils/colorUtils'

const layers = ['Zones', 'Roads', '3D Buildings', 'Population Heatmap', 'Flood Risk', 'Equity Overlay', 'Smart Infrastructure', 'Disaster Risk', 'Satellite Base']
const overrideZones = ['RES_LOW_DETACHED', 'RES_MED_APARTMENT', 'RES_HIGH_TOWER', 'COM_SMALL_SHOP', 'COM_OFFICE_PLAZA', 'IND_WAREHOUSE', 'BUS_STATION', 'HEALTH_HOSPITAL', 'EDU_HIGH', 'PARK_SMALL', 'SOLAR_FARM', 'SMART_TRAFFIC_LIGHT']

const GAP_RECOMMENDATIONS = [
  { name: 'South Emergency Gap Clinic', dept: 'Public Health', cost: '$18M', residents: 22000, impact: '+24% Emergency Access', color: '#E74C3C' },
  { name: 'East Education District School', dept: 'Education', cost: '$32M', residents: 15400, impact: '+31% School Access', color: '#3498DB' },
  { name: 'North Transit Hub', dept: 'Transit', cost: '$45M', residents: 38000, impact: '+18% Transit Coverage', color: '#9B59B6' },
  { name: 'Central Green Corridor', dept: 'Parks', cost: '$14M', residents: 9200, impact: '+12% Green Space', color: '#27AE60' },
  { name: 'New Housing Community Center', dept: 'Housing', cost: '$22M', residents: 11800, impact: '+19% Community Access', color: '#E67E22' },
]

export function Sidebar({ wsSend }: { wsSend: (payload: unknown) => void }) {
  const city = useCityStore((state) => state.selectedCity)
  const metrics = useSimulationStore((state) => state.currentFrame?.metrics_snapshot)
  const history = useSimulationStore((state) => state.metricsHistory)
  const isPaused = useSimulationStore((state) => state.isPaused)
  const actions = useSimulationStore((state) => state.lastActions)
  const activeScenario = useScenarioStore((state) => state.activeScenario)
  const setScenario = useScenarioStore((state) => state.setScenario)
  const activeLayers = useUIStore((state) => state.activeLayers)
  const toggleLayer = useUIStore((state) => state.toggleLayer)
  const activeTab = useUIStore((state) => state.activeTab)
  const setActiveTab = useUIStore((state) => state.setActiveTab)
  const openDashboard = useUIStore((state) => state.openDashboard)
  const setOverrideZone = useUIStore((state) => state.setOverrideZone)
  const openDrawer = useUIStore((state) => state.openDrawer)
  const openWorkQueue = useUIStore((state) => state.openWorkQueue)
  const openBudget = useUIStore((state) => state.openBudget)
  const workTasks = useUIStore((state) => state.workTasks)
  const pendingCount = workTasks.filter((t) => t.status === 'Pending').length

  const tabMetrics = metricCards(activeTab, metrics)

  return (
    <aside style={{ position: 'fixed', left: 0, top: 56, width: 320, height: 'calc(100vh - 120px)', zIndex: 40, background: 'var(--color-bg-sidebar)', overflowY: 'auto', borderRight: '1px solid var(--color-border-subtle)', padding: 16 }}>

      {/* District header */}
      <section style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--color-border-subtle)' }}>
        <img src={city ? thumbnailUrl(city) : ''} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: 'var(--color-bg-card)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-accent)' }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Active District</span>
          </div>
          <h2 style={{ margin: 0, color: 'white', fontSize: 16, fontWeight: 700 }}>{city?.name}</h2>
          <p style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)', fontSize: 12 }}>{city?.country} · {formatCompact(city?.population_current ?? 0)} residents</p>
        </div>
      </section>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '14px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <button
          onClick={openWorkQueue}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid var(--color-border-subtle)', borderRadius: 7, background: 'var(--color-bg-panel)', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', position: 'relative' }}
        >
          <ClipboardList size={14} />
          Work Queue
          {pendingCount > 0 && (
            <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#E74C3C', color: 'white', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={openBudget}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid var(--color-border-subtle)', borderRadius: 7, background: 'var(--color-bg-panel)', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          <DollarSign size={14} />
          Budget Impact
        </button>
      </div>

      <CollapsibleSection title="Analysis Scenario">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(Object.keys(scenarioLabels) as Array<keyof typeof scenarioLabels>).map((scenario) => (
            <button
              key={scenario}
              onClick={() => {
                if (scenario !== activeScenario) wsSend({ type: 'SCENARIO_CHANGE', scenario_id: scenario })
                setScenario(scenario)
              }}
              style={{ minHeight: 36, borderRadius: 999, border: `1px solid ${scenarioColors[scenario]}`, background: activeScenario === scenario ? scenarioColors[scenario] : 'transparent', color: activeScenario === scenario ? 'white' : scenarioColors[scenario], fontSize: 12, fontWeight: 700 }}
            >
              {scenarioLabels[scenario]}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Service Gaps">
        <div style={{ display: 'grid', gap: 8 }}>
          {GAP_RECOMMENDATIONS.map((gap) => (
            <div key={gap.name} style={{ border: `1px solid ${gap.color}33`, borderRadius: 8, background: 'var(--color-bg-panel)', padding: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
                <span style={{ color: 'white', fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{gap.name}</span>
                <span style={{ flexShrink: 0, height: 18, padding: '0 7px', borderRadius: 3, background: `${gap.color}22`, color: gap.color, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>{gap.dept}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span>{gap.residents.toLocaleString()} residents</span>
                <span style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>{gap.impact}</span>
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: gap.color, fontSize: 13, fontWeight: 700 }}>{gap.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Operational Metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 12 }}>
          {(['overview', 'mobility', 'economy', 'environment'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ height: 28, border: 0, borderBottom: activeTab === tab ? '2px solid var(--color-brand-secondary)' : '2px solid transparent', background: 'transparent', color: activeTab === tab ? 'white' : 'var(--color-text-muted)', fontSize: 11, textTransform: 'capitalize', cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {tabMetrics.map((card) => <MetricCard key={card.label} {...card} sparklineData={history.map((item) => card.get(item))} onClick={openDashboard} />)}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Population Trend">
        <button onClick={openDashboard} style={{ width: '100%', border: '1px solid var(--color-border-subtle)', borderRadius: 8, background: 'var(--color-bg-panel)', padding: 10, cursor: 'pointer' }}>
          <MiniLine data={history.map((item) => item.pop_total)} />
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Infrastructure Coverage">
        {[
          ['Transit Hubs', metrics?.mobility_transit_coverage ?? 0],
          ['Hospitals', metrics?.equity_hosp_coverage ?? 0],
          ['Schools', metrics?.equity_school_access ?? 0],
          ['Power Grid', metrics?.infra_power_load ?? 0],
          ['Water Supply', metrics?.infra_water_capacity ?? 0],
          ['Emergency Response', Math.max(0, 100 - (metrics?.safety_response_time ?? 8) * 10)],
        ].map(([label, value]) => <CapacityBar key={label as string} label={label as string} value={Number(value)} />)}
      </CollapsibleSection>

      <CollapsibleSection title="Layers">
        <div style={{ display: 'grid', gap: 10 }}>
          {layers.map((layer) => (
            <label key={layer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: 13 }}>
              {layer}
              <button onClick={() => toggleLayer(layer)} style={{ width: 36, height: 20, border: 0, borderRadius: 999, background: activeLayers.has(layer) ? 'var(--color-brand-accent)' : 'var(--color-bg-hover)', padding: 2 }}>
                <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', background: 'white', transform: activeLayers.has(layer) ? 'translateX(16px)' : 'translateX(0)', transition: 'var(--transition-fast)' }} />
              </button>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {isPaused && (
        <CollapsibleSection title="Infrastructure Placement">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-brand-warning)', fontSize: 12, marginBottom: 10 }}><Pause size={14} /> Analysis paused — place infrastructure</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {overrideZones.map((zone) => <button key={zone} title={`${zone} · min SPS 4.0`} onClick={() => setOverrideZone(zone)} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--color-border-subtle)', background: getZoneColor(zone), color: 'white', fontSize: 10, fontWeight: 800 }}>{zone.slice(0, 2)}</button>)}
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Click any empty map cell to place zone</p>
          <div style={{ display: 'flex', gap: 8 }}><button className="icon-btn"><Undo2 size={15} /></button><button className="icon-btn"><RotateCcw size={15} /></button></div>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="AI Plan Recommendations">
        <div style={{ display: 'grid', gap: 8 }}>
          {actions.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Run analysis to generate AI infrastructure recommendations.</p>}
          {actions.map((action, index) => (
            <button key={`${action.x}-${action.y}-${index}`} onClick={() => openDrawer({ ...action, year: metrics?.year ?? 0, explanation_text: 'Loading...', metrics_delta: {}, surrounding_context: 'Nearby parcels, service access, and growth demand' })} style={{ textAlign: 'left', border: '1px solid var(--color-border-subtle)', borderRadius: 8, background: 'var(--color-bg-panel)', padding: 10, color: 'white', cursor: 'pointer' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: getZoneColor(action.zone_type_id), marginRight: 8 }} />
              <strong style={{ fontSize: 12 }}>{action.zone_display_name}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>Plan Year {metrics?.year ?? 0} · Coverage {action.sps_score.toFixed(1)}</p>
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </aside>
  )
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section style={{ borderBottom: '1px solid var(--color-border-subtle)', padding: '14px 0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', border: 0, background: 'transparent', color: 'white', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.7 }}>
        {title}<span>{open ? '-' : '+'}</span>
      </button>
      <motion.div initial={false} animate={{ maxHeight: open ? 2000 : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', paddingTop: open ? 12 : 0 }}>
        {children}
      </motion.div>
    </section>
  )
}

function MetricCard({ label, value, delta, unit, sparklineData, onClick }: { label: string; value: number | string; delta: number; unit: string; sparklineData: number[]; get: (m: any) => number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ minHeight: 96, textAlign: 'left', border: '1px solid var(--color-border-subtle)', borderRadius: 8, background: 'var(--color-bg-panel)', padding: 10, color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 800 }}><span>{label}</span><span style={{ color: delta >= 0 ? 'var(--color-brand-accent)' : 'var(--color-brand-danger)' }}>{delta >= 0 ? '^' : 'v'} {Math.abs(delta)}</span></div>
      <div style={{ marginTop: 8 }}><strong style={{ fontSize: 25 }}>{value}</strong><span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}> {unit}</span></div>
      <MiniLine data={sparklineData.slice(-10)} height={18} />
    </button>
  )
}

function MiniLine({ data, height = 70 }: { data: number[]; height?: number }) {
  const width = 260
  const points = useMemo(() => {
    if (data.length < 2) return ''
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width])
    const y = d3.scaleLinear().domain(d3.extent(data) as [number, number]).range([height, 0]).nice()
    return d3.line<number>().x((_, i) => x(i)).y((d) => y(d))(data) ?? ''
  }, [data, height])
  return <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}><path d={points} fill="none" stroke="#60A5FA" strokeWidth="2" /></svg>
}

function CapacityBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return <div style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)' }}><span>{label}</span><span>{Math.round(pct)}%</span></div><div style={{ height: 6, borderRadius: 999, background: 'var(--color-bg-card)', overflow: 'hidden', marginTop: 5 }}><div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? 'var(--color-brand-danger)' : 'var(--color-brand-accent)' }} /></div></div>
}

function metricCards(tab: string, metrics: any) {
  const m = metrics ?? {}
  const cards = {
    overview: [
      ['Population', formatCompact(m.pop_total ?? 0), 2.1, '', (x: any) => x.pop_total],
      ['Density', Math.round(m.pop_density_avg ?? 0), 1.4, '/km2', (x: any) => x.pop_density_avg],
      ['Green', Math.round(m.env_green_ratio ?? 0), 0.8, '%', (x: any) => x.env_green_ratio],
      ['Equity', Math.round(100 - (m.equity_infra_gini ?? 0)), -0.2, '', (x: any) => 100 - x.equity_infra_gini],
    ],
    mobility: [
      ['Commute', Math.round(m.mobility_commute ?? 0), -1, 'min', (x: any) => x.mobility_commute],
      ['Congestion', Math.round(m.mobility_congestion ?? 0), 3, '%', (x: any) => x.mobility_congestion],
      ['Transit', Math.round(m.mobility_transit_coverage ?? 0), 2, '%', (x: any) => x.mobility_transit_coverage],
      ['Walkability', Math.round(m.mobility_walkability ?? 0), 1, '', (x: any) => x.mobility_walkability],
    ],
    economy: [
      ['GDP', formatCompact(m.econ_gdp_est ?? 0), 4, '', (x: any) => x.econ_gdp_est],
      ['Housing', Math.round(m.econ_housing_afford ?? 0), 1, '', (x: any) => x.econ_housing_afford],
      ['Jobs', formatCompact(m.econ_jobs_created ?? 0), 5, '', (x: any) => x.econ_jobs_created],
      ['Growth', Math.round((m.pop_growth_rate ?? 0) * 10) / 10, 0.4, '%', (x: any) => x.pop_growth_rate],
    ],
    environment: [
      ['CO2', Math.round(m.env_co2_est ?? 0), -2, 'kt', (x: any) => x.env_co2_est],
      ['Impervious', Math.round(m.env_impervious ?? 0), 2, '%', (x: any) => x.env_impervious],
      ['Flood', Math.round(m.env_flood_exposure ?? 0), -1, '%', (x: any) => x.env_flood_exposure],
      ['Water', Math.round(m.infra_water_capacity ?? 0), 1, '%', (x: any) => x.infra_water_capacity],
    ],
  } as Record<string, any[]>
  return cards[tab].map(([label, value, delta, unit, get]) => ({ label, value, delta, unit, get }))
}

function thumbnailUrl(city: any): string {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  return token ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${city.center_lng},${city.center_lat},${city.default_zoom}/120x120@2x?access_token=${token}` : ''
}

function formatCompact(value: number) {
  return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
