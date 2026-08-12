# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

0. **[DIAGNOSED 2026-08-13 — fix direction is yours]** The instrumented session (one
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

1. **PR #8 operator walkthrough — HELD, per the human's 2026-08-13 instruction:** held until
   entry 0 is diagnosed, fixed, and A5′–A9′ pass in a fresh session; then the human performs
   Part A. (The E2E harness gives twice-reproduced render evidence — admission, 40 batches /
   1.96M positions, ~20% pixel coverage; the away-mode evidence rule stands: native dialog A2 and
   the look-and-feel qualities of A4–A10 are the human's alone; the rest is E2E-covered as a
   floor, not a replacement.) Touches: PR #8 merge.

## Resolved

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
