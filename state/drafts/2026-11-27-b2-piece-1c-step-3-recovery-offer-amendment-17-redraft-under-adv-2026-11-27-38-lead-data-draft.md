# The recovery offer's form, Amendment 17, redrafted under ADV-2026-11-27-38: lead-data's (node:b2-piece-1c-step-3-recovery-offer@class-9-recover-open-redraft)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, items 2 and 6 (b), and `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-38-the-recovery-offers-posture-answer-to-the-human-the-overrun-accepted-the-whole-at-most-6000-not-class-8-the-open-left-on-a-refusal-closed-by-the-kernel.md`, items 2 and 3. Lead-data (Opus) was resumed with a message naming that ruling's items 2 and 3 and this REPORT PATH, read only. By the facts script its last record is at 2026-11-27T22:55:12Z; by its completion notice the resumed run took 264589 ms and 10 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed: 25156 bytes, sha256 ac29acac4e167b413256965d07df98f89559c1ee7a4f8506262bad62a3992526. The whole is at most 5,885 lines at place (a) and 5,985 at place (b), under the 6,000 of ADV-2026-11-27-38 item 2, so it goes to the form gate and not first to the advisor. It is not yet appended to the form. Not a gate.*

---

RESULT: I redrafted Amendment 17 whole under ADV-2026-11-27-38. It adds the gap as its own item 5: a guard in `kernel/src/recovery.rs` closes the open the null arm started before any later refusal answers, and K-C42 tests it. The close needs no change to `kernel/src/project/mod.rs`. The budget is re-declared at Part 1 ≤ 5,025 lines over 47 files and the whole ≤ 5,885 over 50 files, so it stays under 6,000.
BLOCKING QUESTIONS: none. Two items are left to the form gate, in item 10. First, step 4's post-open refusal has no test row: by the time it fires, nothing is left open. Second, if the binding tests go in `commands.rs`, Part 1 passes the ruled figure of 4,990 plus the gap by about 45 lines.
REPORT PATH: state/drafts/2026-11-27-b2-piece-1c-step-3-recovery-offer-amendment-17-redraft-under-adv-2026-11-27-38-lead-data-draft.md
SHA256: not computed. I have no hashing tool and wrote no file, so please hash the hand-back when you save it.

---

# The recovery offer's form, Amendment 17 redrafted under ADV-2026-11-27-38 (node:b2-piece-1c-step-3-recovery-offer@class-9-recover-open-redraft), lead-data's draft

**How the cites are written:**
- [M] is the main checkout's working tree, read 2026-11-27, at HEAD ba5e7397. The form is modified there, so its lines are those of that 2541-line file.
- [R] is D:/wt/reload at 5ce0525a.
- [C1] is D:/wt/c1rd at f7770e1a.
- I had no git, so I could not see whether either worktree has uncommitted changes.
- "The reload piece" means the rulings' B. "The base" means the form's B.
- The coordinator's message is the only source of ADV-2026-11-27-38's text; the ruling is not on main. Nothing of it is quoted here, and it is cited by id and item.
- Everything else is paraphrase, apart from code identifiers.

**Read for this redraft, beyond the first draft's reads:**
- [C1]: `kernel/src/project/mod.rs:800-969`
- [C1]: `kernel/src/skp.rs:1240-1349`, plus searches for `begin_open`, `open_under`, `close_dataset` and `catalog`
- [C1]: `kernel/src/dataset_ref.rs:321-324`
- [C1]: the public items of `kernel/src/lib.rs`, by search
- [M]: the form's K-C27 and K-C4x rows, by search

**What changed from the first draft:**
- Items 1 to 4 are kept. Item 1 also cites ADV-2026-11-27-38.
- The gap is new item 5.
- Old items 5 to 10 are now 6 to 11, and they change only where ADV-2026-11-27-38 items 2 and 3 change them.

=== BEGIN AMENDMENT DRAFT ===

## Amendment 17 — 2026-11-27 — class 9 on ADV-2026-11-27-37 item 2 and ADV-2026-11-27-38 item 3: the open that `recover_session`'s null-dataset arm starts is counted among the page's opens, and is closed by the kernel when a later step refuses; the tests; ADR-037's Amendment 1 in Part 1; the budget under ADV-2026-11-27-38 item 2

