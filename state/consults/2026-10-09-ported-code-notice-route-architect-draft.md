*Custodian's filing note (2026-10-09): the architect's draft of `ported-code-notice-route`'s preregistration, on the custodian's brief at main 316a4476, drafted alone (no engine or kernel file). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 3e55b69a61c28483dda13d468a07ceb4af8e0aa7ad5793f63c9f6c0c30c3346c. Write audit PASS: zero write calls (Read 28, Grep 28, Glob 7, SubagentHandback 1). Run window from the transcript: 2026-10-09T07:10:30Z to 07:21:11Z. The form as committed, `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md` (the path the draft's part 1 names), is part 2's block with its 33 pins computed at 316a4476, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 ef31595593a8d4432a2a1130be241813e759cbbaeafc97c091f438ceda1d3bbb). The seven reuse-index lines in its §0 match a fresh run at 89bbac37 byte for byte; the labels before them and their alignment are the architect's layout.*

---

Reviewed: main @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d

**Verdict: pass with notes.** This is a draft, not a gate. I found no Correctness or Evidence block in drafting. I also found no reason the piece must touch any `engine/` or `kernel/` file: the route lives in `renderer/bundle-viewer/`, `frontends/shell/scripts/`, `scripts/`, `LICENSES/` and CI, so no impact read is needed. Kernel and other Rust ports are covered through the packaged app's NOTICE, because no separate kernel artifact ships (see §2.5 of the draft).

## 1. Which form, and why

**Full form, with both gates (architect and reviewer, both to a PASS).** It is not the five-line form. By round 25, item 2 (e), the full form applies from dispatch. Four reasons, any one of which is enough:
- **Security posture.** `AUTONOMY.md` §21a puts anything ADR-009 governs (the licence and open-core boundary) under full gating (`AUTONOMY.md:321-322`). This piece is licence policy for outside code entering the AGPL core.
- **A stated guarantee.** ADR-030's notice set is a property under test today (`noticeByteIdentity.test.ts`, `checkDistNotice.mjs`), and this piece adds a fifth set to it.
- **An ADR.** ADR-030's own reopen clause covers this set: the clause is at `docs/adr/ADR-030-conveyed-artifact-notice-set.md:82`, and the set is any third-party work a conveyed artifact carries that no build manifest reports. A ported file is exactly that, so the piece needs an appended ADR-030 note. ADR amendments are the human's (`AI_DEVELOPMENT.md:451-454`).
- **Size.** About 1,200 changed lines across 18 files, well past §21c's limit.

**Where the form lives:** `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md`. `notice.mjs` is the one source of every notice and the new reader sits beside it, and governance-ci's `**/*PREREGISTRATION*.md` filter picks the file up.

**What is the human's** (section 3 below, all red lines except OPEN-6):
- which upstream licences a port may carry;
- the header and licence expression a ported file carries;
- the wording of the new NOTICE sections that users will see;
- the ADR-030 appended note;
- what counts as a port and what counts as a fresh write;
- whether the new check becomes a required check.

**Three notes for you (none blocks):**
- **ADR-021's label.** Your brief calls ADR-021 the bundling / no-runtime-fetch ADR, which is the label `AUTONOMY.md:322` gives it. The ADR itself is the row filter on `viewport_query`; the no-runtime-fetch property is one of its consequences (`docs/adr/ADR-021-row-filter-on-viewport-query.md:123-134`). This piece fetches nothing, so nothing changes. The loose label in AUTONOMY is a documentation finding.
- **The governance freeze.** The node sits in the governance lane. Its authority is the human's explicit placement on 2026-10-09 (item 3e). I did not settle whether the 2026-10-05 freeze still holds; the placement is the human's own act.
- **Seam rule.** The draft names one end-to-end test from the real shape (T15), across the notice.mjs → checkDistNotice seam. Every new export has a product caller.

## 2. The draft

````markdown
# Preregistration — ported-code-notice-route: a notice route for code ported from outside projects (shell, viewer and kernel)

