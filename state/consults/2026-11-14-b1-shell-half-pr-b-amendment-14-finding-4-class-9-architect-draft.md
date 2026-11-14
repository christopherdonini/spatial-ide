*Custodian's filing note (2026-11-14): the architect's draft of Amendment 14 to PR B's form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`), the publish approval consult's finding 4 as a class 9 declaration, read only at main 54ee3522, from its brief by file (5593 bytes, sha256 89d7f3186931ae4893d38f5da586cb2594e1e353748517abebaf91daa8e6d42f). Dispatched at 2026-11-14T04:57:28Z by its transcript; handed back at 2026-11-14T05:05:25Z (claude-opus-5-5, architect; calls Read 29, Grep 12, Glob 4 and the hand-back, 46 in all; none errored; no write). The draft below was extracted by script from the hand-back in that transcript (16714 bytes, sha256 2760ee874ccc2cd7e6f34d8b2c9ebc940e0ed05e6e9885785d88ca48a2ca8413). One change, the custodian's: on its line 132 the scratchpad folder's path is written as <the custodian's scratchpad>. Its 20 `sha256:<H>` placeholders are left as drafted; the form's Amendment 14 fills them by script when it is committed. Since this draft, the advisor's ruling ADV-2026-11-14-10 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-10-pr-b-code-waits-pan-anchor-re-run-at-m-prime-in-a-shared-hold-first-amendment-14-to-main-meanwhile.md`) has made PR B's code wait for pan-anchor's re-run at M′ and found no objection to the draft's three OPEN items.*

---

Draft only, no verdict. This is a read-only drafting consult, not a gate. Reviewed main @ 54ee3522bfd2865637575802d267ca6746d2fd59. I also read PR B's branch cut/b1-shell-half-pr-b @ 6649a443a38763759339c7813e3fdbe9eca09be0.

I read the brief whole with the Read tool. That tool shows neither a byte count nor a sha256, so I did not check the 5593 bytes or the hash. I wrote no file and changed nothing.

````text
## Amendment 14: the publish approval consult's finding 4. PB-E2 gains the columns-line assertion and operator row 5 gains its expected outcome (class 9), each declared before any code of it. Main is merged into PR B's branch before that code. PR B's run alone is owed. Written by the custodian before any code of PB-E2 or row 5.

*Drafted read only by the architect at main 54ee3522bfd2865637575802d267ca6746d2fd59, with PR B's branch read at 6649a443a38763759339c7813e3fdbe9eca09be0 (`state/consults/2026-11-14-b1-shell-half-pr-b-amendment-14-finding-4-class-9-architect-draft.md`). The custodian's script fills each `sha256:<H>` with the sha256 of the cited whole lines, each with its LF, at 54ee3522. References only. The one quotation is the reuse index in item 7, byte-copied from the custodian's brief and marked so. The string in items 1 and 2 is the composer's output, copied from the code literal at the pin in item 1; it is not a quotation of the human. §7 is not edited.*

