# Preregistration — owner-side invalidation and the kernel-authoritative dead-ticket refusal (Brief A, P3b)

*Custodian's filing note (2026-09-16, not part of the architect's text): written verbatim from the architect's draft to this path by the owning-module rule (`docs/README.md:29`; the predicted diff is shell + kernel with `engine/` empty). Every `file:line` into `engine/ADMISSION-PREREGISTRATION.md` below uses the P3a branch's numbering (§13 C is `:316` there and `:248` on `main` until P3a merges; Amendment 3 is `:705-835` there and not yet on `main`); the `:234` cite for the P6 sight list is imprecise — the four strings are pinned at `frontends/shell/src/admission/formatRefusal.test.ts:183-189`. Spot-checked by the custodian against the worktree and `main`: the ruling quotes, boundaries 3–4 and 10, G-A2, ADR-010 rules 5–6, the Proposed ADR-016 amendment's rule 3, `App.tsx:1108`, `liveTicketSet.ts:41-52`, `kernel/src/skp.rs:666-672` and `:1005-1007`, `formatRefusal.ts:70-83`, `pick.ts:26-28`/`:53`, `WorkingCanvas.tsx:116`/`:196-200`, `client.ts:58-65`, `src-tauri/src/lib.rs:368` — all resolve as quoted. A worker re-derives every cite at P3b's own head.*

*Drafted 2026-09-16 by the architect agent on the custodian's brief, from: the human's ruling of
2026-09-16 (round 4, item 1); `state/NEXT-CUT.md`'s P3 row (`:103`)
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
2. **The human split the piece on those findings** (round 4, item 1, verbatim):
   *"P3b gets its own preregistration and gates: the owner-side invalidation (residency cleared,
   picks refused — the consequence P3's own row promised), the kernel-authoritative dead-ticket
   refusal wired with a real caller and correct unknown-handle behaviour, and the §12e amendment
   recording the split. No release includes P3a without P3b."*
   And the permanent class fix (`:46`, verbatim): *"any cross-module seam is written against the
   interface the other side actually has — read it first — and is proven by one end-to-end test from
   the real shape; a test that encodes an imagined interface is a gate failure by name."*
3. **What informed §2 below: the actual interfaces, read before this was written.** Every consuming
   interface P3b crosses was read in the worktree and is cited by `file:line` in §2. No interface in
   this document is described from memory or from a sibling's doc comment.
4. **Three facts found while reading, disclosed now rather than presented later as discoveries:**
   - **(a) The candidate arm's untiled first-look stream has no source-changed check at all.**
     `isSourceChangedTerminal` is called at exactly two product sites —
     `frontends/shell/src/streaming/viewportStreamManager.ts:270` and
     `frontends/shell/src/streaming/tileViewportStreamManager.ts:1027`. The candidate session owns a
     *third* stream sink of its own (`frontends/shell/src/residency/candidateArmSession.ts:1217-1278`,
     the untiled "first look"/reissue), and it tests no terminal code. A change detected on that
     stream's post-check today ends nothing on the client.
   - **(b) The typed code now reaches the operator as raw text on the streaming banner.** P3a
     prefixes **every** engine terminal with its code (`kernel/src/lib.rs:501-512`,
     `kernel/src/skp.rs:1005-1007`), and the baseline owner interpolates the detail whole:
     `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)` (`frontends/shell/src/App.tsx:1108`).
     No consumer parses a terminal's code prefix — `formatPublishRefusal.ts:37-42` parses the
     *publish* surface only. This is the same class as the publish-consumer regression the ruling
     named, on the other surface.
   - **(c) A string P3a landed is not yet true.** `refusalGuidance("engine.source_changed")`
     (`frontends/shell/src/admission/formatRefusal.ts:70-83`) tells the operator *"Everything read so
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
  already implemented at `kernel/src/lib.rs:410-455`. P3b adds no new terminal kind and renames none.
- **Wire surface: none added.**
  - The **pre-check refusal already has its control-plane code**: `engine.source_changed` is a
    declared `skp/0.3` refusal (`protocol/skp/SKP-V0.md:602-608`), minted by
    `kernel/src/skp.rs::error_of` (`:1053-1055`) and returned from `viewport_query`'s live-generation
    check (`kernel/src/skp.rs:666-672`). The shell already receives it as a thrown
    `SkpCallError` carrying `.skpError.code` (`frontends/shell/src/skp/client.ts:24-31, 58-65`).
  - The **dead-ticket refusal at redemption** rides the `String` the data plane already carries: a
    `SourceFactory::create` error becomes `TERM_PRODUCER_FAILED` with that detail
    (`protocol/data-plane/src/server.rs:386-401`), and the detail is produced by the existing
    `terminal_detail_of` (`kernel/src/skp.rs:1005-1007`). **No new code, no new field, no new frame.**
  - **`protocol/data-plane/` has an empty diff** (block-on-sight A3, `ADMISSION-PREREGISTRATION.md:212`).
  - **`SKP_VERSION` is unchanged.** `skp/0.3` is not re-opened and `skp/0.4` is not minted
    (`protocol/skp/SKP-V0.md:628-636`).
