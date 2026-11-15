Reviewed: PR #318 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6 (the custodian's filing note, 2026-11-14: the gate, the reviewer, at C4, this gate's attempt 3 in the gate log, the C3 gate's second attempt that ADV-2026-11-14-20 item 9 (b) calls attempt 2, with a verdict and a row of its own, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its message sent at 2026-11-14T18:28:23Z to the same run, whose resumed prompt at 2026-11-14T18:28:25Z holds it byte for byte (5056 bytes, sha256 2bfcbe45f0850783dcaf808dea9d2839da24ce84306677046b2b149cb9aeadb0), naming the files <S>/adv-2026-11-14-19.copy.md (10756 bytes, sha256 54962341337e3c408e2f1dfa137e49a516d1dc4d5ec87381b59dc120270c324a), <S>/adv-2026-11-14-20.copy.md (12317 bytes, sha256 8b0bc0380fb64c66b4d3e88ffb22d7195cc5cea76aa9e67e3710537054ebdeda), <S>/so-318-c4-diff.patch (14545 bytes, sha256 279084da5cd75da20db6f24e7ae53a96032c0163345d9cce0e4bcce63d9a7d08), <S>/chk-318-c4.mjs (5873 bytes, sha256 91b40199b2e539e124434cccc86de00ee1fae3fc1860b69c65817ac1f5dc562d), <S>/chk-318-c4.out (955 bytes, sha256 03ceba8c59f2b69e03b0a180c31e3db2c7c7202b74223a7ce746ff0083cd71c5), <S>/rep-soc4-c4.md (5482 bytes, sha256 291199538adf979ccdcf98ddd8ac4d38513734840bbec0592361d13538d66dc8); this attempt 2026-11-14T18:28:25Z to 2026-11-14T18:47:28Z by its transcript, 25 calls (Bash 18, Read 6, SubagentHandback 1), none errored, no file written by a Write or Edit call, model claude-opus-5-5; by script, every run it claims (the custodian's check script and its cmp, verify-quotes whole, gh pr checks, gh run list and view, its fence check) has a Bash call behind it whose result is not an error; below, the hand-back byte for byte (with one final newline, 12417 bytes, sha256 690907cab0e3ee0f5ebd35398bb0ec027c06976dcd93345d8b4c54230192d6d5). Nothing is changed. Its O1 is met by the custodian's records commit bc8e8e34, which filed both rulings on main before this filing.)

Reviewed: PR #318 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, gate reviewer, attempt 3 (cut/second-open-history-before-1c-step-3 @ c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6)
Verdict: PASS

I find nothing to fix at C4 and nothing for the advisor. My C3 finding C1 is closed:
- Topic 4's second sentence now carries both of OPEN-N4 (a)'s conditions.
- Its fourth sentence is ADV-2026-11-14-19's, which I read as true against the code.
- My D1 is applied byte for byte as ADV-2026-11-14-20 item 6 (b) gives it.

C4 changes no Rust file, so attempt 1's runs and its mutation observations stand. I repeated no cargo run.

## Findings

### Correctness
None. Every clause of the three sentences that item 4 (b) and (c) put in holds against its sources and the code at C4 (check (b)).

### Evidence
None.

### Documentation
None.

### Observations
- **O1. The two rulings are not on main yet.** ADV-2026-11-14-19 and ADV-2026-11-14-20 exist only as the custodian's scratch copies. `git ls-tree origin/main state/directives/` (main at e682e829) has no file for either. Amendment 2's preamble now cites both, so they should be filed on main before the merge, so that the attribution resolves. The custodian's script checks the copy only against the custodian's own size and hash.
- **O2. Where the custodian's script is weaker than its words.**
  - **Part B** proves that the ADR at C4 equals the ADR at dc0bd937 up to `## Amendment 2 — `, followed by item 5's fence. It does not prove that item 5's fence is ADV-2026-11-14-17 item 7 with item 4's three spans replaced. My derivation closes this:
    - each old span occurs once in ADV-17's item 7 fence, which I read from main;
    - after the three replacements, that fence equals ADV-20's item 5 fence (`true`).
  - **Part E** checks by regex only that `fn adopt_project`, `fn save` and `fn history` exist. It does not check that `save` and `history` are methods of `Projects`, or that `project.spatial` exists. Its comparison of callers is trivially equal, since no `.rs` file changed. It checks no clause. My grep at C4 closes this (check (b)).
  - **Parts A, C and D** check what they say. C is strong: the whole file equals dc0bd937's with the one span replaced. D is redundant with B and C.
- **O3. My own C3 report cited `:295` for topic 4.** The ADR has 293 lines, and topic 4 is its last line, 293 (ADV-2026-11-14-20 item 12). It was my miscount.
- **O4. CI's push runs at C4 are fewer than before.** There are push runs only for Ported notices and Governance CI. Product CI (Rust and shell) and Rust fmt ran on pull_request only, which is consistent with a change to documents only. Every check row passes (CI section).
- **O5. The worker's §21c count changed.** At C3 it was 722 over 7 files; now it is 710 over 6, because SKP-V0.md moved to the files outside the code count. This is for the closing amendment's class-8 figure under ADV-2026-11-14-16, not for this gate.

