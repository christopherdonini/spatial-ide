*Custodian's filing note (2026-10-06): `guardian-n1-before-auto-compaction`'s P0 (its form's §0.3), read-only, by the worker-high on the custodian's brief at main 8500ebef. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 16be8a519dbd129ad9c738def68cf4ceb2264c8212c52b7090384fe05585bb31. Write audit PASS: 10 Write or Edit calls, every one under the scratchpad folder `pieceB-p0`; its Bash writes, read from its transcript, went to that folder too, and none was in the worktree, the main checkout or under the user's Claude folder. Tool calls Read 2, Bash 80, Write 10, SubagentHandback 1. Run window from the transcript: 2026-10-06T05:21:15.966Z to 2026-10-06T05:37:32.971Z (the harness's usage line: 238,329 subagent tokens, 93 tool uses, 977,015 ms). Refusals in its run: none.*

---

# guardian-n1-before-auto-compaction — P0 report

Read-only throughout. I ran `claude --version` once and no other `claude` subcommand. I installed, loaded and reloaded nothing. I wrote nothing in the worktree (porcelain empty before and after) and nothing in the main checkout or the user's Claude folder. Everything I wrote is in `<scratchpad>/pieceB-p0/`. That includes a derived copy of the declarations text, decompressed from the binary. I killed no process.

**Build of record.** `claude --version` printed `2.1.291 (Claude Code)`. The form's words "the 2.1.289 binary" are read as the build of record's binary, as the custodian instructed. The installed binary is the file `claude.exe` in the user's local bin folder. It is byte-identical to the 2.1.291 copy in the versions folder (same sha256, §6).

## §1. The types at the build of record (2.1.291)

**Source 1, the build's own declarations.** The binary embeds `claude-code.d.ts` as a zstd stream at byte offset 249440263 of the binary. It decompresses to 600,277 bytes with sha256 55d3a5dd98072b125135fae6fdc037f781b3ed9ad007dcd3ea4d657404d0b11f. I call this "the 2.1.291 embedded declarations". The stream is not greppable as text, so piece A's plain `grep -a` would not have found it. The runtime writes it to disk with one header line, `// Written by Claude Code <version>.`, prepended. The line numbers below are in the decompressed text. LF only, 0 CRs.

The three fields are declared on the summary breakdown. The breakdown is `SessionUsage.context.breakdown`, whose type is `SessionContextUsage.breakdown?: SessionContextBreakdown`. That type is one type for both the `summary` and `full` details.

