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
