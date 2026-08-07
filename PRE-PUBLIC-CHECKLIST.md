# Pre-public checklist — ADR-009

ADR-009 was accepted on 2026-08-07 and its own Status says: **"The repository does not become public
until the pre-public checklist below lands — accepting this ADR ends the deliberation, not the
gate."** This file is that checklist's status.

**As of 2026-08-07 the repository must NOT be made public.** Two of the six items are open, and both
need a human. What is open is stated per item below.

> **The session that produced this worked under a binding no-downloads constraint** (the operator
> was on a metered connection: no installs, no fetches, no toolchain or browser downloads). Where a
> step needed a download, it is recorded as **deferred with reason** and carries the exact command,
> never guessed at. That accounts for the whole of item 1's remainder.

| # | Item | Status |
|---|---|---|
| 1 | `LICENSE`, per-package declarations, SPDX headers | **PARTIAL** — two license texts deferred (no-downloads) |
| 2 | DCO 1.1, `CONTRIBUTING.md`, sign-off CI | **DONE** — one caveat, below |
| 3 | ADR-017 corrigendum: bundle license notice + corresponding source | **DONE** |
| 4 | Dependency-license audit | **DONE** — 9 entries flagged, awaiting a human |
| 5 | Project-name collision check; trademark policy stub | **OPEN — the human's own task.** Not performed |
| 6 | History review | **DONE** — no blocking finding; three items to note |

---

## 1. Licenses — PARTIAL

**Done.** `LICENSE` (AGPL-3.0-or-later) at the root; `docs/LICENSE` (CC-BY-4.0);
`LICENSES/Apache-2.0.txt` with verifiable provenance; `license` declared on all six crates and all
four npm packages; **SPDX headers on all 147 tracked source files** (`.rs` `.ts` `.mjs` `.html`
`.css` `.ps1`). `LICENSES/README.md` says which layer each part of the tree is in.

**Open — and this is what blocks item 1.** The verbatim texts of **AGPL-3.0** and **CC-BY-4.0** are
not in the repository. Neither exists anywhere on this machine — checked, not assumed;
`LICENSES/README.md` records exactly what was searched and what was found. **They were deliberately
not reproduced from memory**: a legal instrument transcribed approximately is worse than one
honestly marked absent, and GPL-3.0 (which *is* on the machine) is not AGPL-3.0 with an edit.

```sh
curl -o LICENSES/AGPL-3.0-or-later.txt https://www.gnu.org/licenses/agpl-3.0.txt
curl -o LICENSES/CC-BY-4.0.txt          https://creativecommons.org/licenses/by/4.0/legalcode.txt
```

Then delete the trailing notice in `LICENSE` and in `docs/LICENSE`. **AGPL-3.0 §4 requires a copy of
the License to travel with the Program**, so until this lands the repository names its license
without supplying it.

There is a second consequence: `renderer/bundle-viewer/build.mjs` embeds the AGPL text into every
bundle's `NOTICE.txt` **when the file exists**, and emits a clearly marked *incomplete* notice when
it does not. Placing the two files therefore also completes item 3's notice set, with no further
change.

### Two judgement calls flagged rather than made

- **The Apache-2.0 layer has no member in the tree.** ADR-009 item 4 puts client SDKs, generated
  bindings and example integrations there; none exists yet. `frontends/canvas-probe/` and
  `protocol/transport-bakeoff/web/` could each be read as an "example integration" and are declared
  `AGPL-3.0-or-later` on the conservative reading — the copyright holder can still relicense their
  own code outward, and publishing as Apache-2.0 does not un-publish. Reasoning in
  `LICENSES/README.md`. **If either is meant to be the Apache-2.0 layer, that is your call.**
- **The copyright line reads `Copyright (C) 2026 Christopher Donini and the Spatial IDE
  contributors`**, taken from the git-recorded author. Change it everywhere at once if you want a
  different holder — it is in `LICENSE`, `docs/LICENSE`, `build.mjs` and 147 file headers.

## 2. DCO and sign-off CI — DONE

`DCO` (Developer Certificate of Origin 1.1) at the root; `CONTRIBUTING.md` states the requirement,
what signing off means and how to fix a commit missing it; `.github/workflows/dco.yml` checks every
non-merge commit in a pull request.

