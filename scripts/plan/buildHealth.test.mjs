// buildHealth.mjs — the build-time half of the health strip. Every test injects a fake fetch;
// nothing here touches the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildHealthData, summaryLines, SOURCE_LABEL } from './buildHealth.mjs';
import { PRODUCT_CI_WORKFLOWS } from './site.mjs';

const SLUG = 'owner/repo';
const NOW = new Date('2026-09-14T12:00:00Z');

function response(status, body, statusText = '') {
  return { status, statusText, json: async () => body };
}

/** A fake fetch that records every call (url + headers) and answers via `handler`. */
function makeFetch(handler) {
  const calls = [];
  const f = async (url, init) => {
    calls.push({ url: String(url), headers: (init && init.headers) || {} });
    return handler(String(url), calls.length);
  };
  f.calls = calls;
  return f;
}

function isCi(url) {
  // Any of the product workflows' runs endpoint — the strip now reads the whole suite.
  return url.includes('/actions/workflows/') && url.includes('/runs?');
}
function isWorkflow(url, wf) {
  return url.includes(`/actions/workflows/${wf}/runs`);
}
// The per-workflow entry buildHealth builds when a workflow's latest run is RUN.
function runEntry(workflow, auth = 'token') {
  return {
    workflow,
    auth,
    conclusion: RUN.conclusion,
    status: RUN.status,
    head_sha: RUN.head_sha,
    created_at: RUN.created_at,
    html_url: RUN.html_url,
  };
}
function isPulls(url) {
  return url.includes('/pulls?');
}
function isRelease(url) {
  return url.includes('/releases?');
}

const RUN = {
  conclusion: 'success',
  status: 'completed',
  head_sha: '0123456789abcdef',
  created_at: '2026-09-14T09:00:00Z',
  html_url: 'https://github.com/owner/repo/actions/runs/1',
};
const PRS = [
  { number: 51, created_at: '2026-09-12T00:00:00Z', html_url: 'https://github.com/owner/repo/pull/51' },
  { number: 47, created_at: '2026-09-04T00:00:00Z', html_url: 'https://github.com/owner/repo/pull/47' },
];
// The real repository's only release is a pre-release, which is why the list endpoint is used.
const RELEASE = {
  tag_name: 'v0.1.0',
  published_at: '2026-09-13T18:00:00Z',
  html_url: 'https://github.com/owner/repo/releases/tag/v0.1.0',
  draft: false,
  prerelease: true,
};
const DRAFT_RELEASE = {
  tag_name: 'v0.2.0-draft',
  published_at: null,
  html_url: 'https://github.com/owner/repo/releases/tag/untagged',
  draft: true,
  prerelease: false,
};
const FULL_RELEASE = {
  tag_name: 'v0.1.1',
  published_at: '2026-09-20T10:00:00Z',
  html_url: 'https://github.com/owner/repo/releases/tag/v0.1.1',
  draft: false,
  prerelease: false,
};

function happyHandler(url) {
  if (isCi(url)) return response(200, { workflow_runs: [RUN] });
  if (isPulls(url)) return response(200, PRS);
  if (isRelease(url)) return response(200, [RELEASE]);
  return response(404, {});
}

test('the three endpoints are parsed into the three facts', async () => {
  const fetchImpl = makeFetch(happyHandler);
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });

  assert.equal(data.built_at, NOW.toISOString());
  assert.equal(data.source, SOURCE_LABEL);
  assert.equal(data.repo, SLUG);

  // The whole product suite, read: three workflows, all green → the aggregate is success, and the
  // per-workflow detail is carried so the strip can name a red one when there is one.
  assert.deepEqual(data.ci, {
    auth: 'token',
    conclusion: 'success',
    status: 'completed',
    head_sha: '0123456789abcdef',
    created_at: '2026-09-14T09:00:00Z',
    html_url: 'https://github.com/owner/repo/actions/runs/1',
    workflows: PRODUCT_CI_WORKFLOWS.map((wf) => runEntry(wf)),
  });

  assert.deepEqual(data.open_prs, {
    auth: 'token',
    count: 2,
    oldest: {
      number: 47, // the earliest created_at, not the lowest index
      created_at: '2026-09-04T00:00:00Z',
      age_days: 10,
      html_url: 'https://github.com/owner/repo/pull/47',
    },
  });

  assert.deepEqual(data.latest_release, {
    auth: 'token',
    tag_name: 'v0.1.0',
    published_at: '2026-09-13T18:00:00Z',
    html_url: 'https://github.com/owner/repo/releases/tag/v0.1.0',
    prerelease: true, // v0.1.0 is one; releases/latest would have answered 404
  });

  // The URLs and the required headers, as GitHub's REST API documents them. Three CI calls (one per
  // product workflow), then pulls, then releases.
  assert.equal(fetchImpl.calls.length, PRODUCT_CI_WORKFLOWS.length + 2);
  assert.ok(fetchImpl.calls[0].url.startsWith(`https://api.github.com/repos/${SLUG}/`));
  PRODUCT_CI_WORKFLOWS.forEach((wf, i) => {
    assert.ok(isWorkflow(fetchImpl.calls[i].url, wf), `call ${i} is ${wf}`);
    assert.ok(fetchImpl.calls[i].url.includes('branch=main&per_page=1'));
  });
  assert.ok(fetchImpl.calls[PRODUCT_CI_WORKFLOWS.length].url.includes('state=open&per_page=100'));
  assert.ok(
    fetchImpl.calls[PRODUCT_CI_WORKFLOWS.length + 1].url.endsWith('/releases?per_page=5'),
    'the list endpoint, not releases/latest',
  );
  const headers = fetchImpl.calls[0].headers;
  assert.equal(headers.Accept, 'application/vnd.github+json');
  assert.equal(headers['X-GitHub-Api-Version'], '2022-11-28');
  assert.equal(headers.Authorization, 'Bearer tok');
  assert.ok(String(headers['User-Agent']).length > 0);
});

