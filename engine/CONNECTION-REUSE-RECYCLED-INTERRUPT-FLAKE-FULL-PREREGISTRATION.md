# connection_reuse.rs: the token cancelled before the stream opens, and the recycled connection's binding asserted from the fact recorded at the lease — full form (PLAN node connection-reuse-recycled-interrupt-flake)

File: engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md
Authority:
- the human's third message of 2026-10-17, item 3 (OPEN-2 (B), OPEN-1 (B), the order): state/directives/2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md:12 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:f89db2b40c6d990ea3582cbde0f34f80187407466a01b5044e3db99813416066
- the second message's item 3 (the grade and the fix's shape): state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:14 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:29113088ac346bb3a19afad912218c63d71ebde6fda6fc8635df7e7c760f6b7c
- the first message's item 1 (the diagnosis first): state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:9 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ccacd20fcba1fa6145aaade1faa4a88b53a426de4ff4015c0cf5a566093e3f3f
- each of the three messages has its RULED block in DECISIONS-PENDING.md
- the five-line form's Amendment 1: engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md:53-62 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:be5c8ab880fd2551badfbdd063b9cf0f916d6adcdaeb988ff91d5f0f7d1dbf54
- the node: PLAN.yaml:5377-5393 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ada125caa2a55bfd73ad50f57e4c3f5e9656ddd8a726104c80d0998bd1c9fd6f
Drafted by: the architect agent on the custodian's brief. Inputs: the five-line form's content, as its Amendment 1, item 2 orders; that form's draft, state/consults/2026-10-17-connection-reuse-recycled-interrupt-flake-architect-draft.md; and lead-data's diagnosis, state/consults/2026-10-17-connection-reuse-recycled-interrupt-flake-diagnosis-lead-data.md. The diagnosis is evidence: a read at main e555177c, cited for what it reported. Every fact used from it was re-checked at 28163cb6f30fd60681903ed1227cdf17c06abc0f.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full. §21a applies: a property under test and a comment stating a cancellation property (§0.5).
Pins: every pin is a historical pin at 28163cb6f30fd60681903ed1227cdf17c06abc0f. For the code the piece edits, its base tree is authoritative; for what this form read, the pin is. If a pinned line has moved by the base, the worker re-derives the site by symbol.
Why a new file: AUTONOMY.md §25 (e), last sentence. The five-line form stays as committed. Nothing is built under it (its Amendment 1, item 2), and its §2 predictions bind nothing.

## §0. Disclosure

0.1 What was seen. In PR #222's pull_request run 38910535607 at a542097e (ubuntu-24.04), this test failed at its live-token assertion, engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2703317eff233971efc77daeff384a9ba08cb0dcc394ec6b55006728d7886289. The push run of the same commit passed. The failed steps are filed byte-identical at state/consults/2026-10-16-pr222-ci-run-38910535607-attempt-1-failed-steps.txt: evidence, not Authority.

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
  - that this test exercises an interrupt reaching a query. Its terminal comes from a flag check, and the interrupt `attach` raises on the idle connection is not latched (engine/src/cancel.rs:45-54 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5e68a8c719fa09abc62317e38f6f43b32f57dd43e1d8d2f80a3e22a5efbaf552). A cancel after the bind on a recycled connection stays the business of `midstream_cancellation_still_stops_the_producer_on_a_recycled_connection` (engine/tests/connection_reuse.rs:209-261 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:b504aef3499e28823cbbd606ff899b3fbb7597cad46251d0a4efd560759e8c1a);
  - which producer check stops this stream (M3). The pre-prepare exit is pinned by `the_pre_prepare_cancel_exit_stamps_producer_cancelled` (engine/src/stream.rs:3016-3021 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:88f4679a7e2a7676a8edb412cf2dad5a8892b756076f336bd9c190e54d3d5cfe);
  - anything about a cancel whose call overlaps the bind, beyond §2.3's sentence;
  - that the file's other live `is_bound()` reads are race-free (§2.5 is a reading, not a run);
  - any rate, from R3 or otherwise; any duration or latency; any docs/08 row.
