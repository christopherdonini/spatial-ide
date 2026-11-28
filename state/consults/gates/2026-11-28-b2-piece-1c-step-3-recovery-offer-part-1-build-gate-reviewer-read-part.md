# The recovery offer's Part 1, the reviewer's build gate, the read part, at ffef5945 (node:b2-piece-1c-step-3-recovery-offer@part-1-build-gate-reviewer-read-part)

*Filed by the custodian at the report path its brief named. The reviewer (Opus) read main at 8cc4fdd8 in D:/wt/read-1128h and the head ffef5945 in D:/wt/recov, and made its runs in D:/wt/recov-target. By the facts script its records run from 2026-11-28T07:31:50Z to 2026-11-28T09:18:06Z; 259 of its calls ran with the main checkout as its working folder, the shell's start folder, and 2 more matches are its hand-back's own text naming that folder. By its completion notice it took 6375866 ms and 267 tool uses. It gives no verdict and no gate-log row. It read main before ADV-2026-11-28-15 and the form's Amendments 27 and 28. Its hand-back is below as received, with the harness indent removed: 19760 bytes, sha256 adee981de72c31a1bff2a07a6904743acf90a13ae26ad3922e6eeacaeb9b6a73. Its words are the reviewer's.*

---

READ PART — cut/b2-piece-1c-step-3-recovery-offer @ ffef5945852de68bdaa9c8d90d725566823451b1 — main read at 8cc4fdd88f7367307ca5aebd80773baa3ad4a857 (form on main at D:/wt/read-1128h). There is no verdict and no gate-log row.

At the end: `git -C D:/wt/recov rev-parse HEAD` gave ffef5945…; `status --porcelain` was clean; `df -m` gave C: 41545 MB and D: 17637 MB. Every heavy run was in its own shared hold; no hold returned 96–99. My logs are in D:/wt/recov-logs/ as rp-*.log.

## Check 1 — the diff, 97e2156d...ffef5945
- **Command:** `git diff --numstat 97e2156d...ffef5945` gave 46 files, +4690/−194 = 4884.
- **Protected files:** a grep of the name list for Cargo.toml, Cargo.lock, package-lock.json, capabilities/ and tauri.conf.json returned rc=1. None changed.
- **§8 item 6:** `git diff 97e2156d...HEAD --stat -- frontends/shell/src/admission` shows RefusalBlock.test.tsx, admitDataset.test.ts and formatRefusal.ts (+8). AdmissionPanel.tsx is not touched. project/mod.rs is not touched.
- **Scope:** every file is inside §2.11's Scope and the amendments' additions. The kernel's `pub(crate)` widenings in session_history.rs and store.rs are disclosed in Amendment 22 item 4.
- **Wire:** skp/0.18 adds list_recoverable, recover_session and discard_recoverable. There are four `skp.recoverable_record_*` constructors in error.rs, each with the "[P6 placeholder] " prefix. RecoverSessionResponse has no path member (§8 item 1 holds). SKP-V0 adds §13–§15, "eleven" in §1 and §4, and the §10.3 clause.

