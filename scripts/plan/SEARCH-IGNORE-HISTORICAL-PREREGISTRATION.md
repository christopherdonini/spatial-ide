# A root `.ignore` over historical material, its search rule, and the two measurements taken before it (PLAN node `governance-search-ignore-historical`, piece A of three) — preregistration

**Authority:** the human's direction of 2026-10-14, with its RULED block in `DECISIONS-PENDING.md` (cited by date, never by line):
- the opening paragraph: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:6 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:d743139eef4361c01b61499910e53e1908e38446fb18805fa73532a03547b6f4`
- the measurements: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:8-10 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:feb92776a35b7819248f508e233328ffecc818fd25b40c66738ee0c4f26ee140`
- piece A: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:12-23 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:9925f5381ae4b10a434d37809b3ba9acc6aca9fe44b946325d3ab2e7582f1ea0`
- the out-of-scope line: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:65 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:e716c0d7120766cb0fef51b9b6d5086dac29a19155e08741be307bc9c27d1034`
- the addendum's A: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:67 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:0570674e97166b64b16deac5deaef20cfaea133478039960613e129c1468808e`

These are referenced and not reproduced. The one exception is the rule sentence in §2 item 4, which this piece is bound to append to AUTONOMY.
- Node: `PLAN.yaml:5257-5273 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:038f370a4c275844caf8639afa75575b862b2ecee963502cc5546aeb75023d55`.
- Order: after `boundary-inventory` (`PLAN.yaml:5240-5256 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:8c72155d50b012db1bc9b13a95c988cb6859d6d5f48533404f9930432a83a790`), in the governance lane, never slot 1. B and C follow, each with its own form: `PLAN.yaml:5274-5290 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:2723f0694988b209cb5151fbcab3c1f96d641bac2d4f335298dce0edc2cf5ba7` and `PLAN.yaml:5291-5307 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:62106dedc89582ed19cb57d26a4742e293e25de250404b5d083e1fac32385cba`. Each merge is the human's click.

**Drafted by** the architect agent on the custodian's brief, read at main b9b902bf. **Committed before any code**, as the node's gate. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, reviewer and architect, by §21c's size alone.** §7 declares 380 lines (`AUTONOMY.md:347-357 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`). No §21a category applies (`AUTONOMY.md:315-332 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`):
- no ADR;
- no security posture: `.ignore` narrows ripgrep-based search only, and §1 claims no access limit;
- no wire;
- no guarantee or property under test.

Under round 25, item 2 (e) (`AUTONOMY.md:482 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`), no five-line form is used. The verdicts are proportional (`AUTONOMY.md:389 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:8a36edc32e678f5c491f84c6c7b6d1cbc5c1b97bf8e86300ffb7a9180196a4c3`).

## §0. Disclosure
- **Read, not run.** The architect has no Bash. Line numbers were read in the main checkout, and the custodian's hashes at b9b902bf confirm each one.
- **The code relied on:**
  - `READING_ORDER`, whose items 1 and 3 name the parts measured: `scripts/hooks/session-resume.mjs:28-34 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:8a75b10138aee685a7a7f68a47658c5430301e4c9118eb0c4e2b7ae5ad8dfd33`. AUTONOMY's own list agrees on items 1 and 3: `AUTONOMY.md:7-13 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:ac620c7f769597bdb3e9e694d10a6936db81eec2a455b9113f914207ff46b5d2`.
  - `extractSessionContinuityBlock`: `scripts/hooks/session-resume.mjs:44-57 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:155a619270dddc5d1c0a74483a6cf2261a405624018626b16641bda6b75b3cec`.
  - `buildOutput`. It prints the reading order, a blank line, the block, a blank line, then the resume-facts line, and ends with a newline: `scripts/hooks/session-resume.mjs:99-116 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:6ca1c751f1fa8201bee92da67a502760d443c802e49a748c74b4ea65ea3abbe8`.
  - The cloud guard: `scripts/hooks/session-resume.mjs:147-150 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:5cd614d8c1f05628690afed4b7d20c510da9fdbd00e4d55d5707d1b44077ffc7` and `scripts/hooks/cloud.mjs:13-15 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:04ffe1db6b02ccf9cc7908d42cdd4f016916edca6cec9b0e7817990298938377`.
  - `parseSessionContinuity`, which returns `{ flushedAt, tip, block }` or `null`: `scripts/hooks/precompact-flush.mjs:61-79 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:e125ab7b5b05587721486dc2ab197dadcf63d7e9488bbbf80db95005b58910c4`.
  - The hook-spawn shape a test may copy: `scripts/hooks/hooks.test.mjs:1284-1289 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:cbc84970ac386742d0142b24dafee7d91382882ec1a2713e743aa1282e5ea24b`.
