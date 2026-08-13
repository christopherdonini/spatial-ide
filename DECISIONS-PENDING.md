# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

A. **[DIRECTION APPROVED 2026-08-13 — exact text below awaits your sight-approval, then the
   custodian applies it to docs/07 line 22.]** You accepted the gate fail as final with reopen
   conditions per the ADR-012 pattern. **The drafted replacement text, verbatim:**

   > - **Spatial indexing — measured to a close (2026-08-13; `kernel/RESULTS.md` ninth
   >   section).** No index prunes IO: an external index over the covering-bbox statistics
   >   excluded exactly zero bytes (seventh section, finding 3), and DuckDB's zone maps already
   >   prune roughly half of a raster-ordered file at a quarter viewport. Physical layout is the
   >   only lever that moved read volume — a Hilbert-ordered 5 GB file read **61.7%** of the
   >   raster control's bytes at the near-quarter viewport and won total time 49/49 — but the
   >   **preregistered import-layout gate FAILED** on its no-whole-file-regression condition
   >   (100.544% vs the declared ≤ 100.5%; Hilbert-ordered files compress ~0.5% worse), and a
   >   fail is a complete result: **layout stays out of the import path; no ADR was filed.** The
   >   standing bracket: an **unordered** source gets no pruning at all (shuffled control
   >   ≥ 99.99% read at every viewport, both classes) — spatial pruning is a property of layout,
   >   not of any index. **Reopen conditions** (each requires a fresh preregistered gate, never
   >   an amendment): **(1)** evidence that the real workload is small-viewport-dominant with
   >   whole-file opens rare — the measured trade re-weights (Hilbert wins 3.3% vs 13.0% at
   >   1/64, loses only on whole-file cost); **(2)** ADR-011's tiled-batch direction accepted in
   >   a form that removes whole-extent reads from the hot path (its gate 8 owns the residency
   >   question this connects to); **(3)** a demonstrated instrument/writer confound — e.g.
   >   explicitly pinned parquet encodings showing the ~0.5% whole-file overhead was the
   >   writer's, not the layout's, while the near-quarter win survives. Every figure is
   >   warm-cache logical bytes on Windows, one machine, one writer.

   Original entry follows for the record.

A′. *(superseded original)* **Import-layout cut concluded — the preregistered gate FAILED; two decisions.** The cut
   (branch `cut/import-layout`, stacked on the parked shell branch; full record:
   `kernel/RESULTS.md` ninth section, preregistration `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`)
   measured docs/07's "index that prunes actual IO" item to a close: no index prunes IO (the
   zero-byte finding stands); physical layout is the only lever — Hilbert at 5 GB read **61.7%**
   of raster's bytes at the near-quarter and won total time 49/49 — but the gate's
   no-whole-file-regression condition failed at **100.544% vs the declared ≤ 100.5%** (Hilbert
   files compress ~0.5% worse), and per the preregistration's own words one unmet condition is a
   complete fail: **layout stays out of the import path; ADR-021 was not filed.** The bracket
   recorded: an unordered source gets **no pruning at all** (shuffled control ≥ 99.99% read at
   every viewport, both classes). Registered prediction 3 also failed honestly (the crossover
   sign reverses with granularity). **Decision 1:** accept the fail as final (recommended — the
   condition was deliberately authored; the numbers are recorded either way; the over-ceiling
   question this connects to already belongs to ADR-011 gate 8), or authorize a *fresh*
   preregistered gate with a re-authored whole-file condition — noting the 0.044-point margin
   cuts both ways and gate-shopping erodes the discipline. **Decision 2:** the docs/07 line-22
   replacement text (drafted in this entry's commit-adjacent record — the custodian applies it on
   your accept): it records the measured close, the bracket, the failed gate, and points any
   revisit at a fresh preregistration + ADR-011 gate 8. Touches: docs/07 line 22 only; docs/05
   is untouched by a fail (no product surface was created).

