*Filed by the custodian on 2026-11-05 from an evidence-reader's hand-back (report extraction; its brief brief-cmp-adr-docs-audit.md, sha256 663a8e2a8f49ad423cccf529bed8184d8dd4574dc33c566b7651a19740a32385; agent transcript read against it: 6 Read and the hand-back; run 2026-11-05T14:56:19Z to 14:57:31Z, claude-sonnet-5-5). The hand-back's sha256 is 58d0d1aab05a5ff61175d81c09b8ca5939671a38e144dd78d8ea594044ea0bfa, one final newline added; unchanged. It compares a platform report with the cloud filing of the same topic and judges neither; the platform report's filing note carries the custodian's reading of it. Its platform line numbers are the advisory file's: in the filed copy each is 4 lines lower (the filing note, a blank line, the rule and a blank line come first); its cloud line numbers are the filed cloud file's.*

---

**1. Status:** complete. I read both files whole in one pass. Platform = P, in the advisor's file, 420 lines, at 652752af. Cloud = C, in the filed file, 526 lines, at 6b67d44. Derived arithmetic is marked "(mine)". I do not merge figures across the two runs. No text in either report asked me to do anything.

**2. Both answer**

1. **ADR Note/Corrigendum sections audited**
   - P (P:33): "none of the 27 Note/Corrigendum sections carries a single `path:line` citation".
   - C (C:76, C:24): "Task A (22 notes and corrigenda)" and "22 sections in 9 ADRs".
   - DIFFER. 27 vs 22. P counts ADR-002's Priority note (P:37), the ADR-017 container heading (row 4) and two ADR-017 sub-headings (rows 26 and 27). C excludes ADR-002 and the container (C:31-36) and folds the ADR-009 addendum into its corrigendum (C:26-28). 27 minus those 5 gives 22 (mine).
2. **path:line cites inside the notes**
   - P (P:33): "the recogniser finds zero in every one of them". The repository's own recogniser found none; no hand pass for same-file `:N` cites is reported.
   - C (C:78): "No note or corrigendum carries a `path:line` cite to another file. Six cites point at lines of their own ADR".
   - The six: ADR-024 (A-C1, C:148) and five in ADR-028 (A-C2, C:158). C says all six resolve, byte-identical at the appending commit and at 6b67d44.
   - DIFFER on the count: 0 vs 6 same-file cites. Both agree there are no cites to other files.
3. **Notes that mention a moved path**
   - P (P:33): "12 of them name a path that `governance/MOVED.tsv` moved". P also says every one resolves through the map to an existing file.
   - C (C:81-83): "11 mentions, none with a line number, of 7 paths", rows B50, B51, B61, B80, B83, B84, B85, B98, B99, B100, B122.
   - DIFFER on 12 vs 11. P's unit is unclear. P's note-section rows that name a moved path give 11 mentions when I count them (mine), matching C's rows.
4. **Edits above a note after it was appended**
   - P (P:40-41, P:54-55): ADR-017 hunks `3292f1f7` and `1aceb8f7`, plus `3292f1f7`'s `@@ -19,4 +18,0 @@` removal. ADR-026 hunk "077bda17 … `@@ -3,3 +3,6 @@`" and the CRLF rewrite and restore (`f21c2ee2`, `f8bddf6c`). All other notes: none.
   - C (C:91-96, A-H1 to A-H3 at C:285-320): same ADR-017 commits and hunks. ADR-026 `077bda17` replaced lines 3-5 with 3-8. CRLF rewrite and revert net zero. "17 of the 22" notes have no hunk above.
   - AGREE on the commits and the hunks. They differ only in which notes each report lists as affected.
5. **docs/README.md ADR index vs Status lines**
   - P (P:23, P:69): "PASS -- 34 ADRs, index in docs/README.md matches every Status line".
   - C (C:48-50): "PASS -- 34 ADRs, index in docs/README.md matches every Status line".
   - AGREE.
6. **ADR-023 Status wording "decision deliberately undrafted"**
   - P (P:90): "`:3`'s "decision deliberately undrafted" is no longer true of the file".
   - C (C:238-239, A-S5): "The words "decision deliberately undrafted" do not describe a file that has a Decision section."
   - AGREE. Both also say Status, PLAN and index agree on Proposed.
7. **ADR-035: close-races note blocked in PLAN, no such note in the ADR**
   - P (P:65): `adr-035-close-races-note` "**blocked**", "no such note exists yet in the ADR".
   - C (C:257-259, A-S7): `adr-035-close-races-note` is `blocked`.
   - AGREE.
