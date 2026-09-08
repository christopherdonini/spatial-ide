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

---

## Amendment 1 — the architect consult's verdict: **FAIL — block** (2026-09-07, appended; §§0–5 above are retained unedited as the reviewed draft)

**Three blocking findings, each verified by the custodian on the cited lines before recording:**

- **B1 — KNOWN-LIMITATIONS entry 3 (and the proposed entry-42 addition) describe an arm the packaged
  build does not ship.** `frontends/shell/src/residency/residencyArm.ts:26`: `DEFAULT_RESIDENCY_ARM =
  "baseline"`; its doc (`:18-21`): *"The candidate default flips only if the human accepts ADR-028 --
  never in this module, never in this piece."* The only site that moves a session off baseline is
  DEV-gated (`App.tsx:945-949`: *"`residency/residencyArm.ts` never runs, or is even referenced, in a
  production build"*). ADR-028 IS Accepted (2026-09-02); the flip was never built. A plain `tauri
  build` therefore ships the **baseline** arm: past `MAX_RESIDENT_VERTICES = 2_000_000` the stream is
  cancelled with a typed refusal (`limits.ts:25-28`) — ADR-011 gate 8's interim, under which *"docs/07's
  5 GB hero dataset never fits client-side at all"* (ADR-011:63). Entry 3 as drafted is false for
  the artifact; §5's "no change to residency behaviour" forbids the only change that would make it
  true. **The human decides** (DECISIONS-PENDING entry 52): flip the default (a scoped piece + Part M
  on the flipped build), ship baseline and rewrite entries 3/42 to the ceiling-refusal contract, or
  defer v0.1 until the flip has its own cut. Items 3, 4 and 6 are blocked on that ruling.
- **B2 — publish shipped to strangers while ADR-017's acceptance condition stands undischarged.**
  ADR-017:4-7 (Status): *"before publish is exposed through SKP, any shipped CLI/UI, MCP, plugin,
  notebook or AI surface — and no later than Prototype exit — the kernel must enforce a scoped
  publish grant, explicit approval, and a redacted audit record … Until then `publish-bundle` remains
  developer/test tooling only."* The human's F-10 ruling in the same file: the condition *"does not
  lapse"*; exposure through a shipped UI *"additionally requires that the exposure surface itself pass
  review"*; ADR-024 and docs/02:89 say filing ADR-024 does not discharge it. A distributed installer
  whose walkthrough, quickstart and release notes say "publish" IS a shipped UI. **Either the human's
  exposure review runs inside this cut, or publish is removed from Part M, QUICKSTART, README and the
  release notes for v0.1** (entry 53).
- **B3 — §2 drops two items the human's own 2026-09-07 ruling placed in this track.**
  DECISIONS-PENDING (LOD scheduling ruling, verbatim): *"the flip track (ADR-025 reading, the exposure
  review, the 12–15 go/no-go) becomes the live queue."* The 12–15 go/no-go is overtaken (public since
  2026-08-03). The ADR-025 reading and the exposure review are not — surfaced as a proposed
  descoping for the human's word, not absorbed (entry 53).

**Corrections to §§1–2, each against the file cited (the custodian's slips, named):**
1. §1 attributes *"perf claims require measurements against docs/08; no numbers, no claim"* to
   docs/01. docs/01 contains neither sentence; the rule's homes are `CLAUDE.md`'s non-negotiables
   digest and `docs/08_Testing.md:62` (*"no numbers, no claim"*); docs/01 supplies principle 3
   (*"Nothing claims a grade it cannot honor"*) and derived rule 1 (budgets enforced in CI, 08).
2. §2 item 2 cites ADR-009 item 7 for the packaged app's AGPL notice; item 7 is bundle-scoped
   (*"Published bundles distribute the AGPL viewer"*). An installer distributes the core — ADR-009
   item 1's set — and the obligation is AGPL §4/§5's. The `Url` corresponding-source route (entry 49
   F-3) is the vehicle.
3. §2 item 1 calls the ADR-020 piece "architect-blockable". It is not (ADR-020 is not in the
   architect-blockable set named by docs/README:27 / docs/02:83). It IS gated: ADR-020:21-24 records
   the 2026-08-12 review as *"human-directed (security-posture red line)"* — the human's word is
   needed for the piece (entry 54), not the architect's block.
4. §2 item 3(b) says "NSIS vs MSI; both are Tauri defaults" as a choice; `tauri.conf.json:27` is
   `"targets": "all"` — as configured BOTH are produced; pinning one is a config change to scope and
   the human's word (recommendation NSIS: per-user, no elevation, so the clean-profile test needs no
   admin).
5. §2 item 4 entry 3 cites "ADR-028 Amendment 3" — its heading still reads "Proposed until the
   human's word" with clause 5 recording the ruling that appended it; cite clause 5 with it.
6. §1's "house voice": **the constitution states no writing register** (docs/00 and docs/01 read in
   full by the architect; a grep of docs/ for voice/register/tone/marketing returns nothing
   normative). What binds: principle 3, principle 8 (*"No black boxes"*), the derived rule *"Users are
   never told something is undoable when it isn't"*, docs/08:62. "Declared, never inferred" and
   "limits named with their home ADR" are corpus practice (ADR-010 rule 6; ADR-028's contract), not
   constitutional text; "no marketing register" has no source and is a house preference, labelled so;
   "a stranger can verify every sentence against a file in the tree" is adopted as **this release's
   own declared standard**.
7. "flip-first" in §1/§2 conflates two flips: the ruling's "flip track" is the public-release track
   (ADR-025 reading, exposure review, 12–15), NOT the residency arm. Disambiguated here; B1 is the
   arm question.
8. Sequencing (§3): item 4 last is right, but the ARM decision precedes item 3 (Part M runs on an
   artifact whose arm must be decided), not item 4.

**Q1 — ADR-020 fix, ranked: (a) primary with (b) folded in; (c) fallback only.** (a) read the
webview window's actual URL once inside `setup()` before any page script can run, normalise to
scheme+host+port, pin for the process, refuse to start if absent/unparseable (fail closed); keeps
host-supplied, exact-match, no wildcard; `Origin: null` still rejected; the `sec-fetch-site`
fallback unchanged; docs/09 and ADR-012 H4 untouched (removing the `5180` drift strengthens
exact-match). Verified available in the pinned crate: `tauri 2.11.5`, `Webview::url()` at
`src/webview/mod.rs:1679-1680` (*"Returns the current url of the webview."* /
`pub fn url(&self) -> crate::Result<Url>`). (b) alone does not fix the defect (the selector is still
"which mode am I"); adopt it WITH (a) as the dev-origin single source. (c) discharges the sentence by
ceasing to claim `--debug` support; it would strike this brief's own packaged-`--debug` admission
test. **Tests that carry the claim** (must survive): the port-derived default is not admitted;
admitted origin + wrong token is refused (`kernel/tests/skp_admission.rs`, ADR-020:118-122); plus the
new packaged-`--debug` E2E admission check (item 3's artifact). **Record: an appended, dated ADR-020
Amendment 1, not a corrigendum** (the ADR's text is not wrong; acceptance excluded the selector) —
contents: the Status sentence discharged quoted verbatim; the new selector with API + version; the
one-sentence *"the accepted mechanism is unchanged; this replaces a selector the acceptance never
covered"*; the E2E `import.meta.env.DEV` gate's status under `--debug`; a reopen condition; and
same-commit updates to `docs/02:83` and `docs/README.md:27`, which still say the defect is owed.
Appended only on the human's word (entry 54).

**Q2 — the notice surface: new UI; no docs/03 design exists** (docs/03 read in full by the
architect). Binding: ADR-027 decision 4 taxes any new Tauri command (unclassified → build fails) —
cheapest constitutional route: ship `NOTICE.txt` as a bundled resource, render it from the frontend
with NO new command; one-source must be a TEST (packaged `NOTICE.txt` generated from
`renderer/bundle-viewer/notice.mjs`'s `notice()` at build time and asserted byte-identical in the
artifact), not a convention; add `renderer/bundle-viewer/notice.mjs` to the shell workflow's path
filters (`product-ci-shell.yml:66-84`, the same gap its lines 50-56 record for `renderer/style-ts/**`);
ADR-009's Caveat (counsel) is not triggered by a release — say so.

**Q3 — packaging vs docs/09:** no corrigendum owed (docs/09 is *Evolves*; its Local-listening-sockets
section already names `http://tauri.localhost` packaged); packaging changes no mechanism. What
packaging newly makes real: `"csp": null` (`tauri.conf.json:21-23`) ships to end users — ADR-020:111-113's
*"with no CSP, any script that reaches the shell's page inherits the admitted origin"* changes
audience, not mechanism → one sentence owed in docs/09 + a KNOWN-LIMITATIONS line; it also makes
ADR-024's DOM-approval limitation live for end users. Installer target: pin one (NSIS recommended).
CI `tauri build` job: in scope, build-only, and it inherits `product-ci-shell.yml:58-62`'s rule —
until a run has gone green end to end and its run id/commit/trigger/duration are recorded, nothing
may cite it as a gate; no release text cites CI as evidence.

**Q4 — KNOWN-LIMITATIONS is NOT complete; eight additions required** (operator-visibility order):
(1) the residency arm actually shipped (B1); (2) **ADR-023 — mandatory**: *"the working canvas
styles by literal only; the hover panel shows `id` only; and the hero slice's 'colour by attribute'
moment lives in the published bundle rather than in the shell. Each of those is a named limit, never
presented as a product choice"* (ADR-023:35-37) — the quickstart's "style" must say style-by-literal;
(3) ADR-026/ADR-015 — the CRS surface: `engine/src/crs-catalog.json` holds ONE entry (EPSG:2056);
pinned, never fetched, no matching, no defaults — for a stranger with any other CRS this is the
largest first-five-minutes limit; (4) ADR-016 — what identity does not establish (dataset-wide
uniqueness, stability across reopen; composite/non-integer keys open); (5) ADR-017's condition /
publish as class-3 approval-gated (B2); (6) ADR-027 — principle 4 *"partially discharged … made
legible but not satisfied for style and publish"* — no "everything is scriptable"; (7) the local
listening socket + `csp: null`; (8) ADR-011 gates 1–7 open, gate 8 alone met, and the citation rule
(*"Nobody may cite this ADR … as a settled design"*) — the debts ride the ADR-011 line without a tiling
plan existing. Lower priority, one line each: ADR-019 Proposed / ADR-014 reserved; docs/08:20-21
(budgets "owed, not operating") if any text mentions budgets or CI. Check, don't assume: entry 43's
status against shipped code. **Entry-42 addition: warranted in principle, wrong as drafted** — it is
arm-conditional (inherits B1) and must cite DECISIONS-PENDING entry 42 as open and unruled, never an
ADR.

**Q5 — what binds the outsider-facing text:** docs/14:19 trademark stub ("Spatial IDE" is a working
title, *"weak as a defensible mark"*: no ™/®, one-line trademark note; ADR-009 item 8); docs/14:14-16
(SKP spec and formats open permanently; proprietary plugins permitted) — safe; ADR-009:22-26 layer
table for the licence section, ADR-009:48-53 ("what AGPL does not provide") not softened; NEVER
repeat the "not public until the checklist lands" framing — and **docs/02:81 was stale** (*"ADR-009 is
open … before any public code"*), corrected dated in this cut; docs/09:3-5 Posture ("Local-first. No
network access without an explicit grant.") is fully backed — state it; docs/14:27 attribution rides
only if sample data ships — keep "the stranger brings their own file"; **hard prohibition: quote
docs/00:9-11 ("What we are building"), never docs/00:35 (the North Star names 10 GB, natural
language, notebooks, six-months reproduction — none of which v0.1 delivers).**

**Q7 — twelve prohibitions on release text:** no performance statement (docs/08:62; docs/08:20-21;
ADR-012:232 *"No throughput-based claim may cite this ADR"*); "5 GB" nameable only as the slice's
target dataset class, never as a capability, and never without the ceiling beside it (ADR-011:63);
no macOS/Linux support claim; never "zero-copy" (ADR-004); no principle-4 "everything is scriptable"
(ADR-027:61-63); no "reproducible" without a declared grade (principle 3, ADR-005); no "undo"/
"undoable" (derived rule; ADR-022 style is ephemeral; publish is class-3); no AI/MCP/notebook language
(docs/07 Alpha); no presentation of ADR-011/012/023/024/025/029 as settled; no "publish" as a user
feature until B2 clears; no CI-as-evidence (`product-ci-shell.yml:58-62`); no spatial-indexing or
import-layout claim (docs/07:22 — the preregistered import-layout gate FAILED).

**Stale statements found on the way (fix-forward, dated, this cut):** `docs/02:81` (ADR-009 "is
open"); `docs/09:43` (ADR-021 "Proposed" — Accepted 2026-08-13); `frontends/shell/src/canvas/limits.ts:28`
(ADR-028 "Proposed, not accepted" — Accepted 2026-09-02); `docs/02:83` + `docs/README.md:27`
(ADR-020's defect "owed" — updated by the Amendment 1 commit, not before).

**Consequences for sequencing.** Item 1 (ADR-020) may proceed on the human's word under the
security-posture red line (entry 54) — it is independent of B1/B2. Items 3/4/6 wait on entry 52 (the
arm); publish's presence in any v0.1 text waits on entry 53. Items 2 and 5 can be drafted, with
publish and the arm left as bracketed slots until ruled.

---

## Amendment 2 — the human's rulings on entries 52/53/54 and B3; the ruled item list; preregistration of items 1 and 7 (2026-09-07, appended BEFORE any code)

**The human, verbatim:** *"52 = (a): flip the default to candidate; arm switch stays dev-gated for the
harness; the piece audits and re-aims/arm-pins every test encoding the refusal contract (Part D
banner, OVERCEIL′); Part M on the flipped build. 53 = run the ADR-017 exposure review inside this cut,
bundled with Part M on the packaged artifact; pre-declared fallback: if F-10 fails, publish descopes
by name and the hero slice ends at style. B3: include ADR-025 and the review by name; ADR-025 reading
= refuse-at-preflight, typed, naming the viewport-bbox alternative, reopen when a second reader
exists. Installer = NSIS only, per-user, no elevation. 54 = authorized with five conditions [as
above]; ADR-020 Amendment 1 pre-approved in that shape. Recommended addition, rule at brief sight:
extend the CRS catalog with EPSG:4326 and 3857 under the entry-51 verification protocol. The
consult's eight KNOWN-LIMITATIONS additions and twelve prohibitions adopted as written."*

**"[as above]" read as the consult's five conditions on design (a)** (Amendment 1, Q1): (1) read the
webview URL once inside `setup()` before any page script can run; (2) normalise to scheme+host+port;
(3) pin the value for the process; (4) refuse to start on an empty/unparseable origin — fail closed;
(5) name the Tauri 2 API and crate version verified, in the piece, not from memory. Correctable at
the human's word.

### The ruled item list (supersedes §2's numbering where it differs)

- **Item 7 (NEW, runs first with item 1) — flip the default residency arm to candidate.** Ruling
  52 (a). Preregistration below.
- **Item 1 — ADR-020 fix**, design (a)+(b), five conditions, ADR-020 Amendment 1 pre-approved in the
  Amendment-1 (Q1) shape. Preregistration below.
- **Item 2 — packaged notice channel**, per Q2: `NOTICE.txt` as a bundled resource rendered from the
  frontend with NO new Tauri command (ADR-027 tax avoided); generated at build time from
  `renderer/bundle-viewer/notice.mjs`'s `notice()` and asserted byte-identical in the artifact; the
  AGPL notice + `Url` corresponding-source route for the installer (ADR-009 item 1 + AGPL §4/§5, not
  item 7); `notice.mjs` added to the shell workflow's path filters.
- **Item 3 — the packaged build**: **NSIS only, per-user, no elevation** (`tauri.conf.json` targets
  pinned from `"all"`); the bundle viewer shipped as a resource and resolved via the resource dir
  (`PathResolver::resource_dir`, tauri 2.11.5 `src/path/desktop.rs:230`) with the dev-tree lookup
  kept for `tauri dev`; a CI `tauri build` job (build-only; carries `product-ci-shell.yml:58-62`'s
  never-cite-until-green rule and its run record); **Part M** on the FLIPPED build on a clean profile,
  **bundled with the ADR-017 exposure review** (the human reviews the publish surface against
  ADR-017 §15/§18 with an evidence pack the custodian prepares: the approval dialog, the grant
  scope, the audit record, the redaction, the ADR-025 preflight refusal); **pre-declared fallback:
  if F-10 fails, publish descopes by name and the hero slice ends at "style"**, stated in
  KNOWN-LIMITATIONS, README, QUICKSTART and the release notes alike.
- **Item 3e (NEW, part of the publish surface) — ADR-025 decided: refuse at preflight, typed.** The
  publish preflight predicts the artifact against the bundled viewer's declared ceilings (read from
  the viewer's own constants, never a second copy — ADR-025's own constraint) and refuses with a
  typed error naming the viewport-bbox publish as the alternative; **reopen condition: when a second
  reader exists.** ADR-025's decision section carries the human's words; status Accepted 2026-09-07
  on that word.
- **Item 4 — KNOWN-LIMITATIONS + tag**, with the consult's **eight additions adopted as written**
  (the shipped arm = candidate, stated; ADR-023 style-by-literal/hover-id-only; ADR-026 single-entry
  CRS catalog — or the extended one if item 8 is ruled in; ADR-016 identity limits; ADR-017 /
  publish class-3 approval-gated (or descoped, per the fallback); ADR-027 principle 4 partial; the
  loopback socket + `csp: null`; ADR-011 gates 1–7 open, gate 8 alone met, the citation rule) and the
  **twelve prohibitions adopted as written** (Amendment 1, Q7). Entry 42 added, cited to the open
  entry, arm-conditional wording now resolved by ruling 52. The human tags.
- **Item 5 — root README + description/topics** (Q5 binding: docs/00:9-11 never :35; docs/14
  trademark note; ADR-009 layer table; docs/09 posture; no "not public until" framing).
- **Item 6 — QUICKSTART**, style-by-literal stated; CRS requirement stated (EPSG:2056 only, or the
  extended catalog); publish per the ruling/fallback.
- **Item 8 (PROPOSED by the human, to be ruled at the brief's sight; not started) — extend the CRS
  catalog with EPSG:4326 and EPSG:3857** under the entry-51 verification protocol: each definition's
  PROJJSON compared leaf-by-leaf, keyed by EPSG code, against PROJ 9.6.2's rendering (EPSG v12.013),
  recorded in `spikes/entry51-epsg2056-equivalence/`'s successor; attribution beside each entry; the
  pinned-hash test extended consciously; ADR-026's "pinned in-tree, never fetched, no matching, no
  defaults" unchanged. Its consequence for a stranger: a WGS84 or Web-Mercator GeoParquet opens.

### Sequencing (ruled form)

Items 1 and 7 in parallel first (disjoint files: `src-tauri` vs the frontend). Then items 2 + 3 (+3e)
as the packaged-build piece; Part M + the exposure review on that artifact (human, batched). Items
5 + 6 drafted once the install path and the publish ruling are known. Item 4 last; the human tags.
Item 8 only if ruled in at sight, before item 4's text is final.

### Preregistration — item 1 (ADR-020 fix)

Design (a)+(b). Code: `frontends/shell/src-tauri/src/lib.rs` — the `cfg!(debug_assertions)` origin
selector (`:71`) is replaced by an origin read from the webview window's actual URL inside `setup()`
before any page script runs (`Webview::url()`, tauri 2.11.5, `src/webview/mod.rs:1679-1680`,
`pub fn url(&self) -> crate::Result<Url>`), normalised to scheme+host+port, pinned for the process,
and refused at startup — a named, logged, fail-closed error — if absent or unparseable; the dev
origin's single declared source replaces the three-place `5180` (`vite.config.ts`, `tauri.conf.json`
`devUrl`, `lib.rs`) — the piece names which one is the source and how the others read it.
`DataPlaneConfig::expected_origin` / `Session::with_origin` (the accepted mechanism) unchanged: host-
supplied, exact-match, never page script, never a wildcard; `Origin: null` still rejected; the
`sec-fetch-site: same-origin` fallback unchanged. **Tests (pre-committed):** the claim-carrying kernel
tests survive unmodified (`kernel/tests/skp_admission.rs`: the port-derived default is not admitted;
admitted origin + wrong token is refused — cite ADR-020:118-122); a unit test that the normalisation
yields exactly `http://localhost:5180` for the dev URL and `http://tauri.localhost` for the packaged
URL and refuses `""`/garbage; the packaged-`--debug` admission check is DECLARED here and executed on
item 3's artifact (Part M step). **Record, in the same commit:** ADR-020 Amendment 1 appended in the
pre-approved shape (Status sentence discharged quoted verbatim; the new selector with API + version;
*"the accepted mechanism is unchanged; this replaces a selector the acceptance never covered"*; the
E2E `import.meta.env.DEV` gate's status under `--debug`; a reopen condition: any build mode whose
webview origin is not readable at startup reopens this amendment rather than reintroducing a
compile-time selector); `docs/02:83` and `docs/README.md:27` updated (they say the defect is owed).
Gate: reviewer, plus an architect re-check of the origin code against the five conditions before the
reviewer's affirmative PASS. Human-directed security red line honoured by ruling 54.

### Preregistration — item 7 (flip the default arm to candidate)

Facts (read): `residencyArm.ts:26` `DEFAULT_RESIDENCY_ARM = "baseline"`; the candidate SESSION is
itself DEV-gated — `App.tsx:988` `if (isInstrumentedBuild() && getResidencyArm() === "candidate")` —
so today no production build can run candidate code at all; `check:dist-clean`
(`e2e/checkDistClean.mjs`) asserts an extended identifier list is absent from the production dist;
`residencyArm.test.ts:20-22` pins "defaults to baseline"; the refusal contract is encoded in
`e2e/regression.mjs`'s OVERCEIL′ step (over-ceiling fixture → *"N of M features rendered — declared
ceiling reached (MAX_RESIDENT_VERTICES)"*), `e2e/filter-panel.mjs`'s SLOW′/CANCEL′ steps (the same
pattern on the slow fixture), `e2e/admission-remediation.mjs:80`'s literal, and MANUAL-WALKTHROUGH
**Part D** ("deliberate ceiling refusal"). **The piece:** (1) `DEFAULT_RESIDENCY_ARM = "candidate"`;
(2) the candidate session runs in production — the `isInstrumentedBuild()` half of `App.tsx:988` is
removed for the session, while the SWITCH (`setResidencyArm`/`getResidencyArm` E2E hook registration
and the arm/tile-size bookkeeping) stays dev-gated exactly as now; (3) `check:dist-clean`'s list
updated so the candidate session's identifiers are expected in dist and only the switch/hook
identifiers stay forbidden — with the list change explained line by line; (4) `residencyArm.test.ts`
re-pinned to "defaults to candidate", plus a test that `setResidencyArm("baseline")` still works in
dev; (5) **every refusal-contract test audited**: OVERCEIL′, SLOW′/CANCEL′, admission-remediation's
literal, Part D — each either **re-aimed** to the candidate contract (the declared partial-view
strings 1–6 per `residencyStatus.ts`, verbatim) or **arm-pinned** to baseline via the dev switch
before the step, with the choice stated per test; baseline keeps its tests (the baseline arm remains
selectable in dev and its refusal contract remains ADR-011 gate 8's recorded interim); (6) `limits.ts`
doc and `residencyArm.ts` doc updated to the new default; (7) MANUAL-WALKTHROUGH Part D rewritten
as an arm-pinned dev step or re-aimed, dated; Part M runs on the flipped build. **Tests
(pre-committed):** the whole vitest suite green with the flipped default; `check:dist-clean` green
with candidate identifiers present and hook identifiers absent; the E2E regression + filter-panel +
admission-remediation runs green on the re-aimed/pinned steps (executed, not just written — the
harness recipe in AI_DEVELOPMENT.md); a new unit test that a production-mode render (no instrumented
build) constructs the candidate session. **No ADR change:** this applies ADR-028 as accepted; ADR-028
Amendment 3's contract becomes the shipped one. Gate: reviewer (ADR-010 rule 5 — nothing becomes
silent — re-checked on the re-aimed steps).

---

## Amendment 3 — B2's premise corrected on the record; preregistration of items 2, 3 and 3e (2026-09-07, appended BEFORE any code on those items)

**B2 correction (custodian, on reading ADR-017 in full).** ADR-017 §"Exposure review — 2026-08-17,
human decision — the UI surface passes, with two binding conditions" and §"Exposure review completion
— 2026-08-17": *"the acceptance condition is discharged for the shell's UI surface"* (conditions 1 and
2 landed in `cd3cf1c`, `29005d4`; `publish-bundle` remains dev/test tooling as a CLI; SKP, MCP,
plugin, notebook and AI exposure each still require their own review). Amendment 1's B2 statement
that the review "has not happened" is therefore wrong for the UI surface — the consult read the Status
block and the F-10 clarification, not the two later sections. **What stays open, exactly:** (i) the
discharged UI surface has never run from a packaged artifact — Part M re-confirms it there; (ii) the
ADR-025 preflight refusal (item 3e) is new behaviour on that surface, sighted at Part M. The human's
entry-53 ruling was made on the consult's premise; its reduced form is put back to the human in
DECISIONS-PENDING (the pre-declared fallback stands either way). No v0.1 text about publish is
written until that word.

### Preregistration — item 2 (packaged notice channel) + item 3 (the packaged build) as ONE piece

Facts read for this preregistration: `tauri.conf.json` `bundle.targets: "all"`, `bundle.active: true`,
no `resources`, `app.security.csp: null`; tauri-utils 2.9.3 `config.rs`: `NSISInstallerMode::CurrentUser`
(*"Install the app by default in a directory that doesn't require Administrator access … metadata under
HKCU"*, the default), `NsisConfig.install_mode` (`installMode`), `BundleResources` = list of paths or a
source→target map, bundle target name `"nsis"`; `publish.rs:795-804` locates the viewer dev-tree-
relative (`CARGO_MANIFEST_DIR/../../../renderer/bundle-viewer/dist`) and its doc (`:786-794`) records
that this does not hold packaged; tauri 2.11.5 `PathResolver::resource_dir` (`src/path/desktop.rs:230`).

**The piece:**
1. **Installer:** `bundle.targets: ["nsis"]`, `bundle.windows.nsis.installMode: "currentUser"` (per-
   user, no elevation — the human's ruling); MSI not produced. Signing OUT (declared).
2. **Viewer as a resource:** `bundle.resources` maps `../../renderer/bundle-viewer/dist` → a named
   resource directory; `publish.rs`'s viewer lookup resolves the resource dir first
   (`app.path().resource_dir()` joined with that name) and falls back to the dev-tree path under
   `tauri dev`; both paths are named in the error string when neither holds. The CI shell workflow
   builds the viewer before the shell (its lines ~119 already say `dist/` is consumed as
   `frontendDist`) — the bundle-viewer build must also precede `tauri build`.
3. **Notice channel (Q2 shape):** a prebuild step in `frontends/shell` writes `NOTICE.txt` from
   `renderer/bundle-viewer/notice.mjs`'s `notice()` (the ONE source) into a generated location the
   frontend imports (`?raw`) and renders in a "Notices" view reachable from the shell (no new Tauri
   command — ADR-027's tax avoided; state where in the UI, quoting docs/03 only for what exists);
   the same text is ALSO placed in `bundle.resources` as `NOTICE.txt` beside the executable, so the
   install directory carries it as a file. The AGPL notice + the `Url` corresponding-source route for
   the INSTALLER (ADR-009 item 1 + AGPL §4/§5; entry 49's route) are part of that text. **Test:** the
   generated `NOTICE.txt` is byte-identical to `notice()`'s output (a unit test), and the built
   frontend `dist/` contains the IOGP acknowledgement, the terms URL and the corresponding-source URL
   (a dist check beside `check:dist-clean`). `renderer/bundle-viewer/notice.mjs` added to
   `product-ci-shell.yml`'s path filters.
4. **CI:** a `tauri build` job on `windows-latest` in `product-ci-shell.yml` (build only; uploads the
   NSIS artifact; no signing, no release publishing); the job carries the workflow's standing rule
   (`:58-62`) — nothing cites it as a gate until a run has gone green end to end and its run id,
   commit, trigger and duration are recorded in the file.
5. **docs/09:** one sentence in "Local listening sockets" stating that the packaged app ships with
   `csp: null` and what ADR-020:111-113 says follows (audience change, not mechanism); KNOWN-
   LIMITATIONS line 7 cites it.
6. **The first `tauri build` on the reference machine** downloads NSIS into the Tauri CLI's cache
   (`%LOCALAPPDATA%\tauri`, absent today) — a dev-machine download, named here before it happens.
7. **Part M (new walkthrough part):** install the NSIS artifact on a clean Windows user profile
   (the human's pick — a fresh local account is cleanest); first launch; the Notices view and the
   `NOTICE.txt` beside the executable (item 2's strings, verbatim); open a GeoParquet (the CRS
   catalog's admitted CRS only — EPSG:2056, or the extended set if item 8 is ruled in); filter;
   style (by literal — ADR-023); the residency behaviour on the flipped arm at an over-budget zoom
   (the declared partial view, strings verbatim); **publish per the reduced entry-53 form** — the
   approval dialog's plain-outcome sentence and the audit record's `--audit-show` legibility
   (the 2026-08-17 conditions, re-confirmed on the artifact), the ADR-025 refusal on an artifact
   predicted above the reader's ceilings (item 3e), and the bundle opened in a browser; the
   `tauri build --debug` artifact's data-plane admission (item 1's declared check). Run by the human,
   batched. No perf steps; every expected outcome quoted from shipped strings.
8. **Tests, pre-committed:** the config asserts (`targets` = `["nsis"]`, `installMode` =
   `currentUser`, resources include the viewer and `NOTICE.txt`) as a unit test over
   `tauri.conf.json`; the viewer-lookup fallback order unit-tested; the notice byte-identity and
   dist-content checks; the CI job green once (recorded); Part M by the human.

### Preregistration — item 3e (ADR-025: refuse, typed, at preflight)

Facts: `kernel/src/publish/mod.rs:388` `pub fn preflight(req) -> Result<PublishPreflight, PublishError>`
already refuses typed (`RowFilterNotRecordable`, license, projection) before any work; the write path
refuses `MAX_PUBLISH_PARTITIONS` at `:614-619` with `PublishError::CeilingExceeded { ceiling, limit,
saw }`; the READER's ceilings live only in `renderer/bundle-viewer/src/render.ts:50-55` (`MAX_FEATURES
2_000_000`, `MAX_PARTITIONS 100_000`, `MAX_RESIDENT_BYTES 512 MiB`, `MAX_ATTRIBUTE_COLUMNS 32`,
`MAX_ATTRIBUTE_DISPLAY_CHARS 512`) — the kernel knows none of them.

**The piece:** (1) ONE source for the reader's ceilings: a `renderer/bundle-viewer/ceilings.json`
that `render.ts` imports (the TS constants become re-exports of it) and the kernel `include_str!`s
(parsed once, pinned-hash tested like the CRS catalog) — never a second copy, per ADR-025's own
constraint. (2) `preflight` predicts what is predictable before any write — feature count (the
dataset's row count) against `MAX_FEATURES`, projected attribute columns against
`MAX_ATTRIBUTE_COLUMNS` — and refuses with a typed error (`PublishError::ReaderCeilingExceeded {
ceiling, limit, predicted }` or the existing variant with a reader tag, the piece decides and says
why) whose message **names the current-viewport-bbox publish as the alternative** (the human's
ruling); partitions and resident bytes are refused at write time as today if not predictable at
preflight — the piece states which ceilings preflight can and cannot predict, and the shell surfaces
the refusal through the existing typed-refusal path (the approval dialog never opens for a refused
preflight). (3) Tests: a preflight over a source whose row count exceeds `MAX_FEATURES` refuses
before any write with the alternative named; a within-ceiling preflight is unchanged; the
ceilings.json hash pinned; the viewer's own tests still read the same values. (4) Record: ADR-025's
appended Decision already carries the ruling; the piece cites it; `docs/02`'s ADR-025 line gets a
dated status correction. Reopen condition (ADR-025): when a second reader exists.

Gates: items 2/3/3e as one reviewer-gated piece (architect re-check on the docs/09 sentence and the
ADR-027 command-tax claim), then PR; Part M after merge on the built artifact.

---

## Amendment 4 — item 1 reaches rule 7 (two failed gates); the origin-selector DESIGN goes to the human (2026-09-07, appended)

**Where item 1 stands.** `cut/release-adr020-origin` @ `5d22d7a`. Gate 1 (architect re-check + reviewer, on
`df0650f`): FAIL — the amendment's `pool_poll` sentence false; the refusal an unlogged panic; the drift
check foolable by a comment; no runtime execution. Fix batch `5d22d7a`: the runtime step **found that
`df0650f` refused to start in every mode** (`WebviewWindow::url()` is `about:blank` at the `setup()`
read; a sleep-only retry cannot fix it — WebView2 delivers navigation completion only via posted Win32
messages, `webview2-com` 0.38.2's own doc) and remedied it with a **Win32 message pump** inside `setup()`
(retry 250×20 ms), adding `windows` 0.61.3 as a direct target dependency and the crate's only `unsafe`.
Re-reviews: the reviewer FAILS on one mechanical cite (`lib.rs:314` → `:421-422`) with everything
substantive verified against persisted session logs (§(f)'s three observations, the drift mutation, the
refusal path, 33/33, 9/9); the architect FAILS on design and text. Two failed gates → **rule 7: stop;
no third pass without the human's word.**

**The architect's findings on the pump, verified on tao 0.35.3 / tauri-runtime-wry 2.11.4 / wry 0.55.1
/ webview2-com 0.38.2 (Amendment-4 record, not paraphrase of a belief):**
- tao is built to tolerate a nested Win32 loop inside its own handler: `runner.rs:208-228` `send_event`
  buffers when the handler is taken (re-entrant — `setup()` runs inside it, `app.rs:1422-1426`); the two
  `WM_PAINT` bypasses carry their own guards (`event_loop.rs:1087-1091`, `:2331-2341`). **No tao/tauri
  window event reaches the handler during the pump.**
- **WebView2 COM callbacks are NOT behind that guard**: wry's IPC (`add_WebMessageReceived`,
  `wry/src/webview2/mod.rs:877-891`) → `tauri-runtime-wry` `create_ipc_handler` (`:5385-5395`) → tauri
  `ipc::protocol::message_handler` — delivered by `PostMessage`, i.e. the queue the pump drains. **Page
  script CAN dispatch a command before `setup()` returns and before `app.manage(...)`.** Bound: every
  `State<'_, T>` command fails cleanly (`state.rs:60-69`, `InvokeError`, no bypass); two commands take no
  managed state and WOULD run — `binding_crs_catalog()` (pure) and **`binding_pick_file(app)`
  (`commands.rs:206`): a native OS file picker before the app has finished starting** — an ADR-006
  external-effect-class action reachable in the window. Not new capability (`serve()` has not run; no
  token/endpoint exists), and the page able to do it is the host-configured page, which ADR-020's
  Consequences already class as whole-shell compromise — but the amendment's condition-1 argument
  (*"the ONLY navigation ever issued to this webview before this read is the single, host-configured
  one"*) was airtight BECAUSE nothing pumped; with a 5 s pump it is a **timing** property written as a
  **structural** one. `lib.rs:206-214` ("regardless of what the message loop pumps during webview
  construction") is false as written (the pump is after construction, in a loop); `lib.rs:141-145`
  contradicts itself in one paragraph.
- Condition 4: `refuse_to_start` calls `blocking_show()` on the MAIN thread — `tauri-plugin-dialog`
  2.7.2 says it *"should NOT be used when running on the main thread context"* / *"will freeze your
  application"*; it works only because `tauri-runtime-wry` services a main-thread call inline
  (`:239-248`) — an undocumented reliance; **no packaged refusal has been observed** (the observed one
  was under `tauri dev`). Log-first ordering is correct and survives regardless.
- Reviewer's own additions: the pump **swallows `WM_QUIT`** (PeekMessage PM_REMOVE + unconditional
  Dispatch — closing the window during the ≤5 s startup is ignored); the non-Windows fallback is
  sleep-only, which §(f) proved cannot work (fail-closed refusal, correct direction, unstated); the
  `SessionLog::open` failure still panics invisibly in release; the retry loop is untested.

**The alternative, (B), verified on the sources:** `frontends/shell/src-tauri/build.rs:5` calls
`tauri_build::build()`; `tauri-build 2.6.3` `is_dev()` = `DEP_TAURI_DEV == "true"` (`:425-429`),
`cfg_alias("dev", …)` (`:519`) → the shell crate gets `cfg(dev)`; `tauri 2.11.5/build.rs:255-261`: `let
dev = !has_feature("custom-protocol"); alias("dev", dev); println!("cargo:dev={dev}")` — **one
emission, two consumers**: tauri's own `#[cfg(dev)]` in `manager::get_app_url` (`manager/mod.rs:353-367`:
dev → `config.build.dev_url`; production → `frontend_dist` if a URL, else `tauri_protocol_url` — `http(s)://
tauri.localhost` on Windows/Android, `tauri://localhost` elsewhere, `https` per the window's
`useHttpsScheme`) and the shell's `cfg(dev)`/`tauri::is_dev()` (`lib.rs:308-310`, public) are the same bit
by construction. This repo's own build outputs show the bit: `target/release/build/tauri-*/output` has
`rustc-cfg=custom_protocol` and the shell's release build has NO `rustc-cfg=dev`; the debug builds have
`rustc-cfg=dev`. The CLI changelog (PR #8937): *"To check if running on production, use
`#[cfg(not(dev))]`."* **Consequence: the mirror cannot disagree with Tauri's choice however `tauri build
--debug` falls** — exactly what `cfg!(debug_assertions)` lacked (a profile fact standing in for Tauri's
fact). Costs: it re-implements `pub(crate)` upstream logic (four branches + `use_https_scheme` +
`PROXY_DEV_SERVER`) with no compile-time link — silent drift on a tauri minor, failing by 403ing every
upgrade; and it **reintroduces the compile-time-selector class Amendment 1 §(e)'s reopen condition
names** (so §(e) must be amended by appended note if (B) is chosen). Correction to a fact the custodian
sent the architect: `manager/mod.rs:787`/`:795` are tauri's own test assertions, not the resolution path
(`:353-367` is) — not to be cited.

**The architect's ranking (verbatim in substance):** adopt (B) **if and only if** paired with a Part M
assertion on the item-3 artifact that the pinned origin equals the webview's actual `url()` origin
under each of `tauri dev`, `tauri build --debug`, `tauri build` — with that check (B) strictly dominates
(deletes the IPC window, the dependency, the `unsafe`, the platform fork, up to 5 s of startup); without
it, (B) trades a disclosed runtime hazard for an undisclosed compile-time modelling risk. Third option,
ranked below (B)+test and above the pump as shipped: keep the runtime read with the config-derived value
as the loop's termination predicate (fixes the stopping condition; keeps the pump and its hazards).

**Red line regardless of design:** `windows` 0.61.3 is a new direct edge that CHANGES `Cargo.lock` (one
line; `Cargo.lock:3965`) — unlike the tokio/macros precedent, whose justification was a byte-identical
lock. Not named in item 1's preregistration → the human's word. Design (B) removes the need.

**Queued as DECISIONS-PENDING entry 55** with the architect's ADR skeleton (a deliberately-open decision
of the ADR-023 pattern) for the human to accept, reject, or fold into ADR-020 Amendment 1. Nothing on
item 1 moves until the word. Text corrections owed under EITHER design before merge (the amendment is
append-only after): the reviewer's M-1 cite; §(f) "byte-identical" → "identical body"; §(e) line span;
§(d) `commands.rs:400-402`; the two false `lib.rs` sentences; the `blocking_show` reliance stated.

---

## Amendment 5 — facts from the packaged-build gates that bind later items (2026-09-08, appended; the piece's own fix batch is in progress under rule 7's first gate)

1. **Correction to Amendment 1, correction 2, and to §2 item 2's derivative text:** the installer's
   corresponding-source obligation under AGPL-3.0 is **§6 (conveying non-source forms)** — §4 is
   verbatim source copies, §5 modified source — with a bare repository URL relying on **§6(d)**
   (access from a network server). The "§4/§5" wording originated in the consult and was inherited by
   the notice text; the architect corrected it at the packaged-build re-check. Every release text
   (notice, README, QUICKSTART, KNOWN-LIMITATIONS) cites §6.
2. **KNOWN-LIMITATIONS entry 2/6 must say:** the ADR-025 preflight refusal predicts only the feature
   count (when identity was verified) and — in practice never reached, because the engine's
   `MAX_PUBLISHED_ATTRIBUTES = 32` refuses first without naming the alternative — the attribute-column
   count; **`MAX_RESIDENT_BYTES` is checked at no stage**, so a bundle under 2,000,000 features but
   over 512 MiB resident still publishes unwarned and the viewer refuses it (Part H8b's shape);
   `MAX_PARTITIONS` is refused only at write time. ADR-025's decision is scoped to "when preflight can
   predict", so the code is faithful; the declaration carries the residual.
3. **The installed program's notice set is incomplete by name:** the beside-the-executable
   `NOTICE.txt` and the Notices view carry the viewer's third-party notices (once the fix batch resolves
   them from the viewer's own tree), the EPSG/IOGP acknowledgement, and the installer's AGPL §6 route —
   but NOT the Rust crate notices that travel with the binary (`DEPENDENCY-LICENSES.md`'s crate
   tables; MIT/Apache-2.0 §4(d) notices). Named as OWED in the notice text itself and here; a later
   piece generates them from the lockfile. Entry 51's "packaged-app channel" is discharged for the
   EPSG/IOGP obligation, not for the whole notice set.
4. **ADR-025's parenthetical path** (`renderer/bundle-viewer/src/render.ts`) is superseded by
   `renderer/bundle-viewer/ceilings.json` (the single authored statement; `render.ts` re-exports it) —
   an **appended note on ADR-025 is owed on the human's word**; nothing in the ADR is edited.
5. **Recorded, not inferred:** a per-user NSIS install places the bundle viewer — whose hash enters
   every published bundle — in a user-writable directory (docs/09 already disclaims local-process
   boundaries; no claim is falsified); the shipped binary's viewer-lookup refusal string named the
   build machine's `CARGO_MANIFEST_DIR` path (suppressed by the fix batch when a resource dir exists);
   `renderer/bundle-viewer/ceilings.json` is the tree's first cross-module compile-time file
   dependency (kernel `include_str!`), so both CI workflows must watch it.
6. **Machine fact:** during the gates the reference machine's C: fell to 3.3 GB free (`os error 112`
   on a cargo test); the reviewer deleted `target/debug/incremental` in the main tree and the worktree
   (~12 GB, pure cache) and the 2,000,001-row temporary fixture the `#[ignore]`d ADR-025 test leaves
   under `%TEMP%`. Release builds plus stacked worktrees are disk-heavy; every build step checks free
   space first.

**Correction to Amendment 5, item 1 (2026-09-08, appended — the reviewer's re-review nit 7):** its last
sentence, *"Every release text (notice, README, QUICKSTART, KNOWN-LIMITATIONS) cites §6"*, was written
in the present tense for three texts that do not yet exist (items 4/5/6). Read it as a requirement —
"must cite §6" — in the form item 2 of the same amendment already uses; only the notice cites §6 today.
The custodian's own false-sentence, of the class the packaged-build gates were convened to remove.

---

## Amendment 6 — the human's rulings of 2026-09-08 on entries 53/55/56/57 and item 8; the ruled item list v3; preregistrations for item 1 (b), the K6 re-aim, items 8, 9 and 10 (2026-09-08, appended BEFORE any code on those items)

**The human, verbatim:** *"55 = (b): config mirror via tauri::is_dev(); Part M equivalence assertion
under dev / build --debug / build; post-load logged self-check of pinned vs actual origin with a typed
mismatch state (assertion, never selection, no pump); windows edge + unsafe removed; conditions (4)/(5)
retained, (1)–(3) superseded; recorded as ADR-020 Amendment 1's content; new mechanic: never block or
pump inside setup(). 56 = (b) now — stepK6 encodes both cases explicitly (continuous→refusal,
discrete→clear, no stale id); 47 = next cut's first piece; A9′ flakiness gets its own entry. 57 = (b)
to unblock + item 9 (both generators) BEFORE the tag + ADR-030 filed Proposed with (a) as decision on
item 9's landing; LOD → ADR-031; the ensure_pinned finding is entry 7's ruled pre-fix, never built —
add it to this cut as a small piece, KNOWN-LIMITATIONS only if it slips. 53 reduced = (a). Item 8 =
yes, 4326 + 3857 under the entry-51 protocol. #30: clicking. Sweep authorized in full."* (#30 merged
@ `fdb7c87`; PR #31 rebased onto it and retargeted to `main`.)

### The ruled item list, v3

1. **Item 1 (b)** — the config mirror (preregistration below). Re-opens `cut/release-adr020-origin`.
2. **Item 2/3/3e** — PR #31: the authorized sweep (list below), then the human's click.
3. **Item 7** — MERGED (#30). **K6 re-aim** — a small piece off main (preregistration below).
4. **Item 8** — CRS catalog + EPSG:4326 + EPSG:3857 under the entry-51 protocol (preregistration below).
5. **Item 9** — both notice generators (the shell's Vite npm set; the Rust crates from the lockfile)
   into the one-source `NOTICE.txt`, BEFORE the tag (preregistration below). **ADR-030** filed
   Proposed now with candidate (a) as the decision to be accepted on item 9's landing.
6. **Item 10** — entry 7's ruled pre-fix, never built: the cancellable, progress-reported pin phase
   before publish (preregistration below). KNOWN-LIMITATIONS carries it only if it slips.
7. **Item 4/5/6** — KNOWN-LIMITATIONS, README, QUICKSTART: drafted (job tmp), written against what
   ships once 1/8/9/10 land; item 4 last; the human tags.
8. **ADR-031** is the LOD slice's home of record (NEXT-CUT.md renumbered); **entry 58** (A9′
   flakiness) filed; **entry 47** = the next cut's first piece, with entry 58 beside it.

### The authorized sweep on PR #31 (one commit, no gate re-run beyond CI green)

The notice header names BOTH owed gaps (the packaged frontend's own npm set — React, react-dom,
`@deck.gl/core`+`layers` 9.3.7, the shell's `apache-arrow` 21.2.0 — and the Rust crates); the same in
`DEPENDENCY-LICENSES.md`'s dated block; Part M M3 re-quoted; `.gitattributes` gains
`renderer/bundle-viewer/ceilings.json text eol=lf` (the CRLF-checkout hash failure on
`windows-latest`, run 34190120091); the `tauri-build` job's record slot filled with its first green
run (run 34190120055, job 101946288669, commit `34a1896`, `pull_request`, 27m19s); the reviewer's two
should-fixes (the undated "Dated correction" in `product-ci-shell.yml:28`; M3's tense) and nits
(`docs/02:91`'s stale ADR-025 clause; the boundary "first line" wording; `notice.mjs:140`'s AGPL path
stated as repo-anchored; M10's trailing period; the shipped refusal's developer-only remedy sentence
replaced by a packaged-context one; the `#[ignore]`d boundary test stated as not-in-CI). Then CI green
(all four workflows) → the human's click.

### Preregistration — item 1 (b): the config mirror (supersedes Amendment 2's item-1 conditions (1)–(3))

**Design.** `expected_origin` is derived from configuration the host already holds, mirroring Tauri's
own `WebviewUrl::App` resolution (`tauri-2.11.5/src/manager/mod.rs:353-367`), which descends from the
same single `cargo:dev=` emission the shell crate receives (`tauri-2.11.5/build.rs:255-261`;
`tauri-build-2.6.3/src/lib.rs:425-429,519`; `tauri::is_dev()` public at `src/lib.rs:308-310`):
`if tauri::is_dev() { origin_of(app.config().build.dev_url) — refuse to start if None }` else
`{ if let FrontendDist::Url(u) = frontend_dist { origin_of(u) } else { tauri_protocol_origin(https) } }`
where `tauri_protocol_origin` is `http(s)://tauri.localhost` on Windows/Android and
`tauri://localhost` elsewhere, `https` from the main window's `useHttpsScheme` (default false);
`PROXY_DEV_SERVER` (`cfg!(all(dev, mobile))`) noted as inert on desktop. Normalised by the existing
pure `expected_origin_from_url`. **No runtime read in `setup()`, no retry, no pump, no `windows`
dependency, no `unsafe`** — the pump, its retry loop and the `windows` target dependency are REMOVED
(`Cargo.lock` returns to main's edge set). Condition (4) retained: a missing/unparseable configured
URL refuses to start — logged first (`SessionLog::open` stays before the selection), a blocking
dialog, `exit(1)`. Condition (5) retained: the API and crate version named in code and record.
**The post-load self-check (assertion, never selection):** on the main window's page-load event
(Tauri 2's `on_page_load` / `PageLoadEvent::Finished` — verify the exact API by name and version in
the piece), read `Webview::url()`, normalise, compare to the pinned origin; log the result to the
session log (`origin-self-check ok` / `origin-self-check MISMATCH pinned=… actual=…`); on mismatch
emit a typed event to the frontend (`app.emit`, no new command — ADR-027 decision 4 untouched) which
renders a typed, non-dismissible state naming the mismatch and that the data plane will refuse; the
pinned value is NEVER changed by the check. **Tests:** unit tests for the mirror over every branch
(dev+dev_url; dev without dev_url → refusal; production + `FrontendDist::Url`; production default →
`http://tauri.localhost`; `useHttpsScheme` → `https://tauri.localhost`; the non-Windows arm →
`tauri://localhost`); the kernel admission tests unmodified and green; `check:dev-origin` stays (now
load-bearing for both Tauri and the shell). **Part M equivalence assertion (row M12):** under each of
`tauri dev`, `tauri build --debug`, `tauri build`, the session log's pinned-origin line and its
self-check line agree (`ok`), and the data plane admits one upgrade — executed at Part M on the
artifacts; the `--debug` artifact is built for that row (build only, not installed). **Record:**
ADR-020 Amendment 1 REWRITTEN on the branch (unmerged text) to this design: the Status sentence
discharged quoted verbatim; the mirror with API + version; *"the accepted mechanism is unchanged; this
replaces a selector the acceptance never covered"*; the self-check as assertion-not-selection; §(d)'s
truthful DEV-gate paragraph kept; §(e) reopen condition amended to: any future build mode whose origin
Tauri does not resolve from `cfg(dev)` + config reopens this amendment; §(f) replaced by the
executed-once record of the mirror + self-check on `tauri dev` (the pump's runtime record moves to the
amendment's history paragraph, dated, as the disproved design). `docs/02:83`, `docs/README.md:27`
updates kept. Gate: reviewer + architect re-check (the mirror's four branches against `get_app_url`;
the self-check's page-load hook; the removed dependency; the record). Human-directed security red
line honoured by ruling 55.

### Preregistration — the K6 re-aim (entry 56 = (b))

`e2e/regression.mjs` `stepK6` encodes both cases of the CURRENT contract explicitly: (i) a single
continuous zoom-out crossing the pick threshold (one coalesced camera change, as the walkthrough's
L7 gesture — realised with one wheel event of sufficient delta, or the camera set directly through
the E2E surface if the harness offers it) → the readout shows the refusal text *"Features here are
below pick resolution — zoom in to inspect them."* (verbatim, `App.tsx`); (ii) discrete notches
(≥ 8 wheel events as today) → the readout CLEARS on the first notch and **no stale id survives** (the
`.hover-readout` never shows the pre-zoom id after any notch). Both assertions are named in the step's
comment as the contract entry 47 will replace (re-pick on settle, next cut's first piece); no product
code changes. Tests: the step green on main's default (candidate) on a quiet machine; a unit test in
`pickResolution.test.ts` pinning the two paths of `reevaluateStandingHoverOnCameraChange` if not
already present. Gate: reviewer.

### Preregistration — item 8: EPSG:4326 and EPSG:3857 in the catalog (the entry-51 protocol)

Facts binding the design: ADR-026 Accepted — pinned in-tree, content-hashed, never fetched, no
matching, no defaults; the catalog's one entry embeds a PROJJSON at schema v0.5; `crs_catalog::tests`
pins the entry count, ids and the EPSG:2056 hash as literals; the engine admits a CRS assertion only if
the definition establishes axis order (`crs::tests::an_assertion_that_establishes_no_axis_order_is_refused`).
**The piece:** (1) generate `EPSG:4326` and `EPSG:3857` as PROJJSON with the same pinned tool as
entry 51's check (`projinfo -o PROJJSON`, PROJ 9.6.2, EPSG v12.013 — versions recorded); (2) verify
each under the entry-51 protocol — a leaf-by-leaf comparison keyed by EPSG code between the catalog
entry and a SECOND rendering (`projinfo -o WKT2:2019` parsed, or the human's epsg.org lookup pasted)
— recorded in `spikes/entry51-epsg2056-equivalence/`'s successor directory with the verbatim output;
(3) two new catalog entries with `attribution` (source, terms URL, `verified` naming v12.013), the
pinned literals (count, ids, hashes) updated consciously; (4) the engine's PROJJSON reader verified on
schema v0.7 and on a GEOGRAPHIC CRS (4326's axes are Lat/Lon, north/east, degrees) — tests: admission
of a 4326-declared file establishes axis order and renders in degrees as a planar frame with NO
reprojection (ADR-003/docs/01: no silent conversion — plate carrée is the honest rendering; a
KNOWN-LIMITATIONS entry says so: geographic CRS render unprojected in v0.1); 3857's metres render as
today; (5) `DEPENDENCY-LICENSES.md`'s EPSG block gains the two entries' verification lines (the
custodian appends after the piece lands, to avoid colliding with the #31 sweep). Gate: reviewer +
architect re-check (ADR-026 fidelity; axis-order handling; the no-reprojection rendering statement).

### Preregistration — item 9: both notice generators (before the tag)

(1) The shell's Vite build: a Rollup/Vite-produced manifest (`build.rollupOptions` / the `manifest`
option — verify the exact mechanism) enumerating every npm package compiled into
`frontends/shell/dist`, fed to the SAME `notice()` (extended to accept a second package set with its
own base dir) so the installed `NOTICE.txt` carries the packaged frontend's third-party notices
(React, react-dom, deck.gl, apache-arrow 21.2.0 …) with their retained NOTICE files; (2) the Rust
crates from `frontends/shell/src-tauri/Cargo.lock` (+ the workspace lock for the kernel/engine crates
statically linked): name, version, declared license, and each crate's `LICENSE*`/`NOTICE*` text from
the cargo registry, generated at build time into the same `NOTICE.txt` — no new crate dependency (a
node script reading the lockfile and the registry directory; if an existing tool such as `cargo about`
would be needed, STOP and report — dependency red line); (3) the installed copy then enumerates every
third-party work it carries and the "owed" sentences are REMOVED; the bundle's `viewer/NOTICE.txt`
keeps its viewer-only scope (unchanged bytes for the viewer section); (4) tests: byte-identity of the
generated file with the generator's output; a dist check that every package in the Vite manifest and
every crate in the lockfile appears by name; the reviewer diffs a sample of embedded license texts
against the registry files. **ADR-030** (filed Proposed now) is accepted with candidate (a) — *every
conveyed artifact enumerates every third-party work it actually carries, generated from that
artifact's own build manifest; no artifact ships with a named gap* — on this piece's landing, the
human's word. Gate: reviewer + architect (ADR-009/AGPL notice completeness; ADR-030 (a) satisfied).

### Preregistration — item 10: entry 7's ruled pre-fix (the cancellable, progress-reported pin)

Entry 7 (ruled 2026-09-02, verbatim): *"thread the `CancelToken` + a phase label into
`publish-prepare`"* — never built. Facts: `publish.rs` `ensure_pinned(dataset, cancel)` runs the
whole-file SHA-256 under `spawn_blocking` with `CancelToken::new()` (no UI affordance) and no progress
during `binding_publish_prepare`'s "Preparing…" state; ADR-025's refusal now sits behind it. **The
piece:** the pin phase reports progress (bytes hashed / total, as a phase label + fraction through the
existing publish-progress channel — `PublishPhase`/`progress.phase`, verify) and honours a cancel
from the panel (the same `CancelToken` the publish itself uses — a Cancel during "Preparing…" aborts
the pin with a typed outcome, nothing written, the dialog never opens); the ADR-025 ceiling check runs
BEFORE the pin where it can (feature count from the verified identity — no pin needed), so an
over-ceiling source is refused in milliseconds; Part M M10 rewritten accordingly. Tests: a
cancel-during-pin unit test (typed outcome, no side effect); a progress-reported pin test on a fixture;
the reordered preflight refusing before any hash. Gate: reviewer (docs/01 principle 7's
progress/cancel clause is the criterion; ADR-006: the pin is not a side effect). Slips → a
KNOWN-LIMITATIONS entry, by the human's ruling.

## Amendment 7 — item 8's architect consult: BLOCK on the EPSG:4326 half, PASS with notes on EPSG:3857; corrections to the item-8 preregistration; the 3857 piece as dispatched (2026-09-08, appended BEFORE any code on item 8)

**Why a consult before dispatch.** Reading the code to write the item-8 brief, the custodian found that
the engine refuses a latitude-first declaration by design (`engine/src/dataset.rs:303-307`,
`EngineError::AxisOrderUnsupported`; `engine/src/crs.rs:120-124` "refused rather than reinterpreted";
`engine/tests/slice.rs:310-324`; docs/05:26 "the EPSG:4326 lat/lon trap"), so the preregistration's
item (4) — "admission of a 4326-declared file establishes axis order and renders in degrees" — names
the refused behaviour. Both `projinfo` renderings (PROJ 9.6.2, EPSG v12.013, the same `proj.db` as
entry 51 by hash) and the GeoParquet 1.1.0 axis-order passages are pinned verbatim in
`spikes/item8-crs-catalog-extension/README.md` before anything cites them.

**The architect's verdict (2026-09-08), in its own words where quoted:** *"BLOCK — item 8's EPSG:4326
half, as preregistered … The EPSG:3857 half is pass with notes and can proceed this cut."* Violations
named (the architect's cites; the custodian re-read the engine, slice-test and `partition.ts` lines):
(1) ADR-015 §5, Accepted and architect-blockable, refuses a non-x-first source rather than
reinterpreting it (the architect quotes `ADR-015:56-60`); (2) ADR-026 declines the question
(`ADR-026:61`, under "What this ADR does not decide"); (3) NEW — the bundle viewer refuses any order
but `easting,northing` (`renderer/bundle-viewer/src/partition.ts:29`, checked per partition at
`:115-121` → the ADR-017 §14 state `envelope-axis-order-mismatch`), so a 4326 bundle would be a dead
artifact of the shape ADR-025 was accepted to refuse at preflight; a second such reader at
`frontends/canvas-probe/src/geoarrow.ts:90-92`; (4) NEW — `engine/src/geoarrow.rs:97-103` embeds the
definition verbatim in the GeoArrow field, so under an override an external reader would receive a
lat-first CRS over an x-first buffer (docs/05:26's trap exported across a boundary, ADR-010 rule 1);
(5) the spec text was unpinned — now pinned (above). On the merits the architect calls the
recorded-override admission *"defensible — arguably more honest than today"* (today's refusal reports
`established: "latitude,longitude"` about a file whose WKB is x-first, and `engine/src/error.rs:72-76`
calls that "the EPSG:4326 trap `docs/05` names, in its GeoParquet form" when the format's form of the
trap is the opposite) but *"a substantive re-reading of an accepted architect-blockable ADR, so it is
not the custodian's to make"*: it may live only in `engine/src/geoparquet.rs` (the format reader),
never in `crs.rs`'s `is_x_first`; `axis_normalization` must stay `none-performed` (nothing is
normalized) and the data-order basis is a NEW fact whose envelope/manifest key would hit ADR-017's
spent schema lever (`ADR-017:855-859`, per the architect) → `bundle_version` 2; a producer violating
the spec transposes silently, so only a falsification check (|latitude| > 90 → refuse) is possible,
never a conformance proof. Ranking: **(a) EPSG:3857 only this cut** (no ADR change; works end to end;
one precommitted test); (b) 3857 + 4326 under the recorded override = a cut of its own (ADR-015
amendment, ADR-017 §14 reader change, possible `bundle_version` 2, a degrees fixture); (c) 3857 +
OGC:CRS84 — admitted today with zero code change (its PROJJSON declares Longitude/east first), but
`crs::admit` admits an assertion only when the file declares nothing (`engine/src/crs.rs:218-240`), so
it does not open a stranger's 4326-declared file, and its OGC authority escapes the EPSG attribution
guard (`crs_catalog.rs:247-273`) while its values are EPSG-derived — a conscious, recorded decision if
taken. The human's calls: the amendment; the scope change to ruled item 8; whether v0.1 tags with the
4326 refusal declared. Queued as DECISIONS-PENDING entry 59 with the architect's entry text verbatim.

**Corrections to Amendment 6's item-8 preregistration (the architect's §5, verified where the
custodian read the lines):**
1. Item (4)'s premise is the refused behaviour (above).
2. "The engine's PROJJSON reader verified on schema v0.7" is a non-event: the reader touches only `id`
   and `coordinate_system.axis` (`engine/src/geoparquet.rs:139-189`); nothing in `engine/`, `kernel/`
   or `protocol/` reads `$schema` or `datum`. What is real: the pinned 2056 entry is `$schema` v0.5
   with `datum` (`engine/tests/data/epsg2056.projjson:2`); the new renderings are v0.7 with
   `datum_ensemble` — the catalog mixes schema versions and must say so PER ENTRY, not claim a reader
   verification. The 64 KiB definition ceiling (`crs.rs:36`) is not near.
3. The pinned-literal sites are `crs_catalog.rs:275-281` (ids AND count in one assertion) and
   `:234-240` (the per-entry hash pin); three sites the preregistration missed also encode the count:
   `frontends/shell/e2e/admission-remediation.mjs:219-224` (`catalog.length !== 1`, id equality),
   `frontends/shell/MANUAL-WALKTHROUGH.md:599` ("one entry, `epsg-2056`"), `LICENSES/README.md:122`
   ("One CRS definition in this repository").
4. Attribution is already enforced for every EPSG-authority entry by
   `crs_catalog.rs:247-273` (`every_epsg_authority_entry_carries_attribution_with_the_terms_url`) —
   the guard, not new discipline.
5. `CrsMode::DeclaredLatLonFirst` (`engine/src/fixture.rs:309-314`) is a metadata trap over LV95-metre
   coordinates, not a degrees dataset; any real 4326/CRS84 test needs a new degree-domain fixture mode
   (unscoped).
6. `EXPECTED_AXIS_ORDER` (violation 3). The shell's own canvas does not gate on axis order, so a
   non-x-first refusal surfaces only at publish/view — late and loud.
7. `RELEASE-0.1.md:422` ("a WGS84 or Web-Mercator GeoParquet opens") overstates: admission is WKB-only
   and polygon-only (`dataset.rs:269-282`), needs an integer identity column or a declared mapping,
   and viewport queries need `covering.bbox`. The QUICKSTART must not promise "opens".
8. If any geographic CRS ever renders, metre-named records become false: `offsetFrame.ts:34-37`
   (`LocalFrameM`, `RECENTER_MAX_DRIFT_M = 131_072`) and `tileGrid.ts:68-73` ("one metre for a
   projected CRS …"); and the rendering claim must read "no coordinate value is transformed; the
   display convention is equirectangular" — "NO reprojection … plate carrée" contradicts itself
   (docs/01:21 permits display reprojection only through an explicit, visible transform); an appended
   dated note on ADR-003's `crs_transform: "none — rendered in source CRS"` string
   (`kernel/src/publish/mod.rs:1187`) would be owed, the human's word. No precision or perf claim may
   attach: ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 magnitudes only (docs/08:62).
9. `error.rs:74-75`'s "in its GeoParquet form" is a false record if the pinned spec text holds — a
   docs-only fix-forward candidate, left to entry 59's ruling because it describes the 4326 refusal.

**The ADR-032 skeleton the architect drafted (recorded here; FILED only on the human's word, as
ADR-030 was; 031 is the LOD slice's):** *"ADR-032 — Axis order for a GeoParquet source whose CRS
definition declares a non-x-first order. Proposed, decision deliberately open. Context: ADR-015 §5
establishes axis order from the CRS definition and refuses a non-x-first source rather than
reinterpreting it, resolving a docs/05 conflict lower-number-wins; its OPEN block reserves the
normalize-later question; ADR-026:61 restates the refusal. GeoParquet 1.1.0 states that WKB
coordinates are always (x, y) and that this 'explicitly overrides the coordinate axis order in the
crs'. If that holds, EPSG:4326-declared GeoParquet — the commonest file a stranger brings — is refused
with a message that misdescribes the file, and no catalog entry can fix it: the assertion path reads
axis order through the same function. Three readers pin easting,northing (partition.ts:29,
canvas-probe/src/geoarrow.ts:90, envelope.rs:87). Decision: OPEN. Candidates: (A) hold the refusal;
admit only definitions whose declared order is x-first (OGC:CRS84), stating the limitation. (B)
establish the data's order from the format specification in engine/src/geoparquet.rs, record both
facts (declared order; data order + the rule and spec version), leave axis_normalization =
none-performed, widen the x-first reader set, and add a falsification-only |latitude| ≤ 90 guard. (C)
normalize on ingest per docs/05:64-67 — out of scope for a slice with no transform. Consequences of
B: ADR-015 amendment; ADR-017 §14 reader contract and digest row 11 restated, bundle_version 2 if any
key is added; an SKP value-domain statement; a degrees fixture; the GeoArrow field's
declared-vs-buffer contradiction resolved against the GeoArrow metadata spec, pinned; ADR-026:61
dated-stale. Of A: the hero slice refuses the commonest CRS in the wild, declared in
KNOWN-LIMITATIONS. Neither licenses reprojection."*

### Preregistration — the EPSG:3857 piece (the half of ruled item 8 that stands; supersedes Amendment 6's item-8 items (3)–(4) for this entry)

Branch `cut/release-crs-3857` off main. (1) The catalog gains `epsg-3857` with the definition being
the pinned rendering's bytes verbatim (`spikes/item8-crs-catalog-extension/epsg3857-projinfo-9.6.2.projjson`,
sha256 `e14b8ded…` of the LF bytes), an `attribution` block in the 2056 entry's shape (source, terms URL,
`verified` naming EPSG v12.013 and the projinfo route), and a per-entry `schema` statement
(v0.7 here, v0.5 for 2056) if the catalog's shape admits one — else the schema versions are stated in
`crs_catalog.rs`'s module doc; (2) the entry-51 protocol's leaf-by-leaf comparison, keyed by EPSG code,
between the catalog entry and the WKT2:2019 rendering parsed (`epsg3857-projinfo-9.6.2.wkt2`) — the
comparison script and its VERBATIM output recorded in `spikes/item8-crs-catalog-extension/` (the
human's epsg.org lookup remains the stronger confirmation, available at sight); (3) pinned literals
updated consciously: `crs_catalog.rs:275-281` (ids + count), a new `EPSG_3857_HASH` pin beside
`:234-240`, plus the three count sites in correction 3 (E2E, walkthrough, `LICENSES/README.md`);
(4) the precommitted test: `axis_order_from_projjson(<the 3857 entry>) == AxisOrder::EastingNorthing`
— the guard against PROJ ever naming those axes "longitude"/"latitude", which would flip the reader
to `LongitudeLatitude` and the viewer to refusal; (5) `DEPENDENCY-LICENSES.md`'s EPSG block gains the
3857 verification line (the custodian appends after landing, to avoid colliding with the #31 sweep);
(6) the shell's CRS assertion form shows two catalog entries (no code change expected —
`CrsAssertionForm` lists the catalog; verify) and the admission-remediation E2E asserts the new count
and both ids. No engine admission code changes; `dataset.rs:303`, `slice.rs:310`, the envelope,
`EXPECTED_AXIS_ORDER`, publish, ADR-015/017/026 untouched. Gate: reviewer + architect re-check
(ADR-026 fidelity: pinned in-tree, content-hashed, never fetched, no matching, no defaults; the
attribution guard; the comparison record).
