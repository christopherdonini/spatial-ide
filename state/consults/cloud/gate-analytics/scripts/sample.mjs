// sample.mjs — draws the fixed samples the session read by hand to measure the heuristics' precision.
//
//   node state/consults/cloud/gate-analytics/scripts/sample.mjs rules     # up to 6 matches per top-15 rule
//   node state/consults/cloud/gate-analytics/scripts/sample.mjs reports   # 12 reports read while tuning the parser
//   node state/consults/cloud/gate-analytics/scripts/sample.mjs holdout   # 8 further reports, read after the last parser change
//   node state/consults/cloud/gate-analytics/scripts/sample.mjs unmatched # 24 findings no rule matched, for the catalogue's misses
//
// The draw is deterministic: items are ordered by the sha256 of their key, so a re-run draws the same sample from
// the same data. The judgments are recorded in data/precision-judgments.json, not computed.

import { createHash } from 'node:crypto';
import { read } from './lib.mjs';

const h = (s) => createHash('sha256').update(s).digest('hex');
const mode = process.argv[2];

if (mode === 'rules') {
  const d = JSON.parse(read('state/consults/cloud/gate-analytics/data/rule-hits.json'));
  const count = {};
  for (const x of d.hits) for (const r of x.rules) count[r.id] = (count[r.id] || 0) + 1;
  const top = Object.entries(count).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 15).map(([id]) => id);
  for (const id of top) {
    const hits = d.hits
      .map((x) => ({ x, r: x.rules.find((r) => r.id === id) }))
      .filter((p) => p.r)
      .sort((a, b) => h(`${id}|${a.x.report}|${a.x.label}`).localeCompare(h(`${id}|${b.x.report}|${b.x.label}`)))
      .slice(0, 6);
    for (const { x, r } of hits) console.log(`${id}\t${r.how}\t${x.report}\t${x.label}\t${x.title.slice(0, 200)}`);
  }
} else if (mode === 'reports') {
  const reps = JSON.parse(read('state/consults/cloud/gate-analytics/data/reports.json'));
  const pick = reps
    .filter((r) => r.entry != null && r.bytes < 9000)
    .sort((a, b) => h(a.report).localeCompare(h(b.report)))
    .slice(0, 12);
  for (const r of pick) console.log(`${r.report}\t${r.verdict}\t${r.bytes}`);
} else if (mode === 'holdout') {
  const reps = JSON.parse(read('state/consults/cloud/gate-analytics/data/reports.json'));
  const pick = reps
    .filter((r) => r.entry != null && r.bytes < 7000)
    .sort((a, b) => h(`holdout|${a.report}`).localeCompare(h(`holdout|${b.report}`)))
    .slice(0, 8);
  for (const r of pick) console.log(`${r.report}\t${r.verdict}\t${r.bytes}`);
}
else if (mode === 'unmatched') {
  const d = JSON.parse(read('state/consults/cloud/gate-analytics/data/rule-hits.json'));
  const pick = d.hits
    .filter((x) => !x.rules.length)
    .sort((a, b) => h(`unmatched|${a.report}|${a.label}`).localeCompare(h(`unmatched|${b.report}|${b.label}`)))
    .slice(0, 24);
  for (const x of pick) console.log(`${x.report}\t${x.label}\t${x.cls}\t${x.title.slice(0, 220)}`);
}