- **The checkers list files through git:**
  - `scripts/plan/verify-cites.mjs:158 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:d5b019d5cdf058b112c1142685d6a6a2489650e6e82bbe9790d9187e42940840`
  - `scripts/plan/verify-test-claims.mjs:741 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:d5b019d5cdf058b112c1142685d6a6a2489650e6e82bbe9790d9187e42940840`
  - `scripts/plan/cfg-boundary.mjs:209 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:429f2becab5ff886483f72f02a5cf0ff4af0532291bd5a8071dc66dc0f3c631c`
- **Line endings.** The policy is `* text=auto eol=lf` (`.gitattributes` line 5 at b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e, sha256 d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c; a dot-prefixed path, written in words). A committed blob's size is therefore the checked-out file's size. Files marked `-text` are kept verbatim both ways.
- **File shapes at b9b902bf, by heading.**
  - `state/CUT-STATE.md`: `## SESSION-CONTINUITY` (with `flushed_at:` and `tip:`), a `Previous ledger:` line, then `## Ledger`. The ledger has about 630 top-level entries opening `- YYYY-MM-DDTHH:MMZ - ` and four undated top-level bullets. The file is about 700 KB, close to `execFileSync`'s 1 MiB default buffer (§7). These counts were read from the working tree while it moved; the worker recounts them at M0.
  - `DECISIONS-PENDING.md`: its title, `## Pending`, `## Resolved`. Every `**RULED` block heading sits under `## Pending`.
- **The architect's pilot reads.** These were Grep and Glob tool calls made while drafting, on 2026-10-14, against the main checkout. The Claude Code version was not recorded, so they are hypotheses and not tool claims of record (round 15 (c)). They used `.gitignore` as an analogue of `.ignore`.
  - (a) A Grep for `it had been gitignored` over the whole tree listed `.cut-archive\README.md`. The Grep tool searched a hidden folder.
  - (b) A tree-wide Grep for `^lease: ` found nothing. The same Grep with the path set to the gitignored file `CUSTODIAN-LEASE` found it.
  - (c) A Grep with the path set to the gitignored folder `.claude\state` listed its files.
  - (d) A tree-wide Glob for `**/CUSTODIAN-LEASE` listed the gitignored file.
  - (e) A Glob for `.cut-archive/*` listed the hidden file.
