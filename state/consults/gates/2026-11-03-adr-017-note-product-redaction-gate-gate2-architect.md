Reviewed: PR #276 at c614cc5c9a446106f61c6a7e9f3d178ee358f28b, gate 2, architect
Verdict: PASS WITH NOTES
cut/adr-017-note-product-redaction-gate @ c614cc5c9a446106f61c6a7e9f3d178ee358f28b

I have no shell, so I computed no sha256, including the brief's, and ran no byte compare or git command. I leave no background shell. I read ADR-017 at H2 in C:/dev/wt/a017. I also read the code in that worktree. Gate 1's reviewer check and the custodian's numstat show B..H2 changes only ADR-017, so the worktree's code files are B's. I did not diff main against B. Every cite below is path:line in that worktree, with each span found by its symbol.

## Findings by class

**Correctness: none.** Each of the seven clauses, in the human's words, holds at B's code. Two notes follow. Neither overstates a bound, and I do not count either as an untrue clause. I give no words.
- **N1, 4.4, the zero-partition publish.** A source that matches nothing writes no partitions and still publishes (kernel/src/publish/mod.rs:739, :825-830). `data/` is then empty. The walk pops `viewer/` before `data/`, because `data` is pushed first (kernel/src/bundle/redaction.rs:385-396). So in that case:
  - the last file checked is a viewer file, whose term is its read and hash;
  - the empty `data/` listing (:387-391) runs after that file's check, before `total_bytes` and `finalize` (mod.rs:973-974).
  - The parenthetical for the stretch after the last file's check names its read and scan, the byte total and the rename. It leaves out that one empty listing. Every term in the stretch is still of a kind the window sentence names and bounds. An operator cannot see the difference without an instrumented build (trace spans).
  - When at least one partition is written, the last file is a partition, and the parenthetical is exact.
- **N2, 4.4, the per-entry `is_dir`.** Each directory entry gets a `path.is_dir()` metadata call before that entry's check (redaction.rs:394). I read it as part of that directory's listing. No clause names it on its own.

**Evidence: none.** E1 to E11 at H2 are the reviewer's.

**Documentation: none.**

**Block-on-sight (§8 items 1 and 2, as Amendment 1 reads item 2):** I read nothing outside the seven as changed (check 3). The byte proof is the reviewer's.

## Check 1: the seven clauses at H2 (ADR-017:1165-1168) against B's code

- **1.1 holds.**
  - The product runs the scan at the gate: kernel/src/publish/mod.rs:953-970.
  - The exception is the skip: kernel/src/publish/viewer_assets.rs:164-172, called from mod.rs:957.
  - The format suite uses the same `MachineIdentifiers` construction as the product (kernel/tests/publish.rs:437-440 against mod.rs:946-952). So the only ways the product's check is narrower than the suite's are the ones item 3 now states: the skip, the build run's missing identities, and the reviewed matches that ship.
  - My reading: the scan's own limits are not product-specific narrowings, and they are already stated elsewhere. They are §13's stated limits (ADR-017:506-511), Corrigendum 3's declared-string re-class (ADR-017:931-948) and KNOWN-LIMITATIONS item 47 (item 5).
- **1.4 holds.** `walk` reads each staged file (redaction.rs:404). It passes the file over only when `skip` is true (:405-407), and that `skip` is item 3's (mod.rs:957). Otherwise it calls `scan` (:408).
- **2.2 holds.**
  - The gate returns before `finalize` (mod.rs:964 against :974).
  - On any `run` error the staging directory is removed. If removal fails, the error becomes `StagingNotRemoved` with the finding carried in `after` (mod.rs:642-657).
  - The code is `publish.staging_not_removed` (kernel/src/publish/error.rs:287), and `error_kind` is `StagingNotRemoved` (kernel/src/permission/boundary.rs:244).
  - The outcome is taken from the inner cause, `publish_outcome(after)`, and `RedactionFinding` maps to Refused (boundary.rs:284, :303-305). It is recorded through `finish` (boundary.rs:485-500).
  - The shell carries the typed code (frontends/shell/src-tauri/src/publish.rs:860-862).
- **3.2 holds.** All three paths are real from the root:
  - `scan-dist.mjs` sets its root to `renderer/bundle-viewer` (renderer/bundle-viewer/scripts/scan-dist.mjs:30). It writes `viewer-asset-hashes.json` there (:77, :96) and reads `redaction-reviewed.json` there (:86).
  - The script is tracked at renderer/bundle-viewer/scripts/scan-dist.mjs and run by the build (renderer/bundle-viewer/package.json:9).
  - The shell ships the record from that path (frontends/shell/src-tauri/tauri.conf.json:42).
