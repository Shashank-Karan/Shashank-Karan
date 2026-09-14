'use strict';
const { parseCoordinate } = require('./go');
function parseMove(issue, size) {
  const text = `${issue.title || ''}\n${issue.body || ''}`;
  const match = text.match(/(?:^|\n|\s)([A-Za-z])\s*([1-9][0-9]*)(?:\s|$|[)])/i) || text.match(/\b([A-Za-z][1-9][0-9]*)\b/i);
  if (!match) throw new Error('No coordinate found. Use a coordinate such as D4.');
  const value = match[2] ? `${match[1]}${match[2]}` : match[1];
  const move = parseCoordinate(value, size);
  if (!move) throw new Error(`Invalid coordinate: ${value}`);
  return move;
}
function commandFromIssue(issue) {
  const title = String(issue.title || '').trim();
  const bodyLines = String(issue.body || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (/^go\s+pass\b/i.test(title) || bodyLines.some(line => /^pass$/i.test(line))) return 'pass';
  if (/^go\s+resign(?:ation)?\b/i.test(title) || bodyLines.some(line => /^resign(?:ation)?$/i.test(line))) return 'resign';
  return 'move';
}
function issueLink(repository, coordinate, title = 'Go move') {
  const params = new URLSearchParams({ title: `${title}: ${coordinate}`, body: `Move: ${coordinate}\n\nPlease leave this issue open for the Action bot to process.` });
  return `https://github.com/${repository}/issues/new?${params}`;
}
module.exports = { commandFromIssue, issueLink, parseMove };
