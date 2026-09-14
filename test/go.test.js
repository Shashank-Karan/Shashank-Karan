'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { boardKey, createBoard, initialState, legalMoves, parseCoordinate, playMove } = require('../src/go');
const { scoreGame } = require('../src/score');

test('creates supported board sizes', () => {
  assert.equal(createBoard(9).length, 9);
  assert.equal(createBoard(13)[0].length, 13);
  assert.throws(() => createBoard(10));
});

test('parses letter-number coordinates', () => {
  assert.deepEqual(parseCoordinate('D4', 9), { row: 3, col: 3, coordinate: 'D4' });
  assert.equal(parseCoordinate('Z99', 19), null);
});

test('captures a surrounded stone', () => {
  const board = createBoard(9);
  board[1][1] = 'W'; board[0][1] = 'B'; board[1][0] = 'B'; board[1][2] = 'B';
  const state = { ...initialState(9), board, turn: 'B', position: boardKey(board) };
  const result = playMove(state, 2, 1, 'B');
  assert.equal(result.board[1][1], null);
  assert.equal(result.captured, 1);
});

test('rejects suicide and returns legal moves', () => {
  const board = createBoard(9);
  board[0][1] = 'B'; board[1][0] = 'B'; board[1][2] = 'B'; board[2][1] = 'B';
  const state = { ...initialState(9), board, turn: 'W', position: boardKey(board) };
  assert.throws(() => playMove(state, 1, 1, 'W'), /Suicide/);
  assert.ok(!legalMoves(state).includes('B2'));
});

test('rejects positional Ko', () => {
  const state = initialState(9);
  const board = createBoard(9); board[0][0] = 'B';
  assert.throws(() => playMove({ ...state, previousPosition: boardKey(board) }, 0, 0, 'B'), /Ko/);
});

test('rejects a position repeated anywhere in the game history', () => {
  const state = initialState(9);
  const board = createBoard(9); board[0][0] = 'B';
  assert.throws(() => playMove({ ...state, previousPosition: null, positions: [boardKey(board)] }, 0, 0, 'B'), /superko/);
});

test('scores Chinese area and komi after two passes', () => {
  const game = initialState(9);
  game.board[0][0] = 'B'; game.position = boardKey(game.board); game.positions = [game.position];
  const result = scoreGame(game, 6.5);
  assert.equal(result.method, 'chinese-area');
  assert.equal(result.stones.B, 1);
  assert.equal(result.totals.W, 6.5);
});
