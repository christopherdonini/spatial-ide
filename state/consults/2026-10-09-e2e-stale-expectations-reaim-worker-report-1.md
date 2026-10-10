*Custodian's filing note (2026-10-09): `e2e-stale-expectations-reaim`'s worker report 1, the worker-high run 15:06:05Z to 17:09:10Z by its transcript, on `cut/e2e-stale-expectations-reaim` from b8ad22ff, head cf2434e6f25033335d69ee4b667caefd109832f1, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is cd777a02ea53b36781a278b768fdcd070a3dfa1be047c75296b7bb14570720a7. The custodian checked that origin holds the head and the worktree is clean. The rest is the worker's.*

---

# Report: e2e-stale-expectations-reaim (slot 1, second item)

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Branch `cut/e2e-stale-expectations-reaim` in the worktree `C:/dev/wt/reaim`, cut from b8ad22ff50f11538f46bf308e5680faeb69912e1.

## Headline

- **Shared-run results.** Regression, admission and the source-changed default route had 0 FAIL, and console had 1 FAIL (GROUP'). I did not run anything solo, so none of this is a P1 claim.
- **GROUP' (I3 candidate) is the open item.** It fails in some shared runs and passes in others. A class-B session-log line sits between the second and third residential rows, which splits the group. I recorded it as a timing-dependent shared-run failure, not as a result. Your solo re-run decides whether I3 fires.
- **One difference from the form (own commit).** S4's pan on the default route needed the dataset-extent bound the post route already uses. See "Differed from the form", item 1.
- **Published.** HEAD is `cf2434e6f25033335d69ee4b667caefd109832f1`, equal to `origin/cut/e2e-stale-expectations-reaim`. No pull request was opened.

## Commits

- `4790e9c8` chore: `StringIdsBesideParcelKey` fixture variant (OPEN-1 (A)) and the four generators
- `e336ef44` fix: regression C2'/C3' and admission MAP', BOTHNEEDED' re-aimed
- `2b09d5ab` fix: console HEXLIM', REFUSAL', GROUP' and the arm readback
- `c98263a1` fix: source-changed S3/S4 on the default route, via a directory junction
- `c7d41dac` fix: S4 pan bound on route pre (a difference from the form, see below; droppable)
- `cf2434e6` docs: README, walkthrough rows, KNOWN-LIMITATIONS item 3

## §7 counts

Command: `git diff --numstat b8ad22ff...HEAD`.

| File | Count (insertions+deletions) | Ceiling |
|---|---|---|
| `console.mjs` | 208 (154+54) | 220 |
| `admission-remediation.mjs` | 146 (100+46) | 220 |
| `source-changed.mjs` | 142 (134+8) | 170 |
| `regression.mjs` | 74 (60+14) | 120 |
| `kernel/tests/manual_walkthrough_fixtures.rs` | 80 (58+22) | 90 |
| `engine/src/fixture.rs` | 23 (20+3) | 40 |
| code and tests total | 673 | 860 |
| `README.md` | 29 | 40 |
| `MANUAL-WALKTHROUGH.md` | 32 | 60 |
| `KNOWN-LIMITATIONS.md` | 2 | 2 |

Nine files changed. There are no overruns.

## Fixtures

Hashes of `C:/dev/spatial-ide/target/fixtures/manual-walkthrough`, taken before and after. Every pre-existing file is unchanged. The four new files are added, and the form's own file list is untouched.

| File | sha256 |
|---|---|
| F-A `no-id-column.parquet` | b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424 |
| F-B `string-id-refused.parquet` | 4b86c87ae3f6f236e06cdbb30b7c28176efe79f49ba151f19b7822f3aa7b1d46 |
| F-C `no-crs-no-id-refused.parquet` | 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8 |
| F-D `no-crs-string-id-refused.parquet` | 03bca99b42629df18684fc5444b891512070b7f55ff445e4d6f5368684c5a39f |

- F-A equals the old `missing-identity-refused` hash, and F-C equals the old `bothneeded-refused` hash, so I6 did not fire.
- The old two files are still on disk, untouched and unread by anything.
- The 100k copies `a` and `b` and the scratch copy all hash to `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49` before and after every run.
- I generated the four files in the worktree's own `target/fixtures`, then copied them into the main checkout's gitignored `target/fixtures`, because the suites hard-code that path. That is the only thing I wrote outside the worktree, apart from `D:/wt-targets/k6` (the build) and my scratch folder.

## Heavy commands

Every one was run inside `hold shared -Project SpatialIDE`. There was no 96-99 exit.

| # | Command | rc |
|---|---|---|
| 1 | `npm ci` in `frontends/shell` | 0 |
| 2 | `npm ci` in `renderer/bundle-viewer` | 0 |
| 3 | viewer `npm run build` | 0 |
| 4 | `npm run generate:notice` | 0 |
| 5 | `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture <the four generator names>` (14m53s build) | 0, 4 passed |
| 6 | `cargo build`, debug exe, e2e `TAURI_CONFIG` overlay, height 800, target `D:/wt-targets/k6`, copied to `exes/spatial-ide-shell-reaim.exe` (6m13s) | 0 |
| 7 | refusal read-back probe (the message from a real run) | 0 |
| 8 | regression | 0 |
| 9 | admission | 0 |
| 10 | source-changed, first run (before `c7d41dac`) | 1 |
| 11 | source-changed, second run | 0 |
| 12 | console | 1 |
| 13 | GROUP' diagnostic probe | 0 |
| 14 | `cargo test -p spatial-engine --locked` | 0 (46 result lines, 440 passed, 0 failed, 17 ignored) |
| 15 | `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 (457 pass) |
| 16-28 | the thirteen mutation runs below | each 1 except M10 and M11, M12 as listed, all expected |

- Item 15 ran with a pipe to `tail` inside the command slot. That is a small departure from the hold shape.
- Light and not held:
  - `verify-cites.mjs`: PASS
  - `verify-quotes.mjs`: PASS
  - `verify-test-claims.mjs`: PASS
  - `queue.mjs --check`: PASS
  - `site.mjs --check`: PASS
  - `verify.mjs`: PASS
  - rustfmt `--check`: clean on both Rust files
  - a junction probe in a sandbox, removed with `unlinkSync` and `rmdirSync` only
- Every app was stopped with `app-down` after each run. I checked that ports 9223 and 5400 were free, and found no process of mine left.

## Suites, shared runs (not P1 claims)

**Regression**, exit 0:
- Steps A1' through LN', B2'/B3', ABSENTCRS' and C2'/C3' PASS. K6, K7, A9' and FIND' PASS.
- NET' is INFO.
- C2'/C3': (a) admitted, with the Identity line and Session identity row equal to the engine's statement, no refusal panel, and the identity form INFO `present=false`. (b) refused `engine.identity_unusable`, message verbatim, form present, candidate `parcel_key`.

**Admission**, exit 0, 11/11 PASS:
- MAP' (a) and (b) PASS.
- BOTHNEEDED' (a) and (b) PASS.
- CONFLICT' PASS.
- CANCELOPEN' PASS.

**Source-changed default route, `launched:true`**:
- Run 1, at the junction commit alone: S1, S2 and S3 PASS, then S4 FAILED. The ladder was pan 17→17 and zoom 17→17, with the status stack empty (the watcher was not involved), so S5a-c failed too.
- Run 2, with `c7d41dac`: 8/8 PASS.
  - The pan rung produced the query (17→19).
  - The pre-check line, byte-copied from `sc2.log` in my scratch folder: `1791560768810 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}`.
  - Both copies hash to `hashBefore`.
  - I4 did not fire: the junction needs no elevation here.

**Console**, shared:
- The arm readback passed.
- HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL' (PASS in 343 ms), CLASSB', CLASSC', COPYTRUNC', UNCLASS' and REGRESS' PASS.
- **GROUP' FAILED in this run.** The message, byte-copied from `con1.log`: `GROUP': expected 3 residential untiled rows in one .console-group within 5000ms (polled every 100ms), found 3, in groups [4,4,null]; rows from the first found to the last, in DOM order: ["a:viewport_query@group4","a:viewport_query@group4","b:writes one diagnostic log line to a host-side lo@group5","b:writes one diagnostic log line to a host-side lo@group5","a:viewport_query"]; console label total 301 (baseline 288, R=13)`.

