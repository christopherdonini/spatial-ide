# The recovery offer's form, Amendment 17, first draft: lead-data's (node:b2-piece-1c-step-3-recovery-offer@class-9-recover-open)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, items 2 and 6 (b). Lead-data (Opus) was dispatched with its brief byte for byte (brief-recov-class9-lead-data.md in the scratch folder), read only. By the facts script, its run began at 2026-11-27T22:22:54Z; by its completion notice, 506976 ms and 31 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed. ADV-2026-11-27-38 ruled its two questions after it; lead-data was resumed at before 2026-11-27T22:51:29Z (the facts script) for a redraft under that ruling's items 2 and 3, and the redraft, not this draft, is what the form gate reads. Not a gate.*

---

RESULT: I drafted Amendment 17 to the recovery offer's form, class 9 on ADV-2026-11-27-37 item 2. It counts the open that recover_session's null-dataset arm starts among the page's opens, through Pages::admit and Pages::settle. It adds three binding tests, T-2 to T-4, and no E-RECOVER step. It names the ADR-037 file for Part 1. It re-declares Part 1's budget, which pushes the whole past 5,530 lines, and it lists the stale places by line.
BLOCKING QUESTION 1 (to the advisor, by ADV-2026-11-23-38 item 1): Part 1 goes from at most 4,670 to at most 4,990 lines, and the whole from at most 5,530 to at most 5,850. That is beyond the double-count allowance, so it is not class 8, and it needs a ruling before Part 1's code.
BLOCKING QUESTION 2 (to the custodian): the file union becomes 50 of 50 only if the literal's file list at the new base is no longer than the 29 files counted before. It needs your rule (00) count at the base, and anything past 50 goes to the advisor.
REPORT PATH: state/drafts/2026-11-27-b2-piece-1c-step-3-recovery-offer-class-9-amendment-the-recover-open-counted-lead-data-draft.md
SHA256: not computed. I have no hashing tool and wrote no file, so the custodian hashes the hand-back once it is saved.

---

# The recovery offer's form, class 9 amendment on ADV-2026-11-27-37 item 2: the recover open counted. Lead-data's draft (node:b2-piece-1c-step-3-recovery-offer@class-9-recover-open)

How the cites are written:
- [M] is the main checkout C:/dev/spatial-ide as I read it on 2026-11-27. Its HEAD is ba5e7397 by the session's git status, which shows the form and the ruling's file as modified or untracked. So every [M] line number of the form is a line of the working-tree file (2541 lines).
- [R] is D:/wt/reload at 5ce0525a, the reload piece's head, read in place.
- [C1] is D:/wt/c1rd at f7770e1a. I cite nothing from it.
- I had no git, so I could not see whether either worktree has uncommitted changes.
- "The reload piece" is the rulings' B. "The base" is the form's B: the C1 head with the reload piece's head merged in (ADV-2026-11-27-37 item 1). I keep the two names apart, because the architect's read flags the clash (`state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md:115` [M]).
- Nothing below is quoted. Everything is paraphrase except code identifiers.

Read, and nothing else:
- the owner's indexes (`kernel/README.md:357-402`, `engine/README.md:533-547` [M]);
- ruling items 1, 2 and 6 whole (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-...md:13-53` [M]);
- ADV-2026-11-23-38 item 1 (its file :11-15 [M]);
- the architect's read, whole;
- the form's :1-903, :1079-1158 and :1988-2541 [M], plus targeted searches of the rest;
- at [R]: `page.rs` whole, `commands.rs:1-320` and `:755-814`, `lib.rs:1-30` and `:185-284` with a search for its handler list, `Cargo.toml` by search, `docs/README.md:70-74`, and ADR-037 whole.

=== BEGIN AMENDMENT DRAFT ===

## Amendment 17 — 2026-11-27 — class 9 on ADV-2026-11-27-37 item 2: the open that `recover_session`'s null-dataset arm starts is counted among the page's opens; its three tests; ADR-037's Amendment 1 in Part 1; the budget

*Lead-data drafted this before any code. It was written after two things were seen: the architect's read of Part 1 (`state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md`) and the ruling ADV-2026-11-27-37 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`). No test outcome of this piece exists. Rulings are cited by id and item. The form gate that passed the form reads this amendment alone (ruling item 2). [R] cites are at the reload piece's head 5ce0525a, and the drafter has no hashing tool, so the custodian pins each span at filing. Nothing above is edited.*

