# The recovery offer's Part 1, the architect's build gate, the read part, at ffef5945 (node:b2-piece-1c-step-3-recovery-offer@part-1-build-gate-architect-read-part)

*Filed by the custodian at the report path its brief named. The architect (Opus) read main at 8cc4fdd8 in D:/wt/read-1128h and the head ffef5945 in D:/wt/read-recov. By the facts script its records run from 2026-11-28T07:14:05Z to 2026-11-28T07:27:50Z, and 0 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 824947 ms and 122 tool uses. It gives no verdict and no gate-log row. Its hand-back is below as received, with the harness indent removed: 20448 bytes, sha256 7c7b182601be2f7009c0a2f08604d8289a23af0219f493e8f880dd61986e74e6. Its words are the architect's.*

---

READ PART: cut/b2-piece-1c-step-3-recovery-offer @ ffef5945852de68bdaa9c8d90d725566823451b1 (code, read in D:/wt/read-recov; base 97e2156d). Governance and the form were read at main 8cc4fdd88f7367307ca5aebd80773baa3ad4a857 (D:/wt/read-1128h).

This is the architect's read part of Part 1's build gate, under ADV-2026-11-28-12 item 1 and the form's Amendment 25. It gives no verdict and no gate-log row. I started no app and ran, built and tested nothing. Code cites are at ffef5945 and form cites at 8cc4fdd8. None is hash-pinned, because this read ran no tool. A record that carries one pins it.

I read the scratch locators `<scratch>/recov-diff.txt` and `<scratch>/recov-numstat.txt` but did not hash them. Every quotation below is byte-copied from a Read; everything else is paraphrase. ADR-011 is not cited.

## 1. Scope against §7 as amended
§7's budget line points to §2.11. §2.11 is widened by Amendment 2 item 7 (conformance/README.md, kernel/src/project/store.rs), Amendment 17 (page.rs, the ADR-037 file) and Amendment 20 (no file). All 46 files in the numstat map to a group:
- The 12 `tests/data` JSON files, the three conformance fixtures, `fixtures.rs` (with P-1), `RefusalBlock.test`, `admitDataset.test`, `saveProject.test` and `client.test` are the literal group.
- `surfaceRegistry` and `surfaceCompleteness` are in the shell groups.

No file is outside scope, so nothing goes to the advisor.

Counts, summed from the numstat:
- Part 1: 4,884 lines over 46 files.
- src-tauri 428, shell product 388, shell tests 452, e2e 298, ADR 23.

Every figure is under both tables (see §6). No class-8 overrun at this head.

## 2. The wire (docs/04, docs/10, the SKP-V0 entry)
- `SKP_VERSION` moves `skp/0.17` → `skp/0.18` in protocol and shell. Under N-6's rule (Amendment 2), the bump takes the next unused literal, so form §1's `0.14→0.15` is superseded as written.
- There are three commands (§13–§15) and four `recoverable_record_*` codes.
- `deny_unknown_fields` and `key_present` cover the null-able `dataset`. The client always sends `dataset`.
- No stream, no ticket and no bulk data. The control plane only (docs/10), so the data plane is unchanged.
- SKP-V0 §1, §4 and §8 count eleven commands.

The wire is sound apart from the text findings in §8 below.

## 3. The guarantees (docs/01, ADR-006, ADR-016, ADR-027, ADR-037)
- **Never block the canvas (docs/01 principle 7 and its derived rule):**
  - All three commands run on `spawn_blocking` (commands.rs:296, :350, :372, :397).
  - recover's open is cancellable: `begin_open` runs under the cancel key, and the gate's `Pages::cancel` reaches a waiting key.
  - list and discard are declared not cancellable and bounded (§13.3, §15.3), as preregistered.
  - Note, not a finding: in the worst case a start listing reads 64 histories of up to 32 MiB each, without cancel. It is off-thread, and §1 forbids a performance claim, so docs/08 holds no claim to test.
- **Classes (ADR-006):**
  - Recover is the workspace class. It restores workspace state to the last kept step, and a refusal after the open closes that open (the CloseOnDrop guard, recovery.rs:867-886).
  - recover records no step and writes no mark: the shell's `handleRecovered` does not call `stepQueue.enqueue`, and the kernel has no `append` on that path.
  - Discard's class still waits on the human's word under ADV-2026-11-27-39. The advisor's reading is ADV-2026-11-27-46 item 1. I decide nothing here, and the piece does not merge before that word.
  - Nothing calls discard undoable.
