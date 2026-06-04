import { useState } from 'react'
import MemberPanel from './MemberPanel'
import ScoutAgent from './ScoutAgent'
import GuardianAgent from './GuardianAgent'
import HunterAgent from './HunterAgent'
import HumanReview from './HumanReview'
import AuditTrail from './AuditTrail'
import useWindowSize from '../hooks/useWindowSize'

export default function Dashboard({ auditLog, addToAudit }) {
  const { isMobile } = useWindowSize()
  const [selectedMember, setSelectedMember] = useState(null)
  const [scoutResult, setScoutResult] = useState(null)
  const [guardianResult, setGuardianResult] = useState(null)
  const [hunterResult, setHunterResult] = useState(null)
  const [activeTab, setActiveTab] = useState('members')

  const handleMemberSelect = (member) => {
    setSelectedMember(member)
    setScoutResult(null)
    setGuardianResult(null)
    setHunterResult(null)
    if (isMobile) setActiveTab('pipeline')
  }

  const handleScoutComplete = (result) => {
    setScoutResult(result)
    addToAudit({
      agent: 'SCOUT',
      member: selectedMember?.name,
      reason: result.escalationReason,
      sms: selectedMember?.sms,
      stressLevel: result.stressLevel
    })
  }

  const handleGuardianComplete = (result) => {
    setGuardianResult(result)
    addToAudit({
      agent: 'GUARDIAN',
      member: selectedMember?.name,
      decision: result.decision,
      reason: result.decisionReason,
      score: result.applicationScore
    })
  }

  const handleHunterComplete = (result) => {
    setHunterResult(result)
    addToAudit({
      agent: 'HUNTER',
      member: selectedMember?.name,
      reason: `Assigned to ${result.assignedOfficer} — Priority: ${result.escalationPriority}`
    })
  }

  const handleHumanDecision = (result) => {
    addToAudit({
      agent: 'HUMAN',
      member: result.member,
      decision: result.decision,
      reason: result.note || `Officer ${result.officer} made final decision`
    })
    if (isMobile) setActiveTab('audit')
  }

  const tabs = [
    { id: 'members',  label: 'Members',  badge: '4' },
    { id: 'pipeline', label: 'Pipeline', badge: selectedMember ? '✓' : null },
    { id: 'audit',    label: 'Audit',    badge: auditLog.length > 0 ? auditLog.length : null },
  ]

  // ── MOBILE ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* TAB BAR */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: '#091422',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 0.5rem',
                background: activeTab === tab.id ? 'rgba(193,123,47,0.12)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #C17B2F' : '2px solid transparent',
                color: activeTab === tab.id ? '#C17B2F' : 'rgba(255,255,255,0.4)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{
                  background: activeTab === tab.id ? 'rgba(193,123,47,0.3)' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.id ? '#C17B2F' : 'rgba(255,255,255,0.4)',
                  padding: '0.05rem 0.3rem',
                  borderRadius: '2px',
                  fontSize: '0.58rem'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'members' && (
          <MemberPanel
            onSelectMember={handleMemberSelect}
            selectedMember={selectedMember}
          />
        )}

        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!selectedMember ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#091422',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.72rem'
              }}>
                Go to Members tab and select a member
              </div>
            ) : (
              <>
                <MemberInfoBar member={selectedMember} />
                <ScoutAgent
                  member={selectedMember}
                  onComplete={handleScoutComplete}
                />
                <GuardianAgent
                  member={selectedMember}
                  scoutResult={scoutResult}
                  onComplete={handleGuardianComplete}
                />
                <HunterAgent
                  member={selectedMember}
                  scoutResult={scoutResult}
                  guardianResult={guardianResult}
                  onComplete={handleHunterComplete}
                />
                <HumanReview
                  member={selectedMember}
                  hunterResult={hunterResult}
                  onDecision={handleHumanDecision}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <AuditTrail auditLog={auditLog} />
        )}

      </div>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '1.5rem'
    }}>

      {/* LEFT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <MemberPanel
          onSelectMember={handleMemberSelect}
          selectedMember={selectedMember}
        />
        <AuditTrail auditLog={auditLog} />
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {selectedMember && <MemberInfoBar member={selectedMember} />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <ScoutAgent
            member={selectedMember}
            onComplete={handleScoutComplete}
          />
          <GuardianAgent
            member={selectedMember}
            scoutResult={scoutResult}
            onComplete={handleGuardianComplete}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <HunterAgent
            member={selectedMember}
            scoutResult={scoutResult}
            guardianResult={guardianResult}
            onComplete={handleHunterComplete}
          />
          <HumanReview
            member={selectedMember}
            hunterResult={hunterResult}
            onDecision={handleHumanDecision}
          />
        </div>
      </div>

    </div>
  )
}

function MemberInfoBar({ member }) {
  return (
    <div style={{
      background: '#091422',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '1rem 1.2rem',
    }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.58rem',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '0.3rem'
      }}>
        Active Case
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', marginBottom: '0.6rem' }}>
        {member.name}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {[
          { label: 'Occupation', value: member.occupation },
          { label: 'Location',   value: member.location },
          { label: 'Loan',       value: `KES ${member.loanAmount?.toLocaleString()}` },
          { label: 'Purpose',    value: member.loanPurpose },
          { label: 'Harvest',    value: member.harvest },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '4px',
            padding: '0.35rem 0.65rem',
          }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.15rem'
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}