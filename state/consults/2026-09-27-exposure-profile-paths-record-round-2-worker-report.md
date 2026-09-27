*Custodian's filing note (2026-09-27): the exposure-profile-paths worker's hand-back for Amendment 12 (the final merge M‴) and Amendment 13 (record round 2; head `42ea38a`), transcribed from the hand-back messages with the harness's two-space indent removed. Worker reports, not gate reports; they print no profile-naming string. Path-and-line cites into the branch are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

4.7's last-bullet merge and Amendment 12 complete. No STOP fired.

**Head, M‴, N:**
- Worktree `C:/dev/wt/exposure-profile-paths`, branch `governance/exposure-profile-paths`.
- **Head = `2511028`** (Amendment 12).
- **M‴ = `3c25302`** — signed-off merge of `origin/main` (`3b421d5`) into the branch; parents `7f422a9` and `3b421d5`. Generated-file conflicts (`CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `PLAN.yaml`, `site/data/plan.json`, `site/index.html`) all auto-merged clean, no conflict markers (branch has no changes of its own to any of them); `queue.mjs --check` / `site.mjs --check` both current.
- **N = 6**, unchanged (main's highest Custodian-role heading at `3b421d5` is still Amendment 5).

**Results, with verbatim commands** (full detail in Amendment 12, `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 820-845):
- `git show origin/main:AI_DEVELOPMENT.md | grep -n "^## Amendment [0-9]* to the Custodian role"` — Amendment 5 highest → N=6.
- `git diff --name-only origin/main...HEAD | wc -l` — 19.
- `git diff --stat 955e6c7 3c25302 -- scripts/hooks/profile-path-scan.mjs scripts/hooks/profile-path-scan.test.mjs .githooks/pre-commit .githooks/commit-msg` — empty (4.4 re-observation not owed).
- `git diff --numstat origin/main...HEAD -- DECISIONS-PENDING.md` — 1/1; `git diff -U0 origin/main...HEAD -- DECISIONS-PENDING.md` — one hunk; `redactRoots(removed)===added` — true.
- Byte-prefix, all 5 targets true, 39 appended lines (unchanged).
- Re-derivation (`git ls-tree -r --name-only <rev>` / `git show <rev>:<path>`, this piece's own `scanText`): base `3b421d5` — 1124 files, 30 with findings; M‴ `3c25302` — 1128 files, 22 with findings. Both listings cross-checked programmatically byte-for-byte identical (same paths, form classes, counts) to Amendment 11's base/M″ listings — not re-carried in Amendment 12, per the record cap. The new `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md` you flagged carries 0 findings and is outside both lists; invalidator 1 does not fire.
- Prediction 4: `git rev-list --first-parent --reverse ccdccfd~1..3c25302` — 19 commits (Amendment 11's 17 plus `7f422a9`, `3c25302`), both ends named by id. All 19 PASS.
- Suites at M‴: node `349/349`; `cargo test -p spatial-kernel --no-fail-fast` (target dir set) — **281 passed, 0 failed, 28 ignored, 35 test binaries plus doc-tests** (clean, no flake this run); verify-cites PASS (840 files, 68 loose advised); verify-quotes PASS (110/79/30/1/0, 2 hash-baselined); verify-test-claims PASS (300/88 files).

**Step 4 (resolve-before-commit):** every sentence of Amendment 12 was checked against the actual command outputs above, including a diff-based cross-check confirming both re-derivation listings match Amendment 11's exactly. No mismatch found.

**Output discipline:** no raw `git diff`/`cat` on content that may hold a profile path; checks via node scripts printing only paths/classes/counts/booleans; scratch work in `C:/dev/exp-fix2-scratch` (fresh, deleted after — confirmed gone); no `$USERNAME`/`$COMPUTERNAME` printed; commit used `-s` and explicit paths; file set stayed 19; `PLAN.yaml` untouched by my own commits (only the merge commit carries it, via auto-merge from main).

Per your instruction, **not pushing.**

---

Amendment 13 (record round 2, the last under the record cap) complete. No STOP; main did not move (still `3b421d5`, confirmed by fetch before starting), so no merge was needed.

**Head = `42ea38a`** (worktree `C:/dev/wt/exposure-profile-paths`, branch `governance/exposure-profile-paths`; M‴ from the prior round stays `3c25302`; N stays 6). File set unchanged at 19; no code touched this round.

**R1's verbatim command line and result** (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 854-861):
```
node --input-type=module -e 'import { scanText } from "file:///C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs"; import { execFileSync, spawnSync } from "node:child_process"; import fs from "node:fs"; import os from "node:os"; import path from "node:path"; const REV = process.argv[1], OUT = process.argv[2], REPO = "C:/dev/wt/exposure-profile-paths", localName = path.basename(os.homedir()); const entries = execFileSync("git", ["-C", REPO, "ls-tree", "-r", "-z", REV], { maxBuffer: 1 << 28 }).toString("utf8").split("\0").filter(Boolean).map(l => { const t = l.indexOf("\t"), m = l.slice(0, t).split(" "); return { type: m[1], hash: m[2], path: l.slice(t + 1) }; }).filter(e => e.type === "blob"); const batchOut = spawnSync("git", ["-C", REPO, "cat-file", "--batch"], { input: entries.map(e => e.hash).join("\n") + "\n", maxBuffer: 1 << 30 }).stdout; let off = 0; const contents = new Map(); for (const e of entries) { const nl = batchOut.indexOf(10, off); const size = parseInt(batchOut.slice(off, nl).toString("utf8").split(" ")[2], 10); const cs = nl + 1; contents.set(e.hash, batchOut.slice(cs, cs + size).toString("utf8")); off = cs + size + 1; } let n = 0; const lines = []; for (const e of entries) { const content = contents.get(e.hash) || ""; const nf = scanText(e.path, { localName }), cf = scanText(content, { localName }), total = nf.length + cf.length; if (total > 0) { n++; const cc = {}; for (const f of [...nf, ...cf]) cc[f.class] = (cc[f.class] || 0) + 1; lines.push(`${e.path} | count:${total} | ${Object.entries(cc).sort().map(([c, v]) => `${c}=${v}`).join(",")}`); } } lines.sort(); fs.writeFileSync(OUT, lines.join("\n") + "\n"); console.log(`rev=${REV} file_count=${entries.length} files_with_findings=${n}`);' -- <rev> <out>
```
- At `3b421d5`: `file_count=1124 files_with_findings=30` — listing byte-for-byte identical to Amendment 11's base (`9c9616a`) listing.
- At `3c25302`: `file_count=1128 files_with_findings=22` — listing byte-for-byte identical to Amendment 11's M″ (`2b8813f`) listing.
- Verified three ways: against the earlier per-file `git show` method, against Amendment 11/12's already-committed text (programmatic diff, zero mismatches), and by extracting and re-executing the amendment's own committed command text after writing it, before this commit.

**R2's verbatim command line and result** (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 865-869):
```
node --input-type=module -e 'import { runVerifyCites } from "file:///C:/dev/wt/exposure-profile-paths/scripts/plan/verify-cites.mjs"; const branch = runVerifyCites({ repoRoot: "C:/dev/wt/exposure-profile-paths" }); const main = runVerifyCites({ repoRoot: "C:/dev/spatial-ide" }); const key = f => `${f.relPath}:${f.citeLine}->${f.target}`; const mainSet = new Set(main.advisory.map(key)); const branchOnly = branch.advisory.filter(f => !mainSet.has(key(f))); console.log(`branch_loose=${branch.advisory.length} main_loose=${main.advisory.length} branch_only=${branchOnly.length}`);'
```
- Result: `branch_loose=68 main_loose=75 branch_only=0`. Used the main checkout at `C:/dev/spatial-ide`, confirmed at `3b421d5` via `git rev-parse HEAD` before running.

**Also done:** added Amendment 8's Minutes bullet and its last bullet ("Amendment 8 supersedes Amendment 5. The Budget line is never edited.") to Amendment 13's own superseded index (the reviewer's N2 — neither had been indexed). No action on N1, N3, N4.

**Resolve-before-commit:** every sentence of Amendment 13 checked against the runs above before committing; no mismatch. Both command blocks were extracted verbatim from the committed file and re-executed to confirm they reproduce the recorded results exactly.

**Output discipline:** no raw diff/cat on content that may hold a profile path; scratch work in `C:/dev/exp-fix2-scratch` (fresh, deleted after — confirmed gone); commit used `-s` and an explicit path; file set stayed 19.

Not pushed, per instruction.
