*Custodian's filing note (2026-10-17): the worker's report for `governance-search-ignore-historical`'s commit S4, in C:/dev/wt/sih from S3 7f09c0e3; the head 16dd59f1275ed110333f6ceed38bee9b1dee975c, pushed. The custodian checked it by script: `AUTONOMY.md` at the head is its text at M0 fbbffe89 followed by the form's Amendment 4 bytes (1833, sha256 1d9b2fa8), byte for byte; S4 changes that file alone, 12 lines in and 0 out; the script's bytes equal S1's; §7's count from M0 to the head is 331 lines over 6 files. The run 2026-10-17T17:08:06Z to 2026-10-17T17:13:22Z by its transcript (Bash 12, Write 2); every Write call to the worker's own scratch files; its one SubagentHandback call, at 17:13:21Z. Neither probe token appears joined. Extracted by script; 3 rooted path:line cite(s) de-rooted; one final newline added; nothing else changed. The message's sha256 as handed back is dc1d4665d4c89c3411c6a9ae3ccba36908fbf04dc4060fd1751c7f2a3252dcac; this file's, from line 5 to the end, is 7dff2764ab3e489d4ff3682fecb1580c2f5bb9f44bac7d1291d934746526da6b.*

---

S4 landed and pushed (ordinary push, rc 0); no STOP.
- Head S4 = 16dd59f1275ed110333f6ceed38bee9b1dee975c; parent = S3 7f09c0e3f318a17a77cc00d5b2f9de4abe48028c. origin/cut/search-ignore-historical == S4. Final `git status --porcelain --untracked-files=all`: empty. `git fetch origin` run first; head was S3 and the tree clean.
- Bytes: my Node script (stdlib only) read the form via `git show 49a15bf6...:scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`. It took the lines between the last `~~~markdown` (line 317) and the next `~~~` (line 329), which is 11 lines, with one empty line before them and a final LF. Result: 1833 bytes, sha256 1d9b2fa8...a1d4ad (matches). AUTONOMY.md ended with LF (asserted), then `fs.appendFileSync`. Rc 0.
- §8 items 1-3, run before the commit and again at S4, identical both times:
  - item 1: `cmp .ignore <the five §2 item 1 lines>` rc 0.
  - item 2: `cmp -n "$(git cat-file -s M0:AUTONOMY.md)" <(git show M0:AUTONOMY.md) <(git show HEAD:AUTONOMY.md)` rc 0. Before the commit I also compared against the working-tree file: rc 0.
  - item 3: sha256 of measure-reads.mjs is 7b2d33db...92e1 at the S4 tree, equal to `git show b1fa4319:...` (same digest).
- `git diff --numstat` before commit: `12 0 AUTONOMY.md`. `git show --stat` of S4: 1 file, 12 insertions.
- §7 count from M0 to S4 (the form's command, via `...`): 331 lines over 6 files (under 380). Per file: `.cut-archive/search-ignore-probe.md` 3; `.ignore` 5; `AUTONOMY.md` 12; `scripts/plan/measure-reads.mjs` 131; `scripts/plan/measure-reads.test.mjs` 177; `state/drafts/search-ignore-probe.md` 3.
- P0 at S4: `git grep -lE "SIP-DRAFTS-[q]7x2|SIP-HIDDEN-[k]4m9"` rc 0, printed `.cut-archive/search-ignore-probe.md` and `state/drafts/search-ignore-probe.md`; status empty.
- G at S4: `git grep -nIwE "rg|ripgrep" -- . ":(exclude)*.md" ":(exclude)*.txt"` rc 0. 14 matches, zero invocations of ripgrep:
  - `line 346 of engine/src/layout.rs (on the branch)` and `:347`: format argument `rg`.
  - `line 176 of frontends/shell/e2e/pan-anchor.mjs (on the branch)`: callback parameter.
  - `line 7 of scripts/plan/measure-reads.mjs (on the branch)` and `:9`: comments.
  - `spikes/lod-feasibility/rust/src/main.rs` lines 170, 171, 226, 227, 289, 294, 419, 423: loop variable.
- Tests and verifiers at S4, all rc 0:
  - `node --test scripts/plan/measure-reads.test.mjs`: 7 tests, 7 pass, 0 fail.
  - `verify.mjs`: PASS.
  - `verify-cites.mjs`: PASS, with 40 loose advisories, none in my change.
  - `verify-quotes.mjs`: PASS.
  - `verify-test-claims.mjs`: PASS.
  - `verify-mutation.mjs`: PASS, all 7 new tests have a recorded mutation.
  - The three-glob suite: 464 tests, 464 pass, 0 fail.
- Exit codes: append script 0; checks script 0; commit 0; push 0; the greps and all runs above 0. No heavy runs, so no hold was used. Each run was in the foreground with output to a file.
- Differences from the form or brief: none. I did not run O1-O14 (not mine) and did not edit the form, PLAN, the queue or any other file. Neither probe token is written joined anywhere.
- Model: Sonnet 5.5 (claude-sonnet-5-5); no override; no context handoff received or produced.
- Pre-gate self-check: no cross-module code, only an appended record section; completion claims point to the outputs above; there is no user-facing message; the required tests (T1-T7) reach their assertions and pass.