- **Reuse index.** The custodian ran `node tools/reuse.mjs` in the read-only clone of `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. Each query exited 1. The output below is byte-copied from the custodian's brief:
  - `ignore file`: `No prior art recorded for "ignore file". Research it before planning an implementation.`
  - `ripgrep`: `No prior art recorded for "ripgrep". Research it before planning an implementation.`
  - `search exclusion`: `No prior art recorded for "search exclusion". Research it before planning an implementation.`
  - `context budget`: `No prior art recorded for "context budget". Research it before planning an implementation.`

  All four are misses. The tool behaviour this piece relies on is observed, not taken from prior art (§4).
- **Concurrent pieces.** Another piece appending to `AUTONOMY.md` first changes this piece's section number (§2 item 4). B edits `READING_ORDER` and `flush.mjs`. C edits `verify.mjs`, `verify-test-claims.mjs` and `verify-quotes.mjs`. None of them edits this piece's files.
- **Machine.** Nothing here is a heavy run. Nothing is measured against the 5 GB fixture.

## §1. May and may not claim
**May claim**, each at the recorded commit and tool versions:
1. A Grep tool call over the whole tree, and one over `state/`, both miss a string that is found only under `state/drafts/` (O1, O2).
2. Each named route reaches it as observed: Grep naming the folder (O3) or the file (O4); `rg --no-ignore` naming the folder (O9); Read (O12); Glob (O13, O14).
3. Bash `rg` honours `.ignore` (O8). It skips hidden folders (O10), and it reaches one when the folder is named (O11).
4. The output of every checker and suite is the same with and without `.ignore` (§5, D1).
5. No tracked script, workflow or hook configuration runs ripgrep (G).
6. Two baseline figures at M0, defined in §2 item 5, each reproduced by a second run and by the reviewer.
7. Part 1 of the routine read is, byte for byte, the block the SessionStart hook prints (T1).

**May not claim:**
- Any token count, context size or cost. Both figures are UTF-8 bytes.
- That the routine read is everything read after a compaction. It leaves out reading-order items 2 and 4 to 6, the reading-order text itself, the resume-facts line, and any "unfinished matter" an entry names.
- That (2) is what the Grep tool walks. Pilot (a) suggests the Grep tool also searches hidden folders.
- Grep or Glob behaviour at another Claude Code version, or rg behaviour at another ripgrep version.
- That `.ignore` limits access. Read, Bash and git are unaffected.
- Any `docs/08` row, or either figure as a performance number.
- Anything about macOS or Linux: no run there.

**Unchanged:** every checker and hook, including `session-resume.mjs`, `precompact-flush.mjs` and `flush.mjs`; `READING_ORDER`; `.gitignore`; the CI workflows. `PLAN.yaml` is not edited on the branch.

## §2. The change
1. **`.ignore` at the root** holds exactly the directive's five lines, in the directive's order: `/site/`, `/CUSTODIAN-QUEUE.json`, `/state/cut-archive/`, `/state/drafts/`, `/state/consults/gates/`. It has LF line endings, ends with one newline, and holds nothing else.
2. **Two probe files.** Each holds one sentence naming this node, a blank line, then one token. Neither token is ever written joined anywhere else.
   - `state/drafts/search-ignore-probe.md` holds the token formed by joining `SIP-DRAFTS-` and `q7x2`.
   - `.cut-archive/search-ignore-probe.md` holds the token formed by joining `SIP-HIDDEN-` and `k4m9`.

   Every search for a token uses a bracketed pattern (`SIP-DRAFTS-[q]7x2`, `SIP-HIDDEN-[k]4m9`). That pattern matches only the joined token, so this form never matches its own search.
3. **`scripts/plan/measure-reads.mjs`**: Node's standard library only, plus two imports, `extractSessionContinuityBlock` from `scripts/hooks/session-resume.mjs` and `parseSessionContinuity` from `scripts/hooks/precompact-flush.mjs`. It never starts ripgrep. Every git call uses an argument array and §7's buffer. It exits 0, or 2 on any refusal, and a refusal writes nothing to stdout.
   - **`routine <rev>`** reads `state/CUT-STATE.md` and `DECISIONS-PENDING.md` from `<rev>` with `git show`. Each text is split on `\r\n|\r|\n` and rejoined with `\n`. It writes to stdout part 1, a blank line, part 2, a blank line, part 3, and a final newline: `p1 + "\n\n" + p2 + "\n\n" + p3 + "\n"`. To stderr it writes one line: `measure-reads: routine <rev> block=<bytes> ledger=<bytes> entries=<n> window_from=<ISO> outside_window=<n> pending=<bytes> total=<bytes>`. All byte figures are UTF-8.
     - **Part 1**: `extractSessionContinuityBlock(text)`, unaltered. That is the block as the hook injects it. The reading-order text and the resume-facts line are not part of it: the first is not the block, and the second depends on the time of the run.
     - **Part 2**, the ledger part that item 1 names, as defined by OPEN-1. The recommended definition (A) works as follows.
       - The section runs from the line after the line whose trimmed text is `## Ledger`, to the next line matching `^#{1,6}\s`, or to the end of the file.
       - An entry starts at a line matching `^- (\d{4}-\d\d-\d\dT\d\d:\d\dZ) - ` and runs up to the next such line or the section's end. Undated top-level bullets and indented lines belong to the entry above them. Lines before the first dated entry are left out.
       - An entry is kept when its time is at or after `flushedAt` minus 168 hours, where `flushedAt` comes from `parseSessionContinuity`. There is no upper bound.
       - Kept entries are joined in file order, and trailing empty lines are dropped.
       - `outside_window` counts the dated entries that were not kept.
     - **Part 3**, the DECISIONS-PENDING part that item 3 names. It runs from the line whose trimmed text is `## Pending` through the line before the next line matching `^## `, or to the end of the file. The heading is included, deeper headings stay in, and trailing empty lines are dropped. This is where the RULED blocks and the open entries sit. The DIRECTIVE and FELT VERDICTS blocks under the same heading are included too, and `## Resolved` is left out.
     - **Refusal (exit 2)**: a missing block, `flushed_at`, `## Ledger` or `## Pending`; an unparseable `flushed_at`; or a failed git call.
   - **`corpus <rev>`** reads a path list from stdin, one path per line (the output of `rg --files`), and turns `\` into `/`. It looks up each path in `git ls-tree -r -l -z <rev>` run in the current directory. It writes `measure-reads: corpus <rev> files=<n> bytes=<sum of blob sizes>` to stdout and `tracked_not_listed=<n>` to stderr. It refuses (exit 2) an empty list, or any path not in the tree, naming that path.
4. **An `AUTONOMY.md` section appended at the end of the file**, after its last line. At b9b902bf that last line is the end of §31 (`AUTONOMY.md:530-551 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:45b3c7ec4b878e834e383ec1ea380cd3e3dcd2909f528f9ed1ee07619986fa6a`). The section takes the next free number. Its words are below. The custodian replaces the placeholders before the worker applies them.

~~~markdown
## §<n>. A tree-wide search excludes historical material (the human, 2026-10-14; `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md`, piece A and the addendum's A; appended after §<n-1> so that no line a record cites above it moves)

The rule is the human's. It is byte-copied by script from `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:23 @ <rev> sha256:<hex>` (a sub-line span: the quoted sentences inside that line; the hash is the whole line's), and nothing in it is changed[ H1: except its first sentence, replaced as the human approved in `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`, OPEN-2]:

```text
<the rule's sentences, byte-copied by script; under H1, OPEN-2's first sentence, then the second and third byte-copied>
```

**Searching an excluded location** (the addendum's A; the architect's words, approved by the human in that form's OPEN-3): <W, assembled from §5's table>

The excluded paths are the five lines of the root `.ignore`. Each method above was observed at <commit> with Claude Code <version> and <rg --version first line> (that form, §4, O1 to O14).
~~~

   - **The human's sentence, for sight**, byte-copied by script from inside the quotes of `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:23 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:8bd8015eca14482708510c7f25b68b6d3af9d817837db52b37f9f821cb3393fd`: A tree-wide search excludes historical material: the paths in .ignore, and hidden folders such as .cut-archive/. Before concluding that a ruling, precedent, review or design does not exist, search those locations explicitly. Active work keeps direct references to its own drafts and gate reports.
   - **H1**, used only if O6 finds the hidden probe and OPEN-2 answers (A). The first sentence becomes, in the architect's words: "A tree-wide search excludes historical material: the paths in .ignore. A tree-wide `rg` from Bash also skips hidden folders such as .cut-archive/; the Grep tool does not." The second and third sentences stay byte-copied.
   - **W, the architect's words**, assembled clause by clause from §5's table. If every observation comes out as predicted, W reads: "Name the location to search it: give the Grep tool that folder or that file as its path, run `rg --no-ignore` from Bash with that folder as its path, or Read the file by its name. A Grep call over the whole tree, or over a folder above the excluded one, does not reach it. The Glob tool still lists the files there by name."
5. **The two measurements.** They are taken before A, at M0. M0 is the main commit the branch is created from, which carries this form. The custodian names it at dispatch.
   - **M-1, the routine read.** In `C:/dev/wt/sih` at S1, run `node scripts/plan/measure-reads.mjs routine <M0>` with stdout going to a file in a scratch directory outside the repository. Record: the stdout byte count by `wc -c`, which must equal the stderr `total`; the stderr line; and the sha256 of the output. Run it twice; the two outputs must be byte-identical. **Name:** "Routine read (UTF-8 bytes): the SESSION-CONTINUITY block as the SessionStart hook prints it, the ledger entries of <OPEN-1's definition>, and DECISIONS-PENDING.md's `## Pending` section, at <rev>."
   - **M-2, the search corpus.**
     1. `git worktree add --detach C:/dev/wt/sih-m0 <M0>`.
     2. `git status --porcelain --untracked-files=all` there must print nothing.
     3. Record the environment facts: the first line of `rg --version` (ripgrep 15.2.0 by the brief; the run records it); whether `RIPGREP_CONFIG_PATH` is set; whether `core.excludesFile` is set, with the sha256 of that file but never its path; the sha256 of `$(git rev-parse --git-path info/exclude)`, or "absent"; and that `C:/dev/wt` and `C:/dev` hold no `.ignore`, `.rgignore` or `.gitignore`.
     4. Run `cd C:/dev/wt/sih-m0 && rg --files | node C:/dev/wt/sih/scripts/plan/measure-reads.mjs corpus <M0>`, twice, with identical results. Then remove the worktree.

     **Name:** "Search corpus (bytes): the sum of the committed sizes of the files `rg --files` lists from the root of a clean checkout of <rev>." Under §0's line-ending policy these sizes equal the UTF-8 bytes on disk.
   - **The script's identity.** Record `git show <S1>:scripts/plan/measure-reads.mjs | sha256sum` beside the figures.
   - **Where the figures go.** First, the worker's report and the PR body, which are evidence. Then this form's closing amendment on main after the merge, a class 1 row. It pins the measured content at M0, and the script's blob at the merge commit, whose digest must equal S1's (round 15 (e)). The after-C figures go in C's closing record, naming this row. The custodian gives the human both pairs at C's close.
