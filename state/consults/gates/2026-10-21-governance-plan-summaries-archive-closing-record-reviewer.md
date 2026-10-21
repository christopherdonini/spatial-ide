Reviewed: governance D's closing record at main d6a3b9f4241641523906dec4e583941890f95a07, the scoped pass after the merge, reviewer
Verdict: PASS WITH NOTES

All my numbers match Amendment 12 and the record: every commit, blob, hash and figure. The one finding is Documentation. The custodian fixes it in a later amendment.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before this record is final; it goes in a later amendment, because nothing above an amendment is edited)

**Doc-1. Amendment 12's record hash has no `@ <rev>`.**
- **Where:** Amendment 12's header gives the record's `sha256 9f12c428810c1050d780af103bf5b68aa68b5c0c168d5a39643d3fe920ad529f` with no revision.
- **What is wrong:** round 15 (e) requires a hash reference in an append-only record to name an explicit `@ <rev>` at a commit on main. The form's §10 is append-only. This piece already had this defect once: Amendment 4 item 4 fixed it for the sheet hashes of Amendments 2 and 3.
- **The fix:** an item in a later amendment, in these words (not the human's wording):
  "**Amendment 12's record hash** is read @ d6a3b9f4241641523906dec4e583941890f95a07, the commit adding the record and Amendment 12."
- **Clause check:**
  - d6a3b9f4 is on main: `origin/main` = d6a3b9f4241641523906dec4e583941890f95a07 (`git rev-parse`, rc 0).
  - It adds the record: `git log -- <record>` lists d6a3b9f4 alone (rc 0).
  - The hash is the record's at that commit: `git show d6a3b9f4:<record> | sha256sum` = 9f12c428… (rc 0).
  - It adds Amendment 12: the form's numstat from 5a630ed5 to d6a3b9f4 is `17 0`, and `cmp -n` shows a pure append (rc 0).
- **Why a later commit:** the amendment cannot name its own commit, so only a later commit can carry the rev.

## What I checked (each command, then its exit code)

**1. The commits.**
- `git log -1 --format='%H %P %cI' 16b3d360…` (rc 0): parents 6c3795c5257013d5471bacf68d8c7bb6a2006e0b and 6045a6dfc0e092f63192f64a6bafc326cfa5b07c, `%cI` 2026-10-21T14:35:38+02:00.
- 6045a6df's parents are 120cd55d (S10) and 6c3795c5 (rc 0). `merge-base --is-ancestor 120cd55d 16b3d360` rc 0.
- `git log --first-parent 6c3795c5..d6a3b9f4` (rc 0) and `rev-list --ancestry-path 16b3d360..d6a3b9f4` (rc 0) give exactly 16b3d360, then 5a630ed5 (parent 16b3d360, 14:53:41+02:00), then d6a3b9f4 (parent 5a630ed5, 15:03:17+02:00). No main commit sits between them.
- `git diff 16b3d360 5a630ed5 -- PLAN.yaml` (rc 0) changes the node:
  - status in-progress to done;
  - evidence `{branch: cut/plan-summaries-archive}` to `{pr: 237}`;
  - `dates: {opened: 2026-10-20, done: 2026-10-21}`;
  - generation 8 to 9.
- d6a3b9f4 touches only the form (+17), `state/CUT-STATE.md` and the record (`git diff --stat`, rc 0).

**2. The blobs.** `git rev-parse <rev>:<path>`, every call rc 0.
- At 16b3d360 and at 120cd55d: the archive is 56ba73a11869c682f177be816f7c4bc30511b1d1 and PLAN.yaml is 841e0527f16aac1d770a035424ddd52c5526bc03. These are Amendment 12 item 2's ids.
- The archive at the merge has 203 lines; its `source` commit is ab9a4b4f.

**3. The record's hash.** `git show d6a3b9f4:<record> > file` (rc 0), then `sha256sum` (rc 0) = 9f12c428810c1050d780af103bf5b68aa68b5c0c168d5a39643d3fe920ad529f, equal to Amendment 12's.
- The working-tree file gives the same hash.
- The file is LF only (`grep -c` CR = 0), with one final LF.

**4. The figures once more.** I made three detached worktrees under `C:/dev/wt/` (`worktree add`, rc 0 each). Each had an empty porcelain before and after.
- **M-1**, `node scripts/plan/measure-reads.mjs routine 16b3d360…`, run twice, rc 0 and 0.
  - stdout `cmp` rc 0, stderr `cmp` rc 0.
  - `wc -c` 97108 both times.
  - stdout sha256 dc9237bf…f9b4b; stderr sha256 f3c0e70a…1178d.
  - The stderr line is byte-equal to Amendment 12 item 3's line (block=5843 … total=97108).
- **M-2**, `rg --files | node <M-1 worktree>/scripts/plan/measure-reads.mjs corpus 16b3d360…` in the second worktree, run twice, `PIPESTATUS` 0 0 both times.
  - rg stderr was 0 bytes both times; `cmp` stdout rc 0, stderr rc 0.
  - stdout is `measure-reads: corpus 16b3d36045cb3b122bb19baeadbaa22de29e9132 files=2011 bytes=36607014`, sha256 1d8d6e2d…d0f8.
  - stderr is `tracked_not_listed=586`, sha256 2ec3fa59…8462.
- **M-3**, `git cat-file -s 16b3d360:PLAN.yaml`, run twice, rc 0 and 0, `cmp` rc 0: 412316, sha256 b94487c1…2ce9.
- **Environment:**
  - `rg --version` (rc 0), first line: ripgrep 14.1.1 (rev 575938147b).
  - `claude --version` (rc 0): 2.1.306 (Claude Code).
  - node v24.18.1 (rc 0); git version 2.49.0.windows.1 (rc 0).
  - `RIPGREP_CONFIG_PATH` is unset.
  - `core.excludesFile` local, global and system each exit 1.
  - info/exclude is 541 bytes, sha256 321dffcb…afeb.
  - No `.ignore`, `.rgignore` or `.gitignore` in `C:/dev/wt` or `C:/dev`.
  - The M0 values in Amendment 12 item 8 (claude 2.1.305; info/exclude, rg, node and git as now) match the G0 worker report, lines 28, 30 and 32 (`grep`, rc 0).
- **Removal:** `git worktree remove` rc 0 for each of the three. Afterwards `worktree list` shows no g9r entry and the directories are gone.

**5. E-M.**
- **(a):** the archive is in `git ls-tree -r -l 16b3d360` (rc 0). It is not in the merge commit's `rg --files` list (rg rc 0): `grep -c` gives 0, rc 1, and my script gives listed=false. No `state/cut-archive/` path is listed.
- **(b):** PLAN.yaml is listed at M0 (third worktree, rg rc 0, 1986 lines) and at the merge (2011 lines), `grep -cx` 1 and 1.
  - M0's corpus run printed files=1986 bytes=36290933, `tracked_not_listed=573`, `PIPESTATUS` 0 0.
  - Feeding the saved merge list into the script gives output byte-equal to M-2's (`cmp` rc 0).
- **The PLAN.yaml split:** `cat-file -s` at M0 = 695917, at S9 = 703836, at S10 = 412316 (rc 0 each).
  - −283,601 = −291,520 + 7,919.
  - S9's and 54d07268's PLAN.yaml blob is 83abe8bb…; ab9a4b4f and 6c3795c5 have the same blob.
  - `git log 54d07268..6c3795c5 -- PLAN.yaml` gives 0 commits, and the branch's first-parent history from M0 to f54b54ac gives 0 PLAN.yaml commits (rc 0 each).
  - M0..54d07268 has 12 PLAN.yaml commits (rc 0).
- **The table:** my own script over the two lists and both `ls-tree` outputs (rc 0) gives:
  - 1986 to 2011 files, 36,290,933 to 36,607,014 bytes, +316,081;
  - 25 added, 13 changed, 0 gone;
  - 37 paths other than PLAN.yaml, +599,682.
  - A second script (rc 0) compared its 37 rows with the record's table: 0 differing rows. No path listed at both revs has the same size but a different blob.

**6. The script's digest.** `git show 16b3d360:scripts/plan/measure-reads.mjs` (rc 0), then `sha256sum` = 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1, equal to A's S1. The M-1 worktree's file and the file at M0 give the same digest.

**7. The other figures.**
- 5a630ed5's `%cI` matches.
- M-1 at M0, `routine 81c34c8b` (rc 0), gives total=81398 and 81398 bytes, as Amendment 2 item 2 records.
- The form edit in d6a3b9f4 is a pure append (`cmp -n` rc 0).

**What I could not check:**
- The custodian's run window (12:54:55Z to 12:55:08Z) and the claim that its two runs were byte-identical. These come only from its own output. The window is consistent with the commit order: after 5a630ed5 at 12:53:41Z and before d6a3b9f4 at 13:03:17Z.
- Item 6's "the script's moved bytes" 291,520. I checked only the `cat-file -s` difference, not the script's printed figure at S10.

**One thing seen during the pass:** after my worktree removals, the main checkout showed staged changes to PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/CUT-STATE.md` and a new `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`. They were not mine and I did not touch them. All my reads were of named revs, and HEAD was d6a3b9f4 when the pass started.

I made no commit, no push and no edit to any tracked file. My scratch files are the only things I wrote; they are in my session's scratch folder.
