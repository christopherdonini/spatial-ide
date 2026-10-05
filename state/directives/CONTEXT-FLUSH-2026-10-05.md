# The flush before an automatic compaction — N1 measured against the compaction threshold, and a record and a resume line in the hooks (brief, 2026-10-05)

*Fable, 2026-10-05, at the human's request for advice on window item J. The custodian files this under `state/directives/` with the human's covering line. It authorises two small pieces in the governance lane: `compaction-record-and-resume-line`, then `guardian-n1-before-auto-compaction`. Repository facts were read at main f9ae030d. Type facts come from the 2.1.289 types bundled in Fable's cloud session; they are pointers, and the worker's reading on the machine is the one of record.*

## 1. What item J shows

**The count** (`state/drafts/weekly-window-2026-10-09.md`, item J). Since the Stop-hook check merged, three of four automatic compactions went through after the PreCompact hook had judged the block stale. Since N1 went live, one of one.

**The yardstick is strict.** At the PreCompact call the block was about 45 minutes old on 2026-10-03 (inferred; no block is on record), 50 seconds old on 2026-10-04 (another condition failed, and which one is not on record), and 16 minutes old on 2026-10-05 (one filing was uncommitted). No loss is recorded for any of the three.

**Still, no layer can cause a flush before an automatic compaction:**
1. **The PreCompact block.** On an automatic compaction its reason reaches nothing the model reads: neither transcript holds it, and `AUTONOMY.md` §7 already calls that path undocumented. The compaction is retried about 15 seconds later and the second-chance rule lets it through.
2. **N1 cannot fire here,** for two reasons, each enough alone:
   - **Its fill.** N1 reads `breakdown.percentage` and nudges from 80 (`tools/mods/spatial-guardian/hooks/register.js`, `contextFill` and `N1_THRESHOLD`). The automatic compactions ran at about 767k to 775k tokens, which the window draft reads as about 77% of a 1M window. P0 confirms the window figure.
   - **Its staleness judgment.** It is the Stop hook's: stale only when the newest ledger commit did not rewrite `flushed_at` (`hooks/continuity.mjs`). Uncommitted and in-session work never makes the block stale. By that rule the block was fresh at the 2026-10-05 compaction.
   - Both the 80 and the predicate come from Fable's v0 brief (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md`, the N1 row).
3. **The Stop hook** acts when a turn ends. These compactions came inside a turn.

**Two record gaps:**
- The block record holds only `lastBlockedAt`, with no reason, and each new block overwrites the last (`scripts/hooks/precompact-flush.mjs`, `decidePrecompact`).
- `AUTONOMY.md` §7 says the block is fresh within 20 minutes. The hook has used 10 since 2026-09-15 (`FLUSH_FRESHNESS_MS`).

## 2. What stays

- The settings hooks stay the only thing that can block a compaction. No mod blocks or defers one, changes what the summary is told, or writes a snapshot.
- The block is rebuilt from git and the ledger, never from the summary.
- N1 refuses nothing, reads the main loop only, and adds no `$` call.
- The Stop hook and its predicate do not change.

## 3. Piece A — `compaction-record-and-resume-line` (scripts/hooks)

- **A1, the record.** Every PreCompact call appends one JSON line to a per-session file beside the existing record: the time, the trigger, the decision (allowed fresh, allowed by second chance, blocked, or recorded only), and the freshness reason when the block was not fresh. The existing `lastBlockedAt` record keeps serving the second-chance rule. The folder is untracked.
- **A2, an automatic compaction is recorded, not blocked.** On trigger `auto` the hook judges, records and exits 0. On `manual` nothing changes: one block with the message, then the second chance. Grounds: the block cannot reach the model there, and §7's own verified note says a block on a compaction that is recovering from a context-limit error fails the request. This changes the human's 2026-09-15 word, so it is his to rule (§8, item 2).
- **A3, the resume line.** After the block, `session-resume.mjs` prints one line of machine facts: the block's age in minutes, how many commits HEAD is past the block's `tip`, and how many tracked files are modified. A fact it cannot read prints as unknown. The hook still never throws and exits 0. The reading order and the block print as today.
- **A4, `AUTONOMY.md` §7.** Its freshness figure reads 10 minutes, its design bullet states the manual-only block, and its open question on the automatic path points to this piece. The edit rides in the piece's pull request under the human's covering line.
- **Tests,** one recorded mutation each: one record line per call, with its reason; an automatic call with a stale block exits 0 and records; a manual call blocks once and then allows; the resume line's three facts; an unreadable git answer prints unknown and exits 0.
- **Unchanged:** the freshness rule itself, the second-chance window, the cloud-inert guard, the Stop hook, and every other hook.