- No ADR is amended. There is no wire, SKP, MCP or data-plane change, no string the app shows, and no dependency. The one new pub item is §2.1's member, an instrument fact.

## §2. The change

2.1 engine/src/stream.rs: one member of `ConnectionFacts` (engine/src/stream.rs:624-639 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ed5bee989890df0301b085f9da07d389d24776e1ddec73e9df4f19706c4315b8).
- `pub interrupt_bound_at_lease: bool`, with §2.6's W2 as its doc.
- Its one write is `interrupt_bound_at_lease: cancel.is_bound(),` in the one constructor (engine/src/stream.rs:1221-1226 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:583c18fbd2cf7c6e7ca4041dae25c36f12181200a56422576e9b783238bf23b4). That is after `lease_for_stream` has bound the handle and before the spawn (engine/src/stream.rs:1251-1253 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:78a900b960d5241a30665d0c639050012023099f1825b481aeb518043d93bb2a).
- Never written again:
  - the struct is held in a private field (engine/src/stream.rs:758 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:944af7123b679e5de5ce49128b71828de6bd77b57ddf15928fe4fdb1488890d7);
  - that field is set only in the return literal (engine/src/stream.rs:1398-1407 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:b623d1f59fbd2160c809f3237df8473c2226ed7752a2073213acad87fd9b193b);
  - it is returned by copy (engine/src/stream.rs:880-882 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:70460f1ca70911317351e513a2b8f76e7242a06bb3314f6f51c5cfd4c515a00f).
- Before the write, nothing can empty the slot:
  - the producer's detach runs after `produce` returns (engine/src/stream.rs:1269-1273 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:771bff804ca0abcb0f3ed27f83f691d8422c631994589f655c8053ba046fc032), and the producer is not yet spawned;
  - the other stream-path detach is in the spawn-failure arm, which returns Err (engine/src/stream.rs:1387-1396 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:cdea7a3c053f2aacb6554f8c0ded8bb8c6e192ab7b3c332a829849feccf0b5fd).
- The source of the value: attach stores the handle under the slot lock (engine/src/cancel.rs:233-251 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:c32497ad2ba56085669f41f2c872b71701842143cdce2b619cd714a9379e4bc0), and is_bound reads that slot under the same lock (engine/src/cancel.rs:271-277 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:504fc1df2850f9a66e0e4b4b0f576c40a5663fb738d9c6d74b55f9e27a0265b9).
- Readers, all of named members:
  - kernel/src/lib.rs:662-669 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:46810b5b2ba29a7cc3957809ca44ef30e9c2538a55c225d48d4a34eadea47d12 reads three;
  - kernel/tests/query_window_attribution.rs:218 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5984397ec7ea1029911fac5097bc6e9979cdb263d7cd6e8af1f8ef75a5079809 reads one;
  - the engine tests read one at a time;
  - no struct literal exists outside the constructor, and nothing under frontends/ reads the type.
  - The derives (Clone, Copy, Debug, PartialEq, Eq) take a bool unchanged.
- Caller rule: the member has no product caller. It rests on the instrument-accessor exemption (round 5, item 4), and W2 makes its three declarations. Its place is the one the human's second message, item 3, names first.
- Why not cfg(test), and why not the `fixture` feature:
  - an integration test links the library without cfg(test);
  - behind `fixture`, the recording would be absent from the shipped build, while the property is the shipped pool's;
  - the precedent is engine/src/stream.rs:641-646 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:05826afc6c4b89bdd37e6c9f25369df5e0eff25fcff0f77d0f91a6f99741cfad.
- Cost: one uncontended slot-lock read per stream, on the caller's thread, inside SPAN_LEASE_BIND, which is reported and never scored (engine/src/trace.rs:485-491 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:22b7e569d7b9152c7a41b84e24990fac54067364e00fe75172c1a44f9a402a07). No figure is claimed.

