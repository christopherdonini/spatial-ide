# ADR-009 — License and Open-Core Boundary

**Status:** Accepted — 2026-08-07. The human's decision, taken deliberately with outside review;
docs/14 held the decision space open for this since 2026-07-31. **The repository does not become
public until the pre-public checklist below lands** — accepting this ADR ends the deliberation, not
the gate.
**Related:** docs/14 (governance — the decision space this resolves), ADR-008 (the reserved
commercial service that makes the choice consequential), ADR-017 (bundle format — gains a
license-notice obligation below), ADR-004/012 (the out-of-process SKP boundary the plugin promise
rests on).
**Caveat, recorded:** this is an engineering-governance decision. Counsel reviews it before the
first outside contribution is accepted and before anything commercial launches.

## Decision

1. **Core code — `AGPL-3.0-or-later`.** Kernel, engine, renderer, protocol implementation, editing
   plugin, static publishing: the forever-open set docs/14 named. AGPL §13 extends copyleft to
   network operation: an operator of a modified network-facing version must offer its corresponding
   source to remote users. It does not prohibit commercial hosting or charging money.
2. **Contributions — DCO 1.1**, enforced as a `Signed-off-by` check on every external commit. An
   affirmation of the right to submit, not a contract; contributors retain copyright.
3. **SKP specification and documentation — CC-BY-4.0.**
4. **Client SDKs, generated bindings, example integrations — Apache-2.0.** This is what makes the
   proprietary-plugin promise real in practice: plugin authors link the SDK, not the core, and the
   SDK's license is what touches their code. An AGPL SDK would reintroduce exactly the uncertainty
   the process boundary exists to remove.
5. **Proprietary plugins are permitted across the documented out-of-process SKP boundary only.**
   Separate programs communicating at arm's length over a wire protocol; no in-process linking
   against AGPL code. (Per GNU's own plugin guidance, the risk lives in linking and intimate shared
   structures — genuinely separate processes are the clean case, and ADR-004/012 made them the only
   case.)
6. **Commercial products are separate, separately implemented services** — managed sharing,
   authentication, tenancy, organisation administration, enterprise collaboration. No assumption
   that placing proprietary code *beside* AGPL code avoids AGPL obligations; separateness is a
   property of the works, not of the directory layout.
7. **Published bundles distribute the AGPL viewer**, so every bundle carries the viewer's
   copyright and license notice and a durable route to its corresponding source. This is an
   ADR-017 obligation from acceptance of this ADR (corrigendum owed there; bundle v1 has no
   external users yet, the same justification its Corrigendum 1 used).
8. **Trademark is a separate policy**, not granted by the code license. The project name is
   checked for collisions before the repository goes public.
9. **No future proprietary relicensing of community contributions.** Under DCO, contributed core
   code is AGPL-3.0-or-later permanently; the project cannot later sell proprietary exceptions
   covering it. **This is chosen consciously**: the commercial boundary is separate services, not a
   dual-licensed core. If that ever changes, it requires a CLA adopted *before* the contributions
   it would cover — which is why this sentence exists now.

## What AGPL does not provide, stated so nobody relies on it

Anyone may sell unmodified Spatial IDE. Anyone may host it commercially while complying with the
source obligations. Anyone may build separate proprietary services around it if those remain
separate works. The defensible commercial advantages are trademark, product quality, hosting
operations, and brand — the license protects the commons, not the business.

## Why this package

- **AGPL because of ADR-008.** The reserved managed service is the exact scenario plain GPL leaves
  open (running modified code as a service is not distribution) and the one that forced Elastic,
  Redis and MongoDB into source-available relicensing years in. Choosing network copyleft on day
  one, in the open, is the honest version — and unlike BSL/FSL it remains open source, so the
  ecosystem-trust cost docs/14 worried about does not apply.
- **DCO because the open-core boundary never planned a closed core.** Commercial value lives in
  separate modules the project authors outright. DCO's irreversible lock enforces, by mechanism,
  the promise docs/14 already made — the most credible signal a small project can send.
- **Permissive edges because the constitution promises them.** The protocol spec and formats are
  open permanently (docs/14, unconditional); the SDK layer is where that promise meets a plugin
  author's build system.

## Pre-public checklist — gates the repository becoming public

1. `LICENSE` (AGPL-3.0-or-later) at root; per-crate/per-package license declarations and SPDX
   headers; Apache-2.0 and CC-BY-4.0 texts where those layers live.
2. DCO 1.1 text, `CONTRIBUTING.md` sign-off requirement, and a CI check enforcing `Signed-off-by`
   on external commits.
3. The ADR-017 corrigendum for bundle license notice + corresponding-source route, implemented in
   the writer and strict reader together.
4. **Dependency-license audit** of the full tree (cargo + npm), recorded in the repo. Nothing in
   the current stack is expected to conflict (permissive throughout), but expected is not audited.
5. Project-name collision check; trademark policy stub in docs/14.
6. History review before flipping public: the repository's full history goes with it — confirm no
   credentials, no personal data, no third-party material without rights (measurement artifacts,
   fixtures) anywhere in history.

## What this ADR does not decide

The trademark policy's content; the commercial services' own licenses (they are separate works);
whether specific enterprise integrations warrant additional permissive carve-outs (decided
case-by-case against item 4's layer, never by relicensing core).
