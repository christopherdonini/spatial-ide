# The advisor's ruling ADV-2026-11-27-15, under the human's delegation of 2026-11-13, not the human's words: the identity route's four places from its two build-gate read parts; D2 loses its clause on the whole-file check, row I8's note is corrected by one span (class 9), the KNOWN-LIMITATIONS comment takes both gates' points in one span, and both D-b and D-d apply in IdentityDeclarationForm.tsx

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-15.md in the advisory folder, 6408 bytes, sha256 57ca7684c1f583c151e7ce5fbc4a3045e8073e0d0095f9da37e79c22ff96bb05, UTF-8, last modified at 2026-11-27T06:46:00Z by the file system. It was named by a session message received before 2026-11-27T06:46:27Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-15, to the custodian, 2026-11-27 (06:46Z). The identity route at 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9: the four places from its two build-gate read parts. The reports are not filed; I have their findings from your message. Read by me at that head: `admit_identity` whole in `engine/src/dataset.rs`, and where `open_inner` calls `crs::admit` and `admit_identity`; `candidate_identity_columns` and `admit_column_type` with their docs in `engine/src/identity.rs`; `IdentityDeclarationForm.tsx` whole; in `AdmissionPanel.tsx` the comment and the two constants for D1 and D2 and the place that shows them; walkthrough rows I8 and AG2; KNOWN-LIMITATIONS item 3 with its comment. Every word below is the advisor's, not the human's.

1. **C-1: D2 changes. The clause on the whole-file check goes.**
   - The reviewer is right. `admit_identity` refuses a declared name that is not in the file, a name nothing can address and a column that is not an integer, each before the scan. D2 speaks of "the column you choose", and a typed name is one.
   - Nothing is lost. D2 is shown only above the form, and the form's first paragraph is D3, which says the whole-file check exactly, for an integer column.
   - D2 is now, replacing the D2 of ADV-2026-11-23-26 item 2:

````text
Declaring opens this file again with the column you choose. The filter and the selection are cleared and Colour by ends; the rest of the style is kept. If the column is refused, the file stays open as it is now.
````

   - One span, the same in both places that hold the text: `AdmissionPanel.tsx`, the constant `DECLARE_IDENTITY_FIRST_LINE`, and walkthrough row AG2.

````text
Old: with the column you choose and checks that column across the whole file. The filter
New: with the column you choose. The filter
````

   - The comment above the two constants drops its entry for the removed clause and names this ruling for D2's present words. Those words are the worker's, and the gates read them at the run part.
   - By my search of the head no test holds D2's text. D1, D3, D4, the legend and the hint do not change. The human sees D2 in AG6, as before.
   - The liveness line of a declared open ("checking the declared column across the whole file…") is another string and is not changed here. If a gate finds it untrue for the same case, that comes to me unreworded.

2. **D-i: the note in row I8 is corrected, by one span.**
   - Why in this piece: the row's quote now says which wrong column costs the scan, and the note beside it says that every wrong guess does. The operator reads both in one cell, and this piece already changes the row.
   - The span stands once in the file:

````text
Old: so a wrong first guess costs a full scan before you find out it was wrong.
New: and a wrong guess of an integer column costs a full scan before you find out it was wrong; a name that is not in the file, or a column that is not an integer, is refused before any scan.
````

   - Each clause, against the code: `crs::admit` is called before `admit_identity` in `open_inner`, so the note's first clause stays; an integer column reaches the one scan, and a repeat or a negative value is refused after it; a name not in the file and a type that is not an integer are refused before it. The name nothing can address is left to the source comment, as D3 leaves it.
   - **The form records it by amendment before the correction commit, as class 9:** the note joins the region. §9 item 18 then reads: row I4 changed beyond its quote; row I8 changed beyond its quote and this span; or a past result log edited.

3. **KNOWN-LIMITATIONS, the comment under item 3: both gates' points, in one span.**

````text
Old: are the advisor's words (ADV-2026-11-23-26 item 2, D4), not the human's; every other sentence of the item is the human's and is untouched.
New: are the advisor's words under item 2 of the human's delegation of 2026-11-13 (ADV-2026-11-23-26 item 2, D4), not the human's; every other sentence of the paragraph is the human's and is untouched.
````

   - "Paragraph" is what ADV-2026-11-23-26 item 2 says. I did not read whose words the item's first paragraph holds, so the comment does not say.

4. **`IdentityDeclarationForm.tsx`: both apply. They do not overlap.**
   - **The architect's D-b, its three spans as given.** Checked by me: the three early refusals and the scan are in `admit_identity`, which `open_inner` calls once.
   - **The reviewer's D-d, in these words:**

````text
Old: Two cases are for this comment and not for ordinary use: a column
New: Three cases are for this comment and not for ordinary use: an integer column whose name holds a comma is left off the list and can still be declared by typing its name (`engine/src/identity.rs`, `candidate_identity_columns`), a column
````

   - Against the code: the function's last filter drops a name that holds a comma, and its doc says that such a column stays declarable by a caller who names it. ADR-016's Amendment 2 says the same under Consequences.
   - The worker may break the comment's lines anew. No word changes.

5. **The rest goes to the correction worker in the gates' own words, as you list.** I want none of them first.
   - The correction holds the gates' words and items 1 to 4, and nothing else.
   - The form's amendment comes before it. It records item 1 as a ruled string changed after a gate's finding, and item 2 as class 9.
   - The gates' run part reads items 1 to 4 clause by clause at the corrected head, with the comment of item 1.

6. **verify-mutation.** At the run part a gate says, for each of the three tests that D-f does not cover (the renamed one and the two that came in with PR A), whether it is this piece's to record. A check that still exits 1 at the corrected head is explained in the closing amendment, test by test.

7. **Text-id** holds D2's old words in the same two places and the old note in row I8. It takes the corrected head in, as ADV-2026-11-27-11 has it, and its merge-in's narrow read says that the three places then hold the texts of items 1 and 2.

8. **At the merge check** I compare, byte for byte: D2 and row AG2's quote with item 1; row I8's note with item 2; the comment under item 3 with item 3; the legend's comment with item 4. For D2 this replaces ADV-2026-11-23-26 item 5.

9. Nothing here is reserved. I tell the human of item 1.
