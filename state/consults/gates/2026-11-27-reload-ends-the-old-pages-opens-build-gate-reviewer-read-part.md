Reviewed: the branch cut/reload-ends-the-old-pages-opens at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4 in D:/wt/reload, and the base ca57685263df8628e1b6d452e1423319a30b6596 in D:/wt/b-base for clippy, with the form at main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0 in D:/wt/read-1127c. This is the custodian's filing note, 2026-11-27: the reviewer's build gate, THE READ PART (the form's Amendment 4; ADV-2026-11-27-08 item 3), node:reload-ends-the-old-pages-opens@build-gate-reviewer-read-part; its run facts from its completion notice only (ADV-2026-11-26-02), 98 tool uses. A read part gives no verdict and takes no gate-log row. Its F1 and F2 are as ADV-2026-11-27-14 items 1 and 2 rule (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-14-bs-architect-read-part-the-thread-handle-inside-2-item-3-no-publish-rs-fix-adr-037-three-clauses-reworded.md`); its F3 to F5, with the architect's F-3, F-4 and F-6, went to the advisor as one place each. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 22153 bytes, sha256 9ffd0e2199d510d3a456801a9b6b9db4931ac25d0c57ca43c02305b288f4379a); paths under the user's profile or the scratch folder stand as <profile> or <scratch>, as handed back or as saved.

---

READ PART — cut/reload-ends-the-old-pages-opens @ 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4

No verdict is given here. The form was read at D:/wt/read-1127c (main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0), last amendment first (4, then 3, 2, 1, then §0 to §11). The code was read and run at D:/wt/reload at the head, with base ca57685263df8628e1b6d452e1423319a30b6596. Everything below is paraphrase unless it is marked verbatim. Logs are in D:/wt/reload-target/b-read/logs/.

**Summary for the custodian**
- Nothing blocks on Correctness. All 14 mutations went red where the form predicts, and every suite §10 names that starts no app is green, except clippy.
- One item goes to the advisor first, under ADV-2026-11-27-06 item 3: `Settled`'s late-close handle, which only the tests read and which §2 does not describe (F1).
- One Evidence finding is for the advisor: §10's clippy line cannot be met inside §7's Scope (F2). The lint is in publish.rs and is the same at the base.
- Three Documentation findings come with exact words (F3 to F5). None of them changes code.

## 1. The diff against §2, and ADV-2026-11-27-06 item 3's question
- `git diff --stat ca576852...7bd3bf22` printed 8 files, 1670 insertions and 17 deletions: docs/README.md, ADR-037, e2e/README.md, project.mjs, commands.rs, lib.rs, page.rs and e2e-test-surface.ts. Nothing else.
- I read the whole diff file by file.
- **`kernel/`, `engine/`, `protocol/`:** `git diff --quiet B H -- kernel engine protocol` gave rc 0, so none of them changed.
- **page.rs, item by item against §2 as gated:**
  - `InFlight`, `Waiting`, `State`, `Pages`, `Default`, `new`, `lock`, `bump` and `change` are §2 item 1. One difference in form: `Waiting` (page.rs:56-61) carries no page field. The page sits in `admit`'s local `page` and is compared in `try_admit` (page.rs:266). The behaviour is the same as §2 item 1's "page" on the entry.
  - `StopFn` and `LogFn` (92-96) and `EndParts` (101-109) are §2 item 4's parts.
  - `Ticket` and `WaitGuard` are §2 item 2. `EndGuard` is §2 items 4 and 5 (v). `LateGuard` is §2 item 3.
  - `fn cancelled` (188-190) is §2 item 2 (ii).
  - `admit` and `try_admit` are §2 item 2. `settle` is §2 item 3, with `host` and `projects` as its "…" (ADV-2026-11-27-07 item 1).
  - `forget` is §2 item 7. `page_started` is §2 item 4. `cancel` is §2 item 6.
  - `close_one` (443-454) is the means of the host's close that §2 items 3 and 5 (ii) state.
  - `run_end` (456-508) is §2 item 5. Its parts are bundled as `EndParts`, not passed as eight arguments; the content is the same.
  - **The one item §2 does not describe: `Settled` (page.rs:111-120).** `Settled::Current` is the means of §2 item 3's last sentence: commands.rs starts the poll only when it matches `Settled::Current`. `Settled::Ended(Option<JoinHandle<()>>)` carries a late-close handle that only the tests read: U-2 at page.rs:948-951, U-3 at 1011-1018 and U-12 at 1300-1302. §2 item 4 allows such a test-read handle for `page_started` only. Under ADV-2026-11-27-06 item 3 this is named here, and it goes to the advisor before anything else (F1).
