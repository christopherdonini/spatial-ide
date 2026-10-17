*Custodian's filing note (2026-10-17): the architect's draft of the five-line form for `connection-reuse-recycled-interrupt-flake`, read at main e54e4af2; the run 2026-10-17T17:10:05Z to 2026-10-17T17:19:58Z by its transcript (Grep 18, Read 28, Glob 1; no write-capable call); its one SubagentHandback call, at 17:19:57Z. Byte-copied by script from that call; one final newline added; nothing else changed. The form is committed from its fenced block at `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md`, with its 30 HASH-TBD pin(s) computed by the custodian at e54e4af2, and nothing else changed. The message's sha256 as handed back is f740843b61f06ebd2783d9812e08d5d0b12a521cdb53ef9756b5f14a2504bca5.*

---

Reviewed: main @ e54e4af241908a6cd205b4412ed981987cf8807c

Disclosure: the checkout I read is main at 39465f0033035a35a8ba492e0073ae2f66842458. Going by `.git/logs/HEAD`, that is one docs commit past e54e4af (the PR #225 gate filing and a PLAN title). I have no Bash, so I could not diff it. Every pin below is written at e54e4af. When the custodian computes the hashes, that also checks the line numbers.

## 1. Form choice

The human asked for a five-line form. My reading is that §21a applies, so the route goes to the human as OPEN-1.

- **Size fits §21c.** About 40 changed lines by §21c's counting; I declare at most 70. Four files plus the form, five in all.
- **Category does not fit.** The piece changes how the test establishes a property under test: the recycled connection's handle reaching the token. It also corrects a comment that states a cancellation property (`lease_for_stream`'s "no window"). That is §21a's fourth bullet, by the reading I applied to S5d's assertion change.
- **Rule that follows.** Round 25, item 2 (e) then gives the full form from dispatch. The human's item 3 is the later and more specific ruling.

**Which fact.** I chose a public member of `ConnectionFacts`, not a test-only fact.
- **What the member reaches.** Every reader reads named members only:
  - `kernel/src/lib.rs:662-669` reads three members;
  - `kernel/tests/query_window_attribution.rs:218` reads one;
  - the engine tests read members one at a time.
  - No struct literal exists outside `stream.rs:1222`. I found no whole-struct comparison or Debug print, and no reader in `frontends/`. `kernel/scripts/run-connection-ab.mjs` reads named fields of a kernel artifact.
  - So the new member is reached only through compilation. It is not reported, not on the wire, and the shell does not see it.
- **The caller rule.** The member's only caller is the test, so it rests on the instrument-accessor exemption (round 5, item 4). It is a read-only copy of the token slot, which the shipped build already maintains. Its doc must make the three declarations.
- **Why not `cfg(test)`.** An integration test links the library without `cfg(test)`, so a `cfg(test)` member never reaches `connection_reuse.rs`.
- **Why not the `fixture` feature.** Gating the member on `fixture` would work: `fixture` is on only through dev-dependencies in `engine/`, `kernel/` and `src-tauri`. But the recording would then be absent from the shipped build, and the precedent at `stream.rs:643-646` prefers unconditional instrument facts.

**Largest finding (OPEN-2).** The ruled fix does not stop the test failing in the interleaving CI showed.
- In that run the producer had already detached, so `produce` had already returned `Ok`.
- After the fix the binding assertion passes. Then `cancel.cancel()` lands on a finished stream, `next_into` returns `None`, and the test panics at `connection_reuse.rs:198-201` (its "inconclusive" message).
- So the fix removes the misnaming, not the red build. The form claims only that.

**Side facts.**
- **`lease_for_stream`'s comment:** in Scope, as a class-3 comment fix. The human's item 1 defines S3 as "a test fix with a comment on the window". The comment is untrue at main: before the bind nothing is interruptible, and the producer's flag check is what stops a cancel there.
- **`flush`'s check-then-send:** stays out. My search of `stream.rs` found no comment that claims otherwise. H2's allowance ("at most one batch after the producer observes cancellation") holds. `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md` already records the gap. No change is proposed, so there is no OPEN item for it.

