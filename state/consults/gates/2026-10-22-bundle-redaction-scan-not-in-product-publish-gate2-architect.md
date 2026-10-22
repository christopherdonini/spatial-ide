Reviewed: PR #241 at 95edf33be3640fd68dbed77f6d5055e6189506a1, the scoped re-gate after correction round 1, architect — cut/bundle-redaction-scan @ 95edf33be3640fd68dbed77f6d5055e6189506a1
Verdict: PASS WITH NOTES

I had no shell. I read each file at the head in C:/dev/wt/rds. The head comes from git's ref files: `refs/heads/cut/bundle-redaction-scan` and `refs/remotes/origin/cut/bundle-redaction-scan` both hold 95edf33b. The worktree's HEAD reflog shows one commit on 6a10ee24, with the subject "fix: the viewer build record matches by its bare hex digest; the gate holds one file's findings; scan-dist takes no test-only arguments (correction round 1)". I could not run any diff, hash, suite or mutation. Those are left to the reviewer's scoped check.

## Findings

### C — Correctness
None. C1, C2 and C3 are closed (checks 1 to 3).

### E — Evidence
- **E-1 (carried from gate 1; it blocks the merge, not this re-gate).** R1 and R2 have not run at 95edf33b (Amendment 6 item 2). Until they run, the viewer build → shell seam has a test proof from the real shape (T8 together with V3, check 1) but no run proof. Amendment 3 items 5 and 8 make R1 and R2 required before the merge. Gate 1's report already placed them after this round, so they open no new round.

### D — Documentation (must-fix before the merge, no re-gate; neither is the human's wording, so the worker applies the words and the PR body lists them)
- **D-A. renderer/bundle-viewer/scripts/scan-dist.mjs:16 does not state the hash form the consumer depends on.** The line names the value as `"<sha256>"`, and that ambiguity is what caused C1.
  - Replacement for line 16: `// rule), is `{"version":1,"assets":{"<dist-relative path>":"<sha256, 64 lowercase hex>"}}` over the bytes on disk. The`
  - Clause check: "64 lowercase hex" holds for `.digest('hex')` at scan-dist.mjs:94. V3 asserts that digest at scan-dist.test.mjs:86. It is Amendment 3 item 1's own token. Nothing else on the line changes.
- **D-B. frontends/shell/src-tauri/src/publish.rs:3273 overstates.** The comment says "Byte for byte as `scan-dist.mjs` writes it". The serialization is byte-equal, but for T8's directory (`index.html` and `NOTICE.txt`, :3265-3269) `scan-dist.mjs` would write two entries. T8 writes one.
  - Replacement for line 3273: `        // The serialization `scan-dist.mjs` writes: `JSON.stringify({version, assets})` and `\n`.` (98 columns)
  - Clause check:
    - "the serialization … writes": scan-dist.mjs:96, `writeFileSync(record, `${JSON.stringify({ version: 1, assets })}\n`, 'utf8');`.
    - T8's `format!` at publish.rs:3276 yields `{"version":1,"assets":{"NOTICE.txt":"<hex>"}}` followed by `\n`. That is the same bytes `JSON.stringify` gives for a one-entry map.
  - This changes only the comment. The test is unchanged.

## The six checks

1. **C1, closed.**
   - `is_built_asset` compares `canonical::sha256_hex(bytes).strip_prefix("sha256:") == Some(hash.as_str())` (kernel/src/publish/viewer_assets.rs:170). `sha256_hex` returns `format!("sha256:{:x}", …)` (renderer/src/canonical.rs:157, the same at the head). So the compared value is the bare lowercase hex that scan-dist.mjs:94 writes, which is Amendment 3 item 1's form and Amendment 5 item 2's correction. Its doc says "bare hex sha256" (:161).
   - U1 (:339-376) builds its record from the bare hex (:346-348). It keeps all five cases of Amendment 3 item 8, and its new assert is at :370-375: an entry in the `sha256:` form does not match ("an entry in the sha256: form").
   - T6 writes bare hex (kernel/tests/permission_boundary.rs:1168-1172). Its two halves are at :1191-1201 and :1206-1225.
   - T8 writes the record file in the producer's serialization (publish.rs:3270-3278). It reads that file through the real `bundled_viewer` → `read_build_record` (:1394, :1404-1435, `deny_unknown_fields` and version 1), then runs `prepare` and `execute` to `Success` (:3280-3292).
   - A return to the old comparison now fails U1's first assert, T6's first half and T8's first half.
   - The re-observations of M8 to M10 are the worker's (report-2). By line they agree with the asserts I read: U1 :352/:355 after the mutation's line shift, T6 :1214 and :1199, T8 :3284. Their runs are the reviewer's to confirm. See D-A and D-B for the record's wording.
