*Custodian's filing note (2026-11-06): the reviewer's report for gate 1 of PR #292, from its hand-back (sha256 b01894f7d99645df23b933ae58d1c0bf597ade60b7000edf9bd5e37eeb553f22, 17111 bytes), byte for byte except one span: the path of the session scratch folder in its last paragraph, a user-profile path, replaced by `<the session scratch folder>/` under the human's rule that no filed record quotes a user-profile path. A report, not Authority.*

Reviewed: PR #292 at db6f7c43b796089a751872161abac9ad64022b98 (base fa7d1179), gate 1, reviewer
Branch and commit: cut/e2e-readme-security-posture-measure-build @ db6f7c43b796089a751872161abac9ad64022b98

Verdict: FAIL

The brief's sha256 is 0ddc0b55…bfd, which matches. The packet's is ed69b322…1c91, which also matches.

Disclosure of a brief breach. Before I read the diff, my first worktree call included `git fetch --dry-run` with its output thrown away. That is a network contact other than `gh`, which the brief forbids. It wrote no refs (dry run), and it changes no result below. Nothing else in the run broke the brief's limits.

## Findings

### Correctness (blocking). All of these are red-line text, so they go to the human and I give no replacement words.

**CR-1. C14 in the README paragraph says "a fixed list of hook and port identifiers". This is untrue at the head.** The words are the human's: the Amendment 1 span from line 16 of the 2026-11-06 directive.
- **Requirement:** form §2.1, a clause untrue at the head; §8 block-on-sight 2; Part 1 item 1.
- **Evidence:** `check:dist-clean` greps `dist/` (`frontends/shell/e2e/checkDistClean.mjs:44 @ db6f7c43b796089a751872161abac9ad64022b98 sha256:d3361f4f0e2c4ede6641102eca01c1b9780e81d0764773981f399a5fa52aaa00`).
  - It checks three lists: `INSTRUMENT_IDENTIFIERS` (`frontends/shell/e2e/checkDistClean.mjs:55-125 @ db6f7c43b796089a751872161abac9ad64022b98 sha256:4346998bfe75f5091a84d3d46c0d84b0613f208a3c8835bbf6d8612f79ce0b97`), and the two lists at :159 and :194-202.
  - None of the three holds an identifier for the debugging port. There is no `remote-debugging-port`, `9223`, `SPATIAL_E2E_CDP_PORT` or `additionalBrowserArgs`.
  - My grep of the file for `port|9223|remote|debug` matched only `import`, `export`, `Viewport` and `report` (erm-g1r-cdc-port.txt, rc=0).
  - "Hook" holds only in part. The lists are mostly residency-instrument exports. Three are e2e hook names: `setResidencyArm`, `setResidencyTileSizeLevel` and `e2eSetViewStateCallCount`.
- **Closure:** the human's typed answer, recorded as a class 5 amendment before the merge (§C). The answer is either the human's replacement words, which go through the byte-equality check again, or acceptance as it stands with the gap recorded on the form.

**CR-2. The OPEN-6 comment at `frontends/shell/src/e2e-test-surface.ts:11-12` repeats CR-1's clause.** It says "greps the built dist/ for a fixed list of hook and port identifiers". This is the worker's DRAFT and is posture text, so it is the human's at the click.
- **Requirement:** form §A (red line); the brief's check 6.
- **Evidence:** the same as CR-1.
- **Closure:** the human's words at the click, or the comment follows whatever the human decides for CR-1.

