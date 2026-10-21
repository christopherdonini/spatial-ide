*Custodian's filing note (2026-10-21): the architect's draft of the redaction scan form's Amendment 3, from the human's ruling after O0 (the fourth message headed 2026-10-22, item 4), read only at main 85727922. The run 2026-10-21T16:54:46Z to 17:09:04Z by its transcript (Read 22, Glob 4, Grep 24; no Write, Edit or Bash). OPEN-1 to OPEN-7 are the human's. The amendment is appended to the form after their rulings, with its pins added by script, before any code. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is b206dadb4745f1fee795136d62cc710973290ed107d882999d35ea0563d9b470.*

---

Drafted: bundle-redaction-scan-not-in-product-publish, the form's Amendment 3, at main 85727922

I have no shell, so none of the cites below carries a sha256. The custodian's script adds them before commit, as Amendment 1 item 4 did. Every line was read in the main checkout, whose HEAD at session start was 85727922. Nothing in this report is a quotation. The ruling is referenced as `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:11 @ 85727922` (item 4), called "the ruling" below.

---

## Amendment 3 — the human's ruling after O0 (class 5, with class 9 scope additions); written after O0's result was seen, before any code

*References: the ruling (item 4); Amendment 2; `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-o0-worker-report.md`. B′ is this piece's base, `git merge-base origin/main H`. The items marked "pending OPEN-n" are drafted to the architect's recommendation and change only as that OPEN item is ruled.*

1. **The build record (class 9).** `renderer/bundle-viewer/package.json`'s `build` script (`renderer/bundle-viewer/package.json:9 @ 85727922`) becomes `node build.mjs && node scripts/scan-dist.mjs`.
   - `scripts/scan-dist.mjs` (new) writes `renderer/bundle-viewer/viewer-asset-hashes.json` as `{"version":1,"assets":{"<dist-relative path>":"<sha256, 64 lowercase hex>",…}}`, with one entry per file in `dist/`, hashed with `node:crypto` over the bytes on disk.
   - It writes that file only after the scan in item 3 passes (pending OPEN-1). No record exists for a build whose scan failed.
   - The file sits beside `dist/` and never inside it, on the same rule as `dist-metafile.json` (`renderer/bundle-viewer/build.mjs:43-50 @ 85727922`). `.gitignore` gains that one path, beside `.gitignore:6-8 @ 85727922`.

2. **How the product reads it, and the skip.**
   - **Shell (class 9: product code in `publish.rs`, outside `mod tests`).** `bundled_viewer` (`frontends/shell/src-tauri/src/publish.rs:1383-1395 @ 85727922`) keeps its signature, so `commands.rs` is not edited. After `ViewerAssets::from_dir`, it reads `viewer-asset-hashes.json` in the resolved viewer directory's parent:
     - for a packaged app, `resource_dir/viewer-asset-hashes.json`;
     - for the dev tree, `renderer/bundle-viewer/viewer-asset-hashes.json` (`frontends/shell/src-tauri/src/publish.rs:1400-1402 @ 85727922`, `frontends/shell/src-tauri/src/publish.rs:1408-1461 @ 85727922`).

     It parses the file with `serde_json` and passes the `assets` map to the kernel. The publish does not start, and `bundled_viewer` returns W8, when the file is missing or unreadable, is not JSON, has a `version` other than 1, or has members other than `version` and `assets`.
   - **Packaged app (class 9).** `frontends/shell/src-tauri/tauri.conf.json` gains one resource entry beside `frontends/shell/src-tauri/tauri.conf.json:40-41 @ 85727922`: `"../../../renderer/bundle-viewer/viewer-asset-hashes.json": "viewer-asset-hashes.json"`.
   - **Kernel (class 9: `kernel/src/publish/viewer_assets.rs`).** It gains:
     - one `pub fn ViewerAssets::with_build_record(self, assets: BTreeMap<String, String>) -> Self`, whose product caller is `bundled_viewer`;
     - one private field;
     - one `pub(crate) fn is_built_asset(&self, bundle_rel: &str, bytes: &[u8]) -> bool`, whose caller is the gate.

     `is_built_asset` is true only when `bundle_rel` is `viewer/<p>`, the record has an entry for that same `<p>`, and `canonical::sha256_hex(bytes)` (the hash the publish already uses: `kernel/src/publish/mod.rs:70 @ 85727922`, `kernel/src/publish/mod.rs:845 @ 85727922`) equals that entry. No record means nothing is skipped. A malformed key or value never matches, so it skips nothing: the check fails closed.
   - **The gate (§2.3, §2.4).** The private walk gains one parameter, `skip: impl Fn(&str, &[u8]) -> bool`. It is consulted after a file's bytes are read from staging and before `scan`. `scan_directory` passes a `skip` that never skips, so its behaviour, signature and sort are unchanged. `run_inner` passes `|rel, bytes| req.viewer.is_built_asset(rel, bytes)`. Every other staged file is always scanned, whatever its hash: the data partitions, `manifest.json`, `style.json` and `build-info.json` included. The skip is decided on the same staged bytes that are renamed.
   - `redaction.rs` stays std-only: it names nothing under `crate::`, because item 3 compiles it standalone. That compile is the proof.

