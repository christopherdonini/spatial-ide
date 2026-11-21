*Filed by the custodian: P5's correction worker (ADV-2026-11-21-07 item 5 and ADV-2026-11-21-08 item 2), its two hand-backs (claude-sonnet-5-5), the first for 3ab6217b, 2917 bytes, sha256 610060f0ccc711b7156067894574a763730249620112dceb3b3dc610e8c80543, the second for 5560e831, sent by the custodian's message after the first, 953 bytes, sha256 331e0667ad5d823a9e11b5c29cb7f63c1e2b7eeb404efa1dca06d7d46aac29be, below the rule, each byte for byte under its own heading. Its calls in the transcript, by unique call ids: Read 5, Bash 19, Write 4, Edit 15, SubagentHandback 2; errored: 4 (Edit). The custodian's script found, at 5560e831, the 27 texts of ADV-2026-11-21-06 items 8 to 20 with the four replacements of -07 and -08 made, each pair moved, and nothing outside P5's four files.*

---

## The first hand-back, for 3ab6217b

Built: P5's correction at 3ab6217b4c4b8bdf953369dfca132462ec44ddc3
Result: items 1-3 of ADV-2026-11-21-07 applied by script and D1-D5, D7 fixed in the comments; one commit pushed, nothing run.

Start: HEAD 4f09194c (= ls-remote id), porcelain empty. Copy sha256 380eed5f2fb21f55713e6f94a60f66838c5460ba3c82e47e2b0a70fb30a7f823 (matched).
Script: <S>/p5c-apply.mjs, sha256 12b3a4cf33d9cf7d5e72cc7906352f5d2e07e18aa83fd8cfdc4bf31e9bc575e9. Printed: fences 6; before, each of 3 pairs old=1 new=0; after, each old=0 new=1; rc=0.

Comments (KNOWN-LIMITATIONS.md, each checked against code at H):
- Item 4 (D1): "The last sentence ... is" became "The last two sentences ... are", and ", item 16" became ", item 16, which rules those two sentences"; "it replaces" became "they replace".
- Item 10 (D2): "last sentence" became "last four sentences ... are", and "item 17" became "item 17, which rules those four sentences".
- Item 62 (D5): the refusal clause now says that Projects::save sets store::OPEN_LOCK whatever the lock's refusal was. Projects::open_project sets it only for LockRefused::Io; a lock held at an open is OpenFailure::OpenElsewhere. The removals clause now begins "outside the test modules". The comment also names ADV-2026-11-21-07 (item 1) for the replaced sentence, as the advisor's wording and not the human's.
- Item 69 (D7): the judge clause gives every condition. Data and folder both canonicalize and the data is inside the folder. The path has a canonical spelling (Why::NoCanonicalSpelling otherwise). The data was not reached through a link.
- Item 74 (D4): REPLACED is the control characters, the 12 direction-control characters and the line and paragraph separators, and a zero-width space or soft hyphen is not in it. The session log takes the code and message, not the fields (admitProject). The comment names ADV-2026-11-21-07 (item 3).
- Item 75 (D3): cancellable binds the queries run through it (read_file_names is the example given); in open_inner, read_kv_metadata and probe_schema are called without the token. The comment names ADV-2026-11-21-07 (item 2).
Old text of each is in the pre-change file at 4f09194c.

Numstat vs 4f09194c: 9 added, 9 removed, KNOWN-LIMITATIONS.md. Numstat vs af3cd53c (two-dot, includes main's drift): KNOWN-LIMITATIONS.md 35/7, frontends/shell/MANUAL-WALKTHROUGH.md 12/4, frontends/shell/src/console/surfaceRegistry.ts 2/2, kernel/README.md 1/1. Sum for item 8: 64 + 9 + 9 = 82 (at most 100).
Commit 3ab6217b, one file, 9 insertions and 9 deletions. Push output: "4f09194c..3ab6217b  cut/1c-p5-words -> cut/1c-p5-words", rc=0. Porcelain after: empty.

Not done / departures: none. No finding read wrong against the code. D6 and "Not blocking" untouched. The comment clauses use no line numbers and quote no ruling. The commit message file <S>/p5c-msg.txt (the sign-off was added by git).
Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness gives it.

## The second hand-back, for 5560e831

Built: P5's second correction at 5560e831b6a8711159055df73ee3b8b6b3eda3ee
Result: the one Part AD Before-paragraph clause of ADV-2026-11-21-08 item 1 was applied by script as a second commit after 3ab6217b, and pushed.
Start: HEAD 3ab6217b (= ls-remote id), porcelain empty. Copy sha256 cd55cf4d349e92db626145dda9970b69b9dba808731d09461a69e922af882ca5 (matched). The brief's sha256 39da879f... was also shown and matched.
Script: <S>/p5c2-apply.mjs, sha256 98a325085fe428aad01cb72c43416e2f71e4dad58795c0b94226c0c95b698962. Printed counts: fences 2; before old=1 new=0; after old=0 new=1; rc=0.
Numstat vs 3ab6217b: 1 added, 1 removed, frontends/shell/MANUAL-WALKTHROUGH.md. Sum: 64 + 18 + 2 = 84.
Commit 5560e831, one file. Push output: "3ab6217b..5560e831  cut/1c-p5-words -> cut/1c-p5-words", rc=0. Porcelain after: empty.
Departures: none. I added no comment and changed no other file.
Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness gives it.
