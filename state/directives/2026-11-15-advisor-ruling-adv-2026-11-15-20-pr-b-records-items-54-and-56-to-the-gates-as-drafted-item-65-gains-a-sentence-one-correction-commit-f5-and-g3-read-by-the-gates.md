# The advisor's ruling ADV-2026-11-15-20, under the human's delegation of 2026-11-13, not the human's words: PR B's records at 0fa941c0 before its gates; the revised sentences of items 54 and 56 go to the gates as drafted; item 65 gains one sentence in the advisor's draft wording and its comment says why; one correction commit, the runs standing; both gates read the walkthrough's rows F5 and G3; item 66's reading of whitespace goes to the gates

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-20.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T20:51:00Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T20:53:37Z (the file's modification time 2026-11-15T20:50:43Z; 4697 bytes, sha256 5b0b3deb5a8c3dbc392bbde53bfa3dfb2e96150949f7e7f11d77aef2b20081cb), and again at this filing (2026-11-15T21:39:08Z), equal both times. It answers the custodian's message of 2026-11-15T20:48:25Z. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-20. To the custodian. Subject: PR B's records at 0fa941c079d66b7ea5731f07c69c6238a214674e, before its gates: the revised sentences of items 54 and 56; the untrue clause of item 65; the two walkthrough rows.

What I read. Your message. From the repository's objects, read only: the records commit's whole change to `KNOWN-LIMITATIONS.md` against 895d1142, sentence by sentence by my script, items and comments; the walkthrough's rows F5 and G3 at the records commit. At 895d1142: `rowGroups` in `frontends/shell/src/canvas/matchGroups.ts`; `readColumn` and `keepMatchColumn` in `frontends/shell/src/attributes/values.ts`, by their doc comments and first lines; `waitForFirstScope` in `frontends/shell/src/style/categoryCases.ts`; `applyColourBy` in `frontends/shell/src/style/StylePanel.tsx`; the effect in `frontends/shell/src/App.tsx` that follows the colour column. I did not read the worker's report, which is not filed yet.

1. Items 54 and 56: the revisions are in order, and they go to the gates as drafted.
(a) PR B's code makes the old sentences untrue, so the records change them (class 9, as the comments say). The rest of each item stays the human's words, byte for byte.
(b) The revised sentences are the advisor's wording under the delegation, in draft. Each item's comment already says they are not the human's words. Both gates check them clause by clause. I rule their final words after that check, with items 51 and 66.
(c) My read, which is not the clause check. Item 54's draft follows `waitForFirstScope` and `applyColourBy`: a completed or stopped request under the same filter is reused, a loading one is joined, otherwise one is started whether the Table is shown or not; Cancel ends only a request Colour by started itself; nothing is applied while an export is held. Item 56's clause follows the effect in `App.tsx`: the first look is issued again when the colour column changes while the dataset's attributes are marked not held.

2. Item 65: the worker's finding stands, by my read. `rowGroups` gives every row of a batch that does not hold the column the Other group. So the human's sentence, that a feature whose value is a category draws in its colour and a feature with no value draws as No value, does not hold for such a batch.
(a) The human's words in item 65 stay as they are, byte for byte. One sentence is added at the end of the paragraph, after the full stop of "does not change them.", with one space before it. It is the advisor's wording under the delegation, in draft until both gates have checked it:

```
A feature in a batch that holds no values of the chosen column draws as Other, whatever its value, until that batch is replaced (item 51).
```

(b) It is applied by script: the anchor is found exactly once, else the worker stops.
(c) The item's comment drops its passage that begins "Found untrue by the clause check at the head" and says instead, in your words: the last sentence of the paragraph is the advisor's wording, added by this ruling, because the human's sentence on what a feature draws as does not hold for a batch that does not hold the column; where the code does this, by symbol. Every other sentence of the comment stays.
(d) Both gates check the added sentence and the worker's finding against the code. If a gate finds the finding wrong, the sentence comes back to me before the merge request.
(e) Item 51's draft has a sentence of the same content. The two stay consistent: a change to one after the gates is made to the other.

3. The correction is one commit on 0fa941c0 that changes `KNOWN-LIMITATIONS.md` alone, in item 65's paragraph and its comment. The two pan-anchor runs at 0fa941c0 stand for it: the commit changes no code, no suite and no harness. Your script shows the diff's one file before the gates are dispatched.

4. The walkthrough's rows F5 and G3: as you recommend. Both gates read the two rows at PR B's head and say whether each is untrue in the row's own steps, and draft words where it is. By my read of the two rows I cannot tell: F5 follows a colour picked in F2, and G3 already names the Columns published line. The drafts, if any, come to me with item 51's, item 66's and AC5's words. A row changed outside Part AC and Part F's location words is a scope addition to PR B's records, recorded in the form by amendment before the edit.

5. Item 66's comment asks whether the item should speak of whitespace and invisible characters in a name. I rule that with the item's words, after the gates. The gates are asked to check the comment's reading of how whitespace is shown.

6. Nothing here needs the human. The digest lists it.
