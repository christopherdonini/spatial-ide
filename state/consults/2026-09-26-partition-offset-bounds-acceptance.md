*Custodian's filing note (2026-09-26): the tester's report of the real-shape acceptance re-run for PLAN node `bundle-viewer-partition-offset-bounds` at aaa6020 (its preregistration's section 9, the seam across modules), filed as returned (extracted by script from the agent's hand-back; byte-identical). Its JSON artifact is filed beside it, byte-identical, as `state/consults/2026-09-26-partition-offset-bounds-acceptance.json` (sha256 6c47cc8ebfecc926475ffd2e44a8f817dbe0a2926d0ccb528ac4dbd6a606d99d). Everything below the rule is the agent's text.*

---

Operator acceptance pass re-run for PLAN node `bundle-viewer-partition-offset-bounds` at `aaa6020636a0f632364b3815547ee49a06e81a1d`, worktree `C:\dev\wt\viewer-offset-bounds`.

## 1. Exact commands

```
# Build (in C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer)
node build.mjs

# Compose (fresh temp dir outside the repo, mirroring zoom-anchor.mjs before() lines 156-166)
mkdir -p "<scratch>/viewer-acceptance/served-tree/viewer"
cp dist/index.html "<scratch>/viewer-acceptance/served-tree/viewer/index.html"
cp dist/app.js "<scratch>/viewer-acceptance/served-tree/viewer/app.js"
cp "C:\Users\Public\spatial-ide-fixtures\100k-happy-path\manifest.json" "<scratch>/viewer-acceptance/served-tree/manifest.json"
cp "C:\Users\Public\spatial-ide-fixtures\100k-happy-path\style.json" "<scratch>/viewer-acceptance/served-tree/style.json"
cp -r "C:\Users\Public\spatial-ide-fixtures\100k-happy-path\data" "<scratch>/viewer-acceptance/served-tree/data"
sha256sum "<scratch>/viewer-acceptance/served-tree/manifest.json"

# Serve
node scripts/serve-bundle.mjs "<scratch>/viewer-acceptance/served-tree" 0
# -> served at http://127.0.0.1:3812/viewer/index.html

# Drive
node scripts/run-acceptance.mjs \
  --url http://127.0.0.1:3812/viewer/index.html \
  --out "<scratch>/viewer-acceptance/acceptance.json" \
  --expect-manifest-hash sha256:1e5b4dc10bab298a9aa56cbaf180c62df35520584b96fbebfcc6459935765377 \
  --timeout-ms 120000
```

`<scratch>` = `C:\Users\CHRIST~1\AppData\Local\Temp\claude\C--dev-spatial-ide\5d626cec-7aaf-40a2-9c79-6e4d2c8db2e6\scratchpad`.

`npm ci` was not run — `node_modules` was already present (checked `@esbuild`, `@swc`, `@types` populated) and the task said only run it if missing/stale; I did not independently verify staleness beyond presence.

## 2. Build's rc

`0`. Output: `dist\app.js  437.1kb`, `Done in 2041ms`, produced `dist/index.html + dist/app.js + dist/NOTICE.txt + dist-metafile.json`. `git -C C:\dev\wt\viewer-offset-bounds status --porcelain` was empty both before and after the build (`dist/`, `dist-metafile.json` are gitignored via the repo-root `.gitignore` lines 6-8: `dist/`, `dist-measure/`, `dist-metafile.json`).

## 3. Manifest sha256

