import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, '../data/audit_log.json');

export const logDecision = (entry) => {
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    const log = JSON.parse(raw);
    log.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    });
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

export const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};