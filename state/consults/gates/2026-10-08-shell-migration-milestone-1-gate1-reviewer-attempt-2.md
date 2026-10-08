# PR #195 gate 1 attempt 2 — reviewer
Reviewed: cut/shell-migration-milestone-1 @ ae704f0abc924bde7a6f912a853f039dfca66114

Tag: `node:shell-migration-milestone-1@g12`. Correction round 1 of 2.

**Verdict: PASS.** I found no Correctness finding and no Evidence finding. All five blocking findings from attempt 1 are resolved, and I re-made each one's evidence myself. All twelve Documentation findings from attempt 1 are fixed. Six new Documentation findings (N-D1 to N-D6) must be fixed in this PR before the merge. They need no re-gate.

The head is `origin/cut/shell-migration-milestone-1`. The merge base is still 176ab9127463a8d3fdec1a69b640a4c1754f7349. The round's commits are 757271d4, 2e17ee52, 03654b97, 773d42af and ae704f0a: 8 files, 99 lines added and 42 removed, none of them Rust. The form, the ruling and reports 8 and 9 were read on main. Their bytes are unchanged at d056a7af. Amendments 9, 10 and 11 are append-only: the form before each of their commits is a byte prefix of the form after it. §7 is byte-identical to its text at 7dd0315d, the commit that added the form.

---

## Attempt-1 findings

**C1: K6 case (iii) re-aim. Resolved.**
- **The code.** I compared the region from `const repickHover` up to the line before `ASSERTION (iv)` at the head with f214f1f4, the parent of 25a8a881. The only difference is a 7-line comment, now at `frontends/shell/e2e/regression.mjs:1313-1319 @ ae704f0a`. The same region against the merge base 176ab912 also differs only by that comment.
- **The helpers (iii) calls.** None of them changed: `establishAboveThresholdHoverK6`, `readHoverReadoutState`, `hoverReadoutId`, `hasConfirmingRepickTrace` and `wheelWithoutMoving`. The f214f1f4..HEAD diff has no hunk in them. The hunks nearest them add only a constant and comments.
- **The summary string.** At `:1699` it is again the pre-stage-4 string, and `repickId` is the hovered id again.
- **At the head.** K6 passed all five cases in my run. Case (iii) hovered id 52144 and read the same id back after the zoom pair.

**E1: (iii) not shown able to fail. Resolved.**
- The case is unchanged, so Decision A's mutation condition does not apply.
- Amendment 10 item 3 says so, and the code comparison under C1 supports it.

**C2: the map minimum in the real DOM. Resolved.**
- `box-sizing: border-box` is on `.attention-strip` and `.status-bar` (`frontends/shell/src/styles.css:148`, `:161 @ ae704f0a`).
- **E-FLOOR observation, re-made with no product edit:**
  - **At 757271d4, in my scratch worktree:** E-FLOOR failed by name, with the map at 480 × 306.21875. Every other step and FIXTURES passed.
  - **At the head:** it passed, with the map at 480 × 320, the attention strip at 128 px and the status bar at 48 px.
  - **What differs:** `layout.mjs` and `lib.mjs` are byte-identical between 757271d4 and the head. Between the two commits, `src/` differs only by the 2 CSS lines and the `layoutConstants.ts` comment.

**E2: KNOWN-LIMITATIONS 39. Resolved.**
- The body at `KNOWN-LIMITATIONS.md:369 @ ae704f0a` now says "may" and defers to walkthrough row U6.
- The heading's "can" and the comment's "inference" wording are consistent with it.

**E3: CI. Resolved.**
- The Product CI Rust workspace run 37836080416 at 8127b0f5 shows attempt 2 green on both ubuntu-24.04 and windows-latest.
- No path the Rust, fmt or governance workflows watch changed after 8127b0f5, so those workflows did not trigger at the head.
- The failure is filed at `state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt`, and node `skp-drained-stream-helper-post-check-race` on main names it.

