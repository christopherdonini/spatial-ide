Reviewed: PR 361, the branch cut/opened-of-panic-frees-the-lock at 0922c90a38ad91bf7922cf9a6baf0f8ed1344397, in C:/dev/wt/dpanic (the custodian's filing note, 2026-11-23: the reviewer (Opus), the run part of the narrow read of node (d)'s deny commit (ADV-2026-11-23-08 item 3), after C: was over its floor again (ADV-2026-11-23-12 item 4), node:opened-of-panic-sites-free-the-lock@deny-narrow-read-2, dispatched at 2026-11-23T11:07:02.585Z with its brief in a scratch file it checked by size and sha256; its run: Bash 33, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T11:07:02.681Z to 2026-11-23T11:28:05.365Z by its transcript. Filed below the rule from its hand-back, 10501 bytes, sha256 b09330a0097381dd03e8262809f9d4684ddd41b5c64ec4d62e4f9cfbb2a72d0a, byte for byte but for the hold lines' values: 10 `project=` and 10 `shell=` values are written `<m>`; with one final newline added. The read part it names at `state/consults/2026-11-23-opened-of-panic-deny-attribute-narrow-read-part-1-reviewer.md` stood there only in the main checkout's working tree, during a records commit that did not land (1123l's first attempt); it is filed at `state/consults/gates/2026-11-23-opened-of-panic-deny-attribute-narrow-read-part-1-reviewer.md`. Its line cites are to the branch head it names.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/dpanic @ 0922c90a38ad91bf7922cf9a6baf0f8ed1344397

Brief checked before starting: sha256 c1c8b3d85bd5b12173b59a88f6613f7dbf87b164490fad6663c813dc594e2346, 7973 bytes. Both match. Ruling ADV-2026-11-23-08 item 3 read in the main checkout, `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-08-node-d-the-architects-sentence-into-section-1-the-reviewers-reading-in-the-closing-the-deny-attribute-in-idle-time.md`:20-24. The part-1 report is on main (`state/consults/2026-11-23-opened-of-panic-deny-attribute-narrow-read-part-1-reviewer.md`, F1 at :99, F2 at :116).

**Steps**

1. Setup
   - `git -C C:/dev/wt/dpanic rev-parse HEAD` gives 0922c90a38ad91bf7922cf9a6baf0f8ed1344397. `git status --porcelain` is empty.
   - `git diff 12946382bbe766e686ec245f2ddfd625fdabab6c 0922c90a38ad91bf7922cf9a6baf0f8ed1344397` changes one file, `kernel/src/project/mod.rs`, in one hunk (`@@ -924,7 +924,7 @@`): one line out, one line in, at line 927. Under `cat -A` neither line has a CR.
     - Out: `    // Fails the build if nothing calls this, so the opened arm cannot quietly stop using it.`
     - In: `    // Fails a non-test build of the lib if the opened arm, its only caller outside tests, drops it.`

2. The unmutated lib build
   - `cargo build --locked -p spatial-kernel --lib`: exit 0.
   - Output was `Compiling spatial-kernel v0.0.0 (C:\dev\wt\dpanic\kernel)` and `Finished `dev` profile [unoptimized + debuginfo] target(s) in 26.67s`. No line begins `warning`.

3. M5, by Bash only
   - `cp kernel/src/project/mod.rs D:/wt-data/dpanic/rv2-mod.rs.keep`. Both copies have sha256 10534ec42d0b50ddd299e3884ad1014c5f1d09b77fbaa1416dbe0fd7ab3b32e9.
   - `sed -n 917p` prints `            Reopen::Opened(o) => OpenProjectResponse::Opened(Box::new(self.reply_of(*o))),`. This matches M5's text at form line 417: "the `Reopen::Opened` arm calls `opened_of(*o)` in place of `self.reply_of(*o)`".
   - `sed -i '917s/self\.reply_of(\*o)/opened_of(*o)/' kernel/src/project/mod.rs`. `git diff` shows one hunk `@@ -914,7 +914,7 @@`, one line out and one line in:
     - `-            Reopen::Opened(o) => OpenProjectResponse::Opened(Box::new(self.reply_of(*o))),`
     - `+            Reopen::Opened(o) => OpenProjectResponse::Opened(Box::new(opened_of(*o))),`
     - No CR.

4. Under M5
   - (a) `cargo build --locked -p spatial-kernel --lib`: **exit 101**. Error lines, byte for byte:
     ```
     error: method `reply_of` is never used
        --> kernel\src\project\mod.rs:929:8
         |
     658 | impl Projects {
         | ------------- method in this implementation
     ...
     929 |     fn reply_of(&self, o: Opened) -> OpenedProject {
         |        ^^^^^^^^
         |
     note: the lint level is defined here
        --> kernel\src\project\mod.rs:928:12
         |
     928 |     #[deny(dead_code)]
         |            ^^^^^^^^^

     warning: struct `ReplyGuard` is never constructed
        --> kernel\src\project\mod.rs:940:8
         |
     940 | struct ReplyGuard<'a> {
         |        ^^^^^^^^^^
         |
         = note: `#[warn(dead_code)]` (part of `#[warn(unused)]`) on by default

     warning: `spatial-kernel` (lib) generated 1 warning
     error: could not compile `spatial-kernel` (lib) due to 1 previous error; 1 warning emitted
     ```
   - (b) `cargo build --locked -p spatial-kernel --all-targets`: **exit 101**.
     - Its error lines are the same as in (a), byte for byte: the `reply_of` never-used error at 929:8, the lint-level note at 928:12, the `ReplyGuard` warning and `error: could not compile `spatial-kernel` (lib) due to 1 previous error; 1 warning emitted`.
     - One more line follows: `warning: build failed, waiting for other jobs to finish...`.
     - The failing target is `(lib)`, the non-test lib that every other target links. No `(lib test)`, test, example or bin target reported an error.
   - (c) `cargo test --locked -p spatial-kernel --lib --no-run`: **exit 0**.
     - Output: `Finished `test` profile [unoptimized + debuginfo] target(s) in 1.02s` and `Executable unittests src\lib.rs (D:/wt-targets/dpanic\debug\deps\spatial_kernel-4108480b6444b40b.exe)`. No warning and no error.
     - It took 1.02 s because the cfg(test) lib target had already been compiled from the mutated source during (b), whose remaining jobs ran to completion. The source was not touched between (b) and (c).

5. Restore
   - `cp D:/wt-data/dpanic/rv2-mod.rs.keep kernel/src/project/mod.rs`. The sha256 is 10534ec42d0b50ddd299e3884ad1014c5f1d09b77fbaa1416dbe0fd7ab3b32e9, equal to the saved copy.
   - `git status --porcelain` is empty.

6. The unmutated tests
   - `cargo test --locked -p spatial-kernel --no-fail-fast`, output to `D:/wt-data/dpanic/rv2-test.log`: **exit 0**.
   - There are 62 `test result` lines. Summed: **522 passed, 0 failed, 47 ignored**, the same as the worker's run at 12946382.
   - No line begins `warning` or `error`, and none says `FAILED`.
   - Several tests printed "has been running for over 60 seconds" (e.g. `every_partition_reports_its_final_byte_before_the_sync`, `traces_agree_with_the_instruments_that_already_measured_the_same_thing`). All of them passed. This was a shared run, and none of it was recorded as a failure.

7. The section 7 count
   - `git merge-base origin/main HEAD` gives 1938c1b50b84587adaaa747a5ffc23cea092d17b. The worktree's origin/main is 4a5f886d6bc8e69c5860c98fa7938d7fd4b7325a, and nothing was fetched.
   - Command: `git diff --numstat 1938c1b50b84587adaaa747a5ffc23cea092d17b...HEAD -- . ':!governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`
   - Output: `222	4	kernel/src/project/mod.rs`. That is 226 changed lines over 1 file, within the ceiling of 240 over 1 file in form section 7 (lines 212-217).

8. Judge
   - **Line 927's comment is true by 4(a)-(c).**
     - (a) The non-test build of the lib exits 101 under M5.
     - (b) `--all-targets` fails, and it fails on that same `(lib)` target.
     - (c) The cfg(test) unit-test build of the same lib still compiles under M5, because K-D1 and K-D2 call `reply_of` at :1641 and :1665, both inside `#[cfg(test)] mod tests` (:1394). That is why the comment rightly says "non-test".
     - "Its only caller outside tests" holds. A grep finds `reply_of` calls only at :917 (the opened arm), :1641 and :1665. Nothing in `kernel/src` outside `project/mod.rs` names it.
   - The comment does not list the other builds that link the non-test lib and so also fail under M5: `--all-targets`, a plain `cargo test -p spatial-kernel`, and any dependent crate. Leaving them out does not make it false.

**C: reads (`df -m /c`, then `date -u +%FT%TZ`)**
- 2026-11-23T11:07:25Z: 47704 MB (before step 2)
- 2026-11-23T11:08:12Z: 47703 MB (before 4a)
- 2026-11-23T11:08:27Z: 47703 MB (before 4b)
- 2026-11-23T11:09:10Z: 47695 MB (before 4c)
- 2026-11-23T11:09:33Z: 47691 MB (before step 6)

Every read is over 40960.

**Hold and release lines (masked)**
- Step 2:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- 4a:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- 4b:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- 4c:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- Step 6:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`

There were no MACHINE_WAITING or MACHINE_ERROR lines, and no exit code from 96 to 99.

M5 sentence: At 0922c90a38ad91bf7922cf9a6baf0f8ed1344397 with M5 applied, `cargo build --locked -p spatial-kernel --lib` and `cargo build --locked -p spatial-kernel --all-targets` each exit 101 on the `#[deny(dead_code)]` error "method `reply_of` is never used", while `cargo test --locked -p spatial-kernel --lib --no-run`, the unit-test build in which K-D1 and K-D2 still call `reply_of`, exits 0.

**Findings**

Correctness: none. Evidence: none.

- **D1, Documentation, must-fix before the merge.** Form line 417 says M5 "is observed as `cargo build --locked -p spatial-kernel --lib` warning that `reply_of` is never used". At this head M5 is no longer a warning: it is an exit-101 error, and it also breaks `--all-targets` and a plain `cargo test -p spatial-kernel` (part-1 F2, now confirmed by run 4(b)). Section 7's rule keeps line 417 from being edited. Ruling ADV-2026-11-23-08 item 3 already orders the closing amendment that records the deny claim. That amendment should carry the M5 sentence above and cite this run's head, so that line 417 is not read as describing the current head.
- **N1, Documentation, note.** The test doc line `RECORDED MUTATION M5, an observation and not a failing test …` at `kernel/src/project/mod.rs:1610` @ 0922c90a38ad91bf7922cf9a6baf0f8ed1344397 says "every test of `cargo test --locked -p spatial-kernel` passed under the mutation". It is pinned "OBSERVED at 378c6cfc…" and stays true of that commit. At this head the same command no longer compiles under M5. Ruling item 3 bounds the deny commit to the attribute and one comment, so this line is left as a historical pin. The amendment in D1 is where the current behaviour is recorded.
- **N2, Evidence, note.** Run 4(c) reused the cfg(test) lib artifact that run 4(b) built from the mutated source (1.02 s, no recompile). The result is valid for the mutated source, but it is not a cold build.

No file was changed except the M5 mutation and its restore. There was no commit, fetch or push. The two scratch files are `D:/wt-data/dpanic/rv2-mod.rs.keep` and `D:/wt-data/dpanic/rv2-test.log`.