- **lib.rs:** `mod page`, the `.manage(Arc::new(page::Pages::new()))` at 552, the `Started` arm at 267-274, the doc lines at 13-24 and 241-248, and `start_page_end` (190-227) are all within §2 item 8. ADV-2026-11-27-07 item 1 reads `start_page_end` as means. The four removed lines are doc text only.
- **commands.rs:** `projects_of`, `open_project`'s `host` (ADV-2026-11-27-07), `admit`/`settle` in `open_dataset` and `open_project`, `Pages::cancel` in `cancel`, `forget` in `close_dataset`, and the "no logic" doc are all within §2 item 7.
- **No other item.** Every item of page.rs and every change in lib.rs and commands.rs is inside §2 as gated, except `Settled`'s handle.

## 2. §7's count at the head
- I ran §7's command with `<merge-base>` ca576852 (Amendment 2 item 3): `git diff --numstat ca576852...7bd3bf22 -- . ':!<form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`.
- It printed 1670 / 17 / 1687 over 8 files. Per file: page.rs 1318/0, ADR-037 193/0, lib.rs 66/4, commands.rs 51/7, project.mjs 37/2, e2e/README.md 2/2, e2e-test-surface.ts 2/2, docs/README.md 1/0. That matches Amendment 3 item 1 and its table, total 1687.
- **page.rs by script on the blob at H:**
  - Lines 1-509 are 132 comment, 35 blank and 342 code.
  - The test module is 809 lines (510-1318), with 14 `#[test]` items.
  - The module doc (1-30) has 28 comment lines.
  - These match Amendment 3 items 2 to 4. The class 8 record holds, and §7 is unedited.

## 3. U-1 to U-12 mutations at the head
- I applied each mutation alone with an anchored perl script (D:/wt/reload-target/b-read/mut.pl). It requires each old span exactly once; I dry-ran all 14 first.
- In one shared hold I ran `cargo test --locked --lib page::tests` (`CARGO_TARGET_DIR=D:/wt/reload-target`), then reverted with `git checkout -- src/page.rs`. After every revert `git status --porcelain` printed nothing, and it printed nothing after the last one.
- Baseline at H: 14 of 14 page tests ok (with check 6's run).
- Results, from mut-summary.txt and each test's panic text:
  - **M-U1** (run_end: `if close_one(..)` → `if true`): U-1 is red at "the end closed the open", and U-1b too.
  - **M-U1b** (release_ended removed): U-1b is red at verbatim `the end's release_ended did not free the lock`, and U-1 too.
  - **M-U2** (`let current = true`): U-2 is red at "the open's page had ended, so a late close was expected", and U-3 too. The run took 120.28 s. By inference, U-3's held watch waited out its harness bound after the panic. It is not a timing failure.
  - **M-U3** (`let earlier = false`): U-3 is red at verbatim `an earlier page's open is in flight: the future was ready`, the second case's pending assertion as predicted. 7 tests in all.
  - **M-U4** (forget does nothing): U-4 is red at "the end stopped the poll of [..]".
  - **M-U5** (cancel_all → 0): U-5 is red at "the registered token was not cancelled".
  - **M-U6** (`cancelled()` → a binding `SkpError::protocol`): U-6 is red at verbatim `the gate's refusal is the kernel's`. U-7 and U-8 are also red (U-8 shows left "skp.gate_cancelled", right "engine.cancelled").
  - **M-U7** (gate looked up before the kernel): U-7 is red at verbatim `a bad version is refused: CancelResponse { state: Requested }`.
  - **M-U8** (no page compare): U-8 is red at "its page ended: the future was pending".
  - **M-U9** (guard decrement moved to the end of run_end): U-9 is red at "the gate is open after the panic: the future was pending".
  - **M-U10** (`.unwrap()` in `lock`): U-10 is red, panicking on the `PoisonError` at page.rs:198.
  - **M-U11** (`if false && !self.settled`): U-11 is red at "the ticket was dropped: the future was pending".
  - **M-U11b:** I removed the `let _waiting = WaitGuard {..}` construction, not the guard's retain as the worker did. U-11b is red at verbatim `a dropped admit left an entry to cancel`.
  - **M-U12** (same as M-U3): U-12 is red at verbatim `the earlier page's reopen is in flight: the future was ready`. 7 tests in all.
- **RECORDED MUTATION lines:** `grep -rn "RECORDED MUTATION\|M-U[0-9]" src/` matches only publish.rs; page.rs carries none. §4 records mutations as patch files outside the repository, so there are no source lines to compare.
- The worker report's account (b-worker-report-1.md) matches what I saw for all 14, including the counts of extra red tests.
- E-1's mutation was not run (the run part's).

