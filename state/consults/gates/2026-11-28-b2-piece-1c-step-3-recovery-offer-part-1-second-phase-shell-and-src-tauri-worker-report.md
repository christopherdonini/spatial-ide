# The recovery offer's Part 1, second phase (src-tauri, the shell, E-RECOVER written and ADR-037's Amendment 1): the worker's report at ffef5945 (node:b2-piece-1c-step-3-recovery-offer@part-1)

*Filed by the custodian. The worker (Sonnet, worker-high) worked in D:/wt/recov from 96c3821a and pushed ffef5945852de68bdaa9c8d90d725566823451b1 to `cut/b2-piece-1c-step-3-recovery-offer`. By the facts script its records run from 2026-11-28T05:09:16Z to 2026-11-28T06:23:42Z, and 280 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 4465902 ms and 325 tool uses. Its hand-back is below as received, with the harness indent removed: 11628 bytes, sha256 dda6920617b22a210ab293d3a59bbae346d96697cd89896867542721c70ae035.*

---

RECOVERY OFFER PART 1, SECOND PHASE (b2-piece-1c-step-3-recovery-offer@part-1-phase-2) is done and pushed. The head is ffef5945852de68bdaa9c8d90d725566823451b1 on cut/b2-piece-1c-step-3-recovery-offer, and the tree is clean. No stop condition was reached. No ceiling was passed. There was no kernel line, and no change to KNOWN-LIMITATIONS, MANUAL-WALKTHROUGH, src-tauri/Cargo.toml, Cargo.lock or package-lock.json. No app, tauri dev, vite dev or e2e suite was started, and no PR was opened.

1. COMMITS (all `git commit -s`, each pushed in its own call; they follow 96c3821a)
- 3533b972: tests red (T-1 to T-4, T-6, T-7, S-1 to S-10, the literal bumps, and the eleven-command list).
- b5aa2b47: the code. It holds the three src-tauri handlers, the shell, the R-S strings, the three class-A rows, the four refusal codes, `SKP_VERSION` skp/0.18, and ADR-037 Amendment 1 appended by script with the handler commit. It also carries the `cargo fmt` of the earlier commit's tests.
- ffef5945: E-RECOVER (`e2e/recover.mjs` and its README entry). It was checked only with `node --check` and never run.
Code, e2e and ADR were each their own commit; the order was tests red, code, E-RECOVER.

2. RED FAILURES AT 3533b972, BY NAME
- The Rust test build failed to compile with these errors:
  - `discarded_line` not found in `super` (commands.rs, T-7).
  - `recover_on_page` not found (page.rs, T-2 to T-4).
  - `recover_admitted` not found (page.rs).
  - `discard_and_log` not found (page.rs, T-6).
  - T-1 has no compile error of its own. It did not run because the crate's tests did not build.
- Vitest: 11 failed and 33 passed, with 6 files failing and 1 passing.
  - `admitDataset.test.ts`: 5 tests failed.
  - `client.test.ts`: 4 failed (the viewportQuery filter-null and filter-verbatim cases, the recordStep C1 case, and the openProject eighth-command case).
  - `saveProject.test.ts`: "save sends save_project…".
  - `surfaceCompleteness.test.ts`: "skp/client.ts's own call(...) sites are exactly the eleven named commands".
  - `App.recover.test.tsx` and `RecoveryOffer.test.tsx` failed at import because `RecoveryOffer` was missing.
  - `RefusalBlock.test.tsx` passed at red. It only bumps a literal.

