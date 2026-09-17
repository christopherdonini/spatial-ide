// site.mjs — the landing page. These tests cover DRAFT-4's "Bugs first" list (items 1–5):
// health from the wrong place, the "loading…" list, labels glued to titles, exposed node ids,
// and unlabelled dates.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlan } from './plan.mjs';
import { renderSite, checkSiteDrift, shippedRecently, readBuildHealth, readVerifyQuotesBaselineCount, REPO_ROOT } from './site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, 'fixtures');
const REPO = 'owner/repo';

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/** Visible text: every tag removed outright, so attribute values disappear with their tag. */
function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, '');
}

function fixturePlan() {
  return loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
}

const BUGS_PLAN = `version: 1
priorities_approved: true
lanes:
  - {id: a, title: "Lane A", priority: 1}
  - {id: b, title: "Lane B", priority: 2}
phases:
  - {id: prototype, title: "Prototype", cite: "docs/07_Roadmap.md ## Prototype"}
nodes:
  - id: released-by-tag
    title: "Cut the release"
    lane: a
    phase: prototype
    status: done
    order: 1
    depends_on: []
    needs_human: {kind: none, minutes: 0}
    gate: none
    evidence: {tag: "v0.1.0"}
    dates: {opened: 2026-09-01, done: 2026-09-13}
  - id: landed-by-pr
    title: "Landed by a pull request"
    lane: a
    phase: prototype
    status: done
    order: 2
    depends_on: []
    needs_human: {kind: none, minutes: 0}
    gate: none
    evidence: {pr: 12}
    dates: {opened: 2026-09-01, done: 2026-09-12}
  - id: old-news
    title: "Landed long ago"
    lane: a
    phase: prototype
    status: done
    order: 3
    depends_on: []
    needs_human: {kind: none, minutes: 0}
    gate: none
    evidence: {pr: 3}
    dates: {opened: 2026-07-01, done: 2026-08-01}
  - id: waits-unestimated
    title: "Part O — sitting"
    lane: a
    phase: prototype
    status: blocked
    order: 4
    depends_on: []
    needs_human: {kind: sitting, minutes: 0}
    gate: none
    evidence: null
    dates: {opened: 2026-09-10, done: null}
  - id: waits-estimated
    title: "ADR acceptances"
    lane: a
    phase: prototype
    status: blocked
    order: 5
    depends_on: []
    needs_human: {kind: ruling, minutes: 20}
    gate: none
    evidence: null
    dates: {opened: 2026-09-11, done: null}
  - id: cross-lane-dependent
    title: "Waits on the other lane"
    lane: b
    phase: prototype
    status: blocked
    order: 1
    depends_on: [landed-by-pr]
    needs_human: {kind: none, minutes: 0}
    gate: none
    evidence: null
    dates: {opened: 2026-09-11, done: null}
`;