1. **Authority and scope.**
   - ADV-2026-11-27-37 item 2 counts the open that `recover_session` starts among the page's opens and does not accept the residual. This amendment does only what that item asks of the form: the handler, the tests, the ADR file in the part that lands the handler, and the budget.
   - The base is item 1's.
   - **Not touched:**
     - the handle arm of `recover_session`;
     - `list_recoverable` and `discard_recoverable`;
     - every kernel file and every line of the kernel's `recover_session` order (Amendment 2 item 4 at `:627-634` [M], as Amendment 4 item 5 revises it at `:1079-1098` [M]);
     - the wire, every shell file, and `capabilities/`.

2. **The handler** (`frontends/shell/src-tauri/src/commands.rs`, Part 1). For a null `dataset`, it follows ADR-037 §2 to §5 the way `open_dataset` (`commands.rs:86-101` [R]) and `open_project` (`commands.rs:244-268` [R]) do.
   - **Two crate-private async functions in `commands.rs`.** The Tauri command calls them, and so do the tests of item 3. The mutations therefore land in the code that ships, not in a copy of it.
     - `recover_on_page(pages, recorder, host, projects, request)`.
       - When `request.dataset` is a handle, it runs `StepRecorder`'s `recover_session` entry point on `spawn_blocking` and makes no `Pages` call.
       - When `request.dataset` is null, it awaits `Pages::admit(&request.cancel_key)` (`page.rs:229` [R]) on the async runtime, before the kernel is called. A gate refusal goes back unchanged: it is the kernel's cancelled refusal (`page.rs:189-193` [R]), which §2.4's reused cancel codes already cover.
       - Then it calls `recover_admitted` with the `Ticket` (`page.rs:128-142` [R]).
     - `recover_admitted(pages, ticket, recorder, host, projects, request)`.
       - It runs the kernel's `recover_session` on `spawn_blocking`.
       - It then calls `Pages::settle(ticket, name, &host, projects)` (`page.rs:303-309` [R]). The name is the reply's `dataset` when the reply is `Ok` and `opened` is present, and `None` otherwise.
       - It returns the reply and the `Settled` (`page.rs:113-123` [R]).
   - **The `#[tauri::command] recover_session`.**
     - It refuses a missing recorder before the gate, as `record_step` does (`commands.rs:195-199` [R]). This matches `open_project`, which checks `Projects` before its gate (`:244-250` [R]).
     - It passes `projects_of(&app)` (`commands.rs:57-60` [R]) as `open_dataset` does.
     - It starts the pool-lease poll only on `Settled::Current` for an `Ok` reply with `opened` present, under the same `cfg` as `commands.rs:95-100` [R].
   - **What this gives, clause by clause** (ruling item 2's four clauses):
     - (a) the gate before the host's open: `Pages::admit`;
     - (b) the name noted on its page after the open: `Pages::settle`, `Current` arm;
     - (c) its cancel key ended with the page: the in-flight entry `admit` makes carries `request.cancel_key`, which `run_end` cancels through `SkpHost::cancel` (`page.rs:477-496` [R]) and which the kernel's `begin_open(cancel_key)` registers (§2.3 `:83` [M]);
     - (d) a reply that arrives after the page's end is closed: `Pages::settle`, `Ended` arm, then the late close (`page.rs:320-355` [R]).
   - **Unchanged and still reached.**
     - The page's `cancel` goes through `Pages::cancel` (`commands.rs:129-136`, `page.rs:420-446` [R]). It ends a recover that waits at the gate as it ends an open.
     - The page's `close_dataset` of a recovered name goes through `Pages::forget` (`commands.rs:173`, `page.rs:360-364` [R]).
     - No public item of `page.rs` is added or changed (`page.rs:195-447` [R]).
   - **Doc comments made true** (comment lines only):
     - `commands.rs:16-20` and `:126-128` [R];
     - `page.rs:15-17`, `:21-23`, `:216` and the test list in `:117-121` [R], which gains T-2's name because T-2 joins the late close's handle;
     - `lib.rs:13-18` [R], if the gate reads it as naming the open commands only.
   - **Registration.** `lib.rs`'s handler list (`:616-639` [R]) gains the three commands as Amendment 10 item 2 has it (T-1). Nothing else in `lib.rs` changes.

3. **The tests** (Part 1). They are added after T-1's row in §4's table. The file is `frontends/shell/src-tauri/src/page.rs`, its `mod tests`. They run through the binding's own functions over a real `SkpHost`, `StepRecorder` and `Projects`, as ADR-037's proof asks (ADR-037 `:154-159` [R]).
   - **The harness** reuses `Rig`, `Latch`, `TestArm` with `Mode::Block`, and `poll`/`ready`/`assert_pending` (`page.rs:547-893` [R]).
   - **`Rig` gains one field, `recorder`.** It keeps a clone of the `StepRecorder` that `rig()` already builds and hands to `Projects::new` (`page.rs:701-702` [R]). This edits a test helper and no test. It is declared here, so it is inside §4 for §5 I3.
   - **The crashed record.** A second `StepRecorder` over the rig's `sessions` folder, on a `SkpHost` of its own over the same fixture, records one step for its open through `record_step`. It is then dropped without `end_session`, the way K-C9's record is left (Amendment 10 item 3, `:2109` [M]).
   - **The runtime.** Each test runs the async functions on a tokio multi-thread runtime it builds itself. That uses the crate's `rt-multi-thread` feature (`Cargo.toml:63` [R]) and the dev `macros` (`:97` [R]), with no Cargo or lockfile change (§5 I6).

| Id | Test | Mutation | Fails |
|---|---|---|---|
| T-2 | `a_recover_whose_reply_arrives_after_its_page_ended_is_closed` (`page.rs` tests): a crashed `unsaved-` record; the gate's ticket taken under page 1; page 1 ends, and its line counts `opens_cancelled=0`; then `recover_admitted` with that ticket and a null `dataset`. The reply is `Ok` with `opened` present, `settle` answers `Ended` with a late close that the test joins, the returned name is no longer in the catalog, and the current page's set is empty | `settle` given `None` in place of the returned name | T-2 |
| T-3 | `a_page_end_cancels_a_recover_in_flight_and_leaves_its_record` (`page.rs` tests): the record's `history.jsonl` bytes are read; `recover_on_page` with a null `dataset` runs on a thread of its own and stands in the watch arm (`Mode::Block`, inside step 4's open); page 1 ends; the arm is released. The reply is the kernel's cancelled refusal (`engine.cancelled`), `settle` answers `Ended` with no name, the history is byte for byte as it was, and the end's line counts `opens_cancelled=1` | `admit` given the empty string in place of the request's `cancel_key` (the end's cancel then meets `unknown`, and the recover completes and adopts the record) | T-3 |
| T-4 | `a_new_pages_open_waits_for_an_earlier_pages_recover` (`page.rs` tests): `recover_on_page` with a null `dataset` stands in the watch arm under page 1; page 1 ends; page 2's `admit` is pending; the arm is released and the recover returns; page 2's `admit` is then ready | the null arm takes the handle arm's path: no `admit` and no `settle` | T-4, T-3 |

   - **Red at the base.** `recover_on_page` and `recover_admitted` do not exist at the base, so each row fails to build there. The form's own wording covers this: a private step that does not exist at the base (Amendment 10 item 2, `:2065-2067` [M]).
   - **Known pass cases:** none.
   - **Each mutation** is applied, run, recorded by name with its commit, and reverted at Part 1's head (§4's last bullet).
   - **E-RECOVER gains no step.**
     - From the page, nothing distinguishes a counted recover open from an uncounted one. The null arm binds no project (§2.3 `:88` [M]), so no lock refusal follows a reload. No handle reaches the new page. No e2e suite reads the page-end line (a search of `frontends/shell/e2e` [R] finds none), and the shared log folder piece is not built (ADV-2026-11-27-37 item 4).
     - E-RECOVER's Recover already drives the new handler, the gate included, from the real shape (`:293` [M], as Amendment 2 revises it).
     - The proof of the counting rests on T-2 to T-4, as ADR-037's own three cases rest on binding tests beside its one e2e step.
   - **Not proposed: a step of the 'reload after Recover, then open again' kind.** None of the three mutations would make it fail.
   - **An option for the gate, not drafted: T-5.** It would show that the handle arm does not wait at the gate.