6. **Commit order on `cut/search-ignore-historical`** (worktree `C:/dev/wt/sih`):
   - S1: the script and its tests. M-1 and M-2 run here, against M0.
   - S2: the two probes.
   - S3: `.ignore`.
   - S4: the AUTONOMY section, after the observations and after OPEN-2 and OPEN-3 are answered.
7. **What A leaves in place for B and C** (their forms cite this item):
   - (a) The script's bytes are never edited. At the after-C run its sha256 must equal the baseline's, and its tests are not weakened. If it must change, the human is told before the after-C run.
   - (b) The after-C run uses item 5's procedure unchanged, at C's merge commit on main, and records the same environment facts. A fact that differs is named beside its figure.
   - (c) The anchors the script reads stay as they are:
     - `state/CUT-STATE.md` with `## SESSION-CONTINUITY` and `flushed_at:`;
     - `## Ledger`, with the dated entry line shape;
     - `DECISIONS-PENDING.md`, with its open entries and recent RULED blocks under `## Pending`.

     A B or C form that changes an anchor says so before any code and names the effect on the after-C figure. The script is never edited to follow it.
   - (d) `extractSessionContinuityBlock` and `parseSessionContinuity` keep their behaviour, or B's form names the change.
   - (e) The five lines of `.ignore` stay, and `/state/cut-archive/` covers B's and C's archives.
   - (f) The probes stay, so the observations can be run again.