## Checks

**Start.**
- The fetch exited 0.
- HEAD is c8f8bdca…, the branch is the PR's, and the porcelain is empty.
- `ls-remote` gives c8f8bdca….
- `log dc0bd937..C4` shows the one commit c8f8bdca, "docs: ADR-036 Amendment 2 items 4's three spans and item 43's second comment in KNOWN-LIMITATIONS.md reworded".
- origin/main is e682e8296bf0e72cb9b04866e72fe5e64d88e7b9.
- `df`: C: 50G free (90%), D: 342G free (27%).
- The packet files match their stated sizes and hashes:
  - ADV-19 copy: 10756 B, 54962341…;
  - ADV-20 copy: 12317 B, 8b0bc038…;
  - the diff: 14545 B, 279084da…;
  - the script: 5873 B, 91b40199…;
  - its output: 955 B, 03ceba8c…;
  - the worker's report: 5482 B, 29119953….
- I read all of them whole.

**The script.**
- Command: `node <S>/chk-318-c4.mjs c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6 > <S>/g318c4r-chk.out`.
- It exited 0, with 16 OK lines and ALL OK.
- `cmp` against `<S>/chk-318-c4.out` exited 0.

**(a) Amendment 2 against item 5's fence.**
- Script part B passed (OK).
- My `node -e` check, with its output in `<S>/g318c4r-fence.txt`, exited 0:
  - the ADR at C4 ends with an LF followed by item 5's fence, and has 293 lines;
  - item 5's fence equals ADV-17's item 7 fence (read from main) with ADV-20 item 4's three spans replaced, each old span occurring once (`true`).

**(b) The three sentences put in.** All line numbers are at C4. `git diff --stat dc0bd937 C4 -- '*.rs'` is empty, so the code lines are the same as at C3.

- **Sentence 2.** Byte-copied: "Under OPEN-N4 (a), step 2's reopen, in the same run, of a saved project whose record this run holds binds the new open to the project at the reopen, before any step on it, and continues that record."
  - **The sources:**
    - The options draft at `:200-201` (main) reads "A same-run reopen (step 2) of a project whose record this run holds:" and "(a) the reopen is bound at the reopen and continues that record;".
    - The 1c form at `:1874` (C4) reads "OPEN-N4: (a), a same-run reopen of a project whose record this run holds is bound at the reopen and continues that record."
    - The human's item 5 (a), directive `:25` (main), reads "OPEN-N4: (a)."
    - "before any step on it" comes from the second-open form at `:169` (C4): "The bind inside the reopen, before any step on the new handle."
  - **The clauses:**
    - "in the same run" and "whose record this run holds" match the sources.
    - "binds … at the reopen" and "continues that record" match.
    - "saved" adds nothing untrue: a project holds a record only once an open is bound to it, by a save, as the next item shows.
  - Holds.
- **Sentence 3.** Byte-copied: "At this piece no save binds an open to a project whose record the run already holds".
  - Binding happens only in `adopt_project` at `session_history.rs:343`. It returns at once when the open is bound (`:345-347`) and binds at `:363`. Its one product caller is `mod.rs:361`, inside `Projects::history` (`:357`), which `Projects::save` calls at `:316`.
  - A first save binds to a project minted fresh at `mod.rs:251`.
  - A later save's project is the one found by the open's catalog name (`:244-247`). Only this open's saves reach that project.
  - The three reasons are at `:251`, `:266-268` and `:244-247`.
  - Holds.
- **Sentence 4.** Byte-copied: "A later save binds the open only if no save has bound it yet, which is so only after a record move that failed (item 2 of this amendment), and until an open is bound to that project the project holds no record (`StepRecorder::adopt_project`)."
  - "only if no save has bound it yet": `:345-347`.
  - "only after a record move that failed":
    - a later save means that `known` was found (`mod.rs:244`), so an earlier save pushed its `SavedProject` (`:306-314`) after `replace` (`:305`);
    - with no return in between, that save then called `history` (`:316`), and so `adopt_project` (`:361`);
    - in `adopt_project`, the only path to an error is `copy_under(...)?` at `:352`, and every other path binds at `:363`;
    - the `saved` lock is held for the whole save (`:243`), so two saves cannot interleave.
  - "until an open is bound … no record": a record becomes `Project(P)`'s only at `:358`, which is in the same locked call as the bind at `:363`, or by `create` (`:313`) for an open whose holder is `Project(P)`, which is only so when the open is bound (`:145`).
  - Holds.
