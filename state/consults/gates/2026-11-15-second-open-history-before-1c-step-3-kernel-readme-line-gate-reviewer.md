Reviewed: PR #322 at 4533983a1aeddf78ba98d2841cc56f1ada80a10a (the custodian's filing note, 2026-11-15: the reviewer, the only gate on PR #322, the closing step of PLAN node second-open-history-before-1c-step-3, under the advisor's rulings ADV-2026-11-15-01 item 3 (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-01-the-kernel-readme-declared-limits-line-by-a-one-line-pr-no-new-form-the-reviewer-alone.md`) and ADV-2026-11-15-02 (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-02-a-worker-makes-the-kernel-readme-line-by-script-not-lead-data.md`), with a row of its own on that node (item 3 (c)); its brief by file (8213 bytes, sha256 a1fad60e4a10fa5684043571053a5886f7db94f51bcb12b51d567253411b3c9c); the run 2026-11-15T00:13:16Z to 2026-11-15T00:33:23Z by its transcript, 34 calls (Read 8, Bash 24, Grep 1, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; the report below, byte for byte, from its hand-back of 15106 bytes, sha256 b2e6afdb5fc03e6705a7b9cb3aaacc1c4ee29d46a3be5a7c294653bc2f5e4986, with this note added in its first line) (base bd5bcd09), the single reviewer gate (ADV-2026-11-15-01 item 3)
cut/kernel-readme-declared-limits-drop-63 @ 4533983a1aeddf78ba98d2841cc56f1ada80a10a — Verdict: PASS WITH NOTES

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.

**Start.** `git -C C:/dev/spatial-ide fetch -q origin` rc=0. The copies by script: `adv-2026-11-15-01.copy.md` is 3356 bytes with sha256 ebd3fb6fdc8391776fc3d54369792f6312edef7e00c16d79b6e973fd71a6ab96, and `adv-2026-11-15-02.copy.md` is 1536 bytes with sha256 92f9e36f9589ec0021ab39ec2a95aa3e58b9a709c51a30ce08fed3c064d33eb2. Both match. In the worktree C:/dev/wt/krl, HEAD is `4533983a1aeddf78ba98d2841cc56f1ada80a10a`, the branch is `cut/kernel-readme-declared-limits-drop-63`, and the porcelain has 0 lines. origin/main is bd5bcd09da885661266b3b7b46b707b3b46cb5fc, and the origin branch equals HEAD. HEAD and the empty porcelain read the same again after all the runs.

## Check 1, (a), by script

```
1	1	kernel/README.md
```
```
@@ -395 +395 @@ was itself (bake-off README §21 Q1 / §22.1).
-- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62, 63
+- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62
```
- **The span.** `git show bd5bcd09:<form>` was written to `<S>/krlr-form-base.md`. Exactly one line matches `^6\. \*\*D-1\*\*` (form line 440). `grep -o` found exactly one backtick span that begins `- **Declared limits:** KNOWN-LIMITATIONS `, and its backticks were stripped by sed.
- **The added line.** `cmp` of the span against head `kernel/README.md:395` gave rc=0. `cmp` of the span against the diff's `+` line gave rc=0.
- **The removed line.** `cmp` of the diff's `-` line against base `kernel/README.md:395` gave rc=0. My first extraction used `^-[^-]`, which wrongly excluded a line beginning `-- `, and cmp reported the extract empty (rc=1). I corrected the filter to exclude only `^--- a/` and re-ran: exactly 1 removed line and 1 added line, cmp rc=0. Base line 395 also equals line 395 at eedcbcef (cmp rc=0), the commit item 6 names.
- **Line endings.** The CR count is 0 at both base and head. Both files have 402 lines, both end in `\n`, and `file` reads both as UTF-8 text with no CRLF.
- **The rest of the file.** With line 395 deleted from both, base and head are equal (cmp rc=0). In each file, exactly one line begins `- **Declared limits:**`.

Result: one file, 1 insertion and 1 deletion. The added line is the amendment's span byte for byte, and the removed line is main's line 395.

## Check 2, (b), by my own read

`KNOWN-LIMITATIONS.md` at bd5bcd09 has 509 lines.

