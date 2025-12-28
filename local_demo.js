const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 1. Reset state to start a fresh game
const stateFile = path.join(__dirname, 'data', 'state.json');
const initialState = {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    history: [],
    players: {},
    lastMove: null
};
fs.writeFileSync(stateFile, JSON.stringify(initialState, null, 2));

console.log('✅ Game state reset.');

// 2. Define a set of moves to simulate
const moves = [
    { move: 'e2e4', user: 'Grandmaster' },
    { move: 'e7e5', user: 'ChessPro' },
    { move: 'g1f3', user: 'Grandmaster' }
];

console.log('🚀 Simulating moves...');

moves.forEach(m => {
    process.env.ISSUE_TITLE = `Chess Move: ${m.move}`;
    process.env.ISSUE_USER = m.user;

    // Run the move handler
    try {
        execSync('node src/move_handler.js', { stdio: 'inherit' });
        console.log(`   ✔ Move ${m.move} by ${m.user} processed.`);
    } catch (err) {
        console.error(`   ✘ Error processing move ${m.move}:`, err.message);
    }
});

console.log('\n--- SIMULATION COMPLETE ---');
console.log('1. Open "data/board.svg" in your browser to see the updated board.');
console.log('2. Open "README.md" in a previewer to see the history and turn.');
console.log('3. Check "data/state.json" to see the saved game state.');