## 4. §2 item 6, ADR-037, ADR-020
- `sed -n 1600,1612p kernel/src/skp.rs | sha256sum` gave ce90281111de2eb46aabd634fc0b1a8cbb4fe691cf0f3bec909106acfd9d0437. That equals Amendment 1 item 5's pin, and kernel/ is unchanged.
- `Pages::cancel` (page.rs:414-440) puts the request to `host.cancel` first and returns the version refusal unchanged through `?`. It falls through only on `Unknown` with a handle that does not parse as `StreamHandle`; otherwise it returns the kernel's answer. That matches §2 item 6 (b), and U-7 is green and red under M-U7.
- ADR-037: `sha256sum` gave 6eb341b20c68cce92e7dd2bb216bcdbe963bbe82dbce3720ff71575afebc7483 and `wc -c` gave 21775. Both equal ADV-2026-11-26-27 item 1.
- ADR-020: `git diff --stat B...H -- 'docs/adr/ADR-020*'` printed nothing. The note is absent.

## 5. ADV-2026-11-27-07 item 3
- **(a)** `settle` (page.rs:297-350) uses `host` and `projects` for the late close alone. `host.clone()` (330) and the move of `projects` into the thread (336-338) come after the two early returns at 323-324. Holds.
- **(b)** With `projects_of` giving `None`, the late close runs `close_one` and no `release_ended` (336-338). Nothing stays held that a release would free:
  - Only `Projects` takes a project lock: `ProjectLock::try_lock` is called at kernel/src/project/mod.rs:396 (in `save`) and :781 (in `open_project`), both inside `impl Projects`.
  - `save_project` and `open_project` refuse with `no per-user data directory is available` when there is no `Projects` (commands.rs:216-218, :243-246).
  - No comment or form text says this. Words are in F3.
- **(c)** No path reaches `start_page_end`'s early return (lib.rs:203-205) once setup has returned:
  - setup manages all four values unconditionally before `Ok(())`: `Option<Arc<Projects>>` at 516, `Arc<SkpHost>` at 523, `Arc<RunningPublishes>` at 549 and `Arc<Pages>` at 552.
  - `awk` over lib.rs 338-552 finds no `return` or `?`. The process-ending paths are `refuse_to_start`/`refuse_to_start_before_log`, both `-> !` (lib.rs:98, :117), and the data-plane `.expect` at 500.
  - `grep -rn unmanage src/` gives rc 1. tauri 2.11.5 has a deprecated `Manager::unmanage` (lib.rs:711-715 in the registry source), but the shell never calls it.
  - Ordinary use therefore cannot reach the return, so this is a wording matter only. Words are in F4.
- **(d)** No ADR-037 clause says more than the code at that return.
  - §3 opens "At a main-window `Started`, the binding" starts the end. §6 says the hook runs only after setup has managed the state it reads. With the return unreachable after setup, both hold.
  - Not about the return, also read: §4's late close "then runs `release_ended`" carries no "when `Projects` exists" qualifier, unlike §3 (iii). With no `Projects` there is no lock to release (point b), so nothing observable differs. Reported, with no words proposed (the ADR's text is ruled).
  - The prepare row (ADV-2026-11-26-27 item 4): the handler list (lib.rs:612-635) holds no command that closes a dialog, so "no command can dismiss that dialog" is not wider than the code.
