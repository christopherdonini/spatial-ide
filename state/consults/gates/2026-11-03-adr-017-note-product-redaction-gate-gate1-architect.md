Reviewed: PR #276 at ab2ca383389d18a4e2bd3209bd3500de4ae34cba, gate 1, architect
cut/adr-017-note-product-redaction-gate @ ab2ca383389d18a4e2bd3209bd3500de4ae34cba
Verdict: FAIL

The FAIL is the failure §5 predicted, and it is the only one. Four clauses of the human's words state a guarantee or a limit the code does not support: 1.1, 3.4, 4.4 and 4.5. Clause 1.4 is untrue when item 1 is read alone. These are Correctness findings. All of them are among the seven clauses §2.2 already lists for the human under OPEN-1, so §5's invalidator is not met. I found no untrue clause outside that list. Every other check is clear. Under §9, the FAIL clears clause by clause on the human's typed answer, recorded as a class 5 amendment. A clause accepted as typed stops blocking with no re-gate. The human's own words get one check. The gate substitutes no words.

I have no shell, so I recomputed no sha256 and ran no byte compare, git command or gh call. I leave no background shell. Code cites below are path:line read in main's checkout at 6dff90e9. The custodian's check says main's code equals B's (f975d609, a commit on main). Every span was found by symbol, and the line numbers I found match the pin table's at ca8e44f1.

## Findings by class

**Correctness. The human's clauses, already under OPEN-1 (no words from me; they go to the human with their spans):**
- **1.1, untrue.** Recorded viewer files are passed over at publish (`ViewerAssets::is_built_asset`, kernel/src/publish/viewer_assets.rs:164-172, called from kernel/src/publish/mod.rs:957). The build's scan of those files uses `MachineIdentifiers::default()` (renderer/bundle-viewer/scripts/scan-dist.rs:20). The reviewed list allows matches that then ship. **Addition to the draft's span:** renderer/bundle-viewer/redaction-reviewed.json has three rows, not two. Rows 4-5 are in `NOTICE.txt`. Row 6 is a `local-filesystem-path` match in `app.js` at offset 7291, which the shell's bundles also carry. Against §13 (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:502-504), the product's check is narrower.
- **1.4, untrue read alone.** `walk` passes a file over when `skip` returns true (kernel/src/bundle/redaction.rs:405-407). Item 1 does not point to item 3.
- **3.4, untrue.** The build runs the same `scan` through `scan_directory` (redaction.rs:346-353, scan-dist.rs:12-13, :21). It runs with no usernames, hostnames or declared strings (scan-dist.rs:20; the `Default` derive at redaction.rs:97-98). The publish runs with the environment's identities and two declared strings (mod.rs:946-952). So the build's scan cannot find the `username` or `machine-identifier` classes (redaction.rs:287-312).
- **4.4, untrue as joined by "or".** More than one unchecked section runs between two checks:
  - from `watch.check()` at mod.rs:910 to the gate's first per-file check: `verify_by_heuristic` (:915), `total_bytes` (:920), the sidecar's `File::create`, `write_all` and `sync_all` (:931-934 through :1580, :1586-1588 and :1615), then the root `read_dir` (redaction.rs:387);
  - after the last file's check: its read and scan, `total_bytes` (:973), then `finalize` (:974).
  - **Addition to the draft's span:** inside the gate, `walk` pops each subdirectory (`viewer/`, `data/`) and runs `read_dir` and the sort (redaction.rs:386-391) after the previous file's scan and before the next `before_each_file()` (:398). For `data/`, that listing covers up to `MAX_PUBLISH_PARTITIONS` entries.
  - Corrigendum 4's own sentence (ADR-017:1089-1090) joins its terms with "and".
- **4.5, untrue claim of a limit.** No declared byte ceiling covers one file's read and scan:
  - `manifest.json`, `style.json` and `build-info.json` have none;
  - a partition is bounded only on the producer's estimate (`MAX_BATCH_BYTES`, engine/src/stream.rs:49, :209, :2491-2506);
  - viewer files are bounded by `MAX_VIEWER_ASSET_BYTES` (viewer_assets.rs:38).
  - The site's own comment says the bound is that file's own size (mod.rs:942-944).
  - The "in time not at all" half is true.

