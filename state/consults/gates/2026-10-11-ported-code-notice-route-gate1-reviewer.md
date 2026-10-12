# PR #208 gate 1 — reviewer
Reviewed: cut/ported-code-notice-route @ c81965765032402b739f25ed0f6d1e3de9e9f485

**Verdict: FAIL.** Two documents claim guarantees the code does not provide (C-1 and C-2). Under `state/directives/2026-10-05-product-first-direction.md:15 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`, an unsupported guarantee claim is never documentation-only, so these two findings block. Each fix is a qualifying phrase. The code, the tests, the mutations, CI, the ADR-030 bytes and the pins all check out.

## Correctness

**C-1. CONTRIBUTING.md says every packaged build fails on an unregistered marked file. Builds outside a git checkout do not.**
- Where: `CONTRIBUTING.md:172 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:db4a923b3dbf8beffb0cc6c9932e599c0c495f345ea2b30d253edc7c4f20c8a3`. It says the repository check "and the packaged build fail when a marked file has no entry or an entry has no marked file". Nothing in that section mentions a git checkout or a source archive (I grepped CONTRIBUTING lines 157–172 for `checkout` and `archive`: no match).
- What the code does: when there is no listing, the marker scan (direction (i)) is skipped (`renderer/bundle-viewer/portedNotices.mjs:227-235 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:f2a1e4d4a394a599f608ccf12271295530fc823d50b59b290a2fb13dff7a8cad`). `generateNotice.mjs` then prints the NOTE line and carries on (`frontends/shell/scripts/generateNotice.mjs:110-125 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:3f7c9e444cb0b5c163642adfc53ddb795f97fea44d0d594c835bb2ad704f56c6`).
- What the form allows: Amendment 1 (f) narrowed the claim to "a packaged build from a git checkout" and added a may-not-claim for builds outside a checkout (`renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md:321-323 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:1393c0b948f4ac85bc2bdfc51c9f13fe326142be4cc3622b7e1a8755bf505249`).
- The human's note in ADR-030 says the same (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:92 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:65a12e00465045cb4a0b92c68326d6d8d912ed28a83762658efee923ae8dc758`).
- The ported README gets this right (`LICENSES/third-party/ported/README.md:58 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:1592867961c95a74ec96282f4d902913582d34ba53709839cfc32b63fa45f1c9`).
- Fix: in CONTRIBUTING, limit the marked-file-without-entry half to a packaged build from a git checkout, and say that a source-archive build checks the registry side only.

**C-2. The ported README's verification table claims checks that `readPortedRegistry` and `check:dist-notice` do not run.**
- Where: `LICENSES/third-party/ported/README.md:46-54 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:f1c396c7f68659afbf47ccaf984032305816f9cdce76f5f9586cd2103d37bec9`. The intro says the fields below are "Verified on every NOTICE generation (`readPortedRegistry`) and every `npm run check:dist-notice`".
- The `adopted_by` row ("well-formed; a directive path must be tracked") names no narrower check. In fact `adopted_by` is checked only by `checkPortedFiles`, which runs in the repository check and the shell prebuild.
  - `readPortedRegistry` never reads `adopted_by`.
  - `checkDistNotice.mjs` calls only `readPortedRegistry` and `portedSectionFindings` (`frontends/shell/scripts/checkDistNotice.mjs:457-462 @ c81965765032402b739f25ed0f6d1e3de9e9f485 sha256:cf965aaf7caf4dcb0080a32a11c2baf06c37991d8913b258bf1edb1c2ed44ac9`).
  - The viewer's `build.mjs` generates a NOTICE through `notice()`, which runs `readPortedRegistry` only.
- "Must be tracked" is checked only when there is a listing. The `files[].path` row's word "tracked" has the same gap: outside a checkout the prebuild only checks that the file exists on disk.
- Fix: qualify both rows (the repository check and the shell prebuild; tracked status only in a git checkout).

**Not findings: correctness review of the rest of the diff.**
- **The reader** (`readPortedRegistry`):
  - It checks every field.
  - It re-hashes each pinned text, then checks its byte count and that it is valid UTF-8.
  - It throws on duplicate works and on paths registered twice.
  - It cannot read outside the registry, because a work id that is not directory-safe is already a fault before the throw.
- **The checks, both directions:** (i), (ii), (iii) and (iv) behave as Amendment 1 (f) says, including `files: null`. Each finding names its path or work.
- **`listTrackedFiles`:**
  - It does one `lstat` of `<root>/.git`.
  - ENOENT returns null; any other lstat error throws.
  - It runs `git -C <root> --git-dir=.git --work-tree=. ls-files -z` with `shell: false`, and throws on a spawn error or a non-zero exit.
  - It contains no OS-conditional code and no network access. I grepped the diff for `process.platform`, `win32`, `darwin`, drive letters and http/net/fetch, and found only string escapes.
