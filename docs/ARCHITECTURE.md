# Architecture

```text
Issue opened
    |
    v
issue-automation.yml -> adds go-move label
    |
    v
move.yml -> validate.js -> process-move.js
                              |
                 +------------+-------------+
                 v                          v
              go.js                 state/stats/sgf
                 |                          |
                 +------------+-------------+
                              v
                       readme.js -> README.md
```

`go.js` is a pure rules layer: groups, liberties, captures, suicide, positional Ko, coordinates, and legal move enumeration. `issue.js` translates untrusted issue text into a coordinate. `state.js` provides JSON persistence. `renderer.js` emits an inline SVG with legal links. `readme.js` composes the public game view.

The repository is deliberately append-and-commit based. Git history is the archive, `data/game.json` is the current snapshot, issues are the public move log, and `data/game.sgf` is the export format.

## Scaling the experiment

Multiple games can use separate `data/games/<id>.json` files and an issue label or command such as `game:alpha`. Spectator mode is already the default README view. ELO and contribution ranking fields are present in player stats and can be promoted to result-processing logic when a game-ending policy is chosen.
