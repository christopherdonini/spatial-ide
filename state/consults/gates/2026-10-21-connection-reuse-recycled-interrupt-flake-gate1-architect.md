cut/connection-reuse-recycled-interrupt-flake @ 866b35791cd037159eb0619e80eb1bec8b4851ff
Reviewed: PR #238 at 866b35791cd037159eb0619e80eb1bec8b4851ff (base b5c1c841), gate 1, architect
Verdict: PASS WITH NOTES

How I read it: no shell and no `gh`. I read the head through the worktree C:/dev/wt/crf. The worktree's reflog (`.git/worktrees/crf/logs/HEAD`) shows b2df233d → 03345bfa → 32c3e807 → 866b3579, and its last entry is the owner's-index commit. I found no loose or packed ref for the branch, so the reviewer confirms with git that the branch ref equals 866b3579. I compared the base by reading main's copy of each changed file, which b2df233d..b5c1c841 does not touch. I computed no hashes and no numstat; the reviewer does both.

## Correctness
None.

## Evidence
None blocking. Three checks I could not run, for the reviewer and custodian:
- E-n1. The PR body and comments were not read (no `gh`), so check 5 covers Amendments 1 and 2 and the code comments only. The body still has to be checked for: no rate from R3, nothing about CI's path, B and H for §7, W1 to W6 listed (§2.6), and a merge commit asked for (§9).
- E-n2. P-4's "the workspace passes in CI on both platforms" is not resolved by any record yet; I could not read CI.
- E-n3. The cargo suites were run at 03345bfa and 32c3e807, not at 866b3579. The reflog message and the apply report say 866b3579 changes only `engine/README.md`; the reviewer confirms that with the diff.

## Documentation (must-fix before the merge, no re-gate)
- D1. Amendment 1's heading names "classes 1 and 2", but no item in it is class 2.
  - Items 3 and 5 are labelled class 1. Items 1, 2, 4, 6 and 7 carry no class.
  - Item 2 records every outcome as §5 predicts and says no invalidator is met. Class 2 covers only an outcome that differs from a prediction (template §10, class 2).
  - Where: the full form on main, Amendment 1, heading.
  - Fix: append a row; the form is append-only. These are not the human's words. The custodian appends them and the PR body lists them:

    ### Amendment 3 — Amendment 1's class label (class 1); written after gate 1's findings were seen

    *Written by the custodian on gate 1's architect report. References only.*

    1. Amendment 1's heading names classes 1 and 2, and no item in it is class 2: items 3 and 5 are class 1, and item 2 records every outcome as §5 predicts. The heading's class reference reads class 1 alone. Proof: Amendment 1, items 2, 3 and 5.

    Nothing above is edited.

  - Clause check:
    - "no item in it is class 2": Amendment 1 items 1 to 7, read; only items 3 and 5 carry a class, and it is "(class 1)".
    - "item 2 records every outcome as §5 predicts": item 2 ties P-1, P-2 and P-3 to their observations and ends "No invalidator in §5 is met."
    - Class 1 for this row: round 15 (g), on the reading that a gate round's findings are its results.
    - The row is two sentences plus its proof, within round 12 (d)'s ceiling.

## Block-on-sight (§8)
1. Not met. The form is in B's tree (the branch copy, lines 1-256). The code commit 03345bfa follows B. depends_on, source-changed-post-route-s5d-race, is `status: done` in PLAN.yaml on main. I did not check the order of its done commit against dispatch (6adbf80d).
2. Not met. The five-line form reads identical on the branch and on main. The branch's full-form copy also adds nothing: it stops at "(opens empty; append-only)".
3. Not met. Product changes are only the member (stream.rs:639-651) and its one write (stream.rs:1239). In dataset.rs only comment lines change (1931-1939 in, 3 lines out); `lease_for_stream`'s code (1943-1950) matches main's 1937-1944. I found no edit to attach, detach, produce, the guard, the pool, Drop or the terminal, and no kernel edit.
4. Not met. There is one write, `interrupt_bound_at_lease: cancel.is_bound(),`, in the one constructor. A grep finds no other write. The value is read from the token, not hard-coded, which covers M1's known survivor.
5. Not met. The binding assertion reads `f.interrupt_bound_at_lease` (connection_reuse.rs:200-204). No sleep, retry or timeout is added. The scratch line appears only as quoted text inside the record comment (connection_reuse.rs:173-174), not as applied code.
6. Not met. The test name is unchanged. Its generation/reuse assertions, its nothing-generated assertion and its Cancelled and `other` arms match main's lines 174-178, 191-195 and 197, 202-205. The other tests read unchanged as I read them; the reviewer confirms byte-identity with the diff.
7. Not met. The member is not behind cfg or a feature. W2's three declarations are present at stream.rs:645-650. The kernel copies three named members into `StreamConnectionRecord` (kernel/src/lib.rs:662-669), not the new one, and nothing puts it on SKP.
8. Not met. W1's overlap sentence is the only overlap coverage claimed.
9. Not met (see check 5).
10. Not met. The new comments name files or symbols only (`cancel.rs`, `produce`, `engine/tests/connection_reuse.rs`) and carry no line.
11. Not met:
    - no §7 overrun: 81 of 100 by Amendment 2; per file 14/20, 12/14, 51/60 and 4/6, per the two reports;
    - no scope addition. The record block in the test header is recorded as class 1 (Amendment 1 item 5); it is no standing rule's addition;
    - no record calls a verify-mutation run an observation. The worker report says none is one;
    - no test-text span is pinned by hash. The amendments name commit ids with no sha256.