**How an item number is written.** An item starts with `N. **` at the start of a line. There is one exception: item 43 is bold-wrapped, `**43. …**`, at line 436. Every item-start line, sorted by number: 1–47, 51–62, 64. Item 63 is absent, and so are 48, 49 and 50, which the file never mentions.

**How a withdrawn item shows.** Its lines are gone and its number is not reused: item 62 at line 504 is followed by item 64 at line 508. This matches Amendment 3 item 3. The other `63` hits are inside hashes or `:63-65`-style cites, `question round 63` (lines 417, 423), and item 64's numbering note on line 509 ("the number is the next after item 63"). That note is historical text outside the diff.

A different status, retired, keeps its number and shows `**Retired by …**`, for example line 248 (`18. **Retired by shell-migration-milestone-1.** …`) and line 425 (39).

**The listed items**, each present exactly once (byte-copied, base bd5bcd09):
- KNOWN-LIMITATIONS.md:82:5. **The published bundle has declared ceilings, and a whole-file publish predicted above
- KNOWN-LIMITATIONS.md:97:6. **That prediction does not cover every ceiling.** `MAX_RESIDENT_BYTES` is checked at **no** stage:
- KNOWN-LIMITATIONS.md:113:8. **A filter is never part of what is published.** The bundle format cannot record a row filter, so the app does not send one. With a filter applied, **Export interactive map…** still exports the current view or the whole file, unfiltered. With **Current view** chosen, the Export section and the approval dialog both show a sentence, marked **[P6 placeholder]**, saying that the bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1). With **Whole dataset** chosen, neither shows it, and the dialog's row-scope line says the whole file, every row the dataset contains. Rows you filtered out of the map are in the bundle. A bundle that carries a filtered subset is `bundle_version` 2 and does not exist yet.
- KNOWN-LIMITATIONS.md:145:12. **A published bundle has to be served to be viewed, and the app does not serve it.** The bundle is
- KNOWN-LIMITATIONS.md:193:16. **In every bundle already published — including every v0.1.0 bundle — the published viewer's
- KNOWN-LIMITATIONS.md:290:21. **A dataset in degrees cannot be published.** The bundled viewer has no degrees path — it renders
- KNOWN-LIMITATIONS.md:362:28. **A `dataset_session_ended` event can be lost, and nothing re-sends it.** The event channel is
- KNOWN-LIMITATIONS.md:370:30. **A publish interrupted by an exit the app does not drain can leave a hidden staging directory
- KNOWN-LIMITATIONS.md:393:32. **A projected, Polygon-only file whose `geometry_types` is an empty list, or is absent, cannot be published, and neither can any file the engine reads as MultiPolygon, as Point or as a line.**
- KNOWN-LIMITATIONS.md:436:**43. A crash leaves the session's filter and style changes on this machine, and nothing offers them back yet.** While the app runs, each filter you apply and each style change you commit is kept in a file in the app's data folder on this machine: on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS and Linux under `~/.local/share/spatial-ide/sessions` unless `XDG_DATA_HOME` is set. A normal close removes it. If the app crashes or is ended from outside, the file stays, and this version neither offers to recover it nor removes it. It holds the filter text you typed and your style values, at most 32 MiB in each such file, and nothing in the app sends it anywhere. The app keeps one such file for each open of a dataset that has had a filter or style change. A second open of the same file is another open, with a file of its own once it has a change. This version sets no limit on how many files a run makes, so the disk space they take in one run grows with the number of opens that have had a change.
- KNOWN-LIMITATIONS.md:448:47. **A publish is refused when the bundle would contain a local path, your login name, this computer's name or a credential word, and the check is a pattern search, not a proof.** Before the bundle is moved into place, every file it would contain is searched, including the values of the columns your style uses, for:
- KNOWN-LIMITATIONS.md:504:62. **Each project the app saves leaves a folder in this machine's store, and nothing removes it.**

The new line is true: no item 63, and every listed item is present.