3. **The CI scan with the same scanner (class 9).**
   - `renderer/bundle-viewer/scripts/scan-dist.rs` (new) is std-only. It holds `#[path = "../../../kernel/src/bundle/redaction.rs"] mod redaction;` and a `main` that runs the unchanged `redaction::scan_directory` (`kernel/src/bundle/redaction.rs:338-365 @ 85727922`) over `dist/` with `MachineIdentifiers::default()`. It prints one line per finding: file, class and offset, never an excerpt. A failed walk exits non-zero.
   - The scan uses no identities and no declared strings. The build machine's identity is not the operator's, and the byte classes do not depend on identities. The five `operator-declared` findings in O0's run were all identity matches.
   - `scripts/scan-dist.mjs` compiles the driver with `rustc --edition 2021` into `node_modules/.cache/`, never into `dist/`, and runs it. It compares each finding with the committed `renderer/bundle-viewer/redaction-reviewed.json` (new). Any finding that does not equal a row by file, class and offset fails the build with exit 1, names the finding by file, class and offset only, and writes no record (item 1).
   - **The reviewed record.** It holds exactly the three findings Amendment 2 item 1 records at B ed2024c2401500c26d7a2bf2944f995dd43f04e8, with classes and offsets and no excerpts, under `"reviewed_at": "ed2024c2401500c26d7a2bf2944f995dd43f04e8"`:
     - `NOTICE.txt`, `credential`, 19092;
     - `NOTICE.txt`, `local-filesystem-path`, 111337;
     - `app.js`, `local-filesystem-path`, 7291.

     These are O0's rows (`state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-o0-worker-report.md:53 @ 85727922`, `:55 @ 85727922`, `:56 @ 85727922`), named relative to `dist/`. A row that matches nothing is printed as not found and does not fail the build (pending OPEN-3). After the strip (item 4), this is expected for the `app.js` row.
   - **Where it runs.**
     - `.github/workflows/product-ci-viewer.yml` gains a `dtolnay/rust-toolchain@stable` step before `npm ci` (`.github/workflows/product-ci-viewer.yml:94-100 @ 85727922`), and `kernel/src/bundle/redaction.rs` in both path filters (`.github/workflows/product-ci-viewer.yml:50-66 @ 85727922`). Its `npm run verify` then runs the scan on ubuntu.
     - `tauri-build.yml` and `product-ci-shell.yml` are not edited. Each already installs Rust before the viewer's `npm run build` (`.github/workflows/tauri-build.yml:46 @ 85727922`, `.github/workflows/tauri-build.yml:56-60 @ 85727922`; `.github/workflows/product-ci-shell.yml:181 @ 85727922`, `.github/workflows/product-ci-shell.yml:193-197 @ 85727922`). So the Windows build that ships is scanned in that same job.

