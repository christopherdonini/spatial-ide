*Custodian's filing note (2026-10-28): the worker's first hand-back on `governance-hash-ref-leading-dot-path`, the governance lane's piece: a stop on M3, which passed both tests as it first applied it (the dot made optional, its follower still a letter, digit or underscore). The custodian's settlement: that swap is not the mutation the words name (a leading dot admitted before any path character); a class 2 deviation, the form's Amendment 1; the worker resumed with the worded shape (`state/consults/2026-10-28-governance-hash-ref-leading-dot-path-build-worker-report.md`). The run 10:11:10Z to 10:19:16Z by its transcript (Bash 12, Monitor 1, Edit 4, Read 1, Write 2). Extracted by script from its first SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 2000ae025265aa6a35b933a201e892b29d96a986194e9989846209eb5c8576fa.*

---

Stopped: governance-hash-ref-leading-dot-path, M3 passes. Per the stop rule, I did not push, did not write the record commit, and did not run steps 5 and 6.

**State.** The worktree C:/dev/wt/hrdot is on branch cut/governance-hash-ref-leading-dot-path. The porcelain is empty. HEAD is the unpushed code commit 850efbd89ad18daf8c14a0c485eb657cf868abb7. Origin's branch is still at the base, 60bb2d4fe2c2afa59df2687b9128c9a6c61971a8. The grammar file is byte-equal to the code commit after every mutation: sha256 2049d23606cc040738a40fbe3cd9886637570fd5574abf4023ce1752206656e2.

**Base findings (step 1).**
- `verify-quotes.mjs` exited 0: "131 checked, 100 verified, 30 baselined, 1 advisory … 0 hash-reference errors (2 hash-baselined) … 879 ruling cites resolved, 0 ruling-cite errors".
- `verify-test-claims.mjs` exited 0: "all 687 claimed test(s) across 210 file(s) exist or are planned, superseded or withdrawn (47 planned, 11 superseded, 17 withdrawn, advisory)".
- Both outputs are in the scratch folder as hrdot-w-base-quotes.txt and hrdot-w-base-claims.txt.

**Code commit (step 2).**
- It changes `hashRefGrammar.mjs`. The path is now `((?:\.(?=[A-Za-z0-9_]))?[A-Za-z0-9_](?:[A-Za-z0-9_.+-]|/(?!\.(?![A-Za-z0-9_])))*)`. A lookbehind `(?<![A-Za-z0-9_./+-])` sits after the optional backtick and before the path. A 3-line comment states the rule.
- It appends the two named tests to `verify-test-claims.test.mjs`. No existing test is changed.
- Both tests pass at the head, and both fail at the base grammar, which I swapped in from a scratch copy and then restored.
  - `a_leading_dot_path_pin_resolves_in_both_checkers` at the base: actual { quotes: 2, claims: 0 }, expected { quotes: 0, claims: 1 }.
  - `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` at the base: actual [{0,1},{0,1},{0,0},{0,0}], expected four times { quotes: 1, claims: 0 }.
- Scope at the code commit: 42 insertions and 1 deletion, from `git diff --stat`. The `--numstat` count against 60bb2d4f was not run, and the record commit's comments are still to add.

**Mutations (step 3).** Each was applied alone and the named tests run, and the test file was not touched. After each, the grammar was reverted with `git checkout` and shown byte-equal by sha256.

| Mutation | Result |
|---|---|
| M1: leading-dot alternative removed | The first test fails by name with actual { quotes: 2, claims: 0 }. The second test passes. |
| M2: guard set to `''` | Only the second test fails, with actual [{0,1},{0,1},{0,0},{0,1}], the figures the form predicts. |
| M3: leading-dot lookahead replaced by `\.?` | **Both tests pass. This is the stop.** |
| M4: interior restriction removed (`\|/)*)`) | Only the second test fails, with actual [{1,0},{1,0},{1,0},{0,0}]. |

On M3, the `./` entry cannot resolve with only the dot made unconditional, because the path's next character must still be a letter, digit or underscore. The line's wording, "a leading dot admitted before any path character", does not say whether the first-character class also widens. My literal swap did not widen it. A second try that widened both the lookahead and the first-character class did not apply, because of a shell-escaping error in my scratch script. The test run after it was therefore unmutated, and I record nothing from it.

**Not done:** the record commit, the push, the head findings against the base, the `node --test` suite, `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`, and the final Scope count.

**What I need from the custodian.** M3's wording needs to be fixed, for example: lookahead set to `(?=[A-Za-z0-9_./+-])` and the first-character class widened to `[A-Za-z0-9_./+-]`. Then it must be applied and observed. Class 3 or 9 handling of the form's M3 wording is the custodian's call. I have not edited the form.

No cross-module interface was written. No new `pub` item or callback was added.

**Self-check.** The four classes hold for what exists so far:
- Cross-module use: the grammar is consumed through `hashRefRegExp`, as read at verify-quotes.mjs:139 and :590.
- Completion claims: each claim above rests on a transcript call.
- User-facing messages: none were added.
- Required-test assertions: both tests reach their `deepEqual` assertions.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
