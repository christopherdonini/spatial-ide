# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

0. **[AUTHORIZED 2026-08-13 — instrumented session in progress]** Shell defect, unresolved after
   two fix attempts (token-discipline rule 7) — resident-vertex ceiling trips at exactly
   2,012,436 on fresh sessions. The human authorized exactly one verified-fresh instrumented
   session: pushBatch/clearStream residency ledger only (handle, seq, vertex delta, resulting
   total); no ceiling change, no eviction/tiling, no speculative fix; report exact event ordering
   and stop — the evidence-directed fix comes next. Original entry preserved below for context. The E2E suite reproduces it
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