4. **The comment strip (class 9: `build.mjs`, and one comment in `src/manifest.ts`).**
   - `build.mjs`'s esbuild options (`renderer/bundle-viewer/build.mjs:26-39 @ 85727922`) gain `minifyWhitespace: true` (pending OPEN-2). `minifyIdentifiers` and `minifySyntax` stay off, `legalComments` is set explicitly to `'eof'`, and the site carries W10.
   - The comment that brought the example drive path into `app.js` (`renderer/bundle-viewer/src/manifest.ts:321-324 @ 85727922`) is not edited. The strip removes it from `app.js` at the build.
   - `renderer/bundle-viewer/src/manifest.ts:333-335 @ 85727922` says the build keeps comments, and that becomes untrue. It is replaced by W9.
   - The licence texts are not edited: no diff under `LICENSES/**`, `notice.mjs` or `portedNotices.mjs`, and `dist/NOTICE.txt`'s sha256 is equal at B′ and H. The needles, `MIN_PRINTABLE_RUN`, `ATTRIBUTABLE_CLASSES` and every other entry on §2.4's byte-identical list are unchanged.

5. **P-3, restated (written after O0 falsified P-3 as first written; Amendment 2 item 1):** O1 finds, in the unchanged build's `dist/`, exactly item 3's three rows. After the strip, it finds exactly the two `NOTICE.txt` rows. At H, the viewer build's scan passes on ubuntu (product-ci-viewer) and on Windows (tauri-build), each matching only reviewed rows. R1 passes, and its APPROVED' step is published through the skip of the viewer files the build recorded.

6. **§1, amended.**
   - The first "May claim" bullet now reads as follows. Every publish through `permission::boundary::execute`, and every `publish_unguarded` call, runs the unchanged `redaction::scan` over every byte of every staged file, after the last file is written and before the rename. The one exception is a `viewer/<p>` file whose staged bytes' sha256 equals the build record's entry for `<p>`. Those bytes passed the same `scan` at the viewer's build, for the path and credential classes, with only the reviewed rows allowed.
   - May not claim, added:
     - that a skipped viewer file was checked for any login or computer name;
     - that an ubuntu build and a Windows build of the viewer give the same bytes;
     - that a `publish-bundle` CLI publish with the real built viewer succeeds: it is refused at `viewer/NOTICE.txt` (pending OPEN-4);
     - that the packaged app finds its record, except as R2 shows (pending OPEN-5).
   - "No new `pub` item outside the `fixture` feature" becomes: one new `pub` item outside `fixture`, `ViewerAssets::with_build_record`, whose product caller is `bundled_viewer`.

7. **§2, amended.**
   - §2.3: the gate's fourth bullet gains "unless `skip` holds for that file (item 2)".
   - §2.4: the walk gains `skip`, and `redaction.rs` stays std-only (item 2).
   - §2.6: hashing a viewer file is code-controlled work of at most `MAX_VIEWER_ASSET_BYTES` (`kernel/src/publish/viewer_assets.rs:35 @ 85727922`), in the same per-file window. No duration is claimed.
   - §2.9 gains four seams, each proven from the real shape:
     - the viewer build to the shell (the record file): R1 for the dev tree, R2 for the packaged app;
     - the shell to the kernel (`with_build_record`): T8 and T6;
     - `tauri.conf.json` to the resolver: T9;
     - the kernel's scanner to the viewer build (the `#[path]` include): V1 runs the real driver.
   - §2.10 gains W8 (a P6 placeholder) and W4′, W5′, W7′, W9, W10 and W11, all the architect's. W6′ is the human's to approve (OPEN-6).

