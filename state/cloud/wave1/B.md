# Wave 1, B (batch 3, alone): the session's report

**Source:** session_01VQQsDu87TyJwwusSdt4GL8, the final assistant turn, copied at 2026-09-26 about 01:15Z with the message's own Copy action in claude.ai/code, and saved with LF line endings. Everything between the two rules below is the session's text, verbatim. The WAVE1 REPORT proper begins at `# WAVE1 REPORT`; the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally, per `state/cloud/wave1-prompts.md` §3.

---

Setting up is done; now hunting the repository for the corpus's full hashes and the commands that produced each file (its own manifest lives outside the repo).

Fetching the spec example (#11) at the pinned `main` commit to test it against the recorded 12-hex prefix.

Manifest drafted; fixing a few line cites, then writing the verify script.

Now the fail-closed checks: a tampered local file, and a manifest with a wrong hash.

Fail-closed behaviour confirmed. Writing the README.

The hook rejected the unsigned commit and HEAD didn't move. Committing, signed off.

Pushed. Opening the one PR (not merging).

# WAVE1 REPORT
## Worker fields
Item: B          Lens/purpose: make the compatibility corpus reproducible without committing any third-party data
Baseline SHA: bb98f71f43a2891d317b10a124387df9d5ee0ebf (confirmed with `git -C /tmp/wave1-baseline rev-parse HEAD` at start)
Branch: cloud/wave1-B   Commits: bbd8f03b03543db86fe93f594a05da782700acad. Proposal PR, not merged: https://github.com/christopherdonini/spatial-ide/pull/124
Environment: Linux 6.18.44 cloud container · rustc 1.94.1 · cargo 1.94.1 · node v22.22.2 · npm 10.9.7 · Python 3.11.15. Network actually used: only `raw.githubusercontent.com`, for `opengeospatial/geoparquet` at commits `4c9f87e5…` and `0c7fab74…`. No package registry was used. No tool was installed, because no regeneration command exists to run with one.

Commands run (exit codes):
- `git worktree add /tmp/wave1-baseline bb98f71…` → 0
- `curl` of `examples/example.parquet` at `4c9f87e5…` and at `0c7fab74…` → 200 both, 28,438 B, sha256 `ff90b4800d71b94c…38767` both. Same host, `LICENSE` at `4c9f87e5…` → 200, Apache-2.0.
- `node tools/corpus/fetch-verify.mjs --out <scratch>` → 0 (#11 fetched, hash matches). Second run → 0 (#11 already present, hash matches).
- The same with `--all` → 1 (1 of 12 verified: 8 refused for having no pinned hash, 3 absent because they are writer outputs).
- #11's local file tampered with → 1 (MISMATCH).
- Manifest copy with a wrong hash → 1 (MISMATCH, nothing written).
- `--id '#99'` → 2 (usage error).
- DCO: `git config core.hooksPath .githooks`, then an unsigned `git commit` → 1, rejected by the hook, HEAD unchanged. Signed `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s` → 0.
- `git push -u origin cloud/wave1-B` → 0.

I did not run the reviewer agent over the 85-line script.

Findings: 5

### Finding B-1
Claim: None of the six GeoPandas and DuckDB files (#1–#6) can be regenerated from the repository, because their generator scripts are not tracked anywhere.
Suggested severity: S2
Code path: `engine/tests/admission_p4_corpus.rs:65` (`CORPUS_ROOT = C:\dev\…\compat-corpus`) → `state/cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md:204` ("generator/observer scripts copied beside it (scripts/)", under the untracked `target/`)
Reproducer: `node tools/corpus/fetch-verify.mjs --out <dir> --all` → #1 and #3 report ABSENT; #2 and #4–#6 report REFUSED
Guarantee violated: none stated (the task's reproducibility goal)
Evidence: The tools and versions are recorded: GeoPandas 1.1.4, pyarrow 25.0.1, DuckDB 1.5.5. The geometry source, the SQL and the scripts are not recorded, and neither is the DuckDB spatial extension version. Only #1 and #3 have a full sha256 in the repository (`MANUAL-WALKTHROUGH.md:934-935`).
False-positive check: I grepped the whole tree for every file name, every hash prefix, `PROBE.json`, `gen scripts` and tool versions. The only mentions are in documentation.
Confidence: proven (absence in the tracked tree)

### Finding B-2
Claim: The four GDAL and QGIS files (#7–#10) cannot be reproduced. Their source input (except #8's) and their exact commands are unrecorded. #10 in particular needs the Windows build of QGIS 3.44.2.
Suggested severity: S2
Code path: `engine/ADMISSION-PREREGISTRATION.md:90-93` → `CUT-STATE-2026-09-13-release-0.1.0.md:211`. The only command fragment recorded is `-lco WRITE_COVERING_BBOX=NO`.
Reproducer: same command as B-1
Guarantee violated: none stated
Evidence: The writer was GDAL 3.11.3 inside QGIS 3.44.2 on Windows. A Linux build links different library builds, and nothing establishes that it would produce the same Parquet bytes. #8's source is #3, which is itself unreproducible.
False-positive check: I searched the whole tree for `ogr2ogr` and `savefeatures`. The only mentions are descriptive.
Confidence: proven (absence)

### Finding B-3
Claim: #12, the Overture Bern extract, cannot be re-derived, because the `--bbox` passed to overturemaps CLI 1.0.2 is not recorded.
Suggested severity: S2
Code path: `engine/ADMISSION-PREREGISTRATION.md:95`; `CUT-STATE-2026-09-13-release-0.1.0.md:204`
Reproducer: code path only
Guarantee violated: none stated
Evidence: The release (2026-08-19.0) and the tool version are recorded. The bbox and the full hash are not.
False-positive check: I grepped for `overture` together with bbox and coordinate patterns and found nothing.
Confidence: code-path-only

### Finding B-4
Claim: Nine of the twelve files have only a 12-hex (48-bit) sha256 prefix in the repository, so a fail-closed verifier has no full hash to check them against.
Suggested severity: S3
Code path: `engine/ADMISSION-PREREGISTRATION.md:80` ("first 12 hex of each observed block's sha256")
Reproducer: `--all` run → the "REFUSED no pinned sha256" rows
Guarantee violated: none stated
Evidence: The full hashes exist only in the untracked manifest (its sha256 is `4b1fbca6…af6b3`, per `ADMISSION-RESULTS.md:8`).
False-positive check: I grepped each prefix extended to 64 hex characters across the whole tree. Only #1, #3 and #8 have a full hash anywhere.
Confidence: proven

### Finding B-5
Claim: Only #11 (Apache-2.0) has a stated licence. The licences of the other eleven files are not recorded anywhere in the repository.
Suggested severity: S3
Code path: `engine/ADMISSION-PREREGISTRATION.md` §3 has no licence column; `kernel/FIXTURES.md` does not cover the corpus.
Reproducer: code path only
Guarantee violated: none stated
Evidence: I left the licence as `null` in the manifest and did not assert one.
False-positive check: I grepped the preregistration and the corpus records for "licen". There are no licence hits for any corpus file.
Confidence: proven (absence)

### Unproven observations (not findings)
- #11 matches only on the 48-bit prefix. The commit actually downloaded on 2026-09-10 is not recorded, so identity with the corpus copy is not proven beyond that prefix. The same bytes are served at `v2.0.0-rc.1`.
- `kernel/FIXTURES.md` records only `parcels-5gb.parquet`. The corpus has no entry there, although by that file's own criterion it is expensive to recover.

### Stops
- **Licence unclear** for #1–#10 and #12 (B-5, preregistration §3 at `engine/ADMISSION-PREREGISTRATION.md:82-95`). I recorded these as `null` and did not decide them.
- **Would grow beyond scope or require improvising** (B-1 to B-4): reconstructing generator scripts, SQL, `ogr2ogr` or `qgis_process` commands, or the Bern bbox from nothing would be invention. Filling these gaps needs the corpus of record's own `MANIFEST.json` and `scripts/` from the Windows machine (`target/fixtures/compat-corpus/`). The committed proposal is therefore partial by design: every gap is explicit and the script refuses every unpinned entry. I stopped before installing any writer tool, because there was no command to run with it.

---

## Custodian fields (filled locally, never by the worker)

Session ID: session_01VQQsDu87TyJwwusSdt4GL8   Model: Opus 5.5, Medium (as launched)   Launched/ended: 2026-09-26T00:20:10Z / the report posted by about 00:25Z (its commit bbd8f03 at 00:23:53Z).
Spend: not individually attributable; batch delta $2 (B alone). Cloud session credits read "$221 of $250 left" at 00:19:39Z and "$219 of $250 left" at 01:16:06Z after a refresh. The page shows whole dollars only. The wave's total, from the first reading to this one, is $250 → $219, or $31.

Pull request: #124, "Wave 1 B: reproducible corpus (proposal)". It is open and not a draft. Its three files are under the new `tools/corpus/` (+324). At 01:16Z its one check read: every commit is signed off, pass. Whether it merges is the human's decision.

**The stops were taken correctly.** The worker stopped on "licence unclear" (§7 B's stop condition) and on "would grow beyond scope", and it left every unpinned entry refused rather than inventing a command. Both are the prompt's own stops.

**The corpus of record is on this machine.** Its `MANIFEST.json` and `scripts/` sit under the untracked `target/fixtures/compat-corpus/`, as the worker inferred. A listing at 01:15Z shows `MANIFEST.json`, `PROBE.json`, `README.md` and `scripts/`, holding `gen_geopandas.py`, `gen_duckdb.py`, `gen_gdal.py`, `gen_qgis.py`, `gen_mutations.py`, `build_manifest.py`, `observe.py`, `probe_producers.py` and `qgis_env.py`. The gaps in B-1 to B-4 can therefore be filled locally, by a later piece; the cloud session could not reach them.

Triage against main (wave-1 rule 1): `engine/ADMISSION-PREREGISTRATION.md`, `kernel/FIXTURES.md` and the cut-state archive are unchanged since bb98f71, so every item below is **still-present**.

- **B-1, B-2, B-3** (the generator scripts, the GDAL/QGIS commands and the Bern bbox are untracked): RECORD, S2. They are recorded as one note, "the corpus of record's scripts and manifest are untracked". A later piece commits them, with their full hashes and without any data file.
- **B-4** (only 12-hex prefixes are tracked for nine files): RECORD, S2. It is the same note; the full hashes are in the local `MANIFEST.json`.
- **B-5** (no licence recorded for eleven of the twelve files): to the human in the after-wave batch. §5 flagged B's licences for attention, and whether any corpus bytes or their derived manifest may be committed publicly is a public-exposure question (ADR-009).

Unproven observations:
1. RECORD, S2: #11's identity rests on a 48-bit prefix. The local `MANIFEST.json` holds its full hash, and the same later piece checks it.
2. RECORD, S2: `kernel/FIXTURES.md` does not cover the corpus. The same note.

Reproduced locally (Windows): not attempted. These are absences in the tracked tree, and the local listing above confirms where the missing records are.
