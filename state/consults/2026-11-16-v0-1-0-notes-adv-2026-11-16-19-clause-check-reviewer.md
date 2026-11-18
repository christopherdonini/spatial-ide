# The v0.1.0 notes: the reviewer's clause check of the changed sentences of the advisor's draft ADV-2026-11-16-19 against the code at the tag, read only; not a gate

*Filed by the custodian from the hand-back: 9629 bytes, sha256 dca75d5bfa7719334cd153f74d2a55105959431b768396773d3a90263c3bfcc6, claude-opus-5-5, 4 calls by its transcript since its second report. Byte for byte below the rule, except two scratch paths in its last line, written as <S>.*

---

Clause check: ADV-2026-11-16-19's changed sentences against v0.1.0, reviewer, read only

Records read at bdc72f5fc78734d90f2b1979f3cc4cdc399a6a6f; code read at tag v0.1.0, commit b391e43622056324c56d35cc33065305140a8415. All three changed texts now hold against the tag code, and item 5's new order settles the -17 finding F3-2 (the page saying main "now states" the notes).

All wording here is mine, except text in backticks or quotation marks, which is byte-copied from the cited source. The code facts come from my tag reads earlier in this session, cited by path and line at the tag. I wrote only scratch files named `cc19-l18-17.txt`, `cc19-l18-19.txt`, `cc19-l24-17.txt` and `cc19-l24-19.txt`, directly in the scratchpad.

## The diff, -17 to -19

- -19 is 3312 bytes with sha256 e5a60815a04bc44784dd296be313e26d58d66905102dced3d6838ab1a9742cac. Both match the brief. -17 still hashes to 9dbf7e72….
- `file` reports both copies as ASCII text with no CRLF.
- `diff` (rc 1) shows exactly five changed lines, and no other byte differs:
  - Line 3: the Id line.
  - Line 9: item 2's placement sentence.
  - Line 18: fence 2. I checked by script: the text before "To ask again" hashes equal in -17 and -19, and so does the text after that sentence. Only that sentence changed.
  - Line 24: fence 3. The prefix up to "not loaded; and " hashes equal, and so does the suffix from ", with nothing on screen saying that it failed.". Only the second thing changed.
  - Line 29: item 5's order sentence.
- Fence 1 is byte-identical. Fence 3's other clauses (F3-1, F3-2's wording, F3-3, F3-5, F3-6) are byte-identical. As asked, I do not grade them again.

## 1. Fence 2's new sentence: "To ask again, repeat the step: open the file again, or apply or clear the filter again."

