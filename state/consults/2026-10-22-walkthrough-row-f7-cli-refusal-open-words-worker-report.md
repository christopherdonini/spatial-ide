*Custodian's filing note (2026-10-22): #244's three yes answers (its form's Amendment 3: OPEN-1, OPEN-2 and OPEN-4 (b)), by a worker, one commit on 8fbd04cc to abc900f2 touching `frontends/shell/MANUAL-WALKTHROUGH.md` only. The run 22:34:22Z to 22:39:46Z by its transcript (Read 3, Bash 13); its claims were read against that transcript's calls before filing: one commit and one push, origin's branch equal to the head, the porcelain empty, no force push, rebase or PR action. The custodian re-checked at the head by script: each new text of the form's options (b) occurs once in the file, and §7 over `fd47e6cf...abc900f2` is 7 added and 6 removed. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is bdc59bbd36e2e9448db9b8774aa7bebfbf842ec6f385d8440cbdc7d38bb1e954.*

---

F7 OPEN words: walkthrough-row-f7-cli-refusal at abc900f2b4706669bc4abbc35024b28a451a5e86

Commit: abc900f2, signed off, subject "docs(shell): Part F's F8, intro and deviation paragraph and Part G's G7 follow F7's pointer (#244, the form's Amendment 3; OPEN-1, OPEN-2 and OPEN-4 (b))", with the two trailer lines. Pushed in its own call: origin's branch = HEAD = abc900f2, and the porcelain is empty. No PR action.

Method: one script (the scratchpad's f7w-apply.mjs) replaced each old text, asserting it occurs exactly once. Each new text was checked as a substring of the form read from main e6dfe624. The old and new texts are the brief's. OPEN-4's lines were wrapped greedily at 100 columns, and the output matched the brief's three lines exactly.

Equality checks: each old text was asserted to occur once (count 1) before replacement. The diff shows each old text gone and each new text present, in these hunks only: line 259 (intro), F8, the deviation paragraph's 2 lines becoming 3, and G7 (both spans). The F7 hunk is the earlier commit's.

Code spans the new OPEN-4 words do not carry: `renderer/bundle-viewer/dist`, `npm run build`, `renderer/bundle-viewer`. The old clause carried these three; the new words are plain text, as the form gives them.

Checks (rc of the command in the call):
- §4 item 1: `git diff -U0 fd47e6cf...HEAD` gave rc=0 with exactly five hunks (@@ -259, -274,2 (F7 and F8), -279,2, -330). No other hunk.
- §4 item 2:
  - `publish-bundle.exe --data` has 1 match at B (self-test positive) and 0 at HEAD.
  - `viewer/NOTICE.txt` has 0 matches at B and 1 at HEAD, in the F7 line (line 274). It could not be self-tested positive at B because B's F7 held the old CLI text. HEAD's single F7 hit is its positive.
  - The F7 line names `kernel/src/bin/publish-bundle.rs` (count 1).
  - The `cargo build -p spatial-kernel --bin` sentence is byte-identical at B and HEAD (md5 fa4d0c0b... on both, taken across the line break). Lines 277-278 are also identical.
- §4 item 3: with F7, F8, line 259, the 279-280 lines and G7 masked out, a diff of B against HEAD was empty (diff rc=0, 0 lines).
- §7: numstat is 7 insertions and 6 deletions = 13, within the ceiling of 14. The ceiling's own components give 14. The shortfall is the deviation paragraph: the old text was 2 lines, so it is 3 added and 2 removed, not 3+3. `git diff --name-only fd47e6cf...HEAD` lists only frontends/shell/MANUAL-WALKTHROUGH.md (rc=0).
- `node scripts/plan/verify-cites.mjs` rc=0 (PASS, 130 loose advisories, none from this file).
- `node scripts/plan/verify-quotes.mjs` rc=0 (PASS, 99 verified, 0 hash-reference errors). A second run under my own 110 s timeout was cut off (rc=124) after it had printed PASS. The rc=0 run is the one I rely on.

Scope: only that one file. I did not touch the scripts suite, so no machine hold was needed. Scratch files are all f7w- prefixed.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). I received no context handoff and produced none.