*Lead-data drafted this before any code. It was written after three things had been seen: the architect's read of Part 1 (`state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md`), the rulings ADV-2026-11-27-37 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`) and ADV-2026-11-27-38 (not yet filed), and the architect's draft of ADR-037's Amendment 1. No test outcome of this piece exists. Rulings are cited by id and item. The form gate that passed the form reads this amendment once, whole (ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 3). [R] cites are at 5ce0525a and [C1] cites at f7770e1a. The drafter has no hashing tool, so the custodian pins each span at filing. Nothing above is edited.*

1. **Authority and scope.**
   - ADV-2026-11-27-37 item 2 counts the open `recover_session` starts and does not accept the residual. ADV-2026-11-27-38 item 2 accepts the re-declared figures. ADV-2026-11-27-38 item 3 puts the kernel's close on a refusal after the open into this amendment. ADV-2026-11-27-38 item 4 keeps the order.
   - The base is that of ADV-2026-11-27-37 item 1.
   - **Not touched:**
     - the handle arm of `recover_session`;
     - `list_recoverable` and `discard_recoverable`;
     - `kernel/src/project/mod.rs`. §2.3 `:93` [M] and §5 I8 `:311` [M] stand.
     - the wire;
     - every shell file;
     - `capabilities/`.
   - **The one kernel change** is item 5's close, in `kernel/src/recovery.rs`.

2. **The handler** (`frontends/shell/src-tauri/src/commands.rs`, Part 1). For a null `dataset` it follows ADR-037 §2 to §5, as `open_dataset` (`commands.rs:86-101` [R]) and `open_project` (`commands.rs:244-268` [R]) do.
   - **Two crate-private async functions** in `commands.rs`. The Tauri command calls them, and so do item 3's tests, so each mutation lands in the code that ships.
     - `recover_on_page(pages, recorder, host, projects, request)`:
       - If `request.dataset` is a handle, it runs `StepRecorder`'s `recover_session` entry point on `spawn_blocking` and makes no `Pages` call.
       - If `request.dataset` is null, it first awaits `Pages::admit(&request.cancel_key)` (`page.rs:229` [R]). A refusal at the gate is the kernel's cancelled refusal (`page.rs:189-193` [R]), which §2.4's reused cancel codes cover (`:117` [M]).
       - It then calls `recover_admitted` with the `Ticket` (`page.rs:128-142` [R]).
     - `recover_admitted(pages, ticket, recorder, host, projects, request)`:
       - It runs the kernel's `recover_session` on `spawn_blocking`.
       - It then calls `Pages::settle(ticket, name, &host, projects)` (`page.rs:303-309` [R]). The name is the reply's `dataset` when the reply is `Ok` and `opened` is present, and `None` otherwise.
       - It returns the reply and the `Settled` (`page.rs:113-123` [R]).
   - **The `#[tauri::command] recover_session`:**
     - It refuses a missing recorder before the gate, as `record_step` does (`commands.rs:195-199` [R]).
     - It passes `projects_of(&app)` (`commands.rs:57-60` [R]).
     - It starts the pool-lease poll only on `Settled::Current`, for an `Ok` reply with `opened` present, under the `cfg` of `commands.rs:95-100` [R].
   - **The ruling's four clauses, and what meets each:**
     - (a) The gate: `Pages::admit`.
     - (b) The name is noted on its page: `Pages::settle`, `Current`.
     - (c) The cancel key ends with the page. The in-flight entry carries `request.cancel_key`. `run_end` cancels that key (`page.rs:477-496` [R]), and the kernel's `begin_open(cancel_key)` registers it (§2.3 `:83` [M]).
     - (d) A late reply is closed: `Pages::settle`, `Ended`, then the late close (`page.rs:320-355` [R]). Item 5 covers the replies that carry no name.
   - **Unchanged and still reached:**
     - `Pages::cancel` (`commands.rs:129-136`, `page.rs:420-446` [R]);
     - `Pages::forget` (`commands.rs:173`, `page.rs:360-364` [R]).
     - No public item of `page.rs` changes (`page.rs:195-447` [R]).
   - **Doc comments made true** (comment lines only):
     - `commands.rs:16-20` and `:126-128` [R];
     - `page.rs:15-17`, `:21-23` and `:216` [R];
     - `page.rs:117-121` [R], the list of tests that join the late close's handle, which gains T-2;
     - `lib.rs:13-18` [R], if the gate reads it as naming only the open commands.
   - **Registration:** `lib.rs:616-639` [R] gains the three commands (T-1).