- **Symbols at C4**, by `git grep`:
  - `StepRecorder::adopt_project`: `session_history.rs:343`, inside `impl StepRecorder` (`:252`);
  - `Projects::save`: `mod.rs:236`;
  - `Projects::history`: `mod.rs:357`, inside `impl Projects` (`:210` to `:376`);
  - `project.spatial`: `mod.rs:54`;
  - "item 2 of this amendment" is the ADR's line 289.

**(c) Item 6 (b)'s span against item 43's second comment.**
- Script part C passed (OK, at line 438).
- My check found the new span once on `KNOWN-LIMITATIONS.md:438`, ending the comment just before ` -->` (`true`).
- Item 43's line still equals main's line with ADV-17 item 3's span replaced (`true`).
- The clauses, at C4:
  - "after the move": `copy_under` succeeded (`:352`); the record's `dir` became the new folder (`:353`); its holder became the project (`:358`).
  - "fails": the three removals at `:359-361` each discard their error with `let _ =`.
  - "the old folder stays": `remove_dir` at `:361` does not remove a folder that is not empty.
  - "a normal close does not remove it": `end_session` (`:403-412`) removes only each record's own `dir`, and nothing keeps the old path after `:361`.
- Holds. These are record words under §31 (d), as ADV-20 item 6 (c) says.

**(d) C4 changes nothing else.**
- `git diff --numstat dc0bd937 C4`: the ADR 2/2 and KNOWN-LIMITATIONS.md 1/1.
- Script parts A, B, C and D passed:
  - the parent is dc0bd937;
  - the files are those two only;
  - the ADR's hunks are at `-285` (the preamble) and `-293` (topic 4);
  - the list's one hunk is at `-438`;
  - item 43's line and its approval comment are unchanged.
- I read the diff whole, and it matches.

**Light runs** at C4, from `C:/dev/wt/so`:
- `node scripts/plan/verify-cites.mjs`: exit 0. "every rooted (in-tree) path:line reference across 2987 file(s) resolves. (194 loose reference(s) advised above.)"
- `node scripts/plan/verify-test-claims.mjs`: exit 0. "all 803 claimed test(s) across 263 file(s) exist or are planned, superseded or withdrawn (25 planned, 16 superseded, 17 withdrawn, advisory)."
- `node scripts/plan/verify.mjs --offline`: exit 0, "verify:plan PASS".
- `node scripts/plan/verify-quotes.mjs`, whole, in a shared hold: the hold call exited 0. "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors." Its output has 0 lines naming ADR-036 or KNOWN-LIMITATIONS.
- Not run, and why:
  - `cargo fmt` and every cargo run: C4 changes no Rust file;
  - `node --test` on the scripts suite: C4 changes no script, the worker ran it at C4 (598/598, in its report), and CI's Governance runs passed at C4.

## CI
- The first read, `gh pr checks 318` at Sat Nov 14 18:35:11 UTC 2026, exited 8: 12 rows passed, and `cargo test --workspace (windows-latest)` was pending.
- The second read, at Sat Nov 14 18:46:15 UTC 2026, exited 0 with 13 rows, all passing.
- `gh run list --commit c8f8bdca…` and `gh run view 43626310966` show every run at head c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, and every one completed with success:

| Workflow | Run | Event |
|---|---|---|
| Product CI — Rust workspace | 43626310966 | pull_request (completed when I viewed it at 18:46Z) |
| Rust fmt | 43626310965 | pull_request |
| DCO sign-off | 43626310990 | pull_request |
| Ported notices | 43626310957 | pull_request |
| Ported notices | 43626306150 | push |
| Exposure scan | 43626310938 | pull_request |
| Governance CI — plan, queue, site | 43626310956 | pull_request |
| Governance CI — plan, queue, site | 43626306158 | push |
| Product CI — shell | 43626311065 | pull_request |

## End (18:46:22Z)
- HEAD is c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, and `ls-remote` gives the same.
- The porcelain is empty.
- `df`: C: 50G free (90%), D: 342G free (27%).

## Status readings and hold lines
- **Status 1** (`<S>/g318c4r-status-1.txt`, exit 0): no `project=SpatialIDE` line. quiet=False, average=48.3%, peaks-over-25=60.
- **The hold:**
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:64252 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:64252 affinity=FF (cores 0-7)`
- There was no MACHINE_WAITING or MACHINE_ERROR line, and no hold was refused.

## Background shells
These were moved to the background or started there:
- bjmuznjrv: the light verifies and the status call. It was moved to the background at 180 s and exited 0.
- be4f4g1yw: the verify-quotes hold. Exit 0.
- bdafvxx4e: a bounded wait loop. It ended by itself.

All have completed. None is left running, and none was killed. My other wait loops ran in the foreground with hard caps, sleeping 1 to 2 s per turn.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

## Files (all in `<S>`)
g318c4r-start.txt, -chk.out, -fence.txt, -dirs.txt, -sources.txt, -symbols.txt, -vcites.txt, -vtc.txt, -verify.txt, -vquotes.txt, -status-1.txt, -ci.txt, -ci2.txt, -runs.txt, -run966.txt, -end.txt
