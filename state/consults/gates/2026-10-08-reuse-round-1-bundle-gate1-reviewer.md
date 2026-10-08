# PR #192 gate 1 — reviewer (single gate)
Reviewed: cut/reuse-round-1-bundle @ 2ae29e9dff327a25984acbf39a2c3bd19ad7f914

**VERDICT: FAIL (Evidence: E1 only). Correctness: PASS. Documentation: 1 finding, plus 1 bundle finding for the human.**

Scope: `origin/main...origin/cut/reuse-round-1-bundle` (merge-base be845ea37e23cf797606023d322ee4ec78e72546, main at 966a298569d9eab838571c17ea170f6d3bb09ec8). I worked in the worktree C:/dev/wt/reuse, which was clean at the head before and after. I made no commit, no tracked edit and no remote write. My scratch held the extraction. I never ran `fetch-cache.mjs`. All my processes have exited.

## Out-of-scope line (read first)

I checked each category claim in `REUSE-ROUND-1-BUNDLE-PREREGISTRATION.md:10` on main, and each holds:
- **ADR none.** No ADR file or status line is touched.
- **Security none.** Nothing under `reuse/` runs at build, in CI or in the product. Every workflow path filter misses `reuse/` (governance-ci, product-ci-*, rust-fmt, adr-003-*). No `node --test` glob reaches `reuse/`. There is no root package.json and no dependabot config.
- **Wire none.**
- **Guarantee none.**

The line's conclusion does not hold. It reads "§21a's four categories untouched, so the single reviewer gate applies". §21a has a second trigger, the size threshold. See E1.

## Evidence (blocking)

**E1. The single-gate route is closed by size, so an architect gate is owed.**
- §21a reads (`AUTONOMY.md:329`, on main): "**OR** whenever the change **exceeds the size threshold in §21c**, whatever it touches."
- The §21c bound (`AUTONOMY.md:350`, a sub-line span): "≤ 150 changed lines of non-generated code across ≤ 8 files".
- The diff adds 366 lines of non-generated code: `git diff --numstat` shows check-index.mjs 59, fetch-cache.mjs 198 and reuse.mjs 109. The whole diff is 12,216 lines over 139 files.
- Placed code is not in the exempt set. The human's counting note (question round 5, item 2) enumerates that set narrowly: the piece's own form and obliged governing-doc sentences.
- The form puts a declaration in place of the budget. `REUSE-ROUND-1-BUNDLE-PREREGISTRATION.md:3` reads "The bundle's own size is declared instead of a line budget, since nothing in it is written in this piece." No ruling supports that exemption. The human's direction says "one docs-and-data piece" and "it contains code", and it says nothing on gating.
- §21b (`AUTONOMY.md:336`) also allows the single gate "**only** for **docs, tests, and polish**".
- Precedent: the #167 gate-1 reviewer, S1-1, at `state/consults/gates/2026-10-03-subagent-write-audit-script-gate1-reviewer.md:12`. A five-line form over §21c was found closed to the single gate, and an architect gate was owed.
- **Fix, nothing inside `reuse/` edited.** Either:
  - append a class-6 row to the form's Amendments (budget deviation, Scope not edited) and open the architect gate; this report's Correctness verdict can stand as the reviewer half; or
  - bring the human the question of whether a bundle placed as it came falls outside §21c's count. That is the human's ruling to make, not the custodian's.

## Correctness: PASS

- **Byte identity.**
  - The uploaded archive's sha256 is 50d87a03eb42148608209edbad2d905bcea0e1c369f1d3330f86fb54d2409526, which matches the declared hash (rc 0).
  - `unzip -l` lists 139 files, 757,418 bytes, all under `reuse/`.
  - I extracted it into a new empty scratch folder (rc 0). `diff -r` of that against the worktree's `reuse/` is empty (rc 0).
  - Stronger check: `git hash-object --no-filters` over every extracted file equals every `git ls-tree` blob at the head, 139 of 139 (diff rc 0). The committed bytes are the archive's.
  - All 139 files are i/lf w/lf. I found no CR in the archive.
- **Diff shape.** 139 files, all status A, all under `reuse/`. Nothing outside `reuse/` (the grep for non-`reuse/` names returned rc 1).
- **The three tools.**
  - **SPDX and headers.** Each carries `// SPDX-License-Identifier: AGPL-3.0-or-later` and the repository's standard copyright line (`reuse/tools/check-index.mjs:2-3`, `reuse.mjs:2-3`, `fetch-cache.mjs:2-3`). That matches the core grant in `LICENSES/README.md` (the Core row: "every other source file").
  - **What they touch.** They use the Node standard library only. No product or CI caller exists.
  - **fetch-cache.mjs.** It validates the whole lock before any git call and refuses a destination inside a git repository. It is not run here.
  - **Minor robustness, not blocking, the human's to route.** check-index.mjs:59 calls `d.capabilities.reduce` without a fallback if `capabilities` is absent. reuse.mjs:100 iterates `c.decisions_for_human` without `?? []`. Both hold today: all 55 capabilities carry both arrays.
- **Pinned citations, resolved independently.**
  - The bundle has 256 distinct `path:line @ rev` cites: 246 at 4561f3b8 and 10 at 14acee0b. Both commits are ancestors of origin/main.
  - Each path exists at its pin and each line range is within the file: 256 of 256, 0 out of range.
  - Five cites go into files that exist only at 14acee0b (ADR-036 and `kernel/src/dataset_ref.rs`), as `reuse/README.md:7` says.
  - My regex found no unpinned rooted in-tree cite.
  - Spot checks hold:
    - `docs/08_Testing.md:40 @ 4561f3b8` says "redistributable".
    - `kernel/src/dataset_ref.rs:530-541 @ 14acee0b` is `in_canonical_form`.
    - In `VERIFICATION-A.md:68`, the elided quote of `PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md:181 @ 4561f3b8` keeps both retained spans byte-exact. The elision removes no negation.
