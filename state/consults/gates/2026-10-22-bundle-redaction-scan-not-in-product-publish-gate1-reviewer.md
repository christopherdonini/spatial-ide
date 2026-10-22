Reviewed: PR #241 at 6a10ee24e79ab17a3905c3de810844c41160f3ee, gate 1, reviewer — cut/bundle-redaction-scan @ 6a10ee24e79ab17a3905c3de810844c41160f3ee
Verdict: FAIL

The gate fails on the architect's C1, C2 and C3, which I confirm, and on E-1. I found no new Correctness finding. My new findings are D-1 and D-2, plus one non-blocking note. All cites are at the head unless they say otherwise.

## C — Correctness (these block)

**C1 confirmed, and I reproduced it.** The skip can never match the record the build actually writes.
- The comparison is at kernel/src/publish/viewer_assets.rs:168, `*hash == canonical::sha256_hex(bytes)`. That function returns `format!("sha256:{:x}", …)` (renderer/src/canonical.rs:157).
- The producer writes the bare digest, `.digest('hex')` (renderer/bundle-viewer/scripts/scan-dist.mjs:92). The real record in the worktree, written by `npm run build` at the head, holds bare hex: `"NOTICE.txt":"826e55d1…"`.
- U1, T6 and T8 all build their records in the `sha256:` form: viewer_assets.rs:343, kernel/tests/permission_boundary.rs:1170 and frontends/shell/src-tauri/src/publish.rs:3271. That is why they pass.
- **Probe (applied, run alone, reverted):** I changed only T8's record value to the producer's bare-hex form (`.trim_start_matches("sha256:")` at publish.rs:3271).
  - T8 then failed at publish.rs:3282 with `got Refused { message: "publish.redaction_finding: … in `viewer/NOTICE.txt` … class `credential` at byte 22 …" }`.
  - So a publish with the real record and a viewer file that holds a match is refused. That is every shell publish with the real viewer, whose NOTICE.txt carries the reviewed credential match at 19092.
  - `cargo test --lib publish::tests::bundled_viewer_reads_the_build_record_beside_the_viewer_directory_and_refuses_without_it -- --exact` in a shared hold: rc 101. Revert: `git checkout` rc 0, porcelain empty.
- The architect's remedy is sound: compare against the digest with its prefix stripped, and write the U1, T6 and T8 records as 64 lowercase hex. I would add one thing: T8 should write its record byte-for-byte as scan-dist.mjs:94 does (`JSON.stringify({version:1,assets})` plus a newline).

**C2 confirmed.** scan-dist.mjs's `[dist-dir [record-file]]` option is only ever used by a test.
- The option is at scan-dist.mjs:19, :75 and :104. Its only caller is scan-dist.test.mjs:24.
- My caller grep (`git grep -n scan-dist`) finds no product caller: package.json:9 passes no argument.
- `export function main` (:75) has no importer at all. `compare` and `listFiles` have a product caller (`main`), so exporting them for the tests is fine.
- The architect's remedy (run the unchanged script inside a scratch mirror) holds: `root` comes from the script's own location, and the `#[path]` (scan-dist.rs:12) resolves relative to the file.

**C3 confirmed.** The form's §2.3 "Findings held" bound is a claimed limit the code does not keep.
- `walk` appends every scanned file's findings to one vector (kernel/src/bundle/redaction.rs:407). It returns at :408 only once a finding outside operator-declared appears, and `first_undeclared_findings` filters only afterwards (:367).
- So every earlier file's operator-declared findings, each with its excerpt, are held until the walk ends. When no file holds an undeclared finding, that means the whole bundle's.
- The architect's proposed code (scan into a per-file `found`; return it only when it holds an undeclared finding; extend only when not `first_only`) restores the bound. redaction.rs is at 55 of its 66-line ceiling.

## E — Evidence

**E-1 (blocks the merge, not a separate round): the build → shell seam has no proof yet.**
- R1 and R2 are not in. At this head both would be refused at `viewer/NOTICE.txt`, as the probe above shows, so they must be run after C1's fix.
- **R1, after the correction round.** At the new head, on the custodian's machine, in the debug app:
  - the viewer is built with `npm run build` at that head; its scan lines show both NOTICE.txt rows matched and the app.js row not found, and the record is written;
  - `frontends/shell/e2e/publish.mjs`, steps APPROVED′ and REFUSED′, passes unchanged;
  - APPROVED′ succeeds, and the bundle's `viewer/NOTICE.txt` sha256 equals the record's entry (826e55d1…, if the notice is unchanged). Because that file carries a credential-class match, a success proves the skip fired;
  - it is filed with its head.
  - R1 cannot run until the dev port is outside the machine's excluded range, and freeing it is the human's action.
