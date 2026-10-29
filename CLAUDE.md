# CLAUDE.md

Guidance for Claude Code, and for people, working in this repo. Claude Code loads this file automatically in every session started here or in a worktree of this repo. Keep it current: update it in the same PR as a change that makes it stale.

## This repo

### What it is
IGO's sample submission portal. Users fill in a sample sheet (a Handsontable grid) that is built and checked against picklists from the IGO LIMS. It is saved as a submission and later promoted into the LIMS from the Promote page. There is also a separate DMP submission flow. The repo has an Express API (`api/`) and a React single-page app (`frontend/`). When deployed, the API also serves the built frontend.

### Layout
- `api/`: Express 4 + Mongoose (MongoDB), run through Babel (`babel-node`). The entry point is `server.js`.
  - `routes/api.js` mounts `/api/upload`, `/api/submission`, `/api/promote` and `/api/dmp`, which map to `controllers/{Upload,Submission,Promote,Dmp}Controller.js`. `routes/uploadSubmission.js` is mounted directly in `server.js`.
  - `services/services.js` makes the HTTP calls (axios) to the LIMS, DMP and tumor-type (`ONCO_URL`) services. `services/crdbServices.js` does patient-ID lookups (Oracle, via `oracledb`).
  - `models/`: Mongoose schemas (Submission, DmpSubmission, UploadSubmission, User).
  - `util/columns.js` holds grid columns and validation patterns, and `util/gridconstants.js` holds recipe/material mappings. Also in `util/`: `helpers.js`, `cache.js` (node-cache), `winston.js` (logging), `mailer.js`.
  - `public/`: where the frontend build is copied. It is gitignored.
- `frontend/`: an ejected create-react-app (React 16, Redux + thunk, Material-UI, Handsontable, HashRouter).
  - Pages are in `src/containers/{Upload,Submissions,Promote}`, plus `src/components` and `src/redux/{actions,reducers,store}`.
  - Every API call is in `src/util/services.js`. The webpack setup is in `config/` and `scripts/`.
- `Makefile`: wrappers for `config-dev|qa|prod`, plus older manual deploy targets.

### Commands
API (`cd api`):
- `npm install`, then `npm start`: nodemon + babel-node, loading `api/.env` through `-r dotenv/config`. `npm run dev` runs `eslint .` first. `npm run debug` adds `--inspect`.
- `npm test`: mocha + nyc over `test/`.
- Lint: `npx eslint .` (`.eslintrc.json`: 4-space indent, single quotes, semicolons). `.prettierrc.json` sets print width 140.

Frontend (`cd frontend`):
- `npm install`, then `npm run config-dev` (or `config-qa` / `config-prod`). This copies `src/config.<env>.js` to `src/config.js`, which start, build and test all need.
- `npm start`: dev server on port 3000 (override with `PORT`/`HOST`). `npm run build` writes `frontend/build/`.
- `npm test`: Jest + Enzyme snapshot tests. It runs in watch mode unless `CI=true`. Use `npm test -- -u` after an intended UI change.
- Lint: there is no script. ESLint runs inside webpack (eslint-loader) on start and build, or run `npx eslint src`.

### Config
- Configuration and secrets come from environment settings that are never committed. `api/.env` in git is a template with empty values: put real values in your local copy, and never commit them.
- The API reads these variables (names only): `PORT`, `MONGODB_URL`, `JWT_SECRET`, `LIMS_URL`, `LIMS_USER`, `LIMS_PASSWORD`, `API_USER`, `ONCO_URL`, `DMP_URL`, `AXIOS_TIMEOUT`, `APP_VERSION`, `CRDB_URL`, `CRDB_USERNAME`, `CRDB_PASSWORD`, `CRDB_SERVER_ID`, `CRDB_DB_URL`, `CRDB_DB_USER`, `CRDB_DB_PW`, `NODE_ENV`.
- Frontend config is a JS module, not env variables: `src/config.js` exports `ENV`, `BASENAME`, `NODE_API_ROOT`, `AUTH_URL`, `HOME_PAGE_PATH`, `VERSION`. `config.dev.js` points at `http://localhost:4020/api`, so run the API with `PORT=4020` locally.
- Auth: `middlewares/jwt.js` checks a JWT session cookie (`jwt-in-cookie`) issued by IGO's separate login app. `JWT_SECRET` must match that app's secret, or every call returns 401 and the frontend redirects to `AUTH_URL`. The README explains how to reuse a dev session cookie on `localhost`.

### Deploy
- `.github/workflows/deploy.yml` is started by hand (`workflow_dispatch`, choose `dev` or `production`) and runs on self-hosted runners. It pulls `main`, builds the frontend, copies `frontend/build/` into `api/public/`, then copies `api/` into place and restarts it under PM2. Whatever is on `main` is what deploys.
- The workflow runs neither `npm install` nor a `config-*` step. A new dependency or a new frontend config key therefore also has to be set up on the runner by the team.
- The API serves `public/index.html` for `/` and for any unmatched path.

