*Filed by the custodian: the architect's design note for the Console piece (known limitation 67), the first step that ADV-2026-11-21-15 item 4 (i) names. It read the repository at 08783d07 in a detached read worktree and ran nothing. Its run: Read 22, Glob 3, Grep 23, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T14:42:53Z to 2026-11-22T14:47:39Z by its transcript; 0 calls named the main checkout; no compaction. The note below from its hand-back, 10407 bytes, sha256 879f48cf8bd0820d57ad1f3344f194f93fadf4e40b4652ce8e809a21ed611442, byte for byte. Nothing in it is ruled by its filing: by item 4 (i) it goes to the advisor before a form, and its class is set then.*

---

Design note: the Console piece, known limitation 67 @ 08783d073376
Recommendation: option (c). Keep a second ring of 256 for data requests, cancels and session-log lines, so that a load's traffic pushes out only entries of its own kind, and show both drop counts in the label.
Class: full form, both gates. The piece rewrites a stated invariant of the ring that a test pins, and ADV-2026-11-16-06 item 2 (b) says "In doubt, the piece is full."

Reviewed: detached read worktree, main @ 08783d073376686eba767d5a65bb89675bd40b38. All cites are path:line at that commit.

## 1. What happens now

The ring:
- `MAX_CONSOLE_ENTRIES = 256` (frontends/shell/src/console/recorder.ts:141).
- `push` shifts out the oldest entry and counts the drop (recorder.ts:282-288). Every kind of entry shares this one buffer (recorder.ts:195).
- The comment above the constant declares that the ring "never blocks, never grows past 256, and never silently truncates" (recorder.ts:138-139). recorder.test.ts:78-87 pins the drop.

Entries one tile adds (my reading of the code; not run):
- **Minted and ended:** one `viewport_query` request (tileViewportStreamManager.ts:955 → skp/client.ts:119 → the record at client.ts:59), and one `binding_log_session_event` from the terminal line (candidateArmSession.ts:1020 → diagnostics/log.ts:21). That makes 2.
- **Cancelled by the manager itself:** the request plus a `cancel` (tileViewportStreamManager.ts:1125 → client.ts:133). No terminal line is written for it (tileViewportStreamManager.ts:1105-1108). That makes 2.
- **Abandoned after its mint:** the request, a log line (tileViewportStreamManager.ts:300) and a `cancel` (lines 1014 and 1045). That makes 3.
- **Mint refused:** the request plus a log line (tileViewportStreamManager.ts:290). A requeued tile repeats this once (lines 998-1001).

Entries a load adds once, beside its tiles: the untiled query and its terminal line (candidateArmSession.ts:1400), the grid-frame line (1254), the view-planned line (1509), and the covering-truncated line when the plan is cut (1682). The data-plane attach is recorded once per process, not once per load (streaming/dataPlaneClient.ts:20-27).

Size of a load:
- The only filed figure is limitation 67's comment: at least 110 tile terminals per first look, on `filter-zoned.parquet` in the S9 logs, so at least 220 entries. The comment itself says that figure is not a bound.
- By reading, one plan can hold up to 3 tiles in flight and 512 queued (canvas/tileGridConstants.ts:40, 54). That is 515 tiles, or about 1,030 entries at 2 each. A single load can therefore overrun 256 on its own.
- Whether ordinary views reach that size, at the shipped `medium` level of 16 cells per axis (tileGridConstants.ts:26-35), is not measured. The measurement would be: the label's `count + dropped` before and after one first look, for named datasets and window sizes. console.mjs:241-247 already parses that label.

What the user loses, the oldest entries first:
- their recorded steps (`record_step`), GUI actions and earlier requests;
- an opened group, which closes because a group is keyed by its first entry's `seq` (ConsolePanel.tsx:96).
- The label reads `Console — N actions (D dropped)` (ConsolePanel.tsx:65-68).

## 2. The options

**(a) A larger fixed cap.**
- Code and tests: recorder.ts:141, and the mirrored constant in e2e/console.mjs:71 (its check at :734). recorder.test.ts reads the constant, so it does not change.
- Item 67: the 256 changes. "holds little more than one load" changes to a multiple nobody has measured. The bold line can still hold, because one plan can exceed any cap below about 1,030.
- Strings the app shows: none. The label format is unchanged.
- Risk: while the drawer is open, each frame copies, groups and renders every entry, with no virtualisation (recorder.ts:300-302; ConsolePanel.tsx:48-55, 62, 96). That cost grows with the cap during a load. It is unmeasured, and it bears on docs/01 derived rule "Never block the canvas" (docs/01_Principles.md:20) and on docs/08. `shift` is O(n) (recorder.ts:284). Drops stay counted. Without a measurement, no size can be claimed safe.

