*Custodian's filing note (2026-10-04): node 10's worker-high report 2, O-2 applied as ruled by question round 45, item 1. Written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 3f308724014d975c1be66ed5f5382a38d352985f9160aad41a339f6e3072f346, equal to the hand-back. The round's commit is c6809d0c on `cut/type-walk-null-literal-arithmetic`. The worker's one unexplained `verify.mjs` rc 1, whose output was discarded and which three reruns did not repeat, is to be read from branch CI. No leftover worker process was found afterwards. Worker cost, round 2: 118,814 subagent tokens, 14 tool uses, 1,967,031 ms.*

---

# node 10 worker report 2 — O-2 applied

Verdict: O-2 is applied as ruled yes (question round 45, item 1, answered at 21:42:27Z on 2026-10-03, by the coordinator's message). Every run below is green. No invalidator in section 5 fired, and no section 8 item was crossed.

Branch `cut/type-walk-null-literal-arithmetic`, new commit `c6809d0c2a56aebca951b9a018e547c499cb611d` on top of `51296907cd4f9e6f9636a6a83b6196978549ab1f` (report 1's tip). It is signed off and pushed; local HEAD and the remote branch tip are both `c6809d0c`. The merge base is still `10febb28cd56bf233df04321b2ed7d6c020a9df7`. The target directory was `D:/wt-targets/null-literal` for every cargo command. No `cargo clean`, no `target/` removal, no force-push, no rebase.

## What changed in `c6809d0c`

- (i) The unary arm is unchanged. It keeps carrying the field through its struct update, which the ruling now covers.
- (ii) In `type_of_arithmetic`'s binary arm, the helper that decides whether an operand can mark the result now accepts a decimal that already counts as a decimal literal, besides a decimal literal within bounds. The result is marked when one operand is NULL-typed and the other is either. The comment names question round 45, item 1. The three read places and the `Typed` constructors are untouched.
- (iii) B-T3's corpus gained C47: `-(NULL - 0.5) > 0` and `NULL + (NULL - 0.5) > 0`, both predicted admitted. B-T1 part 3 gained the two pins (C47a with `arith_op` `-`, C47b with `+`). Part 3 now asserts 332 and the total 9,714. The doc comments and the stale "C47 is open" comments were updated to match.
- `cargo fmt -p spatial-engine` touched only my two files.

## Runs and exit codes (all at head `c6809d0c`)

| Command | Exit code | Result |
|---|---|---|
| `cargo fmt -p spatial-engine --check` | 0 | clean |
| `cargo test -p spatial-engine --test filter_type_admission each_corpus_row` (B-T3), run first on the working tree | 0 | 1 passed |
| `cargo test -p spatial-engine -- --nocapture` (output kept in the target directory) | 0 | the whole crate green; B-T3 ok inside `filter_type_admission`; B-T1 ok; B-T1b ok |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS |
| `node scripts/plan/verify.mjs` | 0 on three runs; 1 once | PASS on the three reruns (see the note below) |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 425 tests, 425 pass, 0 fail |

Note on `verify.mjs`: in the batch where I ran the four verifiers back to back with their output discarded, `verify.mjs` returned 1. I did not see its message. Reruns of the same command from the same worktree and the same tree returned 0 each time, with "verify:plan PASS", and one rerun was slow, which fits a transient. I cannot name a cause. The gate should read it from the branch's CI.

## P-3 at the new head

| Run | Admitted | Refused | Total | Failures |
|---|---|---|---|---|
| B-T1 at the merge base (report 1) | 4553 | 5152 | 9,705 | 0 |
| B-T1 at head `c6809d0c` | 4562 | 5152 | 9,714 | 0 |

- The refused tally is equal at 5152.
- The admitted tally rose by 9, exactly the pin count now (C39, C40, C44 five, C47 two).
- B-T1b printed "897 arithmetic nodes checked, 0 failures" at head, the same as the merge base's 897 in report 1.

## Section 7 figure

By `git diff --numstat origin/main...HEAD`:
- `engine/src/predicate.rs`: 48 insertions, 5 deletions.
- `engine/tests/filter_type_admission.rs`: 87 insertions, 6 deletions.
- `engine/README.md`: 2 and 2, excluded as `*.md`.

The counted figure is 146 over 2 files, against a ceiling of 300 over 2. No class-8 overrun.

`git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/ renderer/` prints nothing. No `pub` item is added.

## Mutations

M1 to M5 were observed at `c66b7a06` (report 1). The new disjunct has no mutation in section 4 and I did not invent one. `c6809d0c` changes no line that M1 to M5 touch except in `type_of_arithmetic`'s marked-set helper, which M5 sits beside.

## State left

The branch is pushed and the working tree is clean. The ADR-021 Note question is still open for the human (section 8 item 17).
