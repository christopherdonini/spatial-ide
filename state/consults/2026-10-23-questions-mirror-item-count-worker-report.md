*Custodian's filing note (2026-10-23): `questions-mirror-item-count` built by a worker on `cut/questions-mirror-item-count` from B c7e94a85 (the form's commit). The run 08:38:05Z to 08:48:51Z by its transcript (Read 3, Bash 18, Edit 3, Write 4); its claims were read against that transcript's calls before filing: two commits and two pushes, origin's branch equal to the head, the porcelain empty, no force push or rebase; its edits only on `scripts/hooks/questions-mirror.mjs` and its scratch scripts under `qmic-` names (the test file written by one of them); each mutation reverted by a `git checkout` of the product file inside its script; no network call, and I2's environment holds the dry-run switch and no token or chat id. I1's outputs differ from B to the head on 55 rounds and I2's on 13, as §3 predicts; the four outputs are in `state/consults/2026-10-23-questions-mirror-item-count-i1-i2-runs.md`. **Held:** by the human's weekend ruling, item 3, the PR and both gates wait until `verify-cites-pin-resolution-and-line-zero` has merged, unless the human lets the two run side by side. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 3676d517ad90626270a256c8435a23d7234abf669b2ff295b33b926d30f1ffce.*

---

Built: questions-mirror-item-count at 0f93c12264879535ac40de1d87f0139bc927fbf5 (pushed; origin/cut/questions-mirror-item-count = HEAD, `git status --porcelain` empty). No invalidator met (I1-I4 none). No PR action.

Commits (both signed off, both pushed one per Bash call)
- f5570106 feat(hooks): questions-mirror-item-count, form sections 2.1 to 2.3 and 4: ...
- 0f93c122 test(hooks): questions-mirror-item-count, form section 4: the RECORDED MUTATION comments for M15 to M21, each observed by hand at f5570106

