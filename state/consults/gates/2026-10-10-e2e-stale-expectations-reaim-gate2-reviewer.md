# PR #204 gate 2 — reviewer
Reviewed: cut/e2e-stale-expectations-reaim @ 04e21fb90b97e097f37f7dad7577ec95714818da

**Verdict: PASS.** E1 and E2 are resolved, and nothing new was found under Correctness or Evidence. There are three Documentation findings (DOC-1 to DOC-3). Each must be fixed in this PR before the merge; none needs a re-gate.

## Scope item 1: the one new commit (`git diff ef1cc519 04e21fb9`)
- `git diff --stat` reports 1 file, `frontends/shell/MANUAL-WALKTHROUGH.md`, with 3 insertions and 3 deletions. No result log changes: all three hunks sit above line 980, where the first `## Result log` heading is. No other row changes. §8 item 5 holds.
- **E1, resolved.** The GROUP′ coverage row is at `MANUAL-WALKTHROUGH.md:685` @ 04e21fb9. I checked it against `stepGroup` and `windowOf` (`frontends/shell/e2e/console.mjs:252-300` and `649-710` at the head) and against the README's GROUP′ paragraph (`frontends/shell/e2e/README.md:286-297`).
  - The bounded poll for exactly 3 residential untiled rows matches `pollConsole` with `GROUP_CALLS`.
  - The `×N` for N >= 2 rows of one key matches the group loop.
  - No two adjacent items share a key: this matches the split-run chain.
  - Some group shows 2+ rows in the window: this matches `exercised` (header present and `n >= 2`). The failure name matches `GROUP_NOT_EXERCISED`, which is at `console.mjs:274` (the constant line).
  - Each class-A row in the window parses on its own: this matches the parse loop.
  - The old phrase about rows in one `×N` group is gone. The row leaves out the capacity check and the check of the item before the window. Both are extra assertions, so leaving them out understates the step and claims nothing false.
- **Architect D3 (F-D), resolved.** At `MANUAL-WALKTHROUGH.md:512` @ 04e21fb9 the row no longer says the file was re-aimed from an absent key. Its generator writes `CrsMode::ExplicitNull`, and the file is new (`kernel/tests/manual_walkthrough_fixtures.rs:587-599`).
- **Reviewer D3 (N6), resolved.** At `MANUAL-WALKTHROUGH.md:949` @ 04e21fb9 the row now cites `source-changed.mjs:871`. At the head, that line is `utimesSync(SCRATCH_COPY, later, later);`, inside the `ROUTE !== "post"` branch, which is reached only by `reopen` because `pre` is taken at line 844. The default route is `pre` (line 246), and its S3 is the junction retarget (844-867). The row's text matches.

## Scope item 2: E2 and D1 in the PR title and body (`gh pr view 204`, rc 0)
- **The title** now speaks of the fixtures the suites write, shown unchanged by hash. It no longer claims every existing fixture.
- **The T4 bullet** names the `polygons-100k` route: it was compared through `make-fixture` with the same `FixtureSpec`, not through its producing test. It also names the three files not covered.
  - Both claims match worker report 2 (`state/consults/2026-10-10-e2e-stale-expectations-reaim-worker-report-2.md:93-99`).
  - The equal hash matches line 116 of that report (sha256 9ecd7924…).
- **E2 is resolved.** What it required is done. The leftover wording is DOC-1.
- **D1 is resolved.** The body discloses the 2-line `ForeignKeyColumn` doc correction. Both of its sources check out:
  - worker report 1 discloses it (`state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:168`);
  - Amendment 2 item 5 lists it (`frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:638`).
- **Architect D3, second half, resolved.** The body now places M1 to M8 and M10 to M12 at cf2434e6, and M9 and M9c (in their new text), M9n, M9g and M9s at H.

## Scope item 3: D2 in the body
- The body no longer says the rows have blank result logs.
- It now says rows C2, C3, I4, I5, I6 and I8 sit above result logs that record passes of the old texts (Part C, 2026-08-14; Part I, 2026-08-30), and that those logs are not evidence for the new texts.
- It says the closing record carries the §9 deviation. This meets what the scope asked for. The surrounding text has two problems; see DOC-2.

## Scope item 4: item 7's standing
- `git diff --name-only ef1cc519 04e21fb9` (rc 0) lists only `frontends/shell/MANUAL-WALKTHROUGH.md`. Item 7 lists that file among those that leave the solo runs standing (form, Amendment 2 item 7). The runs at ef1cc519 stand for 04e21fb9.
- Note: `git diff --name-only cf2434e6 04e21fb9` (rc 0) lists the merge's main files as well, as it did at gate 1. Item 7's literal window-2 condition therefore does not hold. Its "otherwise" branch was met at ef1cc519: window A ran all three suites alone, so nothing new arises.

