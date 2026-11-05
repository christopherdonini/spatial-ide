*Filed by the custodian on 2026-11-05 from an evidence-reader's hand-back (report extraction; its brief brief-cmp-v0-2-drafts.md, sha256 86ba4ee363be3786f585fdf1b202d65a6e137bfb00716155c0b96d313148f085; agent transcript read against it: 16 Read, 2 Grep and the hand-back; run 2026-11-05T14:56:19Z to 14:57:19Z, claude-sonnet-5-5). The hand-back's sha256 is 7f300b3e58f264a4e7af3f17e45cc99008ef027e9e670d9b716e7af0649076ad, one final newline added; unchanged. It compares a platform report with the cloud filing of the same topic and judges neither; the platform report's filing note carries the custodian's reading of it. Its platform line numbers are the advisory file's: in the filed copy each is 4 lines lower (the filing note, a blank line, the rule and a blank line come first); its cloud line numbers are the filed cloud file's. The brief placed the cloud run at 6b67d44b; its branch sits on 84a90e26, a later main commit, and from either commit to 652752af only governance records changed (git diff --name-only, the custodian's check). Its reader did not read the cloud coverage file's per-piece and per-row tables (its section 5 says which lines).*

---

1. **Status:** partial. I read the platform report whole (74 lines) and the cloud release draft whole (377 lines). I read the cloud coverage file at lines 1-236, 684-797 and a grep of its headings. I did not read §3 (lines 237-469, the per-piece table) or §4 (lines 470-683, the per-row table). The two reports are not independent in form. The platform report holds only the advisor's provenance, the agent's narrative, a FILE-block summary of each deliverable and REPORT.md. The full text of its RELEASE-0.2-DRAFT.md and COVERAGE.md is not in the input; the summaries there say so ("summarised in the blocks rather than repeated", line 70). Many per-item comparisons below therefore have no platform counterpart.

**Revision note.** The platform report worked at 652752af and the cloud report at 84a90e26 (6b67d44b in the packet; the filing notes name 84a90e26/7036ca77). Figures that could come from the governance-only changes between revisions are flagged, and none is merged.

**2. Both answer**

1. **Pieces merged since v0.1.0**
   - Platform (line 34): "all 231 first-parent merges since the tag"; "116 product/KL/walkthrough-touching pieces"; "115 others grouped".
   - Cloud (coverage:94-98): "225 pieces merged since v0.1.0"; 95 product code, 68 tests only, 17 operator-facing text only, 45 governance/docs/tooling.
   - DIFFER. 231 vs 225. The platform's grouping into 116 and 115 does not match the cloud's classes (95 and 17 and 68 and 45). The platform's "115 non-product" breakdown is ADR docs 15, release/CI 13, tests/e2e 19, governance 68 (line 43). The packet says the change between revisions is governance-only, so a count of merges could come from it (a count of merges is not a PLAN node count). The criteria also differ, so I cannot say which cause applies.
2. **Walkthrough row count**
   - Platform (line 36): "138 of 205 walkthrough rows"; line 43 gives 205 rows and "67 rows with a run since their last change".
   - Cloud (coverage:100-103): "205 walkthrough rows"; "None has an operator-verified run since its last change"; 93 never run, 112 run then changed.
   - Total AGREE (205). The no-run count DIFFERS: 138 with no run since last change (platform) vs all 205 (cloud). The platform used the row line's own `git blame` commit against the dated result logs. The cloud also counted cited-file and Part-area signals (coverage:30-33). The cloud's 93 never-run plus 45 rows whose own text changed after the run = 138, the same number as the platform's, though neither report says so. The remaining 67 are the cloud's §2d (coverage:205, "67 rows") and the platform's "67 rows with a run since their last change" (line 43). That is a figure match, with different definitions.
3. **Parts with blank result logs**
   - Platform (line 36): "thirteen Parts have blank result logs and no sitting date exists".
   - Cloud (coverage:28): "Every Part written after it has a blank result log". The cloud gives no count in the lines I read. The Parts it lists as never run are P (degrees), Q, R, S, P (points), T, U, V, X, W, Y, Z, AA, AB, AC (coverage:707-721), which is 15 labels. Rows D0 and E4.5 are also listed as never run (coverage:141-142).
   - DIFFER. 13 vs 15 listed Parts. The platform's list is not given, so I cannot reconcile them.
4. **Last dated operator run**
   - Platform: no figure.
   - Cloud (coverage:106): "The last dated operator run is 2026-09-23".
   - Platform counterpart: none.
5. **Release node state**
   - Platform (line 53): "`release-v0-2-0` is `proposed`, with eleven unmet dependencies (`governance/PLAN.yaml:6379-6386`)", and the version is "still `0.1.0`" (`tauri.conf.json:4`).
   - Cloud (release:332-343): a slots table of 8 unmerged scope items. The slots are: milestone 4 PR B and the style-match widening; piece 1c; session-log redaction; the ADR-017 note; B1's close and ADR-023; N1 to N7; the sitting; PORT-2. It gives no count of dependencies and does not mention the 0.1.0 version.
   - DIFFER in detail. The eleven-dependency count, in line 53, may come from the PLAN changes between revisions. The platform names release-node dependencies that include PR #276 and "five of seven clauses untrue at gate 1" (line 53); the cloud's table has no #276 entry.
6. **Three fixes: #241 redaction scan, #252 covering-case collision, #266 integer overflow**
   - Platform (line 34): the three fixes are #241, #252 and #266, with closing-record cites `…BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:922-930`, `…COVERING-CASE-COLLISION-…-FULL-PREREGISTRATION.md:723-736` and `…ADMITTED-INTEGER-OVERFLOW-…:532-553`.
   - Cloud: #241 is item 21, with the form's last amendment at `BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:922` and "no closing record" (release:174). #252 is under item 15 (release:132), the last amendment at `COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md:723`. #266 is F1, with the closing record at `ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md:532` (release:189).
   - Starting lines AGREE (922, 723, 532). DIFFER in label. The platform calls the three "the three fixes" (line 34). The cloud lists #266 under "What was fixed" (F1), #241 and #252 under "What changed" lines 21 and 15, and gives F1 to F8 as the fixes list. The platform's own wording of "closing" for 922-930 and 723-736 may be a range of lines.
7. **The human's words in the notes**
   - Platform (line 54): "Only one line in the draft is already the human's: the O1 (integer-overflow) line, `state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:15`".
   - Cloud (release:7): "Two passages are already the human's own, and each is marked **the human's words, verbatim**."
   - DIFFER. 1 vs 2 passages. The cloud's marked passages in what I read are the title (release:36) and F1 (release:184). The cloud also says item 9's covering sentence "is the human's words" (release:135).
8. **Operator evidence for the three October S1 fixes**
   - Platform (line 55): "#241 has R2 (the human's publish from the installer, 2026-10-26) recorded only in a directive, not in a walkthrough result log; #252 has no walkthrough row; #266's first operator exercise is deferred to the release Part by ruling."
   - Cloud: #241 "no walkthrough row exercises the scan" (release:177). #266: "The clang-cl installer is first exercised at v0.2's artifact walk" (release:191). #252 is not given a row (release:132).
   - AGREE on no walkthrough row for #241 and #252, and on the deferral of #266 to the artifact walk. The platform's R2 on 2026-10-26 has no cloud counterpart. The 2026-10-26 date falls after the cloud's revision; the cloud's rows reference 2026-10-23 and later directives.
9. **KNOWN-LIMITATIONS items 53 and 9 as DRAFT wording**
   - Platform (line 54): "item 53's pins are still "to follow on main" (`:433`)"; DRAFT wording at `KNOWN-LIMITATIONS.md:118, :433`.
   - Cloud (coverage:746, 788): item 9 is "the human's, with a DRAFT sentence appended"; item 53 is "DRAFT, for the human's sight".
   - AGREE on both being DRAFT. The cloud gives no "pins follow on main" text. The line numbers DIFFER: platform :118/:433 vs cloud :114/:117 and :431. The packet says KNOWN-LIMITATIONS bytes did not change, so the difference may be an off-by-one reading rather than a text change.
10. **Stale KNOWN-LIMITATIONS items**
    - Platform (line 57): item 10 ("nothing is remembered") and item 43 untrue when 1c lands; item 15 "an open decision" against 69a; "the unnumbered entry-87 paragraph (`:164-168`) describes the v0.1.0 artifact only"; item 9's polygon-only half superseded by item 31; header and move rule are v0.1.0's.
    - Cloud (release:365-373, 265-266, 372): the unnumbered filter paragraph has no on-main note, though F5 changed the behaviour; item 2 quotes v0.1.0's `engine.crs_undeclared` message; item 9's polygons-only is superseded by item 31 and does not point to it; item 15 is "stale against 69a" (release:265).
    - AGREE on the unnumbered paragraph (164-168 vs 164-167), item 15 and item 9. Platform only: item 10 and 43 untrue at 1c (the cloud notes the same dependency at release:306 and 337, as "nothing is remembered" leaving the list) and the file header/move rule. Cloud only: item 2's message.
11. **Part P duplicate heading**
    - Platform (line 58): "Two Parts are headed "Part P" (`frontends/shell/MANUAL-WALKTHROUGH.md:1457`, `:1616`)"; "P (degrees)" and "P (points)".
    - Cloud (coverage:22): "Two Parts are both headed "Part P" (… :1457 … and :1616 …)"; "P (degrees)" and "P (points)".
    - AGREE.
12. **Scope proposal on Parts Q, R, S, U, V, X**
    - Platform (line 56): "could not say whether Parts Q, R, S, U, V and X are owed, waived or discharged elsewhere (`state/consults/2026-10-23-v0-2-scope-proposal-architect.md:209`)".
    - Cloud (coverage:137, 151): the same cite and the architect's text "Six Parts have blank result logs…: Q, R, S, U, V and X"; "This draft cannot tell."
    - AGREE. The cloud adds that R is handled in §2a through its own node.
13. **Rows changed only in location words (13df4cb5)**
    - Platform (line 56): "Twenty-six older rows changed only in their location words on 2026-10-07 (13df4cb5)".
    - Cloud: rows with last text change `13df4cb5`, #195, 2026-10-07 appear in coverage:159-198 (a count is not stated in the lines I read; listed there: A1, A3, A4, D2, D3, E1, E5, E7, F1, G2, G4, G5, G8, H6, H8, I1, J1, J3, J4, M3, M10 = 21 rows).
    - DIFFER in what I counted: 26 vs 21 listed. I counted lines 159-200 only (the lines 197-198 L1 and L5 are other commits); no further `13df4cb5` rows exist in 201-203. The platform's description says "only in their location words", the cloud's says "Most of these are wording or location edits" (coverage:155).
14. **ADR statuses (ADR-023, ADR-024)**
    - Platform (line 59): "ADR-023 and ADR-024 are Proposed on `main` (`docs/README.md:61-62`)"; the O5 ruling accepts ADR-023 at B1's close and appends the ADR-017 note before the tag, neither done.
    - Cloud (release:339-340, 326): the ADR-017 note is "in progress"; B1's close and ADR-023 is "blocked"; the notes carry nothing "presenting ADR-011, ADR-012, ADR-023 (unless accepted), ADR-024 or ADR-029 as settled".
    - AGREE in substance (both unsettled). The cloud does not state the Proposed status of ADR-024.
15. **KNOWN-LIMITATIONS items edited / digest**
    - Platform (line 34): "the KNOWN-LIMITATIONS digest with each item's wording status".
    - Cloud (release:245-298): a digest of three groups: v0.1.0 items as they stand, on-main items with a wording column, and retired items 18 and 39 and 13b.
    - No figure comparison is possible because the platform's digest is not in the input.
16. **Forms without a closing-record amendment**
    - Platform: none stated.
    - Cloud (release:374): "Seventeen operator-facing or data-path forms record no closing-record amendment" (#45, #53, #64, #78, #81, #93, #102, #112, #116, #141, #201, #206, #207, #214, #241, #252, #273). The cloud text calls whether a closing record is owed "the custodian's call under the record cap".
    - Platform counterpart: none. The platform's cites for #241 and #252 are given as "closing" at lines 922-930 and 723-736 (line 34).

**3. Only in the platform report**
- Run figures: about 1236 s active, US$ 15.79 (line 4). Model: claude-fable-5-1, effort high (line 3).
- The release node has eleven unmet dependencies and cites PR #276 with "five of seven clauses untrue at gate 1, held for the human's words" (line 53). The cite `governance/PLAN.yaml:6379-6386` is the platform's. Any difference from the cloud's slot list could come from the governance-only changes.
- `release-v0-2-0` is `proposed`; version `0.1.0` at `tauri.conf.json:4` (line 53).
- R2: the human's publish from the installer, 2026-10-26, recorded only in a directive (line 55; line 36).
- Item 53's pins "to follow on main" (line 54); the redaction-scan line rests on item 47 but the app's refusal string is a "[P6 placeholder]" (line 54).
- The header and move rule of KNOWN-LIMITATIONS are v0.1.0's (line 57); the entry-87 paragraph describes the v0.1.0 artifact only (line 57).
- The release Part "has no letter yet" (line 58).
- Classification limit: 16 kernel/data-plane pieces mapped as "no row" by reading, not by test (line 60).
- Three proposed nodes: pin items 53 and 9 comments; record R2 in a result log or `RELEASE-0.2.md`; a decision entry on the 26 location-word rows (lines 63-67).
- A note that cost-driven summarising left the two long files out of the report text (line 70).

**4. Only in the cloud report**
- The 225 versus an enumerated list of every piece (coverage §3, lines 231-469, not read) and per-row table (§4, lines 470-683, not read).
- The 2c table of 45 rows run then text-changed (coverage:153-203) and 2d's 67 rows (coverage:205-227), with their queue status. Queue-status disagreements, such as Part Y ("unsettled: node names "Y (Y4)"", coverage:123), Part AB (coverage:126) and Part AC (coverage:127, 132), are cloud-only.
- Rows D0 and E4.5 as never-run setup rows added by #30 (coverage:141-142, 150).
- The seven findings in release §5 (lines 365-376), including: the unnumbered filter paragraph has no on-main note (finding 1); item 2 quotes v0.1.0's message (finding 2); most on-main items still carry DRAFT markers (finding 4: 17, 30 to 38, 40, 41, 51 to 56 plus item 9's sentence); #78 has no PLAN node (finding 6).
- F2 to F8 detail: item 29 bound to the notes; F6 (#78) waits on entry 95's pan re-feel; the F8 table of 11 data-path pieces (release:229-241).
- Five rows (M17, M18, K7, L7, L8, G11, M16) last run 2026-09-14/15 on a dev build of `main` at `74465c0` (release:91; coverage:227). The platform has no equivalent.
- The method's declared-area table is "declared by this draft, not derived" (coverage:33; table at coverage:52-88). The cloud lists what the method cannot see (coverage:46-50).
- Items 48 to 50 are reserved for 1c and do not exist (release:296).
- The e2e suites are named only as a piece class (68 "tests only", coverage:96). The cloud's walkthrough coverage is by Part areas; no e2e coverage claim was in the lines I read.
- Instruction-like text found: none in either report.

**5. Coverage and unresolved**
- Platform report: lines 1-74 (whole). Cloud release draft: lines 1-377 (whole). Cloud coverage: 1-236, 684-797 and a grep of headings. NOT read: coverage lines 237-683 (§3 pieces table, §4 row table).
- The inputs cannot answer: the platform's full RELEASE-0.2-DRAFT.md and COVERAGE.md text (not in the input), so item-by-item changed lists cannot be compared; what the 13 versus 15 blank-log Parts are; why 231 vs 225 merges; whether the platform's 138 equals the cloud's 93 + 45 by construction; what either report found about e2e suite coverage (neither states a figure in what I read).
