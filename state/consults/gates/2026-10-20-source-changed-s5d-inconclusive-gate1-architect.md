Reviewed: PR #235 at 0e281e0793e159e8f24d47e3f8d6e9cf2c981045 (base 677ecd12), gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/source-changed-s5d-inconclusive @ 0e281e0793e159e8f24d47e3f8d6e9cf2c981045 (merge base 71f5ebbbcb58e9b21e60de207b831e5581c81449)

## What I could not run

I have no shell, so I ran neither git nor gh. Three checks rest on the reviewer.
- **The file list for §8 items 1 and 2.** My evidence is partial. The worker's numstat lists only the five §7 files, but that command was scoped to `frontends/shell`. The custodian's empty `git diff --name-only ed8731a7…0e281e07` covers only the Rust paths and `src-tauri` (e2e record, Setup). Nothing I have covers paths outside those two scopes. The reviewer's three-dot `--name-only` closes it.
- **Every sha256.** That includes the five test pins and the e2e record's whole-file hash.
- **Check 5, the PR body.** I could not read it (`gh pr view 235`). The reviewer must confirm two things in it: §9's statement (milestone 3's sweeps and later sweeps read INCONCLUSIVE where they read a failure of S5d now, and exit 3 where they read 1), and the list of §2.4's applied words. §9 also wants verify-cites, verify-quotes and verify-test-claims each named with its commit. The worker's report gives rc 0 for each but names no tool commit (round 15 (c)), so the PR body must name it.

## Correctness

None.

## Evidence

