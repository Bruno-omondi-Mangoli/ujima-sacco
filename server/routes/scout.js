import express from 'express';
import { askOllama } from '../ollama.js';
import { logDecision } from '../middleware/logger.js';

const router = express.Router();

router.post('/analyse', async (req, res) => {
  const { member } = req.body;

  if (!member) {
    return res.status(400).json({ error: 'Member data required' });
  }

  try {
    const prompt = `You are the Scout Agent for Ujima SACCO, a savings cooperative in Kenya serving informal traders.

YOUR ROLE: Financial Literacy Coach. Detect financial stress in member SMS messages and decide if escalation is needed.

RANK CONSTRAINTS:
- Max 3 SMS per day to any member
- Never recommend specific loans
- Alert Guardian if: "loan shark", "shylock", "nimekopwa" detected
- Kill switch: if member sends *#700# stop all messages

MEMBER PROFILE:
Name: ${member.name}
Age: ${member.age}
Occupation: ${member.occupation}
Location: ${member.location}
Children: ${member.children}
Savings: KES ${member.savings}
Next Harvest: ${member.harvest}

INCOMING SMS: "${member.sms}"

TASK: Analyse this SMS and respond ONLY with this JSON — no other text:
{
  "stressLevel": "HIGH",
  "keywordsDetected": ["keyword1", "keyword2"],
  "harvestAlignment": "description of harvest timing",
  "escalateToGuardian": true,
  "escalationReason": "reason for escalation",
  "contextPacket": {
    "childAges": [],
    "nextHarvestDate": "${member.harvest}",
    "currentSavings": ${member.savings},
    "stressType": "school_fees"
  },
  "memberResponse": "Swahili response to member here",
  "agentNote": "internal audit note"
}`;

    const result = await askOllama(prompt);

    logDecision({
      agent: 'SCOUT',
      member: member.name,
      sms: member.sms,
      stressLevel: result.stressLevel,
      escalated: result.escalateToGuardian,
      reason: result.escalationReason
    });

    res.json({ success: true, data: result });

  } catch (err) {
    console.error('Scout Agent error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;