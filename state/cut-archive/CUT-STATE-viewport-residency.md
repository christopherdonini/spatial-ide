Resume by reading AI_DEVELOPMENT.md → CUT-STATE.md → NEXT-CUT.md → DECISIONS-PENDING.md → frontends/shell/RESULTS.md (final section).

# CUT-STATE — viewport-residency cut (ADR-011 gate-8 slice)

**Untracked; archives to `.cut-archive/CUT-STATE-viewport-residency.md` at close (rule 10).**
Branch: not yet opened — cut HOLDS for decisions 24(a)–(c).

## Ledger

- 2026-08-30 — hold lifted by the human ("Let's go with the next cut"); architect design
  consult returned (pass with notes; C1–C4 block-on-sight; the restated target; G1–G7; seven
  decisions; ADR-028 skeleton in the consult output, task a32075d5c32bbd885). Brief written
  (NEXT-CUT.md); decisions queued as entry 24, (a)–(c) gating P0. Awaiting the human.
- 24(a)–(c) RESOLVED same day ("a is yes, b approved, c go with your recommendation").
  Branch `cut/viewport-residency` opened.
- P0 LANDED @ e187790, pushed: RESIDENCY-PREREGISTRATION.md (§0–§12, import-layout structure)
  + ADR-028 filed Proposed (decision deliberately open) + indexes. **Three
  proposed-pending-sight values put to the human** (lock at P2's baseline, not before):
  G7 margin 110% (the 10% canary-noise floor); tile sweep 8×8/16×16/32×32 (~4× edge span
  bracketing finding-4's inversion); max-in-flight tile streams 3 (one slot under the
  server's MAX_CONCURRENT_STREAMS=4).
- P1 (camera-trace harness + client instrument, zero product change): dispatched — built
  parameterized so the three values can land at sight without rework.
- P1 LANDED @ 963598b + Amendment 1 @ 5e9213c, pushed. Reviewer gate: **FAILS — 13 MUST-FIX**
  (M1 first-pixel measures gesture repaint not query→batch; M2 refill counters drop
  ceiling-refused batches; M3 frame series = rAF ticks not renders; **M4 two FABRICATED
  preregistration quotes** — a citation-integrity class to watch in worker output; M5 claimed
  dist-grep test doesn't exist; M6 settle proxy declares settled mid-stream; M7 cold first
  view never measured — G7's subject; M8 NE pan realized 2w not √2w, Amendment 1 certifies
  the wrong thing; M9 evidence files can't express their cell; M10 control can't prove
  off-ness; M11 wire-identity overclaim; M12 the preregistration itself cross-attributes G5's
  clock; M13 dev-build measurement undisclosed) + S1-S14 + notes. N1: release invisibility
  independently VERIFIED clean; C1-C4 held; no-scoring boundary held.
- P1b (all M-fixes + S-fixes; G6 resident-count instrument added per N4; stream-end call per
  M6): dispatched. After it: custodian files Amendments 2-4 (√2 resolution as fixed; G5
  scored producer-side / client-reported-beside; dev-build disclosure in every evidence
  file), then RE-REVIEW (the gate failed; it must pass affirmatively before P2).
- P1b LANDED @ a380793 (all M/S/N + two live-found bugs; identity check honestly NOT passing —
  on-vs-on jitter proven). Amendments 2-6 filed @ 2c7464d. P1c @ c4d12eb: deterministic
  identity mode — six pairwise PASS. RE-REVIEW: "passes after named fixes" — B1-B6 (incl. the
  citation-fabrication class RECURRING — B1/B2 — and B3: the identity ON arm never armed, a
  vacuous pass). P1d @ c646a94: all six + suggestions; citation-integrity scan mechanized into
  verify (caught 7 more pre-existing quote defects); identity re-evidenced GENUINELY ARMED —
  six pairwise identical; regression green incl. A9'. Custodian: suggestion-15 one-liner +
  Amendments 7-8 @ 142d6da, pushed. **THE INSTRUMENT GATE STANDS PASSED.** Memory saved:
  worker-citation-fabrication (3× in one cut; now mechanically enforced in these files).
- **P2 threshold reached.** Blocked on exactly two human inputs: the three sight-values
  (G7 margin 110%; sweep 8/16/32; max-in-flight 3) and a scheduled headed, non-RustDesk
  baseline session (entry 24(g)). Nothing else machine-side remains before the baseline.
- **P2-prep dry-run campaign (2026-08-30/31), COMPLETE — every blocker found ahead of the
  human's session:** missing Polygons fixture (generated, 145MB, canonical path); hard-coded
  harness fixture (--fixture added); banner intercepting clicks → REAL product CSS defect
  (.canvas-status-stack full-width box ate clicks on .zoom-to-layer whenever any child present;
  pointer-events fix @ 3cf56f9, REVIEWER-FLAGGED); stale-app attach (dual-port sweep);
  fail-loud exit gaps; settle timeout structurally too small on large fixtures (Amendment 9,
  fixture-scaled 60s, proposed-pending-sight); zoom step-class unmeasurable by construction
  (Amendment 10, step reorder, trace v2). FINAL STATE: Polygons full trace GREEN all classes
  sampled; 5GB smoke GREEN (~19k/ceiling refills, first pixels <310ms); filter-zoned GREEN;
  identity guard PASS armed; verify+dist-clean+citation green. Branch pushed @ 2873109.
  **Sight bundle for the human is now FOUR values** (the three + Amendment 9's timeout).
  Per-trial wall (measured, dry): ~4-5 min incl. fresh launch → baseline arm (n≥7) ≈ 45-75 min
  session estimate.
- **P2 BASELINE MEASURED (2026-08-31, the human present, RustDesk stopped process-level,
  values locked by Amendment 11).** 58 min session. Cell 1 (Polygons, on, n=7) + Cell 2
  (control, n=2): all valid, ABBA per the committed function. **HEADLINE: baseline sits 4×–12×
  over the 100ms first-pixels row on the client clock** (fit p95 471ms; zooms 654-760ms; pans
  p95 1201ms; frame-time proxy far over vsync; G6 budget adherence perfect, closest 99.76%).
  The candidate must IMPROVE a failing baseline, not defend a passing one. 5GB cells: both
  attempts structurally invalid (outer watchdog unscaled; banner re-raise race) — honestly
  unmeasured, reported-only cells, scored campaign unharmed. frontends/shell/RESULTS.md born
  @ de67713. Amendments 12-14 filed @ 77bf73c (5GB bounds 150s + scaled outer watchdog;
  dismiss-retry ≤3; determinism-rule 2% spread clarification resolving the disclosed tension).
- P2b (amendments 12-13 harness implementation): dispatched. P3 (the tile machinery — product
  code, architect-blockable review) follows sequentially.
- P2b LANDED @ caf4091 (per-basename timeout map incl. 5GB 150s; scaled outer watchdog with
  both figures recorded; dismiss-retry ≤3 live-proven). Amendments 15-16 filed @ 23322d7
  (HUMAN-DIRECTED mid-cut: segment decomposition query→first-byte→decoded→painted with a
  bounded instrument mini-review since the gate passed; one release-class Polygons calibration
  cell on a declared third "measure build" class before any budget-vs-reality ruling).
- P3 LANDED @ b546bad (machinery modules + arm switch, built NOT wired — the worker's honest
  boundary; 61 new tests). P3w LANDED @ 490e771 (WIRED end-to-end: arm-selected construction
  with baseline shape-identical; tile ingest/dedupe/eviction/over-budget state; harness --arm
  candidate live). **Candidate smoke evidence: 24 tile streams on fit; 20/21 ingest lines with
  non-zero duplicatesDropped; all exits green; fresh-session regression 13/13.** Two live-found
  fixes in scope: the anchor-bootstrap query ran UNBOUNDED (whole-dataset fetch — a real
  candidate defect, cancelled at frame-establishment now); a dist-clean name collision renamed.
  A9' flake A/B-verified pre-existing (cold-launch class, action-console workstream's).
- Sequencing ahead: P3i (segments + tile counters into the instrument, then the bounded
  mini-review) → P3r (measure build) → P4 (over-budget contract, wording on sight) → reviewer +
  architect gates on the P3 complex → candidate campaign (P6). Both pushed through 490e771.
- P3i LANDED @ 3eca781 (spans telescope EXACTLY on every row; identity guard re-PASS; smokes
  already show the attribution shape: baseline small-fixture paint-dominated 45/66.7ms vs
  candidate Polygons byte-dominated 171/187.6ms — finding-4's per-tile cost on the client
  clock). MINI-REVIEW (human-directed): **NOT FIT AS-IS — 4 blockers**: (1) divergence claim
  inverted (telescoping is structural; fix the doc, not the sum); (2) refused-then-accepted
  case mislabels batch #2 transport+decode as paint — THE attribution corruption the review
  existed to catch; needs a mixed-case boolean; (3) segments lack the evidence-level proxy
  disclosure (INPUT_TO_PRESENT pattern); (4) identity-guard coverage never reaches
  candidate-arm record points (§8 admissibility gap, P3w-widened) — extend the guard to the
  candidate arm or declare per-cell. +suggestions 5-8, nits. Q3/Q4/Q5 clean (off-path inert;
  gated quantities untouched — prior cells comparable; citations verified).
- P3i-b (the four blockers + suggestions) HOLDS until P3r lands — both need
  residency-harness.mjs (the concurrent-edit lesson). P3r in flight.
- P3r LANDED @ 37af344 (the measure build EXISTS and STREAMS — packaged origin holds; third
  build class stamped; one gap: the instrument's internal DEV gate). P3i-b LANDED @ 2ad3f16
  (all four blockers + suggestions; mixed-batch flag; segments disclosure; dual-arm guard —
  candidate cycle VACUOUS-disclosed). P3i-c LANDED @ 0c66144 (gates → isInstrumentedBuild,
  DCE survives; candidate managers emit render-trace — 3,252 real lines). Identity saga end
  (@ ce75669): candidate all-six-pairs FAIL exposed arm-intrinsic ordering (OFF-vs-OFF differs;
  custodian multiset check: all four runs' 3,252-line multisets BYTE-IDENTICAL) → Amendment 17
  (multiset criterion for candidate, exact-sequence stays baseline) + flat 600s guard watchdog
  (two per-step formulas understated legitimate chattiness — mine included). **BOTH ARMS PASS
  LIVE. The instrument is fit on all three build classes and both arms.** Measure build's
  instrumented smoke green (readback true, segments populated).
- P4 (over-budget contract UI per 24(a)/(b), wording drafted for the human's sight at the PR):
  dispatched.
- P4 LANDED @ 536d1f4 (strings as drafted; banner-impossibility by test; alarm-red tone note
  for Part K). COMPLEX REVIEW: FAILS — M1-M4 (stale-generation Apply; dedupe/eviction feature
  loss; NaN reserved-key eviction; double debounce = +120ms candidate handicap) + S1-S8.
  P5f @ 5c81328 (all M+S). Amendments 18-19 @ f437af7 (over-budget determinism pre-decided;
  P2 baseline SUPERSEDED for comparison — the campaign re-runs baseline same-session).
  P5g @ 68543f4 (click mechanism honest; convicted per-batch full rebuilds + 200k bootstrap).
  P5h @ 26c5aa5 (coalesced renders; 10k bootstrap — open-drain 70-121s → ~8s; FIRST clean full
  candidate trial; pan-northeast BIMODAL no-batch vs 172s).
- RE-REVIEW: passes-after — B1 NEW blocker (cascade eviction blanks protected viewport tiles;
  counters under-report) + S4-9/N19-20; frame-drift hypothesis planted (clustered bootstrap →
  small baseSpan → covering explosion — may explain the 172s, testable via A21's gridFrame
  recording). ARCHITECT GATE: **BLOCK narrow** — Defect A (partiality not durable; "Showing
  all N" over truncated sets — rule-5 staleness), Defect B (hover dead under candidate —
  silently null, the 24(c)-forbidden shape), **24(c) NEVER IMPLEMENTED** (the fix rounds
  consumed its phase slot — custodian's sequencing miss, architect-confirmed); pan-northeast
  ruling: option (a) trace v3 by rule; 7 campaign incoherences named. Amendments 20-21 +
  ADR-028 architect clarifications filed @ 7d82a5d (rules 1/3/6 PASS formally; class-1
  ephemerality PASS; C1-C4 held everywhere).
- P6a LANDED @ b322a13 (all convictions; 24(c) real: 2px declared threshold, arm-independent,
  typed refusal; first frame-drift datum — camera reaches ~3,020 units OUTSIDE the frozen
  25,347-unit frame). ARCHITECT RE-VERIFY: conditions remain, ONE narrow (bootstrap
  "Showing all 10,000" before any plan — the falsehood-class sibling; sentinel + bootstrap
  partial-by-terminal prescribed) + obligations (cancel rejections logged; 24(c)
  style-dependence declared; headroom tightened). Trace-v3 work permitted parallel.
  CODE RE-VERIFY: passes-after, ONE blocker (partial is STICKY — refetch admits rows but the
  flag never clears in place → eternal re-stream deduped to nothing; fix: clear on untrimmed
  Completed terminal) + nits (pixelsPerMetreAtZoom misnomer; self-suppressor; onTerminal
  double-throw) + Defect-B's candidate-hover has NO live evidence lane (E2E gap) + **the 24(c)
  string joins the human's wording-on-sight bundle at the PR**.
- P6b (sentinel + bootstrap terminals + cancel logging + headroom 0.9) and P6c (trace v3 +
  step-6 evidence + no-batch=trace-defect) DISPATCHED PARALLEL (disjoint files). P6d queued
  behind P6b: sticky-partial exit + the three nits + a candidate-hover E2E step.
- P6b @ e62b107 (lift condition closed with DIFFERENTIAL proof — stash-compared; 4th unlisted
  cancel site fixed). P6c @ 597c160 (trace v3 exact to the pixel; Amendment 20's prediction
  CONFIRMED first run — step 6 data-bearing, 967ms, no defect). P6d @ 238de01+f53176d
  (lifecycle exit walked end-to-end; hover live: id 6430 above-threshold; wire-only settle
  quiescence — 10/11 steps settle at real fan-out; Polygons candidate smoke EXIT=0 all steps).
  **BOTH GATES' conditional verdicts SATISFIED per their own terms** (prescriptions implemented
  exactly, with the demanded tests — the admission-cut precedent; recorded, no third
  round-trip). Residuals to the campaign: small-fixture 323-stream settle saturation
  (candidate smokes declared Polygons-only); zoom-out-1 straggler (one datum).
- P7 @ acdfad0 (the sweep selector — the campaign's last wire; default=medium found implicit
  and made explicit). FIRST SWEEP DATUM: **coarse SLOWER than fine** (15-tile pan blew 60s at
  coarse; fine's 27+198-tile pans clean) — finding-4's shape per-tile; if coarse invalidates
  systematically at the locked bound, that IS the sweep's result (no watchdog raised).
  **MACHINE-SIDE COMPLETE. The session ask goes to the human**: full factorial ≈ 4.5-5h;
  options (one sitting / multi-sitting amendment / screening-n reading ≈ 2-2.5h, recommended);
  the wording bundle (three 24(b) strings + the 24(c) refusal line) for sight.
- P6a (Defects A+B, 24(c), B1, S4-9, N19-20 — the final product round): dispatched @ 180min.
  After it: both gates re-verify → trace-v3 harness implementation → full-protocol dry-run →
  the human's dual-arm session (fresh baseline + candidate sweep + calibration cell).
  NOTE the citation-overclaim class hit its FIFTH occurrence (a comment overclaiming a test);
  the memory entry stands; every brief now carries the rule.
- **2026-09-02 — gate-8 ruling received: (d) accept, with the two tail mechanisms as named
  binding debt in ADR-028 (the ADR-021-condition pattern); rider: ADR-028's own acceptance is
  NOT discharged by this ruling, pending Part K + the deferred 5 GB G1/G2 cells.** Applied:
  ADR-028 gate-8 written answer appended (both campaigns' gate-by-gate evidence, the two
  mechanisms named by direct per-step attribution, the ruling and rider recorded verbatim,
  Status line left Proposed per the rider); DECISIONS-PENDING.md gains a new resolved entry
  recording the ruling. Walkthrough Part K written + queued (blank log, rule 11) —
  `frontends/shell/MANUAL-WALKTHROUGH.md`: operator judgments on the declared-partial-view
  status's legibility, the sub-pixel hover refusal's tone, zoom-to-layer admission-window churn
  FEEL (the G4 tail as a human experience, ADR-018 no-figure discipline), and the flagged
  `.residency-status` alarm-red-on-within-budget tone question (P4's off-scope note, put to the
  operator rather than silently resolved). PR assembly next; per rule 11 the natural sitting
  bundles Part K + the deferred 5 GB G1/G2 cells + any other accumulated walkthrough parts —
  estimated duration reported to the human separately for scheduling.
- **2026-09-02 — reviewer + architect quick pass over P9+P10 (`c796ba7~1..0e4449c`,
  `buildLayers.ts`/`buildLayers.test.ts`), the outstanding machine-side item 4.** Architect:
  **pass with notes** — C1/C2/C3 clean, no ADR-010 rule-5 (superseded-batch) violation on two
  independent grounds (batch list re-read from resident set every render; `ResidentBatch` never
  mutated in place), N1-N4 non-blocking (add rule-5 citation + the immutability invariant's name
  to the comment; cite evidence filenames inline; cross-arm confound already disclosed; no
  ADR-011 overreach). Reviewer: **one BLOCKING finding** — the new per-tile geometry cache
  retains a THIRD `[x,y]` coordinate copy per resident vertex (on top of the two
  `MAX_RESIDENT_VERTICES`'s own comment already accounted for), unmeasured, with the candidate
  arm's own high-water mark already AT the ceiling (1,997,834/2,000,000) — a real cost sitting
  behind a ceiling whose declared derivation (ADR-010 rule 6: "declared, not discovered") no
  longer matched the code. **Fixed @ `7e86928`**, comment-only (verified: every changed diff
  line is a comment line) — `limits.ts` and `buildLayers.ts` now name the third copy and its
  unmeasured heap delta honestly, and correct `limits.ts`'s stale "does not start tiling" claim
  (predates the candidate arm). **The measurement gap itself stays open, named debt** — not
  folded into ADR-028's own two named mechanisms (a different question: memory footprint, not
  frame-time tail), disclosed in the PR for the human's awareness. Reviewer also filed 3
  non-blocking suggestions (a same-call two-batch collision test; outline-invalidation test
  coverage; a doc line naming the single-frame assumption) and 3 nits (the fixed overclaim; a
  `readonly` type-tightening; comment-length/staleness cleanup) — none fixed, all disclosed,
  future-work scoped, not this dispatch's (no code dispatch beyond the one comment fix, per the
  human's own "no code dispatch unless (c)" instruction).
- **2026-09-02 — autonomous-loop tick found PR #16's DCO check red (3 pre-existing commits,
  `de67713`/`8211723`/`0e4449c`, none from this dispatch); filed as entry 26, notified the human,
  took no destructive action.** Human's ruling: **no rewrite** — the hashes are load-bearing
  measurement-chain provenance, resolved the entry-15 way instead. **Applied:** PR #16 comment
  carries the human's own retroactive DCO 1.1 certification verbatim; `PRE-PUBLIC-CHECKLIST.md`
  §6 gains a matching note beside entry 15's; the check itself stays red by design. **Class fix:**
  `AI_DEVELOPMENT.md` Custodian mechanics item 12 (headed-measurement-session commits named as
  the specific `-s` gap) + a new committed `.githooks/commit-msg` hook
  (`git config core.hooksPath .githooks`, `CONTRIBUTING.md`), tested against both a signed and
  unsigned sample message. DECISIONS-PENDING entry 26 moved to Resolved. Does not gate the merge
  or the gate-8 work.
- **2026-09-02 — BUILD PINNED for the Part K + 5GB G1/G2 sitting: `c58e2bfa11abfd0decc28ab7654a1266967494b8`
  (`cut/viewport-residency` tip, pushed, PR #16).** Human's own instruction: "hold all code
  dispatches on this branch until the sitting is done, so the session measures what the PR
  merges." **Binding until the sitting completes:** no further commits to `cut/viewport-residency`
  (code or docs) — the sitting brief (`SITTING-BRIEF-partK-5gb.md`, repo root, untracked, same
  convention as `NEXT-CUT.md`) is being written now and references this exact hash throughout.
  Anything that would otherwise be dispatched (e.g. entry 25's heap measurement) waits behind the
  sitting.
- **2026-09-02 — sitting brief written** (`SITTING-BRIEF-partK-5gb.md`, repo root, untracked,
  synced to the main checkout). Ordered agenda (Block A: Part K, human-driven, ~15-25 min; Block
  B: the deferred 5 GB G1/G2 cells, custodian-run via the harness, ~15-40 min, first-attempt
  territory — never tried against candidate arm before; Block C: wrap-up, ~10 min), pre-check
  list, Part K's full text + blank result log reproduced inline, the exact 5 GB
  `residency-harness.mjs` invocation, G1/G2 quoted verbatim from RESIDENCY-PREREGISTRATION.md
  §2d. **Total estimate: budget 90 minutes** (best case ~40-55 min; realistic ~55-85 min; with
  one 5 GB retry ~85-115 min — grounded in the harness's own declared bounds, not a guess: 150s
  per-step × 12 steps = 30 min outer-watchdog ceiling per attempt). Confirmed this session: 5 GB
  fixture present and correctly sized in the MAIN checkout (`C:\dev\spatial-ide\target\...`, not
  this worktree — worktrees don't share `target/`, and the fixture is NOT regenerable by any
  documented command); CI green on the pinned commit. The brief instructs running from the main
  checkout (warm build cache, the fixture already there) rather than a fresh worktree. Awaiting
  the human's "I'm sitting down."
- **2026-09-02 — pan-west design seed recorded, per the human's direct instruction.** ADR-028
  gains a dated "Design seed" section (a candidate replacement for `buildLayers.ts`'s
  batch-object-identity keying: request-identity keying — open-generation, tile ID + grid frame,
  filter predicate identity, render origin, geometry-affecting style revision per ADR-022 — gated
  by a completed-untrimmed flag; partial/trimmed tiles stay identity-keyed, Amendment 18's own
  nondeterminism makes them semantically unkeyable; no content hashing on the hot path, no wire
  change, a producer-minted etag named as the escalation path needing its own SKP ADR).
  ADR-011 gains a two-sentence cross-reference near item 4, not a duplicate. **Diagnosis pass run
  this session** (the design's own scheduling precondition): the P10 evidence files (all seven,
  still present) carry only aggregate per-step counters, zero per-tile trim-status breakdown —
  **the recoverable-vs-unrecoverable fraction is NOT answerable from existing evidence**, recorded
  as a genuinely open precondition, not assumed answered; the exact hook a future instrumented
  pass would read is named (`tileIngest.ts`'s `trimmed` computation, `TileResidentSet`'s sticky
  `partial` flag). Zoom-to-layer's tail explicitly excluded from this seed's scope (different
  mechanism, different lever) — matches the human's own instruction exactly.
  **Committed locally @ `32defc0` (on top of the pinned `c58e2bf`) but NOT pushed** — the build
  freeze covers this too (a docs-only commit still moves the branch tip past the pinned hash the
  sitting is meant to measure). Ships with the sitting's own wrap-up push, not before.
- **2026-09-02 — PIN UPDATED, human's direct instruction at sitting-start: pushed `32defc0` to
  origin NOW rather than holding it** ("nothing exists in only one place across a context
  switch" — the standing lesson from a prior lost-commit incident). Origin `cut/viewport-
  residency` confirmed @ `32defc0fd3da7add69d07b94ff2daf842be18968` (`git ls-remote`). **The pin
  is now `32defc0`, not `c58e2bf`** — updated everywhere it was written (`SITTING-BRIEF-
  partK-5gb.md`'s three references, this ledger). Safe to fold in: `git diff --stat
  c58e2bf..32defc0` touches only `docs/adr/ADR-011-*.md`/`ADR-028-*.md`, zero code, so CI's
  PASS at `c58e2bf` still describes the actual built application at `32defc0` byte-for-byte.
  **Standing rule reaffirmed, both directions: no force-push from either checkout, ever.**
  Exiting the worktree now (kept, not removed) to run the sitting directly in the main checkout —
  the pre-checks (HEAD matches `32defc0`, porcelain clean except by-design untracked files,
  fixture hashes verified) run first, before anything else, per the human's own condition.
- **2026-09-02 — Track 2 (the decision-queue batch, run parallel to the sitting) resolved
  entry 25 here: heap-footprint measurement folds into the next campaign's instrument, no
  standalone session.** Committed locally @ `d1e7aef` (on top of the pinned `32defc0`), **NOT
  PUSHED** — same freeze. The other eight Track-2 entries (3, 6, 7, 9, 10, 11, 16, 23) apply
  against `main` on a separate worktree (`decision-queue-batch`, branch
  `worktree-decision-queue-batch`, 3 commits, also held not pushed) — unrelated to this cut's own
  branch, noted here only because entry 25 specifically lived in this branch's own queue. See
  that worktree's own commits for the full batch; not duplicated here.
- **2026-09-02 — THE SITTING CLOSED. Block A (Part K) + Block B (the 5 GB G1/G2 cells) both
  run, both written up, ADR-011 gate 8 MET, ADR-028 ACCEPTED.** Block A: Part K's full result
  log transferred into `MANUAL-WALKTHROUGH.md` (K1-K6, two findings flagged — K4's middle-gaps,
  resolved by Block B's own zoom-to-layer finding; K6's sub-pixel-hover staleness, a real open
  defect, not fixed this sitting). Block B: one candidate-arm/fine trial against the 5 GB fixture,
  first-ever attempt at this exact combination, valid (`invalidated: false`), written up in
  `RESULTS.md`'s new "The 5 GB G1/G2 cells — 2026-09-02 (P12)" section — **G2 PASS** (zero
  error-shaped refusals anywhere in the trace, direct assertion); **G1 supported-not-established**
  (instrument gap, no rendered-⊆-authoritative check exists, future addition, no re-run).
  **New complete finding**: `zoom-to-layer` never reached quiescence within its 150s per-step
  bound at 5 GB (`calmed: false`, `armDisarmedCleanly: false`) — the same admission-window
  mechanism named at Polygons scale, recalibrated: at 5 GB "the viewport IS the dataset" so no
  cache pacing can shorten it; filed against the LOD slice's own future problem statement by
  name, not the ADR-011 tiling line's binding debt. The 16362-vs-11425 status-text/resident-count
  discrepancy resolved by code-reading only (two sequential reads of a still-churning count, not
  a bug) — `residency-harness.mjs`/`App.tsx` cited exactly in `RESULTS.md` §6.
  **The gate-8 rider is discharged**: neither condition fired (no refusal reachable; the partial
  view read as legible, not illegible) — ADR-028's Status line moved to **Accepted**, its own
  "Acceptance discharged" section records both halves; ADR-011's gate 8 marked **MET** (gates 1-7
  remain entirely open, unmeasured — this closes gate 8 alone).
  **Committed, this worktree**: RESULTS.md P12 section, ADR-028 acceptance, ADR-011 gate-8-met
  note, MANUAL-WALKTHROUGH.md's Part K transfer — pushed immediately (the freeze's own rationale,
  "measure what the PR merges," is satisfied now that the measurement is done; per the same
  "nothing exists in only one place" principle already applied to the design seed). Entry 25's
  own resolution (`d1e7aef`) ships in the same push. `SITTING-BRIEF-partK-5gb.md` deleted per its
  own "after the sitting" instruction — its content is now fully in `MANUAL-WALKTHROUGH.md` and
  `RESULTS.md`, the durable homes.
- **2026-09-02 — post-close operator follow-up: hand-explored the same candidate-arm 5 GB
  session, found the plateau figure matches `zoom-out-1`'s own resident count exactly, and
  reframed the zoom-to-layer non-settle finding.** `MANUAL-WALKTHROUGH.md` gains a "5 GB
  addendum" bullet after K6 (verbatim operator quote — dead-button feel, plateau at 19,089,
  Cancel/escape confirmed felt, counter-ticking confirms the two-snapshots reading). `RESULTS.md`
  §3 (G2) gains an operator-confirmed cancel-felt-at-scale note; §5 gains an appended (not
  rewritten) "operator follow-up" paragraph that **partly corrects** the earlier "pacing can't
  fix it" framing — the felt shape is work-yield mismatch (budget saturates in seconds, the
  remaining ~140s+ is spent on queued tiles provably non-contributing under distance-ordered
  eviction), not raw proportional-to-dataset slowness. **A second design seed filed**
  (`RESULTS.md`, "futility pruning + a quiescent-partial signal") — pruning tiles beyond a
  saturated eviction frontier and declaring the partial view quiescent-settled once nothing
  outstanding could still change it; filed against the ADR-011 tiling line (distinct from the LOD
  slice the raw finding stays filed against), with an explicit, unmet precondition (verify the
  eviction-frontier argument against actual eviction ordering in code) before anyone builds it.
  ADR-028 gains a short cross-reference to it, matching the pan-west seed's own point-don't-
  duplicate treatment. No re-runs, no further probing — code-grounded reasoning and the
  operator's own live evidence only.
- **2026-09-02 — ARCHITECT CONSULT for the next cut returned, and it CORRECTS the futility-
  pruning seed's own premise: checked against the real eviction code, it does not hold.**
  Dispatched per the human's own direction (debt slice before LOD slice). Four code-grounded
  findings: admission is arrival-ordered, not distance-ordered; distance ordering governs only
  non-covering tiles (nearly empty at fit-to-extent); during over-budget the protected set
  collapses to complete tiles only, leaving partial covering tiles evictable — **a second,
  undeclared exception to ADR-028's "never evict a tile intersecting the viewport,"** genuinely
  new, not decided by this entry; the camera-change recheck always passes zero incoming vertices,
  so it reduces to a pure partiality test, wiring partiality and budget exhaustion to one flag.
  **The 150-second window is a held, uncancelled queue** (`drainQueueIfRoom` refuses to drain
  while over budget, nothing resumes it without a camera change) — a `docs/01` principle 7 item,
  not a perf optimization. **Corrected, appended (not rewritten) in both `RESULTS.md`'s own
  design-seed subsection and ADR-028's cross-reference to it.** The architect also: confirmed
  debt-before-LOD sequencing on a stronger ground than "cheap first" (measuring LOD against a
  contaminated baseline is the G7 anti-cherry-pick argument one level up); found candidate 1 is
  NOT one cut — recommends splitting into 1a (diagnosis, spike-shaped, answers both unmet
  preconditions — the reframed queue-disposition question and pan-west's own recoverable
  fraction) and 1b (fixes, scoped after 1a); flagged that a renderer-side LOD slice may be aimed
  at the wrong module (P12's own counters point at the query/producer side, not client paint);
  named four LOD problem-statement questions (which architecture, where the reduction happens,
  what honesty contract, is it scorable) and recommended block-on-sight conditions L1-L7; flagged
  LOD is not on docs/07's own critical path (a self-chosen quality bar, not a roadmap item — worth
  weighing against ADR-009's own open public-flip gate); flagged the 5 GB fixture as a single
  point of failure (not regenerable); flagged ADR-029 already claims that number in the unpushed
  `decision-queue-batch`/PR #17, so a LOD ADR would be 030. **Presented to the human in full,
  alongside the correction, before any merge or brief-writing proceeds.**
- **2026-09-02 — three rulings received and applied: ADR-028 ACCEPTED, the consult adopted in
  full, the 5 GB fixture's SPOF ordered fixed.** (1) ADR-028's Status confirmed Accepted per the
  human's own (d) ruling; finding 3 (the second undeclared eviction exception) reframed from
  "queued, undecided" to a named open item with an explicit resolution path (decided from 1a's
  evidence, due at 1b) -- applied to both ADR-028 and RESULTS.md, kept in sync. Merge is the
  human's own click for both PR #16 and PR #17 -- not the custodian's, standing restriction.
  (2) The consult's own recommendations adopted in full and recorded in DECISIONS-PENDING.md:
  1a's three-question diagnosis scope, 1b owning the held-queue fix outright plus whatever else
  1a justifies, LOD's problem statement drafted only after 1a including the wrong-module check.
  (3) Correction to my own earlier "not regenerable" framing: dispatched research found the 5 GB
  fixture is in fact deterministically regenerable -- kernel/tests/scale_pass.rs, one documented
  command, a fully pinned spec, confirmed byte-identical across two independent generations
  already on record (kernel/CANCEL-RESCORE-PREREGISTRATION.md). New canonical registry
  kernel/FIXTURES.md consolidates this rather than leaving it scattered across two
  preregistration docs, both of which now cross-reference it. Second-physical-location backup
  left open -- the human's own target location, not picked unprompted; two local drives (C:, G:)
  both have enough free space if a local copy is what's wanted, reported not decided.

---

## SESSION-CONTINUITY (2026-09-02, context-exhaustion flush — written at the human's direction)

**Exact position:** P10 re-measure LANDED @ `0e4449c` (pushed; branch tip = origin). RESULTS.md's
Amendment-23 section written by the tester. Verdicts: **G7 PASS 46.1%** (candidate cold-view p95
257.8ms vs baseline 558.8ms, ~2.2×, stable across both campaigns); **G3 per-class as recorded**
(zoom-in/zoom-out flipped decisively to candidate, paint −85%/−93%; pan median candidate, pan tail
baseline; fit/zoom-to-layer structurally uncomparable — baseline no-batch there); **G4 FAIL —
median 1.12× near-parity (was 2.3×), tail 3.70× (was 1.81×)** with TWO NAMED MECHANISMS:
(1) zoom-to-layer's sustained new-tile admission window (83 first-time admissions, all 7 trials);
(2) pan-west's large-batch re-admission spike (5/7 trials). The baseline itself gained ~75% frame-
time improvement from the shared buildLayers fix (P9) — that windfall ships REGARDLESS of the
ruling. 17/17 trials valid first-attempt, zero re-runs, ~39 min session. Calibration: measure
build ≈ 41% of dev cost (n=1). Identity guard passed both arms at declared config, non-vacuous
(candidate tilesRequested=2344).

**Human-side (blocks the harvest): RESOLVED 2026-09-02.** Options were presented 2026-09-01:
(a) accept as-is; (b) reject; (c) iterate the two tails; **(d) accept with the two tail
mechanisms as named binding debt (custodian recommendation — the ADR-021 condition pattern)**.
**The human chose (d)**, with a rider: ADR-028's own acceptance is NOT discharged by this
ruling — it waits on walkthrough Part K + the deferred 5 GB G1/G2 cells, and reopens if either
contradicts the accept-class reading. Both recorded verbatim in ADR-028's new gate-8 section.
Separately, at the PR: the wording-on-sight bundle was ALREADY DISCHARGED before this ruling
(Amendment 22 recorded the human's "wording approved" for the three 24(b) strings + the 24(c)
refusal line) — nothing further needed there unless the human edits.

**Machine-side (after the ruling):** (1) **DONE** — the gate-8 WRITTEN ANSWER appended to
ADR-028 (both campaigns' evidence summarized gate-by-gate; the two mechanisms named by direct
per-step attribution; the ruling and rider recorded verbatim; Status line left Proposed per the
rider); (2) **DONE** — walkthrough Part K written + queued (blank log; operator judgments: the
partial-view status's legibility at over-budget; the hover pick-refusal's tone; churn FEEL
during zoom-to-layer's admission window — the G4 tail as a human experience; NOTE:
`.residency-status` CSS is alarm-red even for the within-budget "Showing all N" variant — P4's
off-scope tone question, put it to the operator); (3) **STILL OPEN, human's headed session** —
the deferred 5 GB reported-only cells (G1/G2 evidence at scale — Amendment 12 bounds; now
bundled with Part K per rule 11, estimate reported separately); (4) reviewer/architect quick
passes over P9+P10 — the ruling IS accept-class, so this applies, dispatching next; (5) the PR
(disclosures accumulated in the architect-gate report + ledger); (6) rule-10 archives at close.

**Recommended next dispatch (one line):** on the human's ruling, a doc worker writes ADR-028's
gate-8 answer + Part K, then the PR assembles — no code dispatch unless the ruling is (c).

**Headed-sitting duration estimate (2026-09-02, for the human's scheduling — a scheduling
estimate, not a product measurement; ADR-018's no-figure discipline governs client-clock product
claims, not this)):** Part K, ~15-20 min (6 short steps; no remediation forms; two console
commands to switch arm/tile-level plus two app reloads; time mostly spent reading and recording
the judgment questions, matching the pace of earlier short Parts like D). The deferred 5 GB
G1/G2 cells, ~30-60 min — this repeats the existing Amendment-12/22 bound (SESSION-CONTINUITY's
own prior estimate above), not a fresh number; it is genuinely unmeasured ground (both P2 5 GB
attempts were structurally invalid, never completed) so the range is wider than Part K's own.
Plus ~10-15 min fixed overhead (RustDesk-absence verification per decision 24(g) — the 5 GB half
requires the physical machine, so the whole sitting runs there; stale-process sweep; fixture
pre-hash). **No other walkthrough parts are currently queued** — Parts A-J are all already run;
"any accumulated parts" in rule 11's own bundling language is forward cover for anything that
queues before the sitting happens, not a known backlog today. **Total: roughly 55-95 minutes,
call it about an hour to an hour and a half.**

**Un-filed knowledge, now filed:**
- **Pan-west hypothesis (unverified):** the re-admission spike may be the planner re-requesting
  tiles evicted/partial-marked on the outbound legs once pan-west returns across previously
  visited territory — possibly interacting with HEADROOM_REFETCH_FRACTION=0.9 (P6b): headroom
  reopens mid-pan, a burst of re-fetches lands as one large admission. Diagnosis route: the
  per-step evidence's tilesRequested/evictions + the segments; NOT diagnosed, a hypothesis only.
- **Zoom-out-1 straggler (P6d, one datum):** did NOT recur in P10's 17 valid trials — treat as
  resolved-by-evidence unless it reappears.
- **Coarse-level finding:** coarse systematically invalidates at the locked 60s bound (P8
  screening 1/3 valid; P7's first datum) — large-bbox per-tile queries pay finding-4's cost.
  This is sweep DATA, recorded in RESULTS.md; never rescued by a bound raise.
- **Identity-at-scale sensitivity (P9 worker's over-scoped run):** multiset identity FAILS at
  the Polygons fixture — plausibly run-to-run tile-set variation at scale (realized camera ×
  grid interactions), NOT instrument state. The guard's declared config (small fixture) is the
  binding one and passes. If anyone proposes scaling the guard's fixture, this is the known rock.
- **Unresolved discrepancy (low stakes):** P9's worker claimed tileViewportStreamManager/
  candidateArmSession "never call traceViewportQuery/traceStreamIssued", contradicting P3i-c's
  record (which added them; P10's non-vacuous guard supports P3i-c). Likely a worker grep miss
  (emissions may live in a helper) — verify with one grep before citing either way.
- **Part K + batch bundling:** the human suggested nothing, but the natural sitting bundles
  Part K + the 5 GB deferred cells + any accumulated walkthrough parts (rule 11).
- **The citation-fabrication class hit 5 occurrences** this cut (memory file
  `worker-citation-fabrication.md` exists; the mechanized scan covers harness/instrument files
  only — comments about TESTS are uncovered, which is where occurrence 5 lived).
- **Queue state:** entries 7/9/16/23 + ADR-022/024/025/027 acceptances + ADR-009 go/no-go set
  remain open with the human, none blocking this cut.
