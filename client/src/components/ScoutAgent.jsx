import { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'
import StatusBadge from './StatusBadge'

export default function ScoutAgent({ member, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const runScout = async () => {
    if (!member) return toast.error('Select a member first')
    setLoading(true)
    try {
      const res = await api.post('/api/scout/analyse', { member })
      setResult(res.data.data)
      toast.success('Scout Agent analysis complete')
      onComplete(res.data.data)
    } catch (err) {
      toast.error('Scout Agent error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(46,110,78,0.3)', borderRadius: '8px', overflow: 'hidden' }} className="scout-glow">

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(46,110,78,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(46,110,78,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(46,110,78,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={13} color="#5CB88A" />
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#5CB88A', fontWeight: 500 }}>Scout Agent</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Financial Literacy Coach</div>
          </div>
        </div>
        <button
          onClick={runScout}
          disabled={loading || !member}
          style={{
            background: loading ? 'rgba(46,110,78,0.2)' : '#2E6E4E',
            color: 'white', border: 'none', borderRadius: '4px',
            padding: '0.45rem 1rem', fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.72rem', cursor: loading || !member ? 'not-allowed' : 'pointer',
            opacity: !member ? 0.5 : 1, letterSpacing: '0.08em'
          }}
        >
          {loading ? 'Analysing...' : '▶ Run Scout'}
        </button>
      </div>

      <div style={{ padding: '1.2rem' }}>
        {!member && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem' }}>
            Select a member to begin analysis
          </div>
        )}

        {member && !result && !loading && (
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>INCOMING SMS</div>
            <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              "{member.sms}"
            </div>
            <div style={{ marginTop: '0.7rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                From: {member.name}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                {member.location}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
              {[0,1,2].map(i => (
                <div key={i} className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5CB88A', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              Scout Agent analysing SMS...
            </div>
          </div>
        )}

        {result && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stress Level</span>
              <StatusBadge status={result.stressLevel} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Keywords Detected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.keywordsDetected?.map((kw, i) => (
                  <span key={i} style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Harvest Alignment</div>
              <div style={{ fontSize: '0.82rem', color: '#5CB88A' }}>{result.harvestAlignment}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member Response (Swahili)</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{result.memberResponse}"</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: result.escalateToGuardian ? 'rgba(193,123,47,0.1)' : 'rgba(46,110,78,0.1)', borderRadius: '4px', border: `1px solid ${result.escalateToGuardian ? 'rgba(193,123,47,0.3)' : 'rgba(46,110,78,0.3)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {result.escalateToGuardian ? <AlertTriangle size={14} color="#E8A84A" /> : <CheckCircle size={14} color="#5CB88A" />}
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: result.escalateToGuardian ? '#E8A84A' : '#5CB88A' }}>
                  {result.escalateToGuardian ? 'Escalating to Guardian' : 'No escalation needed'}
                </span>
              </div>
              {result.escalateToGuardian && <ArrowRight size={14} color="#E8A84A" />}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}