# PR #176 gate 2 — reviewer (scoped)
Reviewed: cut/data-plane-terminal-without-credit @ 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1

**Verdict: FAIL** (one S1, record only). The fix commit 1b2e53d4 passes: it closes gate 1's code findings, and §22's semantic applicability check holds for M5 and M4. The S1 is in Amendment 4. Scope (AUTONOMY.md §22): the fix commit 1b2e53d4, and the form's Amendment 4 on main (added at f472312398f1122c57ddf7d89e9dcae90a95d98b; main read at 9c40d22f53271a4dfce29a7e71d84ac4293f9b77). Nothing else is re-gated. Gate 1's Correctness and Evidence carry forward. Spans on the branch are named at 1b2e53d4 by line, with no hash.

## S1 (blocking)

**S1-1. Amendment 4 item 1 is a correction over the ceiling. Round 12, item (d) fails this by name.**
- (d) caps a correction at three sentences: the defect, the corrected reference, the proof. Item 1 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:527 @ 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 sha256:8ce8567954c7d1314105edd1a300d1c4561bd22672bea73504026f2aa08029b2`) has five sentences after its bold label.
- Two of them state the defect. Byte-copied sub-line spans of that line: "Amendment 3's hash of worker report 1 is the as-written hash, which no commit reproduces." and "The defect: a hash a gate cannot recompute."
- A fifth is outside the shape, a sub-line span of the same line: "This amendment's own commit does not create 8f4874c1."
- The architect's gate-1 S1-2 prescribed the three-part shape.
- The content is right. The reference recomputes (see "Amendment 4"), 8f4874c1 is on main, and it is not the amendment's commit.
- Remedy, in correction round 2 of 2: an appended correction of at most three sentences carrying the same reference, `state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md @ 8f4874c184ac4b4d13546b47843c643e1fcdb5ec sha256:d58d34f9d1ce6c0d284733d3b1e25a042d04e320290a5cae96a43109dd43d86a`. Its superseded index names Amendment 4 item 1, and it also carries S2-2's entry.

## S2

**S2-1. The identity sentence admits a data-plane cancel that arrives during the drain.**
- Under `biased`, the drain's halt arm returns at once (`protocol/data-plane/src/adapter_ws.rs:375-377` at 1b2e53d4) and receives no queued item.
- The pump notes a batch as generated before it sends it into the channel (`protocol/data-plane/src/pump.rs:92-93` at 1b2e53d4). So a batch still in the channel when the halt arrives is counted in `batches_generated` but in neither sent nor discarded.
- The positive sentence's scope admits that stream. A cancel after drain entry is not "prior". Byte-copied, a sub-line span of `protocol/data-plane/README.md:174-175` at 1b2e53d4: "(an owner's cancel with no prior" and "data-plane cancel, or a pump failure)". The same parenthetical is at `protocol/data-plane/src/transport.rs:230` and `:257` at 1b2e53d4.
- Read whole, the text does not assert the identity for that stream. The next sentence names "a data-plane cancel" with no qualifier (README:176 at 1b2e53d4), and Amendment 4 item 3 makes no claim for halt paths.
- This is reasoned from code, not observed. No test reaches a halt during the drain.
- I-7 has not fired: P-9's four tests pass at the head.
- Not blocking. Remedy, at any later touch of these docs or in the closing record: scope the identity to a drain that ends on the source's failure or on the channel's close.

**S2-2. Amendment 4's superseded index omits item 6.**
- Item 6 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:532 @ 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 sha256:1b6f8fb0bf6a1920c5c0d417aa70f35703f0b080224f84d39dfa1afb02c10dea`) voids the data-plane half of §2 Part 4's owner's-index bullet (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:199 @ 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 sha256:1bfe5a7ed7c91b3213502255768262902c31d94e88e9801cec68b10c4e9b27fa`).
- The index (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:534 @ 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 sha256:874d4a4ac607392eeb800be43838f4ae2fc2e9f2e5ed08352b58e38fd4c0bcba`) names items 1 and 2 only.
- Its two entries do name what they replace: Amendment 3's parenthesis giving the as-written hash, and the header's Pilot-line pin at c823bce5.
- Remedy: the next superseded index, in round 2 or at the closing amendment, carries the Part 4 half.