**Correctness, outside the seven:** none.
**Evidence:** none from me. E1 to E11 are the reviewer's.
**Documentation outside the human's words:** none.

## Check 1: §2.2 clause by clause at H, against B's code

- **H.1: true, with item 3's exception.** The gate is at mod.rs:953-970.
- **H.2: true.** governance/PLAN.yaml:5712 shows the bracketed node `status: done`, and :5717 shows `pr: 241`.
- **I.1: true.** The ruling is the 2026-10-28 directive, item G.
- **I.2: true on my reading.**
  - Main's ADR-017 ends at line 1159. I read its lines 1140-1159 and the head's lines 1085-1159, and they read alike.
  - The Status line is line 3 in both, identical. Corrigendum 4's sentence is at 1089-1090 in both.
  - The byte proof is E2, the reviewer's.
- **1.1: untrue,** as above.
- **1.2: true.** Both go through `boundary::execute`: the shell at frontends/shell/src-tauri/src/publish.rs:832, and `publish-bundle` at kernel/src/bin/publish-bundle.rs:669. From there the path runs `publish_prepared` (boundary.rs:426), then mod.rs:642, then `run`, then the gate.
- **1.3: true.** `publish_unguarded` (mod.rs:611-618) runs `preflight` and then `publish_prepared`. Its only callers are tests (Grep over *.rs).
- **1.4: untrue read alone,** as above.
- **1.5: true.** `std::fs::read` reads the staged path (redaction.rs:404).
- **1.6: true.** The sidecar is the last write (mod.rs:931-934). The gate is at :953, and `finalize` follows at :974.
- **1.7: true.** mod.rs:946-952 uses the same two fields the format suite declares (kernel/tests/publish.rs:436-440).
- **2.1: true at the type level.**
  - `RedactionFinding` maps to `publish.redaction_finding` (kernel/src/publish/error.rs:283).
  - The CLI prints `Display` only (publish-bundle.rs:182). The shell carries `refusal_detail` (publish.rs:860-862).
  - Where staging cannot be removed, the code is `publish.staging_not_removed` (error.rs:287). That is 2.2's case below.
- **2.2: true on the ordinary path, with gaps,** listed under the seven below.
- **2.3: true.** The path is made bundle-relative at redaction.rs:399-403, and the `Display` names it (error.rs:422-427).
- **2.4: true.** `sort_by_key(byte_offset)` (redaction.rs:368), then `found[0]` (mod.rs:966-967).
- **2.5: true, counting undeclared matches.** `retain` drops `OPERATOR_DECLARED` (redaction.rs:367) before `found.len()` (mod.rs:968).
- **2.6: true.** The variant has no excerpt (error.rs:192-197). `finish` records `error_kind` only (boundary.rs:485-500).
- **2.7: true.** The return at mod.rs:964 comes before `finalize` at :974.
- **2.8: true.** mod.rs:642-657.
- **3.1: true.**
  - Contact read at B: `canonical::sha256_hex` returns `sha256:` plus lowercase hex (renderer/src/canonical.rs:153-158).
  - `is_built_asset` strips that prefix and compares the hex with the record's entry for the same viewer-relative path (viewer_assets.rs:164-172).
  - The shell reads `viewer-asset-hashes.json` (publish.rs:1394, :1399, :1406-1437). It is the only product caller of `with_build_record`.
- **3.2: the path is viewer-relative,** listed under the seven below.
- **3.3: true.**
  - The old record is removed first (scan-dist.mjs:78), and the script returns before writing on any unreviewed finding (:88-91).
  - The hashes come from a second read of `dist/` after the scan (:93-95). A file changed between the scan and that read, inside one build run, is outside ordinary use.
