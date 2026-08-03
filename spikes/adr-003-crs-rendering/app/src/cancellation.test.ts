// CI item "editing and cancellation semantics" (cancellation half). This
// validates the generic JS cancellation mechanism this spike relies on --
// AbortController wired to fetch() -- against a plain Node http server, NOT
// against Tauri's actual register_uri_scheme_protocol handler. That
// distinction matters and is the whole point: M5's own finding (README,
// "M5 | Cancellation latency" row) is that Tauri's handler is a single
// synchronous closure with NO interrupt signal reaching the Rust side, so
// AbortController only ever stops the *client* from waiting, never the
// *producer* from having already done the work. This test cannot and does
// not contradict that finding -- it only confirms the client-side half of
// the mechanism (abort -> rejection) behaves correctly in general, which is
// a precondition for the M5 measurement meaning anything, not a
// replacement for it. Requires no WebView, no GPU, no Tauri runtime.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

/** A server that accepts the connection but never responds -- deliberately, so the only way the request settles is via client-side abort. */
function startHangingServer(): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = createServer((_req, _res) => {
      // Never call res.end() -- simulates a slow/stuck producer, the
      // scenario the M5 "mid-load" cancellation test targets.
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") throw new Error("expected an AddressInfo");
      resolve({
        url: `http://127.0.0.1:${address.port}/`,
        close: () => new Promise((res) => server.close(() => res())),
      });
    });
  });
}

test("cancellation: AbortController aborts a hung fetch and rejects promptly", async () => {
  const { url, close } = await startHangingServer();
  try {
    const controller = new AbortController();
    const fetchPromise = fetch(url, { signal: controller.signal });
    const abortT0 = performance.now();
    setTimeout(() => controller.abort(), 50);
    await assert.rejects(fetchPromise, /AbortError|aborted/i);
    const elapsedMs = performance.now() - abortT0;
    // Generous bound (not a perf assertion -- CI runners are noisy): this
    // just confirms the rejection isn't waiting on the hung response.
    assert.ok(elapsedMs < 5000, `abort-to-rejection took ${elapsedMs}ms, expected well under 5s`);
  } finally {
    await close();
  }
});

test("cancellation: aborting before the request starts rejects immediately, never sends", async () => {
  const { url, close } = await startHangingServer();
  try {
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(fetch(url, { signal: controller.signal }), /AbortError|aborted/i);
  } finally {
    await close();
  }
});

test("cancellation: a normal (non-hanging) request is unaffected by an AbortController that never fires", async () => {
  const server = createServer((_req, res) => {
    res.end("ok");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string") throw new Error("expected an AddressInfo");
  try {
    const controller = new AbortController();
    const res = await fetch(`http://127.0.0.1:${address.port}/`, { signal: controller.signal });
    assert.equal(await res.text(), "ok");
  } finally {
    await new Promise((res) => server.close(() => res(undefined)));
  }
});