## §3. Fixtures
- **The real ledger.** `state/CUT-STATE.md` in the working tree, read by T1. CI checks out LF.
- **Temporary git repositories** made inside the tests, for T5 to T7. Each holds non-ASCII text (é, →).
- **The two probes** from §2 item 2. No fixture is hashed for a measurement; the figures are pinned at their revs.

## §4. Tests, each with its mutation, and the observations
Each test's mutation is applied, the named test fails, the failure is recorded by name with the commit, and the mutation is reverted. The record is a `RECORDED MUTATION:` comment, and the run (not `verify-mutation`) is the observation of record (`docs/PREREGISTRATION-TEMPLATE.md:172 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2`).
- T1 `test('measure-reads: the routine block is the bytes session-resume.mjs prints for the real ledger')`. This is the seam test, run from the real shape. The test copies the working tree's `state/CUT-STATE.md` into a temporary project and runs `scripts/hooks/session-resume.mjs` with `CLAUDE_PROJECT_DIR` set to that project, `GIT_CEILING_DIRECTORIES` set to its parent, `CLAUDE_CODE_REMOTE` deleted, and `{}` on stdin. It takes the text between `READING_ORDER + "\n\n"` and the last `"\n\nResume facts:"`, and asserts it equals part 1, byte for byte. **M1:** part 1 taken as the raw lines from `## SESSION-CONTINUITY` to the line before `## Ledger`, untrimmed.
- T2 `test('measure-reads: the ledger part keeps the entries dated within 168 hours before flushed_at, the boundary included')`. Entries at the boundary, one minute before it, and after the flush. **M2:** the bound made strict.
- T3 `test('measure-reads: an undated top-level bullet and indented lines belong to the dated entry above them')`. **M3:** any line starting `- ` starts an entry.
- T4 `test('measure-reads: the pending part runs from ## Pending to the next level-2 heading and keeps deeper headings')`. **M4:** the section also ends at any `^#{1,6}\s` heading.
- T5 `test('measure-reads: a missing part refuses with exit 2 and an empty stdout')`. **M5:** a missing part becomes an empty string with exit 0.
- T6 `test('measure-reads: the routine total is UTF-8 bytes, not characters')`. **M6:** the total counted as string length.
- T7 `test('measure-reads: the corpus sums committed sizes of the listed files and refuses a path not in the tree')`. The listed paths use backslashes. **M7:** a path not in the tree is skipped.

**The observations: the agents' own search tools.** The worker runs them in `C:\dev\wt\sih`, a worktree at S3, and the control at S2.
- **Precondition P0**, at each commit: `cd C:/dev/wt/sih && git grep -lE "SIP-DRAFTS-[q]7x2|SIP-HIDDEN-[k]4m9"; git status --porcelain --untracked-files=all` lists exactly the two probes, and the status is empty.
- **Control, at S2:** O1, O2 and O8 must find the drafts probe.
- **Of record:** the gate-1 reviewer runs O1 to O14 again at the PR head. Its gate report under `state/consults/gates/` records, for each call, the exact parameters, the result verbatim, the commit, `claude --version` and the first line of `rg --version`. The worker's report records the same. A directory search, a tree-wide search, a search naming the file and a search naming the folder are each recorded on their own row. No row is inferred from another.

| # | Tool and exact call | Predicted at S3 |
|---|---|---|
| O1 | Grep `{"pattern":"SIP-DRAFTS-[q]7x2","path":"C:\\dev\\wt\\sih","output_mode":"files_with_matches"}` (tree-wide) | no files |
| O2 | as O1, `"path":"C:\\dev\\wt\\sih\\state"` (directory above) | no files |
| O3 | as O1, `"path":"C:\\dev\\wt\\sih\\state\\drafts"` (naming the folder) | the probe (pilot c) |
| O4 | as O1, `"path":"C:\\dev\\wt\\sih\\state\\drafts\\search-ignore-probe.md"` (naming the file) | the probe (pilot b) |
| O5 | as O1, plus `"glob":"state/drafts/**"` | no files |
| O6 | Grep `{"pattern":"SIP-HIDDEN-[k]4m9","path":"C:\\dev\\wt\\sih","output_mode":"files_with_matches"}` (tree-wide, hidden) | the hidden probe (pilot a) |
| O7 | as O6, `"path":"C:\\dev\\wt\\sih\\.cut-archive"` | the hidden probe |
| O8 | Bash `cd C:/dev/wt/sih && rg -l "SIP-DRAFTS-[q]7x2"; echo "exit=$?"` | no output, exit=1 |
| O9 | Bash `cd C:/dev/wt/sih && rg -l --no-ignore "SIP-DRAFTS-[q]7x2" state/drafts; echo "exit=$?"` | the probe, exit=0 |
| O10 | Bash `cd C:/dev/wt/sih && rg -l "SIP-HIDDEN-[k]4m9"; echo "exit=$?"` | no output, exit=1 |
| O11 | Bash `cd C:/dev/wt/sih && rg -l --no-ignore "SIP-HIDDEN-[k]4m9" .cut-archive; echo "exit=$?"` | the hidden probe, exit=0 |
| O12 | Read `{"file_path":"C:\\dev\\wt\\sih\\state\\drafts\\search-ignore-probe.md"}` | content holds the token |
| O13 | Glob `{"pattern":"**/search-ignore-probe.md","path":"C:\\dev\\wt\\sih"}` | the drafts probe (pilot d). Whether the hidden probe is listed is not predicted, only recorded. |
| O14 | Glob `{"pattern":"*","path":"C:\\dev\\wt\\sih\\state\\drafts"}` | the probe |

