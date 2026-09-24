# ADR-035 — SKP control-plane event: `dataset_session_ended`

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. Filed 2026-09-24 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 2); its acceptance is the human's. Riders (a) and (b) of that ruling bind the watcher's preregistration through the ruling itself, whatever this ADR's status, as does the emission point RULED 2026-09-24 — question round 19, item 1 fixes; a review may block on those rulings, never on this text.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-source-change-watcher.md`, section "ADR skeleton (for S1)") and that consult's preregistration body with the ruling's two riders. It was redrafted after its first full gate (`state/gate-log.json`, node `engine-source-change-watcher`, attempt 1), again after its second (attempt 2) under RULED 2026-09-24 — question round 18, items 1, 2 and 3, once more after attempt 1 of the fresh count that round 18 item 1 ruled, and again after that count's read at 22a0272, under RULED 2026-09-24 — question round 19, item 1. That read stopped on a kernel defect that PR #116 has since fixed on main (merge f165218).
**Related:** `docs/10` (the specification must cover subscriptions and events) · `docs/02` (control plane vs data plane) · `docs/08_Testing.md` · ADR-004 and its Amendment 4 (instrument surface is never an SKP field) · ADR-006 · ADR-019 · `protocol/skp/SKP-V0.md` §3, §4 items 2, 7, 10 and 13, §5, §8's `skp/0.3` and `skp/0.4` entries · RULED 2026-09-24, the watcher sight (its additions 2 and 4) · RULED 2026-09-24 (night) item (2) · RULED 2026-09-24 — question round 17, item 2 · RULED 2026-09-24 — question round 18, items 1, 2 and 3 · RULED 2026-09-24 — question round 19, item 1.

## Context

SKP v0 declares no server-to-client push on the control plane in any form (`SKP-V0.md` §4 item 7), while `docs/10`'s checklist requires the specification to cover subscriptions and events. The advisory source-change watcher (PLAN node `engine-source-change-watcher`) can end a dataset-session generation while no command or stream is in flight. The watcher sight's addition 4 requires a kernel-to-shell event that delivers that idle signal, with case (f) as its acceptance test. The only kernel-host → webview events today are Tauri emits outside SKP (publish progress, the origin self-check), and neither carries a dataset-session fact. The human ruled one SKP control-plane event on the watcher's literal, with two riders (round 17 item 2). The human then ruled its session reference and the reading of rider (a) (round 18 items 2 and 3). Round 18 item 1 left one question open, whether post-check ends should also emit. Round 19 item 1 answered it: every end emits, whichever check caused it (Decision 3).

**The tree this draft describes** is main since PR #116's merge (f165218):
- The kernel records a generation's end in one place, `GenerationRegistry::invalidate` (`kernel/src/skp.rs`). Its only product caller is `SessionInvalidator::end_generation`, and every end route reaches it through that caller (Decision 3).
- No `TicketState` is dropped while `StreamRegistry`'s guard is held. Each retired value is moved out and dropped after the guard is released; the invariant is stated on `StreamRegistry`'s `tickets` field.
- An end reached from a dropped `Pending` ticket's `EngineSource` therefore completes. The `ticket_drop_under_lock_regression` module in `kernel/src/skp.rs` asserts this in its three `…_does_not_hang` tests, covering the `cancel`, sweep and `cancel_all_for_dataset` paths.

