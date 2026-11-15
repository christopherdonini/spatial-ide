*Custodian's filing note (2026-11-06): the words worker's report for U1's H-1 and H-2, the architect's proposed words the human approved in typed words (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`, line 14; the form's Amendment 1), applied as two byte-given replacements in `KNOWN-LIMITATIONS.md` item 5, with no re-gate. Dispatched at 2026-11-06T16:55:44.627Z by its transcript from a brief of 10520 bytes (sha256 d3878e6da14c05fca333b588a6bb023294eda348fd2af3e0c9bc6f2c65d624ed), whose span files were byte-copied by script and whose expected file hashes and numstat the custodian computed by applying the spans to copies. The run to its hand-back at 2026-11-06T17:09:24.722Z by its transcript (claude-sonnet-5-5; unique calls Bash 15, Read 2, Write 2, Monitor 1 and the hand-back, 21, equal to the notification's). Saved from the hand-back message, one final newline. Its sha256, from line 5 to the end, is b0d409cb8cc010158018ff4651164b943bd3327f2766814c9527068896c4d37f. The custodian re-read, after a fetch: `cut/publish-session-tier-identity` at b7ee019e174075540ad62810c3f8586f80c578bb, the changed files' sha256 as given, and the numstat 4/3 against 7e203d66. Model output, not Authority.*

---

Built: U1's H-1 and H-2 at b7ee019e174075540ad62810c3f8586f80c578bb

- Start state: HEAD and origin/cut/publish-session-tier-identity both 7e203d66fd65a75e183cd5ddfbb6f399a118ef65, porcelain empty. Brief sha256 matched d3878e6d...
- Words files: all four sha256 matched the brief (old-H1 d4917092..., new-H1 c8b5fcde..., old-H2 b8fdbff2..., new-H2 48446e0d...), sizes 211/276/52/355.
- Script (psti-h-apply.mjs, bytes in/out): H1 and H2 each found exactly once, both replaced, rc=0, CR count 0. Only KNOWN-LIMITATIONS.md changed.
- Hash after edit: cd59da3983b615fff832e7d3e684ebebffa10dde36475c5a256cacfa3d1b7cd3 (matches). `git diff --numstat` was exactly `4 3 KNOWN-LIMITATIONS.md`. grep for CR returned 0.
- Commit b7ee019e, subject: "docs: U1, KNOWN-LIMITATIONS item 5 in the human's approved words (the architect's H-1 and H-2)". Message file had `@` only on the Co-Authored-By line (shown by grep); the one Signed-off-by is from -s.
- Push rc=0 (7e203d66..b7ee019e). Afterwards HEAD == origin/cut/publish-session-tier-identity == b7ee019e, porcelain empty.
- Checks at the new head:
  - verify-cites rc=0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2697 file(s) resolves. (167 loose reference(s) advised above.)"
  - verify-quotes (shared hold) rc=0, "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 917 ruling cites resolved, 0 ruling-cite errors."
  - verify-test-claims rc=0, "verify:test-claims PASS — all 739 claimed test(s) across 238 file(s) exist or are planned, superseded or withdrawn (45 planned, 12 superseded, 17 withdrawn, advisory)."
  - verify.mjs --offline rc=0, "verify:plan PASS — C:\dev\wt\psti\governance\PLAN.yaml agrees with the repository."
  - node --test (plan, hooks, evidence) rc=0, tests 598, pass 598, fail 0.
  - `git diff --numstat origin/main...HEAD` rc=0, 9 files, total +964 −47: KNOWN-LIMITATIONS.md 13/8, engine/src/identity.rs 3/2, frontends/shell/src-tauri/src/publish.rs 121/3, kernel/README.md 1/1, kernel/src/permission/boundary.rs 5/0, kernel/src/publish/ceilings.rs 147/5, kernel/src/publish/error.rs 26/5, kernel/src/publish/mod.rs 74/23, kernel/tests/publish_identity_tier.rs 574/0.
- Hold line: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:71700 also=... (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:71700 affinity=FF (cores 0-7)`. Hold was shared only. verify-quotes ran 3+ minutes, so the harness moved it to the background, and I waited on it.
- Background shells: none left running. The two polling loops I started (bwieuyyf7, bezebjqwx) and the hold call (bkgbeuabs) all completed on their own, and each notification arrived.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
- Off-scope noted: none. Scratch files are in the scratchpad under psti-h- names. CI not awaited, per the brief.
