*Filed by the custodian: the extraction for the five figures of the advisor's ruling ADV-2026-11-21-20 item 5 (from 2026-11-16 to that ruling), part 1 of 2, rows 767 to 786 of the gate log at ad2088a8, report extraction only, the hand-back of the evidence reader (claude-sonnet-5-5), 24626 bytes, sha256 b88acbb73932373f28829998edd08bbdad69668143435674c7d537441c67c8bf, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Read 20, SubagentHandback 1; errored: 0, from 2026-11-21T14:30:19Z to 2026-11-21T14:32:06Z. The figures are computed by the custodian from both parts and go to the advisor in the next daily batch.*

---

**Status: complete.** All 20 reports (rows 767-786) were read whole, with no truncation. I did not count or compare across reports. I did not list "Drafts", "Checks", "Holds" or "Mutations" sections, because the reports do not call those findings. Where a report's section holds unnumbered bullets, I give one line marked `(unnumbered)`. Titles are cut near 160 characters; the cut points are approximate (typed by hand, not measured). "W" in the last column means the phrase that says words alone close the finding.

Abbreviations: Doc = Documentation; Obs = Observation(s); NS = not stated; NB = non-blocking.

| row | verdict (copied) | finding id | class (as written) | weight (as written) | title (copied) | words alone close it |
|---|---|---|---|---|---|---|
| 767 | **FAIL (one wording finding on the advisor's span; the code is correct and nothing in it needs to change)** | C1 | Correctness | blocking; the words only | The span's clause "and the status bar says at most that some areas were not loaded." When the view is over budget, the bar names the render budget as the reas… | W: "Correctness (blocking; the words only)" and "the advisor rules them" |
| 767 | same | D1 | Documentation | must fix before the merge | Replace `The rest of this comment is the human's approved wording as it stood. Approved in` with `The rest of this comment stands as it was before this change: the… | W: "the worker applies these words with no re-gate" |
| 767 | same | D2 | Documentation | must fix before the merge | Replace `The Table and an export are not said to show the code in the span: the export panel's path was not established to.` (the last clause is ungrammatical)… | W: same phrase as D1 |
| 767 | same | D3 | Documentation | must fix before the merge | Replace `through reportViewportOutcome and formatRefusal in App.tsx` with `through reportViewportOutcome in App.tsx and formatRefusal (frontends/shell/src/adm… | W: same phrase as D1 |
| 767 | same | D4 | Documentation | must fix before the merge | This is the §31 timing case from 3, to be recorded in the source comment. Insert before ` The rest of this comment`: `Not covered (§31c): a tile refused just … | W: same phrase as D1 |
| 767 | same | (unnumbered) | Notes | do not block | Three bullets: the partly-loaded tile case goes to the advisor; the stale-status case needs a run; the drafter's report misdescribes RELEASE-0.1.md:1276 and "byte for byte" | n/a |
| 768 | PASS WITH NOTES | Correctness | Correctness | None | None | n/a |
| 768 | same | Evidence | Evidence | None | None | n/a |
| 768 | same | D1 | Documentation | must-fix before the merge, no re-gate | Both comments claim the -19 clause check checked "each clause". It did not. | W: "The worker applies these words, and the PR body lists them." |
| 768 | same | N1 | Notes | NS (text: "does not block") | "approved by the human's typed message of 2026-11-16 as ADV-2026-11-16-19 item 2" can be read as calling the message itself item 2. | n/a |
| 768 | same | N2 | Notes | NS | Governance CI did not run on this PR. Its `pull_request.paths` filter does not include KNOWN-LIMITATIONS.md, so verify-cites and verify-quotes never ran. | n/a |
| 768 | same | N3 | Notes | NS | The PR is still a draft. | n/a |
| 769 | FAIL | C-1 | Correctness | NS (verdict line: "Correctness FAIL on one finding (C-1)") | After Colour by, a Fill colour change or Reset leaves a status line that says the map is still coloured by the column. | not said (the report says "the re-gate for C-1 is C-1's fix and whatever that fix adds") |
| 769 | same | Evidence (unnumbered) | Evidence | None blocks | Flag 1's run evidence and the packet's §4 path: the report named as the series at 6f95993e … is the series at 6f7e744c. A packet locator error. | n/a |
| 769 | same | D-1 | Documentation | must-fix before the merge | tableSource.ts:44 at N: "a number each `start` changes, 0 before any". The claim is untrue after `end` or `dispose` | W: "each must-fix before the merge, with no re-gate"; "the worker applies my words" |
| 769 | same | D-2 | Documentation | must-fix before the merge | StylePanel.tsx:103 at N: "it cancels a stream it issued and leaves a joined one running". The guard also leaves alone a stream it issued that a later `start` has super… | W: same |
| 769 | same | D-3 | Documentation | must-fix before the merge | App.tsx:2054 at N: "(after One colour, that is none)". An open, a Fill colour change and Reset also make the column none. | W: same |
| 769 | same | D-4 | Documentation | must-fix before the merge | Two class 8 overruns named in the correction worker's report have no class 8 row in Amendments 24-27 as I read them | W: "each must-fix before the merge, with no re-gate" (fix is a record in the closing amendment) |
| 769 | same | D-5 | Documentation | must-fix before the merge | The records step of Amendment 25 items 8-9 has not run at N. | W: same header phrase; fix is "the records worker runs before the merge" |
| 769 | same | O-1 | Observation | NS | Two places answer `unknown-attempt` (for the flag 1 diagnosis, not a finding against PR B) | n/a |
| 769 | same | O-2 | Observation | NS | colour.mjs:38 at N hard-codes the main checkout's fixture path. | n/a |
| 769 | same | O-3 | Observation | NS | The Table's own Cancel (TableTab.tsx:133 at N) and its effect cleanup (:66) cancel a request Colour by made | n/a |
| 770 | FAIL | C-1 | Correctness | blocks | A tile dropped while an Apply's first look is still running leaves the view with no status once the look completes. The scan does end. | not said (fix (a)/(b) "for the advisor to place") |
| 770 | same | Evidence | Evidence | blocks (heading) | None | n/a |
| 770 | same | D-1 | Documentation | must fix before the merge | The TVSM doc claims more than the handler does. | W: "None of these sentences is the human's wording, so the worker applies the replacement words." |
| 770 | same | D-2 | Documentation | must fix before the merge | Records clause, Amendment 1 item 4: KNOWN-LIMITATIONS.md:192 on main. (the human's wording) | not said ("the human answers yes, their own words, or accepted as it stands") |
| 770 | same | O-1 | Observation | NS | The form's W1 cite RB-S1 (App.selection.test.tsx:799) opens a different file (b.parquet), not the same path. | n/a |
| 770 | same | O-2 | Observation | NS | The SR-B3 partial-failure sentence is not cleared on the next plan. | n/a |
| 770 | same | O-3 | Observation | NS | departures from worker report 2 | n/a |
| 771 | PASS WITH NOTES | Correctness | Correctness | None | None | n/a |
| 771 | same | Evidence | Evidence | None blocks | None | n/a |
| 771 | same | D-A | Documentation | must be fixed before the merge ("No finding blocks") | The comment above the match effect, StylePanel.tsx:105-106 at H. ADV-2026-11-18-08 item 3 leaves this comment to the gates. | W: "Each must be fixed before the merge, with no re-gate."; "the worker applies my words below" |
| 771 | same | D-B | Documentation | same | Amendment 28 (the text at <S>/s327e-amendment-28.md, sha256 a79789f5…), its heading and its first sentence. | W: same |
| 771 | same | D-C | Documentation | same | Amendment 28, the rule bullet. | W: same |
| 771 | same | D-D | Documentation | same | Amendment 28, the Mutations bullet. The last bullet cites "Mutation (i)", but no mutation is numbered (i) in the amendment | W: same |
| 771 | same | O-1 | Observation | NS | No recorded mutation reaches PB-U16 (b). PB-U17 (b), Reset during the wait, is not reached by any recorded mutation either | n/a |
| 771 | same | O-2 | Observation | NS | The observations of mutations (i) and (ii) were made on the C-1 fix's StylePanel.tsx: blob 47103ce7 | n/a |
| 771 | same | O-3 | Observation | NS | The commit message of d6da721f says PB-U17's open "leave the waiting line and Cancel". This is untrue for (c) | n/a |
| 771 | same | O-4 | Observation | NS | PB-U16 and PB-U17 carry no OBSERVED AT lines | n/a |
| 772 | FAIL | C-1 | Correctness | blocks | the same as the reviewer's C-1: I concur, by the code. This is the case where a tile is dropped while a reissued first look … is still running. | not said (closure "see the drafts, item 1") |
| 772 | same | Evidence | Evidence | blocks (heading) | None | n/a |
| 772 | same | D-1 | Documentation | must fix before the merge | the same as the reviewer's D-1: I concur. | W: "the worker applies the words with no re-gate" |
| 772 | same | D-2 | Documentation | must fix before the merge | the same as the reviewer's D-2: `KNOWN-LIMITATIONS.md:192` at main 0e4148bf. It is the human's wording | not said (the human's wording; "the human answers yes, their own words, or accepted as it stands" appears in the reviewer's report 770, not here) |
| 772 | same | D-3 | Documentation | must fix before the merge | (new). `tileViewportStreamManager.ts:991 at F` overclaims. | W: same phrase as D-1 |
| 772 | same | D-4 | Documentation | must fix before the merge | (new). The variant's doc at `residencyStatus.ts:112-113 at F` is untrue in one case. | W: same |
| 772 | same | D-5 | Documentation | must fix before the merge (text: "so it does not block") | (new, AUTONOMY §31: a case that needs timing inside one request round trip, named in the source comment). | W: same |
| 772 | same | O-1..O-5 | Observation | NS | O-1 The new branch's `!wasSelfCancelled` is implied by `wasCurrent` … O-5 The reviewer's O-2 … I concur. | n/a |
| 773 | PASS WITH NOTES | Correctness | Correctness | None | None (C-1 is closed) | n/a |
| 773 | same | Evidence | Evidence | None | None | n/a |
| 773 | same | D-1 | Documentation | each must-fix before the merge | Amendment 28, its first sentence … That condition is wrong in two ways | W: "None of them is the human's wording, so none needs a re-gate." |
| 773 | same | D-2 | Documentation | must-fix | Amendment 28, the outcome bullet. | W: same |
| 773 | same | D-3 | Documentation | must-fix | StylePanel.tsx:105-106 at H, the comment above the effect | W: same |
| 773 | same | D-4 | Documentation | must-fix | §7's class 8 rows at the final head | W: same |
| 773 | same | D-5 | Documentation | must-fix | Recorded mutations that fail tests their comments do not list | W: same |
| 773 | same | O-1..O-6 | Observation | NS | O-1 Two comments still name 895d1142 … O-6 Item 4's On-main paragraph (the human's) holds clause by clause at H | n/a |
| 774 | PASS WITH NOTES | Correctness | Correctness (blocks) | None | None | n/a |
| 774 | same | Evidence | Evidence (blocks) | None | None | n/a |
| 774 | same | DA2-1 | Documentation | must fix before the merge | The fix branch's reworded comment claims a little too much. | W: "none of these is the human's wording" (no "no re-gate" phrase in this report) |
| 774 | same | DA2-2 | Documentation | must fix before the merge | A test comment the fix made untrue, outside M1. | not said (text: "this fix needs a class 9 line first") |
| 774 | same | DA2-3 | Documentation | must fix before the merge | A stale count that F introduced. My attempt 1 missed it, and it is outside this attempt's limit. | not said (Draft 2: "recommend … no re-gate (AUTONOMY §31)"; whether carried "is for the advisor") |
| 774 | same | O-1, O-2 | Observation | NS | O-1 A new trigger inside D-5's window, timing inside one request round trip, so it does not block. O-2 For the closing amendment. | n/a |
| 775 | PASS WITH NOTES | Correctness | Correctness (blocks) | None | None | n/a |
| 775 | same | Evidence | Evidence (blocks) | None | None | n/a |
| 775 | same | D-A | Documentation | must fix before the merge | The fix branch's reworded comment … misses a timing case, and one of its clauses overclaims. | W: "the worker applies the words with no re-gate" |
| 775 | same | D-B | Documentation | must fix before the merge | ADV-2026-11-18-09 item 8's new on-main text: one clause does not hold in every case at H. | not said (text: "it goes back to the advisor") |
| 775 | same | O-1, O-2, O-3 | Observation | NS | O-1 The five app-window suites … have not run yet. O-2 G330R2-ORPH … O-3 … redundant by construction | n/a |
| 776 | PASS WITH NOTES | Correctness | Correctness | none | none | n/a |
| 776 | same | Evidence | Evidence | none that blocks | Two conditions remain open before the merge (O-5). | n/a |
| 776 | same | D-1 | Documentation | must fix before the merge | `kernel/tests/project_store.rs:50 at F`. T9's doc says "Expected failure: the first equality." | W: "(must fix before the merge; no re-gate)" |
| 776 | same | D-2 | Documentation | must fix before the merge | `kernel/tests/project_store.rs:143-145 at F`. T13 (b)'s "expected failure: the path that is not Unicode is written" is not what was observed. | W: same |
| 776 | same | D-3 | Documentation | must fix before the merge | Closing amendment, class 8. It needs a row for `project_store.rs` (166 of 140). | W: same header |
| 776 | same | D-4 | Documentation | must fix before the merge | The plan summary on main … names P1b's producers and their consuming pieces, but not the seams' end-to-end tests. | W: same header; fix is "the custodian adds them" |
| 776 | same | D-5 | Documentation | must fix before the merge | What the user is told: the closing amendment states it from the built code. | W: same header |
| 776 | same | O-1..O-7 | Observation | NS (heading: "none blocks"; O-5 says "does not discharge two things") | O-1 Windows may free a lock late after a crash. … O-7 For P3a's consumer | n/a |
| 777 | PASS WITH NOTES | Correctness | Correctness | None | None | n/a |
| 777 | same | T13b (unnumbered) | Evidence | None blocking | Coverage finding, closed by a probe: T13b. | n/a |
| 777 | same | D1 | Documentation | each must be fixed before the merge | The T9 test doc is wrong about where it fails. | not said (heading has no "no re-gate"; "This is not the human's wording" appears) |
| 777 | same | D2 | Documentation | same | The T13 test doc names the wrong failure for (b). | not said |
| 777 | same | D3 | Documentation | same | The `sync_folder` doc is narrower than the code. | not said |
| 777 | same | D4 | Documentation | same | The node's plan summary does not name the seam tests. | not said |
| 777 | same | D5 | Documentation | same | Class 8 goes in the closing amendment (§2.11 / item 6 (b)). | not said |
| 777 | same | D6 | Documentation | same | `mod.rs` has a third region (item 6 (e) stop 2), disclosed by the worker | not said ("the advisor's call") |
| 777 | same | O1..O5 | Observation | not blocking | O1 The lock and T14, for P3a. … O5 My departures from the brief | n/a |
| 778 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | none | none | n/a |
| 778 | same | D1 | Documentation | must fix before the merge | Two doc comments say a not-kept member's file "is not opened": | W: "worker's words, not the human's; applied with no re-gate, and listed in the PR body" |
| 778 | same | D2 | Documentation | must fix before the merge ("record items") | record items for P2's closing amendment, before the merge request | W: same heading |
| 778 | same | O1..O10 | Observations | NS (heading: "none blocks") | O1 I/O errors. … O10 no `Display` test. | n/a |
| 779 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | None / None that blocks | None | n/a |
| 779 | same | D1 | Documentation | fix before the merge | The PR body's count row uses one numstat column. | W: "fix before the merge; no re-gate, AUTONOMY §31" |
| 779 | same | D2 | Documentation | fix before the merge | The PR body does not name the seam tests or the later consumers. | W: same |
| 779 | same | O1..O10 | Observations | NS ("none is wrong under Amendment 31") | O1 Coverage: arm 2's `steps` check is untested. … O10 Nit. K-L5 leaves a 33,554,433-byte file | n/a |
| 780 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | none | none | n/a |
| 780 | same | D1 | Documentation | must be fixed before the merge | `kernel/src/project/resolver.rs:153-154 at H` says a cloud placeholder "is a regular file here and opens (H1)." | W: "no re-gate; not the human's wording, so the worker applies the words" |
| 780 | same | O1..O10 | Observations | NS ("none of them is wrong at H") | O1 `FolderUnresolvable` … O10 readiness. | n/a |
| 781 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | None | None | n/a |
| 781 | same | D1 (a),(b),(c) | Documentation | must-fix before the merge | Sentences that claim more than the code does. | W: "the worker applies these words without a re-gate" |
| 781 | same | D2 | Documentation | must-fix | The `FolderUnresolvable` variant needs a record. | W: same header (fix is closing-amendment/PR-body/packet records) |
| 781 | same | D3 | Documentation | must-fix | Item 5 (f) says CI runs clippy. It does not. | W: same header |
| 781 | same | O1..O6 | Observations | NS ("none blocks") | O1 `NotCanonical` carries a `RefParseError` whose path is `"$"` … O6 On Windows, T1 can only build a link … | n/a |
| 782 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | none / none that blocks | owed at the merge, not at this gate: CI at H, one E-SAVE run, the reviewer's re-observation | n/a |
| 782 | same | D1 | Documentation | must-fix before the merge | The residual in `remove_stale_temps`'s doc is narrower than the code | W: "the worker applies the words with no re-gate" |
| 782 | same | D2 | Documentation | must-fix before the merge | `Staged::commit`'s first sentence lost its qualifier with the link | W: same |
| 782 | same | O1..O8 | Observations | NS | O1 Note 4's row … is true but incomplete. … O8 For the advisor. | n/a |
| 783 | PASS WITH NOTES | Correctness / Evidence | Correctness / Evidence | None | None | n/a |
| 783 | same | D1 | Documentation | must fix before the merge; no re-gate | `kernel/src/project/mod.rs:320-322 at H`, the code comment above the lock. It says the lock is taken "before the first write". That is untrue. | W: "the worker applies these words, with no re-gate" |
| 783 | same | D2 | Documentation | must fix before the merge; no re-gate | `kernel/src/project/mod.rs:23 at H`, the module doc: "No handle is held in a project folder." | not said ("the change is a conflict with that ruling and goes to the advisor"; "If you take it, the worker applies it before the merge with no re-gate") |
| 783 | same | O1..O8 | Observation | no fix asked | O1 ef6d6594 changes no assertion … O8 Masks owed when `<S>/p3a1e-1.md` is filed. | n/a |
| 784 | PASS WITH NOTES | Correctness | Correctness | None | None | n/a |
| 784 | same | E-R1 | Evidence | None blocking (record item) | §4's M-U2g row. The row reads "(g) fails, with two status emits". | not said (fix: "closing records by reference") |
| 784 | same | E-R2 | Evidence | None blocking (record item) | Amendment 4 item 7. Its prediction for M-A4-1 said it would fail after B. The run failed after A | not said |
| 784 | same | D1 | Documentation | must-fix before the merge | candidateArmSession.ts:65-66 at H, the clause "at which point this module calls `establishGridFrame` exactly once, ever, for this session" is untrue at H. | W: "must-fix before the merge, no re-gate"; "the worker applies the words" |
| 784 | same | D2 | Documentation | must-fix | candidateArmSession.ts:84-85 at H: "With no input, that box is the look's own auto-fit" is untrue when a look after an Apply admits no geometry. | W: same |
| 784 | same | D3 | Documentation | must-fix | frontends/shell/e2e/command-bar.mjs:39-40 at H: the header's expected E-AND-b message quotes the old count reading | W: same |
| 784 | same | D4 | Documentation | must-fix | The README's E-FL entry: "(b) the render trace then goes quiet for 3 s within 180 s" is looser than the check. | W: same |
| 784 | same | D5 | Documentation | optional | frontends/shell/e2e/layout.mjs:449 at H: the step's error text still says "after the notch", but the step now drags | n/a (optional) |
| 784 | same | O1..O4 | Observation | NS | O1 Amendment 4's tail reading catches a duplicate or a miss at the second commit or later. … O4 guard (vi) is redundant | n/a |
| 785 | FAIL | C1 | Correctness | named Correctness by the form (report: "The form makes it Correctness by name"); no blocking word beside C1 | E-AND's new reading after card B does not keep "one row per commit". It accepts a commit that records card A's step a second time before its own row | not said (goes to the advisor; fix proposal "mine, not run") |
| 785 | same | Evidence | Evidence | None blocking | None blocking | n/a |
| 785 | same | D1 | Documentation | must fix before the merge | `candidateArmSession.ts:61-66 at H` is untrue (ADV-2026-11-19-01 item 3 (b)). | W: "the worker applies the words and the PR body lists them, with no re-gate" |
| 785 | same | D2 | Documentation | must fix | `candidateArmSession.ts:84-85 at H`: "With no input, that box is the look's own auto-fit" is untrue for a reissued look that admits no rows. | W: same |
| 785 | same | D3 | Documentation | must fix | The block's not-covered note (`candidateArmSession.ts:1487-1489 at H`) omits what the probe in check 7 shows. | W: same |
| 785 | same | D4 | Documentation | must fix | `frontends/shell/e2e/command-bar.mjs:39-40 at H`: E-AND-b's expected failure text no longer exists at H. | W: same |
| 785 | same | D5 | Documentation | must fix | The §4 row for M-U2g says "(g) fails, with two status emits". The second half was never observed | not said (closing amendment cites by reference) |
| 785 | same | K7, Item 67, Scope (unnumbered) | Observation | NS | K7 (ADV-2026-11-19-06 item 7): no, by reading. / Item 67 … / Scope. | n/a |
| 786 | FAIL | (Correctness) | Correctness | None | None | n/a |
| 786 | same | 1 | Evidence | Blocking (Evidence) | the mutation is not yet proven at B. | not said (remedy: run the suite once at B) |
| 786 | same | 2 | Documentation | must-fix before the merge | Wording: "as publish.mjs does" in the doc comment and the README line is untrue, and the residual window is not recorded. | W: "the worker applies the words with no re-gate" |
| 786 | same | 3 | Documentation | must-fix | Wording: the README line says the ref "is set a render after the dialog mounts". | W: same |
| 786 | same | 4 | Documentation | must-fix | an orphaned doc comment. `selection.mjs:564 at 9a4c5833` (`/** Executes the prepared attempt … */`) now sits above `waitForExportDialog`'s comment | W: same |
| 786 | same | 5 | Documentation | must-fix | (the record, not this diff): a wrong line cite in step 1's filed report. | W: same header; fix is a cite in the closing amendment |
| 786 | same | 6 | Documentation | Note, no action on this PR | ADV-2026-11-18-05 item 2 (c) and the form's Change line say "as the publish suite does". The publish suite's wait is the hook alone. | n/a |

**Contradictions, verdict in the report against the verdict in the log column:** none, for all 20 rows. Row 767's report line adds a parenthetical to FAIL. The other verdicts match the log exactly.

**Text asking me to do something:** none. Every instruction-like line is aimed at a worker, the custodian, the advisor or a later reviewer (for example "the worker applies these words with no re-gate"). None is aimed at the extractor. Rows 770 and 786 also contain reviewer-proposed fixes that are addressed to others.

**Coverage:**
- I read rows 767-786 whole, from `C:/dev/wt/sit/` plus the paths in the table. Each file fit in one Read call.
- I did not open any other file.
- Some reports do not put a weight word on every finding. There I wrote the section heading's wording or NS.
- Rows 772, 774 and 785 and some others have findings whose "words alone" status comes from the section header. I have copied that header phrase, not inferred it.
- Observation groups such as `O1..O10` are shown as one line each, with the first and last titles cut. Their count and weight are not computed.

**Unresolved:**
- Row 772 D-2: the report calls the finding "the human's wording" but does not say who closes it. The report 770 text that does say so is in a different report, so I marked row 772 "not said".
- Row 785 C1: the report states no weight word beside C1. It says "The form makes it Correctness by name" and that the verdict "fails on one Correctness finding". Whether that counts as "blocking" is not written in the report.
- Rows 777 D1-D6: the heading says "each must be fixed before the merge" but gives no "no re-gate" phrase, so I wrote "not said".
- Title cuts are near 160 characters. Several titles are marked "…" mid-sentence, so exact-length copying is not guaranteed.