- **The page lifecycle (ADR-037 with Amendment 1):**
  - The null arm passes `Pages::admit` (commands.rs:353), then `Pages::settle` with the returned name (:379).
  - The handle arm, `list_recoverable` and `discard_recoverable` make no `Pages` call.
  - A name settled after its page ended is closed late. T-2 joins that close (page.rs:1429-1460).

## 4. ADR-037 Amendment 1 against the ADV-2026-11-28-02 fence
- The diff is one hunk: 23 lines added, 0 deleted, after the base's last line. Nothing else in the ADR changes.
- On reading it matches the fence, dated 2026-11-28.
- This read computed no hash. The ruling's fence hash is recorded as fecbea45… in the worker's report. This is red-line text, so the reviewer recomputes sha256 over the added lines against the fence before the merge. It is an open check, not a finding.

## 5. Posture check (ADV-2026-11-28-01 item 3)
No page text can reach the session log through `write_host_line`:
- Its signature takes `(&tauri::AppHandle, &'static str, &'static str)` (lib.rs:236).
- Its only caller is commands.rs:396, which passes one of `discarded_line`'s two literals (commands.rs:417-423).
- `Box::leak` appears only at the existing lib.rs:621, which is not on this path.
- T-6 (page.rs:1499-1516) asserts that the line names neither the record nor the sessions root, and that a refused discard writes no line.

Page-originated lines still go through the existing session-event command.

## 6. Questions by name
- **ADV-2026-11-27-41 item 6:** This is Part 2's question, for Part 2's gates. The Part 1 fact it rests on: after Recover, the record is pushed into this run's records (recovery.rs `push`). A reload ends the page and closes the open, but this run keeps the record until `end_session` (session_history.rs:449-458), so it is never listed again. What the user is told about it is Part 2's.
- **ADV-2026-11-28-01 item 4:** Yes, the page closes the open. When `describe` refuses after an `opened` reply, `admitRecovered` calls `describeOpened`, which sends `close_dataset`. The binding's close forgets the name from the page.
  - Caveat: the close is awaited until it settles or `DESCRIBE_FAILED_CLOSE_WAIT_MS` (2,000 ms, admitDataset.ts:90) passes, whichever comes first, so it can still be running when the refusal returns. That is finding D-2.
  - The record stays with the run.
- **ADV-2026-11-28-02 item 3 (the too-early listing):**
  - It is reachable only by timing inside one request round trip: page 1's recover is past the gate but has not reached `reserve`, while page 2's mount listing reads the held names. It is not ordinary use, so it does not block. Record it in the source comment.
  - If it is reached, page 2's Recover or Discard on that name gets `skp.recoverable_record_unknown`, never `…_locked`, because `reserve` (recovery.rs:573-583) is checked before `probe` (:596, :629). Page 2's Recover also waits at the gate behind page 1's in-flight entry.
  - The converse case: a lock taken by page 2's listing can make page 1's recover refuse as `locked`, but page 1 has already ended by then.
- **ADV-2026-11-28-02 item 4:** I checked each clause of Amendment 1 against commands.rs:283-423, page.rs (`admit`, `settle`, `cancel`) and recovery.rs. Each holds. Two edges:
  - A recover refused as a twin is not "listed again" by its own page.
  - The clause that a normal end clears the run's records rests on `end_session` and on K-C13 by name. The reviewer runs K-C13.
- **K-C1 (Amendment 22 item 3):** Replace it with the two-edit mutation in a post-result amendment.
  - The worker's report records that the single edit (dropping `held.contains`, recovery.rs:359) did not fail K-C1. The cause is the probe's `Busy` (H1/H3: a second handle in the same process cannot take the lock), so the single edit is an equivalent mutant at the product level.
  - The two-edit form (the guard and `Busy` both dropped) removes the property the row names. The report records that it failed K-C1, K-C6 and K-C37. It also lists other runs' locked records, which is §8 item 2's property, so those failures are the right ones.
  - These are records of `verify-mutation` runs, not observations of a mutation (Round 25 item 2). The reviewer runs it.
