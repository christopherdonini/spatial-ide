*Custodian's filing note (2026-10-24): the series of `guardian-parity-git-timeout-under-load` (its form's §6, L0 and L1) at 7235aa0ce559893cf402d6ad304df6ed24a0f198, run by a tester in shared holds; no edit, commit or push; its TAP files, statistics and scripts stay in the custodian's scratch folder under the names and sha256s it gives. Not a `docs/08` measurement. The run 10:04:19Z to 10:34:27Z by its transcript (Read 1, Bash 15). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is b983ea18cef957ee8be20fcb3f78b842576390164a20b159c6c622f3294993cd.*

---

Measured: guardian-parity-git-timeout-under-load's series at 7235aa0ce559893cf402d6ad304df6ed24a0f198

**Model:** the harness reports me as Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff. No usage figures.

**Scope:** The worktree C:/dev/wt/gpt was clean before and after (git status --porcelain printed nothing), HEAD 7235aa0. I made no edit, commit or push and did not touch STOP_RUN_OPTS.timeout. All files I wrote are in my scratch folder under names starting gpt-s-: the TAP, env, results, hold and stats files, the runner gpt-s-run.sh and gpt-s-stats.mjs. None of this is a docs/08 measurement or a performance figure (§8 item 6). These are per-call git times under a test harness on a shared machine.

**Four failure classes, as they apply to my harness:**
1. Product interface: I ran the committed test files through node --test. L1 is governance-ci's command, copied unchanged.
2. Result claims: every figure below comes from gpt-s-stats.txt and the TAP files, all of which exist.
3. Operator-facing lines: the lines I quote or describe state what was measured at 7235aa0.
4. Assertions reached: each run's TAP carries pass lines for the parity test and the fixture-set test. The two timeout tests, one per side, also pass in the L0 run I read in full (L0-01); I did not check the other runs' lines for them individually. There were 0 failing-test lines in any of the 30 runs and every runner rc=0. L1 reports tests 555, pass 555, fail 0, cancelled 0, skipped 0 in all 10 runs.

**Environment** (recorded per run in the .env files, identical in all 30): node v24.18.1, git version 2.49.0.windows.1, os.availableParallelism() = 8. The hold pinned cores 0-7.

**Process:** the runner unset CUSTODIAN_TELEGRAM_BOT_TOKEN and CUSTODIAN_TELEGRAM_CHAT_ID (both were set in my environment) and set CUSTODIAN_TELEGRAM_DRY_RUN=1. Neither series had a non-parity failure to report.

