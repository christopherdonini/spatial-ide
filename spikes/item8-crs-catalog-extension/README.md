# Item 8 (release cut) — EPSG:3857 and EPSG:4326 renderings, and the GeoParquet axis-order rule, pinned

*Record-class, 2026-09-08, the successor of `spikes/entry51-epsg2056-equivalence/` named by
`RELEASE-0.1.md` Amendment 6's item-8 preregistration. Written by the custodian BEFORE any code, so
that the external facts item 8 rests on are in the tree verbatim (the entry-51 discipline, the
architect's consult of 2026-09-08 §"Unpinned external fact"). Not legal advice — ADR-009's Caveat.*

## 1. The renderings (same tool, same database as entry 51)

Generated with the PROJ bundled with QGIS 3.44.2 on the reference machine
(`C:\Program Files\QGIS 3.44.2\bin\projinfo.exe`), the SAME `proj.db` entry 51 recorded — its sha256
recomputed today is `bed2038313d580a68602fccdf91d9c7636d3c4754e1b985743fab0ff4418a2b2`, identical to
entry 51's, so entry 51's versions hold unchanged: `PROJ.VERSION = 9.6.2`, `EPSG.VERSION = v12.013`,
`EPSG.DATE = 2025-05-26`. `projinfo` on Windows writes CRLF; the files are stored with LF line endings (the
`.gitattributes` `*.projjson text eol=lf` pin normalises them anyway), and the sizes and hashes below are of
the LF bytes as committed — the CRLF originals differ by exactly the count of lines.

| file | command | bytes (LF) | sha256 (LF bytes) |
|---|---|---|---|
| `epsg3857-projinfo-9.6.2.projjson` | `projinfo EPSG:3857 -o PROJJSON -q` | 3,921 | `e14b8ded808e73d3925c3b7a16cc83c2273056a79c00d7ba86c0e5b3b475fd82` |
| `epsg3857-projinfo-9.6.2.wkt2` | `projinfo EPSG:3857 -o WKT2:2019 -q` | 1,812 | `9bd0db6b49ad8da759ea5e91fdb07eb2797416325e06639ffeb045216cc323d7` |
| `epsg4326-projinfo-9.6.2.projjson` | `projinfo EPSG:4326 -o PROJJSON -q` | 2,248 | `6de05eac39369c25d6a2ea4ca14946d633e689a54fa891253d53150d1cf01a66` |
| `epsg4326-projinfo-9.6.2.wkt2` | `projinfo EPSG:4326 -o WKT2:2019 -q` | 1,101 | `c43fffe9eaa724c2b0ab951a65d20d448dd71eeca318d8be0b72e58d2f2d05d0` |

Facts read from the files (not from memory):

- **EPSG:3857** — `$schema` v0.7; `ProjectedCRS` "WGS 84 / Pseudo-Mercator"; base CRS EPSG:4326 with a
  `datum_ensemble` (ellipsoid WGS 84, a 6378137, 1/f 298.257223563); conversion "Popular Visualisation
  Pseudo-Mercator", method EPSG:1024; parameters 8801 Latitude of natural origin 0 degree, 8802
  Longitude of natural origin 0 degree, 8806 False easting 0 metre, 8807 False northing 0 metre; axes
  **Easting/X/east/metre, Northing/Y/north/metre** — an x-first order, which the engine's reader types
  as `AxisOrder::EastingNorthing` (`engine/src/geoparquet.rs:159-189`) and the bundle viewer accepts
  (`renderer/bundle-viewer/src/partition.ts:29`).
- **EPSG:4326** — `$schema` v0.7; `GeographicCRS` "WGS 84"; `datum_ensemble` (same ellipsoid); axes
  **Geodetic latitude/Lat/north/degree, Geodetic longitude/Lon/east/degree** — a latitude-first order,
  which the engine types as `AxisOrder::LatitudeLongitude` and then REFUSES at `Dataset::open`
  (`engine/src/dataset.rs:303-307`, `EngineError::AxisOrderUnsupported`; ADR-015 §5; the slice test
  `engine/tests/slice.rs:310-324`). This is why the 4326 half of item 8 cannot be built as
  preregistered — DECISIONS-PENDING entry 59.

The catalog's existing entry is `$schema` v0.5 (`engine/tests/data/epsg2056.projjson:2`) and uses
`datum`; the two new renderings are v0.7 with `datum_ensemble`. The engine's reader reads only `id`
and `coordinate_system.axis`, so neither difference touches admission; a catalog that mixes schema
versions must say so per entry rather than claim a reader verification (the consult's §5.2).

**Engine test fixture (fix batch, 2026-09-08).** `engine/tests/data/epsg3857.projjson` is a
byte-for-byte copy of `epsg3857-projinfo-9.6.2.projjson` above — same 3,921 LF bytes, same sha256
`e14b8ded808e73d3925c3b7a16cc83c2273056a79c00d7ba86c0e5b3b475fd82` — checked in beside
`engine/tests/data/epsg2056.projjson` so `crs_catalog.rs` carries an UNGATED test binding the
catalog's `epsg-3857` definition to this rendering by byte equality, with no engine→spikes build
dependency (the engine's own copy is the one the test reads; this directory's copy is the rendering
record).

## 2. The GeoParquet specification's axis-order rule, verbatim

Source: <https://geoparquet.org/releases/v1.1.0/>, retrieved 2026-09-08T07:29Z with `curl` (the
fetched page, 29,521 bytes, sha256 `04074ef1b25cc53936850b581e5783787df13d87cca796680a51d92a99c3302d`,
kept in the job's temporary directory, not in the tree). Two passages, copied from the page's text
without alteration:

> **Coordinate axis order** — The axis order of the coordinates in WKB stored in a GeoParquet follows
> the de facto standard for axis order in WKB and is therefore always (x, y) where x is easting or
> longitude and y is northing or latitude. This ordering explicitly overrides the axis order as
> specified in the CRS. This follows the precedent of GeoPackage, see the note in their spec.

> Note: EPSG:4326 and OGC:CRS84 are equivalent with respect to this specification because this
> specification specifically overrides the coordinate axis order in the crs to be longitude-latitude.

(The heading "Coordinate axis order" is the page's own section title, joined to its paragraph here
with an em dash; the words after it are the page's, unchanged. "see the note in their spec" is a
hyperlink on the page.)

What this record does NOT establish: that any given producer honours the rule (a violating producer
transposes silently — a falsification check can convict, never confirm conformance, the consult's
§1), or that the engine may act on it — that is ADR-015 §5's territory and the human's decision
(entry 59; the ADR-032 skeleton the architect drafted).

## 3. The entry-51 protocol's leaf-by-leaf comparison, recorded (the 3857 piece, 2026-09-08)

*Retitled from "Not done here" — the comparison this section originally deferred to "the 3857
piece's own step" IS this piece, run before any catalog edit. The custodian's dispatch brief, not
in the tree, asked that if anything differed here, the piece stop and report before touching the
catalog.*

**Method.** `compare-3857.mjs` (this directory) compares the catalog's `epsg-3857` entry — which
is `epsg3857-projinfo-9.6.2.projjson`'s bytes verbatim, so the comparison runs directly against that
file, before the catalog was touched — against the SECOND rendering,
`epsg3857-projinfo-9.6.2.wkt2` (WKT2:2019, same `projinfo` run, same `proj.db`, §1 above). Unlike
`entry51-epsg2056-equivalence/compare-projjson.mjs` (two JSON documents, walked to every leaf),
WKT2 is not JSON: the script extracts, by regex tied to the grammar PROJ's `projinfo` emits for this
CRS, what the custodian's dispatch brief, not in the tree, named as enough — the four conversion
parameter values keyed by their `ID["EPSG",<code>]`, the ellipsoid's two defining values, the two
axis directions, and the three EPSG ids (base CRS, method, CRS) — and compares each against the
same leaf read out of the PROJJSON side. Exit 0 iff no numeric difference and no missing value (the
entry-51 protocol's own rule — `spikes/entry51-epsg2056-equivalence/README.md:25`).

**Command:**
```
node spikes/item8-crs-catalog-extension/compare-3857.mjs spikes/item8-crs-catalog-extension/epsg3857-projinfo-9.6.2.projjson spikes/item8-crs-catalog-extension/epsg3857-projinfo-9.6.2.wkt2
```

**Output, verbatim:**
```
numeric leaves compared: 9
numeric differences (> 1e-9 relative): 0
string/other differences on shared paths: 0
paths only in the catalog (PROJJSON) extraction: 0
paths only in the WKT2 extraction: 0
parameter/ellipsoid/axis/id VALUE paths missing on one side: 0
RESULT: numerically equivalent on every shared leaf; no parameter/ellipsoid/axis/id value missing
```
Exit code: 0.

**Reading (the custodian's; counsel is the bar for anything stronger, ADR-009's Caveat).**
Numerically equivalent on every leaf the script extracts: both EPSG ids (base CRS 4326, method
1024, CRS 3857) agree; all four conversion parameter values (8801/8802/8806/8807, all `0`) agree;
the ellipsoid (WGS 84: semi-major axis 6378137, inverse flattening 298.257223563) agrees; both axis
directions (east, north — an x-first order) agree. Nothing is missing on either side. No value
differs. This is a narrower check than entry 51's whole-document walk (deliberately — the WKT2 side
is extracted, not parsed, per the custodian's dispatch brief, not in the tree), so it does not
re-confirm the PROJJSON side's own usage metadata (`scope`, `area`, `bbox`) or member-ensemble
names — those have WKT2 counterparts (`USAGE[SCOPE/AREA/BBOX]` at
`epsg3857-projinfo-9.6.2.wkt2:40-43`, `MEMBER[…]` at `:4-11`) but carry no defining value, so this
script does not extract them.

**What this equivalence does and does not establish (fix batch, review pass 2, architect B1).**
Numeric equivalence to EPSG v12.013 *as PROJ imports it* holds BY CONSTRUCTION here, not by virtue
of this check: the catalog's `epsg-3857` definition IS `epsg3857-projinfo-9.6.2.projjson`'s bytes
verbatim (§1's table), so the two sides being compared can only ever agree with what PROJ rendered
in the first place — the drift risk entry 51's comparison was written against (a shipped value of
unrecorded, possibly hand-authored or independently-rounded, origin silently diverging from the
registry — entry-51's own "the production command for the shipped file is unrecorded",
`spikes/entry51-epsg2056-equivalence/README.md:71`) does not exist for this entry. What §3's script
actually checks is that PROJJSON and WKT2 — two different serializations `projinfo` emits from the
SAME `proj.db` row in the SAME run — are consistent with each other: a cross-format consistency
check of the same rows, not an independent confirmation that either serialization matches the
registry. PROJ's import of the EPSG dataset versus the registry itself remains unverified by this
record, exactly as it was for 2056 (entry-51's own Caveat, above): the 3857 piece's own
preregistration says the same of this entry — "the human's epsg.org lookup remains the stronger
confirmation, available at sight" (`RELEASE-0.1.md`'s EPSG:3857 piece preregistration item (2),
`RELEASE-0.1.md:988-990`).

**RESULT: PASS — proceed with the catalog entry** (the entry-51 protocol's own gate, quoted in this
section's Method above: "Exit 0 iff no numeric difference and no missing value" —
`spikes/entry51-epsg2056-equivalence/README.md:25`. The custodian's dispatch brief, not in the
tree, asked that if anything differed, the piece stop and report before touching the catalog.) The
catalog gained `epsg-3857` after this check passed, per this piece's report.

Not done here: no engine, kernel, renderer or shell file changed by this section — the catalog edit
itself, its pinned-literal tests, and the count-site updates are recorded in this piece's own report
(`git log`, `crs_catalog.rs`), not duplicated into this spike file.
