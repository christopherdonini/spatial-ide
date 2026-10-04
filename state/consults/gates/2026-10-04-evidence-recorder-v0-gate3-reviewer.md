# PR #172 gate 3 — reviewer
Reviewed: cut/evidence-recorder-v0 @ 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5

**Verdict: PASS** (cut/evidence-recorder-v0 @ 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5).
- Amendment 3 resolves the architect's G2-S1-1 and G2-N-1, and my S2-A.
- The README commit resolves my N-B and N-C and the architect's G2-N-4. It resolves N-D for the pointer; the C2-d residue stays where the architect's gate-2 report puts it, on the install sight.
- No new S1 and no new S2. Three new N.
- Code, tests, validate, §7 and all 20 mutations come out as the form predicts at this head.

Tag `node:evidence-recorder-v0@g4`. This re-gate is by reference to `state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-reviewer.md` and `state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-architect.md`.

Cite convention, as at gate 2:
- The form's lines 1-459 are on main at ea5aba5d and are cited by section.
- Amendments 1 to 3, and every file under `tools/mods/spatial-evidence-recorder/`, exist only on the unmerged branch. They are cited by section, amendment and item, or as path:line named with the commit, with no hash (round 25, item 2).
- Gate reports cited by path:line are on main under `state/consults/gates/`.
- No passage below is a quotation.

## Gate-2 findings, disposition

**Architect:**
- **G2-S1-1, resolved** by Amendment 3's first bullet (class 2).
  - It names the defect: §8 item 3's set includes a network call, and the calls line lists `$` members only.
  - It gives the corrected reference. A network call is ruled out by reading `hooks/register.js`, with the gate-1 reviewer's §8 item 3 reading as the proof. Every `$` member outside §2.0 is ruled out by the calls line at 2.1.289.
  - Checked, three ways:
    - (a) A grep of `hooks/register.js` at 2d95575e for `import`, `require(`, `fetch`, `XMLHttp`, `WebSocket`, `http`, `net.`, `globalThis`, `eval(` and `Function(` exits 1. The only `$` members in the file are `$.agent.list`, `$.fs.write` and `$.process.run`, two occurrences each: the header comment and the call.
    - (b) The gate-1 reviewer's §8 item 3 reading (`state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md:101`) states that there is no network call.
    - (c) A probe at 2.1.289: two temporary one-line edits in `agentTypeOf`, each reverted with porcelain 0 afterwards. With a direct `$.fs.read` call added, validate's calls line gained `$.fs.read (via agentTypeOf)`. With a global `fetch` call added at the same place, the calls line was unchanged from the gated head's.
  - So at 2.1.289, validate lists a direct `$` member call and does not list a global fetch. The premise of G2-S1-1 is observed, and the corrected reference assigns each item to a proof that carries it.
- **G2-N-1, resolved** by Amendment 3's second bullet. It classes the C2-a correction class 1 by round 15 (g).
- **G2-N-2, G2-N-3 and G2-N-5:** neither commit touches them, and they stand as notes. G2-N-2 stays with the custodian's evaluation.
- **G2-N-4, resolved** by 2d95575e, all three points:
  - `tools/mods/spatial-evidence-recorder/README.md:41` at 2d95575e adds the assertions half of §1's What-a-record-proves limit;
  - line 46 carries E1's condition, approval under §2.2;
  - line 48 is §1's Latency limit, with the docs/08 clause.

**Reviewer (mine):**
- **S2-A, resolved** by Amendment 3's second bullet, as G2-N-1.
- **N-A:** stands, for the pre-E5 write-latency amendment that C2-d requires.
- **N-B, resolved:** README:46 at 2d95575e matches §1's Live behaviour row, condition included.
- **N-C, resolved:** README:48 at 2d95575e.
- **N-D, resolved for the pointer.**
  - README:72 at 2d95575e points at the form's §9 (Operator) and §7. Those hold the stop rules and the 300 ms and 20% figures.
  - C2-d's lower-bound reading is still reached only through the form's amendments. The architect's gate-2 report, in its closing list (item 3), puts C2-d on the install sight, so I do not reopen it.
- **N-E and N-G:** stand as notes.
- **N-F:** Amendment 3 supersedes Amendment 2's C2-c second sentence whole. Its corrected reference re-carries the `$.process.spawn` content in general form, as a `$` member outside §2.0. Amendment 1's C2-c second bullet stands and agrees with it. N-F no longer has an object.

