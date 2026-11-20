*Filed by the custodian: the words worker's hand-back (claude-sonnet-5-5), 2195 bytes, sha256 2219b13ce9faf01fb417832f3c5262151498ae54680262eaeb1d02280366b9e8, below the rule, byte for byte but for 2 hold-line project values as <m>, with one final newline added. Calls Bash 11, Read 7, Write 2, Edit 6, SubagentHandback 1, one errored, by unique call ids, from 2026-11-20T12:25:08Z to 2026-11-20T12:27:43Z by its transcript. P4a's words commit 51fed8a55340c554eb03aa126e4472de49032533 (ADV-2026-11-20-15; the 1c form's Amendment 63 item 2). The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a words, worker (model observed: Sonnet 5.5; no override; no context handoff)

Commit: 51fed8a55340c554eb03aa126e4472de49032533 "docs: P4a's ruled words (ADV-2026-11-20-15): formatRefusal's exception, two App.tsx comments, the reopen suite's header and its README line". rev-parse HEAD HEAD^ printed 51fed8a5...2533 and c60327e87c8990f8fdb430fcf9b734eb1393a46e. Pre-checks: HEAD c60327e8, porcelain empty, ls-remote printed c60327e8 in full.
Push (own call, rc 0): "c60327e8..51fed8a5  cut/b2-piece-1c-p4a -> cut/b2-piece-1c-p4a". Remote head is 51fed8a5. No fetch.

Pairs check: I read the ruling and pairs.json. A script (<S>/p4aw-chk.mjs) found every `new` line of all six pairs verbatim in the two gate reports on main: 0 missing, with F-1 and D-1 in the architect's and D3, D4 and both D5 in the reviewer's. Each `old` matched once in its file, since the Edit tool found it. Indentation: D3 keeps the four blanks. No difference, no stop.

cmp rcs against the expected files: formatRefusal.ts 0, App.tsx 0, reopen.mjs 0, README.md 0.
numstat vs c60327e8: README.md 1/1; reopen.mjs 3/3; App.tsx 10/9; formatRefusal.ts 4/3. Porcelain before commit: the four files, ` M`. Porcelain after commit: empty. git show --stat: 4 files, 18 insertions, 16 deletions.

Typecheck (`npm run typecheck`, TMP/TEMP on D:/wt-data/1c-p4a, in the hold): rc 0. Last lines: "> spatial-ide-shell@0.1.0 typecheck" and "> tsc --noEmit", with no errors. The pretypecheck step ran too (viewer build, scan-dist "3 files scanned, 2 findings, all reviewed", NOTICE generated).

Hold lines, masked: "MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (...)"; "MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)". No MACHINE_WAITING or MACHINE_ERROR line, and the hold's exit was 0.

Text I think untrue: none checked against code beyond the pairs; I applied all as ruled. I did not check the D3 or F-1 claims against the code.
Not done, by scope: no tests beyond the typecheck, no e2e, no body or amendment. No stop. No background process of mine is still running (the hold released). Message file: <S>/p4aw-msg.txt.
