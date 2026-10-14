STAGE 2 REPORT, node:b2-piece-1b-recording@g4. Worktree C:/dev/wt/1b, branch cut/b2-piece-1b-recording, base B = 31e25f15a8639fe69f843b1802034ea27d76b0fa. Stage 1 head aa1d0d06 was confirmed first (git fetch; head matched; porcelain empty). Final head = origin = 936b7982deea6f32ad6c21a824f15c068a425a50. `git status --porcelain` is empty. Each commit was published as an ordinary non-forced update in its own Bash call. I ran no e2e suite, edited no PLAN/queue/site file, touched no lockfile, and killed no process.

0. FIRST THING FOR THE CUSTODIAN (an existing e2e suite will break; I did not edit it)
- frontends/shell/e2e/console.mjs asserts, in step CLASSC', that a real style edit produces a class-C console row whose owner contains "ADR-022" (stepClassC, a few lines after the "CLASSC'" doc comment). The form removes those five class-C rows, so CLASSC' will FAIL by design. The minimal fix: assert a class-A record_step row after the fillColor edit.
- GROUP' (same file) calls queryWithFilter 3 times and asserts adjacent identical viewport_query rows coalesce into a x3 group. Each issued Apply now also records a class-A record_step row, so the rows interleave and GROUP' will probably fail ("grouping not exercised"). ECHO' and TWOCMD' may also be affected. I did not run them.
- The form declares every existing e2e suite unchanged (section 5), and section 4's exception ("the console's style rows") does not name e2e files. console.mjs is outside section 2.13 and the brief, so I left it. This is an I3 candidate: your ruling.

1. COMMITS (all signed off, with the Co-Authored-By and Claude-Session trailers)
- 075346bd feat: B2 piece 1b, the shell's binding (commit 5): record_step on spawn_blocking, the recorder at setup, end_session on the normal exit event
- 518da400 feat: B2 piece 1b, the shell (commit 6): the step queue, the commit signals, the five style rows in class A, and C1, R1, R2, A1 to A3
- 936b7982 feat: B2 piece 1b, the e2e suite, the walkthrough Part AA, KNOWN-LIMITATIONS item 43 and the e2e README entry (commit 7)