**G, before the merge, at the PR head:** `git grep -nIwE "rg|ripgrep" -- . ":(exclude)*.md" ":(exclude)*.txt"`. Expected: zero invocations of ripgrep, with every match listed and classified.
- From the architect's reading, the expected matches are variables named `rg`: `engine/src/layout.rs:346-347` (a format argument), `frontends/shell/e2e/pan-anchor.mjs:176` (a callback parameter), and `spikes/lod-feasibility/rust/src/main.rs` lines 170, 171, 226, 227, 289, 294, 419 and 423 (a loop variable).
- Lines of `measure-reads.mjs` and its test that name ripgrep in comments or test text are also expected. Record prose in `.json` files may also match.

An invocation is a line in a file that runs (a script, a workflow, a hook configuration) and starts `rg`.

## §5. Predictions · declared unchanged · invalidators · falsification
- **Predictions:** the §4 table. A wrong prediction is a result (class 2). No numeric prediction is made for M-1 or M-2.
- **W and H1, clause by clause.** A clause lands only if its observation shows it:

| Clause | Observation | If the observation contradicts it |
|---|---|---|
| Grep reaches the location when the path names the folder | O3 | replaced by "a Grep call naming the folder does not reach it" |
| Grep reaches it when the path names the file | O4 | replaced by "the Grep tool does not reach it even with the file as its path" |
| `rg --no-ignore` reaches it when the path names the folder | O9 and O11 | STOP (I3) |
| Read reaches it by file name | O12 | STOP (I3) |
| A Grep call over the whole tree does not reach it | O1 | STOP (I1) |
| A Grep call over a folder above does not reach it | O2 | dropped |
| Glob lists the files there | O13, or failing that O14 | dropped, or "only with that folder as its path" |
| H1: the tree-wide search excludes the paths in `.ignore` | O1 and O8 | — |
| H1: `rg` skips hidden folders | O10 | — |
| H1: the Grep tool does not skip them | O6 | H1 is not used |

- **D1, declared unchanged.** These are run at S2 and at S3, and the stdout sha256 and exit code of each must be identical:
  - `node scripts/plan/verify.mjs`
  - `node scripts/plan/verify-cites.mjs`
  - `node scripts/plan/verify-quotes.mjs`
  - `node scripts/plan/verify-test-claims.mjs`
  - `node scripts/plan/verify-mutation.mjs`
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, compared by its pass and fail counts
- **Invalidators. Each one is a STOP, and goes to the human:**
  - I1: O1 at S3 lists the drafts probe, so `.ignore` does not hide it from the agents' Grep tool.
  - I2: the S2 control misses.
  - I3: no route reaches the location: O3, O4, O9 and O12 all miss.
  - I4: D1 differs.
  - I5: M-1 refuses at M0.
  - I6: M-1 or M-2 differs between its two runs.
- **Falsification.** Pilot reads that the observations contradict make §0's hypotheses wrong. That is recorded and changes no prediction.

## §6. Instruments
- **Assertions:** T1 to T7, O1 to O14, G, D1.
- **Counts:** M-1 and M-2. These are deterministic byte counts at a rev. Each is run twice by the worker and once more by the reviewer. They are not `docs/08` measurements and carry no p50 or p95.

## §7. Declared values and ceilings
- `WINDOW_HOURS = 168`, as OPEN-1 (A). Under (B) the value becomes `LAST_ENTRIES = 10`, and under (C) the whole section is taken.
- `maxBuffer` is 64 MiB for every git call.
- Exit codes are 0 and 2. The separators are `"\n\n"`, with a final `"\n"`.
- The probe tokens are those of §2 item 2.
- **Line budget: at most 380 lines over at most 6 files.**
  - `.ignore`: 5
  - `scripts/plan/measure-reads.mjs`: 150
  - `scripts/plan/measure-reads.test.mjs`: 190
  - each probe: 4
  - `AUTONOMY.md`: 18
