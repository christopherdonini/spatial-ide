*Custodian's filing note (2026-11-06): the e2e README worker's report for `e2e-readme-security-posture-measure-build`, built at db6f7c43 on `cut/e2e-readme-security-posture-measure-build` under its full form (`governance/forms/frontends/E2E-README-SECURITY-POSTURE-MEASURE-BUILD-PREREGISTRATION.md`, with Amendment 1). Dispatched at 2026-11-06T17:28:48.820Z by its transcript from a brief of 14580 bytes (sha256 3282313ddd15c32bcb9330059545d0ab5995f76f5fce28b09d170ce51d3508f2). The run to its final hand-back at 2026-11-06T17:42:42.281Z by its transcript (claude-sonnet-5-5; unique calls Bash 30, Read 9, Write 2, Edit 12 and two hand-backs, 55). Its first hand-back, at 2026-11-06T17:30:19.695Z, was a stop at step 2 (sha256 1503efd4d824bb35881f5f3b620032bfea041c00d3bd0798e2eadfd820ba7a8d, recorded in the ledger at 1106au): the brief predicted `2 12` for the paragraph commit's numstat where git's default diff gives `3 13` for the same content, the custodian's error. The custodian's correction reached the worker by message at 2026-11-06T17:30:57.385Z by the transcript, and the worker resumed. Against the brief, the worker wrote two files in /tmp; the correction told it to delete them, it reports both deleted by name, and the custodian found none left. This report is the final hand-back, saved from it with one final newline; its sha256, from line 5 to the end, is 42abb18ee43d66ddee76f588c029893d4a41f05a0bcd99a23cc89b12e9988b39. The custodian re-read, after a fetch: the branch at db6f7c43b796089a751872161abac9ad64022b98; `git diff --numstat origin/main...` README 7/17, lib.mjs 11/7 and e2e-test-surface.ts 3/2; the README's sha256 at the head e986d16e3c38c6ee67d8457d11c4db174cb19d157f15508881c7a7b72acd88d6; README line 748's three commits (cf24f9b4, 6554b96c, 13df4cb5) each carry a Claude Sonnet 5.5 Co-Authored-By trailer, so B11's insertion edits agents' words. Model output, not Authority.*

---

Built: e2e-readme-security-posture-measure-build at db6f7c43b796089a751872161abac9ad64022b98

- **Start:** HEAD fa7d117976436dceb5b464e2675f8a3483d8117f and porcelain empty. I stopped once at step 2 because `git diff --numstat` printed `3 13`. The custodian then corrected the check. Re-shown after the correction: `git diff --numstat` gives `3 13` and `git diff -U0 --numstat` gives `2 12`, with README sha256 940be835… as the script's readmeAfter.
- **Base checks, all rc=0:**
  - The heading occurs once (line 7), and the paragraph (lines 9-19) is 11 lines.
  - The Layout spec entry is at line 748. `git log -L 748,748:frontends/shell/e2e/README.md --no-patch --format='%H %cI %s' fa7d1179…`, byte-copied:
```
cf24f9b41b218e798d365587db57bb82230a0ed4 2026-10-11T04:09:28+02:00 docs: e2e README's FILL sentence restated for FILL' (Amendment 2 item 12)
6554b96c926a7f884b2cde952660df42f4238110 2026-10-11T01:38:57+02:00 docs: e2e README's layout paragraph names the asserted RESIZEQ and FILL and the recorded BURST
13df4cb531c1a1fe18bac0d8e855ac2c68ab012c 2026-10-08T01:39:38+02:00 docs: shell-migration-milestone-1: the walkthrough (location words, B2 and I1, the export labels, T4 and T5, the new Part U), e2e/README.md, and KNOWN-LIMITATIONS 18's retirement
```
- **Commit subjects:**
  - 93fbef41 "docs: e2e-readme-security-posture-measure-build commit 1, the security-posture paragraph and heading in the human's words, applied by the custodian's script"
  - a462baf5 "docs: e2e-readme-security-posture-measure-build commit 2, B11's E-FLOOR entry and B12's lib.rs symbol anchors"
  - db6f7c43 "docs: e2e-readme-security-posture-measure-build commit 3, OPEN-6's four sibling comments in lib.mjs and e2e-test-surface.ts (comments only, DRAFT for the human)"
  - Each message file had `@` only in its first trailer line.