Diffs
- scripts/hooks/questions-mirror.mjs: countItems is now a sequence scan (`/\r?\n/` split, paragraph-opening `^(\d+)\. ` equal to `expected`, count = expected-1). Its doc comment states the two §1 limits (hand-written non-`<n>. ` files count 0; a question's own next-number paragraph counts one high). buildSummary is n=0 "— full text attached…", n=1 "1 item;", n>=2 "n items;". RED_LINE is `/^(?:[^.—\n]*?(?:\. | — ))?RED LINE/`. No new export.
- scripts/hooks/questions-mirror.test.mjs: doc-path expected text (n=0 form), multipart input `1. one\n\n---\n\n2. two`, T13 asserts lines[0] equal to the dry-run line with `Question round 8 — 1 item; …`, new T14 `the_document_summary_counts_numbered_items_not_rules` (a: committed round-52 → 4 items; b: nested → 3; c: CRLF → 4), new T15 `the_header_lists_a_red_line_item_whose_marker_follows_its_label` (rounds 52 → `1, 3`, 59 → `1, 2, 4`, negative → none), plus the 7 RECORDED MUTATION comments (second commit).
- Cross-module reading: rulingSet.mjs QUESTION_FILE_ITEM_RE (`/^(\d+)\. /`) read for the agreement point; the dry-run line read from telegram.mjs:45-47. Caller grep: countItems/buildSummary/RED_LINE all have product callers in mirrorRound/renderRound (unchanged internal calls); T13 and T15 start from the real hook.

Tests: questions-mirror.test.mjs 19 pass / 0 fail. Scripts suite (in my own project's shared hold) 545 tests, 545 pass, 0 fail, rc=0 (guardian parity did not misread). verify-cites, verify-quotes, verify-test-claims, verify:plan: each rc=0, each PASS on its last line (cites: 2241 files resolve; quotes: 131 checked, 0 errors; test-claims: 624 claimed tests exist; plan agrees).

Mutations (hand-applied alone, test file run, reverted by `git checkout`, porcelain `[]` after each; no verify-mutation used; observed at f5570106)
- M15 (rules plus one): the_document_summary_counts_numbered_items_not_rules fails at assert.equal(buildSummary(file, text), four): actual 'Question round 52 — 5 items; …'. (Also fails the doc-path test and T13.)
- M16 (sequence check dropped): same test fails on the nested text: '5 items' vs expected '3 items'.
- M17 (n=0 branch removed): "questions-mirror: a round over 4096 sends the summary message THEN the document" fails at order[0][1]: 'Question round 7 — 0 items; …' vs the n=0 text.
- M18 (rules plus one): a_round_over_4096_characters_is_sent_as_a_document_from_the_hook fails at lines[0]: '… round 8 — 2 items; …' vs '1 item'.
- M19 (old anchored pattern): the_header_lists_a_red_line_item_whose_marker_follows_its_label fails at the first assert.match: round 52 header 'RED LINE items: none.' vs `1, 3`.
- M20 (marker anywhere): same test fails at the negative case: 'RED LINE items: 1.' vs `none`.
- M21 (split on `\n`): the_document_summary_counts_numbered_items_not_rules fails at the CRLF assertion: 'Question round 52 — full text attached (copy-paste ready)' vs '4 items'.

I1 (countItems on all 73 rounds; saved in the scratch folder as qmic-i1-B.txt and qmic-i1-H.txt, scripts qmic-i1.mjs, qmic-i2.mjs)
- At B: rounds 36-73 read header k + 1 on every file (e.g. 36 → 2 vs k 1; 52 → 5 vs 4), as §0 states.
- At head: for all 38 hook-written rounds count = header k (0 mismatches). The 55 files that change and 18 that stay match §3's table exactly: 21→2, 22→3, 23-26→4, 27→6, 28→3, 29→6, 30→1, 31→2, 33→11, 34→7, 35→1, 16→5, 1→0, 32→0; unchanged 2-15 and 17-20 (17 stays 9). No difference from the prediction.

I2 (shipped hook re-run in temp projects under my scratch folder, each with its own lease, dry-run only, no token/chat id in env; every one of the 38 runs printed the dry-run line once, status 0; temp projects removed)
- At B: all 38 headers read `none` except 40, 41, 42 (`1`), as committed; 45 read none (13 wrong ones remain none).
- At head, headers equal §3's table with no difference: 36-39 none; 40-42 `1`; 43-44 none; 45 `2`; 46 `3`; 47-51 none; 52 `1, 3`; 53 `1`; 54 `1, 2`; 55 `1, 3`; 56 `1`; 57 `1, 2, 3, 4`; 58 `1`; 59 `1, 2, 4`; 60 none; 61 `1`; 62 `2, 3, 4`; 63 `1, 3, 4`; 64-73 none. That is the 13 named differing from the committed headers (45, 46, 52-59, 61-63). I read the lists against the files' question leads only through the script's extraction; the form's reader step is the reviewer's.

§7 (`git diff --numstat c7e94a85...HEAD`): mjs 15 added / 6 deleted = 21 (≤30); test 41/3 = 44 (≤90); total 65 (≤120).

Disclosures: none beyond the form's. Process note: the Bash tool collapsed backslashes in a single-quoted heredoc once (first test-edit attempt aborted on an assertion before writing anything); I redid it from a file. No file outside §7's two was changed in the worktree; the .claude/ tree untouched; no round file edited; no network send.

Hold lines (my project): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` then `MACHINE_RELEASED project=SpatialIDE … (cores 0-7)`.
No process I started still runs (all commands were foreground; the node.exe entries visible in the task list are not mine). Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5); no override; no context handoff received or produced.

Self-check: cross-module code uses the other side's actual interface (rulingSet.mjs and telegram.mjs read); every completion claim points to a saved output file or a call above; the only user-facing message changed is the summary line, which describes the implemented grammar; every required test reaches its assertion (each mutation failed at the named assertion).
