# The advisor's ruling ADV-2026-11-23-11, under the human's delegation of 2026-11-13, not the human's words: the held-Enter finding graded minor in kind and uncommon in reach; one known-limitations item for v0.2; the fix a small piece after node (d)'s deny commit, merged after the tag; Step 358 one sentence more

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-11.md in the advisory folder, 4679 bytes, sha256 04ed9a5de42b63200013fc9d8b1733b7350d2b6543a4c77f4fbad0738869ffdd, last modified at 2026-11-23T10:17:30Z by the file system; the advisor's message naming it received at 2026-11-23T10:17:40.317Z by the custodian's transcript (its queue record); read again at this filing (2026-11-23T10:41:30Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-11, to the custodian, 2026-11-23. The held-Enter finding: its grade, its place, and one sentence more in Step 358. Read by me: the architect's read as you sent it, as it came (8785 bytes, sha256 3f56d9d22ce270e35753e55b8bbca526bacc7fb443fdb723945616dd2500452c; not yet filed); `frontends/shell/src/command/CommandBar.tsx` lines 150 to 224 and `frontends/shell/src/filter/ClauseCards.tsx` lines 24, 26, 39 and 43 at main 0f47e325; `changeClauses` in `App.tsx`, read earlier today at aa9fff20.

1. **I accept the read.** In the bar's code, each key press sets the position from the values of the last render (`CommandBar.tsx:177`), and an applied result clears the draft from a promise continuation (`:163-166`). I read both myself. That a press between the two puts the old draft back rests on the architect's reading of how React orders those updates; it is by reading, not observed. The tester's four end states fit it.

2. **The grade: minor in kind, uncommon in reach.**
   - Kind: the filter and its card are right, and so is the map. Nothing is lost and nothing is computed wrongly. What is wrong is the bar: it keeps a text that was applied, it can say "A filter change is still being applied." with nothing pending, and a further Enter says "Not applied" of a filter that is on. The bar then contradicts the card beside it. A line the app shows that is not true is a fault here, even a small one.
   - Reach: only from the command bar, only when a second Enter lands in a short window after a filter was applied. Held Enter does that; a single press does not. The width of the window is not known.
   - The grade is mine and the human's to overturn.

3. **Not for v0.2's code.** The fix changes a file that ships, so by the human's line of 2026-11-22 it merges after the tag. Whether it goes into v0.2 after all is the human's; I tell them in the digest and ask nothing.

4. **A known limitation for v0.2: yes, one item.** It is written at the docs-only piece that carries item 68's sentences, after the sitting and before any candidate. The architect proposes the words there with a clause check, and I approve them. The item says what was seen (the tester's end state, 4 of 10 tries under injected Enter) and what is by reading. It names no rate.

5. **The fix: a small piece, prepared in idle time, merged after the tag.**
   - It comes after node (d)'s deny commit in the idle order and never ahead of sitting or release work.
   - Its class is by the standing rule of ADV-2026-11-16-06. My reading is the five-line form with the reviewer alone, as long as it stays inside the command bar. If the fix reaches `changeClauses` or the workspace's state, tell me before it is built.
   - It carries a test that fails before the fix for the stated reason and passes after: an Enter that lands after an applied result and before the next render. If no such test can be built in the component tests, that comes to me before the build goes on; a sleep or a retry is not such a test.
   - The observation run the architect describes is not made. The disk is at its floor and the test above is the better proof.

6. **Step 358, one sentence more.** The human holds Enter in row 358.2 and may meet this. A line saying that a change is still being applied could make them wait for nothing. In `state/drafts/sitting-script-2026-11-24.md`, row 358.2, this text:

```text
If you see that, note it and go on to 358.3: the log tells in any case.
```

is replaced by this text, copied by script from this file:

```text
By an architect's reading of the code, not run, this is a fault of the command bar: the filter is on all the same, and the line under the bar can also read "[P6 placeholder] A filter change is still being applied." with nothing still being applied. If you see either line with the text kept, note it and go on to 358.3: the log tells in any case.
```

   The old text occurs once in the script. Nothing else changes. It goes into the records commit that files the architect's read; send me the hash, and I check the script and the read as filed.

7. **"The timing exemption for cases inside one request round trip".** I find no ruling of mine under those words. Whatever the architect means by it, it does not settle this case: key repeat meets this window, as the tester's run shows. If a filed rule is meant, name it to me.

8. **Noted.** The Console's 13 rows at 8b8c3881: every mutation run's first failing line inside its set, run 3 passed, C: never under the floor (lowest 40987 MB). The architect's narrow attempt is next. I rule nothing on it from a summary.

9. Nothing here is reserved.
