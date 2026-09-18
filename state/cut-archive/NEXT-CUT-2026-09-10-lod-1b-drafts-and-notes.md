# NEXT-CUT — draft brief, viewport-residency debt slice (1b) and the LOD slice (ADR-031 — renumbered 2026-09-08 on the human's ruling: ADR-030 is the conveyed-artifact notice-set decision)

**DRAFT — updated 2026-09-03 after the human's rulings batch.** Written after the
viewport-residency cut closed (`.cut-archive/CUT-STATE-viewport-residency.md`) and the 1a
diagnosis spike returned (`spikes/viewport-residency-1a-diagnosis/README.md`). Rulings received
and applied: **entry 27 resolved (i)** — finding 3 declared intended via ADR-028 Amendment 1
(reopen condition: visible in-viewport holes attributable to partial-covering eviction reopen it
as a defect); **entry 28 resolved (a) and COMPLETED** — the attribution pass returned same day
("upstream of paint" grounded; renderer-side LOD rejected as the minor cost pool — see the LOD
context below); **Q4 ruled** (see its own section). Nothing below is scheduled or preregistered
yet. **With the pass's answer in, both halves of this brief are ready for the human's
finalization sight.**

## What's settled coming in

- ADR-028 Accepted, ADR-011 gate 8 MET. Two Polygons-scale mechanisms (zoom-to-layer's admission
  window; pan-west's re-admission spike) are named binding debt on the ADR-011 tiling/LOD line —
  neither may be dropped from this cut's scope without comment (ADR-021-condition pattern).
- The debt-slice-before-LOD sequencing is architect-confirmed on a stronger ground than "cheap
  first": measuring LOD against today's client state-machine (held queue, partiality/budget
  coupling, an unprotected-partial eviction gap) would measure it against a contaminated baseline
  — the G7 anti-cherry-pick argument one level up (consult `a8f4c2c0cb1ff80ed`).
