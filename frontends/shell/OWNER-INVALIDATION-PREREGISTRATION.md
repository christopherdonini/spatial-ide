# Preregistration — owner-side invalidation and the kernel-authoritative dead-ticket refusal (Brief A, P3b)

*Custodian's filing note (2026-09-16, not part of the architect's text): written verbatim from the architect's draft to this path by the owning-module rule (`docs/README.md:29`; the predicted diff is shell + kernel with `engine/` empty). Every `file:line` into `engine/ADMISSION-PREREGISTRATION.md` below uses the P3a branch's numbering (§13 C is `:316` there and `:248` on `main` until P3a merges; Amendment 3 is `:705-835` there and not yet on `main`); the `:234` cite for the P6 sight list is imprecise — the four strings are pinned at `frontends/shell/src/admission/formatRefusal.test.ts:183-189`. Spot-checked by the custodian against the worktree and `main`: the ruling quotes, boundaries 3–4 and 10, G-A2, ADR-010 rules 5–6, the Proposed ADR-016 amendment's rule 3, `App.tsx:1108`, `liveTicketSet.ts:41-52`, `kernel/src/skp.rs:666-672` and `:1005-1007`, `formatRefusal.ts:70-83`, `pick.ts:26-28`/`:53`, `WorkingCanvas.tsx:116`/`:196-200`, `client.ts:58-65`, `src-tauri/src/lib.rs:368` — all resolve as quoted. A worker re-derives every cite at P3b's own head.*

*Drafted 2026-09-16 by the architect agent on the custodian's brief, from: the human's ruling of
2026-09-16 (`DECISIONS-PENDING.md:42-46`, question round 4); `state/NEXT-CUT.md`'s P3 row (`:103`)
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
2. **The human split the piece on those findings** (`DECISIONS-PENDING.md:44`, verbatim):
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
(the human's class fix, `DECISIONS-PENDING.md:46`).

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
`file:line`. A test-only caller does not count (`DECISIONS-PENDING.md:44`). The one declared
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
   (`DECISIONS-PENDING.md:44`). The named exception is the instrument category of §2c.4.
2. **A test encoding an imagined interface.** Any test whose input is an invented string, shape or
   signature where the real producer's output exists and could have been pinned
   (`DECISIONS-PENDING.md:46`).
3. **A fabricated source-change for an unknown handle.** Any refusal that says or implies the source
   changed for a handle the kernel has no record of (`docs/01` principle 8;
   `ADMISSION-PREREGISTRATION.md:742-744`).
4. **A residency clear that leaves pickable geometry.** Any path that clears the visible view without
   latching picks, or that answers a hover with silence rather than the named refusal
   (ADR-010 rule 5, `:68`).
5. **A release that includes P3a without P3b** (`DECISIONS-PENDING.md:44`, verbatim: *"No release
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
