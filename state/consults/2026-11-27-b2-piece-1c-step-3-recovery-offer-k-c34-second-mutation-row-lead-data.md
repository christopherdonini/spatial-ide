# The recovery offer's K-C34 row with its second mutation: lead-data's draft (node:b2-piece-1c-step-3-recovery-offer@k-c34-row)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-33-three-free-places-the-null-refusal-builds-on-the-c1-head-the-recovery-offers-k-c34-row-and-a-narrow-read-now-the-fixture-node-s3.md`, item 3, and the form's Amendment 13 item 3. Lead-data (Opus) was dispatched with its brief byte for byte (brief-recov-kc34-lead-data.md in the scratch folder), read only. By the facts script, its run went from 2026-11-27T22:01:21Z to 2026-11-27T22:03:50Z; by its completion notice, 23 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed. No cite was changed. A draft, not a gate.*

---

Result: I drafted K-C34's row with both mutations. The second mutation (the twin's files removed unread on `WouldBlock`, ADV-2026-11-23-38 item 6) is predicted to fail on Windows under H2 and on macOS/Linux under H3.
Blocking questions: none.
Report path: state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-k-c34-second-mutation-row-lead-data.md
sha256: not computed. I wrote no file and have no hashing tool, so the custodian pins the hash when filing this message's text.

---

# K-C34's row with its second mutation: lead-data's draft for the custodian's amendment (b2-piece-1c-step-3-recovery-offer, node:b2-piece-1c-step-3-recovery-offer@k-c34-row)

This is a draft only. It gives no verdict and changes no file. It is written under Amendment 13 item 3 and Amendment 15 item 2, which act on ADV-2026-11-23-38 item 6.

