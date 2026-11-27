*Filed by the custodian: the architect (Opus) for ADV-2026-11-23-09 item 10, node:operator-sitting-queue@held-enter-finding-architect-1, dispatched at 2026-11-23T10:11:16.850Z, its hand-back as it came, extracted from its transcript (8785 bytes, sha256 3f56d9d22ce270e35753e55b8bbca526bacc7fb443fdb723945616dd2500452c), with nothing masked; sent whole to the advisor at 2026-11-23T10:16:29.684Z, who ruled on it in ADV-2026-11-23-11 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-11-the-held-enter-finding-minor-uncommon-one-limitations-item-the-fix-after-the-deny-commit-step-358-one-sentence.md`). A read, not a gate: no gate-log row. Its run: Glob 1, Grep 16, Read 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5; from 2026-11-23T10:11:16.950Z to 2026-11-23T10:15:48.078Z by its transcript, the hand-back at 2026-11-23T10:15:47.790Z; 0 calls named the main checkout.*

---

Result: Yes to (a), no to (b), both by reading and not measured. A press that lands after the first applied Enter but before React renders that result puts the old draft back. That press shows the busy line while nothing is pending, and every later press is refused and names the card that is already on.

Read: C:/dev/wt/sit @ 0f47e3258d6a634cc1c174b3572c6d6228f00404
REPORT PATH: state/consults/2026-11-23-operator-sitting-queue-held-enter-finding-architect-read.md

Scope: this read answers the question in ADV-2026-11-23-09 item 10, second bullet. It is not a gate, so it gives no gate verdict. All cites are path:line at 0f47e325. Unless a sentence is marked as a quote, it is my paraphrase.

## 1. The answers

**(a) Can the bar's result be other than applied while the card and the filter are on? YES (by reading, not measured).**

**(b) Is every line the bar then shows true? NO (by reading, not measured).**

Sequence of events (paraphrase). X is `id < 1000 OR id >= 3900000`.

1. **Enters before admission.** `filter.addClause` is unavailable until the Layers row has rendered (frontends/shell/src/layout/StudioLayout.tsx:203, :220-221). Each such Enter shows the not-available note (frontends/shell/src/command/CommandBar.tsx:160). Admission clears the view's clauses and its filter (frontends/shell/src/workspace/workspaceState.ts:153-158). So a card in a try can only come from that try.
2. **Enter A, the first after the admission render.**
   - The bar resolves the draft to `filter` and calls `run`, which reaches `changeClauses` (CommandBar.tsx:185, :162; StudioLayout.tsx:244; App.tsx:2209).
   - No card is on, so the proposal goes through (frontends/shell/src/workspace/filterClauses.ts:92-95).
   - The pending flag is set (App.tsx:2165-2166) and the apply starts (App.tsx:2168).
3. **Enters while A is in flight.**
   - Each one uses the `filterPending` value of the last render (StudioLayout.tsx:349; CommandBar.tsx:83). It shows the busy line and sends nothing (CommandBar.tsx:161).
   - If it comes before that render, `changeClauses` answers `busy` instead (App.tsx:2157).
   - Each such Enter also calls `setPos(step.pos)` (CommandBar.tsx:177). `step.pos` carries that render's draft (frontends/shell/src/command/commandDraft.ts:113, :125-126). During A's flight that is the same text, so it changes nothing.
4. **A's request is issued.**
   - `applyFilter` commits, then returns `applied` (App.tsx:394-397).
   - The commit sets the filter ref and dispatches `filter.clauses.set` together (App.tsx:1066-1072; frontends/shell/src/workspace/viewTransitions.ts:121). So card X and the filter go on together.
   - `finally` clears the pending flag (App.tsx:2170-2172). The bar's continuation then sets the draft to empty and the note to null (CommandBar.tsx:163-166).
   - These are React state updates made from a promise continuation, outside any React event. Under React 18 `createRoot` (frontends/shell/package.json:63-64; frontends/shell/src/bootstrap.tsx:25), they are rendered later, in a scheduled task. This rests on my reading of React 18's batching, not measured.
5. **Enter B lands before that render.**
   - B's handler still has the last committed render's values: the draft is X and `filterPending` is true.
   - CommandBar.tsx:177 queues the old draft as a plain value, after A's clear. React applies the queued updates in order, so the draft ends as X.
   - CommandBar.tsx:161 sets the busy line. The bar's code has no other way to put a non-empty draft back without typing (CommandBar.tsx:111, :140/:176, :177, :211). So by reading, line 177 is what kept the text.
6. **The render commits.** Card X is on, the filter is on, `filterPending` is false, the draft is X, and the note is the busy line.
7. **Enter C and every later Enter.**
   - `changeClauses` reads the workspace as of that render (App.tsx:934, :2155).
   - Adding X beside the card X that is on is refused, with X as the blocker, because X is not a simple form (filterClauses.ts:87-95). The result is `shell-refused` (App.tsx:2160-2162), and one `filter.clauseNotSent` row is recorded each time (App.tsx:2161).
   - The bar keeps its text and shows `clauseBlockedLine(X)` (CommandBar.tsx:167; frontends/shell/src/filter/ClauseCards.tsx:26, :39). This matches the end state of tries 1, 2, 5 and 10 (`C:/dev/spatial-ide-local/evidence/2026-11-23-grid358/try-1-1.json`, `barFailure`).

If no Enter lands in step 5's window, the clear renders. The next Enter finds an empty draft, and the script stops on an empty bar. That fits the six series-1 tries that emptied and all of series 2, by reading.

**Why (a) is YES.** After step 7, card X and its filter are on, because A applied them. The bar keeps X and its result is C's `shell-refused`. A's `applied` never shows: the clear it set was overwritten before it rendered. The comment on `changeClauses` still holds. It says, byte-copied from App.tsx:2151: "So `applied` changes the cards and the filter together, and a refused or not-applied change changes neither." C changed neither. The contract that fails is the bar's own, at CommandBar.tsx:157, byte-copied: "an applied one clears the draft and keeps the focus; any other keeps the draft and says why". It repeats CommandBar.tsx:24. A was applied and the draft was not cleared.

**Why (b) is NO.**
- **Step 5's line is untrue when it is shown.** It is "[P6 placeholder] A filter change is still being applied." (ClauseCards.tsx:24, byte-copied). It is set after A's `finally` has already run, so nothing is pending. It stays until the next key, a draft change or a blur (CommandBar.tsx:22, :175, :213, :221). An operator who lets go of Enter right after B would be left with it. Series 1 could not have seen it: it read the note once at press 2 and once at the end (series-1-out/grid358-try.mjs:152, :174).
- **The blocked line from step 7 is literally true of the press that produced it.** Nothing was sent, card X is on, and X can only be used on its own. But next to the kept text, under the bar's contract at CommandBar.tsx:157, a kept draft with a "Not applied" line says the typed change was not applied. A did apply it. The lines are true one by one; the bar as a whole states something untrue.

**Tests.** RC-BUSY (frontends/shell/src/App.command.test.tsx:675-691) covers a second Enter while the change is pending as rendered. No test covers an Enter that lands between the outcome and the render, by reading.

**Ordinary use (paraphrase).** OS key repeat while Enter is held is ordinary use. How wide step 5's window is (from the IPC continuation that resolves A to React's scheduled render) cannot be told by reading. Series 1 hit it in 4 of 10 tries, under CDP-injected Enter at 33 ms.

## 2. The tester's inference

By reading, it matches the code on its main claim. The first Enter after the admission render put card X and the filter on together. Admission clears clauses (workspaceState.ts:153-158), so the card came from that try. The end line naming X also needs a card X on (filterClauses.ts:87-95; ClauseCards.tsx:39).

Two refinements:
- The Enters during A's flight were answered busy (CommandBar.tsx:161 or App.tsx:2157), not refused. Only the Enters after the render that followed A were refused.
- The text stayed because one Enter landed between A's outcome and that render (CommandBar.tsx:177). The inference does not say why the text stayed.

## 3. Whether a run is needed

The answers above do not need a run. A run would only turn "by reading" into "observed". If the advisor wants that, it would be series 1's timing (Enter from the open's call, every 33 ms) with the later script `C:/dev/spatial-ide-local/evidence/2026-11-23-grid358/grid358-try.mjs`, which reads the cards, with these changes:
- Read the cards after the first press that is no longer refused as unavailable, not when the open's promise resolves. Read at resolution, series 2 saw the previous try's card.
- After every press, record the bar's value, its note and its `aria-disabled`. Step 5's sign is a busy line while `aria-disabled` is not "true".
- At the end, record the cards with their switches and the Applied line, the count of `filter.clauseNotSent` rows and the `filter.apply` steps recorded. The expected values are one step, and one row per Enter after the render.
- Stop after the first try that keeps its text.

Series 1 recorded none of these. A component test that fires the Enter keydown before React's scheduled render would show the same thing deterministically, if one can be built in jsdom. Whether to build one is for the advisor.

## 4. Not my call

Any grade, and whether this touches v0.2's known limitations, are the advisor's. So is whether the timing exemption for cases inside one request round trip applies here.

Model: Opus 5.5 (claude-opus-5-5).