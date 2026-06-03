import { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'
import StatusBadge from './StatusBadge'

export default function GuardianAgent({ member, scoutResult, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const runGuardian = async () => {
    if (!member || !scoutResult) return toast.error('Scout analysis required first')
    setLoading(true)
    try {
      const res = await api.post('/api/guardian/triage', { member, scoutContext: scoutResult })
      setResult(res.data.data)
      toast.success('Guardian Agent triage complete')
      onComplete(res.data.data)
    } catch (err) {
      toast.error('Guardian Agent error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(193,123,47,0.3)', borderRadius: '8px', overflow: 'hidden' }} className="guardian-glow">

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(193,123,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(193,123,47,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(193,123,47,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={13} color="#E8A84A" />
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#E8A84A', fontWeight: 500 }}>Guardian Agent</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Loan Triage Officer</div>
          </div>
        </div>
        <button
          onClick={runGuardian}
          disabled={loading || !scoutResult}
          style={{
            background: loading ? 'rgba(193,123,47,0.2)' : '#C17B2F',
            color: 'white', border: 'none', borderRadius: '4px',
            padding: '0.45rem 1rem', fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.72rem', cursor: loading || !scoutResult ? 'not-allowed' : 'pointer',
            opacity: !scoutResult ? 0.5 : 1, letterSpacing: '0.08em'
          }}
        >
          {loading ? 'Triaging...' : '▶ Run Guardian'}
        </button>
      </div>

      <div style={{ padding: '1.2rem' }}>
        {!scoutResult && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem' }}>
            Waiting for Scout Agent analysis
          </div>
        )}

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
              {[0,1,2].map(i => (
                <div key={i} className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8A84A', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              Guardian scoring application...
            </div>
          </div>
        )}

        {result && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { label: 'App Score', value: `${result.applicationScore}%`, color: result.applicationScore >= 80 ? '#5CB88A' : result.applicationScore >= 60 ? '#E8A84A' : '#f87171' },
                { label: 'Counterfactual', value: `${result.counterfactualScore}%`, color: '#6BA8D4' },
                { label: 'Repayment/mo', value: `KES ${result.repaymentCapacity?.toLocaleString()}`, color: '#5CB88A' },
                { label: 'Adjusted Income', value: `KES ${result.harvestAdjustedIncome?.toLocaleString()}`, color: '#E8A84A' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.7rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bias Check</span>
              <StatusBadge status={result.biasCheckPassed ? 'PASSED' : 'FAILED'} />
            </div>

            {result.riskFlags?.length > 0 && (
              <div style={{ background: 'rgba(220,38,38,0.08)', borderRadius: '4px', padding: '0.8rem', border: '1px solid rgba(220,38,38,0.2)' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#f87171', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Risk Flags</div>
                {result.riskFlags.map((flag, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#f87171' }}>⚠</span> {flag}
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.8rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suggested Repayment</div>
              <div style={{ fontSize: '0.82rem', color: '#5CB88A', lineHeight: 1.6 }}>{result.suggestedRepaymentSchedule}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(107,168,212,0.08)', borderRadius: '4px', border: '1px solid rgba(107,168,212,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowRight size={14} color="#6BA8D4" />
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#6BA8D4' }}>
                  Decision:
                </span>
              </div>
              <StatusBadge status={result.decision} />
            </div>

          </div>
        )}
      </div>
    </div>
  )
}