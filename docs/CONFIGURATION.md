# Configuration

`data/config.json` controls the board size, komi, repository URL, issue labels, and title limit. `boardSize` supports `9`, `13`, and `19`.

To start a new board after changing size:

```sh
node src/cli.js init
node src/cli.js generate
```

The committed JSON files are the source of truth:

- `data/game.json`: board, turn, history, captures, Ko position, and pass state.
- `data/players.json`: move counts, captures, ELO placeholder, and result fields.
- `data/game.sgf`: portable game record.
