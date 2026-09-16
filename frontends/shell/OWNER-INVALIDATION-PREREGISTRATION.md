# Preregistration — owner-side invalidation and the kernel-authoritative dead-ticket refusal (Brief A, P3b)

*Custodian's filing note (2026-09-16, not part of the architect's text): written verbatim from the architect's draft to this path by the owning-module rule (`docs/README.md:29`; the predicted diff is shell + kernel with `engine/` empty). Every `file:line` into `engine/ADMISSION-PREREGISTRATION.md` below uses the P3a branch's numbering (§13 C is `:316` there and `:248` on `main` until P3a merges; Amendment 3 is `:705-835` there and not yet on `main`); the `:234` cite for the P6 sight list is imprecise — the four strings are pinned at `frontends/shell/src/admission/formatRefusal.test.ts:181`. Spot-checked by the custodian against the worktree and `main`: the ruling quotes, boundaries 3–4 and 10, G-A2, ADR-010 rules 5–6, the Proposed ADR-016 amendment's rule 3, `App.tsx:1104`, `liveTicketSet.ts:41-52`, `kernel/src/skp.rs:657-663` and `:992-994`, `formatRefusal.ts:67-75`, `pick.ts:26-28`/`:53`, `WorkingCanvas.tsx:116`/`:196-200`, `client.ts:58-65`, `src-tauri/src/lib.rs:368` — all resolve as quoted. A worker re-derives every cite at P3b's own head.*

*Drafted 2026-09-16 by the architect agent on the custodian's brief, from: the human's ruling of
2026-09-16 (`DECISIONS-PENDING.md:20-24`, question round 4); `state/NEXT-CUT.md`'s P3 row (`:103`)
and settled boundaries 3–9 (`:48-82` — **note**, the brief passed to this consult cited `:50-71`;
the boundaries as read in the tree run `:48-82`, boundary 3 opening at `:48` and boundary 9 closing
at `:82`); `engine/ADMISSION-PREREGISTRATION.md` §12b G-A2 (`:221`), §13 C (`:316`) and §13 D
(`:318`); and **Amendment 3** on the P3a branch, which records exactly what P3a removed and
deferred. Every `file:line` below was read in the worktree
`C:\dev\spatial-ide\.claude\worktrees\agent-a540414a78be0698a` (the custodian's statement that this
is branch `cut/briefa-p3`; no git command was run by the drafter). **A worker re-derives every cite
it touches at P3b's own head before relying on it.**

**Committed before any code** — the discipline `engine/ADMISSION-PREREGISTRATION.md:5` keeps and
this document inherits.

**Append-only once committed. An amendment made after any outcome has been seen MUST say so in its
first line** (the ADMISSION rule, `engine/ADMISSION-PREREGISTRATION.md:5`) and state what work it
touches or invalidates. Amendment classes: the five pre-declared in `docs/PREREGISTRATION-TEMPLATE.md:101-122`.
No class is invented after the fact; if none fits, that is a finding routed to the human.

**Gating class: §21a full gating.** This piece changes a **stated user-visible guarantee** — boundary
4's "residency cleared, picks refused until reopen" (`state/NEXT-CUT.md:54-63`), which P3a
deliberately does not satisfy — so the full form and full two-agent gating apply regardless of size.

---

## 0. Disclosure — written after P3a's two failed gate rounds and the split

This document exists because of a named failure, and the failure is stated rather than left to be
inferred from the split.

1. **P3 failed its gates twice.** Attempt 1: reviewer FAIL and architect FAIL
   (`ADMISSION-PREREGISTRATION.md:597`). Attempt 2: reviewer FAIL and architect FAIL
   (`:707-708`). The second round's findings were of one class — **code written against an interface
   the other side did not have**:
   - `EngineSourceFactory::ticket_only_with_generations` and the redemption-time `ticket_is_live`
     guard: *"nothing ever constructed a factory that held the generation map, so the guard it
     existed for never ran in any build"* (`:739-741`);
   - that guard's refusal *"told a caller its source 'was observed to have changed' for any handle
     the map did not know — expired, already redeemed, never minted — which is a diagnosis the
     kernel had not made (`docs/01` principle 8)"* (`:742-744`);
   - `onSessionEnded` on both streaming managers and `TileViewportStreamManager.isSessionEnded()`:
     *"No owner subscribed to either."* (`:749-750`);
   - and a correction of Amendment 2's own claim that `ticket_is_live` *"gained the caller it was
     written for"*: *"That was untrue of the tree: the only caller was reached through a constructor
     no product code ever called, so the method was dead in every build that shipped."* (`:823-826`).
2. **The human split the piece on those findings** (`DECISIONS-PENDING.md:22`, verbatim):
   *"P3b gets its own preregistration and gates: the owner-side invalidation (residency cleared,
   picks refused — the consequence P3's own row promised), the kernel-authoritative dead-ticket
   refusal wired with a real caller and correct unknown-handle behaviour, and the §12e amendment
   recording the split. No release includes P3a without P3b."*
   And the permanent class fix (`:24`, verbatim): *"any cross-module seam is written against the
   interface the other side actually has — read it first — and is proven by one end-to-end test from
   the real shape; a test that encodes an imagined interface is a gate failure by name."*
