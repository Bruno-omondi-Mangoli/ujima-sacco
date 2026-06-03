import express from 'express';
import { askOllama } from '../ollama.js';
import { logDecision } from '../middleware/logger.js';

const router = express.Router();

router.post('/brief', async (req, res) => {
  const { member, scoutContext, guardianResult } = req.body;

  if (!member || !scoutContext || !guardianResult) {
    return res.status(400).json({ error: 'Member, scout and guardian data required' });
  }

  try {
    const prompt = `You are the Hunter Agent for Ujima SACCO, a savings cooperative in Kenya.

YOUR ROLE: Human-in-Loop Coordinator. Prepare briefing packets for human loan officers.

RANK CONSTRAINTS:
- NEVER approve or deny loans — preparation only
- Match officers by crop specialty and county
- Alert officer within 15 minutes for priority cases

AVAILABLE OFFICERS:
- Sarah Wanjiku: Maize farmers, Kakamega and Western Kenya
- David Otieno: Fish traders, debt rescue, Kisumu
- Amina Hassan: Shea butter traders, Busia district
- James Mwangi: Coffee farmers, Central Kenya
- Grace Adhiambo: Market vendors, Nairobi

MEMBER: ${member.name}, ${member.age}, ${member.occupation}, ${member.location}
CHILDREN: ${member.children}
LOAN REQUEST: KES ${member.loanAmount} for ${member.loanPurpose}
HARVEST: ${member.harvest}
SAVINGS: KES ${member.savings}

GUARDIAN SCORING:
Score: ${guardianResult.applicationScore}%
Counterfactual: ${guardianResult.counterfactualScore}%
Repayment Capacity: KES ${guardianResult.repaymentCapacity} per month
Risk Flags: ${guardianResult.riskFlags?.join(', ') || 'None'}
Bias Check: ${guardianResult.biasCheckPassed ? 'PASSED' : 'FAILED'}
Suggested Repayment: ${guardianResult.suggestedRepaymentSchedule}

TASK: Prepare a briefing packet and respond ONLY with this JSON — no other text:
{
  "assignedOfficer": "Sarah Wanjiku",
  "officerSpecialty": "Maize farmers Kakamega",
  "escalationPriority": "MEDIUM",
  "briefingSummary": "2 sentence summary for officer",
  "top3Points": ["point 1", "point 2", "point 3"],
  "repaymentSchedule": [
    {"month": "October", "amount": 6000, "note": "First harvest income"},
    {"month": "November", "amount": 8000, "note": "Peak harvest"},
    {"month": "December", "amount": 4666, "note": "Post harvest"},
    {"month": "January", "amount": 4666, "note": "Avoid school fees"},
    {"month": "February", "amount": 4668, "note": "Final payment"}
  ],
  "crossSellOpportunities": ["drought insurance", "school fees savings plan"],
  "pridePausePoints": ["Amount over KES 15000 requires human sign-off"],
  "approvalMessageSwahili": "Swahili approval message to member",
  "denialMessageSwahili": "Swahili denial message if needed",
  "agentNote": "internal audit note"
}`;

    const result = await askOllama(prompt);

    logDecision({
      agent: 'HUNTER',
      member: member.name,
      assignedOfficer: result.assignedOfficer,
      priority: result.escalationPriority,
      crossSell: result.crossSellOpportunities
    });

    res.json({ success: true, data: result });

  } catch (err) {
    console.error('Hunter Agent error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;