# PART-H-QUEUED — the at-scale operator run (the slice at 5 GB)

**Status 2026-08-18: machine-side P0–P2 CLOSED** (state archived: `.cut-archive/CUT-STATE-at-scale.md`).
**P3 (the operator run) is QUEUED for the next batch session per rule 11** — this file survives until
that run closes, then archives. Pre-checks all green: fixture hash-verified; `e2e:debug` at 5 GB
admitted + rendered non-blank (20.68% non-background, 0 errors); decisions 7 (declare-and-observe)
and 8 (H8b live call) queued in DECISIONS-PENDING.md. An app instance was left running on port 9223;
if it has been closed since, relaunch via `npm run e2e:debug -- "<5gb path>"` before the session.

**Batch queue note (updated 2026-08-19): THREE parts queued for this session — H, I, J — all
against the single pinned build `807648f` (pre-filled in the three result logs; one tree so
Part J's REGRESS' claim is meaningful).** Part I (admission remediation, PR #14): claim-vs-fact
legibility, candidate-list neutrality, axis-trap protectiveness. Part J (action console, PR
#15): one-click-two-commands legibility, the hex-honesty tolerability judgment, the no-API-
equivalent rows, pan-feel with the console open. Run order suggestion: H first (the long one),
then I, then J. The cut pipeline deliberately idles until this batch + queue entries 7/8/9/16
clear (DECISIONS-PENDING entry 22; override available).

**Transient brief; untracked; deleted at close (rule 10 — state to `.cut-archive/` at close).**
**Branch:** work lands on `main` directly for P0-P2 (doc + fixture work, no product code); an
operator-run finding needing code gets its own branch. **Commits:** standard identity flags.
**Approval:** the human ("pass to the next cut"); architect design consult 2026-08-17 — binding,
including its three premise corrections (sub-second open; NO publish-side whole-file refusal —
the reader refuses after the irreversible write, RESULTS finding 2; the fixture has NO attribute
column and 403 prunable row groups, so H3's predicate must be non-prunable, e.g. `id * 2 >
6599800`, P1-verified).

**Zero product code.** Doc work + P0 regeneration + custodian pre-checks. The one code candidate
(the principle-7 pin gap) is QUEUED for the human — architect recommends declare-and-observe, not
pre-fix. No E2E at 5 GB beyond `npm run e2e:debug -- <path>` as a pre-check (600s deadline; exit 0
= "ran", never "passed").

## P0 — fixture regeneration (declared 45 min incl. release build, hard stop)

Generator: `kernel/tests/scale_pass.rs` (`spec_5gb()`, seed 0x5EED_2056_0000_0005,
AttributeMode::None — DO NOT EDIT the pinned harness). Route: `cargo test --release -p
spatial-kernel --test scale_pass -- --ignored --nocapture` (clear the scale-pass dir first —
generate() refuses existing files, and the 145MB control's assert would fire after the 5GB
write). **Hash gate: sha256 must equal
`5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788`, bytes 5,004,376,705,
features 3,300,000 — mismatch = HARD STOP, escalate (ADR-006: regeneration is a restoration only
if the hash matches; every prior kernel record depends on it).** This run's scale-pass.json is
NOT a run of record (no pin, no canary protocol) — delete/rename it after; a canary failure does
not invalidate the fixture (the hash verifies). Disk: ~5 GB of the 40 free; the declared
temp_directory control was never implemented (spilling sorts write anywhere — §5d).

## P1 — pre-checks (custodian, before ANY operator time)

1. `npm run e2e:debug -- "<5gb path>"` — admits + renders non-blank, or Part H is unrunnable.
2. Kernel-side predicate probe: `id * 2 > 6599800` admitted (ADR-021 stages) AND genuinely
   long/zero-batch at 5 GB (fallback `id / 2 > 1649950`; if nothing non-prunable is admissible,
   H3 records that fact honestly — never faked on a small fixture).
3. Disk ≥ 40 GiB post-regen; H8a-vs-H8b decision state confirmed.
4. `publish-bundle.exe` + `renderer/bundle-viewer/dist` built (release dir was deleted in the
   cleanup — rebuild is in P0's own budget).

## P2 — Part H into MANUAL-WALKTHROUGH.md (doc-only; every expectation cited to RESULTS)

Steps H1-H10 per the architect note verbatim (the custodian holds it; key honest expectations):
- H1 open: "Opening…" BRIEF (measured 146.7-181.3 ms cold kernel-side — cite, never attribute);
  row count 3300000; ceiling banner + status with N ~19,000 (~0.6% — 2M vertices ÷ ~104.7
  vertices/feature); auto-fit fits ONLY what arrived (thin band/sparse scatter ≠ defect).
- H2 pan/zoom/hover: per-viewport re-fill to the ceiling; tighter viewports slower to first
  pixels than wide ones (finding 4 — cite); Zoom to layer fits the anchor = union of VISITED
  viewports, not the dataset extent.
- H3 the acceptance condition at scale: non-prunable late predicate; Cancel zero-delay; liveness
  after SCAN_LIVENESS_DELAY_MS; judge working-not-hung; cancel → persistent incomplete status;
  NO duration attached (ADR-018).
- H4 `id < 15000`: the clean filter demo (Apply=open semantics; camera lands on matches; no
  ceiling).
- H5 style: pure re-render.
- H6 publish Current view: MANDATORY sizing pre-step (zoom to ~1/8×1/8 of the layer ≈ 52k rows ≈
  90 MB ≈ 86 partitions; stay under ~300k rows or H7 becomes H8); expect in order: (1) a LONG
  UNCANCELLABLE progress-less "Preparing…" (ensure_pinned's whole-file hash — the DECLARED
  principle-7 gap; only figure on record is a WITHDRAWN 20s; record buckets only; paid once per
  admitted dataset), (2) the dialog (no row count BY DESIGN), (3) executing: verifying-source
  re-hashes the 5 GB again (cancellable, labelled), querying, writing-partitions, Cancel live,
  (4) success summary, no durations.
- H7 serve + verify (port 8733; optionally kernel's verify-bundle).
- H8 the honesty step — SAY PLAINLY: no publish-side refusal exists; 6,636 partitions = 6.6% of
  the ceiling. H8a (default): whole-dataset publish, watch phases, CANCEL mid-flight → nothing at
  destination, no staging debris, a cancellation audit pair; property, no timing. H8b (ONLY on
  the human's explicit go-ahead, live): let it complete (~100s, 5.7 GB, irreversible), serve,
  read the viewer's typed ceiling-exceeded — RESULTS finding 2 at the UI, the ADR-025 evidence.
- H9 --audit-show: judge legibility at scale (G6's remediation meeting real volume).
- H10 the exit judgment (the human alone): is the hero slice demonstrated at 5 GB, and which
  verb, if any, is not (predicted: publish holds for a viewport subset; whole-file is publishable
  but not viewable). Verbatim in the result log; NOTHING in the tree claims at-scale until
  written there.

**The observation-vs-claim rule (binding, inline in Part H):** every duration carries the
verbatim prefix "Observation (operator wall-clock, over RustDesk; no preregistration, no canary,
no binary pin — not a measurement, and not comparable to any figure in kernel/RESULTS.md):";
buckets only (under-a-second / a-few-seconds / tens-of-seconds / minutes); never beside a budget
verb; never met/missed; never compared; never divided (no throughput); cancellation gets NO
duration; citing RESULTS figures ≠ attributing them to this run.

## P3 — the operator run (RustDesk). P4 — harvest: result log; ADR-025 filed as proposed if H8
confirms; CUT-STATE → .cut-archive at close; nothing appended to accepted ADRs; docs/01 untouched.

**Non-goals:** new perf numbers/preregistration · measurement campaign · product code without the
human's pre-fix decision · E2E at 5 GB · fixture respec (an attribute column changes the hash and
orphans every prior record) · macOS/Linux · transport/ADR-012 · reopening import-layout/index
(fresh preregistered gates required) · citing ADR-011 as settled · ADR-009.