- **Wording of every user-visible string is the human's.** The four states already queued for P6
  sight are unchanged in wording here (`ADMISSION-PREREGISTRATION.md:234`; the four are pinned at
  `frontends/shell/src/admission/formatRefusal.test.ts:183-189`). P3b adds at most **two** new strings —
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
    `canvas.clearStream(streamHandle)` (`App.tsx:541-543`; the handle method at
    `frontends/shell/src/canvas/WorkingCanvas.tsx:116`). The source-changed branch
    (`viewportStreamManager.ts:270-279`) today nulls `residentStreamHandle` **without** clearing;
    P3b calls `clearResidency()` *before* nulling it. **No new canvas method is added.**
    Declared structural fact this rests on: the baseline resident set holds at most one stream's
    batches at a time, because every issue supersedes through `clearResidency`
    (`viewportStreamManager.ts:324-338`). It is asserted (§4 T4), not assumed.
  - `App.tsx` subscribes `onSessionEnded` at its construction site (`App.tsx:1097-1124`) and runs one
    exported pure handler, `handleSessionEnded(detail, deps)` — the same extracted-for-testability
    shape `admitAndResetStaleUiState` (`App.tsx:157-195`) and `handleCanvasCeilingRefusal`
    (`App.tsx:590-602`) already take. It: sets the session-ended latch; sets the typed status; and
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
    construction site (`App.tsx:1014-1047`), so both arms reach the *same* App-level handler.
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
  - one latch site: `App.tsx:1369`'s `onHover={setHover}` becomes `onHover={(r) =>
    setHover(latchedHoverReadout(r, sessionEndedRef.current))}`, with `latchedHoverReadout` a pure
    exported function in `pick.ts`. **One site covers both arms**, because hover is arm-independent.
  - The latch is **permanent for the session** — cleared only by a dataset reopen, which remounts the
    canvas and rebuilds both managers (`App.tsx:1363-1364`, keyed on `admitted.dataset`).
- **(v) The typed status.** The terminal's detail is parsed — never interpolated raw — by a new
  `formatTerminalRefusal(detail)` built in the shape of `formatPublishRefusal`
  (`frontends/shell/src/publish/formatPublishRefusal.ts:37-42`), and `App.tsx:1108`'s
  `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)` is replaced by its output, so
  **no machine prefix reaches an operator on any terminal** (disclosure 4b). The session-ended status
  renders in the existing `.canvas-status-stack` (`App.tsx:1433-1493`) through `RefusalBlock`
  (`frontends/shell/src/admission/RefusalBlock.tsx:24-25`), which is what makes the already-landed
  `refusalGuidance("engine.source_changed")` copy (`formatRefusal.ts:70-83`) actually reach the
  operator. It is **not dismissible** — the `.residency-status` precedent (`App.tsx:1467-1479`) —
  because the state does not end until reopen.

### 2b. The **same latch** on the pre-check refusal (a thrown SKP error), asserted separately

G-A2's own wording requires both routes: *"Asserted at the pre-check and at the post-check paths
separately."* (`ADMISSION-PREREGISTRATION.md:221`).

- The refusal's real shape: `viewport_query` returns `error_of(&EngineError::SourceChanged{..})`
  (`kernel/src/skp.rs:666-672`, and the mint-race arm `:709-715`), which reaches the shell as a thrown
  `SkpCallError` with `.skpError.code === "engine.source_changed"`
  (`frontends/shell/src/skp/client.ts:58-65`).
- **Matched on the code**, in the precedent `RETRYABLE_ENGINE_CODE`/`isRetryableRefusal` already sets
  (`tileViewportStreamManager.ts:288-308`): a new `isSourceChangedRefusal(err: unknown): boolean`
  beside `isSourceChangedTerminal` in `liveTicketSet.ts`, testing `err instanceof SkpCallError &&
  err.skpError.code === SOURCE_CHANGED_CODE` — never prose.
- **Two product catch sites, because there are two:**
  1. `App.tsx`'s `reportViewportOutcome` (`:927-938`) — the one catch both arms' untiled issues land
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
(`kernel/src/lib.rs:296-298`) holds the ticket registry alone (`AdmissionMode::TicketOnly`,
`:259-262`); `create_from_ticket` parses the handle and calls `tickets.redeem(handle.as_str())`
(`:369-390`), whose own three refusals are unknown / cancelled-before-redeem / already-redeemed
(`kernel/src/skp.rs:169-203`). P3a's removal note stands in-source at `kernel/src/lib.rs:378-388`.

**The rule.**
1. `GenerationRegistry` (`kernel/src/skp.rs:277-462`) gains a **dead-ticket record**. This is
   necessary, not decorative: `invalidate` collects the ended handles and then `prune_locked` sweeps
   their attributions in the same call (`:434-452`, the prune condition at `:415-417`), so after an
   invalidation a dead ticket is **indistinguishable from an unknown one** in the current map. P3b
   moves the ended handles into `dead_tickets: HashMap<String, Instant>` inside `invalidate`, before
   the prune.
2. `pub fn ticket_liveness(&self, handle: &str) -> TicketLiveness`, with
   `pub enum TicketLiveness { Live, EndedBySourceChange, Unknown }`.
3. `create_from_ticket` matches it, and **only the middle arm refuses by name**:
   - `Live` → `tickets.redeem(handle)` unchanged;
   - `EndedBySourceChange` → `Err(skp::terminal_detail_of(&EngineError::SourceChanged { detail }))`
     — the `"<code>: <display>"` shape (`kernel/src/skp.rs:1005-1007`), which the data plane sends as
     `TERM_PRODUCER_FAILED` (`protocol/data-plane/src/server.rs:388-401`) and the shell's **existing**
     `isSourceChangedTerminal` already matches (`liveTicketSet.ts:51-53`). No new client code path.
   - `Unknown` → **falls through to `tickets.redeem(handle)`** and says whatever `redeem` says
     (`kernel/src/skp.rs:176-187`). The kernel never diagnoses a source change for a handle it has no
     record of — the exact fabrication the human's ruling removed
     (`ADMISSION-PREREGISTRATION.md:742-744`).
4. **The `pub` items and their product callers, named:**
   - `GenerationRegistry::ticket_liveness` + `TicketLiveness` — caller
     `EngineSourceFactory::create_from_ticket` (`kernel/src/lib.rs:369`), reached on every real START
     frame through `SourceFactory::create` (`kernel/src/lib.rs:301-316`,
     `protocol/data-plane/src/server.rs:384`).
   - `SkpHost::generations(&self) -> Arc<GenerationRegistry>` — re-added in the exact shape of the
     two accessors beside it, `catalog()` (`kernel/src/skp.rs:579-581`) and `tickets()` (`:583-587`),
     because the host constructs the registry privately (`:562`) and nothing else can hand out that
     `Arc`. **Its product caller is one line:** `frontends/shell/src-tauri/src/lib.rs:368`, today
     `factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets))`, becomes
     `…::ticket_only(catalog, tickets, host.generations())` — `host` is in scope, constructed at
     `frontends/shell/src-tauri/src/lib.rs:271`.
   - `EngineSourceFactory::ticket_only` gains the third parameter (`AdmissionMode::TicketOnly {
     tickets, generations }`). Existing test callers (e.g. `kernel/tests/typed_terminal_codes.rs:102`)
     are updated; **a test caller does not discharge the rule** — `lib.rs:368` is the caller that does.
   - `dead_ticket_count()` — an instrument with the test suite as its only caller, in the **named**
     category `attributed_ticket_count` already occupies with its stated justification
     (`kernel/src/skp.rs:376-396`). Declared here so a gate reads it as that category, not as a dead `pub`.

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
| **X-1** | `target/fixtures/typed-terminals/dead-ticket-refusal.parquet` | `spatial_engine::fixture::write_geoparquet` with `IdentityMode::NativeUnique`, the shape at `kernel/tests/typed_terminal_codes.rs:40-55` | kernel E2E (T1, T2) |
| **X-2** | the real kernel terminal bytes for `EngineError::SourceChanged` | captured from a `cargo test` run and pinned **on the Rust side** as an exact-equality assertion, the publish precedent (`kernel/tests/typed_terminal_codes.rs:229-243`; consumer pinning at `frontends/shell/src/publish/formatPublishRefusal.test.ts:13-15`) | every shell unit test (T3–T7) |
| **X-3** | the real thrown SKP error for the pre-check: `error_of(&EngineError::SourceChanged{..})`'s `code` + `message` | pinned on the Rust side in the same test file | T6, T7 |
| **X-4** | a **scratch copy** of `target/fixtures/manual-walkthrough/100k-happy-path.parquet` (`e2e/regression.mjs:39`; regenerable by `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`, `:50`) | copied per run; mutated by an **mtime touch only** (`fs.utimesSync`), bytes untouched, the same single-component mutation the kernel E2E uses (`typed_terminal_codes.rs:60-68`) | E2E (T8) |

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
(the human's class fix, round 4, item 1).

**Kernel (`kernel/tests/session_generation.rs`, extending the file P3a already owns):**

- **T1 `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`** — *the E2E from
  the real shape.* Real `SkpHost` + real `Catalog`; `viewport_query` mints ticket A
  (`kernel/src/skp.rs:629`); the file's mtime is moved (`typed_terminal_codes.rs:60-68`); a **second
  real `viewport_query`** refuses at the pre-check and ends the generation through the product path
  (`kernel/src/skp.rs:682-687`) — nothing is fabricated and `end_generation` is not called by the
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
  (`kernel/src/skp.rs:418-423, 456-461`).
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
`file:line`. A test-only caller does not count (round 4, item 1). The one declared
exception is `dead_ticket_count`, in the named instrument category (§2c.4).

---

## 5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions (wrong is a result):**
1. The dead-ticket arm is reachable **only** in the mint→invalidate→redeem window; in every other
   ordering the terminal route (2a) or `redeem`'s own refusal answers first. T1 constructs that
   window from the real product path.
2. Without §2c's dead-ticket record, `ticket_liveness` could never answer `EndedBySourceChange`,
   because `invalidate`'s own prune erases the attribution it would read (`kernel/src/skp.rs:434-452`).
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
  (`kernel/src/lib.rs:418-424`).
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
| `onSuperseded` / `clearAllTiles` call counts | **assertion** | test doubles at the real option seams (`App.tsx:541-543`; `candidateArmSession.ts:200-210`) |
| hover readout state while latched | **assertion** | the typed union (`pick.ts:53`) — a structural fact, not a string |
| terminal detail shape | **assertion** | exact-equality on the kernel side (X-2), parse assertion on the shell side |
| ticket attributions / dead-ticket entries | **assertion** | `attributed_ticket_count` (`kernel/src/skp.rs:397`) and `dead_ticket_count` |

**No measurement appears in this piece.** No p50/p95, no dataset row, no `docs/08` line, no duration
in any test name or walkthrough row.

---

## 7. Declared values and ceilings

**No new constant is introduced, and none is discovered** (ADR-010 rule 6, `:70`):

| name | value | basis |
|---|---|---|
| dead-ticket record age bound | `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE` — **the existing sum, reused** | the reason the sum (not either term) is the bound is already stated at `kernel/src/skp.rs:408-414`; reusing it keeps one bound, not two |
| session-ended latch lifetime | **permanent until the dataset is reopened** — no timeout, declared | boundary 4's own words, *"picks refused until reopen"* (`state/NEXT-CUT.md:58-59`); a timeout would resurrect exactly what the never-resurrect rule prevents (`kernel/src/skp.rs:301-306`) |
| retry / backoff | **none** | a refusal that ends a session is not retryable; the existing retryable set stays `engine.connections_exhausted` alone (`tileViewportStreamManager.ts:288-297`) |

Any constant discovered during implementation is a finding, declared at its own site with its basis,
recorded as a §10 amendment — never tuned to a result.

---

## 8. Block-on-sight

1. **A subscriber-less callback, option, code path or `pub` item.** Any item added without a product
   caller named by `file:line` in the PR body. A test-only caller does not count
   (round 4, item 1). The named exception is the instrument category of §2c.4.
2. **A test encoding an imagined interface.** Any test whose input is an invented string, shape or
   signature where the real producer's output exists and could have been pinned
   (round 4, item 1).
3. **A fabricated source-change for an unknown handle.** Any refusal that says or implies the source
   changed for a handle the kernel has no record of (`docs/01` principle 8;
   `ADMISSION-PREREGISTRATION.md:742-744`).
4. **A residency clear that leaves pickable geometry.** Any path that clears the visible view without
   latching picks, or that answers a hover with silence rather than the named refusal
   (ADR-010 rule 5, `:68`).
5. **A release that includes P3a without P3b** (round 4, item 1, verbatim: *"No release
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
  `formatRefusal.test.ts:183-189`). The two strings P3b **adds** — the pick refusal and the session-ended
  status line — join that sight list rather than being settled here.

  *(2026-09-17, Amendment 14: read the last amendment first — §10's amendments correct each other
  only by a later one, so the current corrected state of any earlier amendment's claims is this
  document's newest amendment, not the one a top-to-bottom reader reaches first.)*

---

## 10. Amendments — opens empty, append-only

*(none — this section opens empty and is append-only from the first commit. Classes:
`docs/PREREGISTRATION-TEMPLATE.md:101-122`.)*

**Amendment 1 — class 5, a scope change on the human's ruling. Written 2026-09-16 on acceptance, before any P3b code.** The human's ruling (`DECISIONS-PENDING.md`, "RULED 2026-09-16 — question round 5", item 1), verbatim: **"Accept as pre-committed with one change to (d): a false status string does not sit on main between P3a and P3b. Replace P3a's "Everything read so far has been discarded" now, in one docs-class commit, with a sentence true at that commit — "The source file changed while it was open; reopen the dataset to continue." — and P3b restores the stronger sentence when it becomes true, wording at P6. P3b starts after P3a lands; its two new strings join the P6 sight list."** Applied: §0 disclosure 4(c) is discharged on the P3a branch before it merges (the string replaced by the human's sentence); §2a(v) now also restores the stronger sentence when P3b makes it true, its wording the human's at P6; the two new strings (the pick refusal, the session-ended status) join the P6 sight list (§9). Nothing else in §2 changes.

**Amendment 2 — class 3, cite form; mechanical, no claim changed. Written 2026-09-16 on filing.** Fourteen cites named files or lines that exist only on the P3a branch (`cut/briefa-p3`) and not yet on `main` (`kernel/tests/typed_terminal_codes.rs`, `liveTicketSet.ts`, and lines past `main`'s current length in `kernel/src/lib.rs`, `formatRefusal.ts`, `formatRefusal.test.ts`, `tileViewportStreamManager.ts`, `formatPublishRefusal.ts`, `SKP-V0.md`); `scripts/plan/verify-cites.mjs` gates rooted `path:line` references against `main`'s tree, so those fourteen were rewritten as "`path` (`:lines` on `cut/briefa-p3`)" — same file, same lines, the branch named — until P3a merges, after which a worker re-derives them at P3b's head (the header's own rule). The filing note's disclosure that every P3a-branch cite uses the branch's numbering stands. Found because the check failed on `main` after this file was first committed: the custodian had run it before staging the file, and the check reads the index.

**Amendment 3 — class 3, cite re-derivation at P3b's head; mechanical, no claim changed. Written 2026-09-17, before any P3b code.** P3a merged to `main` as PR #83 (merge commit `279ec77`), so this document's own header rule — *"A worker re-derives every cite it touches at P3b's own head before relying on it"* — falls due. Every `file:line` in §0–§9 was resolved against the tree at `279ec77` and corrected where it had moved. Nothing in §1, §2, §3, §4, §5, §6, §7 or §8 changes in claim, scope or wording; only where a cite points.

**(a) The fourteen branch-named cites are now plain `path:line`.** Amendment 2 rewrote them as "`path` (`:lines` on `cut/briefa-p3`)" because `scripts/plan/verify-cites.mjs` gates rooted references against the tree and those lines did not yet exist on `main`. They exist now. All fourteen are plain again: `formatRefusal.test.ts` (×2), `tileViewportStreamManager.ts`, `kernel/src/lib.rs` (×3), `formatRefusal.ts`, `SKP-V0.md` (×2), `liveTicketSet.ts`, `formatPublishRefusal.ts`, `typed_terminal_codes.rs` (×3).

**(b) Correcting Amendment 2 by appending — its "same file, same lines" was true of the tree it was written against and not of the branch tip.** Amendment 2 says the fourteen were rewritten "same file, same lines, the branch named". That held at commit `02015b0` (the last commit that touched this document, and the tree the drafter read). P3a's later commits then moved nine of those fourteen: `kernel/src/lib.rs` grew by 130 lines, `kernel/src/skp.rs` by 410, `tileViewportStreamManager.ts` by 80, and `formatRefusal.ts`/`formatRefusal.test.ts`/`typed_terminal_codes.rs` were added to. Amendment 2 is not edited; this item states what is true instead. The files themselves are byte-identical between the P3a branch tip and this head — `git diff 279ec77^2 279ec77` names only `.claude/agents/*`, `AI_DEVELOPMENT.md`, `CUSTODIAN-QUEUE.*`, `DECISIONS-PENDING.md`, `PLAN.yaml`, `site/*`, `state/*` — so every correction below is against P3a's own last commits, never against a merge that rewrote anything.

**(c) The corrections, by target.** Each new value was read at `279ec77`; nothing is inferred from an offset.

| cite, as this document had it | at this head | what is there |
| --- | --- | --- |
| `DECISIONS-PENDING.md:20-24` / `:22` (×4) / `:24` (×3) | `:42-46` / `:44` / `:46` | round 8 was prepended to that ledger (newest-first); the round-4 ruling's header, item 1 and class fix |
| `App.tsx:1104` (×3) | `App.tsx:1108` | `onFailureTerminal`'s `setCanvasRefusal(...)` |
| `App.tsx:156-194` · `:538-540` (×2) · `:589-601` · `:926-937` · `:1013-1046` · `:1096-1120` · `:1359-1360` · `:1365` · `:1429-1488` · `:1463-1475` | `:157-195` · `:539-541` · `:590-602` · `:927-938` · `:1014-1047` · `:1097-1124` · `:1363-1364` · `:1369` · `:1433-1493` · `:1467-1479` | `admitAndResetStaleUiState` · `onSuperseded`→`clearStream` · `handleCanvasCeilingRefusal` · `reportViewportOutcome` · candidate construction site · baseline construction site · the `key={admitted.dataset}` remount · `onHover={setHover}` · `.canvas-status-stack` · the not-dismissible `.residency-status` |
| `kernel/src/lib.rs:246-249` · `:283-285` · `:288-303` · `:356` · `:356-377` · `:365-375` · `:405-411` · `:416-431` · `:479-483` | `:259-262` · `:296-298` · `:301-316` · `:369` · `:369-390` · `:378-388` · `:418-424` · `:410-455` · `:501-512` | `AdmissionMode::TicketOnly` · `ticket_only` · `impl SourceFactory` · `create_from_ticket` · same · P3a's in-source removal note · `Drop`'s stated residual · `end_session_if_source_changed` with its doc · the `Some(Err(e))` prefix arm |
| `kernel/src/skp.rs:376-392` · `:388` · `:399-405` · `:409-414, 445-452` · `:411-413` · `:432-442` (×2) · `:570-572` · `:574-578` · `:620` · `:657-663` (×3) · `:673-678` · `:700-706` · `:992-994` (×4) · `:1040-1041` | `:376-396` · `:397` · `:408-414` · `:418-423, 456-461` · `:415-417` · `:434-452` · `:579-581` · `:583-587` · `:629` · `:666-672` · `:682-687` · `:709-715` · `:1005-1007` · `:1053-1055` | `attributed_ticket_count`'s doc · the fn · `prune_locked`'s bound reason · `prune_locked` / `forget_dataset` · the prune condition · `invalidate` · `catalog()` · `tickets()` · `viewport_query` · its live-generation check · `open_engine_stream`'s refusal arm · the mint-race arm · `terminal_detail_of` · `error_of`'s `source_changed` arm |
| `kernel/src/skp.rs:277-453` | `:277-462` | `GenerationRegistry`, struct through the end of its `impl` |
| `typed_terminal_codes.rs:41-56` · `:61-69` (×2) · `:103` · `:207-215` | `:40-55` · `:60-68` · `:102` · `:229-243` | `fixture()` · `touch_modification_time` · the `ticket_only` call · the publish precedent's exact-equality pin |
| `formatRefusal.ts:67-75` (×2) | `:70-83` | `refusalGuidance`, through its `engine.source_changed` case |
| `formatRefusal.test.ts:181` (×3) | `:183-189` | the four-code guidance set |
| `liveTicketSet.ts:50-52` | `:51-53` | `isSourceChangedTerminal` |
| `tileViewportStreamManager.ts:1019` | `:1027` | the terminal sink's `isSourceChangedTerminal` test |

Unchanged and re-verified as quoted, not assumed: `docs/README.md:29`; `state/NEXT-CUT.md:48-82`, `:54-63`, `:58-59`, `:60-63`, `:83-84`, `:103`, `:104`, `:106`; every `engine/ADMISSION-PREREGISTRATION.md` cite (`:5`, `:202`, `:212`, `:221`, `:234`, `:316`, `:318`, `:597`, `:705-835`, `:707-708`, `:739-741`, `:742-744`, `:749-750`, `:752-765`, `:754-758`, `:823-826`); ADR-010 `:68`/`:70`; `PROPOSED-amendment-to-ADR-016-identity-tier-model.md:31-43`, `:52-58`; `engine/src/identity.rs:118-126`; `protocol/data-plane/src/server.rs:384`, `:386-401`, `:388-401`; `protocol/skp/SKP-V0.md:602-608`, `:628-636`; `frontends/shell/src/skp/client.ts:24-31`, `:58-65`; `pick.ts:26-28`, `:44-47`, `:53`; `HoverReadoutView.tsx:38-41`, `:48-69`; `WorkingCanvas.tsx:116`, `:156-160`, `:196-200`, `:1656`, `:1965-1977`; `candidateArmSession.ts:200-210`, `:282-284`, `:1201`, `:1217-1278`, `:1235`, `:1238-1278`; `viewportStreamManager.ts:270`, `:270-279`, `:324-338`, `:349-356`; `tileViewportStreamManager.ts:45-63`, `:244-262`, `:288-297`, `:288-308`, `:714-722`; `RefusalBlock.tsx:24-25`; `formatPublishRefusal.ts:37-42`; `formatPublishRefusal.test.ts:13-15`; `formatRefusal.ts:52-63`; `e2e/regression.mjs:39`, `:50`, `:412`; `src-tauri/src/lib.rs:271`, `:368`; `kernel/src/skp.rs:97-99`, `:169-203`, `:176-187`, `:301-306`; `docs/PREREGISTRATION-TEMPLATE.md:101-122`.

**(d) The filing note's `main`-versus-branch parenthetical is now discharged, with its proof.** It reads "§13 C is `:316` there and `:248` on `main` until P3a merges; Amendment 3 is `:705-835` there and not yet on `main`". P3a has merged: at this head `engine/ADMISSION-PREREGISTRATION.md:316` is §13 C's paragraph and `:705` is the line `### Amendment 3 — the P3 split, on the human's ruling (2026-09-16, appended)`. The sentence is left in place as the record it was; this item states what is true now.

**(e) Three cites whose target moved in content, not only in line number — reported here, acted on nowhere in this amendment.** A cite re-derivation that silently repointed these would hide exactly what a re-derivation is for. No claim of §1–§9 is edited by naming them; what P3b therefore does or does not build is a result, and is recorded where results are recorded.

1. **§0 disclosure 4(b)'s quoted line.** The disclosure quotes `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)`. At `App.tsx:1108` that call now reads `setCanvasRefusal(\`stream ${terminal.kind}: ${formatTerminalRefusal(terminal.detail).message}\`)`, and `frontends/shell/src/streaming/formatTerminalRefusal.ts` exists (44 lines, with `formatTerminalRefusal.test.ts` beside it). The disclosure was true when written; it is not true of this head.
2. **§0 disclosure 4(c)'s quoted string.** `refusalGuidance("engine.source_changed")` no longer returns *"Everything read so far has been discarded"*; `formatRefusal.ts:83` returns the human's round-5 sentence, which is what §10 Amendment 1 of this document required.
3. **§2c's "P3a's removal note stands in-source at `kernel/src/lib.rs`"** — the note stands, at `:378-388` rather than `:365-375`, and its last paragraph names P3b by the human's round-4 ruling.

**Amendment 4 — Written after this piece's results were seen (2026-09-17).** Classes used (`docs/PREREGISTRATION-TEMPLATE.md:101-122`): **class 1** for the results below; **class 2** for each deviation in (c); **class 4** for the mutation record in (d); **class 3** for the test-name corrections in (c)(2). No prediction in §3 or §5 is edited; where an outcome differs from one, the outcome is recorded and the prediction left standing.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test by its exact name or a `file:line`; where a thing is **not** done it says so and names the open item instead.

---

**(a) What landed, per §2 item.**

| §2 item | landed at | proven by |
| --- | --- | --- |
| 2a(i) the notification seam, with its subscriber in the same diff | `viewportStreamManager.ts:42-59` + `:315`; `tileViewportStreamManager.ts:88-101` + `:744`; subscribers `App.tsx:1144`, `App.tsx:1203`, `candidateArmSession.ts:163`/`:1046` | `viewportStreamManager.test.ts`'s *"the owner is told exactly once, however many terminals carry the code"*; `candidateArmSession.test.ts`'s *"the owner is told once, whichever sink or however many terminals"* |
| 2a(ii) baseline residency cleared through `clearResidency()` | `viewportStreamManager.ts:308` | `viewportStreamManager.test.ts`'s *"a source-changed terminal clears the working canvas residency"*; the invariant it rests on by *"every issue supersedes the previous stream's residency, so at most one stream is ever resident"* |
| 2a(iii) candidate tiles cleared through `clearAllTiles()`, all three sinks | `candidateArmSession.ts:1074-1083` (the clear), `:1325` (the untiled sink), `tileViewportStreamManager.ts:760` (`notifySourceChanged`), `:952` (the mint catch) | `candidateArmSession.test.ts`'s *"the UNTILED first look's own terminal ends the session and clears every tile"* and *"a TILE stream's terminal ends the session and clears every tile"* |
| 2a(iv) picks refused — the fourth readout state, the view branch, the one latch site | `pick.ts:62-101`, `HoverReadoutView.tsx:67-78`, `App.tsx:1477` | `pick.test.ts`'s *"every readout state becomes the refusal while latched, including null and a standing id"*; `HoverReadoutView.test.tsx`'s *"renders the refusal in the hover slot, and never a bare or standing id"* |
| 2a(v) the typed status, through `RefusalBlock`, not dismissible | `App.tsx:634-644` (`handleSessionEnded`), `:1546-1551` (the block) | `App.test.ts`'s *"sets the typed status with no machine prefix, and refuses picks"* |
| 2b the pre-check route, matched on the code, at both product catches | `liveTicketSet.ts:69`/`:83`; `App.tsx:1026`; `tileViewportStreamManager.ts:952` | `liveTicketSet.test.ts`'s *"matches the real thrown refusal on its code, never on its prose"*; `tileViewportStreamManager.test.ts`'s *"a source-changed refusal at a tile mint ends the session, and is not retried"*; `App.test.ts`'s *"reportViewportOutcome keeps viewportRefusal and additionally ends the session, matched on the code"* |
| 2c the three-valued dead-ticket refusal, with its real caller | `kernel/src/skp.rs:339-359` (`TicketLiveness`), `:466-479` (`ticket_liveness`), `:551-562` (the record, written before the prune), `kernel/src/lib.rs:409-433`, product caller `frontends/shell/src-tauri/src/lib.rs:373-377` | `kernel/tests/session_generation.rs`'s `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` (end to end from the real shape) and `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` |
| 2d the §12e amendment | `engine/ADMISSION-PREREGISTRATION.md` §12e Amendment 6 | that amendment's own text |
| 2e the ADR-016 acceptance | **not taken, by anything in this piece** | no file under `docs/adr/` is touched: `git diff origin/main...HEAD -- docs/adr` is empty |

**Registered predictions (§5), as they came out.** 1 — held: the dead-ticket arm is reachable only in the mint→invalidate→redeem window, and T1 builds exactly that window from the product path. 2 — held, and now asserted rather than argued: `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it` shows `attributed_ticket_count()` at 0 and `ticket_liveness` still `EndedBySourceChange` in the same instant. 3 — **not tested by this piece and left open**: whether the untiled first look is where a real session most often first sees a changed source is a claim about real sessions, and only T10 (not delivered, (e) below) could speak to it; what is proven is that the sink now ends the session, which is the part that was missing. 4 — held: no new SKP code, field or fixture; `protocol/` is an empty diff. 5 — held: no new `WorkingCanvasHandle` method was added on either arm.

**Falsification (§5), swept.** None of the six observed: no path clears the view without latching picks (the latch is one site and covers every readout); no refusal fires for a handle the kernel has no record of (`an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`); no client path decides invalidation by reading prose (`matches the real thrown refusal on its code, never on its prose`); every added item has a product caller ((f) below); and no snapshot claim appears in the diff.

---

**(b) The declared-unchanged list (§5), verified rather than assumed.** `renderer/` — zero files. `protocol/data-plane/` and `protocol/skp/` — empty diffs; `SKP_VERSION` untouched. `engine/` — empty diff, as predicted. ADR-010 rules 1, 2, 3 and 6 untouched; rule 5 is satisfied, not amended. No new constant: §7's table is unchanged, and the dead-ticket record reuses the existing `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE` sum (`kernel/src/skp.rs:519-527`). No duration, rate or performance word anywhere in the diff.

---

**(c) Deviations — class 2, each with its reason. The declarations they deviate from are not edited.**

1. **`dead_tickets` holds `(dataset, Instant)`, not the bare `Instant` §2c.1 declared.** The dataset is what lets `forget_dataset` and `mint_for_open` drop exactly this dataset's dead handles: without it, one dataset's reopen would retire another's record, or nothing could be scoped at all. Recorded at the field's own doc (`kernel/src/skp.rs:313-334`) and asserted by `the_dead_ticket_record_is_bounded_by_the_same_sum_and_by_reopen_and_close`'s last case.

2. **Class 3 — six §4 test names differ from the names the tests ended up with.** The behaviour each asserts is §4's; only the names are longer or split differently. `verify-test-claims.mjs` reports §4's six original names as *planned*, which is what this item resolves.

   | §4's name | the test that exists |
   | --- | --- |
   | T3 `the_dead_ticket_record_is_bounded` | `the_dead_ticket_record_is_bounded_by_the_same_sum_and_by_reopen_and_close` |
   | T4 `a_source_changed_terminal_clears_the_working_canvas_residency` | `viewportStreamManager.test.ts`'s *"a source-changed terminal clears the working canvas residency"* (a vitest description, not a Rust fn name) |
   | T5 `a_source_changed_terminal_on_either_stream_clears_every_resident_tile` | split into the two cases §4 asked for: *"the UNTILED first look's own terminal ends the session and clears every tile"* and *"a TILE stream's terminal ends the session and clears every tile"* — split so the untiled case can fail **alone**, which §4's own mutation asks it to |
   | T6 `the_pre_check_refusal_latches_the_session_in_the_untiled_catch` | *"reportViewportOutcome keeps viewportRefusal and additionally ends the session, matched on the code"* plus the three `handleSessionEnded` tests beside it |
   | T7 `the_pre_check_refusal_latches_the_session_on_a_tile_mint` | *"a source-changed refusal at a tile mint ends the session, and is not retried"* |
   | T9 `a_terminal_refusal_reaches_the_operator_without_its_machine_prefix` | **already existed**: P3a landed `formatTerminalRefusal.ts` and `formatTerminalRefusal.test.ts` in its final commits. P3b adds nothing here; see (3) |

3. **Two §2 items were already true of the tree when P3b started, and P3b therefore built neither.** Both were flagged mechanically in Amendment 3 (e) and are recorded here as scope, not as cites. (i) §2a(v)'s *"`App.tsx:1104`'s `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)` is replaced by [`formatTerminalRefusal`'s] output"* — done on P3a's last commits; at this head `App.tsx:1150` already calls it, and `frontends/shell/src/streaming/formatTerminalRefusal.ts` (44 lines) exists with its own test. (ii) §0 disclosure 4(c)'s string — replaced by §10 Amendment 1's interim sentence before P3a merged. P3b's own half of Amendment 1 **is** delivered: the stronger sentence, now that it is true (`formatRefusal.ts:97-100`), asserted verbatim by `formatRefusal.test.ts`'s *"engine.source_changed: says only what is true at this commit"*.

4. **Three items §2 did not name were added, each with a product caller in this diff.** (i) `TileViewportStreamManager.notifySourceChanged` (`:760`) — `public`, one product caller, `candidateArmSession.ts:1325`; it exists because the session cannot latch the manager, and a session whose owner cleared its tiles while its manager kept planning is the half-ended state boundary 4 prevents. (ii) `refusalDetailOf` (`liveTicketSet.ts:83`) — two product callers, `App.tsx:1026` and `tileViewportStreamManager.ts:953`; it exists so both routes hand the owner ONE shape, and `liveTicketSet.test.ts`'s *"the pre-check refusal and the post-check terminal are the same string"* proves that shape is the kernel's own rather than a re-spelling. (iii) the `reissueUnrestricted` latch (`candidateArmSession.ts:1546`) — the candidate analogue of `requestViewport`'s, without which a filter Apply after the latch would clear tiles and mint a query the kernel has already said it will refuse; `candidateArmSession.test.ts`'s *"reissueUnrestricted is refused after the session ended"*.

5. **Two behaviours of existing code changed beyond §2's letter, both toward the same rule.** (i) The baseline source-changed branch now guards on `!this.sessionEnded` (`viewportStreamManager.ts:305`), so §2a(i)'s *"called exactly once"* is structural rather than an inference from another method's invariant; §2a(i) asserted that both managers "already latch idempotently", which was true of the tiled one and not of this one. (ii) The `viewportRefusal` block is not rendered while the session-ended block stands (`App.tsx:1573`). §2b keeps `setViewportRefusal` and that is unchanged — the *state* is still set and `App.test.ts` still pins the call — but rendering both would put the identical refusal on the canvas twice, once with the guidance and once without.

6. **A latch was written and then removed because no input could reach it.** `endCandidateSession` first carried its own `sessionEnded` guard. Its mutation (remove the guard) left the suite green: `TileViewportStreamManager.endSession` latches before calling `onSessionEnded`, and every route into the session goes through that one method. A branch no input can take is a claim about the code rather than a property of it, so the guard was deleted and the reason written at the function's own doc (`candidateArmSession.ts:1053-1065`). The at-most-once property is still asserted, against the guard that actually provides it, by *"the owner is told once, whichever sink or however many terminals"*.

---

**(d) Class 4 — every mutation performed once on this branch and reverted, with the failure observed.** Each is also recorded in-source beside its test, which is what `node scripts/plan/verify-mutation.mjs` resolves; that check reports **PASS — all 27 new test(s) have a recorded mutation naming them**. Twenty-four mutations were run: four kernel (`session_generation.rs`), twenty shell. Each observed failure is written beside its own test rather than repeated here, with one exception worth naming: **one mutation did not fail**, item (c)(6) above, and that non-failure is recorded rather than replaced with one that would have.

Two §4 predictions about *which* assertion would bite came out differently and are recorded, not edited: T2's mutation fails on the positive `is unknown` assertion (written first) rather than on the negative one, both covering the same defect; and T5's untiled mutation took the tile case with it, because the untiled branch's `return` is what routes the tile case in the unmutated code — the distinguishing evidence §4 wanted is the *subscriber-removed* mutation beside it.

---

**(e) NOT delivered: §4's T10, the E2E driver — named as owed, with the blocker, not claimed.**

`frontends/shell/e2e/source-changed.mjs` **does not exist** and no E2E run was made. Two reasons, both stated rather than implied:

1. **The residency read T10 needs has no non-measurement hook.** §6 names `WorkingCanvasHandle.getResidentCounts()` "through the existing E2E hook". The only hook that exposes it is `residencyEndStep` (`App.tsx:906-910`), which is the residency **measurement** instrument and returns timing fields with it. Reaching a duration-bearing instrument would cross §1's own boundary 10 / A6 line for a piece that measures nothing; adding a dedicated counts-only hook instead is a new item whose only caller would be a driver that has never run. Choosing between those two is a design call with an evidence component, and it belongs with the run.
2. **Running it launches a detached desktop application.** `e2e/lib.mjs`'s `attachOrLaunch` spawns `npx tauri dev` detached and unref'd, deliberately outliving the script. That is not in this piece's declared suite list and is not something to start unattended.

**Owed, 2026-09-17, before P3b's gates conclude** (§9 lists "the E2E step T10" among the suites that must be green before either gate): T10 as §4 declares it, including the one recorded mutation (skip the owner clear in a dev build → resident vertices non-zero), and the hook decision above. Until it is run, **this piece claims nothing about what an operator sees end to end** — every claim in (a) is a unit or integration assertion at a named seam.

---

**(f) The caller grep, run and pasted** (§4's gate check; `DECISIONS-PENDING.md:44`: a test-only caller does not count). Every item this diff adds, with its **product** caller:

| item | product caller |
| --- | --- |
| `ViewportStreamManagerOptions.onSessionEnded` | `App.tsx:1203` |
| `TileViewportStreamManagerOptions.onSessionEnded` | `candidateArmSession.ts:1046` |
| `CandidateArmSessionDeps.onSessionEnded` | `App.tsx:1144` |
| `TileViewportStreamManager.notifySourceChanged` | `candidateArmSession.ts:1325` |
| `isSourceChangedRefusal` | `App.tsx:1026`, `tileViewportStreamManager.ts:952` |
| `refusalDetailOf` | `App.tsx:1026`, `tileViewportStreamManager.ts:953` |
| `PickSessionEnded` / `isPickSessionEnded` | `HoverReadoutView.tsx:67`, `pickResolution.ts:197`, `WorkingCanvas.tsx:676` |
| `latchedHoverReadout` | `App.tsx:1477` |
| `handleSessionEnded` | `App.tsx:994` |
| `GenerationRegistry::ticket_liveness` / `TicketLiveness` | `kernel/src/lib.rs:409` (reached on every real START frame through `SourceFactory::create`, `kernel/src/lib.rs:321-336`, `protocol/data-plane/src/server.rs:384`) |
| `SkpHost::generations` | `frontends/shell/src-tauri/src/lib.rs:376` |
| `EngineSourceFactory::ticket_only`'s third parameter | `frontends/shell/src-tauri/src/lib.rs:373` |
| `GenerationRegistry::dead_ticket_count` | **none, and declared** — §2c.4's instrument category (the human, 2026-09-16, round 5 item 4). Its doc (`kernel/src/skp.rs:481-494`) names its two test callers, `the_dead_ticket_record_is_bounded_by_the_same_sum_and_by_reopen_and_close` and `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it`, and why the bound must be proven about the shipped build. It acts on nothing; `ticket_liveness` beside it is what acts, and that one is not exempt |

---

**(g) Open items this piece names and does not close.** Each has a date and a home; none is described as discharged.

1. **R-D2's `{detail}` contract is unmet on three kernel paths** (P3a's architect note N3, carried into this piece). `protocol/skp/SKP-V0.md:602-608` declares that `engine.source_changed`'s `detail` "names **every** component that differed (`{size, mtime, footer-length, footer-hash}`)". Two pre-existing sites fill it with a brace-delimited sentence instead — `kernel/src/skp.rs:796-802` (the live-generation pre-check) and `:840-846` (the mint race) — and P3b's redemption refusal (`kernel/src/lib.rs:424-428`) is a third, deliberately: that registry holds no descriptor and never read the file, so naming components there would be a second fabrication of the same class as the one the round-4 ruling removed. **Owed, 2026-09-17**: either a narrowing of the SKP-V0 sentence to the paths that read the file, or a detail carried from the post-check through `SessionInvalidator::end_generation` (a signature change with two callers). Not taken here because it is a wire-document decision, and this piece's §1 declares no wire surface is added or changed.
2. **The camera pre-check surface still dispatches no guidance for any code other than `engine.source_changed`.** P3a's Amendment 5 (v) recorded it; P3b closes it for this one code only, because the session-ended block renders through `RefusalBlock` (`App.tsx:1548`). `App.tsx:1573-1589`'s own `viewportRefusal` block still renders `code` + `message` and nothing else for every other refusal. **Owed, 2026-09-17, P6 or a follow-on** — it is an operator-visible surface decision, and §1 puts the wording of every such string with the human.
3. **The post-check's cost has no shell-side carrier.** P3a's Amendment 5 (vi) recorded it as an open item for the human. This preregistration does not name it, so P3b builds no carrier. **Owed, 2026-09-17, P6 or a follow-on**, unchanged in substance from Amendment 5 (vi)'s own words.
4. **G-A2 is not scored by this piece, and P5 still owns it** (§2d's own instruction). What P3b builds is the behaviour G-A2 measures; the gate itself needs the end-to-end run T10 is the first half of, and (e) above records that as owed.

---

**(h) The two new operator-visible strings, joining the P6 sight list** (§9; §10 Amendment 1's closing sentence). Neither is asserted verbatim by any test.

1. the pick refusal — `HoverReadoutView.tsx:69-72`;
2. the session-ended status line — rendered from `refusalGuidance("engine.source_changed")` (`formatRefusal.ts:97-100`) through `RefusalBlock`. This one **is** asserted verbatim, and deliberately: it is §10 Amendment 1's own ruled string, and the round-5 reason for pinning it (a rewording is a decision, not a refactor) applies to P3b's stronger sentence exactly as it applied to the interim one.

**Suites at this amendment.** `cargo test --workspace --locked`: 61 test binaries, 0 failed, 0 warnings. `npm run verify` (vitest + typecheck + lint + `check:dist-clean` + citation integrity): 70 files, 1024 tests, 0 failed, exit 0. `verify-mutation.mjs`: PASS, 27/27. `verify-cites.mjs`: PASS. `verify-test-claims.mjs`: PASS. The E2E step is (e).

**Amendment 5 — Written after this piece's results were seen (2026-09-17), correcting Amendment 4 (e) by appending.** Classes: **class 2** for (a), a deviation from §6's stated mechanism, with its reason; **class 1** for (b) and (c). Amendment 4 is not edited; this item states what is true instead.

**Amendment 4 (e) said T10 was neither written nor run, and named the hook question as its first blocker. The hook question is now decided and T10 is written. The RUN is still owed.**

**(a) Class 2 — the counts read: §6's stated mechanism does not exist, so one was added.** §6's instruments table names `WorkingCanvasHandle.getResidentCounts()` "through the existing E2E hook". No counts-only hook existed: the only surface exposing those totals is `residencyEndStep` (`frontends/shell/src/App.tsx:906-910`), which is the residency **measurement** instrument and returns its step snapshot's timing fields with them. Reaching a duration-bearing instrument to read a count would put a measurement inside a piece whose §1 declares it measures nothing (boundary 10; A6).

**Decided by the custodian, 2026-09-17 — not the human, and recorded as such.** One counts-only hook, `residentCounts`, declared at `frontends/shell/src/e2e-test-surface.ts:192-221` and registered at `frontends/shell/src/App.tsx:923` with its unregister twin at `:984`, inside the same `isInstrumentedBuild()`-gated effect the residency hooks already live in. It returns `canvasRef.current?.getResidentCounts() ?? null` and nothing else: no timing field, no side effect, no computation, and `null` rather than a fabricated zero when no dataset is admitted.

It is a **test-surface item of the same class as `openPath` and `capturePixels`**, and its doc carries the instrument-accessor form the human's round-5 item-4 ruling requires: read-only over state the shipped build already maintains (the same `ResidentSet` `pushBatch`/`clearStream`/`clearAllTiles` keep); **its only caller named** — the E2E driver `frontends/shell/e2e/source-changed.mjs`; and why the property must be proven about the real app — P3b's whole subject is an owner-side consequence, that a detected change empties the geometry an operator is looking at. Unit tests assert that `clearStream`/`clearAllTiles` were *called* at the real option seams, and they do; only the running app can show the residency is then empty, and there is no product path to that fact.

No other product code changed for this: `git diff` for this round is the hook (two files), the driver, and this amendment.

**(b) T10 is written, exactly as §4 declares it.** `frontends/shell/e2e/source-changed.mjs`, on `e2e/lib.mjs`'s `attachOrLaunch` like its siblings (`regression.mjs`, `refusal-contract-baseline.mjs`), writing `e2e/out/source-changed-<epochms>.json` and exiting non-zero on any failed assertion. Its steps, in §4's own order:

| step | asserts |
| --- | --- |
| `S1-open` | the scratch copy (X-4) admits through `window.__SPATIAL_E2E__.openPath` |
| `S2-settle-and-precondition` | settle, then **both preconditions without which the later assertions would be vacuous**: resident vertices are `> 0`, and a specific pixel is *observed* to show an id (never assumed occupied) |
| `S3-touch-mtime` | mtime moved forward with `utimesSync`; sha256 **unchanged**, which is what proves the mutation was a touch and not a byte edit (§8.8) |
| `S4-pan` | one query issued by a real pan |
| `S5a-status` | the session-ended block is present and **not dismissible**, and no `engine.` code appears in the operator's sentence or its guidance |
| `S5b-residency-cleared` | `residentCounts()` reports **zero** resident vertices |
| `S5c-picks-refused` | a hover over the formerly-occupied pixel yields the session-ended refusal — not an id, and **not silence** (silence reads as "nothing under the cursor", the one answer ADR-010 rule 5 forbids here) |
| `fixture-integrity` | the scratch copy's sha256 is re-taken after the run and compared to the copy taken at start (§8.8's "before and after") |

**One thing S5a asserts precisely, stated because the difference matters.** §4's words are "the status stack names the state with no `engine.` prefix in the text". What the driver asserts is that the operator's **sentence** (`.admission-refusal-message`) and its guidance carry no `engine.` code — that is the prefix regression §0 disclosure 4(b) named. The typed code itself **is** rendered, in its own labelled element (`.admission-refusal-code`), which is `RefusalBlock`'s long-standing shape for every refusal in this app and is not a prefix in front of a sentence. The driver says so at its own S5a comment rather than leaving a reader to infer which reading was taken.

**No timing anywhere** (ADR-018): the report has no elapsed field, and the only millisecond figures in the file are bounds on waiting — `withTimeout`, the mount gate and the whole-run watchdog — the same bounds every sibling driver carries, never reported as a result.

**The recorded mutation's mechanics are documented in the driver's own header** so the run instruction can perform it once: delete `this.clearResidency();` from `viewportStreamManager.ts`'s source-changed branch and `canvas?.clearAllTiles();` from `candidateArmSession.ts`'s `endCandidateSession`; expected failure is **S5b by name**, reporting the non-zero count it found, while S5a and S5c still pass — which is the point, since those two are the owner *saying* something and S5b is the owner having *done* it.

**(c) Still owed, 2026-09-17: the run.** The driver has **never been executed** and no observation exists. It is not run here because the machine is occupied by other measured work, and because a run launches a detached desktop application — it happens on a quiet machine, under its own instruction, per AI_DEVELOPMENT.md's "Launching the app and E2E runs" (one app at a time; a run that PROVES a branch asserts `launched: true`, which the driver records and prints rather than assumes). §9 requires T10 green before either gate concludes. **Until that run exists, Amendment 4 (e)'s closing sentence stands unchanged: this piece claims nothing about what an operator sees end to end.** What this amendment discharges is the hook decision and the driver's existence, and nothing more.

Checks at this amendment: `node --check frontends/shell/e2e/source-changed.mjs` green; the non-ASCII scan of that file is empty (0 bytes above `0x7F`), so it is safe to launch unattended; `npm run verify` exit 0 (70 files, 1024 tests), which includes the citation-integrity scan over `e2e/`.

**Amendment 6 — Written after two T10 runs were attempted and both failed (2026-09-17). Class 1, post-result.** Amendment 5 is not edited; this states what the runs produced. **T10 is still not satisfied, and this amendment claims no operator-visible result.**

**Two attempts were made on a quiet machine and both failed in the driver's own precondition step. Neither is a product finding, and neither produced a T10 verdict. Under Rule 7 the run stopped after the second rather than retrying a third time.**

**What the runs did establish, with their evidence.** Both launched the app themselves (`launched: true`, the condition AI_DEVELOPMENT.md's "Launching the app and E2E runs" sets for a run that proves a branch), against the shell built from this worktree's own package id.

| | run 1 | run 2 |
| --- | --- | --- |
| report | `frontends/shell/e2e/out/source-changed-1789608089617.json` | `frontends/shell/e2e/out/source-changed-1789608230988.json` |
| app PID / exe | 27604 / `C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe` | 2660 / same exe |
| creation time (ownership) | `20260917032022.965051+120`, after the run's own start at 01:19:42Z | `20260917032329.499916+120`, after 01:23:22Z |
| app session log | `...\dev.spatialide.shell\logs\session-1789608023.log` | `...\dev.spatialide.shell\logs\session-1789608209.log`, 1790 bytes / 25 lines, read as content and not sized |
| `S1-open` | PASS | PASS |
| `S2` | FAIL, timed out at the 60 s step bound | FAIL, no pixel among 25 yielded a hover id |
| `fixture-integrity` | PASS, sha256 `fd0c74ab...fb49` unchanged | PASS, same hash |

**Three things are now proven that were assumptions before, and they are worth recording even though T10 is not met.**

1. **The `residentCounts` hook works against the real app.** Both runs read `{totalResidentVertices: 188665, totalResidentFeatures: 10000}` through it after the scratch copy settled -- Amendment 5 (a)'s decision is sound in fact, not only in design, and the hook is present in a `tauri dev` build (`waitForMountReady` gates on it).
2. **The fixture discipline holds.** The scratch copy's sha256 was identical before and after both runs (section 8.8), so nothing in this driver edits bytes.
3. **The app under this branch opens the mutated-copy path and fills a canvas normally** -- 10,000 features resident, the candidate arm's own `candidate-residency-status` and `tile-ingest` lines in the render trace.

**Why each attempt failed, named rather than summarised as "flaky".**

- **Run 1: a bound that was too tight, in this driver.** `S2` carries both a settle (up to 45 s) and a pixel probe, under the shared 60 s step bound. The settle alone consumed most of it. Fixed in this commit: `PRECONDITION_TIMEOUT_MS = 180_000` for that one step, and a per-point hover budget of 1.2 s instead of 6 s. Not a product behaviour.
- **Run 2: the probe strategy is insufficient, and this is the real gap.** With the larger bound the step completed and reported honestly: no pixel among 25 tried around the canvas centre yielded a hover id, and the render trace carried **zero** hover/pick lines -- the synthetic pointer never landed on a feature's own footprint. A centre-anchored grid is the naive approach that `e2e/regression.mjs`'s own `A9'` was written around: that step finds a **read-back-verified** non-background pixel through `capturePixels` and converts its drawing-buffer coordinate to a CSS page point before moving the mouse there. This driver does not, so its "formerly-occupied pixel" precondition cannot be established on this fixture at this zoom.

**Owed, 2026-09-17, before T10 can be run again:** replace `S2`'s centre-grid probe with `capturePixels` plus the buffer-to-CSS conversion `e2e/regression.mjs` already carries for `A9'`, and only then re-run the three-run sequence (green, mutation fails S5b by name, green). The driver is left in the tree with its probe unchanged in shape but its bounds corrected, and this amendment is what a reader finds before trusting it.

**What is NOT claimed.** No assertion past `S1-open` has ever evaluated: `S5a` (the status line), `S5b` (residency cleared) and `S5c` (picks refused) have never run, and the recorded mutation has never been performed. Amendment 4 (e)'s closing sentence stands unchanged: **this piece claims nothing about what an operator sees end to end.** Every clause in Amendment 4 (a) still rests on unit and integration assertions at named seams, exactly as it did before these runs.

**The machine was left as it was found.** Both apps were closed by PID after verifying ownership by `ExecutablePath` and creation time (the documented check, not the command line -- the harness spawns a relative command line). After the second close: no `spatial-ide-shell.exe`, no `cargo.exe`, no `rustc.exe`, and no `tauri`/`vite` node process remained.

**Amendment 7 — the bounded third T10 attempt, and it FAILED (2026-09-17). Class 1, post-result.** Amendments 5 and 6 are not edited. **T10 is still not satisfied. This goes to the human.**

**Who authorized it and why.** The custodian authorized exactly one bounded third attempt, on the reasoning that Amendment 6's two failures were in the driver's S2 precondition *mechanism* and not in the product or the design -- the product had opened the copy, filled the canvas and exposed `residentCounts` in both runs -- and that the fix was an existing in-tree mechanism rather than a new invention. Scope was exactly one swap: replace S2's centre-anchored hover grid with `e2e/regression.mjs`'s `A9'` interior-pixel mechanism. Recorded as the custodian's call, not the human's.

**What was changed, and nothing else.** `e2e/regression.mjs`'s `A9'` closure -- `fractionOf`, `bufferPointToCss`, `samePoint`, `neighborhoodRegions`, `parseAlpha`, `verifyInteriorCandidate`, `subdivideRegion`, `captureDensest`, `findInteriorCandidate`, with the `BISECTION_*`, `INTERIOR_PATCH_RADIUS` and `ALPHA_INTERIOR_THRESHOLD` constants -- **moved** into `e2e/lib.mjs` and exported, with `regression.mjs` importing them back. Moved rather than copied because `regression.mjs` runs `await main()` at module scope, so importing from it would run the whole regression suite; `lib.mjs` is already the shared module. **The bodies are byte-identical; only the `export` keyword was added** (checked mechanically against a pre-move copy: all nine definitions occur verbatim in `lib.mjs` and none remains defined in `regression.mjs`). No product code changed. The 180 s precondition bound and the per-point hover budget were kept, as instructed.

**The third run, and its failure verbatim.**

- report: `frontends/shell/e2e/out/source-changed-1789608771959.json`
- `launched: true`; app PID **25708**, exe `C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe`, created `20260917033244.714577+120` -- after the run's own start at 01:32:10Z, so ownership is established by creation time and exe path, the documented check.
- app session log: `C:\Users\Christopher\AppData\Local\dev.spatialide.shell\logs\session-1789608765.log`, 894 bytes / 9 lines, read as content.
- `S1-open` PASS. `fixture-integrity` PASS (sha256 `fd0c74ab...fb49`, unchanged for the third run running).
- `S2-settle-and-precondition` **FAIL**, verbatim:

> `S2: no interior-verified pixel at this camera -- 11/25 neighbourhood pixels touch background (edge-adjacent); bisection levels coarse 8x5: 46.5% -> subdivide 4x4 (level 1): 54.3% -> subdivide 4x4 (level 2): 80.0%`

**What the failure means, read from the evidence rather than guessed.** The mechanism worked as far as it goes: the bisection ran all three levels and converged on a patch that is **80 %** non-background, at buffer point `(1005, 141)` in a `1280x200` drawing buffer. What it could not produce is an *interior* pixel -- 11 of the 25 pixels in the 5x5 patch around the candidate still touch background, so the candidate is on a boundary. At this fit-to-bounds camera the rendered features are too sparse per-pixel for a 5x5 fully-covered patch to exist anywhere in the frame.

**And that is the part of `A9'` this attempt did not take.** `A9'` is not the bisection alone: it is a **zoom-notch loop** around it (notch 0 = the current camera, then up to `MAX_ZOOM_NOTCHES` real wheel zoom-ins, with an early stop on two consecutive non-background decreases), re-running the bisection and the interior verification at each notch until one verifies. The authorized scope was the bisection swap and "nothing else in the driver changes", so the notch loop was deliberately not taken -- and it is exactly what the observed failure needs. The drawing buffer being `1280x200` (a short, wide canvas in this window geometry) makes the sparsity worse than `A9'`'s own runs see.

**Stopped here. No fourth run**, per the instruction that a third failure ends the attempt and goes to the human.

**What is still true, unchanged by this attempt.** Amendment 4 (e)'s closing sentence stands: **this piece claims nothing about what an operator sees end to end.** No assertion past `S1-open` has ever evaluated in any of the three runs; `S5a`, `S5b` and `S5c` have never run; and **the recorded mutation has never been performed.** Every claim in Amendment 4 (a) still rests on unit and integration assertions at named seams.

**What the three runs together have established**, and it is worth the human's attention when they decide what to do next: the product opens the mutated copy and fills a canvas on this branch (10,000 features, 188,665 vertices, identical in all three runs); `residentCounts` returns those real totals from the running app, so Amendment 5 (a)'s hook decision is sound in fact; and the scratch copy's sha256 is unchanged before and after every run. The gap is entirely in this driver's ability to find a pickable pixel at the camera the app opens with.

**For whoever takes this next, the option space as the evidence leaves it** -- no recommendation is adopted here, because the next step is the human's: (i) take `A9'`'s zoom-notch loop as well, which is the mechanism the failure names; (ii) drop the hover precondition and assert `S5c` against the interior-verified pixel directly, accepting a weaker "formerly occupied" claim grounded in the read-back rather than in a hover; or (iii) leave T10 unrun and let P3b's gates weigh the unit and integration evidence on their own, with this amendment as the record of why.

**The machine was left as it was found.** The app was closed by PID after verifying ownership by `ExecutablePath` and creation time. After the close: no `spatial-ide-shell.exe`, no `cargo.exe`, no `rustc.exe`, no `tauri`/`vite` node process, and neither 9223 nor 5180 listening.

**Amendment 8 — class 5, a scope change on the human's ruling; and the fourth T10 run's result (2026-09-17).** Amendments 5, 6 and 7 are not edited. **The three-run sequence did NOT complete: run 4's precondition passed and the owner-side assertions failed, for a reason the evidence names precisely. No mutation was ever applied.**

**The ruling, verbatim** (the human, 2026-09-17, question round 9):

> "Fourth attempt with the full A9' mechanism — the zoom-notch loop around the bisection, as regression.mjs runs it — then the three-run sequence (green / mutation red by name / green), gates after. Pre-declared fallback, not a fifth attempt: if the precondition fails again, T10 takes option 2 — the hover refusal asserted against the interior-verified pixel from the read-back — with the weakening named in the record ("formerly occupied, not formerly hovered") and the owner-side assertions still evaluated. Option 3 is not available: P3b claiming nothing about what an operator sees would undo the reason the piece exists."

**(a) What was built for it.** The zoom-notch loop's primitives -- `gridRegions`, `canvasRect`, `doWheel`, `hasFreshRenderTraceMotion`, `zoomInOneNotch`, with `ZOOM_NOTCH_DELTA_Y` and `MAX_ZOOM_NOTCHES` -- **moved** from `e2e/regression.mjs` into `e2e/lib.mjs`, exported, with `regression.mjs` importing them back; bodies byte-identical, only `export` added (checked mechanically against a pre-move copy: all five verbatim in `lib.mjs`, none still defined in `regression.mjs`). **The loop BODY could not be moved and that is stated rather than glossed**: in `regression.mjs` it is inline inside `stepA9`, not a function, and leaves nine local bindings the rest of that step reads, so extracting it would be a refactor of a suite this round cannot re-run. `e2e/source-changed.mjs` runs the same control flow over the shared primitives -- notch 0 first, then wheel zoom-ins to the same `MAX_ZOOM_NOTCHES` budget, re-bisecting and re-verifying per notch, same early stop on two consecutive non-background decreases -- with each condition named at its own line. The pre-declared fallback (option 2) was written into the driver **before** the run, as the ruling requires, and records `precondition` in the report either way. No product code changed.

**(b) The loop worked. The precondition passed on the FIRST path, not the fallback.**

`S2-settle-and-precondition` **PASS**, verbatim:

> `resident before the change: 188665 vertices / 10000 features; interior-verified pixel buffer(1115,181) at notch 2 -- 25-pixel neighbourhood entirely non-background; alpha 180 >= 150 (47,94,172,180); the hover there answers with an id; precondition: formerly occupied AND formerly hovered`

Two zoom notches were enough; the fallback was not taken; `observation.precondition` reads `"formerly occupied AND formerly hovered"`. `S3-touch-mtime` PASS (sha256 unchanged, so mtime only). `S4-pan` PASS. `fixture-integrity` PASS.

**(c) Then all three owner-side assertions failed, verbatim.** Report `frontends/shell/e2e/out/source-changed-1789618409392.json`; `launched: true`; app PID **44788**, exe `C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe`, created `20260917061316.070635+120`, after the run's own start at 04:12:42Z; session log `C:\Users\Christopher\AppData\Local\dev.spatialide.shell\logs\session-1789618396.log`, 20 lines, read as content.

> `S5a: no .canvas-session-ended block in the status stack; stack text was "Showing all 10000 features in view"`
> `S5b: resident vertices are 188665 (features 10000), expected 0 -- the owner did not clear what it was showing`
> `S5c: the hover still names an identity: "id 2322 @ (2604151.328, 1200300.000)"`

**(d) Why, read from the evidence and NOT from the owner-side code -- because the evidence says the owner was never given anything to react to.** This is recorded as a finding about the RUN, not as a defect in P3b's code, and the reason is mechanical:

1. **The pan issued no query.** The render trace has 82 entries; the last `viewport_query` is at index 46, the pan begins at index 73, and **zero `viewport_query` lines follow it** -- only eight `view-state` lines and one `candidate-residency-status`. The tiled arm plans a query only for a covering tile that is not already resident, and at this camera every covering tile was resident: `residentFeatureCount: 10000`, status line "Showing all 10000 features in view". A small pan therefore planned nothing.
2. **No stream was in flight to post-check.** Every tile stream had already reached its `Completed` terminal in the session log (`candidate-tile-terminal ... Completed` at 1789618402.4xx) before the mtime touch at ~1789618408.
3. **So neither detection path could fire**: the pre-check runs inside `viewport_query` (`kernel/src/skp.rs:796-802`) and none was issued; the post-check runs on a stream's own end and none was open. `observation.sessionLog.sourceChangedLines` is `[]` -- the kernel logged no source-change line at all, which is consistent with a check that never ran rather than one that ran and found nothing.

**S4's step text -- "one pan issued; render trace quiet again" -- is therefore true and insufficient**: it asserts a gesture, not a query. The scenario `S4` was written to produce ("trigger one query (a pan)", section 4 T10) does not produce one on the shipped default arm at a camera where the whole dataset is already resident.

**(e) Not patched, per the instruction.** The driver was not changed after this result, no mutation was applied (so there was nothing to revert), the app was closed by PID after verifying ownership by `ExecutablePath` and creation time, and the machine was left with no `spatial-ide-shell`, `cargo`, `rustc` or `tauri`/`vite` node process and neither 9223 nor 5180 listening. **The three-run sequence did not proceed past its first run**, so the mutation's observed failure text does not exist and is not claimed anywhere.

**(f) What is now known, and what is still not.** Known, and new with this run: the full A9' mechanism does find a pickable interior pixel in this app (notch 2), so the precondition is solved; and the shipped default arm does **not** issue a query for a small pan once the dataset is fully resident. Still unknown, and unchanged since Amendment 4 (e): whether the owner-side chain clears residency, refuses picks and shows the status **in the running app** -- `S5a`, `S5b` and `S5c` have now executed, but against a session in which no change was ever detected, so they say nothing about that chain. **This piece still claims nothing about what an operator sees end to end.** Every claim in Amendment 4 (a) continues to rest on unit and integration assertions at named seams.

**(g) What the next round needs, stated as the evidence leaves it and not chosen here.** T10's S4 must produce a real `viewport_query` after the touch. What the run itself shows about the ways to do that: a pan far enough to leave the resident cover, or a zoom notch (which re-plans tiles), or a filter Apply through `queryWithFilter` (which goes through `reissueUnrestricted` and always issues), or a change detected while a stream is still open. Which of those T10 should take is a decision about what the test claims, and it is not taken in this amendment.

**Amendment 9 — class 2, a deviation from the preregistration's described mechanism, with the reason. Custodian's decision, 2026-09-17; the human sees it in the ledger. Written after the results were seen. T10 IS SATISFIED.**

**(a) The deviation, and why it is one.** §4's T10 says *"trigger one query (a pan)"*. **The requirement is the QUERY; the parenthetical names the gesture.** Run 4's `S4` performed a 120x80 px pan and asserted only that the gesture happened -- and at a camera where the whole dataset was already resident, the tiled arm planned nothing, so no `viewport_query` followed and the detection path was never exercised. That was a **driver defect inside T10's own words**, not a change to what T10 claims and not a precondition failure: the human's round-9 fallback clause was never reached, because the precondition passed on its strong path. Corrected here, by the custodian, on that reading.

**Run 4's failures, verbatim, and their reading** (report `frontends/shell/e2e/out/source-changed-1789618409392.json`; PID 44788; session log `C:\Users\Christopher\AppData\Local\dev.spatialide.shell\logs\session-1789618396.log`):

> `S5a: no .canvas-session-ended block in the status stack; stack text was "Showing all 10000 features in view"`
> `S5b: resident vertices are 188665 (features 10000), expected 0 -- the owner did not clear what it was showing`
> `S5c: the hover still names an identity: "id 2322 @ (2604151.328, 1200300.000)"`

Proof that those three said nothing about the owner-side code: the render trace carried 82 entries with its **last `viewport_query` at index 46** and the pan beginning at index **73**, with **zero** `viewport_query` lines after it; every tile stream had already reached its `Completed` terminal in the session log (`candidate-tile-terminal ... Completed`, 1789618402.4xx) before the mtime touch at ~1789618408; and `observation.sessionLog.sourceChangedLines` was **`[]`** -- a check that never ran, not one that ran and found nothing.

**(b) What `S4` is now.** `S4-issue-one-query`: a bounded gesture ladder that stops at the first rung producing a query, asserting the **query** and recording the **gesture**. Rung 1 is a pan larger than the viewport (2 drags of 1024 CSS px each, 2048 px total -- one drag cannot exceed the window, so it repeats); rung 2, only if the tiled arm still plans nothing, is one `zoomInOneNotch`. No third rung: if neither issues a query the run stops and says so rather than inventing a gesture T10 never named. `observation.queryLadder` and `observation.queryProducedBy` carry the record.

**(c) The three-run sequence, completed. Each from a fresh launch, each `launched: true`.**

| run | report | PID / created | session log | outcome |
| --- | --- | --- | --- | --- |
| **5, green** | `e2e/out/source-changed-1789618861740.json` | 29968 / `20260917062048.418761+120` | `...\logs\session-1789618848.log`, 25 lines | **every step PASS**, exit 0 |
| **6, mutation** | `e2e/out/source-changed-1789618937407.json` | 30520 / `20260917062203.942932+120` | `...\logs\session-1789618924.log`, 25 lines | **S5b FAIL by name**; S5a and S5c still PASS |
| **7, reverted** | `e2e/out/source-changed-1789618985531.json` | 20184 / `20260917062251.934095+120` | `...\logs\session-1789618972.log`, 25 lines | **every step PASS**, exit 0 |

Exe for all three: `C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe`; each creation time falls after its own run's start, which is the ownership check. `fixture-integrity` PASS on all three: sha256 `fd0c74ab...fb49`, unchanged, so every mutation was an mtime touch and never a byte edit (§8.8).

**(d) Run 5's steps, each with the evidence that proves it.**

- `S2` PASS on the **strong** path, not the fallback: *"interior-verified pixel buffer(1115,181) at notch 2 -- 25-pixel neighbourhood entirely non-background; alpha 180 >= 150 (47,94,172,180); the hover there answers with an id; precondition: formerly occupied AND formerly hovered"*. `observation.precondition` reads `"formerly occupied AND formerly hovered"`.
- `S4` PASS: *"a viewport_query followed the \"pan-beyond-viewport\" gesture (5 -> 7 in the render trace)"*. The first rung was enough; the zoom rung was not used.
- **The detection fired, in the kernel, on the real path** -- `observation.sessionLog.sourceChangedLines`, verbatim: `tile-stream-mint-refused 7:8: engine.source_changed {"detail":"{mtime}"}`, then `warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({mtime})...`, then `candidate-session-ended-source-changed ds_5fc4839d...: every resident tile cleared; no further plan until reopen`. That is §2b's **pre-check** route, on a tile mint, reaching the owner.
- `S5a` PASS: the session-ended block rendered, `dismissButtons: 0` (not dismissible), `code: "engine.source_changed"` in its own labelled element, and the operator's sentence and guidance carry no `engine.` code.
- `S5b` PASS: `residentBefore {188665, 10000}` -> `residentAfter {0, 0}`. **This is boundary 4's "residency cleared", observed in the running app for the first time.**
- `S5c` PASS: the readout at the formerly-occupied pixel is `className: "hover-readout hover-readout-session-ended"`, and its text is the pick refusal -- not an id, not silence. **This is "picks refused", observed in the running app.**

**(e) The recorded mutation, performed once and reverted -- its observed failure, verbatim.** Mutation: delete `this.clearResidency();` from `viewportStreamManager.ts`'s source-changed branch **and** `canvas?.clearAllTiles();` from `candidateArmSession.ts`'s `endCandidateSession`. Observed on run 6:

> `S5b: resident vertices are 188665 (features 10000), expected 0 -- the owner did not clear what it was showing`

**And S5a and S5c still passed under it**, which is exactly the discrimination the driver's header predicted in advance: those two are the owner *saying* something, `S5b` is the owner having *done* it. Both edits were reverted from pre-mutation copies and run 7 is green from the reverted tree; `git status --porcelain` carries no product-file modification.

**(f) What this discharges, and what it does not.** Amendment 4 (e)'s closing sentence -- *"this piece claims nothing about what an operator sees end to end"* -- **no longer holds, and is superseded here**: run 5 and run 7 are that evidence, and §4's T10 is satisfied. What is still NOT claimed: no snapshot claim about the session before the detection (A1); no timing, rate or performance figure anywhere in the driver or its reports (ADR-018); and the **post-check** route is not what these runs exercised -- the detection came through the **pre-check** on a tile mint, which is one of §2b's two routes. The post-check route remains covered by its unit and integration tests only, and by G-A2 at P5.

**(g) Machine.** Every app was closed by PID after verifying ownership by `ExecutablePath` and creation time. After the last close: no `spatial-ide-shell.exe`, no `cargo.exe`, no `rustc.exe`, no `tauri`/`vite` node process, and neither 9223 nor 5180 listening.

**Amendment 10 — class 3 for (a), class 2 for (b), class 1 for (c)–(e). Written 2026-09-17 after both P3b gates returned FAIL on attempt 1. Docs-only: no product code, no test and no E2E run changed in this round.** Amendments 1–9 are byte-untouched; this item states what is true instead.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it; where a thing is **not** done it says so, and dates what is owed.

---

**(a) Class 3 — every cite in Amendments 4–9 re-derived at this head. Mechanical; no claim changes, only where it points.**

**Amendments are not edited in place, and that is the reason this is a table and not a diff.** §10 is append-only from the first commit, and an amendment is the record of what was written when it was written — correcting one in place would destroy the record the round-7 fence exists to protect. So: **this table is the resolution point for any `file:line` in Amendments 4–9.** Fifty-nine distinct cites appear there; **forty-six resolve at this head to the thing they name, and thirteen do not.** All thirteen are below, with the line that carries the named thing now.

| where | the cite as written | at this head | the line it names |
| --- | --- | --- | --- |
| 4(a) row 2a(i) | `tileViewportStreamManager.ts:88-101` | **`:89-102`** | `onSessionEnded?: (detail: string) => void;` (`:102`), its doc `:89-101`; `:88` is `onTerminal?` |
| 4(a) row 2a(i), 4(f) | `App.tsx:1144` | **`:1155`** | `onSessionEnded: endSession,` (the candidate-arm deps) |
| 4(a) row 2a(i), 4(f) | `App.tsx:1203` | **`:1214`** | `onSessionEnded: endSession,` (the baseline manager) |
| 4(a) row 2a(iv), 4(f) | `App.tsx:1477` | **`:1488`** | `onHover={(readout) => setHover(latchedHoverReadout(readout, sessionEndedRef.current))}` |
| 4(a) row 2a(v) | `App.tsx:1546-1551` | **`:1566-1570`** | `{sessionEnded && (` … `<RefusalBlock refusal={sessionEnded} />` … `)}` |
| 4(a) row 2b, 4(c)(4)(ii), 4(f) ×2 | `App.tsx:1026` | **`:1037`** | `if (isSourceChangedRefusal(e)) endSession(refusalDetailOf(e));` |
| 4(c)(3) | `App.tsx:1104`, quoting §2a(v) | **`:1108`** in the quotation | §2a(v) has read `App.tsx:1108` since Amendment 3(b)'s own table (`:564`); the quotation reproduced the pre-Amendment-3 text |
| 4(c)(3) | `App.tsx:1150` | **`:1221`** | `setCanvasRefusal(\`stream ${terminal.kind}: ${formatTerminalRefusal(terminal.detail).message}\`);` |
| 4(c)(4)(iii) | `candidateArmSession.ts:1546` | **`:1620`** | `if (sessionEnded) return { kind: "session-ended" };` inside `reissueUnrestricted` |
| 4(c)(5)(ii) | `App.tsx:1573` | **`:1594`** | `{viewportRefusal && !sessionEnded && (` |
| 4(f) | `App.tsx:994` | **`:1005`** | `handleSessionEnded(detail, {` |
| 4(g)(2) | `App.tsx:1548` | **`:1568`** | `<RefusalBlock refusal={sessionEnded} />` |
| 4(g)(2) | `App.tsx:1573-1589` | **`:1594-1608`** | the `viewportRefusal` block, `code` + `message` + its Dismiss button |

**Two causes, separated rather than folded into one.** Five of the thirteen — `App.tsx:994`, `:1026`, `:1144`, `:1203`, `:1477` — were **correct when Amendment 4 was written** and went stale when Amendment 5(a)'s `residentCounts` hook landed at `App.tsx:923` and moved everything below it by eleven lines; the proof is the branch's own history, `git show ece5f05:frontends/shell/src/App.tsx`, where each anchor sits at exactly the cited line. The other eight — `tileViewportStreamManager.ts:88-101`, `candidateArmSession.ts:1546`, `App.tsx:1104`, `:1150`, `:1546-1551`, `:1548`, `:1573`, `:1573-1589` — **were wrong when they were written**: at `ece5f05` the tile decl was already `:102`, the candidate latch already `:1620`, the `formatTerminalRefusal` call `:1210`, the session-ended block `:1555` and the `viewportRefusal` block `:1583`. That is a filing error in Amendment 4, not a drift, and it is recorded as one.

**§0–§9 are deliberately NOT re-derived at this head, and that is a decision rather than an omission.** Those sections are the piece's declarations, written before its code, and their cites describe the tree the piece **started from** — `279ec77`, where Amendment 3 derived them. §2a(v)'s *"`App.tsx:1108`'s `setCanvasRefusal(...)` is replaced by…"* is a statement about the pre-change line; re-pointing it at `:1221` would put post-change numbering under pre-change prose and make the declaration unreadable as the declaration it is. The header's rule — *"a worker re-derives every cite it touches at P3b's own head"* — is satisfied for every cite this piece's **results** rest on, which is what (a) above does.

**Also corrected in this round, in place and not by table: twenty comment lines carrying stale `file:line` references,** across `liveTicketSet.ts`, `tileViewportStreamManager.ts` (+ its test), `viewportStreamManager.ts` (+ its test), `candidateArmSession.ts`, `pick.ts`, `App.tsx`, `kernel/src/lib.rs`, `kernel/src/skp.rs` and `kernel/tests/session_generation.rs`. Comments are not append-only records, so those are fixed where they sit. Two examples for a reader to check the class by: `liveTicketSet.ts`'s cite of the live-generation pre-check was `kernel/src/skp.rs:666-672` and is now `:797-803`; `kernel/tests/session_generation.rs`'s cite of the product wiring was `frontends/shell/src-tauri/src/lib.rs:369` and is now `:373-377`. No comment's meaning changed.

**And one comment added rather than corrected, about the moves Amendments 7 and 8 made.** `frontends/shell/e2e/lib.mjs` now says at the moved block's own header why `export` was applied uniformly: nine of the moved definitions — the five `BISECTION_*` constants, `INTERIOR_PATCH_RADIUS`, `ALPHA_INTERIOR_THRESHOLD`, `neighborhoodRegions` and `parseAlpha` — have **no importer outside that file** (checked against both drivers' import lists: `regression.mjs:35-54` and `source-changed.mjs:149-161` name neither), and exporting them anyway is what keeps the bodies byte-identical, which is the property the move claims. The note says so, and says that this is an e2e module rather than a product surface, so an unimported `export` reads as that choice rather than as a leftover.

---

**(b) Class 2 — T6 was built by a different mechanism than §4 declares, and Amendment 4(c)(2) recorded only its name change. The mechanism change is recorded here.**

§4's T6 says: *"`reportViewportOutcome`'s catch **driven** with a real `SkpCallError` built from X-3"*. What exists is a **source-text pin**, not a driven catch: `frontends/shell/src/App.test.ts:1168`, *"reportViewportOutcome keeps viewportRefusal and additionally ends the session, matched on the code"*, reads `App.tsx` and asserts five regexes over it (`:1173-1182`).

**The reason, stated at the test's own doc (`App.test.ts:1151-1167`) and not only here:** `reportViewportOutcome` is a closure over `App`'s hooks, is not exported, and there is no product path that reaches it without rendering the whole `App`. Driving it would have required either exporting it — a `pub`-class surface with no product caller, which the caller rule forbids — or a full-render harness this piece does not have.

**What this weakens, said plainly.** A source pin proves the catch is *written* the way §2b requires; it does not prove the catch *behaves* that way when a real `SkpCallError` arrives. Its recorded mutation (match on `message` instead of `code`) fails it by a regex no longer matching (`OBSERVED` at `App.test.ts:1165-1166`), which is a weaker discrimination than a driven error would give.

**What covers the behaviour instead, each named:** the code-not-prose matching is driven with the real thrown error by `liveTicketSet.test.ts`'s *"matches the real thrown refusal on its code, never on its prose"*; and the end-to-end consequence is observed in the running app by T10 run 5's `S5a` and `S5c` (report `frontends/shell/e2e/out/source-changed-1789618861740.json`, Amendment 9(d)). §4's T6 declaration is not edited.

---

**(c) NOT delivered: §9's operator row. Named as owed, with its date, not claimed.**

§9 requires *"One walkthrough row appended to **Part N** (`state/NEXT-CUT.md:106`), committed with a blank result log"*. **`frontends/shell/MANUAL-WALKTHROUGH.md` has no Part N** — its last part is **Part M** (`frontends/shell/MANUAL-WALKTHROUGH.md:1312`, "Part M run (release cut — the packaged build on a clean profile)"), and P3b appended nothing. **Owed, 2026-09-17, at P6**: the Part N row in §9's own words — *open the 100k copy, let it fill, change the file underneath, act on the canvas* — with a blank result log and **no duration in the row** (A6). It is an operator-facing document whose felt verdicts are the human's, and this piece does not write one for them.

---

**(d) One more operator-visible element joins the P6 sight list (§9), and it is not a string this piece wrote.**

The session-ended status renders through `RefusalBlock`, which puts the typed code in its own labelled chip — `<div className="admission-refusal-code">{refusal.code}</div>` (`frontends/shell/src/admission/RefusalBlock.tsx:28`). For this refusal that chip reads `engine.source_changed`, observed in the running app by T10 run 5's `S5a` (Amendment 9(d)). The chip is `RefusalBlock`'s long-standing shape for every refusal in this app and P3b did not add it; what is new is that a **canvas** surface now shows it, in a block the operator cannot dismiss. Whether an operator should see a machine code in that position is an operator-visible decision, so it **joins the §9 sight list** beside the pick refusal and the session-ended status line rather than being settled here.

---

**(e) Three items recorded and deliberately not fixed in this round, each with its date.**

1. **`verify-test-claims.mjs` reports twelve planned entries for this file, and they are not defects.** Six §4 names (`:359`, `:367`, `:372`, `:377`, `:382`, `:390`) are superseded by the tests that exist, and Amendment 4(c)(2)'s mapping table (`:623-628`) repeats each superseded name in its left column — so the check counts each of the six twice. The check's own verdict is `PASS … (13 planned, advisory)`. **Not fixed, 2026-09-17**: editing §4's names would edit a declaration to match its outcome, which class 2 forbids, and rewriting the mapping table would remove the very column that makes it a mapping.
2. **`e2e/regression.mjs` has not been run since fourteen of its definitions moved to `e2e/lib.mjs`.** Amendments 7 and 8 moved nine `A9'` definitions plus `gridRegions`, `canvasRect`, `doWheel`, `hasFreshRenderTraceMotion`, `zoomInOneNotch` (with their constants) out and imported them back. The move was checked mechanically — bodies byte-identical, only `export` added — and `node --check frontends/shell/e2e/regression.mjs` is green, but **the suite itself has not been executed since**. `regression.mjs` is not among §9's suites and re-running it launches a detached desktop application, which this docs-only round does not do. **Owed, 2026-09-17, at the next E2E sitting**: one `regression.mjs` run to confirm the move left it green.
3. **`isSourceChangedRefusal(err: unknown): boolean` could be a type predicate and is not.** `frontends/shell/src/streaming/liveTicketSet.ts:69` returns `boolean`, so its tiled caller casts — `refusalDetailOf(err as SkpCallError)` (`tileViewportStreamManager.ts:953`). Declaring it `err is SkpCallError` would delete that cast at both call sites. **Not taken, 2026-09-17**: it is a product-code change, this round is docs-only, and the cast is checked by the same tests either way. Owed to whoever next touches that file.

---

**Suites at this amendment.** No product code, no test and no driver changed in this round — the diff is markdown plus twenty comment lines and one added comment — so no suite result changes. Re-run anyway, because comment text sits inside compiled and linted files: `cargo test --workspace --locked` exit 0, 61 test binaries, 0 failed, 0 warnings; `npm run verify` exit 0, 70 files, 1024 tests, 0 failed; `node --check` green on all three e2e modules (`lib.mjs`, `regression.mjs`, `source-changed.mjs`); the non-ASCII scan of `source-changed.mjs` is 0 bytes above `0x7F`, unchanged. `verify-cites.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs` were run after `git add`, and their verdicts are in this round's commit message.

---

**Amendment 11 — class 3 for (a), a P6 sight-list addition for (b). Written 2026-09-17, a fresh worker's verification pass, correcting three stale `NEXT-CUT.md` cites and completing §9's P6 sight list.** Amendments 1–10 are byte-untouched; this item states what is true instead and adds what §9 was missing.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it; where something is added rather than corrected, it says so.

---

**(a) Three cites to `state/NEXT-CUT.md:106` name the wrong row.** §2e (`:287`), §9 (`:532`) and Amendment 10 (c) (`:920`) each cite `state/NEXT-CUT.md:106` for the human's P6 acceptance / the Part N walkthrough row. At this head, `state/NEXT-CUT.md:106` is the **P5** row — its Phase cell reads: *"Tests carrying the claims (see Gates) + E2E: detected-change invalidation; late-generation rejection; fast-admission distinction"*, Gate column reads: *"Reviewer"*. The **P6** row — Phase cell reads, at its opening: *"Walkthrough **Part N** (no durations): open a CRS84 file, read the provenance line; open a keyless single file, read the session-identity statement; mutate the source mid-session, read the refusal"*, Gate column reads: *"Human (operator-verified; acceptances are red lines)"* — is `state/NEXT-CUT.md:107`. Per this piece's own rule for §0–§9 (Amendment 10 (a), `:898`), which states: *"§0–§9 are deliberately NOT re-derived at this head"*, §2e and §9 are not edited in place, and Amendment 10 (c) is not edited either (append-only, §10's own rule). This amendment is the correction, mirroring the identical fix `engine/ADMISSION-PREREGISTRATION.md` Amendment 8 (3) makes for that document's Amendment 6 (i)3. All three occurrences name `state/NEXT-CUT.md:107`.

**(b) A limitation joins §9's P6 sight list (`:531-540`): a pan that stays inside the resident tile cover issues no query, so nothing is detected until something queries.** This is boundary 4's declared policy, which states: *"may detect a change during a query only at the post-check"* (`state/NEXT-CUT.md:59-61`) — detection is query-gated, not continuous — and it was not only declared but observed directly: Amendment 9 (a)'s run 4 performed a 120x80 px pan at a camera where the whole dataset was already resident; the tiled arm planned nothing, no `viewport_query` followed, and `observation.sessionLog.sourceChangedLines` was `[]` — a check that never ran, not one that ran and found nothing (report `frontends/shell/e2e/out/source-changed-1789618409392.json`, quoted at Amendment 9 (a)). §9's P6 sight list names four pinned strings and two P3b-added strings (`:535-540`); it is silent on this limitation, which an operator can meet directly during Part N — a small pan inside the loaded view proves nothing about whether the source changed, only that no query happened yet to notice. Added here: **the small-pan/no-query limitation** joins the P6 sight list beside the pick refusal and the session-ended status line, so Part N's walkthrough tells the operator this before they meet it rather than after.

---

**Amendment 12 — class 3, mechanical, no claim changed. Written 2026-09-17, a fresh worker's verification pass on the round rule (the human): "a quote marked verbatim that does not match its source byte-for-byte is a gate failure by name."** Amendments 1-11 are byte-untouched; this item corrects five passages the checker found inside them.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it.

---

**(1) Amendment 8's quote of the human's round-9 ruling (`:795`) flattens one character.** Checked byte for byte against the source (`DECISIONS-PENDING.md` at `origin/main`, commit `752a71f`; not yet on this branch), the "RULED 2026-09-17 -- question round 9" block, item 1: the two differ in exactly one place. The source reads *"the full A9′ mechanism"* with the PRIME character (U+2032); Amendment 8 reads *"the full A9' mechanism"* with a straight apostrophe (U+0027). Every other character, including all three em dashes in the sentence, already matches.

**Amendment 8's rendering, in full, is what it reads:**

> "Fourth attempt with the full A9' mechanism — the zoom-notch loop around the bisection, as regression.mjs runs it — then the three-run sequence (green / mutation red by name / green), gates after. Pre-declared fallback, not a fifth attempt: if the precondition fails again, T10 takes option 2 — the hover refusal asserted against the interior-verified pixel from the read-back — with the weakening named in the record ("formerly occupied, not formerly hovered") and the owner-side assertions still evaluated. Option 3 is not available: P3b claiming nothing about what an operator sees would undo the reason the piece exists."

**The source, `DECISIONS-PENDING.md` (`origin/main`), reproduced here byte for byte, states:**

> "Fourth attempt with the full A9′ mechanism — the zoom-notch loop around the bisection, as regression.mjs runs it — then the three-run sequence (green / mutation red by name / green), gates after. Pre-declared fallback, not a fifth attempt: if the precondition fails again, T10 takes option 2 — the hover refusal asserted against the interior-verified pixel from the read-back — with the weakening named in the record ("formerly occupied, not formerly hovered") and the owner-side assertions still evaluated. Option 3 is not available: P3b claiming nothing about what an operator sees would undo the reason the piece exists."

**A residual checker FAIL at this passage, named rather than hidden.** `cut/briefa-p3b` diverged from `main` before commit `752a71f` (the round-9 ruling) landed there; this branch's own `DECISIONS-PENDING.md` does not yet contain it. The checker resolves a quote against files in *this branch's* tracked tree, so the reproduction above -- though checked byte for byte against `origin/main:DECISIONS-PENDING.md` by hand, above -- has no local match to find and remains a FAIL for that structural reason, the same class as (3) below's untracked-report FAILs: the text is correct and its source is confirmed; the source is simply not present in this tree to search. Resolved when `main` next merges into this branch.

**(2) Amendment 10 (b)'s quote of §4's T6 declaration (`:908`) adds emphasis the source does not carry.** §4 (`:378`) reads: *"`reportViewportOutcome`'s catch driven with a real `SkpCallError` built from X-3"* -- plain text, no emphasis on "driven". Amendment 10 (b) renders it *"`reportViewportOutcome`'s catch **driven** with a real `SkpCallError` built from X-3"*, with `**driven**` bolded -- a character difference the source does not have. The claim Amendment 10 (b) draws from the quote -- that what exists is a source-text pin, not the driven catch §4 declares -- does not depend on the emphasis and is unaffected; only the added markdown bold was wrong, and this corrects it.

**(3) Two driver-output quotes (`:775`, `:803`) are sourced from gitignored report JSONs; checked here against those files directly.** `frontends/shell/e2e/out/` is untracked (`frontends/shell/.gitignore:1`), so the checker cannot resolve these quotes against their real source. Checked by hand instead:
- Amendment 8's `:775` quotes run 3's `S2-settle-and-precondition` failure. Its report (`frontends/shell/e2e/out/source-changed-1789608771959.json`) has `results[1].note` (212 characters), confirmed **byte-identical** to the quoted line.
- Amendment 8's `:803` quotes run 4's `S2-settle-and-precondition` pass. Its report (`frontends/shell/e2e/out/source-changed-1789618409392.json`) has `results[1].note` (287 characters), confirmed **byte-identical** to the quoted line.

Neither is requoted here: both already match their real source exactly, and reproducing either passage a second time in this tracked file would let the checker resolve it against this amendment instead of against the untracked report it actually comes from, which is not what checking it means. Both remain a FAIL under the checker afterward, for a structural reason stated plainly here: their real source is not in the tracked tree for the checker to search, not because the quoted text is wrong.

**(4) Two stale `kernel/src/skp.rs` cites, not quotes, recorded corrected.** `:679` (§7g item 1) and `:817` (Amendment 8 (d) item 3) each cite `kernel/src/skp.rs:796-802` for the live-generation pre-check block. At this head that block is `kernel/src/skp.rs:797-803` (`if self.generations.live_or_mint(&dataset_name).is_none() { return Err(...); }`, opening `if` at `:797`, closing brace at `:803`) -- off by one at both ends, the same defect class engine Amendment 8 and the P3b comment-fix round already corrected elsewhere in this tree. Recorded here rather than edited in place, per §10's append-only rule.

---

**Amendment 13 — class 3, mechanical, no claim changed. Written 2026-09-17, a fresh worker's verification pass on the reviewer and architect gates' attempt-3 findings. Amendments 1-12 are byte-untouched; this item corrects what they got wrong, one item at a time.**

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it.

---

**(1) Commit `0db7e57` edited Amendment 10 (a) (`:900`) in place, under two later "byte-untouched" declarations that were false when written.** The pre-edit line, `git show a955bee:frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:900`, byte for byte:

> Two examples for a reader to check the class by: `liveTicketSet.ts`'s cite of the live-generation pre-check was `kernel/src/skp.rs:666-672` and is now `:796-802`;

The same commit's own post-edit line, `git show 0db7e57:frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:900`, byte for byte:

> Two examples for a reader to check the class by: `liveTicketSet.ts`'s cite of the live-generation pre-check was `kernel/src/skp.rs:666-672` and is now `:797-803`;

That commit is the one that wrote Amendment 11, whose own `:942` says *"Amendments 1–10 are byte-untouched"* — false when written, in the same commit that edited Amendment 10. Amendment 12's commit (`a93bd12`) repeats the same false shape at `:954`, *"Amendments 1-11 are byte-untouched"*, one commit downstream of the edit. Both are recorded false here; neither is edited.

**The seven in-place code-comment cite fixes commit `1176a48` made, listed by file:line at this head** (from `git show --stat 1176a48` and its diff; none is an amendment, so none needed append-only treatment):

1. `kernel/tests/session_generation.rs:266` — `SkpHost::viewport_query` cite `kernel/src/skp.rs:629` corrected to `:760`.
2. `kernel/tests/session_generation.rs:267` — the pre-check refusal cite `kernel/src/skp.rs:682-687` corrected to `:797-803`.
3. `kernel/tests/session_generation.rs:372-373` — the `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE` cite `kernel/src/skp.rs:408-414` corrected to `:517` (documented `:506-508`).
4. `kernel/src/skp.rs:711` — `Self::new`, `:562` corrected to `SkpHost::new`, `:689`.
5. `frontends/shell/src/streaming/liveTicketSet.ts:62`, `tileViewportStreamManager.test.ts:1421` and `tileViewportStreamManager.ts:944` — the same live-generation pre-check cite, `kernel/src/skp.rs:796-802`, corrected to `:797-803` at all three sites.
6. `frontends/shell/src/streaming/tileViewportStreamManager.ts:751` — the untiled sink cite `candidateArmSession.ts:1277-1338` corrected to `:1277-1412`.
7. `kernel/src/lib.rs:416` — the `isSourceChangedTerminal` cite `liveTicketSet.ts:51-53` corrected to `:52-54`.

---

**(2) Amendment 12 (3) (`:975`) names Amendment 8 for `:775`.** `:775` sits inside Amendment 7, which spans `:761-790` (its own header at `:761`; Amendment 8's header opens at `:791`). Corrected: `:775` is Amendment 7's, not Amendment 8's.

---

**(3) Five more record-fidelity slips, one sentence each.**

1. `:960` says *"including all three em dashes in the sentence"*; the ruling it describes is reproduced again at `:964` (Amendment 12's own copy of Amendment 8's `:795` rendering) and, checked against its source (`DECISIONS-PENDING.md:26`), carries **four** em dashes, not three.
2. `:970`'s *"this branch's own `DECISIONS-PENDING.md` does not yet contain it.* … *Resolved when `main` next merges into this branch."* is false at this head: the merge (`7286c81`, "Merge remote-tracking branch 'origin/main' into cut/briefa-p3b") is already in this branch's history, and the round-9 ruling it carried is present at `DECISIONS-PENDING.md:26`; `:795`'s only mismatch against it is the plain prime-vs-apostrophe difference Amendment 12 (1) already names, corrected at `:968`.
3. `:954` says *"this item corrects five passages the checker found inside them"*; counting item (4)'s two cite corrections alongside items (1)-(3)'s four passage corrections, Amendment 12 corrects **six** things, not five.
4. Amendment 11 (b) (`:950`) carries no class marker; it is a class-5 record of the human's round-10 ruling applied (`DECISIONS-PENDING.md:22`, item 1: *"the shell's mirror amendment (four comment cites, three ranges, the small-pan/no-query limitation added to §9's P6 sight list)"*), not a self-originated class-3 finding.
5. `:972` cites `:378` for the T6 declaration sentence; the sentence *"`reportViewportOutcome`'s catch driven with a real `SkpCallError` built from X-3"* spans `:378-379`.

---

**(4) §2e's ADR-016 rule-3 reproduction (`:296-300`) is not byte for byte against its named source.** Introduced *"verbatim from the Proposed draft (`docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md:52-58`)"*, §2e's quote is shortened and single-quoted. The source span, `docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md:52-58`, reproduced here byte for byte:

> **3. Change handling — the read-around policy, declared.** Checks run **before every query issue
> and after every stream terminal**. A detected change invalidates G: new tickets refused under G,
> in-flight producer streams cancelled through the **existing** cancel, residency cleared, picks
> refused until reopen, and a typed status "source changed during use". Its limitation, stated here
> and in KNOWN-LIMITATIONS in these words: the policy **"does not establish snapshot consistency,
> cannot detect every in-place modification, and may detect a change during a query only at the
> post-check"** **[Brief A boundary 4, verbatim]**.

Against this, §2e's `:296-300` drops the emphasis on **existing** (source `:54`) and re-types the nested double quotes of `"source changed during use"` (source `:55`) as single quotes. §2e stays as written, per Amendment 10 (a)'s own rule that §0–§9 are not re-derived in place; this amendment is the record.

---

**(5) The nit: `state/NEXT-CUT.md`'s true range for boundary 4's policy sentence.** Both §2e (`:295`) and `engine/ADMISSION-PREREGISTRATION.md` Amendment 6 item 4 (`:1362`) cite `state/NEXT-CUT.md:60-63` for the sentence beginning *"The policy does not establish snapshot consistency"*. At this head that sentence runs `state/NEXT-CUT.md:59-61` (it opens mid-line at `:59` and closes at `:61`) — the range Amendment 11 (b) (`:950`) already cites. Stated once here; `engine/ADMISSION-PREREGISTRATION.md`'s own Amendment 10 records the same correction for its `:1362`.

---

### Amendment 14 -- class 3 for (a)-(d); (e) fits no pre-declared class (the same gap Amendment 11 (b) has, routed rather than forced). Written 2026-09-17, a fresh worker's final record-fidelity append under round 12, item 2, closing the architect and reviewer attempt-4 findings. Amendments 1-13 are byte-untouched; this item states what is true instead.

**Written after the gates' attempt-4 findings were seen.** §10's rule, honoured in this line.

**The fence, applied to this amendment's own words** (round 7, item 1): every clause below that says something is done names the test, the report or the `file:line` that proves it.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-129`): class 3 for (a)-(d) (cite/reference form fix, mechanical, never changes a claim); (e) is a P6 sight-list addition that fits none of the five pre-declared classes -- routed as a gap, not forced into one (the same gap `:1021` names for Amendment 11 (b)).

---

**(a) Seven body-site ledger cites, converted (round 12, item 1 (a); `docs/PREREGISTRATION-TEMPLATE.md:135`).** Every `DECISIONS-PENDING.md:NN` cite in §0-§9 named round 4, item 1 (the round-4 RULED block has only that one item); each is edited in place, cite form only, quoted text unchanged:

| site | old form | new form |
| --- | --- | --- |
| `:6` | `DECISIONS-PENDING.md:42-46`, question round 4 | round 4, item 1 |
| `:50` | `DECISIONS-PENDING.md:44`, verbatim | round 4, item 1, verbatim |
| `:339` | `DECISIONS-PENDING.md:46` | round 4, item 1 |
| `:410` | `DECISIONS-PENDING.md:44` | round 4, item 1 |
| `:492` | `DECISIONS-PENDING.md:44` | round 4, item 1 |
| `:495` | `DECISIONS-PENDING.md:46` | round 4, item 1 |
| `:502` | `DECISIONS-PENDING.md:44`, verbatim | round 4, item 1, verbatim |

**(b) Carried item -- Amendment 10 (a)'s count is superseded, not restated.** Amendment 10 (a) (`:878`) counts how many of its cited lines resolve against their targets; `:657` (Amendment 4 (f))'s `DECISIONS-PENDING.md:44` cite is not among the ones it lists as not resolving, and round 12, item 1 (a) now retires that citation form regardless of whether it resolved. The count at `:878` is superseded; no replacement count is given, since the citation form it measured is retired, not re-verified. The index below carries `:657` and `:563`'s replacement forms instead.

**(c) Carried item / B-2 -- Amendment 13 (1)'s two reproductions of `:900` (`:990-996`) are references now, not quotes.** Each was introduced as "byte for byte" for "the line" but reproduced a mid-line span only (162 of 766 characters), with no `…` at either cut. Corrected reference, no reproduction: `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:900 @ a955bee sha256:8d78fd391179b89d7d148ab32f0e4d76396c88c5c3571a6691d0e38dc3ecbfbf` (pre-edit) and `:900 @ 0db7e57 sha256:d8fc6c1356dfb4f80443be0faa1f733296ca5c13cdd1619ad78dbfb04ad365d2` (post-edit) replace both blockquotes; the retained spans were already found byte-exact against both revisions, so only the "byte for byte … the line" framing was wrong, and this reference form does not repeat it.

**(d) Three more should-fix items, one sentence each.**

1. Amendment 13 (3) item 3 (`:1020`) undercounts Amendment 12 as "four passage corrections" against its own "six things" total; Amendment 12 in fact made four passage corrections, confirmed two driver-output quotes already correct, and corrected two cite pairs -- six items of three kinds, not one kind of six -- stated once here, `:1020` not edited.
2. Amendment 13's "Amendments 1-12 are byte-untouched" (`:984`) and its "Amendments 1-11 are byte-untouched" (`:954`, quoted there as false) both use the per-commit reading -- true of the commit that wrote each amendment, false only of the cumulative state after `0db7e57` edited `:900` one commit later -- and that reading is what both sites mean; neither is edited.
3. Amendment 11 (b) (`:950`) names its own kind ("a P6 sight-list addition") but carries no class number, as `:1021` says; none of the five pre-declared classes (`docs/PREREGISTRATION-TEMPLATE.md:101-129`) describes an evidence-driven sight-list addition rather than a ruling's scope-narrowing (class 5's own text), so none is assigned here either -- the same gap (e) below has, routed rather than forced.

**(e) A sight-list addition, beneath §9's list, not inside it.** "Read the last amendment first" is appended as a dated line under §9's Operator bullet (`:531-540`), per round 12, item 2's "the superseded index and the sight-list line." No pre-declared class covers an addition of this kind (see (d)3 above); routed, not forced.

---

**Superseded as of this amendment.**

| site | earlier line, cite or claim | superseded by |
| --- | --- | --- |
| Amendment 3 (c) table, `:563` | `DECISIONS-PENDING.md:20-24`/`:22`(×4)/`:24`(×3), corrected there to `:42-46`/`:44`/`:46` | both forms name round 4, item 1; retired by the round+item citation, which does not re-shift on a further merge |
| Amendment 4 (f), `:657` | `DECISIONS-PENDING.md:44` | round 4, item 1 |
| Amendment 10 (a), `:878` | its cite-resolution count | superseded per (b) above; no replacement count given |
| Amendment 13 (1), `:990-996` | the two "byte for byte … the line" reproductions of `:900` | the reference forms in (c) above |
| Amendment 13 (3) item 1, `:1018` and item 2, `:1019` | `DECISIONS-PENDING.md:26` | round 9, item 1 |
| Amendment 13 (3) item 4, `:1021` | `DECISIONS-PENDING.md:22`, item 1 | round 10, item 1 (form only, already so identified there) |

---

### Amendment 15 -- the closing state-of-the-record list (2026-09-17, appended; the architect's re-scope under round 12, item 2)

**Written after the gates' attempt-5 findings were seen.** §10's rule, honoured in this line. **Read this amendment first**: it is the single resolution point for every earlier amendment in this document, and it supersedes Amendment 14's own index in whole.

**Why this form, and what it is not.** Round 12, item 2 provides that if the round fails on the record again, the record -- not the code -- is re-scoped by the architect as a shorter amendment set rather than corrected again; attempt 5 failed on the record, and this is that re-scope, not a sixth correction. The mechanic that failed five attempts is one: a correction that carries a `:line` into a file its own commit edits is falsified by that commit, and a newest-first ledger moves under a line cite at every merge. So this amendment carries **no bare line cite into this document**, **no ledger line cite**, and **no reproduced text**: self-references are by section, amendment and item; rulings are by round and item (round 12, item 1 (a)); anything else is `path:line @ <commit> sha256:<hex>` (round 12, item 1 (b)). Where a row must name a defective cite in order to identify it, the cell says **retired form**.

**What this commit does to the tree.** It appends this amendment and changes nothing else in this document -- no byte above §10, no byte of Amendments 1-14 -- so no line in this file moves and no cite anywhere in it is falsified by this commit. Proof: `git diff --numstat e53bb97..HEAD -- frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` shows zero deletions.

**Classes used.** **Class 3** (`docs/PREREGISTRATION-TEMPLATE.md:110-112 @ e53bb97 sha256:e4bc1272dfbdb1f0af4b32592670e6a7b3f0646805c95570e7232723e67b7812`) for every row that only corrects where a reference points. **Class 1** for every row that withdraws, supersedes or narrows a claim, on the stated reading that a gate round's findings are this round's results and such a row records what they invalidate -- the reading is stated, not settled, and is routed as gap 2. Two further things fit no pre-declared class and are routed to the human rather than forced into one: gaps 1 and 3.

**The fence, applied to this amendment's own words** (round 7, item 1): every "stands" / "corrected" / "withdrawn" / "owed" clause below names the reference, the commit range, the amendment item or the gate resolution that proves it.

**Scope of the no-line rule.** It governs from this amendment forward. An earlier self-line cite that still resolves stands as written and is not listed here; a pinned reference (`path:line @ commit sha256:`) is stable under any later insertion and the rule does not touch it.

---

**The state of the record, by amendment and item.**

| id | status | what governs now |
| --- | --- | --- |
| Amendment 14, its "Superseded as of this amendment" index (all six rows) | **superseded in whole** | Every site cell names a line from before the four-line insertion the same commit made under §9's Operator bullet, so none resolves at that commit's own head. Proof: the insertion and the index are both inside the range `60ece22..e53bb97`. This table replaces it and carries no line into this document. |
| Amendment 14 (a) | **stands, narrowed** | The seven in-place §0-§9 edits stand as made: cite form only, quoted text unchanged. Its completeness clause is true of the literal string `DECISIONS-PENDING.md:NN` and not of every ledger reference in §0-§9; the next row carries the one it missed. |
| §0 disclosure 2's class-fix sentence (retired form: a bare `` `:46` ``) | **corrected by reference** | The bare line number was anchored to the ledger by the sentence above it, which Amendment 14 (a) converted to round + item, so it now has no antecedent and must not be read as pointing at any file. The class fix that sentence introduces is **round 4, item 1**. The sentence is not edited: §0-§9 takes no byte change in this round. |
| §0 disclosure 2 and §8 block-on-sight 5 -- the two round 4, item 1 passages marked verbatim | **stand** | Clause (b)'s `path:line` + hash form is unavailable for ledger text, because clause (a) forbids a line cite into the ledger; round + item is the ledger's reference form, and the gate's own resolution against round 4's RULED block is the proof (round 11's floor). Both passages join their source's hard-wrapped line as single spaces -- a reflow, every retained word byte-exact, nothing elided. Gap 3 routes the form question to the human. |
| Amendment 14 (b) | **stands in substance; its class label withdrawn** | Amendment 10 (a)'s cite-resolution count is superseded with no replacement, because round 12, item 1 (a) retires the citation form that count measured. Class 3 never changes a claim and (b) withdraws one, so (b)'s class-3 label is withdrawn and this amendment's class-1 reading covers it (gap 2). |
| Amendment 10 (a)'s standing policy that §0-§9 are not re-derived at this head | **narrowed, not superseded** | It is superseded for cite **form** only, by round 12, item 1 (a), which Amendment 14 (a) applied to the seven body sites. Every claim, scope and wording of §0-§9 stands unre-derived, exactly as that policy provides. |
| Amendment 14 (c) | **stands** | Its two pinned references replace Amendment 13 (1)'s two mid-line reproductions, and no reproduction remains at either site. The proof is recomputation: the gate recomputes both span hashes at their named commits, and no claim here rests on a report. |
| Amendment 13 (3) item 3's component label for Amendment 12 | **superseded** | Amendment 14 (d)1 supersedes the "four passage corrections" label with six items of three kinds; the total it was a component of stands. This row is the index entry (d)1 lacked. |
| Amendment 14 (d)2 | **stands** | It defends the per-commit reading of two byte-untouched clauses and supersedes nothing. |
| Amendment 14 (d)3, and Amendment 14's "Classes used" line | **corrected** | Both describe `docs/PREREGISTRATION-TEMPLATE.md:101-129` as five pre-declared classes; that span declares **six** -- class 6, budget deviation, was added on round 5, item 2. Proof: `docs/PREREGISTRATION-TEMPLATE.md:101-129 @ e53bb97 sha256:d47d4a27c20b2e03cf9d7cccb765735a27a11bfdbbecc8d9f0e21f2772859d8a`, whose list runs 1 to 6. |
| Amendment 11 (b)'s missing class number | **open, routed** | No pre-declared class describes an evidence-driven sight-list addition, and none is assigned here either. Gap 1 carries it to the human with the class-7 text the architect proposes. |
| Amendment 14 (e), its attribution | **corrected** | The sight-list line's binding source is **round 12, item 1 (e)**, not item 2. The phrase (e) attributes to item 2 belongs to the custodian's "Applied:" note in that ledger entry and not to the human's ruling; it is withdrawn rather than re-attributed, and no text of it is reproduced -- the sentence carries on the round + item cite alone. |
| Amendment 14 (e), its placement claim | **withdrawn** | The dated line sits as an indented continuation under §9's **Operator bullet**, inside that list item, which is what the same sentence's second half says. The line itself is not edited; it stands where it is, dated. |
| Amendment 14 (e)'s routing | **named** | The artifact where the routing lands is this amendment's "Gaps routed to the human" section, and from there the custodian's next question round in `DECISIONS-PENDING.md`. |
| Amendment 14's short quoted phrases in (b), (c) and (d) | **stand as identifiers** | They name items rather than invoking passages, and none is presented as a ruling's words. One differs from its source in emphasis: Amendment 13 (3) item 3 renders its total in markdown bold, which (d)1's rendering does not carry; corrected by this row, Amendment 13 not edited. |
| Amendment 13 (1)'s two reproductions | **superseded** | By Amendment 14 (c)'s pinned references; unchanged by this round. |
| Amendment 4 (g) item 1 -- R-D2's `detail` contract on the generation-ended paths | **owed**, 2026-09-17 | Unchanged; recorded at that item and mirrored in `engine/ADMISSION-PREREGISTRATION.md` §12e Amendment 6 (ii). |
| Amendment 4 (g) item 2 -- guidance for codes other than `engine.source_changed` on the camera pre-check surface | **owed**, 2026-09-17, at P6 or a follow-on | Unchanged; recorded at that item. |
| Amendment 4 (g) item 3 -- the post-check's shell-side cost carrier | **owed**, 2026-09-17, at P6 or a follow-on | Unchanged; recorded at that item. |
| Amendment 4 (g) item 4 -- G-A2's score | **owed**, at P5 | Unchanged; P5 scores it, as §2d instructs. |
| Amendment 10 (c) -- §9's Part N walkthrough row | **owed**, 2026-09-17, at P6 | Unchanged; the row's words and its blank result log are as (c) states. |
| Amendment 10 (e) item 2 -- one `regression.mjs` run after the e2e moves | **owed**, 2026-09-17, at the next E2E sitting | Unchanged; recorded at that item. |
| Amendment 10 (e) item 3 -- the type predicate | **owed** to whoever next touches that file | Unchanged; recorded at that item. |

**Items that simply stand, by id.** Amendments 1, 2, 3, 5, 6, 7, 8, 9 and 12; Amendment 4 (a)-(f) and (h); Amendment 10 (b), (d) and (e) item 1; Amendment 11 (a); Amendment 13 (1), (2), (3) items 1, 2, 4 and 5, (4) and (5); Amendment 14 (c). Nothing in this amendment touches them; the owed items among them are listed above only to date them, not to change them.

**Superseded earlier and unchanged here:** Amendment 4 (e)'s closing sentence (by Amendment 9 (f)); Amendments 6 and 7's T10 verdicts (by Amendment 9); Amendment 12 (1)'s closing note (by Amendment 13 (3) item 2).

---

**Gaps routed to the human, named and not forced** (`docs/PREREGISTRATION-TEMPLATE.md` §10's own instruction: a class that fits none is a finding routed to the human, never a freeform amendment).

1. **A class for an evidence-driven sight-list addition.** Amendment 11 (b), Amendment 14 (e) and the sight-list line itself have no pre-declared class; the architect's re-scope of 2026-09-17 proposes a class 7 for the template. Nothing is assigned here.
2. **The class of a withdrawal in a record-correction round.** A row that withdraws a count, a method or a false clause is not class 3, and it narrows no ruling, so class 5 does not fit; this amendment uses class 1 on the reading stated above, and the reading is the human's to confirm.
3. **How a ledger passage is pinned.** Clause (b)'s `path:line` + span hash cannot be used for ledger text, because clause (a) forbids a line cite into `DECISIONS-PENDING.md`; and an entries-style block carries no round or item at all (`engine/ADMISSION-PREREGISTRATION.md` §12e Amendment 12 carries that case). The architect proposes a clause (a') for both halves.

---

**Read this amendment first.** §10's amendments correct each other only by a later one; this is the last, and it is where any earlier amendment's current state is written.
