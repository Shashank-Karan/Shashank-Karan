const ChessEngine = require('./chess_engine');
const SVGRenderer = require('./svg_renderer');
const fs = require('fs');
const path = require('path');

const OWNER_ID = 'Shashank-Karan';
const REPO_NAME = 'Shashank-Karan'; // Profile README repository

async function handleMove() {
    const issueTitle = process.env.ISSUE_TITLE || ''; // "Chess Move: e2e4"
    const username = process.env.ISSUE_USER || 'Community';

    const moveMatch = issueTitle.match(/Chess Move:\s*([a-h1-8NBRQKx+#=]{2,7})/i);
    if (!moveMatch) {
        console.log('No valid move found in issue title:', issueTitle);
        return;
    }

    const moveStr = moveMatch[1].toLowerCase();
    const stateFile = path.join(__dirname, '..', 'data', 'state.json');
    const engine = new ChessEngine(stateFile);
    const renderer = new SVGRenderer();

    const result = engine.makeMove(moveStr, username);
    if (result.success) {
        console.log(`Move ${moveStr} successful by ${username}`);

        // Ensure board directory exists
        const boardDir = path.join(__dirname, '..', 'data', 'board');
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
    } else {
        console.error(`Move ${moveStr} failed:`, result.error);
    }
}

function updateREADME(engine, boardData) {
    const readmePath = path.join(__dirname, '..', 'README.md');
    const state = engine.getGameState();

    // If boardData is not provided (first run/reset), generate it
    if (!boardData) {
        const renderer = new SVGRenderer();
        boardData = renderer.renderBoard(engine, OWNER_ID, REPO_NAME);
    }

    let turnLabel = state.turn === 'w' ? 'WHITE (hollow)' : 'BLACK (solid)';
    let statusMessage = `It's your turn! Move a **${state.turn === 'w' ? 'white (hollow)' : 'black (solid)'}** piece.`;
    let subStatus = `It's your move... to choose where to move...`;

    if (state.isCheckmate) {
        const winner = state.turn === 'w' ? 'BLACK (solid)' : 'WHITE (hollow)';
        turnLabel = `CHECKMATE! ${winner} wins! 🏆`;
        statusMessage = `Game Over. The tournament has ended.`;
        subStatus = `Congratulations to the winning team!`;
    } else if (state.isDraw) {
        turnLabel = `DRAW! 🤝`;
        statusMessage = `Game Over. The tournament ended in a draw.`;
        subStatus = `Well played by everyone!`;
    } else if (state.isCheck) {
        turnLabel = `${turnLabel} - IN CHECK! ⚠️`;
    }

    // Sort players by move count (Leaderboard)
    const playerStats = {};
    state.history.forEach(h => {
        if (h.player !== OWNER_ID) { // Exclude the owner
            playerStats[h.player] = (playerStats[h.player] || 0) + 1;
        }
    });

    const leaderboard = Object.entries(playerStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([name, count], i) => `| ${i + 1} | @${name} | ${count} |`)
        .join('\n');

    const history = state.history.slice(-10).reverse().map(h => {
        const time = new Date(h.timestamp).toLocaleString();
        return `| @${h.player} | \`${h.move}\` | ${time} |`;
    }).join('\n');

    const chessSection = `
<!-- CHESS_START -->
# Shashank's Community Chess Tournament

${statusMessage} 👋

### ${turnLabel}
${subStatus}

${generateMarkdownTable(boardData)}

### 💡 How to Move
1. **Click the Board**: Click on any **Blue Dot** on the chessboard to move a piece to that square.
2. **Use the List**: If multiple pieces can move to the same square, use the **Legal Moves** list below.

### 📜 Legal Moves for ${state.turn === 'w' ? 'White' : 'Black'}
${generateLegalMovesLinks(engine, OWNER_ID, REPO_NAME)}

### How this works

When you click a link (the small dots on the board), it opens a GitHub Issue with the required pre-populated text. Just push **"Submit new issue"**. That will trigger a GitHub Actions workflow that'll update my GitHub Profile README.md with the new state of the board.

### Notice a problem?

[**Raise an issue**](https://github.com/${OWNER_ID}/${REPO_NAME}/issues/new), and include the text. (Admin: @${OWNER_ID})

### Last few moves, this game
| Player | Move | Time |
| :--- | :--- | :--- |
${history || '| None | - | - |'}

### Top 20 Leaderboard: Most moves across all games, except me.
| Rank | Player | Moves |
| :--- | :--- | :--- |
${leaderboard || '| - | No moves yet | 0 |'}

### 📢 Spread the Word!
Invite your friends to take the next move:
- [**🐦 Share on X (Twitter)**](https://twitter.com/intent/tweet?text=I%27m%20playing%20Community%20Chess%20on%20@${OWNER_ID}%27s%20GitHub%20profile!%20Join%20the%20tournament:%20https://github.com/${OWNER_ID}/${REPO_NAME})
- [**📱 Share on WhatsApp**](https://api.whatsapp.com/send?text=Come%20join%20the%20Community%20Chess%20Tournament%20on%20GitHub!%20Take%20the%20next%20move%20here:%20https://github.com/${OWNER_ID}/${REPO_NAME})
- [**📘 Share on Facebook**](https://www.facebook.com/sharer/sharer.php?u=https://github.com/${OWNER_ID}/${REPO_NAME})
- [**💼 Share on LinkedIn**](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/${OWNER_ID}/${REPO_NAME})
- [**✈️ Share on Telegram**](https://t.me/share/url?url=https://github.com/${OWNER_ID}/${REPO_NAME}&text=Join%20the%20Chess%20Tournament%20on%20GitHub!)
- [**🤖 Share on Reddit**](https://www.reddit.com/submit?url=https://github.com/${OWNER_ID}/${REPO_NAME}&title=Community%20Chess%20on%20GitHub)

<!-- CHESS_END -->
`;

    let readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '# My Profile\n\n';
    const regex = /<!-- CHESS_START -->[\s\S]*<!-- CHESS_END -->/;
    if (readme.match(regex)) {
        readme = readme.replace(regex, chessSection.trim());
    } else {
        readme += '\n' + chessSection.trim();
    }

    fs.writeFileSync(readmePath, readme);
}

function generateMarkdownTable(boardData) {
    let table = '|   | A | B | C | D | E | F | G | H |   |\n';
    table += '|---|---|---|---|---|---|---|---|---|---|\n';

    for (let y = 0; y < 8; y++) {
        const rowLabel = 8 - y;
        let rowStr = `| **${rowLabel}** |`;
        for (let x = 0; x < 8; x++) {
            const square = boardData[y][x];
            const timestamp = Date.now();
            const imgTag = `<img src="data/board/${square.square}.svg?t=${timestamp}" width="45" height="45" />`;
            if (square.moveUrl) {
                rowStr += ` [${imgTag}](${square.moveUrl}) |`;
            } else {
                rowStr += ` ${imgTag} |`;
            }
        }
        rowStr += ` **${rowLabel}** |`;
        table += rowStr + '\n';
    }

    table += '|   | **A** | **B** | **C** | **D** | **E** | **F** | **G** | **H** |   |\n';
    return table;
}

function generateLegalMovesLinks(engine, owner, repo) {
    const moves = engine.getLegalMoves();
    if (moves.length === 0) return '_No legal moves available._';

    // Group moves by 'from' square
    const grouped = {};
    moves.forEach(m => {
        if (!grouped[m.from]) grouped[m.from] = [];
        grouped[m.from].push(m);
    });

    let output = '';
    for (const from in grouped) {
        const piece = engine.chess.get(from);
        const pieceName = getPieceName(piece);
        const moveLinks = grouped[from].map(m => {
            const url = `https://github.com/${owner}/${repo}/issues/new?title=Chess+Move:+${m.lan}&body=Click+Submit+to+make+your+move!`;
            return `[\`${m.to}\`](${url})`;
        }).join(', ');
        output += `- **${pieceName} (${from})**: ${moveLinks}\n`;
    }
    return output;
}

function getPieceName(piece) {
    const names = {
        'p': 'Pawn',
        'n': 'Knight',
        'b': 'Bishop',
        'r': 'Rook',
        'q': 'Queen',
        'k': 'King'
    };
    return names[piece.type];
}

module.exports = {
    OWNER_ID,
    REPO_NAME,
    handleMove,
    updateREADME
};

if (require.main === module) {
    handleMove();
}
