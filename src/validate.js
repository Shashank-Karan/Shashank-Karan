'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { loadGame } = require('./state');
const { applyIssue } = require('./process-move');
const root = path.resolve(__dirname, '..');
if (require.main === module) {
  const eventFile = process.argv[2] || process.env.GITHUB_EVENT_PATH;
  if (!eventFile || !fs.existsSync(eventFile)) throw new Error('An issue event JSON file is required');
  const event = JSON.parse(fs.readFileSync(eventFile, 'utf8'));
  if (event.action !== 'opened' || !event.issue) process.exit(0);
  try { applyIssue(root, event.issue); } catch (error) { console.error(error.message); process.exit(1); }
}
module.exports = { loadGame };
