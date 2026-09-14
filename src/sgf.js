'use strict';
function sgfCoordinate(row, col) { return `${String.fromCharCode(97 + col)}${String.fromCharCode(97 + row)}`; }
function toSgf(game) {
  const moves = game.history.map(move => {
    if (move.type === 'pass') return `;${move.color}[]`;
    if (move.type === 'resign') return '';
    return `;${move.color}[${sgfCoordinate(move.row, move.col)}]`;
  }).join('');
  const result = game.result?.type === 'resignation' ? `${game.result.winner === 'B' ? 'B' : 'W'}+R` : game.result?.winner === 'JIGO' ? '0' : game.result?.winner ? `${game.result.winner}+${game.result.margin}` : '*';
  return `(;GM[1]FF[4]SZ[${game.boardSize}]KM[${game.result?.komi ?? 6.5}]RE[${result}]${moves})`;
}
module.exports = { toSgf };
