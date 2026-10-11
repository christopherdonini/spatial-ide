*Custodian's filing note (2026-10-11): E10, read by the custodian by script, as the human's 2026-10-11 direction asks (item 3b). The body below the rule is the read and the recommendation. Its sha256, from line 5 to the end, is 88d9eb4e20efcf59e828ab60c783d1f07bd7980f208dd954e1e85c0cab354d92.*

---

# The Evidence Recorder's E10: read, FAIL; the recommendation

## What was read, and how

- **The governing rows.** E10 is declared in `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md`, Amendment 8. The reading is the one the human chose in question round 59, item 5: per run. The direction asking for this verdict is `state/directives/2026-10-11-direction-after-status-review.md`, item 3b.
- **The source.** The records were read by script from the Recorder's log folder outside the repository (`C:/dev/spatial-ide-local/evidence`), on 2026-10-11. Nothing was run on purpose for E10.
- **The sample.** These are the first 20 schema-v0.1 run records by `started_at` after 2026-10-05T19:18:32.936Z. The log holds 738 such records in all.
  - Each record's engine was read as Amendment 7 reads it: the record's command was matched to the Bash or PowerShell call with the same text whose stamp is nearest its `started_at`, within 120 s, in this project's own session transcripts, and that line's `version` was taken.
  - All 20 matched an engine of 2.1.289. None was excluded.
  - The twentieth record started at 2026-10-05T21:38:15.356Z, so the result has existed since then. It is read late, on the human's direction.
- **Per record,** all in ms:
  - s = `recorder_ms.before` + `after` + `write`;
  - d = `ended_at` − `started_at`;
  - b = the larger of 300 ms and 2% of d.

| # | Record | started_at | Agent | before | after | write | s | d | b | s / b |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `2026-10-05/203043007-5b03bf7aed3715a4.json` | 2026-10-05T20:29:14.843Z | main | 199 | 214 | 0 | 413 | 88164 | 1763.3 | 0.234 |
| 2 | `2026-10-05/203217858-486638d5a25e57d0.json` | 2026-10-05T20:30:47.222Z | main | 203 | 358 | 0 | 561 | 90636 | 1812.7 | 0.309 |
| 3 | `2026-10-05/211906555-ac87071e6c60c5c2.json` | 2026-10-05T21:07:31.473Z | worker-high | 117 | 688 | 1 | 806 | 695082 | 13901.6 | 0.058 |
| 4 | `2026-10-05/212137755-670dba141a1b7f8f.json` | 2026-10-05T21:21:22.634Z | worker-high | 142 | 144 | 0 | 286 | 15121 | 302.4 | 0.946 |
| 5 | `2026-10-05/212228539-33dba76cbb404cb8.json` | 2026-10-05T21:21:55.581Z | worker-high | 285 | 247 | 0 | 532 | 32958 | 659.2 | 0.807 |
| 6 | `2026-10-05/212535587-17d9817914810007.json` | 2026-10-05T21:22:32.943Z | main | 270 | 211 | 0 | 481 | 182644 | 3652.9 | 0.132 |
| 7 | `2026-10-05/212311650-4ee71e2f3071c15d.json` | 2026-10-05T21:22:38.585Z | worker-high | 189 | 179 | 0 | 368 | 33065 | 661.3 | 0.556 |
| 8 | `2026-10-05/212349422-a6af1bd773dcb305.json` | 2026-10-05T21:23:17.291Z | worker-high | 169 | 158 | 0 | 327 | 32131 | 642.6 | 0.509 |
| 9 | `2026-10-05/212357683-56b7788dffc38df2.json` | 2026-10-05T21:23:52.005Z | worker-high | 130 | 129 | 0 | 259 | 5678 | 300 | 0.863 |
| 10 | `2026-10-05/212537863-9ab9468de31810b9.json` | 2026-10-05T21:24:48.697Z | worker-high | 217 | 129 | 0 | 346 | 49166 | 983.3 | 0.352 |
| 11 | `2026-10-05/213326811-517030c4bf10989e.json` | 2026-10-05T21:33:14.042Z | main | 483 | 260 | 0 | 743 | 12769 | 300 | 2.477 **over** |
| 12 | `2026-10-05/213621357-bdca9640b3ef5c21.json` | 2026-10-05T21:33:42.026Z | main | 0 | 2 | 1 | 3 | 159331 | 3186.6 | 0.001 |
| 13 | `2026-10-05/213639958-e0bf40820b24b702.json` | 2026-10-05T21:35:45.282Z | worker-high | 487 | 149 | 0 | 636 | 54676 | 1093.5 | 0.582 |
| 14 | `2026-10-05/213747688-0df8c9c05d664e8b.json` | 2026-10-05T21:37:46.158Z | worker-high | 130 | 153 | 0 | 283 | 1530 | 300 | 0.943 |
| 15 | `2026-10-05/213752698-211c566c45dc0193.json` | 2026-10-05T21:37:51.037Z | worker-high | 158 | 142 | 0 | 300 | 1661 | 300 | 1.000 |
| 16 | `2026-10-05/213758763-af5173efdddaf6f3.json` | 2026-10-05T21:37:57.065Z | worker-high | 133 | 117 | 1 | 251 | 1698 | 300 | 0.837 |
| 17 | `2026-10-05/213803300-1b2cd1ce46490f93.json` | 2026-10-05T21:38:01.879Z | worker-high | 200 | 140 | 0 | 340 | 1421 | 300 | 1.133 **over** |
| 18 | `2026-10-05/213807572-605fa16a160c1687.json` | 2026-10-05T21:38:05.789Z | worker-high | 133 | 131 | 0 | 264 | 1783 | 300 | 0.880 |
| 19 | `2026-10-05/213812354-4a418761c90cbb7d.json` | 2026-10-05T21:38:10.708Z | worker-high | 127 | 129 | 0 | 256 | 1646 | 300 | 0.853 |
| 20 | `2026-10-05/213817298-a2bd0178db57cc13.json` | 2026-10-05T21:38:15.356Z | worker-high | 128 | 135 | 0 | 263 | 1942 | 300 | 0.877 |

