Reviewed: PR #226 at 16dd59f1275ed110333f6ceed38bee9b1dee975c (base fbbffe89)
Verdict: PASS WITH NOTES (cut/search-ignore-historical @ 16dd59f1275ed110333f6ceed38bee9b1dee975c)

There are no Correctness or Evidence findings. There is one Documentation finding, to fix before the merge. I changed nothing on any branch. `C:/dev/wt/sih` is as I found it: on cut/search-ignore-historical at 16dd59f1, porcelain empty, `--ignored` empty, no file newer than my first scratch file. The two worktrees I added, `C:/dev/wt/gate226` and `C:/dev/wt/sih-m0`, have been removed.

## Correctness
None.
- Seams: `measure-reads.mjs` imports `extractSessionContinuityBlock` from `scripts/hooks/session-resume.mjs` and `parseSessionContinuity` from `scripts/hooks/precompact-flush.mjs`. I read both at the head. Both are exported, and the script uses the shapes they actually return (a string or null; `{ flushedAt, tip, block }` or null).
- T1 starts from the real shape: it runs the real hook over the real `state/CUT-STATE.md` and compares the bytes.
- Refusal paths: every one throws before any stdout is written.
- `ls-tree -l -z` parsing handles size padding and unquoted paths.
- No new exported item. The script is a CLI whose consumers are the human-ordered M-1/M-2 runs and the after-C run.

## Evidence
None. Every figure, digest, mutation failure and observation the records claim reproduced at the head or at M0 (below).

## Documentation (must fix before the merge; not the human's wording; applied with no re-gate, listed in the PR body)
- **D-1.** The form's Amendment 2 item 4 (on main, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`, Amendment 2 item 4) says "one comment line in the test file passes 100 columns".
  - What is wrong: at 16dd59f1, counted by code point with node, five comment lines pass 100 columns:
    - `scripts/plan/measure-reads.test.mjs` lines 1 (109), 2 (109), 112 (134) and 126 (107);
    - `scripts/plan/measure-reads.mjs` line 6 (104).
  - 23 code lines also pass 100. No width rule binds `.mjs` here (no prettier or editorconfig in the tree), so the code is fine and only the record's count is wrong.
  - Fix: the form is append-only, so add one correction row in the closing amendment (or a pre-merge amendment), class 3. Words: "Amendment 2 item 4's count of lines past 100 columns is corrected: at 16dd59f1275ed110333f6ceed38bee9b1dee975c, five comment lines pass 100 columns, `scripts/plan/measure-reads.test.mjs` lines 1, 2, 112 and 126 and `scripts/plan/measure-reads.mjs` line 6, by the PR #226 reviewer gate report."
  - Clause check:
    - "five comment lines": node code-point scan, exit 0, lists exactly those five as comment lines.
    - The line numbers and lengths: the same scan, which agrees with an awk length pass.
    - "at 16dd59f1": both files are byte-identical between S1 and the head (script sha256 7b2d33db…92e1 at both; S4 touches only AUTONOMY.md).

Notes (no change asked):
- (a) The worker's S1–S3 report abbreviates some rows. O2 reads "same, path ...\state", O4 "`Found 1 file` that path", O7 "same single file". On their own those rows do not meet §8 item 5. §4 makes the reviewer's rows the observations of record, and they are given in full below. The closing amendment should cite this report's rows.
- (b) The same report's T1-name remark (its line 14, "except that T1's reads…") is garbled. All seven test names equal the form's §4 names byte for byte (diff exit 0).
- (c) §32's W says "A Grep call over the whole tree … does not reach it". That is false for a hidden folder (O6 reaches one). However, §32's last paragraph defines the excluded paths as `.ignore`'s five lines, and H1 states the hidden-folder difference, so I read no untrue limit claim and raise no finding.

## Observations of record
All at commit 16dd59f1275ed110333f6ceed38bee9b1dee975c in `C:/dev/wt/sih`, clean. `claude --version` first line: `2.1.300 (Claude Code)`. `rg --version` first line: `ripgrep 15.2.0`. One row per call.

**P0** (two Bash calls)
- `git grep -lE "SIP-DRAFTS-[q]7x2|SIP-HIDDEN-[k]4m9"`: rc 0, printed `.cut-archive/search-ignore-probe.md` and `state/drafts/search-ignore-probe.md`.
- `git status --porcelain --untracked-files=all`: rc 0, 0 bytes.
- P0 holds.