- **§0 item 3's prepare read, confirmed:** publish.rs is unchanged in the diff. `prepare_with_query` (publish.rs:578-) calls `preflight` (kernel/src/publish/mod.rs:605-625, no fs write), `resolve_destination` (a `canonicalize`, a read) and an in-memory grant add and attempt store. No disk write.

## 6. Suites that start no app, at H
Disk: `df -m /c` read before each heavy run, lowest 41693 MB. TMP and TEMP for the cargo runs pointed at D:/wt/reload-target/b-read/tmp.
- **`cargo test --locked`** (shared hold): rc 0. The lib ran 96 passed and 0 failed (all 14 page tests and 22 `origin::tests` ok), main.rs 0, and sole_caller_scan 2 passed.
- **`cargo fmt -- --check`:** rc 0.
- **`cargo clippy --locked --all-targets -- -D warnings` at H** (shared hold): rc 101. One error, in both lib and lib test: verbatim `error: large size difference between variants` at `src\publish.rs:359:1` (`PrepareOutcome`: largest variant at least 288 bytes, second-largest at least 24). No other warning; page.rs, lib.rs and commands.rs have none.
- **The same command at the base,** D:/wt/b-base at ca576852 with `CARGO_TARGET_DIR=D:/wt/b-base-target`, as the custodian's addition asked:
  - Attempt 1 failed in the build script: verbatim `glob pattern ../../../renderer/bundle-viewer/dist/* path not found or didn't match any files.`
  - Attempt 2 failed: verbatim `` resource path `..\..\..\renderer\bundle-viewer\viewer-asset-hashes.json` doesn't exist ``.
  - **Disclosure:** between attempts I copied two gitignored build outputs from D:/wt/reload into D:/wt/b-base: `renderer/bundle-viewer/dist/` and `viewer-asset-hashes.json`. `check-ignore` names .gitignore:6 and :9. `git diff --quiet B H -- renderer` gives rc 0, so both checkouts build them from the same tree. `git -C D:/wt/b-base status --porcelain` printed nothing afterwards. It is a copy, not a build write, and it goes beyond the instruction.
  - Attempt 3 gave rc 101 with exactly the same single error at `src\publish.rs:359:1`, 288 and 24 bytes.
  - **The head fails nowhere the base does not.**
- **Whether the diff touches the enum:**
  - publish.rs is unchanged (`git diff --quiet B H -- frontends/shell/src-tauri/src/publish.rs`, rc 0). `PrepareOutcome` (359-376) and `PublishPromptData` (267-) live there.
  - kernel/, engine/ and protocol/ are unchanged, and Cargo.toml and Cargo.lock are unchanged.
  - So the diff touches neither the enum nor any type held in its variants. The lint is pre-existing at the base, as the base run shows.
- **`npm run verify`** in frontends/shell (shared hold): rc 0.
  - typecheck ok; checkDevOriginConsistency PASS; checkOriginEventName PASS; adrIndex PASS (verbatim `adrIndex: PASS -- 35 ADRs, index in docs/README.md matches every Status line`); build; check:dist-clean PASS; check:dist-notice PASS.
  - vitest: verbatim `Test Files  123 passed (123)` and `Tests  1570 passed (1570)`. The trailing node suites are 5/0 and 7/0 among them.
- **The two named shell test files:** `npx vitest run src/OriginMismatchState.test.tsx src/console/surfaceCompleteness.test.ts` gave 2 files and 21 tests passed. I did not re-run `npm ci` in renderer/bundle-viewer; node_modules were already installed, as briefed.
- **Governance scripts:**
  - CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 623 tests, 623 pass, 0 fail.
  - verify-cites PASS, rc 0.
  - verify-quotes PASS, rc 0 (173 checked, 0 hash-reference errors, 0 ruling-cite errors).
  - verify-test-claims PASS, rc 0 (1023 claims).
  - verify.mjs (verify:plan) PASS, rc 0.
  - `queue.mjs --check`: rc 0.