**Documentation findings D1 to D12: all fixed.**
- **D1:** the PR body now has the walkthrough row list. See N-D6 on how its cells are worded.
- **D2:** the result commits are now named. N-D3 is what is left.
- **D3:** every suite is listed at ae704f0a. The tool commits in the PR body match `git log` at the head and on main: 04f6332b, f9444a4d, e9735d47 and 26072022.
- **D4:** all nine failure quotes in the PR body are byte-identical to their reports. Seven are from report 5. Case (v) is from report 7, with an honest `…` elision. E-FLOOR is from report 8.
- **D5:** Amendment 9 item 7 now names the tools' commits.
- **D6:** Amendment 9 item 7 and Amendment 11 item 4 record the per-file ceilings.
- **D7:** Amendment 9 item 7 records the three edits beyond the named checks. The PR body lists `setCam` and `shouldStop`, and the CLASSC′ row records the second click.
- **D8:** UTF-8 is repaired; the garbled clause is fixed, but see N-D1.
  - A strict decode of all 31 files changed three-dot from 176ab912 passes. So does the worker's 108-file set from e888787e.
  - Positive control: the same decoder rejects both files at 8127b0f5.
  - § is at `regression.mjs:855` and ± is at `pan-anchor.mjs:148`.
- **D9:** `VIEWPORT_FLOOR`'s comment now names U1 as its reader (`layoutConstants.ts:14-17`).
- **D10:** node `shell-stale-frame-comments` is in PLAN.yaml on main.
- **D11:** the case (iii) summary is restored.
- **D12:** ABSENTCRS′'s return string is fixed (`regression.mjs:2443`).

## Correctness

None.

## Evidence

None.

## Documentation (must be fixed in this PR before the merge; no re-gate)

**N-D1. A map-size comment still claims to be measured at the current head.**
- **Where:** `frontends/shell/e2e/pan-anchor.mjs:129-131 @ ae704f0a`.
- **What is wrong:** commit 773d42af rewrote this clause. It says that 668 × 730, 328 × 570 and 788 × 830 were measured at this branch's head. At 773d42af, which already has the border-box fix, and at the head, the maps are 668 × 736, 328 × 576 and 788 × 836. My pan-anchor run and report 9 both show this.
- **The record it breaks:** Amendment 11 item 1 says earlier comments quoting 730.2 are true of their heads. That does not hold for this sentence, because it was written at a head where it was already false.
- **Fix:** name the commit the numbers were measured at, or update them.
- **Why this is Documentation:** the derivations read the live box, and no guarantee or limit rests on these numbers.

**N-D2. Amendment 10's hash reference has no explicit `@ <rev>` (round 15 (e)).**
- Amendment 9 fixed this same defect for Amendments 3 to 7 (A-D8).
- The hash recomputes: the ruling's lines 6-15 at aad1ba725b714fdd2a26703420e88fd0aa11f540, which is on main, give sha256 aec86de3…d2cd.
- **Fix:** append a row naming that commit.

**N-D3. A sentence in the PR body's Suites section is stale.**
- It says the head differs from the result commits by comment commits and by merges of main.
- The head differs from 82d1f73a and from 8127b0f5 by E-FLOOR (757271d4), the CSS fix (2e17ee52) and the case (iii) restoration (ae704f0a).
- The results table is now at ae704f0a. Drop the sentence, or limit it to the earlier commits.

**N-D4. One quote in the PR body names the wrong source report.**
- The mutation section says its quotes are byte-copied from report 5, or report 7 for (v).
- The E-FLOOR row's quote is from report 8, where it is byte-identical. Name report 8.

**N-D5. A tool result in the PR body has no commit (round 15 (c)).**
- The "scripts suite, 457 of 457" line names no commit.
- My run at ae704f0a gives 457 of 457. Add that commit.

**N-D6. The walkthrough-row table shows paraphrases in code spans, which read as the file's words.**
- G1 (both cells) drops "the collapsed" and "disclosure" with no elision mark.
- J1's and M3's new cells say "its top-bar toggle". The file says "its toggle in the top bar".
- Dropping bold markup is fine.
- **Fix:** byte-copy the cells, or label the table as paraphrase.
- **Why this is Documentation:** the walkthrough is not the human's words.

## Suggestions (optional)

