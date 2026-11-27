Reviewed: the form text b-form-r1-text.txt in the scratch folder, 39634 bytes, sha256 08705b25d3725bddd35c1874a32ae0f05be6b0ecbbf9d5db920c19e4335f519f (the author's round 1, on main as `state/drafts/reload-ends-the-old-pages-opens-form-architect-round-1.draft.md` at 2b4e5f5a), against the code in the read checkout D:/wt/read-1126b at 77662d1ac837c56d4691b6821ffd1ece049f9da4, read only. This is the custodian's filing note, 2026-11-26: the architect's form gate, attempt 1, node:reload-ends-the-old-pages-opens@form-gate-architect, under ADV-2026-11-26-17 item 2. Dispatched just before 2026-11-26T20:49:18Z (date -u after the call), with its brief byte for byte (brief-b-form-gate-architect.md in the scratch folder, 6888 bytes, sha256 e7b30f02). One message was sent to it during the run, before 2026-11-26T20:56:45Z: ADV-2026-11-26-23, to judge OPEN-1, OPEN-4 and OPEN-5 as ruled. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 83 tool uses, 866463 ms, 268790 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T21:03:09Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The report below is byte-identical to the saved one (28669 bytes, sha256 981770e6). Verdict: BLOCK (Correctness C-1 to C-7, Evidence E-1 to E-4), Documentation D-1 to D-8; the posture unchanged (ADV-2026-11-26-18 item 3); 49 pairs, applied by script, giving r2 (46748 bytes, sha256 4f848ac9); OPEN-6 raised and ruled by ADV-2026-11-26-24; gate-log row 911.

---

**Verdict: BLOCK (Correctness, Evidence).** I reviewed `b-form-r1-text.txt` (sha256 08705b25d3725bddd35c1874a32ae0f05be6b0ecbbf9d5db920c19e4335f519f) against the read checkout D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4. OPEN-1, OPEN-4 and OPEN-5 are judged as ADV-2026-11-26-23 items 1 to 3 rule them. Every finding below is fixed by an exact text pair. Some of them change what the code will do, so the wording-blocks shortcut does not apply to those. A narrow re-read of the applied pairs closes this gate.

## Posture check (ADV-2026-11-26-18 item 3)

**The piece as planned does not change the security posture.** §9 item 1's stop is not triggered.

What that rests on in the form:
- §2 item 8: the arm reads only `PinnedOrigin.window_label`, writes neither `PinnedOrigin` nor `DataPlaneConfig`, and calls no origin function.
- §1 "Declared unchanged": `tauri.conf.json`, `capabilities/`, `Cargo.toml`, `Cargo.lock` and the handler list are unchanged.
- §9 items 3 to 5, and §10's six bullets.

What it rests on in the code at 77662d1a:
- The origin is pinned once in `setup()` (`lib.rs:400-440`). The hook only asserts against it (`lib.rs:215-278`; ADR-020 Amendment 1, "Assertion, never selection").
- The handler list is `lib.rs:550-573`. ADR-027 decision 4 is not touched, because no command is added.
- No new socket, so docs/09 "Local listening sockets" is not touched. Nothing under `protocol/` changes.
- The new work only closes opens, cancels tickets and cancels publishes. Page script can already reach each of those through `close_dataset`, `cancel` and `binding_publish_cancel`.
- The log line is composed by the host and carries no token (`state.rs:29-34`).

Under OPEN-5 (a), I also read ADV-2026-11-26-21 item 5's note against the plan. Each of its clauses is true: a second arm on `Started`, and the self-check unchanged and still on `Finished` only. The note changes no mechanism. It is red-line text in the human's words.

**ADV-2026-11-26-18 item 2, each of its six things against the form's proof:**
1. Sound: a byte reading of the `Finished` arm (`lib.rs:216-277`) and of `:142-176`. The new arm is inserted above `:216`, so the build gate compares bytes, not line numbers. The named tests exist: `origin.rs:244-245`, `OriginMismatchState.test.tsx`, and `checkOriginEventName.mjs`'s patterns at `:44`, `:54-55`, `:78-96`.
2. Sound only after C-6 below.
3. Sound.
4. Sound.
5. Sound.
6. Sound only after C-1 and C-5. As written, the "no panic path" reading is false: the spawn error goes to stderr by `eprintln!`, which panics when the write fails. And `page_started(app)` cannot be the function U-9 and U-10 call.

## Correctness

- **C-1 (cross-module seam; a test encoding an imagined interface).** §2 item 4 has `page_started(app)`. §4 says the U tests cannot run tauri's mock runtime, yet U-1, U-2 and U-8 to U-10 call `page_started`, and no test can hold an `AppHandle`. Also, `SessionLog` is not Clone and is managed by value (`state.rs:35-38`, `lib.rs:466`), and the `Finished` arm reads it by that type (`lib.rs:225`).
- **C-2 ("constant time" is untrue as planned).** The hook loops over the page's entries: "takes … its in-flight keys and its gate-waiting entries" and "sets each gate-waiting entry's flag". ADR-037 §3 item 1 requires constant time. Fixed by cancelling a gate-waiter when its page is no longer current, and by having the end's thread read the keys.
- **C-3 (the gate can open between an in-flight removal and the late close).** §2 item 3 does not put the removal and `late_closes_running += 1` in one critical section. Without that, the reopen is refused, which is the fault again (ADR-037 §5).
- **C-4 (a leaked ticket holds the gate forever).** `open_project` returns early when `Projects` is `None` (`commands.rs:209-213`). If `admit` runs first, or any path skips `settle`, the in-flight entry stays. After the next reload, every open then waits for good. `Ticket` needs a `Drop`, as `OpenGuard` has.
- **C-5 (panic paths on the hook).** `eprintln!` (above). Also the guard's `-= 1` during an unwind (U-9): a panic in a drop while unwinding aborts the process.
- **C-6.** §9 item 5's first bullet forbids reading the managed state that `page_started` needs.
- **C-7 (does not block: it needs timing inside one request round trip; name it).** The kernel answers `unknown` while the open waits at the gate. The open then leaves the gate before the binding's own lookup, so the binding answers `unknown` and the open goes on. §1's claim must be narrowed to match.

## Evidence

- **E-1.** ADR-037's Proof names a second case: a reopen behind an earlier page's reopen "waits, and then opens". No U test drives that through `open_project_command`. U-3 only polls `admit`.
- **E-2.** ADV-2026-11-26-08 item 1 says S0 (a), E-1 red at the base, comes before any code. ADV-2026-11-26-19 item 3 names the identity route, the case-fold build and PR A's unit-test parts, not B. So the form's line "The unit tests may run inside holds before then (ADV-2026-11-26-19 item 3)" misstates the ruling.
- **E-3.** The suites whose path the piece changes are not in the head series:
  - `reopen.mjs`: the form claims "R4 … stays true", which only a run shows;
  - `second-open.mjs`;
  - `pan-anchor.mjs` and `recentre-crossing.mjs`: their reloads now end opens (ADR-037 Consequences, e2e);
  - `admission-remediation.mjs` and `table.mjs`: by a search they name `cancel` or `admission-open-cancel`, and `cancel` changes.
- **E-4.** ADR-037 §4's prepare row says the form establishes whether a prepare writes anything. The form is silent. My lead, by read: the pin only reads (`publish.rs:1363-1366`, `:1374-1388`), and the grant and the pending attempt live in memory (`lib.rs:479-485`). I did not read `prepare_with_query`.

## Documentation (must-fix before the merge)

- **D-1.** §0 item 5 and §8 lack the custodian's overlap facts, PR A's branch among them.
- **D-2.** The Intake row cites "ADR-037 Open 1". In the revised ADR, Open 1 is the reload mark; asking first sits under "What this ADR does not decide".
- **D-3.** `e2e-test-surface.ts`: "the two … lines name both suites" cannot be done as written. E-1 calls `e2eOpenProjectFolder` (`:193`), whose callers already include `second-open.mjs:84`. `:188` already says `e2eSaveProjectToFolder`'s only caller is `project.mjs`, which a search should check.
- **D-4.** §0 item 4 concludes "does not follow" outright, though the bullet before it says the known-folder API's own reading is outside the sources.
- **D-5.** ADV-2026-11-26-17 item 4's second bullet is not carried: the sitting's logs are copied to the local evidence folder before the first run.
- **D-6.** An earlier page's open that never returns holds every later open at the gate. That limit is not named.
- **D-7.** Two more skips are not named: wry's `?` on `url_from_webview` (`wry-0.55.1/src/webview2/mod.rs:653`) and tauri's skip when no webview is found for the label (`tauri-2.11.5/src/manager/webview.rs:296`). ADR-037 §1 asks the form to say when the end does not run.
- **D-8.** The ceiling needs raising for U-11 and U-12. The form is not yet committed, so this is not class 8. E-1 as ruled fits within the existing 90-line `project.mjs` estimate, so the raise is for the tests alone.

## Checks you asked for

**Verbatim spans.** Each one matches at 77662d1a, except the reuse output: the custodian ran that and I cannot re-run it. Checked: `lib.rs:216`, `mod.rs:265`, `reopen.mjs:248`, `store.rs:264`, `e2e/README.md:846`.

**Rulings as the form carries them.**
- True: ADV-2026-11-26-16 item 1 (a) to (e) and its last line, and items 3 to 5; ADV-2026-11-26-17 items 1 to 3 and 5; ADV-2026-11-26-18 items 1 to 6; ADV-2026-11-26-19 items 2, 4 and 7; ADV-2026-11-26-13 items 2 and 3.
- The Merge line is true against ADV-2026-11-26-08 item 6 as ADV-2026-11-26-15 item 7 changes it, with ADV-2026-11-26-15 item 4 and ADV-2026-11-26-19 item 4.
- ADV-2026-11-26-16 item 1 (d) needs C-7 to be complete.
- Untrue or missing: ADV-2026-11-26-19 item 3 (E-2), ADV-2026-11-26-08 item 1 S0 (a) (E-2), ADV-2026-11-26-17 item 4 (D-5).

**§10 "Architect also reads".**
- §2 against ADR-037: C-2, E-1, E-4.
- docs/01 never-block: holds. The hook does not wait on the kernel, the gate awaits on the async runtime, and the `cancel` and `close_dataset` commands are sync and hold the mutex only briefly.
- ADR-006: holds.
- docs/02: holds; ADR-037 accepts this exception.
- docs/10: holds; the three cancel states are unchanged.
- ADV-2026-11-26-16 item 1: holds, with C-7.
- Caller rule: holds once `log` and the `Ticket` drop are named. `page.rs` is a private module.

**§9, item by item.** Items 1 to 4 and 6 to 15 are sound. Item 5 needs C-5 and C-6.

**Concurrency.** No deadlock: no Pages mutex is held across the `saved` mutex or a kernel call. The design is sound after C-1 to C-5.

**OPEN items under ADV-2026-11-26-23.**
- **OPEN-1 (end of the chain).** It is red at the base:
  - E-1's first save takes the identity's lock and keeps it with the open's entry (`store.rs:225-227`; `mod.rs:870-877` is the same keeping for a reopen).
  - Nothing closes that open at a reload at the base, so `release_ended` keeps it and `try_lock` answers `Held`. The reopen is refused with `skp.project_open_elsewhere` (`mod.rs:780-787`, `:937`).
  - The earlier in-page close of the FOLDER_THREE open happens before E-1's save, so it does not interfere.
  - E-1 must wait for first pixels before saving, or the save answers `not-asked` (`e2e-test-surface.ts:186-187`).
  - It fits §7's ceiling.
  - It also removes a problem with the old placement: the chain ends at the first failure (`project.mjs:457-470`), so at the base no step after a mid-chain E-1 would have run.
  - §3's fixture line, §4's E-1 row and §5's fourth invalidator follow (pairs below). §3's "the suite's other steps pass in both" becomes true and stays.
- **OPEN-4.** Sound as ruled. The pair below says what each count counts.
- **OPEN-5 (a).** Sound under the form's condition. ADV-2026-11-26-23 item 3 replaces the last sentence of ADV-2026-11-26-18 item 5. Both architect gates read the note.

**Whose wording.** None of the form's sentences is the human's, so you apply the pairs with no re-gate, and the PR body lists them. ADV-2026-11-26-23 item 2's line and ADR-037's three additions are the advisor's words.

## Pairs

Each old text occurs once in `b-form-r1-text.txt`, checked by search. "\n" means a line break.

1. Old: `  - ADV-2026-11-26-19 items 2 to 4 and 7.`
   New: `  - ADV-2026-11-26-19 items 2 to 4 and 7;\n  - ADV-2026-11-26-23 items 1 to 3.`

2. Old: `4. **`Pages::page_started(app)`**. It is called from the hook. It runs in constant time and has no panic path: no `unwrap`, `expect` or indexing.`
   New: `4. **`Pages::page_started(parts) -> Option<JoinHandle<()>>`**. `parts` holds `Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>` and two closures, `stop_poll` and `log`, that the `Started` arm builds in `lib.rs` from a clone of the `AppHandle`. `SessionLog` stays managed by value (`state.rs:35-38`, `lib.rs:466`), and the `Finished` arm's `try_state::<SessionLog>()` is not touched. The U tests call this same function with test parts. The returned handle is read only by U-9, and `lib.rs` discards it. It is called from the hook. It does no wait and no kernel call, its work does not grow with the page's entries, and it has no panic path: no `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic.`

3. Old: `     - takes the current set, its in-flight keys and its gate-waiting entries;`
   New: `     - takes the current set by `mem::take`; the ended page's in-flight keys are read by the end's own thread (item 5 (i));`

4. Old: `     - sets each gate-waiting entry's flag. Such an open returns the kernel's cancelled refusal and never reaches the kernel (U-8);`
   New: `     - sets no per-entry flag: a gate-waiting entry whose page is no longer the current page is cancelled when its `admit` next reads the state. It returns the kernel's cancelled refusal and never reaches the kernel (U-8);`

5. Old: `with the error to stderr. The decrement guard`
   New: `with the error written by `writeln!` to `std::io::stderr()`, its result discarded (`eprintln!` panics when the write fails). The decrement guard`

6. Old: `   - **(i)** `ends_running == 0`, no in-flight entry of an earlier page remains, and `late_closes_running == 0`. The entry then moves to in-flight and `Ok` is returned.`
   New: `   - **(i)** Its page is the current page, `ends_running == 0`, no in-flight entry of a page earlier than its own remains, and `late_closes_running == 0`, all read in one critical section. In that same section the entry moves to in-flight, and `Ok` is returned.`

7. Old: `   - **(ii)** Its flag is set.`
   New: `   - **(ii)** Its flag is set (by `Pages::cancel`), or its page is no longer the current page.`

8. Old: `   With no reload in the process, (i) holds at once.`
   New: `   With no reload in the process, (i) holds once the first load's end, which closes nothing, has run.\n\n   The `Ticket` is a drop guard, as `OpenGuard` is (`skp.rs:1126-1133`): dropped without `settle`, it removes its entry and bumps the counter, so no early return or unwind can leave an in-flight entry holding the gate for every later page (U-11). In `open_project`, `admit` runs after the `Projects` check (`commands.rs:209-213`).`

9. Old: `   - **Ended page:** the binding starts a late close: `close_dataset`, then `release_ended`, then `late_closes_running -= 1` and a bump.`
   New: `   - **Ended page:** in that same critical section the in-flight entry is removed and `late_closes_running` is raised by one, so the gate never sees neither. The mutex is then released, and the binding starts a late close: `close_dataset`, then `release_ended`, then `late_closes_running` lowered by `saturating_sub(1)` under the mutex, and a bump.`

10. Old: `   - (i) `SkpHost::cancel` for each in-flight key, then `RunningPublishes::cancel_all`;`
    New: `   - (i) under the mutex, the ended page's in-flight keys are read; with the mutex released, `SkpHost::cancel` for each, then `RunningPublishes::cancel_all`. A key still in item 6's (d) window answers `unknown`, and its open completes into item 3's late close;`

11. Old: `   - (iv) one `SessionLog::append` line, with counts only and no handle, path or identity (`SKP-V0.md:192-194`). Its words, a draft that is not the human's: `page-end closed=<n> cancelled=<n> publishes=<n>`;`
    New: `   - (iv) one `SessionLog::append` line at level `info`, at every end, the first load's included (all three counts 0 there). Each count is in decimal digits, and the line carries no handle, path, name or project identity (`SKP-V0.md:192-194`). Its words are the advisor's (ADV-2026-11-26-23 item 2), not the human's: `page-end opens_closed=<n> opens_cancelled=<n> publishes_cancelled=<n>`. `opens_closed` counts the page's names whose `SkpHost::close_dataset` in (ii) returned `Ok`. `opens_cancelled` counts the in-flight keys whose `SkpHost::cancel` in (i) answered `requested`; it counts no gate-waiting open the binding cancelled, and no key the kernel answered `unknown` or `already_terminal`. `publishes_cancelled` is `RunningPublishes::cancel_all`'s return, the number of registered tokens it cancelled (`publish.rs:1182-1187`). A late close writes no line. An end whose thread did not start writes none, and `SessionLog::append` drops a line only on a poisoned file mutex or a failed write (`state.rs:77-80`);`

12. Old: `   - (v) the guard drops: `ends_running -= 1`, then a bump.`
    New: `   - (v) the guard drops: `ends_running` is lowered by `saturating_sub(1)` under the mutex, then a bump (a panic in a drop during an unwind would abort).`

13. Old: `   `stop_poll`'s product caller is `lib.rs`: the pool stop under its `cfg`, and a no-op otherwise.`
    New: `   `stop_poll`'s and `log`'s product caller is `lib.rs`: the pool stop under its `cfg` (a no-op otherwise), and `SessionLog::append` reached by `try_state`.`

14. Old: `- the caller rule: `Pages`' callers are the commands and the hook, and `stop_poll`'s is `lib.rs`;`
    New: `- the caller rule: `Pages`' callers are the commands and the hook, `stop_poll`'s and `log`'s is `lib.rs`, and the `Ticket`'s `Drop` is reached by the commands;`

15. Old: `     - If the open completes, it goes to its page's set or to a late close.`
    New: `     - If the open completes, it goes to its page's set or to a late close.\n     - A second moment, inside one request round trip: the kernel answers `unknown` while the open waits at the gate, and the open leaves the gate before the binding looks. The binding then finds no gate entry, answers `unknown`, and the open goes on. Only that interleaving reaches it; it is named here and in `page.rs`'s comment on `Pages::cancel`.`

16. Old: `- A cancel of an open waiting at the gate answers `requested`, and that open returns the kernel's cancelled refusal without reaching the kernel.`
    New: `- A cancel of an open that still waits at the gate when the binding looks it up answers `requested`, and that open returns the kernel's cancelled refusal without reaching the kernel (§2 item 6 (d) names the two moments this does not cover).`

17. Old: `   - a read of anything but the event, the label and `PinnedOrigin.window_label`;`
    New: `   - a read of `PinnedOrigin` other than its `window_label`, or of any managed state other than `PinnedOrigin` and the parts `page_started` takes (`Arc<Pages>`, `Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>`);`

18. Old: `   - an `unwrap`, `expect` or indexing on the hook's path.`
    New: `   - an `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic on the hook's path.`

19. Old: `| M-U8: the end leaves its gate-waiters, so C stays pending |`
    New: `| M-U8: `admit` does not compare its page with the current page, so B is not cancelled |`

20. Old: `| M-U10: the poison recovery replaced by `.unwrap()` |`
    New: `| M-U10: the poison recovery replaced by `.unwrap()` |\n| U-11 `a_ticket_dropped_unsettled_does_not_hold_the_gate` | `admit` under page 1, then `page_started`, then the ticket dropped without `settle`: page 2's `admit` is ready | M-U11: the `Ticket`'s `Drop` removed |\n| U-12 `a_reopen_behind_an_earlier_pages_reopen_waits_then_opens` | page 1's `open_project_command` of a saved folder is held in U-6's blocking arm (its lock taken, `mod.rs:781`), then `page_started`; page 2's `admit` for the same folder is pending; the arm is released; page 1's call returns and settles; page 2's `open_project_command` answers `Opened` (ADR-037 Consequences, Proof, its second case) | M-U12: the gate ignores earlier in-flight opens, so page 2 answers `skp.project_open_elsewhere` |`

21. Old: `  - U-1 to U-10 green at the head;`
    New: `  - U-1 to U-12 green at the head;`

22. Old: `- U-1 to U-10 and E-1, each mutation observed;`
    New: `- U-1 to U-12 and E-1, each mutation observed;`

23. Old: `after SECOND-SAVE on `FOLDER_ONE` (OPEN-1 (a)) | `page.reload({ waitUntil: "load" })`, the mount wait, then `e2eOpenProjectFolder(FOLDER_ONE)` answers admitted.`
    New: `a step after NOTICE-S18, the chain's last (ADV-2026-11-26-23 item 1) | `openPath(FIXTURE)` answers admitted and its first pixels are drawn (INSIDE-OPEN's wait); `e2eSaveProjectToFolder(FOLDER_FOUR)` answers `asked`; no close in the page comes between that save and the reload; then `page.reload({ waitUntil: "load" })`, the mount wait with `e2eOpenProjectFolder` among its hooks, then `e2eOpenProjectFolder(FOLDER_FOUR)` answers `admitted`.`

24. Old: `- **E-1** uses the suite's `FIXTURE` (`project.mjs:73`, read in place) and `FOLDER_ONE`.`
    New: `- **E-1** uses the suite's `FIXTURE` (`project.mjs:73`, read in place) and a fourth folder of its own, `FOLDER_FOUR`, made as the other three are (`project.mjs:62-64`) and dropped with them.`

25. Old: `  - A step after E-1 fails at the head and passes at the base. That is a stop (OPEN-1).`
    New: `  - E-1's own open or save, before its reload, does not answer as §4 says, at the base or at the head. Then E-1 does not reach the fault. That is a stop, and the advisor is told, since OPEN-1 (a) then stands (ADV-2026-11-26-23 item 1).`

26. Old: `  - The unit tests may run inside holds before then (ADV-2026-11-26-19 item 3).`
    New: `  - S0 (a) (ADV-2026-11-26-08 item 1): E-1's run at the base, red with `skp.project_open_elsewhere`, is made and filed before any code of `page.rs`, `lib.rs` or `commands.rs`. ADV-2026-11-26-19 item 3 names other pieces, not this one; whether this piece's code and unit tests may start before that run is OPEN-6.`

27. Old: `  - No run changes or deletes a file that stands in that folder.`
    New: `  - No run changes or deletes a file that stands in that folder.\n  - The sitting's logs are copied to the local evidence folder (ADV-2026-11-26-09) before the first run after C: is over the floor (ADV-2026-11-26-17 item 4). If that copy has not been made, the custodian files it before this piece's first run.`

28. Old: `- `project.mjs` at the base (E-1 red) and at the head, by a tester's series inside the machine's holds and under §6;`
    New: `- `project.mjs` at the base (E-1 red) and at the head, by a tester's series inside the machine's holds and under §6;\n- in the same series at the head: `reopen.mjs` (R4 among its steps), `second-open.mjs`, `pan-anchor.mjs` and `recentre-crossing.mjs` (their reloads now end opens), and `admission-remediation.mjs` and `table.mjs` (they name `cancel`);`

29. Old: `  - It drops the line, without a panic, when that mutex is poisoned.`
    New: `  - It drops the line, without a panic, when that mutex is poisoned.\n- **A publish prepare at a reload** (ADR-037 §4, the prepare row, which leaves this to the form). By this read, a prepare writes nothing to disk: its pin only reads the source (`publish.rs:1363-1366`, `:1374-1388`), and its grant and its pending attempt live in memory and die with the process (`lib.rs:479-485`). The build gate's reviewer confirms this against `prepare_with_query` at the base. If a write is found, the row's words go to the advisor before ADR-037 lands (ADV-2026-11-26-16 item 5).`

30. Old: `- **Not checked by me:** the rest of §7's Scope, `docs/adr/ADR-020*` among it. I have no git. The custodian checks it by git in the base before the first commit.`
    New: `- **Checked by the custodian by git, 2026-11-26:** PR A's branch (`cut/shell-migration-milestone-5-pr-a`) also changes `frontends/shell/e2e/README.md`. No open PR and no other in-progress branch touches `page.rs`, `lib.rs`, `project.mjs`, `e2e-test-surface.ts`, `docs/README.md`, `docs/adr/ADR-037*` or `docs/adr/ADR-020*`.`

31. Old: `| `e2e/README.md` | PRs 359, 363, 365, 366 (other entries) |`
    New: `| `e2e/README.md` | PRs 359, 363, 365, 366 and PR A's branch (other entries) |`

32. Old: `| the rest of §7 | none known; to be checked by git in the base (§0 item 5) |`
    New: `| the rest of §7 | none, by the custodian's check (§0 item 5) |`

33. Old: `| Asking first, or switching off the reload keys | Out (ADR-037 Open 1) |`
    New: `| Asking first, or switching off the reload keys | Out (ADR-037, What this ADR does not decide; ADV-2026-11-26-13 item 4) |`

34. Old: `    - `e2e-test-surface.ts`: the two "Only caller" lines name both suites.`
    New: `    - `e2e-test-surface.ts`: the caller lines of `e2eOpenProjectFolder` (`:193`) and `e2eSaveProjectToFolder` (`:188`) each name every suite that calls the hook at the head, found by a search (`second-open.mjs:84` already calls the first).`

35. Old: `  - **The two "Only caller: `e2e/reopen.mjs`" doc lines** on the hooks that E-1 also calls (`frontends/shell/src/e2e-test-surface.ts:191-205`).`
    New: `  - **The caller lines** of `e2eOpenProjectFolder` and `e2eSaveProjectToFolder`, which E-1 calls (`frontends/shell/src/e2e-test-surface.ts:188`, `:193`).`

36. Old: `- **So the folder does not follow, and ADV-2026-11-26-17 item 5's consequence holds:**`
    New: `- **So, by these sources, the folder does not follow** (the known-folder API's own reading is outside them, as the bullet above says), **and ADV-2026-11-26-17 item 5's consequence holds:**`

37. Old: `- a renderer process that ends with no navigation;`
    New: `- a renderer process that ends with no navigation;\n- that a later page can open anything while an earlier page's open never returns: every later open then waits at the gate, and only its own cancel ends the wait;`

38. Old: `and skips the handler when the URL does not parse.`
    New: `and skips the handler when the URL does not parse. wry also skips it when the webview's URL cannot be read (`wry-0.55.1/src/webview2/mod.rs:653`, its `?`), and tauri skips it when the manager holds no webview for the label (`tauri-2.11.5/src/manager/webview.rs:296`). For such a load the end does not run (ADR-037 §1).`

39. Old: `- **Size:** at most 1150 changed lines,`
    New: `- **Size:** at most 1250 changed lines (raised before commit for U-11 and U-12; E-1 as ruled fits the 1150 the form first set),`

40. Old: `  | `page.rs` tests | 450 |`
    New: `  | `page.rs` tests | 540 |`

41. Old: `    - **If the human's approval of ADV-2026-11-26-21 is filed on main before this PR's documents commit, and the advisor rules the mechanism OPEN-5 (a):**`
    New: `    - **If the human's approval of ADV-2026-11-26-21 is filed on main before this PR's documents commit (OPEN-5 (a), ruled by ADV-2026-11-26-23 item 3), and both architect gates' posture checks read the note:**`

42. Old: `(ADV-2026-11-26-18 item 5), and any diff`
    New: `(ADV-2026-11-26-23 item 3; ADV-2026-11-26-18 item 5), and any diff`

43. Old: `  - `docs/09`.`
    New: `  - `docs/09`;\n  - under §2 item 11's condition, the appended ADR-020 note (ADV-2026-11-26-23 item 3).`

44. Old: `- **ADV-2026-11-26-08 item 6 and ADV-2026-11-26-15 items 4 and 7:** Merge.`
    New: `- **ADV-2026-11-26-08 item 6 and ADV-2026-11-26-15 items 4 and 7:** Merge.\n- **ADV-2026-11-26-23:** item 1: §3, §4 (E-1), §5; item 2: §2 item 5 (iv); item 3: §2 item 11, §10.\n- **ADV-2026-11-26-08 item 1, S0 (a):** §6, OPEN-6.`

45. Old: `  - (a) Between SECOND-SAVE and INSIDE-OPEN on `FOLDER_ONE` (`project.mjs:330-358`), where a project is held. Recommended. If INSIDE-OPEN fails after a reload, that is a stop.`
    New: `  - Ruled by ADV-2026-11-26-23 item 1: at the end of the chain, with an open and a save of its own and no close in the page between its save and its reload (§4).`

46. Old: `  - (b) At the end of the chain. It is not red at the base, because the later steps' in-page closes free the lock.`
    New: `  - Not taken: the place between SECOND-SAVE and INSIDE-OPEN, and the end of the chain on `FOLDER_ONE`.`

47. Old: `- **OPEN-4, the session-log line's words** (§2 item 5 (iv)). This is the architect's draft, not the human's wording. It goes to the advisor.`
    New: `- **OPEN-4:** ruled by ADV-2026-11-26-23 item 2 (§2 item 5 (iv)). The words are the advisor's, not the human's.`

48. Old: `- **OPEN-5, how a dated note on ADR-020 lands, if the human approves ADV-2026-11-26-21 item 5.** To the advisor.`
    New: `- **OPEN-5:** ruled by ADV-2026-11-26-23 item 3: (a), under §2 item 11's condition; otherwise ADR-020 is not changed in this piece. B does not wait for the approval.\n- **OPEN-6, S0 (a) and this piece's code.** ADV-2026-11-26-08 item 1 puts E-1's red run at the base before any code. ADV-2026-11-26-19 holds every app start until the human closes their app, and its item 3 names other pieces' unit-test parts. Whether this piece's code and unit tests may start before E-1's base run is the advisor's to rule. Until it rules, no code of this piece is written. To the advisor.`

49. Delete each of these seven lines with its line break. Each occurs once, under the old OPEN-5:
    - `  - **(a)** In this PR, as the draft's item 5 says.`
    - `    - Costs: a tenth file and about 7 lines inside the ceiling. A red-line text lands beside product code. The posture check must then read the note too.`
    - `    - It holds only if the approval is filed before this PR's documents commit.`
    - `  - **(b)** On its own, as ADV-2026-11-26-18 item 5 puts it.`
    - `    - Costs: one more small PR.`
    - `    - This piece then never touches ADR-020.`
    - `  - The two texts differ on this point. Recommended: whichever the advisor rules; the form holds either way (§2 item 11).`

No ADR skeleton is needed: ADR-037 is accepted, and none of its clauses is found untrue once C-2 is applied.
