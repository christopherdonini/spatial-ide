*Custodian's filing note (2026-10-01): the architect's gate 1 on PR #151, for PLAN node `catalog-open-replace-drop-latency-note` at g1 (note only), full gating. Reviewed: cut/catalog-replace-note @ 53e1cf4 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 06:03:20Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 53e1cf4. Verdict BLOCK on two doc-wording overclaims in the replace note: B1 (the first sentence lacks the Ok-path condition) and B2 (the "Otherwise" sentence is false for the dataset in the lease case). Both are taken as correction round 1, `///` lines only. N1 to N3 go to the closing record. Profile paths redacted at filing: none.*

---

Reviewed: cut/catalog-replace-note @ 53e1cf4

**Verdict: BLOCK.** The replace note leaves out two of §1 May 1's conditions (B1, B2). Everything else passes. Both fixes are `///` doc lines only and fit within §7's recorded overrun.

I read the code at 53e1cf4 in C:/dev/wt/catalog-replace-note and the form on main at 84dd58e. I have no Bash, so I did not recompute any diff or hash. The diff shape is reconstructed from main's `kernel/src/lib.rs` (unchanged there since d8544a0) against the branch file, and it agrees with the 18+3 / 109+0 count.

**1. §2 items 1 and 2: FAIL (B1, B2).**
- Present and correct:
  - The external section is named with no number and no duration word (§8 item 3). The ADR-018 item 4 class (b) wording resolves at `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:85`. "128" was correctly left out, even though §2 item 1's own bullet carries it.
  - Reachability is stated without calling a collision impossible (§8 item 4).
  - The fix shape is true: `close_dataset` binds the removed watch and drops it after the guard (skp.rs, `removed_watch`, at 53e1cf4).
  - `open_cancellable` gets one pointer line plus a blank `///`.
  - Every changed line in lib.rs is `///` (18 inserted, 3 deleted).
- `Catalog::remove`'s new sentence matches §2 item 2's text, re-wrapped, except one byte: the form's closing `.` after `)` is dropped so the sentence can join the kept "— nothing here waits…". This is non-blocking (N2). The sentence is true: `Lease` holds `pool: Arc<ConnectionPool>` and its `physical` connection (`engine/src/pool.rs`, `struct Lease` and `impl Drop for Lease`), the producer thread takes the lease, and the cited test exists (`engine/tests/connection_reuse.rs`, fn at 439).

**2. §1 scope closure: FAIL.**
- **B1 (Err path).** The note opens with "Opening under a name already registered replaces the entry" and gives no Ok-path condition. On Err, the `?` on the line before `lock_write()` returns before the guard is taken, and the existing entry stays. So the sentence claims something on the Err path, which §1 forbids, and the claim is false there. This is the same early-return overclaim node 4's gate found. Fix: put the Ok condition on the first sentence ("An `open` that returns `Ok` under a name already registered…"), with no Err-path statement.
- **B2 (lease case).** "Otherwise the last holder drops it on its own thread": "it" naturally refers back to the replaced `Arc<Dataset>`. When that Arc is the last reference and a lease is in flight, the dataset is dropped under the guard and only the pool survives, released on the producer thread (§0's "a lease in flight drops the pool later"). Fix: name what drops where. A `get` holder drops the dataset (and, with no lease, its pool) on its own thread; a lease in flight releases the pool on its producer thread.
- The last-reference condition itself is stated correctly.

**3. T1 and T2: PASS.**
- Both names match §4 byte for byte (`kernel/tests/catalog_replace.rs`, fns at 42 and 77).
- Assertions follow §4: a `Weak` taken from `connections()` with the `get` clone dropped by block scope, strong count 1, then the second open `Ok`, path B, `names()` is `[N]`, strong count 0. T2 uses a fresh `CancelToken` and `None` identity.
- Fixture names `catalog-replace-t{1,2}-{a,b}` appear nowhere else in the tree. The fixture helper has the `end_to_end.rs` shape.
- No sleep, timeout, thread, poll loop or hook.
- The M1 and M2 observations sit in the test docs, name commit c3e8e54 and the failing assertion, and do not call a `verify-mutation` run an observation.

**4. Amendment 1: PASS.**
- Class 8 is the right class (§7, §8 item 12).
- §7 still reads ≤ 120.
- It states the figure (130 over 2 files at 53e1cf4, base d8544a0) and the reason (rustfmt took the file from 83 to 109 lines).
- Its §21c claim holds: AUTONOMY.md §21c's bound is ≤ 150 lines across ≤ 8 files.

**5. R1 to R6 and the seam: PASS.**
- No `cfg`, no ignore, no OS dependence; the fixture path is portable.
- No new item of any visibility. T1 and T2 call only existing `pub` items: `Catalog::open`/`open_cancellable`/`get`/`names`, `Dataset::connections`/`path`, `CancelToken::new`.
- No new seam, so no end-to-end test is owed (§1 Seams).
- ADR-006 classes are unchanged.

**6. §8, item by item.**
1. FAIL: none.
2. PASS: the count shows two files, none under the forbidden trees.
3. PASS.
4. PASS: no product path is claimed to replace a name, and a collision is not called impossible. See N1.
5. PASS.
6. PASS.
7. PASS.
8. PASS.
9. PASS: the declared-unchanged tests are not in the diff.
10. PASS.
11. PASS.
12. PASS.
13. PASS, with N3.
14. Pending the merge style. A squash would orphan c3e8e54, which the test docs name, so only a merge commit keeps them resolvable.

Item 1 passes; B1 and B2 belong to my items 1 and 2 above, not to §8.

**Blocking**
- **B1:** the replace note's first sentence lacks the Ok-path condition, so it claims (falsely) past the `?` early return. Violates §1 May 1, §1 May not (Err path), and §2 item 1.
- **B2:** the "Otherwise…" sentence is false for the replaced dataset when it is the last reference and a lease is in flight. Violates §1 May 1 and §1's lease-case closure.

**Non-blocking**
- **N1:** "no product path replaces a name on purpose" states H1 as fact. The H1 grep (§6 item 2) at d8544a0, recorded in the worker report, supports it; the closing record should reference that grep.
- **N2:** the replacement sentence drops §2 item 2's closing period. Record it by reference in the closing amendment.
- **N3:**
  - The worker report's test-line pointers (`catalog_replace.rs:51`, `:42`/`:77`) carry their commits only through context, and its "7b-less obs commit" is resolved to 3f16cb7 only in the filing note.
  - The closing record must pin test text at a main commit after the merge (round 25, item 2).
  - Amendment 1 was written after outcomes had been seen, but its first line does not say so, which the form's header requires. The closing amendment should note this by reference.
- **N4:** the backticks in the observation docs are nested ("`assertion `left == right` failed: …`"), which is cosmetic.

Files:
- C:/dev/wt/catalog-replace-note/kernel/src/lib.rs
- C:/dev/wt/catalog-replace-note/kernel/tests/catalog_replace.rs
- C:/dev/spatial-ide/kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-01-catalog-replace-note-worker-report-1.md
