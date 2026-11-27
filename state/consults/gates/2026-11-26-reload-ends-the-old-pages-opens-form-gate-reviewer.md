Reviewed: the form text b-form-r3-text.txt in the scratch folder, 48467 bytes, sha256 b1dd2b60 (round 1 with both architect attempts' pairs applied by script), against the code in the read checkout D:/wt/read-1126b at 77662d1ac837c56d4691b6821ffd1ece049f9da4, read only. This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 1, node:reload-ends-the-old-pages-opens@form-gate-reviewer, under ADV-2026-11-26-17 item 2. Dispatched just before 2026-11-26T21:12:27Z (date -u after the call), with its brief byte for byte (brief-b-form-gate-reviewer.md in the scratch folder, 6342 bytes, sha256 20b507ce). No message was sent to it during the run. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 45 tool uses, 877004 ms, 247501 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T21:28:06Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The scratch folder's full path is written below as `<scratch folder>` (1 place); nothing else is changed, so the filed report is not byte-identical to the saved one (19526 bytes, sha256 44fb8a2b). Verdict: BLOCK (Correctness C-1, Evidence E-1 to E-4), Documentation D-1 to D-13; 26 pairs, applied by script, giving r4 (50938 bytes, sha256 c8b6e5b7); gate-log row 915.

---

**Verdict: BLOCK (Correctness, Evidence).** Reviewed: `b-form-r3-text.txt`, 48467 bytes, sha256 b1dd2b60cf6c0715f7a06549e21b0e6377af25f0863fa3edc5395ef433a4ff64 (I recomputed it). Read checkout: detached D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4 (no branch; `git status` is clean).

Every finding closes with an exact text pair. After the custodian applies them, a narrow re-read of C-1 and E-1 to E-4 closes this gate. Nothing found changes the security posture.

## Mechanical checks

- **Hashes.** I recomputed the hash of every input the brief names: r1, r2, r3, both architect reports, the ADR-037 revision, adv-26-08/11/13/14/15/16/17/18/19/21/23/24. Each matches the brief where the brief gives one.
- **r1 to r3 replay.** I parsed the pairs out of both architect reports and applied them to r1, in order, by script.
  - r1 plus pairs 1 to 48, plus pair 49's seven deletions, is byte-identical to r2 (46748 bytes).
  - r2 plus R-1 to R-17 without R-9 (19 replacements: R-3 has two, R-14 has three) is byte-identical to r3 (48467 bytes).
  - Each old text occurred exactly once when its turn came. No other change was found.
- **Pins.** I checked 117 path:line references by script against the read checkout and the crate folders.
  - Every one resolves to an existing line. On reading, each says what the form says it does.
  - The script misread the file for some bare `:n` continuations. I checked those by hand: `:16-20` and `:17` (commands.rs); `:215-278`, `:216`, `:13-16` and `:190-214` (lib.rs); `:44`, `:54-55` and `:78-96` (checkOriginEventName.mjs); `:188` and `:193` (e2e-test-surface.ts).
  - Two pins fall short of what they cover. `lib.rs:142-176` stops at the enum's opening line, and the variants run to `:183` (E-4). `skp.rs:1126-1133` is where `OpenGuard` is built; its `Drop` is at `:977-986` (D-5).
- **Verbatim spans.** Seven checked, all matching byte for byte:
  - `lib.rs:216`, `mod.rs:265` and `reopen.mjs:248` (each the whole trimmed line);
  - `store.rs:264` and `e2e/README.md:846` (sub-line spans);
  - the reuse output, against `reuse-b-1126.txt`;
  - the advisor's log line, against ADV-2026-11-26-23 item 2's fenced block.
- **Negative searches.** I ran §0's four negative searches with exit codes and a positive control for each, and all hold:
  - no `with_browser_accelerator_keys` or `with_default_context_menus` call in tauri or tauri-runtime-wry;
  - no matching key in tauri-utils' `config.rs`;
  - no `catch_unwind` in webview2-com;
  - no scripted navigation in `frontends/shell/src`.
- **Not read.** I read nothing of tokio: it is outside the crate folders this brief opens. C-1's reasoning about `watch` comes from tokio's documented semantics as I know them. Its pair is safe either way.

## Correctness (blocking)

**C-1. The gate's wait can lose a wakeup, or deadlock the hook, under the pattern the form cites.**
- §2 item 1 asks for a watch counter "the pattern of `RunningPublishes`" and says nothing more about how `admit` waits.
- If `admit` reads the state and only then takes or arms its receiver, a bump in between is lost. The open then waits until some unrelated change, which can be never. That leaves the gate shut for that open, and only its own cancel ends the wait.
- If `admit` copies `wait_idle`'s `wait_for` (`publish.rs:1193`) and takes the `Pages` mutex inside its closure, there is a lock-order inversion. `RunningPublishes` bumps under its own mutex (`publish.rs:1096-1097`), and `wait_for` calls its closure under the channel's read lock. `page_started` would then hold the mutex on the hook's thread while it waits for the channel's write lock. The UI thread hangs (docs/01 principle 7).
- U-3's single-threaded polling cannot catch either case.

Old: `   - a `tokio::sync::watch` counter that is bumped on every change, the pattern of `RunningPublishes` (`publish.rs:1098-1102`, `:1191-1199`).`
New: `   - a `tokio::sync::watch` counter that is bumped on every change, under the mutex, the pattern of `RunningPublishes` (`publish.rs:1096-1102`, `:1191-1199`). `admit` takes its receiver by `subscribe` before its first read of the state, reads the state under the mutex, and after each read that admits nothing awaits `changed()` on that receiver and reads again, so no bump between a read and the wait is lost. It takes the mutex only between awaits, never inside a `Receiver::borrow` or a `wait_for` closure.`

**Concurrency, as asked (with C-1 applied):**
- **Can an open be admitted for an ended page?** No. The current-page check and the move to in-flight are one critical section, and `page_started` raises the page number under the mutex. ADR-037's named residual (a command the host begins after `Started`) is the only exception.
- **Can a lock stay held after its page's end?** No. A late `Opened` is counted in the same section where its in-flight entry is removed. `Projects::save` holds the `saved` mutex for the whole save (`mod.rs:304`), so the end's `release_ended` comes after any save in flight. The exceptions are a thread that does not start or that panics, which are not ordinary use (D-4).
- **Can the gate stay shut for good?** No, except while an earlier page's open never returns, which the form names. Both counters lower through guards, `saturating_sub`, under poison recovery. The `Ticket`'s `Drop` covers an unsettled entry.
- **Locks across calls.** No `Pages` lock is held across a kernel call or the `saved` mutex, by the form's stated rule (§9 item 6).
- **Panic paths on the hook.** None as planned: no `eprintln!` (the error goes through `writeln!` with its result discarded), and no `unwrap`, `expect`, indexing or unchecked arithmetic. The shell's Cargo.toml sets no `panic = "abort"`, so U-9's unwind holds.
- **The gate protects the end's cancels.** A new page cannot reuse a key the end is cancelling, because its opens wait while `ends_running > 0`.

## Evidence (blocking)

**E-1. U-4 cannot fail on M-U4.**
- The command runs the host's close and then `forget`. Under M-U4 the end closes the name a second time. That second close is refused by `unknown_dataset` (`skp.rs:1634-1636`), and `opens_closed` counts only `Ok`, so the count stays 0 and U-4 stays green.
- `stop_poll` is called for each name in the end's set whatever the close answers, so a call to it is observable under the mutation.

Old: `| U-4 `a_name_the_page_closed_is_not_closed_again` | after `forget`, the end's closed count is 0 | M-U4: `forget` does nothing |`
New: `| U-4 `a_name_the_page_closed_is_not_closed_again` | after the host's close and then `forget`, in the command's order, the end's closed count is 0 and the end calls `stop_poll` for no name. The count alone cannot fail: a second close of the name is refused by `SkpError::unknown_dataset` (`skp.rs:1634-1636`) and is not counted | M-U4: `forget` does nothing, so the end calls `stop_poll` for the name, and U-4 is red at that assertion |`

**E-2. On M-U3 and M-U12, a running end hides the mutation.**
- `ends_running` holds `admit` pending under the mutation as well as under the change. So the in-flight case of U-3, and U-12's pending check, can go red only once the end has been joined.
- U-3 also names no way to hold a late close pending. A test `ArmedWatch` whose drop blocks is one way: the host's close drops it at `skp.rs:1628-1633`.

Old: `| U-3 `the_gate_waits_for_ends_earlier_opens_and_late_closes` | each of the three holds `admit` pending (polled with `std::task::Waker::noop()`, no sleep); `admit` is ready once all three clear | M-U3: the gate ignores earlier in-flight opens |`
New: `| U-3 `the_gate_waits_for_ends_earlier_opens_and_late_closes` | each of the three holds `admit` pending while the other two are clear (polled with `std::task::Waker::noop()`, no sleep): an end held in its `log` part; an earlier page's unsettled ticket, with that page's end joined by the returned handle; a late close held in the drop of a test `ArmedWatch` (`engine/src/watch.rs:39`), which the host's close drops (`skp.rs:1628-1633`); `admit` is ready once all three clear | M-U3: the gate ignores earlier in-flight opens, and U-3 is red at the second case's pending assertion |`

Old: `then `page_started`; page 2's `admit` for the same folder is pending;`
New: `then `page_started`, and the end joined by the returned handle; page 2's `admit` for the same folder is pending;`

**E-3. U-7 does not pin which assertion M-U7 turns red.**
- Under "the binding answers first", every listed answer is unchanged unless the bad-version cancel names a key that is waiting at the gate.

Old: `a bad version gives the kernel's refusal; an `sh_` handle never matches | M-U7: the binding answers before calling the kernel |`
New: `a bad version, on a key waiting at the gate, gives the kernel's refusal and leaves that open waiting; an `sh_` handle never matches | M-U7: the binding answers before calling the kernel, so the bad-version cancel of the gate key answers `requested`, and U-7 is red at that assertion |`

**E-4. The proof's span leaves out the enum's variants.**
- The span declared unchanged, and its proof by reading (§10 named check, bullet 1), is `:142-176`. That ends at `enum OriginSelfCheckOutcome {`.
- The variants are at `:177-183`, and `check:origin-event` pins them (`RUST_ENUM_RE`, `checkOriginEventName.mjs:54-55`).

Old: `and the event constant and enum (`:142-176`);`
New: `and the event constant and enum (`:142-183`; the enum's variants, which `check:origin-event` pins, end at `:183`);`

Old: `   - Proof: a reading of the diff over `lib.rs:216-277` and `:142-176`.`
New: `   - Proof: a reading of the diff over `lib.rs:216-277` and `:142-183`.`

**§4, test by test (with the pairs applied):**

| Test | Can fail on its mutation | Writable against §2's interfaces |
|---|---|---|
| U-1, U-1b | yes | yes |
| U-2 | yes | yes |
| U-3 | yes, with E-2 | yes, with E-2 |
| U-4 | yes, with E-1 | yes |
| U-5 | yes | yes |
| U-6 | yes | yes: real `SkpHost`; `SkpError` serializes; `error_of` and `EngineError` are pub |
| U-7 | yes, with E-3 | yes |
| U-8 | yes: under M-U8, B is admitted once page 1 settles | yes |
| U-9 | yes | yes |
| U-10 | yes | yes: the tests module is in `page.rs` and can poison the mutex |
| U-11 | yes | yes |
| U-12 | yes, with E-2 | yes: `open_project` registers its key at its start, so the end's cancel answers `requested`, and either reply then frees the lock |
| E-1 | yes: M-E1 leaves the fault | yes: red at the base by `mod.rs:780-787` and `:937` |

## Documentation (must-fix before the merge)

None of the form's sentences is the human's wording, so the worker applies these with no re-gate, and the PR body lists them. The advisor's log line and ADV-2026-11-26-21's note text are untouched.

**D-1. A stale ruling cite in §6.** "(the same item)" pointed to ADV-2026-11-26-19 item 3 in r1. After pair 26 and R-12 it reads as ADV-2026-11-26-24 item 3, which says nothing of draft or completion.

Old: `before its e2e runs are made (the same item).`
New: `before its e2e runs are made (ADV-2026-11-26-19 item 3; ADV-2026-11-26-24 item 2).`

**D-2. §2 item 11 turns an obligation of ADV-2026-11-26-23 item 3 into a condition.** The ruling appends the note once the approval is on main before the documents commit, and says both gates read it. The form appends it only if both gates have read it.

Old: `(OPEN-5 (a), ruled by ADV-2026-11-26-23 item 3), and both architect gates' posture checks read the note:**`
New: `(OPEN-5 (a), ruled by ADV-2026-11-26-23 item 3):**`

Old: `      - nothing above it changes;`
New: `      - nothing above it changes;\n      - both architect gates' posture checks read the note (§10); if the approved text differs from the draft item this form's architect gate read, that goes to the advisor before the documents commit;`

**D-3. §9 item 5 could stop the piece over its own design.** The arm builds the `stop_poll` and `log` closures, and their bodies read `PoolPollTasks` and `SessionLog`.

Old: ``Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>`);`
New: ``Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>`). The `stop_poll` and `log` closures' reads of `PoolPollTasks` and `SessionLog`, made through the `AppHandle` clone when the end's thread calls them, are not reads of the arm;`

**D-4. §1's first two claims have no exception for a thread that does not start or that panics.** Neither is ordinary use, so this is named here, not blocked.

Old: `- a renderer process that ends with no navigation;`
New: `- a renderer process that ends with no navigation;\n- an end or a late close whose thread the OS does not start, or that panics: its remaining opens then stay held, as today, and the gate still opens (§2 items 3 and 4; U-9);`

**D-5. `OpenGuard`'s drop is at `skp.rs:977-986`.**

Old: `The `Ticket` is a drop guard, as `OpenGuard` is (`skp.rs:1126-1133`):`
New: `The `Ticket` is a drop guard, as `OpenGuard` is (`skp.rs:977-986`, made at `:1126-1133`):`

Old: `The precedent is `OpenGuard`, `skp.rs:1126-1133`.`
New: `The precedent is `OpenGuard`, `skp.rs:977-986`.`

**D-6. Two OPEN numberings, and three rulings cited without an item.** §0 item 6 uses the draft's OPEN numbers, and the OPEN section uses this form's. OPEN-2, 3, 5 and 6 mean different things in each.

Old: `- **Its OPEN items, now ruled:**`
New: `- **Its OPEN items, by the draft's numbering (not this form's OPEN section), now ruled:**`

Old: `  - OPEN-1, the base: closed by ADV-2026-11-26-14.`
New: `  - OPEN-1, the base: closed by ADV-2026-11-26-14 item 1.`

Old: `  - OPEN-2: ruled by ADV-2026-11-26-18.`
New: `  - OPEN-2: ruled by ADV-2026-11-26-18 items 1 to 6.`

Old: `- **OPEN-6:** ruled by ADV-2026-11-26-24 (b):`
New: `- **OPEN-6:** ruled by ADV-2026-11-26-24 item 1, option (b):`

**D-7. The red commit is narrower than the ruling.** ADV-2026-11-26-24 item 2 says "nothing of the fix". The form excludes only three files.

Old: `and holds E-1's step and `FOLDER_FOUR` in `project.mjs` and no line of `page.rs`, `lib.rs` or `commands.rs`;`
New: `and holds E-1's step and `FOLDER_FOUR` in `project.mjs` and no other line of the piece (ADV-2026-11-26-24 item 2: nothing of the fix);`

**D-8. U-1 reads as if it called `run_end` a second time.**

Old: `then `page_started` and `run_end`:`
New: `then `page_started`, and the end joined by the returned handle:`

**D-9. What `publishes_cancelled` counts.** `cancel_all` returns how many tokens are registered (`publish.rs:1182`), and that includes a token the page had already cancelled.

Old: ``publishes_cancelled` is `RunningPublishes::cancel_all`'s return, the number of registered tokens it cancelled (`publish.rs:1182-1187`).`
New: ``publishes_cancelled` is `RunningPublishes::cancel_all`'s return: the number of tokens registered when it ran, each of which it cancels, a token the page had already cancelled and that is still registered included (`publish.rs:1182-1187`).`

**D-10. The ended branch of `settle` does not say what happens with no name.**

Old: `   - **Ended page:** in that same critical section`
New: `   - **Ended page, with no name:** the in-flight entry is removed, and nothing is closed.\n   - **Ended page, with a name:** in that same critical section`

**D-11. §0 item 4 overstates "no environment variable".** The fallback `std::env::temp_dir()` at `lib.rs:329` is on that path.

Old: `- No environment variable is read anywhere on that path.`
New: `- No environment variable is read anywhere on that path, except by its fallback, `std::env::temp_dir()` (`lib.rs:329`), taken only when `app_log_dir()` fails.`

**D-12. The gate-waiting entry has no guard.** An `admit` future dropped while it waits would leave an entry that `Pages::cancel` answers `requested` for. That is not reachable in ordinary use.

Old: `In `open_project`, `admit` runs after the `Projects` check (`commands.rs:209-213`).`
New: `In `open_project`, `admit` runs after the `Projects` check (`commands.rs:209-213`). The gate-waiting entry is held by a guard of its own inside `admit`, so an `admit` future dropped while it waits leaves no entry that `Pages::cancel` could answer `requested` for.`

**D-13. The Authority list leaves out two rulings the form cites:** ADV-2026-11-26-13 item 4 and ADV-2026-11-26-16 item 7, both in Intake.

Old: `  - ADV-2026-11-26-13 items 2 and 3;`
New: `  - ADV-2026-11-26-13 items 2 to 4;`

Old: `  - ADV-2026-11-26-16 items 1 to 5;`
New: `  - ADV-2026-11-26-16 items 1 to 5 and 7;`

**Check on the pairs.** I applied all of the pairs above to r3 in order, by script. Each old text occurred exactly once at its turn, and each new text occurs once in the result. The result is 50902 bytes, sha256 c5033a1b85394b8f1baf293bdea379c30c66ef40778cf92f857d45451d80396a. That check ran before D-4's new text gained "or that panics" and "remaining", so its hash is not that of the final text. D-4's old text is unchanged, so the order and the uniqueness still hold.

## Posture (second reader)

**Nothing in §2 changes the security posture.**
- **What page script can reach.** Nothing new. `cancel` keeps the same signature, and its answers stay inside SKP-V0's three states (`SKP-V0.md:129`). A gate key's `requested` concerns the page's own open.
- **The origin rule (ADR-020 with its Amendment 1).** The `Started` arm reads only `PinnedOrigin.window_label`. It writes neither `PinnedOrigin` nor `DataPlaneConfig` and calls no origin function. No line of the `Finished` arm changes, and no second `on_page_load` is added, which would replace the first (`app.rs:1787`).
- **The command list (ADR-027).** The handler list (`lib.rs:550-573`) is unchanged.
- **docs/09's sockets.** No listener, port, scheme or capability. `tauri.conf.json` and `capabilities/` are unchanged.

## Rulings as the form carries them

- **True:**
  - ADV-2026-11-26-23 items 1 to 3, except item 3's condition (D-2). For item 2, the line's bytes, level `info`, every end, the count definitions and no identity all hold.
  - ADV-2026-11-26-24 items 1, 3 and 4, and item 2's five conditions (§6, Merge, §9 item 16), with D-7 bringing the red commit to the ruling's words.
  - The Merge line: true against ADV-2026-11-26-08 item 6 as ADV-2026-11-26-15 item 7 changes it, with ADV-2026-11-26-15 item 4 and ADV-2026-11-26-19 item 4.
  - ADV-2026-11-26-16 items 1 to 5; ADV-2026-11-26-17 items 1 to 5; ADV-2026-11-26-18 items 1 to 6; ADV-2026-11-26-19 items 2 and 7; ADV-2026-11-26-13 items 2 and 3; ADV-2026-11-26-14 item 1; ADV-2026-11-26-11.
- **Untrue as placed:** ADV-2026-11-26-19 item 3, by §6's stale "(the same item)" (D-1).

## §7, and the rest

- **§7.** The table sums to 1167 lines, or 1174 with the ADR-020 note, both within 1250. Without U-11 and U-12 the sum is 1077, so "fits the 1150" holds. The Size line's 8 files (9 under §2 item 11's condition), the Scope list and the table's distinct files agree.
- **Claims, predictions, invalidators and stops.** Sound, beyond the findings above.
  - The fourth invalidator matches ADV-2026-11-26-23 item 1.
  - The `Waker::noop` invalidator cannot trigger: the kernel already needs Rust 1.89 for `File::try_lock` (`store.rs:247`).
  - §9 items 1 to 16 are each checkable against the diff.

Files read: <scratch folder>/b-form-r3-text.txt (and r1, r2, both architect reports, adr-037-revision-report.md, the adv-26-*.md copies and reuse-b-1126.txt in the same folder); D:/wt/read-1126b at 77662d1a; the seven named crate folders.
