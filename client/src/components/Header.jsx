import { Activity, Shield } from 'lucide-react'
import useWindowSize from '../hooks/useWindowSize'

export default function Header() {
  const { isMobile } = useWindowSize()

  return (
    <header style={{
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: '#091422',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0.8rem 1rem' : '0.9rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        {/* BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            borderRadius: '50%',
            background: '#C17B2F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Shield size={isMobile ? 14 : 16} color="white" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              color: 'white',
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: 1
            }}>
              Ujima SACCO
            </div>
            {!isMobile && (
              <div style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '0.2rem'
              }}>
                AI Agent Dashboard · Phase 4 Live Prototype
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.6rem' : '1.5rem' }}>

          {/* AGENT DOTS — always visible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.4rem' : '1rem' }}>
            {[
              { label: 'Scout',    color: '#2E6E4E' },
              { label: 'Guardian', color: '#C17B2F' },
              { label: 'Hunter',   color: '#6BA8D4' },
            ].map(agent => (
              <div key={agent.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 5px ${agent.color}`
                }} className="agent-active" />
                {!isMobile && (
                  <span style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.4)'
                  }}>
                    {agent.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* TIME */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: isMobile ? '0.3rem 0.5rem' : '0.35rem 0.7rem'
          }}>
            <Activity size={10} color="#2E6E4E" />
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: isMobile ? '0.6rem' : '0.68rem',
              color: 'rgba(255,255,255,0.4)'
            }}>
              {new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
            </span>
          </div>
        </div>

      </div>
    </header>
  )
}