0. **[RESOLVED 2026-08-13 — see Resolved section. Superseded text below preserved for the
   record; note its "12,436 (0.6%) over" magnitude was later corrected — the file's true total
   is 2,508,699 (25.4% over); 2,012,436 was the truncated partial sum at the refusal moment.]**
   *(original entry follows)* The instrumented session (one
   verified-fresh run, residency ledger, no fix — as authorized) closes the mechanism question:
   **not a residency bug.** The ledger shows one stream from zero through 40 admitted batches to
   1,961,249, then its own 41st batch (51,187 vertices) refused at 2,012,436 — **the 100k
   walkthrough fixture's true total ring-vertex count is 2,012,436, i.e. 12,436 (0.6%) over the
   declared 2,000,000 `MAX_RESIDENT_VERTICES` ceiling, by construction**. The refusal fires on
   every first load of this fixture (and fired, unnoticed in the DOM, in every earlier
   "passing" instrument run — 40 of 41 batches render 97.5% of features, so pixels look right);
   the reopen shows the identical independent sequence; no cross-stream contamination, no
   interleaving, zero residency carried between streams or datasets — `ResidentSet`,
   `clearStream`, and the remount fix all behave exactly as coded. A5′–A8′/REOPEN′ fail only
   because the banner from that first-load refusal is never dismissed. Ledger:
   `frontends/shell/e2e/out/regression-render-trace-1786578099481.json`. Options, with
   recommendation first: **(a) regenerate the fixture under the ceiling** (e.g. ~95k rows via
   `kernel/tests/manual_walkthrough_fixtures.rs`) so the happy-path walkthrough exercises the
   happy path, **and add a deliberate over-ceiling fixture + walkthrough/E2E step asserting the
   declared-ceiling refusal fires visibly** — the refusal is designed behavior (limits.ts:
   refuse, never silently evict) and deserves its own acceptance step rather than photobombing
   Part A; (b) raise the ceiling above this fixture's total — a declared-capacity change
   (ADR-010 rule 6 territory) that re-arrives at the same cliff with the next larger dataset;
   (c) bound the unfiltered first look so first render never exceeds the ceiling — a real design
   question (docs/07's 5 GB hero dataset can never fully reside client-side anyway) but bigger
   than this walkthrough and better decided with the hero slice's own tiling/LOD work (ADR-011).
   Banner dismissal semantics ride with whichever option you pick. Original pre-diagnosis entry
   below for context. The E2E suite reproduces it
   deterministically: 2,012,436 = 1,961,249 (the 100k fixture's full residency) + 51,187 (one
   batch) across three verified-fresh launches and three code states, recurring per pan/fit cycle
   (session logs show repeat firings ~39 s apart); the visible symptoms are a spurious red
   ceiling-refusal banner and one wasted stream per occurrence, after which the canvas self-heals
   to a correct render. Three real fixes landed on the way (supersede terminal suppression;
   completed-stream residency clear; canvas remount + banner reset per dataset — all tested,
   all keep their own evidence) and a custodian code-read verifies the stream manager's
   supersede-before-mint ordering is correct, which localizes the remaining mechanism to the
   canvas-side residency accounting (`WorkingCanvas.pushBatch`/`clearStream`/`residentSet.ts`) or
   an unconsidered interleaving. Recommendation: authorize one instrumented session — ~10
   render-trace lines logging every pushBatch (handle/seq/vertices/running total) and every
   clearStream (resulting total), one regression run, read the ledger; the reproduction takes
   minutes with the committed harness. Rule 7 makes a third uninstrumented guess yours to
   authorize, not ours to take. Touches: the A5'–A9' regression steps stay red until fixed; the
   operator walkthrough re-run (entry 2) stays held behind it.

1. **POST-MERGE OBLIGATION — operator walkthrough Parts A–D, due 2026-08-23.** Per your
   2026-08-13 instruction, PR #8 merged with two GUI items recorded as
   **operator verification deferred — queued for the human's return** (away-mode evidence rule),
   named: **(1)** the native file-dialog flow (walkthrough A2 — structurally unreachable by any
   E2E automation); **(2)** the look-and-feel qualities (A4–A10: smoothness, no tearing/jitter/
   ghosting; D2's visual acceptance point — the persistent residency status being *seen*).
   Dated: ten days from merge, **2026-08-23**. Interim evidence cited: all twelve E2E-verified
   regression steps PASS on the exact merged tree
   (`frontends/shell/e2e/out/regression-render-trace-1786583532688.json`, 2026-08-13). The
   walkthrough is a post-merge obligation, not a merge gate; it stays queued here until run.

## Resolved

- **2026-08-13 — Entry 0 resolved: the human chose option (a) with three riders, executed the
  same day.** The riders, as given: **(1)** the over-ceiling acceptance step must assert the
  refusal is *unmissable*, not merely present — incomplete-render state signalled at
  canvas/status level with rendered/total counts, persistent while the condition holds; a
  dismissible banner alone fails; dismiss hides the banner, never the status indicator.
  **(2)** Option (c) — bounding the first look — is the standing question ADR-011's tiling/LOD
  slice must eventually answer; the ceiling refusal is the honest interim for arbitrary user
  files, not the forever behavior (now ADR-011 acceptance gate 8). **(3)** The
  wrong-instance-callback remount footgun gets its small fix now with a regression test
  (`makeManagerCallbacks`, App.test.ts). Executed: happy-path fixture regenerated under the
  ceiling (1,885,130 vertices, hard-asserted ≤ 1,950,000 — headroom over the 2,000,000 ceiling
  is 114,870, 5.7%, so the assert is the guard, not the margin's size); deliberate over-ceiling
  fixture kept at the old spec (true total **2,508,699**, 25.4% over — the earlier "2,012,436 /
  0.6% over" figure was the truncated partial sum at the refusal moment, a custodian synthesis
  error caught in review; refusal lands at 78,191 of 100,000 features); persistent
  `.residency-status` indicator per rider 1; walkthrough Part D + E2E OVERCEIL′ step. **All
  twelve regression steps green on a verified-fresh run** (ledger cited in Pending entry 1).
- **2026-08-13 — ADR-020 accepted by the human.** Acceptance is of the host-declared exact-match
  origin mechanism, not of `cfg!(debug_assertions)` as the final origin-selection method; the
  `tauri build --debug` origin mismatch stays recorded in the ADR as a fail-closed implementation
  defect owed before packaged-debug support is claimed. All acceptance edits applied by the
  custodian the same day: ADR-020 status line; ADR-012 Amendment 1 (quotes the **Origin**
  threat-model bullet, states the referent delta, carries the H4 PASS-inherited-by-argument
  caveat); `docs/09` "Local listening sockets" section; `docs/02` and `docs/README` ADR-list
  entries. The C3 negative test (admitted origin + wrong token → 401 credential) was already
  committed (`3188f1d`).
- **2026-08-13 — Entry 0's instrumented session authorized by the human** (exactly one
  verified-fresh run, residency ledger only, no fix). Moved to in-progress at the top of Pending;
  the defect itself remains open there until diagnosed and fixed.
