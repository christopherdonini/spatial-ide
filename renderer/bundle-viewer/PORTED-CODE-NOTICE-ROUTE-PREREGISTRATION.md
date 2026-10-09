# Preregistration — ported-code-notice-route: a notice route for code ported from outside projects (shell, viewer and kernel)

**Authority.** PLAN node `ported-code-notice-route` (`PLAN.yaml:4370-4386 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:1399d037662b53eac4ca454da4a7a2cd3919fd0c1604be7028c3de8280b708f4`). Proposed by the human in `state/directives/2026-10-08-reuse-round-1.md`, item 4 (`state/directives/2026-10-08-reuse-round-1.md:32-33 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:84111169dd51b1766baeb455e7163dcf606033f0f6a3df3d2328bbb070aec4ba`). Placed as slot 2's item e (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:26 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:2aff0c9790e5286d16d929c4c5afe0487ab3a5741a388817e8aab8efba1aa4ef`). Adopting any dependency, and any PORT, stays the human's typed word (`state/directives/2026-10-08-reuse-round-1-private-repository.md:34 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:85715e827fceac9b4ac8faf8bc0349afb26dbde094257d37b4583705df41e9a5`).

**Drafted by** the architect agent alone, on the custodian's brief of 2026-10-09, read at main 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d. There was no impact read: the piece edits no `engine/` or `kernel/` file.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line. Gating is full (`AUTONOMY.md:329-332 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:c8c9d75464f21096f3883ae53143cb2fd30dbaae17689b273473ceb9897e672a`), for three reasons:
- the security-posture category (ADR-009), `AUTONOMY.md:321-322 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:61906e9c90498d10e7b265806962434fde6ac701e9b3fdbdd542377ec624e962`;
- a property under test (ADR-030's notice set);
- size.

The piece ports nothing.

## §0. Disclosure

- **The reuse index (the standing step, `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:33-36 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:c8fdf6726f013c0396b45f15c77e6f7deadf1833c6e971121542225769866fdc`).** The custodian ran `node tools/reuse.mjs` in the read-only private clone of `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and reported this output in the drafting brief. It is evidence (a run's output), not Authority:
  ```
  notice:      No prior art recorded for "notice". Research it before planning an implementation.
  licence:     No prior art recorded for "licence". Research it before planning an implementation.
  attribution: No prior art recorded for "attribution". Research it before planning an implementation.
  port:        No prior art recorded for "port". Research it before planning an implementation.
  third-party: No prior art recorded for "third-party". Research it before planning an implementation.
  --licence-watch:
  shell-port-notice-route: generateNotice.mjs enumerates only build manifests and DuckDB's tree, so a ported MIT file under frontends/shell/src would be missing from the shipped NOTICE. Before any PORT: a notice route (hash-pinned texts plus an SPDX header), or a fresh write from the algorithm.
    evidence: notes/q-command-bar.md §4
  ```
  Each word search is a miss. Noted here; it does not block.
- **The finding this piece answers.** It is in that repository at that commit, path `notes/q-command-bar.md`, §4, line 161 (cited by repository, commit and path; nothing is copied). The finding is the licence watch's entry above. It names two routes: a fifth, hash-pinned notice set with an SPDX header, or a fresh write. The fresh write is outside this piece (OPEN-5).
- **The gap, confirmed in this tree.**
  - The packaged notice is built from four sets: three build manifests and DuckDB's pinned tree (`frontends/shell/scripts/generateNotice.mjs:12-15 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:2719093a35afb2b5b2bd6e77f1d304ab9353be8dad105dc5b43ce0ca4c263fa2`).
  - Every metafile input outside `node_modules/` is skipped (`renderer/bundle-viewer/notice.mjs:289-290 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:6e5eab0bdc347a84584426e84bce5bd097329b38e806ca88f270a9d214328ac4`).
  - The shell's Vite plugin keeps no first-party module at all (`frontends/shell/scripts/metafileKey.mjs:42-43 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:cc32bb015949150abe60cf8723839275c12534e3d960bd90f1fcd1b5fb492b59`).
  - So a ported file anywhere in the product's own source tree reaches no NOTICE. Build tools strip comments and compile Rust, so the file's header does not ship either.
- **SPDX convention today.** Every new source file carries the project's two-line header (`CONTRIBUTING.md:82-87 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:84e2cc3a03184e68ca8960b10d898a13cd2c125ff62c5a933471730c028bec57`). A search of the tree at this commit finds no `SPDX-License-Identifier` line with any id other than `AGPL-3.0-or-later`, except `docs/LICENSE` (`CC-BY-4.0`). `LICENSES/README.md` states that no source file carries an MIT, BSD-3-Clause or MPL-2.0 header (`LICENSES/README.md:155-158 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:b95371239d4f003c1af88c2de7ea53ad459876f84501d119b733888d5f03c2eb`). The first port will make that sentence false, and the port piece updates it.
- **Precedent followed.** The DuckDB amalgamation route: in-tree texts pinned by hash, a `MANIFEST.json`, guards that fail closed, and a section that states its own source (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:76 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:5c276b0dd210ed1742a629f93bc2255eea094da320b280e0d036f2a0f383f402`; `LICENSES/third-party/duckdb-1.5.5/README.md:81-86 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:d5334dc1800ddcfa066e2e703ecc81f5ca62943e61ef050cc12e3f5b646cd90b`).
- **ADR-030 reopens for this set** (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:82 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:69a3f3d239cdcf15a3dd199f30543ffca4a79ab52a66ce4d116812ed2f24e1da`). Its appended note is OPEN-4.
- **Fixture drive:** not applicable; nothing is measured.

## §1. What this preregistration may and may not claim

- **May claim:**
  - a ported file marked as §2.3 defines, and lacking its registry entry or pinned text, fails the repository check and the packaged build by name;
  - a registered port's attribution and full pinned licence text reach the packaged app's NOTICE (beside the executable, and in the Notices view);
  - a registered port compiled into the bundle viewer also reaches the viewer's own NOTICE (`bundle-viewer\NOTICE.txt` and every published bundle);
  - with an empty registry, every generated NOTICE is byte-identical to main's.
- **May not claim:**
  - That an unmarked copy is detected. A file pasted under the project's own AGPL header with no `Ported-From:` line cannot be told apart mechanically; review and the DCO's clause (b) (`DCO:18-24 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:2f643e5ea44fe313874eed5e579f98ab580024c2b843afc647b44564d6635688`) cover it.
  - That the pinned texts are the upstream's complete obligations. The porter pins what upstream ships at the pinned commit.
  - That the route is legally sufficient. That is counsel's question (ADR-009's caveat, `docs/adr/ADR-009-license-and-open-core-boundary.md:11-12 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:ce613092b839d07ba1dbfd8300be1baa3f547e608d76fa6fdbd17a1f0ac3a28e`).
  - Any performance number, any docs/08 row, any SKP or MCP change, or any change to the user-visible wording of the existing four sets.
- **ADRs:**
  - ADR-009 (layers unchanged);
  - ADR-017 §12 (deterministic viewer asset bytes; unchanged for an empty registry);
  - ADR-030 (reopened; its appended note is OPEN-4, drafted by the architect and accepted by the human).
  - No accepted ADR text is edited.

## §2. The change

**2.1 Registry (LICENSES).**
- New directory `LICENSES/third-party/ported/`, with `MANIFEST.json` and `README.md` at its top level. At merge, `MANIFEST.json` is `{"schema": 1, "works": []}`.
- One subdirectory per work, `LICENSES/third-party/ported/<work>/`, holds only that work's upstream licence and notice files, fetched once at pin time from the pinned commit.
- A work entry holds:
  - `work` (a directory-safe id);
  - `upstream_repository` (URL);
  - `upstream_commit` (40 hex characters);
  - `license_id`, with `license_id_basis` of `self-declared` or `read-from-body` (the ADR-030 rule: no SPDX id is attributed to an upstream that declared none);
  - `texts[]`, each with `file`, `upstream_path`, `bytes` and `sha256`;
  - `retrieved` (a date);
  - `adopted_by`: the human's typed word adopting this PORT, as either a tracked `state/directives/*.md` path or `round <n>, item <m>`;
  - `files[]`, each with `path` (repo-relative, forward slashes), `upstream_path` and `copyright[]` (the upstream copyright lines, exact).
- `.gitattributes` gains one line, `LICENSES/third-party/ported/*/* -text`, so pinned upstream bytes are never converted. Today's `NOTICES*` pattern does not match an Apache `NOTICE` file; see `.gitattributes` lines 68 to 70 at 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.
- The DuckDB resolver takes only `duckdb-<x.y.z>` directories (`frontends/shell/scripts/duckdbAmalgamationNotices.mjs:118 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:58552c989f3704d81c753bcb70f4ecca1cf0cbc089e6b21846e8a88527725bc6`), so a sibling `ported/` directory does not trip it.

**2.2 Reader and checks (`renderer/bundle-viewer/portedNotices.mjs`, new; types in `portedNotices.d.mts`).** The reader sits beside `notice.mjs` so the renderer gains no dependency on `frontends/` (the docs/02 direction that `notice.mjs` already keeps). It uses only Node's standard library and does no network access. Exports:
- `readPortedRegistry({ root })`: parses the manifest, re-hashes every pinned text against its bytes on disk (sha256, with the UTF-8 round-trip), and throws on any mismatch or schema fault.
- `checkPortedFiles({ repoRoot, files, registry, allowlist })`: returns findings, each naming the path and the missing item, in both directions:
  - (i) every file whose header window carries a `Ported-From:` line, or an SPDX id other than its layer id (§7), must be a registered `files[].path`;
  - (ii) every registered path must exist in `files`, and its header window must carry the expected header (§2.3);
  - (iii) every `license_id` must be on the allowlist;
  - (iv) every `adopted_by` must be well-formed. A directive path must be tracked; a `round, item` form is checked for form only, and the gate resolves it.
- `portedSectionFindings(text, registry)`: the artifact predicate `checkDistNotice.mjs` calls (§2.4).

**2.3 Header of a ported file.** The form is OPEN-2; this is the recommended one. In the first lines, in the file's comment syntax:
```
SPDX-License-Identifier: AGPL-3.0-or-later AND <license_id>
Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
<each upstream copyright line, exact>
Ported-From: <upstream_repository> @ <upstream_commit> <upstream_path>
```
The comment prefixes recognised are `//`, `#`, `/*`, `*` and `<!--`.

**2.4 Notice rendering (`renderer/bundle-viewer/notice.mjs`).**
- `notice()` gains a fourth parameter, `options = {}`, carrying `portedRoot`. It defaults to `LICENSES/third-party/ported`, resolved from the file's own directory, the same discipline as the AGPL text (`renderer/bundle-viewer/notice.mjs:145 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:7b9f15c62a4d748adf51d5739d1a42ec704584f194ea724b40b4b5df76e97458`). Both existing callers are unchanged (`renderer/bundle-viewer/build.mjs:42 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:e1b84642f8ad79f87ec6e986668c71469c4a9773a1bf362443dd891291b7fe5a`; `frontends/shell/scripts/generateNotice.mjs:154 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:019cf13c90d5ba8f19db6df1f4aac11ac351ad26f0e51aa0848ee8eac686eb0b`).
- **Viewer subsection.** Emitted right after the viewer's third-party package section, and only when non-empty. Its set is the registered files whose path, made relative to `renderer/bundle-viewer`, is a key of the viewer's esbuild metafile `inputs`. That set comes from the build manifest and is exact; it also catches a port under `renderer/style-ts/` that the viewer imports.
  - Both callers render it through the same code path, so the `THE VIEWER` range that `noticeByteIdentity.test.ts` holds identical (`frontends/shell/src/notices/noticeByteIdentity.test.ts:82-89 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:a1f3768c6b95cc8ac9fdea58e8bcfa0befed07314ef8ac6887a0704bc364340c`) covers it unchanged.
- **Application section.** Emitted only when `extra` is passed and the registry is non-empty. It goes after the DuckDB end sentinel (`renderer/bundle-viewer/notice.mjs:740 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:f7fda1e9a5b1e6dcf84ff852d03f81ccd3f201947dcdb23c72c84688365f5475`) and closes with its own end sentinel.
  - Its set is every registered file, whether shell, viewer, kernel, engine, renderer, protocol, scripts or tests. It deliberately over-includes ported files that are not compiled in, and its intro says so. This is the same stance the Rust section takes for proc-macros (`renderer/bundle-viewer/notice.mjs:552-556 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:3c29c0abb09d6ca9fc098dd8ed6014c2bbe38ca1473043c16eadd7afc767e402`): listing a work not carried is harmless; omitting one carried is the failure.
  - The intro states that the set is enumerated from the in-tree registry, not from a build tool (ADR-030's rule).
- **Placement** leaves every existing slice untouched: the viewer, frontend, Rust and amalgamation counts, and `checkDistNotice.mjs`'s body bound at the DuckDB sentinel (`frontends/shell/scripts/checkDistNotice.mjs:342-352 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:8c0b2f9cced49f5bcee0521d4f47b1a166007a44eb02c64487be880852c9034e`).
- **Entry shapes** (§7) match neither `ENTRY_LINE` nor `AMALGAMATION_ENTRY_LINE` (`frontends/shell/scripts/checkDistNotice.mjs:172 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:b914c8fc9ebd037a6b5e9260253e176c33f8821f360da4d1e72a7c4718c38645`; `frontends/shell/scripts/checkDistNotice.mjs:178 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:1b4b7d5b46713c1687484cef601b76ba37e304cc8a50370681b59e2dbd16ec53`).
- **Per work:** a work line, one file line per ported file, the file's copyright lines, then each pinned text in full, delimited by `--- <work>/<file> (upstream <upstream_path>) ---`. Sorted by work id, then by path; no timestamp.
- **Wording** of both headings and intros is OPEN-3; the draft wording is the worker's, marked latent.

**2.5 Shell (`frontends/shell/scripts/`).**
- `generateNotice.mjs` runs `readPortedRegistry`, then `checkPortedFiles` over `git -C <repoRoot> ls-files -z` with the allowlist, before calling `notice()`. Any finding or a failed git listing becomes the existing named `generateNotice: FAIL -- …` line and exit 1. Since this runs in `prebuild` (`frontends/shell/package.json:12 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:c69fb205aae327b13eff714ba2b8d4e4bc3208ebf40b63434aada69970e69fb6`), no packaged build can carry a marked port without its notice.
- `checkDistNotice.mjs` calls `portedSectionFindings`. In the built `dist/` text, the application section's file-line count must equal the registry's file count and its end sentinel must be present; with an empty registry, the heading must be absent.
- **Kernel and Rust ports** reach users through the application section. The packaged installer is the only conveyed artifact carrying Rust code: its resources are the generated NOTICE and the viewer dist (`frontends/shell/src-tauri/tauri.conf.json:40-43 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:9c4c3eb0566b993b3cc6563848685a5c10fe7b30f62398a22c736fee9f66b704`), and a published bundle carries only the viewer. A separately conveyed kernel binary would be a new channel under ADR-030's reopen condition (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:60-64 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:4e28971641b49cd8f0d2e66bc5ced871ad06b36d2367b59bf6cad93c63932717`).

**2.6 Repository check and CI.**
- `scripts/check-ported-notices.mjs` (new) is a thin entry point: `git ls-files -z` → `readPortedRegistry` → `checkPortedFiles`. It prints one PASS line or the findings, and exits 1 on any finding.
- New workflow `.github/workflows/ported-notices.yml`: `ubuntu-latest`, Node 24, `contents: read`, no path filter (a port can land in any file), runs the entry point. It is modelled on governance-ci's cfg-boundary job, `.github/workflows/governance-ci.yml` lines 171 to 185 at 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.
- `product-ci-shell.yml` and `product-ci-viewer.yml` add `renderer/bundle-viewer/portedNotices.mjs`, its `.d.mts` (shell only) and `LICENSES/third-party/ported/**` to both `push` and `pull_request` path filters. For the shell's existing filters, see `.github/workflows/product-ci-shell.yml` lines 116 to 154 at 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.

**2.7 Documentation, in the same PR.**
- `LICENSES/third-party/ported/README.md`: the method, mirroring the DuckDB README's order (pin the commit, fetch the texts once, hash and blob-SHA verification where available, the eol rule, what the build verifies and what is only recorded).
- `LICENSES/README.md`: one appended section naming the directory as notice-generation input, and stating that the layers table still holds under OPEN-2 (a).
- `CONTRIBUTING.md`: one paragraph on the ported-file header and the rule that a PORT is the human's typed word.

**2.8 Portability (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:33-65 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff`).** This is not an OS-dependent feature: it is pure Node, with paths taken from `git ls-files` (forward slashes on every platform) and compared as POSIX strings.
- R1 and R4: no backslash, drive letter or case rule, and no `cfg`.
- R3: the same behaviour on Windows, macOS and Linux. Tests run on ubuntu (viewer CI, the new workflow) and Windows (shell CI); macOS has no runner, as today.
- R5: no level claimed beyond those runs.
- R6: no skipped test.

## §3. Fixtures — pre-declared outcomes

- **F1. The tracked tree at the branch's merge base:** zero marked files, zero registry entries, so the check passes.
- **F2–F9.** Temporary fixture trees built under `os.tmpdir()` by the tests themselves. No tracked file carries a port marker (block-on-sight 9). Each has an outcome pre-declared in §4.

## §4. Tests, one recorded mutation each

Each mutation is observed by applying it, running the named test, recording the failure by name with the commit, and reverting (round 25, item 2 (c)).

`renderer/bundle-viewer/scripts/portedNotices.test.mjs` (new):

| # | Test | Mutation that fails it |
|---|---|---|
| T1 | `an unregistered Ported-From marker fails, naming the path` | the marker token becomes `Ported-From;` |
| T2 | `a non-layer SPDX header with no registry entry fails, naming the path` | the SPDX branch of the marker predicate returns false |
| T3 | `a registered path whose header lacks the port header fails` | delete the registry→file loop |
| T4 | `a pinned licence text with one changed byte fails, naming the file` | skip the sha256 comparison |
| T5 | `a licence id outside the allowlist fails` | the allowlist test returns true |
| T6 | `a registered port with matching header and texts passes` (positive control) | expected SPDX line built as `AGPL-3.0-only AND <id>` |
| T7 | `a missing or malformed adopted_by fails` | skip the adopted_by check |
| T8 | `the tracked tree at HEAD yields no finding` (real `git ls-files`) | the layer id constant becomes `AGPL-3.0-only` |
| T9 | `portedSectionFindings requires one file line per registered file and the end sentinel` | the function returns `[]` |

`renderer/bundle-viewer/scripts/notice.test.mjs` (extended):

| # | Test | Mutation that fails it |
|---|---|---|
| T10 | `a registered viewer port present in the metafile reaches the viewer notice with its full pinned text` | skip pushing the viewer subsection |
| T11 | `a registered viewer port absent from the metafile is not in the viewer notice` | drop the metafile intersection |
| T12 | `every registered port, kernel and shell paths included, reaches the application section after the DuckDB sentinel` | filter the application section to viewer entries |
| T13 | `an empty registry emits neither ported heading` | emit the application heading unconditionally |
| T14 | `the viewer range is identical between notice(m) and notice(m, undefined, extra) with a viewer port present` | emit the viewer subsection only when `extra` is null |

`frontends/shell/src/notices/portedNotices.test.ts` (new):

| # | Test | Mutation that fails it |
|---|---|---|
| T15 | The end-to-end test from the real shape (the seam rule). It calls the real `notice()` with the real `renderer/bundle-viewer/dist-metafile.json`, an `extra` built as `generateNotice.mjs` builds it, and a fixture registry holding one `kernel/src/` port. It asserts that the real `portedSectionFindings` reports nothing, and exactly one finding after that port's file line is deleted from the text. | change the producer's file-line prefix (§7) |

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- P1 F1 passes.
- P2 The sha256 of `renderer/bundle-viewer/dist/NOTICE.txt` and of `frontends/shell/src/generated/NOTICE.txt` is equal at the merge base and at the head, built on the same machine and lockfiles. The worker records both pairs.
- P3 Each of T1 to T15 fails under its mutation.

**Declared unchanged:**
- the four existing sections and their headings, regexes, slices and the three DuckDB guards;
- `noticeByteIdentity.test.ts` (not edited);
- ADR-009's layers table;
- ADR-017's bundle format;
- `DEPENDENCY-LICENSES.md`;
- every SKP or MCP surface;
- every `engine/` and `kernel/` file;
- every package manifest and lockfile.

**Invalidators (stop and report):**
- P2 fails;
- an existing cardinality slice counts a new line;
- `git ls-files` is unavailable in any CI build path (`tauri-build.yml`, release).

**Falsification:**
- a marked, unregistered port builds a NOTICE without failing;
- a registered port's text is absent from a NOTICE that the §2.4 rules say must carry it.

## §6. Instruments

All assertions; no measurement and no docs/08 row. P2 is a byte-equality record, not a timing.

## §7. Declared values

- **Header window:** the first 12 lines of a file.
- **Scanned extensions:** `.rs .ts .tsx .mts .cts .js .mjs .cjs .css .html .py .sh .ps1`. `LICENSES/**` is excluded.
- **Layer ids:** `CC-BY-4.0` under `docs/`; `AGPL-3.0-or-later` everywhere else (ADR-009 items 1 and 3).
- **`ALLOWED_UPSTREAM_LICENSE_IDS`:** the set the human rules in OPEN-1, and empty until then, so every port fails closed. Tests inject their own.
- **Registry path:** `LICENSES/third-party/ported/MANIFEST.json`, `schema: 1`.
- **Entry shapes** (wording per OPEN-3):
  - work line `^<work>: <upstream_repository> @ <40-hex> — <license_id>$`;
  - file line `^  ported file <path> \(from <upstream_path>\)$`;
  - end sentinel `END OF THE PORTED SOURCE FILES SECTION`.
- **Budget:** at most 1,400 changed lines (insertions plus deletions) across at most 20 files, counted by `git diff --numstat <merge-base>...HEAD` summed, excluding this form. An overrun is class 8.

## §8. Block-on-sight

1. Any ported or upstream code in the diff, or `works` not empty at merge.
2. P2 unrecorded or unequal.
3. Any new dependency, or any package manifest or lockfile diff.
4. An existing heading, regex, slice or DuckDB guard changed, or `noticeByteIdentity.test.ts` edited.
5. Any network access in the reader, the generator or the check.
6. An allowlist value that the human has not ruled.
7. A header form differing from the OPEN-2 ruling, if ruled before merge.
8. Merge before the human accepts the ADR-030 appended note (OPEN-4).
9. A tracked file carrying a port marker.
10. Any finding at the merge-base tree.
11. OS-conditional code, or a backslash or drive-letter assumption (R4).
12. Any text claiming the check detects an unmarked port.
13. A file under `engine/` or `kernel/` in the diff.

## §9. Gates

- **Architect:** ADR-009, ADR-017 §12, ADR-030 (and its note), docs/01, R1 to R6, and §8 checked one by one.
- **Reviewer:** the full diff.
- **Suites, green first:**
  - viewer `npm run verify` (ubuntu);
  - shell `npm run verify` (Windows);
  - `ported-notices.yml`;
  - governance-ci (`verify:cites`, `verify:quotes`, `verify:test-claims`).
- **Mutation records:** per §4.
- Under `state/directives/2026-10-05-product-first-direction.md:15 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`, a gate fails only on Correctness or Evidence.
- **Operator:** no row. Nothing user-visible changes with an empty registry. The first PORT piece carries the Notices-view sight row and the OPEN-3 wording.
- **Heavy runs** (both NOTICE builds, twice each) follow `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`, carried in the worker brief.

## §10. Amendments — opens empty, append-only

*(Classes 1–9, `docs/PREREGISTRATION-TEMPLATE.md`.)*
