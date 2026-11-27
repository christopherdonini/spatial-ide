Reviewed: main at a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201, in the detached read worktree C:/dev/wt/read-1123x (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 5, attempt 3, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-3, dispatched at 2026-11-23T17:22:58Z; its run: Read 21, Grep 17, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:22:59Z to 2026-11-23T17:38:02Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 25418 bytes, sha256 22c664362fb5fdd06089064d4da6aa0049809ca33b8f13647410b9cab032522b, byte for byte, nothing masked, with one final newline added. FAIL on C-9 (K-C27's seam is a parameter only the test supplies), C-10 (point (2)'s count of metadata calls is untrue) and E-5 (K-C28 and K-C34 under H1 on Windows); N-19 (a project folder with no history withholds an unsaved session at every start; not blocking, to be fixed before code) and N-20 to N-26 Documentation; C-8 (1), (3), (4), E-3, E-4 and N-14 to N-18 answered; replacement words given for each.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123x @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201

This is the architect's form gate, attempt 3. Tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-3`. The form is `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` (called "form" below), read under its Amendment 5 and Amendment 4. Every cite is at a12ab7e2. Code cites are unchanged from caea224a, and every code cite in Amendment 4 holds. None of the sentences below is the human's wording.

**The verdict in one line.** FAIL, on two Correctness findings and one Evidence finding:
- **C-9:** K-C27's seam is a callback that only the test uses (the caller rule).
- **C-10:** Point (2) states a limit on `metadata` calls that its own rule does not keep.
- **E-5:** under H1, K-C34's mutation as named passes on Windows, and K-C28's assertions as described do too.

Amendment 4 answers C-8 (1), (3) and (4), E-3, E-4 and N-14 to N-18. C-8 (2) is answered except for the count that C-10 corrects.

## Correctness (blocks)

**C-9. K-C27's seam breaks the caller rule** (form :1206; the human's rule of 2026-09-16, round 5 item 4).
- The start walk gets a private parameter. Only the test supplies a body for it, the product passes a no-op, and the test's body acts: it makes a folder.
- The rule names callbacks and does not limit itself to `pub` items, and the instrument exemption covers nothing that acts.
- Fix: two private steps, each with the start's listing as its product caller. The walk returns its taken records and no folder names. The dedupe then reads the names itself. The test calls the two in the product's order.
```text
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; the start walk's private parameter, called after the locks and before the dedupe's names read, which the product passes as a no-op, makes U's twin folder there, its history held by the test: U not listed) | the dedupe's `<hex>` names taken from the walk's first read | K-C27 |
```
```text
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; it calls the start's two private steps in the product's order: the walk, which takes and locks U and returns no folder names; then, after the test makes U's twin `<hex>` folder with its history held by the test, the dedupe, which reads the names itself: U not listed. The start's listing is the only product caller of both, and no parameter exists for the test) | the walk's first names passed to the dedupe and used for its `<hex>` side | K-C27 |
```
```text
     - K-C27 calls the start walk and its parameter, which do not exist then either.
```
```text
     - K-C27 calls the start walk and the dedupe, which do not exist then either.
```
```text
     1. The folder names under the root are read again. The names read before the locks are not used for it (C-8 (3)).
```
```text
     1. The folder names under the root are read again, by the dedupe itself. The walk returns its taken records and no folder names, so the names read before the locks cannot reach it (C-8 (3)).
```
Clause check: there is no parameter, and both functions are called by the start. The mutation needs the names carried in the walk's result, and then the new folder is missed and U is listed, so the test goes red. The order of the two calls is held by review under §8 item 14 (form :1233).

**C-10. Point (2) states a limit on `metadata` calls that the code would not keep** (form :1054; an untrue claim of a limit).
- Step 2 (form :1020) counts only the `<hex>` folders that hold a `locations.json`. Finding out whether a folder holds one costs a `metadata` call, and a `NotFound` result does not count.
- Step 4 (form :1022) cannot tell "more than the bound" without a 257th call that succeeds.
- So the calls number one per `<hex>` folder that holds no `locations.json`, plus up to 257. That is bounded by how many folders are in the store, not by `MAX_DEDUPE_RECORDS`.
```text
     - at most `MAX_DEDUPE_RECORDS` `metadata` calls on `<hex>` `locations.json` files;
```
```text
     - one `metadata` call on the `locations.json` of each `<hex>` folder that the second read of the names returns, until `MAX_DEDUPE_RECORDS` + 1 of them have found one. A `<hex>` folder that holds no `locations.json` costs a call and does not count, so this count is bounded by the folders in the store, not by `MAX_DEDUPE_RECORDS`;
```
Clause check: step 2 counts only folders that hold the file, and step 4 needs the 257th. The names are read in full, as Amendment 2's C-4 text has it (form :493).

