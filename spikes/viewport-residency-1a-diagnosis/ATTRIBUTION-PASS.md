# Attribution pass — where the 152-second zoom-to-layer window actually goes

**The read-only pass the human ordered 2026-09-03** (DECISIONS-PENDING entry 28, ruled (a): "the
null queryToFirstByteMs angle first; LOD's brief finalizes only after its answer"). Read-only:
no file created or modified by the investigation itself; this write-up is the deliverable, per
spike discipline. Companion to this directory's `README.md` (the 1a diagnosis) — and partly a
correction of it, see §5.

**Verification note.** The investigating agent's highest-stakes claims were independently
re-verified by the custodian before this write-up: the evidence JSON's full
`queryToFirstByteMs` inventory (walked programmatically), the one-sided clamp code, the
RESULTS.md lines being corrected, and the session log's existence with 65 terminal lines inside
the calm-wait window (counted by timestamp range). All matched.

## 1. The premise was wrong: not 3 nulls of 12 — 8 of 12, and only 2 usable

The record this pass was dispatched against (RESULTS.md's P12 text, propagated from the
2026-09-02 architect consult into RESULTS.md, DECISIONS-PENDING entry 28, and NEXT-CUT.md
without independent verification) said three of twelve steps carry `queryToFirstByteMs: null`.
The evidence file (`frontends/shell/e2e/out/residency-harness-instrument-on-1788380132954.json`)
actually carries:

| row | `queryToFirstByteMs` | reason |
|---|---|---|
| open-drain | 200.9 | — (usable) |
| fit | null | `"no-batch"` |
| pan-north | null | `"no-batch"` |
| pan-east | null | `"cross-step-stream"` |
| pan-south | null | `"no-batch"` |
| pan-west | 1484.1 | — (usable) |
| pan-northeast | **0** | — (impostor, see §2) |
| zoom-to-layer | **0** | — (impostor, see §2) |
| zoom-in-1 | null | `"no-batch"` |
| zoom-in-2 | null | `"cross-step-stream"` |
| zoom-in-3 | null | `"cross-step-stream"` |
| zoom-out-1 | null | `"cross-step-stream"` |

8 null, 2 zero, 2 usable. The corrections to the propagated "three of twelve" are applied as
appended notes in RESULTS.md and DECISIONS-PENDING entry 28.

## 2. Why — structural in all cases, plus one real instrument defect

**Mechanism A, `"no-batch"` (4 rows):** the step issued streams but zero batches arrived within
the step's own wall — at 5 GB a per-tile round trip frequently exceeds the whole step (fit's
wall is 739ms; the cleanest recorded round trips are 200.9ms and 1,484.1ms). The responses land
in later steps. Honest and honestly reported.

**Mechanism B, `"cross-step-stream"` (4 rows + the 2 impostors):** the instrument's issue
records and arrival records can disagree about ordering when a step's first batch belongs to a
queue-drained stream. Plan-issued tiles are counted at plan time
(`candidateArmSession.ts:723-725`), but a queue-drained tile is counted only when its first
batch or terminal arrives (`candidateArmSession.ts:473,495`) — and within that single delivery
chain, arrival is stamped *before* issuance (`tileViewportStreamManager.ts:502-507` stamps
arrival, then hands up to the counter). So the raw span is ≤ 0 mechanically. The clamp
(`residencyInstrument.ts:459-462`, verbatim: `if (queryToFirstByteMs !== null &&
queryToFirstByteMs < 0)`) nulls the negative cases with an honest reason — **but it is
one-sided: a delta of exactly 0 (same ~100µs clock quantum) survives as an apparent
measurement.** That is the two `0` rows: a `queryToFirstByteMs` of 0 for a 5 GB tile query is
physically impossible (the mint alone crosses a `viewport_query` round trip plus
`dataPlaneAttach`). **Neither 0 may ever be quoted as a measurement.** Two further rows
(zoom-in-3, zoom-out-1) carry seconds-scale `decodedToPaintedMs` values (13,617.6ms /
16,445.3ms) that are **not paint times** — they span "decode of a cross-step batch → waiting
for any issue record to arm the paint stamp → next frame." These instrument defects are queued
as DECISIONS-PENDING entry 31.