**(b) Collapse a load's repeated entries into one entry with a count.**
- `collapsedCountSync.ts` does not group anything. It gives the closed drawer two numbers, count and dropped, at most once per frame (collapsedCountSync.ts:50-69).
- Grouping exists today in the display only. It joins consecutive entries of the same kind and name, and never merges them into one (consoleViewModel.ts:155-157, 177-189). A load's requests and log lines interleave, so its groups are short; how short depends on the run.
- Collapsing at storage would break two invariants. I2 keeps the exact request reference (recorder.ts:12-16). I8 never synthesises an entry. Each tile's request also differs by its bbox, so the per-request text would be lost. That loss would have to be counted and shown.
- Code and tests: recorder.ts, consoleViewModel.ts, ConsolePanel.tsx and their tests, plus renderTruth.test.ts.
- Item 67 changes. The label changes (a string the app shows).
- docs/01 principle 4, "Every GUI action has an API equivalent — and shows it" (docs/01_Principles.md:10), weakens for the collapsed requests.
- Risk: high to "never silently truncates".

**(c) A separate lane for stream traffic.**
- Design: a lane chosen by name inside console/. It holds `viewport_query`, `cancel` and `binding_log_session_event`, in its own 256-entry ring with its own drop count. Every other kind keeps its own 256. The display merges the two rings by `seq`.
- Code and tests: recorder.ts (two rings, `count()` and `droppedCount()` per lane), surfaceRegistry.ts (a lane mark on the three rows), consoleViewModel.ts (the merge), ConsolePanel.tsx (the label), collapsedCountSync.ts (snapshot); their four tests; e2e/console.mjs:71, 241-247 and 734.
- Item 67 changes. Recorded steps and actions are no longer pushed out by a load. Data requests still are, including the one an Apply sends.
- Strings the app shows: the label. surfaceRegistry.ts is edited, so ADV-2026-11-21-15 item 5's comment on the registry's row goes with this piece. No ADR is touched. ADR-024's fence holds, because classification is by name only. Principle 4 is no worse than today.
- Risk: each push is still O(1) amortised and bounded, so the ring never blocks. The merge is O(n), and only when the drawer is open. The invariant "never silently truncates" holds only if the label shows both drop counts, or their sum.
- Variant (c2): the caller declares the lane, so that only the tile manager's traffic is laned. That widens `call()` at client.ts:50-59, the single capture site (I1, soleCaptureSite.test.ts), and `logSessionEvent`. It crosses the streaming, skp and console seams. I do not recommend it now.

**(d) No change.**
- Item 67's words stand and hold. No new risk. The user's loss stays as described in section 1.

**Rejected:** not recording the tile terminal line. Every binding command is recorded (log.ts:21), and the registry's completeness rule covers it.

## 3. The class

Full form, both gates.
- ADV-2026-11-16-06 item 2 (b) allows the five-line form only for "routine product code in one module" and ends "In doubt, the piece is full." Rewriting the ring's declared eviction rule (recorder.ts:133-141, pinned by recorder.test.ts:78-87) and the label is not routine.
- That ruling runs for a week from 2026-11-16 (item 0). After that, AUTONOMY §21a's "a stated guarantee or invariant … or any property currently under test" (governance/AUTONOMY.md:325-327) and §21c's bound of "no new user-visible behaviour" (AUTONOMY.md:350-351) also make it full.

Scope (11 files):
- frontends/shell/src/console/recorder.ts, surfaceRegistry.ts, consoleViewModel.ts, ConsolePanel.tsx, collapsedCountSync.ts
- the tests: recorder.test.ts, consoleViewModel.test.ts, collapsedCountSync.test.ts, surfaceRegistry.test.ts
- frontends/shell/e2e/console.mjs
- KNOWN-LIMITATIONS.md (item 67)

Merge: held by ADV-2026-11-21-15 item 1 until v0.2 is tagged or the human gives their word.

## 4. Recommendation and the words to rule

Option (c), by name. None of the texts below is the human's wording. Item 67 is the advisor's wording, according to its own comment (KNOWN-LIMITATIONS.md:527). Each clause is to be checked against the built code at the gate; there is no code yet to check it against.

**Label, a draft for the advisor (P6):** `Console — N actions (D dropped: S data requests, cancels and log lines, O others)`. Without drops it is unchanged.

**Item 67, a draft:**
- Bold line: "The Console keeps its newest 256 data requests, cancels and log lines apart from its newest 256 other entries, and one load of a view can add more than two hundred of the first kind."
- Paragraph: "Data requests, cancels and session-log lines are kept apart from every other entry, 256 of each. When one kind is full, each new entry of that kind drops that kind's oldest one, and the Console's label shows how many were dropped and how many of those were of the first kind. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and when a tile's load ends, other than by a cancel the app makes, the app writes a line to the session log; both are entries of the first kind. Panning and zooming ask for tiles in the same way. In the app-window tests one such load was at least 110 tiles, which is at least 220 entries, so the Console holds little more than one load of them. The request that an Apply or a Clear sends is of the first kind and can be dropped by a load. Recorded steps and other actions are not dropped by a load. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped."
- Comment: re-pinned by symbol to the new rings, with the 110 figure's source kept and "Not examined: how many entries a cancelled tile request adds" kept.

**Finding (documentation, for the advisor):** item 67's terminal clause now reads "other than by a cancel the app makes (after your Cancel, for example)" (KNOWN-LIMITATIONS.md:526). The text ruled in ADV-2026-11-19-08 item 6 says "other than by the app's own cancel". The comment names no ruling for the change.
