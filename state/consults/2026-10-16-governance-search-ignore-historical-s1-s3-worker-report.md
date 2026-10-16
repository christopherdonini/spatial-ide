*Custodian's filing note (2026-10-16): the worker's report for `governance-search-ignore-historical`'s commits S1 to S3, in C:/dev/wt/sih from M0 fbbffe89; the head 7f09c0e3f318a17a77cc00d5b2f9de4abe48028c, pushed and checked by the custodian (porcelain empty; local equals origin; three commits; the temporary M0 worktree removed). The run 2026-10-16T22:06:25Z to 2026-10-16T22:20:35Z by its transcript (Bash 34, Read 3, Write 11, Grep 9, Glob 3); every Write call in the worktree's five new files or the worker's own scratch files; its one SubagentHandback call, at 22:20:34Z. Neither probe token appears joined. Extracted by script; 4 rooted path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added; nothing else changed. The message's sha256 as handed back is 03cf85705488cc790963a60a0bd76a755ec22983c6cbc584a784ca9717b15af4; this file's, from line 5 to the end, is cd7cc167dc5279e8587a6bc01b69522c085fc19d496ccd13fc13e2f2d2222533.*

---

REPORT: S1 to S3 of governance-search-ignore-historical (piece A), all pushed, none forced. No invalidator (I1 to I6) fired.

HEAD / COMMITS (branch cut/search-ignore-historical, M0 fbbffe89 confirmed, porcelain empty at start)
- S1 b1fa43199854cddae2dfb791b70f6c93c6c7a919 (script and tests). Script sha256 at S1: 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1 (git show S1:scripts/plan/measure-reads.mjs).
- S2 adef3fda3c3786b4fbb25ee9978228b91a328fb6 (two probes).
- S3 7f09c0e3f318a17a77cc00d5b2f9de4abe48028c (.ignore) = HEAD = origin. Final porcelain (--untracked-files=all): empty. Pushes rc=0,0,0.
- Seam cites: session-resume.mjs:45 (extractSessionContinuityBlock), precompact-flush.mjs:61 (parseSessionContinuity). T1 runs the real session-resume.mjs hook on the real state/CUT-STATE.md.
- Caller grep: the script is a CLI with no exported item. Its only callers are its tests and the form's M-1/M-2.

T1 to T7: all 7 pass (node --test scripts/plan/measure-reads.test.mjs: pass 7, fail 0). Test names are the form's §4 names verbatim, except that T1's reads "the routine block is the bytes session-resume.mjs prints for the real ledger", where the form's has "measure-reads: " prefix as used. Each mutation was applied alone via a scratch script, the named test run, the failure read, then `git checkout --` restored the file (sha unchanged, porcelain showed only the staged A lines):
- M1: failed at the block= figure vs hook block length (actual 19112, expected 19111).
- M2: failed on the boundary entry missing (assert.ok falsy).
- M3: failed on the undated bullet under the kept entry missing.
- M4: failed on stdout not ending with the whole pending section (stops at the deeper heading).
- M5: failed on case "no ledger heading": exit 0, not 2. (My first M5 attempt left the throw in place and the test passed; the corrected M5 neutralises the throw. Not a record entry, noted for honesty.)
- M6: failed at total (actual 189, expected 199).
- M7: failed at the unlisted-path run (exit 0, not 2).
- Commit named in the RECORDED MUTATION comments: M0 fbbffe89 with the S1 files staged on this branch (observed before S1 existed; the script blob is unchanged between the mutated runs and S1, sha above). verify-mutation at S2/S3: PASS, all 7 new tests have a recorded mutation. These were applied-and-run observations, not verify-mutation runs.