**O1–O7 (Grep)**
- O1: `{"pattern":"SIP-DRAFTS-[q]7x2","path":"C:\\dev\\wt\\sih","output_mode":"files_with_matches"}` → `No files found`. Predicted: no files. Match.
- O2: same call, `"path":"C:\\dev\\wt\\sih\\state"` → `No files found`. Match.
- O3: same call, `"path":"C:\\dev\\wt\\sih\\state\\drafts"` → `Found 1 file` / `C:\dev\wt\sih\state\drafts\search-ignore-probe.md`. Match.
- O4: same call, `"path":"C:\\dev\\wt\\sih\\state\\drafts\\search-ignore-probe.md"` → `Found 1 file` / `C:\dev\wt\sih\state\drafts\search-ignore-probe.md`. Match.
- O5: O1 plus `"glob":"state/drafts/**"` → `No files found`. Match.
- O6: `{"pattern":"SIP-HIDDEN-[k]4m9","path":"C:\\dev\\wt\\sih","output_mode":"files_with_matches"}` → `Found 1 file` / `C:\dev\wt\sih\.cut-archive\search-ignore-probe.md`. Match.
- O7: O6 with `"path":"C:\\dev\\wt\\sih\\.cut-archive"` → `Found 1 file` / `C:\dev\wt\sih\.cut-archive\search-ignore-probe.md`. Match.

**O8–O11 (Bash)**
- O8: `cd C:/dev/wt/sih && rg -l "SIP-DRAFTS-[q]7x2"; echo "exit=$?"` → `exit=1`. Match.
- O9: `cd C:/dev/wt/sih && rg -l --no-ignore "SIP-DRAFTS-[q]7x2" state/drafts; echo "exit=$?"` → `state/drafts\search-ignore-probe.md` / `exit=0`. Match.
- O10: `cd C:/dev/wt/sih && rg -l "SIP-HIDDEN-[k]4m9"; echo "exit=$?"` → `exit=1`. Match.
- O11: `cd C:/dev/wt/sih && rg -l --no-ignore "SIP-HIDDEN-[k]4m9" .cut-archive; echo "exit=$?"` → `.cut-archive\search-ignore-probe.md` / `exit=0`. Match.

**O12 (Read)** `{"file_path":"C:\\dev\\wt\\sih\\state\\drafts\\search-ignore-probe.md"}` →
```
1	This file is the drafts probe of the PLAN node governance-search-ignore-historical; searches for its token show which tools reach state/drafts/.
2	
3	SIP-DRAFTS-[q]7x2
4	
```
I wrote line 3 in its bracketed form; the result held the token joined. Predicted: the content holds the token. Match.

**O13 (Glob)** `{"pattern":"**/search-ignore-probe.md","path":"C:\\dev\\wt\\sih"}` → `C:\dev\wt\sih\state\drafts\search-ignore-probe.md` / `C:\dev\wt\sih\.cut-archive\search-ignore-probe.md`. The drafts probe was predicted, so this matches. The hidden probe is also listed; recorded, not predicted.

