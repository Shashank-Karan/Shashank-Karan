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

    render(engine, owner, repo) {
        const game = engine.getGameState();
        const fen = game.fen.split(' ')[0];
        const rows = fen.split('/');
        const lastMove = game.lastMove;

        let svg = `<svg width="${this.totalSize}" height="${this.totalSize}" viewBox="0 0 ${this.totalSize} ${this.totalSize}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">`;

        // Background
        svg += `<rect width="${this.totalSize}" height="${this.totalSize}" fill="#f5f5f5" rx="10" />`;

        // Draw Coordinates (Numbers 1-8)
        for (let i = 0; i < 8; i++) {
            const label = 8 - i;
            svg += `<text x="${this.margin / 2}" y="${this.margin + i * this.tileSize + this.tileSize / 2}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${this.colors.text}">${label}</text>`;
            svg += `<text x="${this.totalSize - this.margin / 2}" y="${this.margin + i * this.tileSize + this.tileSize / 2}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${this.colors.text}">${label}</text>`;
        }

        // Draw Coordinates (Letters A-H)
        for (let j = 0; j < 8; j++) {
            const label = String.fromCharCode(65 + j);
            svg += `<text x="${this.margin + j * this.tileSize + this.tileSize / 2}" y="${this.margin / 2}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${this.colors.text}">${label}</text>`;
            svg += `<text x="${this.margin + j * this.tileSize + this.tileSize / 2}" y="${this.totalSize - this.margin / 2}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${this.colors.text}">${label}</text>`;
        }

        // Board Group
        svg += `<g transform="translate(${this.margin}, ${this.margin})">`;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const isLight = (i + j) % 2 === 0;
                const fill = isLight ? this.colors.light : this.colors.dark;
                svg += `<rect x="${j * this.tileSize}" y="${i * this.tileSize}" width="${this.tileSize}" height="${this.tileSize}" fill="${fill}" />`;
            }
        }

        // Last Move Highlight
        if (lastMove) {
            const from = this.algebraicToCoords(lastMove.from);
            const to = this.algebraicToCoords(lastMove.to);
            svg += `<rect x="${from.x * this.tileSize}" y="${from.y * this.tileSize}" width="${this.tileSize}" height="${this.tileSize}" fill="${this.colors.lastMove}" />`;
            svg += `<rect x="${to.x * this.tileSize}" y="${to.y * this.tileSize}" width="${this.tileSize}" height="${this.tileSize}" fill="${this.colors.lastMove}" />`;
        }

        // Draw Pieces & Links
        const legalMoves = engine.getLegalMoves();

        rows.forEach((row, i) => {
            let col = 0;
            for (const char of row) {
                if (isNaN(char)) {
                    const x = col * this.tileSize;
                    const y = i * this.tileSize;
                    const symbol = this.pieceSymbols[char];
                    const square = this.coordsToAlgebraic(col, i);

                    // Interaction: If a piece has legal moves, wrap it in a link or add overlay
                    const pieceMoves = legalMoves.filter(m => m.from === square);

                    svg += `<text x="${x + this.tileSize / 2}" y="${y + this.tileSize / 2 + 5}" font-size="45" text-anchor="middle" dominant-baseline="middle" style="cursor: pointer;">${symbol}</text>`;

                    col++;
                } else {
                    col += parseInt(char);
                }
            }
        });

        // Add overlays for legal moves (invisible hit areas)
        legalMoves.forEach(move => {
            const to = this.algebraicToCoords(move.to);
            const moveUrl = `https://github.com/${owner}/${repo}/issues/new?title=Chess+Move:+${move.lan}&amp;body=Click+Submit+to+make+your+move!`;

            svg += `<a href="${moveUrl}" target="_blank">
                <circle cx="${to.x * this.tileSize + this.tileSize / 2}" cy="${to.y * this.tileSize + this.tileSize / 2}" r="12" fill="rgba(88, 166, 255, 0.4)" stroke="white" stroke-width="2" style="cursor: pointer;" />
                <rect x="${to.x * this.tileSize}" y="${to.y * this.tileSize}" width="${this.tileSize}" height="${this.tileSize}" fill="transparent" style="cursor: pointer;" />
            </a>`;
        });

        svg += `</g>`; // End Board Group

        // Turn Indicator
        const turnColor = game.turn === 'w' ? 'white' : 'black';
        const turnText = game.turn === 'w' ? "White's Turn" : "Black's Turn";
        svg += `<circle cx="${this.totalSize - 15}" cy="15" r="8" fill="${turnColor}" stroke="${this.colors.text}" stroke-width="1" />`;

        svg += `</svg>`;
        return svg;
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
