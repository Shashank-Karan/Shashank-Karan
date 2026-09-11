'use strict';
const path = require('node:path');
const { initialState } = require('./go');
const { loadConfig, loadGame, loadPlayers, validateGame, writeJson } = require('./state');
const { renderReadme } = require('./readme');
const root = path.resolve(__dirname, '..');
function main() {
  const command = process.argv[2] || 'generate', config = loadConfig(root);
  if (command === 'help') {
    console.log('Usage: node src/cli.js <init|generate|validate>');
    return;
  }
  if (!['init', 'generate', 'validate'].includes(command)) throw new Error(`Unknown command: ${command}`);
  if (command === 'init') writeJson(path.join(root, 'data', 'game.json'), initialState(config.boardSize));
  const game = loadGame(root), players = loadPlayers(root);
  validateGame(game);
  if (command === 'generate' || command === 'init') {
    renderReadme(root, game, players, config);
    console.log(`Generated README for ${game.boardSize}x${game.boardSize} game (${game.history.length} moves).`);
  } else {
    console.log(`Game state is valid: ${game.boardSize}x${game.boardSize}, ${game.history.length} moves.`);
  }
}
main();