A re-run of the same instrument design does **not** populate the nulls — both mechanisms are
deterministic properties of per-step, one-shot capture against streams whose lifetimes span step
boundaries, which at 5 GB is nearly all of them.

## 3. The decomposition — recovered from disk after all

An artifact nobody had pulled into this question: the trial's own persisted Rust-side session
log (`%LOCALAPPDATA%\dev.spatialide.shell\logs\session-1788379618.log`, matching the trial's
`startedAt` to the second), carrying one epoch-ms-stamped `candidate-tile-terminal` line per
genuine tile-stream terminal. Combined with the evidence JSON's direct fields:

- **150,058ms of the 152,152ms window is the pre-gesture calm wait** — direct record
  (`wallMs: 152152`, `gesture.calmWait: {"calmed":false,"waitedMs":150058,"inFlight":2,"queued":14}`).
  The harness's own code places the wait inside the wall (`residency-harness.mjs:933-943`) and
  opens the instrumented window before it, so the row's counters (70 streams, 823 batches,
  657.8MB decoded, 513 evictions) describe the whole window.
- **The gesture itself took ≈2,094ms** to instrument-visible settle (152,152 − 150,058) —
  with the caveat that the settle is instrument-blind to freshly queue-drained streams, whose
  data surfaces in the next steps' counters.
- **The 150s was continuous slow drainage, not a static hold.** ~65 tile streams reached
  genuine `Completed` terminals *inside* the calm-wait window (custodian-verified count: 65
  lines in the timestamp range), at 3-way concurrency, ~4.4MB/s sustained — pan-northeast's
  leftover queue draining continuously. Per-tile service times are bimodal: bursts at
  ~0.15-0.6s/tile against stretches at ~6-17s/tile (longest terminal-free gap ≈17.3s).
- **Client paint was busy but not the wall:** 745 frame-delta samples across the window (p50
  185.1ms, p95 340.9ms — continuous ~5fps rendering), against clean first-batch paint segments
  of 15-501ms elsewhere in the file.
- **Not recoverable from disk:** the split inside "time-to-data" between kernel query
  execution, wire transport, and credit-window backpressure (`adapterWs.ts:120-122` couples
  producer rate to client consumption — client-side records alone cannot separate them), and
  whether the inter-terminal gaps contain intermittent over-budget drain-hold idle.

**A category-error warning for the record:** "152s / 70 tiles ≈ 2s per tile" must not be used —
the 70 streams in that row are almost entirely the *previous* gesture's backlog draining during
the calm wait. The zoom gesture's own covering set was truncated by 1,049 tiles at the plan
(session log line 378) and its first data-bearing tiles completed in *zoom-in-3's* window. Use
the per-stream figures above instead.

## 4. The verdict the LOD brief needed

**"Upstream of paint" is now a grounded finding, no longer arithmetic.** Time-to-data dominates
every long window (per-tile service 6-17s for data-bearing tiles; clean client decode 0.7-29ms
and decode-to-paint 15-501ms — one to two orders of magnitude below). A renderer-side
(client-decimation) LOD slice would target the component the records show to be the minor cost
pool. **"The kernel's query side specifically" remains a strongly indicated but unverified
refinement** — the kernel-vs-transport-vs-backpressure split needs the minimal instrumented
pass below, and how much the over-budget drain-hold contributed to the 6-17s gaps is unknown.

## 5. Correction to this directory's own 1a README (Q1)

The README's code citations all stand (`drainQueueIfRoom` refuses while over budget; only a
camera change resumes it; Cancel is an unresettable kill switch; the principle-7 gap on scoped
cancellation and honest progress reporting is real — arguably *sharpened* by this pass, since
the system spent 150s productively draining while the only operator-facing signals could not
distinguish that from a stall). What this pass corrects is the *attribution of the recorded
150s window*: it was overwhelmingly continuous slow drainage, not held-queue idle. The hold
mechanism is real code; it was not the dominant story of this trial's window. The same
calibration is appended to RESULTS.md's corrected-framing paragraph and to ADR-028.

