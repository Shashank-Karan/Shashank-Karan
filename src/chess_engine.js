const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

class ChessEngine {
    constructor(stateFilePath) {
        this.stateFilePath = stateFilePath;
        this.state = this.loadState();
        this.chess = new Chess(this.state.fen);
    }

    loadState() {
        if (fs.existsSync(this.stateFilePath)) {
            return JSON.parse(fs.readFileSync(this.stateFilePath, 'utf8'));
        }
        return {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            history: [],
            players: {},
            lastMove: null
        };
    }

    saveState() {
        this.state.fen = this.chess.fen();
        fs.writeFileSync(this.stateFilePath, JSON.stringify(this.state, null, 2));
    }

    makeMove(moveStr, player) {
        try {
            let moveInfo = moveStr;
            // If it's LAN (e.g., e2e4), convert to object for chess.js
            if (moveStr.length >= 4 && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(moveStr)) {
                moveInfo = {
                    from: moveStr.substring(0, 2),
                    to: moveStr.substring(2, 4),
                    promotion: moveStr.substring(4) || 'q'
                };
            }
            const move = this.chess.move(moveInfo);
            if (move) {
                this.state.history.push({
                    move: moveStr,
                    player: player,
                    timestamp: new Date().toISOString()
                });
                this.state.lastMove = move;
                this.saveState();
                return { success: true, move };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
        return { success: false, error: 'Invalid move' };
    }

    getLegalMoves() {
        return this.chess.moves({ verbose: true });
    }

    getGameState() {
        return {
            fen: this.chess.fen(),
            turn: this.chess.turn(),
            isCheck: this.chess.isCheck(),
            isCheckmate: this.chess.isCheckmate(),
            isDraw: this.chess.isDraw(),
            isGameOver: this.chess.isGameOver(),
            history: this.state.history,
            lastMove: this.state.lastMove
        };
    }

    reset() {
        this.chess.reset();
        this.state = {
            fen: this.chess.fen(),
            history: [],
            players: {},
            lastMove: null
        };
        this.saveState();
    }
}

module.exports = ChessEngine;
