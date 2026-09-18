> **Status: draft — the v0.1.0 GitHub release body; superseded by the published release at tag `v0.1.0`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

**Installer:** `Spatial.IDE_0.1.0_x64-setup.exe` as this page lists it (the file's own name is `Spatial IDE_0.1.0_x64-setup.exe`; GitHub shows the space as a dot) (Windows, x64; per-user; unsigned; 10,559,893 bytes)
**SHA-256:** `c3f483209341409333971b8a1695b60116763f976217d5b50264c7edd16bfb1f`
**Read first:** [KNOWN-LIMITATIONS.md](https://github.com/christopherdonini/spatial-ide/blob/v0.1.0/KNOWN-LIMITATIONS.md) — every limit of this release, by name.

---

## What v0.1.0 is

The first packaged Windows build of the **Prototype hero slice** (`docs/07_Roadmap.md`): open a GeoParquet, filter it in SQL, style it, publish it as a static interactive bundle. That is the whole claim. [QUICKSTART.md](https://github.com/christopherdonini/spatial-ide/blob/v0.1.0/QUICKSTART.md) walks the first five minutes.

This release makes **no performance statement**. The project records no timing, throughput or size claim without a measurement against its own budgets (`docs/08_Testing.md`), and none is made here.

## Before you open a file

- Your file's **own declared CRS** is admitted as a file fact, and only if its definition establishes an **easting-first axis order**. The app carries two pinned definitions — **EPSG:2056** (CH1903+ / LV95) and **EPSG:3857** (WGS 84 / Pseudo-Mercator) — and those are what it offers you when a file declares nothing, as a pinned choice or a pasted PROJJSON document (ADR-026). Three refusals by name: an **absent `crs` key** and an **explicit null `crs`** (both `engine.crs_undeclared` — GeoParquet's OGC:CRS84 default is not applied), and a **latitude-first declared order** — **EPSG:4326**, what most public GeoParquet declares, among them (`engine.axis_order_unsupported`: refused, never reinterpreted; ADR-015 §5; ADR-032 is filed Proposed with the decision open).
- Every feature needs a stable integer identity column (ADR-016); composite and non-integer keys are not supported.
- What the installer needs from your machine: the **Microsoft WebView2 runtime** — the setup program downloads Microsoft's bootstrapper for it if it is absent, which is the only network access in the install (the application itself makes none). That branch was not exercised in Part M, because the runtime was already present on the machine the walkthrough ran on. The executable also imports `MSVCP140.dll`, the **Microsoft Visual C++ 2015–2022 runtime**, which this installer does not bundle; what a machine without it does is untested (`KNOWN-LIMITATIONS.md`, entry 15).

## What you will see, and what it says

Styling is by literal only; the hover readout shows `id` only (ADR-023). At overview zoom the canvas shows a declared partial view and says so in the status line (ADR-028); far past "Zoom to layer", tiles already drawn may vanish while still on screen — a declared exception (ADR-028's appended note). Publishing asks for a typed approval, records a per-user audit line, and refuses above the bundled viewer's declared ceilings before hashing anything (ADR-024, ADR-025). Scan progress is not shown; liveness is (ADR-029).

## Not in v0.1.0

macOS and Linux (open gates, `docs/07`); editing, notebooks, MCP, AI (Alpha items); code signing, notarization, auto-update. The data-plane transport is an experimental default (ADR-012, Proposed).

## Notices and licence

The installed application carries three notice files — `NOTICE.txt` beside the executable, `bundle-viewer\NOTICE.txt`, and the in-app **Notices** view — enumerating every third-party work it conveys, including the 26 works inside DuckDB's own amalgamated C/C++ source tree with their full licence texts (ADR-030, Accepted 2026-09-09). Core: **AGPL-3.0-or-later**; documentation: **CC-BY-4.0**; contributions under the DCO 1.1 (ADR-009). Corresponding Source, per AGPL §6(d): this repository at tag `v0.1.0`. The EPSG coordinate reference system data is © IOGP, used under the EPSG Terms of Use (`DEPENDENCY-LICENSES.md`).

## Provenance

Built from `13471a9` on `release/0.1.0` — the v0.1.0 candidate commit `998be05` plus three preregistered, gated shell fixes (the hover readout's re-pick on camera settle; "Zoom to layer" under a row filter; the residency status under a row filter). Verified by the operator's Part M walkthrough on a clean Windows account (`frontends/shell/MANUAL-WALKTHROUGH.md`, "Part M"), reported 2026-09-13: M5–M13 on the candidate, then M1–M5, M7, M12 mode 3, M14, M15 and the hover row re-run on this build; the rows whose code paths this build's diff does not touch stand from the candidate `998be05`, with `git diff --stat 998be05 13471a9` as the proof (`RELEASE-0.1.md` Amendments 15–18). The release-engineering record, every ruling verbatim: `RELEASE-0.1.md`.

"Spatial IDE" is a working title, not a registered mark (`docs/14`).

## Build provenance

This installer was built from commit `13471a9` on the `release/0.1.0` branch (the v0.1.0 candidate commit `998be05` plus three shell fixes, each preregistered and gated: the hover readout's re-pick on camera settle, "Zoom to layer" under a row filter, and the residency status under a row filter). The tag `v0.1.0` points at the branch's final head, which differs from the build commit by documentation only — the proof is the diff between them:

```
git diff --stat 13471a9 v0.1.0   # v0.1.0 = release/0.1.0 head b391e43
 KNOWN-LIMITATIONS.md                  | 156 ++++++++++++++++++++++++++++++++++
 QUICKSTART.md                         | 121 ++++++++++++++++++--------
 README.md                             |  62 +++++++++-----
 frontends/shell/MANUAL-WALKTHROUGH.md |   2 +
 4 files changed, 285 insertions(+), 56 deletions(-)
```

Installer: `Spatial IDE_0.1.0_x64-setup.exe`, 10,559,893 bytes, SHA-256 `c3f483209341409333971b8a1695b60116763f976217d5b50264c7edd16bfb1f`. The installer is not code-signed (Authenticode: `NotSigned`), so Windows may warn that the publisher is unrecognised; that is a fact about this build, not a statement that the file is safe. Verify the download with `Get-FileHash -Algorithm SHA256` before running it.
