# ADR-035 — SKP control-plane event: `dataset_session_ended`

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. Filed 2026-09-24 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 2); its acceptance is the human's. Riders (a) and (b) of that ruling bind the watcher's preregistration through the ruling itself, whatever this ADR's status, and a review may block on the ruling, never on this text.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-source-change-watcher.md`, section "ADR skeleton (for S1)") and that consult's preregistration body with the ruling's two riders; redrafted once after its first full gate (`state/gate-log.json`, node `engine-source-change-watcher`, attempt 1).
**Related:** `docs/10` (the specification must cover subscriptions and events) · `docs/02` (control plane vs data plane) · `docs/01` principle 8 · `docs/08` · ADR-004 and its Amendment 4 (instrument surface is never an SKP field) · ADR-006 · ADR-016 Amendment 1 · ADR-019 · `protocol/skp/SKP-V0.md` §3, §4 items 2, 7, 10 and 13, §5, §8's `skp/0.3` entry · RULED 2026-09-24, the watcher sight (its additions 2 and 4) · RULED 2026-09-24 (night) item (2).

## Context

SKP v0 declares no server-to-client push on the control plane in any form (`SKP-V0.md` §4 item 7), while `docs/10`'s checklist requires the specification to cover subscriptions and events. The advisory source-change watcher (PLAN node `engine-source-change-watcher`) can end a dataset-session generation while no command or stream is in flight, and the watcher sight's addition 4 requires a kernel-to-shell event that delivers that idle signal, with case (f) as its acceptance test. The only kernel-host → webview events today are Tauri emits outside SKP (publish progress, the origin self-check); neither carries a dataset-session fact. The human ruled one SKP control-plane event on the watcher's literal, with two riders (round 17 item 2).

Two things this ADR names do not exist in the tree at its filing; the watcher piece introduces both, under the sight's addition 2 (preregistration body §2a and §2b): the refusal code `engine.source_coverage_lost`, and the kernel's session-end reasons (`SessionEndReason { ObservedChange, CoverageLost }`).

## Decision

1. **One event kind, `dataset_session_ended`, on the SKP control plane.** It is delivered over the Tauri binding as a Tauri event whose name is a constant in `protocol/skp`. There is no subscription command: the shell's one webview receives it. No other event kind is defined.
2. **Advisory delivery, never the authority** (rider (a)).
   - The kernel decides a generation's end server-side and records it before the event is emitted.
   - Every later generation-scoped call refuses by name, whether or not the event was delivered. The code is the one for the end's reason: `engine.source_changed` or `engine.source_coverage_lost`, and code-by-reason also lands with the watcher piece (preregistration body §2b). Today the generation-scoped calls are two:
     - `viewport_query`: the live-generation check and the mint-race arm in `SkpHost::viewport_query`.
     - A data-plane redemption of a ticket from the ended generation. `EngineSourceFactory::create_from_ticket`'s dead-ticket arm (`kernel/src/lib.rs`, on `GenerationRegistry::ticket_liveness`) refuses it by name within the dead-ticket record's bound, `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`. Past that bound the answer degrades to `StreamRegistry::redeem`'s own refusal, which is never an admission.
   - `describe`, `cancel` and `close_dataset` are not generation-scoped, and by design they still answer after the end. An ended dataset stays in the catalog so that `describe` answers, and `close_dataset` is the ordinary end of the open.
   - Reading the rider's "every later call" as every later generation-scoped call is **this ADR's reading, not the ruling's**. It is Open item 2.
   - A lost or late event therefore cannot leave a client acting on an ended generation. The refusal is the authority.
3. **Emission scope, and at most once.**
   - *Scope.* The event is emitted only by the watcher's sink, and only on the transition that ends the generation. This comes from the consult's preregistration body (§2b, "Idle notification"), not the skeleton. An end made by the pre-check or the post-check emits nothing: the refusal or terminal that made that end reaches the shell on its own call.
   - *At most once per ended generation.* This comes from the accepted skeleton and rests on a **precondition the watcher piece must build**: an end that reports whether this call made the transition. Today neither call can report it:
     - `GenerationRegistry::invalidate` returns the ended tickets, an empty list both for an already-ended generation and for a live one with no tickets (the idle case this event exists for);
     - `SessionInvalidator::end_generation` returns a cancel count with the same ambiguity.

     The preregistration body (§2b, "The reason") already declares `invalidate(dataset, reason)` reporting whether this call ended the generation, and emission is gated on that report. It is kept rather than dropped because the human accepted it with the skeleton, and because more than one caller can reach one end: the parent watch and the grandparent watch (S2), and the pre-check.
   - *A repeat at the consumer.* One end can also reach the shell through a refusal or terminal on an in-flight call, so the consumer tolerates a repeat. Today's owner latch is `handleSessionEnded`'s `isAlreadyEnded` guard (`frontends/shell/src/App.tsx`), asserted by `App.test.ts`'s `is idempotent -- the first route to notice wins`.
   - Delivery is best-effort.