| Clause | B2-open (the open's first look fails) | B2-filter (an Apply's or Clear's first look fails) |
|---|---|---|
| "To ask again," | PASS. Each action listed issues a fresh untiled first look. | PASS. Same. |
| "repeat the step:" | PASS. The step was the open, and opening again repeats it with the same request. | PASS. The step was the Apply or the Clear, and repeating it sends the same request. |
| "open the file again," | PASS. A fresh open, the same unfiltered request (see note a). | Not untrue under "repeat the step": the open is not the step here, so the sentence does not offer it for this case. See note c. |
| "or apply or clear the filter again." | PASS as an ask, though it is not the step repeated (see note b). | PASS (see note b). |

Notes:

**(a) Opening again.**
- A new handle is minted at `v0.1.0:kernel/src/skp.rs:338`.
- The reset sets the filter to null (`App.tsx:190`), as the first open had it.
- `WorkingCanvas` remounts (`App.tsx:1360`).
- The new session issues `reissueUnrestricted(null, activeFilterRef.current)` (`App.tsx:1069`).

**(b) Apply and Clear, in both cases.**
- On the session left with no frame after B2-open, an Apply or a Clear still reaches `issueQueryRef.current = (…) => session.reissueUnrestricted(bbox, filter)` (`App.tsx:1051`). That is a fresh first look, which can establish the frame. A Clear sends the same unfiltered request as the open.
- Apply again sends the same predicate. `FilterPanel`'s input keeps its text: `submit` does not empty it, and only `handleClearClick` does (`FilterPanel.tsx:52-60`, `:66-69`).
- The Apply button is enabled again. `busy` is reset in `finally` (`:57-58`), the button uses `disabled={busy}` (`:107`), and the issued outcome resolves before the failure terminal.
- Clear again issues even with no filter applied: `predicateTextToFilter("")` returns null (`predicateInput.ts:17-19`), and `applyFilter` always calls `deps.requestViewport(null, newFilter)` (`App.tsx:294`).

**(c) Anything left untrue for a failed filtered first look?**
- No. With "repeat the step:" ahead of the colon, the sentence offers each remedy for its own step, so reopening is no longer offered as a way to ask a filtered request again.
- One residual: a reader who picks "open the file again" after a failed Apply gets the unfiltered first look, and the filter is gone (`App.tsx:190`). The sentence does not claim otherwise.
- A pan or zoom after a filter would also ask again (the frame survives), and the sentence does not name it. That leaves the sentence incomplete, not untrue.

**Generality-word test.** "To ask again" is exactly as strong as the code: every listed action issues the first look again. It does not promise success, and the code gives none.

## 2. Fence 3's new second thing

The text: "when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, the map is left empty or cleared, with nothing on screen saying that it failed."

| Clause | Grade | Basis at the tag |
|---|---|---|
| "when the first request for data after opening a file, or after applying or clearing a filter," | PASS | Open: `App.tsx:1069`. Apply and Clear: `App.tsx:294` → `:1051` → `candidateArmSession.ts:1497-1553`. |
| "starts and then fails before any data arrives," | PASS | See note (d). |
| "the map is left empty or cleared," | PASS | See note (e). |
| "with nothing on screen saying that it failed." | PASS | See note (f). |

Notes:

**(d) What "starts" covers.**
- This is now fence 2's scope, word for word. In code, "starts" means a ticket was minted and the stream attached: `reissueUnrestricted` resolves `{ kind: "issued" }` (`candidateArmSession.ts:1332`).
- A request refused at the call never gets that far. The kernel refuses inside `viewport_query`, before any ticket (`v0.1.0:kernel/src/skp.rs:388`, then `:404`). So that case is outside the clause.
- Wording note, not a grade: the exclusion rests on the one word "starts". If a reader counts a refused request as started, the last clause would be false for it, because a refusal is shown:
  - at Apply, `FilterPanel`'s `RefusalBlock` (`FilterPanel.tsx:132-136`);
  - at open, `.canvas-refusal` (`App.tsx:1455-1468`).
- Fence 2 has carried the same word since -17, and I passed it there.

**(e) The map after the failure.**
- Open: a fresh canvas that receives no batch.
- Apply or Clear: `manager.clearAll()` (`candidateArmSession.ts:1508`) and `canvas?.clearAllTiles()` (`:1512`) run before the issue.
- One case, named for the source comment and not blocking: a batch from a previous first look that is still streaming can land between the clear and `untiledStreamHandle = stream` (`:1205`; its guard is at `:1214`). It needs timing inside one request round trip.

**(f) What is on screen.**
- No status-stack element renders (`App.tsx:1436-1496`). No banner is raised.
- What is shown says nothing about this failure: "Applied: …" (`FilterPanel.tsx:123`), `DescribeSummary`, and the Console rows.
- One edge stays: a refusal block from an earlier refused open that was never dismissed. The Apply path does not clear `viewportRefusal`. That block names the earlier request, not this one.

**Generality-word test.**
- "left empty or cleared" and "nothing on screen saying that it failed" are exactly as strong as the code, for every case the clause covers: B2-open, B2-Apply and B2-Clear.
- A request refused at the call is no longer covered, so -17's F3-4 failure is cleared.

## 3. Item 2's placement, on KNOWN-LIMITATIONS.md at bdc72f5f

- `git diff --stat 2a8907b8 bdc72f5f -- KNOWN-LIMITATIONS.md frontends/shell/src` printed nothing, so the file did not change between 2a8907b8 and bdc72f5f.
- `git show bdc72f5f:KNOWN-LIMITATIONS.md | grep -c "^Under a row filter at wide zooms"` returns 1, at line 184.
- The paragraph's text is lines 184-187. Line 187 ends `queried again. The app cannot know whether those areas are empty.` Line 188 starts the source comment, `<!-- DECISIONS-PENDING entry 87 …`, with no blank line between. So "directly after the text … and before that paragraph's source comment" names exactly one place: between line 187 and line 188.
- This matches the earlier corrections. Each sits on the line right after its item's last text line and right before that item's `<!--` comment:

| Correction | Its item's last text line | Its comment |
|---|---|---|
| line 77 | 76 | 78 |
| line 114 | 113 | 115 |
| line 133 | 132 | 134 |
| line 162 | 161 | 163 |

- One difference: those four are indented as list-item continuations (3 or 4 spaces). This paragraph sits at column 0, so note one goes at column 0. Like the earlier ones, it continues its paragraph in the Markdown (there is no blank line), so it renders the same way they do.

## 4. Item 5's order

- -19's line 29 reads: "Only after that merge the page: you put the paragraph in …".
- Yes, this settles F3-2. Once the page is changed only after the file's piece has merged, "on main now states two more things" is true when the page is posted.
- That holds as long as the order is kept and the merged notes are those two notes. The page links to main's file, so a later edit there would be a later question.

## Verdicts

- Fence 1: unchanged from -17 (byte-identical); not graded again.
- Fence 2: ALL PASS. The new sentence is true for B2-open and B2-filter.
- Fence 3: the new second thing PASSes. The other clauses are unchanged; F3-2 is settled by item 5.
- Item 5: the order settles F3-2.

Files: <S>/adv-2026-11-16-19.copy.md, <S>/adv-2026-11-16-17.copy.md, C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (at bdc72f5f).
