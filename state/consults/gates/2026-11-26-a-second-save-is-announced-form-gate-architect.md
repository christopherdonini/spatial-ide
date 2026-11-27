Reviewed: the form text a-form-text.txt in the scratch folder, 37137 bytes, sha256 27ef3e0513ec42dbbb6d0e306272559117c5e843d1385d1645bfdf2fe21228ff (the author's draft, on main as `state/drafts/a-second-save-is-announced-form-architect.draft.md` at 1b044372), against the code in the read checkout D:/wt/read-1126c at 7dbf2f3e635db418d4a6cc0c24a66970939eff59 and the documents in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08, read only. This is the custodian's filing note, 2026-11-26: the architect's form gate, attempt 1, node:a-second-save-is-announced@form-gate-architect, under ADV-2026-11-26-17 item 2. Dispatched just before 2026-11-26T20:55:25Z (date -u after the call), with its brief byte for byte (brief-a-form-gate-architect.md in the scratch folder, 5341 bytes, sha256 416505ff). No message was sent to it during the run. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 55 tool uses, 654133 ms, 187701 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T21:07:18Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The scratch folder's full path is written below as `<scratch folder>` (1 place); nothing else is changed, so the filed report is not byte-identical to the saved one (17775 bytes, sha256 55385274). Verdict: BLOCK (B1 to B4, B6), Documentation P5 and D1 to D10; D1 confirmed by the custodian against ADV-2026-11-26-08 item 3 and ADV-2026-11-24-19 item 5; 24 pairs applied by script, giving r2 (40779 bytes, sha256 38e472a3); gate-log row 913.

---

**Verdict: BLOCK.** Reviewed: `a-form-text.txt` sha256 27ef3e0513ec42dbbb6d0e306272559117c5e843d1385d1645bfdf2fe21228ff (the brief's hash; I have no Bash and did not recompute it). Code read at (detached, local, unpushed) @ 7dbf2f3e635db418d4a6cc0c24a66970939eff59 in D:/wt/read-1126c (806ad30843269f8012ec1d89f0224703a8078ad7 merged with 639a96cc25873c99d606b4d75541bd8f3de37543). Forms and docs read at main @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08 in D:/wt/read-1124f.

I blocked on four Evidence findings and two Correctness findings (§22). All six are words in the form and none is the human's wording. No code exists yet.

- **B1 to B4, and the restriction part of B2:** these change what the tests will do, so §31's no-re-gate path does not cover them. The fix is to apply the pairs below exactly, plus one narrow read checking that the applied diff equals the pairs.
- **B6:** this is a sentence only. The custodian applies it with no re-gate, and the PR body lists it.

Every "Old" below is byte-copied from a Read of `a-form-text.txt`, and each occurs once in it (checked by Grep).

## Class
It holds.
- §21a, "any property currently under test" (sub-line, matches line 327 at c28c8cf1): C-A6 at line 511 and C-E2 at line 134 assert the property this piece changes.
- §21c: the piece adds new user-visible behaviour, and §7's estimate is over 150 lines.
- The template's Round 25 (e) and ADV-2026-11-26-08 item 3 both apply as the form says.
- Both form gates hold.

## ADV-2026-11-26-08 item 3, clause by clause (paraphrase)
| Clause | True or untrue, with the form's place |
|---|---|
| After B | True (§9a Order) |
| One node, full form, both gates | True (title, Gating) |
| Base is PR A's head once it has taken PR 365 in | Ambiguous, see D1 |
| PR 366 joins only if `App.tsx` changes, and A merges after them | True (Base, Merge, §8 item 4) |
| Code waits for PR A's reviewer attempt 2 | True (§5 Stops) |
| Must 1, new elements | True (§2.1). The reasoning holds at the tree: `ConditionView.tsx` 58/61 have no key, StudioLayout 388-391 keys the slot by its own id, and `conditions.ts` 156 mints a new id. Not met under OPEN-A6 (a), and the form discloses that |
| Must 2, something true differs | True, within the bounds OPEN-A1 states |
| The leaning, and candidates with their test costs | Partly. (b) and (c) give no test cost, see D3 |
| S-5 not used | True (§2.3, §8 item 3) |
| In-flight control is an OPEN item | True (OPEN-A2) |
| Red before and green after from the real app | True by intent (E-A1). Unsound as written, see B1 |
| AD1's words are the advisor's at the gates | True (OPEN-A3; line 2030 checked) |

## ADV-2026-11-26-15 item 7, and the Merge line
- Not into `release/v0.2`, and v0.2's carriage stays the human's: true.
- The KNOWN-LIMITATIONS sentence of item 6 still stands after item 7: true.
- ADV-2026-11-26-15 item 4 and ADV-2026-11-26-19 item 4 are carried, in §8 item 11.
- Merge commit, never a squash: consistent with Round 25 (d).

## Runs
- ADV-2026-11-26-19 items 2, 3 and 5 are carried. Item 3's list does not name A, so A's unit runs also wait. That is correct, but the citation needs item 3 (D9).
- ADV-2026-11-26-17 item 4 is carried in §6.
- Item 7 refers to ADV-2026-11-26-11 item 1, which I did not read, so §5's "every run holds" is unverified paraphrase.

## Base and §9a
- The base is sound once D1 and D4b are applied.
- Item 3 reads "once **it** [PR A] has taken PR 365's head in". The form's "with PR 365's head merged in by a merge commit" lets a worker make its own merge of 639a96cc onto a PR A head that has not taken it. 7dbf2f3e is exactly such a merge.
- I did not read ADV-2026-11-24-19. The custodian confirms D1's reading against it.

## §2
- **ADR-018:** no duration or progress figure; a time of day is not a duration.
- **ADR-006:** no class changes.
- **Milestone 5's DOM rule (§2.3):** still holds with a key. Each element stays once in the DOM, the strip's top keeps the alert role, and no Problems row carries it.
- **Seams (§2.6):** the interfaces match the tree: `saveProject.ts` 67, `App.tsx` 2249-2257, `ConditionView.tsx` 54, `conditions.ts` 76, and the regex at `e2e/conditions.mjs` 76-82.
- **Portability (§2.7):** sound.

## §4: the red rule and the mutations
- Sound for CV-K1, SP-T1, A-A1 and M-A1/M-A2/M-A3 under (a)/(b) and OPEN-A4 (i). Red at T needs no new export.
- It fails in B1, B3 and B4, and the A-S1 prediction is missing (D7).

## Blocking findings (Correctness or Evidence)

**B1 (Evidence): E-A1 has no readiness wait that behaves the same at T and at P.**
- The hook returns after `handleSaveProject` dispatches, and React can render after that.
- If the step reads at once, P can race and give a false red.
- If the step waits on the change, the way step 1 waits at line 131, T ends VOID instead of red. That breaks §4's red rule.
- Step 1 must also stay unchanged at T.

Old:
```
until the page's clock reads a whole second later than at step 1's successful reading.
```
New:
```
until the page's clock reads a whole second later than the step's own first reading of it, which follows step 1's. Step 1 is not changed at T.
```
Old:
```
Any answer other than `"not-asked"` makes the run VOID.
```
New:
```
Any answer other than `"not-asked"` makes the run VOID. It then reads every 200 ms, within `WAIT_TIMEOUT_MS` (a harness bound on readiness, not a timing), until the held element is no longer connected. That wait throws no `Void`: if the element is still connected at the bound, the not-connected check records FAIL with the last reading, and the step goes on to its other checks, which read after the wait (as milestone 5's Amendment 12, item 3, does for step 4). No wait of this step ends the run VOID on the change under test, so its red at T is a FAIL, never a VOID.
```

**B2 (Correctness): OPEN-A1 (ii) together with (b) cannot pass SP-T2.**
- A count of confirmed saves does not change when a save is refused, so two refusals show the same first line.
- Under (ii), `App.save.test.tsx` line 213 (`NO_VIEW_NOTICE`) also changes, and neither §4 nor I3 lists it.

Old:
```
and AD1's not-saved line changes too.
```
New:
```
and AD1's not-saved line changes too. A count of confirmed saves does not change at a refusal, so (ii) is open only with (a) or (c), or with (b) restated as a count of this open's answered saves; with (b) as drafted, SP-T2 cannot pass.
```
Old:
```
Under (ii), lines 132 and 138 too.
```
New:
```
Under (ii), lines 132 and 138 too, and `App.save.test.tsx` line 213 (S23).
```
Old:
```
searches the recorded base for `SAVED_NOTICE` and its words, and finds a reader outside §0.2.
```
New:
```
searches the recorded base for `SAVED_NOTICE` and its words (under OPEN-A1 (ii), also for `NO_VIEW_NOTICE`, `notSavedNotice`, `FOLDER_HOLDS_PROJECT_NOTICE` and their words), and finds a reader outside §0.2 and §4's list.
```

**B3 (Evidence): under OPEN-A4 (ii), M-A2 cannot fail CV-K1's kept-element half.** That half uses stream-terminal, which carries no key under (ii).

Old:
```
About 2 lines more, and a second rule inside one renderer.
```
New:
```
About 2 lines more, and a second rule inside one renderer. Under (ii), CV-K1's kept-element half raises the save-notice route twice through the real reducer's `raise` with one key, in place of `conditionOn("stream-terminal", …)`: a stream-terminal element carries no key under (ii), so M-A2 could not fail that half.
```

**B4 (Evidence): under OPEN-A1 (c), M-A3 cannot fail a differs assertion.** Whichever fact is mutated, the other still differs, and A-A1 has no template assertion.

Old:
```
Unit-only for E-A1, whose red at T already shows that check failing.
```
New:
```
Unit-only for E-A1, whose red at T already shows that check failing. Under OPEN-A1 (c), M-A3 is two mutations, each applied alone (the clock one, then the count one). The other fact still differs under each, so neither can fail a differs assertion: each is predicted to fail SP-T1 at its template assertion, and A-A1 also asserts its second line against the template at its set clock and count, at P, so that each fails A-A1 there.
```

**B6 (Correctness): an untrue claim of a limit.**
- The form says the time is late "by up to one round trip". `saveProject.ts` 112-114 reads after the `await` with no bound, so the page's handling time is unbounded.
- Clause check of the new words: "after the kernel has answered" matches §2.2 (a) and line 113. "Later by the reply's return and the page's handling" matches the `await` continuation. "No bound" holds: there is no timer at lines 112-121.

Old:
```
so it is at or after the write's end, by up to one round trip.
```
New:
```
so it is after the kernel has answered: later than the write by the reply's return and the page's handling of it, for which the code sets no bound.
```

## Documentation findings: must be fixed before the form is committed

**P5, §1 claims Problems, but §4 tests nothing in Problems.** The form's "only as far as §4 tests it" saves it from being a Correctness finding.

Old:
```
- each save's lines are new DOM elements, in the strip and in Problems, and the strip's element carries the alert role;
```
New:
```
- a save's line in the strip is a new DOM element at each save, and carries the alert role. In Problems, rows are keyed by the condition's id at the base already (`conditions/ProblemsTab.tsx` lines 23 and 27); this piece neither changes nor tests them;
```

**D1, the base.** If ADV-2026-11-24-19 instead has A's branch make the merge, this needs the custodian's correction.

Old:
```
In short, the base is PR A's head at the commit where its reviewer passes its second attempt, with PR 365's head merged in.
```
New:
```
In short, the base is PR A's head at the commit where its reviewer passes its second attempt, once PR A has taken PR 365's head in.
```
Old:
```
- PR A's head at the commit where PR A's reviewer has passed its second attempt, with PR 365's head merged in by a merge commit (ADV-2026-11-26-08 item 3; ADV-2026-11-24-19).
```
New:
```
- PR A's head at the commit where PR A's reviewer has passed its second attempt, once PR A has taken PR 365's head in (ADV-2026-11-26-08 item 3; ADV-2026-11-24-19). Before code, the worker checks with `git merge-base --is-ancestor` that PR 365's head is an ancestor of that commit. If it is not, A's code does not start and A makes no merge of PR 365 of its own: that is a stop to the custodian. The read checkout's 7dbf2f3e is never the base.
```

**D2, a statement about a tool's behaviour without the tool's commit (round 15 (c)).**

Old:
```
`verify-mutation` checks only that a mutation is recorded; it observes nothing.
```
New:
```
`scripts/plan/verify-mutation.mjs` at `a5d8b8b` checks only that a mutation is recorded; it observes nothing (the template's Round 25 additions, mutation-observation wording).
```

**D3, the test costs of (b) and (c) (item 3: "each with what it costs in the tests", paraphrase).**

Old:
```
  - **Cost:** product about 18 lines; no fake clock, no wait in E-A1, and no Portability item.
```
New:
```
  - **Cost:** product about 18 lines; in the tests, SP-T1 and A-A1 by count, and the eight `saveProject.test.ts` sites, `App.save.test.tsx` line 199 and C-A6's three assertions moved to their counts (line 511 at count 2); no fake clock, no wait in E-A1, and no Portability item.
```
Old:
```
About 20 lines more than (a). It closes (a)'s same-second case.
```
New:
```
About 20 lines more than (a), in the product and the tests: (a)'s test costs and (b)'s, and M-A3 as two mutations. It closes (a)'s same-second case.
```

**D4a, §7 has no ceiling for some rulings.** (c) with (ii) comes to about 256 lines, over the 250 ceiling before any code.

Old:
```
- OPEN-A4 (ii): about 2 more.
```
New:
```
- OPEN-A4 (ii): about 2 more.
- Any other ruled combination: the ceiling is 250 lines over 7 files, plus 40 lines for each of OPEN-A1 (c) and OPEN-A1 (ii) ruled, plus 40 lines and one file for OPEN-A2 (b). These figures are fixed now and are not edited after the ruling.
```

**D4b, counting after a merge-in.** Under OPEN-A8 or a join of PR 366, `<base>...<head>` would count the merged-in heads' lines as A's.

Old:
```
`<base>` is §9a's recorded base commit.
```
New:
```
`<base>` is §9a's recorded base commit. Once any head is merged in after the base (OPEN-A2 (b) or OPEN-A8), the count is instead the sum of `git log --first-parent --no-merges --numstat <base>..<head> --` over the same paths, so that no merged-in head's lines count as A's.
```

**D5, the OPEN-A6 (a) gap has no record under (b).** OPEN-A5 is limited to (a) and (c).

Old:
```
under OPEN-A1 (a) or (c): a KNOWN-LIMITATIONS item (adds that file to the records), words in AD1, or neither.
```
New:
```
under OPEN-A1 (a) or (c), and of OPEN-A6 (a)'s gap under any OPEN-A1 candidate: a KNOWN-LIMITATIONS item (adds that file to the records), words in AD1, or neither. Neither holds only while no record, comment or shown string says that a save's line always differs or is always announced.
```

**D6, the Overlap table.**
- The identity route's form at c28c8cf1 adds `App.tsx` by class 9, for the `<AdmissionPanel>` element only. At the tree that is line 2287, two lines above the Save control's 2289-2293.
- By the custodian's fact, B's round-1 draft touches neither the walkthrough nor KNOWN-LIMITATIONS.

Old:
```
PR A and PR 365 (in the base), PR 366 (joins). |
```
New:
```
PR A and PR 365 (in the base), PR 366 (joins), and the identity route (its class-9 Scope addition, the `<AdmissionPanel>` element, two lines above the Save control). |
```
Old:
```
the identity route and text-id (new Parts), B's piece, and the v0.2 result-log pull request
```
New:
```
the identity route and text-id (new Parts), and the v0.2 result-log pull request
```
Old:
```
PR A, the identity route and text-id (item 3), and B's piece.
```
New:
```
PR A, and the identity route and text-id (item 3). By its round-1 draft, B's piece touches neither this file nor the walkthrough.
```

**D7, §5 predicts nothing for A-S1 or SP-T2.**

Old:
```
- CV-K1's kept half is green at both.
```
New:
```
- CV-K1's kept half is green at both.
- Under OPEN-A2 (b), A-S1 is red at T, by asserting that the control's text while the save is held is not its idle label, and green at P. Under OPEN-A1 (ii), SP-T2 is red at T at its differs assertion and green at P.
```

**D8, §1 has no claim for OPEN-A2 (b).**

Old:
```
- no S-5 line and no occurrence count for a save.
```
New:
```
- no S-5 line and no occurrence count for a save;
- under OPEN-A2 (b) only, that the Save project control shows the advisor's busy words while a save is in flight, as far as A-S1 tests it.
```

**D9, §9a's runs citation.**

Old:
```
the tester's one start in the sitting's checkout is filed (items 2 and 5).
```
New:
```
the tester's one start in the sitting's checkout is filed (items 2, 3 and 5).
```

**D10, §0.2.** Line 131 checks whether the text is among the notices (`includes`), not an exact comparison.

Old:
```
(lines 76-82) and compares it exactly at lines 131, 134 and 153.
```
New:
```
(lines 76-82), finds it among the notices at line 131, and compares it exactly at lines 134 and 153.
```

## OPEN items: whether each option is sound
- **OPEN-A1:**
  - (a) is sound, but it leaves item 3's second must unmet in a case ordinary use reaches: a double-click inside one second, which is the form's own bound. The form holds only with that bound recorded (OPEN-A5).
  - (b) is sound and has no gap within one open.
  - (c) is sound once B4 is applied.
  - (i) is sound. A repeated refusal shows the same words, and the form discloses that.
  - (ii) is sound with (a) or (c). It is unsound with (b), see B2.
- **OPEN-A2:** (a) is sound. (b) is sound once D7 and D8 are applied: it needs PR 366 merged in, the 290/8 ceiling, and the identity route's line next to it (D6).
- **OPEN-A3:** sound. AD1 at line 2030 is untrue under every candidate, as the form says.
- **OPEN-A4:** (i) is sound. It also makes a re-raised record notice or viewport refusal a new alert element, and H2 and the whole vitest run cover that. (ii) is sound once B3 is applied.
- **OPEN-A5:** sound once D5 is applied.
- **OPEN-A6:** (a) is sound once D5 is applied. The form does not hold under (b): (b) changes `conditions.ts` and milestone 5's ruled order (§2.2), so it needs a ruling and a class-9 addition, not this form.
- **OPEN-A7:** both options are sound. Under (a), the extra launch waits under ADV-2026-11-26-19.
- **OPEN-A8:** sound once D4b is applied.

## §8, item by item
- Items 1 to 12 are consistent with §1, §2 and §4.
- Item 9 also binds E-A1 at P: it matches the line by the template's fixed words, never by a time written into the test (I7).

## Notes (not findings)
- §2.1 also keys the session-ended root. No test checks that key, and no claim rests on it.
- `"not-asked"` from the hook also covers a save with no view. If that happened, its predicted failure would not match, and it would go to the advisor. It cannot produce a false pass.
- `saveProject.test.ts` line 65 (A) and line 70 (the identity route and text-id) are separated by four unchanged lines, so A takes main in after them.
- No ADR is missing, so there is no skeleton.

Files: <scratch folder>/a-form-text.txt; D:/wt/read-1126c/frontends/shell/e2e/conditions.mjs; D:/wt/read-1126c/frontends/shell/src/project/saveProject.ts; D:/wt/read-1126c/frontends/shell/src/conditions/ConditionView.tsx; D:/wt/read-1124f/governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md; D:/wt/read-1124f/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md
