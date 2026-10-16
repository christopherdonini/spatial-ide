Reviewed: PR #222 at d25019694ae7f9025ff574ea32cb9120bed3ac49 (round base 3dfc1a0e, base 31e25f15). Branch and commit: cut/b2-piece-1b-recording @ d25019694ae7f9025ff574ea32cb9120bed3ac49
Verdict: FAIL. One Evidence finding blocks. A product-seam test can reach the cleanup after a failed record creation (the architect's C-2). I drove that path through the product's own `StepRecorder::new` and `record_step` at the head. The record nonetheless says that no test can reach it, so the cleanup ships with no test. There is also one Correctness finding that only a sentence's words block (C-1 below). It is not the human's wording, so the worker applies the given words with no re-gate (§31(d)). Apart from E-1, Evidence is closed: every round mutation and every rewritten expected failure was observed by me at the head, every suite is green, CI is 13 of 13 at the head, and the lock and ADR diffs are empty.

Worktree: C:/dev/wt/1b. After `git fetch origin`, HEAD = origin/cut/b2-piece-1b-recording = d2501969, and the porcelain was empty at the start, after every mutation and at the end.

## My gate 1 findings
- **C-1: met** by the code alternative. `create` removes the record's folder on any error after `create_dir` (kernel/src/session_history.rs:222-223). SKP-V0.md:1261 now carries the architect's C-4 words plus the worker's sentence `A failure at (7) removes what (7) wrote, as far as the operating system allows.` Checked against the code:
  - (1) to (6) run before the records lock (:150-165).
  - (7) checks the header first, then makes the folder, `locations.json` and the header (:214-219, :243-269).
  - A step refused at (8) leaves the record in `records` (:173) and writes no line (:187-188). K-m1's test proves this by reading back a header-only record.
  - The removal's own failure is dropped (:223), which the words `as far as the operating system allows` disclose.
- **D-1: met.** One version of the text is at SKP-V0.md:1276 and protocol/skp/src/v0/error.rs:117-121. Each clause checked:
  - created: :217-219, :249, :258;
  - no per-user data directory: frontends/shell/src-tauri/src/commands.rs:143;
  - locked: :259-260;
  - written / flushed: :99-106;
  - line not built: :163-165, `canonical`;
  - breaks a reader rule: :187, :215, :283-301;
  - a header over its ceiling: :89-92.
- **D-2: met.** The comment is at kernel/tests/no_generation_in_persisted_artifacts.rs:799-805. I observed both expected failures (K-m6 and K-m7 below).
- **D-3: met.** frontends/shell/e2e/console.mjs:608, :670-672 and :683-688. These match run 2 (its CON-CLASSC and CON-GROUP rows) and run 3 (CON-GROUP at `split run`, CON-TOGGLE at `GROUP': toggle`).
- **D-4: met.** frontends/shell/src/App.recording.test.tsx:207-208.
- **D-5 (the custodian's): met at the head**, except for one sentence, which is part of E-1.
  - The §7 line, 4,814 lines over 66 files, matches my recount, and each per-group figure matches the per-file numstat.
  - The P6 list carries O3 in the human's words, the new Reset row, and the round's new `{detail}` texts.
  - The list of words applied matches the round's commits.
- **D-6: applied as given, but now short for the kernel.** See D-1 below. The engine line (engine/README.md:530) holds.

## The architect's gate 1 findings, as I read them at the head
- C-1: met. The reader's rules are shared through `check_header` (:926) and `check_step` (:935). `reader_accepts` runs before each write (:187, :215). Both tests pass, and both mutations fail as their comments predict. U7's comment (:1263-1272) is true: past-bound members are refused before the write, and an in-bounds line over the line ceiling is refused `skp.step_line_over_ceiling` by `append` (:93-94).
- C-2: the code is met (:222-223). The test is missing (E-1).
- C-3: met. See App.tsx:1915, StylePanel.tsx:144, surfaceRegistry.ts:187-194 and A4. The owner is `docs/03 §"The action console"`; docs/03:11 has that section, and it does not contain ADR-022.
- C-4: applied verbatim at SKP-V0.md:1261.
- D-1, D-2, D-4, D-6, D-7, D-8: applied at the following places:
  - kernel/README.md:277-278 and kernel/src/lib.rs:21-23;
  - kernel/README.md:377 and :392;
  - commands.rs:167;
  - e2e/README.md:285-298 and MANUAL-WALKTHROUGH.md:682;
  - recording.mjs:34-41 and e2e/README.md:803. The four quoted failures match run 1's record lines 73-76 byte for byte.
  - MANUAL-WALKTHROUGH.md:1906-1907.
- D-3: replaced by the one version above, which holds.

## Evidence (blocking)

**E-1. The cleanup after a failed record creation (the architect's C-2) has a product seam and no test.**
- **Where:** kernel/src/session_history.rs:210-212. The comment says: `No test drives the removal: the folder's name is fresh and random, and nothing a caller supplies reaches the calls after it (the file writes, the lock), so no product input makes one of them fail.` The PR body repeats this: `The removal after a failed creation has no test: no product input reaches the calls after the folder is made, and no test-only path was added.`
- **Why it does not hold:** the caller supplies the store root (`StepRecorder::new(root, host)`; its product caller is src-tauri/src/lib.rs:451), and the record folder inherits the root's ACL. On Windows, an inheritable deny-write ACE on the root behaves as follows:
  - `create_dir` of the record folder succeeds;
  - the `locations.json` write in it is refused;
  - the folder can then be removed.
  This is a refused permission, the ordinary-use case gate 1 named. It needs no test-only path.
- **Observed at d2501969 (a reviewer probe, reverted):** I appended a test to kernel/tests/session_history.rs. It opens F1, puts the deny on a scratch store root with `icacls <root> /deny %USERNAME%:(OI)(CI)(WD)`, calls `record_step` through `StepRecorder::new(root, host)`, reads the root, then removes the ACE.
  - Unmutated: it passed. The detail was `locations.json: Access is denied. (os error 5)`, and the root was empty.
  - With `.inspect_err(|_| drop(std::fs::remove_dir_all(&dir)))` removed: it failed at its assertion, with `a folder was left: [...\store\unsaved-104a65bb44b1bc8edf4c9e219d36c864]`.
  - I then reverted both edits (porcelain empty) and deleted the scratch folder.
- **Fix (last round, code):**
  - Add that test as `#[cfg(windows)]` in kernel/tests/session_history.rs, with its recorded mutation (the `inspect_err` removed; expected failure: a folder is left). CI's windows-latest job runs it.
  - Test code already carries this cfg, for example kernel/tests/slice_budgets.rs:141, and scripts/plan/cfg-boundary.mjs:9-10 drops tests/. If the architect reads §8 item 8 as covering test code, that reading decides the matter.
  - Replace the comment at :210-212 with one naming the test.
  - The custodian deletes the PR body sentence.

## Correctness (blocking only by its words; not the human's wording; §31(d): the worker applies these words, no re-gate, the PR body lists them)

**C-1. SKP-V0.md:1266, the Bounds item's added sentence, claims a limit the code does not have.**
- **Current:** `A line with a member past a bound the reader holds (a text of more than 4,096 bytes, a list of more than 1,024 items) is refused `skp.session_history_unwritable` and not written, because the reader stops at the first line it refuses (ADR-036 §9).`
- **What the code does:** the header's `crs_assertion.definition_json` is bounded by the reader at `MAX_CRS_DEFINITION_BYTES` = 65,536 (kernel/src/dataset_ref.rs:43, :607; engine/src/crs.rs:40), not at 4,096.
  - A pasted definition of 4,097 to 65,536 bytes is admitted by the assertion form (CrsAssertionForm.tsx:48), and COPYTRUNC' drives one at 65,536 as a real UI-reachable request.
  - Its header is written and recorded, not refused. Ordinary use reaches this.
- **Replacement words:**
```
A line with a member past a bound the reader holds (for example a CRS identifier of more than 4,096 bytes, or more than 1,024 declared geometry types) is refused `skp.session_history_unwritable` and not written, because the reader stops at the first line it refuses (ADR-036 §9).
```
- **Clause check at d2501969:**
  - *A CRS identifier of more than 4,096 bytes is past a reader bound:* in the step, `TEXT` = `S::Text(MAX_TEXT)`, `MAX_TEXT` = 4,096 (session_history.rs:500, :529, :591); in the header, `MAX_REF_STRING_BYTES` = 4,096 (dataset_ref.rs:45, :602).
  - *More than 1,024 geometry types:* `S::List(&TEXT, MAX_ITEMS)`, `MAX_ITEMS` = 1,024 (:501, :601).
  - *Refused unwritable and not written:* `reader_accepts` (:283-301) runs before `append` (:187-188), and for the header before the folder is made (:215-216). Proven by the two new tests, and by K-m1 and K-m2 below.
  - *The reader stops at the first line it refuses:* `recover_bytes` returns at the first `Err` (:821-829).

## Documentation (must be fixed before the merge, no re-gate; not the human's wording)

**D-1. The kernel index's verified line under-claims the piece's own pointers.**
- **Where:** kernel/README.md:360 reads `d5863945 (every pointer checked at that commit); the session-history row's pointers at 3dfc1a0e`.
- **Why it is short:** the piece also changes the SKP host row (:361), adds the G2 pointer (:377), the form in the preregistration list, limit 43 (:392) and the three session-history ceilings. None of these existed at d5863945.
- **Words:**
```
- **Last verified at:** d5863945 (every pointer checked at that commit); every pointer this piece adds or changes (the SKP host row, the session-history row, the `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` pointer, this piece's form in the preregistration list, limit 43 and the three session-history ceilings) at d2501969
```
- **Clause check:**
  - each named test exists and passed in my workspace run at d2501969: session_history_crash.rs, session_history.rs `tests::recovery_keeps_...`, tests/session_history.rs K1, and the G2 test;
  - KNOWN-LIMITATIONS.md:390 is item 43;
  - the constants are at session_history.rs:43-45;
  - kernel/B2-1B-RECORDING-PREREGISTRATION.md exists;
  - `record_step` is SKP's sixth command (SKP-V0 §10).
  - If E-1's round moves the head, write that head instead.

## New console statement (P6, for the human's sight)
- **The string:** `[P6 placeholder] no API equivalent exists -- Reset to default found the style already at the default, so nothing changed and no step was sent to the session history.` (surfaceRegistry.ts:190-192).
- **It is true of the code in ordinary use:**
  - It is written only when the Reset's `styleTransitions(lastCommitted, DEFAULT)` is empty (App.tsx:1912-1915), and then nothing is enqueued.
  - The panel renders only with an admitted dataset (App.tsx:2274).
  - The view's style differs from `lastCommittedStyle` only after an `onChange` with no commit (a drag that never ends in `change`), which is not ordinary use.
- **It meets the operator-text rule:** the shell states its own fact, that it sent no step.
- **No words given.**

## Notes (non-blocking)
- **N1.** At session_history.rs:245-247, `locations.json`'s trailing newline is a string literal spanning two source lines.
  - Bytes written: one LF. `.gitattributes` line 5 (`* text=auto eol=lf`) checks the file out LF, the blob holds LF (od at d2501969), and rustc normalizes CRLF in source.
  - `"\n"` would be plainer; it can ride E-1's commit.
- **N2.** The removal's own failure is dropped (:223) with no log line, the same as `end_session` (gate 1's N2).
- **N3, for the P6 sight.**
  - `{rule}` in the new `{detail}` texts is `RefParseError`'s Debug form (dataset_ref.rs:177-186). For example, an operator would see `OverCeiling { path: "$.step.dependencies.geometry_types", ceiling: 1024 }` inside O1 or O2.
  - The PR body lists `not JSON: {e}` as a detail of its own. It appears only after the `breaks a rule` prefix, and canonical output always parses.
- **N4 (out of scope, for the custodian).** MANUAL-WALKTHROUGH.md:685, the `GROUP'` row, still describes 3 identical filter queries and residential `viewport_query` rows. It has been stale since the 7b547f90 re-aim, and neither gate 1 report named it.
- **N5.** In the architect's D-1 words (kernel/README.md:277-278), the antecedent of `it` is loose, as the worker noted. `this crate` would fix it.
- **N6.** S5d on the post route: the head passed it 1 of 7 in runs 4 and 4b, the base 2 of 4, and 3dfc1a0e 3 of 4. The custodian records this. The round changes neither the tile path nor the watcher.

## Mutations I observed at d2501969
Each was applied alone by an anchored edit (the anchor checked to occur exactly once), run by its exact test name, read failing, and reverted with `git checkout`, with the porcelain shown empty. The kernel runs were in one shared hold. No `verify-mutation` run was used.

| Id | Mutation | Test | Failure seen | Matches the comment |
|---|---|---|---|---|
| K-m1 | `reader_accepts(&line, false)?;` removed (:187) | `a_step_member_past_a_reader_bound_is_refused_by_name_and_the_line_is_not_written` | :527 `called `Result::unwrap_err()` on an `Ok` value: RecordStepResponse` | yes |
| K-m2 | `reader_accepts(&header, true)?;` removed (:215) | `a_header_member_past_a_reader_bound_is_refused_by_name_and_no_record_is_made` | :575, the detail assertion: `the step line breaks a rule the reader holds, so it is not written: OverCeiling { path: "$.step.dependencies.crs.identifier", ceiling: 4096 }` | yes |
| A4 (i) | the `recordNamed` line removed (App.tsx:1915) | `A4: a Reset that changes nothing ...` | `and shows one console row: expected +0 to be 1` | yes |
| A4 (ii) | `&& transitions.length === 0` removed | same | `and shows no further row: expected 2 to be 1` | yes |
| console | `style.setFillColor` re-added to `CLASS_C_ROWS` | `style edits are class-A record_step rows` | `expected [ 'style.setFillColor', …(1) ] to deeply equal [ 'style.resetToDefault' ]` | yes |
| K-m6 (G2, mutation 1) | `linked` writes `Locator::ProjectRelative(ds.path()...)` | `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` | :847 at `recorded`: `Malformed { path: "$.resource.locators[0].at", detail: "a project-relative locator is in canonical form" }` | yes |
| K-m7 (G2, mutation 2) | `geometry_types` carries `ds.path()` | same | :886 `the history names the fixture's path` | yes |
| K-m8 (K1) | `("data", data)` dropped from `step_object` | `a_filter_step_recorded_through_record_step_reads_back_with_its_reference_dependencies_and_observation` | :160 at `recorded`: `MissingMember { path: "$.step.data" }` | yes |
| K-m9 (K12) | `crs.source().as_str()` as provenance | `each_admission_class_records_the_provenance_describe_reports` | record_step_crs.rs:86 at `recorded`: ``Malformed { path: "$.step.dependencies.crs.provenance", detail: "`file` is not one of ..." }`` | yes |
| O3 (Amendment 9 item 2) | stepRecorder.ts:85 alone reverted to `still waiting there.` | `R2: at its bound, sends nothing and reports the change as not sent` | Expected `... still waiting to be sent.`, Received `... still waiting there.` | yes |
| probe | E-1's removal taken out (`inspect_err` line) | the reviewer probe (not committed) | `a folder was left: [...]` | n/a |

E2E mutations were not run by me. Taken from run 4 at 10173747: REC-APPLY, REC-STYLE, REC-RESET and REC-CHAIN each fail at their step. After 10173747, d2501969 changes only stepRecorder.ts:85 and its unit test.

## Commands and exit codes
- `cargo test --workspace --locked --features spatial-engine/fixture`, held: 0. 106 results, 962 passed, 0 failed, 57 ignored. Both new kernel tests passed.
- `cargo fmt --all --check`: 0. The src-tauri fmt check: 0.
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, held: 0. 48 located diagnostics, **0 on the round's 206 added .rs lines**, by a matcher over the three-dot `-U0` diff. The matcher is self-tested: a planted diagnostic at kernel/src/session_history.rs:187 was reported as a hit.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`, held: 0 (67 + 2 passed).
- `npm run verify` in frontends/shell, held: 0. vitest 95 files, 1353 tests; residency trace 76; citation integrity 30.
- vitest baseline of the three changed shell test files: 0 (20 tests). It and the five single-file mutation runs were each a few seconds, unheld.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`, held: 0 (457 pass).
- `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`: all 0.
- `gh pr checks 222`: 0; 13 of 13 pass. The runs' headSha is d2501969, and the windows-latest workspace test job passed.
- Holds: three shared holds were granted and released, with no exit code from 96 to 99. Disclosure: the third hold's Bash call wrote its batch script by heredoc before the hold line. The hold line itself had no `$( )`, backtick or heredoc.

## Locks, ADRs, §7, Amendment 9 item 2
- **Lock diffs against B: 0 bytes each** (`Cargo.lock`, `frontends/shell/src-tauri/Cargo.lock`, `frontends/shell/package-lock.json`).
- **ADR-036, ADR-022 and `docs/07_Roadmap.md`:** `git diff 3dfc1a0e...d2501969` over them is empty. ADR-022 waits for Amendment 9 item 1's route.
- **§7**, by its own command, B...d2501969: 4,814 lines over 66 files (the round adds 257). Class 8, by the human's direction; not a finding.
- **d2501969:** exactly two one-line replacements, stepRecorder.ts:85 and stepRecorder.test.ts:62. With `applied` ∈ {`Filter applied.`, `Style change applied.`} (:82), the template gives the human's two strings byte for byte (the directive's line 10).
- **Order:** Amendment 8 (f603a0ab, 10:38:24+02:00) precedes 426609d9 (10:46:25+02:00). Amendment 9 (ee871e10, 13:03:27+02:00) precedes d2501969 (13:09:47+02:00). Every round commit is signed off.

## §8 for the round's lines
1. Clean: reader rules before `append` (:187, :215), one `write_all`, no buffer.
2. Clean (K-m6, K-m7): a locator holding a path is now refused before the header is written.
3. Clean: no restore, undo or replay; the Reset row applies nothing.
4. Clean: no wire change (only the doc comment in error.rs).
5. Clean.
6. Clean: the ADR and docs/07 diffs are empty.
7. Clean: reader-rule refusals reach O1 and O2. The kernel detail states the kernel's fact (`so it is not written`). The dropped removal error is N2, not a refusal.
8. Clean: no cfg, resolver or LOCALAPPDATA in the round; CI's cfg boundary job passes.
9. Clean: no new `pub`. `source?: "reset"` has its product caller at StylePanel.tsx:144.
10. Clean.
11. Clean (A2 green).
12. Clean.
13. Clean: the overrun is class 8 and §7 is unedited; no new path (66 files at both heads); the amendments precede their code; no `verify-mutation` run is called an observation; no hash pins in the round.
14. Clean: the recording.mjs quotes match run 1; the console.mjs quotes are marked elisions.
15. D-1 above.
16. The custodian's.

## What the last round (2 of 2) must change
- E-1: the Windows test and its observed mutation; the comment at session_history.rs:210-212; the PR body sentence (the custodian's).
- C-1's words at SKP-V0.md:1266, with no re-gate.
- D-1's words at kernel/README.md:360.
- N1's `"\n"` may ride along.

The test is code, so this needs a re-gate scoped to it. The words do not.

Relevant files:
- C:/dev/wt/1b/kernel/src/session_history.rs
- C:/dev/wt/1b/kernel/tests/session_history.rs
- C:/dev/wt/1b/protocol/skp/SKP-V0.md
- C:/dev/wt/1b/kernel/README.md
- C:/dev/wt/1b/kernel/src/dataset_ref.rs

Final `git status --porcelain` in C:/dev/wt/1b: empty. HEAD d25019694ae7f9025ff574ea32cb9120bed3ac49.
