# CivicOps Planner

**Internal AI planning dashboard for city infrastructure teams.**

> Built for the Internal Tools Hacks hackathon — forked from UrbanMind AI.

---

## What It Is

CivicOps Planner is an internal operations tool for city planning departments. It helps public works teams, transit planners, budget analysts, and department directors analyze service gaps, plan infrastructure, assign follow-up tasks, and export planning memos — all in one dashboard.

This is not a public demo. It's built to feel like a real internal tool that city staff would actually use.

---

## Core Demo Flow

1. **Load District** — Select a city district to load its infrastructure data
2. **Run Analysis** — Hit Play to run the AI-assisted gap analysis over the planning horizon
3. **Review Service Gaps** — The sidebar shows 5 identified gaps with department assignments and costs
4. **Work Queue** — Click "Work Queue" to see and manage department tasks (Pending, In Review, Approved, Blocked)
5. **Budget Impact** — Click "Budget Impact" to see the $137M plan breakdown by department with operational metrics
6. **Planning Memo** — Click "Planning Memo" in the top bar to view the full internal memo with all sections
7. **Export** — Copy memo text, download JSON, or print

---

## Required Changes vs UrbanMind AI

| Feature | UrbanMind AI | CivicOps Planner |
|---|---|---|
| Product name | UrbanMind AI | CivicOps Planner |
| Audience | General public / demo | City planning staff |
| Landing screen | "Explore a Real City" | "Load District Data" |
| Navigation | Metrics, AI Insights, Actions | Service Gaps, Planning AI, Dept. Tasks |
| AI panel | Zone placement explanations | Internal planning rationale with dept routing |
| New: Work Queue | — | 5 tasks with department, priority, status, phase |
| New: Budget Panel | — | $137M breakdown + operational metrics |
| New: Planning Memo | — | Full 8-section internal memo with export |
| New: Phase indicator | — | Phase 1/2/3 in top bar |
| Sidebar | Scenario, Metrics, Infrastructure | Service Gaps with dept labels, quick actions |
| AI copy | "Claude is analyzing..." | "Planning assistant analyzing gap data..." |

---

## Tech Stack

- **React 18** + TypeScript
- **Vite** for local dev
- **Zustand** for state management
- **Framer Motion** for transitions
- **Mapbox GL** for the planning map
- **D3** for charts and sparklines
- **Tailwind CSS** for utility styling
- **Claude API** (Anthropic SDK) for AI planning explanations

---

## Setup

```bash
cd civicops-planner

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your keys:
# VITE_MAPBOX_TOKEN=your_mapbox_token
# VITE_ANTHROPIC_API_KEY=your_anthropic_key  (optional — app works offline)
# VITE_API_BASE_URL=http://localhost:8000     (optional — app works offline)

# Start dev server
npm run dev
```

The app runs fully in offline mode without a backend — map, analysis, and all UI features work without API keys. The AI planning explanations require an Anthropic API key.

---

## Submission Summary

**Hackathon:** Internal Tools Hacks

**Problem:** City planning teams lack a unified internal tool to connect gap analysis, department task assignment, budget tracking, and memo generation. Planning data lives in spreadsheets, maps are separate, and memo writing is manual.

**Solution:** CivicOps Planner puts the full planning workflow in one dashboard:
- AI identifies service gaps and routes them to the right department
- Work Queue tracks tasks by department, priority, and phase
- Budget Panel shows the $137M capital plan with operational metrics
- Planning Memo exports a ready-to-submit 8-section internal memo

**Key differentiator:** This feels like a real tool city staff would open every day, not a public demo. All language, UI, and data is framed for internal government operations use.

**Departments served:** Public Health, Education, Transit, Parks, Housing, Public Works

---

## Project Structure

```
civicops-planner/
├── src/
│   ├── App.tsx                          # Root — mounts all panels
│   ├── components/
│   │   ├── Planning/
│   │   │   ├── WorkQueue.tsx            # NEW: task management panel
│   │   │   ├── PlanningMemo.tsx         # NEW: 8-section internal memo
│   │   │   └── BudgetPanel.tsx          # NEW: $137M budget breakdown
│   │   ├── Layout/
│   │   │   ├── ControlBar.tsx           # Updated: CivicOps branding + memo button
│   │   │   ├── Sidebar.tsx              # Updated: Service Gaps + quick actions
│   │   │   ├── StepSummaryPanel.tsx     # Updated: planning tone
│   │   │   └── LeftSidebar.tsx          # Updated: planning tab labels
│   │   ├── AI/
│   │   │   └── AIPanel.tsx              # Updated: planning assistant tone
│   │   └── UI/
│   │       └── LandingScreen.tsx        # Updated: CivicOps branding + logo
│   └── stores/
│       └── uiStore.ts                   # Updated: memo/workqueue/budget state + WorkTask type
```

---

*CivicOps Planner — Internal use only. For city planning departments.*
