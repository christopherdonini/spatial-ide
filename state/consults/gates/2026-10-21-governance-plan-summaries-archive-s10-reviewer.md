Reviewed: PR #237 at 120cd55dadd68ab4670776f6882b3e028624edf2 (S9 e0173891), the scoped S10 pass, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/plan-summaries-archive @ 120cd55dadd68ab4670776f6882b3e028624edf2. Worktree C:/dev/wt/psa: porcelain empty before and after every check. I made no write outside my scratch folder and created no worktree.

## Findings

**Correctness:** none.

**Evidence:** none blocking. One gap from the S10 report is now closed. That report (step 6, the CI-glob bullet) never saw the `node --test` exit code printed. I ran the hold with an `echo node_test_rc=$rc` before the release, and it printed `node_test_rc=0` at S10.

**Documentation (note, nothing to reword; to confirm at the final main merge):**
- N1. The sheet at S10 (`state/drafts/plan-summaries-d-obligations.md`, line 3) names `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`. That file is not in the S10 tree: `git cat-file -e 120cd55d:<that path>` gave 128. It is on origin/main (rc 0).
- N1, continued. The archive's `source` commit ab9a4b4f is likewise a main commit that is not yet in the branch's history. 54d07268 is its ancestor (rc 0), and its PLAN.yaml blob is S9's 83abe8bb.
- N1, fix. Both resolve through the main merge that Amendment 9 item 3 already requires before the click. After that merge, run `git cat-file -e HEAD:<directive path>` and `git merge-base --is-ancestor ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f HEAD`, both expected to give 0. No words to replace.

## O1 and O2 (recorded at 120cd55dadd68ab4670776f6882b3e028624edf2, clean tree; `claude --version`: `2.1.306 (Claude Code)`; `rg --version` first line: `ripgrep 14.1.1 (rev 575938147b)`)

- **O1.** The call was Grep `{"pattern":"id: connection-reuse-recycled-interrupt-flake$","path":"C:\\dev\\wt\\psa\\state\\cut-archive","output_mode":"files_with_matches"}`. It returned, as given:
  ```
  Found 1 file
  C:\dev\wt\psa\state\cut-archive\PLAN-SUMMARIES-2026-10-21.yaml
  ```
  The prediction (the archive) holds.
- **O2.** The same call with `"path":"C:\\dev\\wt\\psa"` returned, as given:
  ```
  Found 1 file
  C:\dev\wt\psa\PLAN.yaml
  ```
  The prediction (PLAN.yaml only) holds. At S10, `.ignore` lists `/state/cut-archive/`.

## What I checked (each command's exit code)