**O14 (Glob)** `{"pattern":"*","path":"C:\\dev\\wt\\sih\\state\\drafts"}` → verbatim, 100 paths and then the truncation line:
```
C:\dev\wt\sih\state\drafts\a2-1-p0\A2-1-PREREGISTRATION.draft.md
C:\dev\wt\sih\state\drafts\a2-1-p0\covering-output.txt
C:\dev\wt\sih\state\drafts\a2-1-p0\covering-probe.rs.txt
C:\dev\wt\sih\state\drafts\a2-1-p0\extra-output.txt
C:\dev\wt\sih\state\drafts\a2-1-p0\extra-probe.rs.txt
C:\dev\wt\sih\state\drafts\a2-1-p0\p0-output.txt
C:\dev\wt\sih\state\drafts\a2-1-p0\probe.rs.txt
C:\dev\wt\sih\state\drafts\adr-021-note-2026-10-03-rendered.md
C:\dev\wt\sih\state\drafts\b1-amendment-5.draft.md
C:\dev\wt\sih\state\drafts\b1-amendment-9.draft.md
C:\dev\wt\sih\state\drafts\b1-p0\analysis\analyze.py
C:\dev\wt\sih\state\drafts\b1-p0\B1-P0-AND-PROPOSAL.md
C:\dev\wt\sih\state\drafts\b1-p0\analysis\compact.py
C:\dev\wt\sih\state\drafts\b1-p0\analysis\counts.py
C:\dev\wt\sih\state\drafts\b1-p0\analysis\counts.txt
C:\dev\wt\sih\state\drafts\b1-p0\analysis\special.py
C:\dev\wt\sih\state\drafts\b1-p0\discriminators.rs.txt
C:\dev\wt\sih\state\drafts\b1-p0\discriminators.txt
C:\dev\wt\sih\state\drafts\b1-p0\matrices.txt
C:\dev\wt\sih\state\drafts\b1-p0\o2-discriminator.txt
C:\dev\wt\sih\state\drafts\b1-p0\probe.rs.txt
C:\dev\wt\sih\state\drafts\briefA-P3-digest.md
C:\dev\wt\sih\state\drafts\briefA-digest.md
C:\dev\wt\sih\state\drafts\corpus-amendment-1.draft.md
C:\dev\wt\sih\state\drafts\corpus-amendment-2.draft.md
C:\dev\wt\sih\state\drafts\corpus-amendment-3.draft.md
C:\dev\wt\sih\state\drafts\covering-names-missing-column-owners-index-update.md
C:\dev\wt\sih\state\drafts\covering-names-missing-column-p0\p0-output.txt
C:\dev\wt\sih\state\drafts\covering-names-missing-column-p0\p0-test.rs.txt
C:\dev\wt\sih\state\drafts\decision-notes\code-signing-options.md
C:\dev\wt\sih\state\drafts\decision-notes\repo-description-and-topics.md
C:\dev\wt\sih\state\drafts\decision-notes\signpath-evaluation.md
C:\dev\wt\sih\state\drafts\decision-notes\static-crt-licence-note.md
C:\dev\wt\sih\state\drafts\design\LAYER-MODEL-DECISIONS-2026-09-28.md
C:\dev\wt\sih\state\drafts\design\RESEARCH-BATCHES-08-10.md
C:\dev\wt\sih\state\drafts\design\RESEARCH-BATCHES-11-13.md
C:\dev\wt\sih\state\drafts\design\SPATIAL-IDE-DESIGN-NOTEBOOK.md
C:\dev\wt\sih\state\drafts\design\map-studio-v7-codex.html
C:\dev\wt\sih\state\drafts\duckdb-parquet-geometry-probe\probe-output.txt
C:\dev\wt\sih\state\drafts\duckdb-parquet-geometry-probe\probe-test.rs.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\m1-alone-801-run1.log.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\m1-alone-801-run2.log.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\README.md
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\m1-apply.mjs.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\m1-only.sh.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\solo.sh.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\window-1-hold-output.txt
C:\dev\wt\sih\state\drafts\e2e-hover-establishing-read-stale-m1-alone\window-2-hold-output.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-console-alone\console-alone-800.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-console-alone\README.md
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\README.md
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\reaim-solo-h.sh.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wa-admission-2.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wa-regression-1.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wa-source-changed-3.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wb-console-1.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wb-console-2.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wb-console-3.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wb-console-4.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\wb-console-5.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\window-a-hold-output.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\README.md
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs-h\window-b-hold-output.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\reaim-solo.sh.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\w2-admission.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\w2-regression.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\w2-source-changed.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\w3-console-run3.log.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\window-2-hold-output.txt
C:\dev\wt\sih\state\drafts\e2e-stale-expectations-reaim-solo-runs\window-3-hold-output.txt
C:\dev\wt\sih\state\drafts\evidence-recorder-v0-install-sight.md
C:\dev\wt\sih\state\drafts\exposure-amendment-4.draft.md
C:\dev\wt\sih\state\drafts\exposure-amendment-7.draft.md
C:\dev\wt\sih\state\drafts\exposure-profile-paths-prereg.draft.md
C:\dev\wt\sih\state\drafts\github-release-body-v0.1.0.md
C:\dev\wt\sih\state\drafts\guardian-v0-install-sight.md
C:\dev\wt\sih\state\drafts\kernel-generation-close-races-prereg.draft.md
C:\dev\wt\sih\state\drafts\map-refill-console-base-solo-2026-10-11\README.md
C:\dev\wt\sih\state\drafts\map-refill-console-base-solo-2026-10-11\console-solo-base.log.txt
C:\dev\wt\sih\state\drafts\map-refill-console-base-solo-2026-10-11\hold-output.txt
C:\dev\wt\sih\state\drafts\notice-determinism-alone-2026-10-09\notice-determinism-alone.log.txt
C:\dev\wt\sih\state\drafts\notice-determinism-alone-2026-10-09\README.md
C:\dev\wt\sih\state\drafts\part-m-prep-pack.md
C:\dev\wt\sih\state\drafts\post-tag\DRAFT-1-review-loop-amendment.md
C:\dev\wt\sih\state\drafts\post-tag\DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md
C:\dev\wt\sih\state\drafts\post-tag\DRAFT-3-BRIEF-B-recipe-replay-publish.md
C:\dev\wt\sih\state\drafts\post-tag\adr-032-problem-statement.draft.md
C:\dev\wt\sih\state\drafts\post-tag\DRAFT-4-landing-page-design.md
C:\dev\wt\sih\state\drafts\post-tag\architect-consult-adr-029-operation-lifecycle.md
C:\dev\wt\sih\state\drafts\post-tag\architect-consult-adr-032.md
C:\dev\wt\sih\state\drafts\post-tag\architect-consult-b1-adr-004-data-plane-review.md
C:\dev\wt\sih\state\drafts\post-tag\architect-consult-b1-adr-023-decision.md
C:\dev\wt\sih\state\drafts\post-tag\architect-consult-lod-47-66b-ordering.md
C:\dev\wt\sih\state\drafts\post-tag\entry-47-repick-brief.draft.md
C:\dev\wt\sih\state\drafts\post-tag\entry-66b-geometric-protection-brief.draft.md
C:\dev\wt\sih\state\drafts\post-tag\lod-brief-revised.draft.md
C:\dev\wt\sih\state\drafts\questions-2026-10-03-rounds-43-44.md
C:\dev\wt\sih\state\drafts\round-33-node5-fix-choice.md
C:\dev\wt\sih\state\drafts\sitting-2026-09-14-prep-pack.md
C:\dev\wt\sih\state\drafts\skp-drained-stream-helper-post-check-race-p1-alone\README.md
(Showing 100 of 157 matching files; 57 more are not listed. Narrow the pattern or path to see the rest.)
```
The probe is not among the 100 shown, so O14 alone does not show it. This is the same as the worker's row.

