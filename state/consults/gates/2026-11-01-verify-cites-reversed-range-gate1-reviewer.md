Reviewed: PR #272 at 5efa8bd178a8ad9b8e2114e8d61f8b64263cbef5 (base 180b1e9f), gate 1, reviewer
cut/verify-cites-reversed-range @ 5efa8bd178a8ad9b8e2114e8d61f8b64263cbef5
Verdict: PASS

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation:** none.

What I checked in the logic, at the head:
- The new returns sit before every other test. `checkResolved` returns after the no-match return (scripts/plan/verify-cites.mjs:309-311). `checkPinned` returns before `cat-file -e` (scripts/plan/verify-cites.mjs:339-341).
- A pinned cite reaches `checkPinned` only when the tree check fails (line 442). The tree check now fails a reversed range whose path matches, so a pinned reversed cite always reaches `checkPinned` and gets the same text there. That text is not `missingFile`, so it becomes `pinReason` (line 455).
- A rooted cite that matches nothing is read at its pin and gets the same reason. A loose cite that matches nothing is still skipped.
- The move-map check (lines 437-441) still runs first. An unpinned cite into a rotating ledger is still advisory.
- Each clause of W1 to W3 holds against this code. verify-quotes imports neither checker (scripts/plan/verify-quotes.mjs:137), so it does not change.

## Check 1: the diff against the five lines and note 1

Calls: `git diff 180b1e9f...5efa8bd1` rc 0, `git log` of the messages rc 0, and my scripts `vcrr-g1r-words.mjs` rc 0, `vcrr-g1r-hdr3.mjs` rc 0 and `vcrr-g1r-wd.mjs` rc 0.

- **One unexported helper.** `backwardReason` (lines 302-306, not exported). It returns null unless the start is above the end and the end is not 0. The reason is `range <s>-<e> of "<pathRaw with ./ stripped>" runs backwards (its end is below its start)`, as the Change line words it.
- **Its return in `checkResolved`:** after the no-match return. It gives `oob-exact` when `exact.length` is non-zero, else `oob-suffix`, before `inRange`. Matches.
- **Its return in `checkPinned`:** first, before the commit is read. Matches.
- **W1 to W3, byte-equal by script.**
  - W1, taken from form line 42: the head's header comment, with lines joined and comment markers stripped, equals the base's with W1 inserted directly after the line-0 sentence, and with nothing else changed (`true`).
  - W2: both status lines equal the base lines with ", or the range runs backwards" inserted before the closing parenthetical (`true` for both).
  - W3: present in `checkPinned`'s doc comment, and the comment is otherwise unchanged (`true`).
  - The form's W1 to W3 lines equal the architect draft's, once the pins are normalised (`true` for all three).
  - The draft's sha256 from line 5, at 180b1e9f, is 09c73b808c65e5a35c779838471974744d565cfb962d4a41f762f0eb28fa4ac8. That equals the form's lead line. The draft is not at ae71bd8a (`git show` rc 128): it was added at 180b1e9f. "Read only at main ae71bd8a" describes what the architect read.
- **No existing test changed or removed.** The test-file hunk is `@@ -715,3 +715,45 @@`, with additions only. All 4 deleted lines are in verify-cites.mjs, and they are the W1 and W2 line replacements plus the W3 line.
- **No literal reversed range token.** Run through the checker's own `extractCitations` over the whole diff text and over the three commit messages: 0 reversed ranges. A raw `:a-b` scan with b < a found 0. Positive controls for both scans returned 1.
- **Size:** +60 −4 = 64, within the budget of 100.

## Check 2: tests and mutations, on the export

- **The export.** `git archive --format=tar -o <scratch>/vcrr-g1r-843.tar 843e206b` rc 0, then `tar --force-local -xf ... -C <scratch>/vcrr-g1r-export` rc 0. The export's verify-cites.mjs sha256 is 4e4f7757...289b5, equal to the head's file. Its test file sha256 is 8875557...1720, equal to `git show 843e206b`.
- **The runs.** One driver (`vcrr-g1r-mut.mjs`, rc 0) ran the whole of verify-cites.test.mjs under each variant, with each replacement asserted to match exactly once. Every run had 54 tests, 0 skipped, 0 cancelled.

