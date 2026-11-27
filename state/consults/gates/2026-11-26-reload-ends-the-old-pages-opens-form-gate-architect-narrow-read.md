Reviewed: the form text b-form-r2-text.txt in the scratch folder, 46748 bytes, sha256 4f848ac9418ea98e2efde183f540a1ba36898a4729aff9fc3c07e04f41ed2573 (round 1 with attempt 1's 49 pairs applied by script), against the read checkout D:/wt/read-1126b at 77662d1ac837c56d4691b6821ffd1ece049f9da4, read only. This is the custodian's filing note, 2026-11-26: the architect's form gate, attempt 2, node:reload-ends-the-old-pages-opens@form-gate-architect-2, under ADV-2026-11-26-17 item 2. The narrow re-read that closes attempt 1, by the same agent resumed by a message sent before 2026-11-26T21:04:27Z; a second message, before 2026-11-26T21:05:50Z, gave it ADV-2026-11-26-24 to carry. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 4 tool uses, 251538 ms, 93173 tokens; model opus. It handed back once, before 2026-11-26T21:10:27Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The report below is byte-identical to the saved one (10268 bytes, sha256 65b67b7b). Verdict: PASS WITH NOTES once R-1 to R-17 are applied (R-9 withdrawn); R-3 Evidence, the rest Documentation and ADV-2026-11-26-24's carriage; 19 pairs applied by script, giving r3 (48467 bytes, sha256 b1dd2b60); the posture unchanged; gate-log row 912.

---

**Verdict: PASS WITH NOTES, once R-1 to R-17 below are applied byte for byte.** I reviewed `b-form-r2-text.txt` (sha256 4f848ac9418ea98e2efde183f540a1ba36898a4729aff9fc3c07e04f41ed2573, taken from your message; I have no tool to recompute it) against the read checkout D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4. This narrow re-read closes the form gate, and R-1 to R-17 need no further read.

- **No change to the security posture.** The posture statement of my earlier report holds for r2. §9 item 1 is not triggered.
- **One Evidence item is still open, R-3, and it comes from my own pair 20.** M-U12's predicted reason for going red is wrong (details under Evidence). R-3 is a text pair that can be checked by search, so it closes once applied.
- **Everything else open is Documentation**, must-fix before the merge.
- **None of the sentences is the human's wording.** The words of ADV-2026-11-26-23 item 2 and ADV-2026-11-26-24 item 2 stay the advisor's, carried by reference.
- **OPEN-6** is ruled by ADV-2026-11-26-24, which I read whole. R-11 to R-17 carry it.

## Findings C-1 to C-7, E-1 to E-4, D-1 to D-8

All are closed in r2, with the gaps noted:

- **C-1** closed: §2 item 4, §9 item 5. The signature still lacks how the end's thread reaches `Pages` (R-1, R-2).
- **C-2** closed: §2 items 2 (i) and (ii), item 4, item 5 (i), U-8.
- **C-3** closed: §2 item 3. My words "never sees neither" are garbled, and the current-page branch does not say the in-flight entry is removed (R-4, R-5).
- **C-4** closed: §2 item 2's `Ticket` paragraph, U-11. U-11 needs the end joined before its readiness check (R-7).
- **C-5** closed on the hook's path: §2 items 4 and 5 (v), §9 item 5. The late-close spawn failure still says only "goes to stderr" (R-6). That path runs on the async runtime, not the hook, so this is Documentation.
- **C-6** closed: §9 item 5.
- **C-7** closed: §1, §2 item 5 (i), §2 item 6 (d).
- **E-1** is closed only once R-3 is applied. U-12 is present. But under M-U12, page 2's `admit` is ready at once, so the test goes red at its own "pending" assertion. It does not go red at a `skp.project_open_elsewhere` answer, as the mutation column predicts. The row's sequence also assumes page 1's call returns ordinarily, while the end cancels page 1's key.
- **E-2** is superseded by ADV-2026-11-26-24 (R-11 to R-17).
- **E-3** closed: §10's suites. These are the six suites ADV-2026-11-26-24 item 6 notes.
- **E-4** closed: §0 item 3.
- **D-1** closed: §0 item 5, §8. This agrees with your gh and git check. Neither your message nor the line names `commands.rs` among the untouched paths, and §8 keeps it shared with PR 356.
- **D-2** closed: Intake. ADV-2026-11-26-13 item 4 bears it out.
- **D-3** closed: §2 item 10, §0 item 6.
- **D-4** closed. **D-5** closed: §6. ADV-2026-11-26-17 item 4's bullet carries ADV-2026-11-26-09. **D-6** closed. **D-7** closed. **D-8** closed: §7.

## Breakage from the applied text

None in the cross-references. I resolved each one:
- §1 → §2 item 6 (d)
- §2 item 4 → item 5 (i)
- item 5 (i) → items 6 (d) and 3
- §2 item 2 → U-11
- §5 → OPEN-1 (a), which agrees with ADV-2026-11-26-23 item 1's fourth bullet
- §6 → OPEN-6
- §10 → §2 item 11
- §10a's two new rows

Tables: §4 and §8 keep their column counts, with U-11 and U-12 as one row each. §3's "the suite's other steps pass in both" is now true, as ADV-2026-11-26-23 item 1's third bullet says.

## §7 Size against the table

- **Lines agree.** The table sums to 1167, or 1174 with the ADR-020 note. Both are within 1250. Without U-11 and U-12 (tests at 450), the totals are 1077 and 1084, so "E-1 as ruled fits the 1150" holds.
- **Files do not agree.** "Scope, exactly" lists 8 files, or 9 under the condition. The table has 9 files, or 10 rows counting `page.rs` twice. The Size line says 9 files, or 10. The ceiling is not breached, but it carries one file of slack that "exactly" forbids (R-10).

## Pairs on r2

Each old text occurs once in r2, checked by reading. "\n" means a line break.

**Correctness and Documentation:**

R-1. Old: `**`Pages::page_started(parts) -> Option<JoinHandle<()>>`**`
New: `**`Pages::page_started(self: &Arc<Self>, parts) -> Option<JoinHandle<()>>`**`

R-2. Old: `5. **`run_end(set, host, projects, publishes, stop_poll, log)`**.`
New: `5. **`run_end(pages, page, set, host, projects, publishes, stop_poll, log)`**, where `pages` is the `Arc<Pages>` and `page` the ended page's number.`

R-3 (Evidence). Old: `the arm is released; page 1's call returns and settles; page 2's `open_project_command` answers `Opened``
New: `the arm is released; page 1's call returns, with whichever answer the kernel gives once the end has cancelled its key, and settles; page 2's `admit` is then awaited, and its `open_project_command` answers `Opened``
And old: `| M-U12: the gate ignores earlier in-flight opens, so page 2 answers `skp.project_open_elsewhere` |`
New: `| M-U12: the gate ignores earlier in-flight opens, so page 2's `admit` is ready while page 1 still holds the lock (where its `open_project_command` would answer `skp.project_open_elsewhere`), and U-12 is red at its pending assertion |`

R-4. Old: `so the gate never sees neither.`
New: `so the gate never sees the entry gone while the late close is not yet counted.`

R-5. Old: `   - **Current page:** the name enters the current set.`
New: `   - **Current page:** the in-flight entry is removed, and the name, if the open returned one, enters the current set.`

R-6. Old: `     - If the spawn fails, the error goes to stderr and the guard opens the gate.`
New: `     - If the spawn fails, the error is written by `writeln!` to `std::io::stderr()`, its result discarded, and the guard opens the gate.`

R-7. Old: `then the ticket dropped without `settle`: page 2's `admit` is ready`
New: `then the end joined by the returned handle, then the ticket dropped without `settle`: page 2's `admit` is ready`

R-8. Old: `The returned handle is read only by U-9, and `lib.rs` discards it.`
New: `The returned handle is read only by the U tests (U-9's join among them), and `lib.rs` discards it.`

R-9 is withdrawn, with no pair: the line it would change was already true.

R-10. Old: `over at most 9 files, or 10 under §2 item 11's condition.`
New: `over at most 8 files, or 9 under §2 item 11's condition (the Scope below, exactly).`

**ADV-2026-11-26-24:**

R-11 (rulings list). Old: `  - ADV-2026-11-26-23 items 1 to 3.`
New: `  - ADV-2026-11-26-23 items 1 to 3;\n  - ADV-2026-11-26-24 items 1 to 4.`

R-12 (§6, the S0 (a) line from pair 26). Old: `  - S0 (a) (ADV-2026-11-26-08 item 1): E-1's run at the base, red with `skp.project_open_elsewhere`, is made and filed before any code of `page.rs`, `lib.rs` or `commands.rs`. ADV-2026-11-26-19 item 3 names other pieces, not this one; whether this piece's code and unit tests may start before that run is OPEN-6.`
New: `  - S0 (a) (ADV-2026-11-26-08 item 1, changed in time only by ADV-2026-11-26-24): this piece's code and unit tests may start inside holds, in its turn in the order of builds (ADV-2026-11-26-24 items 1 and 4), under the five conditions of ADV-2026-11-26-24 item 2. For this form: the red commit is the branch's first commit after the base, and holds E-1's step and `FOLDER_FOUR` in `project.mjs` and no line of `page.rs`, `lib.rs` or `commands.rs`; the base run is `project.mjs` at that commit, and the row's own reason is §4's E-1 row answering `skp.project_open_elsewhere` at the reopen; a stop under that item goes to the advisor (§9 item 16); a change of E-1's text after the red commit is an amendment in §11 by its class. The unit tests keep §4's proof (ADV-2026-11-26-24 item 3).`

R-13 (Merge, the PR's leaving draft). Old: `- After PR 356, by a merge commit, never a squash or a rebase.`
New: `- After PR 356, by a merge commit, never a squash or a rebase.\n- **Draft until both runs are filed.** The PR leaves draft only as ADV-2026-11-26-24 item 2 bounds it: after the base run at the red commit (§6) and the head series (§10) are filed.`

R-14 (§3, §5, §10 follow the red commit). Old: `  - E-1 red at the base, with `skp.project_open_elsewhere`, and green at the head;`
New: `  - E-1 red at the red commit (the base with E-1's step alone; §6), with `skp.project_open_elsewhere`, and green at the head;`
And old: `  - E-1 green at the base, so the fault is not reached;`
New: `  - E-1 green at the red commit, or red there for another reason, so the fault is not reached: a stop (§9 item 16);`
And old: `- `project.mjs` at the base (E-1 red) and at the head,`
New: `- `project.mjs` at the red commit (E-1 red; §6) and at the head,`

R-15 (§9). Old: `15. An app or dev-server start, or a merge, against §6 or the Merge line; a squash or a rebase merge.`
New: `15. An app or dev-server start, or a merge, against §6 or the Merge line; a squash or a rebase merge.\n16. Against ADV-2026-11-26-24 item 2: product code in the red commit; code taken further after the base run ends green or red for another reason, before the advisor rules; E-1's text changed after the red commit without an amendment by its class, or the base run not re-made on the changed text; the PR out of draft before the base run and the head series are filed.`

R-16 (rulings to places, from pair 44). Old: `- **ADV-2026-11-26-08 item 1, S0 (a):** §6, OPEN-6.`
New: `- **ADV-2026-11-26-08 item 1, S0 (a), as ADV-2026-11-26-24 changes it:** §6, Merge, §9 item 16, OPEN-6.\n- **ADV-2026-11-26-24:** items 1 and 4: §6; item 2: §6, Merge, §3, §5, §9 item 16, §10; item 3: §4, §6.`

R-17 (OPEN-6, from pair 48). Old: `- **OPEN-6, S0 (a) and this piece's code.** ADV-2026-11-26-08 item 1 puts E-1's red run at the base before any code. ADV-2026-11-26-19 holds every app start until the human closes their app, and its item 3 names other pieces' unit-test parts. Whether this piece's code and unit tests may start before E-1's base run is the advisor's to rule. Until it rules, no code of this piece is written. To the advisor.`
New: `- **OPEN-6:** ruled by ADV-2026-11-26-24 (b): the code and the unit tests may start before E-1's base run, under its item 2's five conditions (§6, Merge, §9 item 16).`

No ADR skeleton is needed.
