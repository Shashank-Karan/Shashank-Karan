# Configuration

`data/config.json` controls the board size, komi, repository URL, issue labels, and title limit. `boardSize` supports `9`, `13`, and `19`.

The game uses **Chinese area scoring** (`ruleset: "chinese-area"`): each player's stones plus surrounded empty points are counted, and White receives komi. Two passes end the game and calculate the result. A player can also submit `resign`.

To start a new board after changing size:

```sh
node src/cli.js init
node src/cli.js generate
```

The committed JSON files are the source of truth:

- `data/game.json`: board, turn, history, captures, superko position history, pass state, player colors, and result.
- `data/players.json`: move counts, captures, ELO placeholder, and result fields.
- `data/game.sgf`: portable game record.
