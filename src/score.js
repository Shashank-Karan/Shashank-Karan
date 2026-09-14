'use strict';

function territory(board) {
  const seen = new Set();
  const result = { B: 0, W: 0, neutral: 0 };
  for (let row = 0; row < board.length; row++) for (let col = 0; col < board.length; col++) {
    if (board[row][col] || seen.has(`${row},${col}`)) continue;
    const region = [], borders = new Set(), queue = [[row, col]];
    while (queue.length) {
      const [r, c] = queue.pop(), key = `${r},${c}`;
      if (seen.has(key)) continue;
      seen.add(key); region.push([r, c]);
      for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
        if (nr < 0 || nr >= board.length || nc < 0 || nc >= board.length) continue;
        if (board[nr][nc]) borders.add(board[nr][nc]);
        else if (!seen.has(`${nr},${nc}`)) queue.push([nr, nc]);
      }
    }
    if (borders.size === 1) result[[...borders][0]] += region.length;
    else result.neutral += region.length;
  }
  return result;
}

function scoreGame(game, komi = 6.5) {
  const stones = { B: 0, W: 0 };
  for (const row of game.board) for (const cell of row) if (cell) stones[cell]++;
  const points = territory(game.board);
  const totals = { B: stones.B + points.B, W: stones.W + points.W + Number(komi) };
  const winner = totals.B === totals.W ? 'JIGO' : totals.B > totals.W ? 'B' : 'W';
  return { method: 'chinese-area', komi: Number(komi), stones, territory: points, totals, winner, margin: Math.abs(totals.B - totals.W) };
}

module.exports = { scoreGame, territory };
