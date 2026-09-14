'use strict';

const EMPTY = null;
const COLORS = Object.freeze({ BLACK: 'B', WHITE: 'W' });

function createBoard(size) {
  if (![9, 13, 19].includes(size)) throw new Error('Board size must be 9, 13, or 19');
  return Array.from({ length: size }, () => Array(size).fill(EMPTY));
}

function cloneBoard(board) { return board.map(row => row.slice()); }
function other(color) { return color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK; }
function inBounds(board, row, col) { return row >= 0 && row < board.length && col >= 0 && col < board.length; }
function neighbors(board, row, col) {
  return [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
    .filter(([r, c]) => inBounds(board, r, c));
}
function getGroup(board, row, col) {
  const color = board[row][col];
  if (!color) return { stones: [], liberties: new Set() };
  const stones = [], liberties = new Set(), queue = [[row, col]], seen = new Set();
  while (queue.length) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    if (seen.has(key)) continue;
    seen.add(key); stones.push([r, c]);
    for (const [nr, nc] of neighbors(board, r, c)) {
      if (board[nr][nc] === EMPTY) liberties.add(`${nr},${nc}`);
      else if (board[nr][nc] === color && !seen.has(`${nr},${nc}`)) queue.push([nr, nc]);
    }
  }
  return { stones, liberties };
}
function boardKey(board) { return board.map(row => row.map(cell => cell || '.').join('')).join('/'); }
function parseCoordinate(input, size) {
  const normalized = String(input).trim().toUpperCase();
  const match = normalized.match(/^([A-Z])([1-9][0-9]*)$/);
  if (!match) return null;
  const col = match[1].charCodeAt(0) - 65;
  const row = Number(match[2]) - 1;
  return inBounds(createBoard(size), row, col) ? { row, col, coordinate: normalized } : null;
}
function coordinate(row, col) { return `${String.fromCharCode(65 + col)}${row + 1}`; }

function playMove(state, row, col, color = state.turn) {
  if (!inBounds(state.board, row, col)) throw new Error('Move is outside the board');
  if (state.board[row][col]) throw new Error('Intersection is occupied');
  if (color !== state.turn) throw new Error(`It is ${state.turn === 'B' ? 'Black' : 'White'}'s turn`);
  const next = cloneBoard(state.board);
  next[row][col] = color;
  let captured = 0;
  for (const [nr, nc] of neighbors(next, row, col)) {
    if (next[nr][nc] === other(color)) {
      const group = getGroup(next, nr, nc);
      if (!group.liberties.size) {
        for (const [gr, gc] of group.stones) next[gr][gc] = EMPTY;
        captured += group.stones.length;
      }
    }
  }
  if (!getGroup(next, row, col).liberties.size) throw new Error('Suicide is not legal');
  const key = boardKey(next);
  const seenPositions = state.positions || (state.previousPosition ? [state.previousPosition] : []);
  if (seenPositions.includes(key)) throw new Error('Ko/superko: this position repeats an earlier position');
  return { board: next, position: key, previousPosition: boardKey(state.board), captured };
}

function legalMoves(state) {
  const moves = [];
  for (let row = 0; row < state.board.length; row++) for (let col = 0; col < state.board.length; col++) {
    try { playMove(state, row, col); moves.push(coordinate(row, col)); } catch (_) { /* illegal */ }
  }
  return moves;
}

function initialState(size) {
  const board = createBoard(size);
  const position = boardKey(board);
  return { version: 2, boardSize: size, turn: 'B', board, history: [], captures: { B: 0, W: 0 }, passes: 0, finished: false, lastMove: null, previousPosition: null, position, positions: [position], players: { B: null, W: null }, score: null };
}

module.exports = { EMPTY, COLORS, boardKey, coordinate, createBoard, getGroup, initialState, legalMoves, other, parseCoordinate, playMove };
