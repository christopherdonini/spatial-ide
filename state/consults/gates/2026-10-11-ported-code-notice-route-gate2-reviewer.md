# PR #208 gate 2 — reviewer
Reviewed: cut/ported-code-notice-route @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45

**Verdict: PASS.** There are no Correctness or Evidence findings. Correction round 1 closes every gate 1 Correctness finding: reviewer C-1 and C-2, and architect C-1, C-2 and C-3. Two new Documentation findings, D-a and D-b, are must-fix before the merge, with no re-gate (`state/directives/2026-10-05-product-first-direction.md:15 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`). The governing amendment is `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md:382-395 @ 99163b0ff05329e554151d680cb7f22ced09d6b2 sha256:3c439a27fc4764152f17d52420b8a1dcc0c5d859dd41cea62ed53f8499b69157`.

## Correctness

No findings. What the verdict rests on:

- **Architect C-2, the caller rule: closed.**
  - `generateNotice.mjs` binds one `portedRoot` (`frontends/shell/scripts/generateNotice.mjs:96 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:01bd862f3f084896504643af8adef80e8f15ba2e1764ee6d3d88a9226ebaca59`).
  - It passes that value to `portedPrebuildCheck` as `root` (`frontends/shell/scripts/generateNotice.mjs:115 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:aaacfc5b3f137d43f8098281123fec782551d379843a083f66ae41977818965a`).
  - It passes the same value to `notice()` as `options.portedRoot` (`frontends/shell/scripts/generateNotice.mjs:186 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:1c656c6d4ea0bab4f7e4ade1fe53ad74bb41c2d12038007738bb5fcc18addea5`).
  - Both options now have a product caller.
  - The value passed is the same directory both functions used by default:
    - the default in `renderer/bundle-viewer/portedNotices.mjs:312 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:80e918c49ba5e15d26975c09cc2a9425be0310581e310155178efb8b62e83b78` uses the same expression;
    - the default in `renderer/bundle-viewer/notice.mjs:111-115 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:93dc8186d20cab31bf4c9162054009498a3bd93d00575baccb2d71a649c5cef7` is computed from that file's own location;
    - `node -e` resolved all three to `C:\dev\wt\pcnr\LICENSES\third-party\ported`, `equal true`, and `MANIFEST.json` exists there.
  - P2 is unaffected. The shell CI log shows `check:dist-notice` PASS with `ported source files 0` (check 6).
- **Reviewer C-1 and architect C-1, CONTRIBUTING: closed.** `CONTRIBUTING.md:172 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:81aedb25b7940d959b17ae526d4807655d2f8c02a49638a62471d21cec23e45c` now limits the fail-on-a-marked-file claim to "a packaged build from a git checkout". It also states what happens outside a checkout. I checked each claim against the code:
  - **In a checkout:** (i) runs over `git ls-files`, and (ii) fails on a registered file that is untracked or has no header (`renderer/bundle-viewer/portedNotices.mjs:226-243 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:c2e3f80a47bb9521cc538c32daf24e04e754c4444b617a33b12d13d07d0adc45`).
  - **The build path:** `generateNotice` runs in both `prebuild` and `build` (`frontends/shell/package.json:12,14`), and Tauri's `beforeBuildCommand` is `npm run build`.
  - **Outside a checkout:** `listTrackedFiles` returns null when the lstat fails with ENOENT. (i) is then skipped, (ii) reads from the disk, and (iii) runs. (iv) checks form only (`renderer/bundle-viewer/portedNotices.mjs:204-210 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:b65cb0e5dd8b1e464e96b0d38a672be6e088df9b535cebca6f470c93bc13688a`). There is exactly one note, printed with `console.log`, after which generation continues.
  - **The repository check outside a checkout:** it fails by name and has no archive mode (`scripts/check-ported-notices.mjs:28-36 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:4203ec2975e4c938fd63849785e52db002ef12352b72c4df99f293c56d0084c3`). This does not contradict the text.
  - **A `.git` entry where git cannot list:** the check throws, giving a FAIL and exit 1. This is not contradicted either.
  - One wording point is D-a below.
