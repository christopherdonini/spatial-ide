# Contributing to Spatial IDE

Thank you for wanting to work on this. This file covers the mechanics; `docs/README.md` is the
constitution index and is what governs the design.

## The short version

1. Read `docs/README.md` and `docs/01_Principles.md` before proposing anything non-trivial.
2. Sign off every commit: `git commit -s`. This is required and is checked (see below).
3. Cite constitution documents by number in commit messages and pull requests — "per 05, derived
   rule 2", not "per the data engine docs".

## Developer Certificate of Origin — required on every commit

This project uses the **Developer Certificate of Origin 1.1**, not a CLA. The full text is in
[`DCO`](DCO) at the root of this repository.

The DCO is an **affirmation that you have the right to submit your contribution**. It is not a
contract and it does not transfer anything: **you keep the copyright in what you write.**

Sign off by adding a `Signed-off-by` trailer, which `git commit -s` does for you:

```
Signed-off-by: Jane Doe <jane@example.com>
```

The name and email must be the ones you commit under. To fix commits you have already made:

```sh
git commit --amend -s                      # the most recent commit
git rebase --signoff <base>                # every commit since <base>
```

`.github/workflows/dco.yml` checks every commit in a pull request and reports which ones are missing
the trailer.

### Why DCO and not a CLA — and what that permanently rules out

`docs/14` required this to be decided **before the first external contribution**, because
retrofitting a CLA later is a community wound. ADR-009 decided it, and one consequence is worth
stating plainly rather than leaving in an ADR:

> **Contributed core code is `AGPL-3.0-or-later` permanently.** The project cannot later sell
> proprietary exceptions covering your contribution, and there is no CLA that would let it. This is
> deliberate (ADR-009 item 9): the commercial boundary is *separate services*, never a
> dual-licensed core.

## Licensing of what you contribute

ADR-009 sets four layers. `LICENSES/README.md` says which part of the tree is in which.

| What you are editing | License |
|---|---|
| `kernel/` `engine/` `renderer/` `protocol/` `frontends/` `spikes/` — and anything else not listed below | `AGPL-3.0-or-later` |
| `docs/` — the constitution, the ADRs, the SKP specification | `CC-BY-4.0` |
| Client SDKs, generated bindings, example integrations | `Apache-2.0` (no member in the tree yet) |

**Every new source file carries an SPDX header** as its first lines, matching its neighbours:

```rust
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
```

Keep the copyright line as it is on the file you are editing — under DCO you keep your copyright
whether or not your name appears in a header, and a per-file list of contributors is a maintenance
burden that git already carries better.

**Do not add a dependency without checking its license.** `scripts/audit-dependency-licenses.mjs`
reads what is already on disk (no network) and writes `DEPENDENCY-LICENSES.md`. A copyleft
dependency in the AGPL core is usually fine and a proprietary or unlicensed one never is — but the
script **flags, it does not judge.** A new flag is a conversation, not a blocker you can clear by
editing the script.

## Working agreement

- **`docs/01_Principles.md` is never edited.** Accepted ADRs in `docs/adr/` are immutable: append an
  amendment or a corrigendum, or propose a new ADR. Never rewrite one.
- **A change to the constitution needs an ADR.** Consult the architect agent first
  (`.claude/agents/`), and expect architect-blockable ADRs (003, 010, 015, 017) to be enforced in
  review.
- **No performance claim without a measurement** against `docs/08` — p50/p95, on a defined dataset,
  on a named tree. "Faster" is not a claim, it is a feeling. See `kernel/RESULTS.md` for the shape a
  real one takes.
- **Never claim "zero-copy"** (ADR-004). Copy-minimized is the honest word.
- **Say what a change does not establish.** This codebase states its limits in the same commit as
  its guarantees, and reviews ask for it.

## Commits

`<type>: <summary>` — **`feat`, `fix`, `chore`, `spike`, `docs`**, the five `CLAUDE.md` lists. (`ci`
and `test` appear in the history; treat them as `chore` unless `CLAUDE.md` gains them.)

Per `AI_DEVELOPMENT.md`, **agent-generated code is labeled in commits for later audit**. If you used
an AI agent, say so in the commit body.

## Before you open a pull request

```sh
cargo test --workspace                              # the Rust modules
npm --prefix renderer/bundle-viewer run verify      # typecheck, build, test
git log --format='%H %s' <base>..HEAD               # every commit signed off?
```

Two workflows watch the product modules (`.github/workflows/product-ci-*.yml`) and one watches
sign-off (`dco.yml`). **All three have now gone green and may be cited as gates.** The runner
constraint that kept them unexercised until 2026-08-07 was environmental and is gone; the evidence
is retained in `product-ci-rust.yml` rather than deleted, so a recurrence can be compared against it.

| workflow | first green run | trigger | what it established |
|---|---|---|---|
| `product-ci-rust.yml` | `31156155408` | `push` (`de6ad08`) | workspace builds and the ordinary suite passes on `windows-latest`, all nine steps |
| `product-ci-viewer.yml` | `31156155406` | `push` (`de6ad08`) | the viewer typechecks, builds and tests |
| `dco.yml` | `31199038936` | `pull_request` (#3) | **checked 11 non-merge commits, 0 failed** — the check examines a real range, not an empty one |

Two limits on what that green means. `product-ci-viewer.yml` **has never run on a `pull_request`** —
it is path-filtered to `renderer/**` and no pull request has yet touched those paths, so its
pull-request behaviour is still unexercised. And a green Rust run makes **no performance claim**: the
two `docs/08` budget harnesses are `#[ignore]`d and are not run there, deliberately — see that file's
own "What a green run here means".

The local commands above remain the check that establishes the most, because they run the full suite
on the reference profile without a shared runner's drift.

## Security

Please do not open a public issue for a security problem. `docs/09_Security_and_Privacy.md` states
the model; contact the maintainer directly.
