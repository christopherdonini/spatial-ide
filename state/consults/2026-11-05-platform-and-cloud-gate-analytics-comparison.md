*Filed by the custodian on 2026-11-05 from an evidence-reader's hand-back (report extraction; its brief brief-cmp-gate-analytics.md, sha256 ec615e7f0ad458d939bb0392b610b39298c09d871b1f7a88a0a29b3b9db5ec9c; agent transcript read against it: 6 Read and the hand-back; run 2026-11-05T14:56:19Z to 14:57:30Z, claude-sonnet-5-5). The hand-back's sha256 is e6863baee8eeca61c2b5902f71c2d3557d72d6faeccdc321a29012d5e5fa6b3d, one final newline added; unchanged. It compares a platform report with the cloud filing of the same topic and judges neither; the platform report's filing note carries the custodian's reading of it. Its platform line numbers are the advisory file's: in the filed copy each is 4 lines lower (the filing note, a blank line, the rule and a blank line come first); its cloud line numbers are the filed cloud file's. The brief placed the cloud run at 6b67d44b; its branch sits on 84a90e26, a later main commit, and from either commit to 652752af only governance records changed (git diff --name-only, the custodian's check), the gate log not among them.*

---

**1. Status:** complete. Both files were read whole. I judge neither report right. P = platform report (line numbers in `GATE-LOG-ANALYTICS-2026-11-03.md`). C = cloud report (line numbers in the filed file `state/consults/2026-11-03-cloud-gate-analytics-report.md`). The platform run worked at 652752af and the cloud run at 6b67d44b per the packet; the cloud filing note itself names 84a90e26. Between those commits only governance records changed, so I treat PLAN-node counts as possibly revision-sensitive. Neither report states a PLAN count that I could compare, so no difference below is traced to that.

**2. Both answer**

1. **Gate-log population.**
   - P (L23): "668 entries over 190 nodes". C (L21): "190 gated pieces, 667 gate rows". C L42 says 668 rows, with "1 VOID, left out".
   - DIFFER (apparently the VOID row): P counts 668 and C's headline counts 667.
2. **Role rows.**
   - P L1713/1714: reviewer 379 entries, architect 288. C L135/136: reviewer 378, architect 288.
   - DIFFER by 1. P's reviewer row has VOID 1 (L1713), and P's reviewer figure includes it.
3. **PLAN nodes and unmapped gate-log nodes.**
   - P L23: "356 nodes", with 15 gate-log nodes lacking a PLAN node (L32). P maps governance-test-claims-superseded via evidence.branch (L1808). C L43: "190 (174 PLAN nodes, 16 not)". C L235 lists that node as not a PLAN node.
   - DIFFER: 15 vs 16. P's governance lane has 54 pieces (L1685) and C's has 53 (L102).
   - P's 356 is the whole PLAN. C's 174 counts only gated nodes. These are not like-for-like.
4. **Forms and reports read.**
   - P L1454: 190 forms, 435 reports in `state/consults/gates/`, plus 34 pre-§25 files. C L44: "435 / 430" (filed / named by a row). C L52: forms found for "159 of 190".
   - Report totals AGREE at 435. P adds a pre-§25 set that C does not mention. Form counts are not comparable: P has 190 form files, C finds forms for 159 pieces.
5. **Rows with no report.**
   - P L1820: 209 (207 in 2026-09, 2 in 2026-10). C L45: "237 (2026-09: 237)".
   - DIFFER. P includes the 34 pre-§25 files in its matching.
6. **Findings read.**
   - P L1739: "Findings read: 1972; status lines: 158; open findings: 1814". C L46: "1825: 1183 findings, 642 notes".
   - DIFFER in definition and totals. P counts bold-id items minus status lines. C counts only blocking, must-fix or should-fix items.
7. **Finding-class totals (C/E/D).**
   - P by month (L1671–1673): 34/34/68, 176/138/695, 0/2/12. C total (L21): "C 239, E 125, D 819". C by month (L79–81): 54/25/80, 180/98/727, 5/2/12.
   - DIFFER in September and October. The November E and D figures match (2 and 12); C is 5, P is 0.
8. **First-pass, every gate PASS or PASS WITH NOTES, by month.**
   - P (L1671–1673): 25 (36%), 62 (55%), 5 (71%). C (L79–81): 25/70 (36%), 62/113 (55%), 5/7 (71%).
   - AGREE. C also gives 92/190 (48%) overall. P gives no overall figure.
9. **Reviewer first pass by month.**
   - P: 30/0/39, 43/30/40, 1/6/0 (P/PWN/F). C: 31/70, 73/113, 7/7.
   - DIFFER in September: P has 30 passed (30 + 0) and C has 31. October (43 + 30 = 73) and November (1 + 6 = 7) AGREE.
10. **Architect first pass by month.**
    - P: 12/0/31, 33/24/33, 0/4/2. C: 12/46, 57/91, 4/6.
    - The passed counts AGREE: 12, 57 and 4. Denominators DIFFER: P's rows sum to 43 and 90, C has 46 and 91. C marks some architect first rows as attempt 2 (`F@a2`). November AGREES (6).
11. **By role, attempt 1 and FAIL share.**
    - P L1713/1714: reviewer "78/36/88 of 202" (56%), architect "47/28/75 of 150" (50%), FAIL share 43% / 47%. C L135/136: reviewer 114/202 (56%), architect 75/150 (50%), FAIL 164 (43%) / 134 (47%).
    - AGREE. 78 + 36 = 114 for the reviewer. P's architect passes are 47 + 28 = 75, C shows 75/150 (50%) in the same cell, so the figures match.
    - P's FAIL counts for all attempts are reviewer 164 and architect 134, the same as C's.
12. **Tester.**
    - P (L26): "The one `tester` entry is row 44". C: tester 1/1 (L64), and `lod-tier-builder-route-b` shows tester P (L224).
    - AGREE.
13. **Correction rounds, mean and sum.**
    - P: mean 1.49 / 0.73 / 0.29, sums 104 / 83 / 2 (L1671–1673). C: mean 1.36 / 0.57 / 0.29, 95 / 64 / 2 (L79–81). C also gives a total of 161 over 95 pieces (L68).
    - DIFFER in September and October; November AGREES. The definitions differ. P takes the maximum over gates of entries with attempt > 1 (L1459). C counts a round k ≥ 2 entered after a FAIL at round k−1 (L32).
14. **Record rounds.**
    - P: 52 / 4 / 0. C: 48 / 5 / 0, total 53.
    - DIFFER (September 52 vs 48, October 4 vs 5). C's total of 53 is 48 + 5 + 0.
15. **Gate entries per node.**
    - P: 4.43 / 3.04 / 2.14 (310 / 343 / 15 entries, L1671–1673). C gives rows by row month, not per node: 308 / 344 / 15 (L88–90).
    - Not comparable. P groups by the node's first-entry month and C by the row's own month.
16. **Nodes with more than one count (attempts restart).**
    - P L1823: "(9)", listing `briefa-p6-part-n-acceptances`, `briefa-p6-n8-reopen-reset`, `governance-verify-mutation-multiline-attrs`, `crs-unit-fact-and-bounds`, `engine-source-change-watcher`, `geometry-types-beyond-polygons`, `publish-refusal-codes-and-attempt-lifecycle`, `shell-migration-milestone-2`, `b1-shell-half`. C L69: "Pieces with more than one count | 9".
    - AGREE on the count (9). C's Appendix A "Counts" column is 2 or more for the same nine pieces (L233, 237, 240, 244, 250, 266, 277, 334, 366) except `governance-verify-mutation-multiline-attrs`, which shows 3 (L250); the list matches.
17. **By lane, every-gate-PASS-or-PWN numerators.**
    - P (L1679–1687): engine 13, kernel-protocol 21, shell 13, publish-viewer 1, measurement 1, release 8, governance 19, platform 2, unmapped 14. C (L96–104): the same numerators.
    - AGREE on numerators. Governance denominators DIFFER (54 vs 53) and unmapped differs (15 vs 16).
18. **By form shape.**
    - P (L1705–1707): five-line 54 pieces, 30 (56%), mean CR 0.72; full 102 pieces, 39 (38%), mean 1.32; none 34. C (L124–126): five-line 57, 30/57 (53%), mean 0.67; full 102, 39/102 (38%), mean 1.11; no form 31.
    - DIFFER on the five-line population (54 vs 57), on its percentage, and on mean rounds. The full-form first-pass count AGREES (39 of 102).
19. **By declared size.**
    - P L1693–1699 buckets: ≤50 18 of 26 (69%), 51–150 49%, 151–500 42%, 501–1500 27%, >1500 40%, unknown 58 pieces. C L111–117 buckets: 0–50 20/28 (71%), 51–150 23/51 (45%), 151–400 12/24 (50%), 401–1,000 6/22 (27%), over 1,000 6/18 (33%), form-no-line-figure 16, no form 31.
    - DIFFER. The bucket boundaries differ, so the groups cannot be compared directly. Only the 27% for the 501–1500 / 401–1,000 bucket coincides, on different populations.
20. **Days, form to closing or merge.**
    - P L28: "median 0–1 day in every month and lane", with PR merge-commit date within 3 days for all but one piece. C L71: median 0.6, p25 0.2, p75 2.3, max 11.9 (n=153).
    - Method DIFFERS. P uses dates, with a closing-amendment commit or the last content commit standing in. C uses committer times to the merge commit of the latest merged PR.
    - For `corpus-reproducibility-record`, P gives 32 days (L1814) and C gives 1.0 (L258). P's note says this piece's form took an amendment 32 days after its PR.
    - For `adr-020-appended-note`, P gives 12 (L1655) and C gives 11.9 (L391). These are consistent.
21. **Rules most cited.**
    - P L1743: R48, 250 findings, 177 reports; R36 187; R43 118; R17 109; R03 102; R24 99; R27 98; R14 91. C L163: `claims-true-of-code` 189 findings, 129 reports; `record-what-happened` 62; `completion-claim-evidence` 34; `hash-ref-at-main-commit` 29; `scope-exactly-the-piece` 25.
    - DIFFER. P's catalogue has 49 rules (R01–R49) and C's has 36. Neither maps to the other.
    - Unmatched: P L1739 says 611 of 1814 open findings match no rule; C L200 says "689 of 1183 findings match no catalogued rule". Different populations.
22. **Method of rule matching.**
    - P: regular-expression keyword matching with a hand sample (L32, L1825), no precision figure. C: explicit and keyword tiers, with measured "76 of 100 correct (76%)" (L56).
23. **Recommendations.**
    - Neither states any. P L32 says "readings, not judgments". C L7 says "it decides nothing and proposes nothing".
    - AGREE: no recommendations in either report.

**3. Only in the platform report**
- Strict-PASS first-pass under the `health.mjs` definition: 37% / 38% / 14%, and the PWN divergence (L24, L1671–1673).
- Piece E "before" measure: the ten most recent gated pieces, 7/10 first-pass, 23 gate runs (2.30 per node), 4 correction rounds, E1 not merged (L30, L1717–1733).
- Pre-§22 severity counts S1/S2/N per month, lane and size (sections 3a–3d).
- Per-piece table with days "form → closing record" and PR-merge brackets (L1470–1661), and the `*` mark where the last content commit stands in.
- Data-quality counts (L1807–1826):
  - 24 forms with no budget reading.
  - 51 forms with no closing-record amendment heading.
  - 19 PLAN nodes with no form found.
  - 5 PLAN nodes with no PR.
  - 10 reports sharing a gate-log row.
  - "41 of 464 compared" report verdicts that differ from the log.
  - 5 reports with no verdict line.
  - VOID at row 540.
  - Four forms shared by more than one node (L1810).
- The rule catalogue R01–R49 with per-rule source cites, a reviewer/architect split per rule, and Appendix A listings of reports citing the top four rules (L1793–1803).
- Provenance (L3): run about 2749 s active, US$ 20.62.
- Deliverables copied to `/mnt/session/outputs/` (L19). The report embeds the scripts (L34–1449).

**4. Only in the cloud report**
- Measured accuracy of its own heuristics (section 2, L38–56):
  - Inferred-class rule "577 of 797 agree (72%)" (L49).
  - Hand checks on 12 and 8 reports (L50–51).
  - "FAIL reports with a blocking finding read | 146 of 148" (L48).
  - An unmatched-sample judgement (L55).
- Pieces by correction rounds 0/1/2/3+ = 95/52/29/14, and 41 pieces whose last count ended with a FAIL (L67, L70).
- Blocking-finding counts: 408 overall, by month, lane and size (L66 and the tables).
- Pairing of first verdicts, reviewer vs architect: 60 / 19 / 13 / 51 (L141–145).
- Tables by form drafter (L148–155).
- Gate rows by row month with FAIL shares: reviewer 103/179 (58%), 61/192 (32%), 0/7 (0%) (L88–90).
- Days p25 / p75 / max, plus Appendix A with the PRs merged per piece (L206–397).
- Appendix B (reports per rule) and Appendix C (method, L477–484).
- Rule precision per rule (L163–177).
- A per-class split of unmatched findings: C 151, E 57, D 481 (L200).

**5. Coverage and unresolved**
- **Read:** the whole of the platform report (L1–1831, L34–1449 being embedded scripts) and the whole of the cloud report (L1–486).
- **Not read:** the files each report refers to (`state/gate-log.json`, the reports, PLAN, forms, the CSVs and the cloud `data/` JSON). I recomputed nothing from the repository and did not verify either report's figures. My own sums are marked "P's rows sum to". The cloud filing note (L1) is custodian provenance, not part of the cloud report body.
- **Instruction-like text:** none found in either report. Both say nothing below the provenance line is edited or that nothing is decided, which is not an instruction.
- **Unresolved:**
  - The cause of the 15 vs 16 unmapped count: P maps one node via evidence.branch, which would give 15 if C does not map it. Neither report says this, and I did not check.
  - Whether the 209 vs 237 gap is due only to P's 34 pre-§25 files. P's own data-quality item does not say so.
  - The 12 vs 54 vs 53 difference in how pieces are grouped by lane cannot be settled from the reports.
  - Why P's architect first-pass denominator (43 / 90) is below C's (46 / 91): C's `F@a2` marking suggests attempt-2 first rows, but the P script (`gate_log.py`) counts only attempt-1 entries, so P cannot count those rows. This is an inference from the two reports' methods, not stated by either.
  - Neither report states why the September correction-round totals differ, only that the definitions differ.
