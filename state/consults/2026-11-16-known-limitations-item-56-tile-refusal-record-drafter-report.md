# known-limitations-item-56-tile-refusal-record: the drafter's report (the clause table, the span and line 482 as committed at 6f98980e, the released-records search, the checks)

*Filed by the custodian, 2026-11-16: the hand-back of 2026-11-16T03:52:51Z, 6551 bytes, sha256 9c6c9474fa1a30303bdd769901f780b551af4ab73b5e310c8ff68d51e8880eb3, model claude-sonnet-5-5, 32 calls in the transcript (Bash 30, Read 1, SubagentHandback 1), 2 errored; dispatched 2026-11-16T03:38:05Z, the worker on its default model, branch cut/known-limitations-item-56-tile-refusal-record; changes: none.*

---

Item 56's span is rewritten and committed (6f98980e9a9fc77b28a577a61b0852544817c4bb on cut/known-limitations-item-56-tile-refusal-record), and pushed (rc 0). One finding for the advisor: line 1276 of governance/RELEASE-0.1.md is not clean. It is not a "shown by name" claim, but the same line cites the tile retry (see the released-records search). Every check passed. KNOWN-LIMITATIONS.md is the only file changed, 2 lines. Final porcelain is empty. I ran as Sonnet 5.5 with no override and no context handoff.

**Clause table (whether each clause holds, with cites; code cites are as read at the branch head, and I cite symbols where line numbers would only restate the architect's read)**
- "refused with engine.connections_exhausted" holds: the engine pool refuses with that code (engine/src/error.rs, the Display arm; lease_for_stream in engine/src/dataset.rs).
- "A refused request is never a wrong result" holds. viewport_query in kernel/src/skp.rs (around 1485-1491) returns the error through `?` before any ticket is minted. Nothing was cut.
- "First look after an open or an Apply, the code is shown by name" holds. At open, reportViewportOutcome calls setViewportRefusal(formatRefusal(...)) (App.tsx around 1536) and the canvas strip shows the code. At an Apply, applyFilter returns refused with formatRefusal (App.tsx around 374), and FilterPanel renders RefusalBlock, which prints refusal.code.
- "For a tile it is not shown" holds. logMintRefused (tileViewportStreamManager.ts:276-284) is the only output and writes the session log. The candidate session gives App no failure callback.
- "Asks again once for a tile it was refused" holds. isRetryableRefusal tests RETRYABLE_ENGINE_CODE (:321, :331). mintAndStart's catch (:949-997) requeues once, gated by requeuedTiles, latestMembership and MAX_QUEUED_TILES.
- "If refused too, the tile is not loaded, the code is in the session log alone" holds. The second pass drops the tile (tileState.delete at :995-997). It calls neither onTerminal nor onTileSuperseded, and logMintRefused has already logged it.
- "Status bar says at most that some areas were not loaded" holds. Within budget, SETTLED_PARTIAL_WITHIN_BUDGET_TEXT reads "some areas were not loaded" (residencyStatus.ts:435). Over budget, only SETTLED_PARTIAL_SUFFIX appears (:414). Neither names a code.
- Cut or reworded: nothing. The advisor's §A text is the span verbatim.
- No Table or export clause added. The Table does show the code (TableTab.tsx:145; tableSource.ts:260; TableTab.test.tsx:172-175). The export path does not show it: formatPublishRefusal (publish/formatPublishRefusal.ts) only parses a `publish.*` prefix. I did not establish how an export shows engine.connections_exhausted, so I added neither, and line 482 says so.
- Not put in the record because the read marks it "by my reading": the architect's stale-status case after the last tile is dropped. The drop path calls no emitResidencyStatus (checked in drainQueueIfRoom and the catch), but no run confirms it.

**Span as committed (line 481, between the two anchors)**
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look after an open or an Apply, the code is shown by name. For a tile of the map it is not shown: the map asks again once for a tile it was refused, and if that request is refused too, the tile is not loaded, the code is written to the session log alone, and the status bar says at most that some areas were not loaded.
- Line 481 is unchanged before and after the span (the script replaced exactly one occurrence of the old span).

**Line 482 as committed**
- The full line is long and is in the file at `KNOWN-LIMITATIONS.md` line 482. I rewrote it in my own words, put the new text first, and kept the rest.
- The new first part says four things: the item is the human's wording except the span; the span is the advisor's wording under the delegation of 2026-11-13, from ADV-2026-11-16-05; it replaces the human's "which is shown by name" because a refused tile request does not show the code; and where the code does each thing, by symbol only (logMintRefused, RETRYABLE_ENGINE_CODE in mintAndStart, the settled sentences in residencyStatus.ts, reportViewportOutcome and formatRefusal, applyFilter and RefusalBlock, viewport_query in skp.rs).
- Kept: the whole earlier comment from "Approved in governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-BEHAVIOURS-AND-GRADED-ITEMS-PREREGISTRATION.md Amendment 2 (§A R-56 ..." to its end, byte for byte. That includes the Amendment 7 item 8 number, §2.4 (e) and Amendment 8 item 3, the pending-approval note, the where-the-code-does-this list, the Not covered paragraph, the Revised 2026-11-06 note and every @ e0a4810d pin.

**Released-records search**
- I searched KNOWN-LIMITATIONS.md above `## On main since v0.1.0` (line 225), governance/RELEASE-0.1.md, governance/RELEASE-DAY-CHECKLIST.md, the release-named files from `git ls-files` (there are no release notes beyond these) and frontends/shell/MANUAL-WALKTHROUGH.md. I looked for "shown by name", "by name" and connections_exhausted.
- None says a refused request is shown by name for this case. KNOWN-LIMITATIONS.md:191 and governance/RELEASE-0.1.md:1276 mention the tile retry or connections_exhausted only as cite pins, with no claim of showing it. Nothing in the walkthrough matches (its "refused by name" rows are about unrelated codes, e.g. P6, engine.crs_undeclared). I changed none of them.

**Checks (all exit 0)**
- verify-cites: 0. It printed 212 loose references advised, and all rooted ones resolve.
- verify-quotes: 0. It took about 9 minutes, run as `timeout 1200` in the background. Result: 156 checked, 125 verified, 30 baselined, 1 advisory, 0 errors.
- forms-layout: 0.
- profile-path-scan --staged: 0, clean. It was re-run after my staging was found empty on the first pass, and run once before the commit.
- Commit: `git diff --stat` showed KNOWN-LIMITATIONS.md alone, 2 insertions and 2 deletions. Trailers added: the two supplied lines only.
- Push: rc 0, new branch. It ran in its own call.

**Self-check (the four failure classes)**
- Interfaces: this is a document change with no cross-module code. Every code cite was read at the branch head.
- Completion claims: each rests on a cite above or a check's exit code.
- Messages: no user-facing string changed.
- Required tests: none were added or changed.

**Off-scope, not done:** the stale-status case after a dropped last tile (see above) still needs a run.