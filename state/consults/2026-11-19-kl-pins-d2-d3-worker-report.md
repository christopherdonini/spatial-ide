*Filed by the custodian: the worker's hand-back (claude-sonnet-5-5), 2664 bytes, sha256 52ae853b7e59560701a84bfca256b3e72c8938cc3ad9c738d872c28db6ec995a, below the rule, byte for byte with one final newline added. Calls Bash 18, Read 5, Write 1, SubagentHandback 1, one errored, from 2026-11-19T15:40:28Z to 15:58:22Z by its transcript. It corrected the reviewer's D-2 and D-3 on PR 338 (ADV-2026-11-19-25 item 6) in ba3e2ed010bb924d14a544298451c88ff0f5d5dc. Its flagged departure is the custodian's error: the brief said the hash was 8 hex, where every pin in the file carries the full 64; the worker kept the file's form. It worked from the brief alone and did not read the report or the ruling the brief named.*

---

Built: untiled-reissue-holds-earlier-look-handle-until-mint, pins D-2 and D-3, worker

Base check: HEAD aca2c0e6592978853786e2d7160bc6d69ffd7ddb, porcelain empty. I did not read the reviewer's report or the ruling file; I worked from the brief only, finding each line by its text and counting each old pin by grep (448 once, 480 once, 488 once).

Old pins (all at 203ceef1beae60acbd9590060bba7bd0cb0fc2fc). My node script (scratchpad pinsd23-h.mjs) reproduced both old hashes from `git show` at that rev:
- tableSource.ts:119-126: sha256 a01339792fc150f637bcee047ac17d86efc7f6060a9696f67dcb124bf9360390 (lines 480 and 488)
- filterClauses.ts:84-108: sha256 890fd8a1650621e6d93a8b64b50c15040a9f0da5cdeedc9c0e2403d18bd3ab4d (line 448)

New pins, whole:
- L448: frontends/shell/src/workspace/filterClauses.ts:87-101 @ 203ceef1beae60acbd9590060bba7bd0cb0fc2fc sha256:eecdc47e656828bc6953d9a06969a715bbbd75a1d5fb562147caaf359b0946b3
- L480: frontends/shell/src/table/tableSource.ts:119-129 @ 203ceef1beae60acbd9590060bba7bd0cb0fc2fc sha256:7ef5360f8eae352fc8fdac6c4991ef5cfec0ec14113ff9178d7b9cb1323e2245
- L488, first: frontends/shell/src/table/tableSource.ts:119-135 @ 203ceef1beae60acbd9590060bba7bd0cb0fc2fc sha256:377aed9acbfd79b2223a4efba2dd3d81a0b88a018530579fd7ed410f5a6432b6
- L488, second, after "; ": frontends/shell/src/table/tableSource.ts:140-142 @ 203ceef1beae60acbd9590060bba7bd0cb0fc2fc sha256:e3b646455686687fd552bf44ea0347f9b5e0d4ddc6b5ef1be93e974a4c8f681e

Deviation from the brief, flagged: the brief said "<8 hex>", but every existing pin in the file carries the full 64-hex sha256. I kept the file's form and wrote full hashes, which is also what verify-cites checks.

Diff: 3 insertions, 3 deletions, 3 hunks (L448, L480, L488), all in KNOWN-LIMITATIONS.md. Each line differs only in the range and hash, plus the added second pin on L488 (path repeated in full, "; " separator). The diff is the old pin text before and the new pin text above after. The file still ends with one newline (tail bytes 3e 0a).

Checks, run in the worktree:
- `node scripts/plan/verify-cites.mjs`: rc 0
- `node scripts/plan/verify-quotes.mjs`: rc 0

Commit and push:
- Commit ba3e2ed010bb924d14a544298451c88ff0f5d5dc, signed off with `-s`, subject "docs: three KNOWN-LIMITATIONS pins narrowed to the code they name (the reviewer's D-2 and D-3)".
- Pushed head: aca2c0e6..ba3e2ed0 on cut/kl-pins (push rc 0, in its own call).
- Porcelain after the commit is empty.

Not done, no stops: nothing outside the one file, and no merge, rebase, amend, PR action or branch change. No line-ceiling issue arose.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it.
