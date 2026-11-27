Reviewed: PR 361, the branch cut/opened-of-panic-frees-the-lock at 12946382bbe766e686ec245f2ddfd625fdabab6c, in C:/dev/wt/dpanic (the custodian's filing note, 2026-11-23: the reviewer (Opus), the reading part of the narrow read of node (d)'s deny commit (ADV-2026-11-23-08 item 3), done with nothing run as ADV-2026-11-23-12 item 2 allows (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-12-the-floor-stop-no-build-test-or-launch-under-the-floor-the-narrow-read-held-free-what-is-merged-list-the-rest.md`), node:opened-of-panic-sites-free-the-lock@deny-narrow-read-1, dispatched at 2026-11-23T10:44:50.871Z; its run: Bash 10, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T10:44:51.084Z to 2026-11-23T10:47:58.989Z by its transcript. Filed below the rule from its hand-back, 9628 bytes, sha256 b046b3d7f586fb2576b6a6acb1bbce913dff8718882f42ba28e64348852bd6cf, byte for byte, nothing masked, with one final newline added. Its line cites are to the branch head it names. No gate-log row: the read is not complete until its run part; its row comes with that part.)

---

Verdict: READ PART PASS WITH NOTES
Reviewed: C:/dev/wt/dpanic @ 12946382bbe766e686ec245f2ddfd625fdabab6c

Branch: cut/opened-of-panic-frees-the-lock @ 12946382bbe766e686ec245f2ddfd625fdabab6c. The ruling I read is `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-08-node-d-the-architects-sentence-into-section-1-the-reviewers-reading-in-the-closing-the-deny-attribute-in-idle-time.md:20-24`, in the main checkout. I ran nothing except read-only git commands.

## Check 1: the commit's shape

- `git -C C:/dev/wt/dpanic rev-parse HEAD` printed `12946382bbe766e686ec245f2ddfd625fdabab6c`. That is the head under review.
- `git -C C:/dev/wt/dpanic status --porcelain` printed nothing (rc 0).
- `git log --oneline -3` printed:
  - `12946382 chore: kernel: deny dead_code on reply_of, so the build fails if the opened arm stops calling it`
  - its parent, `d2b8b6e3`
- `git diff --stat d2b8b6e3b0e98f783a9c0295ccecacd871d30fc2 12946382bbe766e686ec245f2ddfd625fdabab6c` printed `kernel/src/project/mod.rs | 2 ++` and `1 file changed, 2 insertions(+)`.
- The full diff is one hunk, `@@ -924,6 +924,8 @@ impl Projects {`. It sits between the end of `reply_of`'s doc comment and `fn reply_of`. These are the added lines, byte for byte:

```
+    // Fails the build if nothing calls this, so the opened arm cannot quietly stop using it.
+    #[deny(dead_code)]
```

- The diff is exactly the attribute and one comment line, both in `kernel/src/project/mod.rs`. Nothing else in the file or the repository changes.
- The comment has no line cite and no ledger cite.

## Check 2: is the comment true, by reading

`git -C C:/dev/wt/dpanic grep -n reply_of 12946382bbe766e686ec245f2ddfd625fdabab6c`: inside `kernel/` the code hits are:

- `kernel/src/project/mod.rs:929`, the definition: `fn reply_of(&self, o: Opened) -> OpenedProject`.
  - It is private: no `pub` on a method in `impl Projects`. Its attribute sits at :928.
- `:917`, inside `pub fn open_project_command`, the `Reopen::Opened` arm: `self.reply_of(*o)`.
  - This is **not test code**. It is the only caller outside `#[cfg(test)]`.
- `:1641`, inside `#[cfg(test)] mod tests` (it opens at :1394 and runs to the end of the file at :1673).
  - This is **test code**: the closure `|| rig.projects.reply_of(o)` in the `#[test]` fn K-D1.
- `:1665`, also inside `mod tests`.
  - This is **test code**: `rig.projects.reply_of(o)` in the `#[test]` fn K-D2.

All other hits are doc mentions (:251, :897, :939, :1008, :1602, :1610) or are in governance and state files.

Lint context I read:
- No `#![...]` inner attribute in `kernel/src/lib.rs` or `kernel/src/project/`.
- No `[lints]` in `kernel/Cargo.toml`.
- No RUSTFLAGS and no `cap-lints` in `.github/`, `.cargo/` or the Cargo.toml files.
- So the item's own `#[deny(dead_code)]` decides the level.

How rustc's dead_code lint treats a private method: it fires when no live code reaches the method. `open_project_command` is a pub method of a type reached through `pub mod project` (lib.rs:81), so it is live, and the call at :917 makes `reply_of` live.

- **The lib build (no cfg(test)):** "Fails the build if nothing calls this" holds.
  - Under M5 the only non-test caller is gone, and `mod tests` is not compiled.
  - The never-used lint fires at deny level, so it is an error.
  - This matches the earlier probe that ruling item 3 reports (exit 101).
- **The unit-test build (cfg(test)):** under M5 that condition never arises, so the build does not fail.
  - `#[test]` fns are live roots in a `--test` compile, and K-D1 (:1641) and K-D2 (:1665) call `reply_of`.
  - So `reply_of` stays live, and this target compiles under M5. Its tests would pass, since they never go through the arm.
  - The first clause is still literally true there. The second clause is not.
- **"so the opened arm cannot quietly stop using it":** this holds only for builds that compile the lib target without cfg(test), and only while the arm is the sole non-test caller.
  - Builds that compile the lib that way include:
    - `cargo build --lib`;
    - a package-wide `cargo test -p spatial-kernel`, whose integration tests in `kernel/tests/`, the `slice-host` bin and the doctests need the lib built normally;
    - CI's `cargo build --workspace --tests --locked` and `cargo test --workspace --locked` (`.github/workflows/product-ci-rust.yml:240`, `:251`).
  - By reading, each of these would now fail to compile under M5.
  - `cargo test -p spatial-kernel --lib` alone would compile and pass under M5.
  - If a second non-test caller of `reply_of` were added, the arm could stop calling it with no error.
- So the comment is true for the lib build only, and only while :917 is the only non-test caller. This is finding F1.

## Check 3: the section 7 count

- `git -C C:/dev/wt/dpanic merge-base origin/main 12946382bbe766e686ec245f2ddfd625fdabab6c` printed `1938c1b50b84587adaaa747a5ffc23cea092d17b`. origin/main is at `d1fa31ce0792528166fdd7c61f1a3c0e4cd146dd`.
- The command as run, from the form's section 7 (the Counting line), with the form's own path in the first exclusion:

```
git diff --numstat 1938c1b50b84587adaaa747a5ffc23cea092d17b...12946382bbe766e686ec245f2ddfd625fdabab6c -- . ':!governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'
```

- It printed `222	4	kernel/src/project/mod.rs` (rc 0).
- The sum is 222 + 4 = **226 changed lines over 1 file**, against a ceiling of 240 over 1 file. It is within the ceiling, with 14 to spare.
- Cross-check: the same diff to d2b8b6e3 printed `220	4`. The commit adds exactly 2 lines.
- Without exclusions the diff is the same single row, so the branch carries no other files.

## Check 4: does the architect's verdict carry forward

- It holds. The commit changes only a lint level on a private method.
- It changes none of these:
  - the method's signature or body;
  - `ReplyGuard`, or its `thread::panicking()` condition;
  - the order of the close and `release_ended`;
  - the lock or the unwind path;
  - the caller at :917;
  - the tests;
  - any doc the architect read.
- What it does change goes in the direction the ruling intends. Under M5 the lib build now errors instead of warning. By reading, CI's `cargo build --workspace --tests` and a package-wide `cargo test` would fail too, where before they passed.
- That makes the architect's D-8 premise, and the reviewer's CI answer quoted in Amendment 2 item 2, history at their pinned commits (378c6cfc and 2d7ae14b). It weakens nothing the architect's checks rest on.

## Findings

**F1, Documentation, must-fix before the merge.** The comment at `kernel/src/project/mod.rs:927` @ 12946382bbe766e686ec245f2ddfd625fdabab6c is true for the lib build only, and only while the opened arm is the sole non-test caller.
- The cfg(test) unit-test build keeps `reply_of` live through K-D1 and K-D2, so the arm can stop using it there without failure.
- A second non-test caller would also keep it live.
- It is not the human's wording. It is the worker's line, and ruling item 3 asks for the worker's words, so the custodian chooses: the worker rewords it, or applies the words below.
- Replacement words (one line; 91 columns with its indent):

```
    // The lib build fails if the opened arm, its only non-test caller, stops calling this.
```

Each clause checked against the code:
- "The lib build": the lib target compiled without cfg(test), which `cargo build --lib`, a package-wide `cargo test` and CI's `cargo build --workspace --tests` all compile. The cfg(test) unit-test target is left out, correctly.
- "fails": `#[deny(dead_code)]` at :928 makes the never-used lint an error. The probe in ruling item 3 saw exit 101; the waiting M5 build confirms it at this head.
- "the opened arm, its only non-test caller": :917 is the only call outside `mod tests` (:1394 to :1673). :1641 and :1665 are inside it.
- "stops calling this": this is M5.
- No case needs an instrumented build: M5 is a source edit, not ordinary use of the app.

**F2, Evidence, note for the second dispatch.** By reading, M5 at this head also breaks the compile of `cargo test --locked -p spatial-kernel` and of CI's `cargo build --workspace --tests --locked`. `cargo test -p spatial-kernel --lib` would still compile and pass.
- The second dispatch should run one all-targets command under M5 next to the `--lib` build, so the M5 sentence states only what was run.
- Pins I resolve under the round-14 rule:
  - The `RECORDED MUTATION M5` line at `kernel/src/project/mod.rs:1610` ("no test fails … every test … passed") is a pin at 378c6cfc.
  - Amendment 2 item 1's sentence is a pin at 378c6cfc.
  - The CI answer in Amendment 2 item 2 is a pin at 2d7ae14b.
  - For what M5 does now, the tree at 12946382 is authoritative. Each pin is authoritative only as the record of its named commit.
- The amendment that carries the M5 sentence should name that, so the 1610 line is not read as current.

**F3, Documentation, note.** The brief places Amendment 2 in the worktree at the head from line 449. At 12946382 the form has 447 lines and ends with Amendment 1.
- Amendment 2 is on main: it was added by aa9fff20, it is present at origin/main d1fa31ce, and I read it there.
- aa9fff20 is not an ancestor of the merge base 1938c1b5 (`merge-base --is-ancestor` rc 1).
- The deny attribute's amendment should be appended where Amendment 2 already is. Merge main into the branch first, or append on main, so the append-only order holds.

Waits: the M5 build, the unmutated build, the kernel tests and the M5 sentence (ADV-2026-11-23-12 item 2).