**Hold lines (this project's only):**
- L0 (gpt-s-hold-L0.txt):
  - MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:46276 also=bash.exe:46440 (commands started from now on inherit it; release when done)
  - MACHINE_RELEASED project=SpatialIDE shell=bash.exe:46276 affinity=FF (cores 0-7)
  - The -What text was "guardian-parity-git-timeout-under-load: L0 parity test x20", with -Minutes 30.
- L1 (gpt-s-hold-L1.txt):
  - MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:904 also=bash.exe:30308 (commands started from now on inherit it; release when done)
  - MACHINE_RELEASED project=SpatialIDE shell=bash.exe:904 affinity=FF (cores 0-7)
  - The -What text was "guardian-parity-git-timeout-under-load: governance-ci node --test suite x10", with -Minutes 60. §7 declares one hold at 30 minutes; for L1 I used 60 as a longer estimate.
- Neither hold was refused (no code 96 to 99), so I4 did not fire.

**TAP files with sha256** (gpt-s-L0-NN.tap, NN 01 to 20; gpt-s-L1-NN.tap, NN 01 to 10). Every run had rc=0.

L0:
| Run | sha256 |
|---|---|
| 01 | e5e6a05d2241b781e2ff722cdde95a1aaff5bcfe5a2af333b88c2031a8073e1d |
| 02 | 8f0381eefb5f27b0ea3a249c850b953f47118b7c9fc31a9afe4c76dc1a76a23d |
| 03 | cbc9f27a8d0ffc9d6d0c41b5f6907e4a7a6be9d971368939e38a29f0432587ef |
| 04 | 214efa4c7466ccff5d66a2ad92782c92203ba0e1181b7b6738c5169e58315e26 |
| 05 | 7c762c6c0065a448e465cac8a4f60b187c5b7560b84a6bc2e6a87710b953da7b |
| 06 | 33455b6560963a550bbabbfb7be048953d5fc82ccee1016f8d3ed1f6566a49fd |
| 07 | 2fe64ab3dc74b976a8c0457a34e9de585cfd2c5a31bef44cca2b429882b9b194 |
| 08 | 6bfa60c4171451fd050201df64fce8ecc6b04044010eab16674b33a7d4cc69de |
| 09 | 471d0e5382c115b8e78592356669d198523435d0832a99502d102b417e3f3e3f |
| 10 | 7800b8877693f208a1a22b07887a0b3965320700de2822b670ae3f903dbf83c2 |
| 11 | 82df27d69e7447340ad37efefa8e21b87c69f702a0c1ba700ab6497e0aa70ccf |
| 12 | f1ccd7d6460b31ac276599c21c2d9a4c6c388a0c2d5ebf85a72cfcfab08ec536 |
| 13 | 5aa0b0513dba49c138ee571ef985443714794465cf601551fa38f39db2cdcbc7 |
| 14 | e67cc8c814eb1625ce4d1fc7cd8d424475eb84ab202837d9a488e0ec381e69cf |
| 15 | a4d414b2dbd8ed90e2dc80599e29802c9d1d49f951319c0b925e9d7429ff6f44 |
| 16 | 72ddd9bb6f9612bc90325e3617bc788b715372d7ff8f56e18e942940d4948487 |
| 17 | 9db56b5c2db6509edff0e8281d03f034c7e0ed5d5462013634cb7799cd072731 |
| 18 | ad4c60725db8544d06a257173b39cfb6390c4ce52a955e983c5a0d4228b7e969 |
| 19 | 0918c4f912536fa1464b67ab3b7cd13f7104e6227aad32ea3c40b77fb79dcb64 |
| 20 | 81f61ccad90c606339503771f080056e44892d20c11d2c622ec6d4d269cc6605 |

L1:
| Run | sha256 |
|---|---|
| 01 | 8aa45cf13fc462ee22098897294d726a235212224ba67e1dcb4b69593608376d |
| 02 | bb1ea389b988cdf983b8864ba7be38ecbf32a852ccccda1242f4c2e5c0a78692 |
| 03 | 4116fbd42e62dca8e7285c6dd29e1551cc803b737bbbd32075b5e0e47ee178f6 |
| 04 | ad8a90b90c14e23186331e9d73adbe0e6db06429c9d5503d0429d14979454b46 |
| 05 | ce8499771d5de448b9cc31554a38b4c7a3e86de57d8d25214f39ac68ab79c3d6 |
| 06 | 5d3613445791243b5adae13d6d898fee385e6aeb25a7886f4b96380ad7c88f0b |
| 07 | 215e3165998c97b24c92147772282c3f229c64df699a9867dedcedef0bd46e0d |
| 08 | 21c623569dcc4474f394dc11bedf3da02f1bfae0ba106f77ca48423d70878067 |
| 09 | dc3275b94bd94446d30b7c939ad038d6b4551c27fcd844365ea09782cf8cc2fc |
| 10 | 7469bd49cb5ac05dbbe8aad17c9aa02fc3a9275a1e9d86a6df478de3be04dc21 |

**Statistics** (computed by script, gpt-s-stats.mjs, output in gpt-s-stats.txt, from the git ms: lines; nearest rank, ms; per side and per call position; 13 fixtures per run, position 0 has 13 calls per run, position 1 has 11, position 2 has 9).

L0 (20 runs):
| Position | n | p50 | p95 | p99 | max |
|---|---|---|---|---|---|
| mod:0 | 260 | 24 | 31 | 57 | 61 |
| mod:1 | 220 | 25 | 34 | 56 | 63 |
| mod:2 | 180 | 25 | 34 | 46 | 69 |
| stop:0 | 260 | 23 | 31 | 47 | 53 |
| stop:1 | 220 | 23 | 32 | 49 | 54 |
| stop:2 | 180 | 24 | 32 | 51 | 62 |
| mod, all | 660 | 24 | 34 | 56 | 69 |
| stop, all | 660 | 23 | 31 | 48 | 62 |

L1 (10 runs):
| Position | n | p50 | p95 | p99 | max |
|---|---|---|---|---|---|
| mod:0 | 130 | 67 | 196 | 402 | 453 |
| mod:1 | 110 | 74 | 181 | 554 | 585 |
| mod:2 | 90 | 75 | 210 | 612 | 612 |
| stop:0 | 130 | 67 | 225 | 322 | 454 |
| stop:1 | 110 | 67 | 176 | 236 | 349 |
| stop:2 | 90 | 69 | 285 | 510 | 510 |
| mod, all | 330 | 72 | 203 | 506 | 612 |
| stop, all | 330 | 67 | 225 | 349 | 510 |

**Timed-out count:** 0 under L0, 0 under L1 (no "timed out:" finding in any TAP).

**X and B:** X = 612 ms, from gpt-s-L1-05.tap, fixture PS6, the mod side's position-2 call. No call timed out, so none was counted as 5000. 2X = 1224, ceil(1.224) = 2, so B = min(10000, max(2000, 2000)) = **2000**.

**Judgements:**
- P1 holds. No timeout under L0, and the L0 maximum was 69 ms, under 1000.
- P2 holds. L1 p95 was 203 (mod) and 225 (stop), against L0's 34 and 31. No timeout under L1.
- P3 holds. B = 2000.
- I3 did not fire (no timeout under L0).
- I5 did not fire. The longest run of the two timeout tests (T37/T38) was 2687.8 ms under L0 and 4582.8 ms under L1; the limit is 3 times the timeout, which is 6000 ms at a timeout of 2000.
- OPEN-2: no Stop-side call reached 2000 ms. The Stop-side maximum was 510 ms.

**Observation for the custodian and architect, not judged by me:**
- Three fixtures, PS4a, PS18 and PS19, are "not judged" on both sides in all 30 runs (30 occurrences each).
- The git ms: lines show (exit 128) on reads, identically in all 30 runs, on both sides: PS4a at position 0, PS19 at position 1, and PS7 at position 2. PS7 is judged. PS18 has no non-zero exit but is still not judged.
- §5's falsification clause is "not judged on reads with a non-zero exit and no timeout". These exit-128 reads have no timeout and appear in unloaded L0 runs too, so they are fixed by the fixtures rather than load-dependent.
- The test's own fixture-set check expects "not judged" outcomes. Whether this counts as the falsification condition is the architect's call.

**Processes:** both holds were released (MACHINE_RELEASED lines above). The L1 background shell and both runner scripts have exited. A ps listing afterwards showed no process of mine; the node and esbuild processes in it are not mine.

**Files** (scratch folder, all names start gpt-s-): gpt-s-stats.txt, gpt-s-stats.mjs, gpt-s-run.sh, gpt-s-L0-results.txt, gpt-s-L1-results.txt, gpt-s-hold-L0.txt, gpt-s-hold-L1.txt, and the 30 TAP and 30 .env files.