## 2. Draft form

````markdown
# connection_reuse.rs: the recycled connection's binding asserted from a fact recorded at the bind, not from the live token — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node connection-reuse-recycled-interrupt-flake, at slot 2's tail after source-changed-post-route-s5d-race. Drafted by the architect at main e54e4af241908a6cd205b4412ed981987cf8807c. Every pin below is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Path of this form: `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN or generated file. Not dispatched until OPEN-1 and OPEN-2 are ruled.*

```
Authority: PLAN node connection-reuse-recycled-interrupt-flake; the human's rulings of 2026-10-17, the first message's item 1 (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:9 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and the second message's item 3 (state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:14 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD), each with its RULED block in DECISIONS-PENDING.md. Evidence (a read, cited for what it reported; every fact used re-checked at e54e4af241908a6cd205b4412ed981987cf8807c): state/consults/2026-10-17-connection-reuse-recycled-interrupt-flake-diagnosis-lead-data.md, read at main e555177c. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for connection pool, `No prior art recorded for "connection pool". Research it before planning an implementation.` and, for interrupt handle, `No prior art recorded for "interrupt handle". Research it before planning an implementation.`, each with exit code 1; two misses, noted, not blocking.
Scope: engine/src/stream.rs (ConnectionFacts, engine/src/stream.rs:624-639 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, gains one member and its doc; its one constructor, engine/src/stream.rs:1221-1226 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, writes it); engine/tests/connection_reuse.rs (the test's comment, engine/tests/connection_reuse.rs:153-158 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, and its binding assertion, engine/tests/connection_reuse.rs:179-183 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD; no other test in the file changes); engine/src/dataset.rs (lease_for_stream's doc comment only, engine/src/dataset.rs:1928-1936 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD; no code line); engine/README.md (the owner's index: the last-verified line, engine/README.md:530 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, and the list of preregistrations in this module, engine/README.md:550 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, gains this form; two lines replaced); this form; 5 files; declared line budget <= 70 changed lines by §21c's counting (insertions plus deletions), this form excluded; no PLAN or generated file on the branch.
Change: ConnectionFacts gains `interrupt_bound_at_lease: bool`, written once in its one constructor from `cancel.is_bound()` on the caller's thread, after lease_for_stream has bound the handle and before the producer thread is spawned, and never written again (§1); the test asserts that member instead of `cancel.is_bound()`, with the assertion's message unchanged; lease_for_stream's comment states what holds before the bind (§1, F5); nothing the app shows, the kernel reports or the wire carries changes.
Tests+mutation: changed test `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing` (engine/tests/connection_reuse.rs); its generation and reuse assertions (engine/tests/connection_reuse.rs:174-178 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and its nothing-generated assertion and terminal match (engine/tests/connection_reuse.rs:187-206 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) are unchanged and still carry that a cancel before the first batch delivers nothing. Mutation M1: lease_for_stream's attach statement (engine/src/dataset.rs:1942 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) deleted; the test fails by name at the new assertion, with its message. Observed by applying it at the final code commit, running the test by its exact name (cargo test -p spatial-engine --test connection_reuse cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing -- --exact), recording the failure with that commit id, and reverting it. Forced-interleaving runs (§2), observed the same way, never committed. The test, and the file's other tests, pass unforced at the final code commit.
Out-of-scope: ADR, security and wire are not touched: no ADR file, nothing under protocol/ or kernel/, no SKP field (the member is instrument surface on the Rust API only, ADR-004 Amendment 4; kernel/src/lib.rs:662-669 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD reads three named members and gains none); guarantee: touched, because the piece changes how the test establishes a property under test (the recycled connection's binding) and corrects a comment stating a cancellation property (§21a, fourth bullet), which closes §21b's single gate from dispatch (OPEN-1); no product behaviour, cancellation path, pool rule, fixture, dependency or string the app shows changes; the file's other live is_bound reads (engine/tests/connection_reuse.rs:231 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and engine/tests/connection_reuse.rs:380 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and flush's check-to-send step are not touched.
```

