#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4): EXPORT-TODAY, phase A's only step here. H4 (section 0.6) predicts that
// replacing the dataset while an export runs leaves the host's export running, takes the export panel off the screen, and says nothing. This
// step RECORDS what happens and asserts nothing (Amendment 1, A7): it starts a whole-file export of the 100k fixture through the real dialog
// (the prepare through the dev destination seam, as publish.mjs does; the phrase typed and Submit clicked as an operator would), reopens
// another fixture at once, and prints the panel, the host outcome and any export text before, after the open and after the export settles.
// If the export had already settled when the open returned, the record says so and the observation is inconclusive. Phase B adds the rest.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { attachOrLaunch, attachConsole } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const FIXTURES = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\";
const FIXTURE_100K = `${FIXTURES}100k-happy-path.parquet`;
const FIXTURE_FILTER = `${FIXTURES}filter-zoned.parquet`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The export UI as an operator sees it: the panel's text, the executing line and its Cancel, and every line of the page that names an export. */
const readExportUi = (page) =>
  page.evaluate(() => ({
    panels: document.querySelectorAll(".publish-panel").length,
    panelText: document.querySelector(".publish-panel")?.innerText ?? null,
    executing: document.querySelector(".publish-dialog-executing")?.innerText ?? null,
    cancelShown: document.querySelector(".publish-dialog-cancel-execution") !== null,
    exportLines: document.body.innerText.split("\n").filter((l) => /export|publish|bundle/i.test(l)).map((l) => l.trim()).slice(0, 12),
  }));

function auditRecords(tag) {
  const log = process.env.SPATIAL_IDE_AUDIT_LOG ?? join(process.env.LOCALAPPDATA ?? "", "spatial-ide", "audit", "publish.jsonl");
  if (!existsSync(log)) return `no audit log at ${log}`;
  const records = readFileSync(log, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const intent = records.find((r) => r.phase === "intent" && typeof r.destination === "string" && r.destination.includes(tag));
  return intent ? records.filter((r) => r.attempt === intent.attempt).map((r) => `${r.phase}:${r.outcome ?? ""}@${r.at}`) : [];
}

async function main() {
  const { browser, page, launched } = await attachOrLaunch();
  const consoleHandle = attachConsole(page);
  try {
    for (let i = 0; i < 300 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)); i += 1) await sleep(300);
    const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
    if (opened.kind !== "admitted") throw new Error(`EXPORT-TODAY: openPath(100k) returned ${JSON.stringify(opened)}`);
    for (let i = 0; i < 100 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishPrepareWithDestination === "function")); i += 1) await sleep(200);
    const parent = join(REPO_ROOT, "target", "e2e-selection-out", `export-today-${Date.now()}`);
    mkdirSync(parent, { recursive: true });
    const destination = join(parent, "bundle");
    await page.click(".publish-disclosure");
    const prepared = await page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"), destination);
    if (prepared.status !== "prompt") throw new Error(`EXPORT-TODAY: prepare returned ${JSON.stringify(prepared)}`);
    await page.fill(".publish-dialog-phrase", basename(destination));
    await page.click(".publish-dialog-submit");
    const duringExport = await readExportUi(page);
    const openCalledAt = new Date().toISOString();
    const reopened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
    const openReturnedAt = new Date().toISOString();
    const afterOpen = await readExportUi(page);
    await sleep(15_000);
    const afterWait = await readExportUi(page);
    const host = { bundleDirExists: existsSync(destination), audit: auditRecords(basename(parent)) };
    const verdict = duringExport.executing === null ? "inconclusive: the export was not executing when the open began" : "the export was executing when the open began; compare openReturnedAt with the outcome time in host.audit (whole seconds), and read afterOpen, afterWait and host";
    console.log(`[EXPORT-TODAY] OBSERVED (recorded, not asserted; fresh launch: ${launched}): ${JSON.stringify({ reopened: reopened.kind, openCalledAt, openReturnedAt, duringExport, afterOpen, afterWait, host, verdict }, null, 2)}`);
  } catch (e) {
    console.error(`[EXPORT-TODAY] harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
  }
}

await main();