3. **The binding's tests** (Part 1). They go after T-1's row in §4. The ADR-037 proof (`ADR-037…md:154-159` [R]) asks for tests through the binding's own functions over a real `SkpHost`, `StepRecorder` and `Projects`.
   - **Place (a): `frontends/shell/src-tauri/src/page.rs`'s `mod tests`.**
     - It reuses `Rig`, `Latch`, `TestArm` with `Mode::Block`, and `poll`, `ready` and `assert_pending` (`page.rs:547-893` [R]).
     - `Rig` gains one field, `recorder`, a clone of the recorder `rig()` already builds (`page.rs:701-702` [R]). This edits a test helper and no test; it is declared here for §5 I3.
     - Figure: 340 lines in the src-tauri group.
   - **Place (b): `commands.rs`'s own `mod tests`.**
     - It builds a rig of its own: real host, recorder, `Projects`, `Pages`, a fixture, and a blocking watch arm. That is about 100 more lines and no `Rig` edit. `page.rs` is still edited, for its doc lines.
     - Figure: 440 lines.
   - **The gate chooses the place** (ADV-2026-11-27-38 item 2). Item 6 gives both totals.
   - **Common to both places:**
     - The crashed record is made by a second `StepRecorder` over the rig's `sessions` folder, on a host of its own. It records one step through `record_step` and is dropped without `end_session`, as K-C9's record is (`:2109` [M]).
     - Each test runs the async functions on a tokio multi-thread runtime it builds. That uses `Cargo.toml:63` [R] (`rt-multi-thread`) and `:97` [R] (dev `macros`), with no Cargo or lockfile change (I6).

| Id | Test | Mutation | Fails |
|---|---|---|---|
| T-2 | `a_recover_whose_reply_arrives_after_its_page_ended_is_closed`: a crashed `unsaved-` record; the gate's ticket taken under page 1; page 1 ends, and its line counts `opens_cancelled=0`; then `recover_admitted` with that ticket and a null `dataset`. The reply is `Ok` with `opened` present; `settle` answers `Ended` with a late close, which the test joins; the returned name is not in the catalog; and the current page's set is empty | `settle` given `None` in place of the returned name | T-2 |
| T-3 | `a_page_end_cancels_a_recover_in_flight_and_leaves_its_record`: the history's bytes are read; `recover_on_page` with a null `dataset` runs on its own thread and stands in the watch arm (`Mode::Block`, inside step 4's open); page 1 ends; the arm is released. The reply is `engine.cancelled`; `settle` answers `Ended` with no name; the catalog's `names()` (`kernel/src/lib.rs:276` [C1]) is empty; the history is byte for byte as it was; and the end's line counts `opens_cancelled=1` | `admit` given the empty string in place of the request's `cancel_key` | T-3 |
| T-4 | `a_new_pages_open_waits_for_an_earlier_pages_recover`: `recover_on_page` with a null `dataset` stands in the watch arm under page 1; page 1 ends; page 2's `admit` is pending; the arm is released and the recover returns; page 2's `admit` is then ready | the null arm takes the handle arm's path: no `admit` and no `settle` | T-4, T-3 |

   - **Red at the base:** the two functions do not exist there, so the tests do not build (Amendment 10 item 2, `:2065-2067` [M]).
   - **Known pass cases:** none.
   - **E-RECOVER gains no step.** From the page, a counted recover open and an uncounted one look the same:
     - the null arm binds no project (`:88` [M]), so no lock refusal can show;
     - no handle reaches the new page;
     - no e2e suite reads the page-end line (a search of `frontends/shell/e2e` [R] finds none);
     - the shared log folder piece is not built (ADV-2026-11-27-37 item 4).
   - **What E-RECOVER already covers:** its Recover drives the new handler, gate included, from the real shape (`:293` [M], as Amendment 2 revises it).
   - **An option the gate may ask for, not drafted:** T-5, showing that the handle arm does not wait at the gate.

4. **ADR-037's Amendment 1** lands in Part 1, the part that lands the handler (ADV-2026-11-27-37 item 2).
   - **File:** `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`.
   - **Words:** the architect's draft under `state/drafts/`. The advisor rules them, and this form drafts none.
   - **Index:** `docs/README.md`'s ADR-037 row is not edited. The precedent is the ADR-036 row, which names no amendment (`docs/README.md:73` [R]). The gate checks this.