- **Script:** erm-para.mjs sha256 cfc469686d38fc4dce1149c30d045a28e8ff8e7d7dcc6f66e4f8fa8243b65ebf. The dry run printed exactly the four expected values (words a9a7d8c3…90db5, readmeBefore bcd23be5…38f02, readmeAfter 940be835…050ca, replaced 11). The README's sha256 after `write` was 940be835c960a0e72bb8a0275b7c86a2b25ba69566179644c3b5b7fefee050ca.
- **B11 entry (commit 2),** inserted between E-FIT's parenthetical and E-REOPEN's, with E-FIT's trailing ` and ` becoming `, `:
  `E-FLOOR` (at 1024 x 640, set by `page.setViewportSize`, with Activity open and both the attention strip and the status bar filled past their caps by 40 probe rows each that the step adds, un-hiding the strip, because the product has no path that fills them: the map region is visible, `.working-canvas` is the same connected node, and `.canvas-container` is at least 480 x 320; the step fails if the viewport cannot be set to that size or the inner size differs, and the probe rows and the strip's `hidden` flag are put back afterwards)
  - Each clause rests on code in layout.mjs:
    - The 1024 x 640 viewport is `FLOOR_VIEWPORT`, set by `page.setViewportSize`, and a failure to set it throws.
    - Activity open is the `Control+KeyJ` press plus the `activityHidden` throw.
    - 40 rows is `FLOOR_PROBE_ROWS`, added to `.attention-strip` and `.status-bar` in `page.evaluate`, with `strip.hidden = false`.
    - The map region, node and size come from `assertMapUsable`: `mapHidden`, `canvasSame`, and `MAP_MIN_WIDTH_PX = 480` / `MAP_MIN_HEIGHT_PX = 320`.
    - The inner-size throw is `inner !== 1024x640`.
    - Removal is the `finally` block: probe nodes removed and `hidden` restored.
- **B12 sentences (commit 2):**
  - First: "(Tauri's own `app_log_dir()`, called in `lib.rs`'s `setup()`; the". Basis: `.app_log_dir()` at lib.rs line 326, inside the `.setup(|app| …)` closure that starts at line 277.
  - Second: "(`SessionLog::open`, in `lib.rs`'s `setup()`, runs before that route's own webview-window build that opens the CDP port, the `#[cfg(feature = "measure-build")]` block in the same `setup()` -- and".
  - Ordering check: `SessionLog::open` is at lib.rs line 328 and the `#[cfg(feature = "measure-build")]` block is at lines 511-529. The block builds the window with `WebviewWindowBuilder::from_config(...).additional_browser_args(...).build()` and `--remote-debugging-port`. The closure ends with `Ok(())` after the block, so both sit in the same `setup()` and the ordering claim is true.
  - The README holds no `lib.rs:<digits>` (count 0), and none of the added lines carries one.
- **Comment sentences (commit 3).** The sentences below are my wording: the posture phrases are the paragraph's, and the rest is mine, DRAFT for the human's sight.
  - lib.mjs header: "nothing here turns the port on by default, and a packaged `tauri build` never sees this file, since it never exists until a launch generates it. The app itself opens the port in one other build, by design:" followed by "the measure build (`build:measure`, a release build with the `measure-build` feature), in which `src-tauri/src/lib.rs` opens the port with a checked-in default and `isInstrumentedBuild.ts` keeps the in-page hooks (`src/e2e-test-surface.ts`) in when `VITE_MEASURE_BUILD` is set" and "(the paragraph under "Security posture" in e2e/README.md has the whole posture)."
    - Basis: lib.rs lines 511-529 (the port opens, default "9223"), isInstrumentedBuild.ts line 32, and `.env.measure` (`VITE_MEASURE_BUILD=1`).
  - `writeConfigOverlay`: "the only generated file that holds the debug-port flag, and only for the lifetime of one launch (…); the measure build carries the flag in checked-in Rust (`src-tauri/src/lib.rs`), not in an overlay."
    - Basis: writeMeasureConfigOverlay.mjs writes only `create:false`, `frontendDist` and `beforeBuildCommand`, and the flag string is in lib.rs lines 519-521.
  - `attachOrLaunch`: "the other build that opens the debug port is the measure build, which does it from `src-tauri/src/lib.rs` (the posture is in e2e/README.md's "Security posture")." Basis: lib.rs lines 511-529.
  - e2e-test-surface.ts: "`check:dist-clean`, run in CI after `npm run build`, greps the built dist/ for a fixed list of hook and port identifiers (`e2e/checkDistClean.mjs`): a hit fails the job, and a miss is a check, not a proof". Basis: the checkDistClean.mjs header, which calls a miss "ONE-DIRECTIONAL" and not a proof, and package.json's `check:dist-clean` script.
  - Substring check (erm-w-check.mjs, rc=0): the 3 posture phrases above (the measure-build phrase, the `check:dist-clean` phrase, and "a hit fails the job, and a miss is a check, not a proof") are each an exact substring of the README line. Each phrase sits on a single comment line.
  - Comment-line check: all 23 changed lines are comment lines, 0 non-comment. `node --check frontends/shell/e2e/lib.mjs` gave rc=0.
  - I left the `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` paragraph in lib.mjs alone.
- **CI on the pushed head db6f7c43:** run 42262749879 (Ported notices) completed with success. Run 42262749983 (Product CI — shell) completed with success.
- **Size and files:**
  - `git diff --name-only` over the base shows exactly the README, lib.mjs and e2e-test-surface.ts.
  - `git diff --numstat` is README 7/17 (24 lines, ceiling 40), lib.mjs 11/7 and e2e-test-surface.ts 3/2. That makes 47 lines against the ceiling of 70. No overrun.
- **Checks at my head, rc and last line:**
  - verify-cites rc=0: "verify:cites PASS — every rooted (in-tree) path:line reference across 2710 file(s) resolves."
  - verify-quotes rc=0 (shared hold): "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory…"
  - verify-test-claims rc=0: PASS, 741 claimed tests.
  - `verify.mjs --offline` rc=0: "verify:plan PASS".
  - `node --test` over scripts/plan, hooks and evidence: rc=0, 598 pass, 0 fail.
  - `npm run test:citation-integrity` rc=0: "== 30 passed, 0 failed ==". I ran no install.
  - docsOnly rc=1 as expected, listing exactly lib.mjs and e2e-test-surface.ts.
  - Byte-equality: the heading is `## Security posture`, then a blank line, a line, a blank line. sha256(line + "\n") is a9a7d8c3d4fbd9df91af98b0ef72188e59849681aaa4cd8866e01d57f9f90db5, equal to the words' sha256.
- **Stop rules and deviations:**
  - The `3 13` numstat stop above, resolved by the custodian's correction. No other stop rule was met.
  - I wrote two files in /tmp (erm-w-wt.txt, erm-w-logL.txt), against the brief. I deleted both by name and wrote nothing further outside my scratch folder.
- **Hold lines (SpatialIDE only):** `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:74024` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:74024 affinity=FF (cores 0-7)`.
- **End state:** origin's branch equals HEAD (db6f7c43…) and the porcelain is empty. No PR action was taken.
- **Background shells left:** none. The verify-quotes shell completed and released.
- **Pre-gate self-check:**
  - Interfaces: I read lib.rs, layout.mjs, isInstrumentedBuild.ts and writeMeasureConfigOverlay.mjs before citing them. This piece adds no callbacks, options or `pub` items.
  - Completion claims: each rests on a command above with its rc.
  - Messages: only comments and README text changed, and I checked each against the code at this commit.
  - Required tests: no test was added.
- **Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. The custodian's mid-run correction came after my first hand-back.