- **S1.** E-FLOOR prints the two bars' heights but does not assert that they reached 128 and 48 (`layout.mjs:268` onwards). If the probe rows ever stopped filling a bar, the step would pass without testing anything. Assert both heights against their caps.
- **S2.** E-FLOOR passes at exactly 480 × 320, with no margin. If a display-scale rounding flake ever appears, it will show here first.
- **S3.** Several other comments still describe the map as 668 × 730 in the present tense: `regression.mjs:712-714, :880, :1464, :1658`, `filter-panel.mjs:379-385` and `pan-anchor.mjs:143`. Amendment 11 item 1 covers them; naming their commit would be clearer.
- **S4.** Attempt-1 S4, about fractional map heights, is now moot. Border-box gives the status bar 24 px, and the map is an integral 736 px at the 1280 × 800 window, so it no longer sits between 730 and 731 rows.

## Other checks

- **§7, by its own command** (`git diff --numstat 176ab912...HEAD` with the three excludes), rc 0:
  - G1 953, G2 273, G3 339, G4 66, G5 1,004, G6 747.
  - Total 3,382 lines over 28 files.
  - G6 by file: `layout.mjs` 417, `regression.mjs` 192, `pan-anchor.mjs` 62, `source-changed.mjs` 40, `filter-panel.mjs` 22, `console.mjs` 9, `style.mjs` 3, `source-watch-idle.mjs` 2.
  - This matches Amendment 11 item 4 row for row.
  - Outside the count: walkthrough 122, e2e/README.md 12, KNOWN-LIMITATIONS 15. All are within their ceilings.
- **Round 25:**
  - The class 8 overrun is recorded in Amendment 11, whose heading says "budget overrun, §7 not edited". §7 is unedited.
  - Amendment 9 (21:00:46Z) precedes 757271d4 (21:02:48Z).
  - Amendment 10 (21:28:49Z) precedes ae704f0a (21:34:37Z).
  - No `verify-mutation` run is called an observation.
  - No test text is pinned by hash at a branch commit.
- **Discharge claims:**
  - Amendment 10 item 3 and Amendment 11 item 2 resolve against the code comparison under C1.
  - Amendment 11 item 3's masked layout exit code is discharged by my layout run at the head, rc 0.
- **Hashes:**
  - The commits named in Amendment 9 item 7 (45e7a0b0, 20c47954, badac676, 994b9737, 176ab912) each add their file on main.
  - Report 8's and report 9's filing-note hashes recompute (be697ed4…, 2168eb69…).
- **Named nodes:** `shell-pick-paths-disagree-at-1280x801`, `shell-stale-frame-comments`, `e2e-failures-present-at-the-base` and `shell-map-refill-after-resize` are all in PLAN.yaml on main.
- **PR body:**
  - Its first paragraph matches the code: the hover readout and the error banner still draw over the map, and the minimum is claimed only at or above 1024 × 640.
  - Case (iii) is stated as unchanged, and the node is named.
  - "668 × 736" matches my runs.
  - The claim that the merges brought nothing under `src` or `e2e` holds for 780b79eb and 8127b0f5.
- **Low profile:** the 5 commit messages carry only the sign-off and the two trailers. The PR body has no @mention and no outside reference, only #190, which is in this repository.

## Commands (rc, hold)

**Not held (light):**
- Fetch, status and diff reads: rc 0.
- The case (iii) region diff against f214f1f4 and against 176ab912: rc 1 each. The only difference is the comment.
- The §7 numstat: rc 0.
- The strict UTF-8 decode, 31 files and 108 files: rc 0 each. The positive control at 8127b0f5 rejects both files.
- `gh pr view 195`: rc 0. The PR is open, its head is ae704f0a, and it is not a draft.
- The quote-identity and row-table scripts: rc 0.
- `gh pr checks 195`: rc 0, 6 lines, nothing pending, so no wait was needed. Every line, in full:
  - every commit is signed off: pass;
  - no profile path in the range: pass;
  - tauri build (NSIS, build-only, no signing): pass, ×2;
  - typecheck · build · vitest · cargo test: pass, ×2.
