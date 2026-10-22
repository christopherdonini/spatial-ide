*Custodian's filing note (2026-10-22): the F7 piece's R-F7 (its form's §4 item 5) by a tester in #241's worktree at 2fc01f59: as predicted. The publish-bundle binary was rebuilt there first, being older than the head. The run 14:47:40Z to 14:55:44Z by its transcript (Grep 2, Read 4, Bash 7); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e706e83b1e81d8d53b3a52ab9eba369f957c0b4e171b1811cbdd38b48bb6fdfa.*

---

R-F7: walkthrough-row-f7-cli-refusal at #241's head 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d, tester

Model: the harness reports Sonnet 5.5 (claude-sonnet-5-5). No override. No context handoff. No usage figures.

Failure classes for this harness:
- Interface: I ran the product's own `publish-bundle.exe`, built from the worktree, with the old F7 command.
- Results claim: this report is the only results record. I wrote no file.
- Operator-facing lines: the stderr below is byte-copied from this run, at this commit.
- Assertion reached: the exit code, stderr, output directory and audit log were each checked after the run.

Result: as predicted

Steps (all foreground; output redirected to scratch files named f7-r-*; exit code printed right after each)
1. Worktree check, run in `C:/dev/wt/rds`:
   - `git status --porcelain --untracked-files=no` exited 0 with 0 bytes of output, so it is empty.
   - `git rev-parse HEAD` exited 0: 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d.
   - `renderer/bundle-viewer/dist/` exists and holds NOTICE.txt (163998 B), app.js and index.html.
   - `viewer-asset-hashes.json` is at `renderer/bundle-viewer/viewer-asset-hashes.json` (261 B). It does not exist at the worktree root. My first `ls` named both paths and exited 2 only because of the root one.
   - sha256 of `dist/NOTICE.txt`: 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
2. Build:
   - The existing binary was dated 2026-10-22 04:29:40 +0200. The head's commit time is 04:42:41 +0200, so the binary was older and I rebuilt.
   - Command: `cargo build -p spatial-kernel --bin publish-bundle`, with `CARGO_TARGET_DIR=D:/wt-targets/rds`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. It ran in one Bash call inside a shared hold, as the paragraph gives.
   - Build exit code 0. Last line of output: `Finished dev profile [unoptimized + debuginfo] target(s) in 5m 47s`.
   - New binary mtime: 2026-10-22 16:54:10 +0200.
   - Hold lines, mine only:
     - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...`
     - `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`
3. Inputs:
   - Style file: one line, F5's shape with F6's defaults (`#4285f4`, 0.7058823529411765, `#000000`, 0). sha256 f7ac115f1b7d4aac027926f4b50505ac71222b79b2cdc1a076a0fc773fb57e1c.
   - Data: Part E's `filter-zoned.parquet`, read only. sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. It matches the audit log's `source_content_hash`.
4. Run: the old F7 command, with the arguments below.
   - `--data` was `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\filter-zoned.parquet`.
   - `--style` was the scratch style file.
   - `--viewer` was `C:\dev\wt\rds\renderer\bundle-viewer\dist`.
   - `--out` was `<scratch>\f7-r-out\f7-r-bundle`, a new, absent directory under an empty, newly created parent.
   - `--name filter-zoned --attributes zone --viewer-program "Spatial IDE bundle viewer" --viewer-copyright "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors" --viewer-license AGPL-3.0-or-later --viewer-notice NOTICE.txt --corresponding-source-url "https://example.invalid/spatial-ide"`.
   - `--approve f7-r-bundle`, and `SPATIAL_IDE_AUDIT_LOG` set to a scratch file, `f7-r-audit.jsonl`.
   - Exit code 1. Stdout was empty.
   - Stderr, whole (the tool printed the audit-log line with a `<temp>/...` path):
```
[publish] class 3 external side effect (ADR-006), reversibility irreversible. Gated: scoped grant, explicit approval, audit record. Nothing here is exposed through SKP, MCP or any served surface.
[publish] pinning the source (a whole-file hash; cancellable)
[publish] pinned in 193.8 ms
[publish] audit log: <temp>/claude/C--dev-spatial-ide/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/f7-r-audit.jsonl
[publish] verifying-source
[publish] querying
[publish] the query orders by identity, so DuckDB sorts before the first row arrives; this phase can be quiet for a while on a large source
[publish] query-running
[publish] writing-partitions
[publish] partition 0: 2000 rows, 453128 B
[publish] writing-style
[publish] writing-viewer
[publish] writing-manifest
[publish] finalizing
[publish] [P6 placeholder] refused: the redaction scan (ADR-017 §13) found 3 match(es) in `viewer/NOTICE.txt` that are not operator-declared, the first of class `credential` at byte 19092; no bundle was created at the destination
```
5. Predictions:
   - Exit code 1: met.
   - Last stderr line begins `[publish] ` and names `viewer/NOTICE.txt`: met.
   - `--out` directory absent: met. Its parent `f7-r-out` is empty (`ls -A` gives 0 entries), so there is no `.f7-r-bundle.staging-*` sibling.
   - Last audit line is an outcome line: met. Its fields include `"phase":"outcome"`, `"outcome":"refused"` and `"error_kind":"RedactionFinding"`. The log has two lines, intent then outcome, and the same `attempt` id on both.
   - The tool's own `[P6 placeholder]` text, the class `credential` and byte 19092 appear in the stderr. §1 predicts none of them, and I make no claim about them.
6. After the run:
   - Tracked porcelain in `C:/dev/wt/rds` is empty (0 bytes, exit 0).
   - `tasklist` shows no `publish-bundle.exe`.
   - Two `cargo.exe` processes (pids 50036 and 26776) are present. My build call had returned exit 0 and I started no other cargo command, so I did not start them, and I touched neither.

I made no commit, push, PR action, tracked-file edit or `claude` command. I wrote only under `D:/wt-targets/rds` (the rebuilt binary) and my scratch folder, where every file is named `f7-r-*`.
