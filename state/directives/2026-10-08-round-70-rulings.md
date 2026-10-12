# Directive — question round 70: b2-piece-1a-step-record-and-dataset-reference OPEN-2, OPEN-3, OPEN-5 and OPEN-7, the red lines (the human, verbatim)

*Custodian's filing note (2026-10-08): round 70 was put to the human in the custodian's closing message, not by AskUserQuestion, so that the loop was not blocked while workers ran; its four items are red lines, ruled only in typed words. The human typed the rulings as pasted content, enqueued at 04:32:16Z by the transcript. Below the rule, byte-copied by script from the transcript (without the harness's paste markers), with nothing else, are the rulings (from line 6 to the end). They name no other project. They get a RULED block in `DECISIONS-PENDING.md`.*

---
Round 70, B2 piece 1a. My typed rulings.

OPEN-2: (A). When a project's identity opens from a second folder while the
first still exists, I am asked once: a copy, or the same project.
- A copy gets a new identity and keeps its lineage. Its data links become its
  own: re-linking the data in one never changes where the other finds its data.
- "The same project" is remembered for that folder and not asked again.
- If the first folder no longer exists, it is a move and nothing is asked.
- The question's wording is mine at P6.

OPEN-3: (A). A session that never saved keeps its history on the machine under
a not-yet-saved record, and recovery is offered when the app next starts.
- The offer names the dataset and the time. Declining clears it.
- If the data has changed or cannot be found, the app says so.
- A normal session end clears it, like any other session history.

OPEN-5: (A). spatial-kernel may take getrandom = "0.3" as a direct dependency,
the requirement spatial-skp and spatial-data-plane already carry. Cargo.lock
gains only that edge under spatial-kernel: no new package and no version
change. The PR body shows the lock diff. If it shows anything else, stop and
tell me.

OPEN-7: (A). A project file carries a project-relative locator where the data
is inside the project folder, plus machine-recorded, and never an absolute path.
- A project-relative locator never points outside the project folder. A reader
  refuses one that does.
- On another machine I re-link the file. The app checks it against the
  observation, names what differs, and never passes a difference silently.