- **K-C4 (Amendment 22 item 3):** Replace it the same way.
  - With the single edit (the walk takes `<hex>` folders), the dedupe finds each project record to be its own twin (recovery.rs:417-481). The report records that only the >64 test failed.
  - K-C4b (also forcing the dedupe to Offer) shows the property. The report records that it failed the named test and two others.
- **ADV-2026-11-28-12 item 5 (a), a listing that fails:** to the advisor. The mount listing's error handler is `() => undefined` (RecoveryOffer.tsx), so the shell shows nothing and logs nothing for every failure:
  - `skp.version_unsupported`: unreachable within one build.
  - `skp.unknown_dataset`: handle arm only, when the open is gone before the list (a race or a close).
  - `skp.session_history_unwritable`: no per-user data directory (commands.rs:291-295), an environment failure.
  - `list_recoverable_panicked`.
  - One case is not a refusal at all. If the store root cannot be read for a reason other than NotFound, `folder_names` returns None, the walk's `unwrap_or_default()` (recovery.rs:358) makes it empty, and the reply is `Ok` with no records and `more:false`.

  None of these is ordinary use. But in each, a user can hold records and see nothing, with no log line. Whether the empty `Ok` should be a refusal or set `more:true` is a design question for the advisor. No code changes before the answer.
- **Which group figures bind (Amendment 24 item 2):** Amendment 21's, through lead-data's S-9 draft section 3: shell product 528, shell tests 550, Part 1 ≤5,193. They supersede Amendment 20 item 5's shell rows (520/540). src-tauri stays at 430. Every count is under both tables, so the choice changes no outcome.
- **Departures:** none touches a claim or a guarantee.
  - Amendment 22 item 4:
    - The bundled hold touches no claim.
    - Three tests changed before code. K-C3's cut check got stronger.
    - The session_history `pub(crate)` widenings expose crate internals only, so I1 does not fire.
    - StepRecorder's three new `pub` methods have product callers in commands.rs.
  - Amendment 24 item 4:
    - The swallowed list error is answered under 5 (a) above.
    - The handle-arm Recover without the gate is correct under Amendment 1 item 3.
    - There is no npm script.
    - The notice tests are the reviewer's.

## 7. Seams, from the real shape
1. **Shell → binding → protocol:** the `client.ts` shapes match the Rust request structs. The unit tests mock `invoke`, so they do not prove this seam. Its end-to-end proof is `e2e/recover.mjs`, which runs in the E-RECOVER series. Evidence for this seam stays open until that run.
2. **Binding → kernel:** `recover_admitted` and `discard_and_log` call the real `StepRecorder` on a real `SkpHost` in T-2, T-3, T-4 and T-6.
3. **Binding → Pages:** real `admit`, `settle` and `cancel` in T-2 to T-4.
4. **recovery.rs → session_history and store:** K-C8 drives `store::locations_to_bytes` through `store::read_locations`.
5. **SessionLog → `write_host_line` → `discard_and_log`:** T-6 drives `discard_and_log` with the rig's recording log. `write_host_line`'s body is the existing `SessionLog::append` path, and its product caller is commands.rs:396. The real line is seen in the E-RECOVER series.

Every new `pub` or `pub(crate)` item has a product caller.

## 8. §1 claims and §8 Block-on-sight, item by item
**§1:**
- May claim:
  - the three commands, the reader and adopt paths, and the declared item: true, subject to the reviewer's test runs;
  - Amendment 20's log claims: true. A discard writes one kind-only line only on `Ok` (commands.rs:408-412); a refused recover or discard writes one line in the shell's catch; a success writes none.
- May not claim:
  - performance: none is made;
  - undo or replay: no text claims it, but see D-6;
  - app wording: every string carries the P6 mark.
- The ADRs line is superseded by Amendment 17 (ADR-037 Amendment 1).