- **3.4: untrue,** as above.
- **3.5: true.** Findings are compared with reviewed rows by file, class and offset (scan-dist.mjs:33-39, :81, :86-87).
- **3.6: true.** No entry gives `false`, and the file goes to `scan` (redaction.rs:408).
- **4.1: true.** One whole-file read per file (redaction.rs:404-408).
- **4.2: true.** `before_each_file()` runs before each read (redaction.rs:398), wired to `watch.check()` (mod.rs:956).
- **4.3: true.** No measurement exists.
- **4.4 and 4.5: untrue,** as above.
- **5.1: true.** `BUNDLE_VERSION` is 1 (kernel/src/bundle/mod.rs:53).
- **5.2: true.** The gate writes nothing (mod.rs:936-970).
- **5.3: true.** KNOWN-LIMITATIONS.md:420.
- **5.4: true.** KNOWN-LIMITATIONS.md:413-418.

### The seven clauses, my reading at H against each span

- **1.1: agrees with its span.** The span gains the `app.js` row (redaction-reviewed.json:6). This is a guarantee claim, so it is Correctness.
- **1.4: agrees.** Untrue read alone, true with item 3.
- **2.2: agrees.**
  - When staging cannot be removed, `error_kind` is `StagingNotRemoved` (boundary.rs:244), and the outcome stays `refused` through `publish_outcome(after)` (:284, :303). Ordinary use can reach this.
  - Two more cases, neither reachable by ordinary use:
    - a `publish_unguarded` refusal writes no audit record (no product caller);
    - a failed audit append writes no record and only prints to stderr (boundary.rs:501-507).
- **3.2: agrees.** No root `scripts/scan-dist.mjs` exists. The tracked file is renderer/bundle-viewer/scripts/scan-dist.mjs. Its own usage line (:19) and the shell's comment (publish.rs:1398) name it relative to the viewer directory.
- **3.4: agrees.** Untrue, as above.
- **4.4: agrees.** Untrue. The span gains the subdirectory `read_dir`.
- **4.5: agrees.** Untrue claim of a limit.

## Check 2: the human's recorded answers

None is recorded. The form's §10 holds no class 5 amendment, and its settlement leaves OPEN-1 waiting on the human. The PR's one file is the ADR, and the note records no answer. I could not read the PR body (no gh).

## Check 3: §8 item by item, against the head

1. **Clear on my reading.** The byte proof is E2.
2. **Clear by eye.** Head line 1160 is blank, and lines 1161-1169 read the same as the directive's lines 29-37. The byte proof is E4.
3. **Holds the merge.** No answer is recorded, and the PR is a draft.
4. **Clear by the custodian's git check and the worker's numstat.** That is one file and nothing under protocol/. I could not run git.
5. **Clear.** Grep on the head finds `**Status:**` only at line 3.
6. **Clear.** The note carries no DECISIONS-PENDING cite, no line cite and no hash. The form's pins are at ca8e44f1, a commit on main.
7. **Clear.** The note makes no tool claim.
8. **Clear.** The worker ran 12:56:45Z to 13:24:15Z by the filing note, inside the 45-minute budget. §7 reads as drafted. There is no scope addition, no verify-mutation run and no test-text span.

## Check 4: the record

The PR is the single append and goes no further than the settlement:
- docs/02, CANCELLATION-AND-TRACING.md and the redaction form are not touched.
- PLAN.yaml places no node for OPEN-4 (c): Grep for `02_Architecture.md:80` in PLAN.yaml finds none.
- The node's summary (governance/PLAN.yaml:6045) records OPEN-2 to OPEN-6 as taken under the 2026-10-31 direction, item 4, for the human's review.

Not a finding of mine, for the reviewer: the worker report's E8 ran `node scripts/adrIndex.mjs --check`, while the form names `npm run verify:adr-index`.

Files: C:/dev/wt/a017/docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, C:/dev/spatial-ide/governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md, C:/dev/spatial-ide/kernel/src/publish/mod.rs, C:/dev/spatial-ide/kernel/src/bundle/redaction.rs, C:/dev/spatial-ide/kernel/src/publish/viewer_assets.rs, C:/dev/spatial-ide/kernel/src/permission/boundary.rs, C:/dev/spatial-ide/renderer/bundle-viewer/redaction-reviewed.json, C:/dev/spatial-ide/renderer/bundle-viewer/scripts/scan-dist.rs
