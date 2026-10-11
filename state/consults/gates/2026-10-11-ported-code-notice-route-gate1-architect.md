# PR #208 gate 1 — architect
Reviewed: cut/ported-code-notice-route @ c81965765032402b739f25ed0f6d1e3de9e9f485

**Verdict: FAIL (Correctness: C-1, C-2 and C-3. Evidence: PASS. Documentation: three must-fix findings.)**

All four fixes are small text or one-call changes. A re-gate needs only a semantic applicability check limited to these items. Every other verdict below carries forward.

## Correctness

**C-1. The docs claim checks that the code does not run. Under the 2026-10-05 product-first direction, §2, this is never documentation-only.**
- `LICENSES/third-party/ported/README.md:46` introduces the table as verified "on every NOTICE generation (`readPortedRegistry`) and every `npm run check:dist-notice`". Rows `:52`-`:54` (allowlist, header, `adopted_by`) are not verified at either place:
  - `check:dist-notice` calls only `readPortedRegistry` and `portedSectionFindings` (`frontends/shell/scripts/checkDistNotice.mjs:460-462`);
  - the viewer's own NOTICE generation (`renderer/bundle-viewer/build.mjs:42` → `notice.mjs:111`) only reads the registry;
  - `checkPortedFiles` runs only in `generateNotice.mjs:114` (through `portedPrebuildCheck`) and `scripts/check-ported-notices.mjs:36`.
  - Fix: limit `:46` to rows `:50`-`:51`, and give rows `:52`-`:54` their own lead-in naming the repository check and the packaged build's prebuild check.
- `CONTRIBUTING.md:172` says the packaged build fails "when a marked file has no entry" and leaves out "from a git checkout". Amendment 1 (f) §1 added that qualifier and forbids the claim for a build outside a checkout, and `portedNotices.mjs:312-316` does not search there. Fix: add the qualifier.

**C-2. The caller rule (round 4 and round 5, item 4): `notice()`'s `options.portedRoot` has no product caller.**
- Every caller that passes it is a test: `renderer/bundle-viewer/scripts/notice.test.mjs:216`, `:236`, `:248`, `:260`, `:269`, `:277`, `:295-296` and `frontends/shell/src/notices/portedNotices.test.ts:88`.
- Both product callers take the default (`build.mjs:42`; `generateNotice.mjs:185`).
- The same holds for `portedPrebuildCheck`'s `root` option (`portedNotices.mjs:312`): no caller passes it at all.
- The option acts: it chooses which registry is read. So the instrument-accessor exemption does not apply, and neither does the round-8 producer exemption.
- The defect is in the form's own §2.4 design. I drafted that form, and I carry the defect here.
- Fix: in `generateNotice.mjs`, bind one `portedRoot = join(repoRoot, 'LICENSES', 'third-party', 'ported')` and pass it to both `portedPrebuildCheck({ …, root: portedRoot })` and `notice(viewerMetafile, undefined, extra, { portedRoot })`.
  - The prebuild check and the rendered notice then read one directory by construction. Today they agree only because two separately written paths resolve alike (`portedNotices.mjs:312`, `notice.mjs:114`).
  - P2 is unaffected: it is the same directory.
  - This changes one of the two calls that §2.4 bullet 1 says stay unchanged. Record it as Amendment 2, whose first line says it follows an outcome, before the code commit.

**C-3. A wrong claim about which checks see the fifth set, and a latent counting exposure.**
- `checkDistNotice.mjs:457-458` says the fifth set sits after the DuckDB sentinel, outside every slice. That holds only for the application section.
- The viewer subsection is emitted at `notice.mjs:245`, before the frontend heading, so it falls inside the viewer slice (`checkDistNotice.mjs:362`). That slice is counted with `ENTRY_LINE` (`:176`, `:429`).
- The work and file lines (`notice.mjs:815`, `:817`) do not match `ENTRY_LINE`. A pinned licence text line shaped like two words, then " — " (`notice.mjs:822`), would be counted, and a viewer port would then trip the §5 invalidator.
- This is latent while `works` is empty (`LICENSES/third-party/ported/MANIFEST.json:1`).
- Must-fix now: correct the comment at `:457-459`.
- Carried to the first viewer-port piece's gate: an `ENTRY_LINE` exclusion for the subsection, or a test showing the viewer count unchanged with that port's real text.