3. MUTATIONS
Each was applied alone at ffef5945, run, recorded and reverted. `git status --porcelain` was empty after every revert. The scripts are `mut.mjs` and `mutrun.sh` in D:/wt/recov-logs. Every mutation failed its named test. These also failed other tests, which I note and do not treat as departures:
- T-3 (`admit("")` for the cancel key) failed T-3 `a_page_end_cancels_a_recover_in_flight_and_leaves_its_record` and also T-4.
- T-4 (null arm takes the handle arm's path) failed T-4 `a_new_pages_open_waits_for_an_earlier_pages_recover` and T-3, as the form says.
- T-7 (negated `starts_with`) failed T-7 `the_discarded_line_is_unsaved_for_an_unsaved_name_and_project_for_any_other` and T-6.
- S-1 (time omitted) failed S-1 `the_offer_names_the_file_and_the_time` and also App.recover's `a_reopen_asks_for_its_projects_record`.
- S-2 (discard not called) failed S-2 `discard_calls_the_kernel_and_drops_the_entry` and also S-10's test.

The mutations that failed only their own test:
- T-1 (`commands::discard_recoverable,` removed from `generate_handler!`) failed `the_three_recovery_commands_are_registered_and_run_off_the_main_thread`.
- T-2 (`settle` given `None`) failed `a_recover_whose_reply_arrives_after_its_page_ended_is_closed`.
- T-6 (`reply.is_ok()` to `is_err()`) failed `a_discard_that_removed_a_record_writes_one_session_log_line_naming_only_its_kind`.
- S-3 (Recover shown for not-found) failed `a_not_found_entry_offers_discard_only`.
- S-4 (intents sent through `stepQueue.enqueue`) failed `recover_applies_the_steps_and_records_none`.
- S-5 (`setProjectOffer(next.dataset)` removed) failed `a_reopen_asks_for_its_projects_record`.
- S-6 (check not shown) failed `recover_shows_the_check_it_returns`.
- S-7 (entry kept after Recover) failed `an_entry_leaves_the_list_once_recover_succeeds`.
- S-8 (Recover shown for cannot-be-offered) failed `a_cannot_be_offered_entry_offers_discard_only`.
- M-S9 (unbounded `e.skpError` text in `recover-refused`) failed only `a_refused_recover_or_a_describe_refused_after_it_logs_one_line_with_its_code_and_bounded_message_and_a_success_logs_none`.
- M-S9-D (`recover-describe-refused` level swapped for `recover-refused`) failed that same test.
- S-10 (`discard-refused` line removed) failed `a_refused_discard_logs_one_line_with_its_code_and_message_and_one_that_succeeds_logs_none`.

4. R-S1 TO R-S12
- `D:/wt/recov-logs/rs-copy.mjs` copies the 13 texts from ADV-2026-11-23-39 lines 12-23 under the "[P6 placeholder] " mark. The byte comparison printed "bytes equal" for all 13.
- Byte counts and sha256 prefixes:

| Text | Bytes | sha256 prefix |
|---|---|---|
| RS1 | 75 | 0a286f643032e90b |
| RS2 | 43 | cedc476c82f370e1 |
| RS3A | 24 | 29fa1cf36afbdbea |
| RS3B | 24 | 87e29ca348957ba3 |
| RS4 | 61 | 51cdeff95bdbff12 |
| RS5 | 127 | 8bc77aada821756a |
| RS6 | 121 | d6c20664aa8de794 |
| RS7 | 68 | f9c118f948f7dd41 |
| RS8 | 71 | 83bb31a6a9fac61c |
| RS9 | 53 | dcb7866a40c7a685 |
| RS10 | 114 | 90a194b0f63ae0f4 |
| RS11 | 95 | ac982b739174fc0d |
| RS12 | 155 | 2614e5a4d5ca9f4e |

- The ADR text was appended by `D:/wt/recov-logs/adr-amendment.mjs 2026-11-28` from the `text` fence of ADV-2026-11-28-02 (fence lines 18 to 39). The appended bytes equal the fenced text with the date filled: true, sha256 fecbea4581ea7f5b9a396aa8d395f29728724056858e60310d428e1cc616abdc. The prefix was kept, and `node scripts/adrIndex.mjs --check` passes (35 ADRs).

5. NUMSTAT (insertions plus deletions; phase 2 is 96c3821a..HEAD)

| Group | Phase 2 | Ceiling |
|---|---|---|
| src-tauri | 428 (commands.rs 211+6, lib.rs 12, page.rs 195+4) | 430 |
| shell product | 388 in 6 files | 528 |
| shell tests | 452 in 7 files | 550 |
| e2e | 298 (recover.mjs 288, README entry 10) | 300 |
| records (ADR-037) | 23 | not stated for phase 2 |

- Part 1 as a whole (97e2156d..HEAD): 4,884 lines in 46 files, against 5,200 and 47.
- src-tauri is 2 lines under its ceiling. To get there I trimmed a first 232-line commands.rs with a small `joined()` helper and shorter doc comments, before the code commit.
- The shell test and product groups include the literal bumps.

6. VERSION LITERAL (custodian item 1)
I never saw the "CI facts above" text, so this lists what changed rather than matching a fact. `skp/0.17` becomes `skp/0.18` in these places.
- At 3533b972, all in shell tests:
  - `admission/RefusalBlock.test.tsx`: 2 lines (the open_project and open_dataset `consoleRecorder.record` requests).
  - `admission/admitDataset.test.ts`: 6 lines (three `skp:` lines, the describe `request` line, and the close_dataset lines for ds_a1 and ds_a2).
  - `project/saveProject.test.ts`: 1 line (the `skp:` line).
  - `skp/client.test.ts`: 5 lines (`skp:` at three places, the `record_step` request and the `open_project` request).
- At b5aa2b47, in shell product:
  - `skp/types.ts`: `export const SKP_VERSION = "skp/0.17";` becomes `"skp/0.18"`.
- `fixtures.test.ts` and `App.colour.test.tsx` compare against `SKP_VERSION` and passed unedited.
- The only `skp/0.17` left under frontends is a historical doc comment at `admission/AdmissionPanel.tsx:220`, which I did not edit.

7. FMT (custodian item 2)
- The `cargo fmt` that fixed the red from run 46112143012 is in b5aa2b47. At ffef5945, `cargo fmt --all -- --check` and `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` both returned 0.

8. SUITES AT ffef5945 (each in its own shared hold, with `df -m /c /d` read first: C: 41,101 to 41,339 MB, D: 13,480 to 13,553 MB)
- Cargo tests of spatial-kernel and spatial-skp: rc 0, 635 passed, 0 failed.
- `cargo test --locked` in src-tauri: rc 0, 102 lib tests plus 2 more passed.
- Clippy `--all-targets` in src-tauri: rc 0 with 3 warnings, all in `src/publish.rs` and none in commands.rs, lib.rs or page.rs.
  - With `-D warnings` it fails on `publish.rs:359`, `PrepareOutcome` (large size difference between variants). That file is not mine.
- `npm run verify` in `frontends/shell`: rc 0 (typecheck, adr-index, build, dist checks and the tests). Vitest: 134 files and 1,709 tests passed.
- An earlier, pre-build full vitest run had 5 failures in notice tests (`duckdbAmalgamation` and `noticeByteIdentity`), because `generate:notice` had not run. They pass inside `npm run verify`.

9. CI AT THE HEAD (custodian item 3)
All completed with success, run once after the last push (ids as `databaseId`):
- DCO sign-off: 46114141698
- Ported notices: 46114141740 and 46114138145
- Exposure scan: 46114141736
- Rust fmt: 46114141709
- Governance CI (plan, queue, site): 46114141719
- Product CI, shell: 46114141716 and 46114138237
- Product CI, Rust workspace: 46114141701
- At b5aa2b47 there was also an Exposure scan run, 46113976767, with success.

10. DEPARTURES AND DECISIONS
- Group ceilings: the brief's figures conflicted with Amendments 20 and 21. I used the later amendment (src-tauri 430, shell product 528, shell tests 550).
- Handler shape:
  - `discard_recoverable` writes its line through `lib.rs`'s `write_host_line(app, &'static str, &'static str)`, with the text coming from `discarded_line`'s two literals. K-4 fails any product line containing `.append(` in commands.rs, so the append sits in lib.rs.
  - The T-6 coercion `&*log` to `&dyn Fn` compiled.
  - The Rust tests use the helper names `discarded_line`, `recover_on_page`, `recover_admitted` and `discard_and_log`. T-7's test name and the `discarded_line` helper differ from the form's `discarded_kind`, so the form's text and my names differ. I followed what the red tests call.
- The offer's mount listing swallows every error, through `Promise.resolve().then(() => listRecoverable(...))`. Existing `App.*.test.tsx` mocks of `./skp/client` lack `listRecoverable`, and a failed list should show no offer anyway.
- R-S4's `{components}` is read as `[...check.observed, ...check.admission].join(", ")`. `partsOf` in reopenNotices.ts is not exported and not edited.
- S-4's test is in `App.recover.test.tsx`, which is my placement choice.
- For S-3 and S-8 I mutated each branch's `recoverable: false` separately, so each mutation fails only its own test.
- A project's Recover (handle path) calls `admitRecovered` directly and takes no part in the page gate. A null-dataset Recover runs through `runAdmitPath`, with Cancel and a liveness line.
- Entry text is fixed when the list arrives, so `formatTime` is called once per entry.
- E-RECOVER (written, never run):
  - It makes three launches on one scratch `LOCALAPPDATA`: RUN-1 (open the fixture, apply the filter, commit a fill colour, kill the tree), RECOVER (the offer names the file and a time, Recover, the workspace read back, one more fill-opacity step whose `parent` is the last kept id), and DISCARD (the folder is gone).
  - Before each launch after a kill, it waits for the CDP port to be free.
  - I did not add an npm script, because package.json is outside the e2e group's files.
  - The README entry gives the command as `node e2e/recover.mjs`.
- The tauri build script needs `renderer/bundle-viewer/dist` and the shell `dist`. I built them with the repo's own build scripts before the first cargo run. `dist` is git-ignored.

11. THE THREE NEW CUSTODIAN ITEMS
- Version-literal files, lines and commits: section 6.
- Fmt corrected before the head: section 7.
- Run list after the last push: section 9.
Logs, scripts and drafts are in D:/wt/recov-logs. Nothing was written into the main checkout or D:/wt/read-1128e.