## 6. The minimal instrumented pass, if the finer split is ever needed

Achievable **harness-only** (zero product code): persist the always-on console trace lines
(`traceStreamIssued` at `tileViewportStreamManager.ts:529`, `traceStreamBatch` at
`WorkingCanvas.tsx:804,995`) with their CDP timestamps and join them per `streamHandle` against
the session log's terminals — yielding per-tile time-to-first-byte, stream duration, and byte
cadence. Add a continuous poll of the existing `residencyQueuedTileCount` hook (`App.tsx:845`)
for queue depth. DEV-gated E2E hooks for `trackedTileCount`/`overBudget` (getters exist,
unexported) would be instrument-surface additions inside product files — the project's own
established class, but declare them as such if taken. Kernel-internal timing (SQL vs. Arrow
encode) is genuinely product-side and **not needed** for the renderer-vs-server module decision.

## 7. Were the null `queryToFirstByteMs` values themselves a symptom? (2026-09-03, the entry-31 clean-instrument question, answered structurally)

The human asked, ordering the instrument fixes: **"note whether the null `queryToFirstByteMs`
values were themselves a symptom."** With the instrument now repaired (entry 31 / Amendments
24-25), the answer is decidable from the fixed code alone, and it is counter-intuitive:

**The nulls are a symptom — of the per-step, one-shot instrument DESIGN, not of the clamp bug the
fix removed. The fix does not reduce the null count; on a clean re-run it would INCREASE it.**

The eight nulls in the P12 file come from two mechanisms (§1-2 above), both at
`residencyInstrument.ts:462-465` and the negative-span clamp:
- **`no-batch` (4 rows):** the step issued streams but its first batch arrived in a *later* step's
  window — at 5 GB a per-tile round trip routinely exceeds a step's own wall. Untouched by the fix.
- **`cross-step-stream` (4 rows, negative raw span):** the step's first batch belonged to a stream
  whose lifetime spanned the step boundary. Untouched by the fix (the `< 0` branch is unchanged).

The entry-31 fix changed only three things, none of which adds a first-byte capture, changes
`beginStep`'s per-step reset, or alters how streams are counted: (1) the `queryToFirstByteMs` clamp
went `< 0` → `<= 0`, which **converts the two former `0`-value impostors into honest nulls** (reason
`issue-arrival-same-quantum`); (2) `decodedToPaintedMs` gains the paint-arm-delayed null; (3) the
`firstPixelCrossStepSuspect` flag. So a clean-instrument re-run would show roughly **10 nulls of 12,
not fewer** — the 8 structural nulls unchanged, plus the 2 ex-impostors now correctly null. Fewer
*apparent measurements*, more *honest nulls*: the fix makes the instrument tell the truth about how
little of the 5 GB trace its per-step segments can attribute, it does not make them attribute more.

**Consequence:** the nulls are not a bug a re-run retires — they are the per-step design meeting a
workload whose stream lifetimes span step boundaries. Only the harness-only per-stream join (§6,
now enabled by `wireTraceLines` + the session-log terminals) actually attributes that traffic. This
is exactly why the module-level verdict (§4, "upstream of paint") rests on the per-stream/session-log
evidence and the direct records, never on the per-step segment nulls.

## 8. The empirical clean-instrument run — QUEUED for a headed session, not run 2026-09-03

The structural answer above needs no run. An empirical clean-instrument trial (candidate/fine/cold,
`--per-stream-trace`, against the 5 GB fixture) would additionally *demonstrate* the per-stream join
end-to-end and confirm the ~10-of-12 null prediction — worth having, but **it collects client-clock
quantities (frame series, first-pixel), and decision 24(g) reserves headed measurement for the
human's foreground physical time with RustDesk stopped ("no RustDesk measurement, ever").** At the
time of writing the custodian is running unattended with RustDesk active (started at the human's own
request), so running the trial now would both violate 24(g) and yield a conditions-compromised file.
It is therefore queued for the next headed foreground sitting (rule-11 batch), RustDesk stopped —
alongside K6's own E2E step (entry 29) and whatever else that sitting carries. The instrument it will
run on is the repaired one on this branch; nothing else blocks it but the conditions.
