// buildHealth.mjs — the build-time half of the health strip. Every test injects a fake fetch;
// nothing here touches the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildHealthData, SOURCE_LABEL } from './buildHealth.mjs';
import { CI_BADGE_WORKFLOW } from './site.mjs';

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
  return url.includes(`/actions/workflows/${CI_BADGE_WORKFLOW}/runs`);
}
function isPulls(url) {
  return url.includes('/pulls?');
}
function isRelease(url) {
  return url.includes('/releases/latest');
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
const RELEASE = {
  tag_name: 'v0.1.0',
  published_at: '2026-09-13T18:00:00Z',
  html_url: 'https://github.com/owner/repo/releases/tag/v0.1.0',
};

function happyHandler(url) {
  if (isCi(url)) return response(200, { workflow_runs: [RUN] });
  if (isPulls(url)) return response(200, PRS);
  if (isRelease(url)) return response(200, RELEASE);
  return response(404, {});
}

test('the three endpoints are parsed into the three facts', async () => {
  const fetchImpl = makeFetch(happyHandler);
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });

  assert.equal(data.built_at, NOW.toISOString());
  assert.equal(data.source, SOURCE_LABEL);
  assert.equal(data.repo, SLUG);

  assert.deepEqual(data.ci, {
    auth: 'token',
    conclusion: 'success',
    status: 'completed',
    head_sha: '0123456789abcdef',
    created_at: '2026-09-14T09:00:00Z',
    html_url: 'https://github.com/owner/repo/actions/runs/1',
  });

  assert.equal(data.open_prs.count, 2);
  assert.equal(data.open_prs.oldest.number, 47); // the earliest created_at, not the lowest index
  assert.equal(data.open_prs.oldest.age_days, 10);
  assert.equal(data.open_prs.oldest.html_url, 'https://github.com/owner/repo/pull/47');

  assert.deepEqual(data.latest_release, {
    auth: 'token',
    tag_name: 'v0.1.0',
    published_at: '2026-09-13T18:00:00Z',
    html_url: 'https://github.com/owner/repo/releases/tag/v0.1.0',
  });

  // The URLs and the required headers, as GitHub's REST API documents them.
  assert.equal(fetchImpl.calls.length, 3);
  assert.ok(fetchImpl.calls[0].url.startsWith(`https://api.github.com/repos/${SLUG}/`));
  assert.ok(fetchImpl.calls[0].url.includes('branch=main&per_page=1'));
  assert.ok(fetchImpl.calls[1].url.includes('state=open&per_page=100'));
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

test('HTTP 404 on releases/latest is null, not an error (a repository may have none)', async () => {
  const fetchImpl = makeFetch((url) => (isRelease(url) ? response(404, { message: 'Not Found' }) : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });
  assert.equal(data.latest_release, null);
  assert.equal(data.ci.conclusion, 'success'); // the other facts are unaffected
});

test('an HTTP 500 becomes {error} on that fact alone — never a bare "unknown"', async () => {
  const fetchImpl = makeFetch((url) =>
    isCi(url) ? response(500, { message: 'boom' }, 'Internal Server Error') : happyHandler(url),
  );
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });
  assert.equal(data.ci.error, 'HTTP 500 Internal Server Error');
  assert.equal(data.ci.conclusion, undefined);
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

test('HTTP 403 to a token is retried once anonymously, and the fact records auth: "anonymous"', async () => {
  let ciCalls = 0;
  const fetchImpl = makeFetch((url) => {
    if (isCi(url)) {
      ciCalls += 1;
      return ciCalls === 1
        ? response(403, { message: 'Resource not accessible by integration' }, 'Forbidden')
        : response(200, { workflow_runs: [RUN] });
    }
    return happyHandler(url);
  });
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG, token: 'tok' });

  assert.equal(data.ci.auth, 'anonymous');
  assert.equal(data.ci.conclusion, 'success');
  assert.equal(fetchImpl.calls.length, 4); // ci (403) + ci retry + pulls + releases
  assert.equal(fetchImpl.calls[0].headers.Authorization, 'Bearer tok');
  assert.equal(fetchImpl.calls[1].headers.Authorization, undefined); // the retry carries no token
  assert.equal(fetchImpl.calls[1].headers.Accept, 'application/vnd.github+json');
  assert.equal(data.open_prs.auth, 'token'); // a 403 on one request never changes another's auth
});

test('a 403 without a token is an error, not an endless retry', async () => {
  const fetchImpl = makeFetch((url) => (isCi(url) ? response(403, {}, 'Forbidden') : happyHandler(url)));
  const data = await buildHealthData({ fetch: fetchImpl, now: NOW, slug: SLUG });
  assert.equal(data.ci.error, 'HTTP 403 Forbidden');
  assert.equal(data.ci.auth, 'anonymous');
  assert.equal(fetchImpl.calls.filter((c) => isCi(c.url)).length, 1);
});

test('no slug is a bad-argument error, not a silent empty page', async () => {
  await assert.rejects(
    () => buildHealthData({ fetch: makeFetch(happyHandler), now: NOW, slug: null }),
    /no repository slug/,
  );
});
