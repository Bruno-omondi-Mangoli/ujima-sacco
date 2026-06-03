import { useState } from 'react'
import { Target, User, Calendar, TrendingUp } from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'
import StatusBadge from './StatusBadge'

export default function HunterAgent({ member, scoutResult, guardianResult, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const runHunter = async () => {
    if (!member || !scoutResult || !guardianResult) return toast.error('Guardian triage required first')
    setLoading(true)
    try {
      const res = await api.post('/api/hunter/brief', { member, scoutContext: scoutResult, guardianResult })
      setResult(res.data.data)
      toast.success('Hunter Agent briefing ready')
      onComplete(res.data.data)
    } catch (err) {
      toast.error('Hunter Agent error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(107,168,212,0.3)', borderRadius: '8px', overflow: 'hidden' }} className="hunter-glow">

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(107,168,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(107,168,212,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(107,168,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={13} color="#6BA8D4" />
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#6BA8D4', fontWeight: 500 }}>Hunter Agent</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Human-in-Loop Coordinator</div>
          </div>
        </div>
        <button
          onClick={runHunter}
          disabled={loading || !guardianResult}
          style={{
            background: loading ? 'rgba(107,168,212,0.2)' : '#1A3A5C',
            color: '#6BA8D4', border: '1px solid rgba(107,168,212,0.4)',
            borderRadius: '4px', padding: '0.45rem 1rem',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem',
            cursor: loading || !guardianResult ? 'not-allowed' : 'pointer',
            opacity: !guardianResult ? 0.5 : 1, letterSpacing: '0.08em'
          }}
        >
          {loading ? 'Briefing...' : '▶ Run Hunter'}
        </button>
      </div>

      <div style={{ padding: '1.2rem' }}>
        {!guardianResult && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem' }}>
            Waiting for Guardian triage
          </div>
        )}

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
              {[0,1,2].map(i => (
                <div key={i} className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6BA8D4', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              Hunter preparing officer briefing...
            </div>
          </div>
        )}

        {result && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(107,168,212,0.08)', borderRadius: '4px', border: '1px solid rgba(107,168,212,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={14} color="#6BA8D4" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{result.assignedOfficer}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{result.officerSpecialty}</div>
                </div>
              </div>
              <StatusBadge status={result.escalationPriority} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Top 3 Points for Officer</div>
              {result.top3Points?.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#6BA8D4', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', flexShrink: 0 }}>{i + 1}.</span>
                  {point}
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={10} /> Repayment Schedule
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {result.repaymentSchedule?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{item.month}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: '#5CB88A', fontWeight: 500 }}>KES {item.amount?.toLocaleString()}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.crossSellOpportunities?.length > 0 && (
              <div style={{ background: 'rgba(46,110,78,0.08)', borderRadius: '4px', padding: '0.8rem', border: '1px solid rgba(46,110,78,0.2)' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#5CB88A', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={10} /> Cross-sell Opportunities
                </div>
                {result.crossSellOpportunities.map((opp, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#5CB88A' }}>→</span> {opp}
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'rgba(139,58,98,0.08)', borderRadius: '4px', padding: '0.8rem', border: '1px solid rgba(139,58,98,0.2)' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#D476A8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Approval Message (Swahili)</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{result.approvalMessageSwahili}"</div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}