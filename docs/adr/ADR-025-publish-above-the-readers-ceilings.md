# ADR-025 — Publishing above the reader's ceilings (the dead-artifact question)

**Status:** **Accepted — 2026-09-07, by the human's ruling: option (a), refuse typed at preflight,
naming the viewport-bbox alternative; reopens when a second reader exists** (see the appended
Decision section). *Original status line, retained:* Proposed, decision **deliberately open** (the
ADR-023 pattern) — filed 2026-08-30 on Part H8b's confirmation of the gap at the UI. Binds nothing;
no option below is licensed until the human decides at acceptance.

**Related:** ADR-017 (the bundle format and its acceptance condition); ADR-008 (static
publishing first); ADR-006 (publish is a class-3 external side effect); ADR-018 (no duration on
a cancellation); `kernel/RESULTS.md` finding 2; `frontends/shell/MANUAL-WALKTHROUGH.md` Part H
result log (H8a/H8b, 2026-08-20/22).

## Context — the demonstrated gap

**No publish-side refusal or warning exists above the shipped viewer's declared ceilings.** The
kernel record established it first (RESULTS finding 2: a whole-file 5 GB publish succeeds —
6,636 partitions — and the reader then refuses); Part H8b demonstrated it end-to-end at the UI,
by the operator's own hand: a whole-dataset publish of 3,300,000 rows completed with **no
warning at any point** — ~5.4 GB written over ~11 minutes, refusable only by the disk — and the
bundled viewer then refused the artifact with its typed ceiling refusal. The operator read the
refusal as working-as-intended; the silence at publish time is the open question, not the
refusal. H8a separately demonstrated the mitigating property that exists today: a mid-flight
cancel is clean (audit intent/cancelled pair, empty destination, no staging debris).

Why this is not obviously a preflight refusal: **the bundle format is the product's contract;
the shipped viewer is one reader of it.** ADR-017 §5's manifest is honest for the artifact
regardless of size, and a future or third-party reader may carry higher ceilings than the
bundled viewer does. A publish-side hard refusal would weld the writer to one reader's limits —
which is exactly the kind of silent coupling ADR-017 avoided. Against that: docs/01's honesty
principles cut the other way when the product's *own* UI lets an operator spend minutes and
gigabytes producing an artifact its *own* "Serve and view" flow then refuses, with nothing
having said so.

## The open decision

When a publish's preflight can predict the artifact will exceed the bundled viewer's declared
ceilings, the publish surface should:

- **(a) refuse, typed, at preflight** — strongest honesty, but welds the writer to the shipped
  reader's ceilings and forecloses larger-reader futures;
- **(b) warn on the approval surface** — the dialog states plainly that the artifact will exceed
  the bundled viewer's ceilings and will not be viewable with it, and the operator's typed
  approval proceeds past the warning (the class-3 approval already exists; the warning rides
  it); or
- **(c) remain silent** — the status quo the evidence exists to question.

No recommendation is recorded in this filing; the evidence (both directions of it) is. Whichever
option is chosen must also say where the ceilings' figures live (the viewer's own declared
constants, read at preflight — never a second copy that can drift).

## What this ADR does not decide

- The viewer's ceilings themselves (ADR-011's tiling/LOD slice owns what replaces whole-dataset
  residency, reader-side included).
- Filtered-subset bundles / `bundle_version` 2 (a separate candidate decision; ADR-024 once
  called it "candidate ADR-025" — that number is taken by this filing, and the filtered-subset
  question renumbers when scheduled).
- The `ensure_pinned` pre-dialog phase's principle-7 gap (DECISIONS-PENDING entry 7, the
  human's, now carrying Part H's observation).
- Any perf figure: the durations above are bucket observations from an operator session,
  audit-corroborated, not measurements (docs/08).

## Decision — ruled by the human, 2026-09-07 (appended; the sections above are retained as filed)

**The human, verbatim (DECISIONS-PENDING.md, the entry-53 / B3 ruling of 2026-09-07):** *"ADR-025
reading = refuse-at-preflight, typed, naming the viewport-bbox alternative, reopen when a second
reader exists."*

**Decision.** Option **(a)**: when the publish preflight can predict that the artifact will exceed the
bundled viewer's declared ceilings, the publish surface **refuses, typed, at preflight**, and the
refusal names the current-viewport-bbox publish as the alternative. Per this ADR's own constraint
above, the ceilings' figures live in the viewer's own declared constants
(`renderer/bundle-viewer/src/render.ts`), read at preflight — never a second copy that can drift.

**Reopen condition (binding).** This decision reopens **when a second reader exists** — a reader
whose ceilings differ from the bundled viewer's; until then the writer is deliberately welded to the
one shipped reader's ceilings, the cost option (a) names above, accepted knowingly.

**Applied by:** the release-engineering cut (`RELEASE-0.1.md`, item 3e) — the preflight refusal is
implemented, reviewer-gated, and shown at the ADR-017 exposure review on the packaged artifact.
Status line updated on this ruling; nothing else above is edited.
