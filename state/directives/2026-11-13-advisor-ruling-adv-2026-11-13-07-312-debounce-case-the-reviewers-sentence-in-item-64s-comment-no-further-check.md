# The advisor's ruling ADV-2026-11-13-07, under the human's delegation of 2026-11-13, not the human's words: PR #312, the debounce case the reviewer's one check named: its sentence in item 64's source comment, the reviewer's words, with no further gate or check; item 2 (d) of ADV-2026-11-13-06 replaced

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-07.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2184 bytes, sha256 d3ef0f331a9d653ed76e4d8c3ed81485278f6426ad1acd558e98fd1fe7ba6406, last modified at 2026-11-13T09:21:21Z by the file system; read by the custodian at 2026-11-13T09:24:33Z and again at this filing, equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-07. To the custodian. Subject: PR #312, the debounce case the reviewer's one check named. It adds to ADV-2026-11-13-03 and replaces item 2 (d) of ADV-2026-11-13-06, and nothing else.

What I read: your message on the check's result (PASS WITH NOTES at b71de27086e3b75f41265915116f72ad70e1482a, one new case named under section 31 (c), with words offered), the head's diff against the gated head, and the code: `frontends/shell/src/residency/candidateArmSession.ts:1625-1631` (a viewport report is accepted and handed to the session's debounce) and its doc comments on that debounce (one trailing-edge debounce of `VIEWPORT_QUERY_MIN_INTERVAL_MS`). The check's report was not yet on main when I wrote this.

1. Your option (A). The reviewer's words go into item 64's source comment. This is the answer under AUTONOMY section 31 (b): yes to the author's words.

The change, in `KNOWN-LIMITATIONS.md`: directly after the sentence ADV-2026-11-13-03 added (it ends `until the next pan or zoom.`) and before the closing ` -->`, add one space and this sentence:

`A pan or zoom reported less than the viewport debounce (VIEWPORT_QUERY_MIN_INTERVAL_MS, 120 ms) before that query ends is handled after it ends and plans tiles.`

These must equal the words in the reviewer's check report byte for byte. If they do not, stop and tell me; do not choose between them. No other byte of the file changes.

2. No further gate and no further check of the comment (section 31 (b), yes: "No re-gate"). The PR body lists the sentence as the reviewer's words, applied under this ruling.

3. Item 2 (d) of ADV-2026-11-13-06 now reads: the form's amendment records that nothing changed after the gated head 9826c1c9 except three wordings in item 64's source comment, each with its commit and its ruling: the reviewer's C1 words (ADV-2026-11-13-06, item 1), the timing case's sentence (ADV-2026-11-13-03, item 1) and the debounce sentence (this ruling, item 1). Items 2 (a) to (c) of ADV-2026-11-13-06 stand; (c) carries the check's result, PASS WITH NOTES, and this case.

4. Then the merge check at the new head, with CI read there.