1. **The move, with my own script** (`move.mjs` in my scratch folder; it reads git objects through `git show` and uses the worktree's `parseYamlSubset` and `validatePlan`). rc 0, failures 0.
   - Output: S9 and S10 PLAN.yaml are 5648 lines each; the archive is 203 lines; N = 100 moved; 154 candidates at S9; 54 kept.
   - R1: archive lines 4 onward are `  - id: <id>` plus S9's own summary line, byte for byte, in PLAN.yaml order.
   - R2: each archived string, parsed, equals S9's parsed summary; the archive's keys are exactly id and summary.
   - R3: exactly 100 PLAN.yaml lines differ. Each is a moved node's summary line, and each now reads `    summary: "[archived summary] state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml"`.
   - Parsed S10 nodes equal S9's except the moved summaries; the top-level keys are equal.
   - §8 item 3: every moved node is `done` at S9, and at P (P's PLAN.yaml blob is S9's), with a parsed summary over 300 UTF-8 bytes.
   - Moved bytes by summing over the lines: 291520.
   - I9: no stays row is in the archive.
   - Negative control: a copy with S10's PLAN.yaml swapped for S9's, and one extra kept id. rc 1 with 102 failures, including `R3 diff count 0` and `stays list != kept`.
   - The script's `verifyMove` on the real pair, with each id mapped to its own item's summary line (`vm.mjs`): rc 0, `problems: []`. The diff set equals the moved index set. The pointer is 67 bytes; `isPointer` is true, and so is the §2 item 3 regex.
2. **The sheet.** `git show 120cd55d:state/drafts/plan-summaries-d-obligations.md`: rc 0, sha256 9ed1c66ed6ab64ce5068aedeb91e2601d545a99a9fc2e17835f8b3667075a977, as required.
   - In `move.mjs`: the stays list (54) equals, as a set, the S9 candidates that were not moved (54). The `stays` rows equal the stays list.
   - Every other row's id (100) is in the archive. The sheet's 154 rows are exactly S9's candidates in PLAN.yaml order. Counts: no obligation 88, home 9, not owed 3, stays 54.
   - Additionally (`homes.mjs`, rc 0): the 7 plan homes are not done at S9 (proposed, unscheduled or blocked). Entry 115 sits under `## Pending`. The G0-resolved file's sha256, 202ad248…, holds at S10 and on main. b0032c80 is a commit.
3. **E-P and E-M (c).**
   - `git diff --numstat e0173891 120cd55d -- PLAN.yaml` rc 0: `100 100`.
   - The archive is 203 lines (= 3 + 2·100) and 304005 bytes.
   - `git diff --name-only` rc 0 and `--no-renames --name-status` rc 0: exactly the seven paths (5 M, 2 A). Full numstat rc 0: 630 insertions, 206 deletions.
   - `git cat-file -s` gave 703836 at S9 (rc 0) and 412316 at S10 (rc 0). The difference, 291520, equals the moved bytes.
   - Blobs (`rev-parse`, rc 0): archive 56ba73a1…, PLAN.yaml 83abe8bb… to 841e0527…. 54d07268's and ab9a4b4f's PLAN.yaml are 83abe8bb.
   - Parent of S10 is e0173891 (rc 0). origin/cut/plan-summaries-archive is 120cd55d (rc 0).
4. **D1-b at S10, in C:/dev/wt/psa.** Each output went to a file, and each was compared with the S9 worker's `psas9-*` files by sha256.
   - `verify.mjs --offline`: rc 0; stdout 3da2dd04…, stderr a71b66bd…; equal to S9.
   - `verify-cites.mjs`: rc 0; stdout 5ca0c6c9…, stderr 4ff38cb3… (equal). `diff` of the stdouts gave rc 1, and its only difference is `2132 file(s)` to `2133 file(s)`, the exception Amendment 8 item 1 accepts.
   - `verify-quotes.mjs`: rc 0; a8791ce7… / 4433350f…; equal.
   - `verify-test-claims.mjs`: rc 0; c9fcaeed… / a123ac83…; equal.
   - `verify-mutation.mjs --base 54d072687e79f8cb9a77ca942aa6809dad4e326b --head HEAD`: rc 0; a2e835ad… / 71215bef…; equal.
   - `queue.mjs --check`: rc 0; 8f25d0b0…, empty stderr; equal.
   - `site.mjs --check`: rc 0; 00a50575…, empty stderr; equal.
   - CI globs: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside a shared hold (granted on cores 0-7, then released), with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. rc 0, stderr empty.
   - The counts were extracted by grep (rc 0): tests 527, pass 527, fail 0, cancelled 0, skipped 0, todo 0. `cmp` against S9's counts file gave rc 0; sha256 e086766c….
5. **E-R** (`er.mjs`, rc 0, failures 0).
   - queue.mjs: `CUSTODIAN-QUEUE.json` is deep-equal once plan_hash and generated_at are dropped. `CUSTODIAN-QUEUE.md` differs at line 3 only, the `Generated from` line.
   - site.mjs, index.html: equal once plan_hash and generated_at are normalised; the raw files differ.
   - site.mjs, plan.json: 312 nodes in the same order. 100 moved nodes carry the pointer, with every other field equal; 212 nodes are deep-equal. priorities_approved, lanes and phases are equal. `findMetricViolations` gives 0 at S9 and 0 at S10.
   - buildHealth.mjs: unchanged, and it names no PLAN.yaml, loadPlan or plan.mjs.
   - questions-mirror.mjs: `buildSummary` on round-73 is equal at both revisions.
6. **O1 and O2:** above. `claude --version` rc 0; `rg --version` rc 0.
7. **Amendment 10 against my findings.** Every item 1 figure holds: commit, parent, pushed, archive blob and line count, PLAN.yaml blobs, 100 moved, 291,520 bytes, 54 kept, sheet hash.
   - Item 2 holds: the five checks are equal except cites 2132 to 2133; both `--check` runs exit 0; 527/527 with the counts files equal; verify-mutation with the explicit base equals S9. Its last sentence is about the worker's runs; my own run printed the exit code, 0.
   - Item 3 holds: 100/100, 203 = 3 + 2N, the seven paths, `verifyMove` with no problem, E-R as the table predicts, and 703,836 − 412,316 = 291,520.
   - Item 4 holds: the archive's source is ab9a4b4f; S9's dry-run P was 54d07268 (the S9 report); ab9a4b4f's PLAN.yaml blob is S9's.
   - `git diff --name-only 54d07268 ab9a4b4f -- PLAN.yaml 'CUSTODIAN-QUEUE.*' site/` rc 0, empty. From ab9a4b4f to the current origin/main, the same paths plus `state/cut-archive` and the sheet: rc 0, empty.

Files in my scratch folder (`g3/`): move.mjs, move-neg.mjs, vm.mjs, er.mjs and homes.mjs, with the `r-*.stdout` and `r-*.stderr` files and the outputs named above.
