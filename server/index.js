import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestLogger } from './middleware/logger.js';
import scoutRouter from './routes/scout.js';
import guardianRouter from './routes/guardian.js';
import hunterRouter from './routes/hunter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://ujimasacco.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json());
app.use(requestLogger);

app.use('/api/scout', scoutRouter);
app.use('/api/guardian', guardianRouter);
app.use('/api/hunter', hunterRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    agents: ['Scout', 'Guardian', 'Hunter'],
    version: '1.0.0'
  });
});

app.get('/api/audit', (req, res) => {
  try {
    const logPath = path.join(__dirname, 'data/audit_log.json');
    const raw = fs.readFileSync(logPath, 'utf8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.json([]);
  }
});

app.get('/api/members', (req, res) => {
  try {
    const membersPath = path.join(__dirname, 'data/members.json');
    const raw = fs.readFileSync(membersPath, 'utf8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`
========================================
  UJIMA SACCO — Agent Server Running
  Port:    ${PORT}
  Health:  http://localhost:${PORT}/api/health
  Members: http://localhost:${PORT}/api/members
  Audit:   http://localhost:${PORT}/api/audit
========================================
  `);
});