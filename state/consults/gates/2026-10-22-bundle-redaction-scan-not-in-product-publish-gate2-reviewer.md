Reviewed: PR #241 at 95edf33be3640fd68dbed77f6d5055e6189506a1, the scoped check after correction round 1, reviewer — cut/bundle-redaction-scan @ 95edf33be3640fd68dbed77f6d5055e6189506a1
Verdict: PASS WITH NOTES

C1, C2, C3 and D-2 are closed at this head. Gate 1's E-1 is still open, and the merge waits on it: R1 and R2 are not in, and R1 still cannot run because the dev port is still excluded (check 9). Neither blocks this scoped check. One Documentation finding, D-A, must be fixed before the merge. Cites are at the head unless they say otherwise.

## C — Correctness
None open.
- **C1 closed.** `is_built_asset` compares `canonical::sha256_hex(bytes).strip_prefix("sha256:") == Some(hash.as_str())` (kernel/src/publish/viewer_assets.rs:170).
  - U1, T6 and T8 now write their records as 64 lowercase hex.
  - T8 writes the record byte for byte as scan-dist.mjs:96 does: `{"version":1,"assets":{"NOTICE.txt":"<hex>"}}` plus `\n` (publish.rs:3276).
  - U1 has its new assert, "an entry in the sha256: form" (viewer_assets.rs:371-375).
  - Proven by the real-shape probe P1 and its control P2 (check 4).
- **C2 closed.** `main()` takes no parameters and is not exported (scan-dist.mjs:75), and the last line is `process.exit(main())` (:106). The usage line has no arguments (:19).
  - V1 and V3 run the unchanged script inside a scratch mirror (scan-dist.test.mjs:22-35). Both pass.
  - `compare` and `listFiles` stay exported. Their product caller is `main`.
- **C3 closed, by reading.** `walk` scans each file into its own `found`. With `first_only` it returns `found` only when it holds a finding that is not `OPERATOR_DECLARED`; otherwise `found` is dropped at the end of that iteration, before the next file is read. Only without `first_only` does it extend `findings` (redaction.rs:408-415). §2.3's "Findings held" bound now holds.

## E — Evidence
- **E-1 (from gate 1) is still open and blocks the merge, not this check.** R1 and R2 are not in. See check 9.
- **E-note (non-blocking): no test can observe C3's bound.**
  - `first_undeclared_findings` keeps only findings that are not `OPERATOR_DECLARED` (redaction.rs:367).
  - Under the old walk, every earlier file had contributed only `OPERATOR_DECLARED` findings, or the walk would already have returned. So the result is identical either way; the bound is about memory only.
  - `walk` is private. The file's `mod tests` is on §2.4's byte-identical list, and I recomputed it as unchanged (check 1).
  - So the bound is proven by reading, which is what D-A records. I ran no mutation for it.