**Authority.** PLAN node `ported-code-notice-route` (`PLAN.yaml:4370-4386 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). Proposed by the human in `state/directives/2026-10-08-reuse-round-1.md`, item 4 (`state/directives/2026-10-08-reuse-round-1.md:32-33 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). Placed as slot 2's item e (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:26 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). Adopting any dependency, and any PORT, stays the human's typed word (`state/directives/2026-10-08-reuse-round-1-private-repository.md:34 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).

**Drafted by** the architect agent alone, on the custodian's brief of 2026-10-09, read at main 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d. There was no impact read: the piece edits no `engine/` or `kernel/` file.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line. Gating is full (`AUTONOMY.md:329-332 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`), for three reasons:
- the security-posture category (ADR-009), `AUTONOMY.md:321-322 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`;
- a property under test (ADR-030's notice set);
- size.

The piece ports nothing.

## §0. Disclosure

- **The reuse index (the standing step, `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:33-36 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).** The custodian ran `node tools/reuse.mjs` in the read-only private clone of `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and reported this output in the drafting brief. It is evidence (a run's output), not Authority:
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
  - The packaged notice is built from four sets: three build manifests and DuckDB's pinned tree (`frontends/shell/scripts/generateNotice.mjs:12-15 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
  - Every metafile input outside `node_modules/` is skipped (`renderer/bundle-viewer/notice.mjs:289-290 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
  - The shell's Vite plugin keeps no first-party module at all (`frontends/shell/scripts/metafileKey.mjs:42-43 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
  - So a ported file anywhere in the product's own source tree reaches no NOTICE. Build tools strip comments and compile Rust, so the file's header does not ship either.
- **SPDX convention today.** Every new source file carries the project's two-line header (`CONTRIBUTING.md:82-87 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). A search of the tree at this commit finds no `SPDX-License-Identifier` line with any id other than `AGPL-3.0-or-later`, except `docs/LICENSE` (`CC-BY-4.0`). `LICENSES/README.md` states that no source file carries an MIT, BSD-3-Clause or MPL-2.0 header (`LICENSES/README.md:155-158 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). The first port will make that sentence false, and the port piece updates it.
- **Precedent followed.** The DuckDB amalgamation route: in-tree texts pinned by hash, a `MANIFEST.json`, guards that fail closed, and a section that states its own source (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:76 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`; `LICENSES/third-party/duckdb-1.5.5/README.md:81-86 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
- **ADR-030 reopens for this set** (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:82 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). Its appended note is OPEN-4.
- **Fixture drive:** not applicable; nothing is measured.

## §1. What this preregistration may and may not claim

- **May claim:**
  - a ported file marked as §2.3 defines, and lacking its registry entry or pinned text, fails the repository check and the packaged build by name;
  - a registered port's attribution and full pinned licence text reach the packaged app's NOTICE (beside the executable, and in the Notices view);
  - a registered port compiled into the bundle viewer also reaches the viewer's own NOTICE (`bundle-viewer\NOTICE.txt` and every published bundle);
  - with an empty registry, every generated NOTICE is byte-identical to main's.
- **May not claim:**
  - That an unmarked copy is detected. A file pasted under the project's own AGPL header with no `Ported-From:` line cannot be told apart mechanically; review and the DCO's clause (b) (`DCO:18-24 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`) cover it.
  - That the pinned texts are the upstream's complete obligations. The porter pins what upstream ships at the pinned commit.
  - That the route is legally sufficient. That is counsel's question (ADR-009's caveat, `docs/adr/ADR-009-license-and-open-core-boundary.md:11-12 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
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
- The DuckDB resolver takes only `duckdb-<x.y.z>` directories (`frontends/shell/scripts/duckdbAmalgamationNotices.mjs:118 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`), so a sibling `ported/` directory does not trip it.

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
- `notice()` gains a fourth parameter, `options = {}`, carrying `portedRoot`. It defaults to `LICENSES/third-party/ported`, resolved from the file's own directory, the same discipline as the AGPL text (`renderer/bundle-viewer/notice.mjs:145 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`). Both existing callers are unchanged (`renderer/bundle-viewer/build.mjs:42 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`; `frontends/shell/scripts/generateNotice.mjs:154 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
- **Viewer subsection.** Emitted right after the viewer's third-party package section, and only when non-empty. Its set is the registered files whose path, made relative to `renderer/bundle-viewer`, is a key of the viewer's esbuild metafile `inputs`. That set comes from the build manifest and is exact; it also catches a port under `renderer/style-ts/` that the viewer imports.
  - Both callers render it through the same code path, so the `THE VIEWER` range that `noticeByteIdentity.test.ts` holds identical (`frontends/shell/src/notices/noticeByteIdentity.test.ts:82-89 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`) covers it unchanged.
- **Application section.** Emitted only when `extra` is passed and the registry is non-empty. It goes after the DuckDB end sentinel (`renderer/bundle-viewer/notice.mjs:740 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`) and closes with its own end sentinel.
  - Its set is every registered file, whether shell, viewer, kernel, engine, renderer, protocol, scripts or tests. It deliberately over-includes ported files that are not compiled in, and its intro says so. This is the same stance the Rust section takes for proc-macros (`renderer/bundle-viewer/notice.mjs:552-556 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`): listing a work not carried is harmless; omitting one carried is the failure.
  - The intro states that the set is enumerated from the in-tree registry, not from a build tool (ADR-030's rule).
- **Placement** leaves every existing slice untouched: the viewer, frontend, Rust and amalgamation counts, and `checkDistNotice.mjs`'s body bound at the DuckDB sentinel (`frontends/shell/scripts/checkDistNotice.mjs:342-352 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
- **Entry shapes** (§7) match neither `ENTRY_LINE` nor `AMALGAMATION_ENTRY_LINE` (`frontends/shell/scripts/checkDistNotice.mjs:172 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`; `frontends/shell/scripts/checkDistNotice.mjs:178 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).
- **Per work:** a work line, one file line per ported file, the file's copyright lines, then each pinned text in full, delimited by `--- <work>/<file> (upstream <upstream_path>) ---`. Sorted by work id, then by path; no timestamp.
- **Wording** of both headings and intros is OPEN-3; the draft wording is the worker's, marked latent.

**2.5 Shell (`frontends/shell/scripts/`).**
- `generateNotice.mjs` runs `readPortedRegistry`, then `checkPortedFiles` over `git -C <repoRoot> ls-files -z` with the allowlist, before calling `notice()`. Any finding or a failed git listing becomes the existing named `generateNotice: FAIL -- …` line and exit 1. Since this runs in `prebuild` (`frontends/shell/package.json:12 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`), no packaged build can carry a marked port without its notice.
- `checkDistNotice.mjs` calls `portedSectionFindings`. In the built `dist/` text, the application section's file-line count must equal the registry's file count and its end sentinel must be present; with an empty registry, the heading must be absent.
- **Kernel and Rust ports** reach users through the application section. The packaged installer is the only conveyed artifact carrying Rust code: its resources are the generated NOTICE and the viewer dist (`frontends/shell/src-tauri/tauri.conf.json:40-43 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`), and a published bundle carries only the viewer. A separately conveyed kernel binary would be a new channel under ADR-030's reopen condition (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:60-64 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).

**2.6 Repository check and CI.**
- `scripts/check-ported-notices.mjs` (new) is a thin entry point: `git ls-files -z` → `readPortedRegistry` → `checkPortedFiles`. It prints one PASS line or the findings, and exits 1 on any finding.
- New workflow `.github/workflows/ported-notices.yml`: `ubuntu-latest`, Node 24, `contents: read`, no path filter (a port can land in any file), runs the entry point. It is modelled on governance-ci's cfg-boundary job, `.github/workflows/governance-ci.yml` lines 171 to 185 at 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.
- `product-ci-shell.yml` and `product-ci-viewer.yml` add `renderer/bundle-viewer/portedNotices.mjs`, its `.d.mts` (shell only) and `LICENSES/third-party/ported/**` to both `push` and `pull_request` path filters. For the shell's existing filters, see `.github/workflows/product-ci-shell.yml` lines 116 to 154 at 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d.

**2.7 Documentation, in the same PR.**
- `LICENSES/third-party/ported/README.md`: the method, mirroring the DuckDB README's order (pin the commit, fetch the texts once, hash and blob-SHA verification where available, the eol rule, what the build verifies and what is only recorded).
- `LICENSES/README.md`: one appended section naming the directory as notice-generation input, and stating that the layers table still holds under OPEN-2 (a).
- `CONTRIBUTING.md`: one paragraph on the ported-file header and the rule that a PORT is the human's typed word.

**2.8 Portability (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:33-65 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`).** This is not an OS-dependent feature: it is pure Node, with paths taken from `git ls-files` (forward slashes on every platform) and compared as POSIX strings.
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
- Under `state/directives/2026-10-05-product-first-direction.md:15 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`, a gate fails only on Correctness or Evidence.
- **Operator:** no row. Nothing user-visible changes with an empty registry. The first PORT piece carries the Notices-view sight row and the OPEN-3 wording.
- **Heavy runs** (both NOTICE builds, twice each) follow `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 316a44766a42cef9dbc6a32b6bc2349dd1d33b8d sha256:HASH-TBD`, carried in the worker brief.

## §10. Amendments — opens empty, append-only

*(Classes 1–9, `docs/PREREGISTRATION-TEMPLATE.md`.)*
````

## 3. OPEN items for the human

**OPEN-1: which upstream licences a port may carry.** Red line (security posture, ADR-009; `AUTONOMY.md:321-322`).
- **Options:**
  - (a) a permissive set: MIT, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, Apache-2.0 (with any upstream NOTICE pinned), Zlib, BSL-1.0;
  - (b) (a) plus MPL-2.0, where the file stays MPL-2.0: a per-file layer the ADR-009 layers table does not have today;
  - (c) a narrow set: MIT, BSD-2/3-Clause, ISC, Apache-2.0;
  - (d) none until counsel has reviewed (ADR-009's caveat).
- **Recommendation:** (a). Anything outside it is a per-port ruling.
- **What waits:** the value of `ALLOWED_UPSTREAM_LICENSE_IDS` and the merge. Code can start, because the empty default fails closed.

**OPEN-2: a ported file's licence expression and header.** Red line (licence policy).
- **Options:**
  - (a) `AGPL-3.0-or-later AND <upstream id>`, with the project's copyright line, the upstream copyright lines and a `Ported-From:` line;
  - (b) the upstream id alone: the file and its changes stay under the upstream licence, a new per-file layer;
  - (c) (a) for modified ports, (b) for verbatim copies.
- **Sub-question:** whether the containing package's `license` field changes. Recommendation: no, and no check enforces it.
- **Recommendation:** (a). It keeps ADR-009 item 1 and the layers table true and keeps the upstream notice.
- **What waits:** code (the header verifier and the CONTRIBUTING paragraph).

**OPEN-3: the wording users will see in the two new NOTICE sections.** Red line (user-visible behaviour not already ruled).
- **Options:**
  - (a) rule the draft wording before merge;
  - (b) land it latent (nothing shows with an empty registry) and sight it in the first PORT piece, which already needs the human's typed word.
- **Recommendation:** (b), which saves a question round.
- **What waits:** under (a), the merge; under (b), the first PORT.

**OPEN-4: the ADR-030 appended note.** Red line (ADR amendment).
- **Options:**
  - (a) accept the note below before this piece merges;
  - (b) defer it to the first PORT.
- **Recommendation:** (a). The enumeration rule is the decision, and ADR-030's reopen clause forbids taking it over by assumption.
- **What waits:** the merge, not the code.

ADR-030 appended-note skeleton (architect draft; the human accepts):

```markdown
## Appended note — <date>, ported source files (reopen 4)

**Context.** A file ported from an outside project into this repository's own source is a third-party
work that no build manifest reports as third-party: the viewer's metafile lists it as first-party input,
the shell's Vite manifest drops first-party modules, and Cargo sees only first-party crates. Comments are
stripped and Rust is compiled, so the file's own header does not ship.

**Decision.** A fifth set, enumerated from the in-tree registry `LICENSES/third-party/ported/MANIFEST.json`,
whose pinned texts are re-hashed at every generation. Viewer notice: the registered files that are inputs
of the viewer's esbuild metafile (exact). Packaged application notice: every registered file,
over-inclusive by design, stated in the section's own intro as a registry and not a build manifest. A
repository check and the packaged build fail closed, in both directions, on a marked file without an entry
and on an entry without a marked file or a pinned text.

**Consequences.** No artifact ships a marked port without its notice. An unmarked copy is not detectable
mechanically: review and DCO (b) cover it. The packaged build requires a git checkout. A separately
conveyed kernel artifact, or any other new channel, reopens this ADR under the existing Reopen condition.
```

**OPEN-5: what counts as a PORT, and what counts as a fresh write.** This is the licence watch's alternative. Red line (licence policy).
- **Options:**
  - (a) it is a PORT whenever upstream source was read while writing; a fresh write works from a published description only, and the piece's form cites that description;
  - (b) counsel decides each case;
  - (c) every write that draws on the reuse index is treated as a PORT.
- **Recommendation:** (a).
- **What waits:** nothing in this piece; it binds the first form that draws on the index.

**OPEN-6: whether `ported-notices` becomes a required check.** Not a red line; it is the human's repository setting (`AUTONOMY.md` §20).
- **Recommendation:** required. It is cheap and has no path filter.
- **What waits:** nothing.

**Documentation finding (fix in the same PR; it does not block):** `AUTONOMY.md:322` labels ADR-021 as bundling / no-runtime-fetch, but ADR-021 is the row-filter ADR and no-runtime-fetch is one of its consequences.

## 4. Files read

- C:\dev\spatial-ide\PLAN.yaml (lines 4340–4399)
- C:\dev\spatial-ide\state\directives\2026-10-08-reuse-round-1.md
- C:\dev\spatial-ide\state\directives\2026-10-08-reuse-round-1-private-repository.md
- C:\dev\spatial-ide\state\directives\2026-10-09-slot-orders-pilot-and-reuse-standing-step.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\docs\adr\ADR-009-license-and-open-core-boundary.md
- C:\dev\spatial-ide\docs\adr\ADR-030-conveyed-artifact-notice-set.md
- C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md (lines 120–149)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AUTONOMY.md (§21–§22, §25)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (lines 451–476)
- C:\dev\spatial-ide\frontends\shell\scripts\generateNotice.mjs
- C:\dev\spatial-ide\frontends\shell\scripts\checkDistNotice.mjs
- C:\dev\spatial-ide\frontends\shell\scripts\metafileKey.mjs
- C:\dev\spatial-ide\frontends\shell\scripts\rustCrateNotices.mjs (lines 95–184)
- C:\dev\spatial-ide\frontends\shell\scripts\duckdbAmalgamationNotices.mjs (grep)
- C:\dev\spatial-ide\frontends\shell\src\notices\noticeByteIdentity.test.ts (lines 1–200)
- C:\dev\spatial-ide\frontends\shell\package.json (grep), C:\dev\spatial-ide\frontends\shell\vite.config.ts (grep), C:\dev\spatial-ide\frontends\shell\src-tauri\tauri.conf.json (grep)
- C:\dev\spatial-ide\renderer\bundle-viewer\notice.mjs
- C:\dev\spatial-ide\renderer\bundle-viewer\build.mjs (lines 30–51), C:\dev\spatial-ide\renderer\bundle-viewer\package.json (grep)
- C:\dev\spatial-ide\kernel\src\publish\viewer_assets.rs (lines 1–80)
- C:\dev\spatial-ide\LICENSES\README.md
- C:\dev\spatial-ide\LICENSES\third-party\duckdb-1.5.5\README.md
- C:\dev\spatial-ide\CONTRIBUTING.md
- C:\dev\spatial-ide\DCO (grep)
- C:\dev\spatial-ide\PRE-PUBLIC-CHECKLIST.md (grep)
- C:\dev\spatial-ide\.gitattributes
- C:\dev\spatial-ide\.githooks\pre-commit
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml; product-ci-shell.yml, product-ci-viewer.yml, release-artifacts.yml (grep)
- Read-only clone C:\dev\spatial-ide-reuse\notes\q-command-bar.md (§4, lines 148–176), at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, as reported by the custodian. I did not check the clone's HEAD myself, ran nothing there and wrote nothing there.
