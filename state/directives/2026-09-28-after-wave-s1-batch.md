# Directive — C-1, B-1 and A2-1 ruled S1 and sequenced; Fable's after-wave S1 batch (the human, verbatim)

*Custodian's filing note (2026-09-28): the human's message received after the 17:15Z ledger entry, sent as pasted text. It holds the human's ruling followed by Fable's notes, in the format of the day's earlier rulings. It is recorded verbatim below the rule, as received. Cited as "the 2026-09-28 S1 batch", with its paragraph names.*

---

HUMAN RULING 2026-09-28: C-1 runs next, immediately after close-races' current step. B-1's P0 follows.
A2-1 is fixed as part of B1's close.

Fable, 2026-09-28: the after-wave S1 batch is taken now. The audit batches are complete, and W2-D is an
implementation item that touches none of these paths. All three candidates are confirmed S1, and each
becomes a cut as ruled below.

C-1 (the watcher's first read is issued on the caller's thread): S1.
- Direction: every ReadDirectoryChangesW a watch issues, including each handle's first, is issued by the
  watch thread that owns the handle, so the I/O lives exactly as long as the watch.
- arm() keeps its synchronous outcome. It waits on a one-shot handshake from the watch thread: either the
  first reads were issued, or the issuing error maps to today's arm-time refusal.
- Rejected: binding the handles to an I/O completion port (more machinery for the same property).
- Not acceptable: keeping the caller's thread alive, or changing tokio's thread_keep_alive. Both hide the
  defect instead of removing it.
- §2a's mapping table is unchanged: once no read belongs to a caller's thread, a non-disarm abort really
  is lost coverage.
- Regression tests, committed and run on Windows:
  - your scratch test made permanent: arm through SkpHost::open_dataset from a thread that then exits;
    assert that no session-ended event arrives within a bounded wait, and that viewport_query is admitted;
  - the arm-failure path still refuses synchronously.
- Use the short-form preregistration. Put the dev-app observation in P0 if the human reports one; until
  then, "hits every session" is inferred, not observed.

B-1 (implicit coercions pass bind admission): S1. §7.6's rule that a refusal is synchronous is broken
under either reading of "(or any other)", so the grade does not depend on the reading.
- The fix is its own cut, with its own preregistration.
- Its P0 is a measured table: for each admitted comparison form and each admitted column type, does
  DuckDB's binder insert a cast, and can that cast fail or narrow?
- The preregistration then proposes two things:
  - the admitted set. I expect casts that cannot fail, such as widening within the integer family, to be
    admitted, and any cast that can fail at scan time or change the comparison to be refused;
  - the detection mechanism. Prefer the engine's own type rules over the allowlisted predicate tree to
    parsing DuckDB's plan text.
- That proposal comes to Fable before any code. If it changes ADR-021's Decision text, rather than
  SKP-V0's wording, the amendment is the human's, as typed text.
- The leak of file values is fixed along with it: once admission refuses, the refusal is synchronous and
  carries no file data.
- PR #139 merges BEFORE B-1's fix starts, as the fix's regression net. First, one reviewer pass scoped to
  tests only: deterministic, no new dependency, CI runtime stated. One change: the skipped test's bare
  #[ignore] gets a reason naming wave-2 finding B-1 and the fix node. The fix's PR removes the ignore.
  The merge is the human's click.

A2-1 (a NUL byte in a column name): S1. The case for S2 (loud, typed, no data lost) does not restore a
broken clause, and describe states something untrue.
- It is fixed as part of B1's close. ADR-023 is still Proposed, so this is the ordinary pre-close route,
  not a separate cut.
- Direction: the schema probe detects names that do not round-trip between DuckDB's Arrow export and
  what DuckDB binds. Every use by name refuses them: projection, the filter namespace, and the geometry
  and identity lookups at open (the worker's observation 3, now in scope). describe's projectable and
  filterable facts flip through the same functions, so O4 holds.
- The refusal names the real reason. An existing code that would be false is not acceptable
  (principle 8). If that means a new code, it is an ADR-023 amendment with its own fixture; its text
  comes to Fable, and the human accepts it with B1's close. The protocol literal follows merge order.
- The A2 reproducers, inverted, are the regression tests.

W2-C's two S2 records: recorded as you filed them. Nothing more from me.
The red main: that's the right lesson. The citation check runs on the staged tree.