**The workflow's shell logic was tested locally**, because CI cannot run here (see below). All four
paths were exercised against throwaway repositories: a properly signed commit passes; an unsigned
one fails; one signed by neither its author nor its committer fails; a merge commit is skipped.

> **Verify the `DCO` text before going public.** It was transcribed from memory — short, fixed and
> universally copied, unlike the two license texts, but *transcribed* nonetheless. Diff it against
> <https://developercertificate.org/>. This is the one place in this checklist where text was
> written from memory rather than deferred, and the reason is that `CONTRIBUTING.md` cannot say
> "sign off per the DCO" while the DCO is absent.

> **Not a gate until it has gone green.** `dco.yml` carries the same recorded caveat as the two
> product CI workflows, for the same environmental reason: as of 2026-08-07 **no run of any workflow
> in this repository has ever been assigned a GitHub-hosted runner.** Three runs on 2026-08-06,
> across both `windows-latest` and `ubuntu-latest`, were each cancelled at exactly 15 minutes queued
> having executed no step. `Settings → Billing → Actions` is the first thing to check. Until a run
> goes green, the sign-off requirement is real but this file is unproven configuration.

## 3. ADR-017 corrigendum — DONE

**ADR-017 Corrigendum 3 (2026-08-07)** discharges ADR-009 item 7. A required top-level
`viewer_license` member carries the distributed code's `program`, `copyright`, `license`,
`notice_path` and a `corresponding_source` route; writer, strict reader, the shared key contract and
the mutation tests all changed together, as ADR-017's own two-sided discipline requires.

`bundle_version` stays **1** under the same dated no-external-readers fact Corrigendum 1 used —
**re-established rather than inherited**, because this adds a *key* where Corrigendum 1 widened a
*type*, and Corrigendum 1 explicitly declined to generalise itself. The corrigendum states plainly
that this is a **breaking format change made at a constant version because the population it breaks
is empty**, and **declares the exception spent**: no further schema change is available at v1.

Three findings from the architect review are worth carrying forward:

- **Every bundle published before this distributed `apache-arrow` and `flatbuffers` (Apache-2.0,
  with a NOTICE) and `tslib` (0BSD) carrying no notice at all.** `build.mjs` now generates
  `dist/NOTICE.txt` from esbuild's metafile — from what was *actually* bundled, not a hand-kept
  list — and the publisher refuses to build a bundle whose `notice_path` does not name a hash-listed
  viewer asset.
- **What the format checks is narrower than what it requires.** It checks that a declaration exists
  and points at a hash-listed file. It cannot check what is *in* that file. Accuracy is the
  publisher's claim, exactly as `license.state` is.
- **A notice cannot be stripped without an *external* verifier noticing — not without the bundle's
  own viewer noticing.** ADR-017 §14 already says a viewer inside a bundle cannot verify itself.

### One pre-existing defect was found and fixed on the way

**`safeRelativePath` accepted an absolute URL as a "safe bundle-relative path."** The rule was
`/^[A-Za-z]:/` — one letter then a colon — which catches `C:/evil` and admits an `http(s)`, `data:`
or `javascript:` value, whose second character is not a colon. Every path it blessed goes to
`bundleUrl`, which is `new URL(path, BUNDLE_BASE)`, and **`new URL` resolves an absolute URL by
ignoring the base** — so a manifest could make the reference viewer `fetch()` from an attacker's
origin, and the request is sent *before* the content hash can reject the bytes.

It predates this branch and reached partition, style and viewer-asset paths; the notice link is
simply how it was noticed. Both sides now refuse any RFC-3986 scheme prefix — the reader in
`manifest.ts`, the writer in `viewer_assets.rs` — with negative tests over every path-bearing
manifest member. `docs/09` treats a manifest as untrusted input and ADR-017 §14 requires every asset
path to be bundle-relative; an absolute URL was neither.

*(A second, smaller one: the reader validated the corresponding-source route's presence but not its
**scheme**, while `main.ts` renders it as an `href`. The publisher refuses non-`http(s)`, but
writer-side validation does not reach a bundle the writer did not produce. The reader refuses it
too now.)*