8. **§4, added.** Each mutation and run is observed as §4 states, by name, with its commit.

   New tests:
   - **U1** (`kernel/src/publish/viewer_assets.rs`, `mod tests`): `only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped`. The cases:
     - `viewer/app.js` whose bytes match its entry: skipped;
     - the same bytes with one byte changed: scanned;
     - `style.json` whose bytes equal the `app.js` entry: scanned;
     - a `viewer/` path with no entry: scanned;
     - no record at all: nothing skipped.
   - **T6** (`kernel/tests/permission_boundary.rs`): `a_viewer_asset_matching_its_build_record_is_published_and_the_same_asset_one_byte_changed_is_refused`. A synthetic viewer's `NOTICE.txt` holds `password` inside a printable run.
     - With a matching record: `Ok`, and the outcome record is `success`.
     - With a record naming other bytes: `RedactionFinding { file: "viewer/NOTICE.txt", class: "credential", .. }`, `no_side_effect`, and the outcome record is `refused` / `RedactionFinding`.
   - **T8** (`frontends/shell/src-tauri/src/publish.rs`, `mod tests`): `bundled_viewer_reads_the_build_record_beside_the_viewer_directory_and_refuses_without_it`. It uses a temporary resource directory holding `bundle-viewer/` with T6's needle, and the record beside it.
     - `prepare` then `execute`: `Success`.
     - Without the record: `bundled_viewer` returns an `Err` beginning `[P6 placeholder] `.
   - **T9** (same module): `the_packaged_resources_carry_the_build_record_at_the_path_bundled_viewer_reads`. It reads `tauri.conf.json` with `include_str!` and asserts item 2's key and target, and that the target equals the name the resolver joins. The precedent is `frontends/shell/src/config/tauriConfig.test.ts:44-54 @ 85727922`, which is not edited.
   - **V1** (`renderer/bundle-viewer/scripts/scan-dist.test.mjs`): `a finding outside the reviewed record fails the viewer build and writes no hash record`. It uses the real driver on a copy of `dist/` with a planted drive path, and asserts:
     - a non-zero exit;
     - the finding named by file, class and offset;
     - the planted text absent from the output;
     - no record written.

     Also in V1: `a reviewed row passes only at its own file, class and offset`, on the compare function (offset + 1, another class and another file are each refused).
   - **V2** (same file): `the built app.js carries no comment from the viewer's sources`. It asserts that the comment at `renderer/bundle-viewer/src/manifest.ts:321-322 @ 85727922` is present in the source and absent from `dist/app.js`.
   - **V3** (same file): `the hash record names each dist file with the sha256 of its bytes`.

   Mutations:
   - **M8:** `is_built_asset` ignores the hash. U1's second case and T6's second half fail.
   - **M9:** the skip is path-blind (any record value). U1's third case fails.
   - **M10:** the gate never skips. T6's first half and T8's first half fail.
   - **M11:** the shell reads a missing record as empty. T8's second half fails.
   - **M12:** the compare ignores the offset. V1 fails.
   - **M13:** `scan-dist.mjs` writes the record before comparing. V1 fails.
   - **M14:** the strip option is removed. V2 fails. (The CI scan alone would not catch this: the `app.js` row is reviewed.)
   - **M15:** the resource entry is removed. T9 fails.

   Runs:
   - **O1 (at B′, before any code, scratch and never committed):** build unchanged and scan as in item 3. Then, with a scratch strip edit, build and scan again. Predicted: exactly item 5's rows. Any other finding: STOP before code, and the human rules. The scan and the reviewed record are not widened. A pass is recorded in the PR body with B′. A STOP is recorded as an amendment.
   - **R1** is unchanged in its steps. It is now also the dev-tree seam's proof: APPROVED' passes only through the skip, because `viewer/NOTICE.txt` holds a credential-class match.
   - **R2 (pending OPEN-5):** at H, on the custodian's machine, the PR's tauri-build installer is installed and one publish is made. Predicted: `Success`, with the bundle's `viewer/` files equal to the record's hashes.
   - **CI at H:** product-ci-viewer and tauri-build are both green, each log showing the two `NOTICE.txt` rows matched and the `app.js` row not found.

9. **§5, amended.**
   - P-1 adds U1, T6, T8, T9 and V1 to V3. P-2 is unchanged. P-3 is item 5. P-5 (new): M8 to M15 each fail as item 8 states.
   - Declared unchanged, added:
     - `LICENSES/**`, `notice.mjs`, `portedNotices.mjs` and `index.html`;
     - `commands.rs`;
     - `tauri-build.yml` and `product-ci-shell.yml`;
     - every lockfile and `package-lock.json` (no new dependency).
   - Invalidators, added:
     - O1 other than predicted: stop, class 2, and the human rules;
     - a tauri-build scan finding that the ubuntu scan did not have: stop, class 2;
     - R1 or R2 refused at a `viewer/` file: stop, class 2.
   - Falsification, added: a product publish that skips any file outside `viewer/`, or a `viewer/<p>` file whose staged bytes' sha256 is not the record's entry for `<p>`; or a viewer build holding a finding outside the reviewed record that writes a record.