- 1a (this cut's own diagnosis spike, no gate, no product code touched) has returned. Full findings:
  `spikes/viewport-residency-1a-diagnosis/README.md`. Headlines: the held queue is confirmed real
  and confirmed reachable only by an all-or-nothing Cancel, not a scoped one (docs/01 principle 7
  gap); finding 3's mechanism is precisely traced but its severity (thrash frequency) is not
  determinable without a runtime trace; pan-west's recoverable fraction leans low on a structural
  argument but remains genuinely unmeasured, matching the design seed's own prior conclusion.

## 1b — draft scope (debt slice)

Not preregistered. Presented for the human's ruling; DECISIONS-PENDING entry 27 (finding 3) must
resolve before Item below can be scoped precisely, since the fix-vs-amendment choice changes what
Item's own acceptance criteria are.

- **Item A — scoped cancellation + progress-reporting for the held queue.** Cut-shaped now
  (1a's Q1 answered this fully). A `docs/01` principle 7 obligation, independent of the other
  items below. What's owed: a way to relieve the held backlog without disabling all future tiling
  (today's only lever, `TileViewportStreamManager.stop()`, is permanent — no reset method exists),
  and a status signal distinguishing "actively progressing" from "queued and structurally stalled
  until a pan happens." Block-on-sight (architect consult, §3): no tile may be dropped without
  being reported — distinguishable from cancelling in the status, matching this module's own
  existing discipline for rejected cancels (`tileViewportStreamManager.ts:124-129`). Explicitly
  **not** decided by Item A: whether the partiality/budget-flag coupling at
  `WorkingCanvas.tsx:1112-1119` is itself a defect or declared behaviour — that is entry 27's own
  question, adjacent but distinct.
- **Item B — the settled-partial signal.** Cannot be built before Item A lands (declaring
  "settled" while streams are still in flight or queued would be false — the same falsehood class
  this cut's architect gate already convicted twice: Defect A's "Showing all N" over truncated
  sets, the bootstrap "Showing all 10,000"). Block-on-sight: the predicate must be a pure function
  with a unit test constructing the reopening case (eviction frees vertices → headroom reopens →
  issuance reopens) and showing it does not read settled. Principle 8 + ADR-010 rule 5 apply
  directly; wording goes to the human on sight (the 24(b) precedent).
- **Item [27] — RESOLVED, drops out of 1b's scope.** The human ruled (i): declared intended via
  ADR-028 Amendment 1, docs only, already applied — no fix item, no re-measure obligation. What
  1b inherits from it is only Item B's own constraint (the settled-partial predicate must account
  for the declared exception reopening headroom) and the standing reopen condition: evidence of
  visible in-viewport holes attributable to partial-covering eviction reopens finding 3 as a
  defect.
- **Item C — K6 hover staleness (DECISIONS-PENDING entry 29, RULED IN 2026-09-03).** The stale
  sub-pixel-hover id readout that persists across zoom-out. Per the human's ruling: a named 1b
  piece with **its own E2E step** (constructing the zoom-out-while-pointer-stationary case and
  asserting the refusal re-evaluates), and an explicit escape hatch — **if it grows beyond small
  once opened, it exits back to the queue** rather than silently expanding 1b.

### Queued measurement / felt-verification work

**Split by the 2026-09-04 amendment to 24(g) (DECISIONS-PENDING): reported-only measured cells may
run UNATTENDED with RustDesk stopped under the proven-safe restore protocol; felt verdicts stay
human-present.**

- **The clean-instrument 5 GB attribution trial** (entry 31 / `ATTRIBUTION-PASS.md` §8):
  candidate/fine/cold, `--per-stream-trace`, on the repaired instrument (Amendments 24-25). Its
  written question — "were the nulls a symptom" — is already answered structurally (§7, yes: a
  design symptom, not the fixed bug; a clean run shows ~10 nulls of 12); the run *demonstrates*
  the per-stream join end-to-end and confirms that prediction. **Reported-only, so it MAY now run
  UNATTENDED** (RustDesk stopped, the restore protocol armed, the "unattended, RustDesk stopped and
  verified absent, display-awake verified" attest string) — **gated on the one-time
  kill-and-restore dry-run passing first**, no longer bound to a human-present sitting.
- **K6's own E2E felt-verification** (Item C) and **the held-queue / settled-partial felt
  re-verdict** (Items A/B): human-present at a headed sitting, unchanged — felt verdicts are not
  in the amendment's carve-out.
- **Request-identity cache keying — NOT scheduled in 1b.** The architect consult's own
  pre-committed threshold: *"Do not schedule it in 1b unless 1a shows a materially recoverable
  fraction."* 1a's Q3 did not show one — it found a structural argument leaning low, explicitly
  not a measurement and not a proof of zero. Applying the consult's own rule to that evidence: this
  item stays off 1b's scope. Not dropped — the precondition (the instrumented pass named in
  ADR-028's own pan-west design seed, or the cheaper coarse `idOwner`-attribution check 1a names)
  remains open and re-deferred with reason, matching the ADR-021-condition discipline. Also
  flagged by the consult: if LOD lands, a decimation level joins this design's own key composition
  — a reason to prefer building it *after* the LOD architecture is chosen, not before, if it is
  ever built at all.
- **Heap footprint measurement — deferred, not folded into 1a.** DECISIONS-PENDING's own resolved
  entry 25 (P9 heap-footprint) worded its fold-in as *"whatever **scored** campaign's client
  instrument next runs."* 1a was a diagnosis pass, not a scored campaign — attaching heap to it
  and calling the debt paid would exceed that ruling. It rides whichever of 1b or a later cut runs
  the next actual scored campaign.

## LOD slice — draft problem statement (ADR-031, home of record — renumbered 2026-09-08; ADR-030 = the notice-set decision)

**Not preregistered. Redrafted producer-side 2026-09-04 and ready for the human's sight; its
scheduling is a separate, deferred call (below).** The one open gap this section used to carry —
DECISIONS-PENDING entry 28's wrong-module check — is CLOSED: #28's attribution pass answered it
(the wall is producer-side), and the candidate set below reflects that. ADR numbering:
`ADR-029-scan-progress-carrier-quantity.md` landed on main via PR #17 — confirmed present at
`docs/adr/ADR-029-scan-progress-carrier-quantity.md` as of this brief — so **ADR-030 is free and
correct** for this slice (the consult's own numbering-collision flag is resolved).

**Context.** ADR-028 records that completeness at overview scales is not delivered and owes its
own gate. ADR-011 gates 1-7 remain unmeasured; its own Context defers quantization until "after LOD
exists." The 5 GB cell recorded `zoom-to-layer` never reaching quiescence within its 150s per-step
bound (`RESULTS.md` §"5 GB G1/G2 cells"). **UPDATED 2026-09-03 — entry 28's ruled attribution
pass has answered the wrong-module question on direct records**
(`spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md`): the 150s window decomposes into
a 150.058s backlog-drain phase (continuous streaming at ~4.4 MB/s, ~65 per-tile terminals at
3-way concurrency, per-tile service 6-17s for data-bearing tiles) plus ~2.1s of
gesture-to-settle; clean client-side segments (decode 0.7-29ms, decode-to-paint 15-501ms) sit
one to two orders of magnitude below time-to-data. **"Upstream of paint" is a grounded finding —
a renderer-side (client decimation) slice would target the minor cost pool.** Still open: the
split within time-to-data between kernel query execution, wire transport, and credit-window
backpressure (inseparable in client-side records; the pass names a harness-only instrumented
design if it ever becomes load-bearing). The earlier "152s/70 tiles" arithmetic and the
"three of twelve nulls" count must not be quoted — both corrected by the pass (the former is a
category error, the latter was 8-of-12-with-2-usable). The live candidate architectures, both
producer-side, are laid out below; client decimation is struck (rejected with reason there).

**Redrafted producer-side, 2026-09-04 (human directive: "redraft producer-side per #28's
attribution before my sight").** #28's attribution pass established, on direct records, that the
5 GB wall is upstream of paint — client-side decimation would reduce the component that is
already the minor cost pool, so **it is struck from the candidate set, not carried as one of
three co-equal options.** The problem statement below is framed around the two producer-side
architectures that remain. Client decimation is recorded once, as explicitly rejected with its
reason, so a future reader does not re-propose it.

**The reduction happens producer-side — the two live candidates:**

- **(P1) Server-side aggregation on `viewport_query`** — the engine returns a reduced/aggregated
  result at overview zooms instead of the full row set. Module owner: engine (05) + protocol
  (04/10); an SKP change, so its first artifact is an ADR proposal (a new `viewport_query`
  shape/parameter is an SKP change even if not a new command — ADR-021 precedent, this cut's own
  L2). ADR-006 class 1 (ephemeral query result) if it computes per-request; class 2 if it
  materializes anything.
- **(P2) Import-time overview tiers** — reduced levels built once at import and read like any
  other layer. Module owner: import path + docs/11. ADR-006 class 2 (workspace mutation,
  transactional), and it drags docs/11 and principle 3's declared-reproducibility grade in with
  it; docs/07 line 22's reopen conditions each require a fresh preregistered gate (this cut's own
  L5 — it may not consume one as a side effect).
- **(REJECTED) Client-side decimation (renderer/shell)** — struck by #28's attribution: the wall
  is producer-side time-to-data (per-tile service 6-17s for data-bearing tiles at 5 GB), one to
  two orders of magnitude above the client segments (decode 0.7-29ms, decode-to-paint 15-501ms).
  Decimating client-side leaves the server delivering the same rows it would decimate. Recorded
  rejected, not re-litigated.

**Minimum problem statement — the four questions (architect consult §4), now that the reduction is
sited producer-side:**

1. **Which of P1 vs P2 (or both, staged)?** The remaining architecture choice — the two above,
   both producer-side, different module owners and ADR-006 classes. The finer kernel-vs-transport
   split within time-to-data (which the attribution pass left open) bears on P1's own design but
   is not needed to choose between P1 and P2; pick the architecture first, measure the split if
   P1's design turns on it.
2. **Where does the reduction happen? ANSWERED — producer-side** (#28's attribution, above). This
   question is closed at module granularity; it is retained here only as the settled premise the
   other three now build on, not as an open choice.
3. **What honesty contract does a reduced view carry?** Principle 8 ("No black boxes") applies
   directly to a decimated geometry as a data transform. ADR-010 rule 2's ordinal → stable id →
   authoritative f64 chain must still resolve; ADR-016 has no referent for an aggregate cell, so
   aggregation changes hover/pick identity semantics (principle 1 applies to what the aggregate
   *is*). ADR-013: a decimated vertex is a different provenance class than a source vertex —
   per-feature weakest-vertex provenance would need to say so.
4. **Is it scorable? RULED, 2026-09-03 — the second exit.** The human's ruling, verbatim: *"the
   new docs/08 scale-class row, landed with its measurement per ADR-011 gate 2, defined as a
   dataset class (feature/vertex brackets), not 'the 5 GB file'; 5 GB assertion-only items
   retained besides."* Consequences for the preregistration when it gets written: the row is
   defined by feature-count/vertex-count brackets so any fixture landing in the class scores
   against it (the current 5 GB parquet is one member, not the definition — no gate may be
   worded against "the 5 GB file" by name); the row lands together with its measurement and
   human sight per ADR-011 gate 2's own mechanism; and the existing 5 GB assertion-only items
   (G1/G2-style direct assertions) are retained alongside the scored row, not replaced by it.

**Recommended block-on-sight conditions (architect consult §4, analogous to this cut's own
C1-C4):**

- **L1** No docs/08 row lands without its measurement and human sight (ADR-011 gate 2).
- **L2** No new `viewport_query` parameter without its own ADR (ADR-021 precedent: a parameter
  shape is an SKP change even when not a new command).
- **L3** No unlabelled reduced geometry — declared in status, any pick it cannot honor refuses by
  name (ADR-028 item 4 precedent, ADR-010 rule 6, principle 8).
- **L4** Single render origin retained — per-tile origins reopen ADR-011 item 6/gate 1, unpayable
  here (ADR-010 rule 3).
- **L5** No import-path change — docs/07 line 22's reopen conditions require a fresh preregistered
  gate, never an amendment; this slice may not consume one as a side effect.
- **L6** ADR-011 gates 1-7 stay open; nothing here may be cited as meeting them, and gate 8's
  answer is not reopened.
- **L7** Anti-cherry-pick: LOD must not regress the step classes the candidate arm just won
  (zoom-in/zoom-out paint −85%/−93%). A fit-view win bought by a zoom regression is the trade G7
  exists to catch, restated for this slice.

**Scheduling — DEFERRED by the human, 2026-09-04, decided after 1b's felt re-verdict, not now.**
Whether this LOD slice runs next at all — and specifically whether it runs ahead of the ADR-009
public-flip gate — is not decided here. The human's directive: the redraft above is for their
sight now; its *scheduling* (LOD vs the public flip) waits until 1b closes and they have the felt
re-verdict from the headed sitting in hand. The consult's §5 framing stands as the input to that
later call: LOD is not on docs/07's own critical path (open gates there are macOS/Linux hardware
validation, the transport bake-off + spatial indexing, and ADR-009; LOD appears only in this
brief's own non-goals and ADR-011's Context) — it is a self-chosen quality bar, weighed against
ADR-009's own open public-flip gate, open since Prototype start. Recorded as the pending input,
not resolved. **Correction to the consult's own text, recorded
here rather than silently carried forward:** its §5 called the 5 GB fixture "not regenerable by any
documented command" — that was true when written but has since been corrected; the fixture is
deterministically regenerable (`kernel/FIXTURES.md`, confirmed byte-identical across two
independent generations). G1 (rendered-⊆-authoritative) remains genuinely unestablished and LOD
makes it harder to ignore — closing it belongs in whichever cut's instrument phase runs next,
cheaply bundled, not a reason to block either slice on its own.

## Open items before this brief can be finalized

- ~~DECISIONS-PENDING #27~~ — **resolved 2026-09-03** (amendment, applied). 1b's scope no longer
  waits on it.
- ~~The attribution pass~~ — **returned 2026-09-03** (`ATTRIBUTION-PASS.md`); its verdict is
  folded into the LOD context above. The brief no longer waits on anything but the human's own
  finalization sight.
- ~~DECISIONS-PENDING #29~~ — **RULED IN 2026-09-03**, K6 is 1b Item C (its own E2E step, growth
  escape-hatch). In 1b's scope above.
- ~~DECISIONS-PENDING #30~~ — **RESOLVED 2026-09-04**: `none-supplied` applied, and its skp
  versioning ruled (stays `skp/0.2`, entry-6 value-domain-widening shape + expiry clause). Landed
  in this cut's own opening commit.
- ~~DECISIONS-PENDING #31~~ — **RESOLVED 2026-09-03**: the three instrument defects fixed, four
  reviewer passes, merged (PR #21); the empirical clean-instrument run is queued for the headed
  sitting (above). Nothing outstanding.
- **The LOD half** is now redrafted producer-side and ready for the human's sight; only its
  *scheduling* is deferred (after 1b's felt re-verdict). The 1b half is dispatched (architect
  design consult out; preregistration/scope to follow from it).

## Queued follow-ups from the 2026-09-06 close-out fix piece (appended by the custodian; not scheduled)

- **Harness: the smoke trace's `fit` step self-invalidates on a strip-anchored candidate frame.**
  On polygons-100k (row-major by id, so the 10k-row first look is a bottom strip and the fit
  anchor is that strip), `fit` issues the capacity cap (515 tiles) whose in-window deliveries are
  ALL duplicates of the first look's own rows → no new pixel → `no-paint` → trial invalid at step
  0 → every later step (incl. `zoom-out-1`, where the F1 assertion is wired) skipped. Two honest
  options: teach the first-pixel rule that a fit whose covering set is already resident is
  "settled, nothing to paint" rather than "no paint"; or start the trace from a view that is not
  the anchor. Either way the F1 assertion needs a run where `zoom-out-1` actually executes.
  Evidence: `e2e-smoke-fix-2.log` (job tmp; CUT-STATE 2026-09-06). Entry-42-adjacent (a
  producer-declared extent would also un-strip the anchor).
- **Entries 46/47** (vite-node explicit devDependency; K6 escape hatch re-asked by the L8
  verdict + the pick-accuracy observation) — the human's rulings, then small named pieces.
- **Amendment 3's clause 5** — once ruled, any future arm comparison across the eviction-policy
  change must declare it; a fresh preregistered gate only if a cut wants to compare across it.

## The LOD call — evidence on the table (assembled 2026-09-06, before the human's L9 re-verdict; L9 slots into §4)

The human asked for entry 40's answer and the Part L verdict "on the table at once". Everything
below is already recorded elsewhere (cited); this section only lays it side by side. Nothing here
decides — the scheduling call (34c's deferred half, the LOD-vs-public-flip ordering) is the human's.

### 1. What the candidate arm does at overview zoom, after the close-out fix (PR #24)
- Over budget with in-view partials unevictable → a STABLE declared partial view: the over-budget
  sentence + "Filling is paused until the next pan or zoom" (held queue) or + string 4 at
  quiescence. Live-observed: 460 tiles held at one zoom-out (`spikes/residency-debt-fix-live-probe`).
  Honest, and exactly ADR-028 24(a)/(b) — but it is the fine grid REFUSING the overview, not
  serving it. Before the fix the same state thrashed (entry 44).
- The fine grid's covering set at overview zoom is in the tens of thousands of cells (15,336
  beyond the 512 cap in the probe; 5,758 in the sitting's own log) — `coveringIndexRange` is
  unbounded, and the frame is derived from a 10k-row first look (a strip on this fixture, entry
  42). Truncation is now spoken (string 6) but not cured.
- The 5 GB wall is producer-side (ATTRIBUTION-PASS.md: time-to-data one to two orders above
  client paint), and entry 40's hang sits in fine-zoom tiling (`spikes/entry40-producer-hang-
  diagnosis`: rank-1 producer-query-hang — the product path never consults the spatial index; no
  cancel-pollable chunk boundary inside `arrow.next()`).

### 2. The two producer-side candidates (this file's LOD section above, unchanged)
- **P1 — server-side aggregation on `viewport_query`** (SKP change, its own ADR). Entry 40's
  LOD-relevance: whether P1's aggregation, unpaired with indexing, STRESSES the hang's path
  harder is labelled conjecture, not code-grounded. Entry 42 (a producer-declared extent in
  `describe`) is a natural rider of the same SKP change.
- **P2 — import-time overview tiers** (ADR-006 class 2, docs/11, its own gate). Entry 40's
  LOD-relevance, code-grounded: P2 replaces the mechanism only for overview-zoom queries; the
  entry-40 hang was recorded in fine-zoom candidate tiling, OUTSIDE P2's scope. So P2 cures the
  overview state in §1 without touching the fine-zoom hang.

### 3. Debts and constraints that ride whichever is chosen
- ADR-028's two named binding-debt mechanisms (pan-west keying; zoom-to-layer admission
  window) — untouched by the fix piece, still owed on the ADR-011 line.
- Entry 40's instrumented producer pass — designed, not run; its single-slot trace ceiling named.
- Amendment 3 clause 5 (once ruled): any arm comparison across the eviction-policy change must
  declare it; a fresh preregistered gate only if a cut compares across it.
- Entry 25 heap footprint rides the next scored campaign; entry 46 (vite-node) and 47 (K6
  escape hatch) are small named pieces, not LOD.
- ADR-011 gates 1-7 remain unmeasured; ADR-011 may not be cited as settled (CLAUDE.md).

### 4. The felt verdict (slot)
- **FINAL L9, 2026-09-07, on the 48-(a) build (PR #28 merged; zoom-out-only re-run, arm proven by
  the session log, zero first-look evictions), verbatim:** *"L9 overall it's better and feels better
  and less clunky now, reactive, non stuck, it feels actually way better"* — this is the verdict that
  closed 1b (rule-10 archive `.cut-archive/CUT-STATE-residency-debt.md`). Carried, not closed:
  entry 47 (hover re-pick on camera settle, next cut — criterion in the human's own words, entry 47
  addendum). The LOD call's §4 input is therefore: the candidate arm at overview zoom is now
  stable-partial with the first look standing (the declared absorbing state), ruled the v0.1
  limitation under flip-first; LOD is the structural cure, scheduled after release engineering.
- Pre-fix L9, verbatim: *"L9 overall better, is just the random rendering and disappearing of
  tiles that leaves me skeptic."*
- Post-fix L2-L9 re-run (2026-09-06, PR #24 merged, arm verified by session log), L9 verbatim:
  *"L9 it's definitely better, though we need to fix the id thing and the rendering when zooming
  out completely with tiles rendered that disappear etc"* — L2-L4 fine, L7/L8 fine, the zoom-out
  text arriving as designed and no cycling; two items remain: entry 47 (K6 re-pick, ruled next
  cut) and entry 48 (the untiled first look evicted wholesale on the first admission — options and
  the close question put to the human). New structural fact from the same run: covering sets
  truncated by 15,810 / 32,559 / **668,545** tiles beyond the 512 cap at full zoom-out — the fine
  grid is unbounded; LOD (coarser levels at overview) is the cure, not a bigger cap.

### 5. The questions the call actually turns on (for the human; the custodian holds no position beyond the recommendation lines already in entries 40/42/44)
1. Is the §1 stable-partial state acceptable as the overview behavior UNTIL LOD, or does LOD
   move ahead of the public flip because of it?
2. P2 first (cures §1's overview state directly, no wire change, its own class-2 gate) vs P1 first
   (one SKP change that can carry entry 42's extent and, with indexing, address entry 40's path)?
3. Does entry 40's empirical pass run BEFORE the LOD architecture is chosen (it discriminates
   producer-hang vs transport, which bears on P1's risk) or ride the LOD cut's own instrument?
- **[RULED 2026-09-06] Entry 47 = (b): "re-pick on camera settle" is a NAMED PIECE on the next
  cut** — one GPU pick per camera-change settle when a hover readout was standing (ADR-010 rule
  6: declared as a re-pick, not discovered), replacing Item C's clear-then-fresh-hover that the
  human judged "cluncky" at L8. The pick-accuracy observation ("shows the ids of nearby features
  but not the one I'm hovering even though is not subpixel") stays recorded verbatim in Part L's
  result log for that piece's own repro — undiagnosed, per the ruling.
- **[RULED 2026-09-06] Entry 46 = (a):** `vite-node` explicit devDependency pinned to vitest's
  version — lands as a one-commit follow-up after PR #24 merges (dev/E2E only).

## Ordering restated by the human, 2026-09-07 (verbatim: "48-(a) first, then release engineering (which owes the ADR-020 packaged-debug fix), LOD after")

The repository has been public since 2026-08-03 (verified 2026-09-07; the "flip track" of
DECISIONS-PENDING 12-15 is overtaken). The live queue after 1b closes is therefore **release
engineering for v0.1** — owing the ADR-020 packaged-debug fail-closed fix (entry 7's named idle
work), the ADR-025 reading, the ADR-017 exposure-surface review — then LOD (P2 first). Optional
polish noted, not tasks: the GitHub repo's description, topics and About are empty.

**Named release-engineering items (the list the v0.1 release work owes; each stays here until it
has its own piece):**
1. **ADR-020 packaged-debug fail-closed fix** — `tauri build --debug` produces a packaged build with
   `debug_assertions` on, so the origin selection picks the dev origin; owed "before any
   packaged-debug support is claimed" (ADR-020 Status paragraph; entry 7).
2. **Packaged-app EPSG/IOGP notice channel** (added 2026-09-07 on the human's ruling of entry 51,
   PR #29): a packaged shell app ships the `spatial-engine` binary with `crs-catalog.json` compiled in
   — the EPSG:2056 definition travels with it — and the app has no notice surface today; published
   bundles (`viewer/NOTICE.txt`) and repository readers (`LICENSES/README.md`) carry the IOGP
   acknowledgement and the terms URL, the packaged app does not yet. The terms' "any publication or
   transmission" clause applies to that channel the moment a packaged build is distributed. Home of
   the record: `DEPENDENCY-LICENSES.md`, "Third-party data terms", the "third channel is OWED"
   bullet. Shape: an about/notice surface (or a shipped NOTICE file) in the packaged app carrying the
   same section the bundle NOTICE carries; ideally the same `notice()` source so the two cannot
   drift. Rides with item 1 — both are "what a packaged build must be true about before it ships".
3. The ADR-025 reading (publish-side refusal above the reader's ceilings) and the ADR-017
   exposure-surface review, as named above.

## Companion note to the LOD brief (ADR-031 draft) — the human, 2026-09-08, verbatim; no scheduling change

> Dated companion note to the LOD brief (ADR-031 draft), no scheduling change: (1) overview × filter
> rule required before preregistration — retain filterable attributes / per-predicate rebuild /
> declared fallback to detailed queries, cost stated; (2) first representation = identity-preserving
> per-feature simplified tiers; aggregation is a separately-gated later representation that refuses
> identity by name (ADR-010 rule 6, ADR-016); (3) the scale-class row's quantities: first meaningful
> geometry, time-to-complete-coverage at declared level, navigation responsiveness; preparation vs
> prepared-open reported separately, never conflated; block-on-sight: open never waits on
> preparation (tier = cancellable class-2 derivative, prep time + disk disclosed, unprepared path
> live). (4) ADR-011 line gains a named lever after LOD: prepared binary attributes / producer-side
> tessellation, measured on the existing paint segment. (5) Record the accumulate-into-image fallback
> as a named candidate with its caveat: addresses residency, not time-to-data (#28); view-locked;
> identity-free.

Custodian's placement notes (pointers only, no interpretation): the note binds the LOD slice's draft
problem statement above (the "LOD slice — draft problem statement (ADR-031 …)" section) and its
preregistration when the slice is dispatched; scheduling is unchanged (the LOD-vs-public-flip
ordering stays the human's deferred call, §"The LOD call"). (1) is a gate on preregistration, not a
piece: the overview × filter rule (retained filterable attributes / per-predicate rebuild / a declared
fallback to detailed queries, with its cost stated) must be written into the preregistration before
any LOD code. (2) fixes the first representation and makes aggregation a later, separately gated
representation whose refusal of identity is named against ADR-010 rule 6 and ADR-016. (3) names the
scale-class row's three quantities and the reporting rule (preparation vs prepared-open never
conflated) and the block-on-sight rule for the tier (a cancellable class-2 derivative — ADR-006 —
with preparation time and disk disclosed, the unprepared path live). (4) adds the named ADR-011 lever
(prepared binary attributes / producer-side tessellation) to be measured on the existing paint
segment, after LOD. (5) records the accumulate-into-image fallback as a named candidate with its
caveat (residency, not time-to-data — DECISIONS-PENDING entry 28 — view-locked, identity-free).
No ADR-031 file is filed by this note; it is filed on the human's word when the slice is dispatched.

## Post-release sequencing note — the human, 2026-09-08 (evening), verbatim; NOT decided

> Sequencing note for the post-release call, not decided now: ADR-032 (4326 admission) likely
> outranks LOD.

(ADR-032 filed Proposed, decision open, on entry 59 = (a) — `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md`. This note sits beside the LOD companion note above; the LOD-vs-4326-vs-public-flip ordering stays the human's call at the post-release sitting.)

**Added 2026-09-09 on the human's ruling of entry 66 = (d):** a third item sits beside those two for the post-release call — the geometric-protection piece (restore ADR-028's protection rule at every zoom without enumeration, half-open index ranges), preregistered in `RELEASE-0.1.md` Amendment 12 and named by the human "the first post-tag piece beside ADR-032/LOD". The order among the three is not decided.

## Found during the release cut (2026-09-08) — not fixed there

- **`tilesCoveringBbox` has no upper bound before it allocates** (`frontends/shell/src/canvas/tileGrid.ts:170-181`, called unclamped from `tileViewportStreamManager.ts:314`): at an extreme zoom-out (`e2eSetViewState(0,0,-64)` in the K6 re-aim; `pixelsPerWorldUnitAtZoom = 2**zoom`) the query bbox inflates and the plain nested loop enumerates the whole cover BEFORE `MAX_QUEUED_TILES` (`tileGridConstants.ts:54`) truncates — the page wedged (the K6 worker's own observation, app killed by PID). The K6 gate (2026-09-08) CONFIRMED it user-reachable by ordinary wheel zoom-out in the shipped default: no zoom floor (`WorkingCanvas.tsx:1314` bare `controller: true`; deck.gl OrthographicController `minZoom = -Infinity`), and ~12 notches past the fit allocates ~3×10⁸ `TileKey` objects before truncation (derived from code + one measured fit zoom). Queued as DECISIONS-PENDING entry 60 (fix in the release cut, recommended, vs declare). Either way the cover enumeration must be bounded before allocation (docs/01: never block the canvas). Belongs with the LOD slice (ADR-031) or as its own small fix; KNOWN-LIMITATIONS if user-reachable and unfixed at the tag.
- **Widen the citation-integrity scanner** (`frontends/shell` `test:citation-integrity`, 5 files today) to `spikes/**/README.md`, every `e2e/*.mjs`, `LICENSES/`, `MANUAL-WALKTHROUGH.md` and `docs/adr/` — twice in the release cut a gate caught a quotation attributed to a document that does not contain it, by hand. Tooling, small; no product code.
- **Entry 7's ruled pre-fix ("thread the `CancelToken` + a phase label into `publish-prepare`") was built in the release cut as item 10 and LANDED** (`cut/release-publish-pin` @ 21cc2e2, PR #34 merged 79a9a3b on 2026-09-09 after the human-authorized closing commit (entry 64 = (a)) and the custodian's mechanical check): the pin phase reports bytes hashed / total and honours Cancel; the ADR-025 pin-free checks run before the pin. **Not a next-cut item.** The ADR-024 appended note (entry 63) records the closure.
- **Serve the installed NOTICE as a dist asset fetched on expand, not a `?raw` string literal** (the item-9 architect gate, 2026-09-08, "strictly better"): the generated notice is 3,186,905 B at the entry-62 piece's head `d0baa51` (3,186,855 B before its four-set header; with the DuckDB amalgamation section, entry 62) baked into the JS bundle and parsed at every launch, then inserted into one element synchronously on expand — declared for v0.1 and observed at Part M M3. A post-build `dist/` asset (or `public/`) fetched by the Notices view removes the payload, the two-pass build and the bootstrap header together; no new Tauri command (ADR-027 decision 4 untouched); `check:dist-notice` then inspects a real file. Small; frontend + build tooling only.
- **Notice wording deferred from the entry-62 re-reviews (2026-09-09) — each changes the conveyed `NOTICE.txt` bytes, so they ride the next notice regeneration, not this cut:** (architect A-1) `renderer/bundle-viewer/notice.mjs:391` says ADR-030 was "accepted at this piece's landing" — repository-internal phrasing in a recipient-facing text; say "Accepted 2026-09-09"; (architect A-3) the guard sentence at `notice.mjs:721-723` names two of the three guards — omits the linked-crate version check; (reviewer nit) the bootstrap header's rewrap at `notice.mjs:431-437` leaves an orphan short line (`source tree below; the packaged frontend's OWN npm`). Also, code-shape only, no bytes: `frontends/shell/scripts/duckdbAmalgamationNotices.mjs:276-283` — consecutive GNU-tar `L`/`x` records silently overwrite `pendingLongName` (unreachable in the pinned archive; the `g` refusal above it is the right instinct, one case short). Pair the regeneration with the fetched-asset item above so the bytes move once.
- **NSIS installer stub — the one Reopen candidate ADR-030's appended note names unchecked (statement 4):** a cheap pre-tag check of what `makensis` compiles into the setup executable (the NSIS stub's own code and plugins, their licences), recorded in `DEPENDENCY-LICENSES.md` — the three build manifests describe the installed application, not the setup program that carries it. Architect advisory A-5 on the entry-62 re-review, 2026-09-09; recommended before the v0.1.0 tag if cheap, otherwise the first reopen after it.
- **Optional follow-up (entry 60 = (a), 2026-09-08):** a computed `minZoom` clamp on the working canvas's controller (a floor below "Zoom to layer") — a UX decision with its own walkthrough row; NOT part of the entry-60 bound-before-allocate fix, which ships in the release cut.
- **[RULED 66 = (d) on 2026-09-09 — the first post-tag piece, preregistered in `RELEASE-0.1.md` Amendment 12 ("Preregistration — entry 66 (b)"); beside ADR-032 and LOD in the post-release call, order not decided] Restore ADR-028's geometric protection at every zoom without enumeration** (the architect's consult, 2026-09-08): protect a resident tile iff its (row, col) lies inside the cover's half-open index ranges (`coveringIndexRanges` — the same predicate `tilesCoveringBbox` materialises, unmaterialised; NOT a closed-bbox intersection, which would protect one extra ring on boundary-exact viewports), and apply the same predicate to the supersede keep-set so in-flight in-view tiles are not blanked past the bound. ~6 source files (widen `viewportTileKeys`/`protectedTileKeys` to `{ has(key) }`, thread the bbox to `WorkingCanvas`'s handle and `tileIngest`'s admit-time eviction, close `tileViewportStreamManager.ts:332-354`), 5 tests named in the consult (window-outside/in-viewport resident survives; out-of-viewport evicted; predicate/cover agreement incl. a boundary-exact `xmax`; a >65,536-cell plan protects a tile the window omits; an in-flight in-view tile is not superseded). Its own preregistration + reviewer gate. Removes the ADR-028 exception declared for v0.1.0 (entry 66).
- **Stale line cites noticed by the entry-60 closing worker (2026-09-09), not fixed there:** `frontends/shell/src/diagnostics/renderTrace.ts:126` cites `tileViewportStreamManager.ts:574` for `traceViewportQuery`'s call site (already `:595` on main before the piece, `:658` after); `tileResidentSet.test.ts:453` and `tileViewportStreamManager.ts:91-92` attribute the geometric protection to "clarification 3 / Amendment 1" (it is ADR-028 Amendment 3's, `:459-462`; pre-existing, no quote misattributed); the closing commit's +12 lines shift cites held in dated records (`DECISIONS-PENDING.md:126,127,941,1469`, `RESULTS.md:1113`, `spikes/viewport-residency-1a-diagnosis/README.md:57,74`) — as-of cites in dated records, left. Folds into the citation-scanner-widening tooling item above (line cites, not only quotes).

## Post-tag drafts prepared during the 2026-09-09 away window (for the human's sight — nothing filed, nothing scheduled, no code)

All under `state/drafts/post-tag/` (untracked, repository root), each headed with its provenance (which agent, read-only, the recommendation lines labelled as the drafter's):

- `adr-032-problem-statement.draft.md` — the GeoParquet 1.1.0 x,y-override analysis (quoted from the pinned spike text), today's refusal with its cites, candidates A/B/C with their ADR-015 §5 / ADR-017 / ADR-026 / ADR-013 touch points, the equirectangular display question, nine open questions, the fixtures a B preregistration must pre-commit. Drafter's notes: a stale cite in RELEASE-0.1 (corrected in Amendment 14); the refusal string "emits (easting, northing) only" is already too narrow (CRS84 is admitted) — open question 8.
- `lod-brief-revised.draft.md` — this file's LOD section with the companion note folded in (L8–L10 added; the "refuses identity by name" reading drafted for approval; the scale-class row's three quantities and the preparation/prepared-open separation; the ADR-011 lever after LOD; the accumulate-into-image fallback carried by name and caveat only — **no description of it exists anywhere in the record**; eight open questions).
- `entry-47-repick-brief.draft.md` — the re-pick on camera settle: no settle signal exists in product code today (only the viewport-query debounce), the pointer position is stored nowhere, deck's pointerleave sentinel; a ten-point design, the K6 rewrite, eight open questions.
- `entry-66b-geometric-protection-brief.draft.md` — the half-open predicate made exact (why boundary-exact `xmax` matters), the `{ has(key) }` widening, the supersede keep-set, the `fits`/over-budget latch explicitly out of scope unless the human rules otherwise (open question 1), nine tests, one walkthrough row, five open questions.

Sequencing among ADR-032, LOD and the geometric-protection piece stays the human's post-release call (the note above).

## Incoming, 2026-09-10 — the three Fable drafts and the human's porting order (verbatim in `CUT-STATE.md`; nothing ported before the v0.1.0 tag)

Byte copies under `state/drafts/post-tag/`: `DRAFT-1-review-loop-amendment.md` (→ an appended, dated amendment to `AI_DEVELOPMENT.md`'s Custodian section, docs-only, its own PR; §A/§B in force from its merge, §C reporting), `DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md` (→ THIS FILE for the first post-tag cut; P0 — architect consult + `engine/ADMISSION-PREREGISTRATION.md` with the compatibility-corpus manifest + four ADR drafts filed Proposed — runs and goes to the human's sight; nothing past P0 before it), `DRAFT-3-BRIEF-B-recipe-replay-publish.md` (→ held here until Brief A closes; then B1/B2/B3 each its own preregistered piece, gate and PR; block-on-sight B-1 from the first line). The drafts' boundaries are settled and not reopenable inside the cuts. Open questions route per each draft's "Open questions — routed" section. No perf claims, no docs/08 rows, no new benchmark campaign. Conflicts with the tree or the record → the queue (entry 72 is the first: the commit identity Draft 2 names).

**Started now (licensed pre-tag, "needs nothing built"):** the compatibility corpus — `target/fixtures/compat-corpus/` (untracked) with a `MANIFEST.json` of observed facts per file (producer pipeline, sha256, `crs` shape, encoding, covering, columns); expected outcomes are pre-declared at P0, not in the manifest.

**Corpus collected 2026-09-10** (12 files / 5 pipelines; `target/fixtures/compat-corpus/MANIFEST.json`, scripts beside it). Facts the P0 architect consult must see before pre-declaring outcomes: the `null`-vs-absent `crs` split is writer-specific (GeoPandas writes `null`, DuckDB/GDAL/Overture omit the key); `geo.creator` exists only on GeoPandas output; the spec's current `examples/example.parquet` is geo version **2.0.0** while boundary 1 pins the 1.1.0 text; one GDAL file is 1.0.0 with `covering`; a sixth pipeline (parquet-rs + geoarrow extension types, no `geo` key) is available if wanted. GDAL as a local writer and QGIS are not obtainable on this machine — the GDAL files are the project's own autotest bytes, pinned by commit.