test('no open PRs: count 0 and no oldest', async () => {
  const fetchImpl = makeFetch((url) => (isPulls(url) ? response(200, []) : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.open_prs.count, 0);
  assert.equal(data.open_prs.oldest, null);
  assert.equal(data.open_prs.auth, 'anonymous'); // no token was given
});

test('HTTP 404 on the releases list is null, not an error (releases may be disabled)', async () => {
  const fetchImpl = makeFetch((url) => (isRelease(url) ? response(404, { message: 'Not Found' }) : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });
  assert.equal(data.latest_release, null);
  assert.equal(data.ci.conclusion, 'success'); // the other facts are unaffected
});

test('an empty releases list is null — a repository with no release at all', async () => {
  const fetchImpl = makeFetch((url) => (isRelease(url) ? response(200, []) : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.latest_release, null);
});

test('a draft ahead of a real release is skipped; the published one is reported', async () => {
  const fetchImpl = makeFetch((url) =>
    isRelease(url) ? response(200, [DRAFT_RELEASE, FULL_RELEASE, RELEASE]) : happyHandler(url),
  );
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });
  assert.equal(data.latest_release.tag_name, 'v0.1.1');
  assert.equal(data.latest_release.prerelease, false);
  assert.equal(data.latest_release.published_at, '2026-09-20T10:00:00Z');
});

test('a list of drafts only is null — nothing is published', async () => {
  const fetchImpl = makeFetch((url) => (isRelease(url) ? response(200, [DRAFT_RELEASE]) : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.latest_release, null);
});

test('the summary line names a pre-release as one', async () => {
  const data = await buildHealthData({ fetch: makeFetch(happyHandler), now: NOW, slug: SLUG });
  assert.ok(summaryLines(data).some((l) => l === '  latest release: v0.1.0 (pre-release)'));
});

test('an HTTP 500 becomes {error} on that fact alone — never a bare "unknown"', async () => {
  const fetchImpl = makeFetch((url) =>
    isCi(url) ? response(500, { message: 'boom' }, 'Internal Server Error') : happyHandler(url),
  );
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });
  // Every product workflow errored, so the suite cannot be called success — it is 'unknown', and
  // the (uniform) error is surfaced at the top level too.
  assert.equal(data.ci.error, 'HTTP 500 Internal Server Error');
  assert.equal(data.ci.conclusion, 'unknown');
  assert.ok(data.ci.workflows.every((w) => w.error === 'HTTP 500 Internal Server Error'));
  assert.equal(data.open_prs.count, 2); // the other facts still read
  assert.equal(data.latest_release.tag_name, 'v0.1.0');
});