**§5 clause table against these rows** (§32 at the head)
| Clause in §32 | Observation | Shows it? |
|---|---|---|
| W: give the Grep tool that folder as its path | O3 | yes |
| W: or that file as its path | O4 | yes |
| W: `rg --no-ignore` from Bash with that folder as its path | O9, O11 | yes |
| W: Read the file by its name | O12 | yes |
| W: a Grep call over the whole tree does not reach it | O1 (also O5) | yes |
| W: or over a folder above the excluded one | O2 | yes |
| W: the Glob tool still lists the files there by name | O13 (O14 truncated) | yes, by O13, as §5 allows |
| H1: a tree-wide search excludes the paths in .ignore | O1, O8 | yes |
| H1: a tree-wide `rg` from Bash skips hidden folders such as .cut-archive/ | O10 | yes |
| H1: the Grep tool does not | O6 | yes |

No clause lands against its observation (§8 item 6), and no invalidator fires (I1 and I3 included).

## Mutations observed
Run in the detached worktree `C:/dev/wt/gate226` at 16dd59f1. Each mutation was applied alone by a scratch script with a single-anchor check, then `node --test scripts/plan/measure-reads.test.mjs` was run (rc 1 each time), then `git checkout -- scripts/plan/measure-reads.mjs` (rc 0), then porcelain was taken (rc 0, 0 bytes).
- M1: part 1 as raw lines from `## SESSION-CONTINUITY` to the line before `## Ledger`.
  - Failed: `measure-reads: the routine block is the bytes session-resume.mjs prints for the real ledger`, at test line 65, actual 19112, expected 19111. Pass 6, fail 1.
  - My first M1 apply was malformed: the Bash tool collapsed `\\n`, which made a syntax error and failed all 7 tests. That run is void. It was re-applied with `String.fromCharCode(10)` and re-run as above.
- M2: `>=` made `>`. Failed: `…keeps the entries dated within 168 hours before flushed_at, the boundary included`, at line 81 (boundary entry absent). Pass 6, fail 1.
- M3: any line starting `- ` starts an entry. Failed: `…an undated top-level bullet and indented lines belong to the dated entry above them`, at line 106, message `- undated bullet under the kept entry →`. Pass 6, fail 1.
- M4: the pending section ends at any `^#{1,6}\s`. Failed: `…the pending part runs from ## Pending to the next level-2 heading and keeps deeper headings`, at line 119. Pass 6, fail 1.
- M5: `must` returns `value ?? ''`. Failed: `…a missing part refuses with exit 2 and an empty stdout`, at line 140, case `no ledger heading`, actual 0, expected 2. Pass 6, fail 1.
- M6: `bytes` returns `s.length`. Failed: `…the routine total is UTF-8 bytes, not characters`, at line 155, 189 !== 199. T1 also failed (19109 vs 19111). Pass 5, fail 2.
- M7: a path not in the tree is skipped. Failed: `…the corpus sums committed sizes of the listed files and refuses a path not in the tree`, at line 173, actual 0, expected 2. Pass 6, fail 1.