function bugsPlan() {
  const dir = makeTempDir('site-bugs-plan-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.writeFileSync(planPath, BUGS_PLAN, 'utf8');
  return { plan: loadPlan(planPath), planPath, dir };
}

function renderBugs(overrides = {}) {
  const { plan } = bugsPlan();
  return renderSite(plan, null, { repoSlug: REPO, generatedAt: '2026-09-14T00:00:00Z', ...overrides }).html;
}

const BUILD_HEALTH = {
  built_at: '2026-09-14T10:00:00Z',
  source: 'GitHub API at Pages build time',
  repo: REPO,
  ci: {
    auth: 'token',
    conclusion: 'success',
    status: 'completed',
    head_sha: 'abc',
    created_at: '2026-09-14T09:00:00Z',
    html_url: 'https://github.com/owner/repo/actions/runs/1',
    workflows: ['product-ci-rust.yml', 'product-ci-viewer.yml', 'product-ci-shell.yml'].map((workflow) => ({
      workflow,
      auth: 'token',
      conclusion: 'success',
      status: 'completed',
      head_sha: 'abc',
      created_at: '2026-09-14T09:00:00Z',
      html_url: 'https://github.com/owner/repo/actions/runs/1',
    })),
  },
  open_prs: {
    auth: 'token',
    count: 2,
    oldest: { number: 47, created_at: '2026-09-04T00:00:00Z', age_days: 10, html_url: 'https://github.com/owner/repo/pull/47' },
  },
  latest_release: {
    auth: 'token',
    tag_name: 'v0.1.0',
    published_at: '2026-09-13T18:00:00Z',
    html_url: 'https://github.com/owner/repo/releases/tag/v0.1.0',
    prerelease: true, // as v0.1.0 actually is
  },
};

const MACHINE_HEALTH = {
  generated_at: '2026-09-13T21:45:51.389Z',
  source: "the custodian's machine",
  drift: { ok: true, failures: [] },
  disk_free: {
    drives: [
      { drive: 'C', bytes: 10794078208, total: 250000000000 },
      { drive: 'D', bytes: 500000000000, total: 1000000000000 },
    ],
  },
  stray_processes: { total: 2, by_name: { cargo: 0, node: 2, 'spatial-ide-shell': 0 } },
  waiting_on_human: [{ id: 'n-waiting-sight', kind: 'sight', minutes: 15, opened: '2026-09-13', age_days: 0 }],
  median_opened_to_done: { days: 3, n: 12 },
  gate_first_pass: { present: true, nodes: 3, first_pass: 2, rate: 2 / 3 },
};

// ---------------------------------------------------------------- bug 1: health from two sources

test('bug 1: the strip renders two labelled groups, each with its own timestamp', () => {
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, {
    repoSlug: REPO,
    generatedAt: '2026-09-14T00:00:00Z',
    buildHealth: BUILD_HEALTH,
  });

  const buildHeading = html.indexOf("From GitHub's API at Pages build time — built 2026-09-14T10:00:00Z");
  const machineHeading = html.indexOf("From the custodian's machine — refreshed 2026-09-13T21:45:51.389Z");
  assert.ok(buildHeading > 0, 'the build-time group heading carries built_at');
  assert.ok(machineHeading > buildHeading, 'the machine group heading carries its own generated_at');

  // Build-time rows sit under the build-time heading; machine rows under the machine heading.
  for (const label of ['CI on main', 'Open PRs', 'Latest release']) {
    const at = html.indexOf(`<span>${label}</span>`);
    assert.ok(at > buildHeading && at < machineHeading, `${label} belongs to the build-time group`);
  }
  for (const label of ['Drift', 'Disk free', 'Stray processes', 'Waiting on human', 'Median opened→done', 'Gate first-pass']) {
    const at = html.indexOf(`<span>${label}</span>`);
    assert.ok(at > machineHeading, `${label} belongs to the machine group`);
  }

  // Each build-time fact links to its own source. An all-green suite has no single red run to link,
  // so the CI row is plain text naming the pass count; open PRs and the release still link.
  assert.ok(html.includes('<span>CI on main</span><span>all green (3/3)</span>'));
  assert.ok(html.includes('<a href="https://github.com/owner/repo/pull/47">2 open, oldest 10 d (#47)</a>'));
  assert.ok(
    html.includes('<a href="https://github.com/owner/repo/releases/tag/v0.1.0">v0.1.0 (pre-release, 2026-09-13)</a>'),
    'a pre-release is published and says so',
  );
  assert.ok(html.includes('<span>Disk free</span><span>C: 10.1 GB, D: 465.7 GB</span>'), 'both drives on one row');
});

test('machine group: the two governance metrics render plainly, day resolution and a first-pass rate with its N', () => {
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth: BUILD_HEALTH });
  assert.ok(html.includes('<span>Median opened→done</span><span>3 days (day resolution, 12 nodes)</span>'));
  assert.ok(html.includes('<span>Gate first-pass</span><span>2/3 nodes passed first gate (67%)</span>'));
});

test('machine group: an absent gate log says so; no dated done nodes says so; a single drive renders alone', () => {
  const health = {
    ...MACHINE_HEALTH,
    disk_free: { drives: [{ drive: 'C', bytes: 10794078208, total: 250000000000 }] },
    median_opened_to_done: { days: null, n: 0 },
    gate_first_pass: { present: false },
  };
  const { html } = renderSite(fixturePlan(), health, { repoSlug: REPO });
  assert.ok(html.includes('<span>Disk free</span><span>C: 10.1 GB</span>'), 'D: omitted when the machine has none');
  assert.ok(html.includes('<span>Median opened→done</span><span>no dated done nodes yet</span>'));
  assert.ok(html.includes('<span>Gate first-pass</span><span>no gate log yet</span>'));
});

