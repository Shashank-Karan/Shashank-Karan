# Community Go Game

One continuous 19x19 Go game played by the GitHub community through Issues and GitHub Actions.

## Current Turn

**Black (B)**. Run `npm run generate` after cloning to render the current board from JSON.

## Current Board

<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="19 by 19 Go board" viewBox="0 0 560 560" width="560"><rect width="560" height="560" fill="#d8a24a"/><path d="M28 28H532 M28 56H532 M28 84H532 M28 112H532 M28 140H532 M28 168H532 M28 196H532 M28 224H532 M28 252H532 M28 280H532 M28 308H532 M28 336H532 M28 364H532 M28 392H532 M28 420H532 M28 448H532 M28 476H532 M28 504H532 M28 532H532 M28 28V532 M56 28V532 M84 28V532 M112 28V532 M140 28V532 M168 28V532 M196 28V532 M224 28V532 M252 28V532 M280 28V532 M308 28V532 M336 28V532 M364 28V532 M392 28V532 M420 28V532 M448 28V532 M476 28V532 M504 28V532 M532 28V532" stroke="#633f1e" fill="none"/><g font-family="sans-serif" font-size="11" fill="#432916" text-anchor="middle"><text x="28" y="18">A</text><text x="56" y="18">B</text><text x="84" y="18">C</text><text x="112" y="18">D</text><text x="140" y="18">E</text><text x="168" y="18">F</text><text x="196" y="18">G</text><text x="224" y="18">H</text><text x="252" y="18">I</text><text x="280" y="18">J</text><text x="308" y="18">K</text><text x="336" y="18">L</text><text x="364" y="18">M</text><text x="392" y="18">N</text><text x="420" y="18">O</text><text x="448" y="18">P</text><text x="476" y="18">Q</text><text x="504" y="18">R</text><text x="532" y="18">S</text><text x="12" y="32">19</text><text x="12" y="60">18</text><text x="12" y="88">17</text><text x="12" y="116">16</text><text x="12" y="144">15</text><text x="12" y="172">14</text><text x="12" y="200">13</text><text x="12" y="228">12</text><text x="12" y="256">11</text><text x="12" y="284">10</text><text x="12" y="312">9</text><text x="12" y="340">8</text><text x="12" y="368">7</text><text x="12" y="396">6</text><text x="12" y="424">5</text><text x="12" y="452">4</text><text x="12" y="480">3</text><text x="12" y="508">2</text><text x="12" y="536">1</text></g></svg>

**No stones yet.** The first accepted move will appear here automatically.

GitHub Actions updates this board automatically after a legal issue is submitted. The update is asynchronous, so refresh the page while the workflow runs.

## Start Here

**It is Black's turn.**

1. Click any blue coordinate in **Legal Moves** below.
2. In the new issue, click **Submit new issue**. You do not need to change anything.
3. Wait for the bot to check it. If it is legal, the board updates and the issue closes.

You do not need to know Go to participate. Just choose one of the listed coordinates.

## How To Play

1. Pick a coordinate from **Legal Moves**.
2. Submit the pre-filled issue unchanged.
3. The bot validates the move and updates the board automatically.

Letters run left to right and numbers run bottom to top. **D4** means column D, row 4.

Example: choose the **D** column, then count up from the bottom to row **4**:

```text
	A   B   C   D
4     .   .   .   X  <- D4
3     .   .   .   .
2     .   .   .   .
1     .   .   .   .
```

## Legal Moves

Initial board: [A1](../../issues/new?title=Go%20move%3A%20A1) · [D4](../../issues/new?title=Go%20move%3A%20D4) · [J10](../../issues/new?title=Go%20move%3A%20J10) · [Q16](../../issues/new?title=Go%20move%3A%20Q16) · [S19](../../issues/new?title=Go%20move%3A%20S19)

The generated README lists every legal move with a repository-aware issue link.

## Last 20 Moves

No moves yet.

## Player Leaderboard

No contributors yet.

## Game Statistics

- Board: **19x19**
- Move count: **0**
- Captures: **Black 0 / White 0**
- Passes: **0**
- Status: **In progress**

## Share Links

[Open a move issue](../../issues/new?title=Go%20move%3A) · [Browse move issues](../../issues) · [Download SGF](data/game.sgf)

## Configuration

Change `boardSize` in [data/config.json](data/config.json) to `9`, `13`, or `19`, then run `node src/cli.js init && node src/cli.js generate`.

The move workflow serializes submissions, so two people clicking at nearly the same time are still processed in a predictable order. A rejected issue is labeled and receives a bot reply; the committed board never changes for an invalid move.

See [docs/INSTALLATION.md](docs/INSTALLATION.md), [docs/CONFIGURATION.md](docs/CONFIGURATION.md), [docs/DEVELOPER.md](docs/DEVELOPER.md), and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
