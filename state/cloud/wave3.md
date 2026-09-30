# Wave 3 — the custodian's ledger

Kept per `state/cloud/wave3-prompts.md` §2 and §5, in wave 1's recording format (`state/cloud/wave1-prompts.md` §6). The custodian fills it; no worker writes here. Each session's WAVE3 REPORT goes verbatim into `state/cloud/wave3/<item>.md` as immutable evidence, and each launched prompt sits beside its session ID in `state/cloud/wave3/<item>-prompt.md`. Balance before and after is recorded for the launch batch, in whole dollars. Spend is never estimated from tokens. A figure the platform does not show is recorded as "not attributable".

**Authority.** The wave-3 authorisation (`state/directives/2026-09-30-wave3-authorisation.md`; its ruling line is RULED 2026-09-30 in `DECISIONS-PENDING.md`): the cloud-spending hold is lifted for wave 3, and workers may install Linux system packages inside their own container.

**The prompts file.** `state/cloud/wave3-prompts.md` is the human's untracked copy, byte for byte, with no note added, so its hash stays checkable. Before copying, the source file hashed sha256 c6702c4fb02210819e770c3aa9b7fa01fccf56db843841787efca2d6bc1fd290 (224 lines, 16,727 bytes), as the authorisation's item (a) states; the tracked copy hashes the same. The launched texts, with the baseline written in, are filed beside their session IDs under `state/cloud/wave3/`.

WAVE3_BASELINE=a02354677d6c03aaed4b2dbdf4d14b09621d5766   The first main commit at or after a023546 with product CI green on every workflow that ran; it is a023546 itself (B-1's done commit): Governance https://github.com/christopherdonini/spatial-ide/actions/runs/36678705074 · Rust workspace https://github.com/christopherdonini/spatial-ide/actions/runs/36678705038 · shell https://github.com/christopherdonini/spatial-ide/actions/runs/36678705352 · Pages https://github.com/christopherdonini/spatial-ide/actions/runs/36678704957. The bundle-viewer workflow did not run there (its `paths` filter); no commit since its last main run, green at 36a1ea4 (https://github.com/christopherdonini/spatial-ide/actions/runs/36313641697), touches its paths.

**The promotion.** It ends 2026-11-04 23:59 PT (2026-11-05T07:59Z). Wave 2 ended at $201 of $250 left (`state/cloud/wave2.md`, W2-D's after-reading at 2026-09-28T17:37Z).

| Item | Session ID | Model | Launched (UTC) | Ended | Balance before | Balance after | Spend (exact \| batch delta) | Findings | Dispositions |
|---|---|---|---|---|---|---|---|---|---|