**S2-3. Item 2's corrected reference is not in the pinned form.**
- Item 2 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:528 @ 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 sha256:7d7a4761d5662f4b3d15fb91b7b8b6f273d88a4255a78ee4b7f060a9ec3d5c63`) names the file as "the impact read" and gives its rev in prose, with a short id. No `path @ <rev> sha256:<hex>` string is present, so no tool can resolve it.
- Round 15 (e) is met in substance: the rev is explicit, and 92a71c30c2b44fe3dbdc17a1f47534d2d0181b89 is on main.
- The hash recomputes (see "Amendment 4").
- Remedy: the closing amendment carries `state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md @ 92a71c30c2b44fe3dbdc17a1f47534d2d0181b89 sha256:dcb21e03e8bdc5bad32435a06aed164eb275bce56c62755a54cee030451a1941`.

## N

- N-1. `protocol/data-plane/README.md:172-173` at 1b2e53d4 is unchanged. It says `batches_discarded` counts each batch dropped and that `resident_bytes` falls with it. The architect's gate-1 S1-1 listed it. Read in its paragraph, which is about the drain, and before the new exception sentence, it is scoped. On halt paths, `resident_bytes` stays up (gate 1's probe read 20540), which the text implies but does not state. Optional.
- N-2. The exception sentence names only "queued batches". The held batch is also dropped uncounted, on the halt arm, the deferral arm and the semaphore-closed arm (gate 1 N-2). A writer send failure (`TransportFailed` "send:") also ends with queued batches uncounted, and it is not in the list. The list does not claim to be exhaustive.
- N-3. Amendment 4 was committed at f4723123 (2026-10-05T13:06:40+02:00), 11 s before 1b2e53d4 (13:06:51+02:00). Items 3 to 5 therefore describe "the branch fix commit" without its id. Worker report 2 names it. The closing amendment names 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 in full (round 25, item 2 (d)).
- N-4. Item 6's discharge clause names `kernel/README.md`'s index, a section: the heading "Owner's index" is at line 346 at 1b2e53d4, and its pointers were resolved at gate 1. It resolves. The closing amendment pins it at the merge commit.

## The fix commit 1b2e53d4, against gate 1

`git show 1b2e53d4`: 4 files, 16+ and 11-. The diff touches only the files and hunks below.

| Gate-1 finding | Result at 1b2e53d4 |
|---|---|
| reviewer S1-1 / architect S1-1: identity sentences | Closed, with S2-1 and N-1 as residue. The README:174-177 identity and the `batches_discarded()` doc (transport.rs:256-259) are both scoped to the discard drain, and both name the halt paths and the deferral as uncounted. The `note_discarded` doc (transport.rs:227-232) is scoped too. A grep of the PR's added lines for discard, batches_generated, "sent plus" and equal finds no other identity statement. Amendment 4 item 3 states the I-7 reading. |
| reviewer S1-2 / architect S2-1: unreachable arm | Closed. In `discard_queued`, the guarded `Completed` arm, `let mut discarded = 1u64;` and `discarded += 1;` are deleted, and the fn doc (adapter_ws.rs:362-364) no longer implies `Completed`. Nothing else in the fn changed: the hunks are the 3 doc lines, the declaration, the increment and the arm. No new item, so the caller rule has nothing to check. |
| reviewer S2-3: T4 workers | Closed. `protocol/data-plane/tests/candidate_a.rs:944` at 1b2e53d4 is `#[tokio::test(flavor = "multi_thread", worker_threads = 2)]`. This is a test-site value, not a product constant. |
| reviewer S2-1 / architect Part 4 note | Recorded by Amendment 4 item 6 (S2-2, N-4). |
| reviewer S2-2 | Recorded by Amendment 4 item 2 (S2-3). |
| architect S1-2 | Recorded by Amendment 4 item 1. The hash recomputes, but the item is over the ceiling (S1-1). |

## Mutations at 1b2e53d4 (§22's semantic applicability check)

Each was applied in the worktree, its test run alone with `-- --exact`, the failure recorded, and the mutation reverted with `git checkout`. `git status --porcelain` was empty after each.

| # | Mutation as applied | Test | rc | Failure (site, message) |
|---|---|---|---|---|
| M5 | the `None` arm of `discard_queued` (adapter_ws.rs:383-385) replaced by `None => return Terminal::Completed,` | an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted | 101 | candidate_a.rs:982:5, "assertion `left == right` failed: detail was: ", left 0, right 2 |
| M4 | the `is_cancelled` deferral block (adapter_ws.rs:242-250) deleted | a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first | 101 | candidate_a.rs:959:5, "assertion `left == right` failed: detail was: [P6 placeholder] the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered", left 2, right 1 |

