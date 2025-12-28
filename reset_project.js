const fs = require('fs');
const path = require('path');
const ChessEngine = require('./src/chess_engine');
const SVGRenderer = require('./src/svg_renderer');
const { updateREADME, OWNER_ID, REPO_NAME } = require('./src/move_handler');

// SAFETY CHECK: Only reset if --confirm is passed
if (!process.argv.includes('--confirm')) {
    console.log('\x1b[31m%s\x1b[0m', '⚠️  WARNING: This will reset the Chess Tournament and clear all history.');
    console.log('To proceed, run: \x1b[32mnode reset_project.js --confirm\x1b[0m');
    process.exit(1);
}

const stateFile = path.join(__dirname, 'data', 'state.json');
const engine = new ChessEngine(stateFile);
const renderer = new SVGRenderer();

// Manually verify we start from scratch
const initialState = {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    history: [],
    players: {},
    lastMove: null
};
fs.writeFileSync(stateFile, JSON.stringify(initialState, null, 2));

// Ensure board directory exists
const boardDir = path.join(__dirname, 'data', 'board_v2');
if (!fs.existsSync(boardDir)) {
    fs.mkdirSync(boardDir, { recursive: true });
}

// Update Board Squares
const boardData = renderer.renderBoard(engine, OWNER_ID, REPO_NAME);
boardData.forEach(row => {
    row.forEach(squareData => {
        fs.writeFileSync(path.join(boardDir, `${squareData.square}.svg`), squareData.svg);
    });
});

// Update README
updateREADME(engine, boardData);

console.log('\x1b[32m%s\x1b[0m', '✅ Project reset to initial state successfully.');
