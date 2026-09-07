# RELEASE-0.1 — the release-engineering cut (v0.1.0): brief and preregistration record

*Tracked. Dated, append-only past its architect consult: later changes are appended as amendments,
never edited in. The custodian loop applies (AI_DEVELOPMENT.md): preregistration before code,
reviewer/architect gates to affirmative PASS, PRs the human clicks, red lines queued in
`DECISIONS-PENDING.md`. Ledger: `CUT-STATE.md` (untracked; archives at close).*

## 0. The dispatch (the human, 2026-09-07, verbatim)

> "Dispatch release engineering as the next cut, architect consult first per workflow. Named items,
> from NEXT-CUT and the queue: (1) the ADR-020 owed defect — tauri build --debug origin mismatch,
> fail-closed, must be fixed before any packaged build is claimed; (2) the packaged-app notice
> channel from entry 51 — the compiled EPSG definition needs a notice surface in a packaged build;
> (3) the first packaged build, installed on a clean profile, with its own walkthrough part — the app
> has only ever run under tauri dev; (4) tag v0.1.0 with a KNOWN-LIMITATIONS declaration in the
> house voice: Windows-only (macOS/Linux gates open by name), viewer ceilings, the declared partial
> view at overview zoom until LOD, scan progress as named debt (ADR-029), WS transport
> experimental-default (ADR-012 undecided), no editing/notebooks/MCP (Alpha per docs/07), and the
> ADR-011 debts (47, pan-west, zoom-to-layer window) by name; (5) an outsider-facing README — the
> current one is the constitution index, accurate and entirely inward — plus repo description/topics;
> (6) a first-five-minutes quickstart for a stranger with a GeoParquet. No perf claims anywhere in
> release text — "no numbers, no claim" applies to release notes too."

## 1. What "release" means here, and what it does not

v0.1.0 is the **Prototype hero slice** (docs/07: open a GeoParquet → filter in SQL → style it →
publish a static interactive bundle) shipped as **the first packaged Windows build**, with every
limit declared by name. It is not a claim of readiness beyond that sentence. The constitution's
rule that binds every word of release text: **docs/01 — perf claims require measurements against
docs/08; no numbers, no claim** — so release notes, README, quickstart and KNOWN-LIMITATIONS carry
no timings, no throughput, no "fast", no "handles N GB" (the 5 GB fixture may be *named* as the
slice's target dataset class only where the record already does so, never as a performance
statement). "House voice", as this brief reads it from the record: declared, never inferred; limits
stated by name with their home ADR; no marketing register; a stranger can verify every sentence
against a file in the tree. **The architect consult is asked to confirm or correct this reading
against docs/00–01 (question Q6 below).**

## 2. The six items, scoped from the record

### Item 1 — the ADR-020 owed defect (blocks every packaged claim)

**The defect, in ADR-020's own words** (Status paragraph, Accepted 2026-08-13): the `tauri build
--debug` origin mismatch is *"a **fail-closed implementation defect, owed before any packaged-debug
support is claimed**"*. Mechanism (ADR-020 Decision, verbatim): *"`frontends/shell/src-tauri/src/lib.rs`
supplies `http://localhost:5180` under `cfg!(debug_assertions)` (matching `tauri dev`) and
`http://tauri.localhost` otherwise (a packaged build) — a compile-time distinction, not a runtime
guess. That distinction is **not** "is this `tauri dev`": `tauri build --debug` produces a
*packaged* build with `debug_assertions` on — webview at `http://tauri.localhost`, data plane
expecting `http://localhost:5180`, every upgrade 403'd."* The selector is `lib.rs:71`
(`if cfg!(debug_assertions) { "http://localhost:5180" … }`). ADR-020 also names, without adopting,
the alternative: *"derive the expected origin from the webview's *actual* URL at startup (Tauri 2
exposes the window's `url()`; verify the exact API before adopting) — still host-supplied, never
page script, no wildcard, no drift, no `--debug` mismatch."* And it records that `5180` *"now lives
in three places with no mechanical link (`vite.config.ts`, `tauri.conf.json`'s `devUrl`,
`lib.rs`)."*