8. **ADR-020 corrigendum's PLAN node**
   - P (P:65): "`adr-020-appended-note`, done, PR #271".
   - C (C:241-248, A-S6): "`status: in-progress`" at 6b67d44, "`status: done`" with "`evidence: {pr: 271}`" at 84a90e2.
   - AGREE at the later PLAN state. DIFFER at 6b67d44, as expected. The packet (line 8) lists governance/PLAN.yaml among the files that changed between the two revisions.
9. **ADR-017 pending note and its node**
   - P (P:65): "`adr-017-note-product-redaction-gate`, in progress on a branch — not on `main`".
   - C (C:279-281, C:501-503): the node is `in-progress` on a branch, "It was not audited".
   - AGREE.
10. **ADR-017 corrigendum count in the indices**
    - P (P:105) says only that node `docs-02-adr-017-entry-current` (blocked) "already names docs/02's ADR-017 entry as behind". It gives no count.
    - C (C:264-278, A-S8): both `docs/README.md:27` and `docs/02_Architecture.md:80` say three; the file has five corrigendum headings.
    - Not comparable by figure. P has no count.
11. **Total moved-path mentions**
    - P (P:111): "199 mentions in 36 files".
    - C (C:100): "134 mentions on 119 lines in 35 files".
    - DIFFER. Scope: P's named roots include `KNOWN-LIMITATIONS.md` (P:109), and C's do not (C:61-62).
    - P's table has 69 `KNOWN-LIMITATIONS.md` rows (rows 33-101, mine). P's total without them is 130, against C's 134.
    - The remaining 4 are bare file names that C counts and P does not. They are B12 and B22 in `.github` and B105 and B107 in ADR-029 (mine, by comparing rows).
    - File counts: 36 minus `KNOWN-LIMITATIONS.md` gives 35, matching C.
12. **Split by location**
    - P: `.github` 32 rows, `README.md` 1, `docs/` 97, `KNOWN-LIMITATIONS.md` 69 (my row counts).
    - C (C:100-101): "99 are under `docs/`", 34 under `.github/`, 1 in `README.md`.
    - DIFFER, by the 4 bare names in item 11. `CONTRIBUTING.md` has none in both (P:111, C:101).
13. **Form of the mentions**
    - P (P:111): "none is a Markdown link".
    - C (C:103): "None is a Markdown link and none is pinned to a revision."
    - AGREE. Both also say `.github` mentions are YAML comments or step names (P:111, C:103-104).
14. **Do the mentions fail when followed?**
    - P (P:113): a "pointer" fails as written and a "bare mention" does not. Its table marks some "No: nothing to follow".
    - C (C:105-107): "133 fail as written", and only `README.md:53` "resolves".
    - DIFFER. P's pointer/bare split gives no total, and it marks several bare mentions as not failing. C counts every mention except `README.md:53` as failing. Both treat `README.md:53` as non-failing.
15. **Line cites among the mentions**
    - P (P:62-66 rows 62, 64, 66, 122, 123, 142, 149, 151, 177, 178, 182, 183, 184): cites marked "cite with line". Outside `KNOWN-LIMITATIONS.md` that is 10 rows (mine).
    - C (C:108): "12 mentions carry a line".
    - DIFFER, 10 vs 12 (mine). The 2 extra are C's bare-name ADMISSION cites (B105, B107).
    - On the targets both agree:
      - `DECISIONS-PENDING.md:37` lands on different text, archived at `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:1709` (P:327, C:360-363).
      - `RELEASE-0.1.md:1041` holds (P:415, C:421, C:478).
      - `RELEASE-0.1.md:798-799` holds (P:415; C: same apart from line endings, B70).
      - `AI_DEVELOPMENT.md:233` and `:147` differ (P rows 13 and 14, C B76 and B78).
      - ADMISSION `:248`, `:252` and `:254` differ (P rows 60, 69, 73; C B104 to B107).
16. **Pinned cite**
    - P (P:182): `KNOWN-LIMITATIONS.md:294` carries `@ <commit>` and does not fail.
    - C (C:329-331): says none of its 125 rows is pinned; it has no `KNOWN-LIMITATIONS.md` rows.
    - Not comparable, because of the scope difference.
17. **How the move treated these mentions**
    - P (P:113): the move form leaves them "named but not read; not edited … resolve through the map".
    - C (C:364-366): "`governance/README.md:29` says a record that names a file by its old path is not edited".
    - AGREE in substance.
