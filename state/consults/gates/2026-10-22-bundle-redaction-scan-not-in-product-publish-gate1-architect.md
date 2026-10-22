Reviewed: PR #241 at 6a10ee24e79ab17a3905c3de810844c41160f3ee (B′ c7d02156), gate 1, architect — cut/bundle-redaction-scan @ 6a10ee24e79ab17a3905c3de810844c41160f3ee
Verdict: FAIL

I had no shell. I read each file at the head in C:/dev/wt/rds and its B′ version in C:/dev/spatial-ide. I confirmed the head commit from git's ref files: the worktree's HEAD is `refs/heads/cut/bundle-redaction-scan`, and both that branch and `origin/cut/bundle-redaction-scan` hold 6a10ee24. I could not run any git diff, hash, suite or CI check, so those are left to the reviewer and named under "Not checked".

## Findings

### C — Correctness (these block)

**C1. The viewer-build-record seam is written to an imagined interface. This is a gate failure by name (the human's rule of round 4). The skip never fires, so every shell publish with the real viewer is refused.**
- The kernel compares the record's value with `canonical::sha256_hex(bytes)` (kernel/src/publish/viewer_assets.rs:168). That function returns `format!("sha256:{:x}", h.finalize())` (renderer/src/canonical.rs:157).
- The real producer writes the bare digest: `createHash('sha256').update(readFileSync(join(dist, rel))).digest('hex')` (renderer/bundle-viewer/scripts/scan-dist.mjs:92). V3 pins that bare form (renderer/bundle-viewer/scripts/scan-dist.test.mjs:77).
- The shell passes the map through unchanged (frontends/shell/src-tauri/src/publish.rs:1404-1421 and 1395).
- So no entry the viewer build writes can equal the kernel's value. `viewer/NOTICE.txt` is then always scanned, and its reviewed `credential` match at 19092 refuses the publish. Ordinary use reaches this: in the dev tree (R1's APPROVED′) and in the packaged app (R2).
- Every Rust test builds its record in the kernel's `sha256:` form, not the producer's: U1 (kernel/src/publish/viewer_assets.rs:343), T6 (kernel/tests/permission_boundary.rs:1168-1171) and T8 (frontends/shell/src-tauri/src/publish.rs:1414, read side; 3271-3275, record written). That is why every suite and M8 to M10 passed.
- The root cause is mine. Amendment 3 item 2, as I drafted it, says the value is 64 lowercase hex (item 1) and also that `canonical::sha256_hex(bytes)` equals it. The worker built both halves as written.
- W4′ (kernel/src/publish/mod.rs:938-941), W5′ (mod.rs:60-61) and W6′'s first sentence (KNOWN-LIMITATIONS.md:416) are untrue at this head because of this. The fix is in the code, not the words.
- Remedy:
  - `is_built_asset` compares the record's value with the bare hex digest of the staged bytes. For example, proposed code: `canonical::sha256_hex(bytes).strip_prefix("sha256:") == Some(hash.as_str())`.
  - U1, T6 and T8 write their records in item 1's form, 64 lowercase hex. T8 writes the file exactly as `scan-dist.mjs` does.
  - U1 gains one assert: an entry in the `sha256:` form does not match.
  - Re-observe U1, T6, T8 and M8 to M10 at the new commit. Then R1, then R2.
- Prediction: R1 at this head is refused at `viewer/NOTICE.txt`. Running it now would confirm C1; it would not prove the seam.