**§21a's four categories** (`governance/AUTONOMY.md:315-327`). The change touches none of them:
- **ADR status line or amendment:** no. No ADR file is in the diff.
- **Security posture** (ADR-020/009/021): no. It is an index line of item numbers in a module README.
- **Data plane or wire:** no. Nothing under `protocol/skp/**` and no MCP surface.
- **Stated guarantee or invariant, or a property under test:** no. The line is a list of references. A grep over `*.{mjs,js,ts,rs,yml,yaml,json}` for `Declared limits` hits only `governance/PLAN.yaml:5603` and `state/gate-log.json:764`, both prose. Under scripts/.github and the module trees, the only other hits are `kernel/PERMISSION-BOUNDARY.md:298` and `kernel/tests/first_batch_factorial.rs:691`, both unrelated phrases. No script or test reads this line. The drop records a withdrawal already ruled (ADV-2026-11-14-17 item 5) and merged with #318.
- **Size:** 2 lines in 1 file, far under §21c.

## Check 3, the commit

```
4533983a1aeddf78ba98d2841cc56f1ada80a10a
Christopher Donini
2026-11-15T01:07:36+01:00
docs: kernel README Declared limits line drops 63 (second-open-history-before-1c-step-3, Amendment 3 item 6)

The one line replaced is the Declared limits line of the owner's index in
kernel/README.md. Its replacement is byte-copied by script from Amendment 3
item 6 of governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md
(ADV-2026-11-14-19 item 6): it drops 63 and changes no other number. No other
line and no other file changes.

Route: ADV-2026-11-15-01 (a one-line change, no new form). Who makes it:
ADV-2026-11-15-02, which replaces item 2 (b) of the first: a worker makes the
change in place of lead-data, which has no shell and no Edit.

Co-Authored-By: Claude Sonnet 5.5 <<email>>
Claude-Session: https://claude.ai/code/session_01JeU7h98xrTorztiep3Zgmg
Signed-off-by: Christopher Donini <<email>>
```
rc=0. The body names Amendment 3 item 6, ADV-2026-11-15-01 and ADV-2026-11-15-02. `grep -c '^Signed-off-by:'` gives 1. Its parent is bd5bcd09da885661266b3b7b46b707b3b46cb5fc, and it is the only commit in bd5bcd09..head.

## Check 4, rule (00)

```
[{"headRefName":"cut/kernel-readme-declared-limits-drop-63","isDraft":true,"number":322}]
```
rc=0.

