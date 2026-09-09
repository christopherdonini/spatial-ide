# Spatial IDE

A **Spatial IDE** — VS Code's extensibility, Figma's immediacy and polish, Google Earth's
directness, Jupyter's reproducibility — combined into an AI-native spatial computing platform.

Not a next-generation QGIS. Not a clone with better defaults. A different category: the platform is
a headless spatial kernel; the UI, the CLI, the notebooks, and the AI are all clients of it.

*(Those two paragraphs are the project's own statement of what it is building, `docs/00_Vision.md`.
What follows is what exists today.)*

> **DRAFT for v0.1.0.** Bracketed items — `[M: …]` — describe the installed application and are
> finalized only from the operator's own walkthrough of the packaged build (Part M), never before it
> (`RELEASE-0.1.md` Amendment 13). Everything unbracketed can be checked against a file in this
> repository.

## What v0.1.0 is

The first packaged Windows build of the **Prototype hero slice**: open a GeoParquet, filter it in
SQL, style it, publish it as a static interactive bundle.
That is the whole claim. Every limit is declared by name in [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md);
please read it before forming an expectation — in particular, v0.1.0 admits two coordinate
reference systems, EPSG:2056 and EPSG:3857 (a file declaring EPSG:4326 — WGS 84 latitude/longitude,
which most public GeoParquet declares — is refused, by decision, not by accident), styles by literal
only, and runs on Windows only.

This release makes no performance statement. The project records no timing, throughput or size claim
without a measurement against its own budgets (`docs/08_Testing.md`), and none is made here.

## Install

[M: Windows 10 or later, x64. Download `Spatial IDE_0.1.0_x64-setup.exe` from the v0.1.0 release and
run it — it installs for the current user only and needs no administrator rights. If the Microsoft
WebView2 runtime is missing, the setup program downloads Microsoft's bootstrapper for it — the only
network access in the install; the application itself makes none. The installer is unsigned in
v0.1.0; Windows will say so. — every sentence here is confirmed or corrected from Part M (M1–M2, the
clean-profile install).]

## First five minutes

[`QUICKSTART.md`](QUICKSTART.md): what your GeoParquet needs (a declared coordinate reference system
the catalog admits, and an identity column), what the app says when it refuses a file, and the slice
end to end.

## What this repository is

- `docs/` — the project constitution: vision, principles, architecture, and the decisions
  (`docs/adr/`). `docs/README.md` is its index. Accepted decisions are immutable; corrections are
  appended, dated.
- `kernel/`, `engine/`, `renderer/`, `protocol/`, `frontends/` — one directory per module of the
  architecture (`docs/02_Architecture.md`).
- `spikes/` — throwaway validation code whose written conclusions are the deliverable.
- `frontends/shell/MANUAL-WALKTHROUGH.md` — the operator walkthroughs each cut is verified against,
  with the human's verdicts recorded verbatim.

The SKP protocol specification and all file formats are open, permanently (`docs/14`).

## Local-first

No network access without an explicit grant (`docs/09_Security_and_Privacy.md`). The app binds one
loopback socket for its own data plane, admits only its own window's origin, and fetches nothing
at runtime — the coordinate reference systems it knows are pinned in the tree. [M: the installed
build's notices — the **Notices** view and `NOTICE.txt` beside the executable — enumerate every
third-party work it carries, including the works inside DuckDB's own source tree (ADR-030); confirmed
at Part M M3.]

## License

Core (kernel, engine, renderer, protocol, frontends, spikes): **AGPL-3.0-or-later**. Specification
and documentation (`docs/`): **CC-BY-4.0**. Client SDKs and generated bindings, when they exist:
**Apache-2.0** — none exists yet. Contributions are accepted under the Developer Certificate of
Origin 1.1 (`DCO`; sign your commits). Details, provenance and what the AGPL does and does not
provide: [`LICENSES/README.md`](LICENSES/README.md) and ADR-009. The bundled EPSG coordinate
reference system data is © IOGP, used under the EPSG Terms of Use (`DEPENDENCY-LICENSES.md`).

"Spatial IDE" is a working title, not a registered mark (`docs/14`).

## Contributing

[`CONTRIBUTING.md`](CONTRIBUTING.md). Read `docs/00` and `docs/01` first; cite documents by number;
never edit an accepted decision — append.
