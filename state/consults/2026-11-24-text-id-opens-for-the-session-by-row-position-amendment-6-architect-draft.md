# Text-id: Amendment 6, the architect's draft under ADV-2026-11-24-12 item 2

*Filed by the custodian: node:text-id-opens-for-the-session-by-row-position@amendment-6-architect-draft-1. It is a draft and gives no verdict. It is not appended to the form: its open questions OQ-1 (a declared guard where item 2 asks for a red reason at the skeleton) and OQ-2 (the sentence's words when a re-link reaches a file whose own `id` serves) go to the advisor first. It ran during no build. Dispatched at 2026-11-24T04:50:39Z; its run: Read 10, Grep 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T04:50:39Z to 2026-11-24T04:55:11Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T04:55:11Z. 8678 bytes, sha256 d6f391d5e3b3a1ed72d62af115a687bf8f62c40b05f2ecc5ff10a5a9cd45fcf2, byte for byte, nothing masked, with one final newline added.*

---

Reviewed: the detached read checkout `D:/wt/read-1124e` @ 7a07ca1c331eba03812e8e609115c0c4179ac5aa. This is a draft, not a gate, so there is no verdict.

Read: the ruling `<S>/adv-24-12.md`, whole. The form, whole, from Amendment 5 back. Attempt 3's report, whole. Attempt 1's report on C2. `AdmissionPanel.tsx` lines 1-130, 195-414 and 500-585. The head of `AdmissionPanel.test.ts`. `AdmitOptions` in `admitDataset.ts`. `tsconfig.json`.

## 1. The amendment's text

````text
## Amendment 6 — 2026-11-24 — the architect's, under ADV-2026-11-24-12 item 2: (A), a retry after a question or a not-found reply does not carry the choice

1. **Authority.** The advisor's ruling ADV-2026-11-24-12 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-12-text-id-a-the-retry-does-not-carry-the-choice-one-architect-amendment-before-code-decision-1-as-drafted-ceiling-2150.md`), items 1, 2 and 4, under the human's delegation of 2026-11-13. It is not the human's words.

2. **Section 2 item 12: the choice's re-run, and a retry after a question or a not-found reply.**

   Old:

```text
    - Choosing re-runs `runAdmitPath` (`:216-292`) with `{...options, identity: undefined, setAsideFileId: true}`. A reopen keeps its `answer` and `relink`.
```

   New:

```text
    - Choosing re-runs `runAdmitPath` (`:216-292`) with `{...options, identity: undefined, setAsideFileId: true}`. A reopen keeps its `answer` and `relink`. A retry after a question or a not-found reply does not carry the choice: it carries the answer and the re-link, as today, and the retry is then refused for the file's `id` column again and the choice is offered again (ADV-2026-11-24-12 item 1).
```

3. **Section 4, the shell table: a new row S-T9, after the row S-T8 that Amendment 4 item 4 adds.**

```text
| S-T9 ((A)) | `AdmissionPanel.test.ts`: `a_retry_after_a_question_or_a_not_found_reply_does_not_carry_the_choice`. `reopenRetryOptions`, an exported pure function, builds a reopen's retry options from the run's options and the retry's answer or re-link. Its product callers are the question block's two answers and `handleRelink`, each through `reopenPath`, which runs `runAdmitPath` with the options it is given. The run's options are `{ reopen: { answer: "copy", relink: <a path> }, setAsideFileId: true }`. Over them, an answer gives exactly `{ reopen: { answer, relink: <that path> } }`, and a re-link gives exactly `{ reopen: { answer: "copy", relink } }`. Neither has `setAsideFileId`. | (guard): green at the skeleton, because at 7a07ca1c `reopenPath` builds a retry's options from the reopen alone, which is (A). Its proof is its mutation. Declared as such. | M-27: `reopenRetryOptions` spreads the run's options, so the retry carries the choice |
```

4. **The line ceiling** (ADV-2026-11-24-12 item 4). The line ceiling is restated to 2,150, before code. The file ceiling stays 84. Section 7's line is not edited; an overrun at the head is class 8.

Read the last amendment first.

Nothing above is edited.
````

Notes on the block:
- **The Old.** The Old is the one bullet of item 12 where the sentence goes. That bullet is line 125 of `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md` at 7a07ca1c, and it appears once in the form. Item 12 as it reads now is not one block of text in the form: Amendment 3 item 2 holds C2's bullet by reference in row 889's report, at line 141 of that report. So an Old of the whole item would not be found once in the form. If you want the whole item anyway, say so and I will build it from those two sources.
- **The ruling's words.** The New sentence joins item 1's three sentences into one, in its words. It is a paraphrase, not marked as a quote.
- **Ids and Scope.** The ids S-T9 and M-27 and the name `reopenRetryOptions` are not used anywhere in the form. The test file is in the Scope: `AdmissionPanel.test.ts` and `AdmissionPanel.tsx` are in §7's shell Scope, at line 269 of the form at 7a07ca1c. The file count stays 84.
- **The directive must be tracked first.** The directive path the authority line cites is not on main yet. It has to be committed before or with this amendment ("nothing tracked may cite an untracked file as Authority", round 14).

## 2. The check: the test does not fail at the skeleton

The row's test cannot fail at the skeleton. The behaviour it pins, (A), is how the code works today, so the row says it is a guard.

**Today the retry does not carry the choice:**
- `frontends/shell/src/admission/AdmissionPanel.tsx`, line 364 at 7a07ca1c: `reopenPath` takes only `reopen: { answer, relink }`.
- `frontends/shell/src/admission/AdmissionPanel.tsx`, line 365 at 7a07ca1c: it runs `runAdmitPath(folder, { reopen }, {`. Nothing else from the run's options goes in.
- `frontends/shell/src/admission/AdmissionPanel.tsx`, line 242 at 7a07ca1c: the question and not-found states keep the run's options.
- `frontends/shell/src/admission/AdmissionPanel.tsx`, lines 523 and 526 at 7a07ca1c: the question's two answers send a new answer plus `state.options.reopen?.relink`, and nothing else.
- `frontends/shell/src/admission/AdmissionPanel.tsx`, line 539 at 7a07ca1c: the re-link button calls `handleRelink(state.folder, state.options)`.
- `frontends/shell/src/admission/AdmissionPanel.tsx`, line 397 at 7a07ca1c: `handleRelink` sends `options.reopen?.answer` plus the picked file, and nothing else.

**So the test is green at the skeleton.** The form's skeleton forwards new entry points to today's behaviour (form lines 157-162 at 7a07ca1c). At the skeleton, `reopenRetryOptions` therefore returns `{ reopen: {...} }` alone, and the exact-shape assertions pass. I found no honest skeleton under which the test fails. The form already has a pattern for this case: N-9, a guard declared as such (form line 176 at 7a07ca1c), and the row uses it.

**The mutation does fail it.** M-27 spreads the run's options, as `{ ...options, reopen }`. The result then holds `setAsideFileId: true`, so both exact-shape assertions fail. So the mutation is the test's proof.

**The choice is offered again.** The retry's options have no `setAsideFileId`. The reopen offer's condition requires that it be unset (form lines 123-124 at 7a07ca1c), so if the retry is refused for `id`, the choice shows again.

**`noUnusedParameters` is met.** `frontends/shell/tsconfig.json`, line 16 at 7a07ca1c, turns it on. `reopenRetryOptions` reads the run's answer and re-link from its options argument, so that argument is used.

**The design, my reading of the code (a paraphrase):**
- `reopenPath` takes a retry's options instead of `reopen`.
- The first call, at line 388, passes `{ reopen: { answer: null, relink: null } }`.
- The calls at lines 523, 526 and 397 pass `reopenRetryOptions(...)`.
- No doc comment in the file becomes untrue: those at lines 108-109, 211-214 and 333-334 still hold.

## 3. The line estimate

The ruling's figure assumes about +10 lines for (A). This design costs about **+25 to +35** changed lines (insertions plus deletions):
- `reopenRetryOptions` with a one-line doc: ~4-6.
- Six changed lines (364, 365, 388, 397, 523, 526): ~12.
- The test plus one import line: ~10-15.

On attempt 3's ~2,085-2,096, the piece comes to **~2,110 to ~2,131**. That is about 15-25 lines above the ruling's ~2,095-2,106 and about 19 lines under the 2,150 ceiling at the top. For that reason, item 4 of the block does not carry the ruling's estimate sentence.

## Open questions (the advisor's; I decide none)

- **OQ-1, the red reason.** Item 2 of the ruling asks for "its red reason at the skeleton". (A) is the code as it stands, so no honest skeleton makes the test fail, and the row declares a guard in N-9's form. Does a declared guard meet item 2?
- **OQ-2, a gap in the sentence that ordinary use can reach.** The sentence says the retry "is then refused for the file's `id` column again". That is false if the user re-links to a different file whose own `id` serves: the retry then opens. Words that hold in every case, if the advisor wants them: "...it carries the answer and the re-link, as today, and if the retry is refused for the file's `id` column again, the choice is offered again." The block keeps the ruling's words.
- **OQ-3, the estimate.** It is above the ruling's figure, for the reason in section 3. It is still under 2,150, so no ruling is needed on it. Whether the form should state my estimate is open.
- **Note, the base.** I read main, as the brief directs. The form's §8 base is the identity route's head, which I did not read. The worker re-reads `reopenPath` and the two blocks at the base before code, and a difference there is a stop.

Model: claude-opus-5-5
