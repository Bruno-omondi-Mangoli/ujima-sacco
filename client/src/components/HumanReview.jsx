import { useState } from 'react'
import { UserCheck, ThumbsUp, ThumbsDown } from 'lucide-react'
import toast from 'react-hot-toast'
import StatusBadge from './StatusBadge'

export default function HumanReview({ member, hunterResult, onDecision }) {
  const [decision, setDecision] = useState(null)
  const [note, setNote] = useState('')

  const makeDecision = (d) => {
    if (!hunterResult) return toast.error('Hunter briefing required first')
    setDecision(d)
    onDecision({ decision: d, note, member: member?.name, officer: hunterResult?.assignedOfficer })
    toast.success(`Decision recorded: ${d}`)
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(139,58,98,0.3)', borderRadius: '8px', overflow: 'hidden' }}>

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(139,58,98,0.2)', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(139,58,98,0.06)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139,58,98,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCheck size={13} color="#D476A8" />
        </div>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#D476A8', fontWeight: 500 }}>Human Review</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
            {hunterResult ? `Officer: ${hunterResult.assignedOfficer}` : 'PRIDE Loop Pause Point'}
          </div>
        </div>
        {decision && <div style={{ marginLeft: 'auto' }}><StatusBadge status={decision} /></div>}
      </div>

      <div style={{ padding: '1.2rem' }}>
        {!hunterResult && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem' }}>
            Waiting for Hunter briefing packet
          </div>
        )}

        {hunterResult && !decision && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {hunterResult.briefingSummary}
            </div>

            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Officer Note (optional)</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for the audit trail..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.6rem 0.8rem', color: 'white', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', resize: 'none', height: '60px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <button
                onClick={() => makeDecision('APPROVED')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(46,110,78,0.15)', border: '1px solid rgba(46,110,78,0.4)', borderRadius: '4px', color: '#5CB88A', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em' }}
              >
                <ThumbsUp size={14} /> APPROVE
              </button>
              <button
                onClick={() => makeDecision('DENIED')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '4px', color: '#f87171', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em' }}
              >
                <ThumbsDown size={14} /> DENY
              </button>
            </div>
          </div>
        )}

        {decision && (
          <div className="slide-in" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{decision === 'APPROVED' ? '✓' : '✗'}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: decision === 'APPROVED' ? '#5CB88A' : '#f87171', marginBottom: '0.3rem' }}>
              {decision === 'APPROVED' ? 'Loan Approved' : 'Loan Denied'}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
              Decision logged to audit trail
            </div>
            {note && (
              <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                "{note}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}