test('a thrown fetch becomes {error} carrying the message', async () => {
  const fetchImpl = makeFetch((url) => {
    if (isPulls(url)) throw new Error('getaddrinfo ENOTFOUND api.github.com');
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.open_prs.error, 'getaddrinfo ENOTFOUND api.github.com');
});

test('HTTP 403 to a token is retried once anonymously (per workflow), and the fact records auth', async () => {
  // The FIRST product workflow gets a 403 then succeeds anonymously; the rest succeed with the
  // token. The retry is per workflow, so the aggregate auth is 'mixed' (one anonymous, two token).
  const first = PRODUCT_CI_WORKFLOWS[0];
  let firstCalls = 0;
  const fetchImpl = makeFetch((url) => {
    if (isWorkflow(url, first)) {
      firstCalls += 1;
      return firstCalls === 1
        ? response(403, { message: 'Resource not accessible by integration' }, 'Forbidden')
        : response(200, { workflow_runs: [RUN] });
    }
    if (isCi(url)) return response(200, { workflow_runs: [RUN] });
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });

  assert.equal(data.ci.conclusion, 'success'); // all three ended green
  assert.equal(data.ci.auth, 'mixed'); // one workflow read anonymously, two with the token
  assert.equal(data.ci.workflows.find((w) => w.workflow === first).auth, 'anonymous');
  // first workflow: 403 + anonymous retry (2) + two more workflows (2) + pulls + releases = 6
  assert.equal(fetchImpl.calls.length, PRODUCT_CI_WORKFLOWS.length + 3);
  assert.equal(fetchImpl.calls[0].headers.Authorization, 'Bearer tok');
  assert.equal(fetchImpl.calls[1].headers.Authorization, undefined); // the retry carries no token
  assert.equal(data.open_prs.auth, 'token'); // a 403 on one request never changes another's auth
});

test('a 403 without a token is an error on each workflow, not an endless retry', async () => {
  const fetchImpl = makeFetch((url) => (isCi(url) ? response(403, {}, 'Forbidden') : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.ci.error, 'HTTP 403 Forbidden'); // every workflow errored → surfaced at top level
  assert.equal(data.ci.conclusion, 'unknown');
  assert.equal(data.ci.auth, 'anonymous');
  // one call per workflow, no retry loop (no token to drop)
  assert.equal(fetchImpl.calls.filter((c) => isCi(c.url)).length, PRODUCT_CI_WORKFLOWS.length);
});

test('the token never reaches the written payload or the printed log', async () => {
  const TOKEN = 'ghs_FAKETOKENthatmustneverbewritten0123';
  // Even a hostile-ish API answer cannot smuggle the token out: it is never put into a fact.
  const fetchImpl = makeFetch((url) => {
    if (isCi(url)) return response(500, {}, `Internal Server Error for ${TOKEN.slice(0, 4)}`);
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: TOKEN });

  const written = JSON.stringify(data, null, 2); // exactly what the CLI writes
  const logged = summaryLines(data).join('\n'); // exactly what the CLI prints
  assert.ok(!written.includes(TOKEN), 'the payload carries no token');
  assert.ok(!logged.includes(TOKEN), 'the log carries no token');
  // The Authorization header did carry it, so the test would catch a leak of the real value.
  assert.equal(fetchImpl.calls[0].headers.Authorization, `Bearer ${TOKEN}`);
  assert.ok(logged.includes('read token') || logged.includes('read anonymous'), 'only the reach is reported');
});

test('a red on ONE product workflow makes the suite red (the false-green fix)', async () => {
  // The 2026-09-15 hazard: product-ci-shell.yml red while the other two are green. The old strip
  // read only rust and reported "success". The suite conclusion must be failure, and the shell
  // workflow must be named as the failing one.
  const RED = { workflow: 'product-ci-shell.yml' };
  const failedRun = {
    conclusion: 'failure',
    status: 'completed',
    head_sha: 'badc0ffee',
    created_at: '2026-09-14T10:00:00Z',
    html_url: 'https://github.com/owner/repo/actions/runs/999',
  };
  const fetchImpl = makeFetch((url) => {
    if (isWorkflow(url, RED.workflow)) return response(200, { workflow_runs: [failedRun] });
    if (isCi(url)) return response(200, { workflow_runs: [RUN] });
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });

  assert.equal(data.ci.conclusion, 'failure');
  assert.equal(data.ci.html_url, failedRun.html_url); // top-level points at the RED run
  assert.equal(data.ci.head_sha, 'badc0ffee');
  const shell = data.ci.workflows.find((w) => w.workflow === 'product-ci-shell.yml');
  assert.equal(shell.conclusion, 'failure');
  assert.equal(data.ci.workflows.filter((w) => w.conclusion === 'success').length, 2);
  // The log names the red workflow, not a bare "success".
  const line = summaryLines(data).find((l) => l.startsWith('  ci:'));
  assert.match(line, /failure/);
  assert.match(line, /product-ci-shell\.yml=failure/);
});

test('a still-running workflow makes the suite in_progress, not success', async () => {
  const running = { conclusion: null, status: 'in_progress', head_sha: 'abc', created_at: '2026-09-14T11:00:00Z', html_url: 'https://github.com/owner/repo/actions/runs/1000' };
  const fetchImpl = makeFetch((url) => {
    if (isWorkflow(url, 'product-ci-viewer.yml')) return response(200, { workflow_runs: [running] });
    if (isCi(url)) return response(200, { workflow_runs: [RUN] });
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.ci.conclusion, 'in_progress');
});

test('no slug is a bad-argument error, not a silent empty page', async () => {
  await assert.rejects(
    () => buildHealthData({ fetch: makeFetch(happyHandler), now: NOW, slug: null }),
    /no repository slug/,
  );
});
