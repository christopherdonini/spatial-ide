*Custodian's filing note (2026-10-29): the architect's draft of the README's words for governance piece F (the direction's item 6; the form's sections 2.6 and 9; the human's OPEN-8 (A)), on the custodian's brief (its REPORT PATH). Read only, at main e5c7835d; the architect has no shell, so it carries no hashes, and its kept spans were typed while reading: the build copies them from README.md by script and diffs them. The words are proposals for the human's approval in the PR, not the human's wording. By its transcript: Read 17, Grep 28, Glob 8; run 2026-10-29T06:17:17Z to 06:22:58Z. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ee5d157726b29e6979ffea6d4f5ab43c458b24874fa5e008d04cbaeba2eb9da6.*

---

Draft: governance-f-tidy-repository-in-place README words. Read at main @ e5c7835d (the abbreviated id from the session's git status; I have no shell to print the full id or confirm HEAD).

This is a drafting consult, not a gate, so no verdict is given. The draft raises no Correctness or Evidence finding. Documentation findings are under item 3(c). I have no shell, so no sha256 appears anywhere in this report. Every path:line below is as read in the main checkout. The words of the new sections are mine, proposed for the human's approval in the PR (form §1 "Wording"; direction item 6). They are not the human's wording yet. Kept sections are byte copies of README.md as read and are marked UNCHANGED.

---

## 1. The new README.md, whole

Section by section:
- **Title** `# Spatial IDE`: stays.
- **README.md:3-7** (the vision paragraphs): stays, unchanged.
- **README.md:9-10** (the italic note): stays, unchanged. It is attribution, and it is still true.
- **README.md:12-21** (the evidence paragraph): goes. The evidence paragraph inside "What works today" replaces it. There are three reasons:
  - It says Part M's results are recorded in `frontends/shell/MANUAL-WALKTHROUGH.md`. That Part's result log is an unfilled template (MANUAL-WALKTHROUGH.md:1389-1395), and RELEASE-0.1.md:1285 says the record is the amendments.
  - Its two-build detail is already kept in KNOWN-LIMITATIONS.md:6-10 and in RELEASE-0.1 Amendment 17.
  - It cites `RELEASE-0.1.md` at the path the move vacates.
- **"## What v0.1.0 is" and README.md:25-26**: changes, into "## What works today" (OPEN-8 (A)). Lines 25-26 summarise the slice as "publish it" right after "filter it", which a reader can take to mean the filtered rows. KNOWN-LIMITATIONS item 8 says otherwise.
- **README.md:27-32**: stays, unchanged. It is the limits pointer, kept whole so that "That is the whole claim." closes the new statement.
- **README.md:34-35** (the no-performance paragraph): goes. §9's order has no slot for it, and KNOWN-LIMITATIONS.md:11-12, which the limits pointer sends the reader to, states the same fact. The human may prefer to keep it as it stands. It contains no performance claim, so keeping it is safe.
- **Install, First five minutes**: UNCHANGED bytes. They move below the opening, because the direction (item 6) makes the map and the governance pointer part of the opening.
- **"What this repository is"**: changes into the map. Kept from it unchanged: the `docs/` bullet, the module bullet, the `spikes/` bullet and the docs/14 sentence (true per docs/14_Governance_and_Licensing.md:14). Dropped: the MANUAL-WALKTHROUGH bullet. The new statement names that file, and its claim that "the human's verdicts [are] recorded verbatim" there does not hold for Part M.
- **Local-first, License**: UNCHANGED bytes (red line; form §8 item 10). This includes the working-title line inside License.
- **Contributing**: stays, unchanged. It cites no file the move relocates.

None of the kept sections cites a moved path, so keeping their bytes is safe under the move.

````markdown
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
v0.1.0, and nothing on this page is claimed for it.

That is the whole claim. Every limit is declared by name in [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md);
please read it before forming an expectation — in particular, v0.1.0 carries two pinned coordinate
reference systems, EPSG:2056 and EPSG:3857, and refuses any file whose declared CRS puts latitude
first (EPSG:4326 — WGS 84 latitude/longitude, which most public GeoParquet declares — among them:
by decision, not by accident); it reads polygons only, styles by literal only, and runs on Windows
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
  preregistration forms, one folder for each top-level folder they came from and `root/` for those
  from the root; `governance/MOVED.tsv` lists every moved file's old path, new path and move commit.
- `state/` — the working record: the human's directives, consults, gate reports and the state of
  the work in hand.
- `site/` — the plan's status page, generated from `governance/PLAN.yaml`.
- `scripts/` — the plan's checks, the session hooks, the evidence tools and the licence audit.
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
````

Byte provenance of the kept spans:
- the opening and its note are README.md:1-10;
- the limits pointer is README.md:27-32;
- the module, `docs/` and `spikes/` bullets and the docs/14 sentence are README.md:61-66 and :70;
- Install, First five minutes, Local-first, License and Contributing are README.md:37-57 and :72-101.

I typed them while reading, not by script. The custodian should copy them by script and diff them against README.md before the PR.

## 2. The clause table, for the PR body

Abbreviations used in the table:
- MW = `frontends/shell/MANUAL-WALKTHROUGH.md`
- R01 = `RELEASE-0.1.md` (`governance/RELEASE-0.1.md` after M; the lines do not change)

The code column is at main. Where a cite in KNOWN-LIMITATIONS.md already pins the tag's line, it is named, and the tag is authoritative for a v0.1.0 claim.

| # | Clause | Code (main) | Operator evidence (row; verdict) | Observable in the shipped build |
|---|---|---|---|---|
| 1 | v0.1.0 is for Windows x64 | `frontends/shell/src-tauri/tauri.conf.json:27` (`"targets": ["nsis"]`), `:37` (`installMode` currentUser) | MW:875 (M1); R01:1262 "M1 to M4 are ok", reading R01:1266 | yes |
| 2 | open a GeoParquet file; features on the map; a summary | `frontends/shell/src/admission/AdmissionPanel.tsx:371`; `engine/src/dataset.rs:222` (`Dataset::open`) | MW:878 (M4: "A summary appears … the canvas renders"); R01:1262, R01:1266 | yes |
| 3 | verified with a file in EPSG:2056 | `engine/src/crs-catalog.json:3` (`epsg-2056`) | MW:878 (the 100k fixture, EPSG:2056); R01:1262 | yes |
| 4 | filter with a SQL condition, such as `id < 100` | `frontends/shell/src/filter/FilterPanel.tsx:107-108` (Apply), `:123` (the applied predicate shown); `engine/src/predicate.rs:482` (the condition is bound as SQL inside `SELECT 1 WHERE (…)`) | MW:879 (M5); R01:1187 ("if i filter for example id < 100"), R01:1262, reading R01:1267 | yes |
| 5 | Zoom to layer fits the map to the matching features | main: `frontends/shell/src/layout/regionParts.tsx:184`. Main's line is not the tag's; at the tag the button is `frontends/shell/src/App.tsx:1409 @ b391e43…`, per KNOWN-LIMITATIONS.md:194 | MW:888 (M14); R01:1262 ("after i filter the zoom to layer now works perfectly as intended"; "M14 I've already done it in M5"), reading R01:1267 | yes |
| 6 | fill colour and opacity, outline colour and width, the same for every feature | `frontends/shell/src/style/document.ts:112-115` (four literal fields), `:18` (literal only); `frontends/shell/src/style/StylePanel.tsx:165, :182, :194, :205` (the four controls) | MW:880 (M6); R01:1188 ("m6, the styling works fine"), stands from 998be05 per R01:1254 and R01:1272 | yes |
| 7 | hover a feature to read its `id` | `frontends/shell/src/canvas/WorkingCanvas.tsx:732`; `frontends/shell/src/canvas/HoverReadoutView.tsx:34`. Main adds the "confirming…" marker, so main's lines will not match the tag's | MW:821-822 (L7/L8, the hover row of R01:1253); R01:1262 ("Now the id hover works"), reading R01:1269 | yes |
| 8 | publish the whole file, or an area of the map, as a static interactive bundle | `frontends/shell/src/publish/PublishPanel.tsx:703` (Export interactive map…), `:764` ("Exported."); the scopes at the tag are `PublishPanel.tsx:577` and `:588 @ b391e43…`, per KNOWN-LIMITATIONS.md:194 | MW:882 (M8), MW:883 (M9); R01:1190 ("M8 is good"), R01:1191-1193 (two publishes SUCCEEDED, "a current view and a whole dataset"); stands per R01:1254 | yes |
| 9 | a dialog in which you type the destination folder's name | `frontends/shell/src/publish/PublishDialog.tsx:281` | MW:882 ("Type the destination's own final path component and confirm"); R01:1190 | yes |
| 10 | the filter is not published; a bundle cannot record one | `frontends/shell/src-tauri/src/publish.rs:118-120` (`filter: None`); tag pins at KNOWN-LIMITATIONS.md:107 (`publish.rs:108-110` and `engine/src/stream.rs:216 @ b391e43…`) | MW:882 (M8: "A filter is not carried … the dialog says so"); R01:1190 (the sentence sighted); R01:1301 (Amendment 21, the corrected reading) | yes: the dialog sentence, and the bundle's rows |
| 11 | a folder holding the data, a viewer page and a manifest | `frontends/shell/src-tauri/src/publish.rs:306-308` (the plain-outcome sentence) | MW:882; R01:1190 | yes: the dialog sentence and the folder |
| 12 | opens in a browser, with your style, once served over HTTP; the application does not serve it | `renderer/bundle-viewer/scripts/serve-bundle.mjs` (exists; lines not read); KNOWN-LIMITATIONS.md:133-139 (item 12) | MW:885 (M11); R01:1194 ("M11 works fine, just the zoom is strange"; the zoom is KNOWN-LIMITATIONS item 16); stands per R01:1254 | the browser view yes; serving needs a development checkout, which is why the clause says the app does not serve it |
| 13 | the operator ran each on the installed application; Amendment 17's re-run and stand split | R01:1185, R01:1260, R01:1253-1254 | the same | n/a (record) |
| 14 | `main` is ahead, and nothing is claimed for it | `state/directives/2026-10-29-governance-f-mapping-table-approved-open-1-to-open-10-ruled.md:17` (OPEN-8 (A)) | n/a | n/a |

Clause check of the new prose against the code, line by line:
- "for Windows x64": rows 1 and 3.
- "open … see its features … with a summary": row 2.
- "SQL condition": row 4. It is a condition, not a query; predicate.rs:482 wraps it.
- "Zoom to layer … features that match": row 5.
- "the same for every feature": row 6; document.ts:18 has no match variant.
- "hover … `id`": row 7.
- "whole file, or an area of the map": row 8. I chose "area of the map", not "current view", because of KNOWN-LIMITATIONS item 42: at v0.1.0, Current view can publish an area the map no longer shows.
- "type the destination folder's name": row 9.
- "filter is not published": row 10.
- "folder holding …": row 11.
- "opens in a browser, with your style … does not serve it": row 12.

Nothing here needs timing, a dev-only switch or an instrumented build.

## 3. What I left out, and why

**(a) Behaviour on main that v0.1.0 does not have.** It appears only as "`main` is ahead". This covers everything in KNOWN-LIMITATIONS.md's "On main since v0.1.0" section (from line 202), for example:
- points and lines (item 31);
- opening a GeoParquet 1.0/1.1 file with no `crs` key, or with a latitude-first CRS (item 2's on-main paragraph);
- files without an `id` column (item 3's on-main paragraph);
- selection, the Table, the command bar and filter cards (items 40, 45, 54);
- the hover "confirming…" marker;
- the Linux L1 level (item 1's on-main paragraph).

**(b) Clauses the record could not support, or that belong elsewhere:**
- **EPSG:3857.** It was in the v0.1.0 catalog, but no Part M row opened a 3857 file. It stays in the kept limits pointer as a catalog fact and is not claimed as verified.
- **The publish audit log (M9).** The installed app writes it, but reading it needs a development checkout (MW:883; KNOWN-LIMITATIONS item 12). It is not observable in the shipped build alone.
- **Over-ceiling refusal (M10), the declared-partial status (M7), refusals by name (no CRS, latitude first) and the settled-partial sentence under a filter (M15).** These are limits. The pointer covers them (KNOWN-LIMITATIONS items 5, 7, 2, and the unnumbered paragraph after item 15).
- **Notices (M3) and the origin pin (M12, M13).** These stay in the unchanged Local-first section. Its verdicts are in R01 Amendments 16 and 18, which the new evidence sentence names.
- **"Filter it in SQL"** is narrowed to a SQL condition (row 4).
- No performance clause, no figure, and nothing for macOS or Linux.
- **"Updated at each tag".** That is a process step, which the settlement puts in RELEASE-DAY-CHECKLIST.md, not a reader fact. I did not add it.

**(c) Documentation findings, must-fix before the merge.**
- **D1.** The current README.md:14 says MANUAL-WALKTHROUGH.md "Part M records" the run. The Part M result log is a template (MW:1389-1395; R01:1285). The draft above fixes this by pointing at R01's amendments.
- **D2.** The brief's re-pin step ("re-pins by script at the tag after checking the lines are unchanged there") will fail for at least rows 5, 7 and 8. Main's UI is not the tag's: the Map Studio frame, the confirming marker, and the M3 row now naming the Activity region and Ctrl+J (MW:877). For those rows the custodian must find the tag's own lines, not re-pin main's. Several tag pins already exist in KNOWN-LIMITATIONS.md:107 and :194. The same holds for the walkthrough rows: M8's row was corrected on 2026-10-10 (R01:1302), so the PR-body evidence cites should be pinned at b391e43, which is authoritative for a v0.1.0 claim.
- **D3.** Kept README.md:6-7 drops docs/00_Vision.md:11's "(see 02)". The italic note does not claim it is verbatim, so this is not a defect, only noted.