4. **The payload is exactly two members, and it authorises nothing** (rider (b)):
   - `session`: the session reference, meaning which dataset session ended. Its wire form is **Open item 1** below.
   - `reason`: the typed reason. It is a closed set of two, `"observed-change"` | `"coverage-lost"`, corresponding one-to-one to the kernel's session-end reasons that the watcher piece introduces.

   Nothing else is carried: no feature data, no generation value, no timestamp or other instrument field (ADR-004 Amendment 4), no message text, no version field. Rider (b) also excludes a handle, and whether `session` may nonetheless be the recipient's own `DatasetHandle` is Open item 1. Receiving the event grants nothing.

   §4 item 13's no-tolerant-reader rule applies to the event through its two decoders:
   - the Rust payload type in `protocol/skp` is `#[serde(deny_unknown_fields)]`;
   - the shell's TypeScript decoder for the event refuses a payload with any member missing or added. The shell has no runtime SKP decoder today; `fixtures.test.ts`'s `assertExactKeys` is its only exact-key check, so this decoder is built with the listener.
5. **The consumer seam, by interface.** Every session-end route in the shell today takes the same two inputs:
   - a `detail` string in the kernel's `"<code>: <display>"` shape, which `formatTerminalRefusal` splits into the block's code and the engine's display text;
   - a `forDataset`, the `DatasetHandle` captured at issue time. `endSessionForDataset` compares it with the current admitted handle (`admittedDatasetRef`) and drops a mismatch.

   The routes are the `onSessionEnded(detail)` callbacks of `viewportStreamManager.ts`, `tileViewportStreamManager.ts` and `candidateArmSession.ts`, and `reportViewportOutcome`'s pre-check catch. All of them reach `endSession(detail, forDataset)` → `endSessionForDataset` → `handleSessionEnded` in `App.tsx`.

   The event carries no `detail`. So each route the listener enters gains a **reason-keyed entry** that passes through the same guard and the same latch. The idle-end block carries no engine display text: its wording is the owner's, a P6 placeholder, and the event states no consequence. How `session` reaches the `forDataset` guard depends on Open item 1:
   - under (i), `session` is the handle and is passed as `forDataset`, with the guard unchanged;
   - under (ii) or (iii), the shell records the reference beside the handle at admission. The listener enters the route with the admitted handle only when the event's reference equals the current admitted one, and drops it otherwise (the N8 guard's rule). This is a session-to-handle map or a re-keyed guard, which the watcher piece builds and proves.
6. **Version.**
   - The event rides the watcher's SKP literal: the one after `crs-unit-fact-and-bounds`' own, by merge order (RULED 2026-09-24 (night) item (2)). The number is fixed in the watcher's preregistration against its branch base, not here.
   - `SKP-V0.md` §4 items 2 and 7 gain notes.
   - The version's §8 entry lists the event and its two members. Under Open item 1's (ii) or (iii), it also lists the `open_dataset` member: a response member under (ii), a request member under (iii).
   - Both-side fixtures (`protocol/skp/tests/data/*.json` with `fixtures.rs`, and `frontends/shell/src/skp/__tests__/fixtures.test.ts`) land in the same commit as the event's addition, per `SKP-V0.md` §4 item 13 condition (iii).
7. **Operation class.** The event is not an ADR-006 operation: it mutates no workspace and performs no external side effect. The end it reports is a session-state transition the kernel has already made, and nothing about it is undoable.

## Consequences

