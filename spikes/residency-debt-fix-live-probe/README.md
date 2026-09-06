# Live mechanism probe — the 1b close-out fix (F1 geometric protection + F2 settled-partial voice)

**Class: diagnosis probe, not a measured cell and not the preregistered E2E assertion.** No
duration or throughput figure here is a claim (docs/08); the probe answers two yes/no questions
about the shipped mechanism on a live instance. Run 2026-09-06 against the fix branch
`cut/residency-debt-fix` @ `453a667` (the running instance was launched at `588fbe1` and
hot-reloaded by Vite through the fix batch), candidate arm verified in-page (`getResidencyArm()`
= `"candidate"`), tile level `fine`, `polygons-100k.parquet`, attached over CDP to the instance the
E2E harness had launched. Script: `probe-thrash.mjs`; raw trace events: `probe-thrash.json`;
console output: `probe-thrash.log`.

## The two questions and their answers

1. **Does a tile admitted in a view get evicted in that same view (the human's felt thrash —
   "renders for half a second, then disappears")?** After four wheel zoom-outs to an over-budget
   view and an 8 s grace for the debounced plan, a 45 s STATIC-camera window was observed:
   42 trace events, **7 tiles admitted, 0 evictions, 0 admitted-then-evicted** (`overBudget`
   seen in the window: yes). **No.** Before the fix, the same gesture produced the constant
   appear/disappear cycle the human recorded (DECISIONS-PENDING entry 44, session log
   `session-1788697999.log` 15:07-15:13).
2. **Does the status line speak in the states that were silent?** After Zoom to layer (the fit
   view, truncated by 556 tiles beyond `MAX_QUEUED_TILES`), the status read the DRAFT string 6:
   *"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*
   (entry 43 — previously nothing). At the over-budget zoom-out the final status read: *"Showing
   19078 features — the farthest areas of this view are not drawn, to stay within the render
   budget. Zoom in to see more detail. Filling is paused until the next pan or zoom."* with
   `residencyQueuedTileCount() = 460` — the declared absorbing state exactly as preregistered
   (`RESIDENCY-DEBT-1B.md`, close-out section): over-budget latched, the held queue, string 1
   (ruled 2026-09-05) reachable live at Polygons scale for the first time. **Yes.**

## What this does NOT establish

- Legibility (whether string 6 and the paused suffix READ as honest) — the human's L2-L9 re-run.
- The preregistered E2E assertion (`assertNoInViewportTileEvicted`, wired at the harness's
  `zoom-out-1` step) has not yet executed: the smoke trace self-invalidates at its `fit` step on
  this fixture's strip-anchored frame (all in-window deliveries are duplicates of the first look
  → `no-paint`), a pre-existing harness artifact recorded in NEXT-CUT.md's queued follow-ups.
  This probe is the interim mechanism evidence, not a replacement for that run.
- Anything about performance: F1 keeps the resident set nearer `MAX_RESIDENT_VERTICES` for
  longer at over-budget zoom-out — the axis G4 measured — and no number here may be read as a
  re-measure (Amendment 3 draft, clause 5).

## Truncation counts seen (session-log class, observability only)

556 (fit), 3,596 and 15,336 (zoom-outs) tiles beyond the 512 cap — the grid is unbounded
(`coveringIndexRange` does not clamp), so a deep zoom-out's covering set is in the tens of
thousands; the status line, not this count, is the operator disclosure.
