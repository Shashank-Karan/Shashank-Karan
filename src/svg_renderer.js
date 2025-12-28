const fs = require('fs');

class SVGRenderer {
    constructor() {
        this.tileSize = 60;
        this.margin = 30; // Margin for coordinates
        this.boardSize = this.tileSize * 8;
        this.totalSize = this.boardSize + (this.margin * 2);
        this.colors = {
            light: '#f0d9b5',
            dark: '#b58863',
            highlight: 'rgba(255, 255, 0, 0.4)',
            lastMove: 'rgba(155, 199, 0, 0.4)',
            text: '#313131'
        };
        this.pieceSymbols = {
            'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
            'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
        };
    }

    renderBoard(engine, owner, repo) {
        const board = [];
        for (let y = 0; y < 8; y++) {
            const row = [];
            for (let x = 0; x < 8; x++) {
                row.push(this.renderSquare(engine, x, y, owner, repo));
            }
            board.push(row);
        }
        return board;
    }

    renderSquare(engine, x, y, owner, repo) {
        const game = engine.getGameState();
        const lastMove = game.lastMove;
        const legalMoves = engine.getLegalMoves();
        const square = this.coordsToAlgebraic(x, y);

        // Determine piece at this square
        const piece = engine.chess.get(square);
        const symbol = piece ? this.pieceSymbols[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()] : '';

        // Determine background color
        const isLight = (x + y) % 2 === 0;
        let fill = isLight ? this.colors.light : this.colors.dark;

        // Last move highlight
        if (lastMove && (lastMove.from === square || lastMove.to === square)) {
            fill = this.colors.lastMove;
        }

        // Check for legal moves to this square (destination dots)
        const move = legalMoves.find(m => m.to === square);
        const hasDot = !!move;

        let svg = `<svg width="${this.tileSize}" height="${this.tileSize}" viewBox="0 0 ${this.tileSize} ${this.tileSize}" xmlns="http://www.w3.org/2000/svg">`;

        // Square Background
        svg += `<rect width="${this.tileSize}" height="${this.tileSize}" fill="${fill}" />`;

        // Piece
        if (symbol) {
            svg += `<text x="${this.tileSize / 2}" y="${this.tileSize / 2 + 5}" font-size="45" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">${symbol}</text>`;
        }

        // Legal Move Dot
        if (hasDot) {
            svg += `<circle cx="${this.tileSize / 2}" cy="${this.tileSize / 2}" r="10" fill="rgba(88, 166, 255, 0.6)" stroke="white" stroke-width="2" />`;
        }

        svg += `</svg>`;

        // If there's a move to this square, we wrap the image in a link in the Markdown table.
        // We'll return both the SVG and the potential URL.
        const moveUrl = move ? `https://github.com/${owner}/${repo}/issues/new?title=Chess+Move:+${move.lan}&body=Click+Submit+to+make+your+move!` : null;

        return {
            svg,
            moveUrl,
            square
        };
    }

    algebraicToCoords(square) {
        const col = square.charCodeAt(0) - 97;
        const row = 8 - parseInt(square[1]);
        return { x: col, y: row };
    }

    coordsToAlgebraic(x, y) {
        return String.fromCharCode(97 + x) + (8 - y);
    }
}

module.exports = SVGRenderer;
