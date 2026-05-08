import { create } from 'zustand'
import type { ZoneExplanation } from '@/types/simulation.types'

type Tab = 'overview' | 'mobility' | 'economy' | 'environment'

export interface WorkTask {
  id: string
  title: string
  department: 'Public Health' | 'Education' | 'Transit' | 'Parks' | 'Housing' | 'Public Works'
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'In Review' | 'Approved' | 'Blocked'
  phase: 1 | 2 | 3
  gap: string
  estimatedCost: string
}

interface UIStore {
  activeLayers: Set<string>
  activeTab: Tab
  isDashboardOpen: boolean
  isDrawerOpen: boolean
  drawerContent: ZoneExplanation | null
  isSplitScreen: boolean
  isOverrideModeActive: boolean
  selectedOverrideZone: string | null
  detailedGrid: boolean
  activeMapLayer: string
  highlightedZoneToken: string | null
  is3DMode: boolean
  isMemoOpen: boolean
  isWorkQueueOpen: boolean
  isBudgetOpen: boolean
  workTasks: WorkTask[]
  toggleLayer: (layerId: string) => void
  setActiveTab: (tab: Tab) => void
  openDashboard: () => void
  closeDashboard: () => void
  openDrawer: (content: ZoneExplanation) => void
  updateDrawer: (patch: Partial<ZoneExplanation>) => void
  closeDrawer: () => void
  setOverrideZone: (zoneId: string | null) => void
  setSplitScreen: (enabled: boolean) => void
  setDetailedGrid: (enabled: boolean) => void
  setActiveMapLayer: (layer: string) => void
  setHighlightedZoneToken: (token: string | null) => void
  toggle3D: () => void
  openMemo: () => void
  closeMemo: () => void
  openWorkQueue: () => void
  closeWorkQueue: () => void
  openBudget: () => void
  closeBudget: () => void
  updateTaskStatus: (id: string, status: WorkTask['status']) => void
}

const DEFAULT_TASKS: WorkTask[] = [
  { id: 'task-001', title: 'Review South Emergency Gap Clinic', department: 'Public Health', priority: 'High', status: 'In Review', phase: 1, gap: 'South Emergency Gap', estimatedCost: '$18M' },
  { id: 'task-002', title: 'Estimate East Education District School cost', department: 'Education', priority: 'High', status: 'Pending', phase: 2, gap: 'East Education Gap', estimatedCost: '$32M' },
  { id: 'task-003', title: 'Validate North Transit Hub feasibility', department: 'Transit', priority: 'Medium', status: 'Pending', phase: 3, gap: 'North Transit Gap', estimatedCost: '$45M' },
  { id: 'task-004', title: 'Review Central Green Corridor land use', department: 'Parks', priority: 'Medium', status: 'Approved', phase: 1, gap: 'Central Parks Gap', estimatedCost: '$14M' },
  { id: 'task-005', title: 'Prepare public works memo', department: 'Public Works', priority: 'Low', status: 'Pending', phase: 2, gap: 'Community Center', estimatedCost: '$22M' },
]

export const useUIStore = create<UIStore>((set) => ({
  activeLayers: new Set([
    'Existing hospitals',
    'Existing schools',
    'Existing parks',
    'Existing transit',
    'Existing police stations',
    'Existing fire stations',
    'Underserved zones',
    'AI Recommendations',
    'Proposed infrastructure',
    'Coverage Rings',
  ]),
  activeTab: 'overview',
  isDashboardOpen: false,
  isDrawerOpen: false,
  drawerContent: null,
  isSplitScreen: false,
  isOverrideModeActive: false,
  selectedOverrideZone: null,
  detailedGrid: false,
  activeMapLayer: 'zones',
  highlightedZoneToken: null,
  is3DMode: false,
  isMemoOpen: false,
  isWorkQueueOpen: false,
  isBudgetOpen: false,
  workTasks: DEFAULT_TASKS,

  toggleLayer: (layerId) =>
    set((state) => {
      const next = new Set(state.activeLayers)
      if (next.has(layerId)) next.delete(layerId)
      else next.add(layerId)
      return { activeLayers: next }
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openDashboard: () => set({ isDashboardOpen: true }),
  closeDashboard: () => set({ isDashboardOpen: false }),
  openDrawer: (content) => set({ isDrawerOpen: true, drawerContent: content }),
  updateDrawer: (patch) => set((state) => ({
    drawerContent: state.drawerContent ? { ...state.drawerContent, ...patch } : state.drawerContent,
  })),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setOverrideZone: (zoneId) => set({ selectedOverrideZone: zoneId, isOverrideModeActive: Boolean(zoneId) }),
  setSplitScreen: (enabled) => set({ isSplitScreen: enabled }),
  setDetailedGrid: (enabled) => set({ detailedGrid: enabled }),
  setActiveMapLayer: (layer) => set({ activeMapLayer: layer }),
  setHighlightedZoneToken: (token) => set({ highlightedZoneToken: token }),
  toggle3D: () => set((state) => ({ is3DMode: !state.is3DMode })),
  openMemo: () => set({ isMemoOpen: true }),
  closeMemo: () => set({ isMemoOpen: false }),
  openWorkQueue: () => set({ isWorkQueueOpen: true }),
  closeWorkQueue: () => set({ isWorkQueueOpen: false }),
  openBudget: () => set({ isBudgetOpen: true }),
  closeBudget: () => set({ isBudgetOpen: false }),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      workTasks: state.workTasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}))