10. **§7 (class 9). The budget is 420 minutes, replacing 240.** The custodian sets it in PLAN.yaml. Past twice the budget, the node stops. **At most 1,206 changed lines over 23 non-generated files, plus this form.** They are counted as §7 states.

    | File | Ceiling |
    |---|---|
    | kernel/src/bundle/redaction.rs | 66, outside `mod tests` only |
    | kernel/src/publish/mod.rs | 42 |
    | kernel/src/publish/viewer_assets.rs (new to scope) | 110, of which ≤ 50 outside `mod tests` |
    | kernel/src/publish/error.rs | 30 |
    | kernel/src/permission/boundary.rs | 8 |
    | kernel/src/permission/audit/reader.rs | 30 |
    | kernel/tests/typed_terminal_codes.rs | 35 |
    | kernel/tests/permission_boundary.rs | 150 |
    | engine/src/fixture.rs | 50 |
    | frontends/shell/src-tauri/src/publish.rs | 240, of which ≤ 45 outside `mod tests` and `resolver_tests` |
    | frontends/shell/src-tauri/tauri.conf.json (new) | 2 |
    | renderer/bundle-viewer/build.mjs (new) | 16 |
    | renderer/bundle-viewer/package.json (new) | 2 |
    | renderer/bundle-viewer/scripts/scan-dist.rs (new) | 60 |
    | renderer/bundle-viewer/scripts/scan-dist.mjs (new) | 130 |
    | renderer/bundle-viewer/scripts/scan-dist.test.mjs (new) | 150 |
    | renderer/bundle-viewer/redaction-reviewed.json (new) | 12 |
    | renderer/bundle-viewer/src/manifest.ts (new; comment only, W9) | 3 |
    | .github/workflows/product-ci-viewer.yml (new) | 30 |
    | .gitignore (new) | 2 |
    | KNOWN-LIMITATIONS.md | 22 (W6′, pending OPEN-6) |
    | kernel/README.md | 12 |
    | engine/README.md | 4 |

    An overrun is class 8. §7 and this item are never edited.

11. **§8, amended.**
    - Item 2's third bullet becomes: any file, directory or byte range skipped other than item 2's skip, or a file's bytes split before `scan`.
    - Item 7 becomes: a new `pub` item outside `fixture` other than `ViewerAssets::with_build_record`.
    - Added:
      13. a skip decided on in-memory bytes, outside `viewer/`, or against another path's entry;
      14. a row in `redaction-reviewed.json` beyond the three, a row matched on less than file, class and offset, or an excerpt in that file or in the scan's output;
      15. the record written when the scan has not passed, or written inside `dist/`;
      16. any licence-text edit (item 4);
      17. `redaction.rs` reaching outside std, or the CI scan run with identities or declared strings;
      18. any edit to `commands.rs`.

12. **§9, amended.**
    - The architect adds: the skip against the ruling; item 4 and O1; the reviewed record against Amendment 2 item 1; item 7's seams; W4′ to W11.
    - The reviewer adds:
      - U1, T6, T8, T9 and V1 to V3;
      - M8 to M15;
      - O1 and R2, each with its commit;
      - both CI scan logs;
      - `NOTICE.txt`'s sha256 at B′ and at H.
    - The suites add `npm run verify` in `renderer/bundle-viewer` (it needs `rustc`) and `rustfmt --edition 2021 --check renderer/bundle-viewer/scripts/scan-dist.rs`.
    - **Rule (00):** this piece's paths are the 23 in item 10, plus this form.
      - **PR #240** (`docs/adr/ADR-036…`, `docs/README.md`): disjoint. This piece edits nothing under `docs/`.
      - **Piece 1c's committed form:**
        - its step 1 shares `kernel/README.md` and is dispatched after this PR merges, as before;
        - 1c edits `commands.rs` and `lib.rs`, and this piece edits neither (item 11, 18);
        - neither `tauri.conf.json` nor any `renderer/bundle-viewer/` path is among 1c's groups;
        - `frontends/shell/src/**` stays unedited here.
      - **The governance lane** (`scripts/plan/`, `.github/workflows/governance-ci.yml`): disjoint. The new scripts are under `renderer/bundle-viewer/scripts/`. The one contact is that verify-test-claims will resolve item 8's test names at the done commit.
      - **Milestone 4:** its node depends on this one. Its `renderer/style-ts` edits are bundled into `app.js`, so its viewer CI runs this scan. That is an effect, not a shared path.
      - The custodian re-checks `.gitignore` and `product-ci-viewer.yml` against every PR awaiting merge at dispatch.

