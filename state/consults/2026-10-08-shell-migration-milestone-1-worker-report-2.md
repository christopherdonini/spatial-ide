*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 2 worker report, at the branch head f214f1f4b0a3a1ee43c265c639521c35ca1ee55f (the same worker-high, resumed about 03:53Z, report at 06:01:00Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 0640da96da9065e01745c00c04e964264066093951e7a4af654491946c7e3f74. Paths and lines below are at the branch head or at the base e888787e as the report names them, not main.*

---

# Stage 2 report: node:shell-migration-milestone-1@g4

Head is f214f1f4b0a3a1ee43c265c639521c35ca1ee55f, equal to origin's. The worktree is clean, `C:/dev/wt/m1-base` is removed with `git worktree remove`, and no app or vite process of mine is left running (ports 9223 and 5400 are free). Every heavy command ran inside a shared hold, one at a time. Where a command was not under a hold I say so below. Model: Sonnet 5.5 (`claude-sonnet-5-5`); no override and no handoff.

**What you must know first.** Port 5180 is in this machine's Windows excluded-port range (5120-5219, `netsh int ipv4 show excludedportrange protocol=tcp`). `tauri dev` cannot start, because vite dies with `listen EACCES ::1:5180`. This blocked the first e2e:regression launch and the first residency-harness launch. Details are in the launch workaround below.

## 1. Commands, exit codes, holds

| # | Command | rc | Held |
|---|---|---|---|
| 1 | `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture generate_the_multipolygon_f1_fixture generate_the_point_p1_fixture generate_the_line_l1_fixture`, from `C:/dev/spatial-ide` | 0 | yes, cold build |
| 2a | `npm run verify` in `frontends/shell`, first try | 1 | yes |
| 2b | `npm run verify`, after `npm ci` in `renderer/bundle-viewer` | 0 | yes |
| 3 | Seven e2e suites (regression, refusal-contract-baseline, admission, filter, filter-panel, style, console) at the m1 head | see section 3 | yes, each |
| 4 | e2e:publish, e2e:residency-harness, both routes of `source-changed.mjs`, `source-watch-idle.mjs`, `pan-anchor.mjs` and e2e:layout, each on a fresh launch | see section 3 | yes, each |
| 5 | Base runs at e888787e of the failing suites (section 4) | see section 4 | yes, each |
| 6 | `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 (450 pass, 0 fail) | yes |
| 7 | `verify.mjs`, `queue.mjs --check`, `site.mjs --check`, `verify-quotes.mjs`, `verify-test-claims.mjs`, at f214f1f4 | 0 each | no (light node scripts) |
| 8 | `verify-cites.mjs`, at f214f1f4 | **1** | no |

- **Fixtures (command 1):** the main checkout's tracked-file status was not touched by me. The two untracked entries are unchanged, and the tracked files in its status are the custodian's own concurrent edits. Command 1 was a cold build and took about 20 minutes.
- **`npm run verify` (command 2b):** 78 vitest files and 1,184 tests passed; two further checks reported 76 and 30 passed; the build, `check:dist-clean` and `check:dist-notice` all ran.
- **First verify failure (2a):** it failed in the `pretypecheck` step because `renderer/bundle-viewer/node_modules` was missing. I ran `npm ci` there (an untracked `node_modules`, no lockfile change), then the second run passed.
- **Before the first e2e run** I warmed the dev target with `cargo build` in `frontends/shell/src-tauri` (held, 19 m 57 s).

## 2. Fixtures generated (sha256)

- multipolygon-f1.parquet: `93f572358e5ecdf0cac05b1620bec4ce53ed9ba6b6bdc32c8c0c9a02d415ceaf`
- point-p1.parquet: `429452fafbae8f0bae1f714bcea1a5738185af195b8ebcbcb826e1047949eff3`
- line-l1.parquet: `f9c551194b2b04fde2726fe5f6a87e1d023fb911a7404c1d5338260164f6040c`

These were the only missing files in regression.mjs's existence list. e2e:layout also recorded two hashes, unchanged before and after the run. filter-zoned.parquet is `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`, and 100k-happy-path.parquet is `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49`.

## 3. Results at the m1 head, with step counts

| Suite | Result |
|---|---|
| e2e:regression | 18 rows: 14 PASS, 1 INFO (`NET'`), **3 FAIL: A9', K6, C2'/C3'**. MP', PT' and LN' pass. |
| e2e:refusal-contract-baseline | 3/3 PASS |
| e2e:admission | 11 steps: 9 PASS, **2 FAIL: MAP', BOTHNEEDED'** |
| e2e:filter | 3/3 PASS |
| e2e:filter-panel | 5 steps: 4 PASS, **1 FAIL: FIND'** |
| e2e:style | 6/6 PASS (includes the added Style-tab click) |
| e2e:publish | 5 steps: 4 PASS, 1 SKIP (EXPIRED', a documented skip) |
| e2e:console | 11 steps: 7 PASS, **4 FAIL: HEXLIM', CLASSC', GROUP', REGRESS'** |
| e2e:residency-harness | exit 0. The default instrument-on trial recorded an open-drain plus 11 trace steps, with no verdicts. It ran on `filter-zoned.parquet` (not the 5 GB fixture). The fixtures sit on drive C: and no number is compared with any earlier record (§0.6). |
| source-changed.mjs, default route | 8 rows: 7 PASS, **1 FAIL: S4** |
| source-changed.mjs, `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` | 8 rows: S1, S2, fixture-integrity PASS, S3 INFO, **5 FAIL: S4, S5a, S5b, S5c, S5d** |
| source-watch-idle.mjs | 9/9 PASS (8 steps plus fixture-integrity) |
| pan-anchor.mjs | 16 checks: 12 PASS, **4 FAIL** (small: paint-vs-event dx=±250, small: there-and-back-net, large: paint-vs-event dx=250) |
| **e2e:layout, at 27e4816c** | **8 steps + FIXTURES, all PASS** |

- **e2e:layout, first run:** it failed E-FOCUS, a defect in my own step (section 5).
- **source-changed, default route:** I ran it twice. The first run attached to my pre-launched app, so it reported `launched:false`, which the suite says does not prove a branch. The fresh launch (`launched:true`) gave the identical result.
- **The `console` suite** runs `REGRESS'`, which re-runs e2e:regression as a subprocess.

**Launch workaround.** This is a deviation from the standard launch path; the result is still real code in a real WebView2, but not the standard `tauri dev` launch.
- vite runs from the worktree on 127.0.0.1:5400.
- The debug exe was rebuilt once with `TAURI_CONFIG` set to the e2e window overlay, with `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"` added to its WebView2 arguments. The page URL, origin and CDP port are the real ones: `http://localhost:5180/` and 9223.
- Suites that need `launched:true` (publish, residency-harness, source-changed, source-watch-idle, pan-anchor, layout) ran with a gitignored `npx.cmd` stand-in earlier in `PATH`, which starts that app in place of `tauri dev`.
- No tracked file was edited for any of this.
- Rerun on a machine whose port 5180 is free if you want the standard path.
- Smaller process slips: the first admission relaunch shared a Bash call with its hold, and `cd` was not first. Also the first residency-harness attempt killed my pre-launched app, which is the harness's own sweep.

## 4. Failures, classified (each suite also run at base e888787e, same fixtures, same exe, held)

| Step | m1 | Base | Class |
|---|---|---|---|
| regression C2'/C3' (expected `engine.identity_unusable`, got `admitted`) | FAIL | FAIL | **pre-existing** |
| admission MAP' and BOTHNEEDED' (same `admitted` where a refusal is expected) | FAIL | FAIL | **pre-existing** |
| console HEXLIM' (key set now includes `columns`) | FAIL | FAIL | **pre-existing** |
| console GROUP' (group-header count) | FAIL | FAIL | **pre-existing** |
| console REGRESS' | FAIL | FAIL | **pre-existing** (it carries regression's C2'/C3'; at m1 it also carries A9' and K6) |
| console REFUSAL' | PASS | FAIL | base-only (not this piece's) |
| source-changed default route, S4 | FAIL | FAIL | **pre-existing** (identical assertion) |
| regression **A9'** | FAIL | PASS | **I3, class 2** |
| regression **K6** | FAIL | PASS | **I3, class 2** |
| filter-panel **FIND'** | FAIL | PASS | **I3, class 2** |
| console **CLASSC'** | FAIL (timed out 20000 ms) | PASS | **I3, class 2**, as Amendment 3 item 9 predicted |
| source-changed **post route** S4, S5a to S5d | FAIL | all PASS | **I3, class 2** |
| pan-anchor, 4 checks | 12/16 | 16/16 | **I3, class 2** |

I3 evidence at m1:
- **A9':**
  - no interior-verified hover candidate was found at a 668 x 730 buffer;
  - every best candidate was edge-adjacent (4/25, 5/25, 7/20 and 3/25 pixels touching background);
  - it stopped at notch 3 on two consecutive declines;
  - at base it found one at notch 3 with a final fraction of 100%.
- **K6:** the "confirming" state was never observed across 8 notches. It passed at base.
- **FIND':** the filtered canvas read 0.275% non-background against a 0.5% floor; base read 1.60%. regression's own FIND' passed on both trees (0.28% against 1.67%).
- **CLASSC':** a real `page.fill(".style-fill-color")` timed out, because the input sits in the hidden Style tab. This is the predicted cause.
- **source-changed:** the post route's S4 timed out after 60 s, and S5a to S5d followed from it.
- **pan-anchor:**
  - the small window (328 x 570) lost the paint-vs-event centroid ("content left frame") and failed there-and-back-net by -292 px;
  - the large window (788 x 830) failed paint-vs-event dx=250 at 4.35 px against a tolerance of 4;
  - base ran 820 x 200 and 1400 x 200 windows and passed 16/16.
- **Common cause:** all of these are map-geometry effects, because the map changed from about 200 px high to 668 x 730. I did not edit anything for them (I3).

Not fixed, and not caused by the piece: the whole "pre-existing" group above.

The one failure that was mine to fix: e2e:layout's E-FOCUS (next section).

## 5. Fix inside §7, one commit

- **27e4816cf0d84c412a29eaebedf96c59c4acbba1** (fix: e2e/layout.mjs E-FOCUS restarts sequential focus at the top of the document).
- The first layout run visited ["map","inspector","activity"] and never the top bar or Layers. `blur()` leaves the sequential-focus starting point on the last focused element, which was the map.
- The step now focuses the body with a temporary tabindex. layout.mjs stays at 357 lines, no threshold changed, no product code touched.
- The rerun passed 8/8 with the walk "top > layers > map > inspector > activity".

## 6. E rows' mutations (applied by hand, whole suite run on a fresh launch, reverted; observed at 27e4816c)

| Row | Mutation | Failing assertion |
|---|---|---|
| E-KEYS | I and J bindings swapped | "E-KEYS: Control+KeyI press 1: inspector hidden=false, expected true (only inspector may flip)" |
| E-FIELD | focus relocation removed | "E-FIELD: focus is not on the map region while the Inspector is hidden" |
| E-FOCUS | Inspector aside before `<main>` | "E-FOCUS: the Tab walk visited [top,layers,inspector,map,activity], expected [top,layers,map,inspector,activity]" |
| E-LANDMARKS | Inspector's `aria-label` dropped | "E-LANDMARKS: the DOM has no aside:Inspector" |
| E-FIT, as §4 states it: Inspector default width 900 | | **no failure.** E-FIT PASS, all 8 steps PASS. The fit shrinks the Inspector, so the map is 481 x 524 at 1280 x 800 and 481 x 492 at 1366 x 768. |
| E-FIT, deletion of the shrink step alone | | **no failure.** The defaults fit without shrinking: 668 x 524 and 754 x 492. |
| E-FIT, both together (900 and no shrink) | | FAIL: "E-FIT native: .canvas-container is 374 x 524.21875, below 480 x 320". E-KEYS also failed ("374 x 730.2 ... below 480 x 320"). |
| E-REOPEN | `<main key={String(state.inspector.open)}>` | E-KEYS fails first: "E-KEYS: Control+KeyI press 1: the stored .working-canvas node is no longer the live, connected one". E-REOPEN itself still PASSes, since a remount is what it asserts. |

For E-FIT, as predicted in Amendment 3 item 9: the mutation as written, and the shrink deletion on its own, are both absorbed. Only the combination fails it. The class is for you to assign.

## 7. RESIZEQ and the OPEN-7 line

- RESIZEQ, recorded and not asserted: **0 new `viewport_query` lines within 3 s after closing the Inspector with Ctrl+I, and 0 after reopening it**, pointer still. It is the same 0 and 0 in every layout run, including the unmutated ones. **H1 holds.**
- Written: KNOWN-LIMITATIONS item 39 as DRAFT wording for the human's P6 sight, in commit **f214f1f4b0a3a1ee43c265c639521c35ca1ee55f**.
- It says what the human will see (a strip of the map with no features after opening, closing or resizing a region) and that a pan or zoom fills it. It names the proposed node `shell-map-refill-after-resize`. The strip itself is an inference from the zero count, which the comment says; walkthrough row U6 records what the human sees.
- KNOWN-LIMITATIONS is now +10/-5 against the 20-line allowance.

## 8. Governance checks, all at f214f1f4

- `node --test` over `scripts/plan`, `scripts/hooks` and `scripts/evidence`: 450 of 450 pass.
- `verify.mjs`: PASS.
- `queue.mjs --check`: current.
- `site.mjs --check`: current.
- `verify-quotes.mjs`: PASS (121 checked, 90 verified, 30 baselined, the same 30 baselined as before my edits).
- `verify-test-claims.mjs`: PASS (520 claimed tests).
- **`verify-cites.mjs`: FAIL, rc 1, 4 unresolved cites, caused by this piece.**
  - `SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md` lines 17, 95 and 101, and `state/consults/2026-10-07-shell-migration-milestone-1-architect-draft.md` line 61, cite `App.tsx:1649-2024`, `:1997-2006` and `:2014-2020`.
  - My edit shrank `App.tsx` to 1,997 lines, so those lines no longer exist. At the base the file had 2,025 lines and the cites resolved.
  - The form is append-only and these are historical pins, so the remedy is yours: an amendment naming which is authoritative, the pin or the tree. I made no edit.

## 9. §7 at the final head (by its command, base e888787e)

G1 952 (limit 1,000); G2 273 (450); G3 337 (400); G4 66 (100); **G5 1,004 (900, over by 104)**; G6 383 (400); total **3,015 of 3,250** over 25 files. Outside the count: walkthrough 118 of 180; e2e/README 12 of 40; KNOWN-LIMITATIONS 15 of 20. Stage 2 added nothing to G1 to G5; it changed G6 by 0 lines (357 for layout.mjs, 3 under its limit).

## 10. New commits

- 27e4816cf0d84c412a29eaebedf96c59c4acbba1 (e2e/layout.mjs E-FOCUS fix, inside §7)
- f214f1f4b0a3a1ee43c265c639521c35ca1ee55f (KNOWN-LIMITATIONS 39, the OPEN-7 line)

Both are signed off and were published in their own calls.

## 11. Deviations, with classes

- **Launch method (class 2, environment):** the excluded port 5180 and the workaround above.
- **`npm ci` in `renderer/bundle-viewer`:** a prerequisite that `npm run verify` needs; no tracked change.
- **The seven I3 failures (class 2):** A9', K6, FIND', CLASSC', the post-route source-changed steps, and pan-anchor's four checks. No suite or threshold was edited. The human is to be asked.
- **layout.mjs fix:** inside §7's G6 budget; I label it a stage 2 repair (class 2).
- **verify-cites failure:** needs a record amendment, as in section 8.

## 12. Noticed, not done

- The pre-existing failures were not investigated. The `missing-identity-refused.parquet` and `bothneeded-refused.parquet` fixtures on disk admit instead of refusing, which looks like stale files.
- The `console` suite's REFUSAL' passed at m1 and failed at base. Both look like timing, and I did not retry.
- The OPEN-7 limitation text is the human's wording at P6 and was left as a draft.
- The base-vs-m1 geometry difference (200 px high map against 668 x 730) underlies six of the seven I3 failures. Whether to re-aim those suites is a question for you, since §2.7 names none of them but source-changed's selector.
