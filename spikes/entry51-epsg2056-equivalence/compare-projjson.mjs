// Entry 51 (3): numeric-equivalence comparison of the shipped EPSG:2056 PROJJSON against an
// independent PROJJSON rendering of the same code (PROJ's projinfo, version recorded by the caller).
// Walks both documents, collects every numeric leaf with its JSON path, and reports: paths present in
// one but not the other, numeric leaves that differ (with the absolute difference), and every EPSG
// id/code + method/parameter/axis/unit name for a structural side-by-side. Exit 0 iff all numeric
// leaves shared by both documents are equal within 1e-9 relative and no parameter/ellipsoid value is
// missing on either side.
import { readFileSync } from "node:fs";

const [shippedPath, referencePath] = process.argv.slice(2);
const shipped = JSON.parse(readFileSync(shippedPath, "utf8"));
const reference = JSON.parse(readFileSync(referencePath, "utf8"));

function leaves(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => {
      // Parameters are keyed by their EPSG code when they carry one (the registry renamed 8813 and
      // 8815 between dataset versions; the code is the stable identity), else by name, else by index.
      const code = v && typeof v === "object" && v.id && v.id.authority === "EPSG" && typeof v.id.code === "number" && path.endsWith(".parameters") ? `[EPSG:${v.id.code}]` : null;
      const label = code ?? (v && typeof v === "object" && typeof v.name === "string" ? `[${v.name}]` : `[${i}]`);
      leaves(v, `${path}${label}`, out);
    });
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) leaves(v, `${path}.${k}`, out);
  } else {
    out.set(path, node);
  }
}

const a = new Map();
const b = new Map();
leaves(shipped, "$", a);
leaves(reference, "$", b);

const onlyA = [...a.keys()].filter((k) => !b.has(k));
const onlyB = [...b.keys()].filter((k) => !a.has(k));
const numericDiffs = [];
const stringDiffs = [];
let numericCompared = 0;
for (const [k, va] of a) {
  if (!b.has(k)) continue;
  const vb = b.get(k);
  if (typeof va === "number" && typeof vb === "number") {
    numericCompared++;
    const scale = Math.max(Math.abs(va), Math.abs(vb), 1);
    if (Math.abs(va - vb) / scale > 1e-9) numericDiffs.push({ path: k, shipped: va, reference: vb, diff: va - vb });
  } else if (va !== vb) {
    stringDiffs.push({ path: k, shipped: va, reference: vb });
  }
}

const isValuePath = (k) => /\.parameters\[[^\]]+\]\.value$|\.ellipsoid\.(semi_major_axis|inverse_flattening|semi_minor_axis)$/.test(k);
const missingValues = [...onlyA, ...onlyB].filter(isValuePath);

console.log(`numeric leaves compared: ${numericCompared}`);
console.log(`numeric differences (> 1e-9 relative): ${numericDiffs.length}`);
for (const d of numericDiffs) console.log(`  ${d.path}: shipped=${d.shipped} reference=${d.reference} diff=${d.diff}`);
console.log(`string/other differences on shared paths: ${stringDiffs.length}`);
for (const d of stringDiffs) console.log(`  ${d.path}: shipped=${JSON.stringify(d.shipped)} reference=${JSON.stringify(d.reference)}`);
console.log(`paths only in shipped: ${onlyA.length}`);
for (const k of onlyA) console.log(`  ${k} = ${JSON.stringify(a.get(k))}`);
console.log(`paths only in reference: ${onlyB.length}`);
for (const k of onlyB) console.log(`  ${k} = ${JSON.stringify(b.get(k))}`);
console.log(`parameter/ellipsoid VALUE paths missing on one side: ${missingValues.length}`);
for (const k of missingValues) console.log(`  ${k}`);

const ok = numericDiffs.length === 0 && missingValues.length === 0;
console.log(ok ? "RESULT: numerically equivalent on every shared numeric leaf; no parameter/ellipsoid value missing" : "RESULT: NOT equivalent (see above)");
process.exit(ok ? 0 : 1);
