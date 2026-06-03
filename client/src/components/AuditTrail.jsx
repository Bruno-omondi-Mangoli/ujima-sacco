import { Clock, Database } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function AuditTrail({ auditLog }) {
  const agentColors = {
    SCOUT:    { color: '#5CB88A', bg: 'rgba(46,110,78,0.15)' },
    GUARDIAN: { color: '#E8A84A', bg: 'rgba(193,123,47,0.15)' },
    HUNTER:   { color: '#6BA8D4', bg: 'rgba(107,168,212,0.15)' },
    HUMAN:    { color: '#D476A8', bg: 'rgba(139,58,98,0.15)' },
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Database size={14} color="rgba(255,255,255,0.3)" />
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          Audit Trail
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
          {auditLog.length} entries
        </span>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {auditLog.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem' }}>
            No decisions logged yet
          </div>
        ) : (
          auditLog.map(entry => {
            const agentStyle = agentColors[entry.agent] || { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' }
            return (
              <div key={entry.id} className="slide-in" style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', padding: '0.1rem 0.45rem', borderRadius: '2px', background: agentStyle.bg, color: agentStyle.color, letterSpacing: '0.1em' }}>
                    {entry.agent}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    {entry.member}
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={10} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>
                      {new Date(entry.timestamp).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  {entry.reason || entry.decisionReason || entry.sms || `${entry.agent} agent processed ${entry.member}`}
                </div>
                {entry.decision && (
                  <div style={{ marginTop: '0.3rem' }}>
                    <StatusBadge status={entry.decision} />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}