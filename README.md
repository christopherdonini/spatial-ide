# Spatial IDE

A **Spatial IDE** — VS Code's extensibility, Figma's immediacy and polish, Google Earth's
directness, Jupyter's reproducibility — combined into an AI-native spatial computing platform.

Not a next-generation QGIS. Not a clone with better defaults. A different category: the platform is
a headless spatial kernel; the UI, the CLI, the notebooks, and the AI are all clients of it.

*(Those two paragraphs are the project's own statement of what it is building, `docs/00_Vision.md`.
What follows is what exists today.)*

Every statement below about the installed application was written after the operator ran it: the
build this release ships, installed on a clean Windows account and walked through step by step, as
`frontends/shell/MANUAL-WALKTHROUGH.md` Part M records it and `RELEASE-0.1.md` Amendments 15–18 keep
the operator's own words. Two builds, precisely: the walkthrough rows whose code paths this build
changed were re-run on it (install and first open, the filter and status rows, the hover row, the
packaged-executable origin check), and the rows it did not touch — style, the publish and audit
rows, the bundle viewer, the development-build origin rows, the deliberate-refusal row — stand from
the candidate build they were run on, with `git diff --stat 998be05 13471a9` as the proof that
nothing under their paths changed (Amendments 17 and 18). Everything else can be checked against a
file in this repository.

## What v0.1.0 is

The first packaged Windows build of the **Prototype hero slice**: open a GeoParquet, filter it in
SQL, style it, publish it as a static interactive bundle.
That is the whole claim. Every limit is declared by name in [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md);
please read it before forming an expectation — in particular, v0.1.0 carries two pinned coordinate
reference systems, EPSG:2056 and EPSG:3857, and refuses any file whose declared CRS puts latitude
first (EPSG:4326 — WGS 84 latitude/longitude, which most public GeoParquet declares — among them:
by decision, not by accident); it reads polygons only, styles by literal only, and runs on Windows
only.

This release makes no performance statement. The project records no timing, throughput or size claim
without a measurement against its own budgets (`docs/08_Testing.md`), and none is made here.

## Install

Windows, x64. Download `Spatial IDE_0.1.0_x64-setup.exe` (listed on the release page as `Spatial.IDE_0.1.0_x64-setup.exe` — GitHub shows the space as a dot) from the v0.1.0 release, compare its
SHA-256 with the one the release page states, and run it. It installs for the current user only,
into `%LOCALAPPDATA%\Spatial IDE`, and asks for no administrator rights — Part M installed it that
way on a clean Windows account (M1), and the window opened with the title **Spatial IDE**, no
console and no crash dialog (M2).

The installer is **not code-signed** (Authenticode: `NotSigned`), so Windows may tell you the
publisher is unrecognised. That is a fact about this build, not a statement that the file is safe;
the published SHA-256 is the only check this release offers
([`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md), entry 14). If the Microsoft WebView2 runtime is
absent, the setup program downloads Microsoft's bootstrapper for it — the only network access in the
install; the application itself makes none. That branch was not exercised in Part M: the runtime was
already present on the machine the walkthrough ran on.

## First five minutes

[`QUICKSTART.md`](QUICKSTART.md): what your GeoParquet needs (a declared CRS whose definition
establishes an easting-first axis order, and an identity column), what the app says when it refuses
a file, and the slice end to end.

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
at runtime — the coordinate reference systems it knows are pinned in the tree. The installed build
carries its own notices: the **▸ Notices** disclosure in the window and the `NOTICE.txt` beside the
executable are the same bytes, and a third notice ships in the installed `bundle-viewer\` folder.
Between them they enumerate the viewer's npm packages, the packaged frontend's own, the Rust crates
statically linked into the binary, and the third-party works inside DuckDB's amalgamated source
tree, with the EPSG/IOGP acknowledgement and the AGPL §6(d) corresponding-source route (ADR-030);
Part M opened all three on the packaged build (M3). The window's origin is pinned and the app says
so in its session log — the expected origin and an `origin-self-check ok` line naming the same one,
in all three build modes (M12) — and a build pointed at any other origin refuses to start, with a
native "Spatial IDE could not start" dialog rather than a silent load (M13).

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