### GROUP' is an I3 candidate, reported and not recorded as a failure (§9)

Evidence so far, all shared:

| Run | GROUP' outcome |
|---|---|
| console run, no mutation (`con1.log`) | split as above |
| M7 run, mutation unrelated to GROUP' (`mutM7.log`) | PASS: N=3, texts byte-identical, R=9 |
| M8 run, mutation unrelated to GROUP' (`mutM8.log`) | PASS: N=3, texts byte-identical, R=9 |
| probe: 6 rounds, 6 predicates, 3 awaited calls each (`group-probe.json`) | all 6 split the same way: vq, vq, 2 class-B session-log lines, vq |

- This matches H1: the session-log lines of earlier untiled streams land between the calls.
- Whether they land before call 3 is timing-dependent.
- If a solo run also splits, I3 fires and option 1's premise is gone on the shipped arm.
- I took no option 2 and no workaround.
- Two candidate directions, for the human and not done:
  - assert the residential untiled rows and the `×N` property per consecutive run;
  - issue the three calls in one page evaluation (still racy).

## Mutations

All were applied to the clean tree at HEAD `cf2434e6`, run as a shared suite, reverted with `git checkout -- <file>`, and checked with `git status --porcelain` printing `''` and `git diff` empty. None was committed or pushed.