## Evidence (blocks)

**E-5. K-C28 and K-C34 rest on H2, but H1 gives a case where neither goes red on Windows** (form :1207, :1213, :1222-1223, :1226).
- **The mechanism.** Item 3 reads a twin "once locked … through that handle" (form :993). H1 (form :31) says a read through a handle that holds no lock fails on Windows while the test's handle holds the lock.
- **K-C34.** A mutation that goes on past `WouldBlock` fails at the read, and the twin is left, so K-C34 passes on Windows. On macOS/Linux, under H3 (form :637), the twin is read and removed, so K-C34 goes red there.
- **K-C28.** The same mutant hits the same failed read, so the record is listed `cannot-be-offered` and its bytes are untouched. As described, K-C28 asserts only the bytes, so it stays green unless it also asserts that the reply lists nothing.
```text
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as clearable | K-C28 |
```
```text
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; the reply lists no entry, in any state; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as a lock held, so the record is read and judged through the listing's own handle (Windows: the read fails, H1, and an entry is listed `cannot-be-offered`; macOS/Linux: the record is cleared) | K-C28 |
```
```text
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as removable | K-C34 |
```
```text
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as a lock held, so the twin is read, judged and removed through the search's own handle (Windows: the read fails, H1, the twin is left and K-C34 passes, a named pass case; macOS/Linux: removed, observed on a macOS or Linux runner by a pushed mutation commit) | K-C34 |
```
```text
   - **Known pass cases.** None is known for any mutation.
```
```text
   - **Known pass cases.** None is known for any mutation but K-C34's on Windows, which its row names.
```
```text
   - **§5, added after "Predicted":** K-C28 and K-C34 fail under their mutations on Windows (H2) and on macOS/Linux (H3).
```
```text
   - **§5, added after "Predicted":** K-C28 fails under its mutation on Windows (H1: an entry is listed) and on macOS/Linux (H3: the record is cleared). K-C34 fails under its mutation on macOS/Linux (H3) and passes on Windows (H1), as its row names.
```
K-C25, K-C26 and K-C37 hold on both systems. Under each mutation the probe meets the test's handle: on Windows through LockFileEx per handle (H1), and on macOS/Linux through `flock` per open file description (H3).

## Documentation (must be fixed before the merge; none blocks; none is the human's wording)

**N-19. A `<hex>` folder with no `history.jsonl` withholds an `unsaved-` record at every start, and stays at its open.** This is a Correctness case inside one request round trip. It is named here and does not block, but it must be fixed before code.
- **How it happens.** A crash during a save's move between `create_dir` and `rename` (`kernel/src/session_history.rs:551-562`) leaves a `<hex>` folder with the copied `locations.json`, a `.tmp-` file and no `history.jsonl`. The `unsaved-` record U is left whole, because its removal comes after :374.
- **At every start.** Step 3 (form :1021) withholds U on "any other failure", here `NotFound`. U also takes one of the 64 places at every start.
- **At the project's open.** Step 1 (form :927) lists the folder as `cannot-be-offered`, while Amendment 2 says such a folder is not listed (form :815). Discard cannot remove the folder past its `.tmp-` file, `adopt_project`'s check that another run left the folder (:362-365) then refuses every later save, and item 70's sign stays for good. Ruling item 4 forbids that.
- **Why the fix is sound under the locks.** The mover holds U's lock until after the rename (:562 before :374). So a lock on U taken while `history.jsonl` is absent means no move of U will finish. The project's `open.lock`, taken at the open (`kernel/src/project/mod.rs:781`) and held (:876), and taken at a first save (:396), means no move into that `<hex>` folder can be in flight at the open.
```text
On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
```
```text
A candidate whose `history.jsonl` is absent, or 0 bytes, by its metadata is not a twin and is not locked. A save's move renames in a history that is full and already locked (`kernel/src/session_history.rs:558-562`), and the taken record's lock is held only after that mover has released it, so the taken record is the only copy and is listed. On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
```
```text
     1. It runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
```
```text
     1. It reads the metadata of `history.jsonl`. When that file is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed. No run can be moving a history into it, because this open holds the project's `open.lock` (`kernel/src/project/mod.rs:781`, :876; ADR-036 Amendment 1 item 3) and a first save takes it (:396). Otherwise it runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
```
```text
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |
```
```text
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |
| K-C38 | `an_unsaved_record_whose_projects_folder_holds_no_history_is_listed` (a `<hex>` folder holding a byte copy of U's `locations.json` and a `history.jsonl.tmp-` file, and no `history.jsonl`: U listed) | a candidate with no history withholds | K-C38 |
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
```
These two rows add tests. Re-declare the kernel tests ceiling before code if they pass it.