| Variant | Exit | Pass / fail | Failing tests (and the assertion) | Restored sha256 equal |
|---|---|---|---|---|
| head | 0 | 54 / 0 | none | yes |
| B's verify-cites.mjs | 1 | 51 / 3 | T1 (gated, expected 1, got 0); T2 (expected `oob-suffix`, got `ok`); T3 (gated, expected 1, got 0). T4 passes. | yes |
| M1 (status `'oob-suffix'`) | 1 | 52 / 2 | T1 and T3 only | yes |
| M2 (status `'oob-exact'`) | 1 | 53 / 1 | T2 only (got `oob-exact`) | yes |
| M3 (checkPinned's `if (back) return` line removed) | 1 | 53 / 1 | T3 only | yes |
| M4 (`\|\| cite.endL === 0` dropped) | 1 | 53 / 1 | T4 only (got the backward text) | yes |
| head, again at the end | 0 | 54 / 0 | none | yes |

- Every mutation failed exactly the tests the Tests+mutation line and the RECORDED MUTATION comments name.
- The mutations were applied by hand, not by a `verify-mutation` run. Nothing in the record calls them a verify-mutation observation.
- I removed the export and the tar (rm rc 0). `ls` of the export folder then returned rc 2.

## Check 3: the predicted run

Calls: main at 0f6c62a44004c0f8a0af32e4c571d199f127b13e, and `vcrr-g1r-pred.mjs` rc 0.

- **The two checkers.** "Main" is main's own checker. "Head" is the export's verify-cites.mjs, byte-equal to the head's file. Its sibling modules come from 843e206b, and `git diff --stat 180b1e9f 0f6c62a4 -- scripts/` is empty, so main has no drift under scripts/ since B.
- **Results over main's tree:**

| | Main | Head | Same? |
|---|---|---|---|
| Scanned | 2542 | 2542 | yes |
| Gated | 0 | 0 | yes, keys and reasons |
| Advisory | 79 | 79 | yes, keys, tiers and reasons |
| listErrors | 0 | 0 | yes |

- The head produced 0 findings with the backward reason.
- The worker's figures (2539 and 76) were over B's tree. Mine are over main at 0f6c62a4, which is later than B.

## Check 4: the verify scripts and CI

Run in C:/dev/wt/vcrr at 5efa8bd1:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 594 tests, 594 pass.
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "PASS ... across 2539 file(s). (76 loose reference(s) advised above.)"
- `verify-test-claims.mjs`: rc 0, "PASS — all 705 claimed test(s) across 217 file(s)".
- `verify-quotes.mjs`, under `timeout 590`: rc 0, "verify:quotes PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, ... 0 ruling-cite errors." The harness moved this call to the background (b6fas1lnr). I waited for it with a loop that slept 10 s per turn under a 540 s deadline, and it completed with exit 0.

CI: `gh pr checks 272` rc 0, all pass. The PR head is 5efa8bd1 and the PR is a draft. Each run's head sha, from `gh run view`, all completed with success:

| Run | Workflow | Event | Head sha |
|---|---|---|---|
| 41258804374 | Governance CI | push | 5efa8bd1 |
| 41259747897 | Governance CI | pull_request | 5efa8bd1 |
| 41259747887 | DCO sign-off | pull_request | 5efa8bd1 |
| 41259747922 | Exposure scan | pull_request | 5efa8bd1 |
| 41258804259 | Ported notices | push | 5efa8bd1 |
| 41259747860 | Ported notices | pull_request | 5efa8bd1 |

## Holds, background shells, end state

- **Holds:** none taken. Only node, git and gh ran; nothing was heavy.
- **Background shells:** one, verify-quotes (b6fas1lnr), which the harness moved to the background. It completed with exit 0 before this report. `ps -ef` shows no verify-quotes or node --test process. Nothing I started is still running, and no kill was needed.
- **The worktree:** `git -C C:/dev/wt/vcrr status --porcelain` rc 0, 0 bytes; HEAD is still 5efa8bd178a8ad9b8e2114e8d61f8b64263cbef5.
- **The export:** removed, as stated in check 2.
- **Writes:** only `vcrr-g1r-*` files in the scratch folder. No commit, push or PR action.