2. **C2, closed.**
   - `main()` takes no parameters and is not exported (scan-dist.mjs:75). It reads `dist` and the record from `root` (:76-77), and `root` comes from the script's own location (:29-30). The only argv read is the main-module guard (:105-106), which calls `main()` with no arguments. The usage line reads `node scripts/scan-dist.mjs` (:19).
   - `compare` and `listFiles` stay exported, and their product caller is `main` (:87, :93), as the gate 1 reviewer accepted. The guard predates this round and only lets the test import them. No finding.
   - V1 (scan-dist.test.mjs:37-55) and V3 (:77-91) both go through `runOnCopy` (:22-35). It copies `redaction.rs` to `<tmp>/kernel/src/bundle/`, copies `scan-dist.mjs` and `scan-dist.rs` to `<tmp>/renderer/bundle-viewer/scripts/`, and copies `redaction-reviewed.json` and `dist/` beside them. It then spawns the copied script with no arguments (:33).
   - So the driver's `#[path = "../../../kernel/src/bundle/redaction.rs"]` (scan-dist.rs:12) resolves inside the mirror, and the real record is never touched. V3 still pins bare hex (:86).
3. **C3, closed by reading.**
   - With `first_only`, `walk` scans each file into its own `found` (kernel/src/bundle/redaction.rs:408). It returns `found` only when that holds a finding outside `OPERATOR_DECLARED` (:409-412). Otherwise `found` is dropped at the end of the iteration, before the next file is read. `findings` is extended only without `first_only` (:413-415).
   - That is §2.3's "Findings held" bound. The doc comment (:372-375) matches.
   - `first_undeclared_findings`'s output is unchanged (:366-369): it is one file's findings either way.
   - **No test or mutation for the bound: not a finding of any class.**
     - Not Correctness: the code now holds the claimed limit.
     - Not Evidence: the form requires no test for this derived bound (§2.3, and §7's "the findings held for one file have the derived bound §2.3 declares"). No return value can tell the two walks apart, so a mutation that restores accumulation would survive every test. That is the M7 kind (§4), and the gate's reading is the proof.
     - Not Documentation: no record text claims a test for the bound. The worker's report and the filing note already disclose this.
4. **D-2, applied.** renderer/bundle-viewer/scripts/scan-dist.rs:5 reads `//! own by `scan-dist.mjs`, from the same source file the kernel compiles (the `#[path]` below).`. That is byte-equal to the gate 1 reviewer's replacement. Lines 4 and 6 are intact.
5. **W4′, W5′ and W6′'s first sentence are now true.**
   - W4′'s inserted sentences (kernel/src/publish/mod.rs:938-942) and W5′'s clause (mod.rs:60-61) say a recorded `viewer/` file whose bytes match is not scanned again. That now holds through check 1 at the call site (mod.rs:957).
   - W6′'s first sentence (KNOWN-LIMITATIONS.md:416, the human's wording) holds:
     - the skip needs the staged bytes' hash to equal the entry for that path;
     - the record is removed first (scan-dist.mjs:78) and written only after the compare passes (:91, :96).
   - A case that does not block: a `dist/` file changed by another process between the scan (:81) and the hashing (:93-95) inside one build run. That needs timing inside a single developer build, and ordinary use of the shipped app does not reach it. It is recorded here because item 47 has no source comment.
6. **Nothing else changed beyond the report: in part.**
   - The reflog shows one commit on 6a10ee24.
   - Every file the report lists reads as the report describes: viewer_assets.rs, permission_boundary.rs, shell publish.rs, scan-dist.mjs, scan-dist.test.mjs, redaction.rs and scan-dist.rs.
   - In redaction.rs the change is the walk region and its doc comment. `scan` is at :228, and `mod tests` now starts at :421-422, moved +5 lines by the walk's growth. Byte identity of `mod tests` is the reviewer's to recompute.
   - The gate site (mod.rs:936-970) and W6′ are as gate 1 read them.
   - Not checked, with no shell: `git diff --stat 6a10ee24 95edf33b` (seven files, +52/-22), the §7 numstat (888 against 1,222; redaction.rs 62 of 66; viewer_assets.rs 31 outside `mod tests` against 50), the hashes, the suites and CI. These are the reviewer's.
