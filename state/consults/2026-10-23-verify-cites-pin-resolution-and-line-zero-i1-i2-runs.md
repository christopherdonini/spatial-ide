# verify-cites-pin-resolution-and-line-zero: the I1 and I2 runs (the form's §3 and §6)

*Filed by the custodian (2026-10-23) from the worker's scratch outputs, byte for byte, under `state/drafts/verify-cites-pin-i1-i2/`; the worker's report is `state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-worker-report.md`. The outputs are kept under `state/drafts/` because they carry the one line-0 cite token, which main's checker gates elsewhere. Each run imports `runVerifyCites` from two checkers and runs both over one tree; A is main's checker as at 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 (`git show` of that commit), B is the checker named below; the tree is a detached checkout of the commit named.*

| Run | Checker A | Checker B | Tree | Output | sha256 |
|---|---|---|---|---|---|
| I1 at B | 2ffbf957 | e408606d (B, the same code) | 2ffbf957 | `state/drafts/verify-cites-pin-i1-i2/i1-at-b.txt` | 6acbb30da39e35e54043b634690b3eff11d86c32d821847cffe3f7afa1ee3645 |
| I1 at the head | 2ffbf957 | 7a23dbad | 2ffbf957 | `state/drafts/verify-cites-pin-i1-i2/i1-at-head.txt` | 4bc0456ee0c6657fa265255680f39e9ff29d100db3bca81cc015ba4c687fe557 |
| I2 at the head | 2ffbf957 | 7a23dbad | 7a23dbad | `state/drafts/verify-cites-pin-i1-i2/i2-at-head.txt` | 919a0b0865d15db0887c9988b913440ff50e24f9dbadc202e4ac044cc539e32a |

The instrument is `state/drafts/verify-cites-pin-i1-i2/instrument.mjs.txt` (sha256 3271b9473d75b39c99dbf15c32bae400abc2defdc66a131ee4b8bb3bde60c688), the worker's script, filed as text.

**Read against §3:** gated 0 and 0 in every run. I1 at B shows no difference. I1 and I2 at the head each show one change, of class C3: the gate report's line-54 cite, its reason only, now the line-0 exact-tier wording; no entry leaves and none is added, so the D4 classes are empty, as Amendment 1 item 3 predicted from E0. The advisory counts differ by tree (110 at 2ffbf957, 108 at the head's tree), not by checker.
