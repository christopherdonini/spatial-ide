# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

17. **Next cut (action console) — the docs/07 Alpha split append; exact text for your sight.**
    The architect confirmed the action console as the next cut but split it: the Prototype ships
    ONLY principle 4's visibility obligation ("and shows it" is unphased docs/01 text, unmet
    across every shell surface since cut 1); docs/03's other two payoffs — session→notebook
    recording (docs/13's Workflow IR) and the AI flywheel (docs/04, as narrowed by docs/09) —
    stay Alpha. That split needs one appended note in docs/07 under Alpha, beside "Action
    console (03)". Drafted text (the entry-A sight-approval pattern):
    *"(Appended 2026-08-18.) **Split.** The Prototype ships the console's **principle-4
    visibility obligation only**: every shell GUI action displays either the exact control-plane
    request it sent, or a named statement that no API equivalent exists and which decision owns
    that gap. This is not the Alpha item — docs/03's console additionally promises
    session→notebook recording (13's Workflow IR) and the AI flywheel (04, as narrowed by 09),
    and **both stay Alpha**. Pulling the visibility half forward is not phase-jumping: docs/01
    principle 4's 'and shows it' clause is unphased and has been unmet across every shell
    surface since cut 1."*
    **This gates the cut's code** (with entry 18). Recommendation: approve as drafted.

18. **Principle 4's status for style and publish — accepted-with-a-deadline, or a defect?**
    The console will make undeniable what is true today: two shipped surfaces have NO API
    equivalent at all — style (ADR-022 makes it ephemeral view state; SKP-V0 §4 item 1 names
    `style` absent; ADR-023 holds the attribute question) and publish (binding-local by ADR-024,
    fenced by your ADR-017 acceptance condition). The console renders both as explicit
    "no API equivalent exists / not part of the API" entries pointing at those decisions — a
    debt register, not a cover. That reading of docs/01 principle 4 is strictly yours.
    Architect + custodian recommendation: **accepted-with-a-deadline, recorded in ADR-027** —
    publish's deadline inherited from ADR-017's acceptance condition (SKP/CLI/MCP exposure is
    already fenced to your review), style's from ADR-022/ADR-023's own resolution. **Gates the
    cut's code** (with entry 17).

19. **Action-console display details — proceeds on recommendations once 17/18 clear, unless
    you override.** (a) Class-B entries (the seven binding_* commands) render the command NAME
    and plain-language effect but never the argument object and never a copy affordance —
    principle 8 earns the name; ADR-024's fence earns the omission (a copyable
    binding_publish_prepare block would put an attacker-useful template in the page and imply
    callability the ADR denies). (b) Data-plane batch arrivals stay OUT of the console (a named
    scoping choice: entries are commands, not telemetry). (c) Ring-buffer ceilings (entry count,
    per-entry bytes) picked by the architect and shown plainly in the PR — note a CRS assertion's
    definition_json can legitimately be 65,536 bytes.

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

7. **Part H: the principle-7 publish-prepare gap — pre-fix or declare-and-observe?** The shell's
   publish-prepare runs an **uncancellable, progress-less whole-file SHA-256** ("Preparing…" for
   tens of seconds at 5 GB; the only figure on record is a withdrawn 20s) before the approval
   dialog appears — a named docs/01 principle-7 gap, pre-existing and disclosed in the code's own
   comment, but Part H is the first time a human meets it. Options: pre-fix now (thread the
   CancelToken + a phase label into prepare — small, host-side) or declare it in H6's step text
   and let your observation decide whether it becomes a third binding condition on the exposure
   ruling. Architect and custodian both recommend **declare-and-observe**. Proceeding on that
   unless you override before the run.

8. **Part H8b — complete a whole-file 5 GB publish to demonstrate the dead-artifact gap?** There
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