4. **ADR-037's Amendment 1** lands in Part 1, in the part that lands the handler (ruling item 2). The file is `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`. Its words are the architect's draft under `state/drafts/`, and the advisor rules them. This form drafts none of them.
   - `docs/README.md`'s ADR-037 row is not edited. Its precedent is the ADR-036 row, which names no amendment (`docs/README.md:73` [R]). The gate checks this.
   - No code of Part 1 before this amendment has passed and the ADR's amendment is accepted (ruling item 2, Order).

5. **The budget.** These are §2.11's groups by part, as Amendment 10 item 6 (`:2171-2197` [M]) has them. §7 is not edited, because its budgets are §2.11 (`:323` [M]). Each figure is re-declared here before code. Groups not listed are unchanged.

| Group | Part 1 (Amendment 10) | Part 1 now | Part 2 | Together now |
|---|---|---|---|---|
| src-tauri (`commands.rs`, `lib.rs`, and now `page.rs`) | 100 | 340 | 0 | 340 |
| records (Part 1 adds ADR-037's Amendment 1) | 0 | 80 | 160 | 240 |
| **Total** | **≤ 4,670, ≤ 45 files** | **≤ 4,990, ≤ 47 files** | **≤ 860, ≤ 6 files** | **≤ 5,850; 50 files in the union** |

   - **What the 240 src-tauri lines are**, counted by §2.11's command (both numstat columns):
     - about 70 product lines: the two functions, the null arm's gate, settle and poll in the command, and the doc lines of item 2, each changed line counted twice;
     - about 150 test lines: three tests, the record and request helpers, the runtime, and the `Rig` field;
     - about 20 lines of margin.
   - **The records figure of 80** is a placeholder for the architect's draft. Before code, the custodian sets it to that filed draft's line count if the count is larger.
   - **Files.** Two are added to the union, `page.rs` and the ADR-037 file, which makes 48 + 2 = 50 of the 50 that ADV-2026-11-23-29 item 1 allows. That holds only if the literal's list at the base is no longer than the 29 files of §2.4. Ahead of that list, the architect's read names two lines at the C1 head where `skp/0.17` is an annotation and not the literal (`...architect-read.md:101-105` [M]).
   - **Which way the overrun falls (ADV-2026-11-23-38 item 1).** The cap is for the whole: at most 5,530 lines over `B...H2`.
     - Part 1 now passes its figure by 320 lines.
     - Item 1's class 8 allowance is no more than twice the Part 1 lines that Part 2 deletes. By Amendment 10 item 6 as Amendment 12 N-39 revises it, that is about 50 to 100 lines, and it was given for the split's double count, not for new scope.
     - So this overrun is beyond that allowance. It goes to the advisor before the code that passes it, and it is not recorded as class 8. The ruling's Order already holds Part 1's code until this amendment passes and the ADR's amendment is accepted.

6. **Additions to the form's sections** (read with the sections named):
   - **§1, May claim** (`:37` [M]): also, that the open `recover_session`'s null arm starts is counted among the page's opens, under ADR-037 §2 to §5 and its Amendment 1, as T-2 to T-4 assert.
   - **§2.9, Seams** (`:175-182` [M], as Amendment 2 revises them): also `Pages::admit` and `Pages::settle` → `recover_on_page` and `recover_admitted` → the `recover_session` command (null arm).
   - **§2.9, Guarantees** (`:183-188` [M]): also ADR-037 §4 and §5 with its Amendment 1, for that open.
   - **§5, Declared unchanged** (`:301-305` [M]), also:
     - `page.rs`'s public items and their behaviour;
     - the handlers of `open_dataset`, `open_project`, `cancel` and `close_dataset`, but for their doc comments;
     - the kernel's `recover_session` order.
   - **§5, Invalidators** (`:306-312` [M]): **I10**, which is a stop. The counting needs any of these:
     - a new or changed public item in `page.rs`;
     - a non-comment line of `page.rs` outside `mod tests`;
     - a kernel or protocol change;
     - a Cargo or lockfile change.
   - **§8** (after item 15, `:1234` [M]): **16.** any of these:
     - the null arm's open reaching the kernel without the gate's ticket;
     - its returned name not settled on that ticket;
     - a `Pages` call in the handle arm, `list_recoverable` or `discard_recoverable`.
   - **§9, Architect** (`:341-345` [M]): also, the handler against ADR-037 as its Amendment 1 reads once accepted.
   - **§2.12** (after D22, `:2321` [M]): | D23 | rule | (none) | the null arm's open counted among the page's opens (item 2); T-2 to T-4; ADR-037 Amendment 1 in Part 1 | ADV-2026-11-27-37 item 2 |
   - **Amendment 10 item 2, Callers** (`:2034-2039` [M]): `recover_session`'s handler takes the gate and settles as item 2 says. **Tests** (`:2056-2064` [M]): T-2 to T-4 join T-1.
   - **Paths shared** (`:221-231` [M], as Amendment 2 N-7 revises them): `frontends/shell/src-tauri/src/page.rs` (Part 1) is shared with the reload piece. That piece is ahead in the merge order, so the path is met by the order (ruling item 1). The custodian's rule (00) list at the base confirms it.

7. **Places this amendment makes stale, by line** [M], for the gate:
   - `:43`, §1 ADRs: "none is amended". ADR-037 gains Amendment 1 in Part 1 (item 4).
   - `:2229`, Amendment 10 item 8's New text for §1 ADRs: the same.
   - `:2024`, Amendment 10 item 2 Files: "at most 45 files" and "Part 1 touches nothing under `docs/adr/`" (items 4 and 5).
   - `:2034-2039`, Callers: no `Pages` call (item 2).
   - `:2056-2064`, Part 1's test list (item 3).
   - `:214` and `:2180`, the src-tauri ceiling and its files (item 5).
   - `:2184`, records Part 1 = 0 (item 5).
   - `:2185`, the Total row (item 5).
   - `:2191`, "the union is 48 files of 50" (item 5).
   - `:2199-2201`, Amendment 10 item 7 (records by part): Part 1 now holds a record (item 4).
   - `:2257`, §5 Declared unchanged New text: ADR-037's text now changes too (item 6).
   - `:175-188`, §2.9 seams and guarantees (item 6).
   - `:221-231` with `:750-759`, the shared paths (item 6).
   - `:301-312`, §5 (item 6).
   - `:327` with `:1231-1234`, §8 (item 6).
   - `:341-345`, §9 Architect (item 6).
   - **Not stale, but read with this amendment:**
     - `:83` (the kernel's `begin_open` in the null arm, unchanged);
     - `:117` (the reused cancel codes, which cover the gate's refusal);
     - `:2065-2068` (Red at the base; no known pass case in Part 1);
     - `:2540` (Amendment 16 item 6, now answered by ruling item 2).

8. **Named, not changed:**
   - **(a) Where the kernel first holds the key.** The kernel registers the cancel key only at step 4's `begin_open`. If an end lands during steps 1 to 3a (validate, the held check, lock and read, the dedupe), its cancel meets `unknown`, the recover completes, and the late close closes it. That is ADR-037 §4's second outcome, and T-2 asserts it.
   - **(b) A late-closed recover's record.** The record was adopted and stays with the run (ADR-037 §8), and the run's normal end clears it. That is what ADR-037 consequence (e) already says of an unsaved open after a reload (ADR-037 `:140` [R]). Whether Amendment 1 says so is the architect's.
   - **(c) The new page's listing.** It runs at mount and does not wait at the gate. It skips a record that an earlier page's recover holds (`WouldBlock`) or that this run holds (§2.3 `:68` [M]), so nothing is offered twice.
   - **(d) The handle arm closed under it.** The case the architect's read names (its `:50-53`) stays out of this amendment, by ruling item 2.
   - **(e) Posture.** The amendment adds no command, member or capability entry. Ruling item 3's posture answer is the architect's.

9. **For the gate and the advisor:**
   - (i) item 5's figures, for the advisor before Part 1's code (ADV-2026-11-23-38 item 1);
   - (ii) the file count, which the custodian checks at the base;
   - (iii) the tests' place in `page.rs` and not in `commands.rs`. The alternative is `commands.rs`'s `mod tests` with a rig of its own: about 100 more lines and no `Rig` edit, with `page.rs` still edited for its doc lines.

10. **Next.** The form gate that passed the form reads this amendment alone (ruling item 2). No code of Part 1 is written before that gate passes, ADR-037's Amendment 1 is accepted, and the advisor has ruled item 9 (i).

Read the last amendment first.

Nothing above is edited.

=== END AMENDMENT DRAFT ===

Notes outside the amendment, for the custodian:
- I gave no verdict and changed no file.
- Item 6's additions are short descriptions, not Old/New text blocks, because the record cap allows references only. If the gate wants Old/New blocks, they follow from item 7's lines.
- One open fact affects the file union: the literal's list at the base. It is the custodian's to count under ruling item 1's rule (00).