- **The latent notice section:**
  - Both section functions return `[]` for an empty registry.
  - The application section is pushed only inside `if (extra)`, after the DuckDB section.
  - Sorting is by code unit, with no timestamp.
  - The viewer intersection uses `posix.relative('/renderer/bundle-viewer', '/'+path)`. I read the real build output `renderer/bundle-viewer/dist-metafile.json` (gitignored, 145 inputs). Its keys have the shape `src/main.ts` and `../style-ts/src/style.ts`, which is the shape the T10 and T11 fixtures use. So those fixtures encode the real interface.
- **The prebuild check:** it runs before any text is generated. A throw or any finding gives a named FAIL and exit 1.
- **The workflow** matches item (h) and §8 item 15:
  - triggers: push and pull_request, with no filters;
  - permissions: `contents: read` at workflow level;
  - one job, `ported-notices`, with no matrix;
  - steps: checkout with `persist-credentials: false`, then Node 24 with no cache, then the script;
  - no install;
  - `timeout-minutes: 5`, which is neither a step nor a permission.
- **The tauri-build log** at c8196576 (job 114446498129) has 0 lines matching `generateNotice: NOTE`, and neither does the shell job's log. So the §5 invalidator (the NOTE line in a CI build) has not fired in either log.

## Evidence

No findings.
- I re-observed three mutations (check 3); each failed as the worker reported.
- Every new test file runs in a named CI step (check 6), and CI is green at the head (check 7).
- P2 (NOTICE byte-equality) is the worker's recorded double build. I did not re-run it (no heavy runs). CI's `check:dist-notice` at the head reports `ported source files 0` and PASS.

## Documentation (must be fixed before the merge; no re-gate)

- **D-1.** The PR body does not name the first port piece's sighting of the latent wording. Amendment 1 (k) requires it (`renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md:356-361 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:abf8a4ccdaa8e37cbfb0d7b29d869e9526cc2e96f114e7c10c201ff81b11d704`). The body says only that the section "stays latent while the registry is empty".
- **D-2.** The PR body does not say that the AUTONOMY.md label finding stays with the weekly window. Amendment 1 (k) requires that too (same pin).
- **D-3.** The PR body says the three docs "Each says that the check cannot detect an unmarked port". The section appended to `LICENSES/README.md` does not say this. Fix the body, or add the sentence to that section.

**Notes for the architect and the first port piece (no class, not blocking):**
- **N-1.** `commentBody` strips one prefix from `//`, `#`, `/*`, `*` and `<!--`. A marker written as `//! Ported-From:`, `/// …` or `/** SPDX-License-Identifier: MIT */` therefore leaves `!`, `/` or `*` in front of the token, and direction (i) does not see it. Those forms are outside §2.3's declared form, and a registered file with such a header still fails closed in (ii). The first port piece should test the Rust `//!` form.
- **N-2.** The caller rule, for the architect to rule on. `notice()`'s `options.portedRoot` is passed only by tests; both product callers use the default. `portedPrebuildCheck`'s `root` is passed by no caller at all. Both are the signatures that §2.4 and Amendment 1 (f) declare, and `portedRoot` is what keeps fixture registries out of the tracked tree (§8 item 9). I do not fail the gate on them.
- **N-3.** The viewer subsection sits inside `checkDistNotice.mjs`'s viewer slice, which runs from VIEWER_HEADING to FRONTEND_HEADING. Its work, file and copyright lines cannot match `ENTRY_LINE` (`^(\S+) (\S+) — `), but pinned upstream texts are arbitrary. No test counts the viewer slice with a viewer port present.
- **N-4.** The `notice.d.mts` edit (+8 lines) is the type of §2.4's fourth parameter. It is needed by T15, and it is inside the budget (19 of 20 files). I read it as within §2.4.

## Checks

1. **Full diff.** `git diff --numstat origin/main...origin/cut/ported-code-notice-route`, rc 0.
   - Totals: 1,271 insertions + 4 deletions = 1,275 changed lines over 19 files, within Amendment 1 (j)'s 1,550 lines and 20 files. The form itself is not in the diff.
   - Merge base: 81d98ed9b24727d9f013f5141ba7a4fc5f70b038. Range: 8 commits, 587a9411 to c8196576.
   - No `package*.json`, lockfile, `Cargo.*`, `engine/` or `kernel/` file is in the diff.
   - The only existing lines changed are the `notice.mjs` path import, the `notice()` signature, and the `checkDistNotice` PASS message.
   - All hunks read; findings above.
