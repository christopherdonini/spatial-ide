# The advisor's ruling ADV-2026-11-19-04, under the human's delegation of 2026-11-13, not the human's words: the reopen's P3a: the 1c form's Amendment 36 goes in as the architect drafted it with an item 16 that settles its packet; two parts; sub-case 2's code made to meet the human's words; ADR-036 Amendment 3's text, landing in P3a-2's pull request

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-04.md in the advisory folder, 7239 bytes, sha256 053f5f97c529931d03dc3eaa3a69d36784dc371ee9c977f6c6bb212a77368ba7, last modified at 2026-11-19T00:32:57Z by the file system; the advisor's message naming it received at 2026-11-19T00:33:06.723Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T00:38:45Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-19-04. To the custodian. Subject: the reopen's P3a: the 1c form's Amendment 36 and its packet, P-1 to P-9.

What I read. The architect's draft, whole, on main at f5584f28 (`state/consults/2026-11-18-b2-piece-1c-save-and-reopen-amendment-36-p3a-declaration-architect.md`). ADR-036's Amendment 1 item 5, its Amendment 2, and its containment and second-folder paragraphs. The two approved bodies in the 2026-10-23 draft (274 and 137 bytes, counted by script) and the human's `Piece 1c:` line that approves them. The form's §2.5 line on a missing segment and §4's K-R4. I did not read the kernel code for this ruling: what the draft says of `adopt_project`, `create` and `copy_under` is the architect's reading, and both gates check it at the head.

1. Amendment 36 goes into the form as the architect drafted it, with one addition, applied by script inside the draft's fenced block. The Old text occurs once in the draft.

Old:
````
    - Nothing else is superseded.
````
New:
````
    - Nothing else is superseded.

16. **The packet, as the advisor ruled it (ADV-2026-11-19-04).** Where an item above says "contingent", "recommended" or "if the advisor rules", this item settles it.
    - P-1: two parts, P3a-1 and P3a-2, as item 3 declares.
    - P-2: option (i). Item 5 (g) is in force: `adopt_project` does not bind an open with no record of its own to a project whose record another run left. K-O18 stands as declared. K-O19 asserts option (i)'s outcome only: the step is recorded under a record of its own and the leftover folder is unchanged.
    - P-3: ADR-036 Amendment 3 lands in P3a-2's pull request with the heading and lead-in of ADV-2026-11-19-04 item 4, its two items byte for byte.
    - P-6: option (i). `kernel/src/project/resolver.rs` does not join P3a-2, and item 4's contingent line lapses. A missing segment of a `project-relative` target is refused by name, as §2.5 and ADR-036's containment paragraph say. K-R4 stands as §4 states it.
    - P-9 (a), (b), (d) and (e): as recommended. The lock lives in `Projects`'s saved entry; K-O22's rig stands; the child pattern may be copied into `project_save.rs`; the order of item 5 (b) is class 1.
    - P-4, P-5, P-8 and P-9 (c) are P3b's. Its declaring amendment states them, under ADV-2026-11-19-04 item 6.
````

2. P-1: (i). P3a-1 may begin once Amendment 36 is on main. P3a-2 is cut from main after P3a-1 merges. P3a-2 stays one part: the draft's three reasons hold, and a part that lands an answer the form does not define is worse than a large part.

3. P-2: (i), and it is not reserved. The human's words are not changed by a byte. They say that where another run left the project's record, the session's history stays under its own record. Main's code binds the open instead, and every later step is then refused: that is a defect against words the human approved, and the code is changed to meet them. Option (ii) would reword the human's text, which I do not do. It is in the digest for the human, theirs to overturn.

4. P-3. The clause check is taken: with P-2 (i) all five clauses of item 1 hold, and item 2 holds. ADR-036 Amendment 3 is this text, exactly, built by script from the sources it names. `<date of landing>` becomes the UTC date of the commit that adds it; nothing else is filled in or reworded.

````
## Amendment 3 — piece 1c: a first save after a reopen whose project record another run left, and what a move writes to folders.json (b2-piece-1c-save-and-reopen, <date of landing>)

Appended after acceptance, from piece 1c's form (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 36). Items 1 and 2 are the human's approved words of 2026-10-23 (OPEN-S2-1 (c) and OPEN-S2-2 (a); `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line), copied byte for byte. They were drafted then as this ADR's Amendment 2, before the piece `second-open-history-before-1c-step-3` took that number. The heading and this paragraph are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-19-04). In item 1, "The same holds" refers to Amendment 1, item 5: the session's history moves to the project's record at the first save. Item 1 qualifies Amendment 2, item 2, for a project whose record another run left: an open with no record of its own is then not bound to the project, and its steps go to a record of its own (`StepRecorder::adopt_project` in `kernel/src/session_history.rs`).

1. The same holds at the first save of a session that opened the project from its folder. Where the project's record already holds a history another run left, neither history is replaced: the save writes no saved-here mark, and the session's history stays under its own record.

2. When a project has moved (§4), the folder it opened from becomes the first folder, and the folder it moved from is no longer remembered.
````

Its last sentence is true only once item 5 (g) is built, so the amendment lands in P3a-2's pull request and not before. Both gates check each clause of the lead-in against the code at the head.

5. P-6: (i). ADR-036's containment paragraph says a target that cannot be resolved is refused by name, and §2.5 says a missing segment is refused. Answering a missing file inside the folder with the re-link question would go against both. One code, naming the segment; `FolderUnresolvable` under the same code, naming the folder. The resolver is not changed, so the wire does not tell "missing" from "cannot be read". P4's string for that code says both, and comes to me.

6. For P3b's declaring amendment, which comes to me before P3b's code with the exact shapes and every string:
   (a) P-4 (a): (i), two closed members that mirror the kernel's two enums. (b): the fields named from `RefCheck` as read. (c): (i), one code with a closed detail. (d): `project_target_outside_folder` is withdrawn, with the reason stated;
   (b) P-5 (a): (ii), a variant of its own for a file that could not be read, class 1 on the pre-committed type. (b): the line number only; no rule text on the wire. (c): the first in file order, stated. (d): the amendment reads ADR-036 §8 and states the two properties from it; a change to §8 is an ADR amendment and comes to me first;
   (c) P-8: the three A1 drafts land in P3b beside its codes, as strings, in words I rule then;
   (d) P-9 (c): (i) now, named in Amendment 36 item 9 as it is; (ii), refusing a link at the lineage name for a kept member, is declared in P3b with its test.

7. P-7. The forecast is noted: kernel product 112 over and kernel tests 303 over after P3a, and the step's total at risk. Each closing records class 8 at its counts. §2.11 and §7 are not edited. When P3b's amendment is drafted, it gives the step's total as then forecast, so that I can tell the human before it is passed, not after.

8. P-9 (a), (b), (d) and (e): as recommended, as item 16 of the amendment says.

9. The correction of Amendment 34 item 3's group figures (class 3) is right by your sums and mine: 99 + 336 + 357 = 792 and 145 + 341 + 397 = 883.

10. Nothing here needs the human now.
