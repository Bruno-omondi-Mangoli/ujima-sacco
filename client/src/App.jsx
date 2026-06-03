import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
export default function App() {
  const [activeCase, setActiveCase] = useState(null)
  const [auditLog, setAuditLog] = useState([])

  const addToAudit = (entry) => {
    setAuditLog(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    }, ...prev])
  }

  return (
    <div className="min-h-screen bg-[#0a1727]">
      <Header />
      <Dashboard
        activeCase={activeCase}
        setActiveCase={setActiveCase}
        auditLog={auditLog}
        addToAudit={addToAudit}
      />
    </div>
  )
}
