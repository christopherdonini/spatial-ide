# ADR-035 — SKP control-plane event: `dataset_session_ended`

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. Filed 2026-09-24 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 2); its acceptance is the human's. Riders (a) and (b) of that ruling bind the watcher's preregistration through the ruling itself, whatever this ADR's status, and a review may block on the ruling, never on this text.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-source-change-watcher.md`, section "ADR skeleton (for S1)") and that consult's preregistration body with the ruling's two riders. It was redrafted after its first full gate (`state/gate-log.json`, node `engine-source-change-watcher`, attempt 1), and again after its second (attempt 2) under RULED 2026-09-24 — question round 18, items 1, 2 and 3.
**Related:** `docs/10` (the specification must cover subscriptions and events) · `docs/02` (control plane vs data plane) · `docs/08` · ADR-004 and its Amendment 4 (instrument surface is never an SKP field) · ADR-006 · ADR-019 · `protocol/skp/SKP-V0.md` §3, §4 items 2, 7, 10 and 13, §5, §8's `skp/0.3` entry · RULED 2026-09-24, the watcher sight (its additions 2 and 4) · RULED 2026-09-24 (night) item (2) · RULED 2026-09-24 — question round 17, item 2 · RULED 2026-09-24 — question round 18, items 1, 2 and 3.

## Context

SKP v0 declares no server-to-client push on the control plane in any form (`SKP-V0.md` §4 item 7), while `docs/10`'s checklist requires the specification to cover subscriptions and events. The advisory source-change watcher (PLAN node `engine-source-change-watcher`) can end a dataset-session generation while no command or stream is in flight. The watcher sight's addition 4 requires a kernel-to-shell event that delivers that idle signal, with case (f) as its acceptance test. The only kernel-host → webview events today are Tauri emits outside SKP (publish progress, the origin self-check), and neither carries a dataset-session fact. The human ruled one SKP control-plane event on the watcher's literal, with two riders (round 17 item 2), and then ruled its session reference and the reading of rider (a) (round 18 items 2 and 3).

Four things this ADR names do not exist in the tree at its filing, and the watcher piece introduces all of them:
- the refusal code `engine.source_coverage_lost`, an `engine.` code under `SKP-V0.md` §5's variant-name rule (the sight's addition 2; preregistration body §2a);
- the kernel's session-end reasons, `SessionEndReason { ObservedChange, CoverageLost }` (addition 2; preregistration body §2b);
- the session reference (round 18 item 2; Decision 4);
- `describe`'s ended state (round 18 item 3; Decision 2).

## Decision