- **R2, after the correction round.** The tauri-build NSIS installer from the new head's CI is installed, and one publish is made through the native dialog:
  - the result is `Success`;
  - the install's resource directory holds `viewer-asset-hashes.json`;
  - each `viewer/` file in the bundle hashes to its entry in that file;
  - it is recorded with the CI run id and the head.
- After the fix, re-observe U1, T6, T8 and M8 to M10 at the new commit, plus U1's new assert that an entry in the `sha256:` form does not match.

## D — Documentation (fix in this PR before the merge; no re-gate)

**D-1. The PR body misattributes the words, and its amendment count is stale.** These are not the human's words.
- Current text: "The words W1 to W12 are the architect's. W6′ is approved by the human. The two app strings are P6 placeholders."
- Replacement: "W2 to W5, W7, W4′, W5′, W7′ and W9 to W12 are the architect's, applied by the worker. W6 (approved as drafted, OPEN-3 (A)) and W6′ (OPEN-6) are the human's. W1 and W8, the two app strings, are P6 placeholders."
- Clause check:
  - "W2 to W5, W7 … the architect's": §2.10.
  - "W4′, W5′, W7′ and W9 to W12": Amendment 3 item 7, last bullet. W12 is also the subject of the Words heading "W12, the CLI's module doc (the architect's words…)".
  - "W6 … the human's": §2.10 and the OPEN items block.
  - "W6′ (OPEN-6)": Amendment 3's header and item 7.
  - "W1 and W8 … P6 placeholders": §2.10 and Amendment 3's W8. The code is at kernel/src/publish/error.rs:422-427 and frontends/shell/src-tauri/src/publish.rs:1430-1431, both starting `[P6 placeholder] `.
- Also in the body: "with Amendments 1 to 4" becomes "with Amendments 1 to 5", or the last amendment at the time of the merge.

**D-2. renderer/bundle-viewer/scripts/scan-dist.rs:5 overstates.** It is the worker's doc comment, not the human's.
- Current text: "so the build and the publish run the same bytes of scanner". In the dev tree, `viewer-asset-hashes.json` can come from a build at an earlier commit than the running app's kernel. So the same scanner bytes are only true when both are built at one commit, as they are in the tauri-build job.
- Replacement for line 5: `//! own by `scan-dist.mjs`, from the same source file the kernel compiles (the `#[path]` below).`
- Clause check: the `#[path = "../../../kernel/src/bundle/redaction.rs"]` at scan-dist.rs:12. It claims no commit equality, and it fits in 100 columns.

**D-3. MANUAL-WALKTHROUGH row F7 (frontends/shell/MANUAL-WALKTHROUGH.md:274) is not reworded here.** It runs the CLI with the real viewer and predicts success, which this change refuses (W12). Its placement is the human's (Amendment 3's additions, E1), and the PR body lists it under "Before the merge". I give no words, because the placement is the human's.

**Note, non-blocking, dev-only:** `read_build_record(&dir, resource_dir.is_some())` (publish.rs:1394) chooses the "reinstall" remedy whenever a resource directory is supplied. commands.rs:320-323 supplies one under `tauri dev` (`resource_dir().ok()`), so a dev run that falls back to the dev tree would be told to reinstall. Passing the resolver's label instead would fix it. Ordinary use does not reach this.

## My word on the architect's C1 to C3
- **C1: confirmed.** Behind it: my reading of canonical.rs:157, viewer_assets.rs:168 and scan-dist.mjs:92, the real record's bare hex in the worktree, and the T8 probe above (rc 101, Refused at viewer/NOTICE.txt).
- **C2: confirmed.** The caller grep finds only test.mjs:24 using the arguments.
- **C3: confirmed.** By reading redaction.rs:407-408 and :367 at the head.
- **D1 / Amendment 5:** its item 2 is byte-equal to the gate report's proposed text (shell string compare, rc 0).

## What I checked (each command, foreground, output to `<scratch>/rds-g1r-*.txt`)