`sha256:1e5b4dc10bab298a9aa56cbaf180c62df35520584b96fbebfcc6459935765377` (of the composed tree's `manifest.json`, copied byte-for-byte from the external `100k-happy-path` fixture — same bytes the driver re-hashed and matched via `--expect-manifest-hash`).

## 4. Driver's rc and verdict line

rc = `0`. `"verdict": "rendered-and-hover-resolved"`.

Also present in the same run: `"served_manifest_hash": "sha256:1e5b4dc...765377"` matching the expected hash (driver would have thrown otherwise); `"page.status": "1/1 partitions verified · 84 features drawn, 0 outside the view"`; `"hover": {"probes": 256, "resolved": 16, ...}`; one console error (`404` on `/favicon.ico`) fully accounted for by the driver's own `accounted_for` logic (`renderer/bundle-viewer/scripts/run-acceptance.mjs:254-260`).

## 5. Artifact path and sha256

Path: `C:\Users\CHRIST~1\AppData\Local\Temp\claude\C--dev-spatial-ide\5d626cec-7aaf-40a2-9c79-6e4d2c8db2e6\scratchpad\viewer-acceptance\acceptance.json`

`sha256sum`: `6c47cc8ebfecc926475ffd2e44a8f817dbe0a2926d0ccb528ac4dbd6a606d99d`

## 6. Field inventory (paths / usernames / machine names / timestamps)

Read the full artifact (reproduced above in step 4's context). Field-by-field:

- `url`: `"http://127.0.0.1:3812/viewer/index.html"` — loopback address + OS-chosen ephemeral port. Not a filesystem path, username, or machine name; the port is a per-run local-only detail with no filing implication, but it will differ run to run.
- `expect_failure`: `null`.
- `served_manifest_hash`: hash string only.
- `manifest_url`: `"http://127.0.0.1:3812/manifest.json"` — same loopback/port note as `url`.
- `browser`: `"Chrome/153.0.8010.48"` — version string only, no path or identity.
- `page.*` (status, bannerVisible, banner, legend, crs, identity, grade, boundsBasis, license, log): all are strings the *page* renders about the bundle's own content (CRS, provenance, reproducibility grade, license, feature counts) — none contain a filesystem path, username, machine name, or timestamp.
- `hover.*` (probes, resolved, samples[].id, samples[].attributes): numeric counts and feature IDs from the fixture data. No path/username/machine/timestamp.
- `console_errors` / `console_errors_accounted_for`: browser console text (`"Failed to load resource..."`) and the driver's static explanation string. No path/username/machine/timestamp.
- `verdict`: string only.

**No field in this artifact carries a local filesystem path, a user name, a machine name, or a timestamp.** This matches the driver's own stated design (`run-acceptance.mjs:18`, "no timing of any kind") — the only candidates for leakage were `url`/`manifest_url` (loopback IP + ephemeral port, judged not identifying) and I found nothing else. This artifact appears filable as-is on that basis, but that filing call is the custodian's, not mine.

## 7. Teardown confirmation

- Server process (pid from `node scripts/serve-bundle.mjs`) killed; `ps aux | grep serve-bundle` afterward showed nothing.
- Browser: the driver's own `finally` block calls `browser.unref()` after closing via CDP `Browser.close` (`run-acceptance.mjs:363-376`); `ps aux | grep chrome` after the run showed no leftover process.
- Composed served-tree temp dir removed (`rm -rf ".../viewer-acceptance/served-tree"`); only `acceptance.json` and `server.log` remain under the scratch `viewer-acceptance/` directory (artifact kept per instructions).
- `git -C C:\dev\wt\viewer-offset-bounds status --porcelain` empty after teardown — nothing edited, staged, or committed in the worktree.

## Notes / caveats for the custodian

- I did not independently confirm `node_modules` freshness against `package-lock.json` (only checked presence of populated subdirectories) before skipping `npm ci`, per the brief's "only if missing or stale" — flagging this as an assumption rather than a verified fact.
- No performance claim is made anywhere above; the artifact's own author states it "measures nothing and claims nothing" timing-wise (`run-acceptance.mjs:16-18`), and none of the fields I read are timings.
- Model note: I ran as Sonnet 5 (`claude-sonnet-5`) per the environment reminder; no model override was applied. No context handoff occurred — this was a single, self-contained task from dispatch to hand-back.
- Failure-class self-check before handing this off: (1) harness/interface — I drove the bundle through the product's own served static tree and its own `run-acceptance.mjs` instrument, the same shape an operator would use, not a bypass; (2) every claim above points to the artifact at the stated path/hash or to a quoted line I read directly; (3) every operator-facing line above (build rc, hash, verdict, teardown) describes exactly this run at `aaa6020`, not a prior or hypothetical one; (4) the measurement (the acceptance run) reached its assertion — the driver executed to completion and printed/wrote a verdict, exit 0, rather than stopping at setup.