**One side effect worth knowing about:** a copyright notice names a person, and on a machine whose
login name is that person's, the `docs/09` redaction scan sees the machine's username in the
manifest. `redaction.rs` now takes the operator's declared strings and **re-classes** such a match
as `operator-declared` — still reported, never suppressed, and only when the match lies wholly
inside a declared occurrence. The same name anywhere else is still a `username` finding.

## 4. Dependency-license audit — DONE, 9 entries need you

`scripts/audit-dependency-licenses.mjs` → `DEPENDENCY-LICENSES.md`. Reads `cargo metadata --offline`
and installed `node_modules/*/package.json`. **Contacts no registry.**

**721 packages audited; 9 flagged; 1 tree not auditable.** The script **flags and does not judge** —
ADR-009's own Caveat reserves the legal reading for counsel, and there is deliberately no
"incompatible" verdict, because a copyleft library in the AGPL core is usually unremarkable while
the same library in the Apache-2.0 SDK layer would not be.

The nine, which need a human and not a script:

| Where | What | Why it is a question |
|---|---|---|
| workspace, bake-off, spike | `ryu` `Apache-2.0 OR BSL-1.0` | `BSL-1.0` (Boost) is not on the recognised list. The `OR` branch to Apache-2.0 is available; the script does not evaluate `OR`, on purpose |
| workspace | `webpki-roots` `CDLA-Permissive-2.0` | An unusual identifier; worth one look |
| **spike app only** | `cssparser`, `cssparser-macros`, `dtoa-short`, `option-ext`, `selectors` — all `MPL-2.0` | Weak copyleft, arriving transitively through Tauri. **None is in the shipped workspace**; all are in `spikes/adr-003-crs-rendering/` |

**Not auditable:** `protocol/transport-bakeoff/web` has no `node_modules`, and installing it is a
download. Its declared direct dependencies are listed in the report rather than passed over.

**What the audit does not cover, so it is not assumed:** only the `x86_64-pc-windows-msvc` graph (the
full multi-platform graph cannot be resolved offline, so **macOS/Linux-only dependencies are not in
it**); declared identifiers rather than verified ones; and nothing about vendored code inside a
dependency — `engine/` builds DuckDB from vendored C++ and this sees one crate.

## 5. Project-name collision check — OPEN, and it is yours

**Not performed, and not performable here.** ADR-009 item 8 makes it a precondition; it needs
trademark registers, an npm/crates.io name search and a web search, all of which are network work
under a no-downloads constraint — and the judgement is not a script's to make.

Also owed by ADR-009 item 5 and **not written**: the **trademark policy stub in `docs/14`**. It is
left blank rather than drafted, because a stub asserting a policy nobody has decided would be worse
than an absence — and its content depends on what the name check finds.

## 6. History review — DONE, no blocking finding

Read-only scan of **632 blobs across all 92 commits**, plus every commit message and every author
identity. **Nothing was changed.** Any history rewriting is a separate human decision and none is
recommended.

**Credentials: none.** Two pattern hits, both benign on inspection — `Authorization: Bearer {token}`
is a format string building a test WebSocket handshake in `protocol/transport-bakeoff/src/main.rs`,
and the other is `redaction.rs`'s own test fixture. No `.env`, `.pem`, `.key`, `.p12` or
credential-named file has ever existed in this repository.

**Absolute local paths: none personal.** Every hit is either a standard Windows install location for
headless-browser discovery (`C:/Program Files/Microsoft/Edge/...` in `run-acceptance.mjs` and
`run-probe.mjs`) or a `redaction.rs` test fixture. No path names a user directory or this machine.

**Third-party data: none.** No dataset, fixture, Overture or OSM extract has ever been committed —
every fixture is generated by `engine`'s own writer.

**Three things to note, none blocking:**

1. **Two personal email addresses are permanently in the history** —
   `donini.christopher@gmail.com` (172 commit/committer records) and `chrys92d@gmail.com` (12).
   Unavoidable for git and normal for an open project, but it is personal data that goes public with
   the repository, and ADR-009 item 6 asks about exactly this. Nothing to fix; a decision to
   acknowledge. Consider whether both identities should be one going forward.
