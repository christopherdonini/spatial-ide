*Custodian's filing note (2026-09-26): the reviewer gate's attempt-2 report (a scoped record round) for PLAN node `data-plane-stream-registry-bound`, reviewed at cut/data-plane-stream-registry-bound @ a4aa7f3, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**`cut/data-plane-stream-registry-bound` @ a4aa7f34a0b7c53cf199a218b18bb2bc757376ac — PASS (reviewer gate, attempt 2: the scoped record round).** Both attempt-1 findings, B1 and B2, are resolved.

**1. The diff (`git diff b6d1664..a4aa7f3`).** It is exactly what the coordinator described.
- It has two commits, `8ed5228` and `a4aa7f3`.
- By `--numstat`:
  - the form: 7 insertions, 0 deletions. That is the Amendment 2 append only, at the end.
  - `server.rs`: 2/2, the T4 and T5 "Declared excerpt" header lines.
  - `stream_registry_bound.rs`: 3/3, the T1–T3 header lines.
- Each code-file change swaps `(copied by script):` for the qualified form. Line counts are held, the excerpt bytes below each header are unchanged, and nothing else moves.

**2. Each qualification is true.**
- **T1–T3 ("this file's at 2b99551, before these records"):** each location resolves at `2b99551`, and each line is the assertion whose message the excerpt shows.
  - `stream_registry_bound.rs:208:5` is `assert_eq!(`, T1's count assertion.
  - `:233:9` is `assert!(`, T2's live-entry assertion.
  - `:285:5` is `assert!(state.is_cancelled(), "the producer still observes a cancel sent during its own drain");`.
- **T4 and T5 ("the mutated tree's, not 2b99551's"):** neither resolves at `2b99551`.
  - `server.rs:642` at `2b99551` is the uptime `.expect(`, which is not the `expect("recorded above")` the excerpt shows; that call is at line 639.
  - `server.rs:686` at `2b99551` is inside the string literal `been up longer",`; T5's `assert!(` is at line 693.
  - The recorded numbers fit the mutated trees: +3 lines for M4, since my own 3-line M4 at HEAD panicked at the same `expect`; and −7 for M5.

**3. Amendment 2.**
- **Row 1:** one sentence. It names the command and `rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14)`, citing round 15 (c). That is this machine's `cargo fmt --version`, and the version I reproduced row 5's seven-and-eight-file result with in attempt 1.
- **Row 2:** one sentence. It matches `8ed5228` byte for byte in substance and cites §8 item 15.
- **Round 12 (d):** each correction is under the three-sentence ceiling and does not restate row 5's claim.
- **Round 12 (e):** the superseded line is present ("Superseded: nothing; …").
- The first line names the class (3) and says it was written after the attempt-1 gates.
- No hash references were added, so round 15 (e) is not engaged.

**4. Checks at `a4aa7f3`:**

| Check | rc | Result |
|---|---|---|
| `verify-cites.mjs` | 0 | PASS, 759 files |
| `verify-quotes.mjs` | 0 | PASS (109 / 78 / 30 / 1 advisory; 0 hash-reference errors) |
| `verify-test-claims.mjs` | 0 | PASS, 237 claims |
| `verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS, all 5 new tests named |
| `verify.mjs --offline` | 0 | PASS |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 311/311 |
| CR bytes, the 9 changed files at HEAD | — | 0 in each |

- As the coordinator said, no code changed, so the Rust suites were not re-run.
- `git status --porcelain` was empty afterwards, and nothing was left running.

**Two notes, neither blocking, for the architect.**
- **(a) The superseded-span pin.** Class 3's test-text exception asks for "the superseded span pinned". Here the superseded header lines exist only at `e061cb1`, a branch commit, and round 15 (e) forbids a hash pin there. "Superseded: nothing" is defensible, because the edit adds a qualifier and every excerpt byte and claim is retained. The architect may want to confirm that reading.
- **(b) The superseded line's tail.** Its closing clause, "row 5 gains its tool, and the excerpts their line-number basis", lightly restates rows 1 and 2 under the record cap.

The architect rules separately on S1 (§9's fmt requirement).

**Gate-log note:** Reviewer gate attempt 2 for `data-plane-stream-registry-bound` at `a4aa7f3`: PASS. B1 is fixed by `8ed5228` (five excerpt headers qualified, T1–T3 checked to resolve at `2b99551` and T4/T5 checked not to) and B2 by Amendment 2 (rustfmt 1.9.0-stable named). The diff is the five comment lines plus a 7-line append with 0 deletions; verify-cites, -quotes, -test-claims, -mutation, `verify --offline` and the scripts suite all ran with rc 0, and there are 0 CR bytes. S1, §9's fmt requirement, is the architect's ruling.
