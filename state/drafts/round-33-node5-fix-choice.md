# Round 33 addendum (draft) — item G: node 5, the note only or the fix

*Custodian's draft, 2026-10-01. It joins question round 33 on 2026-10-02 (the weekly window's A–F and PORTABILITY-2026-09-30.md §7's five decisions). The source is the architect's drafting consult, `state/consults/2026-10-01-catalog-open-replace-note-architect-draft.md`, "Decisions" item 1 and "Needs the human". Nothing here is asked yet.*

## The choice

PLAN node `catalog-open-replace-drop-latency-note` (position 5) carries round 25, item 1 (d), RULED 2026-09-26: S2. When `Catalog::open` replaces a dataset under a name already present, the replaced dataset's DuckDB teardown runs while the catalog's write lock is held. No product path replaces a dataset today, except through a 128-bit random handle collision. The architect reads the ruling as deciding the note, not whether to fix the code: it attaches the drop-after-guard fix to S1 only. "Filed like the rest" can be read either way.

- **(a) Note only (Recommended).** Document the behaviour in `Catalog::open`'s doc and correct `Catalog::remove`'s doc. Two tests pin the replace path's outcome. No product code changes.
- **(b) The fix too.** Bind the replaced value and drop it after the guard is released, the shape `SkpHost::close_dataset` already uses: two lines. No deterministic test can show where the drop happens without a timing assertion or a test-only hook, so the fix would land with no failing-first test. Its evidence would be the language's drop order and the reproduction's probe.

The note-only piece proceeds now under its form. If (b) is chosen, the fix becomes its own PLAN node after this one, and only the note's one sentence about where the drop happens changes.
