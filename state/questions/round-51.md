Question round 51 — 2026-10-04 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 3 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. O-1 (timing-tests-assert-property-not-budget): neither test asserts an undeclared time budget, and the skp test's one recorded failure looks like a real stall (H-S), not slowness: after an SKP cancel, the data-plane writer waits for credit before sending the terminal frame, and the test grants credit 2 once. How should the piece proceed?
  (1) Reproduce first (Recommended) — A tester-high runs scratch variants in a throwaway worktree and files a consult; nothing is committed. R-1 waits for two batches before cancelling; R-1b grants drain credit after the cancel; R-1c is the test alone ×20; R-2 is the publish test ×50 under load. The same shape as round 25 item 1 (d). No code before your rulings.
  (2) Rule from the reading — Skip the reproduction and decide O-2 now, from the architect's code reading alone (H-S is a hypothesis, not observed).
  (3) Apply the ruling literally — Report-only edits to both tests (print timings, keep the bounds). The possible stall is left in place and the flake would keep recurring.

---

2. O-2: if the reproduction confirms the stall (H-S), which remedy?
  (1) Data-plane piece (Recommended) — A separate full-form protocol/data-plane piece makes a producer failure reach the client as a terminal frame without waiting for credit; the skp test stays unchanged as its end-to-end proof. Wire/data-plane under §21a. The adapter already calls a writer parked with no terminal a deadlock, fixed for the halt path only.
  (2) Declare drain credit the contract — The credit-gated terminal becomes the stated contract: the test grants drain credit after the cancel, and a KNOWN-LIMITATIONS line (your wording) says a consumer must drain to a terminal.
  (3) Hold — No change; the flake stays and is noted.

---

3. O-3: the publish test (cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory) asserts no timing at all, and its one recorded flake was never captured with its failure text. What happens to the publish half?
  (1) Close the publish half (Recommended) — Record it as no undeclared budget and failure text unrecorded; the existing assertion messages print the error variant, so reopen on the next occurrence with its text.
  (2) Apply the precedent's additions — About 40 lines: assert that cancellation_observed is reported exactly once, at or after the cancel, and print the two intervals. Any done-claim is limited to 'precedent applied; cause unknown'.
