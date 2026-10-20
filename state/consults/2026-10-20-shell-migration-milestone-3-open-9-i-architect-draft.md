*Custodian's filing note (2026-10-20): the architect's draft of milestone 3 PR B's KNOWN-LIMITATIONS sentences (the form's §2.10, Amendment 2 item 2, under item 2e of `state/directives/2026-10-11-direction-after-status-review.md`), read only at main d2045496 and the branch at 95bd9747e9042982b4baab42cc20330f9652fc52. The run 2026-10-20T13:36:24Z to 13:43:22Z by its transcript (Grep 26, Read 22, Glob 1; no write and no shell); its one SubagentHandback call, at 13:43:21Z. Extracted by script; one final newline added if absent; nothing else changed. Its §3 asks the custodian to confirm the numbers by script: at main 91682346 the highest item in `KNOWN-LIMITATIONS.md` is 44, and a scan of the 143 committed forms for a number from 45 to 99 on a line naming KNOWN-LIMITATIONS found only milestone 3's own 45 and 46 as item numbers; the other mentions are budgets, line counts and entry numbers. (i) and (ii)'s replacement wait on the human (the rule's item 2b).*

---

Drafted: shell-migration-milestone-3, PR B's KNOWN-LIMITATIONS sentences, OPEN-9 (i) first, at 95bd9747

Reviewed: `cut/shell-migration-milestone-3-pr-b @ 95bd9747e9042982b4baab42cc20330f9652fc52`. I read the branch working tree at C:/dev/wt/mm3b. I confirmed the head from `.git/refs/heads/cut/shell-migration-milestone-3-pr-b`. I have no Bash, so I could not check that the tree is clean. I read the form and the records at main d2045496, in the main checkout's working tree. Verdict: none. This is a draft consult, not a gate.

Quotes. Every quoted fragment below is copied from my Read output of the cited line, not by a script. I have no Bash, so no fragment carries a hash. The custodian hashes any fragment the filing keeps (round 12, item (b)). All code cites are relative to `frontends/shell`, @ 95bd9747, on the branch only.

---

## 1. OPEN-9 (i), under OPEN-3 (A) (Amendment 2, item 2)

**Whose wording:** not the human's. The architect drafts it under item 2e of the 2026-10-11 direction. The human approves or replaces it in the form.

**Draft item** (the number is in §3):

```
45. **A filter card marked as used on its own can be on only while no other card is on.**
    The Filter section marks a card when the app will not combine its condition with other cards. Whether a card is marked depends on its text alone, whether it is on or off. While a marked card is on, adding a condition or switching another card on is not applied; while any card is on, adding a marked condition or switching a marked card on is not applied either. In each case nothing is sent, the cards and the map stay as they were, and a line under the bar or under the cards says what to turn off first. Switching a card off and removing a card are not affected. To use a marked condition with others, write them all as one condition and add it once the other cards are off, or type it in the Filter section's input and Apply: an applied filter replaces every card with one card holding it.
```

**Clause check:**
1. **The title holds** as an invariant.
   - Only an accepted proposal writes the cards: `src/workspace/filterClauses.ts:84-108`, then `src/App.tsx:1958-1962`.
   - A panel Apply leaves exactly one card: `src/workspace/viewTransitions.ts:108-113`.
   - `resource.admitted` and a rebind leave none (Amendment 3, item 7).
   - So no path leaves a marked card on beside another card that is on.
2. **"marks a card when the app will not combine"** holds. The mark renders exactly when `!recognizeSimple(text)` (`src/filter/ClauseCards.tsx:73`). The refusal turns on the same test (`src/workspace/filterClauses.ts:87-90`). The limit is defined by the mark, with no list of forms (Amendment 2, item 2).
3. **"depends on its text alone"** holds. `ClauseCards.tsx:73` reads `clause.text` and not `clause.enabled`.
4. **"While a marked card is on, adding … or switching another card on is not applied"** holds.
   - For a simple candidate, `blockerOf` returns the marked card that is on.
   - For a marked candidate, it returns `on[0]` (`filterClauses.ts:87-90`).
   - Add: `:92-95`. Switching on: `:97-101`.
5. **"while any card is on, adding a marked condition or switching a marked card on is not applied"** holds. `on[0]` is any card that is on, other than the target (`filterClauses.ts:89`, `:99-100`).
6. **"nothing is sent, the cards and the map stay as they were"** holds.
   - On `refuse`, `changeClauses` returns before `applyFilterWith`. No transition, no request and no fit reset (`src/App.tsx:1954-1957`).
   - It records only the class-C row (`src/console/surfaceRegistry.ts:197-203`).
7. **"a line under the bar or under the cards says what to turn off first"** holds.
   - The line is chosen at `ClauseCards.tsx:38-39`, with its words at `:25-26`. A blocking marked card is named with "Turn it off first"; otherwise "Turn off the other cards first".
   - It is shown at the cards' foot (`ClauseCards.tsx:98-107`), or in the bar's note with the draft kept (`src/command/CommandBar.tsx:158-168`, `:225-229`).
8. **"Switching a card off and removing a card are not affected"** holds. The blocker is computed only when `request.enabled` is set (`filterClauses.ts:100`), and remove always proposes (`:105-106`).
9. **"write them all as one condition and add it once the other cards are off"** holds.
   - A text with several conditions matches none of the anchored single-condition patterns (`filterClauses.ts:50-56`), so it is marked.
   - Once it is alone it is sent byte for byte (`filterClauses.ts:35-40`), and the kernel admits or refuses it.
10. **"Apply: an applied filter replaces every card with one card holding it"** holds. See `viewTransitions.ts:108-113`. The transition runs only on an issued outcome (`src/App.tsx:388-391`), hence "applied".

**Cases item 2c sets aside.** Name these in the source comment.
- **A change made while another card or bar change is pending.** It gets the busy line, not this item's line (`App.tsx:1951`, `ClauseCards.tsx:59`, `CommandBar.tsx:161`). The pending window is one request round trip.
- **A reopen inside a pending change's round trip.** The generation guard returns `stopped`, so nothing is sent (`App.tsx:1050-1051`).
- **The instrumented build's dev-only `queryWithFilter` hook** (`App.tsx:1616-1618`). It goes through `filter.apply`, so it also leaves one card.

**P6 dependency.** The title depends on the mark's words, `CLAUSE_ADVANCED_MARK` (`ClauseCards.tsx:21`). Those words are a `[P6 placeholder]` sighted at AB11. If the sighting changes them, this item's title follows. Record that in the source comment.

**Source comment** (references only):
- Mark the item DRAFT wording for the human's sight, not the human's own wording: the form's §2.10 and Amendment 2, item 2, under item 2e.
- Name the code on the branch in words, with commit 95bd9747 and no hash, as items 36 and 38 do. The pins follow on main after the merge.
- Add the three item 2c cases above.

---

## 2. (ii), under OPEN-4 (a), and item 39's third sentence (Amendment 1, item 10)

**Whose wording:** both were approved as drafted, so both are now the human's wording. A replacement goes to the human: yes, their own words, or accepted as it stands.

### (ii)

The approved words are at `state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md:752` @ d2045496.

**Clause 1, "offers every column of the file except its geometry column": does not hold.**
- The list is capped at `FIELD_COMPLETION_MAX_OPTIONS = 200` (`src/command/commandConstants.ts:8`). The rest show as a count row (`src/command/fieldCompletion.ts:46-50`; `CommandBar.tsx:262-266`).
- Letters typed after the `@` narrow the list by containment, ignoring case.
- A column is never offered if every run of name characters in its name also appears in 200 or more columns earlier in schema order. One example: a column `id` after 200 columns whose names contain `id`.
- The trigger fires only at the start of the condition, or after whitespace or `(` (`fieldCompletion.ts:41`). So an `@` typed straight after `=` lists nothing.
- Ordinary use reaches both cases by opening a file, with no timing, dev switch or instrumented build involved, so this blocks.

**Clause 2, "in double quotes": holds.** See `fieldCompletion.ts:53` and `:56`.

**Clause 3, "A column the filter cannot use is refused by name when the condition is applied": holds.**
- The kernel's codes carry `column`: `skp.filter_unknown_column`, `skp.filter_column_not_filterable` and `skp.filter_identity_alias_ambiguous` (SKP-V0 §7.5).
- `RefusalBlock` renders the fields (`src/admission/RefusalBlock.tsx:30-32`), in the bar (`CommandBar.tsx:230-235`) and at the cards' foot (`ClauseCards.tsx:101-105`).
- A condition the shell holds back under OPEN-3 (A) is not applied, so it is outside this clause.

**Replacement, marked as such:**

```
46. **Completing a field name after @ in /filter lists at most 200 names at a time, and does not check that the filter can use them.**
    The list appears for an @ typed at the start of the condition, or after a space or an opening bracket. It holds the file's columns except its geometry column, at most 200 at a time with a line saying how many more there are; the letters, digits or underscores typed after the @ narrow it to the names that contain them, ignoring case. A name chosen from the list is put in double quotes. A column the filter cannot use is refused by name when the condition is applied.
```

**Clause check of the replacement:**
1. **The title holds.** The cap is at `commandConstants.ts:8`. `fieldOptions` drops only the geometry column and filters by the partial, with no type policy (`fieldCompletion.ts:46-50`).
2. **"at the start of the condition, or after a space or an opening bracket"** holds. The pattern `(^|[\s(])@` is anchored at the condition's start (`fieldCompletion.ts:41`; `src/command/commandDraft.ts:54`).
3. **"the file's columns except its geometry column"** holds. The source is `describe.schema` and `describe.geometry.column` (`App.tsx:1983`).
4. **"at most 200 at a time with a line saying how many more there are"** holds. See `fieldCompletion.ts:49` and `CommandBar.tsx:41`, `:262-266`.
5. **"letters, digits or underscores … narrow it to the names that contain them, ignoring case"** holds. The partial is `[\p{L}\p{N}_]*` (`fieldCompletion.ts:41`), matched by lowercase containment (`:47-48`).
6. **"put in double quotes"** holds. See `fieldCompletion.ts:53` and `:56`. Enter never completes (`CommandBar.tsx:180`).
7. **"refused by name when the condition is applied"** holds, as clause 3 above.

**Item 2c:** none. Nothing in this sentence depends on timing.

### Item 39's third sentence

- The current words are at `KNOWN-LIMITATIONS.md:389` @ d2045496.
- That line carries Amendment 9, item 4's historical pin `KNOWN-LIMITATIONS.md:389 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade`. The tree is authoritative. I did not recompute the hash.
- The approved replacement is at `state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md:753` @ d2045496.

**Clause check against the code as built:** every clause holds, so no replacement is needed.
1. **"after a file is opened"** is the human's text and is unchanged. The open re-issues through `reissueUnrestricted` (`App.tsx:1647`).
2. **"after a filter Apply or Clear"** holds. The path is `handleApplyFilter`, then `applyFilterWith`, then `applyFilter` (`App.tsx:1076-1078`, `:352-394`).
   - In the shipped candidate arm, every request goes through `reissueUnrestricted` (`App.tsx:1614`).
   - That calls `resetFitForNewGeneration` (`src/residency/candidateArmSession.ts:1658`), which clears `lastQueriedRef` (`src/canvas/WorkingCanvas.tsx:1589-1593`).
3. **"or a change to a filter card that the app sends"** holds. `changeClauses` calls the same `applyFilterWith` with only the commit changed (`App.tsx:1962`).
4. **"that the app sends"** holds. It excludes the OPEN-3 (A) refusal (`App.tsx:1954-1957`), the busy refusal (`:1951`) and the no-view case (`:1950`). None of them calls `applyFilter`, so none resets anything.
5. **"whatever its outcome"** holds.
   - The reset runs before the kernel answers (`candidateArmSession.ts:1658`).
   - The re-issue that recovers from a refusal goes through the same path (`App.tsx:371-374`).
   - A throttled not-applied change was still issued.
   - After the session has ended, `reissueUnrestricted` returns before the reset (`candidateArmSession.ts:1642`). A card change is then not sent, so this sentence claims nothing about it.
6. **"after the map fits itself … until the next pan or zoom"** is unchanged, and the resize decision is unchanged (`WorkingCanvas.tsx:2037-2041`).

**Wording note (optional, not a failure).** "a change to a filter card" covers a `/filter` add only if "change" is read as including a new card. "a change to the filter cards" says that directly. The human may keep the words as approved.

**Item 2c, for item 39's source comment:**
- A pan made inside the round trip around a card change that the app sends. This is the same gap the human accepted for an Apply or Clear in item 39's source comment.
- The baseline residency arm, reachable only through the instrumented build's `setResidencyArm` switch (item 42's source comment). There the fit is re-armed only on an issued outcome (`App.tsx:388-391`), so a refused change does not re-arm it.