## Amendment 3's record form (§8 item 13; round 12 (d), (e); round 15 (g))

- **Append-only, holds.**
  - f7dd269e touches the form alone: +9, -0 (`git diff --stat 609ab945 f7dd269e`, exit 0). 2d95575e does not touch the form.
  - A grep for removed lines in the form's diff to 2d95575e exits 1 from ea5aba5d and exits 1 from 609ab945. The pattern was self-tested positive on the README diff, which has 3 removed lines (exit 0).
- **No prediction edited.**
  - Only appended lines exist, so §3, §4, §5 and E5's prediction are untouched.
  - The italic line says `hooks/register.js` and the tests are unchanged. That resolves: the blob ids are equal at 609ab945, f7dd269e and 2d95575e (register.js 079d8b89, the test file e705127b), and `git diff --quiet 609ab945 2d95575e` on both exits 0.
- **Round 12 (d), holds.** The first correction is two sentences and the second is one. Each gives defect, corrected reference and proof. Neither restates an earlier amendment's claim beyond naming the defect.
- **Round 12 (e), holds.** The superseded index is present. It names Amendment 2's C2-c second sentence and the class given to the C2-a correction, matching the two corrections. See N-I.
- **Round 15 (g):** applied to the C2-a withdrawal row.
- **References, all resolve:**
  - Gate-log 392 and 393 are entries 392 and 393 (1-based) of `state/gate-log.json` on main at 920b1a78cbb67fc73d3e58e5c62206c5475aef70. They are the architect FAIL and the reviewer PASS, both record rounds, both evidence-recorder-v0, both at 609ab945.
  - Both gate-2 report paths exist on main.
  - §2.0, §8 item 3, round 15 (g), and Amendment 2's C2-a and C2-c corrections all resolve, as does the gate-1 reviewer's §8 item 3 reading (above).
- **§8 item 13, holds:**
  - no line cite into `DECISIONS-PENDING.md`;
  - no hash reference, so none at a branch commit;
  - no test-text span;
  - no bare self-line, and no pin read as current;
  - the tool claim carries 2.1.289 (see N-H);
  - the superseded index is present.
- **Round 25, item 2, holds:**
  - no §7 overrun, and §7's line is unedited: its sha256 is 05d3178657787048c6c32f6119a46f4285316f0d9d84f2bad51db9c813fd9ffa at ea5aba5d and at 2d95575e;
  - no scope addition;
  - no record calls a `verify-mutation` run an observation;
  - no test-text span is pinned or named;
  - no five-line form.

## README (f7dd269e to 2d95575e) against §1, §2.10, §8 items 11 and 16

- **The diff:** 6 insertions and 3 deletions in one file. `git diff --check 609ab945 2d95575e` exits 0. LF throughout (0 CR), no BOM, and a final newline. The worker's shell edit left no encoding damage; `file` reports UTF-8.
- **§1, every limit now has a README line** at 2d95575e:
  - Citability and What a record proves: :41;
  - Exit status: :42;
  - The tree: :43;
  - What the identity misses: :44;
  - The hashes: :29;
  - Coverage: :45;
  - Live behaviour: :46;
  - Loss: :47;
  - Latency: :48;
  - Builds and platforms: :49 and :5;
  - Isolation: :50;
  - Loading: :51.
- **§2.10, pass.** The earlier items are unchanged, and the added text carries no quotation marks.
- **§8 item 11, pass.** :41 still says a record is never a mutation observation. No text presents a recorder line as citable.
- **§8 item 16, pass.** :66 is unchanged, and the only scope named is user.
- **Hash pins, both recompute:**
  - `git show 884fc727:state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md | sed -n 55,59p | sha256sum` gives d3c294b2624a53bd2b4042cf8ebe609e63161f657ebf0113ef762cf6c00a6225;
  - lines 61-64 give 648fffdd48a3f672d0938ba1bb2b7e581cb0f2bcee47c0a9aefefd823e238714;
  - `git merge-base --is-ancestor 884fc7271f9ef78187578164b7032a5f4ba97084 origin/main` exits 0;
  - the brief's diff from 884fc727 to origin/main is empty (exit 0), so pin and tree agree.

## New findings