Each failure is the one the RECORDED MUTATION comment names. M1 and M6 give the same figures as the worker's report.

## G, D1, M-1, M-2, AUTONOMY, §7, CI
**G** at the head: `git grep -nIwE "rg|ripgrep" -- . ":(exclude)*.md" ":(exclude)*.txt"`, rc 0, 14 matches, zero invocations.
- `engine/src/layout.rs:346`, `:347`: format argument `rg`.
- `frontends/shell/e2e/pan-anchor.mjs:176`: callback parameter.
- `scripts/plan/measure-reads.mjs:7`, `:9`: comments.
- `spikes/lod-feasibility/rust/src/main.rs:170`, `:171`, `:226`, `:227`, `:289`, `:294`, `:419`, `:423`: loop variable.

**D1** at the head, in sih. The stdout sha256 of each checker is identical to the S2/S3 prefixes and suffixes the worker recorded.
- `verify.mjs` rc 0, sha256 52ce63b748956cd853a4a45cfecfaea70dda5d2e662df0846d9955c650941dfe.
- `verify-cites.mjs` rc 0, sha256 e75bc030707104403a3bab36d416942dfe5d2a76e767e4b5bdf91ceedf9a1e78.
- `verify-quotes.mjs` rc 0, sha256 31245fcbd8b4f9f150eaa21a5e0940d3471819055c91d011fe0f1e56a0455e7e.
- `verify-test-claims.mjs` rc 0, sha256 c76d6851e5e6622d97cda500e9fe18d33091176185e16b1839bcad6bbf2a9e4d.
- `verify-mutation.mjs` rc 0, sha256 87b267a2103a8a9fdd292fef0ba1fe263db37a3f62b7f25a594589963d15b2c5.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: tests 464, pass 464, fail 0.
  - It ran inside a shared hold (`<M> hold shared … -Minutes 10 -MaxWaitMinutes 6`), which was granted and then released.
  - The call's exit came back as 0: the tool reported no error code. The hold's line shape leaves no room for an echo.

**M-1** at M0, in sih: `node scripts/plan/measure-reads.mjs routine fbbffe89ecf693eabfe95448007ae0444e305d19`, rc 0.
- stderr: `measure-reads: routine fbbffe89ecf693eabfe95448007ae0444e305d19 block=19111 ledger=16457 entries=12 window_from=2026-10-09T21:53:31.000Z outside_window=618 pending=670700 total=706273`.
- `wc -c` of stdout is 706273, equal to total.
- Output sha256 7933c84012f0de54649f985e95910d1c399f8d0387171af538d58ff8ece552c2.
- Identical to the S1–S3 report.

**M-2** at M0, in `C:/dev/wt/sih-m0`:
- `git worktree add --detach … fbbffe89…`: rc 0. Porcelain rc 0, 0 bytes.
- Environment facts:
  - `rg --version` first line: `ripgrep 15.2.0`.
  - RIPGREP_CONFIG_PATH is unset.
  - core.excludesFile is not set: local, global and system each rc 1.
  - info/exclude is present, 541 bytes, sha256 321dffcb77a68a6c079d35da12944866b895b4cc9fb3b1fae72fe9468c7eafeb.
  - No `.ignore`, `.rgignore` or `.gitignore` in C:/dev/wt or C:/dev.
- `rg --files | node C:/dev/wt/sih/scripts/plan/measure-reads.mjs corpus fbbffe89…`: PIPESTATUS rg=0, node=0.
  - stdout `measure-reads: corpus fbbffe89ecf693eabfe95448007ae0444e305d19 files=2308 bytes=42655588`, sha256 fedf1cb39e8b1a6012fbdfde22a7134afe8947bf3cdeffcc4879e73847329428.
  - stderr `tracked_not_listed=91`, sha256 02263ecc88eaafa6dd76cd13cdfab3c78c4cb18bd9989c0784696d5f66f6bb37.