### Gotchas
- The recipe lists exist twice: `api/constants.js` and `frontend/src/util/constants.js` both define `readableRecipesLib` / `reverseReadableRecipesLib`. Recipe changes usually also touch `api/util/gridconstants.js` and `frontend/src/containers/Upload/UploadFormContainer.js`. Change both sides in the same PR.
- `frontend/src/config.js` is generated and is not in `.gitignore`, so don't commit it.
- The API's `npm test` does not load `.env`. `server.js` connects to MongoDB as soon as it is imported and exits if it can't, so export `MONGODB_URL` (and the other variables) in your shell first. The upload tests accept either 200 or a LIMS-unreachable 500.
- Node versions: the README says Node 12 and there is no `.nvmrc`. The API lockfile pulls in mocha 11 and eslint 9, which need Node 18.18 or newer. The frontend pins node-sass 4.14 and webpack 4, which expect a much older Node. Use nvm and pick a version per directory.
- `server.js` binds to `127.0.0.1` only (hard-coded), so other hosts or containers can't reach it directly.
- Protect every new router with the `authenticate` middleware from `middlewares/jwt.js` when you mount it in `routes/api.js`. `res.user.role` is one of `lab_member`, `cmo_pm` or `user`.
- The `/api/dmp/*` routes are used by the DMP integration. Don't change what they return without checking with that team.
- Branches are named `Enhancement/...` or `BugFix/...` and merge into `main`. `frontend/.travis.yml` and the "PR into development" note in `frontend/README.md` are out of date.

## Pull request workflow

This section is shared by the IGO team's repos. Change it in all of them together.

Every code change lands as a pull request. When you work with Claude Code, committing, pushing and opening the PR are pre-authorized: it does them without asking and reports the PR URL.

### 1. Branch in a fresh worktree
- Each change gets its own git worktree, branched off the latest default branch. Never commit to the default branch, and don't reuse an old branch or worktree.
  ```bash
  DEF=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@')
  DEF=${DEF:-$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)}
  git fetch origin
  git worktree add -b fix/<short-slug> ../<repo>-<short-slug> "origin/$DEF"   # or feat/, chore/, perf/
  ```
- Make all edits, builds, tests and commits inside that worktree. Other checkouts are often on stale branches.

### 2. Verify before opening the PR
- Run the full test suite. Note the counts (passed / failed / skipped). If something fails, say so in the PR; don't hide it.
- Exercise the change for real where you can: run it locally, call the endpoint, generate the output, and compare it with what it should be. Write down measured numbers (times, counts, before → after). Use only numbers you measured or verified.
- **UI changes:** run the app in a browser and screenshot every affected view. Take before AND after shots for visual changes, and after-only shots for new views. Save the PNGs with Playwright, because in-app browser screenshots aren't written to disk. If the layout changed, check phone width too.

### 3. Architecture diagram when the design changes
- If the change adds or moves components, data flow, tables, queues or endpoints, draw a **Current vs New** diagram.
- Make it a self-contained SVG: an inline `<style>` with literal colors, an explicit white background `<rect>`, and no external CSS or fonts. Commit it under `docs/architecture/<slug>.svg`, and render it to PNG for the PR body.

### 4. Rebase, push, open the PR
```bash
git fetch origin && git rebase "origin/$DEF"
git push -u origin <branch>            # after rebasing an already-pushed branch: git push --force-with-lease
gh pr create --base "$DEF" --head <branch> --title "<what changes, in plain words>" \
  --body-file pr-body.md --reviewer <reviewers>
```
- **Reviewers:** request review from everyone on the team except yourself: `RTimal`, `azheng4119`, `FahimehMirhaj`, `Ojasvi1329`. Also @-mention them on a `cc` line at the end of the body. If a PR went out without them, run `gh pr edit <n> --add-reviewer ...`.
- **Images (screenshots and diagram PNGs):** attach them as GitHub attachments. Drop the PNGs into the PR's comment box (by hand, or with Claude in Chrome's file upload). Copy the `https://github.com/user-attachments/assets/<uuid>` URLs it generates and put them in the body with `gh pr edit <n> --body-file pr-body.md`. Then clear the unsent comment.
- End commit messages and the PR description with Claude Code's attribution lines.

### 5. PR description
```markdown
## Summary
- **Why:** the problem, with the measured symptom (times, counts, errors).
- **Current:** how it works today: the components, queries, data flow, or the bug.
- **New:** how it works after this change: what was added, replaced or moved, and why this design.
- **Impact:** what changes for the lab or the business, with before → after numbers. Name any deploy or follow-up step still pending.

## What
- Plain-language bullets a non-developer in the lab could follow, one line each, about what changes for the people using it.

**Technical**
- Files, endpoints, migrations, queries, and how it was implemented.

## Screenshots  (UI changes)
| View | Before | After |
|---|---|---|
| ... | ![](https://github.com/user-attachments/assets/...) | ![](https://github.com/user-attachments/assets/...) |

## Architecture  (design changes)
Current vs new: ![](https://github.com/user-attachments/assets/...)  (source: `docs/architecture/<slug>.svg`)

## Tests and evidence
- Tests added or changed, and full-suite counts.
- The end-to-end check you ran and what it showed (real data, before → after).

## Not verified / follow-ups
- What wasn't tested, what still needs a deploy or data step, and open questions for the lab.

cc @RTimal @azheng4119 @FahimehMirhaj @Ojasvi1329
```

### 6. Keep it mergeable, and deploy safely
- If the default branch moves while the PR is open, rebase onto it, re-run the tests, and push with `--force-with-lease`.
- Editing the PR body never needs a new commit.
- Before deploying, check that nothing else is deploying the same service (`gh run list --workflow <deploy workflow> --status in_progress` and `--status queued`). Never start a concurrent deploy: wait for a healthy one to finish, and cancel only one that is stuck, failing or superseded.
- Keep this CLAUDE.md current: update it in the same PR as a change that makes it stale.