## The verdict: FAIL

- **2 of the 20 records have s over their own b.** They are `2026-10-05/213326811-517030c4bf10989e.json` (s 743 against b 300) and `2026-10-05/213803300-1b2cd1ce46490f93.json` (s 340 against b 300).
- **The nearest-rank p95 of s / b** (the 19th smallest of 20) is 1.133, which is over 1.
- **Also reported, not scored:**
  - s: p50 327 ms and p95 743 ms;
  - d: p50 15121 ms and p95 182644 ms;
  - 11 of the 20 records have s over 300 ms.
- **Where it fails.** On a command of a second or two, b is the 300 ms floor. The Recorder's own before and after work is about 250 to 350 ms on its own, so a short command sits at or over its bound. Record 15 is exactly at it (300 against 300).

## The recommendation (item 3b): uninstall

- **What the form already set.** Amendment 8 already said that a failing E10 meant uninstalling, with no further amendment. The human's direction of 2026-10-11 now makes it the human's call, between uninstalling and sampling.
- **Sampling would not fix the failure.** Recording one run in N cuts the total overhead by N. But a sampled run still pays the same 250 to 350 ms, so each recorded short command stays at or over its bound.
- **Nobody reads the records.** No gate report, worker report or consult since 2026-10-06 cites a Recorder record. A script over `state/consults/` files dated 2026-10-06 to 2026-10-11, excluding the mods' own pieces, finds no cite of the log folder. The evidence it keeps has had no reader, so even a sampled record would buy nothing that is used.
- **Uninstalling is the human's action.** The custodian installs, enables, reloads and changes nothing (Amendment 8). Briefs keep the round 50, item 1 wording (approved test commands through the Bash tool) until the human rules. Whether it is dropped is part of that ruling.