5. **The kernel closes the open it started when a later step refuses** (class 9 on ADV-2026-11-27-38 item 3; `kernel/src/recovery.rs`, Part 1). This is worded in the form's `recover_session` steps: Amendment 2 item 4 at `:627-634` [M], as Amendment 4 item 5 revises it at `:1079-1098` [M].
   - **The rule.** For a null `dataset`, once step 4's `open_under` has returned a handle, a guard holds that handle. On every exit but the `Ok` reply, refusal and unwind alike, the guard closes it through `SkpHost::close_dataset` (`kernel/src/skp.rs:1625` [C1]) before the call answers. The guard is disarmed last, after step 6 and after the reply's intents are built.
   - **The pattern** is `open_project` at the C1 head:
     - it keeps a `close` for the handle `open_under` returned (`kernel/src/project/mod.rs:839-843` [C1]);
     - it calls that close where a later write fails (`:864-872` [C1]);
     - its reply guard closes the dataset on an unwind (`:949-964` [C1]).
   - **The refusal exit.** Every refusal after step 2 leaves by one exit, in this order:
     1. the open's close, when there is one;
     2. the history handle dropped, which releases its lock;
     3. step 2's reservation released (N-16, `:1149` [M]);
     4. the answer.
   - **`kernel/src/project/mod.rs` is not touched.** The pattern is copied, not called. `recovery.rs` is in the same crate as `begin_open` and `open_under` (both `pub(crate)`, `kernel/src/skp.rs:1118` and `:1139` [C1]) and `close_dataset` (`pub`, `:1625` [C1]). Nothing of `project/mod.rs` is needed, so no question goes to the advisor.
   - **Step 4, after `open_under` returns.** The step looks the handle up in the catalog to run `DatasetRef::check`, as `kernel/src/project/mod.rs:848-852` [C1] does.
     - `check` returns a `RefCheck` and refuses nothing (`kernel/src/dataset_ref.rs:321` [C1]). A catalog miss is therefore the step's one refusal after the open.
     - Inside `open_under`, the catalog's `remove` runs only on a refused open (`kernel/src/skp.rs:1260`, `:1336` [C1]). After admission, only `close_dataset` removes the entry (`:1671` [C1]), and no client holds the handle yet. So when the miss occurs, nothing is left open. The guard's close still runs; its `unknown_dataset` answer is dropped.
     - **The record:** byte for byte, since step 5 has not run. Its lock and reservation are released, and a later listing lists it again with the same steps, as K-C22 asserts for a refused open at accept.
     - **No test row.** No mutation of the close could make a test fail when nothing is left open. That goes to the form gate (item 10).
   - **Step 5** (`set_len` to the kept prefix, seek to its end, `sync_all`).
     - Any failure refuses as `skp.session_history_unwritable`, the history-write code §2.4 reuses (`:117` [M]). This is the drafter's choice of code; the gate checks it.
     - **The record when `set_len` refused:** byte for byte.
     - **The record when `set_len` succeeded and a later part of the step refused:** cut to its kept prefix. The only bytes removed are those after the last kept line's LF, which `recover_bytes` does not keep.
     - **A later listing, either way:** it reads the same kept steps, the same last `at` and the same count. With the lock and reservation released, it lists the record again, at a later start or at this run's next listing.
     - The guard closes the open before the answer.
   - **Step 6** (set the identity, bind, push) has no refusing branch.
     - It changes only the recorder's state under its lock, and recovers a poisoned lock rather than refusing. N-16 (`:1148` [M]) already says that no refusal follows step 5.
     - A refusing branch at step 6 is invalidator **I11** (item 7): it would be a refusal after the open, and it would need its own test, by amendment, before its code.
   - **A panic between step 4 and the reply** is not a refusal under ADV-2026-11-27-38 item 3. The guard closes the open on the unwind, as `open_project`'s reply guard does. There is no test row; the gate may ask for one, by analogy with `kernel/src/project/mod.rs:1626` [C1].
   - **The test,** added after K-C41 in §4:

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C42 | `a_refused_cut_after_the_open_closes_the_open_and_leaves_the_record` (a unit test in `kernel/src/recovery.rs`, as K-C27 is, `:1206` [M]): the private body that runs steps 4 to 6 for a null `dataset` is called with the history handle of a crashed `unsaved-` record, which the test opened without write access and locked itself, so step 5's `set_len` refuses after step 4's real open through the test's own `SkpHost`. It asserts: the refusal is `skp.session_history_unwritable`; the host's catalog `names()` (`kernel/src/lib.rs:276` [C1]) is empty; the history is byte for byte as it was; and after the call, a lock taken through a new handle succeeds | the guard's close removed from the refusal exit, which leaves the open in the catalog | K-C42 |

   - **Red before the code:** the private body does not exist at the base, so the test does not build.
   - **Known pass cases:** none. `set_len` on a handle without write access fails on Windows, and on macOS and Linux (ftruncate on a read-only descriptor). Taking the lock needs only read access, so the test rests on no hypothesis.
   - **The refusal exit's release of the reservation and the lock** is K-C22's to assert, for the exit that every refusal shares. K-C42 asserts the lock as well.