- Every figure, line and digest equals the S1–S3 report.
- Worktree removed: rc 0, absent from `git worktree list`.

**Script identity:** sha256 of `measure-reads.mjs` at the head and of `git show b1fa4319:…` are both 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1 (§8 item 3).

**AUTONOMY.md**
- §8 item 2's `cmp -n "$(git cat-file -s M0:AUTONOMY.md)" <(git show M0:…) <(git show 16dd59f1:…)`: rc 0. Sizes are 84418 at M0 and 86251 at the head.
- My node script, rc 0:
  - The M0 bytes are an exact prefix, and M0 ends with LF.
  - The tail is 1833 bytes, sha256 1d9b2fa8053bf73ca433a20ca8d9521c721fd4b3b0da8cd33b830ca933a1d4ad.
  - The tail equals LF + the 11 lines inside Amendment 4's last `~~~markdown` fence (form on main, fence at lines 317–329, identical at 49a15bf6) + LF. So there is one empty line before the section and a final newline.
- Rule pin: `git show fbbffe89:state/directives/2026-10-14-…-decisions-pending.md | sed -n '23p' | sha256sum` gives 8bd8015eca14482708510c7f25b68b6d3af9d817837db52b37f9f821cb3393fd, as pinned.
- The rule line is the form's H1 sentence (contained verbatim in the form's H1 item) followed by the remainder of line 23's quoted text after its first sentence. Equality is true, and the quote's first sentence is confirmed as the human's original first sentence.
- The W paragraph ends with the form's §2 item 4 W text, byte for byte.

**§8 items 1–11 at the head**
1. `.ignore` holds exactly the five lines, LF, 87 bytes.
2. cmp rc 0.
3. Script sha256 equal to S1's.
4. The figures carry the rev, the script's sha256, the environment facts and the second run (PR body).
5. Met by this report's rows (see note (a)).
6. No clause contradicted.
7. P0 held.
8. D1 identical.
9. G shows no invocation.
10. No record calls either figure a token count or a context size; the script header says "never tokens".
11. The diff has no `DECISIONS-PENDING.md:<n>` cite and no profile path (grep rc 1).

**§7:** the form's counting command over M0...16dd59f1 (numstat rc 0) gives 331 lines over 6 files, within 380 and 6. Per file, each within its budget: `.cut-archive` probe 3, `.ignore` 5, AUTONOMY.md 12, script 131, test 177, drafts probe 3.

**Merge:** `git merge-tree --write-tree origin/main 16dd59f1` rc 0, no conflict. `git grep -lE` of the bracketed patterns on origin/main: rc 1, no joined token on main.

**CI:** `gh pr checks 226` rc 0. All pass, every run at head 16dd59f1275ed110333f6ceed38bee9b1dee975c (`gh run list`):
- cfg boundary
- every commit is signed off
- no profile path in the range
- ported-notices ×2
- test · verify:plan · queue/site drift

## Every command and its exit code
- `git fetch origin` 0.
- PR read: `gh pr view 226` 0; `gh pr checks 226` 0; `gh run list` 0.
- P0 in sih: git grep 0, porcelain 0; `claude --version` 0; `rg --version` 0 (twice, sih and sih-m0).
- O8–O11 Bash calls 0, with internal exit= values as recorded.
- G 0; the five D1 checkers 0 each; the suite in its hold 0.
- `git worktree add` gate226 0. Mutations M1–M7: apply 0, test 1, revert 0, porcelain 0 each (plus the void first M1). gate226 porcelain 0; `git worktree remove` 0.
- M-1 0. sih-m0: add 0, porcelain 0, M-2 PIPESTATUS 0/0, `git worktree remove` 0.
- AUTONOMY: both cmp 0; check script 0.
- numstat 0; merge-tree 0; profile/DP grep 1 (no match); main token grep 1 (no match); column scan 0.
- sih final: porcelain 0 (0 bytes), `--ignored` 0 (0 lines).

Relevant paths:
- C:/dev/spatial-ide/scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md
- C:/dev/wt/sih/scripts/plan/measure-reads.mjs
- C:/dev/wt/sih/scripts/plan/measure-reads.test.mjs
- C:/dev/wt/sih/AUTONOMY.md
- C:/dev/wt/sih/.ignore
- C:/dev/spatial-ide/state/consults/2026-10-16-governance-search-ignore-historical-s1-s3-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-17-governance-search-ignore-historical-s4-worker-report.md