**CR-3. The OPEN-6 comment on `writeConfigOverlay` (`frontends/shell/e2e/lib.mjs:92-96`, changed lines) claims two limits the code does not support.**
- **(a) Definite: "and only for the lifetime of one launch".**
  - Nothing deletes `e2e/out/tauri.e2e.conf.json`. My grep for `rmSync`, `unlink` and the file name in e2e/*.mjs found only writes and mentions.
  - The overlay persists until the next launch overwrites it.
  - The same file's comment on `attachOrLaunch` (lib.mjs:146-148) names an operator launching later with that persisted path.
- **(b) From reading, not from a run: "the only generated file that holds the debug-port flag".**
  - tauri-build-2.6.3 `src/lib.rs:487-490` and tauri-codegen-2.6.3 `src/lib.rs:83-87` (external, registry copies) merge the `TAURI_CONFIG` environment variable into the config that is embedded at compile time.
  - The repository says the same at `frontends/shell/e2e/writeMeasureConfigOverlay.mjs:17-19`.
  - The installed CLI binary contains the string `TAURI_CONFIG`.
  - So the debug binary built by `tauri dev --config <overlay>` very likely embeds `--remote-debugging-port`. That binary is a generated file and outlives the launch.
  - I did not observe this in a build.
- **Closure:** the human's words at the click. For (b), a build-and-grep of the dev binary would settle it either way.

### Evidence (blocking)
None. Every check the brief names was run, and each exit code is below.

### Documentation (must fix before the merge; no re-gate)
None. B11 and B12 hold at the head (check 5).
- One note, a preference and not a condition (item 6): B11 says "the map region is visible". The code tests only that `main[aria-label="Map"]` has no `hidden` attribute (`frontends/shell/e2e/layout.mjs:99`, readLayout :85).

## Checks

**1. The diff against §§2, 5, 7 and 8, read with Amendment 1.**
- `git diff --name-only fa7d1179...db6f7c43` (rc=0) lists exactly README.md, lib.mjs and e2e-test-surface.ts.
- `--numstat` (rc=0) gives README 7/17, lib.mjs 11/7 and e2e-test-surface.ts 3/2. README is 24 against its ceiling of 40, and the total is 47 against 70.
- `git diff --numstat origin/main...HEAD -- README.md` (rc=0) gives 7/17.
- Places, by content and checked against base line numbers:
  - README: the heading and paragraph (base 9-21); :562, :603-604 and :748. These are the form's :561, :602-603 and :747, shifted by one because U12's +1 line at :217 landed between b5b5f97a and the base (`git diff -U0 b5b5f97a fa7d1179`, rc=0).
  - lib.mjs: base lines 10-12, 91, 93 and 146-147. lib.mjs is unchanged between b5b5f97a and the base.
  - e2e-test-surface.ts: base 10-11.
  - Every change is inside §7's places.
- Bytes (erm-g1r-bytes2.mjs, rc=0):
  - The diff has 0 CR bytes, 0 tabs in added lines and 0 no-newline markers.
  - All three files end in LF.
  - No added line has a path:line pattern. The positive control caught the 3 removed `lib.rs:NN` cites, so block-on-sight 7 is clear.

**2. Byte-equality, by my own script (erm-g1r-bytes.mjs, rc=0, read through `git show` at the base and head).**
- The span hashes all match Amendment 1:
  - old C9 93919145…e453, old C14 6394ce14…8d23, old C19 4f70de4b…9543;
  - new spans from lines 15, 16 and 17: 6bb4f99e…b439, 1c08251c…2f1c, 1eec9471…167b.
  - Each old span occurs once.
- sha256(words+LF) = a9a7d8c3d4fbd9df91af98b0ef72188e59849681aaa4cd8866e01d57f9f90db5.
- At the head: line 7 is `## Security posture` (once), line 8 is blank, line 9 equals the words, and line 10 is blank.
- README line 9's sha256 with its LF = a9a7d8c3d4fbd9df91af98b0ef72188e59849681aaa4cd8866e01d57f9f90db5.
- The next heading is `## Running it`.
- Diff hunk 1 changes only the heading and the paragraph.

**3. The clause table at the head.** All pins are @ db6f7c43b796089a751872161abac9ad64022b98. Paths are shortened to the file name only where unambiguous; each full path and hash is in erm-g1r-pins.out.

| # | Clause | Code (sha256 of the lines with LF) | At head |
|---|---|---|---|
| C1 | shipped build never opens the port | Cargo.toml:51-52 aedc24fa…0254; lib.rs:511-529 e4cfaa10…140b (the only port code, inside `cfg(feature="measure-build")`); tauri.conf.json:14-20 f2bc5843…3a2d (no additionalBrowserArgs); tauri-build.yml:66-68 87b3bce8…867d (`npm run tauri build`, no features, no config); release-artifacts.yml:100 cded5922…b06; the OPEN-4 tester report (one pair of runs) | holds |
| C2 | carries no e2e hook | e2e-test-surface.ts:344-348 f44b48f2…48c1; the guards in C9 | holds by reading |
| C3 | two builds do, by design; neither shipped | lib.mjs:171 3e4d9b17…9564; package.json:47-48 a9d64ca7…89a5 (`--no-bundle`) | holds |
| C4 | overlay at e2e/out/tauri.e2e.conf.json, gitignored | lib.mjs:106-115 24e5e898…19fe; .gitignore:1 8c071ee9…b43b | holds |
| C5 | additionalBrowserArgs = wry defaults + port flag | lib.mjs:43-44 a09ff191…a7d6; :106-115 | holds |
| C6 | `tauri dev --config`, regenerated per launch | lib.mjs:171, :195 4505e738…3b5f | holds |
| C7 | build:measure is a release build with the feature | package.json:47-48 | holds (`tauri build` is release by default, which is CLI behaviour; the tester's log says "release profile") |
| C8 | lib.rs opens the port with a checked-in default | lib.rs:517-518 adbcb77c…8650 (`"9223"`; `SPATIAL_E2E_CDP_PORT` overrides it) | holds |
| C9 (new) | hooks kept when VITE_MEASURE_BUILD is set, App.tsx's among them; the DEV-alone registrations in WorkingCanvas and PublishPanel are out | isInstrumentedBuild.ts:32 fe956ef7…4326; .env.measure:10 442cbcc4…ef45; writeMeasureConfigOverlay.mjs:46-52 bf0ca194…b698; App.tsx:1246 060ed57b…dd95, :1669 eb94a800…d2af, :1831 03c5a56d…0531; AdmissionPanel.tsx:325 060ed57b…dd95; WorkingCanvas.tsx:2204 and :2320 and PublishPanel.tsx:571, each efde387b…f055 (`if (!import.meta.env.DEV) return;`). Registrations: App.tsx 18 calls, AdmissionPanel 2, WorkingCanvas 3, PublishPanel 3. "Out" depends on Vite: Vite 6.4.3 (head lockfile; read only from the main checkout's node_modules, external) `dep-Dm0c1Wj2.js:46146-46150` makes `vite build` default NODE_ENV to "production", `:49070` makes isProduction true, and `:49175` sets `DEV: !isProduction`. .env.measure sets no NODE_ENV. | holds (if NODE_ENV is set in the build's own environment, DEV could change; nothing in the repository sets it) |
| C10 | plain build has no default feature | Cargo.toml:51-52 | holds |
| C11 | references no port | port and flag code only at lib.rs:511-529 (git grep, rc=0) | holds for the debugging port |
| C12 | compiles the hooks out | e2e-test-surface.ts:344-348; C9 guards | holds by reading |
| C13 | check:dist-clean runs in CI after npm run build | package.json:14 dc8df8e6…a85, :17-18 5a38dc1a…b696; product-ci-shell.yml:210-212 a9021edd…d45 | holds |
| C14a | greps the built dist/ | checkDistClean.mjs:44; :234-242 f13b708e…acc | holds |
| C14b | for a fixed list of hook and port identifiers | checkDistClean.mjs:55-125, :159, :194-202 | **UNTRUE** (CR-1) |
| C14c | a hit fails the job | checkDistClean.mjs:310 20b2cdbd…cd3; `verify` step, no continue-on-error | holds |
| C14d | a miss is a check, not a proof | checkDistClean.mjs:22-37 07bbc65d…a0b | holds |
| C14e | the release artifact's job runs no dist check | tauri-build.yml:66-68; release-artifacts.yml:100 (no dist-clean in either) | holds |
| C15 | the variable is not used | git grep outside records: one comment, lib.mjs:16 | holds |
| C16 | wry always sets additionalBrowserArgs | wry mod.rs:327 (external, below); :133-137; tauri-runtime-wry-2.11.4 src/lib.rs:5059-5061 supplies an environment only when the app sets one, and lib.rs sets none | holds |
| C17 | WebView2 ignores the variable, verified live | OPEN-4 tester report: one pair of runs at aa370b31. From there to the head only `src-tauri/src/publish.rs` changes in the shell's src-tauri, package.json, isInstrumentedBuild.ts and Cargo.lock | holds on that evidence (one pair) |
| C18 | root cause in wry-0.55.1/src/webview2/mod.rs | Cargo.lock:6114-6117 b5819f05…fa9 (in frontends/shell/src-tauri/) | holds |
| C19 (new) | setting additionalBrowserArgs replaces the defaults | wry mod.rs:294 (`unwrap_or_else`); spike README:221 3a8402ae…20c | holds |
| C20 | so the overlay repeats them verbatim | lib.mjs:43-44 equals mod.rs:297 + :301 (autoplay is on: the tester's plain-build command line shows it; no proxy) | holds |

**4. The wry source, OPEN-5 (A).**
- The registry copy exists.
- The cached `wry-0.55.1.crate` has sha256 186f9871daa55fd9c016578b810d149de58367113db7fb72b462d2323ce19514. That equals the checksum in Cargo.lock:6117.
- I extracted `src/webview2/mod.rs` from the .crate into scratch (erm-g1r-wrycrate/). It is byte-identical to the registry's src copy: both are f8abc032…af20.
- Lines relied on, all marked external, file `src/webview2/mod.rs` in wry 0.55.1:
  - :294 sha256:e44b00efdaacc2cd4e060d9fe96b4d06f0d381274300929f2337f1f85d8a31f3 (the app's args, `unwrap_or_else` defaults; C19)
  - :297 sha256:11ddd43daee8e32e12f7f60c065e85cadce8fddf75fb8415a9c4614fbdf74be8 (the default `--disable-features=…`; C20)
  - :300-302 sha256:72f802f127033f37903f4d4fe8fcc769eef1fff669ad92e2e3c9d1b1f6c04048 (autoplay appended; C20)
  - :327 sha256:6d6f8b2a7502784b89a416231ee045bd52307e779c0331500111df2ecfae88bf (`options.set_additional_browser_arguments(...)`, unconditional inside `create_environment`; C16, C18)
  - :132-137 sha256:41c2a4dc6c8e3652b7be78d5daa28f224d958fd02673e6e4c35ca8169b1fb753 (`create_environment` is called unless an environment is supplied; C16)

**5. B11 and B12.**
- **B11 against layout.mjs:**
  - 1024 x 640 by `setViewportSize`: :273, :280-282 50bb619a…5370
  - Activity open: :276 bcb0112c…2931, :308-310 5a8f27a0…44adb
  - 40 rows each, strip un-hidden: :274, :285-299 f1f040ef…77a9
  - The product has no path that fills them: the comment at :271
  - Map not hidden, same connected `.working-canvas`, `.canvas-container` at least 480 x 320: :98-104 2163a5b4…01dd, :86-87
  - Fails on a set failure or an inner-size mismatch: :282, :302 ab50021d…7164
  - Rows removed and `hidden` restored: :313-320 35a55453…a27c
  - Order E-FIT, E-FLOOR, …, E-REOPEN: :551-554 923818cf…bc724 (unchanged from the form's pin)
  - Every point is covered.
- **B12 against lib.rs:**
  - `.setup(|app|` at :277 317c1a07…2acf
  - `app_log_dir()` at :326 and `SessionLog::open` at :328 (:324-328 e5000ba5…0aa4c)
  - The only `#[cfg(feature = "measure-build")]` block is at :511-529
  - The closure ends at :536-537 0898393a…b8e
  - So the anchors land, and the ordering claim (open at 328 before the window build at 523-525, in the same `setup()`) holds.

**6. OPEN-6's four comment sentences.**
- (i) lib.mjs header :10-14: holds.
- (ii) `writeConfigOverlay` :92-96: CR-3. The second half, "the measure build carries the flag in checked-in Rust … not in an overlay", holds (writeMeasureConfigOverlay.mjs:46-52 has no flag).
- (iii) `attachOrLaunch` :148-151: holds. `writeConfigOverlay` has one call site, :171.
- (iv) e2e-test-surface.ts :10-12: CR-2. "a hit fails the job" and "a miss is a check, not a proof" hold.
- **Comment-only proof** (erm-g1r-comments.mjs, rc=0):
  - 23 changed lines, 0 without a comment prefix.
  - Both files, with comments removed by the TypeScript 5.6.3 printer, are identical at base and head.
  - The positive control (a one-character code change) was detected.

**7. Section D at the head, in C:/dev/wt/erm.**
- verify-cites: rc=0, PASS (2710 files).
- verify-quotes: rc=0 in a shared hold. "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory…"
- verify-test-claims: rc=0, PASS (741).
- `verify.mjs --offline`: rc=0, "verify:plan PASS".
- `docsOnly.mjs origin/main HEAD`: rc=1, as expected. It lists exactly lib.mjs and e2e-test-surface.ts.
- `node --test` over scripts/plan, hooks and evidence: rc=0, 598 pass, 0 fail.
- `npm run test:citation-integrity`: rc=0, "== 30 passed, 0 failed ==". I installed nothing.
- `gh pr checks 292`: rc=0, 8 checks, all pass.
- `gh run view`: all six runs (42267740066, 42267740028, 42267740394, 42267740128, 42262749879, 42262749983) are on headSha db6f7c43b796089a751872161abac9ad64022b98, completed, success.
- PR headRefOid is db6f7c43…, draft.
- Porcelain afterwards is empty (0 bytes), and HEAD is unchanged.

## For the human
- **CR-1:** C14's "port identifiers" is not true of `check:dist-clean`'s list. Your answer is replacement words or acceptance as it stands.
- **CR-2 and CR-3:** the DRAFT comment sentences at the click. One repeats CR-1's clause. The overlay comment's "only for the lifetime of one launch" is untrue, and its "only generated file" is doubtful from reading.
- **Observation, not a finding on this piece:** if Tauri's dev binary does embed the overlay (CR-3b), then running `target/debug/spatial-ide-shell.exe` directly after an e2e launch opens the port. It is a dev build and not shipped, so C1 is unaffected.

## The packet's gaps
- §4 says the OPEN-4 run was on "a plain release build of main 85c6daef". The tester report says aa370b310e408af06f6563951a3feb02307e6992. I checked the difference from aa370b31 to the head myself.
- It gives no location for Cargo.lock: the wry entry is in `frontends/shell/src-tauri/Cargo.lock`, not the root Cargo.lock.
- It gives no installed copy of Vite or Tauri for the reads that sit outside the repository. The worktree has no node_modules, so I read the main checkout's, read only.
- It does not say that the form's line numbers for the README shift by +1 at the base (U12's line at :217).

## Hold lines (own project only, also= elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:70272`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:70272 affinity=FF (cores 0-7)`

## Background shells left
None.
- by0e5zxc5 (the hold and verify-quotes) completed with exit 0.
- b1ggzz7i2 (a bounded wait loop: 5 s sleeps, a 540 s cap) completed with exit 0.
- I started no other process, and I killed none.

Scratch files are under <the session scratch folder>/, each named erm-g1r-*. The key ones are erm-g1r-bytes.mjs/.out, erm-g1r-pins.out, erm-g1r-comments.mjs/.out, erm-g1r-wryhash.txt and erm-g1r-d-*.txt.