2. **ADR-030 note.**
   - `git show HEAD:docs/adr/ADR-030-conveyed-artifact-notice-set.md | tail -n 7 | sha256sum` gives 6bd72362ee4e5d6e2c68d1edb32a275f20d7dcebdad0798a090f3e0e25f4daa8.
   - `git show b4dc05e08c1e24ef7d6904596bb2332b87dcf75b:state/directives/2026-10-09-rulings-on-the-eight-forms.md | sed -n '65,71p' | sha256sum` gives the same value, and so does the pin in Amendment 1 (d).
   - `cmp` of the two byte streams: rc 0.
   - The leading line (`tail -n 8 | head -1`) is a lone `\n`.
   - Numstat for the ADR alone reads `8 0`.
   - Everything above the 8 appended lines is byte-identical to origin/main's ADR (`cmp`, rc 0).
   - b4dc05e0 is an ancestor of origin/main (rc 0).
3. **Mutations**, each followed by `git checkout -- <file>` (rc 0) and an empty `git status --porcelain` (rc 0):
   - **T1.** In `portedNotices.mjs`, `PORTED_FROM_TOKEN` `'Ported-From:'` → `'Ported-From;'`. Ran `node --test --test-name-pattern="an unregistered Ported-From marker fails, naming the path" renderer/bundle-viewer/scripts/portedNotices.test.mjs`: rc 1, pass 0, fail 1, AssertionError "expected: 1".
   - **T9.** `return [];` inserted as the first statement of `portedSectionFindings`. Ran `node --test --test-name-pattern="portedSectionFindings requires one file line per registered file and the end sentinel" renderer/bundle-viewer/scripts/portedNotices.test.mjs`: rc 1, fail 1, "actual: 0, expected: 1".
   - **T13.** Deleted `if (works.length === 0) return [];` at `notice.mjs` line 851, in `portedApplicationSectionLines`. Ran `node --test --test-name-pattern="an empty registry emits neither ported heading" renderer/bundle-viewer/scripts/notice.test.mjs`: rc 1, fail 1, "actual: false, expected: true".
   - Baseline: `node --test renderer/bundle-viewer/scripts/portedNotices.test.mjs` passes 11 of 11, rc 0. This worktree's `.git` is a file, so T8 passes where `.git` is a file.
4. **P1.** `node scripts/check-ported-notices.mjs` exits rc 0 and prints "check-ported-notices: PASS -- 2157 tracked file(s) searched for port markers; 0 registered work(s), 0 registered file(s)".
5. **Pins and governance at the head:**
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1,722 files.
   - `verify-quotes.mjs`: rc 0, PASS, 121 checked.
   - `verify-test-claims.mjs`: rc 0, PASS, 543 claims.
   - `verify.mjs`: rc 0, verify:plan PASS.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
   - I also recomputed by hand the diff's hash pins into the rulings file: line 55 is e39d049b… and line 58 is 90a08ffc…, both matching.
6. **Test wiring.**
   - `renderer/bundle-viewer/scripts/portedNotices.test.mjs` and `scripts/notice.test.mjs` run in workflow "Product CI — bundle viewer", job "typecheck · build · test", step "Type-check, build, and test" (`npm run verify`, then `npm test`, which is `node --test "scripts/**/*.test.mjs"`). The log of run 38131467288 shows T8, T10, T13, T16 and T17 passing, and "tests 100 / pass 100 / fail 0".
   - `frontends/shell/src/notices/portedNotices.test.ts` runs in workflow "Product CI — shell", job "typecheck · build · vitest · cargo test", step "Type-check, build, and test the frontend" (`npm run verify`, then `vitest run`, which includes `src/**/*.test.ts`). The log of run 38131467140 shows `src/notices/portedNotices.test.ts (1 test)` passing, 79 test files passed.
7. **CI.** `gh pr checks 208`, rc 0: 14 rows, all pass, none pending. All 10 runs have head_sha c81965765032402b739f25ed0f6d1e3de9e9f485 (checked through `gh api`).

   | Check | Result |
   |---|---|
   | cfg boundary (PORTABILITY R2) | pass ×2 |
   | every commit is signed off | pass |
   | no profile path in the range | pass |
   | ported-notices | pass ×2 |
   | tauri build (NSIS, build-only, no signing) | pass ×2 |
   | test · verify:plan · queue/site drift | pass ×2 |
   | typecheck · build · test | pass ×2 |
   | typecheck · build · vitest · cargo test | pass ×2 |

8. **Low profile.**
   - Commit messages: scanned all 8 for `https?://`, `owner/repo#N`, `#N` and `@name`. The only hits are the Co-Authored-By and Signed-off-by trailer e-mails.
   - Title and body: no outside issue or PR reference and no @mention.
   - Links: the only links are the two standard attribution lines (claude.com/claude-code and the claude.ai session URL). Neither refers to an outside project's issue or pull request.
   - No finding against `state/directives/2026-10-08-low-profile-on-github.md`.

Final `git status --porcelain` in `C:/dev/wt/pcnr`: empty (rc 0), with HEAD at c81965765032402b739f25ed0f6d1e3de9e9f485.
