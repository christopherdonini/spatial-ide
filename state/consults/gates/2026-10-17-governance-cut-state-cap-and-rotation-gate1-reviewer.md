Reviewed: PR #229 at c8b78e904ef90c0258bc1bd910a5445b37ad67eb (base 0ff2594e). Branch and commit: cut/cut-state-cap-and-rotation @ c8b78e904ef90c0258bc1bd910a5445b37ad67eb
Verdict: FAIL

The gate fails on one Correctness finding, C-1: a CLI option that only the tests use. The fix is small. Every mutation in §4 failed its named test when I made it again, every pin hash matches, and D1 holds on the reading given below.

## Correctness

**C-1 (blocking; the caller rule, checklist item 8): `--root <dir>` is an option whose only caller is the tests.**
- Where: `scripts/plan/rotate-cut-state.mjs:73-76` (the `let root = REPO_ROOT` default and the `--root` parse). Its only user is `scripts/plan/rotate-cut-state.test.mjs:58` (the `rot` helper).
- The product invocation, `node scripts/plan/rotate-cut-state.mjs` in AUTONOMY §33 (ii) at `AUTONOMY.md:598`, never passes it. A test-only caller does not count, and neither exemption applies: it is not a read-only accessor, and no preregistered consumer exists.
- Precedent: the same rule blocked a test-only injection option by name in `state/consults/gates/2026-09-27-test-claims-landedness-gate1-reviewer.md` (B2).
- Fix (about 4 lines):
  - Drop `--root`. Set the root from `git rev-parse --show-toplevel` run in `process.cwd()`. The documented command only runs from the checkout root, so this is the product's own path. Any other argument still refuses with exit 2.
  - In the test, change `rot` to `spawnSync(process.execPath, [ROTATE], { cwd: dir, encoding: 'utf8' })`.
  - Drop the `export` on `REPO_ROOT` at `rotate-cut-state.mjs:21`; nothing imports it.
- Re-gate: scoped to the two files. Re-run R1 to R9. Under §22's applicability check, MR1 to MR9 carry forward if the diff touches only the root and `rot`.

**C-2 (a claimed guarantee the code does not fully support; wording only; non-blocking under §31 because ordinary use does not reach the gap): `AUTONOMY.md:597`, AUTONOMY §33 (i).**
- The sentence says the refused block "is written whole to a new file". The code writes no file when the temporary folder resolves inside a repository, or when the write fails (`writeRefused`, `scripts/hooks/flush.mjs`, its `catch`).
- Not reachable in ordinary use: it needs TMP/TEMP pointed inside a repository, or a disk or permission failure. Not the human's wording; the worker applies these words, no re-gate.
- Replace "The refused block is written whole to a new file in the folder `spatial-ide-flush-refused` under the operating system's temporary folder, and the refusal names that file's path; this section prints no path." with:
  > The refused block is written whole to a new file in the folder `spatial-ide-flush-refused` under the operating system's temporary folder, and the refusal names that file's path; when that folder resolves inside a repository, or the write fails, no file is written and the refusal gives the reason. This section prints no path.
- Clause check:
  - "whole … new file": `` `${block}\n` `` with flag `wx` (C6; MC6 observed).
  - "under the temporary folder": `path.join(realpathSync.native(os.tmpdir()), 'spatial-ide-flush-refused')`.
  - "names that file's path": the sentence appended to the message (C6).
  - "inside a repository": the checked roots are `REPO_ROOT` and the target's toplevel (C7; MC7 observed).
  - "the write fails … gives the reason": the `catch` returns `no scratch file was written (${e.message})`.
- The PR body's S3 bullet makes the same unconditional statement. Replace "It writes the refused block whole to a scratch file outside the repository and truncates nothing (C1 to C7)." with:
  > It writes the refused block whole to a scratch file outside the repository, or, when the temporary folder resolves inside a repository or the write fails, writes none and says why; it truncates nothing (C1 to C7).