Among the things this ADR names that do not exist in the tree at this draft are the event's name constant, its Rust payload type, the event queue, the shell's listener and decoder, and the session-to-handle map (Decisions 1, 3, 4 and 5), and the five below; the watcher piece introduces all of them:
- the refusal code `engine.source_coverage_lost`, an `engine.` code under `SKP-V0.md` §5's variant-name rule (the sight's addition 2; preregistration body §2a);
- the kernel's session-end reasons, `SessionEndReason { ObservedChange, CoverageLost }` (addition 2; preregistration body §2b);
- the session reference (round 18 item 2; Decision 4);
- `describe`'s ended state (round 18 item 3; Decision 2);
- the transition report on `invalidate` that gates emission (preregistration body §2b's reason bullet; Decision 3).

## Decision

1. **One event kind, `dataset_session_ended`, on the SKP control plane.** It is delivered over the Tauri binding as a Tauri event whose name is a constant in `protocol/skp`. There is no subscription command: the shell's one webview receives it. No other event kind is defined.
2. **Advisory delivery, never the authority** (rider (a), unchanged by round 19 item 1, read as round 18 item 3 rules).
   - The kernel decides a generation's end server-side and records it before the event is emitted.
   - Rider (a)'s every later call reads as every later generation-scoped call. Each of those refuses by name, whether or not the event was delivered. The code is the one for the end's reason, `engine.source_changed` or `engine.source_coverage_lost`; code-by-reason also lands with the watcher piece (preregistration body §2b). Today the generation-scoped calls are two:
     - `viewport_query`: the live-generation check and the mint-race arm in `SkpHost::viewport_query`.
     - Redemption of a ticket (ADR-019) from the ended generation. `EngineSourceFactory::create_from_ticket`'s dead-ticket arm (`kernel/src/lib.rs`, on `GenerationRegistry::ticket_liveness`) refuses it by name while the dead-ticket record holds. That record ends at `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, or earlier when `close_dataset` drops the ended handle's records through `forget_dataset`. A product reopen does not drop them: `open_dataset` mints a new `DatasetHandle` per open, and `mint_for_open`'s own drop is keyed to that new handle. After the record ends, the answer degrades to `StreamRegistry::redeem`'s own refusal, which is never an admission.
   - `describe`, `cancel` and `close_dataset` are not generation-scoped, and they still answer after the end (round 18 item 3). An ended dataset stays in the catalog, so `describe` answers and `close_dataset` stays the ordinary end of the open. Refusing `close_dataset` would leave the handle with no ordinary way to close it.
   - **After the end, the `describe` answer carries the ended state and its typed reason** (round 18 item 3's rider). No client can then take an ended generation's facts for current ones.
     - The reason is the end's own, one of the two values the event's `reason` carries.
     - The ended state is a fact beside `coverage` and `checks`, never a rewrite of them: `coverage` stays the admission-time fact (preregistration body §2b).
     - This is a `describe` change on the watcher's literal, and the watcher's preregistration carries it and its wire form. `describe` stays ADR-006 class 1.
   - A lost or late event therefore cannot leave a client acting on an ended generation. The refusal is the authority.
3. **Emission point: every end emits, at most once** (round 19 item 1).
   - *The point.* The event is emitted where the kernel records a generation's end: on `GenerationRegistry::invalidate`'s transition, reached in the product only through `SessionInvalidator::end_generation`. Every end therefore emits, whichever check caused it, and **pre-check ends are included**. The routes that reach it:
     - the pre-check: `SkpHost::viewport_query` ends the generation through `SkpHost::end_generation` when `open_engine_stream` fails with `EngineError::SourceChanged`, and refuses that call;
     - the post-check at a stream's terminal: `EngineSource::next_into`'s clean arm and its error arm, through `EngineSource::end_session_if_source_changed` (`kernel/src/lib.rs`);
     - the drop path: `EngineSource`'s `Drop`, through the same method. This includes a `Pending` ticket's source retired by `StreamRegistry`'s `sweep_expired`, `mint`, `redeem`, `cancel` or `cancel_all_for_dataset`, which is dropped after the registry's guard is released;
     - the watcher's sink, once the watcher piece lands (preregistration body §2b's signal-after-admission bullet).
   - *A non-blocking enqueue that never re-enters a lock.* Emission is an enqueue onto the event's delivery (Decision 1), made after `invalidate`'s guard is released.
     - It never waits on delivery or on the consumer.
     - It takes no lock of `GenerationRegistry` or `StreamRegistry` and calls into neither.
     - The Tauri emit (Decision 1) runs on the host's side of the queue, never inside the ending call.
     - The queue's type and bound are the watcher preregistration's. An event the queue cannot take is lost. That is a delivery outcome after the emission, never a skipped emission, and Decision 2 makes it safe.
   - *At most once per ended generation.* Emission is gated on a transition report from `invalidate`, the single point's own precondition. The report is **keyed on the live generation actually removed**: only the call that removes the dataset's live generation emits. **The report carries that generation's session reference**, which the kernel holds with the generation `mint_for_open` mints for the open. It is taken under `invalidate`'s guard, in the same step that removes the live generation, so emission never looks the reference up after the guard is released, and it still takes no lock.
     - Today `invalidate` cannot report it. It returns the ended tickets, and the list is empty both when no live generation was left and when a live one had no tickets, which is the idle case. `end_generation` returns a cancel count, with the same ambiguity. The preregistration body (§2b's reason bullet) declares `invalidate(dataset, reason)` reporting whether this call ended the generation.
     - The report does not key on the ended set. `invalidate` marks the dataset in `GenerationState`'s `invalidated` before it looks for a live generation, so a first mark can happen where no generation ends (below).
     - More than one caller can reach one end:
       - the pre-check;
       - the post-check or drop of each of the dataset's concurrent streams;
       - a nested end: `end_generation`'s own cancel retires a `Pending` ticket, and that ticket's dropped source ends again;
       - with the watcher, the parent and grandparent watches (S2).
       The first to remove the live generation emits; the rest emit nothing.
   - *No live generation, no end.* An `invalidate` that finds no live generation for the dataset ends nothing and emits nothing. In the shipped build that happens in two cases:
     - another caller already ended the generation, the nested end included;
     - `close_dataset`'s `forget_dataset` already removed it, and a stream the close cancelled reaches its post-check later on its own thread.
   - *A generation with no session reference still emits.* `live_or_mint` mints a generation, with no reference, for a dataset that has neither a live generation nor an ended mark. In the shipped build that happens only when a `viewport_query` resolved the catalog entry before `close_dataset`'s `catalog.remove` and reaches `live_or_mint` after `forget_dataset`. An end of that generation emits all the same; only the payload's form is open. The watcher's preregistration fixes that form, and returns the case to the human if no valid payload can be formed. One candidate form is a kernel-minted reference that no client holds, which the listener drops on mismatch (Decision 5); since it is minted outside `open_dataset`, the preregistration would declare it as an addition to Decision 4's mint rule, for the human at acceptance. Any exception to every end emitting is the human's.
   - *Close.* `forget_dataset` ends the open, not a generation.
     - It runs on the client's own `close_dataset` and is answered by that command's response. Neither of the event's two reasons describes it, and it emits nothing.
     - **Every end recorded before `forget_dataset` emits, even when its enqueue follows `forget_dataset`.** The reference travels in the transition report (above), so the enqueue needs nothing `forget_dataset` removes. Among the routes that can record an end during `close_dataset` are the two below; a route on another thread (a concurrent `viewport_query` pre-check, another thread's `sweep_expired`, `mint` or `redeem` retiring one of this dataset's `Pending` tickets, and later the watcher's sink) can too, and the rule covers it:
       - on `close_dataset`'s own thread: a `Pending` ticket's source that `cancel_all_for_dataset` drops, after releasing its guard, when that source's post-check had found a change;
       - on a data-plane thread: a `Redeemed` stream of the dataset, cancelled by `cancel_all_for_dataset` or ending on its own, whose `EngineSource::next_into` (either arm) or `Drop` reaches `end_generation` after `cancel_all_for_dataset` returns and before `close_dataset` calls `forget_dataset`. `invalidate` and `forget_dataset` serialize on `GenerationRegistry`'s mutex, so the end is recorded first. Its enqueue, made after the guard is released, may land after `forget_dataset`.
     - An end that reaches `invalidate` after `forget_dataset` finds no live generation, so it is not an end (the bullet on no live generation, above).
   - *What else reaches the shell.* The event is not an end's only route, so one end can reach the shell twice, in no guaranteed order:
     - a pre-check end: that call's own refusal;
     - a post-check end on a stream whose own outcome was clean: its `engine.source_changed` terminal, which replaces its `ok` (`engine/src/stream.rs`, the post-check's rule (i)), when the data plane forwards it.

     Some ends deliver nothing on their own call, and they reach the shell by the event. There are three cases:
     - a post-check end on a cancelled or failed stream, which keeps its own terminal (rule (ii));
     - an end on the drop path;
     - a clean-outcome post-check end where the data plane ended the stream first with its own `Cancelled` or `TransportFailed` (`drive` in `protocol/data-plane/src/adapter_ws.rs`).

     If the event is lost, each of these reaches the shell at its next generation-scoped call's refusal (Decision 2).
   - *A change nobody has ended emits nothing.* `BatchStream::drop` (`engine/src/stream.rs`) cancels without joining the producer, so `EngineSource`'s `Drop` can run before the post-check and find no change. The generation stays live until the first later caller ends it, and that end emits. On a checks-only open, a change no check has read is not yet an end.
   - *A repeat at the consumer.* The consumer tolerates a repeat. Today's owner latch is `handleSessionEnded`'s `isAlreadyEnded` guard (`frontends/shell/src/App.tsx`), asserted by `App.test.ts`'s `is idempotent -- the first route to notice wins`.
   - Delivery is best-effort.
4. **The payload is exactly two members, and it authorises nothing** (rider (b)):
   - `session`: the **session reference** (round 18 item 2).
     - It is a kernel-minted, non-authorising reference, returned by `open_dataset` beside the `DatasetHandle` and accepted by no command.
     - The kernel mints one per successful `open_dataset` from the OS CSPRNG and never reuses it, so a reference never matches another open's.
     - The watcher's preregistration fixes the event's payload to this reference, and fixes its codec and its `open_dataset` member name.
     - **`SKP-V0.md` §3 gains a third minting rule beside its two:** the kernel mints a value wherever the value only names a kernel-side session to its holder and authorises nothing, and no command accepts it as input.
     - §3's table gains the reference, which falls under §3's existing session-scoped, non-persistable rule. §4 item 10 gains it as a fourth value kind, one that is not a handle.
     - Like the `DatasetHandle`, it is minted per open. *This ADR's reading:* `skp/0.3`'s §8 rule of no generation value on the wire is not engaged. The reference is an opaque random value, not the kernel's generation counter, and it reveals no more than the `DatasetHandle` already on the wire with the same per-open cardinality. The human's acceptance of this ADR confirms or refuses that reading.
   - `reason`: the typed reason. It is a closed set of exactly two values that encode rider (b)'s two reasons, observed change and coverage lost, one-to-one with the kernel's session-end reasons. Their wire spellings are the watcher's preregistration's to fix, with the reference's codec and the new members' names.

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

   The block the event enters carries no engine display text. Its wording is the owner's, a P6 placeholder, and the event states no consequence. The watcher piece builds and proves the map and the entry.
6. **Version.**
   - The event rides the watcher's SKP literal, `skp/0.5`. Main's `SKP_VERSION` (`protocol/skp/src/v0/mod.rs`) is `skp/0.4`, the literal `crs-unit-fact-and-bounds` took. The watcher takes the one after it by merge order (RULED 2026-09-24 (night) item (2)), and `SKP-V0.md` §8's `skp/0.4` entry states the same.
   - `SKP-V0.md` §3 gains the minting rule and the reference's row (Decision 4). §4 items 2, 7 and 10 gain notes.
   - The version's §8 entry lists:
     - the event and its two members;
     - the `open_dataset` response member that carries the session reference;
     - `describe`'s ended state and typed reason.
   - Both-side fixtures (`protocol/skp/tests/data/*.json` with `fixtures.rs`, and `frontends/shell/src/skp/__tests__/fixtures.test.ts`) land in the same commit as each addition, per `SKP-V0.md` §4 item 13 condition (iii).
7. **Operation class.** The event is not an ADR-006 operation: it mutates no workspace and performs no external side effect. The end it reports is a session-state transition the kernel has already made, and nothing about it is undoable. `describe`'s ended state is a read and stays class 1.

## Consequences

- This is SKP's first push. §4 item 7's "none" ends for this one kind, and §4 item 2's single Tauri-invoke binding gains the Tauri event as this event's delivery. Any later event kind is its own decision and its own literal, never an extension of this one.
- The event's ordering relative to data-plane frames or control-plane responses is not guaranteed and may not be claimed. No delivery latency is claimed either. `docs/08_Testing.md` has no budget row for it and no measurement exists. That file states its rule as `no numbers, no claim` in its Correctness section, for the figures it names there, and the rule is applied here. Decision 3 adds an enqueue to every end route, the data plane's post-check and drop paths among them. It does not exist in the tree yet, no measurement exists for it, and no cost is claimed for it.
- One end can reach the shell twice (Decision 3). The block's text then depends on which route arrives first: the engine's display text from a refusal or terminal, or the owner's P6 wording from the event. Both carry the same reason, and the owner latch keeps one block.
- It carries no bulk data and no feature data, so the control plane/data plane split (`docs/02`, `docs/10`) is unchanged. Emission is kernel-side and keys on no data-plane outcome, so `protocol/data-plane/` has an empty diff.
- `open_dataset`'s response and `describe`'s response each gain a member on the watcher's literal, and the kernel holds one session reference per open.
- A future conformance suite and MCP adapter would inherit the event. Whether it is exposed to an agent host is not decided here.
- Everything else lands in the watcher's piece, whose preregistration carries the emission point (round 19 item 1). One end-to-end test from the real shape, case (f), proves it.
  - The producer: the reference's mint, the `describe` ended state, the transition report, and emission at the single end point. It comes with a kernel test per route in Decision 3 (pre-check, post-check, the drop path including a `Pending` drop, the sink, and both close-time routes: a `Pending` drop inside `cancel_all_for_dataset`, and a data-plane-thread end recorded before `forget_dataset` whose enqueue follows it) that the route emits exactly once, and that a repeat, nested or post-close end emits nothing.
  - The consumer: the shell's listener, its decoder, the session-to-handle map and the reason-keyed route entry.

## What this ADR does not decide

Subscription or unsubscription commands; any other event kind; a websocket or remote binding; re-arm, reload or a restored generation; a generation value on the wire (Decision 4 records this ADR's reading of the reference); the reference's codec, the new members' names, the `reason` values' wire spellings and the `describe` ended state's wire form (the watcher's preregistration); the event queue's type and bound, within Decision 3's rule (the watcher's preregistration); the payload's form for the end of a generation with no session reference, which still emits (Decision 3; the watcher's preregistration, or the human); the reason-keyed entry's exact form and the operator-visible wording (P6); MCP exposure.

## For the human, at acceptance

*History:* round 18 items 2 and 3 ruled the earlier Open items on the session reference's wire form and the reading of rider (a), which are now Decisions 4–5 and Decision 2. Round 19 item 1 ruled the last one, whether post-check ends should also emit, which is now Decision 3. No Open item remains.

- Decision 4 records this ADR's reading that the session reference does not engage `SKP-V0.md` §8's `skp/0.3` rule of no generation value on the wire. The human's acceptance confirms or refuses that reading.
