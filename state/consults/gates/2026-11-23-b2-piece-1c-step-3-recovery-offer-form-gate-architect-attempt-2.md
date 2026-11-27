Reviewed: main at caea224a6cb081edc4577e978e408692c0c1172c, in the detached read worktree C:/dev/wt/read-1123d (the custodian's filing note, 2026-11-23: the architect's form gate on the full form under Amendments 2 and 3, attempt 2, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-2, dispatched at 2026-11-23T16:07:35Z; its run: Read 22, Grep 16, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:07:36Z to 2026-11-23T16:20:44Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 16705 bytes, sha256 9de89a1e2851a96f354f43fc58ba651c7bf47b90f50365093faf8dcda1d6277d, byte for byte, nothing masked, with one final newline added. FAIL: C-8 (Correctness: the dedupe of Amendment 2 fails closed too widely, so any record another window holds for any project suppresses every offer of a session that never saved, and past 256 records for good; the answer to C-4 (ii) is untrue in that regime); E-3 (Evidence: K-C20's mutation passes unless the other project is a copy made by the reopen's answer copy) and E-4 (Evidence: K-C12's step check is shadowed by the record check); N-14 to N-18 Documentation; C-1 to C-3, C-5 to C-7, E-1, E-2 and N-1 to N-13 answered; OPEN-1 (C) and OPEN-4 (B) read sound, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123d @ caea224a6cb081edc4577e978e408692c0c1172c

Tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-2`. The form is `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, read under its Amendment 3 and Amendment 2. Every cite below is read at caea224a. Code is unchanged from 96f56d28, so every code cite in Amendment 2 holds.

**The verdict in one line.** The verdict is FAIL, on one Correctness finding (C-8) and two Evidence findings (E-3 and E-4). Amendment 2 answers C-1 to C-3, C-5 to C-7, E-1, E-2 and N-1 to N-13. Its answer to C-4 (ii) is untrue in one regime: the dedupe rule it adds brings back a starvation, and part of it is reachable in ordinary use.

## Correctness (blocks)

**C-8. The dedupe rule fails closed too widely, so the answer to C-4 (ii) is untrue (C-4's class).** It is in four places: Amendment 2 item 1's OPEN-4 reason, item 2's C-4 text, item 4's "The dedupe" bullet, and item 6's N-10 fourth bullet. §2.9's guarantee line, "ADR-036 §9: offered at next start", is not superseded.

- **Any held project record suppresses every offer.** Under item 4, any held `<hex>` history means no `unsaved-` record is listed at that start, whatever its project.
  - A live run holds a `<hex>` lock for every record its bound opens hold. It takes that lock when a step creates the record (`kernel/src/session_history.rs:316-321`, :523) and when a save moves one in (:366-378, :556-562).
  - So a second window that has saved any project and has a record for it stops a crashed window's never-saved session from being offered at the restart. With two windows that is ordinary use.
- **Past 256 records the suppression is permanent.** Some `<hex>` records hold no step after their last saved-here mark. Under OPEN-2 (A) they are never offered at an open. They are never listed at a start, and nothing removes them (`end_session` clears only this run's records, :437-448). Once 257 non-empty ones exist, no start ever lists an `unsaved-` record again.
  - Item 1 says "each record can leave by the user's Discard". That fails here, and C-4 (ii)'s starvation comes back for good.
- **The disclosure is untrue.** Item 76's fourth bullet (form :788) speaks of "unsaved changes". The rule counts and locks saved projects' histories, whether or not they hold unsaved changes. That is an untrue claim of a limit.
- **Amendment 1 item 5 is kept** (ADR-036:272). The cost is §9's "recovery is offered when the application next starts" (ADR-036:206), which the form still claims in §2.9 and in §1 ("ADRs: none is amended").
- **What the fix must do** (the design is the drafter's):
  - (1) A record that another window holds for an unrelated project must not suppress an offer. One sound route: a moved record's `locations.json` is a byte copy of the `unsaved-` one's (:553), and nothing locks it. So only a `<hex>` folder whose `locations.json` names the `unsaved-` record's dataset URI can hold its twin. The rule can then fail closed for that record alone.
  - (2) Its reads are bounded, and whatever it still cannot offer is stated truly in item 76 and in §2.9's guarantee line.
  - (3) For each `unsaved-` folder, the `<hex>` side is read after that folder's lock is taken. A save renames the `<hex>` history in (:562) before it drops the old handle (:374), so a read made then finds the move, renamed in and locked. A `<hex>` set read once per start and reused does not: a listing that takes the `unsaved-` lock in the gap at :374-378 would list a live run's moved session. Item 4 orders the dedupe after the lock, but question 8(c) counts 256 reads per start, so the text is ambiguous at exactly this point.
  - (4) Any departure from §9 that remains goes to the advisor as a question. A qualifier to ADR-036 §9 would be the human's.
- If the advisor instead accepts the design as drafted, the fourth bullet needs true words. These are not the human's wording; they are an advisor P6 draft:
```text
  - While another window of the app holds a saved project's unsaved changes, or while more than 256 saved projects' unsaved changes are kept on this computer, a start offers no session that never saved, and says that more are kept.
```
```text
  - While another window of the app keeps a session history for any saved project, or while session histories of more than 256 saved projects are kept on this computer, a start offers no session that never saved, and says that more are kept. A saved project's session history that holds no change after its last save is never offered or removed (item 70), so once more than 256 of them are kept, no start offers such a session again.
```
  - Clause check: the window clause is the lock at :523 and :556-562. The count is item 4's non-empty `<hex>` histories. "Never offered or removed" is OPEN-2 (A) plus :437-448. A transient lock from another instance's listing falls within one request round trip: it is named here, and it does not block.

## Evidence (blocks)

**E-3. K-C20 (form :682): its mutation has a known pass case.** Each project's dataset URI is its own. With `reopened_as` not compared, the header-URI condition (form :455) still refuses an open of another project, so K-C20 stays green. A project made by the reopen's answer `copy` keeps the dataset entry (`kernel/src/project/mod.rs:759-766`). Only such a project separates the two conditions.
```text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` | `reopened_as` not compared | K-C20 |
```
```text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` (the other project is a copy of the record's project, made by the reopen's answer `copy`, so its dataset URI is the header's and only `reopened_as` differs) | `reopened_as` not compared | K-C20 |
```

**E-4. K-C12 (form :284): its mutation has a known pass case.** A step creates the open's record (`kernel/src/session_history.rs:316-321`). So an open with a step always fails the "no record" condition, and skipping only the step check leaves K-C12 green. Make it one check and mutate that check.
```text
and the open must have no step, no record and no binding.
```
```text
and the open must hold no record (a first step makes one, so this one check also refuses an open with a step) and no binding.
```
```text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | step check skipped | K-C12 |
```
```text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | the check that the open holds no record removed | K-C12 |
```

## Documentation (must be fixed before the merge; none blocks on its own; none of these is the human's wording)

**N-14. S-7 and S-8 name no file.** By item 5's rule they would therefore go in `kernel/tests/recovery.rs`, which is wrong.
```text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` | the entry kept after Recover | S-7 |
```
```text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` (`RecoveryOffer.test.tsx`) | the entry kept after Recover | S-7 |
```
```text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` | Recover shown for `cannot-be-offered` | S-8 |
```
```text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` (`RecoveryOffer.test.tsx`) | Recover shown for `cannot-be-offered` | S-8 |
```

**N-15. Item 1's accounts of the other options are not complete.**
- Under OPEN-4 (A), K-C24's mutation passes on every system, not only on Windows: an empty history that is read has no step and is not listed.
- Under OPEN-1 (A), the account leaves out several changes: the wire's `changed` state, the §2.4 not-cancellable bullet, §8 item 10, K-C5's rename, and `dataset_ref.rs` in Scope.
- Under OPEN-1 (B), it leaves out S-3 and R-S5's place.
```text
The form below is sound under them.
```
```text
The form below is sound under them. The accounts below of the other options are not complete (under OPEN-4 (A), K-C24's mutation passes on every system, not only on Windows), so a ruling of another option returns the form to its drafter and to this gate before any code.
```

**N-16. Locks across waits, and the order of the header check.**
- The form does not say that the recorder's state mutex (:249) is never held across a lock probe, a read, `metadata` or the data's open. If it were held, `record_step` (:306) would wait on all of them.
- A second Recover pressed while the first is in flight would meet `…_locked`, which N-11 forbids.
- C-2's one-dataset refusal has no place in the order, so it could come after the `set_len` of step 5.
```text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte.
```
```text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte. The header's one-dataset check (C-2) is made at step 3, so no refusal follows step 5.
     - The recorder's state lock is taken only to read or change `state`, at steps 2 and 6, and never across a lock probe, a file read, `metadata` or the data's open; the listing takes it the same way. Step 2 reserves the record name until step 6 or the refusal, so a second `recover_session` of it in this run meets the held check and refuses `…_unknown` (N-11).
```
```text
and it calls `metadata` once on each listed record's data path.
```
```text
and it calls `metadata` once on each listed record's data path, holding no history lock and not the recorder's state lock; on a path the operating system cannot reach at once, such as an unreachable network share, that call waits as long as the operating system makes it, and only the list's reply waits with it.
```

**N-17. K-C17's name claims more than it asserts.** A mutation that reads a byte and still answers `found` passes it. §8 item 10 holds that case by review.
```text
| K-C17 | `the_listing_reads_no_byte_of_the_data_file` (data replaced by a 0-byte file: `found`) |
```
```text
| K-C17 | `the_listing_states_found_from_metadata_alone` (data replaced by a 0-byte file: `found`; §8 item 10 holds the rest by review) |
```

**N-18. Gaps where a lock is dropped before removal: name them.** `end_session` (:443-446) and a save's move (:374-378) both drop a history's lock before removing its files.
```text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block.
```
```text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block. Named too: `end_session` (`kernel/src/session_history.rs:443-446`) and a save's move (:374-378) drop a history's lock before removing its files, so a listing in another instance in that gap can list a session that is then gone, and its Recover or Discard is refused; on Windows its folder can stay empty, unlisted and unremoved. Each gap is one removal, inside one request round trip, and does not block.
```

## Attempt-1 findings, by id
- **C-1:** answered. The cites hold: `bound` is set only at :398-400 and :383, `holder()` is at :147-152, and the early return is at :357.
- **C-2:** answered (:176-184, :307-308, :325-326); the order is in N-16.
- **C-3:** answered (`protocol/skp/SKP-V0.md:1434`).
- **C-4:** (i) answered. (ii) is untrue in the regime C-8 describes.
- **C-5:** answered under (C) (`engine/src/descriptor.rs:103`, :122-134; `kernel/src/dataset_ref.rs:321-322`).
- **C-6:** answered (App.tsx:1238). `partsOf` is private (`frontends/shell/src/project/reopenNotices.ts:46`), so "joined as" means the same rule, reimplemented.
- **C-7:** answered under (C).
- **E-1:** answered.
- **E-2:** answered. The mutated read fails on Windows (H1), the record is listed `cannot-be-offered`, and K-C6 goes red. On macOS/Linux the record is listed with its steps.
- **N-1 to N-13:** answered. N-2 and N-10 are adapted to (C), and the adaptation is sound. N-9 goes to the advisor.

## The recommendations
- **OPEN-1 (C)** is sound against the code. Existence is known from the metadata at descriptor.rs:103, the full check runs at accept, and C-6 shows it.
- **OPEN-4 (B)** is sound in itself. Its stated reason holds only once C-8 is fixed.
- The accounts of the other options: see N-15.

## The walk and the locks
- **The empty-history window has no race.** A history gets bytes only under its creator's lock (:516-532). A move renames a full file in, already locked (:556-562).
- **A crash at each step:**
  - Listing: the OS frees the lock and nothing is written.
  - `recover_session` steps 1–4: the history is left as it was. Step 5: a valid prefix is left and offered again. Step 6: memory only.
  - Discard, between its removals: a folder holding only `locations.json` is left. It is skipped, and it leaks.
  - `create`, before the header: an empty history, which is skipped and leaks.
  - Both leaks are crash-timing cases and do not block.
- **Two runs:**
  - Recover against recover: the second meets `…_locked`, and R-S8 is true.
  - The suppression across windows is C-8, and the dedupe's moment is C-8 (3).
- **Does failing closed keep ADR-036 Amendment 1 item 5?** Yes, at the cost described in C-8.
- **Question 8(c), docs/01 principle 7:**
  - The store reads hold, in `record_step`'s class (SKP-V0.md:1309): bounded reads of the app's own store.
  - The `metadata` call holds only under N-16's words. Nothing else may wait on it, and the canvas is never blocked.

## Old texts, places, scope
- Each Old text occurs once above Amendment 2. Each addition names its place; §8 items 10–12 follow item 9.
- Full gating stands (§21a: the wire and guarantees).
- The additions are declared before any code. This is a gate's answer, so it is not class 8 and not class 9.
- The ceilings sum to 4,330, and 47 files is within the 50.
- A C-8 redesign may move the kernel ceilings. Declare them before code.

## The drafter's unsettled points
- **Gate's words adapted:** accepted; nothing blocks.
- **Held PRs' file lists, store.rs and PR 362:** the custodian's, before code.
- **CI for H3:** `.github/workflows/product-ci-rust.yml:205-208` runs `cargo test --workspace --locked` on ubuntu-24.04 and macos-latest. Tests behind the fixture feature do not run there. A macOS/Linux mutation needs a pushed mutation commit; otherwise it stays a prediction. This is for the code's gates.
- **The `rule` field could echo a path:** for the code's gates. `location()` does not echo the path (`kernel/src/project/store.rs:513-515`); the strict reader's text is not yet verified.
- **The `restored` mark:** I recommend the safer choice before code. A record that holds one should be `cannot-be-offered` (`later-version`), because ignoring it would compute the last values wrongly and silently (:1345-1353). For the code's gates and the advisor; it does not block, since no writer exists today.
- **The gap in `adopt_project`:** see C-8 (3) and N-18.
- **Line estimates:** the reviewer's count.
- **Failing closed and 256:** C-8.

## OPEN items and questions (soundness only, not ruled)
- OPEN-2 and OPEN-3 are unchanged.
- Question 8(a) (the twin seen after its project's record clears) is real: it follows a crash inside a save, or a failed removal at :376-377, whose errors are ignored. It is for the advisor and touches Amendment 1 item 5.
- 8(b): the gate's note stands.
- 8(d): R-S11 says "changes" for a record holding only a header, which has none. That is for the advisor at P6.

## Files read (at caea224a)
- the brief, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/brief-formgate-recovery-a2.md`
- the form, :1-424 and Amendments 2 and 3
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md`
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-2-lead-data-draft.md`, :468-487
- `kernel/src/session_history.rs`, :1-1399
- `kernel/src/project/store.rs`, :40-69 and :440-519
- `kernel/src/project/mod.rs`, :750-829
- `kernel/src/dataset_ref.rs`, :300-339
- `kernel/src/permission/audit/log.rs`, :377
- `engine/src/descriptor.rs`, :45 and :95-139
- `protocol/skp/SKP-V0.md`, :1296-1315 and :1425-1439
- `protocol/skp/src/v0/commands.rs`, by search
- `frontends/shell/src/App.tsx`, :1205-1249
- `frontends/shell/src/project/reopenNotices.ts`
- `docs/01_Principles.md`
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, :200-299
- `governance/AUTONOMY.md`, §21–§21c
- `docs/PREREGISTRATION-TEMPLATE.md`, :169-170
- `.github/workflows/product-ci-rust.yml`, :190-258

Opus 5.5 (claude-opus-5-5)
