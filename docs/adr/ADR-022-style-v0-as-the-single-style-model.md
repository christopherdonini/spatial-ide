# ADR-022 — Style v0 as the Project's Single Style Model, Beyond the Bundle

**Status:** Accepted, 2026-09-02 — as recommended, no condition attached
(`DECISIONS-PENDING.md`'s resolved entry 3). Not architect-blockable. Implemented ahead of
acceptance under already-accepted **ADR-017** (whose §5a defines the document this ADR widens
the *role* of, without changing its shape) and `docs/07`'s Prototype hero-slice scope — the
ADR-019/ADR-020/ADR-021 precedent; operator-confirmed end to end via the style-panel cut's
walkthrough Part F (shell-and-viewer visual agreement, the F7 round-trip).
**Drafted by:** the architect design consult for the `cut/style-panel` branch (2026-08-15), filed
from that consult's skeleton by the custodian.
**Related:** ADR-017 §5a (the style document: format, refusal set, canonical form), ADR-008
(static publishing), ADR-006 (operation classes — see Consequences), ADR-001 + 2026-08-09
amendment (React shell), `docs/01` (plain text everywhere; no black boxes), `docs/02` (module
boundaries), `docs/06` (styles compile to renderer state; determinism), `docs/08` line 63 (style
compilation determinism), `docs/11` (typed artifacts — see Consequences),
`renderer/src/style.rs`, `renderer/src/canonical.rs`, `renderer/bundle-viewer/src/style.ts`,
`renderer/tests/data/style-agreement.json`.

## Context

ADR-017 §5a defines style v0 as "the style document a bundle carries," scoped to the publishing
artifact. It is implemented twice — once in Rust (`renderer/src/style.rs`: parse, validate,
canonicalize, hash; `renderer/src/compiled.rs`: compile against a dataset schema, legend) and once
in TypeScript (`renderer/bundle-viewer/src/style.ts`: read + resolve) — with both implementations
pinned to a shared agreement vector (`renderer/tests/data/style-agreement.json`) that neither
side generates, discharging `docs/08` line 63's determinism row.

The shell's working canvas now needs a style (hero verb 3). The only two defensible options are
(a) invent a shell-local style model, or (b) adopt §5a as the project's one style model. Option
(a) yields two models that can disagree while looking identical — the failure class
`renderer/tests/style_agreement.rs` already exists to prevent between two *implementations* of
one model, reintroduced one level up. Option (b) widens the role of an accepted document without
changing its shape.

## Decision

1. **Style v0 (ADR-017 §5a's document, unchanged) is the project's style model wherever a style
   exists** — not only in a bundle. `style_version` becomes an ecosystem surface with a second
   consumer (the shell's working canvas), and any future v2 must consider both.
2. **Document semantics stay in `renderer/`, in exactly two implementations** — one Rust, one
   TypeScript — pinned by the agreement vector. Every consumer reads one of the two; no consumer
   re-implements parse/resolve/legend semantics. The shell joins as a *third reader of the
   vector*, not a third implementation.
3. **No consumer canonicalizes or hashes outside `renderer/src/canonical.rs`.** The shell holds
   and displays the document; canonical bytes are produced at publish, exactly as today.
4. **Frontends supply rendering plumbing only** (`docs/02`): mapping resolved draw parameters
   onto deck.gl layer props is client work; deciding what a document *means* is not.

## Consequences

- One model, one refusal set, one meaning: a style that renders live in the shell cannot be
  refused at publish, and the published bundle's appearance is the working canvas's appearance —
  demonstrable end to end today via `publish-bundle --style` and the bundle viewer.
- The document shape is unchanged, so ADR-017's spent v1 schema-change exception is untouched.
- **A session-scoped style in the shell is ephemeral view state** (like the camera): ADR-006's
  table classes *style edits* as workspace mutations (class 2), but no workspace exists yet — no
  project file, no command log for shell state — so class-2 machinery is not owed **because
  nothing is persisted**. Two hard consequences, binding on any consumer: **(a)** no undo, and no
  UI that implies undo ("Reset to default" is a fresh edit, not undo); **(b)** the moment a style
  is persisted anywhere — project file, localStorage, session-recoverable state — ADR-006 class-2
  machinery *and* `docs/11`'s typed-artifact obligations (URI, lifecycle, provenance) become owed
  in the same commit. This ADR does not grant that and does not pre-decide it.
- Data-driven (`match`) styling remains publish-only until the live stream carries attribute
  values — ADR-023's question, not this ADR's.

## What this ADR does not decide

Style persistence and its class-2/docs/11 obligations · any change to the §5a document shape ·
attribute projection on `viewport_query` (ADR-023) · labels, ramps, classification, expression
languages (all named refusals in `renderer/src/style.rs::V0_EXCLUDED`) · a style DSL or editor
(`docs/07` places both in Beta) · per-layer/multi-layer styles · any perf claim.

## Amendment 1 — style persistence granted for the session history (2026-10-14, the human)
From piece `b2-piece-1b-recording`, a committed style edit is persisted as a `style.set` step in the session history ADR-036 defines (Proposed). This is the grant Consequences (b) left open, for that store only.
- ADR-006's class-2 machinery is the kernel's step record: each committed change of one style property is one step, so a Reset records one step per property it changes, recorded by the kernel's `record_step` command (ADR-036 §12), as one line flushed before the reply; a line that is not whole is never recovered (ADR-036 §9).
- docs/11's obligations: the record's and the step's identities (URI), ADR-036 §6 (schema), ADR-036 §9 (lifecycle), and the step's `actor` and `at` (provenance).
- Consequence (a) stands: nothing is undone, and no UI implies undo.
- Persisting a style in a project file or a lineage is not granted here.

## Amendment 2 — style persistence granted for the project file (2026-10-22, the human)
Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, and save and reopen for the lifecycle. Provenance does not yet travel with the project file. The lineage member stays a named state until a later piece writes it; the saved-here mark says only that the saved style is the one the session's recorded steps reach, and those steps are kept in the session history on this machine while it lasts. Consequence (a) stands, and the lineage is not granted by this amendment.
