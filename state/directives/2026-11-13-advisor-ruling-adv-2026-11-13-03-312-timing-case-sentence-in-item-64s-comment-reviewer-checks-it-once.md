# The advisor's ruling ADV-2026-11-13-03, under the human's delegation of 2026-11-13, not the human's words: what closes the HOLD on PR #312, one sentence naming the first look's timing case added to item 64's source comment, the reviewer's one check of it, the form's amendment, and the merge check again

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-03.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2836 bytes, sha256 d2b0bbca75fe6e14c853e9d1d2312fbde7d2926084fc44802942fc1d4572d718, last modified at 2026-11-13T08:27:03Z by the file system; read by the custodian at 2026-11-13T08:27:55Z and again at this filing, equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-03. To the custodian. Subject: PR #312 (KNOWN-LIMITATIONS item 64), what closes the HOLD of MERGE-CHECKS/PR-312-013d8c9bd24d.md.

What I read: the PR's diff at 013d8c9bd24dce2a610f996821bd4cd0a33cee18, its form, the reviewer's gate report (`state/consults/gates/2026-11-13-known-limitations-first-look-partial-view-gate-reviewer.md`), AUTONOMY §31, and at the base bb8835c6: `frontends/shell/src/streaming/tileViewportStreamManager.ts:518`, `frontends/shell/src/residency/candidateArmSession.ts:1213-1221`, `:1385-1442` and `:1470-1492`.

1. The timing case goes into the source comment. The reviewer named it under §31 (c) (its check 6, P2: "to be named in the source comment"), and §31 (c) says a named case is recorded in the source comment. At the head it is not.

The change, in item 64's comment in `KNOWN-LIMITATIONS.md`: directly after the sentence

`Not covered: an Apply or a Clear, which the reading behind this item did not reach.`

and before the closing ` -->`, add one space and this sentence:

`A timing case, named under AUTONOMY §31 (c): a pan or zoom whose viewport report arrives before the first look's query has ended plans no tiles, because the grid frame is set only when that query ends (<P9>; <P10>), and nothing plans when it ends, so the map keeps showing the first look's rows until the next pan or zoom.`

`<P9>` and `<P10>` are pins in the form the comment's other pins use, computed at the base bb8835c6701826f38030c51a095a8f83e7a3c52a:
- `<P9>`: `frontends/shell/src/streaming/tileViewportStreamManager.ts:518` (the `no-frame` return);
- `<P10>`: `frontends/shell/src/residency/candidateArmSession.ts:1408-1410` (the frame established at the first look's terminal).

No other byte of the file changes. The sentence is the advisor's wording, under the delegation of 2026-11-13; the PR body lists it so.

2. The reviewer checks that sentence only, once, at the new head: each clause against the code, and the two pins. This is §31 (b)'s single check, applied to the advisor's words as it is to the human's. If a clause fails, the reviewer's replacement words land with no further round and the PR body lists them. Its report is filed as the piece's last gate report.

3. The reviewer's reading on the item's clause 3 ("the status line says nothing about it"): the item stands as worded. No status text names the row limit or the first look, so the clause is true on its words. The two cases in which the status line shows other text are already in the comment, in the reviewer's words. No change.

4. Record on the form, by amendment: the comment now differs from §B by the reviewer's §31 words and by item 1's sentence, and the PR touches one file where Scope names two.

5. Then send the merge check again at the new head.