**N-20. Item 3 can remove another instance's history that is being created.** This needs timing within microseconds inside one round trip. It is named here and does not block.
- `create` opens the new history at :521 and locks it at :523. In between, the file is empty and unlocked.
- Read literally, item 3's rule makes an empty U a twin, because an empty list of step ids is a prefix of any list.
- An instance with a copy of the project open, at its first step, has equal `locations.json` bytes. The search could take that file in the gap and remove it. That instance would then lock an unlinked file and record to nothing, silently.
```text
     - U's kept step ids, in order, are the first kept step ids of R, or neither holds a step.
```
```text
     - U's history holds a header the reader accepts, and either U holds at least one kept step and its kept step ids, in order, are the first kept step ids of R, or neither holds a step.
```
```text
        - on equal bytes, `try_lock` on its history. `WouldBlock` leaves it, because a live run holds it, this run included (H1, H3), and any other failure leaves it too;
```
```text
        - on equal bytes, `metadata` of its `history.jsonl`. An absent or 0-byte history is left unlocked: a history is created empty and locked only after that (`kernel/src/session_history.rs:516-523`), so an empty one may be another run's in that gap. Otherwise `try_lock` on its history. `WouldBlock` leaves it, because a live run or another instance's listing holds it, this run included (H1, H3), and any other failure leaves it too;
```

**N-21. Item 76's drafts claim more than the rules do** (form :1261-1262).
- A twin is also left when another instance's start walk holds it at that moment.
- A project's history leaves at its open only if it holds nothing after its last save. One with changes after the save leaves only when its offer there is answered.
```text
A saved project's session history leaves when that project is next opened, as item 70 says.
```
```text
A saved project's session history with no change after its last save leaves when that project is next opened. One with changes after it leaves when its offer there is answered, as item 70 says.
```
```text
  - When more than 256 sessions that never saved are kept, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
```
```text
  - When more than 256 sessions that never saved are kept, or when another window of the app is listing its sessions at that moment, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
```

**N-22. Where item 4's first Old text is, and "skipped".**
- That Old text is in §2.3's "At start" bullet (form :72), not in Amendment 2's C-4 text.
- Amendment 2 item 4 is an addition in prose, not a New fence, so its bullets are replaced in place by the same rule.
- Its New text says "skipped", but item 4 counts twins toward `MAX_RECOVERABLE_RECORDS` (form :1012), and skipped folders do not count.
```text
The first of these Old texts sits in Amendment 2's C-4 New text; the other two are bullets of Amendment 2's item 4:
```
```text
The first of these Old texts sits in §2.3's **At start** bullet; the other two are bullets of Amendment 2's item 4, an addition replaced in place by the same rule:
```
```text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is skipped
```
```text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is not listed, and counts toward `MAX_RECOVERABLE_RECORDS`
```

**N-23. The class label.** Class 9 applies to work added by a standing rule (template, Round 25 additions, class 9). ADV-2026-11-23-16 is a ruling on this piece, not a standing rule. Before code there is no overrun, so class 8 does not apply either.
```text
These are class-9 scope additions, recorded before any code.
```
```text
These are additions that the gate's answer and ADV-2026-11-23-16 bring, declared before any code. They are not class 9, because the ruling is not a standing rule, and not class 8, because no code exists.
```