- `gh run list` and `gh run view 37836080416`: rc 0.
- At the head, on the branch tree: verify-cites, verify-quotes, verify-test-claims and verify, rc 0 each.
- On main at d056a7af, read-only: verify-cites, verify-quotes and verify-test-claims, rc 0 each.
- The hash recomputes: rc 0.
- `git worktree add --detach C:/dev/wt/rv2-efloor 757271d4`: rc 0.
- `node scripts/generateNotice.mjs` in the scratch tree: rc 1, because it needs the viewer's build metafile. Instead I copied the gitignored, generated `src/generated/NOTICE.txt` from `C:/dev/wt/m1`. No lockfile, `src-tauri`, `Cargo.lock` or `renderer` path differs between 757271d4 and the head.
- `git worktree remove --force C:/dev/wt/rv2-efloor`: rc 0. The scratch worktree is gone.
- `app-down.ps1` after every e2e run: rc 0, ports 9223 and 5400 free each time.

**Shared hold**, `hold shared -Project SpatialIDE`, the paragraph's one-call shape, `cd` first. Every hold was granted and released, and no exit code from 96 to 99 occurred. The launches used report 2 section 3's method: vite on 5400 with the host-resolver rule, and the worker's scratch folder's `npx.cmd` shim first in `PATH`. For the scratch tree, `M1_SHELL` pointed at it. I used the worker's tools unchanged. As written, they put their logs and pid file in the worker's scratch folder. The exe is attempt 1's overlay build. No Rust file changed after 8127b0f5, so I did not rebuild it.
1. `npm ci --prefer-offline` in the scratch tree's `frontends/shell`: rc 0.
2. `node e2e/layout.mjs` at 757271d4, first call: rc 1. The harness failed at the mount-readiness gate because vite could not resolve the missing generated NOTICE.txt. That was my setup, not a finding.
3. `node e2e/layout.mjs` at 757271d4, second call: rc 1.
   - E-FLOOR failed by name, with the map at 480 × 306.21875.
   - Every other step and FIXTURES passed.
   - E-FIT measured 668 × 524.21875 and 754 × 492.21875.
4. `node e2e/layout.mjs` at the head: rc 0.
   - Every step passed: OPEN, E-KEYS (map 668 × 736), E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT (668 × 530 and 754 × 498), E-FLOOR (480 × 320; strip 128, bar 48), RESIZEQ (0 and 0, recorded) and E-REOPEN.
   - FIXTURES passed, with the hashes unchanged.
5. `node e2e/regression.mjs` at the head: rc 1. Only C2′/C3′ failed, as at the base.
   - A9′ passed at notch 4/15.
   - K6 passed all five cases.
   - K7, CURSOR′, FIND′, MP′, PT′, LN′, B2′/B3′ and ABSENTCRS′ passed. The new ABSENTCRS′ string printed.
   - NET′ was INFO.
6. `node e2e/pan-anchor.mjs` at the head: rc 0, 16 of 16.
   - The boxes measured 328 × 576 and 788 × 836.
   - Paint-vs-event: ±85 within 0.01 px and ±250 within 0.08 px.
   - The there-and-back nets were 0.00 and 1.00.
7. `npm run verify` in `frontends/shell` at the head: rc 0. Vitest ran 78 files and 1,184 tests, all passed. Residency-trace: 76 passed, 0 failed. Citation-integrity: 30 passed, 0 failed.
8. `node e2e/filter-panel.mjs` at the head: rc 0, 5 of 5. FIND′ read 0.27%, above the 0.08% floor for a 668 × 736 map.
9. `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` at the head: rc 0, 457 of 457.

Of the brief's suites I spot-checked `npm run verify`, layout, regression and pan-anchor, plus filter-panel and the governance `node --test`. I relied on report 9 for the rest. No shared-run failure was timing-sensitive.

**Final state:** `C:/dev/wt/m1` is clean at ae704f0abc924bde7a6f912a853f039dfca66114, which equals origin. No listener remains on 9223 or 5400. I made no product edit and no commit. My temporary files are in my scratch folder only.

**Relevant paths:**
- `C:/dev/wt/m1/frontends/shell/e2e/regression.mjs`
- `C:/dev/wt/m1/frontends/shell/e2e/layout.mjs`
- `C:/dev/wt/m1/frontends/shell/e2e/pan-anchor.mjs`
- `C:/dev/wt/m1/frontends/shell/src/styles.css`
- `C:/dev/wt/m1/KNOWN-LIMITATIONS.md`
- `C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/directives/2026-10-08-k6-case-iii-ruling.md`