1. **PB-E2's added assertion (class 9).**
   - Authority: item 4 (c) of the human's third message of 2026-11-12, `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:21` @ 54ee3522 sha256:<H>. Placed here by ADV-2026-11-14-06, item 5 (b) (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-06-findings-node-open-1-b-the-g3-style-hash-clause-the-judge-sentence-unchanged.md`). The class is read as in `governance/forms/frontends/PUBLISH-APPROVAL-CONSULT-GATE-FINDINGS-PREREGISTRATION.md:95-98` @ 54ee3522 sha256:<H>.
   - Where: PB-E2's step in `frontends/shell/e2e/colour.mjs` (new; already on §2.6's PR B list), with `filter-zoned.parquet` coloured by `zone`.
   - What it asserts:
     - (i) The prompt that the dev seam `publishPrepareWithDestination` returns has `published_columns` equal to `Columns published: id, the geometry, and zone.`, the literal at `frontends/shell/src-tauri/src/publish.rs:1945-1948` @ 54ee3522 sha256:<H>.
     - (ii) The open dialog's `.publish-dialog-columns` element has the same string as its textContent. The suite waits for the element the way it waits for its other DOM reads.
     - (iii) After execute, the names in the manifest's `schema` after its first two entries are exactly `["zone"]` (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:228-229` @ 54ee3522 sha256:<H>).
   - The code on main that it is written against:
     - The seam: `frontends/shell/src/publish/PublishPanel.tsx:472-474` @ 54ee3522 sha256:<H>, `frontends/shell/src/publish/client.ts:132` @ 54ee3522 sha256:<H> and `frontends/shell/src-tauri/src/commands.rs:581-583` @ 54ee3522 sha256:<H> (debug builds only).
     - The attributes vector, which goes into the request and into the stash: `frontends/shell/src-tauri/src/publish.rs:592-597` @ 54ee3522 sha256:<H> and `frontends/shell/src-tauri/src/publish.rs:711` @ 54ee3522 sha256:<H>.
     - The composer and its one call: `frontends/shell/src-tauri/src/publish.rs:322-331` @ 54ee3522 sha256:<H> and `frontends/shell/src-tauri/src/publish.rs:697` @ 54ee3522 sha256:<H>.
     - The member: `frontends/shell/src/publish/types.ts:48-51` @ 54ee3522 sha256:<H>.
     - The render: `frontends/shell/src/publish/PublishDialog.tsx:261-264` @ 54ee3522 sha256:<H>.
     - The precedent, E1 of APPROVED': `frontends/shell/e2e/publish.mjs:363-369` @ 54ee3522 sha256:<H> and `frontends/shell/e2e/publish.mjs:379-383` @ 54ee3522 sha256:<H>.
   - Mutation M-PB-E2c:
     - The change: in `publish.rs`, the argument of the composer call (pin above, line 697) goes from `&attributes` to `&[]`. It is applied alone in the working tree, the debug exe is rebuilt, and `colour.mjs` is run.
     - Predicted: PB-E2 fails at (i) with the no-attributes line. Its other assertions pass: `style.json` carries the match, `zone` is published, (iii) holds and the viewer draws the same colour. They pass because the request and the stash still carry the vector.
     - Observed as §4 says, then reverted. It is never committed: `git diff origin/main...HEAD -- frontends/shell/src-tauri` stays empty (§8 item 1). Its RECORDED MUTATION line sits above the assertion. The closing record names that line with its branch commit id and pins no hash at a branch commit (round 25, item 2). A `verify-mutation` run is not an observation.
   - Reading of §4's existing PB-E2 mutation (class 1): its text says to send the literal document to `publishPrepare`. It is read as applied to the seam's document (PublishPanel pin above), which is the path `colour.mjs` drives. A mutation at the dialog-free `publishPrepare` path would not reach PB-E2.
   - Lines and ceiling (class 9; §7 not edited; counted by §7's command):

     | Addition | B-E |
     |---|---|
     | PB-E2's columns-line assertion and its RECORDED MUTATION line: `colour.mjs` +20 | 20 |

     - New totals: B-E 590, and PR B 4,450, or 4,530 with Amendment 12 item 13's conditional entry. An overrun is class 8.
   - The seam (round 4): this is the approval seam's end-to-end test from the real shape. It reads the payload the shipped `prepare` serializes, the dialog the shipped component renders and the manifest the kernel writes. §8 item 17's export seam stays PB-E2.

2. **Row 5's added expected outcome (class 9, records).**
   - §9's operator row 5 gains this prediction: with `filter-zoned.parquet` coloured by `zone`, after Export, the approval dialog's field list shows `Columns published: id, the geometry, and zone.` directly after Row scope, before the irreversible warning (render pin in item 1). A wrong prediction is class 2 (§5).
   - Words: AC5's walkthrough words are written from the built code with Part AC's rows at PR B's records commit (Amendment 12 item 7). They are the advisor's wording, under the delegation of 2026-11-13 (the grant, items 2 and 3, `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`). Both gates check each clause.
   - Count: outside the count, within §7's MANUAL-WALKTHROUGH.md 160. The row goes to the sitting with Part AC when PR B merges (§9, Operator).

3. **The consult, and what the change means for the approval.**
   - The consult: `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md`. Finding 4 is at `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md:145` @ 54ee3522 sha256:<H>. It is a reading, not Authority.
   - What it means (the architect's paraphrase):
     - With PR B, a Colour by makes the shell's document carry a match on `fill_color` (§2.3 (a) and (b); PR B's code, not on main). The host derives that one match column (`frontends/shell/src-tauri/src/publish.rs:1299-1307` @ 54ee3522 sha256:<H>) into the request the kernel publishes from (pin in item 1). Every partition then holds that column's values (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:118` @ 54ee3522 sha256:<H>).
     - The approval's columns line is composed from that same vector and rendered as it is in the dialog (item 1's pins). So the operator sees the column's name before typing the phrase. The class-3 approval, its grant, phrase and audit are unchanged, because §2.1 keeps PublishDialog, PublishPanel and `publish.rs` unedited.
   - Left open: a column name is shown as it is, so a name containing `, ` reads as more than one name (`frontends/shell/src-tauri/src/publish.rs:320-321` @ 54ee3522 sha256:<H>). The choice between that form's OPEN-2 (b) and (c) (`governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md`, Amendment 1 item 2) is the advisor's at PR B's records commit. Item 59's re-read (item 4 (c)) happens at the same commit.