**Scope of the piece (proposed; architect-blockable — this is origin admission, docs/09 and
ADR-012 H4 territory):** replace the compile-time selector with a host-derived expected origin
that is correct for `tauri dev`, `tauri build`, and `tauri build --debug` alike, keeping ADR-020's
accepted mechanism intact (host-declared **exact-match** origin; never page script; no wildcard).
Candidate designs for the architect to rank: (a) ADR-020's own named alternative — read the
webview window's actual URL at startup (verify the Tauri 2 API by name and version in the piece,
not from memory); (b) a single declared source of truth for the dev origin (read `devUrl` from the
Tauri config at build time via `tauri-build`/env, with `debug_assertions` no longer the selector);
(c) keep the selector but make `tauri build --debug` refuse to start with a named error (fail-closed
*and* self-describing) — the minimum that makes the defect honest rather than fixed. **Tests,
pre-committed:** a unit test per build mode's expected origin; an E2E/packaged check that the data
plane admits the webview in a real `tauri build --debug` artifact (item 3 supplies the artifact).
**Record:** ADR-020 gets a dated corrigendum/amendment stating the defect's resolution — **appended
only on the human's word** (red line). The ADR-020 E2E harness dev gate (`import.meta.env.DEV`)
stays independent and is named in the corrigendum, as the ADR already notes they disagree exactly
under `--debug`.

### Item 2 — the packaged-app EPSG/IOGP notice channel (entry 51; `DEPENDENCY-LICENSES.md`, "third channel is OWED")