- **Reviewer C-2 and architect C-1, the ported README table: closed.** `LICENSES/third-party/ported/README.md:46-58 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:b93e44fe3318ce00f6de9db5375b4f28aab8e0dbba953cda8cb5a3863ddcad3d`. Each claim holds at the head:
  - **`readPortedRegistry`** runs in `notice()` (`notice.mjs:111`). `notice()` is called by the viewer's `build.mjs:42` and by `generateNotice.mjs:186`; these are the only importers of `notice` outside tests. It also runs in `checkDistNotice.mjs:462`, `check-ported-notices.mjs:28` and `portedPrebuildCheck` (`portedNotices.mjs:313`).
  - **`checkPortedFiles`** is called only from `check-ported-notices.mjs:36` and `portedPrebuildCheck` (`:315`), and `portedPrebuildCheck` is called only from `generateNotice.mjs:115`. I grepped every `.mjs`, `.ts`, `.mts`, `.json` and `.yml` file, tests excluded. The viewer build and `check:dist-notice` do not call it.
  - **`portedSectionFindings`** has one product caller, `checkDistNotice.mjs:464`.
  - **The schema row:** `upstream_repository` and `license_id` are checked as non-empty strings only (`renderer/bundle-viewer/portedNotices.mjs:101-103 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:317837187856fc08f24bb1281317b439fae6e086ae41bec5d17aede36945b84a`).
  - **The `files[].path` and `adopted_by` rows:** the tracked tests apply only in a checkout. Outside a checkout, ENOENT or EISDIR from the disk read gives the finding "absent from the tree", and a directive path gets a form check only (`:209`, `files === null`). Both match the rows.
- **Architect C-3, the comment: closed.** In `frontends/shell/scripts/checkDistNotice.mjs:457-461 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:23dbc2b8336dd78b6a9bcff1178fb4c5a995c8261d1c2d2d58f0e2619f5b2e46`, the change is comment lines only (check 1). I re-traced its placement claims, which the worker had not done:
  - **Where the slices end:** `noticeBody` ends at the first DuckDB end sentinel, and the viewer slice runs from the `THIRD-PARTY WORKS COMPILED INTO THIS VIEWER` heading to the frontend heading (`frontends/shell/scripts/checkDistNotice.mjs:356-371 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:21363ffad7e7d3202fc4109f1b5b17b6214a66b8c1a932ef52cce84dc344d12a`).
  - **The viewer subsection** is emitted directly after the viewer package section and before the `npmSets` loop (`renderer/bundle-viewer/notice.mjs:238-246 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:89a4881187d50fa36b6b5cfbd7b70e5f0768c8b5811a717adfa00c07600065cf`).
  - **The application section** is emitted after the DuckDB section (`renderer/bundle-viewer/notice.mjs:288-290 @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 sha256:816b65c8fb76fbff4fcaa6c1e873d44de9c6638412bc8971fb5ef7130a0974d6`).
  - **A probe in my scratch directory confirmed this empirically.** I called `notice()` with a temporary registry under `os.tmpdir()` holding one viewer-input port, a frontend `npmSets` entry and a DuckDB set, then cut the slices as `checkDistNotice` does. Result: `viewerSubsectionInsideViewerSlice: true` (viewer slice 1258–153601, subsection at 152740), `appSectionAfterNoticeBody: true`, `appInBody: false`. rc 0.
  - The latent `ENTRY_LINE` exposure is carried to the first viewer-port piece's form (Amendment 2 item 4), not to this round.

## Evidence

No findings.
- Every suite I was asked to run is green at the head (check 5).
- CI is green on all 9 runs at 7b58300b (check 6).
- The shell job logs carry the `check:dist-notice` PASS line with `ported source files 0`.
- The worker's NOTICE sha256 (18c71526…) equals P2. I did not rebuild it, because no heavy runs were allowed. The CI PASS line at the head is the corroboration.