**C2. Caller rule: `scan-dist.mjs`'s `[dist-dir [record-file]]` option has only test callers.**
- The option is at renderer/bundle-viewer/scripts/scan-dist.mjs:19, :75 and :103-105.
- Its only callers are V1 and V3 (scan-dist.test.mjs:24). `npm run build` passes no argument (package.json:9). A test-only caller does not count, and neither exemption covers it.
- Remedy:
  - Drop the parameters and the argv pass-through (`process.exit(main())`), and make `main` non-exported.
  - V1 and V3 run the unchanged script in a scratch mirror: `scripts/scan-dist.mjs`, `scripts/scan-dist.rs`, `redaction-reviewed.json` and `dist/` copied under `<tmp>/renderer/bundle-viewer/`, and `kernel/src/bundle/redaction.rs` under `<tmp>/kernel/src/bundle/`.
  - The script's root comes from its own location (scan-dist.mjs:29-30), and the `#[path]` (scan-dist.rs:12) then resolves inside the mirror.
  - scan-dist.test.mjs is at 82 of its 150-line ceiling.

**C3. The form's §2.3 "Findings held" bound is not what the code does.**
- §2.3 says a file whose findings are all operator-declared is dropped before the next file is read, so the gate holds one file's result at a time.
- `walk` with `first_only` instead adds every file's findings to one vector (kernel/src/bundle/redaction.rs:407-410). The filter runs only at the end (redaction.rs:366-367). So every earlier file's operator-declared findings, excerpts included, are held until the walk ends.
- That is a stated limit the code does not support (ADR-010 rule 6). A source whose column repeats the copyright text reaches it.
- Remedy, proposed code at redaction.rs:404-410: `let found = scan(&rel, &bytes, machine); if first_only { if found.iter().any(|f| f.class != OPERATOR_DECLARED) { return Ok(found); } } else { findings.extend(found); }`. redaction.rs is at 55 of its 66-line ceiling.

### E — Evidence
- None blocks yet, beyond C1's prediction for R1. R1, R2 and both CI scan logs at the head are not in. The real shape of the build → shell → kernel seam is proven only by R1 and R2, and both must follow C1's fix.

### D — Documentation (fix before the merge; no re-gate)
- **D1. The record: Amendment 3 item 2 contradicts itself (the source of C1).** This is not the human's wording. The form is append-only, so the correction is an appended amendment by the custodian. Proposed words:
  - Text: "Amendment 3 item 2 compares `canonical::sha256_hex(bytes)`, which returns `sha256:` followed by the hex digest, with a record value item 1 fixes as 64 lowercase hex, so no entry `scan-dist.mjs` writes could match. `is_built_asset` compares the record's value with the bare hex digest of the staged bytes, and U1, T6 and T8 write their records in item 1's form. Proof: T8 with a record in `scan-dist.mjs`'s form, the form V3 asserts, and R1."
  - Clause check:
    - "returns `sha256:` followed by the hex digest": renderer/src/canonical.rs:157.
    - "item 1 fixes as 64 lowercase hex": the form, Amendment 3 item 1.
    - "no entry … could match": scan-dist.mjs:92 and viewer_assets.rs:168.
    - The second sentence holds once C1's fix lands.
    - "V3 asserts": scan-dist.test.mjs:77.
  - It is three sentences, within the ceiling.

## The twelve checks

1. **§2.3 placement and the §2.5 chain.**
   - The gate is at kernel/src/publish/mod.rs:936-970. That is after the sidecar write (mod.rs:931-934) and before `total_bytes` (:973) and `finalize` (:974). `finalize` has one call site, :974.
   - `publish_unguarded` (mod.rs:611-617) and `boundary::execute` (kernel/src/permission/boundary.rs:426) both reach `publish_prepared` → `run` → `run_inner` (mod.rs:624, 675, 684, 691).
   - Exactly two declared strings (mod.rs:946-952). `watch.check()` runs before each file (mod.rs:956; redaction.rs:397).
   - A failed listing or read returns `PublishError::Io` with the scan named, not through `classify_io` (mod.rs:958-962; redaction.rs:386-388 and :403).
   - The error arm removes staging or returns `StagingNotRemoved` (mod.rs:642-657).
   - `error_kind` (boundary.rs:240) and `Refused` (boundary.rs:302-305) are in place. The shell and CLI paths are unchanged.
   - The walk order is top-level files, then `viewer/`, then `data/`, as W12 says.
   - Finding: C3.