**N-24. The item 2 note for ADR-036** (form :1237).
- A note is needed. ADR-036:209 says a crash leaves the history for the recovery offer.
- "nothing in it is unsaved" is untrue in item 12 (a)'s own case.
- The draft also leaves out the clear's conditions.
- This is the advisor's to word. Here are words that hold against the code:
```text
A draft, to follow that sentence: "A project's record that another run left, that no running session holds, and that holds no step after its last `saved-here` mark is cleared when that project is next opened, with no offer: nothing in it is unsaved."
```
```text
A draft, to follow that sentence: "A project's record that another run left, that no running session holds, whose header names no action this version lacks, whose kept lines end with a `saved-here` mark and hold no `restored` mark, and in which the reader refuses no line but a torn last one, is cleared when that project is next opened, with no offer: its steps reach the project file that mark followed."
```
Clause check:
- "no running session holds": step 1's `WouldBlock`.
- "names no action this version lacks": `actions` ≤ `ACTIONS`.
- "end with a mark", "no `restored` mark" and "no line but a torn last one": step 3's other bullets.
- "reach the project file that mark followed": `kernel/src/session_history.rs:423-425` and `kernel/src/project/mod.rs:406`, :418.

The item 3 note is sound as "none needed". The "is then removed" quote at ADR-036:272 matches byte for byte.

**N-25. Item 5 gains an unruled qualifier.** The ruling removes the twin unless a live run holds it. Item 3 also leaves a twin past `MAX_DEDUPE_RECORDS` `unsaved-` folders, and one that another instance's listing holds. That qualifier goes to the advisor.
```text
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.
```
```text
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.
   - (g) **Item 5's bound.** The ruling removes the twin unless a live run holds it. Item 3 also leaves a twin past `MAX_DEDUPE_RECORDS` `unsaved-` folders, and one that another instance's listing holds at that moment. Item 76's third bullet names both. Is that qualifier accepted?
```

**N-26. K-C36 does not reach the clear's `restored` condition.** Its record has no `saved-here` mark, so a mutation of the clear's own condition passes it. §8 item 15 holds that by review. One fixture can cover both:
```text
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a header, s1, s2, a `restored` mark to s1, s3) | `restored` marks not considered | K-C36 |
```
```text
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a project's record at its open: a header, s1, s2, a `restored` mark to s1, s3, a `saved-here` mark after s3; listed `later-version`, and the folder is still there) | `restored` marks not considered (the record is then cleared) | K-C36 |
```

## Attempt-2 findings, by id
- **C-8 (1):** answered. An unrelated `<hex>` record has an identity minted for it (`kernel/src/session_history.rs:176-184`), so its bytes differ and its lock is never probed. A copy keeps the dataset entry (`kernel/src/project/mod.rs:759-766`), and the first-step test separates it.
- **C-8 (2):** answered except for the count corrected in C-10. Item 76 and §2.9 now state what a start withholds; N-21 narrows two of those claims.
- **C-8 (3):** answered, and sound. The rename at :562 comes before the drop at :374, and the new file is locked at :558 before it is renamed.
- **C-8 (4):** answered, by question (b).
- **E-3, E-4:** answered, with the gate's texts and true grounds (:316-321; `kernel/src/project/mod.rs:759-766`).
- **N-14 to N-17:** adopted as given.
- **N-18:** adopted, and its change is true. The walk keeps each lock until the dedupe ends, and a moved session is withheld because its new history is locked.

