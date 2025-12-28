const fs = require('fs');
const path = require('path');
const ChessEngine = require('./src/chess_engine');
const SVGRenderer = require('./src/svg_renderer');
const { updateREADME, OWNER_ID, REPO_NAME } = require('./src/move_handler');

const stateFile = path.join(__dirname, 'data', 'state.json');
const engine = new ChessEngine(stateFile);
const renderer = new SVGRenderer();

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

console.log('Project reset to initial state with Markdown Table board.');
