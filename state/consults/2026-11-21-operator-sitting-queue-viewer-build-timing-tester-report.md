*Filed by the custodian: the time of the bundle viewer's build, for the sitting script's start paragraph (the advisor's ruling ADV-2026-11-21-24 item 1, under the human's delegation of 2026-11-13), one run in a read worktree at main 887408a3, not the main checkout, so that the main checkout stays as the human finds it; the hand-back of the tester (claude-sonnet-5-5), 2259 bytes, sha256 7c6bdc8fde3920cae988789b9ca2673b04281ef68a567929d91184f0949cf5de, below the rule, masked by the custodian: the scratch folder's path 1 times as <S>; nothing else changed. Its calls in the transcript, by unique call ids: Read 1, Bash 3, SubagentHandback 1; errored: 0, from 2026-11-21T15:43:58Z to 2026-11-21T15:45:23Z.*

---

Measured: the bundle viewer build, tester

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.

- Head: before the checkout ad2088a8b3e57a900eca2d732799aa740d06e369, after 887408a3e90e143e44c3f1f89ca6f859ac0b2e80. The porcelain was empty before the checkout.
- ci step: rc 0. Last 3 lines of <S>/vbt-ci.log:
  npm warn allow-scripts   esbuild@0.28.2 (postinstall: node install.js)
  npm warn allow-scripts
  npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
- Timed build (one run, from /c/dev/wt/sit, `npm --prefix renderer/bundle-viewer run build`): t0 2026-11-21T15:45:02.905Z, t1 2026-11-21T15:45:08.173Z, rc 0, wall time 5.3 s (5.268 s from the two stamps). This was a single run on a warm npm cache, so there is no p50 or p95.
- Build log last 10 lines (vbt-build.log in the same scratchpad folder):
  (blank)
  (blank)
  dist\app.js  325.3kb
  (blank)
  ⚡ Done in 361ms
  dist/index.html + dist/app.js + dist/NOTICE.txt + dist-metafile.json
  scan-dist: 3 files scanned, 2 findings, all reviewed; record written
  scan-dist: reviewed row NOTICE.txt credential 19092: matched
  scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
  scan-dist: reviewed row app.js local-filesystem-path 7291: not found
  The last line says "not found". I did not investigate it. The scan still ended rc 0 and its summary says "all reviewed".
- Outputs: renderer/bundle-viewer/dist/app.js is 333082 bytes, and renderer/bundle-viewer/viewer-asset-hashes.json is 261 bytes. The porcelain after the build is empty, because both files are git-ignored.
- Not done: no second build, no shell build, no cargo, no app start, no commit, no push. Stops: none.

Harness check for the four failure classes. The harness is the product's own npm script, run as the sitting script will run it from the repository root. The result claims point to the vbt-ci.log and vbt-build.log files in the scratchpad. The lines above describe this commit, 887408a3. The measurement reached its assertion: rc 0, both output files present, porcelain empty. No usage figures are at hand.