2.2 engine/tests/connection_reuse.rs: the test `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing`. Its name is unchanged.
- The edits:
  - `cancel.cancel();` moves to directly after `let cancel = CancelToken::new();`, before `stream_with_cancel` (engine/tests/connection_reuse.rs:169-172 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5aa8036ff8de54bda8d7aa972cc18bc7d437cc4a4e02500d2a3f37a12524dc8c). The old call (engine/tests/connection_reuse.rs:185 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2fc1073f69499eff9f2799403883afb872b8dada4d0011bcf0eb0baa72725cde) is deleted;
  - the binding assertion asserts `f.interrupt_bound_at_lease` instead of `cancel.is_bound()`, with its message unchanged (engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2703317eff233971efc77daeff384a9ba08cb0dcc394ec6b55006728d7886289).
- Unchanged:
  - the generation and reuse assertions (engine/tests/connection_reuse.rs:174-178 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:8443ab2742d04abc95ec4ca4604f6b0d0e29a2970b27a6c9d0d1b450327e006a);
  - the nothing-generated assertion and its message (engine/tests/connection_reuse.rs:191-195 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:88aaf530307e5a6d4e8656d8d9ec418b866c3f7bc119e675f1c758b0250246f8);
  - the `Cancelled` arm and the `other` arm.
- The None arm's message is replaced (W6).
- Why the terminal is `Cancelled` on every interleaving:
  - (a) The flag store (engine/src/cancel.rs:120-133 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:21b38380fe35b22ea91e8218d270ac0d95b64e0a8e55e56fcab66f4a4620963b) runs on the test thread before `stream_with_cancel` is called. In program order it therefore precedes the bind and the spawn.
  - (b) Nothing before the lease reads the flag (engine/src/stream.rs:1166-1219 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:37912294529d2c0c006a02517ca98f90f794d9ea592d34068cfffd69fa96c63e), and neither does the pool's acquire (engine/src/pool.rs:361-429 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:34b7ffedf44369068654e9cfa4e53f2e27c84d59afb74e3370fc5c1e7dd09102). So `stream_with_cancel` returns Ok on generation 3, reused, as before.
  - (c) attach finds the flag set, interrupts the idle connection and stores the handle (engine/src/cancel.rs:246-249 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:273bc88383a0318c437201bf6ea4fc59a6d5b57fd9cfde4984cf1ef8177e4bc3). So the member reads true.
  - (d) The spawn orders the flag store before the producer's first check, which returns Cancelled before prepare (engine/src/stream.rs:1777-1783 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:07986fb1bd6d713bd2307d6d4a488cce0a39f452b5dd1fb2778503063ed18e31).
  - (e) The lease is dropped, which discards the connection (engine/src/stream.rs:1292-1295 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:49158d66ff8f60d0a6c782b0c230a99b42b939e50b09a1660f7a8f61073297cb; engine/src/pool.rs:589-596 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:6180d00fe7c7cfbeb9646f52f645b09b09d1eff1bbf9dd2048e8f7edcb0900cb). The post-check runs, and the Err arm sends the Cancelled terminal whatever the post-check found (engine/src/stream.rs:1343-1362 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0803864cedb25986f62f2dd72ef56b690b305a27c265307b40bc0a4809d7ec2e).
  - (f) next_into blocks on recv until that item arrives (engine/src/stream.rs:782-797 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7ae7b06c51312fe223d1ce00c7e4e090ea784c54472e5f31b783bf635a8cbf47). batches_generated is read after the terminal, which the producer sends only after `produce` has returned without a flush, so it reads 0.
- What the test exercises now: a cancel before the bind, the window the comment in §2.3 misstated. It no longer exercises a cancel after the bind. In the passing interleaving at main, that cancel was stopped by a flag check or an interrupt, and the test could not tell which.
- What still proves the binding: the fact recorded at the lease (2.1). M1 shows that the terminal alone cannot prove it.