- Both match their gate-1 observations at 3f7b1949, and worker report 2's.
- M5 still discriminates with the unreachable arm gone, so Amendment 4 item 4's "M5's observation at 8f5e622e stands" resolves.
- M4 discriminates with T4 on two workers, so item 5's "M4's observation at 8f5e622e stands" resolves.
- No verify-mutation run is counted here as an observation.

## Suites at 1b2e53d4

- `cargo test -p spatial-data-plane`: rc 0. unit 24, candidate_a 16, no_transport_leakage 4, origin_header_encoding 5, stream_registry_bound 3, doc 0; all passed.
- `cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit`: rc 0, 2 passed.

## §7 at 1b2e53d4 (`origin/main...HEAD`, merge base e4b49efacde8f9c667ac9a5bc354410328de2161)

- Product: lib.rs 93, adapter_ws.rs 111, pump.rs 13, server.rs 3, transport.rs 36, so **256**, against 310.
- Tests: 273 + 205 = **478**, against 490.
- Documentation: kernel/README.md 5, protocol/data-plane/README.md 29, so **34**, against 45.
- Files: 9 in the diff. With the form and PLAN.yaml that makes 11, against 11.
- Must-print-nothing: printed nothing, rc 0.
- No overrun, so no class 8 is due. These figures equal worker report 2's.

## Amendment 4 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`, lines 523-534 on main)

- Append-only: `git diff --numstat f4723123^ f4723123` on the form gives 13 and 0. No later commit on main touches the form.
- Item 1: `git show 8f4874c184ac4b4d13546b47843c643e1fcdb5ec:state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md | sha256sum` gives d58d34f9d1ce6c0d284733d3b1e25a042d04e320290a5cae96a43109dd43d86a. It matches. 8f4874c1 is an ancestor of origin/main, and is not f4723123. Over the ceiling: S1-1.
- Item 2: `git show 92a71c30:state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md | sha256sum` gives dcb21e03e8bdc5bad32435a06aed164eb275bce56c62755a54cee030451a1941. It matches, and is the same at origin/main. 92a71c30c2b44fe3dbdc17a1f47534d2d0181b89 is the commit that added the file, and it is on main. Form: S2-3.
- Item 3: the I-7 reading is the one my gate-1 S1-1 offered: the discard drain (an owner's cancel with no prior data-plane cancel, or a pump failure), on P-9's four tests, with I-7 not fired. The architect's §8 item 22 reads the same way. Residue: S2-1.
- Superseded index: its two entries name what they replace. Item 6 is missing: S2-2.
- There is no line cite into `DECISIONS-PENDING.md`.
- Every round and item cite is a round-and-item reference: round 15 (e), round 25 item 2 (d).

## Commands and exit codes (worktree `C:/dev/wt/dptwc` at 1b2e53d4, `CARGO_TARGET_DIR=D:/wt-targets/dptwc`, each cargo run under `timeout`)

- `git rev-parse HEAD`, `git status --porcelain`, `git show 1b2e53d4`: rc 0. The head is 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 and the tree is clean.
- `cargo test -p spatial-data-plane`: rc 0.
- `cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit`: rc 0.
- M5: `sed` applied, then `cargo test -p spatial-data-plane --test candidate_a -- --exact an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted`: rc 101. `git checkout -- protocol/data-plane/src/adapter_ws.rs`: rc 0, and porcelain empty.
- M4: `sed` applied, then `cargo test -p spatial-data-plane --test candidate_a -- --exact a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first`: rc 101. Revert: rc 0, and porcelain empty.
- `cargo fmt --all --check`: rc 0.
- `cargo clippy -p spatial-data-plane --all-targets`: rc 0, no warning or error lines.
- `git diff --numstat` and `--name-only` (`origin/main...HEAD`) for §7, and `git diff --stat` for the must-print-nothing set: rc 0 each.
- In the main checkout:
  - the two `git show <rev>:<path> | sha256sum` recomputations above: rc 0 each;
  - `git merge-base --is-ancestor` for 8f4874c1 and 92a71c30 against origin/main: rc 0 each;
  - `git diff --numstat f4723123^ f4723123`: rc 0;
  - the line hashes of the form at 9c40d22f53271a4dfce29a7e71d84ac4293f9b77 (lines 199, 527, 528, 532 and 534), each by `git show` piped to `sed -n` with the line number and to `sha256sum`: rc 0.
- `gh pr checks 176`: rc 0, 16 of 16 pass. `gh pr view 176 --json headRefOid` gives 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1.
- Final state of the worktree: `git status --porcelain` is empty, and `git rev-parse HEAD` is 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1.
