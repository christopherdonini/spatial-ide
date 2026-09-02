# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

26. **PR #16's DCO check is red — 3 pre-existing commits lack Signed-off-by, and the clean fix
    is a red-line action.** `de67713` (P2), `8211723` (P8), `0e4449c` (P10) — all pre-existing,
    none from this dispatch's own 3 commits (which used `git commit -s` throughout) — carry no
    `Signed-off-by` trailer, diagnosed from the CI log, not guessed. Unlike entry 15's already-
    accepted historical gap (commits on/before 2026-08-10), these are recent and sit in an OPEN,
    unmerged PR — exactly what the DCO gate exists to catch before merge. The clean fix
    (`git rebase --signoff`, per the check's own suggested remedy) rewrites every commit from
    `de67713` onward, including this dispatch's own 3 — a history rewrite + force-push, an
    explicit custodian red line, never taken without your say-so — and would invalidate every
    exact-hash citation across `RESULTS.md`, `ADR-028`'s new section, `CUT-STATE.md`'s ledger,
    and PR #16's own body, all of which would need updating to match. `main` carries no branch
    protection, so this does not technically block merging. Recommendation: **your call** —
    (a) authorize the rebase + force-push (I'd then need to sweep every hash citation those files
    carry to match — a real follow-up, not a formality); (b) merge as-is, accept the red check,
    note it (closer to entry 15's own precedent, though these commits are far more recent);
    (c) something else. Worth asking separately: were these 3 from a tester-subagent dispatch
    that isn't passing `-s` — if so, that's a process gap worth closing regardless of what happens
    to these specific commits. Touches: `cut/viewport-residency`'s history if (a); nothing if (b).

25. **Candidate arm's per-tile geometry cache adds an unmeasured third coordinate copy per
    resident vertex — worth measuring before ADR-028 acceptance, or after?** The 2026-09-02
    reviewer pass on the P9 paint fix (`buildLayers.ts`'s `geometryCache`) found the candidate
    arm now retains a third `[x,y]` array per cached resident vertex, on top of the two
    `MAX_RESIDENT_VERTICES`'s own comment already accounts for (`limits.ts`) — bounded by the
    same ceiling via `WeakMap` keying (cannot grow past the resident set independently), but its
    actual heap delta is unmeasured, and the candidate arm's own high-water mark already sits at
    the ceiling (1,997,834/2,000,000). The false "does not start tiling" claim the same comment
    carried (predating the candidate arm entirely) is corrected alongside this, both comment-only
    (`7e86928`, viewport-residency P11) — the measurement itself is not done. Recommendation:
    **not blocking** — this is a memory-footprint question, distinct from the two frame-time-tail
    mechanisms your gate-8 ruling already named as binding debt, and MAX_RESIDENT_VERTICES stays
    a client-side declared constant, not a docs/08 row; a real measurement (`performance.memory`
    or a host-process probe, matching kernel/RESULTS.md's own memory-sampling convention) is
    worth doing before or alongside whatever cut next touches tile admission, not before this
    one's PR merges. Touches nothing until measured; `limits.ts`/`buildLayers.ts` comments already
    updated to disclose the gap honestly rather than assert a number.

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

23. **ADR-027 acceptance — the action console and display truth.** Filed Proposed by the
    console cut's P6 with your accepted-with-deadline ruling recorded as decision 6; the
    ADR-022 pattern's operator confirmation is now in: Part J run 2026-08-30, verdict
    "comprehensible", the class-B fence held on screen (no arguments, no destination path, no
    copy), and your J6 line — "with the console open you feel like everything you do will be
    repeatable" — recorded as both the intended effect and the reason the standing header
    exists. **Three Part J findings to weigh at acceptance:** (a) the console's reflexive
    view-state rows (its own toggles, panel disclosures) crowd the tail around each action of
    interest — honest but noisy; a de-emphasis/grouping question; (b) zooming did not visibly
    produce a viewport_query entry where panning did (open observation, plausibly refill
    debounce — worth one diagnosis before or at acceptance); (c) J5's refused-entry operator
    confirmation stayed open (E2E REFUSAL' carries the property). Recommendation: **accept**,
    with (a) noted as a follow-up question, not a condition, unless you want it binding.
    Touches on acceptance: ADR-027's Status line + docs/02/README index entries.

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

16. **ADR-016 acceptance — stable feature identity admission and source-key mapping.** The
    admission-remediation cut builds the mapping half ADR-016 §3–§7 describes and **settles its
    OPEN item 1** ("what the envelope records for a mapped identity — must be settled at
    acceptance"). The acceptance text should record the shipped envelope as the answer, in
    `describe.identity`'s own field names:
    - **Native vs mapped, and which column** — `source` is `"file:id"` or `"mapped:<col>"`, so a
      consumer tells a declared identity space from a file's own without asking the engine.
    - **Uniqueness as what-was-checked, never as a fact** — `uniqueness` is
      `"verified-at-open-full-file"` or `"declared-not-verified"`, with `verified_rows` populated
      only under the former; the bare word "unique" appears nowhere. `max_value`/`js_exact` carry
      §7's width contract, and `js_exact` is `null` when unverified rather than defaulted true.
      The verification runs over the **mapped** values and runs for a **native** `id` column too,
      closing the gap the ADR's Context names.
    - **The declaration is host-attributed.** The wire carries no `by`/`at` and must not
      (`skp/0.2`, ADR-004 Amendment 4); the host mints both — `Principal::OsUser` +
      `rfc3339_utc_now` — at one boundary, the ADR-024 F-5 form. There is no wire field for
      skipping the uniqueness check, so a declared mapping is **always** verified.
    - **The candidate list is part of the refusal, not the record** — 64-bit integer columns in
      schema order, unranked, unpreselected, no confidence; §3's "declared, never inferred"
      extended to the list itself.
    **OPEN item 2 (stability across reopen, and what pins it) stays open, and nothing persists** —
    reopen means re-declare, no `ResourceRef`, no content-hash pinning, no ADR-005 grade claimed.
    OPEN item 3 (composite and non-integer keys) stays open. **No performance number is claimed
    or implied:** the whole-column scan's cost lands on the same docs/08 cold-open budget
    `kernel/RESULTS.md` still records as unmeasured; this cut ships liveness + a working Cancel
    instead of a figure (ADR-018).
    **One thing acceptance must not leave silent:** ADR-016 is currently "Not
    architect-blockable." Architect recommendation — **make it architect-blockable on acceptance,
    as ADR-015 was**: it governs an admission policy of the same weight, and ADR-010 rule 2
    (Accepted, architect-blockable) resolves picking *through* the identity this ADR admits.
    Recommendation: **accept**, with the envelope record above. Touches on acceptance: ADR-016's
    Status line + OPEN item 1 marked settled (appended, never rewritten), `docs/02` and
    `docs/README` index entries.

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

9. **The `skp/0.2` scan-progress carrier clause — your ADR-021 condition's lineage fires.** Your
   filter-panel condition let the true-scan-progress debt be "resolved there or explicitly
   re-deferred with reason"; the dated re-deferral (SKP-V0 §4 item 5, 2026-08-14) parked it with
   "the next SKP version that opens the wire for any reason" — and the admission-remediation cut's
   `skp/0.2` IS that version. All three of item 5's reasons still hold (no batch-independent
   data-plane carrier; the quantity is undecided and ADR-class; the interim liveness+cancel
   shipped), and this cut touches no data plane. Recommendation: **explicit second re-deferral
   with reason, plus a stronger carrier** — the quantity question filed as its own
   Proposed-with-open-decision ADR (the ADR-023 pattern), due before Prototype exit, so "next
   version" can never roll over silently again. Because the clause discharges your acceptance
   condition, the re-deferral is yours to confirm: the drafted §8 text ships flagged in the cut's
   PR and is not merged as discharged until you say so.

10. **ADR-026 (CRS definition supply) — which supply route?** An operator cannot assert a CRS by
    typing "EPSG:2056": ADR-015 §5 requires axis order established *from the definition*, and the
    engine has no PROJ. Options: a pinned, versioned, content-hashed, in-tree plain-text
    definition set (displayed in full before assertion, never fetched at runtime — the ADR-021
    static-link security property applied here); paste-PROJJSON-verbatim; or both.
    Recommendation: **both**; filed Proposed as ADR-026; the cut's P2 builds to it unless you
    override. Choosing a catalog entry is recorded as provenance (entry id + content hash, or
    `pasted`), never as an equivalence judgment — docs/05's grid rule applied to definitions.

11. **Scope confirmation — remediation is *declare*, never *detect*.** The cut lists candidate
    identity columns by type-eligibility only (64-bit integers, schema order, unranked, no
    preselection, no confidence) per ADR-016 §3; anything smarter ("this looks like an id") is
    the Alpha data doctor's detect→propose→preview→apply territory (docs/05) and stays out.
    Recommendation: **confirm**; the cut proceeds on it. (ADR-016 acceptance is entry 16.)

7. **[OBSERVATION IN, 2026-08-30 — your ruling now ripe.]** You sat through the "Preparing…"
   silence twice at 5 GB, and on first contact it read as "it doesn't publish" (Part H result
   log). The question this entry always carried is now concretely yours: does the gap become a
   third binding condition on the exposure ruling (thread the CancelToken + a phase label into
   prepare — small, host-side), or is declare-and-observe's observation enough to schedule the
   fix as ordinary debt? Original entry follows.
   **Part H: the principle-7 publish-prepare gap — pre-fix or declare-and-observe?** The shell's
   publish-prepare runs an **uncancellable, progress-less whole-file SHA-256** ("Preparing…" for
   tens of seconds at 5 GB; the only figure on record is a withdrawn 20s) before the approval
   dialog appears — a named docs/01 principle-7 gap, pre-existing and disclosed in the code's own
   comment, but Part H is the first time a human meets it. Options: pre-fix now (thread the
   CancelToken + a phase label into prepare — small, host-side) or declare it in H6's step text
   and let your observation decide whether it becomes a third binding condition on the exposure
   ruling. Architect and custodian both recommend **declare-and-observe**. Proceeding on that
   unless you override before the run. *(Expiry note, 2026-08-19, architect: declare-and-observe
   is honest only while Part H is imminent — if the batch slips much past a week, the pre-fix
   option gets re-offered rather than "observe" quietly becoming "tolerate".)*

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

6. **Audit format: `ApprovalRoute` gains `"shell-dialog"` within `spatial-audit/1`.** The audit
   record's approval_route currently knows "interactive" (stdin) and "flag" (--approve); a shell
   dialog approval recorded as either would be false. Adding the value is a value-domain widening
   inside an unchanged key set — permissible without a spatial-audit/2 bump ONLY on the dated
   no-external-readers fact (the C1/C3 discipline), with an expiry clause when a reader exists.
   The architect flags it as your decision, not a detail. Recommendation: **approve**; the cut
   proceeds on it unless you override. Touches: `kernel/src/permission/audit/`, ADR-024's text.

3. **ADR-022 acceptance — style v0 as the project's single style model.** Filed Proposed and
   implemented this cut under the ADR-019/020/021 precedent: the shell became §5a's second
   consumer via the renderer-owned extracted resolver (`renderer/style-ts`), the agreement vector
   gained a third reader, CI gates now watch the extracted module, and the operator's F7
   round-trip visually confirmed shell-and-viewer agreement. The ephemeral-view-state
   consequences (no undo; persistence triggers class-2 + docs/11 in the same commit) are stated
   in the ADR. Recommendation: **accept**. Touches on acceptance: ADR-022's status line +
   docs/02/README index entries.

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

- **2026-09-02 — the ADR-011 gate-8 ruling: option (d), accept with the two tail mechanisms as
  named binding debt (the ADR-021-condition pattern), rider attached.** Presented 2026-09-01 as
  four options against the completed dual-arm campaign (`frontends/shell/RESULTS.md`, P8 pre-fix
  + Amendment-23/P10 post-fix): (a) accept as-is; (b) reject; (c) iterate the two tails; **(d)
  accept, with zoom-to-layer's sustained new-tile admission window and pan-west's large-batch
  re-admission spike recorded as named binding debt in ADR-028, never silently dropped from a
  future cut's scope (custodian recommendation, taken).** The human's own rider, verbatim:
  *"ADR-028's acceptance itself is NOT discharged by this ruling — it waits until walkthrough
  Part K and the deferred 5 GB G1/G2 cells are in; if K's felt verdict or the 5 GB trace
  contradicts the accept-class reading (error-shaped refusals still reachable, or the partial
  view illegible in practice), the ruling reopens rather than stands."* Applied: ADR-028 gains a
  dated, appended gate-8 section (both campaigns' evidence gate-by-gate, the two mechanisms named
  by direct per-step attribution, the ruling and rider recorded verbatim) — its Status line stays
  **Proposed**, not moved to Accepted, per the rider. Touches on the eventual acceptance (not yet
  triggered): ADR-028's Status line, ADR-011 gate 8 marked met, `docs/02`/`docs/README` index
  entries — a later, separate custodian action once Part K + the 5 GB G1/G2 cells land clean.

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