## Documentation (must be fixed before the merge; no re-gate)

- **Gate 1 D items, both reports:**
  - **Reviewer D-1 and architect D-1 (the sighting of the latent wording): closed.** PR body line 16 now carries "You sight that wording in the first port piece, which does not merge before you have."
  - **Reviewer D-2 and architect D-1 (the AUTONOMY finding): closed.** Body line 28.
  - **Reviewer D-3 and architect D-2 (the three-docs sentence): closed.** Body line 23 now names only the ported README and the CONTRIBUTING section, and both carry the sentence (`README.md:66`, `CONTRIBUTING.md:172`).
  - **Architect D-3: open, but not yet due.** Naming `renderer/bundle-viewer/notice.d.mts` belongs in the closing record, which is not written yet. Body line 65 and Amendment 2 item 5 both commit to it. The custodian should check it at the closing record.
- **D-a (new).** The second sentence of `CONTRIBUTING.md:172` begins "A build outside a git checkout". Read alone, that covers the viewer's own build (`renderer/bundle-viewer/build.mjs:42`). That build calls `notice()` only, so it neither checks the registered files nor prints the NOTE line. The paragraph's subject is the packaged build, and for that build the sentence holds, so I do not class this as an unsupported guarantee. Fix: "A packaged build outside a git checkout". `README.md:62`'s "A build from a source archive" is unchanged by this round, but the same word would help there.
- **D-b (new).** PR body line 54 says "`notice()`'s `portedRoot` option and `portedPrebuildCheck`'s `root` had test callers only." No caller, test or product, passed `portedPrebuildCheck`'s `root`: the tests at `renderer/bundle-viewer/scripts/portedNotices.test.mjs` lines 253, 259 and 274 at 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 pass `{ repoRoot: root }` only. Architect C-2 recorded this correctly. Fix the body.

**Notes (no class, not blocking):**
- `checkDistNotice.mjs:89` still computes its own `PORTED_ROOT` separately. "One directory by construction" holds for the prebuild check and the notice, which is what the body claims, but not for `check:dist-notice`. It is out of this round's scope.
- The new comment's "which the viewer's own cardinality check above already reads" is accurate, but it does not mention the latent `ENTRY_LINE` exposure. That exposure is carried by Amendment 2 item 4.

## Checks

1. **The round's diff.** `git diff --numstat c81965765032402b739f25ed0f6d1e3de9e9f485 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45`, rc 0.
   - Files: `CONTRIBUTING.md` 1/1, `LICENSES/third-party/ported/README.md` 13/9, `frontends/shell/scripts/checkDistNotice.mjs` 5/3, `frontends/shell/scripts/generateNotice.mjs` 3/2. These are exactly Amendment 2's four files.
   - Commits:
     - c1b236ad holds `generateNotice` and `checkDistNotice`;
     - 7b58300b holds the README and CONTRIBUTING.
   - All hunks were read; findings above.
   - **`checkDistNotice.mjs` is comment-only:**
     - I stripped the `^\s*//` lines from `git show <rev>:…` at both revs (rc 0, rc 0). Both outputs have 341 lines, and `cmp` gives rc 0.
     - The diff has no changed line outside a comment (grep rc 1).
     - Positive control: 8 comment lines changed (3 removed, 5 added), rc 0.
2. **Gate 1 findings.**
   - Reviewer C-1: closed.
   - Reviewer C-2: closed.
   - Architect C-1: closed.
   - Architect C-2: closed.
   - Architect C-3: comment closed; the count is carried to the first viewer-port piece.
   - D-1 to D-3: closed, except architect D-3, which is due at the closing record.
   - Reviewer N-2 is resolved by C-2's fix.
   - Details are in the sections above.
   - PR body read with `gh pr view 208 --json title,body,headRefOid`, rc 0. headRefOid is 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45.
