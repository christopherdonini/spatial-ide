*Custodian's filing note (2026-10-11): ported-code-notice-route worker report 1, the worker-high run 09:09:43Z to 09:40:42Z by its transcript, on cut/ported-code-notice-route, head c81965765032402b739f25ed0f6d1e3de9e9f485, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4c55edfe7bb73e7d0c770f9e75a1a37f07f88353929de38ad72dc0385c974b27. Its first listed difference (renderer/bundle-viewer/notice.d.mts edited, a file the form does not name) is for the gates to rule on.*

---

REPORT — ported-code-notice-route (slot 2), worker on cut/ported-code-notice-route.
FINAL HEAD c8196576 (full: c81965765032402b739f25ed0f6d1e3de9e9f485), PUBLISHED (pushed 81d98ed9..c8196576). Final `git status --porcelain` is empty. No PR opened. I ran as Sonnet 5.5; no model override; no context handoff.

COMMITS (each signed off, with the trailer)
- 587a9411 docs: ADR-030 gains the human's appended note, appended by script
- b4d379f8 feat: registry (empty), reader and checks, T1-T9, T16, T17. It also carries notice.d.mts (see the differences list).
- 74f5d33e feat: notice() renders the fifth set, latent while the registry is empty (T10-T14)
- 7e66f862 feat: generateNotice prebuild check, checkDistNotice predicate, T15
- 94d3fa4d feat: scripts/check-ported-notices.mjs, ported-notices.yml, product-ci path filters
- 148231e3 docs: ported README, LICENSES/README.md section, CONTRIBUTING paragraph
- 34bed57d fix: T1's fixture carried an SPDX-AND-MIT line, so the SPDX branch also flagged it and the Ported-From mutation did not fail the test. I found this when the first T1 mutation run passed. The fixture now has only a layer SPDX id plus the Ported-From line.
- c8196576 docs: one comment word in ported-notices.yml reworded to avoid the word the form's §8 item 15 lists

ADR-030 NOTE
Appended by script: `{ printf '\n'; git show b4dc05e08c1e24ef7d6904596bb2332b87dcf75b:state/directives/2026-10-09-rulings-on-the-eight-forms.md | sed -n '65,71p'; } >> docs/adr/ADR-030-conveyed-artifact-notice-set.md`. Nothing was typed.
- `git diff --numstat 81d98ed9...HEAD -- docs/adr/ADR-030-...md` reads `8 0`.
- The first added line is empty (`git show HEAD:... | tail -n 8 | head -1` is a lone LF).
- `git show HEAD:docs/adr/ADR-030-conveyed-artifact-notice-set.md | tail -n 7 | sha256sum` is 6bd72362ee4e5d6e2c68d1edb32a275f20d7dcebdad0798a090f3e0e25f4daa8, which equals the pinned hash. I checked it at 587a9411 and again at the head. PASS.
- The source lines' own hash (sed -n 65,71p of b4dc05e0) is the same value.