- **Bundle consistency.** All 19 `plan_nodes` the index names exist in PLAN.yaml on main. The lock has 154 entries and there are 121 index files, matching `reuse/README.md:13-19`.

## Documentation (must fix before the merge; none inside `reuse/`)

**D1. Record E1's resolution in the form.** Append either the class-6 row and the architect gate, or the human's ruling. Do not edit lines 3, 7 or 10 in place.

## Bundle finding, for the human (no edit to the bundle)

**H1. Local folder paths outside this repository.**
- Lines: `reuse/notes/as-corpora.md:3`, `catalogue.md:6`, `e-lod-selection.md:3`, `j-table.md:3`, `k1-scan-progress.md:3`, `n1-model.md:3` and `q-command-bar.md:4` give the advisor's clone folder as `~/spatial-ide-archaeology/candidates/...`. `VERIFICATION-A.md:29`, `VERIFICATION-A.md:50` and `VERIFICATION-B.md:7` give `/tmp/spatial-ide`.
- They are home-relative or temporary paths from the advisor's cloud session. They contain no account name, they name Spatial IDE and not another project, and the repository's scanner passes them.
- Whether the human's "no user-profile path" condition covers the `~/` form is the human's call.

## Screens

- **The profile-path scanner.**
  - Command: `node scripts/hooks/profile-path-scan.mjs --range origin/main origin/cut/reuse-round-1-bundle`, rc 0, no hold.
  - Its one stdout line: `profile-path-scan: clean`. Its stderr line: `profile-path-scan: range read 1 commits, 12216 added lines, 139 path names`.
- **My own profile-path search** of `reuse/` (forms like Users/, /home/, AppData, drive letters, USERPROFILE, HOME, 8.3 `~N`, `.claude`, the owner's name):
  - "Christopher Donini" appears only in the three SPDX copyright lines.
  - `~N` hits are prose approximations, plus `DATA~1` and `git~1` as described examples (`n1-files.md:178`, `:246`).
  - The rest of the `~/` and `/tmp/` hits are listed in H1.
  - Patterns were run with `grep -E`, not `-iF`.
- **Other-project search.**
  - Every URL host is github.com, gitlab.com, gist.github.com, crates.io, registry.npmjs.org, w3.org, openlineage.io, layercake.openstreetmap.us or code.haverbeke.berlin. All are third-party repositories or specifications the bundle studies.
  - The owner's other repositories: none. The machine script and its words: none (the "machine/project" hits are Godot's design).
  - The three "another project" hits are proj4rs's licence badge (`catalogue.md:390`, `VERIFICATION-A.md:56`, `reuse-index.json:3832`).

## Commands (each with a timeout; no hold unless stated)

| Command | rc | Output |
|---|---|---|
| `sha256sum` of the uploaded archive | 0 | |
| `unzip -l`, then `unzip -q` into scratch | 0 | |
| `diff -r` | 0 | |
| blob-hash diff | 0 | |
| `node reuse/tools/check-index.mjs` | 0 | "ok: 55 capabilities, 188 candidates" |
| `node reuse/tools/reuse.mjs --list` | 0 | 55 lines |
| `node scripts/plan/verify-cites.mjs --files 'reuse/**'` | 0 | PASS across 139 files, no advisory |
| `node scripts/plan/verify-cites.mjs` (default set) | 0 | PASS across 1545 files; 37 loose advisories, none in `reuse/` |
| `verify-quotes.mjs` | 0 | no `reuse/` line |
| `verify-test-claims.mjs` | 0 | no `reuse/` line |
| `verify.mjs` | 0 | |
| `queue.mjs --check` | 0 | |
| `site.mjs --check` | 0 | |
| `cfg-boundary.mjs` | 0 | |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 tests, 457 pass, 0 fail |

The scripts suite ran inside a shared hold on the machine script (<M>): `hold shared -Project SpatialIDE -What "reuse-round-1-bundle gate: node --test scripts suite" -Minutes 10 -MaxWaitMinutes 20`. The hold was granted on cores 0-7 and released.

**CI.** `gh pr checks 192` returned rc 0. Every line printed:
- `every commit is signed off	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37811219512/job/113428258198`
- `no profile path in the range	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37811219689/job/113428257982`

Nothing was pending. governance-ci did not run on this PR because its path filter has no `reuse/` entry. The governance checkers are therefore proven by the local runs above, at the head.

## PR body against the head

- Lines 3-9: hold. That covers the form at ab44cd2c, committed at 18:44:15, before the placement commit at 18:44:31; base be845ea3; one commit; 139 files; byte-identical; sha256; 757,418 bytes and 12,216 lines; SPDX.
- Lines 11-15: reproduced, each rc 0. One exception: the `--staged` scan's positive canary (line 13) was a pre-PR run I cannot replay. The `--range` scan above (mine and CI's) covers the same content and is clean.
- Line 14's "only 'another project' hits" are the badge hits: confirmed.
- Lines 16-20: hold.
- Line 3's "Single reviewer gate (§21b)" does not hold. See E1.

## Outside the diff (for the custodian)

PLAN.yaml on main carries `reuse-round-1-bundle` as `status: in-progress` with `evidence: {pr: 192}`. `verifyNotDoneEvidenceNotMerged` in `scripts/plan/verify.mjs` fails a non-done node whose PR is merged. Pages runs verify.mjs on every commit to main, so the merge commit of #192 will fail Pages' verify step until the done commit lands.