1. **One event kind, `dataset_session_ended`, on the SKP control plane.** It is delivered over the Tauri binding as a Tauri event whose name is a constant in `protocol/skp`. There is no subscription command: the shell's one webview receives it. No other event kind is defined.
2. **Advisory delivery, never the authority** (rider (a), read as round 18 item 3 rules).
   - The kernel decides a generation's end server-side and records it before the event is emitted.
   - Rider (a)'s every-later-call is every later generation-scoped call. Each of those refuses by name, whether or not the event was delivered. The code is the one for the end's reason, `engine.source_changed` or `engine.source_coverage_lost`; code-by-reason also lands with the watcher piece (preregistration body §2b). Today the generation-scoped calls are two:
     - `viewport_query`: the live-generation check and the mint-race arm in `SkpHost::viewport_query`.
     - Redemption of a ticket (ADR-019) from the ended generation. `EngineSourceFactory::create_from_ticket`'s dead-ticket arm (`kernel/src/lib.rs`, on `GenerationRegistry::ticket_liveness`) refuses it by name while the dead-ticket record holds. That record ends at `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, or earlier when the dataset is reopened or closed (`mint_for_open` and `forget_dataset` drop that dataset's records). After that, the answer degrades to `StreamRegistry::redeem`'s own refusal, which is never an admission.
   - `describe`, `cancel` and `close_dataset` are not generation-scoped, and they still answer after the end (round 18 item 3). An ended dataset stays in the catalog, so `describe` answers and `close_dataset` stays the ordinary end of the open. Refusing either one would leave the handle with no ordinary way to close it.
   - **After the end, the `describe` answer carries the ended state and its typed reason** (round 18 item 3's rider). This way no client can take an ended generation's facts for current ones.
     - The reason is the end's own, one of the two values the event's `reason` carries.
     - The ended state is a fact beside `coverage` and `checks`, never a rewrite of them: `coverage` stays the admission-time fact (preregistration body §2b).
     - This is a `describe` change on the watcher's literal, and the watcher's preregistration carries it and its wire form. `describe` stays ADR-006 class 1.
   - A lost or late event therefore cannot leave a client acting on an ended generation. The refusal is the authority.
3. **Emission scope, and at most once.**
   - *Scope.* Only the watcher's sink emits the event, and only on the transition that ends the generation. This comes from the preregistration body (§2b's idle-notification bullet), not the skeleton. An end made by the pre-check or the post-check emits nothing. Such an end reaches the shell only through what the tree already delivers:
     - **A pre-check end:** the `viewport_query` refusal that made it, on that call.
     - **A post-check end on a stream whose own outcome was clean:** that stream's `engine.source_changed` terminal, which replaces its `ok` (`engine/src/stream.rs`, the post-check's rule (i)).
     - **The residual:** some post-check ends deliver nothing on their own call, and each reaches the shell only at its next generation-scoped call's refusal (Decision 2). There are two cases:
       - a post-check end on a cancelled or failed stream: that stream keeps its own terminal (rule (ii));
       - an end found when the stream is dropped: `EngineSource`'s `Drop` in `kernel/src/lib.rs` delivers no terminal.

       Until that refusal, the shell shows no session-ended block. Whether these ends should also emit is Open item 1.
   - *At most once per ended generation.*
     - The source is the consult's ADR skeleton, which the S1 recommendation pointed to. Round 17 item 2 chose that recommendation. The skeleton is not an accepted ADR, and this text binds nothing until the human accepts it.
     - It rests on a **precondition the watcher piece must build**: an end that reports whether this call made the transition. Today neither call can report it:
       - `GenerationRegistry::invalidate` returns the ended tickets. The list is empty both for an already-ended generation and for a live one with no tickets, which is the idle case this event exists for.
       - `SessionInvalidator::end_generation` returns a cancel count, with the same ambiguity.
     - The preregistration body (§2b's reason bullet) already declares `invalidate(dataset, reason)` reporting whether this call ended the generation.
     - Emission is gated on that report, because more than one caller can reach one end: the parent watch and the grandparent watch (S2), the pre-check, and the post-check of each of the dataset's concurrent streams. All of them reach it through the one `SessionInvalidator`. The gate means the sink never emits for an end another caller already made.
   - *A repeat at the consumer.* One end can also reach the shell through a refusal or terminal on an in-flight call, so the consumer tolerates a repeat. Today's owner latch is `handleSessionEnded`'s `isAlreadyEnded` guard (`frontends/shell/src/App.tsx`), asserted by `App.test.ts`'s `is idempotent -- the first route to notice wins`.
   - Delivery is best-effort.
4. **The payload is exactly two members, and it authorises nothing** (rider (b)):
   - `session`: the **session reference** (round 18 item 2).
     - It is a kernel-minted, non-authorising reference, returned by `open_dataset` beside the `DatasetHandle` and accepted by no command.
     - The kernel mints one per successful `open_dataset` from the OS CSPRNG and never reuses it. The shell's stale-generation guard therefore keeps its kernel-side collision-freedom.
     - The watcher's preregistration fixes the event's payload to this reference, and fixes its codec and its `open_dataset` member name.
     - **`SKP-V0.md` §3 gains a third minting rule beside its two:** the kernel mints a value wherever the value only names a kernel-side session to its holder and authorises nothing, and no command accepts it as input.
     - §3's table gains the reference, which falls under §3's existing session-scoped, non-persistable rule. §4 item 10 gains it as a fourth value kind, one that is not a handle.
     - Like the `DatasetHandle`, it is minted per open. *This ADR's reading:* `skp/0.3`'s §8 rule of no generation value on the wire is not engaged. The reference is an opaque random value, not the kernel's generation counter, and it reveals no more than the `DatasetHandle` already on the wire with the same per-open cardinality. The human's acceptance of this ADR confirms or refuses that reading.
   - `reason`: the typed reason. It is a closed set of two, `"observed-change"` | `"coverage-lost"`, one-to-one with the kernel's session-end reasons.

   Nothing else is carried: no feature data, no generation value, no timestamp or other instrument field (ADR-004 Amendment 4), no message text, no version field and no handle. Receiving the event grants nothing.

   §4 item 13's no-tolerant-reader rule applies to the event through its two decoders:
   - The Rust payload type in `protocol/skp` is `#[serde(deny_unknown_fields)]`.
   - The shell's TypeScript decoder for the event refuses a payload with any member missing or added. The shell has no runtime SKP decoder today. `frontends/shell/src/testUtils/assertExactKeys.ts` runs only in tests (`fixtures.test.ts`, `renderTruth.test.ts`), so this decoder is built with the listener.
5. **The consumer seam, by interface.** Every session-end route in the shell today ends in `endSession(detail, forDataset)` → `endSessionForDataset` → `handleSessionEnded` in `App.tsx`:
   - `detail` is a string in the kernel's `"<code>: <display>"` shape. `formatTerminalRefusal` splits it into the block's code and the engine's display text.
   - `forDataset` is the `DatasetHandle` of the generation the route belongs to. `endSessionForDataset` compares it with the current admitted handle (`admittedDatasetRef`) and drops a mismatch.

   The routes differ in where `forDataset` comes from:
   - The `onSessionEnded` callbacks of `viewportStreamManager.ts`, `tileViewportStreamManager.ts` and `candidateArmSession.ts` take `detail` only. `App.tsx` binds `forDataset` to the effect's `admitted.dataset` where it constructs the baseline manager and the candidate session. The tile manager's callback reaches `App` through the candidate session's.
   - `reportViewportOutcome(promise, forDataset)`'s pre-check catch takes `forDataset` from its call site.

   The event carries neither `detail` nor a handle, so the listener reaches the same guard through the **session-to-handle map** (round 18 item 2):
   - At admission, where `handleAdmitted` writes `admittedDatasetRef`, the shell records the `session` reference that `open_dataset` returned beside the admitted handle.
   - When an event arrives, the listener compares its `session` with the reference recorded for the current admitted handle. It drops the event on a mismatch (the N8 guard's rule).
   - On a match, it enters a **reason-keyed entry** with the admitted handle as `forDataset`. That entry passes through the same `endSessionForDataset` guard and the same `handleSessionEnded` latch.

   The idle-end block carries no engine display text. Its wording is the owner's, a P6 placeholder, and the event states no consequence. The watcher piece builds and proves the map and the entry.
6. **Version.**
   - The event rides the watcher's SKP literal, which is the one after `crs-unit-fact-and-bounds`' own, by merge order (RULED 2026-09-24 (night) item (2)). The watcher's preregistration fixes the number against its branch base; this ADR does not.
   - `SKP-V0.md` §3 gains the minting rule and the reference's row (Decision 4). §4 items 2, 7 and 10 gain notes.
   - The version's §8 entry lists:
     - the event and its two members;
     - the `open_dataset` response member that carries the session reference;
     - `describe`'s ended state and typed reason.
   - Both-side fixtures (`protocol/skp/tests/data/*.json` with `fixtures.rs`, and `frontends/shell/src/skp/__tests__/fixtures.test.ts`) land in the same commit as each addition, per `SKP-V0.md` §4 item 13 condition (iii).
7. **Operation class.** The event is not an ADR-006 operation: it mutates no workspace and performs no external side effect. The end it reports is a session-state transition the kernel has already made, and nothing about it is undoable. `describe`'s ended state is a read and stays class 1.

## Consequences

- This is SKP's first push. §4 item 7's "none" ends for this one kind, and §4 item 2's single Tauri-invoke binding gains the Tauri event as this event's delivery. Any later event kind is its own decision and its own literal, never an extension of this one.
- The event's ordering relative to data-plane frames or control-plane responses is not guaranteed and may not be claimed. No delivery latency is claimed either: `docs/08` has no row for it and no measurement exists, and `docs/08` admits no figure without its measurement.
- It carries no bulk data and no feature data, so the control plane/data plane split (`docs/02`, `docs/10`) is unchanged, and `protocol/data-plane/` has an empty diff.
- `open_dataset`'s response and `describe`'s response each gain a member on the watcher's literal, and the kernel holds one session reference per open.
- A future conformance suite and MCP adapter would inherit the event. Whether it is exposed to an agent host is not decided here.
- Everything else lands in the watcher's piece, and is proven by one end-to-end test from the real shape (case (f)):
  - the producer: the reference's mint, the `describe` ended state, and the kernel host's emission, gated on the transition-reporting end;
  - the consumer: the shell's listener, its decoder, the session-to-handle map and the reason-keyed route entry.

## What this ADR does not decide

Subscription or unsubscription commands; any other event kind; a websocket or remote binding; re-arm, reload or a restored generation; a generation value on the wire (Decision 4 records this ADR's reading of the reference); the reference's codec, the new members' names and the `describe` ended state's wire form (the watcher's preregistration); the reason-keyed entry's exact form and the operator-visible wording (P6); MCP exposure.

## Open — for the human, before acceptance

*History:* the second draft's Open items 1 (the session reference's wire form) and 2 (the reading of rider (a)) were ruled by round 18 items 2 and 3, and are now Decision 4–5 and Decision 2 text.

1. **Whether a post-check end should also emit.**
   - **The residual.** Decision 3 emits only from the watcher's sink. A post-check end on a cancelled or failed stream, or an end found when the stream is dropped, therefore reaches the shell only at its next generation-scoped call's refusal. Rider (a) keeps that correct, because no generation-scoped call is answered. But until the operator's next pan or query, the shell shows the ended generation's resident data with no session-ended block.
   - **What no form reaches.** One sub-case stays outside every form: a change the drop does not find, because `BatchStream::drop` returns before the producer's post-check has run. That end is made by the next pre-check, on its own call.
   - **(a) No.** The residual stays as Decision 3 names it.
     - *For:* the event keeps the preregistration body's scope, a watcher end, and nothing changes.
     - *Against:* the operator-visible lag above has no bound except the operator's next call.
   - **(b) Every post-check end emits.** The post-check's `end_generation` call emits, gated on the same transition report as the sink.
     - *For:* it closes the residual whenever delivery succeeds. Every post-check already reaches the one `SessionInvalidator`, and the owner latch already tolerates a repeat.
     - *Against:*
       - A clean-outcome end would then reach the shell twice, as terminal and as event, in no guaranteed order. The block's text would depend on which arrives first: the engine's display text or the owner's P6 wording.
       - The event's scope widens beyond the preregistration body's §2b.
       - The emitter must reach the producer's drop path, which holds no `&SkpHost`.
   - **(c) Only a post-check end its own stream does not carry emits:** a cancelled or failed stream, or an end found at drop.
     - *For:* it closes the same residual and adds no repeat for a clean outcome.
     - *Against:*
       - Emission then branches on the stream's outcome class, a second condition beside the transition report, and that condition needs its own test.
       - It has the same drop-path reach as (b), and the same widening beyond §2b.

   *Architect's recommendation, not a ruling:* (c). The event then covers exactly the ends that no call carries, which is the principle the watcher-only scope already follows, and it adds no operator-visible order dependence. Under (b) or (c), the watcher's preregistration carries the emission point and its test. Under (a), the residual becomes a KNOWN-LIMITATIONS line in that piece.