---

## 3. The numbers (Amendment 3, item 10's rule)

- **At main d2045496:**
  - `KNOWN-LIMITATIONS.md` holds items 1 to 44. Items 42 and 44 sit above the "On main since v0.1.0" heading, and item 43 sits at the end of that section.
  - Among the committed forms (`**/*PREREGISTRATION*.md`), my search found no reserved KNOWN-LIMITATIONS number above 44.
  - That is a Grep, not a scripted proof of absence. The custodian confirms it by script.
- **Numbers:** (i) takes **45** and (ii) takes **46**. This is §2.10's order, OPEN-3 (A) first and then OPEN-4 (a). Item 39 keeps its number.
- **Placement:** both go at the end of the "On main since v0.1.0" section, after item 43, (i) first.
- **Re-read:** take the numbers again at the base of PR B's KNOWN-LIMITATIONS commit, and record them in a class 3 row (Amendment 3, item 10).

**Finding on the record, to fix before the merge.** Amendment 3, item 10 says a third item, for OPEN-9 (i), takes the next number after 45 and 46. That counts (i) twice.
- §2.10 names two new items, (i) and (ii).
- The re-sweep §5 that item 10 absorbed gives the OPEN-3 (A) and OPEN-4 (a) items 45 and 46. So do Amendment 5, item 4 and Amendment 9, item 7.
- PR B's class 3 row states (i) 45 and (ii) 46, and cites §2.10 and the re-sweep §5. No 47 is reserved.