1. **The full diff, file by file.** `git diff c7d02156…6a10ee24` (three dots), rc 0, 1,262 lines. I read every hunk of all 24 files.
   - `git merge-base origin/main 6a10ee24` gives c7d02156 (B′).
   - `git diff --stat 979a7d5d 6a10ee24` shows only the two READMEs, 7+/7−, so the code at the head equals the code commit.
   - Unwraps are only in fixture or test code. The only JSON is in the record reader and build tooling, not on a data path.
   - My path:line grep over the added lines found no path:line cite in a comment (§8 item 11).
2. **Every hash pin in the form, on main at b4773307.** My script `rds-g1r-pins.mjs` (`git show rev:path`, the line span, sha256 over the LF bytes), rc 0:
   - 279 pins, 0 mismatches. 279 is also the count of `sha256:<64 hex>` tokens in the form.
   - The pin revs 9a8bd442, 39182e74 and 85727922 are each an ancestor of origin/main (`merge-base --is-ancestor`, rc 0).
   - The only unhashed cite is `@ 54d07268`, which is OPEN-1 (A), as ruled.
   - Since B′ the form is append-only: 19 added, 0 deleted, one hunk after line 829.
3. **The tests.** Each one ran by its exact name and passed:
   - in `cargo test -p spatial-kernel` (rc 0; 45 "test result: ok", 0 FAILED): T3, T4, T5, U1, T6, and the unchanged `granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash` and `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle`;
   - in shell `cargo test` (rc 0; 71 passed): T1, T8, T9, and the unchanged `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt`;
   - in `npm run verify` (rc 0): both V1 tests, V2 and V3 (104 tests, 0 failed).
   - The redaction `mod tests` is byte-identical: B′ 366–589 and head 415–638 both hash to 103a15b7…
   - kernel/tests/publish.rs has an empty diff.
4. **Mutations, re-observed at the head (code identical to 979a7d5d).** Each was applied by `rds-g1r-mut.mjs`, the named test run alone (cargo inside a shared hold), reverted with `git checkout`, and the porcelain shown empty:
   - **M1:** T5 failed at permission_boundary.rs:1139 (`unwrap_err()` on `Ok`), rc 101. T1 failed at publish.rs:3233 (`got Success`), rc 101.
   - **M8:** U1 failed at "one byte changed" (viewer_assets.rs:349), rc 101. T6 failed at :1213 (`unwrap_err()` on `Ok`), rc 101. These two holds overlapped (see the process disclosures).
   - **M10:** T6 failed on its first half ("a viewer file matching its build record is not scanned again: … RedactionFinding viewer/NOTICE.txt credential"), rc 101. T8 failed at publish.rs:3282 (`got Refused`), rc 101.
   - **M12:** V1's second test failed at "offset + 1", rc 1.
   - **M14:** the build passed with the app.js row matched, which confirms the form's note that the CI scan alone would not catch this. V2 then failed at "absent from dist/app.js: Any URI scheme, not just a drive letter", rc 1. After the revert I rebuilt (rc 0), and the dist hashes returned to the head's.
   - Every result matches the worker's record. For M2–M7, M9, M11, M13 and M15 I read the worker's table; their mutations and named tests agree with Amendment 3 item 8 and §4.
5. **O0 and O1.**
   - O0 ran at B ed2024c2, which is on main (rc 0) and holds the form with Amendment 1 only. Its three findings outside operator-declared equal redaction-reviewed.json:3-5.
   - O1 ran at f8825543. `git diff --stat c7d02156 f8825543` is empty (rc 0), so O1 ran on B′'s tree. Its report was filed at c86b2c9c (00:17:07+02:00), before the code commit 979a7d5d (01:28:41+02:00).
   - My head build reproduces O1's strip-build `app.js` sha256 (778198dd…) and its NOTICE.txt hash.
6. **§7.** `git diff --numstat B′…H`, rc 0: 24 files, 835 insertions + 21 deletions = 856, against 1,222.
   - Every file is within its ceiling except manifest.ts, at 7 of 3, which Amendment 4 records as class 8.
   - Sub-ceilings: redaction.rs is 55 of 66, with `mod tests` unchanged. viewer_assets.rs has 28 lines outside `mod tests`, against 50. Shell publish.rs has 42 lines outside its test modules, against 45. mod.rs is 42 of 42 and kernel/README.md 12 of 12.