**N-H. Amendment 3's first sentence makes a tool claim without its build in the same sentence.** The claim is that the calls line lists `$` members only. 2.1.289 is named in the next sentence of the same bullet, and Amendment 2's C2-e places the calls line at 2.1.289. I read the bullet as one unit, so round 15 (c) and §8 item 13 are met; probe (c) above observes the claim at 2.1.289. If the architect reads sentence by sentence, this goes to the reduction under the record cap, not to a third correction round.

**N-I. The superseded index covers the heading's class label but not the italic line's.** It names the class that Amendment 2's heading gives the C2-a correction. Amendment 2's italic first line also gives class 2. Both carry the same label, so the index covers it in substance.

**N-J. A commit trailer names a model that did not write the commit.** 2d95575e's Co-Authored-By trailer names Claude Opus 5.5. Worker report 3 says the worker ran as Sonnet 5.5 and used the brief's trailer as instructed. The report discloses this, and no §8 item covers it. Future worker briefs should give the trailer for the model that will run.

## Checks, with exit codes

All checks ran in `C:/dev/wt/recorder` at 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5. `claude` ran only as `--version`, `plugin test` and `plugin validate`, each under `timeout`.

1. **Start state.**
   - `git status --porcelain` was empty (exit 0), and `git rev-parse HEAD` gave 2d95575e.
   - `git fetch origin` exited 0, and origin/cut/evidence-recorder-v0 is 2d95575e.
   - The merge base with origin/main is ea5aba5d120ee173d32c786a53b291ec83ff3d71.
   - `git log origin/main..HEAD` shows seven commits, linear: 9acc86b8, 32fc334f, 976e64cd, d48bedc4, 609ab945, f7dd269e, 2d95575e.
2. **Diff since gate 2.** `git diff --stat 609ab945 2d95575e` (exit 0): the form +9, README +6/-3, nothing else. Byte equality of register.js and the test file: see Amendment 3's record form.
3. **The full diff, three-dot.** `git diff --stat origin/main...origin/cut/evidence-recorder-v0` (exit 0): 8 files, 1166 insertions, no deletions. These are §7's seven files plus the form's 46 appended lines.
4. **§7 recounted** by its counting command, base ea5aba5d120ee173d32c786a53b291ec83ff3d71, head 2d95575e (exit 0):
   - insertions 5, 7, 1, 76, 3, 464 and 564 over §7's seven files, no deletions;
   - total 1120 of 1400: no overrun.
5. **Append-only:** exit 1 twice, as above.
6. **`timeout 60 claude --version`** printed 2.1.289 (Claude Code), exit 0. It was run before the test and again before the mutations. I2 (a) did not fire.
7. **`timeout 300 claude plugin test tools/mods/spatial-evidence-recorder`** exit 0, 20 pass, 0 fail. It was run again after the mutations: exit 0, 20 pass.
8. **`claude plugin validate`**, each under `timeout 120`, all four exit 0:
   - `tools/mods/spatial-evidence-recorder`, text: passes with one `version` warning. The hooks line is `tool.call{tool=Bash}, turn.complete`. The calls line is `$.agent.list (via agentTypeOf)`, `$.fs.write (via writeRecord)`, `$.process.run (via gitRun)`.
   - the same with `--json`: success true, the same two notes.
   - `tools/mods`, text: passes with two `version` warnings.
   - `tools/mods --json`: success true.
   - All four are the same as at gate 2. I3 did not fire.
9. **The validate probe** of G2-S1-1 (above): two runs of `timeout 120 claude plugin validate tools/mods/spatial-evidence-recorder`, each exit 0, each on a reverted one-line edit.
10. **Commit messages** for f7dd269e and 2d95575e: both signed off. A grep for a profile path exits 1 on both messages and exits 1 on the three-dot diff.
11. **CI.** `gh pr checks 172` exits 0 with six checks passing (an earlier call failed on a TLS handshake timeout, exit 1, and was retried). `gh run view` on runs 37211025413, 37211029691, 37211029906 and 37211029695 gives head 2d95575e, conclusion success, for each.
12. **PR body** (`gh pr view 172`, exit 0): the commit list names f7dd269e and 2d95575e, and the §7 line gives 1120 at 2d95575e, matching check 4.
13. **End state.** `git status --porcelain` is empty, and HEAD is 2d95575e. `ls` reports `C:/dev/spatial-ide-local` and `C:/dev/recorder-local` both missing, at the start and at the end.

