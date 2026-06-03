import { useState, useEffect } from 'react'
import { Users, MessageSquare, ChevronRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function MemberPanel({ onSelectMember, selectedMember }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/members')
      .then(res => { setMembers(res.data); setLoading(false) })
      .catch(() => { toast.error('Could not load members'); setLoading(false) })
  }, [])

  const stressColors = {
    M001: '#E8A84A',
    M002: '#f87171',
    M003: '#C17B2F',
    M004: '#5CB88A',
  }

  return (
    <div style={{ background: '#091422', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>

      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Users size={14} color="#C17B2F" />
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          Member Queue
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#C17B2F', background: 'rgba(193,123,47,0.15)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
          {members.length} pending
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem' }}>
          Loading members...
        </div>
      ) : (
        <div>
          {members.map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              style={{
                padding: '1rem 1.2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                background: selectedMember?.id === member.id ? 'rgba(193,123,47,0.08)' : 'transparent',
                borderLeft: selectedMember?.id === member.id ? '3px solid #C17B2F' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'white', marginBottom: '0.15rem' }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                    {member.occupation} · {member.location.split(',')[0]}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stressColors[member.id] || '#8A7B6A' }} />
                  <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '0.5rem 0.7rem' }}>
                <MessageSquare size={10} color="rgba(255,255,255,0.3)" />
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                  "{member.sms.substring(0, 45)}..."
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                  KES {member.loanAmount?.toLocaleString()} requested
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#5CB88A' }}>
                  {member.saccoHistory?.split(',')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}