2. **`spikes/adr-003-crs-rendering/app/` is unmodified `create-tauri-app` scaffolding** — 14 default
   `.png` icons, an `.ico`, an `.icns`, `.vscode/extensions.json`, and a `Cargo.toml` still carrying
   `authors = ["you"]` and `description = "A Tauri App"`. Tauri's templates are MIT/Apache-2.0, so
   this is almost certainly fine; it is named because "third-party material without rights" is the
   question item 6 asks and these are the only third-party *files* in the tree.
3. **`engine/tests/data/epsg2056.projjson`** is an EPSG CRS definition. EPSG data carries the IOGP
   terms of use and is normally redistributed via PROJ with attribution. One look is warranted.

Two files exist in history but not at HEAD, both deliberate and both innocuous: `NEXT-CUT.md` (a
transient implementation brief whose content survived into ADR-017) and
`protocol/transport-bakeoff/scripts/verify-phase3.mjs`.

---

## What was actually run on this branch

Local, on the `CLAUDE.md` reference profile (Windows 10 / MSVC / WebView2), 2026-08-07:

| Command | Result |
|---|---|
| `cargo test --workspace --offline --locked` | **268 passed, 0 failed, 2 ignored** |
| `npm --prefix renderer/bundle-viewer run verify` | typecheck + build + **52 passed, 0 failed** |
| `node scripts/audit-dependency-licenses.mjs` | 721 audited, 9 flagged, 1 tree not auditable |
| `renderer/bundle-viewer/build.mjs`, twice | byte-identical `app.js` and `NOTICE.txt` |
| `.github/workflows/dco.yml`'s shell, extracted and run against throwaway repos | pass / unsigned / wrong-signer / merge-skip all as intended |

The two ignored tests are the `docs/08` budget harnesses, unchanged and deliberately not run — they
are measurement instruments, and **nothing in this branch measures anything or claims a number**.

**No CI run happened, on this branch or any other.** See item 2's caveat: no workflow in this
repository has ever been assigned a runner. Every result above is local.

---

## What has to happen before the repository goes public

1. **Fetch the two license texts** (item 1) — two `curl` commands, then delete the two trailing
   notices.
2. **Verify `DCO` against developercertificate.org** (item 2).
3. **Do the name-collision check and write the trademark stub in `docs/14`** (item 5).
4. **Look at the nine flagged dependencies** (item 4) and decide; edit the recognised list in the
   script only as a decision, never to silence a line.
5. **Decide on the two flagged judgement calls** in item 1 — the Apache-2.0 layer's membership and
   the copyright holder.
6. Optionally re-run the audit and the suites once the license texts are in place.

Flipping the repository public is a separate human action after all of the above. Nothing in this
branch does it, and nothing in this branch should be read as recommending it yet.

---

## Custodian completion note — 2026-08-07

Items closed in this pass, by the custodian (Fable) with the operator's bandwidth constraint
respected (all fetches ran sandbox-side; ~53 KB synced to disk):

1. **License texts fetched from canonical sources**: `LICENSES/AGPL-3.0-or-later.txt` (34,523 B,
   canonical header/footer verified) and `LICENSES/CC-BY-4.0.txt` (18,657 B). Trailing
   marked-incomplete notices removed from `LICENSE` and `docs/LICENSE` per their own instructions.
2. **`DCO` diffed against developercertificate.org**: the transcription's only delta was the Linux
   Foundation's old street address (three lines), present in the historical text and absent from
   the live official one. Removed; the file is now whitespace-normalized-identical to the live
   source. The from-memory caveat is discharged.
3. **Name-collision check performed** (web search scope): no product/project/repository named
   "Spatial IDE" found; the phrase exists only descriptively. Trademark stub written in `docs/14`
   with the descriptiveness consequence stated; full register search deferred to pre-1.0 with
   counsel.

Still open, and whose: the **nine flagged dependencies** and the **two judgement calls** (item 1) —
the human's, with the custodian's engineering reads presented in conversation; **CI green** —
environmental (`Settings → Billing → Actions`); **`protocol/transport-bakeoff/web` audit** —
deferred until off the metered connection (requires `npm install`); **counsel review** — per
ADR-009's own caveat, before first outside contribution and before anything commercial.
