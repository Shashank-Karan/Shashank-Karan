'use strict';
function updatePlayer(players, login, color, moveNumber) {
  if (!login) return players;
  const player = players.players[login] || { moves: 0, black: 0, white: 0, captures: 0, wins: 0, losses: 0, elo: 1000, lastMove: null };
  player.moves += 1; player[color === 'B' ? 'black' : 'white'] += 1; player.lastMove = moveNumber;
  players.players[login] = player;
  return players;
}
function addCapture(players, login, count) { if (login && players.players[login]) players.players[login].captures += count; return players; }
function recordResult(players, winner) {
  for (const player of Object.values(players.players)) {
    if (winner && player.lastColor) player[player.lastColor === winner ? 'wins' : 'losses'] += 1;
  }
  return players;
}
function leaderboard(players) {
  return Object.entries(players.players).sort((a, b) => b[1].moves - a[1].moves).slice(0, 10);
}
module.exports = { addCapture, leaderboard, recordResult, updatePlayer };