## Check 2 — §7's count
- **Groups:** protocol 324, conformance 138, literal 240 (258 with the shell's literal-only files), kernel product 1405, kernel tests 1188, src-tauri 428, shell product 388, shell tests 452 (434 without the literal files), e2e 298, records 23. The whole is 4884 lines over 46 files, against 5,200 and 47: not passed.
- **Which figures bind:** Amendment 20 item 5's table binds the groups. Amendment 21 item 2 carries only the part's totals (5,200 and 47). Amendment 24 item 2 leaves the choice to the gates. Under either reading only the kernel product passes its figure: 1405 against 1,040, over by 365.
- **Class 8:** it is recorded in Amendment 22 item 2, after the code (cc435283), and §7 is not edited. So the round 25 item 2 fail-by-name does not apply. The timing departure from Amendment 10 item 6 is recorded there.

## Check 3 — the mutations, observed again at the head
Each was applied by one anchored node command that stops unless its anchor occurs exactly once, was run in a hold into a new log, then reverted by `git checkout -- <file>`; status was clean after every revert.

**Kernel** (`cargo test --locked -p spatial-kernel --lib --test recovery --test recovery_crash --no-fail-fast`):

| Mutation | Fails (where) |
|---|---|
| K-C2 | K-C2 at its own assertion, recovery.rs:309 |
| K-C3 | K-C3 at recovery_crash.rs:282 (assert); K-C19 also fails |
| K-C5 | K-C5 at :343 (assert); K-C22 also fails |
| K-C6 | K-C6 at :356 (assert); K-C27 and K-C37 also fail |
| K-C7 | K-C7 at :376 (assert); K-C26 and K-C27 also fail |
| K-C8 | K-C8 at session_history.rs:2515, the store reader's `unwrap_or_else(panic!)`, which is the test's own check; about 18 others fail too |
| K-C9 (Part 1 form) | K-C9 at :399 |
| K-C10 | K-C10 at :433; K-C15 and K-C36 also fail |
| K-C11 (two edits) | K-C11 at :298, the `code()` helper's expect_err "a refusal", which is the test's check by helper |
| K-C12 | K-C12 at :298, helper |
| K-C13 | K-C13 at :548 (assert); K-C3 at recovery_crash.rs:281 (expect); K-C21; K-C19 at recovery_crash.rs:79 (helper) |
| K-C14 | K-C14 at :560 |
| K-C15 | K-C15 at :461 (expect "listed"); K-C10 and K-C36 also fail |
| K-C16 | K-C16 at :577; K-C23 also fails |
| K-C17 | K-C17 at :587 |
| K-C18 | K-C18 at :619 |
| K-C19 | K-C19 at recovery_crash.rs:320 |
| K-C20 | K-C20 at :298, helper |
| K-C21 (two edits) | K-C21 at :657 |
| K-C22 (two edits) | K-C22 at :675; K-C42 at recovery.rs:1187 (expect, os error 33) |
| K-C23 | K-C23 at :702 |
| K-C24 = K-C41 (one edit) | K-C24 at :716; K-C41 at :860 |
| K-C25 | K-C25 at :738; K-C26 and K-C27 also fail |
| K-C26 | K-C26 at :750; K-C27 and K-C37 also fail |
| K-C27 (three edits) | K-C27 at recovery.rs:1134 (assert) |
| K-C36 | K-C36 at :801, an index-out-of-bounds panic inside the test before its own assert_eq. The test panics; there is no compile error. |
| K-C37 | K-C37 at :298, helper |
| K-C38 | K-C38 at :847 |
| K-C42 | K-C42 at recovery.rs:1180 |

**K-C1 and K-C4** (the Amendment 22 item 3 question):
- K-C1 as worded (drop `held.contains`): rc=0, no test fails. The lock probe already refuses this run's own records.
- K-C1b (plus WouldBlock→Held): K-C1 fails at recovery_crash.rs:228 (assert_eq 2 vs 1), with K-C6, K-C27 and K-C37.
- K-C4 as worded: only K-C16 fails, at :577. The dedupe's self-twin withholds the project names.
- K-C4b: K-C4 fails at :320, with K-C7 and K-C16.
- So the row's property is shown by the b forms. K-C1b shows it only together with the lock edit.

**P-1** (`-p spatial-skp --test fixtures`): `recovery_commands_round_trip_and_refuse_unknown_or_missing_members` fails at fixtures.rs:1270.

**src-tauri** (`cargo test --locked --lib`):
- T-1 fails at commands.rs:1098. It compiled, with dead-code warnings.
- T-2 fails at page.rs:1451.
- T-3 fails T-3 and T-4. The helper thread panics at page.rs:972, and the joins fail at 1472 and 1493.
- T-4 fails T-4 at page.rs:735 and T-3 via the helper.
- T-6 fails at page.rs:1509.
- T-7 (the row's Old, once) fails T-7 at commands.rs:1077, its first assertion, and T-6 at page.rs:1509. The row's set is confirmed.
- There is no T-5 test; T-5 is only an option (Amendment 17 item 3).

**Shell** (`npx vitest run --reporter=verbose src/project/RecoveryOffer.test.tsx src/App.recover.test.tsx`). All failures are at assertions; none is a compile or import error.

| Mutation | Fails (where) |
|---|---|
| S-1 | `the_offer_names_the_file_and_the_time` at RecoveryOffer.test.tsx:121; also `a_reopen_asks_for_its_projects_record` at App.recover.test.tsx:204 |
| S-2 | `discard_calls_the_kernel_and_drops_the_entry` at :134; also S-10 at :191 |
| S-3 | `a_not_found_entry_offers_discard_only` at :143 |
| S-4 (the row's `recordStep` form) | `recover_applies_the_steps_and_records_none` at App.recover.test.tsx:184 |
| S-5 | `a_reopen_asks_for_its_projects_record` at :203 |
| S-6 | `recover_shows_the_check_it_returns` at :213 |
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` at :154 |
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` at :165 |
| M-S9 | S-9 at :175, its first case |
| M-S9-D | S-9 at :185, its third case |
| S-10 | `a_refused_discard_logs_one_line_…` at :192 |

**Records against rows:**
- The comments beside the kernel and shell tests match their rows. K-C9's comment names the Part 1 form.
- The K-C1b and K-C4b forms are in the worker's report only.
- The worker's S-4 run used `stepQueue.enqueue`, not the row's `recordStep`. My recordStep form fails the same test.
- The worker's T-3, S-1 and S-2 runs also failed T-4, App.recover's reopen test and S-10 respectively. My runs saw the same.
- The src-tauri tests carry no mutation note beside them (finding H).

**E-RECOVER** (not run):
- In e2e/recover.mjs, stepRecover waits 60 s for `w.filter === PREDICATE && w.style?.fillColor === SET_COLOUR` and otherwise throws. runStep records FAIL and main sets `process.exitCode = ok ? 0 : 1`.
- So under "the shell applies no returned steps", RECOVER fails with exit 1, not VOID. Exit 2 comes only from the watchdog.

## Check 4 — the suites that start no app
| Suite | rc | Result |
|---|---|---|
| kernel + skp, `cargo test --locked` | 0 | 72 binaries, 635 passed, 0 failed, 49 ignored. The fixture feature is on through kernel/Cargo.toml:38. |
| src-tauri `cargo test --locked` | 0 | 104 passed, 0 failed |
| fmt, workspace and src-tauri | 0 | — |
| clippy, workspace `--all-targets` | 0 | 9 distinct sites. kernel/src/lib.rs:439 and :514 are in a diff file whose only change is line 83; kernel/src/skp.rs is not in the diff. None is on a changed line. |
| clippy, src-tauri | 0 | 1 site, src/publish.rs, not in the diff |
| `npm run verify` | 0 | vitest 134 files, 1709 tests; dist-clean PASS; dist-notice PASS; e2e unit 76 and 30; node 5/5 and 7/7 |
| root `node --test`, CI's globs | 0 | 623 pass |
| verify-cites | 0 | PASS over 3998 files |
| verify-quotes | 0 | PASS: 173 checked, 142 verified, 30 baselined |
| verify-test-claims | 0 | PASS: 1024 claims |
| verify-plan | 0 | PASS |
| verify-mutation `--base 97e2156d --head HEAD` | 1 | 7 of 51 new tests unnamed: commands.rs:1075 and :1090, page.rs:1429, :1463, :1484 and :1499, and surfaceCompleteness.test.ts:205 (a quote in a description breaks the parse) |

**Named green runs:**
- K-C13 `a_normal_end_after_recovery_clears_the_record`.
- T-2, T-3, T-4 and T-6 by name in rp-s-tauri.log; T-5 does not exist.
- S-9 and S-10 by name in rp-s-vitest-recovery-head.log (10/10, rc 0).

**CI:** `gh pr checks 370` shows every check passing. In `gh run list`, the red runs at 3533b972 match Amendment 24 item 3.

## Check 5 — ADR-037 Amendment 1
- Head lines 195–216 hash to fecbea4581ea7f5b9a396aa8d395f29728724056858e60310d428e1cc616abdc. That equals ADV-2026-11-28-02's fence lines 18–39 with `<date>` set to 2026-11-28.
- Tampered control (line 197's first character changed): f50d95a3…, `cmp` rc=1.
- Lines 1–193 are unchanged, and the hunk removes no line.

## Check 6 — ADV-2026-11-28-12 item 5
**(a) A refused or failed list_recoverable:**
- RecoveryOffer.tsx:146–149 is `.then(ok, () => undefined)`. Every refusal (version, unknown_dataset, session_history_unwritable when no recorder, JoinError) shows no offer, no text and no log line.
- In the kernel, recovery.rs:358 is `folder_names(root).unwrap_or_default()`, so an unreadable store root lists as empty and is not refused.
- The `ADV-2026-11-28-15` and `Amendment 27` commits on main (after 8cc4fdd8, which I did not read) appear to address this.

**(b) The bare Cancel:** RecoveryOffer.tsx:231 has `Cancel` with no P6 mark. It is a new string in this diff; the same bare word stands in AdmissionPanel.tsx:630, FilterPanel.tsx:122 and PublishDialog.tsx:297. I propose no words (P6 rule 7).

**(c) The five notice tests:**
- duckdbAmalgamation.test.ts and noticeByteIdentity read `src/generated/NOTICE.txt` and `renderer/bundle-viewer/dist/NOTICE.txt`. Both are gitignored (.gitignore:14 and :6) and are written only by generate:notice / the build (`"pretest": "npm run build"`).
- A bare vitest run before a build finds them absent. Neither the tests, scripts/ nor package.json changes between 97e2156d and ffef5945 (empty `--stat`), so the same failure occurs at both commits.
- It comes from the environment, not from the piece.

## Check 7 — ADV-2026-11-28-12 item 6
The e2e README's "Recovery offer spec" gives `node e2e/recover.mjs` but does not say:
- the folder to run it from;
- the fixture and its regeneration;
- exit 2.

See finding G.

## Check 8 — the P6 mark
- The four kernel messages and the R-S strings carry the mark.
- The new `Cancel` does not (6b).

## Check 9 — §8 Block-on-sight
- Items 1, 2, 3, 5, 6, 8, 9, 10 (K-C17), 11 (K-C23), 12 (K-C24/K-C41), 14 (K-C27), 16 (T-2/T-3/T-4), 17 (K-C42) and 18 (T-6/T-7, with `discard_and_log` logging only on `reply.is_ok()`) hold. Items 13 and 15 belong to Part 2; item 13 holds on Part 1's discard (probe before removal).
- Item 4 is hit by identifiers (finding B).
- Item 7 holds for the R-S strings.

## Check 10 — §2.9 seams
Each seam's tests are present, green at the head, and red under their own mutation (check 3):
- recover_bytes → listing and adopt: K-C1b/K-C2/K-C3/K-C15/K-C36.
- StepRecorder state → recover_session: K-C12/K-C21.
- begin_open/open_under → null arm: K-C22/K-C42/T-2–T-4.
- reopened → list(handle): K-C4b/K-C19.
- metadata → listing: K-C17.
- check → handleRecovered: K-C14/S-6.
- locations writer/reader: K-C8.
- SKP → src-tauri → client: P-1/T-1/S-2–S-4.
- Pages admit/settle: T-2–T-4.
- close_dataset refusal exit: K-C42.
- logSessionEvent: M-S9/M-S9-D/S-10.
- discard_and_log → line: T-6/T-7.

Gap: lib.rs:236–240 (`app.try_state::<SessionLog>()` then `append`) is reached by no test. T-6 calls `discard_and_log` with `rig.recording_log()`, and `grep "recovery-discarded" e2e/recover.mjs` finds nothing (finding M).

## Check 11 — departures
None changes a result I observed again. They are:
- Amendment 22 item 4: two cargo commands in one hold; K-C3, K-C18 and K-C19 changed at b5161d1b before the code, and K-C3's cut check reads kept bytes (green, and red under K-C3 and K-C13).
- Amendment 24 item 4: the worker took Amendment 21's figures, and no group passes either way. The handle-path Recover is without the page gate, by design, and makes no Pages call (T-2/T-3/T-4). There is no npm script. The notice failure is explained in 6c.
- The workers' runs in the main checkout could not be checked: I am barred from reading C:/dev/spatial-ide.

---

# Findings

## Correctness

**A. The guarantee claim at lib.rs:233–235.** "only a literal of this crate can reach the log through it" is untrue as a guarantee. A `&'static str` can be a `String::leak` or another crate's literal.
- In the shipped build no page text reaches the writer: its one caller, commands.rs:396, passes `discard_and_log`'s `"info"` and `discarded_line` literals (commands.rs:417–421).
- These are worker words (Amendment 22 item 3), not the human's. The correction is words only.
- **Old**, verbatim, three lines, `occurrences: 1` by a node split count:
```
/// Writes one line to the session log, as the page-end line is written (`start_page_end`). Both texts are `&'static str` on purpose: only a literal of this crate can reach the log
/// through it, so no text a page holds (a record name, a path, a message) can. A caller with a text that is not a literal of the crate is a stop, not a change of these types
/// (the recovery offer's form, I12 and section 8 item 18).
```
- **New:**
```
/// Writes one line to the session log, as the page-end line is written (`start_page_end`). Both texts are `&'static str` on purpose: a text a page holds (a record name, a
/// path, a message) is a `String` and cannot be passed without being leaked, and the one caller, the `discard_recoverable` handler's closure, passes `"info"` and a
/// `discarded_line` literal from `discard_and_log`. The type does not stop a leaked `String` or another crate's literal; a caller with a text that is not a literal of this
/// crate is a stop, not a change of these types (the recovery offer's form, I12 and section 8 item 18).
```
- **Clause check:**
  - "one caller": the grep for `write_host_line(` outside its definition gives only commands.rs:396.
  - "passes `"info"` and a `discarded_line` literal from `discard_and_log`": commands.rs:403–414 and :417–421.
  - "does not stop a leaked String": a language fact.

**E. The listing hides failures** (6a; ordinary use can reach it rarely). Two causes:
- the shell drops every list_recoverable rejection;
- the kernel lists an unreadable store root as empty.

The correction changes code. ADV-2026-11-28-15 on main (after the commit I read) appears to take it as class 9.

**J. `busy` can stick.** RecoveryOffer.tsx:170–172 and the discard path (`setBusy(true)`, then `await`) never reach `setBusy(false)` when `admitRecovered`/`discardEntry` rethrow a non-SkpCallError, such as a transport failure. The panel stays busy and the rejection is unhandled in onClick. This is rare. The correction changes code (a `finally`).

## Evidence

**F. E-RECOVER reports a precondition fault as FAIL.** A missing fixture, an app already listening or a port not freed all give exit 1, which looks like a property failure. The sibling suites call these VOID with exit 2. In recover.mjs exit 2 is the watchdog only, and its 1,200,000 ms default equals the three step timeouts' sum.
- FIXTURE is hardcoded under C:\dev\spatial-ide\target\fixtures\…, so a worktree run depends on the main checkout's fixture.
- The run part must read a 1 against the printed cause.
- The correction changes code in the e2e harness, or the run part's report records the reading.

**I. K-C1 and K-C4 as worded are not observed failing their named tests** (a second guard on each path). K-C1b and K-C4b are. The row's wording is for the architect or the advisor (Amendment 22 item 3). No code change.

**M. The writer's AppHandle half is unproven.** lib.rs:236–240 (`try_state::<SessionLog>()`, `append`) has no test from the real shape, and E-RECOVER does not read the `recovery-discarded` line. If SessionLog were not managed, the line would be silently absent and no test would fail. For the architect: either add a run-part check of the session log for the line, or record the gap. The correction is test or e2e code, not product code.

## Documentation (must-fix before the merge)

**B. §8 item 4.** recovery.rs names recovery "replay": `struct Replayed` (:701), `fn replay` (:739), and fields `replayed` (:672, :768, :893, :923, :976–977, :1165). The words are unruled. Proposed renames: `Replayed`→`Kept`, `replay`→`read_kept`, `replayed`→`kept_steps`. The correction changes code bytes (identifiers) with no change in behaviour, so it needs a narrow reviewer read.

**C. T-7's name.** The test is `the_discarded_line_is_unsaved_for_an_unsaved_name_and_project_for_any_other`. The form's T-7 row names `the_discarded_kind_is_unsaved_…`, and ADV-2026-11-28-01 item 2 keeps the name. Rename the test (a test-name change), or record the name by amendment.

**D. P6 rule 7.** The new `Cancel` at RecoveryOffer.tsx:231 has no mark. No words proposed. The correction is a string byte.

**G. The e2e README.**
- **Old** (`grep -c` = 1 in frontends/shell/e2e/README.md): `It exits 0 when every step passes and 1 when one fails; it is operator-run, not in CI.`
- **New:** `Run it from `frontends/shell`. It needs `target/fixtures/manual-walkthrough/filter-zoned.parquet` (regenerate: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`). It exits 0 when every step passes, 1 when one fails (a missing fixture or an app already listening among them) and 2 when its deadline passes; it is operator-run, not in CI.`
- **Checks:**
  - The regeneration text equals recover.mjs:31 `REGEN_COMMAND`.
  - "1 … missing fixture" matches recover.mjs main's `process.exitCode = 1` on `!existsSync(FIXTURE)`.
  - "2 when its deadline passes" matches the watchdog's `process.exit(2)`.
- These are worker words. If finding F is corrected in code, these words change with it.

**H. verify-mutation rc 1.** The six src-tauri tests (T-1, T-2, T-3, T-4, T-6, T-7) have no mutation note beside them, unlike the kernel and shell tests. surfaceCompleteness.test.ts:205 is a parse artifact. The correction is comment bytes in test files. verify-mutation is not a CI step.

**K. Kernel class 8 recorded after the code** (Amendment 22 item 2). It is recorded and §7 is unedited; this is noted for the merge check only.

**Nit.** SKP-V0 §10.3: "…; Outside §14, …". The capital after a semicolon should be "outside".

**Code changes:** A, G and K change no code. B, C, D, E, J, F (if corrected in the harness), H (comments) and M (tests) change code bytes.

**Paths:**
- D:/wt/recov/frontends/shell/src-tauri/src/lib.rs
- D:/wt/recov/frontends/shell/src-tauri/src/commands.rs
- D:/wt/recov/frontends/shell/src/project/RecoveryOffer.tsx
- D:/wt/recov/kernel/src/recovery.rs
- D:/wt/recov/frontends/shell/e2e/recover.mjs
- D:/wt/recov/frontends/shell/e2e/README.md
- logs: D:/wt/recov-logs/