4. **What happens first: main is merged into the branch (class 1).**
   - Why: the branch at 6649a443 is older than #314's merge, and no file of it under `frontends/shell` names `published_columns`. Item 1 is written against main's interface.
   - How and when: main is merged into PR B's branch by a merge commit, never a rebase. This comes before any code of PB-E2, and before the colour-by phase's first code commit, so that the phase's code is written at one base.
   - The order:
     - (1) this amendment on main;
     - (2) Amendment 12 item 10's re-read over PR B's whole amended list, by script, at the main commit the merge brings in, recorded where OPEN-1 places it;
     - (3) the merge commit, which names that main commit and is a named merge of main for §7's count;
     - (4) the colour-by phase's code, with item 1 in PB-E2.
   - Rule (00) is checked again at the merge. Item 1's mutation is never committed, so it adds no path.

5. **PR B's run alone is owed.**
   - Pan-anchor's run alone on the machine has not been made (`state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md`, its item 3). ADV-2026-11-14-07 (`<its path on main>`), items 3 and 5 (b): nothing of PR B goes to a gate without it.
   - Some lines of this form, read as written, may make the next phase's code wait on that run: Amendment 12 item 11's I3 sentence, §5's I3, Amendment 12 continued item 6, and Amendment 13 item 4. They go to the advisor under that ruling's item 5 (c). This amendment does not resolve them.
   - What stands meanwhile: items 1 and 2 are declared, and their code waits for the advisor's ruling.

