import { Activity, Shield } from 'lucide-react'

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#091422' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#C17B2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.2rem', lineHeight: 1 }}>
              Ujima SACCO
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
              AI Agent Dashboard · Phase 4 Live Prototype
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[
            { label: 'Scout', color: '#2E6E4E' },
            { label: 'Guardian', color: '#C17B2F' },
            { label: 'Hunter', color: '#6BA8D4' },
          ].map(agent => (
            <div key={agent.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} className="agent-active" />
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{agent.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.4rem 0.8rem' }}>
            <Activity size={12} color="#2E6E4E" />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              {new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
            </span>
          </div>
        </div>

      </div>
    </header>
  )
}