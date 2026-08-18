# ADR-027 — The action console and display truth

**Status:** Proposed — binds nothing until accepted. Not architect-blockable. Filed 2026-08-18 by
the `cut/action-console` P6 piece from the architect design consult's skeleton (2026-08-18), per
CLAUDE.md's architect-first rule.
**Related:** docs/01 principle 4 and principle 8; docs/03 "The action console"; docs/07 Alpha (with
its 2026-08-18 split note); ADR-004 amendment 1 (bit-critical control-plane scalars) and Amendment 4
(instrument surface is never an SKP field — governs the wire, not this display); ADR-006 (why
persistence/export are out); ADR-022 / ADR-023 (style's missing API equivalent and its owner);
ADR-024 (publish is binding-local, never SKP); SKP-V0.md §3, §4 items 1/2/3/9/11/13, §7.2's
2026-08-18 correction; docs/09 "Telemetry and training"; docs/13 (why recording is not the
artifact).

## Context

docs/01 principle 4 requires every GUI action to have an API equivalent *and to show it*; docs/07
schedules the full docs/03 console in Alpha. The Prototype shipped seven shell surfaces without the
shows-it clause. Of the commands those surfaces can issue, five are SKP, eight are binding-local
Tauri commands ADR-024 excludes from the SKP catalog by name, and at least one surface (style)
issues no command at all. A console that rendered all of them as "the API equivalent" would
fabricate two distinct kinds of claim: a command *shape* the wire would refuse, and a *callability*
status that does not exist — SKP has one transport binding, session-scoped handles, and no
idempotency.

## Decision

1. The Prototype ships the console's **visibility payoff only**. Notebook recording and AI trace
   collection stay Alpha (13, 04/09).
2. **Three display classes** — A (SKP command: exact serialized request, copyable), B
   (binding-local host command: name and plain-language effect, no arguments, no copy, explicit
   "not part of the API"), C (no command at all: explicit "no API equivalent exists" plus the
   filed decision that owns the gap).
3. **Display truth is structural, not editorial.** The console composes no command text. Its only
   source is the object the real client hands `invoke`, captured at one choke point; correctness is
   proven by reference identity, by the existing both-sides-read shared fixtures, and by a language
   lint over rendered copy.
4. **The console is a debt register as well as a feature.** A class-B or class-C entry is a
   standing, visible statement that principle 4 is unmet for that surface, pointing at the decision
   that owes the answer. A new Tauri command that is not classified fails the build: it is
   registered in the host's own handler list (`tauri::generate_handler!` in `src-tauri/src/lib.rs`
   — a command cannot exist without appearing there), and `surfaceCompleteness.test.ts` reads that
   list as its authoritative source, failing when a handler-listed command has no registry row (a
   secondary JS-side call-site scan over the frontend tree backs it up, with its own stated
   line-scan caveat).
5. **The console performs no operation**: no execution, no persistence, no export, no telemetry, no
   replay affordance.
6. **The human's 2026-08-18 ruling (DECISIONS-PENDING entry 18, Resolved):** principle 4's unmet
   status for style and publish is **accepted-with-a-deadline**, not a defect standing open
   indefinitely. Publish's deadline is inherited from ADR-017's own acceptance condition — its
   exposure fence already runs through the human, and that fence is where publish's own API
   equivalent (or the decision that it never gets one) is decided, not this ADR. Style's deadline is
   inherited from ADR-022/ADR-023's own resolution — whichever of the two settles style's data model
   is also where style's own API-equivalent question is decided, not this ADR. This ADR's class-B
   and class-C entries are the visible register of that acceptance: they make the gap legible, on
   every run, until each inherited deadline is met — they do not themselves set a deadline, and they
   do not themselves close either gap.

## Consequences

- Principle 4 is **partially** discharged: satisfied for the five SKP commands, and *made legible
  but not satisfied* for style and publish. This ADR does not fix those gaps and must not be cited
  as having done so.
- The copied text is a faithful record and not a runnable script, for three independent reasons
  (SKP-V0.md §3, §4 item 2, §4 item 9). It becomes runnable only when a second transport binding
  exists — a future decision this ADR does not schedule.
- Every future shell surface pays a small, enforced tax: declare its class or fail the build. This
  is the point.
- The console displays absolute local paths and, when asserted, a CRS definition — local display of
  the operator's own actions, never written, never collected (docs/09).
- No docs/08 figure is claimed for the console; the only budget assertion is structural (the
  recorder is outside the frame path, and a closed console does no DOM work).

## What this ADR does not decide

Whether shipping a GUI surface with no API equivalent is acceptable and until when (the human's,
queued); a second SKP transport binding or any out-of-process client; SKP/MCP/plugin/notebook/AI
exposure of publish (ADR-017's acceptance condition, untouched); an executable API console (docs/03
Developer mode, Alpha at the earliest); notebook recording or the Workflow IR (13); data-plane
entries in the console; whether style ever gains an API equivalent (ADR-022/ADR-023).