| Finding | Lines in the 2.1.291 embedded declarations | sha256 of those whole lines |
|---|---|---|
| `totalTokens` | 10540-10543 | 1e684b3177230b91f24117a22bf1b85675fdb8d8f6119f78d6839916712fb98e |
| `rawMaxTokens` (percentage's denominator) | 10548-10552 | 0df6a65380d3aea54762bae9ad578c694585bbd4ed2ce40e9e308de639f0fd8b |
| `percentage` | 10558-10562 | 7d7eeef7c8b8e529af3320689fa7092e0f9f709f61cd77f89c12863f1f9e8798 |
| `autoCompactThreshold` | 10593-10596 | 4420705d18152515660d351d56f1685ca6add46a3bdbe0a75c41c088a06e7bce |
| `isAutoCompactEnabled` | 10597-10600 | 32d77d7ca4990ef9cebe1be3adce57a4673cdcfd1e4ebdd849842a3d6cc0afe1 |
| `SessionContextUsage.breakdown?` | 10634-10642 | 7d89b9430668050e9bfd6cea610fbaec854b3d8143001a6f9137ab19efe08323 |
| the type's own doc and declaration | 10526-10532; 10534 | 1b92736ff7d3fc4f32c5c66d9135b24413c7019c487575361f2247c9ac011e81; 3100cc4bbd43484ead3d781eb8bf9ee071cc9600ef7ee328ade64f5abc1a66b3 |

Byte-copied text from those spans, using those line numbers:
- line 10543: `      totalTokens: number;` with its doc on line 10541: `* Tokens in use, unclamped: past \`rawMaxTokens\` when over the window.`
- lines 10594 and 10596: `* The token count at which auto-compaction runs; absent when it is off.` and `autoCompactThreshold?: number;`
- lines 10598 and 10600: `* Whether auto-compaction is on for the session.` and `isAutoCompactEnabled: boolean;`
- **`percentage`'s denominator**, lines 10559-10560: `* \`totalTokens\` over \`rawMaxTokens\` as a whole percentage, 0 to 100 and` / `* past it when over.`
- **`rawMaxTokens`**, lines 10549-10550: `* The window measured against, in tokens: the model's limit, or a smaller` / `* compaction window (\`autocompactSource\` says which).`
- **`SessionContextUsage.breakdown?`**, lines 10638-10640: `* It measures against the compaction window (\`rawMaxTokens\`), which may be` / `* smaller than \`window\`, and estimates every category, so its` / `* \`totalTokens\` need not equal \`tokens\`.`

So `percentage` is `totalTokens` over `rawMaxTokens`, the compaction window, not the model's window. It is a whole (rounded) percentage.

**Optionality.** `autoCompactThreshold` is declared `number`, optional, and absent when auto-compaction is off. The other two are `number` and `boolean`, both required. The engine builds the object so that it omits `autoCompactThreshold` when it is undefined. The mod-API shape function is at binary offset 216333878, length 1495, sha256 820ef1f7d4185b4be096670fa24dac14c0347b9e6b07a18789a886ca41cc4e9c.

**Does the call estimate locally and send no request?** Yes.
- Declarations lines 11402-11409, sha256 95a2ed5eb116d879378361f9141868849efc1901050c9ee904f71ccde8ea9a8b. Line 11407 reads `* /context does; \`summary\` estimates locally and sends none.`
- The implementation agrees. For `summary` the counters are local byte-length estimates and the API-counting function is not built. That is binary offset 216710143, length 511, sha256 f8eea8e76da8a44fcb84b074ecdc4e95ad6dbdf9f817cc699b16aa8a853cc89b.
- Related doc lines: 2060-2066, sha256 9ee5323716ec077b33690c36936b621b79f3392ce0ceb6ab945e0980c509510d.

**Source 2, the engine-written `.claude-plugin/types/`.** None exists in the worktree. There is no `claude-code.d.ts` and no `.claude-plugin/types` anywhere in it.

**Source 3, comparison only.**
- **2.1.288:** the file is the plugin-authoring skill's type file, whose line 1 reads "Written by Claude Code 2.1.288" (file sha256 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1). Its `SessionContextBreakdown` through `SessionContextUsage` block is lines 10173-10290 of that file, 118 lines.
- **Comparison against 2.1.291:** that block is byte-identical to the 2.1.291 embedded declarations' lines 10526-10643 (a `diff` of the two 118-line blocks printed nothing). Both blocks hash to 748ed8a57e2ddf5e1a804095fdbf7282672f0b6276f2c701b7a6ec59e0ee22b8. The `ContextBreakdownDetail` and `SessionUsageArgs.breakdown` spans are also identical.
- **2.1.289:** I also decompressed the embedded declarations from the 2.1.289 binary. They are 586,065 bytes, sha256 791464683ba02b5905d477fdb2fe9a81a5110c937bc28bae21414657d53a9894. Their breakdown block is also identical, with the same hash 748ed8a5…
- **Engine code:** not compared for 2.1.289.

## §2. The live figures

**Model.** Every main-loop assistant message in session 128d8fa3 names `claude-opus-5-5`. The user settings carry `model: "opus"`.

**The model's window: 1,000,000.** The embedded model catalog entry for `claude-opus-5-5` reads `context:{window:1e6,native_1m:!0,…},max_output_tokens:{default:128000,upper:128000}`. That is binary offset 207726591, length 608, sha256 a179a61419134513725ceb5382c3ccef9c5dda8b4b35de960db125266b84436f. `CLAUDE_CODE_DISABLE_1M_CONTEXT` is unset in my environment.

**Overrides in effect.**

| Name | Where | Value |
|---|---|---|
| `autoCompactWindow` | user settings file, top-level key; file mtime 2026-10-04T18:24:19Z | 800000 |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | my environment | unset |
| any auto-compact window key | project settings file | none |
| any auto-compact window key | local settings file | none |
| any auto-compact window key | the worktree's project settings file | none |
| `modelSettings.*.autoCompactWindow` | all three files | no entries |
| `autoCompactEnabled` | all three files | absent (default on) |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`, `CLAUDE_CODE_MAX_OUTPUT_TOKENS`, `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | my environment and every settings `env` block | unset |

I could read only my own process environment. The custodian's session environment was not readable, so the cross-check below carries that gap.

**The compaction window is 800,000.** The window source order is, in `iv`: the environment variable, then settings, then client data, then an experiment, then the model default.
- Binary offset 215513003, length 1421, sha256 44e2762d3f7d5bc188c599b46799a21806a830cbe85b6952ce75bf4e6420f281.
- The settings value gives `{window: min(1000000, 800000), configured: 800000, source: "settings"}`.
- The settings schema entry is at binary offset 207373846, length 63, sha256 6a6093c5b8e2d5770da3157e881ed4d4b11db2a8aad964a3c723c5ef9e8854be.
- The user-settings file was written 2026-10-04T18:24:19Z. That is after session 128d8fa3 began (2026-10-04T14:08:56Z) and before the first in-scope compaction (2026-10-05T00:18Z).

**The threshold is 767,000.** The breakdown computes `autoCompactThreshold` as `z4(model, configured) − vEt` when auto-compaction is on.
- `z4` is `window − min(maxOutputTokens, OEt)`. Binary offset 215514729, length 101, sha256 fe58f7c86a81eb77385d3dfedc15ede6b8a455fa59001e3ced82d6ccc296e334.
- `OEt` is 20000. Binary offset 215512056, length 14, sha256 50255d608ee424ba7c0a957379bffa009be62cb98ed71b2304504aa4a394c164.
- `vEt` is 13000. Binary offset 215510715, length 14, sha256 a6fd60e9068d3e4dbc39bff517dd6ec1bb5ab7ad3b30f497582f9a1d76ce772c.
- The assignment `Is=fs?z4(sp(n),He)-vEt:void 0` is at binary offset 216720752, length 65, sha256 d52c2283df883f3b5b05c295dc52deacefea29d3b99fea9ddb46f592448927ff.
- The model's `maxOutputTokens` is 128000 by the catalog (no override), so the `min` is 20000.
- The arithmetic is 800,000 − 20,000 − 13,000 = **767,000**.

**The threshold equals the engine's real compaction trigger.**
- The trigger is `p2(z4(...), Ire(...))`, where `p2` is `e − 13000` unless `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` is set. Binary offset 215511508, length 139, sha256 b2e88aebd0e245247260f69914d769960c7af02a6dccd7a40fb3b0c9a989776b.
- The breakdown's own threshold ignores that override. It is unset here, so the two agree.
- The compaction check and the breakdown read the same app-state `autoCompactWindow`. `kre` passes it as `configuredWindow` at binary offset 221617384, length 89, sha256 a98f0a6ecbe7d5943bc9fba049d1a6528780a8ece98d205b55d3509707348b2b. The host's `contextData` calls `kre` at offset 234324491, length 195, sha256 25507e173ebb93d45aa029205de115a95e4c34713bd00c00d9a6e8eb3628fee3.
- So `rawMaxTokens` is 800,000 and `maxTokens` is 800,000. `autocompactSource` should read `settings`. This is derived from code and settings, not read live.

**`totalTokens`.** It is `max(non-message categories, last response's input+cache-read+cache-creation) + a local estimate of messages after that response's first line`. That is binary offset 216721605, length 592, sha256 ce4bf2e970627759742d125e80414acfa1ab51dbae5f1e0229bafeabeced7072, with the estimator at offset 215505883, length 150, sha256 a77bf93d009ce89119202058fbbc1cf507e599fced472c3b16d9c6b15e0a7056. The API-usage stand-in used in §3 therefore under-reads the live `totalTokens` slightly.

**Cross-check.** The threshold, 767,000, is at or below the token count before every automatic compaction on record:

| Boundary (UTC) | Tokens before | Minus 767,000 |
|---|---|---|
| 2026-10-04T11:19:22.611Z (874d0083, before the window) | 767,403 | +403 |
| 2026-10-05T00:18:31.162Z | 771,137 | +4,137 |
| 2026-10-05T11:33:48.981Z | 770,191 | +3,191 |
| 2026-10-05T18:49:59.984Z | 769,990 | +2,990 |
| 2026-10-06T04:41:54.040Z | 775,563 | +8,563 |

A 1,000,000 window would give a threshold of 967,000, which none of these reaches. The human's optional `/context` reading was not available to me.

## §3. The fills

**Enumeration.**
- I scanned the three main-loop transcripts of this project's folder that were modified at or after 2026-10-04T11:00Z: 128d8fa3, 874d0083 and c7fb21c1. No file under `subagents/` was used.
- 128d8fa3 holds **four** automatic compactions since 11:31Z. The window draft names three. The fourth is **2026-10-05T18:49:59.984Z**, which the draft does not name.
- 874d0083's only boundary, 2026-10-04T11:19:22.611Z, is before 11:31Z. It is excluded and shown above. c7fb21c1 has none.
- **After 2026-10-06T04:41:54Z there is none.** The last line I read in 128d8fa3 is stamped 2026-10-06T05:35:16Z, and the transcript was still live.
- The API's usage stands in for the breakdown's local estimate, as disclosed. A call's usage is `input_tokens + cache_read_input_tokens + cache_creation_input_tokens` of the assistant message that carries the tool call. Tool-call times are that message's timestamp, not the engine's `Date.now()` at the hook.

**Compactions.** Window W = 800,000. Threshold T = 767,000. Today's route is tokens before over W. B1's route is `100 × tokens before / T`.

| # | Boundary (UTC) | Session | Trigger | Tokens before / after | Cycle start | Calls | Today's route | B1's route | Last call before the boundary: time; usage; B1 fill; today's fill; seconds before |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-10-05T00:18:31.162Z | 128d8fa3 | auto | 771,137 / 15,716 | session start (first call 2026-10-04T14:09:12.624Z) | 505 | 96.39, reads 96 | 100.54 | 2026-10-05T00:17:06.636Z; 768,829; 100.24; 96.10; 84.5 |
| 2 | 2026-10-05T11:33:48.981Z | 128d8fa3 | auto | 770,191 / 15,493 | boundary 1 | 413 | 96.27, reads 96 | 100.42 | 2026-10-05T11:30:42.426Z; 765,342; 99.78; 95.67; 186.6 |
| 3 | 2026-10-05T18:49:59.984Z | 128d8fa3 | auto | 769,990 / 14,235 | boundary 2 | 412 | 96.25, reads 96 | 100.39 | 2026-10-05T18:47:05.941Z; 769,816; 100.37; 96.23; 174.0 |
| 4 | 2026-10-06T04:41:54.040Z | 128d8fa3 | auto | 775,563 / 13,948 | boundary 3 | 412 | 96.95, reads 97 | 101.12 | 2026-10-06T04:39:39.119Z; 774,457; 100.97; 96.81; 134.9 |

**Band crossings.** The first main-loop tool call whose usage reaches the band's token figure. The band figures are 613,600, 651,950, 690,300 and 728,650. The ledger commit is the newest commit on main touching `state/CUT-STATE.md` at the call time, by committer time. The main reflog times of these commits equal their committer times. "Rewrote" is whether that commit changed `flushed_at` against its first parent. §2.3's rule is stale or age over 10 minutes. `stale` was false in every row.

| Cycle | Band | Call time (UTC) | Tool | Usage | Ledger commit @ commit time (UTC) | Rewrote | `flushed_at` | Age at call (s) | >10 min | Nudges by §2.3 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 80 | 2026-10-04T20:17:46.768Z | Bash | 614,505 | 1c71ebaf @ 2026-10-04T19:28:01Z | yes | 2026-10-04T19:24:14Z | 3212.8 | yes | yes |
| 1 | 85 | 2026-10-04T21:39:40.037Z | Bash | 652,136 | 7ca971f5 @ 2026-10-04T21:02:46Z | yes | 2026-10-04T20:59:48Z | 2392.0 | yes | yes |
| 1 | 90 | 2026-10-04T22:03:23.070Z | Write | 690,842 | 61f7e64b @ 2026-10-04T21:43:33Z | yes | 2026-10-04T21:41:12Z | 1331.1 | yes | yes |
| 1 | 95 | 2026-10-04T23:24:09.409Z | Bash | 729,323 | acb3d035 @ 2026-10-04T23:24:04Z | yes | 2026-10-04T23:21:22Z | 167.4 | no | no |
| 2 | 80 | 2026-10-05T10:33:40.241Z | Bash | 615,246 | c81d3032 @ 2026-10-05T10:31:26Z | yes | 2026-10-05T10:29:05Z | 275.2 | no | no |
| 2 | 85 | 2026-10-05T10:39:07.108Z | Bash | 652,055 | dca1eddd @ 2026-10-05T10:38:10Z | yes | 2026-10-05T10:35:51Z | 196.1 | no | no |
| 2 | 90 | 2026-10-05T11:01:41.775Z | Bash | 691,835 | c2d62c37 @ 2026-10-05T10:49:35Z | yes | 2026-10-05T10:48:16Z | 805.8 | yes | yes |
| 2 | 95 | 2026-10-05T11:18:27.139Z | Write | 730,457 | 61666eb2 @ 2026-10-05T11:09:20Z | yes | 2026-10-05T11:08:34Z | 593.1 | no | no |
| 3 | 80 | 2026-10-05T17:08:09.887Z | Write | 614,598 | 71e3258b @ 2026-10-05T16:06:14Z | yes | 2026-10-05T16:02:21Z | 3948.9 | yes | yes |
| 3 | 85 | 2026-10-05T17:49:02.819Z | Write | 652,906 | 087df89b @ 2026-10-05T17:45:13Z | yes | 2026-10-05T17:40:30Z | 512.8 | no | no |
| 3 | 90 | 2026-10-05T18:17:02.047Z | Bash | 691,238 | f9ae030d @ 2026-10-05T18:07:06Z | yes | 2026-10-05T18:03:08Z | 834.0 | yes | yes |
| 3 | 95 | 2026-10-05T18:23:08.788Z | Write | 731,467 | f9ae030d @ 2026-10-05T18:07:06Z | yes | 2026-10-05T18:03:08Z | 1200.8 | yes | yes |
| 4 | 80 | 2026-10-05T21:27:30.690Z | Bash | 616,215 | 499b793e @ 2026-10-05T21:25:47Z | yes | 2026-10-05T21:07:48Z | 1182.7 | yes | yes |
| 4 | 85 | 2026-10-05T21:47:21.821Z | Write | 655,470 | 1d41159b @ 2026-10-05T21:41:57Z | yes | 2026-10-05T21:36:56Z | 625.8 | yes | yes |
| 4 | 90 | 2026-10-05T21:59:10.760Z | Bash | 695,423 | aa1386f6 @ 2026-10-05T21:48:54Z | yes | 2026-10-05T21:48:46Z | 624.8 | yes | yes |
| 4 | 95 | 2026-10-05T23:21:56.219Z | Bash | 730,828 | 6b5dd5f4 @ 2026-10-05T22:11:53Z | yes | 2026-10-05T22:11:46Z | 4210.2 | yes | yes |

The full hashes of those 15 commits are in the scratch file `ledger-timeline.json`.

**Bands that would have nudged.**
- At each band's first call: cycle 1 nudges at 80, 85 and 90 (3 of 4). Cycle 2 nudges at 90 only (1 of 4). Cycle 3 nudges at 80, 90 and 95 (3 of 4). Cycle 4 nudges at all four.
- Simulating B1 across every call in each cycle (band added only on a nudge, cleared below 80) gives **4, 3, 4 and 4 lines**.

| Cycle | Simulated lines, call time (UTC), band, fill, age in seconds |
|---|---|
| 1 | 2026-10-04T20:17:46.768Z 80 (80; 3212.8). 2026-10-04T21:39:40.037Z 85 (85; 2392.0). 2026-10-04T22:03:23.070Z 90 (90; 1331.1). 2026-10-04T23:59:08.197Z 95 (96; 2266.2) |
| 2 | 2026-10-05T10:48:05.881Z 85 (87; 734.9). 2026-10-05T11:01:41.775Z 90 (90; 805.8). 2026-10-05T11:18:34.365Z 95 (95; **600.4**) |
| 3 | 2026-10-05T17:08:09.887Z 80 (80; 3948.9). 2026-10-05T17:53:43.068Z 85 (86; 793.1). 2026-10-05T18:17:02.047Z 90 (90; 834.0). 2026-10-05T18:23:08.788Z 95 (95; 1200.8) |
| 4 | 2026-10-05T21:27:30.690Z 80 (80; 1182.7). 2026-10-05T21:47:21.821Z 85 (85; **625.8**). 2026-10-05T21:59:10.760Z 90 (91; **624.8**). 2026-10-05T23:21:56.219Z 95 (95; 4210.2) |

Three simulated lines (600.4 s, 624.8 s, 625.8 s) sit within 26 seconds of the 10-minute edge. The hook's `Date.now()` differs from the message timestamp by seconds, so those three could go either way.

**What v0's N1 would have done.**
- v0's route is `percentage` (rounded, over 800,000), 10-point bands, stale only, no age clause.
- It first reads ≥ 80 at these calls, and the block was fresh by the judgment at each:

| Cycle | At 80 | At 90 |
|---|---|---|
| 1 | 2026-10-04T20:46:59.482Z, usage 636,320, ledger 3831d4a9, stale false | 2026-10-04T23:20:08.157Z, usage 718,431, ledger 09827e41, stale false |
| 2 | 2026-10-05T10:37:12.887Z, usage 636,943, c81d3032, stale false | 2026-10-05T11:16:07.299Z, usage 717,140, 61666eb2, stale false |
| 3 | 2026-10-05T17:40:01.375Z, usage 639,333, 3c802bcc, stale false | 2026-10-05T18:20:36.842Z, usage 722,952, f9ae030d, stale false |
| 4 | 2026-10-05T21:33:34.881Z, usage 638,447, 9c2f0464, stale false | 2026-10-05T23:21:17.259Z, usage 725,798, 6b5dd5f4, stale false |

- Its simulated lines: **0 in every cycle**.

**N1 text in the transcripts.** No tool result in 128d8fa3 or c7fb21c1 carries a live N1 line with a number. Every match for the sentence's phrase is a file read, a grep result, a queued-command text or the literal `Context at N%`. The one numeric match, in 874d0083, is a test description in prose. This agrees with the window draft's "no N1 text in any of them". The transcripts may not hold `context` text at all.

## §4. I1 and I4

- **I1: not fired.**
  - All three fields are declared on the summary breakdown at 2.1.291, in `SessionContextBreakdown`, under `context.breakdown`.
  - Types: `totalTokens: number`, `isAutoCompactEnabled: boolean`, `autoCompactThreshold?: number`.
  - The one caveat is that `autoCompactThreshold` is optional (absent when auto-compaction is off). §2.1 already routes an absent value to the fallback. If the custodian reads "optional" as "another type", I1 fires on that alone.
  - `percentage`'s denominator is `rawMaxTokens`, the compaction window. The summary call is local and sends no request.
- **I4: not fired.** B1's fill at the last tool call before each compaction is 100.24, 99.78, 100.37 and 100.97, all at or above 80. The fills exceed 100 because the threshold sits below the engine's hard trigger point by overshoot.

## §5. What differs from §5's P0 predictions

1. **"Today's route reads 77 to 78": it reads 96 to 97.**
   - The form's figure assumed a window near 1,000,000. The compaction window is 800,000 (user setting `autoCompactWindow`).
   - Tokens before the boundary over 800,000 are 96.39, 96.27, 96.25 and 96.95.
   - v0 N1 read ≥ 80 from about 636,000 tokens in every cycle. The Stop-hook judgment, not the fill, kept it silent: the block was fresh at all eight v0 first-call rows.
   - B1's threshold route moves the 80 line down only to 613,600 tokens.
2. **Four compactions, not three.** The fourth is 2026-10-05T18:49:59.984Z, with 769,990 tokens before it. The window draft names three.
3. **Held:** "The threshold lies at or below each compaction's token count". 767,000 is at or below 767,403, 769,990, 770,191, 771,137 and 775,563.
4. **Held:** "B1's route reads 95 or more at the last tool call before each". The readings are 99.78 to 100.97.
5. **Held, but only by the age clause:** "at least one band would have nudged before each". `stale` is false at all 16 band rows, so §2.3's staleness half never decides in these cycles. The 10-minute age clause alone carries every simulated line (4, 3, 4, 4).
6. **The compactions ran under 2.1.289.** The session transcript's `version` field reads 2.1.289 on every line of 128d8fa3. The installed build is now 2.1.291, so the custodian's live session may still run the 2.1.289 engine until it is restarted. The breakdown block's declarations are byte-identical at 2.1.288, 2.1.289 and 2.1.291. I did not compare the engine's threshold code across builds.
7. **Not observed live:** the threshold figure as the engine computes it in a session. It is derived from code and settings, and the five boundary token counts do not contradict it. E13 remains the live proof.

## §6. Files and spans read

**Binary.** The installed `claude.exe`, 253,042,848 bytes, sha256 70052a17e06561a4563597f79570e81ccc0772474c3c6ac522aa5ccc71773013. It is byte-identical to the 2.1.291 copy in the versions folder. The 2.1.289 binary in the versions folder has sha256 bcc6d9117aec30ad9414490302a25414359c871f5647e32e49b055c92bf84e0b. Every binary span above gives its byte offset, length and sha256.

**Declarations (derived, in scratch).**
- `claude-code-2.1.291.d.ts`, 600,277 bytes, sha256 55d3a5dd98072b125135fae6fdc037f781b3ed9ad007dcd3ea4d657404d0b11f.
- `claude-code-2.1.289.d.ts`, sha256 791464683ba02b5905d477fdb2fe9a81a5110c937bc28bae21414657d53a9894.
- The 2.1.288 skill file named in §1: sha256 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1.

**Transcripts.** Each is read whole and not copied.
- 128d8fa3: the first 14,438 lines are 34,990,857 bytes, sha256 69cea8c98a44d2b85b71fa54bb2dbfb4125f8baa015a03200e5855aec54c3da7. The file was live and grew by a few lines after my first read. Those lines hold no boundary.
- 874d0083: 14,467,716 bytes, sha256 375d6bcd0e4bf4e6edadb42e092828a60eb54aeccc700777f221982d8ea725cf.
- c7fb21c1: 1,357,788 bytes, sha256 5132bf82faaf8bde902f4c06a5f98a3dbd68056fa1e1e5a284c8a468707b9018.

**Ledger.** `git log main --since=2026-10-03T00:00:00Z --format='%H %ct %cI %P' -- state/CUT-STATE.md`, run read-only in the main checkout with main at 8500ebef. 173 lines, sha256 9fcaaec976c4be7b6d64d9fc7bc0d0aeede238aa06b1007cf9e657f484aecdb6 (scratch `ledger-log.txt`). Per commit I read the file's `flushed_at` at the commit and at its first parent. The parser restates `continuity.mjs`'s. The timeline is `ledger-timeline.json`, sha256 9538b055a3812b98f4259e94697ce133f7a6970d1c49948456a9ddddc98d99e4.

**Settings and environment.** The user, project and local settings files, read for the key names listed in §2 only, not hashed. My process environment, read for the names in §2.

**Form and N1 code.** The preregistration at main 8500ebef (387 lines, read whole). `tools/mods/spatial-guardian/hooks/continuity.mjs` whole and `tools/mods/spatial-guardian/hooks/register.js` lines 405-470 in the worktree, for the N1 logic I simulated. Piece A's Amendment 1 and its P0 report, for method.

**Scratch outputs** (all under `<scratchpad>/pieceB-p0/`):
- `fills-128d8fa3.json`, sha256 cba07729b23d5c1b121036644058b21c029bcf94ba00603acf1e7fc3db15d510 (regenerated; it replaces an earlier run's JSON).
- `boundaries.out`, sha256 a6aed255cf24afae97013d3a6d15a6a9d79c17af5542b68e23c9540330d3060a.
- `spans291.out`, with the span offsets and hashes.
- The scripts: `span.mjs`, `dts.mjs`, `boundaries.mjs`, `fills.mjs`, `overrides.mjs`, `overrides2.mjs`, `models.mjs`, `n1lines.mjs`, `spans291.mjs`, `spans291b.mjs`.

**Process.**
- One `ls` and `find` command I started early ran past its timeout and moved to the background. It completed by itself, and I killed nothing.
- No command contained text for a live G1 probe. No script I wrote with a heredoc contains the word that names publishing commits to a remote.
- Worktree state at the end: `git status --porcelain` is empty.