3. **What informed §2 below: the actual interfaces, read before this was written.** Every consuming
   interface P3b crosses was read in the worktree and is cited by `file:line` in §2. No interface in
   this document is described from memory or from a sibling's doc comment.
4. **Three facts found while reading, disclosed now rather than presented later as discoveries:**
   - **(a) The candidate arm's untiled first-look stream has no source-changed check at all.**
     `isSourceChangedTerminal` is called at exactly two product sites —
     `frontends/shell/src/streaming/viewportStreamManager.ts:270` and
     `frontends/shell/src/streaming/tileViewportStreamManager.ts:1019`. The candidate session owns a
     *third* stream sink of its own (`frontends/shell/src/residency/candidateArmSession.ts:1217-1278`,
     the untiled "first look"/reissue), and it tests no terminal code. A change detected on that
     stream's post-check today ends nothing on the client.
   - **(b) The typed code now reaches the operator as raw text on the streaming banner.** P3a
     prefixes **every** engine terminal with its code (`kernel/src/lib.rs:479-483`,
     `kernel/src/skp.rs:992-994`), and the baseline owner interpolates the detail whole:
     `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)` (`frontends/shell/src/App.tsx:1104`).
     No consumer parses a terminal's code prefix — `formatPublishRefusal.ts:37-42` parses the
     *publish* surface only. This is the same class as the publish-consumer regression the ruling
     named, on the other surface.
   - **(c) A string P3a landed is not yet true.** `refusalGuidance("engine.source_changed")`
     (`frontends/shell/src/admission/formatRefusal.ts:67-75`) tells the operator *"Everything read so
     far has been discarded"*. With residency not cleared (P3a's own statement,
     `ADMISSION-PREREGISTRATION.md:754-758`), that sentence is false of the working canvas today.
     P3b makes it true; it does not edit it (the wording is the human's at P6).
5. **No pilot, no spike, no measurement informed this document.** No P3b code exists at drafting time.

**Fixture-drive confound (standing, `AUTONOMY.md` §15a):** not applicable — this piece **measures
nothing** (§1, §6). No 5 GB fixture is opened; the E2E step uses a scratch copy of the 100k fixture
and records no timing.

---

## 1. What this preregistration may and may not claim

- **No performance claim, no `docs/08` row, not even proposed** (boundary 10, `state/NEXT-CUT.md:83-84`;
  A6). No duration, rate or performance word appears in any test name, comment, status string or
  walkthrough row (ADR-018).
- **No cancellation-vocabulary drift (ADR-018).** A cancelled stream keeps its `cancelled` terminal
  while the change still ends the session — §13 C rule (ii) (`ADMISSION-PREREGISTRATION.md:316`),
  already implemented at `kernel/src/lib.rs:416-431`. P3b adds no new terminal kind and renames none.
- **Wire surface: none added.**
  - The **pre-check refusal already has its control-plane code**: `engine.source_changed` is a
    declared `skp/0.3` refusal (`protocol/skp/SKP-V0.md:602-608`), minted by
    `kernel/src/skp.rs::error_of` (`:1040-1041`) and returned from `viewport_query`'s live-generation
    check (`kernel/src/skp.rs:657-663`). The shell already receives it as a thrown
    `SkpCallError` carrying `.skpError.code` (`frontends/shell/src/skp/client.ts:24-31, 58-65`).
  - The **dead-ticket refusal at redemption** rides the `String` the data plane already carries: a
    `SourceFactory::create` error becomes `TERM_PRODUCER_FAILED` with that detail
    (`protocol/data-plane/src/server.rs:386-401`), and the detail is produced by the existing
    `terminal_detail_of` (`kernel/src/skp.rs:992-994`). **No new code, no new field, no new frame.**
  - **`protocol/data-plane/` has an empty diff** (block-on-sight A3, `ADMISSION-PREREGISTRATION.md:212`).
  - **`SKP_VERSION` is unchanged.** `skp/0.3` is not re-opened and `skp/0.4` is not minted
    (`protocol/skp/SKP-V0.md:628-636`).
- **Wording of every user-visible string is the human's.** The four states already queued for P6
  sight are unchanged in wording here (`ADMISSION-PREREGISTRATION.md:234`; the four are pinned at
  `frontends/shell/src/admission/formatRefusal.test.ts:181`). P3b adds at most **two** new strings —
  the pick-refusal readout and the session-ended status line — and both are the human's at P6. No
  test asserts either verbatim.
- **No ADR is amended by this file.** Cited: **ADR-010** rule 5 (`:68`, *"Staleness is signalled,
  never silently served"*) and rule 6 (`:70`, *"Capacity ceilings are declared, not discovered"*);
  **ADR-016** and its Proposed Amendment 1 (`docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md:31-43`,
  the `by-construction-within-generation` basis, implemented at `engine/src/identity.rs:118-126`);
  **ADR-018**; **ADR-019** (tickets; `kernel/src/skp.rs:97-99`); **ADR-021** (no wire change beyond
  `skp/0.3`); **ADR-028** (residency contract, `frontends/shell/src/residency/*`). The **ADR-016
  Amendment 1 acceptance itself is the human's**, at P6, and is not taken by any outcome of this
  piece (§2e).
- **No snapshot claim, anywhere** (A1). P3b clears what a *detected* change invalidates; it
  establishes nothing about what came before the detection.

---

## 2. The rule — stated before it is applied, split on the module boundary

**What P3b owes, by name, is exactly Amendment 3 §3's deferral list** (`ADMISSION-PREREGISTRATION.md:752-765`):
owner-side invalidation (residency cleared, picks refused); the kernel-authoritative dead-ticket
refusal wired to a real caller with correct three-valued unknown-handle behaviour; the ADR-016
Amendment 1 acceptance; and boundary 4's own sentence about detection clearing residency and
refusing picks. Each is picked up below by name.

### 2a. Owner-side invalidation on the **data-plane terminal** route (`engine.source_changed:` prefix)

The trigger already exists and is unchanged: a terminal whose `detail` **starts with**
`"engine.source_changed: "` (`frontends/shell/src/streaming/liveTicketSet.ts:41-52`).

**(i) The notification seam — and it lands with its subscriber in the same diff.** Each manager gains
one option, `onSessionEnded(detail: string): void`, called **exactly once** per manager (both already
latch idempotently: `viewportStreamManager.ts:270-279`; `tileViewportStreamManager.ts:714-722`). This
re-lands what P3a removed (`ADMISSION-PREREGISTRATION.md:749-750`) **with the owner subscribed in the
same commit** — a callback without a product subscriber is a block-on-sight (§8.1).

**(ii) Baseline arm — owner `frontends/shell/src/App.tsx`.**
  - The manager clears the working canvas's residency **through the interface the owner already
    has**: its own `clearResidency()` (`viewportStreamManager.ts:349-356`) fires
    `opts.onSuperseded(resident)`, which `makeManagerCallbacks` wires to
    `canvas.clearStream(streamHandle)` (`App.tsx:538-540`; the handle method at
    `frontends/shell/src/canvas/WorkingCanvas.tsx:116`). The source-changed branch
    (`viewportStreamManager.ts:270-279`) today nulls `residentStreamHandle` **without** clearing;
    P3b calls `clearResidency()` *before* nulling it. **No new canvas method is added.**
    Declared structural fact this rests on: the baseline resident set holds at most one stream's
    batches at a time, because every issue supersedes through `clearResidency`
    (`viewportStreamManager.ts:324-338`). It is asserted (§4 T4), not assumed.
  - `App.tsx` subscribes `onSessionEnded` at its construction site (`App.tsx:1096-1120`) and runs one
    exported pure handler, `handleSessionEnded(detail, deps)` — the same extracted-for-testability
    shape `admitAndResetStaleUiState` (`App.tsx:156-194`) and `handleCanvasCeilingRefusal`
    (`App.tsx:589-601`) already take. It: sets the session-ended latch; sets the typed status; and
    clears `hover` to the refusal readout (2a-iv).
- **(iii) Candidate (tiled) arm — owner `frontends/shell/src/residency/candidateArmSession.ts`.**
  - `TileViewportStreamManager.endSession` (`:714-722`) keeps everything it does today and adds the
    `onSessionEnded` call. It does **not** learn the resident set — the accessor it holds answers
    per tile only (`tileViewportStreamManager.ts:45-63`).
  - The session clears the tile resident set through the interface it already has:
    `canvas.clearAllTiles()` (`WorkingCanvas.tsx:196-200`, implemented `:1656`), which the session
    already calls on a filter reissue (`candidateArmSession.ts:200-210`). This also clears the
    untiled first look, whose batches are ingested under `INITIAL_TILE_KEY`
    (`candidateArmSession.ts:1235`).
  - **The third sink, found by reading (disclosure 4a):** the session's own untiled stream terminal
    (`candidateArmSession.ts:1238-1278`) gains the identical `isSourceChangedTerminal` test and ends
    the session the same way. Without it, a change detected on the *first* query of a tiled session —
    the likeliest place — ends nothing.
  - `CandidateArmSessionDeps` gains `onSessionEnded`, subscribed by `App.tsx` at the candidate
    construction site (`App.tsx:1013-1046`), so both arms reach the *same* App-level handler.
- **(iv) Picks refused — the latch, and why it cannot be left to residency going empty.** With
  residency cleared, `onHover` resolves no layer and emits `null`
  (`WorkingCanvas.tsx:1965-1977`) — silence, which is *"nothing under the cursor"*, not a refusal.
  ADR-010 rule 5 (`:68`) forbids exactly that reading. P3b therefore adds:
  - a fourth readout state in `frontends/shell/src/canvas/pick.ts` — `PickSessionEnded { kind:
    "session-ended" }` beside `PickBelowResolution` (`pick.ts:26-28`) and `PickConfirming`
    (`pick.ts:44-47`), with its guard, added to the `HoverReadout` union (`pick.ts:53`);
  - a branch in `HoverReadoutView` (`frontends/shell/src/canvas/HoverReadoutView.tsx:48-69`) placed
    **first**, before the confirming branch, so a standing id can never be rendered after the session
    ended (the structural discipline that file already states at `:38-41`);
  - one latch site: `App.tsx:1365`'s `onHover={setHover}` becomes `onHover={(r) =>
    setHover(latchedHoverReadout(r, sessionEndedRef.current))}`, with `latchedHoverReadout` a pure
    exported function in `pick.ts`. **One site covers both arms**, because hover is arm-independent.
  - The latch is **permanent for the session** — cleared only by a dataset reopen, which remounts the
    canvas and rebuilds both managers (`App.tsx:1359-1360`, keyed on `admitted.dataset`).
- **(v) The typed status.** The terminal's detail is parsed — never interpolated raw — by a new
  `formatTerminalRefusal(detail)` built in the shape of `formatPublishRefusal`
  (`frontends/shell/src/publish/formatPublishRefusal.ts:37-42`), and `App.tsx:1104`'s
  `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)` is replaced by its output, so
  **no machine prefix reaches an operator on any terminal** (disclosure 4b). The session-ended status
  renders in the existing `.canvas-status-stack` (`App.tsx:1429-1488`) through `RefusalBlock`
  (`frontends/shell/src/admission/RefusalBlock.tsx:24-25`), which is what makes the already-landed
  `refusalGuidance("engine.source_changed")` copy (`formatRefusal.ts:67-75`) actually reach the
  operator. It is **not dismissible** — the `.residency-status` precedent (`App.tsx:1463-1475`) —
  because the state does not end until reopen.

### 2b. The **same latch** on the pre-check refusal (a thrown SKP error), asserted separately

G-A2's own wording requires both routes: *"Asserted at the pre-check and at the post-check paths
separately."* (`ADMISSION-PREREGISTRATION.md:221`).

- The refusal's real shape: `viewport_query` returns `error_of(&EngineError::SourceChanged{..})`
  (`kernel/src/skp.rs:657-663`, and the mint-race arm `:700-706`), which reaches the shell as a thrown
  `SkpCallError` with `.skpError.code === "engine.source_changed"`
  (`frontends/shell/src/skp/client.ts:58-65`).
- **Matched on the code**, in the precedent `RETRYABLE_ENGINE_CODE`/`isRetryableRefusal` already sets
  (`tileViewportStreamManager.ts:288-308`): a new `isSourceChangedRefusal(err: unknown): boolean`
  beside `isSourceChangedTerminal` in `liveTicketSet.ts`, testing `err instanceof SkpCallError &&
  err.skpError.code === SOURCE_CHANGED_CODE` — never prose.
- **Two product catch sites, because there are two:**
  1. `App.tsx`'s `reportViewportOutcome` (`:926-937`) — the one catch both arms' untiled issues land
     in (baseline `issueViewportQuery`; the candidate session's `reissueUnrestricted`, which
     *"rejects with the real `SkpCallError`"*, `candidateArmSession.ts:282-284`, awaiting
     `viewportQuery` at `:1201`). It keeps `setViewportRefusal(formatRefusal(...))` and additionally
     runs `handleSessionEnded` for this code.
  2. `TileViewportStreamManager.mintAndStart`'s refusal catch, which today only logs
     (`logMintRefused`, `tileViewportStreamManager.ts:244-262`): a source-changed refusal there calls
     `endSession`.
- Same consequences as 2a: residency cleared, picks latched, typed status. Asserted in its own tests
  (§4 T6, T7), never inferred from the terminal route's.

### 2c. The kernel-authoritative dead-ticket refusal at redemption — three-valued, with a real caller

**What is there today.** `EngineSourceFactory::ticket_only(catalog, tickets)`
(`kernel/src/lib.rs:283-285`) holds the ticket registry alone (`AdmissionMode::TicketOnly`,
`:246-249`); `create_from_ticket` parses the handle and calls `tickets.redeem(handle.as_str())`
(`:356-377`), whose own three refusals are unknown / cancelled-before-redeem / already-redeemed
(`kernel/src/skp.rs:169-203`). P3a's removal note stands in-source at `kernel/src/lib.rs:365-375`.

**The rule.**
1. `GenerationRegistry` (`kernel/src/skp.rs:277-453`) gains a **dead-ticket record**. This is
   necessary, not decorative: `invalidate` collects the ended handles and then `prune_locked` sweeps
   their attributions in the same call (`:432-442`, the prune condition at `:411-413`), so after an
   invalidation a dead ticket is **indistinguishable from an unknown one** in the current map. P3b
   moves the ended handles into `dead_tickets: HashMap<String, Instant>` inside `invalidate`, before
   the prune.
2. `pub fn ticket_liveness(&self, handle: &str) -> TicketLiveness`, with
   `pub enum TicketLiveness { Live, EndedBySourceChange, Unknown }`.
3. `create_from_ticket` matches it, and **only the middle arm refuses by name**:
   - `Live` → `tickets.redeem(handle)` unchanged;
   - `EndedBySourceChange` → `Err(skp::terminal_detail_of(&EngineError::SourceChanged { detail }))`
     — the `"<code>: <display>"` shape (`kernel/src/skp.rs:992-994`), which the data plane sends as
     `TERM_PRODUCER_FAILED` (`protocol/data-plane/src/server.rs:388-401`) and the shell's **existing**
     `isSourceChangedTerminal` already matches (`liveTicketSet.ts:50-52`). No new client code path.
   - `Unknown` → **falls through to `tickets.redeem(handle)`** and says whatever `redeem` says
     (`kernel/src/skp.rs:176-187`). The kernel never diagnoses a source change for a handle it has no
     record of — the exact fabrication the human's ruling removed
     (`ADMISSION-PREREGISTRATION.md:742-744`).
4. **The `pub` items and their product callers, named:**
   - `GenerationRegistry::ticket_liveness` + `TicketLiveness` — caller
     `EngineSourceFactory::create_from_ticket` (`kernel/src/lib.rs:356`), reached on every real START
     frame through `SourceFactory::create` (`kernel/src/lib.rs:288-303`,
     `protocol/data-plane/src/server.rs:384`).
   - `SkpHost::generations(&self) -> Arc<GenerationRegistry>` — re-added in the exact shape of the
     two accessors beside it, `catalog()` (`kernel/src/skp.rs:570-572`) and `tickets()` (`:574-578`),
     because the host constructs the registry privately (`:562`) and nothing else can hand out that
     `Arc`. **Its product caller is one line:** `frontends/shell/src-tauri/src/lib.rs:368`, today
     `factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets))`, becomes
     `…::ticket_only(catalog, tickets, host.generations())` — `host` is in scope, constructed at
     `frontends/shell/src-tauri/src/lib.rs:271`.
   - `EngineSourceFactory::ticket_only` gains the third parameter (`AdmissionMode::TicketOnly {
     tickets, generations }`). Existing test callers (e.g. `kernel/tests/typed_terminal_codes.rs:103`)
     are updated; **a test caller does not discharge the rule** — `lib.rs:368` is the caller that does.
   - `dead_ticket_count()` — an instrument with the test suite as its only caller, in the **named**
     category `attributed_ticket_count` already occupies with its stated justification
     (`kernel/src/skp.rs:376-392`). Declared here so a gate reads it as that category, not as a dead `pub`.

### 2d. The §12e amendment recording the split

Amendment 3 (`ADMISSION-PREREGISTRATION.md:705-835`) already records the split, the removals and the
deferrals, on the P3a branch. **P3b cites it and does not edit it.** On P3b landing, one further
append to `ADMISSION-PREREGISTRATION.md` §12e — class 1, *"Written after … results were seen"* as its
first line — records: which deferral each landed item discharges; that boundary 4's sentence is now
claimed and by what evidence; and G-A2's status (still P5's gate; P3b builds the behaviour G-A2
scores, and says so rather than claiming the gate).

### 2e. The ADR-016 amendment's acceptance, and the "clears residency and refuses picks" statement

- The **acceptance of the Proposed ADR-016 Amendment 1 is the human's, at P6** — a red line
  (`state/NEXT-CUT.md:106`; `ADMISSION-PREREGISTRATION.md:202`). Nothing in this piece's outcome
  accepts it; a full pass does not accept it either.
- **Every statement that detection "clears residency and refuses picks" lives here.** P3a claims
  neither (`ADMISSION-PREREGISTRATION.md:752-758`). P3b may make the claim **only** where the
  evidence in §4 supports it, and the claim's scope is exactly: *on a detected change, this client
  clears the resident geometry it holds for that dataset and refuses picks until the dataset is
  reopened.* It remains true, in the same breath, that the policy **does not establish snapshot
  consistency, cannot detect every in-place modification, and may detect a change during a query only
  at the post-check** (boundary 4, `state/NEXT-CUT.md:60-63`).
- The amendment's rule-3 text this discharges, verbatim from the Proposed draft
  (`docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md:52-58`): *"A detected change
  invalidates G: new tickets refused under G, in-flight producer streams cancelled through the
  existing cancel, residency cleared, picks refused until reopen, and a typed status 'source changed
  during use'."*

---

## 3. Fixtures / corpus — pre-declared outcomes

No corpus run happens here (P4 owns it, `state/NEXT-CUT.md:104`). Four fixtures, each hash-verified
before and after use (§8.8):

| id | fixture | how produced | used by |
|---|---|---|---|
| **X-1** | `target/fixtures/typed-terminals/dead-ticket-refusal.parquet` | `spatial_engine::fixture::write_geoparquet` with `IdentityMode::NativeUnique`, the shape at `kernel/tests/typed_terminal_codes.rs:41-56` | kernel E2E (T1, T2) |
| **X-2** | the real kernel terminal bytes for `EngineError::SourceChanged` | captured from a `cargo test` run and pinned **on the Rust side** as an exact-equality assertion, the publish precedent (`kernel/tests/typed_terminal_codes.rs:207-215`; consumer pinning at `frontends/shell/src/publish/formatPublishRefusal.test.ts:13-15`) | every shell unit test (T3–T7) |
| **X-3** | the real thrown SKP error for the pre-check: `error_of(&EngineError::SourceChanged{..})`'s `code` + `message` | pinned on the Rust side in the same test file | T6, T7 |
| **X-4** | a **scratch copy** of `target/fixtures/manual-walkthrough/100k-happy-path.parquet` (`e2e/regression.mjs:39`; regenerable by `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`, `:50`) | copied per run; mutated by an **mtime touch only** (`fs.utimesSync`), bytes untouched, the same single-component mutation the kernel E2E uses (`typed_terminal_codes.rs:61-69`) | E2E (T8) |

**A copy, not the fixture itself**, deliberately: other E2E steps share that file and a mutation
would end their sessions too.

**Pre-declared outcomes, per route × per owner** (each is a prediction; a miss is a recorded result,
never an edited prediction):

| # | route | owner | predicted outcome |
|---|---|---|---|
| 1 | terminal (`engine.source_changed:` prefix) | baseline (`App.tsx` + `ViewportStreamManager`) | resident stream cleared via `onSuperseded`→`clearStream`; `onSessionEnded` fires once; hover latched to the refusal readout; status shown without a machine prefix; no further query issues (`{kind:"session-ended"}`) |
| 2 | terminal, on a **tile** stream | candidate (`candidateArmSession` + `TileViewportStreamManager`) | `clearAllTiles()` called once; session latched; `onCameraChange` returns `{kind:"session-ended"}`; hover latched |
| 3 | terminal, on the **untiled first-look** stream | candidate | identical to 2 — **today: nothing happens at all** (disclosure 4a) |
| 4 | pre-check (thrown `SkpCallError`) | baseline | `viewportRefusal` set as today **and** the same clear + latch + status |
| 5 | pre-check, on a **tile mint** | candidate | `endSession` — today only a log line (`logMintRefused`) |
| 6 | redemption of a **dead** ticket | kernel | refusal detail starts `"engine.source_changed: "`; the client's existing terminal match fires |
| 7 | redemption of an **unknown** handle | kernel | `redeem`'s own "unknown" refusal; the string contains **no** source-change diagnosis |
| 8 | redemption of a **live** ticket | kernel | unchanged: a source is produced |

---

## 4. Tests, and the one mutation per new test

Every cross-module path is proven by **one end-to-end test from the real shape** — the real kernel
terminal bytes, the real thrown SKP error, a real `SkpHost::viewport_query` ticket at redemption
(the human's class fix, `DECISIONS-PENDING.md:24`).

**Kernel (`kernel/tests/session_generation.rs`, extending the file P3a already owns):**

- **T1 `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`** — *the E2E from
  the real shape.* Real `SkpHost` + real `Catalog`; `viewport_query` mints ticket A
  (`kernel/src/skp.rs:620`); the file's mtime is moved (`typed_terminal_codes.rs:61-69`); a **second
  real `viewport_query`** refuses at the pre-check and ends the generation through the product path
  (`kernel/src/skp.rs:673-678`) — nothing is fabricated and `end_generation` is not called by the
  test; then `EngineSourceFactory::ticket_only(catalog, tickets, host.generations())`
  — the constructor the shell installs — redeems A through `SourceFactory::create`. Asserts the
  refusal detail starts with `"engine.source_changed: "`.
  *Mutation:* delete the `EndedBySourceChange` arm from `create_from_ticket`. *Expected failure:* T1
  fails on the prefix assertion (the refusal degrades to `redeem`'s "cancelled before it was
  redeemed").
- **T2 `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`** — a syntactically
  valid handle never minted. Asserts the message is `redeem`'s unknown-ticket text and **does not
  contain** `"source_changed"` or `"changed"`.
  *Mutation:* map `Unknown` to the source-changed refusal (P3a's removed defect). *Expected failure:*
  T2 fails by name on the negative assertion.
- **T3 `the_dead_ticket_record_is_bounded`** — asserts `dead_ticket_count()` returns to zero for
  entries past `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE` and on `forget_dataset`/`mint_for_open`
  (`kernel/src/skp.rs:409-414, 445-452`).
  *Mutation:* drop the dead-ticket branch from `prune_locked`. *Expected failure:* T3's count
  assertion fails.

**Shell (vitest), every input the kernel's own pinned bytes (X-2/X-3):**

- **T4 `a_source_changed_terminal_clears_the_working_canvas_residency`**
  (`frontends/shell/src/streaming/viewportStreamManager.test.ts`) — the real manager, a batch pushed,
  then X-2 delivered as the terminal. Asserts `onSuperseded` fired for the resident handle exactly
  once and `onSessionEnded` once. *Mutation:* remove the `clearResidency()` call from the
  source-changed branch. *Expected failure:* T4 fails on the `onSuperseded` assertion.
- **T5 `a_source_changed_terminal_on_either_stream_clears_every_resident_tile`**
  (`frontends/shell/src/residency/candidateArmSession.test.ts`) — two cases: X-2 on a tile stream's
  terminal, and X-2 on the **untiled first-look** sink. Each asserts `canvas.clearAllTiles()` once
  and `deps.onSessionEnded` once. *Mutation:* delete the untiled sink's `isSourceChangedTerminal`
  test. *Expected failure:* the untiled case fails by name (and only it — which is the point).
- **T6 `the_pre_check_refusal_latches_the_session_in_the_untiled_catch`**
  (`frontends/shell/src/App.test.ts`) — `reportViewportOutcome`'s catch driven with a real
  `SkpCallError` built from X-3. Asserts the existing `viewportRefusal` behaviour is unchanged **and**
  the session-ended handler ran. *Mutation:* match on `message` instead of `code`. *Expected failure:*
  T6 fails (the pinned message is the human's prose and is not required to contain the code).
- **T7 `the_pre_check_refusal_latches_the_session_on_a_tile_mint`**
  (`frontends/shell/src/streaming/tileViewportStreamManager.test.ts`) — X-3 thrown from the mint.
  Asserts `endSession` ran (no further tiles planned). *Mutation:* revert the catch to
  `logMintRefused` only. *Expected failure:* T7 fails on the next-plan assertion.
- **T8 `picks_are_refused_after_the_session_ends`** (`frontends/shell/src/canvas/pick.test.ts` +
  `HoverReadoutView.test.tsx`) — `latchedHoverReadout` over all four readout states while latched;
  and the view renders the refusal, never a bare or standing id. *Mutation:* let `PickConfirming`
  pass through the latch. *Expected failure:* the "never a standing id" assertion fails.
- **T9 `a_terminal_refusal_reaches_the_operator_without_its_machine_prefix`**
  (`frontends/shell/src/streaming/formatTerminalRefusal.test.ts`) — input X-2 verbatim; asserts
  `{code:"engine.source_changed", message:<prose, prefix stripped>}`, and that an unprefixed detail is
  passed through whole (the `formatPublishRefusal.ts:37-42` contract). *Mutation:* return the message
  whole. *Expected failure:* T9 fails on the stripped-message assertion.

**E2E (one driver run, `frontends/shell/e2e/source-changed.mjs`):**

- **T10** — open X-4 through the real app (`window.__SPATIAL_E2E__.openPath`, `e2e/regression.mjs:412`),
  settle, touch the copy's mtime from node, trigger one query (a pan), then assert, in order: the
  status stack names the state with **no `engine.` prefix in the text**; resident vertices are zero
  (`getResidentCounts`, `WorkingCanvas.tsx:156-160`, through the existing E2E hook); a hover over a
  formerly-occupied pixel yields the refusal readout, not an id. *Mutation (run once, recorded):*
  skip the owner clear in a dev build → resident vertices non-zero → T10 fails by name. Recorded as a
  single observation with no timing (A6).

**The caller-grep, as a gate check (not a test):** for every item this diff adds — `onSessionEnded`
(×2 managers + deps), `ticket_liveness`, `TicketLiveness`, `SkpHost::generations`, `ticket_only`'s
third parameter, `isSourceChangedRefusal`, `formatTerminalRefusal`, `PickSessionEnded`,
`latchedHoverReadout`, `handleSessionEnded` — the PR body lists the **product** caller by
`file:line`. A test-only caller does not count (`DECISIONS-PENDING.md:22`). The one declared
exception is `dead_ticket_count`, in the named instrument category (§2c.4).

---

## 5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions (wrong is a result):**
1. The dead-ticket arm is reachable **only** in the mint→invalidate→redeem window; in every other
   ordering the terminal route (2a) or `redeem`'s own refusal answers first. T1 constructs that
   window from the real product path.
2. Without §2c's dead-ticket record, `ticket_liveness` could never answer `EndedBySourceChange`,
   because `invalidate`'s own prune erases the attribution it would read (`kernel/src/skp.rs:432-442`).
   Predicted: a first implementation that omits the record passes nothing but T2.
3. The untiled first-look sink (disclosure 4a) is the **most likely** place a real session first sees
   a changed source, because it is the first query a tiled session issues.
4. No new SKP code, field or fixture is needed (§1). If one is, that is an invalidator, not a small fix.
5. Clearing the baseline resident set needs **no** new `WorkingCanvasHandle` method, because
   `clearStream` plus the at-most-one-resident-stream invariant covers it (T4 asserts the invariant).

**Declared unchanged:**
- **ADR-010 rules 1, 2, 3 and 6** — no frame, origin, pick indirection or declared ceiling is touched.
  Rule 5 is *satisfied*, not amended.
- **`renderer/` is untouched** — zero files.
- **`protocol/data-plane/` is an empty diff**; `SKP_VERSION` stays `skp/0.3`; **no `skp/0.4`**.
- **`engine/` is predicted to be an empty diff** (the descriptor, pre-check and post-check are P3a's,
  landed). If P3b needs an engine change, that is an invalidator (below).
- Cancellation vocabulary (ADR-018); the `cancelled` terminal's own meaning; `Drop`'s stated residual
  (`kernel/src/lib.rs:405-411`).
- Every existing identity/CRS suite (A4/G-A6) and the P4/P5 gate work.

**Invalidators — the piece stops and returns to the human:**
- (a) any change required under `engine/src/` or `protocol/`;
- (b) any new SKP code, field or version literal;
- (c) a residency clear that cannot be expressed through the owner interfaces cited in §2a;
- (d) the dead-ticket record cannot be bounded without a timer that could resurrect a generation
  (the correctness reason at `kernel/src/skp.rs:301-306`);
- (e) the pick latch requires a change to deck.gl's own pick path.

**Falsification — this preregistration is wrong if any of these is observed:** a source-changed
terminal or pre-check refusal that leaves pickable geometry on the canvas; a dead-ticket refusal that
fires for a handle the kernel has no record of; an unknown handle answered with a source-change
diagnosis; a client path that decides invalidation by reading prose rather than a code; a callback,
option, code path or `pub` item landing without a product caller; or any claim that a session up to
the detection was a snapshot.

---

## 6. Instruments — assertions only, no measurement

| quantity | class | instrument |
|---|---|---|
| resident vertices/features after invalidation | **assertion** | `WorkingCanvasHandle.getResidentCounts()` (`WorkingCanvas.tsx:156-160`) |
| `onSuperseded` / `clearAllTiles` call counts | **assertion** | test doubles at the real option seams (`App.tsx:538-540`; `candidateArmSession.ts:200-210`) |
| hover readout state while latched | **assertion** | the typed union (`pick.ts:53`) — a structural fact, not a string |
| terminal detail shape | **assertion** | exact-equality on the kernel side (X-2), parse assertion on the shell side |
| ticket attributions / dead-ticket entries | **assertion** | `attributed_ticket_count` (`kernel/src/skp.rs:388`) and `dead_ticket_count` |

**No measurement appears in this piece.** No p50/p95, no dataset row, no `docs/08` line, no duration
in any test name or walkthrough row.

---

## 7. Declared values and ceilings

**No new constant is introduced, and none is discovered** (ADR-010 rule 6, `:70`):

| name | value | basis |
|---|---|---|
| dead-ticket record age bound | `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE` — **the existing sum, reused** | the reason the sum (not either term) is the bound is already stated at `kernel/src/skp.rs:399-405`; reusing it keeps one bound, not two |
| session-ended latch lifetime | **permanent until the dataset is reopened** — no timeout, declared | boundary 4's own words, *"picks refused until reopen"* (`state/NEXT-CUT.md:58-59`); a timeout would resurrect exactly what the never-resurrect rule prevents (`kernel/src/skp.rs:301-306`) |
| retry / backoff | **none** | a refusal that ends a session is not retryable; the existing retryable set stays `engine.connections_exhausted` alone (`tileViewportStreamManager.ts:288-297`) |

Any constant discovered during implementation is a finding, declared at its own site with its basis,
recorded as a §10 amendment — never tuned to a result.

---

## 8. Block-on-sight

1. **A subscriber-less callback, option, code path or `pub` item.** Any item added without a product
   caller named by `file:line` in the PR body. A test-only caller does not count
   (`DECISIONS-PENDING.md:22`). The named exception is the instrument category of §2c.4.
2. **A test encoding an imagined interface.** Any test whose input is an invented string, shape or
   signature where the real producer's output exists and could have been pinned
   (`DECISIONS-PENDING.md:24`).
3. **A fabricated source-change for an unknown handle.** Any refusal that says or implies the source
   changed for a handle the kernel has no record of (`docs/01` principle 8;
   `ADMISSION-PREREGISTRATION.md:742-744`).
4. **A residency clear that leaves pickable geometry.** Any path that clears the visible view without
   latching picks, or that answers a hover with silence rather than the named refusal
   (ADR-010 rule 5, `:68`).
5. **A release that includes P3a without P3b** (`DECISIONS-PENDING.md:22`, verbatim: *"No release
   includes P3a without P3b."*).
6. **A machine prefix reaching an operator.** Any `engine.*`/`publish.*` code rendered as raw text in
   a status, banner or readout.
7. **Any wire change**: a `protocol/data-plane/` diff, a new SKP code or field, or a `SKP_VERSION`
   other than `skp/0.3`.
8. **An unverified fixture**: any fixture used without a hash check before and after, or an X-4
   mutation that alters bytes rather than mtime.
9. **A snapshot claim, a duration, or a performance word** anywhere in the diff (A1, A6).
10. **An ADR Status changed by this piece.** ADR-016 Amendment 1's acceptance is the human's at P6
    (§2e).

---

## 9. Gates

- **Architect (full, §21a).** ADR-010 rules 5 and 6; ADR-016 + its Proposed Amendment 1 (nothing
  accepted here); ADR-018; ADR-019; ADR-021 (no wire change); ADR-028 (residency contract);
  boundaries 3–9 (`state/NEXT-CUT.md:48-82`); block-on-sight 1–10 **one by one, each answered in
  writing**; and the seam rule applied to each of the six seams this diff crosses: (i) kernel
  terminal → shell manager, (ii) kernel SKP error → shell catch, (iii) manager → owner
  (`onSessionEnded`), (iv) owner → canvas (`clearStream`/`clearAllTiles`), (v) canvas hover → App
  readout, (vi) shell app setup → `EngineSourceFactory` (`src-tauri/src/lib.rs:368`). For each: the
  consuming interface cited by `file:line` **as read at P3b's head**, and the end-to-end test from
  the real shape named.
- **Reviewer (full).** The whole diff; each contract change gated in its own right; the caller grep
  run and its output pasted; every mutation in §4 run and its failure recorded **by name**.
- **Suites.** `cargo test` (workspace), `npm test` + `npm run typecheck` + `npm run lint`,
  `npm run check:dist-clean`, `npm run verify:cites`, the E2E step T10. Green before either gate.
- **Operator (queued, felt verdicts are the human's).** One walkthrough row appended to
  **Part N** (`state/NEXT-CUT.md:106`), committed with a blank result log: *open the 100k copy, let
  it fill, change the file underneath, act on the canvas* — and the operator reads (1) the status
  line, (2) what happens to the view, (3) what a hover says, (4) that reopening restores normal
  service. **No duration in the row** (A6). The **four P6-sight strings** stay the human's and are
  unchanged by this piece: `engine.source_changed`, `engine.identity_ordinal_partitioned_unsupported`,
  `engine.internal_inconsistency`, `publish.geographic_crs_not_publishable`
  (`frontends/shell/src/admission/formatRefusal.ts:52-63`; the set pinned at
  `formatRefusal.test.ts:181`). The two strings P3b **adds** — the pick refusal and the session-ended
  status line — join that sight list rather than being settled here.

---

## 10. Amendments — opens empty, append-only

*(none — this section opens empty and is append-only from the first commit. Classes:
`docs/PREREGISTRATION-TEMPLATE.md:101-122`.)*
