# Installation

1. Create a public GitHub repository. For a profile experience, use the exact username repository name.
2. Copy this project into the repository and update `data/config.json` with `OWNER/REPOSITORY`.
3. Enable Issues and Actions in repository settings.
4. Create the `go-move`, `move-processed`, and `move-rejected` labels, or let the workflows create them when available.
5. Set workflow permissions to **Read and write permissions** under Settings > Actions > General. Without this, the bot can validate but cannot commit the updated board or close issues.
6. Commit the initial state. The checks workflow runs `npm test` and validates the game state.
7. Open the repository README and submit the first linked move issue.

GitHub Actions is the only runtime. No server, database, token, or package installation is required beyond Node 20 supplied by Actions.
