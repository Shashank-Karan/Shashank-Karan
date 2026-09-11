'use strict';
function sgfCoordinate(row, col) { return `${String.fromCharCode(97 + col)}${String.fromCharCode(97 + row)}`; }
function toSgf(game) {
  const moves = game.history.filter(move => move.type === 'move').map(move => `;${move.color}[${sgfCoordinate(move.row, move.col)}]`).join('');
  return `(;GM[1]FF[4]SZ[${game.boardSize}]KM[6.5]${moves})`;
}
module.exports = { toSgf };
