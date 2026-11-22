# scripts/plan/verify.test.mjs: the offline-note test's two assertions say what they saw — five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline; append-only once committed.
- **The node:** the PLAN node verify-offline-note-test-flake, placed by the advisor's ruling ADV-2026-11-21-15 item 3 (ii), under the human's delegation of 2026-11-13 (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md`).
- **Why now:** ADV-2026-11-22-11 starts a free place on the next piece in its order (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md`). Item 3 (i), the launcher read, comes first, but it waits for a quiet machine.
- **Its class:** the five-line form and the reviewer alone, with the standard worker (item 3 (ii)).
- **Merge:** it changes one test file, and no file the app is built from, no workflow and no lockfile, so it merges as it closes, before the v0.2 tag.
- **The records:** the custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.

```
Authority: PLAN node verify-offline-note-test-flake; the advisor's ruling ADV-2026-11-21-15 item 3 (ii), under the human's delegation of 2026-11-13: first the failure message says what it saw, and its cause follows when it shows again; the human's message of 2026-11-22, item 1, flaky tests are findings, this test's finding recorded in the ledger with this node (ADV-2026-11-22-01); reuse index: no prior art recorded for flaky test or for assertion message (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian on 2026-11-22), a miss noted here.
Scope: 1 file: scripts/plan/verify.test.mjs; declared line budget <= 12 changed lines in the merged diff by §21c's counting (insertions plus deletions, comments counted), this form excluded. Block on sight: any change to another test in the file, to its helpers or fixtures, to verify.mjs or any other script, to a workflow, a dependency or a lockfile; and any change to what either assertion checks.
Change: in the test named runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked, each of its two assert.ok calls gains a message argument and nothing else: the first message prints, as JSON, the notes runVerify returned, and the second prints, as JSON, the failures that contain pr; the condition of each assertion, the test's name, its temporary folder's prefix and every other line are unchanged. The cause the node records (the temporary folder name's random characters) is not fixed here: the ruling puts it after the next failure.
Tests+mutation: no new test. M1: the temporary folder's prefix changed to one containing pr (verify-offline-note-pr-), the node's deterministic check; the file run alone fails on this test, and the worker records the failure message byte for byte from the run's output, which must show the failures that contain pr, each with its folder path; then reverted, the file compared with the head by cmp, and the file run green. The runs: node --test scripts/plan/verify.test.mjs, and CI's scripts suite green.
Out-of-scope: ADR none; security none -- a test file's messages only, Node's standard library, no dependency, no workflow; wire none; guarantee none touched -- neither assertion's condition changes, so the test passes and fails on exactly the inputs it did before.
```

### Amendment 1 — 2026-11-22 — the single gate: the reviewer, PASS WITH NOTES at c3bd9798

1. **The gate.** The reviewer alone gave PASS WITH NOTES at c3bd9798de2933c51811cb90df240c04da009361, with no Correctness, Evidence or Documentation finding. Its report is `state/consults/gates/2026-11-22-verify-offline-note-test-message-gate-reviewer.md` (gate-log row 829). The diff is one file with 2 lines added and 2 removed, and both conditions are byte-identical to the base by script. M1 was re-observed in an export of the whole tree with a scratch git index: the form's test failed alone, at its second assertion, with the five failures that hold pr in the message. CI was 8 of 8 passing at the head, read by the custodian at 2026-11-22T13:18:22Z and by the reviewer at 2026-11-22T13:21:44Z. The build worker's report is `state/consults/2026-11-22-verify-offline-note-test-message-build-worker-report.md`.

2. **The notes.**
   - N1: a mutation of this test file needs an export of the whole tree with a git index built in it (core.longpaths set). This is for later briefs; this piece is unchanged.
   - N2: the PR goes out of draft before the merge check.
   - N3: the worker's logs record no exit code or commit; the reviewer's own runs re-observe the head and M1.
   - N4: the sign-off carries git's configured author address. `git commit -s` adds it, and every commit's author field carries the same address. No action.

Read the last amendment first.

Nothing above is edited.