## Mutations observed at the gated head

**Method.** `hooks/register.js` and `test/recorder.test.ts` are byte-identical at 609ab945 and 2d95575e (blob ids above), so the mutation targets are those gate 2 used.
- **The script.** A Node script in the session scratchpad, outside the repository, replaced one exact span in `hooks/register.js` per mutation. It asserted exactly one occurrence, and that the edit was present, before each run.
- **Dry run.** All 20 edits were applied in a dry run first. Each passed `node --check` on an `.mjs` copy, and each diff was read; every edit appeared as intended.
- **No backslash.** The edits hold no backslash. T2 uses `[.]mjs`, and T15 uses `String.fromCharCode(10)`.
- **Each run.** For each mutation, the loop ran `timeout 300 claude plugin test tools/mods/spatial-evidence-recorder`, restored the file with `git checkout`, and counted porcelain lines (0 every time). It then compared the `(fail)` names with the failing set parsed from the test's `// RECORDED MUTATION:` comment.
- **Load errors.** A grep of every run log for SyntaxError, ReferenceError, TypeError, failed to load and Cannot find exits 1, so no run printed a load error. The pattern was self-tested positive.
- **Build.** `claude --version` read 2.1.289.

**T1 was run twice.** Its first run took 93 s, against about 2 s for the others, and nine tests timed out at 5000 ms. The machine was loaded by a concurrent file search of mine; that run's set did not equal the comment's. T1 was run again with the machine quiet, and that run is recorded below.

| Test | Mutation (§4) | test exit | pass/fail | Named test failed | Failing set equals the comment's |
|---|---|---|---|---|---|
| T1 | snapshotAfter always all-unavailable (second run) | 1 | 15/5 | yes | yes |
| T2 | A4 matches any `verify*.mjs` basename | 1 | 19/1 | yes | yes |
| T3 | env-assignment branch removed | 1 | 19/1 | yes | yes |
| T4 | try around the before-snapshot removed | 1 | 19/1 | yes | yes |
| T5 | treeChanged over the diff pair alone | 1 | 17/3 | yes | yes |
| T6 | an unavailable pair reads false | 1 | 16/4 | yes | yes |
| T7 | errored arm's stdout/stderr from `ran.result` | 1 | 19/1 | yes | yes |
| T8 | `persisted` fixed false | 1 | 19/1 | yes | yes |
| T9 | deny clause removed | 1 | 19/1 | yes | yes |
| T10 | `run_in_background` check removed | 1 | 19/1 | yes | yes |
| T11 | usage `agent_type` fixed unavailable | 1 | 19/1 | yes | yes |
| T12 | main-loop return removed from recordUsage | 1 | 19/1 | yes | yes |
| T13 | recordRun's final return a spread with its own context | 1 | 6/14 | yes | yes |
| T14 | gitRun drops `cwd` | 1 | 18/2 | yes | yes |
| T15 | log root from the toplevel plus `/.git` | 1 | 16/4 | yes | yes |
| T16 | before-side calls awaited one by one | 1 | 19/1 | yes | yes |
| T17 | after-side diff without `timeoutMs` | 1 | 19/1 | yes | yes |
| T18 | run-record agent type not looked up | 1 | 19/1 | yes | yes |
| T19 | `backgroundedAfterMs` fixed undefined | 1 | 19/1 | yes | yes |
| T20 | extra `stdout_text` field | 1 | 18/2 | yes | yes |

This report is a run's output, not a recorder line. No `verify-mutation` run was made or relied on.

## §8 items 1 to 4

These are checked by reference to my gate-1 reading (`state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md`, its §8 items 1 to 4 section), carried at gate 2. `hooks/register.js` is byte-identical at 976e64cd, 609ab945 and 2d95575e, so every line cited there holds at this head. Pass.

The other items were re-read on the two commits, and all pass:
- item 11 and item 16 on the new README;
- item 12 on the recount;
- item 13 on Amendment 3, with N-H and N-I.

## Writes

The only write to the repository is this report. Outside the repository, in the session scratchpad: the test, validate, probe and mutation outputs, the mutation script and the probe script. In the worktree, each mutation and each probe was a temporary edit, reverted before the next. Nothing was written under the user Claude directory. A first attempt to write this report in one block failed to parse in the shell and created no file; it was then written in parts.
