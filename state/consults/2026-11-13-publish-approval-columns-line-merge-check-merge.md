# The advisor's merge check of PR #314 at 4624c9ead790: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 204c1762

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-314-4624c9ead790.md in the human's advisory folder and told the custodian by session message; the custodian acts on the file. 6504 bytes, sha256 c24a7cac740c91f82cdd2721d6ae6614a7e6d83cfab7845904e473221890836a, last modified at 2026-11-13T20:53:59Z by the file system; read by the custodian at 2026-11-13T20:56:24Z and again at this filing (2026-11-13T21:05:35Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #314 merged at 2026-11-13T20:54:15Z with the merge commit 204c176282c37786f322a530dc0ab89b59e915b5 (parents b97c3816 and 4624c9ea). The advisor's message adds one note that the verdict does not hold for: the form's Amendment 2 does not list P-head-1 to P-head-3 one by one; the node's closing lead states them by reference, and no amendment is written for it.*

---

Merge check: PR #314 at 4624c9ead790d77d6fec81616bb3ac5333c537cd
Verdict: MERGE

Checked by the advisor session under the delegation of 2026-11-13, between 20:50Z and 20:54Z on 2026-11-13 (from the clock). The piece is `publish-approval-columns-line`, slot 2, under the form `governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md` as it stands on main at b97c3816eb2332aae8b2e69e7b4ef0484bff9200 (Amendments 1 and 2).

What I read: the custodian's request of 20:49:44Z; PR #314 from GitHub (head, author, base, draft state, body, checks); the branch's six commits; the diff from the base d5598e2a46df486f2b53fe396922a5c368940261 to the head, whole; the diff from the gated head b6924acea0ee757f679551442d09d1353b595d3b to the head, whole; both gate reports as filed on main; the form's §1, §2, §5, §7, §8, §9 and both amendments; line 20 of the directive of 2026-11-12 the form's §2.2 names; my rulings ADV-2026-11-13-17 and ADV-2026-11-13-18 as filed on main; the runs at the head and on main; what changed on main since the base.

1. The PR. It is opened from the custodian's account, from the branch `cut/publish-approval-columns-line` of this repository, based on main, out of draft, open, and GitHub reads it MERGEABLE and CLEAN at the head named above. Its merge base with main is d5598e2a.

2. The head against the gated head. Both gates reviewed b6924ace. The head is one commit later, 4624c9ea. From b6924ace it changes two files and nothing else: `frontends/shell/src-tauri/src/publish.rs` (3 lines in, 1 out) and `frontends/shell/MANUAL-WALKTHROUGH.md` (1 in, 1 out). I rebuilt both files from their gated bytes and the gate reports' own words by script, and each rebuilt file equals the file at the head byte for byte:
   - D1: the architect's two comment lines, inserted after the composer's comment in `publish.rs`.
   - D2: the architect's one line, replacing the doc line of the `prepared_prompt` test helper, with the file's four-space indent.
   - D-1: the reviewer's replacement span, in the walkthrough's APPROVED' row. The old span occurred once in the gated file; the new one occurs once at the head.
   The round is comment and documentation lines only, in the gates' words, as ADV-2026-11-13-18 item 3 allows without a re-gate.

3. The gates. The architect: PASS WITH NOTES, no correctness or evidence finding, documentation findings D1, D2 and D3, notes N1 and N2. The reviewer: PASS WITH NOTES, no correctness or evidence finding, one documentation finding, D-1. D1, D2 and D-1 are closed at the head (item 2 above). D3, a wrong reference in the form's §2.3, is closed in the form's Amendment 2, item 5, as the architect asks: the defect, the corrected reference and the proof. N1 is met by the PR body (item 4 below). N2 is an observation and asks for nothing.

4. Rulings and ruled wording.
   - Nothing on the piece waits for a ruling. The gates' two packet questions were ruled in ADV-2026-11-13-18, which is filed on main; the filed body equals my file byte for byte (3732 bytes). ADV-2026-11-13-17 is filed the same way (6533 bytes).
   - The two forms of the line, the human's words by approval. Each is inside the quotation marks of line 20 of the 2026-11-12 directive, whose sha256 I recomputed as 2e05b761…, the hash the form gives. The composer at the head returns the no-attributes form as that span and builds the other form from that span with the names in the placeholder's place.
   - The ADR-024 note. The head's file is the base's file plus 363 bytes: an empty line, the heading `## Appended note, 2026-11-13`, an empty line, and the note. The note equals the block in the form's Amendment 1, item 4, with `<date>` replaced by 2026-11-13, byte for byte (331 bytes and a line end). The commit that appends it is dated 2026-11-13 in UTC. The heading stands by ADV-2026-11-13-18, item 1.
   - The PR body names the note's authority (the form's Amendment 1, item 4, and item 7 of the human's message of 2026-11-13, 06:43Z), which ADV-2026-11-13-18 item 1 (e) made a condition of this check. It names 090e18a5 and 8524ce76 as commits the brief did not name. The form's Amendment 2 records the heading reading (item 3), the six commits as built (item 4) and the correction round (item 2).

5. The files. The diff from the base has eleven files, each in the form's §7 list and each within its ceiling: 178 lines of 258 by §7's count, `publish.rs` at 130 of 140, the e2e README at 8 of 8. Nothing under `kernel/`, `engine/`, `renderer/`, `protocol/`, `.github/` or any mod; no dependency, lockfile or licence file.

6. What the piece does. `PublishPromptData` gains `published_columns`, composed in `prepare_with_query` by the private `compose_published_columns` from the same `attributes` vector the request carries; the TypeScript type gains the required member; the dialog renders it verbatim in a second `<dd>` directly after Row scope, with no label word and no page-side composition. Tests U1 to U3, D3 and E1 are present, each with its RECORDED MUTATION line. The walkthrough's G3 row and APPROVED' row, the e2e README's APPROVED' passage and the ADR-024 note are the records §2.3 names. KNOWN-LIMITATIONS is not edited. This is the shape ruled as option (A) with OPEN-1 to OPEN-6 as the form's Amendment 1 records them. I saw none of §8's block-on-sight items.

7. CI and main.
   - At the head, every check passes: the six pull_request runs 43496576368 (Rust fmt), 43496576412 (Exposure scan), 43496576466 (Ported notices), 43496576479 (DCO sign-off), 43496576482 (Governance CI) and 43496576515 (Product CI, shell), and the four push runs beside them. The e2e suites do not run on CI; the reviewer ran all of them at b6924ace, and the round since changed no code.
   - The pull_request runs tested the merge of the head into main at 66fdc2fd. Main has gained two record commits since. None of the piece's eleven paths changed on main since the base. The lines those two commits add contain no line cite into any of the eleven files. Main's own runs at b97c3816 are green.

One thing I note and do not hold for: the form's Amendment 2 says in its heading that it invalidates nothing, and it does not list predictions P-head-1 to P-head-3 one by one. The reviewer's report records the tests, the e2e suites and the mutations as green at b6924ace. The form does not promise such a list in its closing.

Merge by a merge commit, so that 08ac45cc and 1d45189b, which the RECORDED MUTATION lines name, stay reachable from main.