18. **Recommendations**
    - P: none as such. It says "whether to append a dated correction is the maintainers' call" (P:323).
    - C: states it "decides nothing" (C:7), and gives no recommendations.
    - AGREE: neither report recommends an action.

**3. Only in the platform report**
- **Task C (P:319-415).** The only content of either report with no counterpart in the other.
  - 170 unpinned `path:line` cites in `docs/**/*.md`.
  - 26 are third-party crate cites, not verifiable in-tree; ADR-021:207 is the same class.
  - Of the remaining 143, 40 hold and 87 rows do not (rows 1-87), across 8 ADR files.
- **`docs/README.md:27` hand-written status paragraph (P:69, P:83, P:90, P:96, P:99-102).**
  - ADR-016 sits inside a "Proposed:" run while saying accepted.
  - ADR-023 and ADR-029 are described as "deliberately undrafted/open".
  - ADR-033, 034, 035 and 036 are absent.
- **`docs/02_Architecture.md` status list (P:105).**
  - Line 86 says "ADR-023 (proposed — decision deliberately open)".
  - It was not in the task's named pair.
- **ADR-009 generated cell (P:77).** It carries the sentence the ADR's own corrigendum calls false.
- **`KNOWN-LIMITATIONS.md` mentions (P:33-101 rows).**
  - 67 of the 199 mentions sit in HTML comments; 24 in YAML comments; 3 in CI step names (P:111).
- **Per-ADR Status vs PLAN vs README table (P:71-103).**
- **ADR-022 "Amendment 2" on a branch (P:89).**
- **Rotation of `DECISIONS-PENDING.md` flagged on 45 or more mention rows (P:113).**

**4. Only in the cloud report**
- **A-S1 (C:181-189).** ADR-026's note says ADR-032 is "Proposed, decision open"; ADR-032 is now Accepted 2026-09-23.
- **A-S2 (C:191-199).** ADR-017 Corrigendum 1 calls ADR-009 open; ADR-009 is Accepted.
- **A-S3 (C:201-210).** ADR-026's Status line calls a wording question open; a later section of ADR-026 settles it.
- **A-S4 (C:212-225).** PLAN records ADR-021's Note 2026-09-29 as both accepted later and already accepted.
- **A-S7 (C:250-262), the part beyond item 7.** `kernel-generation-close-races` is done, `{pr: 136}`.
- **A-C1 and A-C2 (C:146-167).** Same-file cites byte-identical at the appending commit and at 6b67d44. The "(ii)" label sits on `:510`, not `:512`.
- **Commit names the notes give (C:169-177).** All exist, except ADR-030's upstream `d8cdaa33fda8…`.
- **Per-note history for 22 rows (C:121-144).**
- **13 mentions on 10 lines last written after the move (C:354-358).**
- **Mentions by old path (C:338-351).** 53 for `DECISIONS-PENDING.md`, 15 for `RELEASE-0.1.md`, and the rest.
- **Extension-less names (C:71-72).** 32 `DECISIONS-PENDING`, 11 `RELEASE-0.1`, 16 `PLAN`.
- **Bare-name rows B12, B22, B105 and B107 (C:380, C:390, C:473, C:475).**
- **Cross-check (C:42-45, C:517-518).** `verify-cites` passes at 6b67d44; its three advisory lines are in ADR-020 Amendment 1 (C:497-500).
- **`origin/main` moved to 84a90e2 during the session (C:11-15).**

**5. Coverage and unresolved**
- **Read:** P lines 1-420 and C lines 1-526, all in full.
- **Revision effects.** Differences that could come from the governance-only files changed between 6b67d44 and 652752af (the packet, line 8):
  - The ADR-020 node status (item 8).
  - Any PLAN line numbers each report cites, which are at different revisions.
  - Node counts: neither report gives a PLAN node count.
- **Scope differences, not content differences:**
  - `KNOWN-LIMITATIONS.md` is in P's scope and not C's.
  - P covers Task C and C does not.
  - C counts bare file names as mentions and P does not.
- **The inputs cannot say:**
  - What P's "12" in item 3 counts.
  - How many of P's 199 mentions are "pointer" and how many are "bare mention". P does not total them, and I did not count them.
  - Whether C's claim that none of its 12 line cites sits on a line written after the move holds, or whether P's 87 failing rows hold. I did not check either against the repository.
  - Whether the 4 bare-name rows are the whole 4-mention gap beyond the `KNOWN-LIMITATIONS.md` split. That is my inference from row comparison.
