import { useState } from 'react'
import { Activity, Shield, Menu, X } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#091422', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#C17B2F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.1rem', lineHeight: 1 }}>
              Ujima SACCO
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
              AI Agent Dashboard
            </div>
          </div>
        </div>

        {/* DESKTOP AGENT STATUS */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[
            { label: 'Scout', color: '#2E6E4E' },
            { label: 'Guardian', color: '#C17B2F' },
            { label: 'Hunter', color: '#6BA8D4' },
          ].map(agent => (
            <div key={agent.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 5px ${agent.color}` }} className="agent-active" />
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>{agent.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.35rem 0.7rem' }}>
            <Activity size={11} color="#2E6E4E" />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
              {new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
            </span>
          </div>
        </div>

        {/* MOBILE AGENT DOTS */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {['#2E6E4E', '#C17B2F', '#6BA8D4'].map((color, i) => (
              <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}` }} className="agent-active" />
            ))}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
            {new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
          </div>
        </div>

      </div>
    </header>
  )
}