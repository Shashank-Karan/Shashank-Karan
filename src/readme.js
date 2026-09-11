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
  const links = legalMoves(game).slice(0, 100).map(move => {
    return '[' + move + '](' + issueLink(repo, move, moveTitle) + ')';
  }).join(' · ') || 'No legal moves remain.';
  const board = renderBoard(game, repo);
  const leaders = leaderboard(players).map(([name, value], index) => {
    return `${index + 1}. @${name} - ${value.moves} moves, ${value.captures} captures, ${value.elo} ELO`;
  }).join('\n') || 'No contributors yet.';
  const stats = [
    `- Board: **${game.boardSize}x${game.boardSize}**`,
    `- Move count: **${game.history.length}**`,
    `- Captures: **Black ${game.captures.B} / White ${game.captures.W}**`,
    `- Passes: **${game.passes}**`,
    `- Status: **${game.finished ? 'Finished' : 'In progress'}**`
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
    board,
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
    'A move can be rejected if the spot is occupied, leaves your group without liberties, or repeats the previous position (Ko). The README refreshes automatically after every accepted move. GitHub Actions is automatic but asynchronous, so refresh this page after submitting while the workflow runs.',
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
    '## Share Links',
    '',
    `[Open a move issue](${issueLink(repo, '', 'Go move')}) · [Browse move issues](https://github.com/${repo}/issues) · [Download SGF](https://github.com/${repo}/raw/main/data/game.sgf)`,
    '',
    '_Game state is stored in [data/game.json](data/game.json). Rules and automation live in [src](src). _'
  ];
  fs.writeFileSync(path.join(root, 'README.md'), `${sections.join('\n')}\n`);
}

module.exports = { renderReadme };
