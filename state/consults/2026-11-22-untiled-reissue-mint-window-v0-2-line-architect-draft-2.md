*The architect's second draft of the v0.2 line owed in item 68 of `KNOWN-LIMITATIONS.md`: the first draft's two sentences cut into short ones, the answer on whether opening the file again sets the grid afresh (yes), and words for the item's comment carrying the first draft's N1, for the advisor's ruling ADV-2026-11-22-31 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-31-the-frame-fault-graded-again-moderate-uncommon-the-v0-2-line-approved-from-the-filed-draft-item-68-stands-until-then.md`) item 3; tag node:untiled-reissue-holds-earlier-look-handle-until-mint@v02-line-architect-2, dispatched at 2026-11-22T19:03:36.983Z, read only at main 1f72b1f76101fa25a359bbaa58272c1223e5ae96 in a detached read checkout. A draft, not a gate; its words are the architect's, for the advisor to approve or replace. Filed by the custodian below the rule from its hand-back, 13824 bytes, sha256 25b6885258abf9021a11cc5e9b3118c1ad9a19b4482632243a6420c1498e44e2, byte for byte, with one final newline added. Its run: Read 26, Glob 2, Grep 22, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T19:03:40Z to 2026-11-22T19:08:27Z by its transcript; 0 calls named the main checkout.*

---

Draft 2: v0.2 line for item 68
Read: C:/dev/wt/read-1122 @ 1f72b1f76101fa25a359bbaa58272c1223e5ae96
REPORT PATH: state/consults/2026-11-22-untiled-reissue-mint-window-v0-2-line-architect-draft-2.md
Reopen sets the grid afresh: yes

This is a draft, not a gate. ADV-2026-11-22-31 is the advisor's ruling, made under the human's delegation of 2026-11-13. It is not the human's words. The words below are the architect's, so they are not the human's wording either, and the advisor approves or replaces them (ADV-2026-11-22-31 item 3). Every code cite is a reading aid at 1f72b1f7. Every finding comes from reading the code. I ran nothing. Where I describe what code does, that is paraphrase. Text inside quotation marks is copied byte for byte from what I read.

## Words

Where they go: in item 68's paragraph, straight after this sentence. A Grep count gives one matching line in `KNOWN-LIMITATIONS.md` (line 530), and I read that line: the sentence occurs on it once.

```text
Until then the map can show only part of what that view holds, and the status line can say that it is showing all the features in view.
```

Put one space after that sentence, then the new text. The sentence that follows today ("This has been reached only in a test …") stays where it is, after the new text. Nothing else in item 68 changes.

```text
The grid the map's tiles are cut from is set only when a first data load ends. A change can start a new first data load before any has ended since the file was opened. If the previous load then ends before the new one does, the grid can be set at that end. It is then set from only the part of the data that has arrived since the change. It is kept until the file is opened again. The grid itself is not shown, but its cells can be smaller than they would otherwise be. Then, at a view much wider than that part of the data, the map can ask for fewer tiles than the view needs, and part of the view is left unfilled. No feature is drawn wrongly because of the grid. When part of the view is left unfilled in this way, the status line does not say that all features in view are shown. Opening the file again sets the grid afresh, when that open's first data load ends.
```

The words leave out the cells' position and the camera changes, as the ruling asks.

## Clause check

Files are under `frontends/shell/src/`, and `cas` means `residency/candidateArmSession.ts`. The labels A1 to A5 and B1 to B5 name the clauses of draft 1's two sentences. Draft 1 is filed at `state/consults/2026-11-22-untiled-reissue-mint-window-v0-2-line-architect-draft.md`, in its first code fence under Words:
- A1 "The grid the map's tiles are cut from is set only when a first data load ends;"
- A2 "if a change that starts a new first data load is made before any has ended since the file was opened,"
- A3 "and the previous load ends before the new one does,"
- A4 "that grid can be set from only the part of the data that has arrived since the change,"
- A5 "and it is kept until the file is opened again."
- B1 "The grid is not shown"
- B2 "no feature is drawn wrongly because of it,"
- B3 "but its cells can be smaller than they would otherwise be,"
- B4 "so that at a view much wider than that part of the data the map can ask for fewer tiles than the view needs, and part of the view is left unfilled;"
- B5 "the status line then does not say that all features in view are shown."

**When it happens**

- **S1, "set only when a first data load ends". Carries A1.**
  - There is one product call to `manager.establishGridFrame`, at `cas:1238`, inside `establishFrameFromExtent` (`cas:1234-1242`).
  - That function is called only from the untiled sink's `onTerminal` (`cas:1429-1430`).
  - The frame is written only at `streaming/tileViewportStreamManager.ts:470`, and only while it is null (`:469`).

