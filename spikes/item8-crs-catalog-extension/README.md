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

## 3. Not done here

No catalog, engine, kernel, renderer or shell file changed. The leaf-by-leaf comparison of the 3857
PROJJSON against its WKT2 rendering (the preregistration's step (2)) is the 3857 piece's own step and
is recorded beside this file by that piece, with its verbatim output.