## Checked, with evidence
1. §2.2 against the head:
   - (a) the cancel is at connection_reuse.rs:189-190, before `stream_with_cancel`. The flag store is a SeqCst swap at cancel.rs:121.
   - (b) `stream_inner` (stream.rs:1153-1233) touches no token before `lease_for_stream` (1234). `Pool::acquire` takes no token (pool.rs:361) and runs no statement on an existing connection (375-378, 396-397).
   - (c) attach loads the flag and interrupts under the slot lock, then stores the handle (cancel.rs:233-251).
   - (d) the producer's first check returns Cancelled before prepare (stream.rs:1794-1797), and the spawn (1265) follows the write.
   - (e) on Err the lease is dropped (1308), and `Lease::drop` discards (pool.rs:589-596). The Err arm sends whatever the post-check found (stream.rs:1373-1375).
   - (f) `next_into` blocks on `recv` (stream.rs:799). batches_generated is read after the terminal (connection_reuse.rs:207-211).
   - Never written again: the field is private (771), set only in the return literal (1412-1421), returned by copy (893-895). The detaches are at 1287 (after `produce`) and 1408 (spawn failure, returns Err).
   - M3's survivor path: guard step 2 (cancel.rs:185-187) feeding stream.rs:1844-1846.
2. §2.5 against the head:
   - Rows at connection_reuse.rs:250 and :399: `ViewportQuery::all` over big_spec (40 000 features x 64 vertices, lines 56-62) against `MAX_QUEUED_BATCHES` = 2 (stream.rs:85) and `MAX_BATCH_BYTES` (stream.rs:49). Nothing is consumed before the read, so the producer is held at a send. The reading holds.
   - Rows at :321-324 and :408-411: detach (stream.rs:1287) precedes release (1307/1308), and `active_leases` reads under the state lock that `return_healthy` and `discard` write under (pool.rs:444-447, 462-466, 494-497). The reading holds.
   - kernel/tests/publish_cancellation.rs:513-523 is a bounded wait on both, then the read. It holds.
3. Caller rule:
   - `interrupt_bound_at_lease`'s only reader is connection_reuse.rs:201 (repo grep). No engine test compares whole `ConnectionFacts` values (grep).
   - The member does nothing on its own: it is a one-time read of the slot the shipped build maintains. W2's doc names the round-5 item-4 exemption, the only caller and the test, and says why it is in the shipped build. That fits the instrument-accessor exemption.
   - The not-cfg rationale matches the precedent at stream.rs:654-666.
4. W1 to W6, clause by clause:
   - W1 (dataset.rs:1930-1937):
     - "bound before `stream_with_cancel` returns and before the producer starts": stream.rs:1234 < 1265 < 1412.
     - "cannot interrupt this stream's connection, which is not yet bound": `cancel_inner` finds an empty slot (cancel.rs:125-133). I read the subject as the cancel call, and on that reading it is true.
     - "attach … interrupts the idle connection, which DuckDB does not latch": cancel.rs:246-247, 45-49; `an_interrupt_on_an_idle_connection_is_not_latched` exists at cancel.rs:500.
     - "the producer's flag check before prepare … ends it Cancelled before any statement runs": stream.rs:1794-1797, 1373-1375.
     - The overlap sentence: a flag swap before attach's locked load is seen by attach; a swap after it reaches the stored handle through `cancel_inner`'s lock (cancel.rs:121, 125-133 against 234-249). The diagnosis' windows W3 and W4 say the same.
   - W2 (stream.rs:639-650):
     - "read once … after `lease_for_stream` bound it and before the producer thread is spawned, and never written again": stream.rs:1234-1240, 1265; the private field.
     - "detaches the handle as soon as `produce` returns": stream.rs:1268-1287.
   - W3 (connection_reuse.rs:153-163): true by the same sites. The terminal is Cancelled on every interleaving by §2.2 (a)-(e). "read from the connection facts recorded at the lease": line 201.
   - W4 (connection_reuse.rs:87-90): the cancel precedes the stream (189-190), and the matches-nothing viewport is lines 91-104. The flush condition is as the diagnosis read it; I did not re-read `flush`.
   - W5 (208-209): the producer exits before prepare and the query matches no row, so no batch.
   - W6 (217-220): it fires only when no terminal arrives; M2 is recorded failing there.
   - All six match §2.6's text as written.
5. §1: Amendments 1 and 2 and the test's record block (connection_reuse.rs:165-178) state outcomes and counts only. They give no rate from R3 and say nothing about CI's path. The block states that the stopping check is not asserted, which is consistent with §1's M3 bound. W1 and W3 naming the pre-prepare check is a code fact backed by `the_pre_prepare_cancel_exit_stamps_producer_cancelled` (stream.rs:3035), not a claim this test proves. The PR body and comments were not read (E-n1).
6. Amendment classes:
   - Amendment 1: items 3 and 5 as class 1 fit the template's class 1, since the observations' commit and the record's place are post-result records. The heading's "and 2" has no item (D1).
   - Amendment 2 (class 1) is references only, within the record cap. It appeared in the main checkout while I was reading.
   - CUT-STATE.md line 113 names it. I did not identify the commit that adds it.
- Owner's index: engine/README.md:530 and :550 at the head match lead-data's New blocks. Recounting the section's test pointers gives 44 under engine/ and 3 under kernel/tests/, which agrees with the correction in ead5b66a's message, not with the filed file's 43 and 4.
- Read in full: the full form (with Amendments 1 and 2), the five-line form (branch and main), the worker report, the owner's-index update, the apply worker's report, lead-data's diagnosis and the template's §10 classes and Round 25 additions. I did not read the drafting consults (`…-architect-draft.md`, `…-full-form-architect-draft.md`).