- **S2, "A change can start a new first data load before any has ended since the file was opened". Carries A2.** All the triggers reach `reissueUnrestricted` through `issueQueryRef` (`App.tsx:1801`):
  - Apply and Clear, through `applyFilterWith`'s `requestViewport` (`App.tsx:1119-1126`, `:1146`);
  - a card or command-bar change, through `changeClauses` (`App.tsx:2168`);
  - Colour by, through the effect at `App.tsx:2140-2147`, which returns unless attributes were not held (`:2144`).

  "Before any has ended since the file was opened": every open builds a new session (`App.tsx:1746`) and a new manager whose frame starts null (`cas:936`; `tileViewportStreamManager.ts:360`).

- **S3, "If the previous load then ends before the new one does, the grid can be set at that end". Carries A3, with A4's "can".**
  - `reissueUnrestricted` neither cancels the earlier stream nor clears `untiledStreamHandle`. It resets `frameEstablished` (`cas:1746`) and `latestUnionedExtent` (`cas:1758`).
  - The earlier stream's terminal sets the frame unless it was self-cancelled while a frame existed (`cas:1394`, `:1429-1431`). This holds whether `wasCurrent` is true (the end comes before the new mint) or false (the end comes after it) (`cas:1358`).
  - "can": if nothing has arrived since the change, `cas:1235` returns and the new load's own terminal sets the grid.
  - If the new load ends first, its terminal sets the frame, and a later call returns at `tileViewportStreamManager.ts:469`.

**What the grid is set from**

- **S4, "set from only the part of the data that has arrived since the change". Carries A4.**
  - `latestUnionedExtent` is cleared at `cas:1758`, and the canvas's fit anchor is reset at `cas:1745` (`canvas/WorkingCanvas.tsx:1661`).
  - After that, every admitted batch sets it to the union since the reset (`cas:1150`; `WorkingCanvas.tsx:1762`, `:1814`).
  - Before the new mint, those batches are the earlier look's, because `onBatch` checks only the handle (`cas:1331`, `:1346`). After the mint they are the new look's.

**Kept until the file is opened again**

- **S5, "kept until the file is opened again". Carries A5.**
  - The frame is never rewritten once set (`tileViewportStreamManager.ts:469-470`). It is the only write I found.
  - A reissue's `clearAll` (`cas:1740`) does not touch the frame.
  - Opening the file again builds a new manager: see Opening again.

**What the user can see**

- **S6, "The grid itself is not shown, but its cells can be smaller than they would otherwise be". Carries B1 and B3.**
  - The frame is used only for cell keys, cell boxes (`canvas/tileGrid.ts:120-138`) and `establishTileGridContext` (`cas:1241`). I found no code that draws it.
  - Cell size is `baseSpan / TILE_GRID_DIMENSIONS[level]` (`tileGrid.ts:137-138`), and `baseSpan` is twice the anchor's largest side (`tileGrid.ts:120-124`).
  - The level is medium, 16 cells a side (`canvas/tileGridConstants.ts:28`, `:35`), unless the dev-only selector is set (`App.tsx:1758`).
  - "can": a part taken under an earlier, wider filter can be larger than the new look's whole union.

- **S7, "at a view much wider than that part of the data, the map can ask for fewer tiles than the view needs, and part of the view is left unfilled". Carries B4.**
  - Each plan takes at most `freeSlots + availableQueueRoom` new tiles (`tileViewportStreamManager.ts:632-634`), that is at most 3 + 512 (`tileGridConstants.ts:40`, `:54`).
  - Beyond that, it keeps the tiles nearest the view's centre and sets `coveringTruncated` (`tileViewportStreamManager.ts:635-647`).
  - A dropped cell is not tracked, so only a later plan asks for it (`tileViewportStreamManager.ts:612-623`).
  - By arithmetic, not run: the anchor spans 8 cells a side at medium. A square view therefore needs more than 515 cells once it is about 2.8 times the anchor's span, and the anchor here is the part, not the whole first look.

**What stays true**

- **S8, "No feature is drawn wrongly because of the grid". Carries B2.**
  - Each tile asks for its cell's box under the current filter, with no row limit (`tileViewportStreamManager.ts:941-955`).
  - The grid has no boundary (`tileGrid.ts:46-51`).
  - Cell size changes which tiles are asked for, not what a tile holds.
  - "because of the grid" scopes the clause. The mint window is left to the comment (see Comment).

- **S9, "When part of the view is left unfilled in this way, the status line does not say that all features in view are shown". Carries B5.**
  - The plan's truncation sets `lastCoveringTruncated` (`cas:1627`), and that makes `isFillComplete` false (`cas:689`).
  - The within-budget branch then sends the partial variant (`cas:817-824`). The over-budget branch never sends "complete" (`cas:743-773`).
  - The only "complete" dispatch is reached only when the state is settled-complete (`cas:853-865`).
  - "in this way" stands for draft 1's "then". It means the unfilled part made by the cap, and it adds no claim.

**Opening the file again**