- **Counting command:** `git diff --numstat <M0>...<head> -- . ":(exclude)scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md" ":(exclude)CUSTODIAN-QUEUE.md" ":(exclude)CUSTODIAN-QUEUE.json" ":(exclude)site" | awk '{n+=$1+$2; f++} END {print n, f}'`
- An overrun is class 8, and this line is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ b9b902bff3d2863ae0e1bcbaf86fe1becb1fc02e sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`).

## §8. Block-on-sight
1. `.ignore` holds anything other than §2 item 1.
2. `AUTONOMY.md` at the head is not M0's file plus appended bytes. The check is `cmp -n "$(git cat-file -s <M0>:AUTONOMY.md)" <(git show <M0>:AUTONOMY.md) <(git show HEAD:AUTONOMY.md)`, which must exit 0.
3. The script's sha256 at the head differs from S1's.
4. A figure recorded without its rev, the script's sha256, the environment facts and its second identical run.
5. An observation recorded without its exact call, its verbatim result, its commit, `claude --version` and the first line of `rg --version`.
6. An AUTONOMY clause that lands although its observation contradicts it or was never run.
7. P0 failing at an observation commit.
8. D1 differing.
9. G showing an invocation.
10. A record calling either figure a token count or a context size, or calling (2) what the Grep tool walks.
11. A line cite into `DECISIONS-PENDING.md`, or a recorded path with a user-profile segment.

## §9. Gates
- **Architect:** §8 one by one; T1 as the seam test from the real shape; §5's clause table against the recorded observations.
- **Reviewer:** the full diff; M1 to M7 made again; O1 to O14 run again at the head (the observations of record); G; D1; M-1 and M-2 run again at M0.
- **Suites:** CI's `node --test` globs, and `verify:plan`, `cites`, `quotes`, `test-claims` and `mutation`.
- **Operator:** none. Nothing here is visible to a user.
- Verdicts are proportional: a block only on Correctness or Evidence. Documentation findings are fixed before the merge.

## OPEN (the human's)
- **OPEN-1, the ledger part.** The script is written once, before the first measurement, and is never changed, so this must be answered before dispatch. Item 1 reads "the ledger's last entries" before B, and "the live ledger" after B. One fixed rule has to serve both.
  - (A) **Recommended.** The entries dated within the 168 hours before the block's `flushed_at`. Under B's weekly rotation, this is the live ledger. `outside_window` names any divergence.
  - (B) The last 10 dated entries.
  - (C) The whole `## Ledger` section. That matches B's new item 1 exactly, but it overstates today's item 1.

  The part-3 definition in §2 item 3 is also for your sight.
- **OPEN-2, the hidden-folder clause.** This applies only if O6 finds the hidden probe; pilot (a) predicts that it will. The rule's first sentence would then claim a limit that the agents' Grep tool does not have.
  - (A) **Recommended:** H1, in §2 item 4.
  - (B) Your own words.
  - (C) The sentence as it stands, with the gap recorded in the section and on this form.
- **OPEN-3, approve W** (§2 item 4, assembled by §5), under §31 (e). This is your sentence, and the architect drafts it. "The Grep tool alone is not enough there" is read as: a Grep call that does not name the location does not reach it. If you meant that the Grep tool never suffices, say so, and the Grep clauses are dropped.

## §10. Amendments — opens empty, append-only

### Amendment 1 — the human's ruling on OPEN-1 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-15-round-1b-i3-allowed-a-open-1-b-open-1-open-2.md`). References only.*

1. **OPEN-1 (A):** the routine read's part 2 is the ledger entries dated within the 168 hours before the block's `flushed_at`, as §2 item 3 recommends; `WINDOW_HOURS = 168` (§7).
2. **Still open:** OPEN-2 and OPEN-3, before S4.
3. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — S1 to S3 built, the baseline figures taken and the observations run; no invalidator; the deviations (class 2), written after the results were seen

*Written by the custodian after the worker's report was seen. References only. The report is `state/consults/2026-10-16-governance-search-ignore-historical-s1-s3-worker-report.md` (its sha256 from line 5 to the end, cd7cc167dc5279e8587a6bc01b69522c085fc19d496ccd13fc13e2f2d2222533).*