MUTATIONS
All 17 were observed at 34bed57d, the head that held every test (c8196576 only changed a workflow comment). Each was applied, the named test run alone (pass 0, fail 1), the file reverted, and `git status --porcelain` was "" after each revert. T1-T14, T16, T17 ran under `node --test --test-name-pattern`; T15 under vitest. The `verify-mutation` tool was not used as an observation. The edit is the code text before -> after, in `renderer/bundle-viewer/portedNotices.mjs` (P) or `notice.mjs` (N).
- T1 `an unregistered Ported-From marker fails, naming the path`: P, `PORTED_FROM_TOKEN = 'Ported-From:'` -> `'Ported-From;'`. Failed: expected 1 finding.
- T2 `a non-layer SPDX header with no registry entry fails, naming the path`: P, the SPDX return in `isMarked` -> `return false;`. Failed: expected ['docs/wrong.js','src/b.rs'], got none.
- T3 `a registered path whose header lacks the port header fails`: P, `of registered)` -> `of [])`. Failed: expected true.
- T4 `a pinned licence text with one changed byte fails, naming the file`: P, `if (actual !== t.sha256)` -> `if (false)`. Failed: "Missing expected exception".
- T5 `a licence id outside the allowlist fails`: P, `if (!allowed.has(work.license_id))` -> `if (!true)`. Failed: "GPL-3.0-only: expected 1".
- T6 `a registered port with matching header and texts passes`: P, the expected SPDX line -> `AGPL-3.0-only AND <id>`. Failed: deepEqual to [].
- T7 `a missing or malformed adopted_by fails`: P, `findings.push(...adoptedByFindings(work, files));` removed. Failed: "undefined: expected 1".
- T8 `the tracked tree at HEAD yields no finding`: P, `LAYER_ID` -> `'AGPL-3.0-only'`. Failed: deepEqual to [].
- T9 `portedSectionFindings requires one file line per registered file and the end sentinel`: P, `return [];` first in the function. Failed: expected 1.
- T10 `a registered viewer port present in the metafile reaches the viewer notice with its full pinned text`: N, the `...portedViewerSectionLines(registry, metafile),` line removed. Failed: "the viewer subsection is present".
- T11 `a registered viewer port absent from the metafile is not in the viewer notice`: N, the metafile filter -> `files: work.files`. Failed: expected true.
- T12 `every registered port, kernel and shell paths included, reaches the application section after the DuckDB sentinel`: N, application works filtered to `renderer/bundle-viewer/` paths. Failed: kernel/src/ported_kernel.rs line not found.
- T13 `an empty registry emits neither ported heading`: N, the `if (works.length === 0) return [];` guard removed. Failed: heading present, expected true.
- T14 `the viewer range is identical between notice(m) and notice(m, undefined, extra) with a viewer port present`: N, subsection emitted only when `extra` is null. Failed: the two viewer ranges differ.
- T15 `reads the producer's own text: a kernel port yields no finding, and exactly one once its file line is deleted` (`frontends/shell/src/notices/portedNotices.test.ts`): N, the producer's file-line prefix `ported file` -> `ported  file`. Failed: "expected [ Array(1) ] to deeply equal []".
- T16 `outside a git checkout the registry side is checked and the not-searched line is the one note`: P, `ENOENT` branch returns `[]` instead of null. Failed: expected null.
- T17 `in a git checkout whose listing fails the prebuild check throws naming the root`: P, returns null when git exits non-zero. Failed: "Missing expected exception".

