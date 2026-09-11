'use strict';

const { issueLink } = require('./issue');
const { playMove } = require('./go');

function escape(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
function renderBoard(game, repository = 'OWNER/REPOSITORY') {
  const size = game.boardSize, cell = size === 19 ? 28 : 40, pad = 28, width = pad * 2 + cell * (size - 1), last = game.lastMove;
  const lines = [], stones = [], labels = [];
  for (let i = 0; i < size; i++) {
    const p = pad + i * cell;
    lines.push(`<line x1="${pad}" y1="${p}" x2="${width - pad}" y2="${p}"/><line x1="${p}" y1="${pad}" x2="${p}" y2="${width - pad}"/>`);
    labels.push(`<text x="${p}" y="${width - 6}" text-anchor="middle">${String.fromCharCode(65 + i)}</text>`);
    labels.push(`<text x="10" y="${width - p + 5}" text-anchor="middle">${i + 1}</text>`);
  }
  for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) {
    const stone = game.board[row][col];
    const x = pad + col * cell, y = pad + (size - 1 - row) * cell;
    if (!stone) {
      const move = `${String.fromCharCode(65 + col)}${row + 1}`;
      try {
        playMove(game, row, col);
        stones.push(`<a href="${escape(issueLink(repository, move, `Go ${game.turn === 'B' ? 'Black' : 'White'} move`))}"><circle class="legal" cx="${x}" cy="${y}" r="${cell * 0.16}"/></a>`);
      } catch (_) { /* leave illegal intersections unlinked */ }
      continue;
    }
    const isLast = last && last.row === row && last.col === col;
    stones.push(`<circle class="stone ${stone === 'B' ? 'black' : 'white'}" cx="${x}" cy="${y}" r="${cell * 0.43}"/>${isLast ? `<circle class="last" cx="${x}" cy="${y}" r="${cell * 0.14}"/>` : ''}`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${size} by ${size} Go board" viewBox="0 0 ${width} ${width}"><style>svg{max-width:100%;height:auto;background:#d8a24a;border:1px solid #633f1e}.grid{stroke:#633f1e;stroke-width:1}.stone{stroke:#321f0e;stroke-width:1}.legal{fill:#b8782e;opacity:.28}.black{fill:#151515}.white{fill:#f8f4e8}.last{fill:#e84c3d;stroke:#fff;stroke-width:1}text{font:12px sans-serif;fill:#432916}</style><g class="grid">${lines.join('')}</g><g>${stones.join('')}</g><g>${labels.join('')}</g></svg>`;
}
module.exports = { renderBoard };