**Words.**
- **W8, the shell's refusal; a P6 placeholder for an app string:** `[P6 placeholder] the reference bundle viewer's build record could not be read at {path} ({detail}) — {remedy}`. `{remedy}` is the existing packaged or dev pair (`frontends/shell/src-tauri/src/publish.rs:1452-1457 @ 85727922`).
  - "could not be read": item 2's four conditions.
  - `{path}`: the parent rule in item 2, which in a packaged app is the operator's own install directory.
- **W4′, the gate's site comment:** W4's text with this sentence inserted after its second sentence: `A viewer/ file whose bytes hash to the viewer build's record for that same path is not scanned again: the viewer's build ran this scan over those bytes, for the path and credential classes, and allowed only its reviewed findings. Every other file, the partitions, the manifest, the style and build-info included, is always scanned.`
  - "not scanned again": `is_built_asset` (item 2).
  - "ran this scan … allowed only its reviewed findings": item 3, and the record is written only on a pass (OPEN-1 (B); under (A) this clause is untrue for dev builds).
  - "always scanned": M9 and U1's third case.
- **W5′:** W5 with `; a viewer/ file whose bytes match the viewer build's record was scanned at that build and is not scanned again` inserted before `), then rename.` Checked against item 2.
- **W7′:** `## Where the product runs it` / `publish` runs `scan` over every staged file before the rename, except a `viewer/` file whose bytes match the viewer build's record, and refuses on the first file holding a match that is not operator-declared; the viewer's build compiles this file on its own and runs `scan_directory` over its `dist/` (`renderer/bundle-viewer/scripts/scan-dist.rs`), so this file names nothing outside `std`; `scan_directory` stays the tests' whole-bundle report.
  - Checked against items 2 and 3.
- **W9**, replacing `renderer/bundle-viewer/src/manifest.ts:333-335 @ 85727922`: `*(No example URL is written literally in this comment, because boundaries.test.mjs refuses any absolute URL anywhere in the built dist/app.js. The build strips comments (build.mjs), but this rule does not lean on that. That test is right to have no allowlist; the cases live in manifest.test.mjs instead.)*`
  - "strips comments": V2.