SUITES
Every hold was `shared -Project SpatialIDE` with its own call. Env was CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8, CARGO_TARGET_DIR=D:/wt-targets/cov. The script never returned 96-99, and no timing-sensitive failure appeared.
- Viewer `npm run verify` at 34bed57d, own hold, exit 0: typecheck and build clean, 100 tests, 0 fail.
- Shell `npm run verify` at 34bed57d, own hold, exit 0: 79 test files and 1185 tests passed, check:dist-notice PASS (it now reports "ported source files 0"), residency 76 passed, citation integrity 30 passed. It also passed at 148231e3 (same counts).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` at 34bed57d, own hold, exit 0: 457 tests, 0 fail. Also at 148231e3.
- Windows run of `node --test renderer/bundle-viewer/scripts/portedNotices.test.mjs` in this worktree, where `.git` is a file: 11 of 11 passed at 34bed57d, so T8 passes where `.git` is a file.
- At c8196576, each rc=0: verify-cites (1722 files), verify-quotes (121 checked, 30 baselined), verify-test-claims (543 claims), `verify` (verify:plan), `queue --check`, `site --check`. `cfg-boundary` and `node scripts/check-ported-notices.mjs` also pass (the latter: 2157 tracked files searched, 0 works).
- `verify-quotes.mjs --show-cites` listing on my three docs shows the two cites into the rulings file at line 58 and one at line 55, all [hash: PASS]. Run with explicit file arguments it also reports a "FAIL" for LICENSES/README.md:6, an old quote in text I did not touch. The full run with no arguments passes.

P2 (predicted equal)
Built twice each at the merge base 81d98ed9 (a temporary detached worktree, since removed) and at 34bed57d, same machine and lockfiles. Equal in every run.
- renderer/bundle-viewer/dist/NOTICE.txt sha256 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
- frontends/shell/src/generated/NOTICE.txt sha256 18c71526fcf566d5640f13b3b06783b67008c1ba6233ce64b32b4bc0a20ac7de
- P1 holds: the checker run with the head's code against the base tree at 81d98ed9 gave 2149 files and 0 findings.

§7 BUDGET
Command: `git diff --numstat 81d98ed9...HEAD` summed, form excluded (it is not in the diff). Result: 1271 insertions + 4 deletions = 1275 changed lines over 19 files. That is within Amendment 1 (j)'s 1,550 and 20, and within the brief's 1,400 and 20. Nothing trimmed, no class 8.

§8, ITEM BY ITEM (Amendment 1 versions where it amended them)
1. Ported or upstream code, or `works` non-empty: none. MANIFEST.json is `{"schema": 1, "works": []}`.
2. P2: recorded and equal.
3. Dependency or manifest/lockfile diff: none. No package*.json or Cargo.* in the diff.
4. Existing heading, regex, slice or DuckDB guard changed, or noticeByteIdentity edited: no, and the test is untouched. One existing line did change: the `check:dist-notice` PASS message gained ", ported source files N" before its closing "); ". The architect should confirm that this counts as outside "heading, regex, slice, guard".
5. Network access in the reader, generator or check: none. They use `node:fs`, `crypto`, `path`, and `child_process` (only `git ls-files`, no shell).
6. Allowlist: exactly the eight ids, case-sensitive, asserted in T5.
7. Header form: the §2.3 block, with the first SPDX id `CC-BY-4.0` under docs/.
8. ADR-030 byte check: both checks pass (above).
9. Tracked file carrying a port marker: none. T8 and the check script pass on the tree, and fixtures live under os.tmpdir().
10. Finding at the merge-base tree: 0.
11. OS-conditional code or backslash/drive assumption: none. Grep found no `win32`, `process.platform` or `cfg`; paths are compared as POSIX strings.
12. Text claiming the check detects an unmarked port: none. Every mention says it cannot.
13. File under engine/ or kernel/ in the diff: none.
14. "Not a git checkout" test: one `lstat` of `<repoRoot>/.git`. ENOENT gives null and runs nothing; any other error throws; otherwise `git -C <root> --git-dir=.git --work-tree=. ls-files -z` via spawnSync with no shell.
15. ported-notices.yml: `on: push:` and `pull_request:` with no filters; `permissions: contents: read` at workflow level; one job `ported-notices` (`name: ported-notices`, no matrix); `ubuntu-latest`. Steps are `actions/checkout@v4` with `persist-credentials: false`, `actions/setup-node@v4` with `node-version: "24"` and no cache, then `node scripts/check-ported-notices.mjs`. No install. I added `timeout-minutes: 5` (the cfg-boundary job has one); it is neither a step nor a permission.

DIFFERENCES FROM THE FORM, OR NEEDING A RULING (please look at the first one)
1. `renderer/bundle-viewer/notice.d.mts` is edited (+8 lines: `NoticeOptions` and the fourth parameter). The form does not name this file. §2.4 gives `notice()` its fourth parameter, the shell's TypeScript test (T15) cannot call it without the declaration, and the file's own header says it is hand-synced to notice.mjs. I took it to be §2.4's change and did not stop. It is a one-hunk change that rides in b4d379f8 (I staged it early by mistake and did not rewrite local history to move it). If you rule it out of scope, revert that hunk and T15 needs another route.
2. Budget: the brief said 1,400 lines and 20 files. Amendment 1 (j) sets 1,550 and 20, and the form wins. Both are met.
3. Path filters: the form says to add `renderer/bundle-viewer/portedNotices.mjs` to the viewer workflow's `push` and `pull_request` filters. I did, though `renderer/bundle-viewer/**` already matches it, so it is redundant. The shell workflow's filters got the .mjs, the .d.mts and `LICENSES/third-party/ported/**`; the viewer workflow's got the .mjs and `LICENSES/...`.
4. `.gitattributes` gained exactly one line, with no explanatory comment, because the form says one line. The method is explained in the ported README.
5. Docs landed as: the new ported/README.md (70 lines), one appended section in LICENSES/README.md, and an appended "Ported files" section at the end of CONTRIBUTING.md. All were appended at the end of the file, so no existing line number shifts. The root README.md is not touched, since §2.7 does not name it. The READMEs and CONTRIBUTING cite the human's OPEN-5 line, `state/directives/2026-10-09-rulings-on-the-eight-forms.md:58 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:90a08ffc...`, and mark their own wording as paraphrase. The wording constants in notice.mjs each carry a "LATENT (Amendment 1 (c))" comment.
6. The entry-shape strings (heading, file-line shape, end sentinel) are written separately in notice.mjs (producer) and portedNotices.mjs (consumer), as with the DuckDB sentinel. T15 is the test that keeps them in step.
7. `portedSectionFindings` checks that each registered file has exactly one file line, by path; it does not just compare counts. A deleted line, a duplicate or an extra each gives a finding.
8. Not done here, because they need CI: the §5 invalidators that observe CI logs (the NOTE line appearing in any CI build, and `git ls-files` being available in tauri-build and release builds), and the first green run of `ported-notices` on main. After merge, the custodian reads the check run's name and id for the human (Amendment 1 (g)).
9. No PLAN.yaml, state/ or other record files were edited. I kept `D:/wt-targets/cov` as the only target and ran no cargo build. `node_modules` exists in `renderer/bundle-viewer` and `frontends/shell` (gitignored).