| # | Edit | Failure observed (byte-copied prefix) |
|---|---|---|
| M1 | regression: session-half fixture → `FIXTURE_100K` | `C2'/C3' (session tier): no "Session identity" row equal to the engine's statement. Rows: {…` |
| M2 | regression: refusal-half fixture → `FIXTURE_NO_ID_COLUMN` | `C2'/C3': expected {kind:"refused", code:"engine.identity_unusable"}, got {"kind":"admitted"}` |
| M3 | admission MAP' (a) fixture → `FIXTURE_STRING_ID` | `MAP' (session tier): openPath(…\string-id-refused.parquet) returned {"kind":"refused","code":"engine.identity_unusable",…` |
| M4 | MAP' declared column `parcel_key` → `id` | `MAP': declaring parcel_key did not admit: {"kind":"refused","code":"engine.identity_unusable",…` (the pre-existing literal still says parcel_key) |
| M5 | BOTHNEEDED' (a) fixture → F-D | `BOTHNEEDED' (session tier): openPath(…\no-crs-string-id-refused.parquet) returned {"kind":"refused","code":"engine.identity_unusable",…` |
| M6 | BOTHNEEDED' (b) asserting call → F-C | `BOTHNEEDED': expected engine.identity_unusable after asserting the CRS alone, got {"kind":"admitted"}` |
| M7 | console: `columns` removed from the expected list | `HEXLIM': key set mismatch. Expected ["bbox","bbox_crs","dataset","filter","limit","skp"], got ["bbox","bbox_crs","columns","dataset","filter","limit","skp"]` |
| M9 | GROUP': third call's predicate → `commercial` | `GROUP': expected 3 residential untiled rows in one .console-group within 5000ms (polled every 100ms), found 2, in groups [4,4]; …` |
| M9c | `MAX_CONSOLE_ENTRIES` → 2 | `GROUP': capacity: 8 entries were recorded since the baseline (label total 296 - 288), more than the ring's 2` |
| M10 | `SHIPPED_ARM` → `baseline` | `console: harness failure: Error: console: expected the shipped default residency arm ("baseline") but readback was "candidate" -- no arm is set or pinned by this suite` |
| M11 | S3 retarget → an mtime touch on the opened path | `S4: no viewport_query followed any gesture in the ladder, …` (S3 also failed by its own check: `S3: the opened path resolves to …\a\…, not inside …\b`; S5a-c PASS) |
| M12 | S3 retarget skipped | `S4: no tile-stream-mint-refused line with engine.source_changed in the session log since the baseline (line 33); the pre-check did not refuse the query` (S3, S5a, S5b and S5c failed too) |

**M8, the product-line mutation (the human's allowance, REFUSAL' only):**
- **Edit.** I removed only lines 175-179 of `frontends/shell/src/console/ConsolePanel.tsx`, the refusal block, with the Edit tool. The permission system accepted it. Nothing else changed.
- **Failure observed.** The failing step was REFUSAL'. The message, byte-copied from `mutM8.log`: `REFUSAL': no refused viewport_query class-A entry with its refusal block within the declared bound (5000ms, polled every 100ms); console label count=256 dropped=27`.
- **Restore and check.** Restored with `git checkout -- frontends/shell/src/console/ConsolePanel.tsx`, then `git status --porcelain` was `''`, `git diff` was empty, and HEAD was `cf2434e6`. It was one at a time, in this worktree only.

No `verify-mutation` run is called an observation.

## §8, item by item

1. **Product-path edits.** None committed beyond the §2.6 (A) variant in `engine/src/fixture.rs`. That includes a 2-line correction of the stale `ForeignKeyColumn` doc ("refuses unless a mapping is declared"). M8 was temporary and restored.
2. **Arm set or pinned.** No. Console reads the arm back and stops unless it is `candidate`.
3. **Fixed sleep or frame count as the REFUSAL' or GROUP' wait.** No. Both use a conditioned poll with a declared bound.
4. **GROUP' counting all headers.** No.
5. **Result log or dated README record edited.** No. I edited the README's descriptions and added one paragraph. I edited walkthrough rows only; the result log (for example the Part C result line) is untouched.
6. **Recursive delete, other link type, elevation, `mklink`.** None.
   - The junction is made with `symlinkSync(.., "junction")` and removed with `unlinkSync`.
   - I removed the leftover `e2e/out/source-changed-link` at the end.
   - Any later run recreates it, so a worktree sweep must not recursive-delete `e2e/out` while it exists.
7. **Copy hashes unequal.** Never; `fixture-integrity` PASS in every source-changed run.
8. **KNOWN-LIMITATIONS text.** Item 3 gained the paragraph, byte-copied by script from line 27 of the ruling file. Its sha256 over line plus LF is `db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a`, equal to the source line's. No other item was edited, and the diff is 2 insertions.
9. **A mutation committed, pushed or left in place.** None.
10. **A refusal-message constant written by hand.** None.
    - `STRING_ID_MESSAGE` was read back from a real run (item 7 above, identical for F-B and for F-D after the CRS assertion) and inserted by `fill.mjs` in my scratch folder.
    - The session statement and Identity line were byte-copied from `protocol/skp/tests/data/v0-describe-response-session-ordinal.json`.
    - The walkthrough's engine strings were filled from the same two sources by script.
11. **A shared-run failure recorded as a failure.** None. GROUP' is reported, not recorded.
12. **An invalidator reached and worked around.** None worked around. I3 is a candidate pending your solo run. I1, I2, I4, I5 and I6 did not fire.
13. **New dependency.** None.

## Differed from the form

1. **S4 ladder, route pre only, commit `c7d41dac`.**
   - The form says the ladder is unchanged and P5 says the pan rung produces the query. With the ladder unchanged, S4 failed because two drags stay inside the resident cover.
   - Evidence: the first run at the junction commit alone, ladder 17→17 on both rungs, status stack empty.
   - I added `dragsToCrossDataset`, which is the post route's own formula (milestone 1, Decision A).
   - It is in its own commit; drop it if you reject it, but S4 then fails.
2. **REFUSAL' poll predicate.** The form says to poll until a refused row is present. I also require its refusal block to be rendered. Without that, M8 would fail at the code comparison and not at bound expiry, which is what Amendment 1 item 3 predicts.
3. **Step names.**
   - Console unchanged.
   - regression: `C2'/C3' (session tier)` for the session half.
   - admission: `MAP' (session tier)` and `BOTHNEEDED' (session tier)`.
   - source-changed: S3 on route pre is named `S3-retarget-junction`.
4. **M11 and M12 also failed S3,** by its own named check. M12 also failed S5a-c.
5. **Generators run by name,** the four of §2.5, and not the whole `-- --ignored --nocapture` set. The whole set would regenerate the 4M-feature fixture.
6. **The engine suite run** was the whole `cargo test -p spatial-engine`, not a named subset. The fixture feature is on through the crate's own dev-dependency.
7. **Caller of the new `pub` variant:** only `kernel/tests/manual_walkthrough_fixtures.rs`, lines 510 and 595, plus the writer in `fixture.rs`. Its end-to-end tests are MAP' (b) and BOTHNEEDED' (b).

## Predictions

- **P1.** Not claimed (shared runs only).
- **P2.** N=3 and byte-identical in the passing GROUP' runs.
- **P3.** R=9 in both passing runs and 13 in the split run, all ≤ 256.
- **P4.** F-A to F-D behaved as §3 predicts. F-B's refusal detail begins `type is Utf8;` and its candidates are exactly `parcel_key`.
- **P5.** Held after `c7d41dac`.
- **P6.** Each of M1 to M12 failed by its named message.

## Not done, noticed

- The `post` and `reopen` routes were not run. They are declared unchanged, and `reopen` still has the watcher premise.
- Walkthrough line 5 ("missing identity", history) is untouched.
- The README's cite `source-changed.mjs:144-159` still resolves, since all my edits to that file are below it.

## Final state

- `git status --porcelain` is empty.
- HEAD is `cf2434e6f25033335d69ee4b667caefd109832f1`, published to origin.
- The build is at `D:/wt-targets/k6`. The exe for your solo runs is `D:/wt-targets/k6/exes/spatial-ide-shell-reaim.exe`.
- The run scripts are in my scratch folder: `run-suite.sh`, `app-up.ps1`, `app-down.ps1` and the `shim` folder.
- Every log named above is in my scratch folder, under `out/`.
- **Needed from you:** the solo runs. Run console GROUP' (ideally a few repeats) and the other three suites under an exclusive hold.