2.3 engine/src/dataset.rs: `lease_for_stream`'s doc comment only (engine/src/dataset.rs:1928-1936 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ec34251e224ac4e815fd55387350b9278e4406cfb3b69746e23e0f235182939e). No code line changes.
- The clause after the bolded first phrase, which claims there is no window before anything is interruptible, is replaced by W1. The rest of the doc stays.
- W1 agrees with the token's own field doc (engine/src/cancel.rs:45-54 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5e68a8c719fa09abc62317e38f6f43b32f57dd43e1d8d2f80a3e22a5efbaf552).

2.4 engine/tests/connection_reuse.rs, the comments:
- the test's header comment (engine/tests/connection_reuse.rs:153-158 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:533fbc62bb14a118dde4c3cba380ec6880b31e01a2311f955c42119398ff580f) becomes W3;
- matches_nothing's doc after its first paragraph (engine/tests/connection_reuse.rs:85-90 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ccefc23005e41c3074b0eb0ac4ecb4ebc488f900af4b39e679ffeb321e899908) becomes W4. Its only user is this test;
- the structural comment (engine/tests/connection_reuse.rs:189-190 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:9ee0f73cafa2f582171d42871301776060f029b3a626e6fe67d7e0978dbd76d4) becomes W5;
- the None arm's message (engine/tests/connection_reuse.rs:198-201 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:c13e8e777b6ba6e21c39eca98963e54f7531708582e70fe92bae392dacddebe2) becomes W6.

2.5 Sibling search (AUTONOMY.md §14). The defect class is a live `is_bound()` read after the stream returns, with nothing ordering it against the producer's detach.

