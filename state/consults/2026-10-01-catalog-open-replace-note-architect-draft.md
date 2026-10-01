# Consult — the architect's draft for catalog-open-replace-drop-latency-note (2026-10-01)

*Custodian's filing note: the architect agent's final report, delivered as a hand-back message on 2026-10-01 (enqueued 05:10:38Z), on the custodian's brief (a drafting consult, not a gate), read at main f815eb5. Recorded verbatim below the rule, from the message, with the harness's report indentation removed, except for one elision marked in parentheses: the fenced DRAFT, committed as `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md` with the edits its header lists. The fix delta after the draft is kept, for invalidator I3. The custodian's checks before commit, at f815eb5: `Catalog::open` and `open_cancellable` insert under `lock_write` in one statement, after their `?`; `Catalog::remove`'s doc claims a live stream's `Arc<Dataset>` keeps the dataset alive; the `Lease` holds an `Arc<ConnectionPool>` and its Drop is as cited; the stream clones plain values at the cited lines; `connection_reuse.rs` has both cited tests; `Dataset::connections` and `Catalog::names` exist. The custodian's holder grep (`Arc<Dataset>` over `engine/src`, `kernel/src`, `protocol` and `frontends/shell/src-tauri/src`) finds no stream-held clone (`TicketState` holds the dataset by name), and also finds the same false claim in `protocol/skp/SKP-V0.md`'s `close_dataset` paragraph: added to the form's intake and routed. The note-or-fix choice goes to question round 33 as item G (`state/drafts/round-33-node5-fix-choice.md`). Its `@ f815eb5` cites are read at f815eb5.*

---

main @ f815eb5. Drafting consult, not a gate. **Verdict: draft ready, pass with notes. One choice goes to the human.**

## Decisions

1. **The ruling decides the note but not the fix.** The ruling is question round 25, item 1 (RULED 2026-09-26), with sub-item (d)'s Outcome line in DECISIONS-PENDING.md, cited by round and item. It attaches #116's fix shape to the S1 branch only. The S2 branch gets a latency note, filed like the rest. It neither orders nor forbids a fix.
   - The PLAN summary's "If taken, the fix is #116's shape" is the custodian's applied text, not the human's words.
   - `state/questions/round-25.md:7` @ f815eb5 sha256:<custodian> framed all six items as small-defect nodes ("none is a cut"). The other nodes do fix their defects, so "filed like the rest" can also be read as asking for the fix.
   - **So the choice goes to the human, at round 33.**
   - **My recommendation is note only.** No deterministic test can show where the drop happens without a timing assertion or a test-only hook (item 5 below). A fix would therefore land with no P0 that fails at the base. The draft is note-only, and the fix is its invalidator I3. The fix's delta is given after the draft.
   - Dispatching note-only before round 33 is safe. If the human rules the fix in, everything in this piece survives except the note's one sentence about where the drop happens.
2. **Part (1) still holds at f815eb5, and no product path reaches it except a handle collision.**
   - The shape is unchanged: `kernel/src/lib.rs:168` @ f815eb5 sha256:<custodian> and `kernel/src/lib.rs:190` @ f815eb5 sha256:<custodian>.
   - Dataset's field graph has no new `Drop` impl. The `Drop` impls in engine/kernel src are WindowOpen, PendingRead, SourceWatch, Lease, TraceGuard, BatchStream, OpenGuard, EngineSource and Staging, plus test types. None of them is reached from `Dataset`'s fields.
   - The callers are `kernel/src/main.rs:105` (opens once) and `kernel/src/skp.rs:1099`. The second names each entry by a fresh 128-bit random handle (`kernel/src/skp.rs:1038`, `protocol/skp/src/v0/handles.rs:17-21`). A collision is very improbable but nothing structurally excludes it.
   - If the fix is taken, its shape is `let replaced = self.lock_write().insert(..); drop(replaced);`. This mirrors `kernel/src/skp.rs:1451-1452` @ f815eb5 sha256:<custodian>.
   - **The claim's scope is narrow.**
     - It covers only the Ok path. The `?` at `:167` and `:189` returns before the guard is taken.
     - The teardown runs under the guard only when the catalog's Arc is the last reference and no lease is in flight.
     - No timing claim is made. Probe (b)'s figures are not used, and there is no docs/08 row.
3. **Part (2) corrects one sentence.** The sentence at `kernel/src/lib.rs:198-199` @ f815eb5 sha256:<custodian> claims that a stream's `Arc<Dataset>` keeps the dataset alive. That is false.
   - What actually holds it: the producer's `Lease` holds an `Arc<ConnectionPool>` (`engine/src/pool.rs:499-505`, `:416`). The stream clones plain values only (`engine/src/stream.rs:1196-1201`).
   - That property is under test in `engine/tests/connection_reuse.rs:438-454`. The rest of the doc comment, `:199-201` from the dash on, stays true.
   - The draft's §2 gives the replacement text.
