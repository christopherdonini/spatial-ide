# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

25. **[Rule-7 item, surfaced 2026-09-02 while applying entry 10's ADR-026 acceptance — NOT
    decided by that ruling.]** ADR-026's own "Architect note for acceptance" section (filed
    2026-08-18, unresolved) flags one wording question left explicitly "the human's": the
    `pasted` provenance-string value names only that a definition was **not byte-identical to
    any pinned catalog entry** — not that it was necessarily hand-typed — while
    `definition_provenance(None)` also returns it for `--assert-crs`'s own no-definition case.
    ADR-015 §5's `none-performed` / ADR-016 §6's "the record says what was checked" both argue
    for a value naming the check instead (`not-in-catalog`). The string is wire-visible in
    `skp/0.2` — free to change before merge-freeze, a version bump after. Recommendation: **your
    call, no default assumed** — this is exactly the kind of wire-wording precision this project
    treats as never a detail. Touches, if changed: `kernel/src/skp.rs::host_minted_crs_assertion`
    (or wherever `definition_provenance` is minted), `ADR-026`'s own text, both-side fixtures.
    *(Numbering note: this branch's own next-available slot is 25; the still-open
    viewport-residency PR's `DECISIONS-PENDING.md` independently used 25 and 26 for unrelated
    entries — a renumbering collision to resolve, mechanically, whenever that PR merges. Not a
    judgment call, flagged so it isn't a silent surprise at merge time.)*

24. **[(a)–(c) RESOLVED 2026-08-30 — human: "a is yes, b approved, c go with your
    recommendation"]**: over-budget renders as a declared partial view with the persistent
    status retained; the rider-1 status meaning change approved, exact wording on sight at the
    PR; hover below pick resolution refuses by name. (d)–(f) ride their recommendations;
    (g) scheduling of headed measurement sessions remains to be agreed when P2/P6 are ready.
    **Tiling/LOD cut: seven decisions before code — (a)–(c) GATE the cut's P0.** The architect's
    design note (2026-08-30, binding for the cut) restates the target honestly: at fit-to-extent
    the viewport IS the dataset, so this cut retires the *error-shaped* refusal, not the ceiling
    itself — over-budget becomes a declared partial view. Yours to decide:
    **(a) May an over-budget viewport render at all without an error?** Today it refuses and
    cancels the stream. Converting refusal → declared, labelled partial view with
    distance-ordered eviction is the cut's core honesty call (principle 8). Rec: **yes** — it
    is the cut's entire point, with the persistent rendered/total status RETAINED.
    **(b) The ceiling-status semantics are your rider 1** (Parts D and H judged its wording):
    under (a) the status stops meaning "refused above ceiling" and starts meaning "showing N of
    M — farthest tiles evicted". Approve the meaning change (exact wording on sight at the PR).
    **(c) Hover at whole-dataset zoom** (PR #15's question, routed here): (i) declared refusal
    — "features here are below pick resolution, zoom in" (architect rec: the declared-not-
    discovered discipline applied to picking); (ii) topmost-with-caveat; (iii) leave as is.
    **(d)** Is eviction visible? Rec: the status line's N-of-M is the visibility; no tile
    readout. **(e)** Console fan-out: N tile requests per pan will amplify Part J's noise
    finding — grouping/de-emphasis decided with entry 23(a). **(f)** Client-clock results live
    in a NEW `frontends/shell/RESULTS.md` (never mixed into kernel/RESULTS.md's producer-clock
    records). Rec: approve. **(g) Scheduling:** the measured arms need headed, foreground,
    non-remoted sessions on this machine — your physical time, to be agreed when P2/P6 are
    ready (no RustDesk measurement, ever). (d)–(f) proceed on recommendation unless overridden.

22. **[RESOLVED 2026-08-30 — human: "Let's go with the next cut" → the hold lifts; the
    ADR-011 tiling/LOD slice opens with its preregistration piece. The remaining queue
    entries stay pending at the human's pace and no longer gate the pipeline.]**
    **Batch sequencing + a deliberately idle cut pipeline (architect-recommended hold).** The
    operator batch is full (Parts H, I, J — a complete session, all against the single pinned
    build `807648f`, pre-filled in the three result logs) and every worthwhile next cut is
    either gated on entries below or — the ADR-011 tiling/LOD slice, the honest next cut — is
    genuinely AIMED by what Part H will teach (gate 8 asks what replaces whole-dataset
    residency for the 5 GB case; H's evidence plus PR #15's hover-at-scale question are
    three-quarters of its problem statement, and its first artifact is a preregistration,
    cheaper to write after the batch). So the pipeline holds until the batch runs and entries
    7/8/9/16 clear. Named idle work meanwhile (bounded, non-red-line): the ADR-020 owed
    fail-closed defect (`tauri build --debug` origin — mechanism-internal fix, reviewer-gated);
    unit tests for the console's two named-unexercised branches; drafting (NOT filing) entry
    9's carrier ADR. **Override available:** say the word if you'd rather have a fourth part
    queued than an idle stretch.
    **Progress note 2026-08-30: the batch RAN in full (Parts H, I, J — all three result logs
    written), entry 8 resolved by your live H8b, decision 7's observation is in, ADR-025
    filed.** The hold's remaining condition is entries 7/9/16 (+ acceptances 3/16/23 and the
    ADR-022/024 pair at your pace); the next cut — the ADR-011 tiling/LOD slice, opening with
    its preregistration piece, now aimed by Part H's evidence and PR #15's hover-at-scale
    question — starts on your word or when those clear.

12. **ADR-009 pre-public checklist: mechanically COMPLETE — ready for your go/no-go, three
    residual judgments (13–15).** The 2026-08-18 verification pass confirmed the 2026-08-07 work
    and closed its drift: SPDX headers extended to `frontends/shell` (84 files — the module
    postdated the original sweep), dependency audit re-run byte-identical (721 audited / 9
    decided / 0 needing review), DCO re-verified against the live source, all three product CI
    workflows green on push AND pull_request, history delta (147 new commits) re-swept clean for
    credentials/personal-data/third-party material, three stale docs corrected with dated notes
    (`main` @ 8a69260, pushed). What remains is entirely judgment — entries 13–15 plus **making
    the repository public itself, which stays yours regardless**. Full record:
    `PRE-PUBLIC-CHECKLIST.md` (durable) + `.cut-archive/CUT-STATE-adr009-checklist.md`.

13. **ADR-009 item 5's pre-public bar — does the 2026-08-07 informal collision check + docs/14
    trademark stub suffice, with the full register search deferred to pre-1.0?** That deferral is
    already written into docs/14 as a prior custodian's judgment call, made before the red-line
    rule reserved ADR-009-adjacent calls for you; this pass did not re-decide it.
    Recommendation: **accept the deferral as written** ("no collision found, descriptive name,
    weak mark" for a pre-launch repo; register search stays a pre-1.0/counsel item per ADR-009's
    own Caveat). Touches nothing if accepted; a docs/14 edit if you read the bar differently.

14. **Two personal git identities are permanently in history**
    (`donini.christopher@gmail.com` 172+, `chrys92d@gmail.com` 12+) — named non-blocking by the
    2026-08-07 history review, never explicitly resolved. Normal for an open project; a history
    rewrite is a named red line and not on the table. Recommendation: **acknowledge, no action**;
    optionally standardize one identity for future commits, your call.

15. **102 of 239 commits (all on/before 2026-08-10) carry no `Signed-off-by`** — the pattern
    cleanly tracks DCO adoption settling in after ADR-009's acceptance; every unsigned commit is
    from your own one-or-two identities, so no external-contribution provenance question exists,
    and backfilling would be a history rewrite (red line). Recommendation: **accept as historical
    fact, no rewrite** — the CI check already gates every future external commit, which is what
    DCO 1.1 is for. Optional: a one-line note in `PRE-PUBLIC-CHECKLIST.md` §6.

8. **[RESOLVED 2026-08-30 — you took H8b live and completed it]**: 3.3M rows / 6,636
   partitions published unwarned, viewer refusal read on screen, artifact deleted after;
   **ADR-025 filed Proposed with its decision deliberately open** (refuse / warn / stay
   silent — yours at acceptance, no recommendation recorded). Original entry follows.
   **Part H8b — complete a whole-file 5 GB publish to demonstrate the dead-artifact gap?** There
   is NO publish-side refusal above the reader's ceilings: a whole-file publish succeeds (~100s,
   5.7 GB written, irreversible) and only the viewer then refuses with ceiling-exceeded — meaning
   the product's hero path can produce an unviewable artifact with no warning (RESULTS finding 2,
   now reachable from your UI; ADR-025 is drafted as the decision's home). H8a (default) shows
   cancellability instead: publish whole-file, cancel mid-flight, nothing written. H8b would give
   ADR-025 its UI-level evidence at the cost of the write. **Decide live during the run** — the
   step text offers both; H8b happens only on your explicit go-ahead in the moment.

5. **Publish cut: filtered-subset bundles are OUT at bundle_version 1 (architect ruling) — do
   you want them scheduled?** A bundle recording the shell's SQL-filtered subset needs
   `bundle_version 2` + a new ADR (candidate ADR-025): your Corrigendum 3 declared the v1
   schema-change exception **spent**, and a v1 manifest cannot record a predicate — publishing
   one today would produce a FALSE manifest (claims whole-file over a subset) and a digest
   collision, so the cut's P0 makes `preflight` refuse it, typed. The shell publishes whole-file
   or current-viewport-bbox (the two honest §8 shapes), and an active filter is named in words on
   the approval surface, never silently dropped. The hero sentence still reads: the filter is how
   you *find* what to publish; the artifact records the viewport. Recommendation: leave
   bundle_version 2 unscheduled until real need. No action = the recommendation.

4. **ADR-023 — attribute projection on `viewport_query` (decision deliberately open).** Filed as
   the named home for the categorical/live-attributes deferral (the ADR-011-gate-8 pattern) — no
   acceptance is being asked for; it exists so the gap has an address. **No action needed unless
   you want its question prioritized** (it gates data-driven styling and attribute hover in the
   shell). Recommendation: leave open until after the publish cut.

2. **D1 (style cut, small) — "Save style…" file write, or visible/copyable text only?** The style
   panel shows the current style document as text (the accepted ADR-017 §5a format — the model
   already exists; the shell adopts it rather than inventing one). A Save-to-file button would be
   an ADR-006 **class-3 external side effect** (export): explicit approval + an audit record owed —
   machinery the publish cut is building anyway. Recommendation: **text only this cut**; the
   clipboard covers the hero-slice round-trip (style in shell → copy → `publish-bundle --style` →
   bundle viewer). The cut proceeds on the recommendation unless you override. Touches: the style
   panel's control set only.

1. **Rider-1 refinement — clear the ceiling status when a new query is issued?** Your rider 1
   (2026-08-13) made the `.residency-status` ceiling indicator persistent "while the condition
   holds," cleared by a later full delivery or dataset change. The filter-panel cut adds a third
   way the condition stops holding: applying a filter supersedes and clears the canvas, after
   which a stale "78,191 of 100,000 features rendered" would be claiming something no longer true.
   The architect recommends adding a `"query-issued"` clear transition — within your rider's
   stated intent, but the rider was your decision, so it's named here rather than absorbed.
   Recommendation: **approve**. Touches: `nextResidencyStatus` + one unit test (P4 of the
   filter-panel cut proceeds on the recommendation unless you say otherwise; flagged in the PR).
   *(A second, smaller operator call — whether the scan-liveness indicator shows on every
   in-flight stream or only filtered ones — is deliberately left to your Part E judgment, with
   every-stream as the recommended default.)*

## Resolved

- **2026-09-02 — entry 3, ADR-022 acceptance: ACCEPTED as recommended, no condition.** Applied:
  ADR-022's Status line to Accepted; `docs/02`/`docs/README` index entries updated.

- **2026-09-02 — entry 23, ADR-027 acceptance: ACCEPTED.** The human's ruling: finding (a)
  (console noise) recorded as a follow-up question, not an acceptance condition; finding (b)
  (zoom not visibly producing a `viewport_query` entry) gets one bounded diagnosis noted at
  acceptance, not re-opening the ADR; finding (c) (J5's operator confirmation) stands as
  recorded, open. Applied: ADR-027's Status line to Accepted, a new dated "Acceptance" section
  recording all three findings verbatim; `docs/02`/`docs/README` index entries updated.

- **2026-09-02 — entry 16, ADR-016 acceptance: ACCEPTED with the envelope record exactly as
  drafted, made architect-blockable per the architect's own recommendation.** OPEN item 1
  settled (the drafted envelope record appended, the original OPEN block kept verbatim per this
  project's own append-never-rewrite discipline); OPEN items 2 (stability across reopen) and 3
  (composite/non-integer keys) stay open, untouched. Applied: ADR-016's Status line to Accepted
  + architect-blockable; item 1's settlement appended; `docs/02`/`docs/README` index entries
  updated.

- **2026-09-02 — entry 11, scope confirmation (declare, never detect): CONFIRMED.** No separate
  edit — the ADR-016 Decision (item 3) already states this discipline; the confirmation is
  recorded inline in ADR-016's own new settlement text (entry 16, above) as a retroactive
  affirmation of the shipped cut's scope.

- **2026-09-02 — entry 7, the principle-7 publish-prepare gap: PRE-FIX.** The human's ruling,
  reversing the prior declare-and-observe default now that Part H's observation is in: thread
  the `CancelToken` + a phase label into `publish-prepare`. **Not implemented by this batch** —
  a small, host-side cut from `main`, reviewer-gated, scheduled to run only after tonight's
  sitting closes (its own brief is not drafted here, to avoid clobbering `NEXT-CUT.md`'s current
  occupant, the still-open viewport-residency cut). Touches, when dispatched: the shell's
  publish-prepare path (`frontends/shell/src-tauri`, wherever the whole-file SHA-256 runs
  uncancellably today).

- **2026-09-02 — entry 9, the `skp/0.2` scan-progress carrier clause: second explicit
  re-deferral CONFIRMED, stronger carrier filed.** The human confirmed the re-deferral (the
  clause descends from ADR-021's own acceptance condition, so only the human could discharge
  it) and its own drafted §8 text in `SKP-V0.md` **ships merged as discharged**, no longer
  flagged DRAFT/PENDING. **ADR-029 — the scan-progress carrier quantity** filed (Proposed,
  decision deliberately undrafted, the ADR-023 pattern), due before `docs/07`'s Prototype exit;
  no third silent rollover to "the next SKP version" is available without amending ADR-029
  first. Applied: `SKP-V0.md`'s two "PENDING HUMAN CONFIRMATION" markers updated to CONFIRMED;
  `docs/adr/ADR-029-scan-progress-carrier-quantity.md` filed; `docs/02`/`docs/README` index
  entries added.

- **2026-09-02 — entry 10, ADR-026 (CRS definition supply route): ACCEPTED, both routes.**
  Applied: ADR-026's Status line to Accepted, both routes confirmed as recommended and as
  already built; `docs/02`/`docs/README` index entries updated. **Rule-7 note — a genuinely new
  item surfaced while applying this and is NOT resolved by this ruling:** ADR-026's own
  "Architect note for acceptance" section flags a separate, still-open wording question (the
  `pasted` provenance string vs. `not-in-catalog`) that the human's ruling did not address. Not
  decided inline — see the new Pending entry below.

- **2026-09-02 — entry 6, audit format widening (`ApprovalRoute::ShellDialog`): APPROVED.** The
  code was already fully shipped on `main` (`kernel/src/permission/audit/record.rs`, tests
  green, `reader.rs` mapping present) — only two doc markers needed updating from "QUEUED for
  the human" to "APPROVED 2026-09-02", with the expiry clause (holds only until an external
  reader of `spatial-audit/1` exists) restated, not weakened. Applied: `record.rs`'s doc
  comment (also fixed a stale `NEXT-CUT.md` cross-reference to the since-overwritten publish
  cut's own brief) and `ADR-024`'s matching paragraph (lines 180-193) — comment-only, zero
  behavior change. ADR-024's own overall Status is untouched, still Proposed, still queued
  (below) — this entry approves only the one value-domain widening, not the ADR.

- **2026-08-19 — entries 20 + 21 (the A9' hover-pick red), resolved through to green.**
  Entry 20 (human: "let's go with entry 20"): the bounded zoom attempt ran and hit its own
  escalation trigger. Entry 21 (human: "start it"): the instrumented render-diagnosis session
  proved the fill layer healthy (22k–32k px at the exact configured alpha 180 in baselines;
  content unclipped) and the follow-up evidence closed the full mechanism: the test surface's
  sample-pixel selector is BY ITS OWN TESTS "the first non-background pixel in row-major scan"
  — structurally a content top-edge pixel — which the P5c interior verification could never
  pass; earlier greens predated the verifier and passed via deck's pick tolerance. Fix
  (harness-only, `dc3c7aa`): densest-patch bisection candidate selection; interior candidate
  verified at zoom notch 0 with patch fraction 100%, double-green, first all-green
  `e2e:console` run. **No product render/pick code was touched at any point.** The
  hover-at-whole-dataset-zoom UX question is owned by ADR-011's tiling/LOD slice (gate 8),
  flagged for the next architect consult. Full trail: `.cut-archive/CUT-STATE-action-console.md`,
  `e2e/README.md`'s resolution note, PR #15 disclosure 1.

- **2026-08-18 — action-console cut gates cleared by the human ("let's roll with the next
  cut").** Entry 17: the docs/07 Alpha split append applied as drafted (the Prototype ships the
  console's principle-4 visibility obligation only; notebook recording + AI flywheel stay
  Alpha). Entry 18: principle 4's status for style and publish = **accepted-with-a-deadline,
  recorded in ADR-027 at filing** — publish's deadline inherited from ADR-017's acceptance
  condition, style's from ADR-022/ADR-023's own resolution; the console renders both gaps as
  explicit debt-register entries. Entry 19 rides its recommendations (class-B name-only/no
  copy; data-plane out; architect-picked ceilings shown in the PR). The applied docs/07 text
  was restated verbatim to the human at go-time; a veto reverts it before the cut's PR.

- **2026-08-14 — operator walkthrough Parts A–D RUN by the human (over RustDesk), nine days ahead
  of its 2026-08-23 due date.** Parts B, C, D and A1–A6/A8–A10 **pass** — including both
  operator-only items: the native dialog (A2) and rider 1's visual acceptance point (D2/D3, banner
  and persistent status simultaneously readable, Dismiss leaves the status standing). Motion
  judgments carry the RustDesk degraded-channel caveat, corroborated by the app's session log.
  **One functional deviation: A7** — "Zoom to layer" is inert when the layer has been panned fully
  out of view (residency-clearing emptied its fit target; diagnosed same day; fix through gates,
  with the E2E A7′ step strengthened to pan fully off-data so this class stays caught). Two minor
  records: the post-pan refill pause reads slightly slow over RustDesk (designed debounce; panel-era
  tuning question), and the ceiling banner's Dismiss button abuts the message text (cosmetic CSS,
  fixed with the A7 work). Full log: `frontends/shell/MANUAL-WALKTHROUGH.md` Result log.

- **2026-08-13 — ADR-021 accepted, with a binding acceptance condition.** The row filter on
  `viewport_query` (SKP v0.1) accepted as designed. **Condition (applied to the ADR's acceptance
  text):** the named batches-may-be-empty shortfall carries forward as a **binding obligation on
  the filter-panel cut** — before any user-facing filter UI ships, the panel must present liveness
  and a working cancel affordance during zero-batch filtered scans (indeterminate progress + real
  cancel is the acceptable interim); true scan-progress reporting stays the named SKP-V0 §4.5 debt,
  resolved there or explicitly re-deferred with reason, never silently dropped. Applied same day:
  ADR-021 status line (Accepted + condition + Open-item), status-propagated to SKP-V0.md §7,
  `docs/02`, `docs/README`. Surface shipped this cut; PR #10 carries it, merge order #9 → #10.
- **2026-08-13 — ADR-020 accepted.** Host-declared exact-match origin *mechanism* accepted, not
  `cfg!(debug_assertions)` as the final origin selector; the `tauri build --debug` mismatch stays
  a recorded fail-closed defect owed before packaged-debug support. Applied: ADR-020 status line,
  ADR-012 Amendment 1 (the **Origin** threat-model bullet's referent; H4 PASS inherited by
  argument), `docs/09` "Local listening sockets", `docs/02`/`docs/README` entries; C3 negative
  test committed (`3188f1d`). Full record: the ADR file.
- **2026-08-13 — Entry A (import-layout gate) resolved: gate fail accepted as final, with reopen
  conditions.** No index prunes IO; physical layout is the only lever (Hilbert read 61.7% at the
  5 GB near-quarter, won total 49/49) but the preregistered gate FAILED its no-whole-file-regression
  condition (100.544% vs ≤ 100.5%; Hilbert compresses ~0.5% worse) — a fail is a complete result,
  layout stays out, ADR-021-layout unfiled. Standing bracket: an unordered source gets no pruning
  at all (shuffled ≥ 99.99%). The docs/07 line-22 replacement + three reopen conditions
  (workload-shift / ADR-011 tiling / instrument-writer confound, each needing a fresh preregistered
  gate) were sight-approved and applied to docs/07. Full record: `kernel/RESULTS.md` ninth section,
  `docs/07` line 22. *(NB: an earlier "2,012,436 / 0.6% over" figure was a custodian synthesis error
  — the file's true total is 2,508,699 / 25.4% over; the 2,012,436 was a refusal-moment partial sum.
  Corrected in the record.)*
- **2026-08-13 — Entry 0 (resident-vertex ceiling) resolved: option (a) + three riders, executed.**
  The 100k walkthrough fixture exceeded `MAX_RESIDENT_VERTICES` by construction (not a residency
  bug — an authorized instrumented session proved it). Fix: happy-path fixture regenerated under the
  ceiling (1,885,130 vertices, hard-asserted ≤ 1,950,000); a deliberate over-ceiling fixture +
  E2E OVERCEIL′ step + walkthrough Part D; a persistent non-dismissible `.residency-status`
  indicator (rider 1 — dismiss hides the banner, never the status); the remount-race footgun fixed
  with a regression test (rider 3); ADR-011 gained acceptance gate 8 — the ceiling refusal is the
  honest interim, not the forever behavior, and the tiling/LOD slice owes what replaces
  whole-dataset residency (rider 2). All twelve regression steps green on a verified-fresh run.
  Full record: `kernel/RESULTS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, ADR-011 gate 8.

*(Older intermediate authorizations — the instrumented-session grant, the walkthrough-hold — folded
into the resolutions above. Full narrative history in git and in `E2E-STATE.md` / `CUT-STATE.md`.)*