- **Branch CI** (`gh run list --branch cut/reload-ends-the-old-pages-opens`; `gh run view --json headSha`): Rust fmt, Ported notices, Governance CI and Product CI — shell are all success at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4.
  - Governance CI failed at 2962d546 and at the base merge; it is green at H.
  - product-ci-shell has no clippy step.
- `git -C D:/wt/reload status --porcelain` printed nothing after every run.

## 7. Seams against their actual interfaces at H
- `SkpHost::cancel(&self, req: CancelRequest) -> Result<CancelResponse, SkpError>` (skp.rs:1600). Called as `host.cancel(request)?` and `parts.host.cancel(request)`.
- `open_dataset` (skp.rs:1108). Called in `spawn_blocking` after `admit`; `begin_open` is still the kernel's (1118).
- `close_dataset` (skp.rs:1614). Called through `close_one` with `CloseDatasetRequest { skp, dataset }`.
- `Projects::release_ended(&self)` (mod.rs:259).
- `open_project_command` (mod.rs:894). It reaches `host.begin_open(cancel_key)` at mod.rs:709, so the end's cancel reaches a reopen. U-12 exercises this.
- `RunningPublishes::cancel_all(&self) -> usize` (publish.rs:1183).
- `error_of` (skp.rs:2138), used by `cancelled()`.
- `SourceWatchArm::arm(&self, &Path, WatchSink) -> ArmOutcome` (watch.rs:68), implemented by the test `TestArm`.
- `SessionLog::append(&self, &str, &str)` (state.rs:68), reached through `try_state` in the `log` closure.
- `Builder::on_page_load<F: Fn(&Webview<R>, &PageLoadPayload<'_>)>` (tauri-2.11.5 app.rs:1781-1789). A single call; the arm sits before the `Finished` filter.
- The page's keys are `crypto.randomUUID()` or `open-…` (AdmissionPanel.tsx:303), so they never take the `sh_` shape.
- Real-shape proof: U-6 (the kernel's own `engine.cancelled` from a blocked open) and U-12 (a real `open_project_command`). E-1 is the run part's.
- `git diff --quiet f73dfed3 H -- frontends/shell/e2e/project.mjs` gives rc 0, so E-1's text is unchanged since the red commit, and the red commit touches project.mjs alone.

## 8. Security posture
**My words: the diff does not change the security posture.** That rests on these lines, over ADV-2026-11-26-18 item 2's six things:
1. **The `Finished` arm and the self-check are unchanged and green.**
   - The Finished arm hashes equal: base lib.rs:216-277 = head 275-336 = fef1eedba1025c2bfa3fc28fd6bf659cf44dd0ae1d4961ab71d7ca0741742a6c.
   - The enum hashes equal: base 142-183 = head 147-188 = 70f3630a36bc3f680c828ecb6b0fcda2439344f2a39eb47552d4173b18de20bf.
   - check:origin-event PASS, 22 origin tests ok, and OriginMismatchState.test.tsx green.
2. **The arm reads only `PinnedOrigin.window_label`** (lib.rs:268-269).
3. **It writes no origin state.** No write to `PinnedOrigin` or `DataPlaneConfig`, and no call into `origin::`. A grep of the added code lines finds none.
4. **No new command or way in.**
   - The handler list hashes equal: base 550-573 = head 612-635 = 7107b546774f543bf2621c1ac4f464c851482605c64ffc817640967c5ab808a6.
   - surfaceCompleteness.test.ts is green.
   - No `listen`, bind, `register_uri_scheme_protocol` or capability among the added lines.
5. **`tauri.conf.json` and `capabilities/` unchanged.** `git diff --stat B...H -- frontends/shell/src-tauri/tauri.conf.json frontends/shell/src-tauri/capabilities/` (with Cargo.toml, Cargo.lock and tests/) printed nothing.
6. **The arm's work runs off the hook's thread and cannot stop the `Finished` arm.**
   - The end and the late close run on `std::thread::Builder::spawn` (page.rs:380-385, 331-339).
   - The hook path (lib.rs:197-227, page.rs:369-396) has no unwrap, expect, indexing, `eprintln!` or unchecked arithmetic (saturating_add; spawn errors go through `writeln!`).
   - U-9 and U-10 are green, and red under their mutations.
   - The `Finished` arm reads no `Pages` state.

## Findings

**F1 — for the advisor first (ADV-2026-11-27-06 item 3).**
- What: `Settled` (page.rs:111-120). Its `Ended(Option<JoinHandle<()>>)` handle is read only by U-2, U-3 and U-12, and is discarded by commands.rs. §2 item 4 allows a test-read handle for `page_started` only; §2 item 3 describes no return value for `settle`.
- Class: not Correctness. By the caller rule, a test-only reader does not count as a product caller, and the doc ("Only the tests read the handle") names neither the tests nor why.
- Correction: if the advisor keeps it, words only (F5). If not, the correction changes code.

**F2 — Evidence: §10's "fmt and clippy, green before either build gate" is not met.**
- What: clippy `-D warnings` exits 101 at H and at the base on the same single `large_enum_variant` at publish.rs:359. publish.rs is outside §7's Scope, and the diff does not touch the enum or its types.
- Not caused by this piece.
- Correction: it changes code outside Scope (a class 9 addition, or a separate piece on main), so it is the advisor's to rule.

**F3 — Documentation (not the human's wording): settle's doc, page.rs:294.**
- Old, verbatim: `///   the host's close, then `Projects::release_ended`, then the decrement, held by a drop guard.`
- New: `///   the host's close, then `Projects::release_ended` when there is a `Projects`, then the decrement, held by a drop guard. With no `Projects` (`setup` managed `None`), no project lock can be held, since only `Projects` takes one and `save_project` and `open_project` refuse without it, so the late close is the host's close and the decrement.`
- Clause checks:
  - "when there is a `Projects`": page.rs:336-338.
  - "setup managed `None`": lib.rs:516-521.
  - "only `Projects` takes one": the `try_lock` sites at mod.rs:396 and :781, inside `impl Projects`.
  - "refuse without it": commands.rs:216-218 and :243-246.
  - "the host's close and the decrement": page.rs:334-335 and `LateGuard`.
- No code change.

**F4 — Documentation (not the human's wording): `start_page_end`'s doc, lib.rs:190-196.** It has no sentence for its early return.
- Insert after the sentence ending verbatim ``expect`, indexing, `eprintln!` or unchecked arithmetic.``:
  `When any of the four managed values it reads is missing it returns without starting an end; `setup` manages all four (`Option<Arc<Projects>>`, `Arc<SkpHost>`, `Arc<RunningPublishes>` and `Arc<Pages>`) before it returns, and nothing in this crate unmanages them, so no `Started` handled after `setup` has returned reaches that return.`
- Clause checks:
  - The four values: lib.rs:198-205.
  - Managed before `Ok(())` with no `return` or `?` in 338-552: lib.rs:516, 523, 549, 552.
  - No unmanage: `grep -rn unmanage src/` rc 1.
- No code change.

**F5 — Documentation, only if the advisor keeps F1: page.rs:117-118.**
- Old, verbatim: `Only the` / `/// tests read the handle.`
- New: `Only the tests read the handle: U-2 (`an_open_settled_after_its_page_ended_is_closed`), U-3 (`the_gate_waits_for_ends_earlier_opens_and_late_closes`) and U-12 (`a_reopen_behind_an_earlier_pages_reopen_waits_then_opens`) join it before they assert what the late close did; `commands.rs` discards it.`
- Clause checks: the joins at page.rs:948-951, 1011-1018 and 1300-1302; commands.rs matches only `Settled::Current`.
- No code change.

**Noted only; ordinary use cannot reach either:**
- (i) `close_dataset` calls `forget` even when the host's close fails. Only a version refusal would leave the dataset open, and the page always sends `SKP_VERSION`.
- (ii) `open_dataset`'s version check now comes after the gate (`host.open_dataset` runs after `admit`), so a bad-version open waits at the gate first.

**Process notes:**
- I wrote my scripts and logs under D:/wt/reload-target/b-read/, and two temporary copies of lib.rs under Git Bash /tmp (<profile>/AppData/Local/Temp). I wrote nothing in the scratch folder.
- In the `npm run verify` hold, one `echo` of the exit code sat between the command and the release.
- No Guardian refusal, no exit code 96 to 99, no commit, push or branch change.