**§8:**
1. True. No reply carries a path. Refusal rules use `io::Error` text, which holds no path.
2. True. `Busy` skips the record in the walk and refuses it as `locked` on recover and discard. A twin held by a live run gives `Locked`, which withholds the record and sets `more`.
3. True. No step or mark is written. The cut is `set_len` only.
4. Untrue. `replay`, `Replayed` and `replayed` are code identifiers in recovery.rs (D-6).
5. True. Histories are read only through their own locked handle (`read_through`, `recover_head`).
6. True. No edit to `project/mod.rs`, `AdmissionPanel.tsx`, a manifest or `Cargo.lock`.
7. Every kernel and protocol string carries the P6 mark. The bare "Cancel" button text is item 5 (b), the reviewer's.
8. True (store-module message): the kernel's messages state the kernel's own facts. But see D-5.
9. True. Nothing is removed under `projects/`.
10. True (by code reading). `found` and `not-found` come from `metadata` after every lock is released (recovery.rs:564-569).
11. True. When the dedupe cannot finish, the record gets `Withheld` and `more` is true (recovery.rs:418-419, :545).
12. True. An empty history gives `Gone` before the open (recovery.rs:143-146).
13. True on Part 1's discard. `Busy` returns before any removal (recovery.rs:600).
14. True. `hex_folders` reads the names after the walk's locks are held (recovery.rs:536-537).
15. Part 2's.
16. True (commands.rs:349-380, :383-399).
17. True. `CloseOnDrop` closes the open synchronously before the refusal returns (recovery.rs:775-786), and the exit order is guard, then file, then reservation.
18. True (commands.rs:403-423; RecoveryOffer.tsx:78-86).

## 9. Findings
**C-1: Correctness. The correction changes code.**
- In `adopt_new`, `guard.handle = None;` (recovery.rs:886) runs before the reply's `steps` are built (:893). Amendment 17 item 5 says the guard is disarmed last, after the reply's intents are built.
- It is unreachable in practice, because a failed allocation aborts and does not unwind. It is still a deviation from the form.
- Fix: build the `RecoverSessionResponse` into a local, then set `guard.handle = None;`, then `Ok(reply)`.

**C-2: Correctness. A guarantee the code does not support; the correction changes words only; the worker's wording.**
- SKP-V0 §14.3 and the doc at recovery.rs:621 claim that every refusal leaves the record as it was. But `cut` (recovery.rs:803-805) runs `set_len` first. If the later `seek` or `sync_all` fails, the refusal leaves the history already cut to its kept steps.
- Reaching it takes an OS or disk I/O failure. That is not ordinary use and not a timing case. The words are untrue, so they are replaced. The ADR row (A1) already says it correctly.
- Old (SKP-V0.md, occurs once): `Every refusal after the open closes it, and leaves the record as it was, with its lock released.`
- New: `Every refusal after the open closes it and releases the record's lock; the record is left as it was, except after a failure of the cut's seek or sync_all, which can leave the history already cut to its kept steps.`
- Old (kernel/src/recovery.rs, occurs once): `A refusal leaves the record as it was, with its lock released.`
- New: `A refusal releases the record's lock and leaves the record as it was, except after a failure of the cut's seek or sync_all, which can leave the history already cut to its kept steps.`
- Clause check:
  - "closes it" is the guard (recovery.rs:867-886, :775-786).
  - "releases the lock" is `file` dropped as the function's parameter, after the guard.
  - "as it was" holds because `cut` is the only write and `set_len` is its first call (:803).
  - "except … seek or sync_all" holds because :804-805 run after a successful `set_len(kept)`.
  - "can leave" covers `sync_all`, where durability is unknown.

**D-1: Documentation. Stale doc comments; words only; the worker's wording.**
- page.rs:216.
  - Old: `/// The gate (ADR-037 section 5), for the new page's `open_dataset` and `open_project`. It enters`
  - New: `/// The gate (ADR-037 section 5), for the new page's `open_dataset`, `open_project` and null-`dataset` `recover_session`. It enters`
  - Check: commands.rs:353 calls `pages.admit` for the null arm only. Re-wrap the line if it runs long.
- page.rs:119.
  - Old: `/// `the_gate_waits_for_ends_earlier_opens_and_late_closes` and`
  - New: `/// `the_gate_waits_for_ends_earlier_opens_and_late_closes`, `a_recover_whose_reply_arrives_after_its_page_ended_is_closed` and`
  - Check: page.rs:1450-1453 joins the `Settled::Ended` handle.
