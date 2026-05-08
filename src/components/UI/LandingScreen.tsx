import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, X } from 'lucide-react'
import { useCityStore } from '@/stores/cityStore'
import type { CityProfile } from '@/types/city.types'
import { SandboxBuilder } from './SandboxBuilder'

interface Props {
  onEnter: () => void
}

export function LandingScreen({ onEnter }: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [sandboxOpen, setSandboxOpen] = useState(false)

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#0D1117' }}>
      <GridBackground />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 24 }}>
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: 'min(520px, 100%)', borderRadius: 16, padding: 40, textAlign: 'center' }}
        >
          <CivicOpsLogo large />
          <p style={{ margin: '12px 0 6px', color: 'var(--color-text-secondary)', fontSize: 15 }}>
            Internal AI planning dashboard for city infrastructure teams.
          </p>
          <p style={{ margin: '0 0 28px', color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Public Works · Transit · Parks · Housing · Public Health
          </p>
          <button className="primary-cta" onClick={() => setGalleryOpen(true)}>
            <MapPin size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            Load District Data
          </button>
          <button className="secondary-cta" onClick={() => setSandboxOpen(true)}>
            <Briefcase size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            New Planning Session
          </button>
          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(46,134,193,0.08)', borderRadius: 8, border: '1px solid rgba(46,134,193,0.2)', textAlign: 'left' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>For authorized staff only</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>This tool is for internal use by city planning departments. All sessions are logged for audit purposes.</div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {galleryOpen && <DistrictGallery onClose={() => setGalleryOpen(false)} onEnter={onEnter} />}
        {sandboxOpen && <SandboxOverlay onClose={() => setSandboxOpen(false)} onGenerated={onEnter} />}
      </AnimatePresence>
      <style>{`
        .primary-cta, .secondary-cta {
          width: 100%;
          height: 46px;
          border-radius: var(--radius-md);
          margin-top: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: var(--transition-fast);
          cursor: pointer;
        }
        .primary-cta {
          border: 1px solid var(--color-brand-primary);
          background: var(--color-brand-primary);
          color: white;
        }
        .primary-cta:hover { opacity: 0.88; }
        .secondary-cta {
          border: 1px solid var(--color-border-subtle);
          background: transparent;
          color: var(--color-text-secondary);
        }
        .secondary-cta:hover { border-color: var(--color-brand-accent); color: var(--color-brand-accent); }
        .district-card:hover {
          border-color: var(--color-border-active);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  )
}

function SandboxOverlay({ onClose, onGenerated }: { onClose: () => void; onGenerated: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 110, overflow: 'auto', padding: 32, background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(8px)' }}>
      <button className="icon-btn" onClick={onClose} style={{ position: 'fixed', top: 20, right: 20 }} aria-label="Close"><X size={18} /></button>
      <SandboxBuilder onGenerated={() => { onClose(); onGenerated() }} />
    </motion.div>
  )
}

export function CivicOpsLogo({ large = false }: { large?: boolean }) {
  const size = large ? 40 : 22
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="civicops-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E86C1" />
            <stop offset="100%" stopColor="#17A589" />
          </linearGradient>
        </defs>
        {/* City hall dome */}
        <rect x="4" y="32" width="32" height="4" rx="1" fill="url(#civicops-logo)" opacity="0.7" />
        <rect x="8" y="20" width="24" height="12" rx="1" fill="url(#civicops-logo)" opacity="0.85" />
        <rect x="12" y="14" width="16" height="6" rx="1" fill="url(#civicops-logo)" />
        <path d="M20 6 L28 14 L12 14 Z" fill="url(#civicops-logo)" />
        <rect x="16" y="24" width="4" height="8" rx="0.5" fill="rgba(255,255,255,0.3)" />
        <rect x="22" y="24" width="4" height="8" rx="0.5" fill="rgba(255,255,255,0.3)" />
        {/* Grid dots */}
        <circle cx="6" cy="10" r="1.5" fill="var(--color-brand-accent)" opacity="0.6" />
        <circle cx="34" cy="10" r="1.5" fill="var(--color-brand-accent)" opacity="0.6" />
        <circle cx="6" cy="18" r="1" fill="var(--color-brand-accent)" opacity="0.4" />
        <circle cx="34" cy="18" r="1" fill="var(--color-brand-accent)" opacity="0.4" />
      </svg>
      <div style={{ textAlign: 'left' }}>
        <strong style={{ color: 'white', fontSize: large ? 28 : 14, fontWeight: 800, letterSpacing: -0.3, display: 'block', lineHeight: 1 }}>
          CivicOps
        </strong>
        {large && (
          <span style={{ color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
            Planner
          </span>
        )}
        {!large && (
          <span style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>
            Planner
          </span>
        )}
      </div>
    </div>
  )
}

/** Keep old Logo export for any remaining references */
export const Logo = CivicOpsLogo

function DistrictGallery({ onClose, onEnter }: { onClose: () => void; onEnter: () => void }) {
  const cities = useCityStore((state) => state.cities)
  const selectCity = useCityStore((state) => state.selectCity)

  const chooseCity = (city: CityProfile) => {
    selectCity(city)
    onClose()
    onEnter()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'auto', padding: 32, background: 'rgba(13,17,23,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <button className="icon-btn" onClick={onClose} style={{ position: 'fixed', top: 20, right: 20 }} aria-label="Close"><X size={18} /></button>
      <div style={{ width: 'min(960px, 100%)', margin: '48px auto' }}>
        <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Select District</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 24 }}>Choose a city district to load its infrastructure data and begin planning analysis.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {cities.map((city) => (
            <button
              key={city.id}
              className="district-card"
              onClick={() => chooseCity(city)}
              style={{ width: '100%', textAlign: 'left', border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden', background: 'var(--color-bg-panel)', transition: 'var(--transition-med)', color: 'white', padding: 0, cursor: 'pointer' }}
            >
              <img src={thumbnailUrl(city)} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', background: 'var(--color-bg-card)' }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{city.name}</h3>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(46,134,193,0.15)', color: 'var(--color-brand-primary)', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Active
                  </span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{city.country} · {formatPopulation(city.population_current)}</p>
                <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: 'var(--color-text-muted)' }}>{city.key_planning_challenge}</p>
                <div style={{ marginTop: 12, color: 'var(--color-brand-primary)', fontSize: 12, fontWeight: 700 }}>Load District Data →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function GridBackground() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2E86C1" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

function thumbnailUrl(city: CityProfile): string {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) return ''
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${city.center_lng},${city.center_lat},${city.default_zoom}/280x140@2x?access_token=${token}`
}

function formatPopulation(value: number) {
  return `${(value / 1_000_000).toFixed(value > 10_000_000 ? 1 : 2)}M residents`
}
