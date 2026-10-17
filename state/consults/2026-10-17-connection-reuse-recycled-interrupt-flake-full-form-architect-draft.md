*Custodian's filing note (2026-10-17): the architect's draft of the full form for `connection-reuse-recycled-interrupt-flake` (OPEN-1 (B)), read at main 28163cb6; the run 2026-10-17T20:04:46Z to 2026-10-17T20:14:03Z by its transcript (Read 31, Glob 1, Grep 14; no write-capable call); its one SubagentHandback call, at 20:14:02Z. Byte-copied by script from that call; one final newline added; nothing else changed. The form is committed from its fenced block at `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md`, a new file by AUTONOMY §25 (e), with its 62 HASH-TBD pin(s) computed by the custodian at 28163cb6, and nothing else changed. The message's sha256 as handed back is 6eb407769af235b48dbee19b50d6c36a6eabce7af3eac2787a292d67ebebdbd1.*

---

Reviewed: main @ 28163cb6f30fd60681903ed1227cdf17c06abc0f

This is a drafting consult, so it has no verdict. I read the checkout at main. `.git/HEAD` is `ref: refs/heads/main`, and `refs/heads/main` reads 28163cb6f30fd60681903ed1227cdf17c06abc0f. I have no Bash, so nothing was diffed or run. Every code site the five-line form pinned at e54e4af is on the same lines at this commit; I read each one.

Before the form, one structural point. AUTONOMY.md §25 (e) ends by saying that a five-line form already committed is not rewritten. So the full form goes in a new file, and the five-line form stays exactly as committed. I propose `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md`; the custodian points the PLAN node's `gate` at it. This is mechanical and the custodian's call, so it is not an OPEN item.

## 2. Draft form

````markdown
# connection_reuse.rs: the token cancelled before the stream opens, and the recycled connection's binding asserted from the fact recorded at the lease — full form (PLAN node connection-reuse-recycled-interrupt-flake)

File: engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md
Authority:
- the human's third message of 2026-10-17, item 3 (OPEN-2 (B), OPEN-1 (B), the order): state/directives/2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md:12 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD
- the second message's item 3 (the grade and the fix's shape): state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:14 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD
- the first message's item 1 (the diagnosis first): state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:9 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD
- each of the three messages has its RULED block in DECISIONS-PENDING.md
- the five-line form's Amendment 1: engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md:53-62 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD
- the node: PLAN.yaml:5377-5393 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD
Drafted by: the architect agent on the custodian's brief. Inputs: the five-line form's content, as its Amendment 1, item 2 orders; that form's draft, state/consults/2026-10-17-connection-reuse-recycled-interrupt-flake-architect-draft.md; and lead-data's diagnosis, state/consults/2026-10-17-connection-reuse-recycled-interrupt-flake-diagnosis-lead-data.md. The diagnosis is evidence: a read at main e555177c, cited for what it reported. Every fact used from it was re-checked at 28163cb6f30fd60681903ed1227cdf17c06abc0f.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full. §21a applies: a property under test and a comment stating a cancellation property (§0.5).
Pins: every pin is a historical pin at 28163cb6f30fd60681903ed1227cdf17c06abc0f. For the code the piece edits, its base tree is authoritative; for what this form read, the pin is. If a pinned line has moved by the base, the worker re-derives the site by symbol.
Why a new file: AUTONOMY.md §25 (e), last sentence. The five-line form stays as committed. Nothing is built under it (its Amendment 1, item 2), and its §2 predictions bind nothing.

## §0. Disclosure

0.1 What was seen. In PR #222's pull_request run 38910535607 at a542097e (ubuntu-24.04), this test failed at its live-token assertion, engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD. The push run of the same commit passed. The failed steps are filed byte-identical at state/consults/2026-10-16-pr222-ci-run-38910535607-attempt-1-failed-steps.txt: evidence, not Authority.

0.2 The diagnosis' reading (0.1's evidence):
- The bind happens on the caller's thread, before `stream_with_cancel` returns and before the producer is spawned.
- Nothing orders the test's `is_bound()` read against the producer's `detach`, which runs as soon as `produce` returns.
- On a query that matches nothing, the producer can reach that `detach` first.
- The log carries no producer timing, so this reading of the CI failure stays inferred (§1).

