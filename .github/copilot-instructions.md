# Repository instructions

- Keep Go rules in `src/go.js` and keep them dependency-free.
- Treat `data/game.json` as authoritative; never trust issue-provided turn or color.
- Preserve generated README sections and validate changes with `npm test`.
- Use Node 20 CommonJS modules for GitHub Actions compatibility.