- This is SKP's first push. §4 item 7's "none" ends for this one kind, and §4 item 2's single Tauri-invoke binding gains the Tauri event as this event's delivery. Any later event kind is its own decision and its own literal, never an extension of this one.
- The event's ordering relative to data-plane frames or control-plane responses is not guaranteed and may not be claimed. No delivery latency is claimed: there is no `docs/08` row and no measurement, and an unmeasured figure would be a black box (`docs/01` principle 8).
- It carries no bulk data and no feature data, so the control plane/data plane split (`docs/02`, `docs/10`) is unchanged, and `protocol/data-plane/` has an empty diff.
- A future conformance suite and MCP adapter would inherit the event. Whether it is exposed to an agent host is not decided here.
- Its producer (the kernel host's emission, gated on the transition-reporting end), and its consumer (the shell's listener, its decoder and the reason-keyed route entry) land in the watcher's piece. They are proven by one end-to-end test from the real shape (case (f)).

## What this ADR does not decide

Subscription or unsubscription commands; any other event kind; a websocket or remote binding; re-arm, reload or a restored generation; a generation value on the wire; the reason-keyed entry's exact form and the operator-visible wording (P6); MCP exposure.

## Open — for the human, before acceptance

1. **The session reference's wire form.** Rider (b) excludes a handle. The only per-session identifier on the wire today is the `DatasetHandle`. `SKP-V0.md` §3 classes it as a handle, and after the generation ends it still authorises `describe` and `close_dataset`. For an SKP open, the `DatasetHandle` already maps one-to-one onto that open's generation: one `mint_for_open` per successful `open_dataset`, and no restore. Three forms:
   - **(i) Echo the `DatasetHandle` the client already holds.**
     - *For:* the shell's stale-generation guard (`endSessionForDataset`, `admittedDatasetRef` in `App.tsx`) keys on exactly this value, so the guard is unchanged. The one recipient, the webview that opened the dataset, already holds it, so the event gives it nothing new. There is no new wire value, no `open_dataset` member and no §3 change. The guard's collision-freedom (kernel-minted, OS CSPRNG, never reused) carries over.
     - *Against:* it is literally a handle (§3; §4 item 10), which rider (b)'s words exclude. Adopting it needs the human to read the rider as excluding any authority beyond what the recipient already holds, and that reading is only the human's to give.
   - **(ii) A kernel-minted, non-authorising session reference,** returned by `open_dataset` beside the handle and accepted by no command.
     - *For:* it meets rider (b) as written, and it keeps the guard's collision-freedom on a kernel CSPRNG value.
     - *Against:*
       - It fits neither of §3's two minting rules: the kernel mints where holding a value authorises data to flow, the client where a value only stops its own work. So §3 gains a rule and §4 item 10 a fourth value kind.
       - It adds one `open_dataset` response member, listed in the §8 entry.
       - The shell needs a session-to-handle map or a re-keyed guard, plus the tests that prove it.
       - It maps one-to-one onto a generation. That sits against `skp/0.3`'s §8 rule of no generation value on the wire, and against this ADR's own "a generation value on the wire" not-decided entry. *My reading:* it reveals no more than the `DatasetHandle`, which is already on the wire with the same per-open cardinality, so that rule is not engaged. That reading is the human's to confirm.
   - **(iii) A client-minted correlation value,** supplied on `open_dataset`, held by the kernel for the open, and echoed by the event. The client-minted `CancelKey` is its §3 precedent.
     - *For:* the kernel mints no non-authorising value, and the value authorises nothing by construction.
     - *Against:*
       - It adds one `open_dataset` request member, listed in the §8 entry, and a §3 value kind and codec (§4 item 10).
       - Client-chosen text is held in kernel state for the life of the open.
       - The guard's collision-freedom moves to the client. A reused value would let a stale event match a live session unless the shell mints from a CSPRNG or the kernel refuses a value already held.
       - It has the same shell map or guard change as (ii), and the same one-to-one-with-a-generation question.

   *Architect's recommendation, not a ruling:* (ii). It is the form that meets rider (b) as written while keeping the guard's kernel-side collision-freedom, and its §3 cost is one added minting rule. Until this is answered, the watcher's preregistration cannot fix its payload.
2. **The reading of rider (a)'s "every later call."** This ADR reads it as every later generation-scoped call: `viewport_query` and ticket redemption (Decision 2). `describe`, `cancel` and `close_dataset` are not generation-scoped and answer after the end by design today. `describe` reports the dataset the operator is told to reopen, and `close_dataset` is how the open ends.

   *Architect's recommendation, not a ruling:* confirm this reading at acceptance. Refusing `describe` or `close_dataset` after the end would strand the handle with no ordinary way to close it.
