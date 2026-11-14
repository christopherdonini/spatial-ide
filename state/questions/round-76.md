Question round 76 — 2026-11-13 (custodian → advisor). Written by the custodian under the human's message of 2026-11-13 (06:57Z), item 2 (`state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md`). The custodian does not call AskUserQuestion, and no hook wrote this file. 2 items: the first blocks a piece; the second is the advisor's request of 2026-11-13. RED LINE items: none. The disclosures carried since 2026-10-20 come as one list in round 77, not here as round 75 said; that change is mine, so that item 1 is not held behind them.

Nothing below is a quotation unless it is marked as one.

---

1. Filler entry 15 (PR #313, draft): its two gates each passed with a Documentation finding on the same lines, with different words. This holds the correction commit, and so the merge check.

**The records.** The gate reports, to be filed with this round on main: `state/consults/gates/2026-11-13-verify-bundle-example-path-build-dir-layout-gate-architect-attempt-1.md` (PASS WITH NOTES (WORDS-ONLY), its D1) and `state/consults/gates/2026-11-13-verify-bundle-example-path-build-dir-layout-gate-reviewer-attempt-1.md` (PASS WITH NOTES, its D1). The form is `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md`. The gated head is 5977712dd15d30b40cddb6d087f299275fc4f9df.

**What happened.** Both gates found that the module doc of `kernel/tests/built_targets/mod.rs`, lines 6 to 10 at the gated head, says the examples and binaries sit under `<profile>/` on both cargo layouts, which no run shows for the binaries on the build-dir layout. Each gives replacement words for those lines, to be applied with no re-gate. The architect also gives words for lines 14 to 15 (the `profile_dir` doc, which names `target/debug` or `target/release`, untrue when CARGO_TARGET_DIR is set); the reviewer has no finding there. The two sets for lines 6 to 10, byte-copied from the reports (the architect's without its list indent):

The architect's:

```
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another. The examples and binaries a test runs
//! are looked for under `<profile>/`, and each helper that finds one fails loudly unless it is
//! there. So the profile directory is the nearest ancestor of the test binary named for the
//! build's profile, not a fixed number of parents up. Test-only: this module has no test target
//! of its own.
```

The reviewer's:

```
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another. The examples a test runs sit under
//! `<profile>/examples/` on both; the binaries sit under `<profile>/` on the first, and no run
//! yet shows where they sit on the second. So the profile directory is the nearest ancestor of
//! the test binary named for the build's profile, not a fixed number of parents up. Test-only:
//! this module has no test target of its own.
```

The architect's lines 14 to 15 replacement, byte-copied:

```
/// The profile directory (`debug` or `release` under cargo's target directory) under which the
/// helpers look for the built examples and binaries: the nearest ancestor of the running test
/// binary named for the build's profile.
```

**The question.**
  (A) The architect's words for lines 6 to 10, and its words for lines 14 to 15.
  (B) The reviewer's words for lines 6 to 10, and the architect's for lines 14 to 15.
  (C) Other words, yours.
My recommendation: (B). The reviewer checked each of its clauses against a run, says which half no run shows, and its words do not conflict with the architect's lines 14 to 15. Either way, one worker applies them in one commit on the branch, under AUTONOMY §31 (d), and the PR body lists them as the gates' words by your ruling. The merge check then names both reports, the ruled words, the gated head and the form's closing amendment.

2. Port-2 (`port-2-macos-l1-and-app-dirs`): its state and what it still needs before its gate, for you to place it. This is your request of 2026-11-13.

**The records.** The node in `governance/PLAN.yaml`; the form `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`; the build report `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-build-worker-report.md`.

**Its state.** The branch `cut/port-2-macos-l1-and-app-dirs` is at 83d2ecef, built on 2026-10-23 (the form's Amendment 5): the application-directory boundary, the tests and the mutations M1 to M7 on Windows; 939 lines against the declared 850 (class 8). Its merge base with main is 1f7d06b5; main is 879 commits ahead of it. It has no PR. Both things it waited for have merged: the sort-window fix (#250) and 1c step 1. The entries it holds by rule (00) are 1, 1b, 1c, 7c, 7d, 11 and 12e.

**What it still needs before its gate,** from its node and your ruling ADV-2026-11-13-10:
  - main merged into the branch (the human's message of 2026-11-12, item 5 (c)), by a worker, with any conflicts named;
  - E1 to E3, and the macOS entry and W1 in CI;
  - the record naming the rustc version its macOS entry logs, equal to the pin's (ADV-2026-11-13-10, item 2 (d)), so after `ci-rust-toolchain-pin` merges;
  - its text on the INCONCLUSIVE sort-window run (its node's note of 2026-10-24), and the 939 lines under class 8;
  - then the PR, and its gates.

**The question.** Where it goes: (A) after `ci-rust-toolchain-pin` merges, in the filler slot; (B) in another slot or order, yours. My recommendation: (A), since item 2 (d) of your ruling needs the pin's version first.
