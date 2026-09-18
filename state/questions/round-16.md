Question round 16 — 2026-09-18 (custodian → human). Five items (DECISIONS-PENDING entry 112). Status at filing: PRs #88, #89, #90, #91 open for the click; two pieces STOPPED under Rule 7 after two failed gate attempts each (ADR-029 G1's write-up, gate-log 80/86; the superseded-name scanner, 81–82/87–88); P4 under its reviewer, P5 in its third round, the drill held behind them. Every option below is stated as the custodian would execute it; the gate reports named are saved as evidence in the session scratchpad and summarized verbatim in the gate log.

1. Brief A's P6 sight #2 has no on-screen string (entry 111 (1)). The session-identity statement and the two CRS provenance fields travel on the wire and are rendered by no component; Part N's N3 says so and discharges nothing.
  (1) Render before Part N (Recommended): a five-line shell piece renders `session_statement`, `crs.provenance` and `crs.axis_provenance` in the describe summary, under a reviewer gate; Part N then runs as written.
  (2) Re-scope the sight: N3 reads the Identity line only; the statement stays wire-only and is recorded as owed to a later piece.
  (3) Hold Part N until Brief B's B2 preregistration decides the describe surface.

2. ADR-029 G1 — STOPPED under Rule 7 (the spike's written conclusion failed two reads; the probe and the substance stand: a u64 rows-processed reading exists on the read_parquet path and reaches the true count in every archived run; the engine cannot reach it through the vendored `Connection`; the count must be latched engine-side; DuckDB's denominator is an estimate). The second read's three blocking items are sentence-level (a refuted precondition; monotonicity stated as an API property; an invented route cost), its remedies written out.
  (1) One more read under a fresh count (Recommended): the custodian applies the second read's three remedies and its should-fixes exactly as written; a fresh reviewer reads once; the spike lands with its README as the record.
  (2) The architect reduces the README to the facts the second read verified clean, and the spike lands with the reduced record.
  (3) Hold the branch; G1's substance stays in the ledger only.

3. ADR-029's route, given G1 (your word; the ADR stays Proposed until it). No recommendation is made by the custodian or the architect.
  (1) Route (ii): a minimal crate patch or fork exposing the connection handle for a `query_progress()` read, preregistered as its own piece.
  (2) Route (i): the engine drives the scan through raw ffi end to end for that path (abandoning `stream_arrow`, the pooled `Connection` and `InterruptHandle` cancel there).
  (3) Route (iii): upstream first; ADR-029 waits.
  (4) Defer: no route this week; ADR-029 stays Proposed and the question returns with Brief B.

4. The superseded-name scanner — STOPPED under Rule 7 after two FAIL/FAIL attempts. The mechanism is sound and sharply tested (every forged exemption fails closed; the real P3b record reproduces exactly three superseded claims with the rev checked against main); the second attempt failed on a missing test for the ancestor-of-main condition, two in-place edits of committed amendment lines, and two cites that resolve at no named rev. P3b shows done only when this lands: three historical mentions of an old test name in its append-only record stay binding otherwise. The custodian's and both gates' position on the boundary: a claim may never be marked superseded with no replacement; that case costs an explicit sentence a gate reads.
  (1) One more round under a fresh count (Recommended): the two in-place-edited commits reverted (the unmerged-append revert), the condition's test and mutation added, the architect's one reduction line appended, the §6a and README clauses, both gates; P3b done follows.
  (2) Hold the scanner; P3b stays in-progress with its three findings advisory-planned until you say otherwise.

5. Three baseline dispositions in the checker's ratchet (PR #91) need your ruling, not a worker's: `HOVER-REPICK-PREREGISTRATION.md:53` (its recorded reason says the quoted consult was never tracked; round 14 tracked it; the quote drops a trailing citation unmarked), and the two misquotes of your own round-9 ruling in P3b's shell record (`A9′` re-typed `A9'`, in a blockquote introduced as verbatim; the record is closed under the cap).
  (1) (Recommended) HOVER-REPICK:53 → owed-correction with its reason rewritten to name the now-tracked consult; the A9′ pair stays owed-correction with no corrector until you reopen the record.
  (2) HOVER-REPICK:53 → tool-false-trigger (a dropped trailing citation is not a negation, condition or qualifier); the A9′ pair → the POLISH-113 precedent (unfindable-by-construction, the record closed).
  (3) As (1), and you reopen P3b's shell record by your word for one erratum row correcting A9' to A9′.

Filed for the weekly window (earliest 2026-09-25), not asked now: the unmerged-append revert as a licensed extension of round 15 (f); the round 15 (e) collision for a piece's own new files (every piece since has named its branch commit); a `replaced by <name>` cell for a superseded row; main's landed P3b erratum rows (shell Amendment 16, engine Amendment 13) declaring a pin rule that contradicts round 15 (e); whether a fourth governance piece is funded this week (the architect's roadmap note: docs/07's hero slice is the standing focus).