- **3.4 holds.**
  - The build runs `redaction::scan_directory` (renderer/bundle-viewer/scripts/scan-dist.rs:12-13, :21) with `MachineIdentifiers::default()` (:20). The `Default` derive leaves usernames, hostnames and declared strings empty (redaction.rs:97-119).
  - The `username` and `machine-identifier` classes come only from those lists (redaction.rs:287-312). So the build run finds only credential words and paths (:154-174, :266-285).
  - **The count:** renderer/bundle-viewer/redaction-reviewed.json holds three rows, two with file `NOTICE.txt` (:4-5) and one with file `app.js` (:6). That matches the clause's three, two and one.
  - **The shipping:** the shell publishes every file of `dist/` (publish.rs:1372, :1383-1395; viewer_assets.rs:93-151) and skips those whose hashes match the record.
  - **Corroboration only:** a Grep with the scanner's needles over the main checkout's untracked `renderer/bundle-viewer/dist` found exactly three hits:
    - `password` at NOTICE.txt line 370;
    - `/Home/` at NOTICE.txt line 2205;
    - a drive letter after a backtick at app.js line 235.
  - Their classes and files match the three rows. That `dist/` is the checkout's last build, not a build of B, and I could not check the byte offsets.
- **4.4 holds, with N1 and N2.**
  - The terms: one file's read and scan (redaction.rs:398-408); for a skipped viewer file, a read and a sha256 (viewer_assets.rs:170); one directory's listing and sort between two files (redaction.rs:387-391).
  - The staging tree is flat: root, `data/`, and `viewer/` from `dist/*` (publish.rs:1371-1375).
  - The first stretch runs from `watch.check()` (mod.rs:910) through the heuristic re-check (:915), the byte total (:920), and the sidecar's create, write and sync (:931-934 → :1580, :1586-1588, :1615). Then come the environment read (:951, which reads only environment variables, redaction.rs:125-150) and the root listing (:387). The first per-file check follows (:398).
  - The second stretch is the last file's read and scan, the byte total (mod.rs:973) and the rename (`finalize`, :974 → :1652-1664).
  - The words "as the redaction form records" match governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:151 and :153.
  - Corrigendum 4 joins its terms with "and" (ADR-017:1089-1090).
- **4.5 holds.**
  - Bound 1: `MAX_BATCH_BYTES` = 4 MiB (engine/src/stream.rs:49). It is enforced on the estimate (:2491-2505).
  - Bound 2: `MAX_VIEWER_ASSET_BYTES` = 16 MiB (viewer_assets.rs:38), checked at `ViewerAssets::new` (:69-75).
  - Bound 3: `manifest.json`, `style.json` and `build-info.json` have no byte ceiling. Grep finds no such constant in *.rs, and ADR-017 §16 (:595-606) lists none.
  - Cancellation is checked before each file (redaction.rs:398, wired at mod.rs:956).
  - My reading: "no declared ceiling" applies to the term across all staged files, and the parenthetical names the viewer file's declared bound. So no limit is overstated.

## Check 2: the custodian's 1.4 reading

The reading is the human's evident intent. The human's insertion begins and ends with a comma (the directive of 2026-11-03, line 10). The anchor in the original text is already followed by a comma (the 2026-10-28 directive, line 33). Inserted literally, the text would carry a doubled comma. H2 carries one comma (ADR-017:1165), so the two readings differ by exactly that one byte.

## Check 3: nothing else changed (by eye; the byte proof is the reviewer's)

I compared H2's lines 1161-1169 with the 2026-10-28 directive's lines 29-37. Gate 1 proved those directive lines equal to H's note (gate 1 reviewer, check 1). What I found:
- The heading (:1161), the italic line (:1163) and item 5 (:1169) read the same.
- Item 1 matches outside the 1.1 sentence and the 1.4 insertion.
- Item 2's first two sentences match.
- Item 3's text matches outside the three path edits, the 3.4 phrase and the 3.4 sentences, which sit before its unchanged last sentence.
- Item 4 is exactly the 4.5 sentence followed by the 4.4 sentences.
- Lines 1160, 1162 and 1164 are blank.
- That makes 10 edits, as Amendment 1 says. I read the ADR's lines 1080-1160 only. That the bytes above the note are unchanged is the reviewer's check, and the worker report's prefix hash.

## Check 4: Amendment 1 against the directive of 2026-11-03, lines 8-16

Amendment 1 records what those lines give, and adds no clause of substance beyond the 1.4 reading it discloses:
- **The answers:** the human's own words for all seven clauses (lines 9-15), OPEN-1 (ii).
- **The scope:** every other clause stays byte for byte, and the gate checks only these (line 8).
- **The click:** out of draft for the human's click (line 16).
- **The edit count:** 1+1+1+3+2+1+1 = 10, which follows from lines 9-15.
- **The re-read of E4, §1 and §8 item 2:** this is the necessary consequence of the human's words replacing appended bytes, not a new clause. §8 item 3 is met by the amendment itself.
- **The pin:** its cite of the directive is at 652752af, a commit on main.

Files: C:/dev/wt/a017/docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, C:/dev/spatial-ide/governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md, C:/dev/wt/a017/kernel/src/bundle/redaction.rs, C:/dev/wt/a017/kernel/src/publish/mod.rs, C:/dev/wt/a017/kernel/src/publish/viewer_assets.rs, C:/dev/wt/a017/kernel/src/permission/boundary.rs, C:/dev/wt/a017/renderer/bundle-viewer/redaction-reviewed.json, C:/dev/wt/a017/renderer/bundle-viewer/scripts/scan-dist.rs, C:/dev/wt/a017/renderer/bundle-viewer/scripts/scan-dist.mjs
