*Custodian's filing note (2026-10-09): the worker-high's triage of `e2e-failures-present-at-the-base`, reported only, in the detached worktree `C:/dev/wt/e2etri` at main 316a4476 (slot 1, item c, run ahead of items a and b, which wait on the human). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8b0ac4cc82afcc2078181af87ff5132a229e92d1b6e3ad2a0fc832cddf092bc7. Run window from the transcript: 07:09:51Z to 08:23:27Z (Bash 126, Write 2 in its scratch folder, Read 1, Grep 1). The custodian checked: the worktree's `git status --porcelain` empty at 316a4476; no process or port left from the runs; `frontends/shell/e2e/console.mjs` line 364 holds the six-key list without `columns`; `engine/src/dataset.rs` lines 1667 to 1675 hold the R-I3 session-tier comment where `identity_unusable` used to be raised. The rest are the worker's runs and readings. Its own section on console REFUSAL' and GROUP' asks for a solo re-run, which the machine paragraph gives to the custodian.*

---

# Triage report: e2e-failures-present-at-the-base, at main 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d

Reported only. No tracked edit, no commit, no publish. Every line cite is at main 316a4476 unless it says otherwise.

## Summary

All eight named failures still reproduce at main (REFUSAL' is the one to re-run alone). None is a stale fixture. I found no real defect.

| Step | Still fails at main? | Class |
|---|---|---|
| regression C2'/C3' | yes | stale expectation (session identity tier) |
| admission MAP', BOTHNEEDED' | yes | stale expectation (same cause) |
| console HEXLIM' | yes | stale expectation (skp/0.6 `columns`) |
| console GROUP', REFUSAL' | yes | stale expectation (candidate arm is now the default) |
| console REGRESS' | yes | carries regression's C2'/C3' (nothing of its own) |
| source-changed default route S4 | yes | stale expectation (advisory watcher) |

- The worker's reading that the identity fixtures are stale files is **refuted**. Fresh copies from the generators are byte-identical to the files on disk.
- The worker's reading on HEXLIM' (the key set now includes `columns`) is **confirmed**.
- Regression's only FAIL at main is C2'/C3'. A9', K6 and FIND' PASS in my run.
- Process slip: the ports were free and no app, vite or cargo process of mine was left. One hold call per run, as listed in "Runs" below.

## Per step

### 1. regression C2'/C3' and admission MAP', BOTHNEEDED'
- **Still failing, yes.**
  - regression: `[C2'/C3'] FAIL: expected {kind:"refused", code:"engine.identity_unusable"}, got {"kind":"admitted"}`.
  - admission: `MAP'` fails with the same text.
  - admission: `BOTHNEEDED'` fails with "expected engine.identity_unusable after asserting the CRS alone, got {admitted}".
  - The other 9 admission steps PASS, including DUPKEY'.
- **Class: stale expectation. A ruled product change replaced the behaviour.**
  - The change is the session identity tier, R-I3. It landed in commit 01045ee3 (2026-09-16, Brief A P3). At `engine/src/dataset.rs:1667-1692`, a single-file source with no `id` column and no declared mapping opens with `DatasetIdentity::new_session_ordinal(...)` instead of raising `IdentityUnusable`. A declared mapping naming a missing column still refuses.
  - The rule is at `engine/ADMISSION-PREREGISTRATION.md:67` (R-I3) and `:117` (row F-7: "polygons, no `id`, no declaration, single file").
  - Its implementation record is at `:254-258` (Amendment 1, item 2). The reach is narrowed to files with no `id` column at all. A bad `id` still refuses.
  - `:290` item 7(b) names `engine/tests/identity.rs`'s keyless assertion as the one R-I3 replaces.
  - The consequence was put on the human's sight list: `engine/ADMISSION-PREREGISTRATION.md` §12d, and DECISIONS-PENDING entry 73, item (d), at `DECISIONS-PENDING.md:2027-2029`.
  - The accepting ruling is `docs/adr/ADR-016-stable-feature-identity-admission.md:180-197` (Amendment 1, "Accepted"), with the acceptance note at `:238`.
  - Evidence the product matches that contract: `cargo test -p spatial-engine --test identity --test session_identity` at main gives 8 and 18 passed. These include `engine/tests/identity.rs:149-165` (a keyless source admits as `SessionOrdinal`) and `a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis`.
- **Stale-fixture reading tested and refuted.**
  - The generators are `generate_the_missing_identity_refusing_fixture` and `generate_the_bothneeded_refusing_fixture`, in `kernel/tests/manual_walkthrough_fixtures.rs`.
  - I ran four generators into the worktree's own `target/fixtures/manual-walkthrough`. That is not a location any suite reads. The main checkout's copies were not touched, and their hashes are unchanged after all runs.
  - Hashes, on-disk against fresh copy (identical in every case; the dupkey and no-crs pair are controls):

    | Fixture | sha256 (on-disk = fresh) |
    |---|---|
    | missing-identity-refused | b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424 |
    | bothneeded-refused | 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8 |
    | dupkey-refused (control) | cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1 |
    | no-crs-refused (control) | 5139b97bd43449d69feb23475ce7c12acc5054a0e7474b2d3349e75ca723d6e9 |

  - `engine/src/fixture.rs:623` shows `ForeignKeyColumn` writes `parcel_key` and no `id`. The files are exactly what their generators write. The fixtures are not stale; their names, and the generator's doc comment at `kernel/tests/manual_walkthrough_fixtures.rs:477-481` ("refused ... until a mapping is declared"), are.
- **What a fix would touch (files only, no product change):**
  - `frontends/shell/e2e/regression.mjs`, the C2'/C3' step at `:2634-2644`.
  - `frontends/shell/e2e/admission-remediation.mjs`, `stepMap` at `:410` (first assertion `:412`) and `stepBothNeeded` at `:486` (failing assertion `:500`).
  - Optionally a new generator in `kernel/tests/manual_walkthrough_fixtures.rs`, if a still-refusing identity fixture that offers `parcel_key` as a candidate is wanted. The existing `dupkey-refused.parquet` still refuses but has no `parcel_key`.
  - `frontends/shell/MANUAL-WALKTHROUGH.md` (rows C2/C3, I4, I5 and the coverage table) and `frontends/shell/e2e/README.md`.
- **Inferences:**
  - Both admission steps stop at their first failing assertion. The declaration route they were meant to prove is not exercised at main. Its third call already goes through `openPath` with `{identity:{column:"parcel_key"}}`, so it can still be exercised.
  - REGRESS' stops at regression's exit 1. Once C2'/C3' is fixed, REGRESS' will run `e2e:admission` and fail on MAP' and BOTHNEEDED' next.
- **Adjacent observation, not a failing step.**
  - By grep, `candidate_columns` is consumed only from a refusal, at `frontends/shell/src/admission/AdmissionPanel.tsx:402`.
  - `engine/ADMISSION-PREREGISTRATION.md:282-289` states the candidate list is recorded but not on the wire.
  - So the app has no UI route to the identity declaration form for a keyless file that now admits.
  - Rule R-I3 at `:67` says the list is reported "so an operator can declare a mapping". That is a disclosed gap and a question for the human, not a defect I can classify.
  - `QUICKSTART.md:41` and `KNOWN-LIMITATIONS.md:55-61` (item 3) still describe the pre-R-I3 refusal. They are accurate for the v0.1.0 tag and not for main. This is a docs observation only.

### 2. console HEXLIM'
- **Still failing, yes.** "key set mismatch. Expected [bbox,bbox_crs,dataset,filter,limit,skp], got [bbox,bbox_crs,columns,dataset,filter,limit,skp]". It failed in three runs: the console suite, and the scratch default and baseline copies.
- **Class: stale expectation. The wire contract gained a field.**
  - The change is skp/0.6, commit 6cd17640 (2026-09-26, Brief B stage B1).
  - The contract is `protocol/skp/SKP-V0.md:887-897`: `columns` is "always present, never omitted", with `null` meaning no projection.
  - The shell mirror is `frontends/shell/src/skp/types.ts:253-264`. The client sends `columns: null` at `frontends/shell/src/skp/client.ts:122`.
  - The suite's list is `frontends/shell/e2e/console.mjs:364`. ECHO' reads its version from the entry and still passes.
- **Fix touches:** `console.mjs:364` (one key), and the README's HEXLIM' line. No product change.

### 3. console GROUP' and REFUSAL'
- **Still failing, yes, with one caveat.**
  - Both failed in the full console run and again in a scratch default-arm copy.
  - GROUP' reads "had 4 before, got 7 after (["×3","×2","×2","×2","×2","×2","×3"])".
  - REFUSAL' reads "no refused viewport_query class-A entry found in the DOM".
  - REFUSAL' is timing-sensitive, and a timing-sensitive failure in a shared run is not recorded as a failure. **Please re-run console REFUSAL' and GROUP' alone on the machine.**
- **Class: stale expectation. The default residency arm changed under the suite.**
  - The default flipped to the candidate (tiled) arm on 2026-09-07. The record is `frontends/shell/src/residency/residencyArm.ts:9-36`: RELEASE-0.1 item 7, DECISIONS-PENDING entry 52 (a), ADR-028.
  - The console suite was last recorded green on the baseline-era default. `frontends/shell/e2e/README.md:436` says "GREEN 10/10". Its dated commit is 1eb5272f, 2026-08-19.
  - The suite's own premises are in `frontends/shell/e2e/console.mjs:22-28` and `:543-558`. They say nothing else is recorded between the three queries.
  - **Discriminating run:** a scratch copy of `console.mjs` with the arm pinned to `baseline` before the first `openPath` (readback asserted, and `REGRESS'` removed) passes REFUSAL' and GROUP'. It still fails HEXLIM'. The same copy on the shipped default fails REFUSAL' and GROUP' again.
  - **Probe (default arm):**
    - The hook returned `refused` after 38 ms. The refused `viewport_query` entry first appeared in the DOM 299 ms after the call started. The suite reads at about 110-130 ms.
    - GROUP': the intended group (three `viewport_query` with `zone = 'residential'`) forms as ×3. Two further new groups appear from consecutive class-B entries (×4 and ×2), so the new-header count is 3.
  - A pan on this fixture now yields about 120 tile `viewport_query` entries, and the recorder holds at most about 256.
- **No contract violated.** `frontends/shell/src/console/ConsolePanel.tsx:31-34` says the expanded drawer re-renders at most once per frame, so a refusal visible by the time the call returns is not a stated contract. I found no other contract on console latency (I did not search every doc).
- **Fix touches:** `frontends/shell/e2e/console.mjs` only, plus the README.
  - Option 1: REFUSAL' polls with a bound, and GROUP' asserts the group by its predicate rather than counting all new headers.
  - Option 2: pin the baseline arm before the first open. That stops the suite exercising the shipped arm, so it is the human's or architect's call.
  - No product change either way.
- **Inference:** the mechanism (tile fan-out and class-B interleaving, with a coalesced render) is inferred from the probe. The arm dependence is measured.

### 4. console REGRESS'
- **Still failing, yes.** Its tail shows only `C2'/C3'` FAIL.
- **Class:** it carries regression's failures, nothing of its own (`frontends/shell/e2e/console.mjs:738-752` runs regression, then admission only if regression exits 0).
- **Fix:** nothing of its own.

### 5. source-changed default route, S4
- **Still failing, yes.** It was run with `launched:true`: the suite itself started the app through the `npx` stand-in.
  - `S4-issue-one-query` FAIL: "no viewport_query followed any gesture in the ladder. Ladder: pan-beyond-viewport 17->17, zoom-one-notch 17->17".
  - S1, S2, S3, S5a, S5b, S5c and fixture-integrity PASS.
- **Class: stale expectation. A ruled feature pre-empts the step's premise.**
  - The step touches the mtime, then expects the next query to be refused by the pre-check (`frontends/shell/e2e/source-changed.mjs:779-822`).
  - PLAN node `engine-source-change-watcher` (done, PR #127, `PLAN.yaml:2205`) added an advisory watcher. Its sight is `state/directives/2026-09-24-watcher-sight.md`, and its record is `engine/SOURCE-WATCHER-PREREGISTRATION.md`.
  - In my run the app's own status text reads "the advisory source watcher ended this dataset's session (observed-change)". The session log line `tile-session-ended-source-changed` fires 1791532367323, with no query anywhere after the touch. That is why S5a-S5c still pass.
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md:407` states that ancestors above the grandparent, and a symlink retargeted after admission, are "caught at the next pre-check, not while idle".
- **Fix touches:** `frontends/shell/e2e/source-changed.mjs` (S3, and S4's ladder) and its README text.
  - Inference: re-aiming S3 to a change class the watcher cannot see (a symlink retarget, or a change above the grandparent) would restore the pre-check route.
  - The route's G-A2 evidence (`engine/ADMISSION-PREREGISTRATION.md` Amendments 16 and 17, for example `:1644`) is a dated pin. At main this route as written cannot reach the pre-check.
  - No product change.
- **Inference:** the watcher fired between S3 and S4's first gesture. I measured zero queries and the status text. I did not time the ordering.

## Runs (every heavy one inside a shared hold; each was granted, with no 96-99 exit)

| # | What | rc |
|---|---|---|
| 1 | `npm ci` in `frontends/shell` | 0 |
| 2 | `cargo build` of the shell debug exe (the `TAURI_CONFIG` overlay, `D:/wt-targets/e2etri`), first try: no `renderer/bundle-viewer/dist` | 101 |
| 3 | `npm ci` and `npm run build` in `renderer/bundle-viewer` | 0 |
| 4 | `cargo build`, second try: no `src/generated/NOTICE.txt` | 101 |
| 5 | `npm run generate:notice` (light, unheld) | 0 |
| 6 | `cargo build`, third try (3 m 25 s) | 0 |
| 7 | `npm run e2e:regression`, fresh app | 1 (C2'/C3' only) |
| 8 | `npm run e2e:admission`, fresh app | 1 (MAP', BOTHNEEDED') |
| 9 | `npm run e2e:console`, fresh app | 1 (HEXLIM', REFUSAL', GROUP', REGRESS') |
| 10 | Scratch console-DOM probe, first try (backslash path slip in my probe) | 1 |
| 11 | The same probe, second try | 0 |
| 12 | Scratch console suite on the shipped default arm | 1 |
| 13 | Scratch console suite with the arm pinned to baseline | 1 (HEXLIM' only) |
| 14 | Console timing and GROUP' composition probe | 0 |
| 15 | `source-changed.mjs` default route, first try: my PATH stand-in was not honoured, so the real `tauri dev` was spawned. The suite waited 300 s, found no CDP port, and killed it | 1 |
| 16 | `source-changed.mjs` default route, second try, `launched:true` | 1 (S4) |
| 17 | `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored ...` (four generators) | 0, 4 passed |
| 18 | `cargo test -p spatial-engine --test identity --test session_identity` | 0, 8 and 18 passed |

- The app was stopped (`app-down`) after every run, and the ports were checked free.
- Process slips:
  - In each hold call I set my path variables before the `cd`.
  - Run 15 spawned a real `tauri dev` for 300 s before its own timeout killed it. It left no process and no `src-tauri/target`.
  - The scratch variants of `console.mjs` and my probes live in my scratch folder only.
- I built from the predecessors' scratch folders' method (copied into my scratch folder, originals untouched).

## Fixtures read (all under C:/dev/spatial-ide/target/fixtures/manual-walkthrough, hashed before and after the runs, unchanged)

| File | sha256 |
|---|---|
| 100k-happy-path.parquet | fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 |
| absent-crs-contradicted.parquet | 95e0fc3c888e4922590cb90ec4029279a34714ce3dd1c01be8cbee80b8afa260 |
| bothneeded-refused.parquet | 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8 |
| dupkey-refused.parquet | cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1 |
| filter-zoned.parquet | 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 |
| line-l1.parquet | f9c551194b2b04fde2726fe5f6a87e1d023fb911a7404c1d5338260164f6040c |
| missing-identity-refused.parquet | b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424 |
| multipolygon-f1.parquet | 93f572358e5ecdf0cac05b1620bec4ce53ed9ba6b6bdc32c8c0c9a02d415ceaf |
| no-crs-refused.parquet | 5139b97bd43449d69feb23475ce7c12acc5054a0e7474b2d3349e75ca723d6e9 |
| point-p1.parquet | 429452fafbae8f0bae1f714bcea1a5738185af195b8ebcbcb826e1047949eff3 |

- Hashed only, not read by any run: slow-filter-scan.parquet 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5; over-ceiling-refused.parquet b8b1bb9c437c06b5fd757b38113ab72b18a295e64730579551c0e4e8e1f4b992; 100k-scratch-partN.parquet fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49.
- Fresh generator copies (four files) are in the worktree's gitignored `target/fixtures/manual-walkthrough`, hashes above.
- `frontends/shell/e2e/out/source-changed-scratch.parquet` (the source-changed scratch copy, gitignored) hashes fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 before and after.

## Worktree final state
- `C:/dev/wt/e2etri` `git status --porcelain`: empty.
- HEAD: 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.
- Gitignored outputs left there: `node_modules` (shell and bundle-viewer), `renderer/bundle-viewer/dist`, `frontends/shell/src/generated/NOTICE.txt`, `frontends/shell/e2e/out`, `target/fixtures`, `frontends/shell/src-tauri/gen`.
- The build target is `D:/wt-targets/e2etri`. My scratch folder holds the scripts, logs and the two scratch console variants.