7. **The owner's index.** My script `rds-g1r-index.mjs` (rc 0) found K1–K6 and E1 each byte-equal to lead-data's "New line", on the same line as its "Line at H" at B′: kernel lines 360, 372, 373, 384, 387 and 392, and engine line 530.
   - Every pointer is true at the head: `pub mod bundle` (kernel/src/lib.rs:77), `pub mod redaction` (bundle/mod.rs:48), the `ViewerAssets` re-export (publish/mod.rs:88), item 47 (KNOWN-LIMITATIONS.md:411), `fixture` behind the feature (engine/src/lib.rs:109-110), the form in the tree, and every named test passing.
8. **Declared-unchanged paths.** `git diff --quiet B′…H -- <p>` returned 0 (empty) for every path I checked: kernel/tests/publish.rs, protocol, frontends/shell/src, frontends/shell/e2e, docs (every ADR, docs/08), SKP-V0.md, LICENSES, notice.mjs, portedNotices.mjs, renderer/bundle-viewer/index.html, commands.rs, lib.rs, tauri-build.yml, product-ci-shell.yml, Cargo.lock (root and src-tauri), both package-lock.json files, the Cargo.toml files, PLAN.yaml and MANUAL-WALKTHROUGH.md.
   - `PublishPhase` (mod.rs:190) is outside every mod.rs hunk.
   - In redaction.rs, B′ 49–335 and head 57–343 both hash to 4669a1bf…
   - publish-bundle.rs adds only W12 and one `//!` line. My script `rds-g1r-words.mjs` (rc 0) found W12 equal to the form's lines 807–818, and W6 + W6′ present byte-for-byte as item 47.
9. **NOTICE.txt.** At B′ it is 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb (O1, both builds; O0 the same at B). At the head, after `npm run verify` (rc 0), `sha256sum dist/NOTICE.txt` gives the same 826e55d1…
10. **Suites at the head:**

| Command | Exit | Result |
|---|---|---|
| `cargo test -p spatial-kernel` (shared hold) | 0 | lib 164, permission_boundary 16 (1 ignored), publish 33 (2 ignored), typed_terminal_codes 8 |
| `cargo test -p spatial-engine --features fixture --lib` (shared hold) | 0 | 203 passed |
| `cargo test` in frontends/shell/src-tauri (shared hold) | 0 | 71 + 2 passed |
| `cargo fmt --all --check` | 0 | |
| `cargo fmt --check` in src-tauri | 0 | |
| `rustfmt --edition 2021 --check renderer/bundle-viewer/scripts/scan-dist.rs` | 0 | |
| `npm run verify` in renderer/bundle-viewer | 0 | 104 tests, 0 failed |
| `node --test` over scripts/plan, hooks and evidence | 0 | 527 passed |
| `verify.mjs` | 0 | PASS |
| `verify-cites.mjs` | 0 | PASS, 2178 files |
| `verify-quotes.mjs` | 0 | PASS, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS, 613 claimed tests |

   The worktree porcelain was empty after each step.
11. **CI.** `gh pr checks 241`, rc 0: 16 checks, all pass. `gh run view` gives headSha 6a10ee24 for runs 39700906031 (viewer, pull_request), 39700906072 (shell, pull_request) and 39700533956 (shell, push).
   - **The scan lines,** from `gh run view --log` (rc 0) and `--job 119569611903 --log` (rc 0):
     - product-ci-viewer (ubuntu): "3 files scanned, 2 findings, all reviewed; record written", then NOTICE.txt credential 19092 matched, NOTICE.txt local-filesystem-path 111337 matched, and app.js 7291 not found;
     - the tauri build job (Windows, run 39700906072): the same four lines, twice (the viewer is built twice in that job);
     - the shell job, in both runs: the same four lines.
   - So the ubuntu and Windows offsets agree, and the Amendment 3 invalidator for a Windows-only finding did not fire.
12. **The PR body** (`gh pr view 241 --json body`, rc 0) records O1's pass with B′ and names B′ and H. See D-1.

**Process disclosures.**
- I wrote one file outside the `rds-g1r-` names: a porcelain listing at /tmp/x. I deleted it in the next call (`rm` rc 0).
- M8's two hold calls were issued in parallel. Both shared holds were granted, and cargo serialised the two builds on the target lock.
- The shell suite's hold line was preceded in the same Bash call by a grep of the engine output, so `cd` was not the first step.
- Every hold was granted and released. No exit code from 96 to 99 occurred. Every mutation was reverted, and the porcelain was empty after each step.