0.3 The five-line form, its draft and the human's rulings:
- The five-line form's content (the member, the comment correction, M1, the forced interleaving) carries over here.
- Its §2 prediction, R2 failing at the inconclusive panic, is superseded by OPEN-2 (B): the cancel moves before the stream, and R2 is re-predicted in §5.

0.4 Reuse index (the standing step). The custodian ran node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. Both lookups exited with code 1:
- for connection pool it printed `No prior art recorded for "connection pool". Research it before planning an implementation.`
- for interrupt handle it printed `No prior art recorded for "interrupt handle". Research it before planning an implementation.`
Two misses, noted and not blocking. The piece adds no mechanism.

0.5 Gating route. The piece changes how a test establishes a property under test (the recycled connection's binding) and what the test exercises (a cancel before the bind instead of after it). It also corrects a comment that states a cancellation property. That is §21a's fourth bullet, so the full form and both gates apply from dispatch (§25 (e); OPEN-1 (B)). The size (§7) is under §21c's bound.

0.6 Fixture drive: no measurement, and the 5 GB fixture is not used.

## §1. May and may not claim

- May claim, by §2's argument and §4's runs:
  - the binding assertion reads a fact recorded on the caller's thread after the bind and before the producer is spawned, so no producer step can change what it reads (§2.1);
  - the test cancels before `stream_with_cancel`, so on every interleaving the terminal is `Cancelled` and nothing is generated (§2.2);
  - R2: the interleaving the diagnosis names for CI's failure, forced, passes at H;
  - `lease_for_stream`'s comment states what the code does before the bind (§2.3);
  - M1 and M2 as observed, and M3 as observed surviving.
- May not claim:
  - that CI's failure took R1's path (0.2);
  - that this test exercises an interrupt reaching a query. Its terminal comes from a flag check, and the interrupt `attach` raises on the idle connection is not latched (engine/src/cancel.rs:45-54 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). A cancel after the bind on a recycled connection stays the business of `midstream_cancellation_still_stops_the_producer_on_a_recycled_connection` (engine/tests/connection_reuse.rs:209-261 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - which producer check stops this stream (M3). The pre-prepare exit is pinned by `the_pre_prepare_cancel_exit_stamps_producer_cancelled` (engine/src/stream.rs:3016-3021 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - anything about a cancel whose call overlaps the bind, beyond §2.3's sentence;
  - that the file's other live `is_bound()` reads are race-free (§2.5 is a reading, not a run);
  - any rate, from R3 or otherwise; any duration or latency; any docs/08 row.
- No ADR is amended. There is no wire, SKP, MCP or data-plane change, no string the app shows, and no dependency. The one new pub item is §2.1's member, an instrument fact.

## §2. The change

2.1 engine/src/stream.rs: one member of `ConnectionFacts` (engine/src/stream.rs:624-639 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- `pub interrupt_bound_at_lease: bool`, with §2.6's W2 as its doc.
- Its one write is `interrupt_bound_at_lease: cancel.is_bound(),` in the one constructor (engine/src/stream.rs:1221-1226 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). That is after `lease_for_stream` has bound the handle and before the spawn (engine/src/stream.rs:1251-1253 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- Never written again:
  - the struct is held in a private field (engine/src/stream.rs:758 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - that field is set only in the return literal (engine/src/stream.rs:1398-1407 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - it is returned by copy (engine/src/stream.rs:880-882 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- Before the write, nothing can empty the slot:
  - the producer's detach runs after `produce` returns (engine/src/stream.rs:1269-1273 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), and the producer is not yet spawned;
  - the other stream-path detach is in the spawn-failure arm, which returns Err (engine/src/stream.rs:1387-1396 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- The source of the value: attach stores the handle under the slot lock (engine/src/cancel.rs:233-251 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), and is_bound reads that slot under the same lock (engine/src/cancel.rs:271-277 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- Readers, all of named members:
  - kernel/src/lib.rs:662-669 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD reads three;
  - kernel/tests/query_window_attribution.rs:218 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD reads one;
  - the engine tests read one at a time;
  - no struct literal exists outside the constructor, and nothing under frontends/ reads the type.
  - The derives (Clone, Copy, Debug, PartialEq, Eq) take a bool unchanged.
- Caller rule: the member has no product caller. It rests on the instrument-accessor exemption (round 5, item 4), and W2 makes its three declarations. Its place is the one the human's second message, item 3, names first.
- Why not cfg(test), and why not the `fixture` feature:
  - an integration test links the library without cfg(test);
  - behind `fixture`, the recording would be absent from the shipped build, while the property is the shipped pool's;
  - the precedent is engine/src/stream.rs:641-646 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD.
- Cost: one uncontended slot-lock read per stream, on the caller's thread, inside SPAN_LEASE_BIND, which is reported and never scored (engine/src/trace.rs:485-491 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). No figure is claimed.

2.2 engine/tests/connection_reuse.rs: the test `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing`. Its name is unchanged.
- The edits:
  - `cancel.cancel();` moves to directly after `let cancel = CancelToken::new();`, before `stream_with_cancel` (engine/tests/connection_reuse.rs:169-172 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). The old call (engine/tests/connection_reuse.rs:185 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) is deleted;
  - the binding assertion asserts `f.interrupt_bound_at_lease` instead of `cancel.is_bound()`, with its message unchanged (engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
- Unchanged:
  - the generation and reuse assertions (engine/tests/connection_reuse.rs:174-178 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - the nothing-generated assertion and its message (engine/tests/connection_reuse.rs:191-195 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD);
  - the `Cancelled` arm and the `other` arm.
- The None arm's message is replaced (W6).
- Why the terminal is `Cancelled` on every interleaving:
  - (a) The flag store (engine/src/cancel.rs:120-133 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) runs on the test thread before `stream_with_cancel` is called. In program order it therefore precedes the bind and the spawn.
  - (b) Nothing before the lease reads the flag (engine/src/stream.rs:1166-1219 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), and neither does the pool's acquire (engine/src/pool.rs:361-429 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). So `stream_with_cancel` returns Ok on generation 3, reused, as before.
  - (c) attach finds the flag set, interrupts the idle connection and stores the handle (engine/src/cancel.rs:246-249 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). So the member reads true.
  - (d) The spawn orders the flag store before the producer's first check, which returns Cancelled before prepare (engine/src/stream.rs:1777-1783 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
  - (e) The lease is dropped, which discards the connection (engine/src/stream.rs:1292-1295 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD; engine/src/pool.rs:589-596 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). The post-check runs, and the Err arm sends the Cancelled terminal whatever the post-check found (engine/src/stream.rs:1343-1362 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).
  - (f) next_into blocks on recv until that item arrives (engine/src/stream.rs:782-797 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). batches_generated is read after the terminal, which the producer sends only after `produce` has returned without a flush, so it reads 0.
- What the test exercises now: a cancel before the bind, the window the comment in §2.3 misstated. It no longer exercises a cancel after the bind. In the passing interleaving at main, that cancel was stopped by a flag check or an interrupt, and the test could not tell which.
- What still proves the binding: the fact recorded at the lease (2.1). M1 shows that the terminal alone cannot prove it.

2.3 engine/src/dataset.rs: `lease_for_stream`'s doc comment only (engine/src/dataset.rs:1928-1936 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). No code line changes.
- The clause after the bolded first phrase, which claims there is no window before anything is interruptible, is replaced by W1. The rest of the doc stays.
- W1 agrees with the token's own field doc (engine/src/cancel.rs:45-54 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD).

2.4 engine/tests/connection_reuse.rs, the comments:
- the test's header comment (engine/tests/connection_reuse.rs:153-158 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) becomes W3;
- matches_nothing's doc after its first paragraph (engine/tests/connection_reuse.rs:85-90 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) becomes W4. Its only user is this test;
- the structural comment (engine/tests/connection_reuse.rs:189-190 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) becomes W5;
- the None arm's message (engine/tests/connection_reuse.rs:198-201 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) becomes W6.

2.5 Sibling search (AUTONOMY.md §14). The defect class is a live `is_bound()` read after the stream returns, with nothing ordering it against the producer's detach.

| Site | Class | Scope | Reason |
|---|---|---|---|
| engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD | in | in (2.2) | the node |
| engine/tests/connection_reuse.rs:231 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD | the same shape | out | The architect's reading, not run. On ViewportQuery::all over big_spec (engine/tests/connection_reuse.rs:56-62 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), the producer must send more batches than the channel holds (engine/src/stream.rs:85 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), with no batch above engine/src/stream.rs:49 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD. The test consumes nothing before the read, so the producer is held at a send and cannot reach detach. |
| engine/tests/connection_reuse.rs:380 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD | the same shape | out | as the row above |
| engine/tests/connection_reuse.rs:302-305 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD and engine/tests/connection_reuse.rs:389-392 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD | not in | out | Each follows a wait for active_leases() == 0. detach precedes the lease's release in the producer's program order (2.2 (e)), and active_leases reads the count under the state lock that the release writes under (engine/src/pool.rs:444-447 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD; engine/src/pool.rs:462-466 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD; engine/src/pool.rs:494-497 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). |
| kernel/tests/publish_cancellation.rs:513-523 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD | not in | out | a bounded wait for unbound, then the read |

No defect was found beyond the node, and no node is proposed.

2.6 Words. All are the architect's and none is the human's. The worker applies them, and the PR body lists them (the 2026-10-11 direction, item 2). Each clause is checked in the consult report that delivered this form.
- W1, lease_for_stream's doc, replacing the clause after `rather than inside the producer thread**,`:
  so the handle is bound before `stream_with_cancel` returns and before the producer starts. A cancel that completed before the bind cannot interrupt this stream's connection, which is not yet bound: `attach` sees its flag and interrupts the idle connection, which DuckDB does not latch (`cancel.rs`), and what stops the stream is the producer's flag check before prepare (`produce`), which ends it `Cancelled` before any statement runs. A cancel whose call overlaps the bind is either seen by `attach` in the same way or reaches the bound handle, as a cancel arriving after the bind does.
- W2, the member's doc:
  Whether this stream's cancellation token held its connection's interrupt handle when the lease was taken: read once from the token on the caller's thread, after `lease_for_stream` bound it and before the producer thread is spawned, and never written again. The live token cannot answer this afterwards: the producer thread detaches the handle as soon as `produce` returns, which on a short query can be before the caller's next line runs. **Instrument fact (the human, 2026-09-16, round 5 item 4): its only caller is the test suite**, `engine/tests/connection_reuse.rs`'s `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing`. Not behind `cfg(test)` or the `fixture` feature, because the property it proves — that a recycled connection's interrupt handle reaches the token — is the shipped pool's, and a fact compiled only into a test build would prove it about a build nobody runs. Never an SKP field.
- W3, the test's header comment, after its generation line:
  The token is cancelled **before the stream is opened**, so the bind happens on a cancelled token: `attach` interrupts an idle connection, which DuckDB does not latch, and the producer's flag check before prepare ends the stream. That makes the terminal `Cancelled` on every interleaving, and it is why the terminal alone says nothing about the interrupt handle. Two things are asserted:
    1. the *recycled* connection's interrupt handle was bound to this stream's token, read from the connection facts recorded at the lease, never from the live token: the producer detaches as soon as `produce` returns, which here can be before the next line runs. That is the regression this cut could introduce and the reason a first lease proves nothing — `cancel.rs` already pins what a bound handle then does to a running query.
    2. nothing is delivered, nothing is generated, and the terminal is `Cancelled`.
- W4, matches_nothing's doc, after its first paragraph:
  Zero batches is then structural twice over. The test that uses it cancels before it opens the stream, so the producer stops before it prepares; and even a scan that ran could flush nothing, because a batch is only flushed when the pending payload reaches the size target or when the scan ends with something pending, and a query that matches nothing can satisfy neither.
- W5, the structural comment:
  **Structural, not a race.** The producer stopped before it prepared, and the query matches no row, so no batch is generated on any interleaving.
- W6, the None arm's message:
  the stream ended with no terminal, although its token was cancelled before the stream was opened; a cancelled stream must end `Cancelled`

2.7 Seams.
- The diff crosses the engine-to-kernel seam by compilation only. The kernel's interface is the three named reads at kernel/src/lib.rs:662-669 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD, and no kernel file is edited.
- The test is the end-to-end proof from the real shape: the public `Dataset::stream_with_cancel`, then `BatchStream::connection_facts`.

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md, R1 to R6).
- There is no OS-dependent feature and no OS cfg, so R3 is not triggered.
- The failure was seen on ubuntu-24.04, and the test runs in CI on both platforms. No level is claimed, and nothing is ignored.

## §3. Fixtures

- The test writes its own fixture per run (`write("cancel-before-first", &big_spec())`). It is not pinned by hash.
- The 5 GB fixture is not used.

## §4. Tests and mutations

Every mutation and run is observed the same way: apply it, run `cargo test -p spatial-engine --test connection_reuse cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing -- --exact`, record the outcome by name with the commit it was observed at, and revert. A verify-mutation run is never called an observation (round 25, item 2 (c)).

- **Changed test:** `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing` (2.2). No other test in the file changes. No test is added.
- **M1:** delete lease_for_stream's attach statement (engine/src/dataset.rs:1942 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). Predicted: the test fails by name at the binding assertion, with its message. The terminal would still be `Cancelled`, which is why the fact is needed.
- **M2:** in the terminal's Err arm (2.2 (e)), replace `let _ = tx.send(Err(e));` with `let _ = e;`. Predicted: the test fails by name at the None arm, with W6.
- **M3, a predicted survivor:** delete the producer's check before prepare (engine/src/stream.rs:1777-1783 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). Predicted: the test passes, because the execute guard's step 2 returns Cancelled (engine/src/stream.rs:1823-1833 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD; engine/src/cancel.rs:181-201 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD). This bounds §1.
- **M1's known survivor:** a member hard-coded `true`. The gate checks at the constructor line that the value is read from the token.
- **R1, at B:** the scratch line `until("the producer to release its lease", || ds.connections().active_leases() == 0);` inserted directly after `let f = stream.connection_facts();`. Predicted: the test fails at the live-token assertion with its message, which is CI's failure reproduced.
- **R2, at H:** the same scratch line, inserted at the same place. Predicted: the test passes.
- **R3, at H, unforced:** the test run 20 times. Predicted: 20 of 20 pass. This is a count and supports no rate (§1).
- The scratch line is never committed or pushed, and each worktree is shown clean after the run.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: M1 and M2 each fail the test by name as §4 states.
- P-2: M3 survives.
- P-3: R1 fails at B as §4 states; R2 passes at H; R3 gives 20 of 20.
- P-4: the file's 12 tests pass unforced at H, and the workspace passes in CI on both platforms.

Declared unchanged:
- every product line except the member, its doc and its one write;
- every code line of engine/src/dataset.rs;
- engine/src/cancel.rs, engine/src/pool.rs and engine/src/trace.rs;
- every other test in engine/tests/connection_reuse.rs, byte for byte, along with big_spec and the first paragraph of matches_nothing's doc;
- every kernel file, docs/08 and every ADR.

Invalidators:
- M1 or M2 does not fail, or R2 fails: stop, return to the architect, and record class 2.
- R1 passes at B: class 2, no stop. R2 then discriminates nothing, and §1's R2 claim falls back to §2.2's reading.
- M3 fails: class 2, no stop, and the custodian records a proposed node for the guard.

Falsification: any unforced run at H that fails at the binding assertion or at the terminal. That would mean §2.2's reading is false.

## §6. Instruments

- Every quantity is an assertion: the member, the terminal and batches_generated.
- R1 to R3 are pass/fail outcomes, not measurements, and carry no docs/08 row.
- R logs are filed by the custodian as evidence, not Authority.

## §7. Declared values and ceilings

- At most 100 changed lines by §21c's rule, tests included, counted with `git diff --numstat B H -- engine/src/stream.rs engine/src/dataset.rs engine/tests/connection_reuse.rs engine/README.md`, where B = `git merge-base origin/main H`. The PR body names both.
  - engine/src/stream.rs: at most 20, outside `mod tests` only.
  - engine/src/dataset.rs: at most 14, comment lines only.
  - engine/tests/connection_reuse.rs: at most 60.
  - engine/README.md: at most 6.
- Non-generated files: 5. They are this form and the four files above. There is no PLAN or generated file on the branch.
- No constant is added. R3 has 20 runs.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Code before this form is committed on main with the custodian's hashes, or before the node's depends_on is met.
2. Any edit to the five-line form.
3. A product change beyond §2.1: attach, detach, lease_for_stream's code, produce, the guard, the pool, Drop, the terminal, or any kernel file.
4. The member written anywhere but the one constructor, or not read from the token.
5. A live `is_bound()` read left as the binding assertion; a sleep, retry or timeout added to a committed test; the scratch line committed, pushed or left applied.
6. Any other test changed. The test renamed, or its unchanged assertions or messages (2.2) edited.
7. The member gated on cfg(test) or `fixture`, or its doc missing any of W2's three declarations; the member on SKP or in a kernel record.
8. A comment claiming coverage for a cancel that overlaps the bind beyond W1.
9. A claim beyond §1.
10. A path:line cite in a code comment.
11. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer, both from dispatch (§21a; §25 (e)).** Verdicts follow state/directives/2026-10-05-product-first-direction.md, section 2. Each blocks only on Correctness or Evidence; Documentation findings are fixed in this PR before the merge.
- **Architect:** §2.2's argument and §2.5's readings against the cited sites; the caller-rule exemption against W2; W1 to W6 against the code; §8 item by item; §1.
- **Reviewer:**
  - the full diff;
  - every hash recomputed;
  - M1 to M3 and R1 to R3, each against its commit id;
  - the §7 count;
  - the owner's-index update against the diff.
- **Suites:**
  - `cargo test -p spatial-engine --test connection_reuse`;
  - `cargo test -p spatial-engine --lib`;
  - `cargo test -p spatial-kernel --test query_window_attribution`;
  - `cargo fmt --all --check`;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md), in shared holds.
- **Merge:** a merge commit, never a squash.
- **Operator:** none.
- **KNOWN-LIMITATIONS:** no item is owed.
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md, §1 item 2). lead-data writes it and the worker applies it. It replaces two lines: the last-verified line (engine/README.md:530 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD) and the preregistrations list (engine/README.md:550 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:HASH-TBD), which gains this form.
- **Overlap (rule 00).** This piece touches the four engine files and this form, and nothing under protocol/ or kernel/. The following touch no engine/ path:
  - PR #227 (frontends/shell/e2e/exportElapsed.mjs and its test, e2e/publish.mjs, e2e/selection.mjs, frontends/shell/package.json, the CI comment, and later e2e/README.md's publish and selection entries);
  - known-limitations-item-41-source-comment (one line of KNOWN-LIMITATIONS.md);
  - governance-cut-state-cap-and-rotation (state/CUT-STATE.md, scripts/hooks/flush.mjs, the reading order, state/cut-archive/, an AUTONOMY.md append);
  - shell-migration-milestone-3 (e2e/command-bar.mjs, e2e/README.md);
  - source-changed-post-reopen-routes-watcher-visible and source-changed-post-route-s5d-race, ahead in slot 2.
  At dispatch, the custodian checks that no piece in progress and no PR awaiting merge touches the four files. PLAN.yaml stays the custodian's, on main.

## §10. Amendments

(opens empty; append-only)
````

## 3. Clause check

All cites are read at 28163cb6. Short paths are written without their root.

**§1 and §2.1, the member and its write**
- Bound before the return and before the spawn: `stream.rs:1221` calls `lease_for_stream`, which calls `attach` at `dataset.rs:1942` (`cancel.rs:249` stores the handle). The spawn is at `stream.rs:1251-1253` and `Ok(BatchStream {` at `:1398`.
- Written once and never again: the literal is at `stream.rs:1222-1226`, and `cancel` is still owned there (it is moved at `:1400`). The field is private (`:758`), set only at `:1406` and returned by copy (`:880-882`). A grep for `ConnectionFacts|connection_facts()` across the repo's `*.rs`, `*.mjs`, `*.ts`, `*.tsx` and `*.toml` finds one struct literal (`stream.rs:1222`), three named reads in the kernel (`lib.rs:667-669`), one at `query_window_attribution.rs:218`, the engine tests, and no frontends hit.
- Nothing empties the slot first: the detach calls are at `stream.rs:1273` (inside the not-yet-spawned closure) and `:1394` (the spawn's `map_err`, which returns Err).
- Derives: `stream.rs:631`.
- Cost: `trace.rs:485-491` names "interrupt-token attach, and `ConnectionFacts` construction" inside SPAN_LEASE_BIND, "Reported, never scored". The new read is at `:1222-1226`, before the `LEASE_ACQUIRED` mark at `:1234`.
- Precedent: `stream.rs:641-646`.

**§2.2, the terminal**
- (a) `cancel_inner` stores the flag at `cancel.rs:121`, then locks at `:125-129`. The test calls it before `stream_with_cancel`, on the same thread.
- (b) `stream.rs:1166-1219` contains no `is_cancelled` read. `pool.rs:361-429` takes no token. The generation rule is `pool.rs:418-421` and `:548-550`.
- (c) `cancel.rs:239` refuses only if the slot is occupied. `:246-247` interrupts if the flag is set, and `:249` stores. Not latched: `cancel.rs:45-54` and `:217-219`.
- (d) Spawn, then `produce`'s first check, at `stream.rs:1780-1783`.
- (e) `Err(_) => drop(lease)` is at `:1294`. `Lease::drop` discards at `pool.rs:589-596`. The post-check runs at `:1330-1340`, and `Err(e) => tx.send(Err(e))` at `:1359-1361` sends whatever the post-check found (rule (ii) at `:1313-1318`).
- (f) `next_into` uses `recv` at `:786`. The terminal is sent after `produce` returns, so `batches_generated` is final.
- Generation 3, reused, unaffected by the cancel: nothing in acquire reads the token.

**§2.3, W1**
- "bound before `stream_with_cancel` returns and before the producer starts": `stream.rs:1221` comes before `:1251` and `:1398`.
- "A cancel that completed before the bind cannot interrupt this stream's connection, which is not yet bound": `cancel_inner` interrupts only whatever is in the slot (`cancel.rs:125-133`). This stream's handle enters the slot only at `:249`. A completed cancel has also finished its lock section, so `attach`'s lock (`:234-238`) comes after it and the flag store is visible at `:246`.
- "`attach` sees its flag and interrupts the idle connection, which DuckDB does not latch": `cancel.rs:246-247` and `:217-219`, pinned by `an_interrupt_on_an_idle_connection_is_not_latched` at `cancel.rs:500`.
- "the producer's flag check before prepare … ends it `Cancelled` before any statement runs": `stream.rs:1780-1783` comes before prepare at `:1785`. The terminal goes out at `:1360`, and since `Err` drops the lease, no `verify` runs (`:1294`).
- "A cancel whose call overlaps the bind is either seen by `attach` in the same way or reaches the bound handle": if the store at `:121` is visible at `:246`, `attach` interrupts. If not, the canceller's lock at `:125` cannot precede `attach`'s lock section (it would make the store visible), so it follows `:250` and finds the handle. That is the diagnosis's W3 and W4.

**W2**
- Read once, after the bind, before the spawn, never written again: as in §2.1 above.
- "detaches the handle as soon as `produce` returns": `stream.rs:1254-1268` is `produce`; `:1273` is `detach`.
- "can be before the caller's next line runs": nothing orders the two (the diagnosis's Q3, re-read at `stream.rs:1254-1273` against the test at `:170-183`).
- "Never an SKP field": the type's doc at `stream.rs:626-630`.
- Exemption: the state is the token's slot, maintained by the shipped build (`cancel.rs:54`).

**W3**
- "`attach` interrupts an idle connection, which DuckDB does not latch": as in W1.
- "the producer's flag check before prepare ends the stream": in the shipped code it is the first flag read in `produce` (`stream.rs:1780`), and the flag is set before the spawn.
- "terminal `Cancelled` on every interleaving": §2.2 (a) to (f).
- "the terminal alone says nothing about the interrupt handle": with M1 the terminal is still `Cancelled`, because (d) does not depend on the slot.
- "the producer detaches as soon as `produce` returns": `:1273`.

**W4**
- "The test that uses it": matches_nothing's only caller is `connection_reuse.rs:171`, by grep.
- "the producer stops before it prepares": `stream.rs:1780` comes before `:1785`.
- The flush conditions keep the existing text. The call sites are at `stream.rs:2014-2017` (`!pending.ids.is_empty()` and over target), `:2056-2066` (`cut_reason`), `:2098-2102` (`!pending.ids.is_empty()`) and `:2120-2122` (`!pending.ids.is_empty()`).

**W5**: no batch is generated, because `produce` returns at `:1782` before any `flush`, and `flush` is the only place that increments `batches_generated` (the flush form's 0.2; `stream.rs:2457`).

**W6**: `None` is returned only when `tx` drops without a send (`stream.rs:792-795`). The sentence states only that observation and the requirement, so it is true under M2 as well.

**§2.5**
- `:231` and `:380` both follow `stream_with_cancel(&ViewportQuery::all(), …)` on `big_spec`, with nothing consumed before them.
- Channel bound: `stream.rs:85`, `MAX_QUEUED_BATCHES = 2`.
- Batch sizes: `MAX_BATCH_BYTES` is at `:49`. The estimate is `wkb.len() / 16` vertices (`:2008`), and `big_spec` is 40,000 features at 64 vertices on average (`connection_reuse.rs:56-62`). That is far more than three batches at the 1 MiB target (`:51`).
- This row is labelled a reading and not run.
- `:302-305` and `:389-392` follow `until(active_leases()==0)`. `discard` and `return_healthy` decrement under the state lock (`pool.rs:447` and `:464`), and `active_leases` locks the same mutex (`:495`).

**§4**
- M3 survivor: if `:1780-1783` is deleted, `prepare` at `:1785` runs; DuckDB clears its interrupt at prepare (`cancel.rs:12-17`). If prepare succeeds, the guard's step 2 at `cancel.rs:185-186` returns `Cancelled` and `stream.rs:1830-1832` returns `Err(Cancelled)`. If prepare fails, it goes through `classify(cancel, …)`, which the flush form's §2.3 records as returning `Cancelled` under a set flag; I did not re-read `classify` (my read of `produce` stopped at `stream.rs:1909`). Either way the terminal is `Cancelled`.
- M2: the replacement keeps `e` used, so no unused-variable warning arises.
- R1 at B: the old test cancels after the read. A matches-nothing query returns `Ok`, `release_healthy` leads to `return_healthy`, which decrements under the lock (`pool.rs:447`) after detach (`:1273`), so line 179 reads unbound.

## 4. OPEN items

None. Every point here was settled by the human's three 2026-10-17 messages (item 3, item 3, item 1).
- The new file path and the PLAN `gate` field are the custodian's, under §25 (e).
- None of W1 to W6 is the human's wording; the worker applies them under item 2 of the 2026-10-11 direction.

## 5. Files read

- C:\dev\spatial-ide\engine\CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md (all)
- C:\dev\spatial-ide\state\consults\2026-10-17-connection-reuse-recycled-interrupt-flake-architect-draft.md (all)
- C:\dev\spatial-ide\state\consults\2026-10-17-connection-reuse-recycled-interrupt-flake-diagnosis-lead-data.md (all)
- C:\dev\spatial-ide\state\directives\2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md (all)
- C:\dev\spatial-ide\state\directives\2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md (all)
- C:\dev\spatial-ide\state\directives\2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md (all)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (all)
- C:\dev\spatial-ide\engine\STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md (all; the full-form shape)
- C:\dev\spatial-ide\engine\CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md (60-79)
- C:\dev\spatial-ide\engine\tests\connection_reuse.rs (all)
- C:\dev\spatial-ide\engine\src\stream.rs (40-89, 600-929, 1140-1414, 1750-1909, 2008-2027, 2094-2135, 3005-3054; searches)
- C:\dev\spatial-ide\engine\src\dataset.rs (1900-1945)
- C:\dev\spatial-ide\engine\src\cancel.rs (1-300)
- C:\dev\spatial-ide\engine\src\pool.rs (355-604)
- C:\dev\spatial-ide\engine\src\trace.rs (478-497)
- C:\dev\spatial-ide\engine\README.md (520-561)
- C:\dev\spatial-ide\kernel\src\lib.rs (236-251, 650-679)
- C:\dev\spatial-ide\PLAN.yaml (5330-5419)
- C:\dev\spatial-ide\AUTONOMY.md (213-216, 306-380, 476-483)
- C:\dev\spatial-ide\.git\HEAD, C:\dev\spatial-ide\.git\refs\heads\main
- Repo-wide searches: `ConnectionFacts|connection_facts()|matches_nothing|interrupt_bound`, `is_bound()`, the test's name and `connection_reuse.rs` outside state/, the "no window" sentence, the existence of `the_pre_prepare_cancel_exit_stamps_producer_cancelled` and `an_interrupt_on_an_idle_connection_is_not_latched`, and `flush(` call sites.