2. WHAT WAS BUILT, against the real interfaces
- Binding (src-tauri, 48 lines against 70):
  - `record_step` command: spawn_blocking over `StepRecorder::record_step`, as viewport_query does.
  - Managed state is `Option<Arc<StepRecorder>>`, built in setup where SkpHost is built, from `default_root()` and `host.clone()`.
  - When the data directory does not resolve, the command refuses with `SkpError::session_history_unwritable("no per-user data directory is available")` and never drops the step.
  - `end_session()` runs on `RunEvent::Exit`. H5 read of the hook as the base has it: a normal close or a publish drain reaches Exit through ExitRequested (the drain's `app.exit(0)` re-enters it); a crash or a forced end never reaches Exit. That is what leaves the history. I updated the comment that said Exit was not handled.
  - Cites: kernel/src/session_history.rs default_root (line 132), StepRecorder::new (137), record_step (149), end_session (194).
- Shell:
  - skp/types.ts: `StepIntent`, `StyleSetParams`, `RecordStepRequest`, `RecordStepResponse`.
  - skp/client.ts: `recordStep(dataset, intent)`, sent as given with `skp: SKP_VERSION`.
  - workspace/stepRecorder.ts: a queue with one call in flight and MAX_PENDING_STEP_RECORDS = 64.
    - The head stays in the list until its call settles, so the pending count includes the one in flight.
    - The drain loop has `try/catch/finally` per step, so a failed send or a throwing `report` never leaves the head stuck or the loop wedged.
    - Exit path of the queue: it holds no process state. The step lines are written by the kernel before the reply; nothing is buffered in the shell.
    - Bound: the 65th pending step is not sent, and `report({kind:"not-sent", waiting})` is called at once.
  - App.tsx:
    - `commitActiveFilter` enqueues `filter.apply` after an issued outcome, using `admittedDatasetRef.current`. The e2e hook routes through it too.
    - The admission reset goes through no commit and records nothing.
    - `handleStyleCommit` diffs `styleTransitions(lastCommittedStyle, next)` and enqueues each transition.
  - StylePanel.tsx:
    - New `onCommit(next)` prop, fired from the native `change` of all four controls and from Reset, never per tick.
    - The next style is the control's own `el.value` over the style as of the commit. It does not depend on React having rendered the last tick; Playwright's `fill` dispatches input and change in one task.
    - The five `recordNamed` calls for the style rows are removed. The disclosure toggle stays class C.
  - console/surfaceRegistry.ts: the five style rows leave class C; `record_step` is a sixth class-A row; comments now count six.

3. STRINGS THE APP CAN SHOW THAT THIS STAGE ADDS (byte for byte), with clause checks
- O1 (filter): `Filter applied. The session history did not confirm keeping it: {message}`
- O2 (style): `Style change applied. The session history did not confirm keeping it: {message}`
- O3 (style): `Style change applied. It was not sent to the session history: {n} earlier changes are still waiting there.`
- O3 (the filter's counterpart, a fourth string the form implies): `Filter applied. It was not sent to the session history: {n} earlier changes are still waiting there.`
- Clause checks for O1 to O3, all in `noticeText` (stepRecorder.ts), exercised by A3 (O1 text byte-for-byte in the DOM) and R2 (the filter counterpart of O3 byte-for-byte):
  - The report is made only after the change was applied: the record follows the issued commit, and style `onChange` precedes `onCommit`.
  - "Did not confirm" is reported for every failure of a send: all kernel refusals, a stopped or full history, the style refusal, a transport failure.
  - `{message}` is `skpError.message` (the kernel's own text, no code), else `Error.message`.
  - `{n}` is the queue length at the bound.
  - The notice is non-dismissible and shown only for the dataset it names. It is also logged through `logSessionEvent` as `step-record-not-confirmed` / `step-record-not-sent` plus the same text, so it is never silent.
- Binding refusal (new detail text inside the kernel template): `this step could not be written and flushed to the session history: no per-user data directory is available`. Check: returned only when `default_root()` was `None` at setup; it states a fact and does not claim whether anything was written.
- The `skp.record_step_panicked` message is the join error text, as the other commands do. No new prose.
- Removed, not reworded: the five class-C statements "no API equivalent exists -- ... is local StylePanel state, never sent to the kernel." They would be untrue now.
- Docs, not app strings: Part AA rows (the form's X0 to X4 with drafted Expected cells), KNOWN-LIMITATIONS item 43 (the form's section 2.10 L text, byte-copied by script, number set to 43, equality checked by script), and the e2e README entry.

4. RUNS (exit codes printed; held runs used `hold shared -Project SpatialIDE`; CARGO_TARGET_DIR=D:/wt-targets/1b, CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8)
- `npm ci` in renderer/bundle-viewer (held): rc 0.
- `npm ci` in frontends/shell (held): rc 0.
- `npm run verify` in frontends/shell (held), twice: at the tree of 518da400, and again at the final head 936b7982. Both rc 0.
  - Typecheck, dev-origin, origin-event and adr-index checks, build, dist-clean and dist-notice checks all pass.
  - vitest: 95 files, 1352 tests passed, 0 failed.
  - residency-trace: 76 passed. citation-integrity: 30 passed.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` (held), run once on the tree whose Rust is byte-identical to 075346bd: rc 0. Lib unit 67 passed, sole_caller_scan 2 passed, 0 failed.
  - The first attempt of this command exited 101: the tauri bundle resource glob renderer/bundle-viewer/dist/* did not exist yet (the viewer is built by `npm run verify`'s prebuild). It was an environment prerequisite, not a code failure.
  - That attempt kept compiling libduckdb-sys for about 19 minutes and held the target's build-directory lock, so the second attempt waited on it. I did not kill it; it exited by itself.
- `cargo fmt --all -- --check`: rc 0. `cargo fmt --check --manifest-path frontends/shell/src-tauri/Cargo.toml`: rc 0. Both re-run at the final head.
- `node --check frontends/shell/e2e/recording.mjs`: rc 0 (at head).
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS (1911 files). `verify-quotes.mjs`: rc 0, PASS (121 checked, 90 verified). `verify-test-claims.mjs`: rc 0, PASS (563 tests claimed). All run in the foreground after staging the new files. `verify-quotes --show-cites` on my four changed docs/e2e files lists no failure on any line I added; its FAILs are pre-existing baselined quotes in MANUAL-WALKTHROUGH.md.
- Unheld light runs, disclosed: targeted vitest runs. The very first had default workers and 7 "Failed to start forks worker" timeouts; I re-ran with --maxWorkers=2 and it was fine. These are the 7 mutation runs below (--maxWorkers=1) and `npm run pretypecheck` (an esbuild viewer build). I record the worker-start timeouts as an unheld, load-related event, not as a test failure.
- Lock diffs against B (`git diff B...HEAD -- <file>`): Cargo.lock 0 bytes, frontends/shell/src-tauri/Cargo.lock 0 bytes, frontends/shell/package-lock.json 0 bytes, protocol/data-plane 0 bytes. All empty.

5. NEW TESTS (7) AND THEIR MUTATIONS, all observed at 518da400
Each mutation was applied alone to a clean tree, the test was run by its exact name, the tree was reverted with git checkout, and the porcelain was shown empty after each.
- C1 `C1: recordStep sends record_step with the version and the typed intent` (client.test.ts). Mutation: `skp: SKP_VERSION` omitted from recordStep. Failed by name: `AssertionError: expected [ [ 'record_step', …(1) ], …(1) ] to deeply equal ...`.
- R1 `R1: sends one record at a time, in commit order` (stepRecorder.test.ts). Mutation: `await deps.send(...)` replaced by `void deps.send(...)`. Failed: "only the first is in flight: expected [ …(3 steps) ] to deeply equal [ one ]".
- R2 `R2: at its bound, sends nothing and reports the change as not sent`. Mutation: the MAX_PENDING_STEP_RECORDS check replaced by `if (false)`. Failed: "expected [] to have a length of 1 but got +0".
- A1 `A1: an issued Apply records one filter.apply; a refused Apply and the admission reset record none` (App.recording.test.tsx). Mutation: the enqueue removed from commitActiveFilter and put in handleApplyFilter before `applyFilter(...)` (the record moved before it resolves). Failed: "a refused Apply records none: expected [ { …(2) } ] to deeply equal []".
- A2 `A2: a style drag records one style.set at release, not one per tick`. Mutation: the enqueue moved from handleStyleCommit into handleStyleChange (per tick). Failed: "no step while the drag is live: expected [ { …(2) } ] to deeply equal []".
- A3 `A3: a refused record shows the owner's notice with the kernel's message`. Mutation: the failed-send report removed in `drain`. Failed: "expected undefined to be 'Filter applied. The session history d…'".
- Console `style edits are class-A record_step rows` (surfaceCompleteness.test.ts). Mutation: `style.setFillColor` re-added to CLASS_C_ROWS. Failed: "expected [ 'style.setFillColor' ] to deeply equal []".
- No `verify-mutation` run was used as an observation. The Rust binding has no new Rust test (the form lists none for it).

6. THE E2E SUITE e2e/recording.mjs (`npm run e2e:recording`), not run by me
- It sets LOCALAPPDATA to a fresh scratch folder in its own env before `lib.mjs` spawns the app, so the store is <scratch>\spatial-ide\sessions. It refuses an app it did not launch. The scratch is removed after a pass and kept after a failure.
- Steps:
  - OPEN: openPath of filter-zoned.parquet.
  - APPLY: the real panel applies `zone = 'residential'`; then 1 record_step console row at "ok".
  - STYLE: fill opacity `0.37`, then fill colour `#112233`; rows reach 2, then 3, all "ok".
  - RESET: the Reset button commits the default style; 2 more rows, 5 in all.
  - RECORD (E1): `session.stop()` kills the tree; it polls until the lock is freed and the file reads. A live history is locked, which is why the suite waits on console rows, not on the file. Then it asserts:
    - one `unsaved-<32 hex>` folder;
    - a header of format spatial-steps, purpose session-history, actions 2, one dataset;
    - 6 lines, with the steps chained and each naming the header's `logical_uri`;
    - the filter step carrying the predicate and `dependencies.fields` naming `zone`;
    - style steps 2 and 3 as fillOpacity and fillColor `#112233`;
    - Reset's two steps (fillColor `#4285f4`, fillOpacity);
    - `locations.json` naming the same dataset.
- H6 handling: each recorded opacity is compared bit for bit with the value the shell applied (`Number(el.value)`; and `180/255` for Reset). A mismatch fails RECORD with both bit patterns and the distance in ulps, and I do not widen a tolerance. I added the Reset commit because `0.37` is a 2-decimal value that cannot drift, while Reset sends the one 16-digit double the product sends (the real probe). serde_json is used without `float_roundtrip`; I could not enable it (it would change a lockfile). No drift is predicted for 2-decimal values.
- E2 (a normal close removes the record) is not a step. H5 FAILS (class 2): lib.mjs stops an app only with `taskkill /T /F`, no suite closes a window, and the capability set (core:default) gives the page no close. Row AA4 of Part AA carries E2, as the form's fallback provides.
- Mutations for you to observe (custodian):
  - APPLY: remove the `stepQueue.enqueue` line from `commitActiveFilter` (App.tsx). It fails at "expected 1 record_step rows, all ok; saw []".
  - STYLE: remove the enqueue loop in `handleStyleCommit`. It fails after the 30 s poll at 2 rows. This is the form's "the style commit does not enqueue".
  - RESET: remove `onCommit(DEFAULT_STYLE_STATE)` from `handleReset`. It fails waiting for 5 rows.
  - RECORD (chain): make the kernel write `parent` always null (K4's mutation). It fails "step 2 does not chain".
- Assumptions I could not run (the first run will test them):
  - `.console-entry-header` reads exactly "record_step" and `.console-outcome` reads "ok".
  - `page.fill` on the range and colour inputs dispatches input then change.
  - Overriding LOCALAPPDATA for the whole `tauri dev` tree does not break the launch (WebView2 profile, npm cache).

7. SECTION 7, by the counting command at head (insertions plus deletions, each file once, B...HEAD, excluding the form, PLAN, queue, site, docs/README and the lockfiles; my script is scratchpad w1b2-count.mjs)
| Group | Count | Ceiling |
| --- | --- | --- |
| docs/07 | 2 | 12 |
| ADRs | 54 | 130 |
| protocol product | 283 | 340 |
| wire fixtures and protocol tests (13 files) | 259 | 260 |
| version literal (admitDataset.test.ts 8 plus 77 in protocol files) | 85 | 160 |
| kernel product | 1445 | 950 |
| kernel tests (3 files) | 764 | 700 |
| record_step_crs.rs (+ U8/U9 span 66 = 222) | 156 | 220 |
| the shell's binding (commands.rs 28, lib.rs 20) | 48 | 70 |
| shell product, six files | 348 | 320 |
| shell tests, four files (App.recording.test.tsx 238, surfaceCompleteness 26, client.test.ts 36, stepRecorder.test.ts 64) | 364 | 420 |
| e2e (recording.mjs 398, package.json 1) | 399 | 300 |
| records: kernel/README.md 16, MANUAL-WALKTHROUGH.md 25, KNOWN-LIMITATIONS.md 3 | 44 | 110 |
| engine | 59 | 160 |
| outside every group: three existing tests edited by one line each (5 lines), e2e/README.md (16) | 21 | n/a |
| **Total, 65 files** | **4331** | **3950, 60 files** |
- Over: kernel product, kernel tests, shell product (+28), e2e (+99), the 222-line Amendment 2 span (+2), the total (+381) and the file count (65 against 60). All class 8; I did not edit section 7.
- Record correction owed (Amendment 4): the stage 1 report's total of 3156 counted the two `v0-record_step-request-*.json` fixtures (27 lines) in both the wire group and the version-literal group. The true stage 1 total is 3129 over 47 files (git diff --stat agrees). Its version-literal figure was 91, not 118. My table counts each file once.

8. DEVIATIONS FROM THE FORM (class is my proposal; yours to rule)
1. Part AA, not X: every letter A to Z is in use at B, as you said. The rows are the form's X0 to X4 renamed, with drafted Expected cells (marked as drafts). Class 3 (a name).
2. H5 fails, so E2 is carried by AA4 (above). Class 2.
3. The "existing Notices surface" is NoticesPanel, a collapsed disclosure of the shipped third-party notice text, not a status surface. I put the owner's notice in the attention strip, as a second element inside the `attention.canvasRefusal` slot of App.tsx, beside canvasRefusal and never replacing it. No layout file was changed, and there is no new console row because it is non-dismissible. Class 2.
4. Existing tests edited outside section 2.13's list (I3 candidates; section 4's exception names only "the console's style rows"):
   - surfaceCompleteness.test.ts: the derived command set is six. The form calls this test "extended", so the five-to-six edit is inside the test I was told to extend.
   - consoleLanguage.test.ts and consoleViewModel.test.ts, one literal each: "style.setFillColor" becomes "style.togglePanelExpanded". They failed once the row left class C.
   - renderTruth.test.ts, +1 line (`record_step: ["skp","dataset","intent"]` in REQUEST_KEY_SETS). Stage 1's new record_step request fixtures made it fail, and its own message says "add one".
5. e2e/console.mjs is not edited and will fail (see 0). I3.
6. E1 also commits Reset, so the history is a header and five steps, not three (H6 probe). Class 2, inside my own file.
7. e2e/README.md gains a Recording spec section (16 lines): my reading of "the indexes". The path is not in section 2.13. I did not touch the kernel/engine owner's indexes (a post-merge job).
8. The binding's `Option<Arc<StepRecorder>>` and its no-data-directory refusal are not in the form. Class 2.
9. Overruns (section 7 above). Class 8.
10. package.json: one `e2e:recording` script line; no dependency or lockfile change.

9. PRE-GATE SELF-CHECK (the four failure classes)
- Cross-module code uses the other side as it is: cited in section 2. The seam test is A1 to A3 through the real App and the real queue; the end-to-end test from the real shape is E1, which I did not run.
- Every completion claim points to evidence: the runs and mutations above.
- Every user-facing message describes behaviour implemented at this commit: section 3.
- Each required test reaches its intended assertion, not its setup: each mutation failed at the named assertion line above.

10. NOTICED AND NOT DONE
- A Reset when the style already equals the last committed style records nothing, and the console now shows nothing for it (the class-C row is gone).
- A step enqueued for a dataset that is closed before its call is sent is refused by the kernel (unknown_dataset). The notice is shown only for the current dataset; it is always logged.
- There is no automated test of the exit hook wiring (`RunEvent::Exit` to `end_session`); only K6 (kernel) and row AA4 (manual) cover it. A normal-close helper in lib.mjs (for example WM_CLOSE to the app's own pid) would let E2 be a step.
- `lastCommittedStyle` is app-wide, not per view or per dataset (style persists across reopen).
- The kernel holds the records mutex across write plus fsync; `end_session` at Exit waits for an in-flight step (bounded by one fsync).
- The 27-line double count in Amendment 4 (section 7).
- The scratchpad is shared with the custodian's files: I used a w1b2- prefix and touched nothing of theirs (one "file not read" error on a name that already existed made me change names).

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff received or produced.
