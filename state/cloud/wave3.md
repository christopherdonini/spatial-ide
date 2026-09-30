# Wave 3 — the custodian's ledger

Kept per `state/cloud/wave3-prompts.md` §2 and §5, in wave 1's recording format (`state/cloud/wave1-prompts.md` §6). The custodian fills it; no worker writes here. Each session's WAVE3 REPORT goes verbatim into `state/cloud/wave3/<item>.md` as immutable evidence, and each launched prompt sits beside its session ID in `state/cloud/wave3/<item>-prompt.md`. Balance before and after is recorded for the launch batch, in whole dollars. Spend is never estimated from tokens. A figure the platform does not show is recorded as "not attributable".

**Authority.** The wave-3 authorisation (`state/directives/2026-09-30-wave3-authorisation.md`; its ruling line is RULED 2026-09-30 in `DECISIONS-PENDING.md`): the cloud-spending hold is lifted for wave 3, and workers may install Linux system packages inside their own container.

**The prompts file.** `state/cloud/wave3-prompts.md` is the human's untracked copy, byte for byte, with no note added, so its hash stays checkable. Before copying, the source file hashed sha256 c6702c4fb02210819e770c3aa9b7fa01fccf56db843841787efca2d6bc1fd290 (224 lines, 16,727 bytes), as the authorisation's item (a) states; the tracked copy hashes the same. The launched texts, with the baseline written in, are filed beside their session IDs under `state/cloud/wave3/`.

WAVE3_BASELINE=a02354677d6c03aaed4b2dbdf4d14b09621d5766   The first main commit at or after a023546 with product CI green on every workflow that ran; it is a023546 itself (B-1's done commit): Governance https://github.com/christopherdonini/spatial-ide/actions/runs/36678705074 · Rust workspace https://github.com/christopherdonini/spatial-ide/actions/runs/36678705038 · shell https://github.com/christopherdonini/spatial-ide/actions/runs/36678705352 · Pages https://github.com/christopherdonini/spatial-ide/actions/runs/36678704957. The bundle-viewer workflow did not run there (its `paths` filter); no commit since its last main run, green at 36a1ea4 (https://github.com/christopherdonini/spatial-ide/actions/runs/36313641697), touches its paths.

**The promotion.** It ends 2026-11-04 23:59 PT (2026-11-05T07:59Z). Wave 2 ended at $201 of $250 left (`state/cloud/wave2.md`, W2-D's after-reading at 2026-09-28T17:37Z).

| Item | Session ID | Model | Launched (UTC) | Ended | Balance before | Balance after | Spend (exact \| batch delta) | Findings | Dispositions |
|---|---|---|---|---|---|---|---|---|---|
| W3-A (one batch: W3-A+W3-B+W3-C) | session_017msPRjkMFYd5Zn4FxukM4r (prompt: `state/cloud/wave3/W3-A-prompt.md`) | Opus 5.5, Medium (as launched) | 2026-09-30T07:22Z | (running) | $201 (Cloud session credits, read by the human and typed at about 07:19Z: the wave-3 balance, `state/directives/2026-09-30-wave3-balance.md`) | (after the batch ends) | (after the batch ends) | | |
| W3-B (one batch: W3-A+W3-B+W3-C) | session_01DmBGvV5LCpMZepxrs5Rmb2 (prompt: `state/cloud/wave3/W3-B-prompt.md`) | Opus 5.5, Medium (as launched) | 2026-09-30T07:23:34Z | (running) | (the batch's reading, above) | (the batch's reading) | (the batch's delta) | | |
| W3-C (one batch: W3-A+W3-B+W3-C) | session_01BrZYKUFM4c4oVeA27A2Yrd (prompt: `state/cloud/wave3/W3-C-prompt.md`) | Opus 5.5, Medium (as launched) | 2026-09-30T07:25:36Z | (running) | (the batch's reading, above) | (the batch's reading) | (the batch's delta) | | |

#### Deviation 1, 2026-09-30 — the portability plan is not in the baseline tree

The three prompts send the worker to `state/directives/PORTABILITY-2026-09-30.md`. That file was added at cf86d60, after the baseline a023546, so it is absent from `/tmp/wave3-baseline`. It is present in each session's own checkout, which is on main. W3-C's session noted this in its first message ("it exists only on main, not at the baseline"). The launched texts are unchanged, and no message was sent into any session. The wave-3 authorisation's item (b) fixes the baseline rule, and a023546 is correct under it. The effect is read at triage: each report shows where the worker read the plan from.