1. **Built:** S1 b1fa4319 (the script and T1 to T7), S2 adef3fda (the two probes), S3 7f09c0e3 (`.ignore`), on `cut/search-ignore-historical` from M0 fbbffe89. T1 to T7 pass, and each of M1 to M7 was observed failing at its named assertion (the report).
2. **The figures at M0** (§2 item 5), each run twice with identical output, are in the report: M-1 and M-2 with their stderr lines, output digests, environment facts and the script's sha256 at S1. They go in the PR body, and into this form's closing amendment after the merge.
3. **The observations:** P0 held at S2 and S3; the control at S2 found the drafts probe (O1, O2, O8); O1 to O13 came out as §4 predicts, and O6 found the hidden probe, so OPEN-2's H1 is live; O13 also listed the hidden probe (recorded, not predicted). O14's Glob listed 100 of 157 files and the probe was not among them; the worker's extra Glob row naming the file found it. The clause "Glob lists the files there" rests on O13, as §5 allows. D1 is identical at S2 and S3; G found no invocation of ripgrep.
4. **The deviations (class 2):** M1 to M7 were observed against M0 with S1's files staged, before S1 existed, and the RECORDED MUTATION comments say so (the script's bytes are those of S1); the stderr field `entries=` counts the kept entries, a reading of §2 item 3, which does not define it; one comment line in the test file passes 100 columns.
5. **§7 at S3:** 319 lines over 5 files, by its command; `AUTONOMY.md` is not yet written.
6. **Still open:** OPEN-2 and OPEN-3, before S4. The gates run after S4, at the PR head.
7. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — the human's ruling on OPEN-2, and W assembled for OPEN-3 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md`, item 3, A). References only.*

1. **OPEN-2:** O6 found the hidden probe (Amendment 2 item 3), so §2 item 4's H1 is used: the rule's first sentence becomes the architect's H1 sentence, and the second and third stay the human's, byte-copied.
2. **W, assembled from §5's table** and the observations of Amendment 2 item 3: O1, O2, O3, O4, O9, O11, O12 and O13 each came out as the table needs, so every clause lands unchanged and W is §2 item 4's text as written. It goes to the human for OPEN-3.
3. **Still open:** OPEN-3, before S4.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — the human's ruling on OPEN-3; S4's section with its placeholders replaced (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md`, item 1). References only.*

1. **OPEN-3:** W is approved as assembled (Amendment 3 item 2), in the architect's words. S4 follows.
2. **The placeholders of §2 item 4, replaced by the custodian's script:** §<n> is §32, the next free number at M0 and at main 46e56dc9aba8c63eff8c08fe8ddb14a4af0cee8d, between which `AUTONOMY.md` is unchanged; the rule's pin is `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:23 @ fbbffe89ecf693eabfe95448007ae0444e305d19 sha256:8bd8015eca14482708510c7f25b68b6d3af9d817837db52b37f9f821cb3393fd`; the bracket takes its H1 words; the rule is H1's two sentences, then the second and third sentences byte-copied from inside that line's quotes; W is §2 item 4's text, byte-copied; the commit is S3, 7f09c0e3f318a17a77cc00d5b2f9de4abe48028c, where O1 to O14 were observed, with Claude Code 2.1.300 and ripgrep 15.2.0 (Amendment 2's report).
3. **The bytes S4 appends** to `AUTONOMY.md`, after its last line: one empty line, then the eleven lines below, then a final newline, 1833 bytes, sha256 1d9b2fa8053bf73ca433a20ca8d9521c721fd4b3b0da8cd33b830ca933a1d4ad. One worker appends them in one commit, byte for byte from this amendment at the main commit that holds it, and checks §8 item 2.

~~~markdown
## §32. A tree-wide search excludes historical material (the human, 2026-10-14; `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md`, piece A and the addendum's A; appended after §31 so that no line a record cites above it moves)

The rule is the human's. It is byte-copied by script from `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:23 @ fbbffe89ecf693eabfe95448007ae0444e305d19 sha256:8bd8015eca14482708510c7f25b68b6d3af9d817837db52b37f9f821cb3393fd` (a sub-line span: the quoted sentences inside that line; the hash is the whole line's), and nothing in it is changed except its first sentence, replaced as the human approved in `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`, OPEN-2:

```text
A tree-wide search excludes historical material: the paths in .ignore. A tree-wide `rg` from Bash also skips hidden folders such as .cut-archive/; the Grep tool does not. Before concluding that a ruling, precedent, review or design does not exist, search those locations explicitly. Active work keeps direct references to its own drafts and gate reports.
```

**Searching an excluded location** (the addendum's A; the architect's words, approved by the human in that form's OPEN-3): Name the location to search it: give the Grep tool that folder or that file as its path, run `rg --no-ignore` from Bash with that folder as its path, or Read the file by its name. A Grep call over the whole tree, or over a folder above the excluded one, does not reach it. The Glob tool still lists the files there by name.

The excluded paths are the five lines of the root `.ignore`. Each method above was observed at 7f09c0e3f318a17a77cc00d5b2f9de4abe48028c with Claude Code 2.1.300 and ripgrep 15.2.0 (that form, §4, O1 to O14).
~~~

4. **Next:** S4, then the PR and both gates (§9).
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.