2. **The skip against the ruling (item 4 of the fourth message).**
   - It applies only to `viewer/<p>`, against the entry for that same `<p>`, on the staged bytes after they are read and before `scan` (viewer_assets.rs:163-169; redaction.rs:403-407).
   - With no record, nothing is skipped (viewer_assets.rs:88, an empty map). Every other file is always scanned.
   - The logic matches the ruling, but the hash comparison can never succeed (C1). It fails closed: nothing is skipped and nothing is leaked.
3. **§2.4's byte-identical list, and std-only.**
   - By reading, B′ redaction.rs:49-335 equals head :57-343, and B′'s `mod tests` (:367-589) equals the head's (:416-638).
   - Only the W7′ paragraph (head :48-55) and the walk region (head :345-414) differ. `scan_directory`'s signature, its result and its final sort are unchanged.
   - Byte identity by hash is the reviewer's to recompute.
   - Std-only: a grep finds no `crate::`; the only `use` is `use super::*` inside `mod tests`. The standalone compile is exercised by V1 (`npm run verify`, exit 0 in the worker's run) and by O1.
4. **The caller rule.**
   - `with_build_record` is `pub` (viewer_assets.rs:155). Its product caller is `bundled_viewer` (shell publish.rs:1395), which commands.rs:323 and :556 call.
   - `is_built_asset` (pub(crate)) is called at mod.rs:957. `first_undeclared_findings` (pub(crate)) is called at mod.rs:953.
   - `walk`, `read_build_record` and `VIEWER_BUILD_RECORD` are private.
   - `write_zone_texts` sits behind the `fixture` feature (engine/src/lib.rs:109-110). The variant is constructed at mod.rs:964.
   - I found no other new `pub` item in the files I read. Finding: C2.
5. **Amendment 3 item 4, and O1.**
   - build.mjs:37-38 sets `minifyWhitespace: true` and `legalComments: 'eof'`, with no minifyIdentifiers or minifySyntax.
   - manifest.ts:321-324 is unedited, and :333-336 is W9.
   - `NOTICE.txt`'s sha256 is 826e55d1… at B′ (the O1 report) and at the head (worker report-1). The needles and classes are unchanged (check 3).
   - O1 found exactly item 5's rows: three in the unchanged build and two after the strip.
6. **The reviewed record.**
   - redaction-reviewed.json:1-8 holds exactly three rows, has `reviewed_at` ed2024c2…, and carries no excerpt. The rows equal Amendment 2 item 1 and O0's rows.
   - Rows are matched on file, class and offset (scan-dist.mjs:34).
   - Neither the driver (scan-dist.rs:24) nor the script (scan-dist.mjs:87, :95-98) prints an excerpt.
7. **Amendment 3 item 7's four seams.**
   - Viewer build → shell (the record file): R1 and R2 are pending, and by reading the seam is broken (C1).
   - Shell → kernel (`with_build_record`): T8 and T6 encode a record shape the producer never writes (C1).
   - `tauri.conf.json` → resolver: proven by T9 (tauri.conf.json:42; publish.rs:1399, :1414, :3304-3309).
   - Kernel scanner → viewer build (the `#[path]` include): V1 runs the real driver.
8. **W1 to W12 and W6′, each against the code.**
   - W1 is at error.rs:422-427, and T3 asserts it exactly.
   - W2 at reader.rs:276-280, W3 at error.rs:186-191 and W7′ at redaction.rs:49-55.
   - W4′ at mod.rs:936-945 and W5′ at mod.rs:58-61.
   - W6 and W6′ at KNOWN-LIMITATIONS.md:411-418, item 47, the next free number.
   - W8 at shell publish.rs:1430-1431, with the existing remedy pair.
   - W9 at manifest.ts:333-336.
   - W10 at build.mjs:33-36. The 0.28.2 it names equals package-lock.json:633-634.
   - W11 at product-ci-viewer.yml:50-54, with the toolchain step at :102 before `npm ci` and `redaction.rs` in both path filters (:64, :73).
   - W12 at publish-bundle.rs:47-58.
   - All match the form's text by reading. The clauses of W4′, W5′ and W6′ that say a recorded file is not scanned again become true only after C1's fix. W6′ is the human's, but the finding is on the code, not their words.
9. **§8, items 1 to 19.**
   - 1: the record order (form, O0, Amendment 3, O1 at f88255, then code at 979a7d5d) holds by the filed reports.
   - 2: holds by reading.
   - 3: kernel/tests/publish.rs is not checked (no diff available); `mod tests` holds by reading.
   - 4 and 5: hold.
   - 6: the variant has no excerpt, and the record carries `error_kind` only.
   - 7: holds, but see C2.
   - 8: not checkable without a diff.
   - 9: W1 and W8 are marked `[P6 placeholder]`, and the KNOWN-LIMITATIONS words match W6 and W6′.
   - 10: holds after C1's fix.
   - 11: no path:line cite appears in a new comment.
   - 12: class 8 is recorded (Amendment 4), and the class 9 additions precede the code (Amendment 3). The worker's report calls the mutations observations made by applying, running and reverting, never verify-mutation. Whether Amendment 3's pin commits are on main is the reviewer's to check.
   - 13 to 15: hold (and C1 fails closed).
   - 16: unverified by me beyond NOTICE.txt's equal sha256.
   - 17: holds (`MachineIdentifiers::default()` at scan-dist.rs:20).
   - 18: `bundled_viewer`'s signature is unchanged and commands.rs:323 still calls it. The whole-file diff is the reviewer's.
   - 19: holds by reading lines 36-63. The rest of that file's diff is the reviewer's.
10. **§1 as Amendment 3 item 6 amends it.**
    - Every staged file is scanned, and the skip is narrow. It is vacuous at this head (C1).
    - The CLI refusal is consistent with W12, and `with_build_record` is the one new `pub` item.
    - "R2 shows" is pending.
11. **The worker's differences 2 to 8.**
    - 2 (the generic walk, the `io_error` closure, the `first_only` flag, `#![allow(dead_code)]`): within the form, since the form left the gate function's shape to the worker; the walk is the site of C3.
    - 3 (`deny_unknown_fields`, the remedies written inline): within the form. It refuses more and fails closed, and T8 pins the remedy.
    - 4: removing the record first is within item 1, and printing status lines last is within item 8. The optional arguments are C2.
    - 5 (generating the ignored NOTICE.txt, and the record existing): about the environment, no finding.
    - 6 (M3 run in the same call as the hold): a process deviation under the machine paragraph. No Correctness or Evidence effect on M3's result.
    - 7 (M8 in two invocations): consistent with §4's "run alone".
    - 8 (the tilde path): no finding.
12. **Amendment 4's class 8.**
    - manifest.ts changes 7 lines against a ceiling of 3: W9's four lines replace three. The ceiling of 3 was my drafting error in Amendment 3.
    - Amendment 4 records it as class 8, and neither §7 nor item 10 is edited, as §7 and item 10 require.
    - The total is 828 + 14 = 842, plus the two READMEs' 14 changed lines, within 1,222.
    - lead-data's K1 to K6 and E1 are present at the head (kernel/README.md:360, 372, 373, 384, 387, 392; engine/README.md:530). Byte equality is the reviewer's.

## Not checked (no shell)
- Every git diff of a declared-unchanged path: `protocol/**`, `frontends/shell/src/**`, `frontends/shell/e2e/**`, `LICENSES/**`, `notice.mjs`, `portedNotices.mjs`, `index.html`, `commands.rs`, `tauri-build.yml`, `product-ci-shell.yml`, the lockfiles and kernel/tests/publish.rs.
- Every hash and the §7 numstat.
- The PR body (O1's pass recorded with B′).
- CI at the head, R1 and R2.
- Whether the worktree is clean.