// ------------------------------------------------------------- round 11's ratchet, condition (c):
// the verify-quotes baseline entry count on the health strip (DECISIONS-PENDING.md, "RULED
// 2026-09-17, round 11"; see scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md Amendment 6).

// RECORDED MUTATION: removing the `governanceGroup` block from renderHealthStrip's returned template
// (scripts/plan/site.mjs) makes
// governance_group_renders_the_verify_quotes_baseline_entry_count_as_its_own_labelled_group FAIL:
// "AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value" on the
// `<span>verify-quotes baseline entries</span><span>21</span>` assertion (the row never appears).
test('governance group: the verify-quotes baseline entry count renders as its own labelled group, never mixed with the other two', () => {
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, {
    repoSlug: REPO,
    buildHealth: BUILD_HEALTH,
    governanceBaselineCount: 21,
  });
  assert.ok(html.includes("From this repository's own tracked files"));
  assert.ok(html.includes('<span>verify-quotes baseline entries</span><span>21</span>'));
});

// RECORDED MUTATION: changing the ternary in renderHealthStrip's `governanceGroup` row to
// `esc(String(governanceBaselineCount))` unconditionally (scripts/plan/site.mjs) makes
// governance_group_a_missing_unparsable_baseline_file_renders_unknown_never_a_false_zero FAIL:
// "AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value" on the
// `<span>verify-quotes baseline entries</span><span>unknown</span>` assertion (a `null` count prints
// the literal string "null" instead of the honest "unknown").
test('governance group: a missing/unparsable baseline file renders "unknown", never a false zero', () => {
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth: BUILD_HEALTH });
  assert.ok(html.includes('<span>verify-quotes baseline entries</span><span>unknown</span>'));
});

test('bug 1: a release that is not a pre-release carries no qualifier', () => {
  const buildHealth = {
    ...BUILD_HEALTH,
    latest_release: { ...BUILD_HEALTH.latest_release, tag_name: 'v0.1.1', prerelease: false },
  };
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth });
  assert.ok(html.includes('>v0.1.1 (2026-09-13)</a>'));
  assert.ok(!html.includes('pre-release'));
});

test('bug 1: an unreadable fact renders its error text, never a bare "unknown"', () => {
  const buildHealth = {
    ...BUILD_HEALTH,
    ci: { auth: 'token', error: 'HTTP 500 Internal Server Error' },
    open_prs: { auth: 'anonymous', error: 'getaddrinfo ENOTFOUND api.github.com' },
    latest_release: null,
  };
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth });
  assert.ok(html.includes('error: HTTP 500 Internal Server Error'));
  assert.ok(html.includes('error: getaddrinfo ENOTFOUND api.github.com'));
  assert.ok(html.includes('none published yet'));
  assert.ok(!html.includes('<span>CI on main</span><span>unknown</span>'));
});

test('bug 1: without build-health.json the build-time group is one honest sentence, not a row', () => {
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO });
  assert.ok(
    html.includes(
      "CI on main, open PRs and the latest release are read from GitHub's API in the Pages build; this copy was generated outside that build.",
    ),
  );
  assert.ok(!html.includes('<span>CI on main</span>'));
  assert.ok(!html.includes('<span>Latest release</span>'));
  assert.ok(html.includes('<span>Drift</span>'), 'the machine group still renders');
});

test('bug 1: a corrupt build-health.json says so — it is not read as "generated outside the build"', () => {
  const dir = makeTempDir('site-corrupt-bh-');
  const outDir = path.join(dir, 'site');
  fs.mkdirSync(path.join(outDir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'data', 'build-health.json'), '{ this is not json', 'utf8');

  const buildHealth = readBuildHealth(outDir);
  assert.equal(typeof buildHealth.unreadable, 'string');

  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth });
  assert.ok(html.includes('build-health.json unreadable: '));
  assert.ok(
    !html.includes('this copy was generated outside that build'),
    'a corrupt file must not claim the page was generated outside the Pages build',
  );
  assert.equal(readBuildHealth(path.join(dir, 'nowhere')), null, 'absent is still absent');
});

