# Wave 1 — the custodian's ledger

Kept per `state/cloud/wave1-prompts.md` §6, the tracked copy of the wave-1 prompts. The custodian fills it; no worker writes here. Each session's WAVE1 REPORT goes verbatim into `state/cloud/wave1/<item>.md` as immutable evidence. Balance before and after is recorded for *each* launch batch, even when per-session figures exist. Spend is never estimated from tokens. A figure the platform does not show reads "not attributable".

WAVE1_BASELINE=bb98f71f43a2891d317b10a124387df9d5ee0ebf   CI on baseline: green (Rust workspace https://github.com/christopherdonini/spatial-ide/actions/runs/36076675466 · shell https://github.com/christopherdonini/spatial-ide/actions/runs/36076678443 · bundle viewer https://github.com/christopherdonini/spatial-ide/actions/runs/36076681073)

| Item | Session ID | Model | Launched (UTC) | Ended | Balance before | Balance after | Spend (exact \| batch delta) | Findings | Dispositions |
|---|---|---|---|---|---|---|---|---|---|
| A3 (calibration, alone) | session_01STxb5ot2J5RaYpnzffmSq6 (prompt: `state/cloud/wave1/A3-prompt.md`) | Opus 5.5, Medium (as launched) | 2026-09-25T06:41:30Z | about 06:54Z (the report; commit db9527f at 06:52:41Z) | $250 of $250 left (Cloud session credits, claude.ai Settings → Usage, read 2026-09-25 about 06:40Z) | $243 of $250 left (read 07:01:50Z after a refresh) | not individually attributable; batch delta $7 (A3 alone; the page shows whole dollars) | 0 findings; 5 unproven observations | observations: 1 RECORD S2; 2 DISCARD S3; 3(a) RECORD S2; 3(b) S1 candidate, the custodian's Windows reproduction pending; 4 DISCARD S3; 5 DISCARD S3 (`state/cloud/wave1/A3.md`) |
