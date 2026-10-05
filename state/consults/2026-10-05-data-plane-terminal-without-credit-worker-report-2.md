*Custodian's filing note (2026-10-05): the worker's report 2 for `data-plane-terminal-without-credit`, correction round 1 of PR #176 gate 1 (run 11:03Z to 11:06Z; 33,668 subagent tokens, 16 tool uses), written to the custodian's scratchpad and copied here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is abb80b6e87524980f40261689d4ac6c50649ed0a63fa84dbf9d04d88692c8953. The branch stands at 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1, clean. Profile paths redacted at filing: none.

---

# dptwc worker report 2 (correction round 1, PR #176 gate 1)

Commit: 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 (on cut/data-plane-terminal-without-credit; not pushed)
Diff stat: 4 files, 16 insertions, 11 deletions (README.md 5, adapter_ws.rs 9, transport.rs 11, candidate_a.rs 2 changed lines).

## Doc text changed (old -> new)

transport.rs, note_discarded doc, appended after "...keep counting at generation.":
  old: ends at "and `batches_generated` and `rows_emitted` keep counting at generation."
  new: adds "It is called on the discard drain only (an owner's cancel with no prior data-plane cancel, or a pump failure); a data-plane cancel, a peer close, a malformed frame, a receive error and the deferral drop queued batches without counting them."

transport.rs, batches_discarded doc (round 5, item 4 declaration and its four test names untouched):
  old: "Sent batches plus this equal `batches_generated` once a stream has ended."
  new: "On the discard drain only (an owner's cancel with no prior data-plane cancel, or a pump failure), sent batches plus this equal `batches_generated` once a stream has ended; a data-plane cancel, a peer close, a malformed frame, a receive error and the deferral drop queued batches without counting them."

README.md:
  old: "generation, so once a stream has ended, batches sent plus batches discarded equal batches generated."
  new: "generation, so once a stream has ended on the discard drain (an owner's cancel with no prior data-plane cancel, or a pump failure), batches sent plus batches discarded equal batches generated.
  A data-plane cancel, a peer close, a malformed frame, a receive error and the deferral drop queued batches without counting them."

adapter_ws.rs discard_queued doc:
  old: "The channel closing instead is **never** `Completed` once a batch was discarded: a consumer must not read a stream with batches missing as a whole one. This is reached holding a batch, which is counted first, so `Completed` is only the answer when nothing was discarded."
  new: "The channel closing instead is **never** `Completed`: a consumer must not read a stream with batches missing as a whole one. This is reached holding a batch, which is counted first, so a batch has always been discarded by then and the close is a `ProducerFailed`."
Code: arm `None if discarded == 0 => return Terminal::Completed,`, the `discarded` declaration and its increment deleted.
candidate_a.rs T4: attribute now `#[tokio::test(flavor = "multi_thread", worker_threads = 2)]`.

## Suites (CARGO_TARGET_DIR=D:/wt-targets/dptwc, each under timeout)
- cargo test -p spatial-data-plane: rc 0 (24, 16, 4, 5, 3, 0 passed; 0 failed)
- cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit: rc 0 (2 passed)
- cargo fmt --all --check: rc 0

## Mutations, observed at 1b2e53d4 by applying, running alone, reverting
- M5 (remaining None arm returns Completed), T5 an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted: FAILED at tests/candidate_a.rs:982 "assertion `left == right` failed: detail was: " left 0, right 2 (TERM_COMPLETED in place of TERM_PRODUCER_FAILED). Reverted.
- M4 (is_cancelled deferral block deleted), T4 a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first: FAILED at tests/candidate_a.rs:959 "assertion `left == right` failed: detail was: [P6 placeholder] the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered" left 2, right 1 (TERM_PRODUCER_FAILED in place of TERM_CANCELLED). Reverted.

## Section 7 counts (insertions plus deletions, origin/main...HEAD)
- product (protocol/data-plane/src, kernel/src): 229 + 27 = 256 (ceiling 310)
- tests (protocol/data-plane/tests, kernel/tests): 477 + 1 = 478 (ceiling 490)
- docs: protocol/data-plane/README.md 28 + 1 = 29; kernel/README.md 3 + 2 = 5, total 34 (ceiling 45)

State: git status --porcelain empty.
