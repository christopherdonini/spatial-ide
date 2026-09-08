// Item 8 (3857 piece), the entry-51 protocol's step (2): a leaf-by-leaf comparison, keyed by EPSG
// code, between the catalog's epsg-3857 PROJJSON entry (the pinned rendering's bytes verbatim --
// spikes/item8-crs-catalog-extension/epsg3857-projinfo-9.6.2.projjson, sha256 e14b8ded...5fd82 --
// this script compares against the file directly, since the catalog entry IS that file's bytes, so
// the check can run BEFORE the catalog is touched, per the piece's brief) and the SECOND rendering,
// WKT2:2019 (epsg3857-projinfo-9.6.2.wkt2, same projinfo run, same proj.db). Unlike
// entry51-epsg2056-equivalence/compare-projjson.mjs (which walks two JSON documents to every leaf),
// WKT2 is not JSON -- this script extracts only what the piece's brief names as enough: the
// conversion parameter values keyed by their ID["EPSG",<code>], the ellipsoid, the axes, and the
// CRS/base-CRS/method EPSG ids -- by regex, tied to the specific grammar PROJ's projinfo emits for
// this CRS (read from the file, not assumed; see the file itself, checked into this directory).
//
// Exit 0 iff no numeric difference and no missing value (the entry-51 protocol's own rule).
import { readFileSync } from "node:fs";

const [projjsonPath, wkt2Path] = process.argv.slice(2);
const projjson = JSON.parse(readFileSync(projjsonPath, "utf8"));
const wkt2 = readFileSync(wkt2Path, "utf8");

// --- Extract the comparable leaf set from the PROJJSON side ------------------------------------
const fromProjjson = new Map();
fromProjjson.set("$.base_crs.id.code", projjson.base_crs.id.code);
fromProjjson.set("$.conversion.method.id.code", projjson.conversion.method.id.code);
for (const p of projjson.conversion.parameters) {
  fromProjjson.set(`$.conversion.parameters[EPSG:${p.id.code}].value`, p.value);
}
fromProjjson.set(
  "$.base_crs.datum_ensemble.ellipsoid.semi_major_axis",
  projjson.base_crs.datum_ensemble.ellipsoid.semi_major_axis
);
fromProjjson.set(
  "$.base_crs.datum_ensemble.ellipsoid.inverse_flattening",
  projjson.base_crs.datum_ensemble.ellipsoid.inverse_flattening
);
fromProjjson.set("$.coordinate_system.axis[0].direction", projjson.coordinate_system.axis[0].direction);
fromProjjson.set("$.coordinate_system.axis[1].direction", projjson.coordinate_system.axis[1].direction);
fromProjjson.set("$.id.code", projjson.id.code);

// --- Extract the same leaf set from the WKT2 side, by regex over the grammar PROJ emits --------
const fromWkt2 = new Map();