6. **The budget, under ADV-2026-11-27-38 item 2.** The groups are §2.11's, by part, as in Amendment 10 item 6 (`:2171-2197` [M]). §7 is not edited, because its budgets are §2.11 (`:323` [M]). Groups not listed are unchanged.

| Group | Part 1 (Amendment 10) | Part 1 now | Part 2 | Together now |
|---|---|---|---|---|
| kernel product (`recovery.rs` takes item 5 and K-C42) | 950 | 1,040 | 210 | 1,250 |
| src-tauri (`commands.rs`, `lib.rs`, `page.rs`) | 100 | 340 at place (a), 440 at place (b) | 0 | 340 / 440 |
| records (Part 1: ADR-037's Amendment 1) | 0 | 25 | 160 | 185 |
| **Total** | **≤ 4,670, ≤ 45 files** | **≤ 5,025 at (a), ≤ 5,125 at (b); ≤ 47 files** | **≤ 860, ≤ 6 files** | **≤ 5,885 at (a), ≤ 5,985 at (b); 50 files in the union** |

   - **Kernel product, about 90 lines:**
     - the guard, its disarm and its close, about 20;
     - the one refusal exit, about 5;
     - the source comments, about 20;
     - K-C42, about 45. It counts in this group by K-C27's precedent, because the group is by file.
   - **Src-tauri:** as in the first draft. About 70 product lines and 150 test lines at (a), plus margin. Place (b) adds about 100.
   - **Records:** the architect's draft of Amendment 1 is 20 lines inside its block, plus the blank line before it, declared as 25. If the filed draft's count is larger, the custodian sets this figure from it before code.
   - **Against the rulings:**
     - ADV-2026-11-27-38 item 2 ruled Part 1 at most 4,990 lines plus the gap's lines: 4,990 + 90 = 5,080. Place (a) is under that (5,025, with the records placeholder of 80 brought down to 25). Place (b) passes it by about 45 lines.
     - The whole is under 6,000 at either place.
     - Files: item 5 adds none. Part 1 has 47, and the union has 48 + 2 (`page.rs` and the ADR-037 file) = 50. That holds if the literal's list at the base is no longer than §2.4's 29 files. The custodian's count goes to the advisor only if it passes 50.
   - **The two gated parts stand.**

7. **Additions to the form's sections** (read with the sections named):
   - **§1, May claim** (`:37` [M]), adds two claims:
     - the null arm's open is counted among the page's opens (T-2 to T-4);
     - a refusal after that open leaves nothing open (K-C42).
   - **§2.3, `recover_session`:** item 5's rule and its refusal exit.
   - **§2.9, Seams** (`:175-182` [M]) gains two:
     - `Pages::admit` and `Pages::settle` → `recover_on_page` and `recover_admitted` → the command;
     - `SkpHost::close_dataset` → the refusal exit of `recover_session`.
   - **§2.9, Guarantees** (`:183-188` [M]): ADR-037 §4 and §5 with its Amendment 1.
   - **§5, Declared unchanged** (`:301-305` [M]) adds:
     - `page.rs`'s public items and their behaviour;
     - the four existing handlers, but for their doc comments;
     - `kernel/src/project/mod.rs`, which stays untouched.
   - **§5, Invalidators** (`:306-312` [M]) gains two:
     - **I10**, a stop: the counting needs a new or changed public item of `page.rs`, a non-comment line of `page.rs` outside its tests, a protocol change, or a Cargo or lockfile change;
     - **I11**: a refusing branch after step 5, or any edit of `kernel/src/project/mod.rs`. The latter is I8 and goes to the advisor (ADV-2026-11-27-38 item 3).
   - **§8** (after item 15, `:1234` [M]) gains two items:
     - **16.** The null arm's open reaches the kernel without the gate's ticket; or its returned name is not settled; or a `Pages` call appears in the handle arm, `list_recoverable` or `discard_recoverable`.
     - **17.** A refusal of `recover_session` after step 4's open answers while that open is still in the catalog.
   - **§9, Architect** (`:341-345` [M]): the handler against ADR-037 with its Amendment 1, once that amendment is accepted.
   - **§2.12** (after D22, `:2321` [M]):

| # | What | 1c form | Here | Why |
|---|---|---|---|---|
| D23 | rule | (none) | the null arm's open counted and closed on a later refusal (items 2 and 5); T-2 to T-4 and K-C42; ADR-037 Amendment 1 in Part 1 | ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 3 |

   - **Amendment 10 item 2:**
     - Rules (`:2017-2022` [M]) gain item 5's close.
     - Callers (`:2034-2039` [M]) gain item 2.
     - Tests (`:2056-2064` [M]) gain T-2 to T-4 and K-C42.
   - **Shared paths** (`:221-231` [M], with Amendment 2 N-7 at `:750-759` [M]): `page.rs` (Part 1) is shared with the reload piece, which merges ahead of this piece, so it is met by the order (ADV-2026-11-27-37 item 1).

8. **Places this amendment makes stale, by line** [M], for the gate:
   - `:43`: §1's ADRs line ("none is amended"). Item 4 makes it stale, and also `:2229`, the text Amendment 10 gives it.
   - `:83`: §2.3's null arm, which says nothing of a close on a later refusal (item 5).
   - `:632-634`: Amendment 2 item 4's steps 5 and 6, and its bullet that a refusal before step 5 leaves the history byte for byte. That bullet is incomplete: item 5 adds step 5's refusal and the state it leaves.
   - `:2024`: "at most 45 files" and "Part 1 touches nothing under `docs/adr/`" (items 4 and 6).
   - `:2017-2022`, `:2034-2039` and `:2056-2064` (item 7).
   - `:214` and `:2178-2180`: the kernel product and src-tauri ceilings (item 6).
   - `:2184`: records, Part 1 = 0 (item 6).
   - `:2185`: the Total row (item 6).
   - `:2191`: "48 files of 50" (item 6).
   - `:2199-2201`: records by part. Part 1 now holds one (item 4).
   - `:2257`: §5's declared-unchanged text for ADR-036. ADR-037 now changes too.
   - `:175-188`, `:221-231` with `:750-759`, `:301-312`, `:327` with `:1231-1234`, and `:341-345` (item 7).
   - **Not stale, but read with this amendment:**
     - `:93` and `:311`: `kernel/src/project/mod.rs` not touched, and I8. Both stand.
     - `:814`: N-13's open refused at accept.
     - `:1088-1092`: Amendment 4's step 5.
     - `:1145-1149`: N-16, which stands and which item 5 relies on.
     - `:117`: the reused codes.
     - `:2065-2068`: red at the base, and no known pass case in Part 1.
     - `:2540`: Amendment 16 item 6, now answered.

9. **Named, not changed:**
   - **(a)** The kernel holds the cancel key only from step 4's `begin_open`. An end that lands during steps 1 to 3a meets `unknown`, the recover completes, and the late close closes it. That is ADR-037 §4's second outcome, and T-2 asserts it.
   - **(b)** A recover whose reply arrives late leaves its adopted record with the run, and the run's normal end clears it. That is what ADR-037 consequence (e) already says of an unsaved open (`ADR-037…md:140` [R]). Whether Amendment 1 says so is the architect's call.
   - **(c)** The new page's listing does not wait at the gate. It skips a record that is held, so nothing is offered twice.
   - **(d)** The handle arm with its open closed under it: the architect's read names this case (its `:50-53`). It stays out, by ADV-2026-11-27-37 item 2.
   - **(e)** No command, member or capability entry is added. The posture answer is the architect's (ADV-2026-11-27-37 item 3).

10. **For the form gate:**
    - (i) **Where the binding's tests live,** place (a) or (b) (ADV-2026-11-27-38 item 2). Place (b) passes Part 1's ruled figure by about 45 lines. If the gate chooses it, that goes to the advisor.
    - (ii) **Step 4's catalog miss** has no test row. It can refuse after the open, but nothing is open by then (item 5). Does that meet ADV-2026-11-27-38 item 3?
    - (iii) **K-C42's handle without write access** is the function's ordinary input, not a test parameter. K-C27 is the precedent.
    - (iv) **The code** step 5's refusal answers with.

11. **Next.** The form gate reads this amendment once, whole. No code of Part 1 is written before that gate has passed and ADR-037's Amendment 1 is accepted (ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 4).

Read the last amendment first.

Nothing above is edited.

=== END AMENDMENT DRAFT ===

**Notes outside the amendment, for the custodian:**
- I gave no verdict and changed no file.
- The figures in item 6 are my estimates, made before any code exists.
- The file union of 50 still depends on your count, at the base, of the files that carry the literal.