test('bug 1: an API-sourced href is emitted only when it is an https:// URL', () => {
  // A failing shell workflow whose run URL is hostile: the strip names it but must not emit the
  // javascript: URL as a live href.
  const buildHealth = {
    ...BUILD_HEALTH,
    ci: {
      auth: 'token',
      conclusion: 'failure',
      status: 'completed',
      head_sha: 'x',
      created_at: '2026-09-14T09:00:00Z',
      html_url: 'javascript:alert(1)',
      workflows: [
        { workflow: 'product-ci-rust.yml', auth: 'token', conclusion: 'success', status: 'completed', head_sha: 'a', created_at: '2026-09-14T09:00:00Z', html_url: 'https://github.com/owner/repo/actions/runs/1' },
        { workflow: 'product-ci-viewer.yml', auth: 'token', conclusion: 'success', status: 'completed', head_sha: 'b', created_at: '2026-09-14T09:00:00Z', html_url: 'https://github.com/owner/repo/actions/runs/2' },
        { workflow: 'product-ci-shell.yml', auth: 'token', conclusion: 'failure', status: 'completed', head_sha: 'x', created_at: '2026-09-14T09:00:00Z', html_url: 'javascript:alert(1)' },
      ],
    },
    open_prs: { ...BUILD_HEALTH.open_prs, oldest: { ...BUILD_HEALTH.open_prs.oldest, html_url: 'http://example.invalid' } },
    latest_release: { ...BUILD_HEALTH.latest_release, html_url: null },
  };
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth });
  assert.ok(!html.includes('javascript:'), 'a javascript: value never becomes an href');
  assert.ok(html.includes('FAILURE'), 'the suite reads FAILURE, never success, when a workflow is red');
  assert.ok(html.includes('shell: failure'), 'the red workflow is named');
  assert.ok(!html.includes('href="http://example.invalid"'), 'plain http is not emitted either');
  assert.ok(html.includes('<span>Open PRs</span><span>2 open, oldest 10 d (#47)</span>'));
  assert.ok(html.includes('<span>Latest release</span><span>v0.1.0 (pre-release, 2026-09-13)</span>'));
});

test('bug 1: a legacy build-health.json without a workflows array still renders (mid-deploy back-compat)', () => {
  // An older on-disk build-health.json (single-fact shape, no `workflows`) can be read during a
  // deploy that straddles this change; it must still render a linked conclusion, not break.
  const buildHealth = {
    ...BUILD_HEALTH,
    ci: { auth: 'token', conclusion: 'success', status: 'completed', head_sha: 'abc', created_at: '2026-09-14T09:00:00Z', html_url: 'https://github.com/owner/repo/actions/runs/1' },
  };
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth });
  assert.ok(html.includes('<a href="https://github.com/owner/repo/actions/runs/1">success</a>'), 'legacy shape links its conclusion');
});

test('bug 1: an all-green suite reads "all green (3/3)", and a red workflow reads FAILURE and is named', () => {
  // All green (the BUILD_HEALTH fixture): the row says all green, not a bare "success".
  const green = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth: BUILD_HEALTH }).html;
  assert.ok(green.includes('<span>CI on main</span><span>all green (3/3)</span>'));
  // Three product-workflow badges in the header, not one.
  for (const wf of ['product-ci-rust.yml', 'product-ci-viewer.yml', 'product-ci-shell.yml']) {
    assert.ok(green.includes(`/actions/workflows/${wf}/badge.svg?branch=main`), `${wf} badge present`);
  }
});

