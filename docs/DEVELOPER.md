# Developer Guide

Use CommonJS modules and Node 20 built-ins only. Run `npm test` for the rules suite, `npm run validate` to check committed state, and `node src/cli.js generate` to render README locally. `node src/cli.js help` lists the available commands.

The main extension point is `src/process-move.js`: it receives the GitHub issue payload, calls the rules engine, updates JSON, and regenerates presentation files. Keep rule decisions in `src/go.js` so they remain independently testable.

For a new feature:

1. Add or update a focused test in `test/`.
2. Change the smallest owning module.
3. Run `npm test` and `node --check` on changed JavaScript files.
4. Inspect the generated README and JSON diff.

Never accept client-provided color or board state. The committed state determines turn and legality. The move workflow uses a single concurrency group so simultaneous issues cannot both validate against the same old position.