A packaged shell app ships the `spatial-engine` binary with `engine/src/crs-catalog.json` compiled
in (`include_str!`), so the EPSG:2056 definition travels with every install, and the app has no
notice surface today. The terms quoted in `DEPENDENCY-LICENSES.md` require IOGP's ownership to be
acknowledged *"in any publication or transmission (by whatever means)"* and recipients to be
informed of the Terms of Use. **Scope:** a notice surface in the packaged app carrying the same
section `renderer/bundle-viewer/notice.mjs` emits for bundles — ideally generated from that ONE
source so the two cannot drift (a build step writes a `NOTICE.txt` into the packaged app's
resources and an About/Notices view in the shell shows it), plus the AGPL notice the packaged app
owes anyway (ADR-009 item 7: the distributed code's notice and corresponding-source route — the same
`Url` route F-3 just shipped for bundles). **Test, pre-committed:** the notice text in the packaged
artifact contains the IOGP acknowledgement, the terms URL, and the corresponding-source URL
(asserted against the built artifact in item 3's check). Architect question Q2: is a shell About
surface a docs/03 concern with an existing design, or new UI that needs its own naming?

### Item 3 — the first packaged build, on a clean profile, with its own walkthrough part

The app has only ever run under `tauri dev`; CI's shell workflow states *"`tauri build` was run"*
is **not** among what green means — bundling/installer/signing is unexercised
(`.github/workflows/product-ci-shell.yml:27`). `tauri.conf.json`: `productName "Spatial IDE"`,
`version "0.1.0"`, `identifier dev.spatialide.shell`, `beforeBuildCommand npm run build`,
`frontendDist ../dist`, `bundle.active true`, `targets "all"`. **Known gap the packaged build must
close:** `publish.rs:786-794` records that the bundle viewer is located dev-tree-relative
(`CARGO_MANIFEST_DIR` + `../../..`) and *"does not hold for a packaged build: nothing here wires the
viewer into `tauri.conf.json`'s `bundle.resources`"* — so a packaged v0.1 cannot publish until the
viewer's `dist/` is shipped as a resource and resolved via Tauri's resource path. **Scope:** (a)
`bundle.resources` for the viewer dist + a resource-relative lookup with the dev-tree lookup kept
for `tauri dev`; (b) `tauri build` producing a Windows installer (which target: the architect/human
choose — NSIS vs MSI; both are Tauri defaults; signing is OUT of v0.1 and declared so); (c) a CI
job that runs `tauri build` on the Windows runner and uploads the artifact (build only — no
signing, no release publishing from CI); (d) **Part M of `frontends/shell/MANUAL-WALKTHROUGH.md`**
(new): install on a **clean Windows user profile** (a fresh local account on the reference machine,
or a clean VM — the human's choice), first launch, the notice surface (item 2), open a GeoParquet,
filter, style, publish a bundle, open the bundle in a browser — every expected outcome quoted from
the shipped strings; run by the human, batched (rule 11). No perf steps. Architect question Q3:
does packaging touch docs/09's local-listening-sockets posture (the kernel's loopback data plane
and the token) in a way that needs a corrigendum, or does ADR-020's existing packaged-origin text
already cover it?

### Item 4 — tag v0.1.0 with a KNOWN-LIMITATIONS declaration

A `KNOWN-LIMITATIONS.md` at the repo root (linked from the README and the release notes), each
entry naming its home decision, in the dispatch's order:
1. **Windows-only.** Validated on the reference profile (CLAUDE.md: Windows 10 Pro 22H2 / MSVC /
   WebView2). macOS and Linux gates are **open by name**: docs/07's follow-up "macOS/Linux
   hardware validation" of the ADR-003 renderer/CRS gate; `MACOS-BRINGUP.md`'s paused bring-up;
   ADR-012's scope line (*"Nothing here says anything about macOS/WKWebView or Linux/WebKitGTK"*).
2. **Viewer ceilings** — the published bundle viewer refuses above its declared ceilings
   (`renderer/bundle-viewer/src/render.ts:50-55`: `MAX_FEATURES = 2_000_000`, `MAX_PARTITIONS =
   100_000`, `MAX_RESIDENT_BYTES = 512 MiB`, `MAX_ATTRIBUTE_COLUMNS = 32`, `MAX_ATTRIBUTE_DISPLAY_CHARS
   = 512` — quoted from the constants, they are declared limits, not measurements), and the shell
   can publish a bundle the viewer will refuse — **ADR-025, decision deliberately open** (Part H8b).
3. **The declared partial view at overview zoom** — under the viewport-residency candidate arm,
   zooming out past the render budget shows "the first look plus whatever tiles fit", says so
   (the over-budget sentence and its suffix), and pauses filling until the next pan or zoom;
   ADR-028 Amendment 3 and the human's flip-first ruling name this the v0.1 limitation until the
   LOD cut (ADR-011 line).
4. **Scan progress is named debt** — ADR-029 (Proposed, *"decision deliberately undrafted"*): the
   true scan-progress carrier quantity is not on the wire; liveness is shown, progress is not.
5. **WS transport is the experimental default** — ADR-012 Proposed, *"awaiting human approval. Not
   accepted"*, withheld twice; the data-plane transport decision is open.
6. **No editing, notebooks, MCP** — docs/07 Alpha items (notebooks record/replay; MCP server with
   the permission model; data doctor; problems panel; first external plugin; the action console's
   Alpha half) and ADR-002's phased editing scope (*basic digitizing in 1.0 as a plugin*).
7. **The ADR-011 debts, by name:** entry 47 (the hover readout clears on any camera change; re-pick
   on camera settle is the next cut's named piece, criterion in the human's words); **pan-west's
   large-batch re-admission spike** and **zoom-to-layer's sustained new-tile admission window**
   (ADR-028's gate-8 written answer, recorded as binding debt on the ADR-011 tiling/LOD line —
   the ADR-021-condition pattern). *Proposed addition for the human's sight, not in the dispatch:*
   entry 42 (under the candidate arm "Zoom to layer" fits what has rendered, not the layer's
   extent) sits on the same line and is operator-visible in the first five minutes; omitting it
   would make the declaration read as complete when it is not.
Then **`v0.1.0` is tagged** — a release act: **the human tags, or explicitly authorizes the tag**
(red line: outward-facing, hard to reverse). Release notes = the KNOWN-LIMITATIONS text plus the
hero-slice sentence and the install pointer; nothing else. No numbers.

### Item 5 — an outsider-facing root README, plus repo description/topics

**Fact:** the repository has **no root `README.md`**; `docs/README.md` is the constitution index
(inward, accurate). Item 5 creates the root README from nothing: what Spatial IDE is (docs/00's
one-paragraph statement, in its words), what v0.1.0 does (the hero slice), what it deliberately is
not (KNOWN-LIMITATIONS link), how to install (item 3's artifact), the quickstart link (item 6),
the license layers (`LICENSES/README.md`), how to contribute (CONTRIBUTING.md, DCO), where the
constitution lives (`docs/README.md`). Repo description and topics: drafted in the PR body for the
human's sight; applied to GitHub settings only after that sight (an outward-facing change).

### Item 6 — a first-five-minutes quickstart for a stranger with a GeoParquet

`QUICKSTART.md` (root, linked from the README): install from the v0.1.0 artifact → launch → open
your GeoParquet → what the app requires of the file and what it says when it refuses (Part B: no
CRS; Part C: missing identity — quoted from the shipped refusal strings) → filter in SQL → style →
publish → open the bundle. Written for someone who has never seen the constitution; every sentence
verifiable against a shipped string or a file. No fixture generation, no dev toolchain, no numbers.

## 3. Sequencing (proposed)

Item 1 first (nothing packaged may be claimed before it). Items 2 + 3 together as the "packaged
build" piece (the notice channel and the viewer resources are both "what a packaged build must be
true about"), with Part M drafted alongside and run by the human on the artifact. Items 5 + 6
drafted in parallel once the install path is known (they cite it). Item 4 last: the declaration is
written against what actually shipped, then the human tags. Each piece: preregistered here (dated
amendment), worker, reviewer gate (architect where blockable), PR.

## 4. Questions for the architect consult (first step, per workflow)

- **Q1.** Item 1's design: rank (a)/(b)/(c); name what each does to ADR-020's accepted exact-match
  mechanism and to docs/09 / ADR-012 H4; name the corrigendum/amendment shape for the human.
- **Q2.** Item 2's notice surface: existing docs/03 design or new UI; the one-source constraint.
- **Q3.** Item 3: packaging's effect on docs/09 (loopback data plane, token) and ADR-020's
  packaged-origin text; the installer target; whether a CI `tauri build` job is in scope.
- **Q4.** Item 4: is the KNOWN-LIMITATIONS list complete against the constitution's open gates and
  the Proposed/undecided ADRs (ADR-011 gates 1–7 unmeasured; ADR-023; ADR-025; ADR-029; ADR-012;
  ADR-026's own limits)? Which of these must be named for the declaration to be honest, beyond the
  dispatch's list? Is the entry-42 addition warranted?
- **Q5.** Items 5/6: anything in docs/00–14 that binds the outsider-facing text (the `docs/14`
  trademark stub, ADR-009's license layers, docs/09's posture statements)?
- **Q6.** The "house voice" reading in §1: confirm or correct against docs/00–01.
- **Q7.** Anything this brief scopes that the constitution says a Prototype release may not claim.

## 5. Out of scope, declared

Code signing and notarization; auto-update; macOS/Linux artifacts; any performance statement; any
change to the residency/LOD behaviour (LOD is the cut after this one, flip-first); ADR status changes
other than the ADR-020 record of the fix (the human's word); the entry-40 producer question (closed
as a null result 2026-09-07).
