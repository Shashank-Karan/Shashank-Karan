'use strict';
const path = require('node:path');
const { playMove, other } = require('./go');
const { parseMove } = require('./issue');
const { loadConfig, loadGame, loadPlayers, writeJson } = require('./state');
const { addCapture, updatePlayer } = require('./stats');
const { renderReadme } = require('./readme');
const { toSgf } = require('./sgf');
const { scoreGame } = require('./score');
function applyIssue(root, issue) {
  const config = loadConfig(root), game = loadGame(root), players = loadPlayers(root);
  const player = issue.user?.login || 'anonymous';
  if (game.finished) throw new Error('This game has finished');
  const command = `${issue.title || ''} ${issue.body || ''}`;
  if (/\b(resign|resigns|resignation)\b/i.test(command)) {
    game.finished = true;
    game.players[game.turn] = game.players[game.turn] || player;
    game.result = { type: 'resignation', winner: other(game.turn), loser: game.turn };
    game.history.push({ type: 'resign', color: game.turn, player, moveNumber: game.history.length + 1 });
  } else if (/\bpass\b/i.test(command)) {
    game.players[game.turn] = game.players[game.turn] || player;
    game.history.push({ type: 'pass', color: game.turn, player, moveNumber: game.history.length + 1 });
    game.passes += 1; game.turn = other(game.turn);
    if (game.passes >= 2) {
      game.finished = true;
      game.result = { type: 'score', ...scoreGame(game, config.komi) };
    }
  } else {
    const move = parseMove(issue, game.boardSize), result = playMove(game, move.row, move.col);
    game.board = result.board; game.previousPosition = result.previousPosition; game.position = result.position;
    game.positions = [...(game.positions || [result.previousPosition]), result.position];
    game.players[game.turn] = game.players[game.turn] || player;
    game.captures[game.turn] += result.captured;
    game.history.push({ type: 'move', color: game.turn, row: move.row, col: move.col, coordinate: move.coordinate, captured: result.captured, player, moveNumber: game.history.length + 1 });
    updatePlayer(players, player, game.turn, game.history.length); addCapture(players, player, result.captured);
    game.lastMove = { row: move.row, col: move.col, coordinate: move.coordinate };
    game.passes = 0; game.turn = other(game.turn);
  }
  writeJson(path.join(root, 'data', 'game.json'), game); writeJson(path.join(root, 'data', 'players.json'), players);
  require('node:fs').writeFileSync(path.join(root, 'data', 'game.sgf'), `${toSgf(game)}\n`); renderReadme(root, game, players, config);
  return game;
}
module.exports = { applyIssue };
