// Live mechanism probe for the close-out fix (F1): with a STATIC camera at an over-budget
// zoom-out, no tile admitted in this view may be evicted in this same view (the human-visible
// thrash: "renders for half a second, then disappears"). Diagnosis-class, attaches to the running
// instance; NOT the preregistered harness assertion (which stays wired at zoom-out-1).
import { attachOrLaunch } from "../../frontends/shell/e2e/lib.mjs";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Paths are relative to this script (entry 49 fix-forward, 2026-09-07: the original carried an
// absolute worktree import and a tool-internal output path; the recorded run's evidence is the
// `probe-thrash.json` beside this file).
const FIXTURE = fileURLToPath(new URL("../../target/fixtures/slice-budgets/polygons-100k.parquet", import.meta.url));
const OUT = fileURLToPath(new URL("./probe-thrash.json", import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { page, launched, stop } = await attachOrLaunch({ timeoutMs: 120_000 });
console.log(`attached (launched=${launched})`);
const events = []; // {t, kind, payload}
const t0 = Date.now();
page.on("console", async (msg) => {
  try {
    const args = msg.args();
    if (args.length < 3) return;
    const tag = await args[0].jsonValue();
    if (tag !== "[render-trace]") return;
    const kind = await args[1].jsonValue();
    if (kind !== "tile-ingest" && kind !== "candidate-residency-status" && kind !== "covering-truncated") return;
    const payload = await args[2].jsonValue();
    events.push({ t: Date.now() - t0, kind, payload });
  } catch { /* handle detached mid-read */ }
});

async function status() {
  return page.evaluate(async () => {
    const el = document.querySelector(".residency-status");
    const q = await window.__SPATIAL_E2E__.residencyQueuedTileCount();
    const arm = await window.__SPATIAL_E2E__.getResidencyArm();
    return { text: el ? el.textContent : null, queued: q, arm };
  });
}

try {
  await page.reload();
  await page.waitForFunction(() => !!window.__SPATIAL_E2E__?.setResidencyArm, null, { timeout: 60_000 });
  const arm = await page.evaluate(async () => ({
    a: await window.__SPATIAL_E2E__.setResidencyArm("candidate"),
    l: await window.__SPATIAL_E2E__.setResidencyTileSizeLevel("fine"),
  }));
  if (!arm.a?.ok || !arm.l?.ok) throw new Error("arming failed: " + JSON.stringify(arm));
  await page.evaluate(async (p) => await window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  await sleep(12_000);
  console.log("after open:", JSON.stringify(await status()));

  await page.click(".zoom-to-layer");
  await sleep(25_000);
  console.log("after zoom-to-layer:", JSON.stringify(await status()));

  const canvas = await page.locator("canvas").first().boundingBox();
  await page.mouse.move(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 600); await sleep(1200); }
  const zoomOutSettleStart = Date.now() - t0;
  await sleep(8_000); // let the debounced plan land and the first admissions arrive
  const windowStart = Date.now() - t0; // STATIC-CAMERA WINDOW begins
  await sleep(45_000);
  const windowEnd = Date.now() - t0;
  const final = await status();

  const inWin = events.filter((e) => e.t >= windowStart && e.t <= windowEnd);
  const admitted = new Set();
  const evicted = [];
  let overBudgetSeen = false;
  for (const e of inWin) {
    if (e.kind === "tile-ingest") {
      if ((e.payload.rowsAdmitted ?? 0) > 0) admitted.add(e.payload.tileKey);
      for (const k of e.payload.evictedTileKeys ?? []) evicted.push({ t: e.t, key: k });
      if (e.payload.overBudget) overBudgetSeen = true;
    }
    if (e.kind === "candidate-residency-status" && e.payload.overBudget) overBudgetSeen = true;
  }
  const thrash = evicted.filter((ev) => admitted.has(ev.key));
  const summary = {
    fixBranch: "cut/residency-debt-fix @ 453a667",
    zoomOutSettleStart, windowStart, windowEnd,
    eventsInWindow: inWin.length,
    tilesAdmittedInWindow: admitted.size,
    evictionsInWindow: evicted.length,
    thrashEvictions_admittedThenEvictedSameView: thrash.length,
    thrashSample: thrash.slice(0, 10),
    overBudgetSeenInWindow: overBudgetSeen,
    finalStatus: final,
    truncations: events.filter((e) => e.kind === "covering-truncated").map((e) => e.payload),
  };
  console.log("SUMMARY", JSON.stringify(summary, null, 1));
  writeFileSync(OUT, JSON.stringify({ summary, events }, null, 1));
} finally {
  // Leave the app running for the human's / harness's further use; only detach.
  try { await page.context().browser()?.close?.(); } catch {}
  console.log("detached");
}