6. **Amendment 13 item 4's list.** Amendment 13 is not edited.
   - Carried here (class 3, the tree authoritative):
     - `pick.ts`'s comment pin, Changed by PR B's own commit 0b247f29, which is named by its id and not pinned.
     - Item 7's number 64. Whichever of KL-3 and the first-look item merges first takes it. PR B's references are re-read at its records commit (the human's third message of 2026-11-12, item 3 (b)).
   - Moved to the amendment after the run alone:
     - the series at M′, read with that run;
     - the session-end phase's class 8;
     - item 2 (a) of the human's message of 2026-11-12 (13:07Z), together with the KNOWN-LIMITATIONS item 4 pin. f56d6efe has already rewritten that item's On-main paragraph (`state/consults/2026-11-13-b1-shell-half-pr-b-re-read-at-m-prime-worker-report.md`, Step 2).

7. **The reuse index**, byte-copied from the custodian's brief. It is the custodian's run in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-14. All three are misses, and this amendment rests on the tree at 54ee3522 alone.

```text
$ node tools/reuse.mjs approval columns line e2e assertion   (exit 1)
No prior art recorded for "approval columns line e2e assertion". Research it before planning an implementation.
$ node tools/reuse.mjs publish bundle category column approval   (exit 1)
No prior art recorded for "publish bundle category column approval". Research it before planning an implementation.
$ node tools/reuse.mjs operator row expected outcome approval   (exit 1)
No prior art recorded for "operator row expected outcome approval". Research it before planning an implementation.
```

**Superseded for PR B:** Amendment 13 item 4, read as the whole content of Amendment 14 (item 6).

Read the last amendment first.

Nothing above is edited.
````

## Item 5: the readings for the advisor

This is the architect's reading, unresolved. Form lines are at 54ee3522 (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`); series-report lines are in the report named in item 5. For each line I say whether, read as written, PR B's next code waits for the run alone.

1. **Amendment 12 item 11: the "before code" lead (:1730) and the I3 sentences (:1740-1742).** Yes: the code is stopped, or it waits.
   - Read literally, I3 is met. Pan-anchor failed again in a re-run inside its own hold, on the same case with the same residual, and no harness cause was seen (report :134-143). So the item "stops code". Nothing in item 11 names a run alone as what lifts the stop.
   - The other reading comes from the machine rule (report :1): both runs were in shared holds at 99 to 100% load, so neither was a run alone, and the code waits for one.
2. **§5 I3 (:569), with "stop and report" (:565).** Same as reading 1. Pan-anchor is an existing e2e that failed for a reason other than a selector change, and the failure was reported. Item 11 gives the base series' definition.
3. **Amendment 12 continued, item 6 (:1855-1859).** Yes, it waits. The rest of PR B's code follows the record of any difference between the two series: pan-anchor passed 16/16 at M″ and 15/16 twice at M′ (report :83-84, :144). Amendment 13 item 4 (:1875) ties that record to the run alone.
4. **Amendment 13 item 4 (:1875).** On its own it has no wait sentence; together with reading 3 it does. The draft moves the series to a later amendment, and that does not lift reading 3.
5. **Amendment 12 continued, item 5 (:1853).** No. It binds the session-end phase only, and that phase's code has landed (0b247f29).
6. **Amendment 12's settlement, item 5 (:1817).** No wait beyond reading 1. The series has run.
7. **Amendment 12 item 10's last bullet (:1728).** No. Amendment 13 met it.
8. **§9's suites, "green first" (:668-670).** This binds the gate, not code. ADV-07 item 5 (b) already holds the gate.

## OPEN items

- **OPEN-1: where the re-read at the merge is recorded (item 4, step 2).**
  - (a) By script at the main commit just before Amendment 14, recorded in Amendment 14 as a slot the custodian fills. Amendment 12 continued item 3 is the precedent. It is done again if any path outside governance/, state/ and site/ changes before the merge.
  - (b) After the merge, in Amendment 15, before PB-E2's code.
  - (c) No re-read. This breaks §0.3.
  - I recommend (a): it saves one record before code.
- **OPEN-2: what e2e runs at the merge.**
  - (a) Nothing before code. The gate's head series covers it, and #314's paths are outside PR B's list.
  - (b) `e2e:publish` alone, in a shared hold.
  - (c) The full series again.
  - I recommend (a), if #314's reviewer gate report shows every suite run at its head, as its form's §9 requires. Otherwise (b). (c) does not interact with the run alone.
- **OPEN-3: how M-PB-E2c is observed.** Observing it in the e2e needs a debug-exe rebuild with `publish.rs` mutated, which is a heavy run.
  - (a) In the e2e, as M-E1 was on main.
  - (b) If the machine rule prevents it, the record says the mutation was not observed in the e2e. M-U1 at main covers only the host half, so this goes to the advisor as an Evidence gap.
  - I recommend (a).

## Findings (Documentation, must fix before the amendment commits)

- **D1.** ADV-2026-11-14-07 is untracked, at `<S>`. Under round 14's standing rule, nothing tracked may cite an untracked file as Authority. File it on main first and fill `<its path on main>`.
- **D2.** The pin `PublishDialog.tsx:261-264` @ 54ee3522 shifts by +1 once the findings node's §B (three lines become four, at lines 169-171) merges. The pin is historical, and the tree at the merge is authoritative.
- **D3.** The brief's "§2.5's PB rows" are §4's table rows (§2.5 holds the class A and C rows). I read §4.
- **D4.** The exclusion in §7's count command names `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, which no longer exists. It changes no count, because governance/ is outside the counted paths. §7 is not edited, so this is noted, not fixed.
- **D5.** M-PB-E2c touches `src-tauri` and the existing PB-E2 mutation touches PublishPanel. Both are on §8 item 1's or §2.1's no-edit lists. Item 1 says neither is committed, and the gate checks the empty diff.

Files: `C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, `C:/dev/spatial-ide/frontends/shell/src-tauri/src/publish.rs`, `C:/dev/spatial-ide/frontends/shell/e2e/publish.mjs`, `C:/dev/spatial-ide/frontends/shell/src/publish/PublishPanel.tsx`, `C:/dev/spatial-ide/frontends/shell/src/publish/PublishDialog.tsx`, `C:/dev/spatial-ide/state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md`, `<the custodian's scratchpad>/adv-2026-11-14-07.copy.md`.
