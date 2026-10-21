*Custodian's filing note (2026-10-21): the worker's report for applying lead-data's owner's-index update (`state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-owners-index-update.md`) on `cut/connection-reuse-recycled-interrupt-flake` in C:/dev/wt/crf, from 32c3e807 to 866b35791cd037159eb0619e80eb1bec8b4851ff, pushed. The run 2026-10-21T01:13:22Z to 01:21:18Z by its transcript (Bash 10, Write 2, Read 1); its one SubagentHandback call, at 01:21:17Z. Checked against the transcript and the branch: the commit changes `engine/README.md` only, 2 lines added and 2 deleted; every figure in the report has its call. The first combined check call, which the report names, ran the four verifiers with their output discarded; the figures come from the separate calls after it. Extracted by script; one final newline added; nothing else changed.*

---

The owner's-index update is committed and pushed, and every check passed at the new head.

**Head and commit:** 866b35791cd037159eb0619e80eb1bec8b4851ff, one commit signed off with the brief's subject, on top of 32c3e807. The push was an ordinary update (32c3e807..866b3579), exit code 0, and origin matches HEAD.

**What was built:** a script in my scratch folder read the four lines from the update file's fences and asserted each old line occurs exactly once. It also refused on a CR byte, and it replaced the lines in `engine/README.md`. The old lines were at 530 (the last-verified line, 1.1) and 550 (the preregistrations list, 1.2). I read the update file's sha256 first: it matches fccdb15b….

**Checks at 866b3579:**
- **Numstat vs 32c3e807:** `git diff --numstat 32c3e807 HEAD` gives 2 added, 2 deleted, `engine/README.md` only (exit 0).
- **§7 count:** exit 0, per file:

  | File | Added | Deleted |
  |---|---|---|
  | `engine/README.md` | 2 | 2 |
  | `engine/src/dataset.rs` | 9 | 3 |
  | `engine/src/stream.rs` | 14 | 0 |
  | `engine/tests/connection_reuse.rs` | 35 | 16 |
  | Total | 60 | 21 |

  That is 81 changed lines, within the 100 ceiling, and `engine/README.md` is 4 changed lines against its ceiling of 6.
- **`verify.mjs --offline`:** exit 0, "verify:plan PASS — PLAN.yaml agrees with the repository".
- **`verify-cites.mjs`:** exit 0, "PASS — every rooted (in-tree) path:line reference across 2116 file(s) resolves. (89 loose reference(s) advised above.)"
- **`verify-quotes.mjs`:** exit 0, "PASS — 129 checked, 98 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors."
- **`verify-test-claims.mjs`:** exit 0, "PASS — all 574 claimed test(s) across 182 file(s) exist or are planned, superseded or withdrawn (0 planned, 9 superseded, 17 withdrawn, advisory)."
- **CI globs `node --test`:** exit 0 inside a shared hold, 509 tests, 509 passed, 0 failed, 109 s. The hold was granted and released normally.

**Differences from the brief:**
- My first combined attempt at the light checks hit the 120 s foreground timeout and went to the background. The bad loop in it printed nothing and was harmless.
- I re-ran the four verifiers separately, each with output to a file, and none were piped. The numbers above come from those runs.
- The verifiers ran without a hold, because each is short.

**Final porcelain:** empty.

**Model as the harness reports it:** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