- And in the code comment `scripts/hooks/flush.mjs:43`, replace "(none if that folder is inside a repository)" with "(none if that folder resolves inside a repository or the write fails; the refusal then gives the reason)".

Non-blocking code notes (no action required):
- R1 and R2 compute `today()` in the test, apart from the script's clock, so they can flake across UTC midnight. R5 has the same exposure across Monday 00:00Z. A fix would be to take the date from the staged name and check it is one of the two dates spanning the run.
- `rotate-cut-state.mjs:111-113`: `mkdirSync(state/cut-archive)` runs before the last `rev-parse`. If that call fails, the message says "Nothing was written" but an empty folder stays. It is practically unreachable, because `cat-file -s HEAD:…` has already succeeded.

## Evidence

**E-1 (non-blocking; for the custodian to read against I6): D1's "unchanged by stdout sha256" cannot hold literally for `verify-mutation.mjs`.**
- Its output counts the branch's own new tests: "all 0 new test(s)" at M0, "all 19 new test(s)" at the head.
- That 19 equals exactly the `node --test` rise, which D1's third bullet expects. Every other row is unchanged on its own terms (table below).
- I do not read this as I6. On a literal reading it is I6, which is a STOP for the human, so the closing amendment should state the row as differing by exactly the 19 new tests.

**E-2 (note): `verify-quotes` stdout is the same at M0 and the head (same counts), so the tool did not pick up §33's or P-035's ten marked byte-copies.** The tool is only a floor. I resolved all ten by script; all match (hashes section).

## Documentation (each must be fixed before the merge, no re-gate)

**D-1: §7 overruns not recorded as class 8 (round 25, item 2 (a)).** These per-file budgets in §7 are exceeded, by §7's counting command at c8b78e90:
- `scripts/hooks/hooks.test.mjs`: 24 lines, declared 20.
- `scripts/plan/verify-cites.test.mjs`: 41, declared 40.
- `AUTONOMY.md`: 77, declared 75.

The total, 799 lines over 12 files, is within 960 over 12. The PR body's Size line is true but leaves these out. The worker's report lists the same figures without comparing them. Append this (recompute the figures at the final head after C-1):
> ### Amendment 4 — budget overrun, §7 not edited (class 8)
> 1. Declared by §7: `scripts/hooks/hooks.test.mjs` 20, `scripts/plan/verify-cites.test.mjs` 40, `AUTONOMY.md` 75. Final by §7's counting command at `<final head>`: 24, 41, 77; the total `<n>` lines over 12 files.
> 2. Reasons: S1-test plus the §26 adjacency test's changed lookup (Amendment 5, item 2); the V1/V2 fixture helper; Part A in three fences around lines 37 and 38 (Amendment 5, item 1) and item 3's per-clause sources.
>
> Nothing above is edited.

**D-2: the deviations from the form are in the PR body only. Record them as class 3, references only.**
> ### Amendment 5 — deviations found in code (class 3)
> 1. §2 item 6: directive lines 37 and 38 are referenced by pin, not reproduced, under §8 item 8 (AUTONOMY.md §33 part A at 8d8cdfc6).
> 2. §2 item 5's statement that the §26 adjacency test reads lines 4 and 5 only is wrong: it finds the PRECEDENTS line by substring. One lookup changed at 8965ba75 (`scripts/hooks/hooks.test.mjs:1319` at 8965ba75); its assertions are unchanged.
> 3. §2 item 3: when P's block has no `Previous ledger:` line, the new line leaves out `Before it`.
> 4. §4 MC4: the worker applied a wider mutation (`scripts/hooks/flush.test.mjs:180` at 6372d6e9); MC4 as §4 states it was observed by the reviewer gate at c8b78e90.
> 5. §4 MR9: observed by substitute, a scratch copy of the settings read through R9's path; the tracked file was not edited.
>
> Nothing above is edited.

The test-text spans are named with their branch commit ids and not pinned by hash, per round 25.