| Site | Class | Scope | Reason |
|---|---|---|---|
| engine/tests/connection_reuse.rs:179-183 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2703317eff233971efc77daeff384a9ba08cb0dcc394ec6b55006728d7886289 | in | in (2.2) | the node |
| engine/tests/connection_reuse.rs:231 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e4aafce09b6c965c61598b3f26fdce67f8234b5406eebfb4f155642b005c762d | the same shape | out | The architect's reading, not run. On ViewportQuery::all over big_spec (engine/tests/connection_reuse.rs:56-62 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:f05509ef895e18470453e1e82a0f70ac26aa62f087ed3042e3e98c678ef777e1), the producer must send more batches than the channel holds (engine/src/stream.rs:85 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f), with no batch above engine/src/stream.rs:49 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2bb8e5d47fed5a98d308688cbe6222878c71ce6ba1deddf5c7cc681deca67949. The test consumes nothing before the read, so the producer is held at a send and cannot reach detach. |
| engine/tests/connection_reuse.rs:380 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e4aafce09b6c965c61598b3f26fdce67f8234b5406eebfb4f155642b005c762d | the same shape | out | as the row above |
| engine/tests/connection_reuse.rs:302-305 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e784dc5e0d0d7957f8af42ff5d1c99435cba104e069b7153fedc17f9bfb84418 and engine/tests/connection_reuse.rs:389-392 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4132d47a96d9fea5a30865ce01ea24ed5863098f397e0160bdbf958f27aae651 | not in | out | Each follows a wait for active_leases() == 0. detach precedes the lease's release in the producer's program order (2.2 (e)), and active_leases reads the count under the state lock that the release writes under (engine/src/pool.rs:444-447 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:15d0e745eb27b3b30e9b2ce5a4fdc9f0718ca7ac6a5bd80e8ddf39e23f65b196; engine/src/pool.rs:462-466 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:da851809aa78a06c9ff800a32737636e4fcd38ccac4f31271560263c476be429; engine/src/pool.rs:494-497 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:141c81fcaccf6b017df6eb55a7279ef28bd1c9d593a1a577b6bd8c7349a39403). |
| kernel/tests/publish_cancellation.rs:513-523 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:28e30e08b9dbdf48175353f08b96aae76e5747b187f57bd69199fb1d4a61870c | not in | out | a bounded wait for unbound, then the read |

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
- The diff crosses the engine-to-kernel seam by compilation only. The kernel's interface is the three named reads at kernel/src/lib.rs:662-669 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:46810b5b2ba29a7cc3957809ca44ef30e9c2538a55c225d48d4a34eadea47d12, and no kernel file is edited.
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
- **M1:** delete lease_for_stream's attach statement (engine/src/dataset.rs:1942 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4426423c1c9e6d626b9773aebdd865e1d283a11a678ce7c257b3acf562321664). Predicted: the test fails by name at the binding assertion, with its message. The terminal would still be `Cancelled`, which is why the fact is needed.
- **M2:** in the terminal's Err arm (2.2 (e)), replace `let _ = tx.send(Err(e));` with `let _ = e;`. Predicted: the test fails by name at the None arm, with W6.
- **M3, a predicted survivor:** delete the producer's check before prepare (engine/src/stream.rs:1777-1783 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:07986fb1bd6d713bd2307d6d4a488cce0a39f452b5dd1fb2778503063ed18e31). Predicted: the test passes, because the execute guard's step 2 returns Cancelled (engine/src/stream.rs:1823-1833 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:060ff033fec1094f643de86110d499a28d0d88b5b3d0e4fa154206d1cd1a6216; engine/src/cancel.rs:181-201 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:6edcd5b3f72f723fffd0087c167ee4a7c69c456607f3b447dcb7a7f40c6eed0e). This bounds §1.
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
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md, §1 item 2). lead-data writes it and the worker applies it. It replaces two lines: the last-verified line (engine/README.md:530 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:1b637c30bc755c3356b64ece9132040c5e25d3040d68883e0a2f730fcbbb6b57) and the preregistrations list (engine/README.md:550 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:22e854cf5597af957fe85034205b546e54173424fd4f3dd23e4ccdd7a0b681a8), which gains this form.
- **Overlap (rule 00).** This piece touches the four engine files and this form, and nothing under protocol/ or kernel/. The following touch no engine/ path:
  - PR #227 (frontends/shell/e2e/exportElapsed.mjs and its test, e2e/publish.mjs, e2e/selection.mjs, frontends/shell/package.json, the CI comment, and later e2e/README.md's publish and selection entries);
  - known-limitations-item-41-source-comment (one line of KNOWN-LIMITATIONS.md);
  - governance-cut-state-cap-and-rotation (state/CUT-STATE.md, scripts/hooks/flush.mjs, the reading order, state/cut-archive/, an AUTONOMY.md append);
  - shell-migration-milestone-3 (e2e/command-bar.mjs, e2e/README.md);
  - source-changed-post-reopen-routes-watcher-visible and source-changed-post-route-s5d-race, ahead in slot 2.
  At dispatch, the custodian checks that no piece in progress and no PR awaiting merge touches the four files. PLAN.yaml stays the custodian's, on main.

## §10. Amendments

(opens empty; append-only)

### Amendment 1 — built: M1 to M3 and R1 to R3 observed; §7's figures; where the record sits; R2 and R3 at the code commit (classes 1 and 2); written after the results were seen

*Written by the custodian after the worker's report was seen. References only: `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-worker-report.md`.*

