*Custodian's filing note (2026-10-16): the worker-high's report for `b2-piece-1b-recording`'s correction round 1 of 2 (Amendment 8), built in C:/dev/wt/1b from 3dfc1a0e; the head 10173747ea44a22d2830a74e378e5a6db0841a39, pushed and checked by the custodian (porcelain empty; local equals origin). The run 2026-10-16T08:38:54Z to 2026-10-16T09:48:28Z by its transcript (Read 7, Bash 113, Grep 1, Write 2; the two Write calls a scratch-folder script); its one SubagentHandback call, at 09:48:27Z. Extracted by script; 17 rooted path:line cite(s) de-rooted, because they name lines on the branch: each now reads `line N of <path> (on the branch)`, and the report itself says which commit (426609d9 for the lines its mutation failures cite, its head for the rest); nothing else changed. The message's sha256 as handed back is ff1c0ab22e58a360de08ae6658b06abc17055a1e843b8016d43acd570d056558; this file's, from line 5 to the end, is 67ca1da57144407cf2a4167f2d956896dc1558b8bff04315ac7e83ecfe0bc4c3. The e2e is the custodian's, recorded separately (run 4).*

---

REPORT: node:b2-piece-1b-recording@g8, correction round 1 of 2 for PR #222. Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).

HEAD AND COMMITS (pushed, plain push, rc 0; origin/cut/b2-piece-1b-recording = HEAD)
New head: 10173747ea44a22d2830a74e378e5a6db0841a39 (on 3dfc1a0e; fetch done, head confirmed and porcelain empty before work).
- 426609d9 fix: A C-1, A C-2, A C-3 with their tests, plus R D-4 (A2's comment) and the stale expected-failure comments of K1, K12 and G2's first mutation (see Own words).
- d0d247b6 docs: the words (A C-4, A D-1 to D-4, D-6 to D-8; R D-2, D-3, D-6; the one version for the unwritable code; the words my code changes).
- 10173747 fix: a third commit you did not ask for. Clippy flagged one added line (map_err over inspect_err) in C-2's cleanup. I fixed it in a new commit because the earlier ones were already made and I used no rebase or reset. No behaviour change.
The mutations below were observed at 426609d9. The later commits do not touch the mutated lines.

CODE
A C-1 (kernel/src/session_history.rs). The reader's own member rules are now two shared functions, check_header (:926) and check_step (:935), and the reader (read_line) calls them. reader_accepts (:283) is the writer's pre-write check: the header at :215 in create, before the folder is made, and each step at :187 in record_step, before append. A refusal is skp.session_history_unwritable (no new code), and its detail names the member's path and the rule. A step refused after create leaves the header-only record, which reads back whole. U7's comment (:1263) now states what the code does.
A C-2. create (:213) makes the folder, then calls write_record (:227), which holds all the later writes. On any error, create removes the folder with remove_dir_all (:223, inspect_err). Every handle is already closed when write_record returns an error. No product seam can make a call after create_dir fail: the folder name is fresh and random, and nothing a caller supplies reaches the later calls. So there is NO test for the cleanup, and no test-only path was added. The code comment at :210 says so, and so does this report.
A C-3. StylePanel's Reset calls onCommit(DEFAULT_STYLE_STATE, "reset") (StylePanel.tsx:144). handleStyleCommit (App.tsx:1911-1915) writes recordNamed("gui-action", "style.resetToDefault") when source is reset and styleTransitions is empty. New class-C row in surfaceRegistry.ts:189, owner `docs/03 §"The action console"` (no ADR-022).
The completeness test (surfaceCompleteness.test.ts:268) keeps its purpose. It now lists every class-C row whose action starts with `style.`, other than style.togglePanelExpanded, and expects exactly ["style.resetToDefault"]. Its recorded mutation (re-adding style.setFillColor) still fails it.

NEW CONSOLE STATEMENT (A C-3), verbatim, for the human's sight (class C, action style.resetToDefault):
[P6 placeholder] no API equivalent exists -- Reset to default found the style already at the default, so nothing changed and no step was sent to the session history.
Owner: docs/03 §"The action console"

NEW TESTS AND MUTATIONS (each applied alone, run by exact name, failure read, reverted with git checkout, porcelain shown clean)
1. line 517 of kernel/tests/session_history.rs (on the branch) a_step_member_past_a_reader_bound_is_refused_by_name_and_the_line_is_not_written. It uses a fixture declaring 1,025 geometry types. It expects skp.session_history_unwritable with a detail naming $.step.dependencies.geometry_types and 1024, then reads the record back as header only and whole.
   Mutation: remove `reader_accepts(&line, false)?;` in record_step. Failure: panicked at kernel\tests\session_history.rs:526:57: called `Result::unwrap_err()` on an `Ok` value: RecordStepResponse. Reverted; porcelain clean.
2. line 551 of kernel/tests/session_history.rs (on the branch) a_header_member_past_a_reader_bound_is_refused_by_name_and_no_record_is_made. It uses an asserted CRS identifier of 4,097 bytes. It expects a detail naming $.admission.crs_assertion.identifier and 4096, and an empty store root.
   Mutation: remove `reader_accepts(&header, true)?;` in create. Failure at tests\session_history.rs:574:5, the detail assertion's message: the step line breaks a rule the reader holds, so it is not written: OverCeiling { path: "$.step.dependencies.crs.identifier", ceiling: 4096 }. Reverted; porcelain clean.
3. App.recording.test.tsx:243 A4 (Reset at the default: no step and one console row. Reset after an opacity edit: its step and no further row).
   (i) Remove the recordNamed line in handleStyleCommit. Failure: AssertionError: and shows one console row: expected +0 to be 1. Reverted; porcelain clean.
   (ii) Remove `&& transitions.length === 0`. Failure: AssertionError: and shows no further row: expected 2 to be 1. Reverted; porcelain clean.
4. surfaceCompleteness.test.ts "style edits are class-A record_step rows" (changed). Mutation: re-add style.setFillColor to CLASS_C_ROWS. Failure: AssertionError: expected [ 'style.resetToDefault', …(1) ] to deeply equal [ 'style.resetToDefault' ]. Reverted; porcelain clean.
Also observed at 426609d9, because the code fix changed where they fail (I re-worded their comments):
- G2 mutation 1 (project-relative locator holding ds.path()): now fails at the `recorded` expectation, line 843 of kernel/tests/no_generation_in_persisted_artifacts.rs (on the branch), with the refusal Malformed { path: "$.resource.locators[0].at", detail: "a project-relative locator is in canonical form" }.
- G2 mutation 2 (geometry_types holds ds.path()): fails at :882 with `the history names the fixture's path`.
- K1 (data omitted): fails at line 159 of kernel/tests/session_history.rs (on the branch) with MissingMember { path: "$.step.data" }.
- K12 (crs.source().as_str()): fails at line 86 of kernel/tests/record_step_crs.rs (on the branch) with Malformed { path: "$.step.dependencies.crs.provenance" ... `file` is not one of ... }.
For these four, after each revert I showed the mutated file absent from porcelain (a grep), not the full porcelain. The full porcelain was empty at the end.

FINDINGS, each with what I changed
- A C-1, A C-2, A C-3: above.
- A C-4: line 1261 of protocol/skp/SKP-V0.md (on the branch), the architect's words as given: "A refusal at (1) to (6) writes nothing. At the first step for an open file, (7) creates the record: its folder, `locations.json` and the history's header line; a refusal at (8) leaves that record and writes no step." I also added my own sentences (see Own words). The reviewer's C-1 words were not used.
- A D-1: line 277 of kernel/README.md (on the branch) and line 21 of kernel/src/lib.rs (on the branch), the architect's replacement verbatim. NOTE FOR YOU: her words start "Besides recording steps, ... it orchestrates", and the "it" now follows the sentence ending "hid." and reads loosely. I left it verbatim because the brief said to apply the words as given. Changing "it" to "this crate" is one word if you want it.
- A D-2: line 392 of kernel/README.md (on the branch) gained 43. The G2 pointer was added to the line at :377.
- A D-3 and R D-1: one version (Own words) in SKP-V0.md:1276 and line 117 of protocol/skp/src/v0/error.rs (on the branch).
- A D-4: line 167 of frontends/shell/src-tauri/src/commands.rs (on the branch), `dressed up as an SKP command`.
- A D-5: superseded, per the brief.
- A D-6: line 285-298 of frontends/shell/e2e/README.md (on the branch) and MANUAL-WALKTHROUGH.md:682 (the middle cell, replaced whole).
- A D-7: the paragraph in line 34-41 of frontends/shell/e2e/recording.mjs (on the branch) (header) and the paragraph at the end of e2e/README.md.
- A D-8: MANUAL-WALKTHROUGH.md:1906-1907 (AA3 and AA4 cells, as given).
- R D-2: no_generation_in_persisted_artifacts.rs (G2 comment), words changed by my code (Own words).
- R D-3: console.mjs:608, 672-674 and 683-688, as given. The CLASSC' "Revert afterwards." and mutation 2's "Revert afterwards." were left as written.
- R D-4: App.recording.test.tsx:207, as given.
- R D-6: line 360 of kernel/README.md (on the branch) and line 530 of engine/README.md (on the branch), as given.
- Not touched: ADR-022, O1 to O4 and the other strings the human saw, the form, PLAN, queue, site, PR body, A D-9, A D-10, R D-5, locks, dependencies, protocol/data-plane, the unused console.mjs helpers.

OWN WORDS (not given by a report), verbatim
1. SKP-V0.md §10.3, in the order of checks: `(8) the line's bounds, and its members against the bounds the reader holds (ADR-036 §9)` and, after the architect's sentences, `A failure at (7) removes what (7) wrote, as far as the operating system allows.`
2. SKP-V0.md §10.3, Bounds, added before the last sentence: `A line with a member past a bound the reader holds (a text of more than 4,096 bytes, a list of more than 1,024 items) is refused `skp.session_history_unwritable` and not written, because the reader stops at the first line it refuses (ADR-036 §9).`
3. The When cell (SKP-V0.md:1276): `the history could not be created (also when no per-user data directory resolves), locked or written; or the line could not be built, or breaks a rule the reader holds (a member past a bound) and is not written; after a flush failure the bytes may be in the file`
4. error.rs doc comment (:117-121): `/// `record_step` (`skp/0.12`): the history could not be created (the shell's binding also returns this when no per-user data directory resolves), locked or written, or the step's line could not be built or breaks a rule the reader holds, so it is not written; `detail` says which. After a flush failure the bytes may be in the file, so the message does not say they are not.` (wrapped at 100 columns in the file)
5. G2's comment: the reviewer's words, with the first mutation's expected failure changed to: `the writer checks the header against the reader's rules before it writes it, so `record_step` refuses it at `$.resource.locators[0].at` and this test fails at its `recorded` expectation.` Mutation 2's text is the reviewer's.
6. K1's comment (kernel/tests/session_history.rs): `Expected failure: the writer checks the line against the reader's rules before it writes it and refuses it (`MissingMember` at `$.step.data`), so this test fails at its `recorded` expectation.` K12's comment (record_step_crs.rs) gained: `the writer checks the line against the reader's rules before it writes it and refuses it at `$.step.dependencies.crs.provenance`, so this test fails at its `recorded` expectation.`
7. U7's comment (session_history.rs:1263): "... by the reader's 4,096 bytes each: a longer member is refused by name before it is written, because the writer checks each line against the reader's rules (`reader_accepts`; the integration tests ... names ...). A line whose members are each within the reader's bounds and which still passes the line ceiling is refused `skp.step_line_over_ceiling`." The first half follows the reviewer's suggestion. The second half is mine, because a list of 1,024 texts of 4,096 bytes can pass the line ceiling.
8. Source comments in the fix: the doc of `create` (:204-212, including the no-test statement), of `write_record`, of `unwritable`, and of `reader_accepts` and of check_header and check_step. The reader_accepts detail text: `the step line breaks a rule the reader holds, so it is not written: <rule>` and `the header line breaks a rule the reader holds, so it is not written: <rule>`, where <rule> is the RefParseError's own display (path and rule).
9. The test comments for the two new kernel tests and for A4 and the completeness test's added comment. The registry's header comment gained: the one row that stays is `style.resetToDefault`, for a Reset that changes nothing. The doc comments of handleStyleCommit and of StylePanel's onCommit prop describe the reset source.
10. e2e/README.md GROUP' text: the architect's words plus the grouping sentences kept from the old text, without the residential and nonce sentences. recording.mjs:34-41 header paragraph: the four mutations (REC-APPLY, REC-STYLE, REC-RESET, REC-CHAIN), each with the step it fails and the text the custodian's run 1 recorded. It ends with the E2/H2 sentence. e2e/README.md last paragraph: `E2 is row AA4. `page.fill` dispatches the native `change` event itself, so what a real colour picker's close and a real range release do in WebView2 (H2) is row AA2's to prove. Each step's recorded mutation is in the file's header, with its commit and run.`
11. line 360 of kernel/README.md (on the branch) and line 530 of engine/README.md (on the branch): the reviewer's words (engine: `the `referenced_columns` pointer at 3dfc1a0e`).

COMMANDS AND EXIT CODES
All heavy commands ran inside shared holds (the script's path as given); none returned 96 to 99.
- git fetch origin: 0.
- Disclosure: one small `cargo fmt --all` and one kernel-only test compile ran outside a hold before I began using holds. The compile failed at once with E0599 (a typo of mine). Everything after was in holds.
- Each new test's mutation (above): the Rust ones rc 101, the vitest ones rc 1, as expected. The normal runs of the two new kernel tests: pass, hold rc 0.
- cargo test --workspace --locked --features spatial-engine/fixture, held, at 10173747: rc 0. 106 binaries, 962 passed, 0 failed, 57 ignored (the base had 960; the two new tests account for the difference).
- cargo fmt --all --check: 0. Same for the src-tauri manifest: 0.
- cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture, held: rc 0 both times. The first run had 1 diagnostic on an added line (session_history.rs:223, map_err over inspect_err). After the fix, 0 on added lines, by a matcher over the three-dot -U0 diff of *.rs: 69 located diagnostics, 0 on added lines. My matcher's self-test only checks that a line known to be added is in the added set. I did not plant a diagnostic in code.
- src-tauri `cargo test --locked`, held: 0. 67 + 2 passed.
- npm run verify in frontends/shell, held: 0. vitest 95 files, 1353 tests; residency-trace 76; citation-integrity 30.
- node scripts/plan/verify-cites.mjs: 0. verify-quotes.mjs: 0. verify-test-claims.mjs: 0. Each in the foreground with a timeout of 600 s, at 10173747.
- git push origin cut/b2-piece-1b-recording (separate call, not forced): 0.
No e2e suite was run.

§7 (its command, B 31e25f15...10173747): 4,814 lines over 66 files, against 3,950 over 60 (3dfc1a0e: 4,557; the round added 257). Per group:
- Kernel product (session_history.rs 1,395, skp.rs 55, dataset_ref.rs 51, lib.rs 14, audit/log.rs 2): 1,517 against 950. OVERRUN.
- Kernel tests (session_history.rs 583, no_generation 117, session_history_crash 150): 850 against 700. OVERRUN.
- Amendment 2's own (record_step_crs.rs 158 plus the U8 and U9 spans, which I did not touch, 66): 224 against 220. OVERRUN.
- Shell product (App.tsx 107, surfaceRegistry 62, StylePanel 67, stepRecorder.ts 86, client.ts 13, types.ts 26): 361 against 320. OVERRUN.
- e2e (recording.mjs 407, console.mjs 227, package.json 1): 635 against 300. OVERRUN.
- Within ceiling: protocol product 286 (340); the shell's binding 50 (70); shell tests 392 (420); records 54 (110). e2e/README.md (45) sits outside every group. The groups I did not name were not touched by this round.
These are class 8 overruns, recorded here and not fixed.

OFF-SCOPE NOTICES (not done)
- The e2e suites that click Reset while the style is already at the default now write the new class-C row. recording.mjs's Reset follows edits, so it writes none. Check style.mjs RESET' and any console-count assertion when you run them.
- The new statement has no walkthrough row; the form and walkthrough are yours.
- The Reset row is the only class-C row with a docs/03 owner that is not "pure view state". I used the owner's section name only.

FINAL PORCELAIN in C:/dev/wt/1b: empty. HEAD = origin/cut/b2-piece-1b-recording = 10173747ea44a22d2830a74e378e5a6db0841a39.