test('bug 1: the drift check never depends on build-health.json', () => {
  const { plan, planPath, dir } = bugsPlan();
  const outDir = path.join(dir, 'site');
  fs.mkdirSync(path.join(outDir, 'data'), { recursive: true });

  // Generate WITHOUT the build facts, exactly as a machine outside the Pages build would; the
  // governance baseline count IS a repo-tracked fact, so it must match what checkSiteDrift itself will
  // read fresh below (readVerifyQuotesBaselineCount(REPO_ROOT), the real repo's own baseline file).
  const governanceBaselineCount = readVerifyQuotesBaselineCount(REPO_ROOT);
  const { html, planJson } = renderSite(plan, null, { repoSlug: REPO, governanceBaselineCount });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(outDir, 'data', 'plan.json'), planJson, 'utf8');
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');

  // Now drop a build-health.json beside it (what the Pages build leaves behind).
  fs.writeFileSync(path.join(outDir, 'data', 'build-health.json'), `${JSON.stringify(BUILD_HEALTH, null, 2)}\n`, 'utf8');

  const result = checkSiteDrift({ planPath, outDir, repoSlug: REPO });
  assert.deepEqual(result.problems, []);
  assert.equal(result.ok, true);
});

// ------------------------------------------------------------------- bug 2: "loading…" forever

test('bug 2: the shipped list is static — no "loading…" anywhere in the output', () => {
  const html = renderBugs();
  assert.ok(!html.includes('loading…'));
  assert.ok(!html.includes('loading'));
});

test('bug 2: the window is the 7 days to the newest dates.done, newest first, deterministic', () => {
  const { plan } = bugsPlan();
  const { newest, nodes } = shippedRecently(plan);
  assert.equal(newest, '2026-09-13');
  assert.deepEqual(
    nodes.map((n) => n.id),
    ['released-by-tag', 'landed-by-pr'],
  );

  const html = renderBugs();
  assert.ok(html.includes('<h2 id="shipped-heading">Shipped in the 7 days to 2026-09-13</h2>'));
  const first = html.indexOf('Cut the release');
  const second = html.indexOf('Landed by a pull request');
  assert.ok(first > 0 && second > first, 'newest first');
  const listSection = html.slice(html.indexOf('id="shipped-list"'), html.indexOf('</ul>', html.indexOf('id="shipped-list"')));
  assert.ok(!listSection.includes('Landed long ago'), 'a node outside the window is not listed');
  assert.ok(listSection.includes('tag v0.1.0'), 'each line carries its evidence link');
});

test('bug 2: the inline script compares calendar days and leaves a first visit alone', () => {
  const html = renderBugs();
  const script = html.slice(html.lastIndexOf('<script>'), html.lastIndexOf('</script>'));
  assert.ok(script.includes('n.dates.done >= lastDay'), 'yyyy-mm-dd strings, inclusive of the last-visit day');
  assert.ok(script.includes("if (lastVisitRaw && lastVisitRaw.length >= 10)"), 'a first visit changes nothing');
  assert.ok(script.includes("heading.textContent = 'Shipped since your last visit ('"));
  assert.ok(script.includes('try { lastVisitRaw = localStorage.getItem(STORAGE_KEY); } catch'));
  assert.ok(script.includes('try { localStorage.setItem(STORAGE_KEY, todayLocal()); } catch'));
  // The replacement is built first and only then swapped in, so a failure leaves the static list.
  assert.ok(script.indexOf('fresh.appendChild') < script.indexOf("list.innerHTML = ''"));
  assert.ok(script.includes('} catch (e) { /* leave the generated list and heading exactly as they are */ }'));
});

// --------------------------------------------------------------- bug 3: labels glued to titles

test('bug 3: the need type is its own chip, never concatenated onto the title', () => {
  const html = renderBugs();
  assert.ok(
    html.includes('<span class="chip chip-need" aria-label="needs a ruling, about 20 minutes">ruling · 20 min</span>'),
  );
  assert.ok(
    html.includes('<span class="chip chip-need" aria-label="needs a sitting, unestimated">sitting · unestimated</span>'),
  );

  const text = visibleText(html);
  assert.ok(!text.includes('ADR acceptancesruling'), 'a title is never immediately followed by its kind');
  assert.ok(!text.includes('sittingsitting'));
  for (const [title, kind] of [
    ['ADR acceptances', 'ruling'],
    ['Part O — sitting', 'sitting'],
  ]) {
    assert.ok(!text.includes(`${title}${kind}`), `"${title}" is not glued to "${kind}"`);
  }
});