**Checked and holding** (the §9 Architect list):
- **ADR-009:** the layers table is unchanged (`LICENSES/README.md:289`). The SPDX form follows OPEN-2 (a) (`portedNotices.mjs:184-191`).
- **ADR-017 §12:** the registry root is resolved from the file's own location (`notice.mjs:112-114`). Output is sorted by code unit with no timestamp (`:810`-`:828`). With an empty registry the output is the same (`notice.test.mjs:277`; P2).
- **ADR-030:** the appended note at `docs/adr/ADR-030-conveyed-artifact-notice-set.md:85-92` matches directive lines 65 to 71 by reading, and `:85` is empty. The byte check of item (d) is the reviewer's to recompute, because I have no shell. The code delivers the note's Decision and Consequences, apart from C-1's wording.
- **docs/01:** nothing touches the canvas, the data plane, CRS or undo.
- **R1 to R6:**
  - no `process.platform`, `win32`, backslash or `cfg` in the new modules;
  - metafile paths are compared through `posix.relative` (`notice.mjs:839`), and headers are split on `\r?\n` (`portedNotices.mjs:152`);
  - runs exist on ubuntu and on Windows, including T8 with `.git` as a file (worker report `:50`);
  - no skipped test.
- **§8, item by item:**
  - 1: `works` is empty, and no ported code is in the diff.
  - 2: P2 is recorded and equal (report `:55-57`).
  - 3: no manifest or lockfile is among the 19 files.
  - 4: holds; see ruling 2.
  - 5: imports are limited to `crypto`, `fs`, `path` and a `spawnSync` of local git (`portedNotices.mjs:18-21`, `:296-300`).
  - 6: the allowlist is exactly the eight ids (`:25-34`), asserted in `portedNotices.test.mjs:164`.
  - 7: the header follows §2.3.
  - 8: the reviewer's byte check (see ADR-030 above).
  - 9: the `Ported-From:` strings in the tests sit outside the 12-line window, and T8 passes on the tree.
  - 10: zero findings at the merge base (report `:58`).
  - 11: holds (see R1 to R6).
  - 12: every mention denies detecting an unmarked copy (README `:62`, `CONTRIBUTING.md:172`, `portedNotices.mjs:15-16`).
  - 13: no `engine/` or `kernel/` file.
  - 14: one `lstat` of `<root>/.git` with `--git-dir=.git --work-tree=.` (`:289-305`).
  - 15: see ruling 4.
- **Seam, end to end from the real shape:**
  - T15 (`portedNotices.test.ts:65-101`) feeds the real `notice()` output, built with the real metafiles, crates and DuckDB set, into the real `portedSectionFindings`.
  - T8 runs real git on the real tree (`portedNotices.test.mjs:208-214`).
- **Low profile:** no tracked text in the diff links an outside issue or pull request or @mentions anyone. The only outside hosts are `example.org` test fixtures. The only project named is DuckDB, an existing dependency the tree already names, and the directive's `:15-16` allows naming it.

## Evidence

**PASS.**
- All 17 mutations are recorded at 34bed57d with their failure text (report `:26-43`). The `verify-mutation` tool is not called an observation (`:26`).
- P1 and P2 are recorded.
- Suites:
  - the viewer, the shell and the scripts suites ran green at 34bed57d;
  - c8196576 changes only a comment.
  - The PR body (`:36`) says CI passed at c8196576. I cannot see CI: the custodian reads the check runs before the merge.
- The invalidators that read CI logs, and `git ls-files` in `tauri-build`/release, are disclosed as not observable before the merge (body `:42-44`).
- Recomputations are the reviewer's: the budget of 1275 lines over 19 files, within Amendment 1 (j)'s 1,550 and 20, and the ADR-030 hashes.

## Documentation (must-fix before the merge; no re-gate)

