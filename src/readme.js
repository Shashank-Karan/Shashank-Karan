'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { legalMoves } = require('./go');
const { issueLink } = require('./issue');
const { leaderboard } = require('./stats');
const { renderBoard } = require('./renderer');

function turnName(turn) {
  return turn === 'B' ? 'Black' : 'White';
}

function renderReadme(root, game, players, config) {
  const repo = process.env.GITHUB_REPOSITORY || config.repository;
  const moveTitle = `Go ${turnName(game.turn)} move`;
  const moves = game.history.slice(-20).reverse().map((move, index) => {
    const number = game.history.length - index;
    return `${number}. **${move.color || '-'}** ${move.coordinate || 'pass'} by @${move.player || 'anonymous'}`;
  }).join('\n') || 'No moves yet.';
  const legal = game.finished ? [] : legalMoves(game);
  const links = legal.map(move => {
    return '[' + move + '](' + issueLink(repo, move, moveTitle) + ')';
  }).reduce((rows, link, index) => {
    const row = Math.floor(index / game.boardSize);
    rows[row] = rows[row] ? `${rows[row]} · ${link}` : link;
    return rows;
  }, []).join('\n\n') || 'No legal moves remain.';
  const board = renderBoard(game, repo);
  fs.writeFileSync(path.join(root, 'assets', 'board.svg'), `${board}\n`);
  const leaders = leaderboard(players).map(([name, value], index) => {
    return `${index + 1}. @${name} - **${value.moves} moves** (${value.black} Black, ${value.white} White), ${value.captures} captures, ${value.wins} wins`;
  }).join('\n') || 'No contributors yet.';
  const lastMove = game.lastMove ? `${game.lastMove.coordinate} by @${game.history.at(-1).player || 'anonymous'}` : 'None yet';
  const result = game.result ? game.result.type === 'resignation' ? `${turnName(game.result.winner)} wins by resignation` : game.result.winner === 'JIGO' ? 'Draw (jigo)' : `${turnName(game.result.winner)} wins by ${game.result.margin} points` : 'Game in progress';
  const score = game.score ? `- Final score: **Black ${game.score.totals.B} / White ${game.score.totals.W}** (komi ${game.score.komi})` : null;
  const stats = [
    `- Board: **${game.boardSize}x${game.boardSize}**`,
    `- Move count: **${game.history.length}**`,
    `- Captures: **Black ${game.captures.B} / White ${game.captures.W}**`,
    `- Passes: **${game.passes}**`,
    `- Status: **${game.finished ? 'Finished' : 'In progress'}**`,
    `- Legal moves available: **${legal.length}**`,
    `- Players: **${Object.keys(players.players).length}**`,
    `- Last move: **${lastMove}**`,
    `- Last updated: **${game.updatedAt || 'Not started'}**`,
    `- Result: **${result}**`,
    ...(score ? [score] : [])
  ].join('\n');
  const turnLabel = game.finished ? 'the end of the game' : turnName(game.turn) + "'s turn";
  const coordinateGuide = [
    '```text',
    '      A   B   C   D',
    '4     .   .   .   X  <- D4',
    '3     .   .   .   .',
    '2     .   .   .   .',
    '1     .   .   .   .',
    '```'
  ].join('\n');
  const sections = [
    '# Community Go Game',
    '',
    'One board. One GitHub community. Every move is an issue.',
    '',
    '## Start Here',
    '',
    `**It is ${turnLabel}.**`,
    '',
    '1. Click any blue coordinate in **Legal Moves** below.',
    '2. In the new issue, click **Submit new issue**. You do not need to change anything.',
    '3. Wait for the bot to check it. If it is legal, the board updates and the issue closes.',
    '',
    'You are playing the color shown in **Current Turn**. Only one person can make the next move.',
    '',
    '## Current Turn',
    '',
    `**${game.finished ? 'Game over' : turnName(game.turn)}** (${game.turn})`,
    '',
    '## Current Board',
    '',
    `<img src="assets/board.svg?v=${game.history.length}" alt="Current Go board" width="760">`,
    '',
    '## How To Read The Board',
    '',
    'Letters are columns, from left to right. Numbers are rows, from bottom to top. Find the letter at the top or bottom, then count up from the bottom number. **D4** is the intersection in column D and row 4:',
    '',
    coordinateGuide,
    '',
    'Black stones are black; white stones are white. A red dot marks the last move.',
    '',
    '## Legal Moves',
    '',
    `Click one of these coordinates to play: ${links}`,
    '',
    'A move can be rejected if the spot is occupied, leaves your group without liberties, or repeats the previous position (Ko). The list above contains every legal move for the current turn. GitHub Actions processes moves automatically; refresh this page after submitting while the workflow runs.',
    '',
    '## Last 20 Moves',
    '',
    moves,
    '',
    '## Player Leaderboard',
    '',
    leaders,
    '',
    '## Game Statistics',
    '',
    stats,
    '',
    '_Game state is stored in [data/game.json](data/game.json). Rules and automation live in [src](src)._'
  ];
  fs.writeFileSync(path.join(root, 'README.md'), `${sections.join('\n')}\n`);
}

module.exports = { renderReadme };
