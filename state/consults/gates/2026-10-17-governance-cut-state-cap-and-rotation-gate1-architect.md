Reviewed: PR #229 at c8b78e904ef90c0258bc1bd910a5445b37ad67eb (base 0ff2594e). Branch and commit: cut/cut-state-cap-and-rotation @ c8b78e904ef90c0258bc1bd910a5445b37ad67eb
Verdict: FAIL

The fail rests on two code findings, C-1 and E-1, both in `scripts/plan/rotate-cut-state.mjs` and its test, and both small. The wording items W-1 to W-3 are claims of a limit that the code does not support, so they count as Correctness under the 2026-10-05 direction, section 2. I give exact words for them; they are not the human's wording, so the worker applies them with no re-gate (AUTONOMY §31 (d)). D-1 to D-6 are must-fix before the merge.

**Disclosure.** I have no shell. I read the files in the clean head worktree `C:/dev/wt/csr`. I took the PR body from the custodian's scratch copy `pr-csr-body.md`, not from `gh pr view`. I recomputed no hashes and did not run D1 or the cmp; those are the reviewer's.

## Correctness

**C-1. `--root` is an option with no product caller (the human's caller rule, rounds 4 and 5, by name).**
- Where: `scripts/plan/rotate-cut-state.mjs:72-77`. Its only caller is the tests' `rot()` at `scripts/plan/rotate-cut-state.test.mjs:58`.
- The product call in AUTONOMY §33 (ii) runs the script with no arguments. The PR body (difference 3) and the worker's report both say the option is "for its tests". It is a test-only option that changes what the script acts on, and no exemption covers that.
- Also, `export const REPO_ROOT` at `:21` has no importer.
- Fix:
  - Remove `--root`.
  - Take the root from `git rev-parse --show-toplevel` run in `process.cwd()`. §33 (ii)'s relative command already needs the working directory to be the checkout, so the product call does not change. A worktree run is still refused off main.
  - In the tests, spawn with `{ cwd: dir }`.
  - Drop the `export` on `REPO_ROOT`.
- What reopens: Correctness for these two files only. MR6 and MR8 are observed again on the fix commit.

**W-1. Header comment, `scripts/hooks/flush.mjs:42-43`.** The comment says "(none if that folder is inside a repository)". The code skips the scratch file only for this repository or the target file's repository (`:236-239`), and also when the write fails (`:245-246`).
- Replace those two lines with:
  ```
  // anywhere. The CLI writes the refused block whole, plus one newline, to a new file in the folder
  // spatial-ide-flush-refused under os.tmpdir() and names that file in the refusal. It writes no such
  // file, and the refusal says so, when that folder resolves inside this repository or inside the git
  // repository holding the target file, or when creating or writing the file fails. It exits 1.
  ```
- Clause check:
  - "names that file": `:244` and `:274`.
  - "this repository": `REPO_ROOT` in `roots`, `:236`.
  - "the git repository holding the target file": `--show-toplevel` of the target's folder, `:236`.
  - "creating or writing fails": `realpathSync`, `mkdirSync` and `writeFileSync` sit inside the try at `:234-247`.
  - "says so": `:246`.
  - "exits 1": `:288`.
- Ordinary use can reach this case: an unwritable or full temp folder.

**W-2. AUTONOMY §33 (i), `AUTONOMY.md:597`.** The sentence states the scratch file as unconditional.
- Replace "The refused block is written whole to a new file in the folder `spatial-ide-flush-refused` under the operating system's temporary folder, and the refusal names that file's path; this section prints no path." with:

  "The refused block is written whole to a new file in the folder `spatial-ide-flush-refused` under the operating system's temporary folder, and the refusal names that file's path. When that folder resolves inside this repository or inside the git repository holding the target file, or the file cannot be created or written, no file is written and the refusal says so. This section prints no path."
- Clause check: as W-1. This is the custodian's instantiation, not the human's words.

**W-3. PR body, the S3 bullet.** Replace "It writes the refused block whole to a scratch file outside the repository and truncates nothing (C1 to C7)." with:

"It truncates nothing. It writes the refused block whole to a scratch file outside the repository and names it, or, when it cannot, says that no scratch file was written (C1 to C7)."
- Clause check: as W-1. C7 asserts the "no scratch file was written" text (`flush.test.mjs:291`).

## Evidence

**E-1. No test rotates a ledger of the real shape (the human's seam rule: one end-to-end test from the real shape).**
- Every R fixture is `ledgerText()` (`rotate-cut-state.test.mjs:33-36`). It has no title line and a one-path `Previous ledger:` line.
- The real ledger at the head has a title line (`state/CUT-STATE.md:1`) and a two-path `Previous ledger:` line (`:13`).
- So "the title line goes" (§2 item 3, OPEN-3 (iii)) and the "exact text" of §1 claim 4 are unproven for the input the first live rotation will read. C5 covers flush on the real shape; nothing covers rotation.
- Fix, keeping the test name: R8 (`:189-240`) seeds its ledger from the real `state/CUT-STATE.md`, with its eight fields set by `updateBlockFields` (flushed_at and tip as now, the rest `SENTINEL`, as C5 does). After the rotation, R8 asserts:
  - the new file starts with `## SESSION-CONTINUITY` and has no line before it;
  - its fields are the eight seeded lines;
  - its `Before it` path is the first backticked path of the seeded `Previous ledger:` line;
  - it ends with the notice, a blank line, `## Ledger` and one newline.
- MR8 is observed again on the fix commit.

## Documentation (must-fix before the merge)

**D-1. §7, class 8 (round 25, item 2).** The per-file figures are overrun by the worker's numstat: `scripts/hooks/hooks.test.mjs` 24 of 20, `AUTONOMY.md` 77 of 75, `scripts/plan/verify-cites.test.mjs` 41 of 40. The total, 799 of 960 over 12 of 12, holds. Record it in a form amendment, counted at the head after the fixes, with §7 not edited. Suggested items:
- (1) class 8: the three per-file overruns and the total;
- (2) class 3: differences 1 to 4 and MR9's substitute, accepted at this gate, by reference to this report;
- (3) class 3: §2 item 5's sentence on the §26 adjacency test does not hold; `hooks.test.mjs:1319` changed its lookup in the commit named by its full id, with the assertions unchanged;
- (4) the generation goes up by one.

**D-2. Part B item 4 (`AUTONOMY.md:634`) and item 3's clause (`AUTONOMY.md:626`) present a withdrawn mechanic as standing.** Round 50, item 1's brief wording was withdrawn on 2026-10-11 (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, item 3, with its RULED block of 2026-10-11 and the uninstall report `state/directives/2026-10-11-recorder-uninstalled.md`).
- At `:634`, after "Source: round 50, item 1.", append:

  " Withdrawn: from the human's report that the Evidence Recorder is uninstalled (`state/directives/2026-10-11-recorder-uninstalled.md`), worker and tester briefs no longer carry this wording (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, item 3, and its RULED block of 2026-10-11). The item is kept here as it moved, not as a standing mechanic."
- At `:626`, replace "round 50, item 1;" with "round 50, item 1, withdrawn on 2026-10-11 as item 4 says;".
- Clause check: directive item 3 says the wording leaves the briefs from the uninstall unless Guardian needs it; the RULED block's "Applied" line records that Guardian does not need it. The fenced item text is unchanged.

**D-3. The unsourced clause, `AUTONOMY.md:625` and the PR body's difference 5.** The clause does have a tracked source, outside the form's search scope.
- At `:625`, replace "no tracked source was found;" with "no ruling was found in `state/directives/` or `DECISIONS-PENDING.md`; `tools/mods/spatial-guardian/README.md` states the mechanic among G1's limits;".
- In the PR body, difference 5 becomes: "**One clause of item (5) has no ruling as its source:** recording text through the Write tool, committing and publishing in separate calls. No ruling was found in `state/directives/` or `DECISIONS-PENDING.md`; the Guardian README states the mechanic among G1's limits, and §33 part B says so."
- Clause check: that README's G1 limit bullets tell the reader to write record text with the Write tool and to run the push as its own call.

**D-4. `AUTONOMY.md:569`, a discharge claim with no resolvable proof (round 7).** Replace "Their instruction was carried out once, by pinning the two reports' cites at main commits (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`, section 2 item 4)." with:

"Their instruction is carried out by the pull request that adds this section, which pins the cites in `state/consults/2026-09-26-source-watcher-gate3-architect.md` and `state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md` at main commits (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`, section 2 item 4)."

**D-5. `AUTONOMY.md:604`, a date error.** The move happens at (b), not on 2026-10-14. Replace "in the 2026-10-14 move" with "in the move the 2026-10-14 direction ordered (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`, section 2 item 10 (b))".

**D-6. PR body.**
- §2 item 4 asks that each edit be recorded under directive item B.4. The S2 bullet becomes: "S2 (directive item B.4): the two gated ledger cites become pins at main commits where the cited text sat, each file changing on that one line: the watcher report's cite of the ledger's line 8, pinned at 02ec6a34e4384ed7cf90c2d1277c290d038987d5, and the lease report's cite of lines 332 to 333, pinned at 9b77d0f900d3b5b30e41005a063861e1e48a6a4d."
- Add to the R tests' header comment: "// Timing: R1 and R2 read today's UTC date twice, and R4 and R5 commit an archive and then read this week's Monday; a run across UTC midnight, or across Monday 00:00Z, can fail them."

## The brief's checks

**1. §8, item by item, at the head.**
1. Pass. 12 files, none on §1's unchanged list. In `session-resume.mjs` only `READING_ORDER` changed.
2. The custodian's cmp exits 0 for both files; I did not run it. The reviewer recomputes.
3. Bytes pass: the six spans read against `state/CUT-STATE.md:8` and `:9` at the head, which the PR does not touch. Every item has its source; D-2 and D-3 apply.
4. Pass. There is no truncation path; the cap is measured over `extractSessionContinuityBlock` in UTF-8 bytes (`flush.mjs:116-125`, `:185-194`).
5. Pass. R9 checks the hooks. The script calls no commit, push or fetch, and every refusal comes before any write.
6. Pass. Item (0)'s home-relative machine-script path is the ledger's existing bytes, carries no user name, and is not matched by the scanner.
7. Pass. The fixtures use epoch arithmetic and a non-date value.
8. Pass.
   - The `AUTONOMY.md` and `PRECEDENTS.md` pins are at 0ff2594e, on main.
   - The two consult pins are at 02ec6a34 and 9b77d0f9; the reviewer confirms each is on main and holds the cited text.
   - The unpinned strings at `verify-cites.test.mjs:344` and `:359` are V1 and V2's fixture input, not records.
   - No `DECISIONS-PENDING.md` line cite is added.
9. Not reached yet.

**2. The seam tests.**
- C5 is real-shape: real ledger, real `buildOutput`, exact slice of the printed block. MC5 was observed.
- R8 uses the real `decidePrecompact`, `decide` and the flush and session-resume CLIs, with no git injected (signatures read: `precompact-flush.mjs:225`, `stop-queue.mjs:293`). Its ledger shape is synthetic; see E-1.

**3. §2 item 1's table.** All six items are in their destinations, with their sources. The (2) covering line resolves at `state/directives/2026-09-30-portability-and-handoff.md:15-20`. Round 50, item 1 and round 51, item 3 resolve against their RULED blocks (round 51's under item 3, "Applied"). See D-2 and D-3.

**4. §2 item 8 with F-1.**
- `measure-reads.mjs` is untouched.
- The anchors stand. The tool reads only the live `state/CUT-STATE.md` and `DECISIONS-PENDING.md`, so parts 1 and 2 are as §2 item 8 states.
- F-1 is C's obligation. The sections C must size exist at the head: §33 from `### Part B.` to the section's end, plus P-035 and P-036.

**5. §33.**
- Part A's three fences match the directive's lines 25-36, 39-40 and 68 by reading.
- The instantiation does not widen the rule. (iii) restates round 14's pin rule for this file.
- (i) overstates; see W-2.
- Difference 1 is accepted (below).

**6. `READING_ORDER` item 1** (`session-resume.mjs:29`) is the directive's line 40 words plus OPEN-4 (a)'s sentence with n = 33. It matches Amendment 2.

## The PR body's six differences, and MR9

1. **Accepted.** §2 item 6 and §8 item 8 conflict, and lower-numbered §2 does not override a block-on-sight. Referencing lines 37-38 by pin and hash keeps them recoverable byte for byte. The elision removes no negation, condition or qualifier; it removes only the two citations' identities, and the surrounding prose says so. Record it under D-1 (2), and fix D-4.
2. **Accepted.** The lookup still catches the recorded mutation. Record it under D-1 (3), naming the test and the commit.
3. **`--root` is rejected (C-1).** Leaving out `Before it` when the old line is missing is accepted, since the form is silent and inventing a path would be worse. STOP with no rollback matches the form.
4. **Accepted.** The second root is checked on every product refusal; for the default ledger it equals `REPO_ROOT`, and with git unavailable `REPO_ROOT` alone protects. `realpathSync.native` is accepted.
5. **Corrected by D-3.**
6. **Accepted** as a test-timing limit, widened to R4 and R5 by D-6.

**MR9 by a substitute: accepted as observed.** The scratch copy `csr-settings-mr9.json` is the tracked settings plus exactly one SessionStart `startup` entry running the script. `csr-mut-MR9.txt` shows R9 alone failing, with that command as the only offending entry. Only the read path differed, for one run. Record it under D-1 (2).

## Notes (no finding)

- **N-1, headroom at (b).** The rotated block replaces the `Previous ledger:` line and adds the notice plus a blank line, roughly +70 bytes. If (b) lands near 6,144, the rotation refuses after the click, and the custodian would need a flush commit before R, against §2 item 10. Before the click, check `blockSizes(buildRotatedLedger(...))` on (b)'s ledger.
- **N-2.** No ADR or decision is missing.

## Re-gate scope

- The architect re-gates only the C-1 and E-1 fix diff in `scripts/plan/rotate-cut-state.mjs` and `scripts/plan/rotate-cut-state.test.mjs`.
- The reviewer observes MR6 and MR8 again on that commit.
- W-1 to W-3 and D-1 to D-6 land with no re-gate, listed in the PR body.
- Every other verdict carries forward, because the fix touches no other file.

Paths:
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.mjs
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.test.mjs
- C:/dev/wt/csr/scripts/hooks/flush.mjs
- C:/dev/wt/csr/AUTONOMY.md
- C:/dev/wt/csr/scripts/hooks/hooks.test.mjs
- C:/dev/wt/csr/scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md
- C:/dev/spatial-ide/tools/mods/spatial-guardian/README.md
- C:/dev/spatial-ide/state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md
- <the custodian's scratchpad>/pr-csr-body.md
