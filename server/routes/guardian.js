import express from 'express';
import { askOllama } from '../ollama.js';
import { logDecision } from '../middleware/logger.js';

const router = express.Router();

router.post('/triage', async (req, res) => {
  const { member, scoutContext } = req.body;

  if (!member || !scoutContext) {
    return res.status(400).json({ error: 'Member and scout context required' });
  }

  try {
    const prompt = `You are the Guardian Agent for Ujima SACCO, a savings cooperative in Kenya.

YOUR ROLE: Tier-1 loan screening. Score applications using harvest-cycle adjusted income.

RANK CONSTRAINTS:
- Auto-approve ONLY loans up to KES 15000 with fewer than 3 risk flags
- NEVER approve loans over KES 15000 — escalate to Hunter Agent
- NEVER use gender or ethnicity as scoring variables
- Always run counterfactual: what if income was 20% higher
- Busia County: ALL applications go to human review

MEMBER PROFILE:
Name: ${member.name}
Age: ${member.age}
Occupation: ${member.occupation}
Location: ${member.location}
Children: ${member.children}
Monthly Income: KES ${member.monthlyIncome}
Savings: KES ${member.savings}
Next Harvest: ${member.harvest}
Loan Request: KES ${member.loanAmount}
Loan Purpose: ${member.loanPurpose}
SACCO History: ${member.saccoHistory}

SCOUT CONTEXT:
Stress Level: ${scoutContext.stressLevel}
Keywords: ${scoutContext.keywordsDetected?.join(', ')}
Harvest Alignment: ${scoutContext.harvestAlignment}

TASK: Score this application and respond ONLY with this JSON — no other text:
{
  "harvestAdjustedIncome": 9500,
  "repaymentCapacity": 3100,
  "applicationScore": 81,
  "counterfactualScore": 94,
  "biasCheckPassed": true,
  "riskFlags": [],
  "decision": "ESCALATE_TO_HUNTER",
  "decisionReason": "Amount KES ${member.loanAmount} exceeds KES 15000 auto-approve limit",
  "escalationPriority": "MEDIUM",
  "suggestedRepaymentSchedule": "October KES 6000, November KES 8000, December to February KES 4666 per month",
  "denialMessage": "",
  "agentNote": "internal audit note"
}`;

    const result = await askOllama(prompt);

    logDecision({
      agent: 'GUARDIAN',
      member: member.name,
      loanAmount: member.loanAmount,
      score: result.applicationScore,
      decision: result.decision,
      biasCheckPassed: result.biasCheckPassed,
      riskFlags: result.riskFlags
    });

    res.json({ success: true, data: result });

  } catch (err) {
    console.error('Guardian Agent error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;