- **W10, at `build.mjs`'s option:** `**Comments are stripped** (the redaction form's Amendment 3): a source comment reached dist/app.js and carried an example drive path into every published bundle. minifyWhitespace drops comments here; minifyIdentifiers and minifySyntax stay off, and legalComments is set to 'eof' so licence comments are kept (esbuild <version>, as the lockfile pins it).`
  - "drops comments": V2.
  - The `legalComments` clause is a tool claim. It names the esbuild version the lockfile pins at B′, and the worker fills that version in from the lockfile.
- **W11, `product-ci-viewer.yml`'s header paragraph:** `**The redaction scan (the redaction form's Amendment 3).** npm run build ends with scripts/scan-dist.mjs, which compiles kernel/src/bundle/redaction.rs with rustc and scans every file in dist/ with it, for the path and credential classes. A finding not listed in redaction-reviewed.json, by file, class and offset, fails the build, and no hash record is written. That is why redaction.rs is watched below and a Rust toolchain is installed.`
  - Checked against item 3, V1 and M13.
- **W6′, a new KNOWN-LIMITATIONS sentence replacing W6, the human's to approve (OPEN-6):** W6 unchanged, except that this paragraph is inserted after its three bullets: `The viewer's own files are the exception: when their bytes are exactly the ones its build checked, they are not searched again. That build checked them for paths and credential words, not for any login or computer name, and it allows only a reviewed list of matches, two of them inside the licence texts the viewer carries; neither is a path or a credential of anyone's machine.`
  - "exactly the ones its build checked": the sha256 equality in item 2, and the record written only on a pass (OPEN-1 (B)).
  - "not for any login or computer name": `MachineIdentifiers::default()` (item 3).
  - "two of them inside the licence texts": the two `NOTICE.txt` rows (O1, and Amendment 2 item 2).
  - "neither is a path or a credential of anyone's machine": the custodian's reading in Amendment 2 item 2, not a verdict of the scan.
  - Ordinary use reaches all of it: every publish carries the viewer.

Nothing above is edited.

---

## OPEN items (for the human; the architect recommends one option in each)

**OPEN-1: what writes the hash record.**
- (A) `build.mjs` writes it at every build. A viewer built locally, which no CI scanned, is then skipped at publish.
- (B) `scan-dist.mjs` writes it only after a passing scan, and `npm run build` runs both. Every build that has a record has passed the same scanner, in CI or not. The cost: a viewer build needs `rustc`, which every workflow that builds the viewer already installs.
- **Recommended: (B).** Under (A), W4′ and W6′ are untrue for builds on a developer's machine.

**OPEN-2: how comments are stripped.**
- (A) esbuild's `minifyWhitespace: true`, with `legalComments: 'eof'`. It is one switch and stays deterministic. It also joins lines, so it can create a new drive-letter shape such as `?e:/` in code; O1 checks for this before any code.
- (B) An esbuild `onLoad` plugin that compiles each source file with TypeScript's `removeComments`. Whitespace is kept, but the compile path changes from esbuild's TypeScript loader to `tsc`'s output.
- **Recommended: (A),** with O1's STOP as the guard. The esbuild version that `package.json` names (^0.28.2) was not read against its lockfile here.

**OPEN-3: how a reviewed row matches.**
- (A) As ruled: an exact file, class and offset. A row that matches nothing is printed as not found and passes. Cost: any change to the notice before byte 111337, such as a dependency bump, fails the build until you rule on a new row.
- (B) Exact, and a row that matches nothing fails the build. After the strip, this would force removing the `app.js` row, against the ruling's three.
- (C) Key each row on the sha256 of its excerpt window instead of its offset. It survives shifts and carries no excerpt, but it departs from "offsets".
- **Recommended: (A).**

**OPEN-4: the `publish-bundle` CLI.**
- (A) The CLI takes no record. A CLI publish with the real built viewer is refused at `viewer/NOTICE.txt`, and this is stated in §1 and in the CLI's module doc. Every kernel test uses a synthetic viewer.
- (B) The CLI gains an optional `--viewer-build-record <file>`. That is about 40 more lines in `kernel/src/bin/publish-bundle.rs` and `kernel/tests/publish_cli.rs`, and a dev-tooling option whose standing under the caller rule is doubtful.
- **Recommended: (A).**

**OPEN-5: R2, a publish from the packaged app.**
- (A) Yes, at H, from the PR's tauri-build installer. Every packaged publish depends on the resource entry and the parent-directory rule, and T9 proves only the config file.
- (B) No. Declare it in §1.
- **Recommended: (A).**

**OPEN-6: W6′.** W6 is your approved sentence, and after this ruling it is untrue (it says every file is searched). You can answer:
- yes to W6′;
- with your own words, which are checked once;
- or "as it stands". Not recommended: an untrue statement of a limit is a Correctness finding.
- **Recommended: yes.**

**OPEN-7: ADR-017 §13.** `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:502-504 @ 85727922` says absence is asserted by a scan over every byte of every emitted file. After this piece, the viewer's bytes are scanned at the viewer's build, with reviewed exceptions, and the rest at publish.
- **Recommended:** no ADR text in this piece (OPEN-4 (A) stands). The ADR-017 note node the custodian proposes under OPEN-4 (A) also carries the build-time scan, the reviewed list and the skip, in your typed words.

---

## What I could not settle

- **Whether an ubuntu build and a Windows build give the same `dist/` bytes.** `.gitattributes` pins LF for the licence corpora (`.gitattributes:35 @ 85727922`, `.gitattributes:68-70 @ 85727922`), but no evidence compares the two builds. If they differ, the tauri-build scan fails closed: that is item 9's invalidator.
- **Whether the viewer at B′ still gives O0's offsets.** O0 ran at ed2024c2. O1 decides.
- **Which esbuild version is pinned, and what it does.** I did not read the lockfile's esbuild version. The local `node_modules` is untracked and is not cited. That `minifyWhitespace` drops ordinary comments and leaves new findings in place is for O1 and V2 to show.
- **Two Tauri questions:**
  - whether Tauri's resource map accepts a single-file key with a file-name target as item 2 writes it (R2 shows it);
  - whether the shell's build script refuses a missing resource during `cargo test` (the worker confirms; it is already a precondition for `dist/*`).
- **Whether the checkout I read was exactly 85727922.** I have no shell to confirm it.