## 4. Piece B — `guardian-n1-before-auto-compaction` (tools/mods/spatial-guardian)

It starts after `guardian-v1` has merged, because it edits the same folder.

- **B1, the fill.** When the summary breakdown carries `autoCompactThreshold` and `isAutoCompactEnabled` is true, p is 100 × `totalTokens` / `autoCompactThreshold`. Otherwise p is `breakdown.percentage`, as today, and the README says N1 may then never fire.
- **B2, the bands.** `N1_THRESHOLD` stays 80. `N1_BAND` becomes 5, so a cycle carries at most four nudges: at 80, 85, 90 and 95 percent of the threshold. With a threshold near 770k tokens that is about 616k, 655k, 693k and 732k.
- **B3, staleness for N1.** The block is stale when today's judgment says so, or when its `flushed_at` is more than `N1_MAX_AGE_MS` before the call. The value is 10 minutes, the PreCompact hook's own figure. The Stop hook's predicate is unchanged; the form says how the parity test holds the shared judgment with the age clause beside it.
- **B4, the text.** The line says percent of the auto-compaction threshold.
- **B5, unchanged.** N1 refuses nothing, skips subagent calls, shows one line per band, and `validate`'s calls line does not change.
- **P0, before any code:**
  1. The types at the machine's build: whether `autoCompactThreshold`, `isAutoCompactEnabled` and `totalTokens` are declared on the summary breakdown. If they are not, the piece stops and returns to the human with P0's figures.
  2. The live figures on this machine: the window measured, the auto-compaction threshold and its source. The form names a read that installs nothing.
  3. From the transcripts, the fill N1 would have read at each automatic compaction since 2026-10-04T11:31Z, on today's route and on B1's.
- **Tests,** one recorded mutation each, with usage answered by the test: the threshold route; the fallback route; the four bands; the age clause; a block flushed within 10 minutes gives no nudge; a subagent call gives none.
- **Live.** No forced probe, because a context cannot be filled on purpose. The first natural nudge is recorded from the transcript as a class 1 row.
- **The merge** waits for the human's typed approval, as every mod merge does.

## 5. The measure, in place of item J's count

For each automatic compaction after piece A merges, the custodian reports at each window:
- the block's age at the PreCompact call, in minutes;
- the commits past the block's `tip`, and the modified tracked files;
- the hook's reason;
- after piece B, the N1 nudges in that cycle.

## 6. Acceptance, stop, and the next step

- **Piece A is accepted** when its tests pass, and the first automatic compaction after the merge leaves a record line with a reason and a resume line in the transcript.
- **Piece B is accepted** when its tests pass, and at least one nudge precedes each of the next three automatic compactions. If one has none, it returns to the human with that cycle's figures.
- **Stop, and tell the human:** N1 nudges a subagent or twice in one band; the hook blocks an automatic compaction; the resume hook throws.
- **The next step, not built here.** After piece B is live, two automatic compactions in one window with a block older than 30 minutes send one option to the human with those records: deferring an automatic compaction while the block is stale, bounded by tokens.
- **Not in this brief:** a snapshot at compaction, any change to the summary's instructions, a mod that blocks or defers a compaction, and the auto-compact window's setting.

## 7. Order and placement

- Piece A takes the second slot when `guardian-v1` frees it, ahead of the second-slot queue. Its paths are under `scripts/hooks/` and `AUTONOMY.md`.
- Piece B follows piece A.
- Both are disjoint from `engine/`, `kernel/` and `protocol/`.

## 8. What the human's covering line settles

1. Approval to build and gate both pieces.
2. A2: the PreCompact hook no longer blocks an automatic compaction. This changes his 2026-09-15 word.
3. A4: `AUTONOMY.md` §7's text is corrected in piece A's pull request.
4. B1 to B3: N1's fill, bands and staleness change. This changes round 44, item 1 for N1.
5. Piece B's merge waits for his typed approval.
6. The placement in §7.
7. §5's measure replaces item J's count.