test('bug 3: a zero estimate is "unestimated" and never counts as "0 min"', () => {
  const html = renderBugs();
  assert.ok(!html.includes('(0 min)'));
  assert.ok(!/(^|[^\d])0 min/.test(html), 'no "0 min" anywhere (a two-digit minute count is not one)');
  assert.ok(html.includes('Waiting on you <span class="total">(20 min estimated; 1 unestimated)</span>'));
});

test('bug 3: with nothing unestimated the heading names only the estimated minutes', () => {
  const { html } = renderSite(fixturePlan(), null, { repoSlug: REPO });
  assert.ok(html.includes('Waiting on you <span class="total">(17 min estimated)</span>'));
  assert.ok(!html.includes('unestimated'));
});

// -------------------------------------------------------------------- bug 4: node ids exposed

test('bug 4: ids are metadata — anchors and title attributes, never visible text', () => {
  const html = renderBugs();
  const text = visibleText(html);
  for (const id of ['released-by-tag', 'waits-estimated', 'cross-lane-dependent']) {
    assert.ok(!text.includes(id), `the id "${id}" is not visible text`);
    assert.ok(html.includes(`id="node-${id}"`), `the anchor for "${id}" is kept`);
    assert.ok(html.includes(`title="${id}"`), `the id for "${id}" is carried in a title attribute`);
  }
  assert.ok(!html.includes('class="node-id"'));
  assert.ok(html.includes('<li title="waits-estimated"><a href="#node-waits-estimated">ADR acceptances</a>'));
});

test('bug 4: a cross-lane "after:" note shows the dependency\'s title, linked to its anchor', () => {
  const html = renderBugs();
  assert.ok(html.includes('after: <a href="#node-landed-by-pr" title="landed-by-pr">Landed by a pull request</a>'));
});

test('bug 4: the machine group\'s waiting-on-human row names the title, not the id', () => {
  // renderBugs() renders with health = null, so this row only exists with a health object.
  const { html } = renderSite(fixturePlan(), MACHINE_HEALTH, { repoSlug: REPO, buildHealth: BUILD_HEALTH });
  const text = visibleText(html);
  assert.ok(!text.includes('n-waiting-sight'), 'the id is not visible text');
  assert.ok(
    html.includes('1 waiting, oldest 0 d (<a href="#node-n-waiting-sight" title="n-waiting-sight">Waiting on a sighting</a>)'),
  );
});

test('bug 4: a waiting-on-human id the plan no longer knows falls back to the id', () => {
  const health = {
    ...MACHINE_HEALTH,
    waiting_on_human: [{ id: 'ghost-node', kind: 'ruling', minutes: 5, opened: '2026-09-01', age_days: 12 }],
  };
  const { html } = renderSite(fixturePlan(), health, { repoSlug: REPO });
  assert.ok(html.includes('1 waiting, oldest 12 d (ghost-node)'));
});

test('bug 4: an unknown dependency falls back to its id', () => {
  const { plan } = bugsPlan();
  plan.nodes.find((n) => n.id === 'cross-lane-dependent').depends_on = ['ghost-node'];
  const { html } = renderSite(plan, null, { repoSlug: REPO });
  assert.ok(html.includes('after: ghost-node'));
});

// -------------------------------------------------------------------------- bug 5: dates

test('bug 5: a done node\'s date is labelled by what the evidence dates', () => {
  const html = renderBugs();
  assert.ok(html.includes('evidence dated 2026-09-13'), 'tag/release evidence dates the evidence');
  assert.ok(html.includes('landed 2026-09-12'), 'a PR dates the landing');
  assert.ok(!html.includes('landed 2026-09-13'));
  assert.ok(!html.includes('evidence dated 2026-09-12'));
});

test('bug 5: release evidence is labelled like tag evidence', () => {
  const { plan } = bugsPlan();
  plan.nodes.find((n) => n.id === 'landed-by-pr').evidence = { release: 'v0.1.0' };
  const { html } = renderSite(plan, null, { repoSlug: REPO });
  assert.ok(html.includes('evidence dated 2026-09-12'));
});