- **S10, "Opening the file again sets the grid afresh, when that open's first data load ends". Carries no clause of draft 1.** It is the ruling's last clause, borne out under Opening again. Its "when" clause restates S1 for the new open, so the same case can recur in that open by S1 to S3.

## Opening again

Answer: yes. Traced from the open to the point where the grid is set:

1. Every successful open goes through `admitDataset`, which calls `openDataset` (`admission/admitDataset.ts:57`). The panel then calls `onReopened` or `onAdmitted` (`admission/AdmissionPanel.tsx:288-290`). A reopen runs `handleAdmitted` first (`App.tsx:1221`).
2. The kernel mints a fresh dataset handle on every open (`kernel/src/skp.rs:1144`, `DatasetHandle::mint()` in `open_under`).
3. `handleAdmitted` dispatches `resource.admitted` (`App.tsx:1198`). `admit` keys the resource on that handle (`workspace/workspaceState.ts:128-130`), so `selectAdmitted` (`App.tsx:853`; `workspaceState.ts:215-217`) returns a new `Admitted`.
4. The `[admitted]` effect (`App.tsx:1652`, dependency at `:2053`) runs again:
   - its cleanup stops the old session (`App.tsx:1844`);
   - `WorkingCanvas` is keyed on the handle and remounts (`App.tsx:2366-2367`);
   - the setup calls `startCandidateArmSession` (`App.tsx:1746`), which sets `frameEstablished = false` (`cas:327`) and builds a new manager (`cas:936`) whose `frame` starts null (`tileViewportStreamManager.ts:360`).
5. The new open's first look is `session.reissueUnrestricted(null, activeFilterRef.current)` (`App.tsx:1834`). At its terminal, `cas:1429-1430` calls `establishFrameFromExtent`, which calls `cas:1238`, which writes `tileViewportStreamManager.ts:470`.

Limit: a refused open builds nothing, so the old grid stays (`admitDataset.ts:66-71`). "Opening" in S10 means a successful open, as "opened" does in S5.

## Comment

These are words for item 68's comment, not for the item. They go inside the comment, after the following sentence. A Grep count gives one matching line in `KNOWN-LIMITATIONS.md` (line 531), and the sentence occurs on it once.

```text
For a Clear the filter recorded is none, so the earlier view's tiles are asked for unfiltered.
```

Put one space after that sentence, then the words below. The comment's text that follows today (" Not examined: what else the previous load's batches do …") stays where it is, after them. Its "what else" stays true, because the words name one thing only.

```text
By reading, not run: the item's clause that no feature is drawn wrongly because of the grid is about the grid alone, not about the moment itself. Inside the moment, the untiled sink's onBatch checks only untiledStreamHandle, which still names the previous load's stream. So batches of the previous load are still admitted after reissueUnrestricted's clear, through ingestAndMaybeEstablishFrame under INITIAL_TILE_KEY. Their rows were selected under the filter the previous load carried (issueUntiledQuery's viewportQuery call). This needs timing inside one request round trip (§1 of governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md, whose §2.2 states the same), so it is named here under governance/AUTONOMY.md §31 and not in the item.
```

Checked against the code and the form:
- `onBatch` checks only the handle (`cas:1331`).
- The handle is assigned only after both awaits (`cas:1304`, `:1309`, `:1322`), and the reissue does not clear it (`cas:1718-1786`).
- The batch is ingested under `INITIAL_TILE_KEY` with the earlier call's `filter` (`cas:1346`), and that filter is what the earlier `viewportQuery` carried (`cas:1304`).
- The form's §1 and §2.2 say what the words cite them for.

## Notes

- **N1.** Neither block is the human's wording. Under §31 the advisor approves or replaces them.
- **N2.** The words make no claim about how long the unfilled part lasts. By reading, a later plan asks for the dropped cells (`tileViewportStreamManager.ts:612-623`), and the cap applies again at a view that is still that wide. So the words do not carry over item 68's "until you pan or zoom".
- **N3.** The ruling's reach sentence (ADV-2026-11-22-31 item 1, on a reopen with a saved filter or a saved Colour by) is not in the words. Draft 1's Reopen section answered a different question, ADV-2026-11-22-27 item 4. It does not conflict with the "yes" above.
- **N4.** Draft 1's N4 is still owed when the docs-only piece lands: item 68's comment needs a clause map, by symbol, for the new sentences. The Clause check above is the material for it.
- **N5.** A finding on a code comment's cite, outside this piece. The comment at `App.tsx:729-730` cites "`kernel/src/skp.rs:731`'s `DatasetHandle::mint()`". At 1f72b1f7, `skp.rs:731` is in `prune_locked`'s doc comment, and the mint in `open_under` is at `skp.rs:1144`. The cite is stale and is not used as proof here.
- **N6.** Every shell line draft 1 cited at b1261d72 that I re-read at 1f72b1f7 holds the same code at the same line.

Model: claude-opus-5-5 (Opus 5.5).