M-1 (routine, rev fbbffe89ecf693eabfe95448007ae0444e305d19, run twice, cmp rc=0, both rc=0): stderr line `measure-reads: routine fbbffe89... block=19111 ledger=16457 entries=12 window_from=2026-10-09T21:53:31.000Z outside_window=618 pending=670700 total=706273`; wc -c of stdout = 706273 = total; output sha256 7933c84012f0de54649f985e95910d1c399f8d0387171af538d58ff8ece552c2. The two runs match. Note: entries= is the kept count (my reading of the form's unspecified entries=<n>). pending is large (670700 B) because the whole `## Pending` section is nearly the entire file.

M-2 (corpus; worktree C:/dev/wt/sih-m0 at M0, porcelain empty, removed after, worktrees list clean): `rg --files | node .../measure-reads.mjs corpus M0` twice, PIPESTATUS rg=0 node=0 both; stdout `measure-reads: corpus fbbffe89... files=2308 bytes=42655588`; stderr `tracked_not_listed=91`; stdout sha256 fedf1cb39e8b1a6012fbdfde22a7134afe8947bf3cdeffcc4879e73847329428; stderr sha256 02263ecc88eaafa6dd76cd13cdfab3c78c4cb18bd9989c0784696d5f66f6bb37; the two runs match. Environment: rg --version first line `ripgrep 15.2.0`; RIPGREP_CONFIG_PATH unset; core.excludesFile not set (local, global and system all rc=1, so no file hash); info/exclude present, 541 bytes, sha256 321dffcb77a68a6c079d35da12944866b895b4cc9fb3b1fae72fe9468c7eafeb; no .ignore, .rgignore or .gitignore in C:/dev/wt or C:/dev. claude --version first line: `2.1.300 (Claude Code)`; node v24.18.1.

P0 (Bash `git grep -lE "SIP-DRAFTS-[q]7x2|SIP-HIDDEN-[k]4m9"; git status --porcelain --untracked-files=all`): at S2 adef3fda and at S3 7f09c0e3, lists exactly `.cut-archive/search-ignore-probe.md` and `state/drafts/search-ignore-probe.md`, status empty. Each row below at claude 2.1.300 (Claude Code), ripgrep 15.2.0.

CONTROL at S2 adef3fda (all found the drafts probe, I2 not fired):
- O1 Grep {pattern SIP-DRAFTS-[q]7x2, path C:\dev\wt\sih, files_with_matches}: `Found 1 file C:\dev\wt\sih\state\drafts\search-ignore-probe.md`
- O2 same, path ...\state: same single file
- O8 Bash `cd C:/dev/wt/sih && rg -l "SIP-DRAFTS-[q]7x2"; echo "exit=$?"`: `state\drafts\search-ignore-probe.md` / `exit=0`

O1 to O14 at S3 7f09c0e3 (prediction in brackets; all matched):
- O1 Grep tree-wide: `No files found` [no files: match]
- O2 Grep path ...\state: `No files found` [match]
- O3 Grep path ...\state\drafts: `Found 1 file ...\state\drafts\search-ignore-probe.md` [the probe: match]
- O4 Grep path ...\state\drafts\search-ignore-probe.md: `Found 1 file` that path [match]
- O5 Grep tree-wide plus glob state/drafts/**: `No files found` [match]
- O6 Grep SIP-HIDDEN-[k]4m9 tree-wide: `Found 1 file C:\dev\wt\sih\.cut-archive\search-ignore-probe.md` [hidden probe: match; the Grep tool does search hidden folders, so H1 is available]
- O7 Grep path ...\.cut-archive: same single file [match]
- O8 Bash rg -l "SIP-DRAFTS-[q]7x2": no output, `exit=1` [match]
- O9 Bash `rg -l --no-ignore "SIP-DRAFTS-[q]7x2" state/drafts`: `state/drafts\search-ignore-probe.md` / `exit=0` [match]
- O10 Bash rg -l "SIP-HIDDEN-[k]4m9": no output, `exit=1` [match]
- O11 Bash `rg -l --no-ignore "SIP-HIDDEN-[k]4m9" .cut-archive`: `.cut-archive\search-ignore-probe.md` / `exit=0` [match]
- O12 Read ...\state\drafts\search-ignore-probe.md: 3 content lines (line 1 the sentence naming the node and state/drafts/; line 2 blank; line 3 the token SIP-DRAFTS-[q]7x2, written bracketed here as ordered, the verbatim result held it joined) [holds the token: match]
- O13 Glob **/search-ignore-probe.md at ...\sih: lists `...\state\drafts\search-ignore-probe.md` and `...\.cut-archive\search-ignore-probe.md` [drafts probe predicted; the hidden probe is also listed, recorded not predicted]
- O14 Glob * at ...\state\drafts: output truncated at "Showing 100 of 157 matching files; 57 more are not listed"; the probe is not in the 100 shown, so this call alone does not show it. Extra row, not a substitute for O14: Glob pattern search-ignore-probe.md, path ...\state\drafts returned `...\state\drafts\search-ignore-probe.md`. O14's prediction is therefore confirmed only by the extra row.
- Clause table: O3, O4, O9, O11, O12 reach; O1, O2, O5 miss as predicted; O13 lists; I1 and I3 not fired.

D1 (S2 adef3fda vs S3 7f09c0e3; stdout sha256, rc; identical in every row, cmp rc=0 on stdout files; I4 not fired):
- verify: 52ce63b7...1dfe rc0 (73 B)
- verify-cites: e75bc030...1a78 rc0 (134 B; stderr 6273 B both)
- verify-quotes: 31245fcb...e7e rc0 (318 B)
- verify-test-claims: c76d6851...d4d rc0 (168 B)
- verify-mutation: 87b267a2...d5b5 rc0 (81 B)
- node --test three globs: rc0, tests 464 pass 464 fail 0 at both. (Full 64-hex digests are in the first column of the brief's runs; I printed them in full during the run.)

G at S3 (`git grep -nIwE "rg|ripgrep" -- . ":(exclude)*.md" ":(exclude)*.txt"`, rc0): zero ripgrep invocations. Variables named rg: line 346-347 of engine/src/layout.rs (on the branch); line 176 of frontends/shell/e2e/pan-anchor.mjs (on the branch); line 170,171,226,227,289,294,419,423 of spikes/lod-feasibility/rust/src/main.rs (on the branch) (exactly the form's list). Comments: line 7 of scripts/plan/measure-reads.mjs (on the branch) (`rg --files` in the header) and :9 (ripgrep). Nothing else; the test file has no match.

§7 count (the form's command, M0...S3): 319 lines over 5 files: .ignore 5; measure-reads.mjs 131; measure-reads.test.mjs 177; each probe 3 (.cut-archive/..., state/drafts/...). No overrun (380 and 6 declared; AUTONOMY.md's 18 not yet added).

COMMANDS AND EXIT CODES: git fetch 0; test runs 0 (7/7); all mutation runs as above; M-1 x2 rc 0 0, cmp 0; M-2 x2 PIPESTATUS (0,0),(0,0), cmp 0; worktree add 0, remove 0; D1 scripts 0 and 0 at S2 and S3; S2 and S3 verify-cites/quotes/test-claims rc 0 via D1 (inside bash calls with a 600 s timeout); all three commits rc 0; pushes 0.

DIFFERENCES / NOTES
- Mutations M1 to M7 were observed against M0 plus the staged S1 files (before commit), so the comments name fbbffe89 and say so, not a branch commit.
- entries= in the stderr line is the kept count (form ambiguous).
- O14 truncation (above). One test-comment line in measure-reads.test.mjs (M4's) exceeds 100 columns.
- Not done (not mine): S4, AUTONOMY.md, PLAN, form edits. No file outside the worktree, sih-m0 and the scratch folder was touched. Scratch path not recorded here.
- Tokens: only ever joined in the two probe files (and the Read result, given bracketed above).
- Model: Sonnet 5.5 (claude-sonnet-5-5) per the harness; no override; no context handoff received or produced.
- Self-check four classes: seam used the actual exports (cited); every claim above points to a run printed here; no user-facing message beyond the script's own stderr lines, which state facts at this commit; the required tests reached their assertions (each mutation failed at its named assertion).
