'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { boardKey, initialState } = require('./go');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function loadGame(root) {
  const file = path.join(root, 'data', 'game.json');
  const game = readJson(file);
  if (!game.board || (game.board.length === 0 && !game.history?.length)) return initialState(game.boardSize || 19);
  if (!game.positions) game.positions = [game.previousPosition, game.position].filter(Boolean);
  if (!game.players) game.players = { B: null, W: null };
  if (!Object.prototype.hasOwnProperty.call(game, 'score')) game.score = null;
  validateGame(game);
  return game;
}
function loadConfig(root) { return readJson(path.join(root, 'data', 'config.json')); }
function loadPlayers(root) { return readJson(path.join(root, 'data', 'players.json')); }
function validateGame(game) {
  if (![9, 13, 19].includes(game.boardSize)) throw new Error('Invalid board size in data/game.json');
  if (!Array.isArray(game.board) || game.board.length !== game.boardSize || game.board.some(row => !Array.isArray(row) || row.length !== game.boardSize)) throw new Error('Board dimensions do not match boardSize');
  if (game.board.some(row => row.some(cell => cell !== null && cell !== 'B' && cell !== 'W'))) throw new Error('Board contains an invalid stone');
  if (game.turn !== 'B' && game.turn !== 'W') throw new Error('Turn must be B or W');
  if (game.position && game.position !== boardKey(game.board)) throw new Error('Stored board position does not match the board');
  if (!Array.isArray(game.history) || !game.captures || typeof game.captures.B !== 'number' || typeof game.captures.W !== 'number') throw new Error('Game history or captures are invalid');
  if (!Array.isArray(game.positions) || game.positions.at(-1) !== game.position) throw new Error('Position history is missing or out of date');
  return true;
}
module.exports = { loadConfig, loadGame, loadPlayers, readJson, validateGame, writeJson };