4. **Gating is full. The five-line form is not used.**
   - Part (2) rewrites the stated lifetime invariant of a property currently under test (§21a, fourth category).
   - Part (1) documents a never-block exposure (docs/01 principle 7) on the lock that `viewport_query` resolves through.
   - Under round 25, item 2 (e), the Out-of-scope line could not assert that none of the four categories is touched. Size does not route the piece: about 95 lines over 2 files, inside §21c.
5. **Tests.**
   - Note-only: T1 and T2 pin the replace path's outcome. They are predicted to pass at the base, because no code changes. Each has one mutation (`entry().or_insert`).
   - If the fix is taken: no P0 can fail at the base without timing or a hook. The catalog map's type is `Arc<Dataset>`, concrete, and nothing in Dataset's drop chain is injectable.
     - In place of a P0: the language rule (statement temporaries drop in reverse order of creation; a `let`-bound value is a local) and the reproduction's probe (a) (`state/consults/2026-09-26-catalog-open-drop-reproduction.md:52-60` @ f815eb5 sha256:<custodian>), which is evidence, not Authority. The reviewer also reads the fix against the skp.rs:1451-1452 precedent.
     - T1 and T2 would each gain a `std::mem::forget(replaced)` mutation. The placement mutation is declared unobservable.
6. **Items 6 and 7** are in the draft.

## Needs the human

**Note only, or the fix (round 33).** Why it is theirs: the ruling attaches the fix to S1 only, and either reading of "filed like the rest" is plausible. The trade-off is a two-line fix in the same shape as an existing product line, versus the project's rule that a fix carries a P0 that fails at the base, which no deterministic test can provide here. Nothing else needs the human.

## The draft (proposed path `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`)

(The report's fenced DRAFT followed here. It is not repeated: the committed form, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, is that draft with the edits its header lists.)

## The fix delta (I3; the custodian folds it in only if round 33 rules the fix in before commit)

- **§2 item 1:** `open` and `open_cancellable` each become `let replaced = self.lock_write().insert(name.into(), Arc::new(ds)); drop(replaced);`. The comment names the `kernel/src/skp.rs:1451-1452` shape and the #116 form (`kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md:5-11` @ f815eb5 sha256:<custodian>). The note then states that the replaced dataset is dropped after the guard's release, on the caller's thread, before the call returns.
- **§1:** May 1 becomes that statement. Gating stays full: product code under docs/01 principle 7.
- **§4:** "No P0. No deterministic test distinguishes where the drop happens without timing or a hook. The evidence is the language's drop order, probe (a) as evidence, and the reviewer's reading against the precedent." T1 and T2 each add a second mutation (M3 and M4): `std::mem::forget(replaced)`, which fails the strong-count assertion. Restoring the same-statement drop is registered as **unobservable by T1 and T2**, and no record may call it observed.
- **§7:** ≤ 130 lines.
- **§8:** line 1 becomes "beyond the two `let`/`drop` pairs and doc lines".
- **§5:** "every non-doc line unchanged" becomes "unchanged except the two pairs".

## Paths read
- C:\dev\spatial-ide\PLAN.yaml (node entry)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (round 25 and 26 RULED blocks)
- C:\dev\spatial-ide\state\questions\round-25.md
- C:\dev\spatial-ide\state\consults\2026-09-26-catalog-open-drop-reproduction.md
- C:\dev\spatial-ide\kernel\src\lib.rs
- C:\dev\spatial-ide\kernel\src\skp.rs (1038-1189, 1250-1310, 1420-1476)
- C:\dev\spatial-ide\kernel\src\main.rs
- C:\dev\spatial-ide\engine\src\dataset.rs (120-203, 652, 1758)
- C:\dev\spatial-ide\engine\src\pool.rs (322-332, 357-420, 480-590)
- C:\dev\spatial-ide\engine\src\stream.rs (1150-1260)
- C:\dev\spatial-ide\engine\tests\connection_reuse.rs (410-454)
- C:\dev\spatial-ide\protocol\skp\src\v0\handles.rs
- C:\dev\spatial-ide\kernel\tests\end_to_end.rs (1-70)
- C:\dev\spatial-ide\kernel\TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md
- C:\dev\spatial-ide\kernel\CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md
- C:\dev\spatial-ide\kernel\RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\gates\2026-09-30-close-dataset-unknown-gate1-architect.md, -gate2-architect.md, -gate3-architect.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §21d)
- C:\dev\spatial-ide\docs\adr\ADR-018-what-cancellation-acknowledged-means.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
