# ADR-035 — SKP control-plane event: `dataset_session_ended`

**Status:** Proposed — filed 2026-09-24 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 2); its acceptance is the human's. Riders (a) and (b) of that ruling bind the watcher's preregistration through the ruling itself, whatever this ADR's status.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-source-change-watcher.md`, section "ADR skeleton (for S1)") with the ruling's two riders.
**Related:** `docs/10` (the specification must cover subscriptions and events) · `docs/02` (control plane vs data plane) · ADR-004 and its Amendment 4 (instrument surface is never an SKP field) · ADR-006 · ADR-016 Amendment 1 · ADR-018 · ADR-019 · `protocol/skp/SKP-V0.md` §3, §4 items 2 and 7, §5 · RULED 2026-09-24, the watcher sight (its addition 4) · RULED 2026-09-24 (night) item (2).

## Context

SKP v0 declares no server-to-client push on the control plane in any form (`SKP-V0.md` §4 item 7), while `docs/10`'s checklist requires the specification to cover subscriptions and events. The advisory source-change watcher (PLAN node `engine-source-change-watcher`) can end a dataset-session generation while no command or stream is in flight, and the watcher sight's addition 4 requires a kernel-to-shell event that delivers that idle signal, with case (f) as its acceptance test. The only kernel-host → webview events today are Tauri emits outside SKP (publish progress, the origin self-check); neither carries a dataset-session fact. The human ruled one SKP control-plane event on the watcher's literal, with two riders (round 17 item 2).

## Decision

1. **One event kind, `dataset_session_ended`, on the SKP control plane.** It is delivered over the Tauri binding as a Tauri event whose name is a constant in `protocol/skp`. There is no subscription command: the shell's one webview receives it. No other event kind is defined.
2. **Advisory delivery, never the authority** (rider (a)). The kernel decides a generation's end server-side and records it before the event is emitted. The event is emitted only by the transition that ends the generation, when the watcher ends it. Every later call on that generation still refuses by name with its typed code (`engine.source_changed` or `engine.source_coverage_lost`), whether or not the event was delivered. Delivery is best-effort and at most once per ended generation. A lost, late or duplicated event therefore cannot leave a client acting on an ended generation: the refusal is the authority, and a consumer is idempotent.
3. **The payload is exactly two members, and it authorises nothing** (rider (b)):
   - `session` — the session reference: which dataset session ended. Its wire form is **Open item 1** below.
   - `reason` — the typed reason, a closed set of two: `"observed-change"` | `"coverage-lost"`, corresponding one-to-one to the kernel's session-end reasons.

   Nothing else is carried: no feature data, no handle, no generation value, no timestamp or other instrument field (ADR-004 Amendment 4), no message text, no version field. `deny_unknown_fields` holds in both directions. Receiving the event grants nothing. The shell's only use of it is to enter its existing owner-side session-end route, and the owner states the consequence; the event states none.
4. **Version.** The event rides the watcher's SKP literal: the one after `crs-unit-fact-and-bounds`' own, by merge order (RULED 2026-09-24 (night) item (2)). The number is fixed in the watcher's preregistration against its branch base, not here. `SKP-V0.md` §4 items 2 and 7 gain notes, and the version's §8 entry lists the event and its two members. Rust and TypeScript fixtures are updated in the same commit as the literal.
5. **Operation class.** The event is not an ADR-006 operation: it mutates no workspace and performs no external side effect. The end it reports is a session-state transition the kernel has already made, and nothing about it is undoable.

## Consequences

- This is SKP's first push. §4 item 7's "none" ends for this one kind, and §4 item 2's single Tauri-invoke binding gains the Tauri event as this event's delivery. Any later event kind is its own decision and its own literal, never an extension of this one.
- The event's ordering relative to data-plane frames or control-plane responses is not guaranteed and may not be claimed. No delivery latency is claimed (ADR-018); there is no `docs/08` row.
- It carries no bulk data and no feature data, so the control plane/data plane split (`docs/02`, `docs/10`) is unchanged, and `protocol/data-plane/` has an empty diff.
- A future conformance suite and MCP adapter would inherit the event. Whether it is exposed to an agent host is not decided here.
- Its producer (the kernel host's emission) and consumer (the shell's listener) land in the watcher's piece, proven by one end-to-end test from the real shape (case (f)).

## What this ADR does not decide

Subscription or unsubscription commands; any other event kind; a websocket or remote binding; re-arm, reload or a restored generation; a generation value on the wire; the shell's operator-visible wording (P6); MCP exposure.

## Open — for the human, before acceptance

1. **The session reference's wire form.** Rider (b) excludes a handle. The only per-session identifier on the wire today is the `DatasetHandle`, which SKP-V0 §3 calls a handle and which still authorises `describe` and `close_dataset` after the generation ends. Two forms:
   - (i) echo the `DatasetHandle` the client already holds. No new wire value, but it is literally a handle.
   - (ii) a kernel-minted, non-authorising session reference, returned by `open_dataset` beside the handle and accepted by no command. It rides the same literal and adds one response member.

   *Architect's recommendation, not a ruling:* (ii), the form that meets rider (b) as written. Until this is answered, the watcher's preregistration cannot fix its payload.