## Ruling items
- **Items 1-3, 6-8, 10 and 11:** recorded as ruled, and no ruled thing is changed. OP6's move is recorded in the 1c form's Amendment 78 (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:4883`).
- **Item 4:** the clear is sound under the locks.
  - Its removals are made under the record's lock.
  - ADR-036 Amendment 1 item 3's `open.lock` (`kernel/src/project/mod.rs:781`, :876, :396) means no other run can be saving or reopening the project during its open.
  - The only refusal comes from another instance's probe, and it is transient. The form names it (form :953).
  - The reason it gives for clearing holds (`kernel/src/project/mod.rs:355`, :406, :418; `kernel/src/session_history.rs:423-425`, :437-448).
  - Its account of the case where clearing loses something is true. `reopened()` is not given the workspace (:392), and `mod.rs` may not be edited (§5 I8).
  - The one place item 4 falls short is the folder with no history (N-19).
- **Item 5:** the twin's rule and its removal are sound under the locks. All probes are `try_lock`, so there is no deadlock. Twins are removed after the act's last check and before its first change to R, so a crash between leaves R holding every line the twin held. The exceptions are N-20 and N-25.
- **Item 9 (docs/01 principle 7):** the bound holds, on two conditions:
  - The command runs off the main thread (T-1, form :287). Only the list's reply waits on a slow `metadata` call, and no lock is held across it (form :1023, :1155). The code's gates confirm that no other control or command waits on the reply.
  - The store reads have declared bounds, in `record_step`'s class (`protocol/skp/SKP-V0.md:1309`), once C-10's count is stated truly. In the worst case, the twin search's full reads at an open, a recover or a discard reach 256 × 32 MiB, but only for folders whose `locations.json` bytes and first step both equal R's. Outside a store made by hand, that is at most one or two.
- **ADR-006:** the clear is upkeep of the app's own store, in `end_session`'s class. It is not an external side effect.

## The adoptions and the drafter's points
- **`later-version` for a record with a `restored` mark:** sound.
  - A `restored` mark moves the chain's parent (`kernel/src/session_history.rs:1345-1353`), and no writer exists in this version.
  - Never clearing such a record is the safe choice.
  - The code's gates check that the last-value computation and the entry match.
- **K-C27 seam:** it blocks (C-9).
- **K-C25, K-C26 and K-C37:** sound on both systems.
- **K-C28 and K-C34:** they block (E-5). After the fix, it is for the code's gates: Windows CI observes K-C28, and a pushed mutation commit observes K-C34 on macOS/Linux.
- **Hashes:** for the custodian's re-sweep, before code (Amendment 5 item 3). This does not block.
- **The ceiling (5,260):** sound for Amendment 4 as drafted. Every row's increase matches the line estimates, and the total is right. The kernel product's +270 is tight. N-19's rows and C-9 add roughly 30-60 product lines and 60-80 test lines, so re-declare before code if a row passes its figure. Whether to accept it is the advisor's.
- **K-C7:** its fixture must make U and the `<hex>` record by a real move, or with byte-equal `locations.json` files. Otherwise the correct code reads the pair as unrelated and K-C7 goes red. This is for the code's gates.

## Questions 12 (a) to (f): sound, not ruled
- **(a):** sound.
- **(b):** sound. The quoted words at ADR-036:206 match byte for byte.
- **(c):** sound. See N-24 for the note's words.
- **(d):** sound.
- **(e):** sound. The ignored removal errors are at :376-377, and the rule "and nothing else" is at :437-438.
- **(f):** sound.

## Old texts, places, scope
- Each Old text in Amendment 4 occurs once above it. Each addition says where it goes. The place claim and the in-place rule are corrected in N-22.
- Full gating stands (§21a: the wire and a guarantee). No file is added, and 47 files is within 50.

## Files read (at a12ab7e2)
- the brief, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/brief-formgate-recovery-a3.md`
- the form, :1-380, :425-888 and :903-1379
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-2.md`
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-16-the-recovery-offer-open-1-c-open-4-b-open-3-a-open-2-not-as-drafted-the-unsaved-twin-removed-op6-moves.md`
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-4-lead-data-draft.md`, :471-492
- `kernel/src/session_history.rs`, :1-620, :870-929 and :1225-1374
- `kernel/src/project/mod.rs`, :340-424 and :750-774, plus searches
- `kernel/src/project/store.rs`, :455-484
- `kernel/src/publish/mod.rs`, :240-268; `kernel/src/skp.rs`, :2395-2434
- `frontends/shell/src-tauri/src/commands.rs`, by search
- `protocol/skp/SKP-V0.md`, :1296-1315
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, :195-308
- `docs/01_Principles.md`, :1-26
- `governance/AUTONOMY.md`, :306-360
- `docs/PREREGISTRATION-TEMPLATE.md`, :160-171
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, by search

Opus 5.5 (claude-opus-5-5)