**D-3: `AUTONOMY.md:604` says "Items 1 to 4 left the continuity block in the 2026-10-14 move".** No move happened on 2026-10-14. The move is the shrink (b), after the gates. Not the human's wording. Replace that sentence with:
> Items 1 to 4 are the items numbered (00), (0), (5) and (14) of the continuity block, moved out of it under piece B of the 2026-10-14 direction.

Clause check: the numbers match §2 item 1's table; "moved out" is true at the merge, because (b) comes before it (§2 item 10 (b), §8 item 9); "piece B" is the directive's B.1.

**D-4: Part B item 4 (`AUTONOMY.md:634`) and item 3's clause at `AUTONOMY.md:626` put the round 50, item 1 brief wording into AUTONOMY as a standing mechanic. A later ruling took that wording out of the briefs.**
- `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, item 3: "From then, the round 50, item 1 wording leaves the briefs, unless Guardian needs it".
- The uninstall was reported in `state/directives/2026-10-11-recorder-uninstalled.md`. Its RULED block of 2026-10-11 records "(Guardian does not need it)".
- The verbatim move is right. The section needs a note. Not the human's wording. Append after item 4's Source line:
> The round 50, item 1 wording has left the briefs since the human reported the Evidence Recorder's uninstall (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, item 3; `state/directives/2026-10-11-recorder-uninstalled.md`; its RULED block of 2026-10-11 records that Guardian does not need it). This item, and item 3's clause from round 50, item 1, are kept as moved and are not applied.
- Clause check: each part resolves to the lines quoted above. "Kept as moved" is directive B.1's "move out verbatim". If the custodian would rather not decide "not applied", that sentence goes to the human.

Checked and not findings:
- `scripts/plan/verify-cites.test.mjs:344` and `:359` hold `state/CUT-STATE.md:4` as V1/V2 fixture input, not as cites.
- "round 51, item 3", which the worker doubted, resolves: that RULED block's item 3 carries the standing publish-test line, taken from Fable's advice item 4.

## The PR body's six differences
1. **Lines 37 and 38 referenced by pin: accept.** §8 item 8 outranks §2 item 6's reproduction. The elision drops only the list of the two cites, which are pinned in the same sentence; it removes no negation, condition or qualifier. The kept spans 25-36 and 39-40 are byte-equal. Record it (D-2 item 1).
2. **The §26 adjacency test: confirmed.** At M0, `hooks.test.mjs:1314-1325` uses `l.includes(needle)`, so the form's claim was false. The new lookup still fails if item 5 moves. Record it (D-2 item 2).
3. **`--root`: blocking (C-1).** Leaving out `Before it` when the line is missing is reasonable; record it. STOP with no rollback is what §2 item 3 specifies. On main's live block, the first backticked path in the `Previous ledger:` line is the archive path, so `Before it` will name the right file.
4. **The inside-repository check on both roots, through `realpathSync.native`: accept.** It is stricter than the form and runs on the product path (the default target's toplevel is `REPO_ROOT`). C7 depends on it, and MC7 was observed.
5. **The unsourced clause: accept.** The form provides for it. I searched `state/directives/`, `DECISIONS-PENDING.md`, `AUTONOMY.md` and `AI_DEVELOPMENT.md` for "Write tool" and found no source.
6. **The clock risk: real and narrow.** See the non-blocking notes under Correctness.

**MR9's substitute:**
- I made it the same way: the worktree's settings plus one SessionStart entry (`node scripts/plan/rotate-cut-state.mjs`), written to a scratch copy. Only R9's read path was pointed at the copy. No `.claude/settings.json` was edited in any tree.
- R9 failed alone. The `deepStrictEqual` showed the injected command. I reverted the test, deleted the copy, and the porcelain was clean.
- It shows what MR9 asks. The detector catches the entry in a settings object of the real file's shape, and the unmutated run's `commands.length > 0` shows the real file's hooks are read. The only step not exercised is the literal edit, which the rule forbids. Record it as MR9 by substitute (D-2 item 5).

## Mutations observed
Each was applied alone in the detached worktree `C:/dev/wt/gate229` at c8b78e90. I ran the named file, read the failures by name, reverted with `git checkout --`, and the porcelain was clean after each one and at the end.

| Mutation | File run | rc | Fails | Tests that failed |
|---|---|---|---|---|
| MV1 | verify-cites.test | 1 | 1 of 24 | V1 |
| MV2 | verify-cites.test | 1 | 1 of 24 | V2 |
| MC1 | flush.test | 1 | 1 of 18 | C1 |
| MC2 | flush.test | 1 | 5 | C2, C3, C4, C6, C7 |
| MC3 | flush.test | 1 | 5 | C3, C4, C5, C6, C7 |
| MC4 | flush.test | 1 | 1 | C4 |
| MC5 | flush.test | 1 | 2 | C5, C2 |
| MC6 | flush.test | 1 | 1 | C6 |
| MC7 | flush.test | 1 | 1 | C7 |
| MR1 | rotate-cut-state.test | 1 | 4 of 9 | R1, R2, R4, R8 |
| MR2 | rotate-cut-state.test | 1 | 1 | R2 |
| MR3 | rotate-cut-state.test | 1 | 1 | R3 |
| MR4 | rotate-cut-state.test | 1 | 1 | R4 |
| MR5 | rotate-cut-state.test | 1 | 3 | R3, R4, R5 |
| MR6 | rotate-cut-state.test | 1 | 1 | R6 |
| MR7 | rotate-cut-state.test | 1 | 1 | R7 |
| MR8 | rotate-cut-state.test | 1 | 2 | R1, R8 |
| MR9 (substitute) | rotate-cut-state.test | 1 | 1 | R9 |
| MS1 | hooks.test | 1 | 1 of 65 | S1-test |

- MC4 was made as §4 states it: only the choice of the largest field goes by string length, and the printed sizes stay in bytes.
- MR8 fails R8 at its line 215: `'allow' !== 'block'`, the stale-at-R assertion.
- The other failure sets match the worker's report.
- Baselines unmutated, each rc 0: verify-cites.test 24, flush.test 18, rotate-cut-state.test 9, hooks.test 65.

## D1, row by row (M0 in the detached worktree `C:/dev/wt/gate229-m0`; head in `C:/dev/wt/gate229`)

| Row | M0 | Head | Reading |
|---|---|---|---|
| `verify.mjs` | rc 0, stdout 16ead84d… (run in `gate229` checked out at M0) | rc 0, 16ead84d… | Equal. In the separate M0 worktree the stdout hash is d605a4d5…, differing only by the checkout path in its one line. |
| `verify-quotes.mjs` | rc 0, 4b348e92… | rc 0, 4b348e92… | Equal; stderr `cmp` 0. |
| `verify-test-claims.mjs` | rc 0, 6b9ca4f7… | rc 0, 6b9ca4f7… | Equal; stderr `cmp` 0. |
| `verify-mutation.mjs` | rc 0, c5cd2f9c… ("all 0 new") | rc 0, c0473621… ("all 19 new") | E-1. |
| `verify-cites.mjs` gated set | empty, PASS, rc 0 | empty, PASS, rc 0 | Equal. Advisory stderr is identical after replacing the worktree name (`cmp` 0). The stdout differs only by the file count, 1999 vs 2001 (the two new files). |
| `node --test` CI globs | 464 pass, rc 0 | 483 pass, rc 0 | No M0 test name is missing at the head. The 19 added names are exactly §4's C1-C7, R1-R9, S1-test, V1, V2. |
| §1 unchanged files | | | Blob ids equal: `precompact-flush.mjs`, `stop-queue.mjs`, `tools/mods/spatial-guardian/hooks/continuity.mjs`, `measure-reads.mjs`, `.claude/settings.json`, `DECISIONS-PENDING.md`, `state/CUT-STATE.md`. The diff leaves `extractSessionContinuityBlock`, `parseSessionContinuity` and `SESSION_CONTINUITY_FIELDS` untouched. |
| §8 item 2 | | | `cmp -n` exits 0 for both `AUTONOMY.md` and `PRECEDENTS.md`. |

Extra (I4's prediction): in `gate229` I replaced the working-tree ledger with a 15-line block-only file. Neither script was run. `verify-cites` exits 0 (PASS, 45 advisories). The directive's line 38 cite `:332-333` becomes advisory, and both new pins still resolve. I restored the file; porcelain clean.

## Hashes recomputed (whole lines, LF bytes)
- **Pins:** 21 distinct pins (22 occurrences) added across `AUTONOMY.md`, `PRECEDENTS.md` and the two consults. Every hash matches, and every rev is an ancestor of origin/main. Script output: `pins 21, problems 0`, rc 0.
- **S2 commits:**
  - C8 = 02ec6a34, the first parent of bfa510b5, which adds the watcher report. Line 8 there carries the residual E5-pin pointer that the report's row 13 names.
  - C332 = 9b77d0f9, the first parent of 86d6b4b2. Lines 332-333 there hold "81107ddf".
- **Fences:** all ten match their sources byte for byte, from `git show 0ff2594e:<path>`:
  - Part A: directive 25-36, 39-40 and 68.
  - Items (00), (0), (5), (14), (2), (18). Each start and end marker is found exactly once on its line (line 8; line 9 for item (5)), and a space comes before each end marker.
  - P-035's covering lines 15-20 of `state/directives/2026-09-30-portability-and-handoff.md`.
- **Directive:** byte-identical at 513ca7b3 and at M0.

## Other §8 items at the head
- Item 1: no file listed unchanged in §1 is touched.
- Item 3: met, apart from the one declared unsourced clause.
- Item 4: no truncation path; MC3, MC5 and MC6 were caught.
- Item 5: the script's git calls are only rev-parse, status, log, cat-file, show, ls-tree, mv, add and diff.
- Item 6: no profile path in the added lines.
- Item 7: no typed date in the added script lines (D-3 is in a record).
- Item 8: met (the fixtures as noted above).
- Item 9: not yet applicable; the PR is a draft.
- Counting command: `799 12`. All eleven commits are signed off.

## `gh pr checks 229`
rc 0, all 8 checks pass: cfg boundary ×2, DCO, exposure scan, ported-notices ×2, test/verify:plan ×2. Every run is at head c8b78e904ef90c0258bc1bd910a5445b37ad67eb, in push and pull_request events. The pull_request runs tested the merge with main as it stood then.

## Commands and exit codes
- `git fetch origin`: 0. `gh pr view 229`: 0.
- `git diff` three-dot and `git log` of the range: 0.
- `git worktree add --detach` ×2: 0. `git worktree remove` ×2: 0; neither worktree remains.
- `node --test` CI globs: head 0 (483), M0 0 (464).
- D1 runs, all 0: `verify.mjs` ×3, `verify-quotes`, `verify-test-claims`, `verify-mutation`, `verify-cites`, each at M0 and at the head.
- `git checkout --detach` to M0 and back in `gate229`: 0, 0.
- Blob-id comparisons, `cmp -n` ×2 (0, 0), numstat: 0.
- The pins script: 0. The fences script: 0.
- The mutation driver: 0. Each mutated run rc 1; each baseline rc 0.
- Short-ledger `verify-cites`: 0.
- `gh pr checks 229`: 0. `gh run view` ×6: 0.

I made no commits, pushes or PR actions, and ran neither `rotate-cut-state.mjs` nor `flush.mjs` against any tree's ledger. No harness refusal occurred. I wrote only to the scratch folder and the two temporary worktrees, both now removed; the main checkout's porcelain shows only its two existing untracked entries. Paths: `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.mjs`, `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.test.mjs`, `C:\dev\spatial-ide\AUTONOMY.md`, `C:\dev\spatial-ide\scripts\hooks\flush.mjs`, `C:\dev\spatial-ide\scripts\plan\CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`, all as they are at c8b78e90.