1. **Built** on `cut/connection-reuse-recycled-interrupt-flake` from b2df233db725d947c02c001b7d3f0f2db3d9bde6: the code and test commit 03345bfa4224170aef340025300a45d78693722e, and the record commit 32c3e807f3f6e36184cb8071c7d4399127ff7f1c (comment lines only). No commit touches `engine/README.md`; its two owner's-index lines are lead-data's, as §9 says.
2. **Observed** (the report), each with this file's one test run alone by name: M1 and M2 at 03345bfa4224170aef340025300a45d78693722e fail it at the binding assertion and at the None arm, with their messages (P-1); M3 at 03345bfa4224170aef340025300a45d78693722e passes (P-2); R1 at b2df233db725d947c02c001b7d3f0f2db3d9bde6 fails it at the live-token assertion, with its message; R2 at 03345bfa4224170aef340025300a45d78693722e passes; R3 at 03345bfa4224170aef340025300a45d78693722e gives 20 of 20 (P-3). No invalidator in §5 is met.
3. **R2 and R3 at the code commit (class 1).** §4 places them at H. They were observed at 03345bfa4224170aef340025300a45d78693722e, before the record commit that names them; 32c3e807f3f6e36184cb8071c7d4399127ff7f1c adds 15 comment lines to that commit and no other line.
4. **§7's figures** at 32c3e807f3f6e36184cb8071c7d4399127ff7f1c against B = b2df233db725d947c02c001b7d3f0f2db3d9bde6: engine/src/stream.rs 14, engine/src/dataset.rs 12, engine/tests/connection_reuse.rs 51, engine/README.md 0; 77 in all, of 100. No ceiling is passed.
5. **Where the record sits (class 1).** The form names no place. The record is in the changed test's header comment, as earlier recorded mutations are in this module's test files.
6. **Next:** lead-data's owner's-index update (§9), applied by a worker; then the PR and both gates.
7. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — the owner's-index update applied; PR #238 (class 1)

*Written by the custodian. References only: `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-owners-index-update.md` and `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-owners-index-apply-worker-report.md`.*

1. **The owner's-index update** (§9) is lead-data's file above, filed unedited at ead5b66a. Commit ead5b66a's message carries one correction from lead-data's hand-back: the section's 47 test pointers split 44 under engine/ and 3 under kernel/tests/. A worker applied its two lines at 866b35791cd037159eb0619e80eb1bec8b4851ff, `engine/README.md` 2 added and 2 deleted.
2. **§7 at the head 866b35791cd037159eb0619e80eb1bec8b4851ff:** engine/README.md 4 (ceiling 6), and 81 changed lines in all, of 100.
3. **PR #238** is open from `cut/connection-reuse-recycled-interrupt-flake` at 866b35791cd037159eb0619e80eb1bec8b4851ff. Gate 1, the architect and the reviewer, is dispatched at that head.

Nothing above is edited.

### Amendment 3 — Amendment 1's class label (class 1); written after gate 1's findings were seen

*Written by the custodian on gate 1's architect report. References only.*

1. Amendment 1's heading names classes 1 and 2, and no item in it is class 2: items 3 and 5 are class 1, and item 2 records every outcome as §5 predicts. The heading's class reference reads class 1 alone. Proof: Amendment 1, items 2, 3 and 5.

Nothing above is edited.

### Amendment 4 — gate 1 complete; the word round (class 1)

*Written by the custodian. References only: `state/consults/gates/2026-10-21-connection-reuse-recycled-interrupt-flake-gate1-architect.md` (gate-log 566), `state/consults/gates/2026-10-21-connection-reuse-recycled-interrupt-flake-gate1-reviewer.md` (gate-log 569) and `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-gate1-words-worker-report.md`.*

1. **Gate 1:** both gates PASS WITH NOTES, with no Correctness or Evidence finding. The reviewer made M1 to M3, R1, R2 and R3 again against their commits, R3 at the head, 20 of 20.
2. **The word round, no re-gate** (AUTONOMY §31 (d)): the architect's class label is Amendment 3; the reviewer's words for `matches_nothing`'s doc are applied at 06f145de9c77ab9e8e49b4ee706533c8e01345d0, comment lines only; the PR body lists W1 to W6 in the reviewer's words and asks for a merge commit (§2.6, §9).
3. **§7 at 06f145de9c77ab9e8e49b4ee706533c8e01345d0:** 81 changed lines of 100, `engine/tests/connection_reuse.rs` 51 of 60.

Nothing above is edited.