None. The seam is shown end to end from the real shape: 8 of 8 post runs read S5d INCONCLUSIVE, C2, exit 3, and the default and reopen routes read every step PASS, exit 0 (the e2e record @ main 677ecd12, Summary and each run's row).

## Documentation (must-fix before the merge; no re-gate)

**D1. Amendment 2 item 3 states no reason, which class 2 requires.**
- Where: the form, Amendment 2 item 3, on main at 907d3e0a3c5647ec6cf2fa90b5f0b398dcb69222. The template's class 2 reads "State the reason and the evidence." (`docs/PREREGISTRATION-TEMPLATE.md:109` at the head).
- Fix: an appended amendment item, never an in-place edit. The form is append-only. These are not the human's words, so the custodian applies them. Words:
  > Amendment 2 item 3 states no reason, which class 2 requires. Reason: not established — the suite reads no stderr, the P line is printed only where a stream's post-check recorded a finding (`kernel/src/lib.rs`, `end_session_if_source_changed`), and the runs do not show why the captures of post-1, post-7 and post-8 carry none. The frontend at the head includes milestone 3 (§11, rule 00) and step 2's at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 did not, so the two series are not compared.
- Clause check:
  - **The suite reads no stderr.** S5d reads only the session log (`frontends/shell/e2e/source-changed.mjs:1418-1429` at the head). The only stderr the driver reads is the repoint helper's (`:387`, `:394`).
  - **Printed only where a post-check recorded a finding.** `kernel/src/lib.rs:613-615` returns without printing when `source_changed_detail()` is None. The print at `:635-642` is the only site in the tree (grep over `*.rs`). The finding is recorded by the producer's post-check (`engine/src/stream.rs:1335`).
  - **Milestone 3 is in the head's frontend.** The form's §11 says the runs at the head include milestone 3. On main, ed8731a7 comes before #234 was opened.
  - **It is three sentences**, within the round 12 (d) ceiling.

**D2. Amendment 2 item 2 gives the e2e record's sha256 with no explicit rev.** It says only "at the commit that adds it" (round 15 (e)).
- The commit that adds the record is 907d3e0a3c5647ec6cf2fa90b5f0b398dcb69222, on main (main's reflog). It is also the commit that writes Amendment 2, so that amendment could not have named it.
- Fix: the same appended amendment adds this item:
  > Amendment 2 item 2's sha256 714628f30ae23a2025f84461bbf8c087f90eb1a0548557a248e26e4004dfae6e is over `state/consults/2026-10-20-source-changed-s5d-inconclusive-e2e-custodian-runs.md` @ 907d3e0a3c5647ec6cf2fa90b5f0b398dcb69222.
- The reviewer recomputes the hash at that commit.

**D3. A doc comment overstates what drift does.**
- Where: `frontends/shell/e2e/s5dVerdict.mjs:9` at the head. It says, byte-copied: "so drift in either file fails by name."
- What is wrong: a changed literal is read as it now stands and fails nothing in the module (`:16-17`). Only a change in the number or shape of the matched arms throws (`:19-20`).
- This is not the human's wording, so the worker applies it and the PR body lists it. Replacement:
  > // Source text read where the details are defined (no import, no build dependency): a change in the matched arms' number or shape fails by name here, and a changed literal is read as it now stands (T5 also pins `require_live`'s).
- Clause check:
  - **Number:** `:19-20` throw on any count other than 2 and 1.
  - **Shape:** the patterns at `:16` and `:18` are structural, so a reshaped arm drops the count.
  - **Literal:** `:16-17` capture whatever literal is there and join its continuations.
  - **T5 pins it:** `s5dVerdict.test.mjs:54` asserts that `alreadyEnded` includes A3's record-derived detail, so any edit to `require_live`'s literal fails T5.
  - Budget: +0 or 1 line; the module is at 57 of 80.

## Check 2: the module's readings against §2.1 and Amendment 1 item 1

All in `frontends/shell/e2e/s5dVerdict.mjs` at the head.
- **Rule 1:** no session-ended line gives FAIL, class null (`:38-40`). The text is byte-equal to base `source-changed.mjs:1420-1421` on main.
- **PASS:** a session-ended line and no refusal (`:42-44`). The text is equal to base `:1432-1433`.
- **Rule 4's order:** other, then R, then sibling-precheck, then already-ended (`:47-56`):
  - C3 FAIL, under OPEN-5 (A);
  - R FAIL, under OPEN-3 (A);
  - C2 INCONCLUSIVE;
  - C1 FAIL, under OPEN-2 (A).
  - Position is never read, and the session-ended line's detail is never classified, because the filter at `:41` takes refusal lines only.
- **Reading the kernel's details:**
  - `readRefusalDetails` finds exactly the two arms (`kernel/src/skp.rs:1502-1505` and `:1620-1624`) and the one `Err(e)` arm (`engine/src/descriptor.rs:334-336`).
  - Its continuation join yields `{this dataset's session ended when its source was observed to have changed}`, which equals A3's shell-side text, and T5 asserts that.
  - The prefix it reads is `{the source could not be re-read: `.
- **Exit codes:**
  - 3, 1 and 0 at `source-changed.mjs:1477-1479`;
  - a precondition throw exits 1 before the layout (`:764-767`);
  - the watchdog's exit 2 is unchanged (`:753`).
- **T7 and M5:** T7 is at `s5dVerdict.test.mjs:62-67`; M5 is recorded at `:10` with commit 217d6e8e3c130c00bb87b578235a0b9bf284a811. The module is unchanged after that commit (the branch's reflog: 287b2bec touches comments in the test only; 61bf1c08 and 0e281e07 touch other files).
- **Falsification (i) does not hold at the head.** The mint path's only `SourceChanged` details are the descriptor finding (`descriptor.rs:315-317`), R (`:334-336`) and the two already-ended literals.
  - `skp.rs:1024` sits on the open and admission path only (`:1229`, `:1275`, both before `viewport_query` at `:1373`).
  - `lib.rs:531` is the data-plane START terminal, which `logMintRefused` never writes.

## Check 3: §2.4's words at the head and their clause checks

**D-H** (`source-changed.mjs:179-199`) is line-for-line equal to the form's §2.4 D-H block. Its clauses hold at the head:
- **The sibling's pre-check:** `require_live` at `skp.rs:1436`, then the refusal that ends the generation at `:1449-1455`.
- **First in the catch:** `logMintRefused` at `tileViewportStreamManager.ts:944` is the catch's first statement. The attach failure is also logged, at `:1014`.
- **Even after the session ended:** there is no `sessionEnded` guard in `:928-944`.
- **Only a post-check prints the line:** `lib.rs:635-642` is the only site, and it prints after `end_generation` at `:623-624`.
- **Above 0 only when that call ended the generation:** `skp.rs:914-917` returns 0 when the end is already recorded.
- **This suite cannot read it:** confirmed above (check 1 of D1's clause check).
- **The two statements the human approved** (Amendment 1 item 2; OPEN-6): "confirms … only in a run with no sibling refusal" holds as a necessary condition, because INCONCLUSIVE never passes (runStep returns false, `:832-835`).

**D11** (`:168-172`) is equal to the form. `startStream` is at `:1096`. `traceStreamIssued` at `:1099` is the method's last statement (`:1100` closes it), and the call site's comment is at `:1097-1098`.

**D9** (`:1407-1414`, dashed rules kept) is equal to the form.
- `:944` comes before `:955-957`.
- `onTerminal` (`:1064-1093`) never logs a refusal.
- The latch is at `:736`, and the line is logged at `:743`.
- `endSession` is called at `:764`, `:956` and `:1085` only.

**README** `frontends/shell/e2e/README.md:243` is equal to the form's §2.4 README line.

## Check 4: the seam, and Amendment 2 item 3's result

- The 8 runs show the real shape end to end.
  - Each S5d line carries the module's C2 text, a `{mtime}` refusal and exit 3.
  - Each refusal line matches the pattern at `s5dVerdict.mjs:25`.
  - Every other step passed, and no run has a W or R line.
- **Effect of no P line in 3 of 8:** none on any claim of the form, the header, D9 or milestone 3.
  - **§0:** its "P line in every run" is about step 2's 16 runs, and it is still true of them.
  - **§2.3, D8's C2 text and D-H:** each says the post-check is neither shown nor excluded. D-H claims only that the line is printed by a post-check and is above 0 only in one case; it never claims a line in every run.
  - **D9:** it claims nothing about stderr.
  - **Milestone 3:** its Amendment 3 item 12 and OPEN-4 (A) read S5d's verdict alone and never a P count.
- The one record gap is D1's missing reason.

## Check 6: Amendment 2 against the template's classes

- Its first line says it was written after the runs were seen. Items 1, 2, 4 and 5 are post-result records (class 1). Item 3 is class 2 and has its evidence but no reason (D1). Item 2's hash has no rev (D2).
- Prediction 3 is recorded, not edited.
- No class 8 applies: the figures are 225 of 287, and every file is within its ceiling (the worker's numstat; the reviewer recomputes).
- No class 9 applies.
- No record calls a `verify-mutation` run an observation: the worker's report says none was used, and the test header records an observation at a commit.

## §8, block-on-sight, item by item

1. **Files only §7's five.** Not shown on sight. The numstat over `frontends/shell` lists only the five. Paths outside that and the Rust scope are unverified by me; the reviewer's diff closes it.
2. **No edit under `src/`, `src-tauri/`, `kernel/`, `engine/`, `protocol/`, `renderer/` or the named e2e files.** Not shown on sight, on the same evidence plus the custodian's empty Rust and `src-tauri` path list. Unverified by me beyond that.
3. **Step bodies.** Not shown on sight. Comparing base and head S5d regions and `main()`: the only changes are the import, the precondition, runStep's catch, the results type, the summary width, the exit line and S5d's body. The worker's 52/44 matches my count of those regions.
4. **INCONCLUSIVE contained.** Not shown on sight. `S5dInconclusive` is thrown only at `:1439`, INCONCLUSIVE exits 3, and runStep returns false for it.
5. **Classed by position.** Not shown on sight.
6. **C2 beside another code, unreadable or R.** Not shown on sight: `:47-52` come first.
7. **Kernel details as literals.** Not shown on sight: there are no detail literals in the module.
8. **New field, duration, rate or performance word.** Not shown on sight.
9. **Test cases not from the record.** Not shown on sight. Five per-line pins (per-line rather than ranges, disclosed), and T4 to T7 are §3's constructions.
10. **Mutations without a commit.** Not shown on sight. M1 to M8 are recorded at 217d6e8e…, and no `verify-mutation` run is called an observation.
11. **A claim of the route, a fix or a rate.** Not shown on sight. The PASS text says the route is not read. The step id `S5d-post-check-route-confirmed` is unchanged, which §5 declares (the report's shape).
12. **A verbatim quote of the human.** None in the diff.
13. **README timing and scope.** Not shown on sight. Base 71f5ebbb records #234 merged, and the edit is to line 243 only (count 2).
14. **Exports without a caller.** Not shown on sight. `S5dInconclusive`, `initRefusalDetails` and `s5dVerdict` are used by the driver (`:233`, `:766`, `:1436`, `:1439`), and `readRefusalDetails` by `initRefusalDetails`.
15. **Line cites into `tileViewportStreamManager.ts`.** Not shown on sight. The stale `:273-280`, `:952-954`, `:1081-1083` and `:733` are removed, and the new comments use names.
16. **Code before its ruling.** Not shown on sight. Code commits follow 71f5ebbb, which carries Amendment 1.

## What I checked, and how

- **Read in full:** the form on main; the worker's report; the e2e record; the S5d form's Amendments 4 and 7.
- **Read at the head:** `s5dVerdict.mjs`, `s5dVerdict.test.mjs`, and `source-changed.mjs` lines 150-209, 735-844 and 1390-1514, each set beside main's base text (`:740-819`, `:1385-1474`).
- **Read at the head:** README lines 220-245; `package.json`'s lines 17 and 43; `tileViewportStreamManager.ts` lines 268-283, 730-769 and 900-1101.
- **Kernel and engine at the head:** `skp.rs` lines 880-939, 1000-1039 and 1425-1464; `lib.rs` lines 505-649; `engine/src/stream.rs` lines 1725-1754.
- **Greps:** `SourceChanged` construction sites across kernel and engine, and the P line's print site.
- **Git metadata, read as files:** the branch's reflog, main's reflog for 71f5ebbb, ed8731a7 and 907d3e0a, and the template's class text.
- **Not run:** see the first section.

Files: C:/dev/wt/s5di/frontends/shell/e2e/s5dVerdict.mjs, C:/dev/wt/s5di/frontends/shell/e2e/s5dVerdict.test.mjs, C:/dev/wt/s5di/frontends/shell/e2e/source-changed.mjs, C:/dev/wt/s5di/frontends/shell/e2e/README.md, C:/dev/spatial-ide/frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-20-source-changed-s5d-inconclusive-e2e-custodian-runs.md
