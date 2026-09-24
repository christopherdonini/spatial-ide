# explicit viewer-before-shell build order — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 (read, cite by path:line, not retyped); DECISIONS-PENDING.md entry 115, item (b); kernel/RESULTS.md, section "### Step 4 — the shell build/test (`frontends/shell`)"; PLAN.yaml node drill-fix-viewer-build-order; AUTONOMY.md §21d.
Scope: frontends/shell/package.json (the "prebuild" and "pretest" scripts only) and a new frontends/shell/scripts/buildViewerFirst.mjs; declared line budget <= 150 non-generated lines across <= 8 files.
Change: prebuild first runs buildViewerFirst.mjs (builds renderer/bundle-viewer, refusing with a named-fix message if its node_modules is missing) then generate:notice, so a bare `npm run build` here builds the viewer on its own; pretest is simplified since prebuild now covers what it built explicitly.
Tests+mutation: the check is a real clean run -- delete renderer/bundle-viewer/dist and dist-metafile.json, run `npm run build` in frontends/shell, record rc; the mutation is the change reverted and the same run recorded failing with generateNotice.mjs's existing "does not exist -- run `npm run build` in renderer/bundle-viewer first" message; both runs recorded in the hand-back.
Out-of-scope: no dependency added/removed/bumped; no ADR, wire, security or guarantee text; no change to what ships -- frontends/shell/src/generated/NOTICE.txt and the viewer's dist/NOTICE.txt sha256 verified equal to main's build of them.
```

Budget: 43 of 150 non-generated lines across 2 files (git diff --numstat origin/main...HEAD, the form excluded).

Amendment 1 (sibling per AUTONOMY.md sec14): pretypecheck (frontends/shell/package.json:11) shared the same generate:notice precondition prebuild had; fixed the same way in commit 6554b96. Budget after: 45 of 150 non-generated lines across 2 files (git diff --numstat origin/main...HEAD, the form excluded).

Amendment 2 (reviewer PASS-with-notes, PR #106 attempt 1; per AUTONOMY.md sec14 sibling search):
- Sibling (a), fixed: `build:frontend:measure` (frontends/shell/package.json:38) reaches `vite build --mode measure` with no `prebuild`-style hook, so it hit the same missing-NOTICE failure on a clean clone; fixed by adding `prebuild:frontend:measure` (npm's own pre-hook convention for any script name, not only `build`/`typecheck`), same shape as `prebuild`/`pretypecheck`, this commit.
- Sibling (b), out of scope: `dev` (vite, reached by `tauri dev`'s `beforeDevCommand`) returns HTTP 500 on a clean clone because `NoticesPanel.tsx` imports a NOTICE the dev server never generates. Not fixed here: a `predev` hook would run the viewer build and the cargo-backed notice generation on every `vite` dev start, a dev-loop change outside state/directives/2026-09-22-part-n-n8-and-sequencing.md:159's "bounded repairs, not a tooling redesign." Named for the morning list.
- Nit fixed: buildViewerFirst.mjs's header now names `prebuild`, `pretypecheck`, and `prebuild:frontend:measure` as its callers (this commit).
- Nit fixed: buildViewerFirst.mjs's header no longer claims `tauri.conf.json`'s `beforeBuildCommand` installs the viewer's own dependencies; only CI does, and `beforeBuildCommand` reaches this script through `prebuild` the same as any other `npm run build` caller (this commit).
- Nit fixed: a failed viewer build no longer surfaces an uncaught `execSync`/`execFileSync` stack trace; the failure is caught, printed as one line, and the process exits with the child's own status (or 1) (this commit).
- No earlier form line is superseded by this amendment.

Budget after Amendment 2: 54 of 150 non-generated lines across 2 files (git diff --numstat against the branch's merge-base with origin/main, working tree included, the form excluded).