**Where I read.** The form at `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, in the main checkout as I found it (HEAD 72295277 by the session-start snapshot; I did not re-check it). The code at f7770e1aa225b7902ea56a77c0d0dbd8321fb942 in `D:/wt/c1rd`.

**Two meanings of H.** The form uses "H" for two different things:
- §0's hypotheses: H1 and H2 at form :31-32, and H3 added by Amendment 2 at form :637.
- Amendment 10 item 5's part heads: H1 is Part 1's head and H2 is Part 2's head (form :2150-2151).
The prediction labels below are the hypotheses. "At H2" in item 6 and in the last section means Part 2's head.

## The row

The current row is Amendment 6 item 7's New text (form :1468). The New row below keeps that row's Id, its test name with the parenthesis, its first mutation and its Fails cell byte for byte, and marks the first mutation (1). Mutation (1)'s words are byte-copied from form :1468, verbatim, with "H3, " inserted after "removed, " so that the macOS/Linux outcome carries its label too. That insertion is mine. Mutation (2) and its predictions are my own drafting (paraphrase); its action words follow ADV-2026-11-23-38 item 6.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | (1) `WouldBlock` taken as a lock held, so the twin is read, judged and removed through the search's own handle (Windows: the read fails, H1, the twin is left and K-C34 passes, a named pass case; macOS/Linux: removed, H3, observed on a macOS or Linux runner by a pushed mutation commit); (2) on `WouldBlock`, the twin's `history.jsonl` and `locations.json` are removed unread (ADV-2026-11-23-38 item 6) (Windows: the removal succeeds against the test's share-delete handle and takes effect once that handle closes, H2, so after the test drops its handle the read by path finds the files gone and K-C34 fails, observed at Part 2's head; macOS/Linux: the test's advisory lock does not stop the unlink, H3, and the read by path finds the files gone, so K-C34 fails; predicted, not observed by this piece) | K-C34 |

**What the test asserts** (from the form, paraphrased):
- The test holds the twin's history. It opens that file and locks it itself.
- Under N-27 (Amendment 7 item 5, form :1752), that held history has a header and at least one step line. This lets N-20's `metadata` check (Amendment 6 item 14, form :1568) pass the twin on to `try_lock`. Mutation (2) sits on the branch that `try_lock` reaches.
- The twin's `locations.json` bytes equal the project's record's, so the search reaches the probe.
- The project's record is discarded. The test then drops its own handle and reads both of the twin's files by path, and they must be unchanged byte for byte.

**Where the mutation is applied.** Part 2's twin search, called from `discard_recoverable`'s step 3a (Amendment 10 item 3, form :2088 and :2105). At f7770e1a neither `kernel/src/recovery.rs` nor `kernel/tests/recovery.rs` exists (Glob over `D:/wt/c1rd/kernel`), so the site exists only from Part 2's code onward. Mutation (2) is exactly §8 item 13's block-on-sight case (Amendment 4, form :1232). It is applied, run, recorded by name with its commit, and reverted (Amendment 10 item 4, form :2142). It never lands.

## What the Windows prediction rests on

Code at f7770e1a, plus my reading of std.

1. **How a run's history is opened.** It is opened through std's `OpenOptions` with `read`, `write` and `create_new`, with no share-mode override, and then locked by `try_lock` (`kernel/src/session_history.rs:516-524`). The test's held handle stands in for that live run.
   - My reading of std's documentation (paraphrase, not a repo cite): std on Windows opens with read, write and delete sharing unless `share_mode` is set.
   - So mutation (2)'s removal is not refused with a sharing violation.
   - A `LockFileEx` byte-range lock (H1) governs reads and writes, not deletion.
2. **Existing code already relies on that sharing.** `copy_under` renames a temp history while its own locked handle is still open (`kernel/src/session_history.rs:555-563`). On Windows that rename needs the open handle to share delete. I read this as std's default behaving as item 1 says. That code is reached by the first save's move, which `kernel/tests/project_save.rs::the_first_save_moves_the_record_under_the_project_identity` drives on Windows CI (kernel owner's index, `kernel/README.md:377`).
3. **No code at f7770e1a removes a file while a handle to it is still open.**
   - `end_session` drops the handle first, then removes (`kernel/src/session_history.rs:439-447`).
   - The move in the first save drops the old handle first, then removes (`kernel/src/session_history.rs:373-378`).
   - So H2 has no in-repo observation yet. Mutation (2) on Windows, like K-C2 (H2's named discriminator, form :32), would be one of its first.
4. **Why the result does not depend on which delete semantics the system uses.**
   - If the name goes at once, the read by path fails.
   - If the file stays delete-pending while the search's own handle is still open, the read by path also fails.
   - Either way the byte-for-byte assertion fails. The row's assertion is on the files, so whether the twin's folder removal succeeds does not decide it.
5. **One condition on the test, for the gates (draft, not a decision).** The test's held handle must be opened with std's default share mode, with no `share_mode` call. If it denied delete sharing, mutation (2) would pass on Windows because of the fixture, not the code.

## If mutation (2) does not fail on Windows at Part 2's head

Paraphrase of ADV-2026-11-23-38 item 6, its second and third bullets:
- The result is recorded as found and the custodian tells the advisor.
- Nothing is changed to make the mutation fail.
- Mutation (1)'s observation on macOS and Linux is still owed, as ADV-2026-11-23-29 item 10 has it (and Amendment 10 item 4, form :2143-2147).

## Form lines the new row makes stale (for the custodian; I drafted none of them)

Each of these says there is no Windows failing observation for K-C34, or that no mutation removes a file on Windows:
- form :1482: the known pass cases (Amendment 6 item 8)
- form :1496: §5 Predicted (Amendment 6 item 9)
- form :1766: the known-pass-case sub-bullet (Amendment 7 item 6)
- form :2116: Amendment 10 item 3's known pass case
- form :2139: Amendment 10 item 4's K-C34 bullet
- form :2144: the closing-record line
- form :2243: §5 Predicted (Amendment 10 item 8)

Whether and how these change is the amendment's other items, the custodian's to word.

Files read: `C:/dev/spatial-ide/kernel/README.md`, `C:/dev/spatial-ide/engine/README.md`, `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-38-the-recovery-offers-seven-points-after-attempt-7-as-the-gate-recommends-k-c34-a-second-mutation-the-adr-036-notes-words.md`, `C:/dev/spatial-ide/state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-7.md` (its K-C34 offer only), and `D:/wt/c1rd/kernel/src/session_history.rs` at f7770e1a.