3. **The caller rule.** `portedRoot` reaches both functions from `generateNotice.mjs:115,186`, and the `node -e` resolution gives the same path as both defaults, rc 0. The `git grep` for importers of `notice.mjs` (rc 0) finds `build.mjs` and `generateNotice.mjs` as the product callers; the rest are tests.
4. **Budget.** `git diff --numstat origin/main...origin/cut/ported-code-notice-route`, rc 0, merge base 81d98ed9b24727d9f013f5141ba7a4fc5f70b038. The sum is 1,279 added + 5 deleted = 1,284 lines over 19 files, within Amendment 1 (j)'s 1,550 lines and 20 files. This matches the worker report and body line 26.
5. **At the head:**
   - `node --test renderer/bundle-viewer/scripts/portedNotices.test.mjs renderer/bundle-viewer/scripts/notice.test.mjs`: rc 0, 25 tests, 25 pass, 0 fail.
   - `node scripts/check-ported-notices.mjs`: rc 0, "check-ported-notices: PASS -- 2157 tracked file(s) searched for port markers; 0 registered work(s), 0 registered file(s)".
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1722 files.
   - `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 121 checked, 0 hash-reference errors.
   - `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 543 claims.
   - `node scripts/plan/verify.mjs`: rc 0, verify:plan PASS.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
   - Also: on main at 99163b0f, PLAN.yaml's node `ported-code-notice-route` has `generation: 3`, which is Amendment 2 item 7.
6. **CI.** `gh pr checks 208`, rc 0: 12 rows, all pass, none pending.

   | Check | Result |
   |---|---|
   | cfg boundary (PORTABILITY R2) | pass |
   | every commit is signed off | pass |
   | no profile path in the range | pass |
   | ported-notices | pass ×2 |
   | tauri build (NSIS, build-only, no signing) | pass ×2 |
   | test · verify:plan · queue/site drift | pass |
   | typecheck · build · test | pass ×2 |
   | typecheck · build · vitest · cargo test | pass ×2 |

   - **Runs:** `gh api …/actions/runs/<id>` (rc 0 each) and `gh run list --commit 7b58300b…` (rc 0) show all 9 runs with head_sha 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 and conclusion success.
   - **Why 12 rows, not gate 1's 14:** at this head, Governance CI ran on pull_request only. There is no push run, so its two checks appear once each.
   - **Logs:** downloaded with `gh run view --job <id> --log`, rc 0 for each.
     - The shell jobs 114451141797 (push) and 114451149970 (pull_request) each carry one line beginning "check:dist-notice: PASS -- all 3 required notice strings, all 26 Vite package name(s), and all 335 linked crate name(s)". Within it: "(viewer 3, frontend 26, Rust crates 352, DuckDB amalgamation 26, ported source files 0)".
     - The two shell jobs and the two tauri jobs (114451141884, 114451150126) have 0 `generateNotice: NOTE` lines and 0 `generateNotice: FAIL` lines. Positive control: the NOTE pattern matches `portedNotices.mjs`, rc 0.
     - So the §5 invalidator has not fired.
7. **Low profile.**
   - **Commit messages:** I read both new messages and scanned them for `https?://`, `owner/repo#N`, `#N` and `@name` (rc 0). The only hits are the Co-Authored-By and Signed-off-by trailer e-mails.
   - **PR body:** the same scan finds only the two standard attribution lines (body lines 73 and 75). There is no outside issue or PR reference and no @mention.
   - No finding against `state/directives/2026-10-08-low-profile-on-github.md`.

Scratch files only in `<the custodian's scratchpad>/rev208b/`: `probe.mjs`, the stripped copies, the job logs and `body.md`. The probe's temporary registry was removed in its `finally`.

Final `git status --porcelain` in `C:/dev/wt/pcnr`: empty (rc 0), with HEAD at 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45.