## §1. The fact, when it is written, and who reads it

- F1. The bind. lease_for_stream acquires the lease and attaches its handle on the caller's thread: engine/src/dataset.rs:1937-1944 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. attach stores the handle under the slot lock: engine/src/cancel.rs:233-251 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. is_bound reads that slot under the same lock: engine/src/cancel.rs:271-277 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F2. The write. ConnectionFacts is built directly after lease_for_stream returns (Scope's pin). The producer is spawned only after that: engine/src/stream.rs:1251-1253 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. Its detach runs after produce returns: engine/src/stream.rs:1269-1273 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The other stream-path detach is in the spawn-failure arm, which returns Err: engine/src/stream.rs:1387-1396 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F3. Nothing writes the fact later. It is a private field of BatchStream (engine/src/stream.rs:758 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD). It is written only in the return literal (engine/src/stream.rs:1398-1407 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and returned by copy (engine/src/stream.rs:880-882 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD).
- F4. The member's doc declares the exemption (the human, 2026-09-16, round 5, item 4). Its only caller is the test suite. It names the test above. It says why the fact is not behind cfg(test) or the fixture feature: the binding it records is the shipped pool's.
- F5. lease_for_stream's comment is corrected. The sentence claiming no window before anything is interruptible is replaced by what the code does: the handle is bound before stream_with_cancel returns, and a cancel made before the bind is stopped by the producer's check before prepare (engine/src/stream.rs:1777-1783 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD), not by an interrupt.
- F6. Cost. One uncontended slot-lock read per stream, on the caller's thread, inside SPAN_LEASE_BIND, which is reported and never scored: engine/src/trace.rs:485-491 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. No figure is claimed.

## §2. What the runs show, and what they do not

- The forced interleaving uses scratch test text: `until("the producer to release its lease", || ds.connections().active_leases() == 0);` placed directly after `let f = stream.connection_facts();`. The pool's release decrements its count under the state lock after the producer's detach (engine/src/pool.rs:444-447 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, engine/src/pool.rs:462-464 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD), and active_leases reads the count under the same lock (engine/src/pool.rs:494-497 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD).
  - R1, at the piece's base: predicted to fail at the live-token assertion with its message, which is CI's failure reproduced.
  - R2, at the final code commit: predicted to pass the new assertion and then fail at the inconclusive panic (engine/tests/connection_reuse.rs:198-201 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD).
  - Each run is recorded with its commit id. A run that does not match its prediction is a recorded deviation, and the prediction is never edited.
- The piece shows that the binding assertion no longer fails in that interleaving. It does not show that the test no longer fails in it (OPEN-2).
- M1 has a known survivor: a member hard-coded `true` survives the test. The gate checks at the constructor line that the value is read from the token.

## §3. Overlap (rule 00)

- This piece touches engine/ only, plus this form, and nothing under protocol/.
- PR #225 (frontends/shell/e2e/README.md), cut/search-ignore-historical (a root `.ignore`, scripts/plan/measure-reads.mjs and its test, two probe files, an AUTONOMY.md append), source-changed-post-route-s5d-race's step 1 (its record, its form, PLAN.yaml) and publish-approval-unknown-attempt-under-load's first step (frontends/shell/e2e/ export steps) touch nothing under engine/. The custodian confirms the two probe files' paths.
- PLAN.yaml stays the custodian's, on main.
- The piece's cargo runs follow the machine rules, and none overlaps S5d's exclusive hold.

## §4. Gates

- Proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- Under OPEN-1 (A): reviewer and architect from dispatch, on this form. Under (B): the full form, with both gates.
- The reviewer recomputes every hash and observes M1, R1 and R2 against their commit ids.

## §5. OPEN items

- OPEN-1, the route (the human's). (A) This five-line form, as item 3 rules, with reviewer and architect from dispatch; the ruling is recorded as setting round 25, item 2 (e) aside for this piece. (B) The full form from dispatch, per round 25, item 2 (e), drafted from this content. The architect recommends (A).
- OPEN-2, the claim (the human's). (A) As drafted: the claim is reduced to §2's, and a recurrence reads as the test's inconclusive panic. The custodian proposes a node for the terminal race, for triage. (B) Widen now: the test cancels before stream_with_cancel, so the producer's check before prepare makes the terminal Cancelled on every interleaving. This changes what the test exercises (a cancel before the bind instead of after it), takes the full form, and is drafted on request. The architect recommends (A).

### Amendments

*(Opens empty; append-only.)*
````

## 3. Clause check

Each code fact the form states, checked at the tree I read:

- **Bound on the caller's thread before the producer is spawned:** `stream.rs:1221` calls `lease_for_stream`, which calls `attach` at `dataset.rs:1942`. The spawn is at `stream.rs:1251-1253`. The return is at `stream.rs:1398`.
- **Fact written once, from `cancel.is_bound()`, before spawn, never again:** the one constructor is at `stream.rs:1222-1226`, and `cancel` is still owned there (moved at `:1400`). Searching `engine/src` finds `self.connection` only at `stream.rs:881`, and the field is private (`stream.rs:758`).
- **Nothing can empty the slot between the bind and the write:** the stream-path detaches are at `:1273` (the producer, not yet spawned) and `:1394` (`map_err`, after spawn).
- **No other test changes; the kept assertions still carry "delivers nothing":** `batches_generated == 0` is at `:191-195`. The terminal must be `Some(Err(Cancelled))`, with `None` panicking, at `:196-206`.
- **M1 fails by name at the new assertion:** with the attach deleted, the slot stays empty, so the member is false. Lines 174-178 still pass (generation 3, reused), and the new assertion fails with its message.
- **R1 prediction:** `active_leases()==0` comes after `return_healthy` or `discard` (`pool.rs:447` / `:464`). Both follow detach (`stream.rs:1273`) in the producer's program order and sit under the state mutex that `active_leases` locks (`pool.rs:495`). So the slot is empty, and line 179 fails.
- **R2 prediction:** `produce` has returned `Ok` (the query matches nothing, so `flush` is never called, `stream.rs:2120`). The post-check is unchanged, so nothing is sent (`:1347-1351`). `tx` is dropped, `recv` errors, and `next_into` returns `None` (`:792-795`). That reaches the panic at `:198-201`, after `:191-195` has passed.
- **Kernel reads three named members:** `kernel/src/lib.rs:667-669`.
- **Comment correction, F5:** the producer's check is at `stream.rs:1780-1782`, and the comment at `:1777-1779` gives the non-latching reason. A cancel made before the bind empties nothing, and `attach` reads its flag (`cancel.rs:246-247`).
- **Cost, F6:** `trace.rs:485-491` names `ConnectionFacts` construction inside `SPAN_LEASE_BIND`, "Reported, never scored".
- **Sibling reads at `:231` and `:380` are out of scope:** I did not verify that backpressure orders them. My reading is that `big_spec` on `ViewportQuery::all` far exceeds `MAX_QUEUED_BATCHES` (2, `stream.rs:85`). That reading is stated nowhere in the form; the form states only that those reads are untouched.

Suggested words for the worker's comments. None of these is the human's wording, so under item 2 of the 2026-10-11 direction the worker applies them and the PR body lists them. Each was checked against the lines above.

- **`dataset.rs`, replacing the "no window" sentence:**
  "so the handle is bound before `stream_with_cancel` returns and before the producer starts. A cancel made before the bind finds no handle to interrupt; `attach` then sees its flag, and the producer's check before prepare (`produce`) ends the stream `Cancelled` before any statement runs, because DuckDB does not latch an interrupt raised on an idle connection (`cancel.rs`)."
  - I wrote "made before the bind" on purpose. A cancel whose call overlaps `attach` (the diagnosis's W3/W4) is not covered by this sentence, and the sentence claims nothing about it.
- **The member's doc:**
  "Whether this stream's token held an interrupt handle when the lease was taken: read once from the token on the caller's thread, after `lease_for_stream` bound it and before the producer thread is spawned, and never written again. The live token cannot answer this later: the producer detaches when its query ends. **An instrument fact; its only caller is the test suite**, `engine/tests/connection_reuse.rs`'s `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing`. Not behind `cfg(test)` or the `fixture` feature, so the fact is recorded by the code the shipped build runs."
- **The test's comment, item 1:**
  "the *recycled* connection's interrupt handle was bound to this stream's token, read from the connection facts recorded at the bind, never from the live token: on this query the producer can finish, detach and release its lease before the next line runs, so the live token can read unbound after a bind that happened. The same window decides the terminal, below."

## 4. OPEN items

- **OPEN-1, the route:**
  - (A) A five-line form with reviewer and architect from dispatch. This sets round 25, item 2 (e) aside for this piece. Recommended.
  - (B) The full form from dispatch.
- **OPEN-2, the claim:**
  - (A) The claim is reduced. The terminal race becomes a proposed node, and CI can still go red on this test, as "inconclusive". Recommended.
  - (B) The cancel moves before `stream_with_cancel`, which makes the terminal deterministic. This changes what the test exercises and needs the full form.

## 5. Files read (all absolute, at the checkout described above)

- `C:\dev\spatial-ide\state\directives\2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md` (all)
- `C:\dev\spatial-ide\state\directives\2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md` (all)
- `C:\dev\spatial-ide\state\consults\2026-10-17-connection-reuse-recycled-interrupt-flake-diagnosis-lead-data.md` (all)
- `C:\dev\spatial-ide\PLAN.yaml` (5330-5439)
- `C:\dev\spatial-ide\engine\tests\connection_reuse.rs` (all)
- `C:\dev\spatial-ide\engine\src\stream.rs` (600-929, 1140-1409, 1772-1789, 2440-2579; searches)
- `C:\dev\spatial-ide\engine\src\dataset.rs` (1905-1945)
- `C:\dev\spatial-ide\engine\src\cancel.rs` (220-284)
- `C:\dev\spatial-ide\engine\src\pool.rs` (436-605)
- `C:\dev\spatial-ide\engine\src\trace.rs` (478-497)
- `C:\dev\spatial-ide\engine\README.md` (272-349, 521-561)
- `C:\dev\spatial-ide\engine\Cargo.toml`
- `C:\dev\spatial-ide\kernel\Cargo.toml` (28-41)
- `C:\dev\spatial-ide\frontends\shell\src-tauri\Cargo.toml` (70-89)
- `C:\dev\spatial-ide\kernel\src\lib.rs` (600-709)
- `C:\dev\spatial-ide\kernel\tests\query_window_attribution.rs` (205-229)
- `C:\dev\spatial-ide\kernel\scripts\run-connection-ab.mjs` (search hits)
- `C:\dev\spatial-ide\docs\adr\PROPOSED-amendment-to-ADR-004-instrument-surface-never-skp.md` (20-31)
- `C:\dev\spatial-ide\AUTONOMY.md` (306-385)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md` (140-178)
- `C:\dev\spatial-ide\frontends\shell\SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md` (all)
- `C:\dev\spatial-ide\engine\CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md` (1-40)
- `C:\dev\spatial-ide\.git\HEAD`, `C:\dev\spatial-ide\.git\refs\heads\main`, `C:\dev\spatial-ide\.git\logs\HEAD` (search)
- Repo-wide searches for `ConnectionFacts`, `connection_facts` and `is_bound`, and in `engine\` for `batches_after_cancel` and H2.