- commands.rs:131.
  - Old: `/// section 5): a key an `open_dataset` or `open_project` of this binding still holds waiting at the`
  - New: `/// section 5): a key an `open_dataset`, an `open_project` or a null-`dataset` `recover_session` of this binding still holds waiting at the`
  - Check: `recover_on_page` admits under `request.cancel_key` (commands.rs:353).

**D-2: Documentation. RecoveryOffer.tsx:68 overclaims "has closed"; words only; the worker's wording.**
- Old: `after `describeOpened` has closed the open)`
- New: `after `describeOpened` has sent `close_dataset` and the close has settled or `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first)`
- Check: admitDataset.ts:94 and :105 (the timer). openProject.ts:12 uses the same words.

**D-3: Documentation. SKP-V0 §13.3 `no-step` is incomplete; words only; the worker's wording.**
- The code also gives `no-step` when the history cannot be read: `Probe::Failed` (recovery.rs:147, :155, :160) and a failed `read_seen` both lead to `judge(None, …)` (:258-259, :365, :556).
- Old: `` `no-step` (the reader keeps no step) `` (occurs once)
- New: `` `no-step` (the reader keeps no step, or the history could not be opened, locked or read) ``

**D-4: Documentation. Reused-code lists omit the no-recorder refusal; words only; the worker's wording.**
- §13.4 and §15.4 leave out `skp.session_history_unwritable`, which the binding returns when there is no per-user data directory (commands.rs:291-295, :391-395).
- §13.4.
  - Old: ``Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has).``
  - New: ``Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has); `skp.session_history_unwritable`, as §10.4 gives it (no per-user data directory resolves).``
- §15.4.
  - Old: ``Reused: `skp.version_unsupported`. `skp.recoverable_record_locked` ``
  - New: ``Reused: `skp.version_unsupported`; `skp.session_history_unwritable`, as §10.4 gives it (no per-user data directory resolves). `skp.recoverable_record_locked` ``
- Each old text occurs once. §10.4's row (SKP-V0.md:1390) already names this case.

**D-5: Documentation. The correction changes code (message strings). The strings are under P6, so I propose no words.**
- `recoverable_record_refused`'s message (error.rs:312) says the record "cannot be recovered". It is also returned when a discard fails to remove a file (recovery.rs:610), so on a discard it states a wrong engine fact.
- The cut's message (recovery.rs:798) says the history "could not be cut" even after `set_len` succeeded.
- Both go to the advisor with the P6 strings.

**D-6: Documentation (§8 item 4: "replay" said of recovery anywhere). The correction changes code, a rename only, with no behaviour change.**
- `replay`, `Replayed` and `replayed` appear at recovery.rs:652, :672, :701, :739, :740, :768, :893, :923, :976, :977 and :1165.
- Under ADR-006, replay names the pure class, and recovery is the workspace class.
- Proposed: `replay` → `read_kept_intents`, `Replayed` → `KeptIntents`, `replayed` → `kept_intents`. Avoid plain `kept`, which `a.kept` already uses for the cut length.

**Ruled text, clause only, no words proposed:** SKP-V0.md:1373 (§10.3) carries the form's §2.4 draft byte for byte (the form, line 118 at 8cc4fdd8). It capitalises "Outside" after a semicolon. That is a typo in the gates' draft sentence; the gates may correct it, and it is reported here.

## 10. Open for the reviewer's read part (not findings)
- The fence hash in §4.
- The runs of K-C13, T-2 to T-6, S-9 and S-10.
- The K-C1b and K-C4b `verify-mutation` runs.
- Item 5 (b) and (c).
- The E-RECOVER series, which is seam 1's end-to-end proof.

Files:
- D:/wt/read-recov/kernel/src/recovery.rs
- D:/wt/read-recov/protocol/skp/SKP-V0.md
- D:/wt/read-recov/protocol/skp/src/v0/error.rs
- D:/wt/read-recov/frontends/shell/src-tauri/src/commands.rs
- D:/wt/read-recov/frontends/shell/src-tauri/src/page.rs
- D:/wt/read-recov/frontends/shell/src-tauri/src/lib.rs
- D:/wt/read-recov/frontends/shell/src/project/RecoveryOffer.tsx
- D:/wt/read-1128h/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md