## D — Documentation (fix before the merge; no re-gate)
- **D-A. The form should say how C3's bound is proven.** These are not the human's words; they are an appended custodian amendment, references only. Proposed words: "§2.3's "Findings held" bound is kept by `walk`'s `first_only` arm in kernel/src/bundle/redaction.rs at 95edf33be3640fd68dbed77f6d5055e6189506a1. No test asserts it: `first_undeclared_findings` returns the same result with or without it, and the file's `mod tests` is on §2.4's byte-identical list."
  - Clause check:
    - "kept by `walk`'s `first_only` arm": redaction.rs:408-415 at the head, read in this check.
    - "the same result with or without it": the `retain` at redaction.rs:367, together with the early return in the old code (the round's diff, redaction.rs hunk at -404,9).
    - "`mod tests` is on §2.4's byte-identical list": the form's §2.4, last bullet. Its pin sha256:cf9f6797986e240acac2285cd75d3d350aad5e7fd62719401a434d433e249660 equals my hash of `#[cfg(test)]` to the end of the file at B′, at 6a10ee24 and at 95edf33b.
    - The sentence carries no hash pin at a branch commit; the commit is named in full.
- **D-1** (PR body) is applied: the body's line 40 is the gate's replacement text, and line 5 says "Amendments 1 to 6".
- **D-3** (row F7) stays with the human. It is listed under "Before the merge" (body line 38).

## Observation (no action)
- The filed worker report-2 gives U1's M8 failure at viewer_assets.rs:352. At this head the `"one byte changed"` assert, and the panic I observed, are at :354.
- Its M9 line (:355) is likewise two lines low. I did not run M9.
- The report is append-only, and this check's observation stands as the record.

## What I checked (each command in the foreground; output to `<scratch>/rds-g2r-*.txt`)

1. **The round's diff.** `git diff 6a10ee24…95edf33b` rc 0. `--stat` rc 0: 7 files, +52/−22. `git log` rc 0: 95edf33b's parent is 6a10ee24.
   - **Shell publish.rs:** T8 only (bare hex, the record in scan-dist.mjs's bytes, a one-line comment).
   - **redaction.rs:** the `walk` doc comment and the walk loop only. The architect's C3 code, as proposed.
   - **viewer_assets.rs:** the `is_built_asset` doc and comparison, as the architect proposed; U1's record in bare hex, plus the new assert.
   - **permission_boundary.rs:** T6's record in bare hex.
   - **scan-dist.mjs:** the usage line, `main()`, and the exit line.
   - **scan-dist.test.mjs:** `runOnCopy`'s mirror and the `mkdirSync` import.
   - **scan-dist.rs:** line 5 is byte-equal to D-2's replacement (a node substring check, rc 0, `true`).
   - Nothing else changed. A new `unwrap` appears only in test code.
   - §2.4 regions:
     - B′ redaction.rs 49–335 and head 57–343 both hash to 4669a1bf…
     - `mod tests` hashes to cf9f6797… at B′ (from 367), at 6a10ee24 (from 416) and at 95edf33b (from 421).
     - `git show` rc 0 ×3.
2. **The tests by name, at the head.**
   - Kernel suite: U1 `publish::viewer_assets::tests::only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped ... ok` (with the new assert). T6 `a_viewer_asset_matching_its_build_record_is_published_and_the_same_asset_one_byte_changed_is_refused ... ok`.
   - Shell suite: T8 `publish::tests::bundled_viewer_reads_the_build_record_beside_the_viewer_directory_and_refuses_without_it ... ok` (T9 also ok).
   - `npm run verify`: V1's two tests, V2 and V3 each ✔.
3. **Mutations, re-observed by me.** Each was applied by `rds-g2r-mut.mjs` (exact-once replacement), the named test was run alone with `--exact` (cargo in a shared hold), then the file was reverted with `git checkout` (rc 0) and the porcelain shown empty (0 bytes).
   - **M8** (the hash is ignored):
     - U1 rc 101, panicked at viewer_assets.rs:354, "one byte changed";
     - T6 rc 101, at permission_boundary.rs:1214, `unwrap_err()` on `Ok`.
   - **M10** (the skip site returns `false`):
     - T6 rc 101, at :1199, "a viewer file matching its build record is not scanned again: … RedactionFinding { file: "viewer/NOTICE.txt", class: "credential", byte_offset: 22, count: 1 }";
     - T8 rc 101, at publish.rs:3284, `got Refused { … viewer/NOTICE.txt … credential at byte 22 … }`.
   - **M12** (the offset is ignored): `node --test --test-name-pattern="a reviewed row passes only at its own file, class and offset" scripts/scan-dist.test.mjs` rc 1, `AssertionError: offset + 1` (scan-dist.test.mjs:61).
4. **The probe, repeated, from the real shape.**
   - **At the head, unchanged:** T8, which now writes the producer's bare-hex record, passes (`Success`).
   - **P1, applied, run alone, reverted:** T8's viewer `NOTICE.txt` was replaced with the real built dist/NOTICE.txt, and its record with the bytes of the real viewer-asset-hashes.json that `npm run build` wrote at this head. Result: rc 0, `... ok`, so `Success`.
   - **P2, the control:** the same real NOTICE.txt with its entry in the `sha256:` form. Result: rc 101, `got Refused { … found 2 match(es) in viewer/NOTICE.txt … class credential at byte 19092 … }`.
   - So P1's success is the skip firing on the real record against the reviewed credential match.
   - Reverted each time with `git checkout` rc 0, and the porcelain was 0 bytes.
5. **`npm run build`** rc 0. The scan lines:
   - "scan-dist: 3 files scanned, 2 findings, all reviewed; record written";
   - "reviewed row NOTICE.txt credential 19092: matched";
   - "reviewed row NOTICE.txt local-filesystem-path 111337: matched";
   - "reviewed row app.js local-filesystem-path 7291: not found".

   The record:
   - Its keys are `version` and `assets`. All 3 values match `/^[0-9a-f]{64}$/` (node check rc 0), and its last byte is `\n`.
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb, app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8, index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c.

   `sha256sum dist/NOTICE.txt` gives 826e55d1…4805fb, after the build and again after `npm run verify`. That equals B′.
6. **Suites at the head.**

| Command | Exit | Result |
|---|---|---|
| `cargo test -p spatial-kernel` (shared hold) | 0 | 45 "test result: ok", 0 FAILED; lib 164, permission_boundary 16 (1 ignored), publish 33 (2 ignored) |
| `cargo test` in frontends/shell/src-tauri (shared hold) | 0 | 71 + 2 passed |
| `cargo fmt --all --check` | 0 | empty output |
| `cargo fmt --check` in src-tauri | 0 | empty output |
| `rustfmt --edition 2021 --check renderer/bundle-viewer/scripts/scan-dist.rs` | 0 | empty output |
| `npm run verify` in renderer/bundle-viewer | 0 | 104 tests, 104 pass, 0 fail |
| `node --test` scripts/plan, hooks, evidence | 0 | 527 pass, 0 fail |
| `verify.mjs` | 0 | PASS |
| `verify-cites.mjs` | 0 | PASS, 2178 files |
| `verify-quotes.mjs` | 0 | PASS, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS, 613 claimed tests |

7. **§7.** `git diff --numstat c7d02156…95edf33b` rc 0: 24 files, 866 + 22 = 888 changed lines, against 1,222. `git merge-base origin/main 95edf33b` gives c7d02156 (rc 0).
   - Every file is within Amendment 3 item 10's ceiling except manifest.ts (7 of 3). That is the class 8 overrun Amendment 4 already records, and this round did not touch the file.
   - The files this round touched:

| File | Changed | Ceiling |
|---|---|---|
| redaction.rs | 62 | 66 (all hunks are before `#[cfg(test)]` at :421) |
| viewer_assets.rs | 71 | 110 (31 outside `mod tests`, against 50) |
| permission_boundary.rs | 124 | 150 |
| shell publish.rs | 159 | 240 |
| scan-dist.mjs | 107 | 130 |
| scan-dist.rs | 32 | 60 |
| scan-dist.test.mjs | 91 | 150 |

8. **CI at the head.** `gh pr checks 241` rc 0: 20 checks, all pass. `gh pr view` rc 0: headRefOid 95edf33b, draft.
   - `gh run view` (rc 0 each) gives headSha 95edf33be3640fd68dbed77f6d5055e6189506a1 and success for all 14 runs: 39707908660, 39707913128, 39707908681, 39707913174, 39707908752, 39707913100, 39707913168, 39707913126, 39707908671, 39707913114, 39707908724, 39707913135, 39707908659 and 39707913105.
   - **The scan lines** (`gh run view --job … --log`, rc 0 each) are the same four lines as check 5:
     - product-ci-viewer: jobs 119592194454 (pull_request) and 119592179442 (push);
     - the tauri build: jobs 119592194296 and 119592179725, twice each;
     - the shell test job 119592194117.
   - No Windows-only finding, so that invalidator did not fire.
   - The installer artifacts are `spatial-ide-nsis-installer` 12395703267 (run 39707913135) and 12395527564 (run 39707908724), both unexpired.
9. **What R1 and R2 must show at this head.**
   - **R1, on the custodian's machine, debug app at 95edf33b:**
     - The viewer is built at this head, with the four scan lines above, and the record written.
     - `frontends/shell/e2e/publish.mjs`, steps APPROVED′ and REFUSED′, passes unchanged.
     - APPROVED′ succeeds, and the bundle's `viewer/NOTICE.txt` sha256 equals the record's entry, 826e55d1…4805fb.
     - P1 predicts this at the unit level.
     - **R1 still cannot run:** `netsh interface ipv4 show excludedportrange protocol=tcp` (rc 0) still lists 5120–5219, which holds the dev port. Freeing it is the human's.
   - **R2, one publish through the native dialog from artifact 12395703267 (or 12395527564):**
     - the result is `Success`;
     - the install's resource directory holds viewer-asset-hashes.json;
     - each `viewer/` file in the bundle hashes to that installed file's entry;
     - it is recorded with the run id and 95edf33b.
     - No ubuntu–Windows byte equality is predicted (§1, may not claim).

**Process.**
- I wrote scratch files only, all named `rds-g2r-*`. Every hold was granted (MACHINE_HOLD shared, cores 0-7) and released; no exit code from 96 to 99 occurred.
- I added an `echo rc=$rc` between the command and the release in each hold line.
- Every mutation and probe was reverted, and the porcelain was empty after each step and at the end. `git status --porcelain` is 0 bytes, and HEAD is 95edf33b.
- The worktree's build outputs (dist/ and viewer-asset-hashes.json) are ignored (`git check-ignore` matches).
