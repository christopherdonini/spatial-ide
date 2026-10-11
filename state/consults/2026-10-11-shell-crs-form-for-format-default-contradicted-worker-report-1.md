*Custodian's filing note (2026-10-11): the worker-high on `shell-crs-form-for-format-default-contradicted`, branch at bc0b0d7a2d386102bf8644ff47a52eed5c0fc84c; the build's report (BLOCKED on the e2e evidence), handed back at 20:36:34Z, by its transcript (the agent's tool calls over both runs: Read 4, Bash 84). It arrived as a message and is extracted here by script from SubagentHandback call 1 of 2 in its transcript. 1 rooted path:line cites are de-rooted by script, and one final newline is added; nothing else is changed. The message's sha256 as handed back is 172af7f0545fccbfa61728da4f8df0c7b89b43aad18319f29baa93df5a302ce2; this file's, from line 5 to the end, is e8f0ead7145447f46576fec956996be5ae04ea543e06e2100aeb571fd28b9b5d.*

---

**BLOCKED, partial: the e2e evidence is not done. Everything else is done and pushed.** The base and head e2e runs of `regression.mjs` and `admission-remediation.mjs`, and the ABSENTCRS' e2e mutation, were not run.

**Cause**
- Windows now reserves TCP ports 5120-5219 (a dynamic exclusion, as shown by `netsh interface ipv4 show excludedportrange protocol=tcp`).
- The shell's dev-server port 5180 is inside that range.
- `vite` fails with `listen EACCES: permission denied ::1:5180`, so `tauri dev` never starts.
- The base regression run (hold shared, `node e2e/regression.mjs` at B's product code) ended with `attachOrLaunch: http://127.0.0.1:9223/json/version never came up within 300000ms`, exit 1, and an empty `app.log`.
- Confirmed with a 25 s manual `npx tauri dev`: BeforeDevCommand `npm run dev` fails with that EACCES. A bare `net.listen` on `::1` gives EACCES for 5180 and ok for 5410.
- 9223 was free and nothing of another party was using it.
- No cargo target was ever created, because the dev server failed first.

**What I tried and was refused**
- I tried to move the dev-server port locally and uncommitted, in `vite.config.ts`, `src-tauri/tauri.conf.json` (devUrl) and `e2e/lib.mjs` (`APP_URL_PREFIX`), then revert.
- The permission classifier denied it as modifying shared resources. The command did not run, and the tree stayed clean. I did not pursue it further.

**Needed from you**
- Free port 5180 (restart winnat or reboot to drop the dynamic exclusion), or rule how the dev port may be moved for these runs.
- After that, run, each in a shared hold with `CARGO_TARGET_DIR=D:/wt-targets/crsform`:
  - `node e2e/regression.mjs` and `node e2e/admission-remediation.mjs` at 1457fbd0 and at bc0b0d7a;
  - the ABSENTCRS' mutation: delete §2.1's branch, run, expect failure at the `.crs-assertion-form` check, then revert.
- Neither new e2e step has run. I only ran `node --check e2e/regression.mjs`, which passes.
- H2 and the "x-first assertion opens the file" claim have therefore not been observed end to end, and I1 to I5 for e2e are unobserved.

**Head and commits** (branch `cut/shell-crs-form-for-format-default-contradicted`, pushed with a plain push, origin equals local)
- Base B = 1457fbd0a09464c03082a2aea3df65dd1171bc95, clean at start.
- Head = bc0b0d7a2d386102bf8644ff47a52eed5c0fc84c.
- 83fec3a7 `docs:` KNOWN-LIMITATIONS item 2.
- d6140c9f `docs:` walkthrough Part X and the ABSENTCRS' coverage row.
- bc0b0d7a `feat:` product, tests, e2e step, comments.
- Each commit is `-s` with the Co-Authored-By trailer. Git places Signed-off-by after it.

**Pin recheck at B**
- I scripted all 40 distinct `path:line @ rev sha256` pins in the form (read on main) against each pin's own rev and against B.
- All hash as written except `line 330-336 of engine/src/error.rs (at bc0b0d7a) @ 4fd3259a`, which is moved at B. That is exactly what Amendment 2 item 2 says, and its 333-339 pin hashes.
- The §0.3 to §0.5 interfaces read the same at B. No I1.

**Changes** (insertions and deletions)

| File | Lines | Change |
|---|---|---|
| `frontends/shell/src/admission/AdmissionPanel.tsx` | 8/4 | One new `if` branch in `formFamilyForCode` for `engine.format_default_contradicted`, returning `"crs"`. Doc comments of `formFamilyForCode` and `nextFormFamily` corrected. No other code line. |
| `frontends/shell/src/admission/CrsAssertionForm.tsx` | 2/1 | Doc comment's first sentence now names both codes. |
| `frontends/shell/src/admission/AdmissionPanel.test.ts` | 52/0 | CF1 to CF4 added. |
| `frontends/shell/e2e/regression.mjs` | 63/25 | `stepAbsentCrs(page, consoleHandle)` re-aimed per §2.3. See below. |
| `kernel/tests/manual_walkthrough_fixtures.rs` | 4/5 | Comment lines only. |
| `frontends/shell/MANUAL-WALKTHROUGH.md` | 18/1 | New Part X (X1 to X3, blank log) after Part V, and the ABSENTCRS' row's asserted and not-asserted cells restated in place. |
| `KNOWN-LIMITATIONS.md` | 1/1 | Item 2, one line (line 60). |

**`stepAbsentCrs` re-aim in `regression.mjs`**
- The INFO line became assertions: CRS form present, identity form absent.
- It picks the radio whose label contains `EPSG:2056`, found by label, with a 20 s wait for the catalog.
- It clicks `button[type=submit]` once enabled.
- Within 20 s it expects the refusal panel and form gone, the `CRS` row to begin `EPSG:2056 — caller-asserted by `, and `CRS provenance` to equal `crs:asserted, axis:declared`.
- It then calls `waitForSettle` at quietMs 3000 and timeoutMs 45000.
- The outer bound went from 30 s to 90 s, and the call site passes `consoleHandle`.
- The comment above the call site was also reworded (2 lines).
- No `openPath` options are used for the submit.

**KNOWN-LIMITATIONS script proof** (directive at c48601ab, `git show` bytes)
- Directive line 14 sha256 is 1e7e9e75…402482d8 and line 16 is 922aa3ef…ddde4de922. Both equal Amendment 1's pins.
- Old span (line 13's quoted sentence): "The app does not yet offer a CRS assertion after this refusal, so on `main` such a file cannot be opened in the app." It occurs exactly once in the file, on line 60.
- Replacement: line 14 minus its three leading spaces, "The app then offers the CRS assertion form, so you can assert the CRS the file is really in."
- Old phrase (line 16): "a latitude-first CRS that you assert yourself". Also exactly once.
- Its replacement: "a latitude-first or northing-first CRS that you assert yourself".
- The two spans do not overlap. Rebuilding the old line from its slices with the two replacements equals the new line (true).
- Old line 60 sha256 (with LF): 32793286a05126e0fca6011c8ba0b220688605b1a1aeb8c5b1b6ae7accb0d58a.
- New line 60 sha256 (with LF): e39d37ac04fcdd50564771f14507ee1cf074f1f0cf164204cfd2bd2aca565713.
- The diff is 1 insertion and 1 deletion; the file's final newline is kept.

**CF1 to CF4**
- Each mutation was applied on a clean tree at bc0b0d7a, the named test run alone with `npx vitest run src/admission/AdmissionPanel.test.ts -t <id>`, and the mutation then reverted with `git checkout`.
- Each observed failure is an AssertionError, `expected null to be 'crs'`.
- After reverting all four, `-t "CF[1-4]"` gives 4 passed.

| Test | Mutation | Observed failure (by name) |
|---|---|---|
| CF1 | Delete the new branch in `formFamilyForCode` | CF1: engine.format_default_contradicted starts the CRS family, so its own remedy has a form |
| CF2 | Add the code to `nextFormFamily`'s conflict branch | CF2: a fresh format_default_contradicted refusal opens the CRS form whatever came before |
| CF3 | Refused updater uses `priorFamily` instead of `nextFormFamily(priorFamily, outcome.refusal.code)` | CF3: a fresh path refused engine.format_default_contradicted gets the CRS form, and the assertion resubmit keeps it mounted (refused, in flight) until the file is admitted |
| CF4 | `?? priorFamily` becomes `?? null` | CF4: format_default_contradicted -> assert a northing-first CRS -> axis_order_unsupported keeps the CRS form reachable (the open item, as the app shows it) |

- CF3 under mutation fails at its first assertion, before the in-flight and `admit` call checks. Those checks pass on the clean tree.

**ABSENTCRS'**
- The e2e mutation was not observed (blocked, see top).

**e2e tables**
- No step table exists at B or at head. The one attempted run produced no steps.

**Runs and exit codes**
- npm ci (frontends/shell, then renderer/bundle-viewer): 0 and 0.
- `npm run typecheck`: 0. (An earlier try failed with 1 only because `renderer/bundle-viewer` had no node_modules.)
- Base `node e2e/regression.mjs` in a shared hold: 1. It failed at launch (see top).
- `npm run verify` at bc0b0d7a in a shared hold: 0.
  - Vitest: 79 files and 1199 tests passed.
  - residency-trace: 76 passed.
  - citation-integrity: 30 passed.
- `node scripts/plan/verify-cites.mjs`: 0. It passed over 1751 files, with 49 loose advisories that are not mine.
- `node scripts/plan/verify-quotes.mjs`: 0. It passed: 121 checked, 30 baselined.
- `node scripts/plan/verify-test-claims.mjs`: 0. It passed: 543 claimed tests.
- `node scripts/plan/verify.mjs`: 0. It passed.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` in a shared hold: 0. 457 pass, 0 fail.
- Tool commits (round 15 (c)): the last commit touching `scripts/plan` is c813c6ab, and `scripts/hooks` plus `scripts/evidence` is 7ce9dab2, both in this worktree.
- `verify-quotes --show-cites` over my seven changed files exits 1 with 39 "quote not found" lines.
  - They are mostly pre-existing template-literal strings in `regression.mjs` and the walkthrough.
  - One is my new throw-message line, `regression.mjs:2522`.
  - Plain `verify-quotes.mjs` passes. I did not treat the show-cites listing as a gate failure.

**§7's count** (`git diff --numstat 1457fbd0...HEAD` per the form's command; merge base with origin/main is 1457fbd0)

| Group | Actual | Ceiling |
|---|---|---|
| G1 product: `AdmissionPanel.tsx` (12) plus `CrsAssertionForm.tsx` (3) | 15 | 26 |
| G2 unit: `AdmissionPanel.test.ts` | 52 | 100 |
| G3 e2e: `regression.mjs` | 88 | 90 |
| G4 kernel comment: `manual_walkthrough_fixtures.rs` | 9 | 9 |
| Total | 164 | 225 |

- Outside the count: `MANUAL-WALKTHROUGH.md` 19 (ceiling 20) and `KNOWN-LIMITATIONS.md` 2 (ceiling 2).
- No overrun.

**Not done as written, plainly**
1. All e2e evidence, blocked as described above. The `regression.mjs` ABSENTCRS' step and the commit-message and kernel-comment wording are unobserved against a running app.
2. Walkthrough Part X's result log merges "Date run, run by, build/commit, last amendment read" into one bullet. This was to stay at 19 of the 20-line ceiling. Rows X1 to X3 are as in §2.5.
3. The kernel comment says only that `ABSENTCRS'` submits an assertion through the form. I did not write "an x-first assertion opens the file" there, since that is unobserved.
4. The worktree's copy of the form may lack Amendments 1 and 2, which were committed to main after B. I read the form on main as ordered and did not edit it.
5. The pre-gate self-check on its four classes:
   - **Cross-module interface:** no cross-module path was added. The shell-only change reuses `runAdmitPath`, `CrsAssertionForm` and the existing hooks, and the engine side was read in §0.4 and left unchanged.
   - **Completion claims:** every claim above points to a log or a test. The e2e claims are explicitly absent.
   - **User-facing messages:** no new product string.
   - **Intended assertion:** CF1 to CF4 reach their assertions under mutation.
6. Model I observe myself running as: claude-sonnet-5-5. No model override and no context handoff.

**Final `git status --porcelain`:** empty. The worktree is clean at bc0b0d7a, equal to origin. No processes of mine are left running. I created no cargo target and left nothing on 9223 or 5180.