| Branch | origin tip | Files (`git diff --name-only origin/main...origin/<branch>`, rc=0) | Exact `kernel/README.md` line |
|---|---|---|---|
| `cut/port-2-macos-l1-and-app-dirs` | 83d2ecef8dba33017e47310d7fab8e2be5ee5123 | 15: `.github/workflows/product-ci-rust.yml`, `KNOWN-LIMITATIONS.md`, `engine/src/app_dirs.rs`, `engine/src/lib.rs`, `engine/src/lod.rs`, four `engine/tests/lod_tier_*.rs`, `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, `kernel/tests/app_data_dir_resolution.rs`, `kernel/tests/case_policy_volume.rs`, `scripts/plan/cfg-boundary.mjs`, `scripts/plan/cfg-boundary.test.mjs` | 0 |
| `cut/b1-shell-half-pr-b` | 31cf0e22713e7e3264ed843425ef3686775d7e47 | 49: `frontends/shell/src/**`, `renderer/style-ts/src/style.ts`, `renderer/tests/data/style-agreement.json`, `renderer/tests/style_agreement.rs` | 0 |

Neither branch names `kernel/README.md`.

Port-2 does edit `KNOWN-LIMITATIONS.md`. Its `-U0` hunks are at lines 30, 32 and 400, and the only item-start line it changes is item 43's, which it rewords and keeps numbered 43. So it removes or renumbers none of the twelve listed items, and the line stays true after it merges.

## Check 5, the worker's departure

I read `<S>/brief-krl.md` (5233 bytes, sha256 7942063223db8b2e5f2f31be52d9bc84c31b4d5e181322a4932b078d0e116e45).

The re-run changed nothing the gate rests on:
- The first call failed in git context resolution ("not a git repository"), so it returned no PR list. The re-run from the worktree was the first and only S0 result.
- That S0 was vacuous for the two branches ADV-2026-11-15-01 item 4 (a) names. The worker's S0 checks "each open PR's branch", and neither port-2 nor PR B is an open PR: check 4's list holds #322 alone. With `[]`, its per-branch loop checked nothing.
- The gate's rule (00) proof is check 4, run here against both named branches. Neither names `kernel/README.md`.

The departure is still real. The brief's stop rules name "a run repeated or a retry added", so the worker should have stopped and reported, and its "Departures from the brief: none" is untrue. That is finding N1 below.

## Check 6, readiness

Run from the worktree:
- `node scripts/plan/verify-cites.mjs` (tool at 6f29ce6062b72cef23782d87ccbae207d967187f): rc=0. `verify:cites PASS — every rooted (in-tree) path:line reference across 3055 file(s) resolves. (197 loose reference(s) advised above.)`
- `node scripts/plan/verify-quotes.mjs` (tool at d8369ef8425d2516e36a4aa876530507ce136958), inside the hold: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 …` then `MACHINE_RELEASED project=SpatialIDE …`. The chain exited 0, and since it ends `exit $rc`, verify-quotes rc=0. The harness moved the call to the background after 180 s, and I waited for its completion notice without starting a second copy. Output: `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 933 ruling cites resolved, 0 ruling-cite errors.`
- `node scripts/hooks/profile-path-scan.mjs` (tool at 7680dc970d5aaa2a0752d188c36a0d160992d972):
  - The brief's form `--range bd5bcd09da885661266b3b7b46b707b3b46cb5fc..HEAD`: rc=2, `profile-path-scan: range not computable` / `aborted`. The script does take `--range`, but as two arguments, `--range <base> <head>` (its line 12, and line 518 aborts unless there are exactly two).
  - So I ran the script's own form once, `--range bd5bcd09da885661266b3b7b46b707b3b46cb5fc HEAD`: rc=0, `profile-path-scan: range read 1 commits, 1 added lines, 0 path names` / `profile-path-scan: clean`. This is a different command, not a retry of the first.

**CI.** `gh pr checks 322` read at `2026-11-15T00:32:06Z` gave rc=0, and all 12 rows pass. Each of these appears twice, once in each of two run sets:
- `L1 portable correctness · cargo test --workspace (ubuntu-24.04)` (8m6s, 6m58s)
- `cargo test --workspace (windows-latest)` (16m59s, 20m16s)
- `ported-notices`
- `tauri build (NSIS, build-only, no signing)`
- `typecheck · build · vitest · cargo test`

These appear once: `every commit is signed off` (9s) and `no profile path in the range` (13s).

An earlier read at 2026-11-15T00:24:01Z gave rc=8 with both Windows rows pending.

There are no Governance CI or Rust fmt rows, and that is expected: their `paths:` filters (`.github/workflows/governance-ci.yml`, `.github/workflows/rust-fmt.yml`) do not match `kernel/README.md`. The local verify-cites and verify-quotes runs above stand in for Governance CI.

## Findings

**Correctness:** none. **Evidence:** none.

**N1** — not blocking; record (Documentation under the proportional-gates rule), must-fix before the merge. The worker's report says "Departures from the brief: none", but it repeated `gh pr list` after a failed first call, which its brief's stop rules name ("a run repeated or a retry added"). It does not change the gate (check 5). The #318 node's closing record, or the PR body, should name the departure and that rule (00) rests on this gate's check 4, not on the worker's S0.

**N2** — not blocking; record, for the custodian's brief. Check 6's `--range <base>..HEAD` form is not one this tool (at 7680dc97) accepts; it takes `--range <base> <head>`. The two-argument run is clean.

**N3** — not blocking; record. As written, the worker brief's S0 ("each open PR's branch") could not cover ADV-2026-11-15-01 item 4 (a)'s two branches, which are not open PRs. Check 4 covers them here.

No replacement words are given (the brief's rule: findings go to the advisor). Neither ruling's words are the human's, and no text quoted here is attributed to the human.

Scratch files are under `<S>`, all named `krlr-*`. No tracked file was changed.
