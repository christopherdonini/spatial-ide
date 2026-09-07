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

## Corrigendum — the repository was already public when this ADR was accepted (2026-09-07, appended)

**This is a correction of record, not a change of decision; nothing above is edited.** The Status
paragraph states, verbatim: *"The repository does not become public until the pre-public checklist
below lands — accepting this ADR ends the deliberation, not the gate."* In fact the repository has
been public on GitHub since **2026-08-03T18:06:23Z** — GitHub's own event stream records a single
`PublicEvent` at that instant, verified 2026-09-07 — four days before this ADR's acceptance and
before `PRE-PUBLIC-CHECKLIST.md` existed. The human flipped it themselves (their recollection when
reporting it was "~2026-08-16"; the API date stands) and the fact never entered the record. The
checklist therefore gated a flip that had already happened; its items remain what they were — done
or deferred as recorded there — and DECISIONS-PENDING entries 12–15 (the go/no-go and its three
residual judgments) are resolved as overtaken by events. The decision this ADR records — the
license, the DCO, the open-core boundary — stands unchanged; only the "not until" ordering did not
hold in fact. A bounded audit of the 2026-08-03→now window for content that assumed a private
audience is recorded in `PUBLIC-AUDIENCE-AUDIT.md`; its findings are queued for the human, none
remediated without their word.

### Addendum to the corrigendum — the repository was public with NO license for ~3.6 days (2026-09-07, appended the same day; a fact of record the human directed be stated rather than left discoverable)

Verified from git history and GitHub's API on 2026-09-07. The commit at the `PublicEvent` instant
(2026-08-03T18:06:23Z) is `73e9935` ("spike: conclude ADR-003 — outcome, CI, doc updates",
2026-08-03T12:31Z); its tree contains no `LICENSE`, no `LICENSES/`, no `DCO`, and no license field in
`Cargo.toml` or `frontends/shell/package.json`. The first `LICENSE` (AGPL-3.0-or-later) landed in
`65dde47` at 2026-08-07T08:18Z — **77 commits and ~86 hours after the flip**, and after this ADR's
own acceptance commit (`de6ad08`, 2026-08-06T23:45Z), which therefore also fell inside the window.
During those 77 commits the repository was public under the default of the owner's all rights
reserved. **Consequence: none.** All 77 commits were authored by the owner's own two identities (72
by `Christopher Donini <donini.christopher@gmail.com>`, 5 by `chris <chrys92d@gmail.com>` — the two
identities DECISIONS-PENDING entries 14 and 41 record as the same person), no external contribution
existed, and GitHub records zero forks, zero stars and zero watchers for the repository from the flip
to the date of this addendum — so no third party received, used or contributed code under the
unlicensed state. The license that applies to every commit today is the one this ADR chose; this
addendum records only that, for four days, the repository's public state preceded it.