Files read:
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-3-open-9-i-check.md
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md
- C:/dev/spatial-ide/state/consults/2026-10-16-shell-migration-milestone-3-re-sweep.md
- C:/dev/spatial-ide/state/directives/2026-10-11-direction-after-status-review.md
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md
- C:/dev/wt/mm3b/frontends/shell/src/workspace/filterClauses.ts
- C:/dev/wt/mm3b/frontends/shell/src/filter/ClauseCards.tsx
- C:/dev/wt/mm3b/frontends/shell/src/command/CommandBar.tsx
- C:/dev/wt/mm3b/frontends/shell/src/command/fieldCompletion.ts
- C:/dev/wt/mm3b/frontends/shell/src/command/commandConstants.ts
- C:/dev/wt/mm3b/frontends/shell/src/command/commandDraft.ts
- C:/dev/wt/mm3b/frontends/shell/src/App.tsx
- C:/dev/wt/mm3b/frontends/shell/src/workspace/viewTransitions.ts
- C:/dev/wt/mm3b/frontends/shell/src/console/surfaceRegistry.ts
- C:/dev/wt/mm3b/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/wt/mm3b/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/wt/mm3b/frontends/shell/src/admission/RefusalBlock.tsx
- C:/dev/wt/mm3b/frontends/shell/src/admission/formatRefusal.ts
- C:/dev/wt/mm3b/protocol/skp/SKP-V0.md