## Scope item 5: the §7 count
- Command: `git diff --numstat f0fccfaf...04e21fb9`, rc 0; the merge-base with origin/main is f0fccfaf.
- `MANUAL-WALKTHROUGH.md` is 17 + 17 = 34, within its 60.
- The other files are unchanged since gate 1:
  - `console.mjs`: 235, the class-8 overrun recorded in Amendment 3 item 7;
  - `admission-remediation.mjs`: 146;
  - `source-changed.mjs`: 142;
  - `regression.mjs`: 74;
  - `manual_walkthrough_fixtures.rs`: 80;
  - `fixture.rs`: 23;
  - code total: 700 of 860;
  - `README.md`: 36 of 40;
  - `KNOWN-LIMITATIONS.md`: 2 of 2.
- 9 files. The body's size table matches.

## Scope item 6: governance checks at the head (`C:/dev/wt/reaim`, no hold)
Each command ran under `timeout`, and I showed the last 5 lines of its output.

| Command | rc | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS: 1639 files, 49 loose references advised |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS: 121 checked, 0 errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS: 531 claims |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | 18 sites, 0 outside |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | 457 tests, 457 pass, 0 fail |

**CI.**
- The first `gh pr checks 204` returned rc 8, with `cargo test --workspace (windows-latest)` pending.
- I then watched it:
  - `gh pr checks 204 --watch --interval 120` under `timeout 580` returned rc 124 (the timeout);
  - a second watch under `timeout 590` returned rc 0 at 22:20:03Z.
- `gh run list` shows all 7 runs at 04e21fb9.
- The final `gh pr checks 204` returned rc 0. Every line it printed:
  - L1 portable correctness · cargo test --workspace (ubuntu-24.04): pass, 4m47s
  - cargo fmt --check (workspace and src-tauri): pass, 14s
  - cargo test --workspace (windows-latest): pass, 18m29s
  - cfg boundary (PORTABILITY R2): pass, 6s
  - every commit is signed off: pass, 7s
  - no profile path in the range: pass, 9s
  - tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing): pass, 5m38s
  - tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing): pass, 3m35s
  - test · verify:plan · queue/site drift: pass, 1m27s
  - typecheck · build · vitest · cargo test: pass, 7m12s
  - typecheck · build · vitest · cargo test: pass, 5m32s

## Documentation (must fix before the merge; not blocking)

**DOC-1. Three places in the body still claim every fixture without qualification.** The PR body is paraphrased here, not quoted.
- The second paragraph says each existing fixture's bytes are shown unchanged by hash.
- A section heading says every existing fixture is byte-identical.
- The Amendment 2 bullet says every existing fixture is shown byte-identical.
- Why this is Documentation and not Evidence:
  - the T4 bullet in the same body now names the three uncovered files and the `make-fixture` substitution;
  - neither tree writes those three files (architect gate 1, D1).
  - So the body as a whole states its limits, and these three sentences contradict it.
- **Fix:** reduce them to the title's wording, the fixtures the suites write.

**DOC-2. The D2 text gives a wrong reason and claims a queue that does not exist.**
- The body says no blank result logs were committed because §8 item 5 forbids editing a result log. That reason does not hold:
  - a new blank log, or an in-row marker, edits no existing log;
  - the walkthrough's own precedent is an in-row marker of exactly that kind (`frontends/shell/MANUAL-WALKTHROUGH.md:819-820` @ 04e21fb9, rows L7 and L8).
- The body also says the rows are queued for the next sitting, but none of C2, C3, I4, I5, I6 or I8 carries a queued marker (`MANUAL-WALKTHROUGH.md:184-185` and `587-591` @ 04e21fb9).
- **Fix:** either add an L7/L8-style marker to those six rows, or drop the causal clause and the queued claim from the body.
  - The marker is inside the 60-line ceiling: 34 now, and those six rows are already counted.
  - It is inside item 7's file list, so the solo runs stand.

**DOC-3. The T4 bullet names `bothneeded-temp.parquet` without its directory.** Report 2:97 gives it as `admission-remediation/bothneeded-temp.parquet`; the other two entries carry their paths. Add the directory.

## Advisory (no class)
- Row N6's `source-changed.mjs:871` is a bare line cite into a file this PR edits, but not in the same commit. The walkthrough is a living document, not a record. The cite resolves at the head, and `verify-cites` passes.
- The gate-1 advisory notes stand. They were outside this re-gate's scope: the `label.total === null` guard, the off-Windows layout order, and the junction left in place.

## State
- `git status --porcelain` is empty (rc 0). HEAD is 04e21fb90b97e097f37f7dad7577ec95714818da.
- Nothing was committed, rebased, merged or published. I deleted nothing under `e2e/out/`, ran no heavy command, and took no hold.
- Temporary files were written only to the scratch folder: `nodetest.txt` and `watch1.txt`.
- `git fetch --quiet origin` ran once (rc 0) to read the merge-base.
- The commit 04e21fb9 carries a Signed-off-by trailer.
