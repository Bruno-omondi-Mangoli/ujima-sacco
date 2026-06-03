import { useState } from 'react'
import MemberPanel from './MemberPanel'
import ScoutAgent from './ScoutAgent'
import GuardianAgent from './GuardianAgent'
import HunterAgent from './HunterAgent'
import HumanReview from './HumanReview'
import AuditTrail from './AuditTrail'

export default function Dashboard({ auditLog, addToAudit }) {
  const [selectedMember, setSelectedMember] = useState(null)
  const [scoutResult, setScoutResult] = useState(null)
  const [guardianResult, setGuardianResult] = useState(null)
  const [hunterResult, setHunterResult] = useState(null)

  const handleMemberSelect = (member) => {
    setSelectedMember(member)
    setScoutResult(null)
    setGuardianResult(null)
    setHunterResult(null)
  }

  const handleScoutComplete = (result) => {
    setScoutResult(result)
    addToAudit({ agent: 'SCOUT', member: selectedMember?.name, reason: result.escalationReason, sms: selectedMember?.sms, stressLevel: result.stressLevel })
  }

  const handleGuardianComplete = (result) => {
    setGuardianResult(result)
    addToAudit({ agent: 'GUARDIAN', member: selectedMember?.name, decision: result.decision, reason: result.decisionReason, score: result.applicationScore })
  }

  const handleHunterComplete = (result) => {
    setHunterResult(result)
    addToAudit({ agent: 'HUNTER', member: selectedMember?.name, reason: `Assigned to ${result.assignedOfficer} — Priority: ${result.escalationPriority}` })
  }

  const handleHumanDecision = (result) => {
    addToAudit({ agent: 'HUMAN', member: result.member, decision: result.decision, reason: result.note || `Officer ${result.officer} made final decision` })
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>

      {/* LEFT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <MemberPanel onSelectMember={handleMemberSelect} selectedMember={selectedMember} />
        <AuditTrail auditLog={auditLog} />
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Member info bar */}
        {selectedMember && (
          <div style={{ background: '#091422', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Active Case</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: 'white' }}>{selectedMember.name}</div>
            </div>
            {[
              { label: 'Occupation', value: selectedMember.occupation },
              { label: 'Location', value: selectedMember.location },
              { label: 'Loan Request', value: `KES ${selectedMember.loanAmount?.toLocaleString()}` },
              { label: 'Purpose', value: selectedMember.loanPurpose },
              { label: 'Harvest', value: selectedMember.harvest },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Agent pipeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <ScoutAgent member={selectedMember} onComplete={handleScoutComplete} />
          <GuardianAgent member={selectedMember} scoutResult={scoutResult} onComplete={handleGuardianComplete} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <HunterAgent member={selectedMember} scoutResult={scoutResult} guardianResult={guardianResult} onComplete={handleHunterComplete} />
          <HumanReview member={selectedMember} hunterResult={hunterResult} onDecision={handleHumanDecision} />
        </div>

      </div>
    </div>
  )
}