# Entry 51 (3) — numeric equivalence of the shipped EPSG:2056 PROJJSON against PROJ's rendering

*Diagnosis-class check, 2026-09-07, under `DECISIONS-PENDING.md` entry 51's ruling ("(3) runs
FIRST because its outcome decides what (1)/(2) may honestly say"; the bracketed authorization to use
`projinfo` with the PROJ version pinned). Written record beside `DEPENDENCY-LICENSES.md`'s
"Third-party data terms" section, which carries the conclusion. Not legal advice — ADR-009's Caveat.*

## Method

- **Shipped document:** `engine/tests/data/epsg2056.projjson` (2,165 bytes, sha256
  `254016888ff494a4099d72869206eaf4a8c1ef5a52fb94104540557c2f46d024`, the value
  `crs_catalog::tests::EPSG_2056_HASH` pins; the same bytes are `engine/src/crs-catalog.json`'s
  `epsg-2056` entry per ADR-026 line 76).
- **Reference document:** `epsg2056-projinfo-9.6.2.projjson` (this directory) — the output of
  `projinfo EPSG:2056 -o PROJJSON -q` from the PROJ bundled with QGIS 3.44.2 on the reference machine
  (`C:\Program Files\QGIS 3.44.2\bin\projinfo.exe`, `PROJ_LIB` = its `share\proj`). Versions read
  from the tool and its database, not assumed: `proj.exe` banner `Rel. 9.6.2, June 4th, 2025`;
  `proj.db` `metadata` table: `PROJ.VERSION = 9.6.2`, `EPSG.VERSION = v12.013`,
  `EPSG.DATE = 2025-05-26`, `DATABASE.LAYOUT.VERSION.MAJOR/MINOR = 1/5`, `PROJ_DATA.VERSION = 1.22`;
  `proj.db` sha256 `bed2038313d580a68602fccdf91d9c7636d3c4754e1b985743fab0ff4418a2b2`.
- **Comparison:** `compare-projjson.mjs` (this directory) — walks both documents to every leaf,
  keys `parameters[]` entries by their EPSG code (the registry renamed two parameters between
  dataset versions; the code is the stable identity), compares every shared numeric leaf at 1e-9
  relative tolerance, and lists paths present on one side only and parameter/ellipsoid VALUE paths
  missing on either side. Exit 0 iff no numeric difference and no missing value.

## Output, verbatim

```
numeric leaves compared: 19
numeric differences (> 1e-9 relative): 0
string/other differences on shared paths: 3
  $.$schema: shipped="https://proj.org/schemas/v0.5/projjson.schema.json" reference="https://proj.org/schemas/v0.7/projjson.schema.json"
  $.conversion.parameters[EPSG:8813].name: shipped="Azimuth of initial line" reference="Azimuth at projection centre"
  $.conversion.parameters[EPSG:8815].name: shipped="Scale factor on initial line" reference="Scale factor at projection centre"
paths only in shipped: 0
paths only in reference: 7
  $.base_crs.type = "GeographicCRS"
  $.scope = "Cadastre, engineering survey, topographic mapping (large and medium scale)."
  $.area = "Liechtenstein; Switzerland."
  $.bbox.south_latitude = 45.81
  $.bbox.west_longitude = 5.95
  $.bbox.north_latitude = 47.81
  $.bbox.east_longitude = 10.5
parameter/ellipsoid VALUE paths missing on one side: 0
RESULT: numerically equivalent on every shared numeric leaf; no parameter/ellipsoid value missing
```

Shipped parameter list (EPSG code | name | value unit): 8811 | Latitude of projection centre |
46.9524055555556 degree · 8812 | Longitude of projection centre | 7.43958333333333 degree · 8813 |
Azimuth of initial line | 90 degree · 8814 | Angle from Rectified to Skew Grid | 90 degree · 8815 |
Scale factor on initial line | 1 unity · 8816 | Easting at projection centre | 2600000 metre · 8817 |
Northing at projection centre | 1200000 metre. Ellipsoid Bessel 1841: a 6377397.155, 1/f
299.1528128. Axes Easting/E/east/metre, Northing/N/north/metre. Ids: CRS EPSG:2056, base CRS
EPSG:4150, method EPSG:9815 (Hotine Oblique Mercator (variant B)).

## Reading (the custodian's; counsel is the bar for anything stronger)

- **Numerically equivalent** to PROJ 9.6.2's rendering of EPSG dataset v12.013 on every defining
  parameter, the ellipsoid and the axes. No value differs; no defining value is missing.
- The three textual differences are not value modifications: a PROJJSON schema version; two
  parameter **names** that the EPSG registry itself changed for codes 8813/8815 (the shipped names
  are EPSG's earlier names for the same codes); and usage metadata (`scope`, `area`, `bbox`,
  `base_crs.type`) the shipped file omits — none of which is a parameter value.
- **Caveat, declared:** the reference is PROJ's import of the EPSG dataset, not the registry read
  directly. A registry-direct spot-check of the seven values on epsg.org remains available to the
  human as a stronger confirmation; the ruling's bracketed authorization accepted the PROJ route.
- **Branch taken (entry 51's own words):** equivalent → the attribution may call it EPSG data, with
  the IOGP ownership acknowledgement and the terms' URL. The (1)+(2) piece receives one conscious
  choice: align the two parameter names to v12.013's, or keep them and state the dataset version
  they came from (the production command for the shipped file is unrecorded).

## Not done here

No repository file outside this directory and `DEPENDENCY-LICENSES.md`'s note changed; the
attribution, the terms notice and any catalog/fixture edit are the reviewer-gated (1)+(2) piece.