// Base CRS id: the ID[...] immediately closing BASEGEOGCRS's contents, right before CONVERSION[.
let m = /ID\["EPSG",(\d+)\]\],\s*CONVERSION\[/s.exec(wkt2);
if (m) fromWkt2.set("$.base_crs.id.code", Number(m[1]));

// Method id: the ID[...] inside METHOD[...].
m = /METHOD\["[^"]*",\s*ID\["EPSG",(\d+)\]\]/s.exec(wkt2);
if (m) fromWkt2.set("$.conversion.method.id.code", Number(m[1]));

// Parameters: PARAMETER["name",value, <ANGLEUNIT|LENGTHUNIT>[...], ID["EPSG",code]]
for (const pm of wkt2.matchAll(
  /PARAMETER\["[^"]+",([-\d.eE]+),\s*(?:ANGLEUNIT|LENGTHUNIT)\[[^\]]+\],\s*ID\["EPSG",(\d+)\]\]/gs
)) {
  fromWkt2.set(`$.conversion.parameters[EPSG:${pm[2]}].value`, Number(pm[1]));
}

// Ellipsoid: ELLIPSOID["name",semi_major_axis,inverse_flattening,
m = /ELLIPSOID\["[^"]+",([-\d.eE]+),([-\d.eE]+),/.exec(wkt2);
if (m) {
  fromWkt2.set("$.base_crs.datum_ensemble.ellipsoid.semi_major_axis", Number(m[1]));
  fromWkt2.set("$.base_crs.datum_ensemble.ellipsoid.inverse_flattening", Number(m[2]));
}

// Axes, in declared order: AXIS["name",direction, ...]
const axisMatches = [...wkt2.matchAll(/AXIS\["[^"]+",(east|west|north|south)/g)];
if (axisMatches[0]) fromWkt2.set("$.coordinate_system.axis[0].direction", axisMatches[0][1]);
if (axisMatches[1]) fromWkt2.set("$.coordinate_system.axis[1].direction", axisMatches[1][1]);

// Top-level CRS id: the LAST "ID[\"EPSG\",n]" occurrence in the document (nothing follows it).
const allIds = [...wkt2.matchAll(/ID\["EPSG",(\d+)\]/g)];
if (allIds.length > 0) fromWkt2.set("$.id.code", Number(allIds[allIds.length - 1][1]));

// --- Compare -------------------------------------------------------------------------------------
const onlyProjjson = [...fromProjjson.keys()].filter((k) => !fromWkt2.has(k));
const onlyWkt2 = [...fromWkt2.keys()].filter((k) => !fromProjjson.has(k));
const numericDiffs = [];
const stringDiffs = [];
let numericCompared = 0;
for (const [k, va] of fromProjjson) {
  if (!fromWkt2.has(k)) continue;
  const vb = fromWkt2.get(k);
  if (typeof va === "number" && typeof vb === "number") {
    numericCompared++;
    const scale = Math.max(Math.abs(va), Math.abs(vb), 1);
    if (Math.abs(va - vb) / scale > 1e-9) {
      numericDiffs.push({ path: k, catalog: va, wkt2: vb, diff: va - vb });
    }
  } else if (va !== vb) {
    stringDiffs.push({ path: k, catalog: va, wkt2: vb });
  }
}

// Every leaf this script extracts is a defining value (a parameter value, an ellipsoid value, an
// axis direction, or an EPSG id) -- unlike compare-projjson.mjs's whole-document walk, there is no
// separate "usage metadata" category here to exclude, so a missing value on either side counts.
const missingValues = [...onlyProjjson, ...onlyWkt2];

console.log(`numeric leaves compared: ${numericCompared}`);
console.log(`numeric differences (> 1e-9 relative): ${numericDiffs.length}`);
for (const d of numericDiffs) {
  console.log(`  ${d.path}: catalog=${d.catalog} wkt2=${d.wkt2} diff=${d.diff}`);
}
console.log(`string/other differences on shared paths: ${stringDiffs.length}`);
for (const d of stringDiffs) {
  console.log(`  ${d.path}: catalog=${JSON.stringify(d.catalog)} wkt2=${JSON.stringify(d.wkt2)}`);
}
console.log(`paths only in the catalog (PROJJSON) extraction: ${onlyProjjson.length}`);
for (const k of onlyProjjson) console.log(`  ${k} = ${JSON.stringify(fromProjjson.get(k))}`);
console.log(`paths only in the WKT2 extraction: ${onlyWkt2.length}`);
for (const k of onlyWkt2) console.log(`  ${k} = ${JSON.stringify(fromWkt2.get(k))}`);
console.log(`parameter/ellipsoid/axis/id VALUE paths missing on one side: ${missingValues.length}`);
for (const k of missingValues) console.log(`  ${k}`);

const ok = numericDiffs.length === 0 && missingValues.length === 0;
console.log(
  ok
    ? "RESULT: numerically equivalent on every shared leaf; no parameter/ellipsoid/axis/id value missing"
    : "RESULT: NOT equivalent (see above)"
);
process.exit(ok ? 0 : 1);