- **D-1.** Amendment 1 (k) and (c) require the PR body to name the human's sight of the latent wording in the first port piece. Body `:13` says only that the wording is latent. The body also omits item (i): the AUTONOMY finding stays with the weekly window.
- **D-2.** Body `:20` says each of the three docs states that the check cannot detect an unmarked port. `LICENSES/README.md:289` does not. Fix the body or the section.
- **D-3.** The closing record names `renderer/bundle-viewer/notice.d.mts` as §2.4's declaration file (ruling 1).

## The four rulings

1. **`notice.d.mts` (+8 lines) is within §2.4.**
   - It is the hand-synced type declaration of `notice.mjs` (`notice.d.mts:4-10`). The shell's `tsc --noEmit` needs it to type the fourth parameter that §2.4 adds (`:91-103`).
   - The shell workflow already watches it as `notice.mjs`'s other half (`product-ci-shell.yml:77-85`, `:125`, `:148`).
   - It adds no behaviour or scope, so it is not class 9, and it is inside the 20-file budget.
   - Only D-3 applies. The parameter it types is C-2's subject; that is a separate matter.
2. **The `check:dist-notice` PASS clause is outside §8 item 4.**
   - Item 4 covers headings, regexes, slices and DuckDB guards. A log line is none of these.
   - The added clause (`checkDistNotice.mjs:480`) reports the registry count that §2.5 bullet 2's predicate has just checked (`:460-462`). It does not touch `:176`, `:182`, `:346` or `:362-371`.
3. **The redundant viewer path filter is no defect.**
   - `product-ci-viewer.yml:56`/`:64` are already covered by `:53`/`:61`. §2.6 bullet 3 orders the entry literally, and GitHub combines path patterns with OR, so it is harmless.
   - Keep it. Removing it would depart from the form.
4. **`timeout-minutes: 5` is allowed.**
   - §8 item 15 forbids another step, an install, a `cache:`, a wider permission and a path or branch filter. A job timeout is none of these.
   - Amendment 1 (h) models the workflow on cfg-boundary at `governance-ci.yml` lines 171 to 185, and that job carries the same line (`governance-ci.yml:174`).

## Files read

- `C:/dev/spatial-ide/renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-10-11-ported-code-notice-route-worker-report-1.md`
- `<the custodian's scratchpad>/pr-pcnr-body.md` (the PR body's source, as published on PR #208 at c8196576)
- `C:/dev/spatial-ide/state/directives/2026-10-09-rulings-on-the-eight-forms.md` (lines 50-74)
- `C:/dev/spatial-ide/state/directives/2026-10-08-low-profile-on-github.md`
- In `C:/dev/wt/pcnr/`:
  - `renderer/bundle-viewer/portedNotices.mjs`, `portedNotices.d.mts`, `notice.mjs` (lines 1-20, 90-299, 740-869), `notice.d.mts`, `build.mjs` (searched)
  - `renderer/bundle-viewer/scripts/portedNotices.test.mjs`, `scripts/notice.test.mjs` (lines 160-302)
  - `frontends/shell/src/notices/portedNotices.test.ts`
  - `frontends/shell/scripts/generateNotice.mjs` (lines 60-193), `checkDistNotice.mjs` (lines 70-99, 330-489)
  - `scripts/check-ported-notices.mjs`
  - `.github/workflows/ported-notices.yml`, `product-ci-viewer.yml` and `product-ci-shell.yml` (both searched), `governance-ci.yml` (lines 115-186)
  - `.gitattributes` (searched)
  - `LICENSES/third-party/ported/MANIFEST.json`, `LICENSES/third-party/ported/README.md`, `LICENSES/README.md` (lines 280-290), `LICENSES/third-party/duckdb-1.5.5/README.md` (searched)
  - `CONTRIBUTING.md` (lines 155-173)
  - `docs/adr/ADR-030-conveyed-artifact-notice-set.md` (lines 75-92)
  - `AUTONOMY.md` (lines 377-392)
  - `state/directives/2026-10-05-product-first-direction.md`
