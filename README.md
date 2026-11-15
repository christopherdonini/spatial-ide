# Spatial IDE

A **Spatial IDE** — VS Code's extensibility, Figma's immediacy and polish, Google Earth's
directness, Jupyter's reproducibility — combined into an AI-native spatial computing platform.

Not a next-generation QGIS. Not a clone with better defaults. A different category: the platform is
a headless spatial kernel; the UI, the CLI, the notebooks, and the AI are all clients of it.

*(Those two paragraphs are the project's own statement of what it is building, `docs/00_Vision.md`.
What follows is what exists today.)*

## What works today

What works today is what the last release does: v0.1.0, the first packaged build of the project's
Prototype hero slice, for Windows x64. In the installed application you can:

- open a GeoParquet file and see its features on the map, with a summary of the file (verified with
  a file in EPSG:2056);
- filter the map with a SQL condition, such as `id < 100`, and use **Zoom to layer** to fit the map
  to the features that match;
- style the features with a fill colour and opacity and an outline colour and width, the same for
  every feature;
- hover a feature to read its `id`;
- publish the whole file, or an area of the map, as a static interactive bundle, after a dialog in
  which you type the destination folder's name to confirm. The filter is not published: a bundle
  cannot record one. The bundle is a folder holding the data, a viewer page and a manifest; it opens
  in a browser, with your style, once the folder is served over HTTP, and the application does not
  serve it.

The operator ran each of these on the installed application. The verdicts, with those behind the
Install and Local-first sections below, are in `governance/RELEASE-0.1.md`, Amendments 15, 16 and
18, against the rows of Part M in `frontends/shell/MANUAL-WALKTHROUGH.md`; Amendment 17 records which
rows were re-run on the final build and which stand from the candidate build. `main` is ahead of
v0.1.0, and no behaviour on this page is claimed for it.

That is the whole claim. Every limit is declared by name in [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md);
please read it before forming an expectation — in particular, v0.1.0 carries two pinned coordinate
reference systems, EPSG:2056 and EPSG:3857, and refuses any file whose declared CRS puts latitude
first (EPSG:4326, WGS 84 latitude/longitude, which most public GeoParquet declares; by decision, not
by accident); it reads polygons only, styles by literal only, and runs on Windows
only.

## What this repository is

- `README.md`, `QUICKSTART.md`, `KNOWN-LIMITATIONS.md`, `LICENSE`, `DEPENDENCY-LICENSES.md`,
  `CONTRIBUTING.md` and `DCO` are for readers and contributors; `CLAUDE.md`, `Cargo.toml` and
  `Cargo.lock` are read by tools.
- `docs/` — the project constitution: vision, principles, architecture, and the decisions
  (`docs/adr/`). `docs/README.md` is its index. Accepted decisions are immutable; corrections are
  appended, dated.
- `kernel/`, `engine/`, `renderer/`, `protocol/`, `frontends/` — one directory per module of the
  architecture (`docs/02_Architecture.md`).
- `governance/` — how the work is run: the plan (`PLAN.yaml`), the rulings ledger, the working
  rules, the audits, the release records and checklists. `governance/forms/` holds the
  preregistration forms (the two under `docs/` and the drafts under `state/` excepted), one folder
  for each top-level folder they came from and `root/` for those
  from the root; `governance/MOVED.tsv` lists every moved file's old path, new path and move commit.
- `state/` — the working record: the human's directives, consults, gate reports and the state of
  the work in hand.
- `site/` — the plan's status page, generated from `governance/PLAN.yaml`.
- `scripts/` — the plan's checks, the session hooks, the evidence tools, the licence and notice
  audits, and measurement helpers.
- `tools/` — the test-data corpus manifest (`tools/corpus/`) and the session mods (`tools/mods/`).
- `spikes/` — throwaway validation code whose written conclusions are the deliverable.
- `LICENSES/` — the licence texts, and which applies where (`LICENSES/README.md`).

The SKP protocol specification and all file formats are open, permanently (`docs/14`).

How the work is run, where a new preregistration form goes, and how a path from before the move
resolves: [`governance/README.md`](governance/README.md).

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
