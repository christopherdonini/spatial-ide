# The reload keys' Part A: the cfg-boundary correction, the worker's report at 5174676a (node:reload-asking-first-or-off-in-the-installed-build@part-a)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/keys from 8ba765d9 and pushed 5174676a3028238214cc1144a2d333ed82685d02 to `cut/reload-asking-first-or-off-in-the-installed-build`. By the facts script its records run from 2026-11-28T05:50:47Z to 2026-11-28T06:05:21Z, and 30 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 874159 ms and 31 tool uses. Its hand-back is below as received, with the harness indent removed: 3512 bytes, sha256 dfd6613be80b543545d09f281eca642a1863de25e173c0cb94805edb383aa35c.*

---

Head pushed: 5174676a3028238214cc1144a2d333ed82685d02. Every step completed; no stop.

Start state: HEAD and origin's branch were both 8ba765d9, and the tree was clean.

Red run, at 8ba765d9 (D:/wt/keys-logs/cfg-red.log): `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site` failed at line 75 with `24 !== 19` (actual 24, expected 19).
- The check (cfg-check.log) exits 0 and prints "cfg-boundary: 24 sites in 8 files, 0 outside every boundary".
- It lists 5 sites in webview_chrome.rs, at lines 20, 125, 131, 155 and 179.

Green run (cfg-green.log): 7 pass, 0 fail.

The three expectations, changed in scripts/plan/cfg-boundary.test.mjs only (3 insertions, 2 deletions):
- `assert.equal(siteLines.length, 19)` is now `24`.
- The summary line `"cfg-boundary: 19 sites in 7 files, 0 outside every boundary"` is now `"cfg-boundary: 24 sites in 8 files, 0 outside every boundary"`.
- The per-file map gains `"frontends/shell/src-tauri/src/webview_chrome.rs": 5,`, placed after the origin.rs entry.

Governance CI plan job, each step run from D:/wt/keys with the workflow's command:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0, 623 tests, 623 pass, 0 fail. Run inside a shared hold; node-test.log.
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: PASS. My exit-code echo was lost to a background move, so the PASS line is my evidence, not an exit code.
- `node scripts/plan/verify-test-claims.mjs`: PASS. The exit code was lost the same way.
- `node scripts/plan/verify.mjs`: PASS. I set GITHUB_TOKEN from `gh auth token` for it. The exit code was lost the same way.
- `node scripts/plan/buildHealth.mjs --out-dir "$RUNNER_TEMP/site" && cat ...`: ran with RUNNER_TEMP=D:/wt/keys-logs/rt. It printed the build-health JSON, so it succeeded. The exit code was lost the same way.
- `node scripts/plan/queue.mjs --check`: exit 0.
- `node scripts/plan/site.mjs --check`: exit 0.
- `node scripts/plan/moved-map.mjs --check`: exit 0.
- `node scripts/plan/forms-layout.mjs`: exit 0.
- No step was red. No install was needed. Disk was C: 41349 MB and D: 13480 MB, above the floors.

`git diff --numstat 5ce0525a...HEAD`:
- 6 0 frontends/shell/e2e/README.md
- 41 0 frontends/shell/e2e/source-watch-idle.mjs
- 38 0 frontends/shell/src-tauri/src/lib.rs
- 327 0 frontends/shell/src-tauri/src/webview_chrome.rs
- 3 2 scripts/plan/cfg-boundary.test.mjs

The commit has one Signed-off-by line, which `git commit -s` added. The message carries no email address I typed and ends with the Co-Authored-By line.

Push runs, listed once right after the push: no run exists yet at 5174676a. The list shows only the older heads.
- At 8ba765d9: Product CI shell 46109593858 success; Ported notices 46109593813 success; Rust fmt 46109593817 success; Governance CI 46109593852 failure (the known red).
- At bffb4a22: Rust fmt 46108184529 failure; Ported notices 46108184522 success; Governance CI 46108184551 failure; Product CI shell 46108184587 success.

Departures:
- I opened the output file of one background task (empty, nothing learned) before reading the brief's prohibition on that again.
- The exit codes of verify-quotes, verify-test-claims, verify.mjs and buildHealth were lost to a background move. Each step's PASS output is the evidence instead.
- I made no cargo call, started no app, and did not touch the main checkout.

State: `git status --porcelain` is empty. Logs are in D:/wt/keys-logs.
