export default function StatusBadge({ status }) {
  const styles = {
    HIGH:               { background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)' },
    CRITICAL:           { background: 'rgba(185,28,28,0.15)', color: '#fca5a5', border: '1px solid rgba(185,28,28,0.3)' },
    MEDIUM:             { background: 'rgba(193,123,47,0.15)', color: '#E8A84A', border: '1px solid rgba(193,123,47,0.3)' },
    LOW:                { background: 'rgba(46,110,78,0.15)', color: '#5CB88A', border: '1px solid rgba(46,110,78,0.3)' },
    APPROVED:           { background: 'rgba(46,110,78,0.15)', color: '#5CB88A', border: '1px solid rgba(46,110,78,0.3)' },
    DENIED:             { background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)' },
    PENDING:            { background: 'rgba(193,123,47,0.15)', color: '#E8A84A', border: '1px solid rgba(193,123,47,0.3)' },
    ESCALATE_TO_HUNTER: { background: 'rgba(107,168,212,0.15)', color: '#6BA8D4', border: '1px solid rgba(107,168,212,0.3)' },
    AUTO_APPROVE:       { background: 'rgba(46,110,78,0.15)', color: '#5CB88A', border: '1px solid rgba(46,110,78,0.3)' },
    AUTO_DENY:          { background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)' },
    URGENT:             { background: 'rgba(185,28,28,0.15)', color: '#fca5a5', border: '1px solid rgba(185,28,28,0.3)' },
    PASSED:             { background: 'rgba(46,110,78,0.15)', color: '#5CB88A', border: '1px solid rgba(46,110,78,0.3)' },
    FAILED:             { background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)' },
  }

  const style = styles[status] || { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <span style={{
      ...style,
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: '0.65rem',
      padding: '0.15rem 0.5rem',
      borderRadius: '3px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}