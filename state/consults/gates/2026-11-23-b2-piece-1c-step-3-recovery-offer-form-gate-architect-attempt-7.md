Reviewed: main at f0718827995eaff5673b0cb4e1a52bdbb2a5ce44, in the detached read worktree C:/dev/wt/read-1123af (the custodian's filing note, 2026-11-23: the architect's form gate reading Amendment 10 alone, attempt 7, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-7, dispatched at 2026-11-23T22:24:19Z; its run: Grep 28, Read 26, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T22:24:22Z to 2026-11-23T22:38:34Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 19666 bytes, sha256 40aadff6d4ee51e4063ae32d58696997a0b1e4ef521a9db6f4fc9c95a32e9e06, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: Amendment 10, read alone with Amendments 9 and 11 (ADV-2026-11-23-29 item 3), does what that ruling's items 1 to 11 ask; each part ships whole; the ceilings add up; no Correctness or Evidence finding; five Documentation findings, N-37 to N-41, to be fixed before the merge, N-41 on the ADR-036 note's draft, whose words go to the advisor; the sha256 values of Amendment 11 left for the reviewer to recompute; recommendations to the advisor on Amendment 10 item 11 (i) to (iv), lead-data's question and K-C34.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123af @ f0718827995eaff5673b0cb4e1a52bdbb2a5ce44

This is the architect's form gate, attempt 7, tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-7`. It reads Amendment 10 on its own (ADV-2026-11-23-29 item 3), together with Amendments 9 and 11. In this report, "form" means `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, and "ruling" means `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-…-a-to-h.md`. Every cite is at f0718827. None of the sentences discussed is the human's wording. The form's sentences are lead-data's draft, so under §31(d) the worker applies my words and no re-gate is needed. The ADR-036 note's draft is different: its words are the advisor's to rule (ruling :28), so my words for it go to the advisor and the worker does not apply them.

**In one line.** Amendment 10 does what ruling items 1 to 11 ask and nothing more. Each part ships whole. The ceilings add up. There is no Correctness or Evidence finding. Five Documentation findings (N-37 to N-41) must be fixed before the merge.

## Amendment 10 against the ruling
- **Items 1 and 2 (:11, :13-20).**
  - Part 1 is the writer item first and then the three commands at one literal (form :2003-2007).
  - Under Part 1, a project's record with nothing after its last mark is not listed (:2010).
  - Part 2 is Amendment 4 items 2 and 3 with the operator Part whole (:2081-2089, :2123).
  - The gates' diffs, the order, the non-waiting build, the forward-merged corrections, one PR and one merge all match (:2149-2163).
  - Part 2's edits of Part 1 lines are confined to SKP-V0 §13-15, K-C9 and the open's step and the two call sites in `recovery.rs` (:2164-2168). The ruling's bullet names only SKP-V0 and K-C9, but product code is under no append-only or I3 rule, so this is not a departure.
  - The ruling's list of tests that rest on their mutations was "by lead-data's view". Adding K-C40, which came later (Amendment 7 item 3), is within that.
- **Item 3 (:22).** The amendment gives each part's files, tests and ceilings. The ceilings sum to 5,530, and it says by how much the counts may pass that and why (but see N-39).
- **Items 4 to 11** are recorded by item at :1992-2001 and not restated.

## Each part ships whole
- **Part 1.**
  - Every command has its full caller chain: handler, `generate_handler!` registration, client wrapper, `RecoveryOffer`/`handleRecovered` (:2034-2039).
  - E-RECOVER drives that chain from the real shape.
  - Every kernel item has a Part 1 product caller (:2040-2049). I checked the writer's: `record_step` → `create` (`kernel/src/session_history.rs:319`) → `write_record` (:490), served by `frontends/shell/src-tauri/src/commands.rs:160-172` and registered at `lib.rs:556`.
  - `LOCATIONS_LIMITS` is private today (`kernel/src/project/store.rs:54`), as declared.
- **Part 2.** It adds no `pub` item, command, field or literal (:2099-2106). Its two private functions are called from Part 1's three commands, which already have their shell callers.
- **SKP-V0 §8.** The §8 entries record field sets (`protocol/skp/SKP-V0.md:1129`, :1138, :1160), so Part 2 leaving the version's entry alone is right. Append-only is read against main (:576-577), where every §13-15 line is new at the merge.
- **Nothing between the parts reaches main**, because there is one merge. H1's state is named at :2073-2078, including item 43's now-false clause at H1.

## Tests by part, against the code
- **The rows add up.** Part 1 has K-C1-8, K-C9 v1, K-C10-27, K-C36-38, K-C41, P-1, T-1, S-1-8 and E-RECOVER. Part 2 has K-C9 v2, K-C28-35, K-C39 and K-C40. That covers all 41 K-C rows.
- **Red at H1, by behaviour, holds for each Part 2 row that claims it:**
  - K-C9: the record stays, and the save's `create_dir` refuses the existing folder (`session_history.rs:551`), so no mark is written.
  - K-C30: `recover_bytes` keeps only the prefix before the first failing line (:1284-1291), so at H1 the kept lines end at the mark and the record is not listed.
  - K-C31 to K-C33: no twin is removed.
  - K-C39: the folder stays.
- **The five rows that pass at H1 do pass there:**
  - K-C28: `WouldBlock` means nothing is listed.
  - K-C29: there is a step after the mark, so the record is offered.
  - K-C34: no twin search exists at H1.
  - K-C35: with R gone, the dedupe finds no candidate, so U is listed.
  - K-C40: an absent folder means nothing is listed.
- **Each of the five mutations fails at H2:**
  - K-C29, K-C35 and K-C40 fail on every system.
  - K-C28 fails on Windows (H1) and on macOS/Linux (H3).
  - K-C34 fails on macOS/Linux only (:1468).
- **Is the exception sound?** The red-before-code rule is the form's own §4 heading (:269). Its exception is declared before code (:2142) and ruled (ruling :20). §31 does not govern it: it is not a wording matter (`governance/AUTONOMY.md:544`). The template's rule is one recorded failing mutation per new test (`docs/PREREGISTRATION-TEMPLATE.md:63-64`). Four rows meet that at H2. K-C34 meets it only once the deferred macOS/Linux run is done (ruling :36). Placing these rows in Part 1 would give them a red at B by compile only, which proves nothing about the behaviour they pin, so the exception costs no real evidence. One consequence to keep in view: **at the merge K-C34 has no failing observation on any system.** That is within the ruling (:20, :36), but see the recommendation below.
- **K-C9 by part (:2316-2319).** It is sound. Part 1's mutation ("mark not considered") gets the record offered, so the row fails. K-C9 is the only Part 1 test Part 2 edits.
- **K-C36's reworded mutation (:2313)** is true provided Part 1 checks the later-version rule first at an open (N-37). At H2, the mutated record passes every clear condition (:929-933), so it is cleared.
- **Mutations repeated at H2.** K-C36 and K-C41, plus any Part 1 row whose mutated line Part 2 changes (:2112-2115). This is sufficient.

## The Old and New pairs of item 8
- **Old texts.** Each of the 8 occurs exactly once above Amendment 9: :16, :43, :300, :305, :764, :979, :1219 and :1681, each as part of a line. None sits inside N-34 to N-36's Old texts (:1835, :1878).
- **New texts.** I searched a distinctive span of each of the 9 (eight New texts and the note). Each occurs only inside Amendment 10 (:2215, :2229, :2243, :2257, :2271, :2285, :2299, :2313, :2330). This is a search, not a full byte comparison.
- **Truth against the code and the form.**
  - The §14 correction (:2274-2285) is right: the §10.3 draft puts the restore in §14 (:118).
  - ADR-036 uses "Note" as a heading distinct from "Amendment", so "none is amended" stays true (as in ADR-035:160).
  - The other New texts are true against Amendment 10 items 2 to 5.
  - No new fault, except N-37 and the build notes below.
- **Pins I could not check (I have no Bash):**
  - Both sha256 values in Amendment 11 item 3 (`protocol/skp/SKP-V0.md:576-577` and `:314-319` @ 55969f98).
  - The hand-back's sha256 in Amendment 11 item 1.
  - The span ranges themselves resolve as cited: :576-577 is the append-only sentence, and :314-319 holds conditions (i) to (iv).
  - Rev 55969f98 is on main.

## Ceilings (AUTONOMY §21a to §21c)
- **The arithmetic is right.** Part 1 is 4,670 and Part 2 is 860, which sum to 5,530. Each group's two figures add up to the figure §2.11 now carries: 350, 220, 260, 1,160, 1,980, 100, 500, 500, 300 and 160.
- **Full gating holds for each part.** Part 1 touches the wire. Part 2 touches a guarantee and appends an ADR note. Both are past §21c's bounds (:350).
- **Files.** At f0718827 the literal is in 29 files (125 occurrences), and neither `KNOWN-LIMITATIONS.md` nor `MANUAL-WALKTHROUGH.md` is among them. My union of §2.11's groups is 46, so 47 with ADR-036 and 44 for Part 1. That is under the amendment's 48 and its "at most 45". The base B may change these counts.
- **The double count.** See N-39. It is understated on the literal reading.

## The ADR-036 note's draft
- **Its three items are those ruling item 6 names.** Its section cites resolve: ADR-036 :209 (the bullet on when a history is cleared), :272 (Amendment 1 item 5) and :206 (the bullet on a session that never saved). Its italic line follows ADR-035's precedent.
- **Item 1** is true against Amendment 4 item 2 steps 1 to 3 (:927-933). It says the record is cleared if no running session holds it. In fact another window's listing can also hold its lock for the length of one listing, and then the record is not cleared (:953). That needs timing inside one request round trip, so it is named here and does not block (§31(c)).
- **Item 3** is true against Amendment 4 item 4 (:1018-1024) and N-19 (:1510).
- **Item 2, and item 3's last sentence:** N-41.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge; none blocks)

**N-37. Part 1's rule at an open does not say that the later-version judgment comes first** (form :2010).
- K-C36 is a Part 1 row. Its fixture (:1681, as extended at :1808) needs a project's record with a `restored` mark and a `saved-here` mark after its last step to be listed `later-version` at H1.
- Amendment 10's own K-C36 text (:2313) assumes the same order.
- As written, :2010 would leave such a record unlisted.
```text
A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed).
```
```text
A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed), unless its header's `actions` is over `ACTIONS` or its kept lines hold a `restored` mark: such a record is listed `later-version` with Discard only (OPEN-4 (B); Amendment 4 item 7), as K-C36 asserts at an open.
```
- **Clause check.**
  - A `restored` mark gives `later-version` "at a start and at an open" (:1183).
  - `actions` over `ACTIONS` gives `later-version` (:499).
  - At H2 both cases fail the clear (:930, :932) and are listed (:940-941), so the two parts agree.
  - A refused `locations.json` is left out of the new words on purpose: the clear names no `locations.json` condition (:929-933), so the parts differ there by design.

**N-38. The §8 bullet can be read as narrowing what Part 2's gates check** (:2117-2120).
- Items 2, 5, 9 and 12 also bear on the twin search and the clear.
- §9 reads §8 one by one (:342), and §8 brings in the 1c form's items (:327).
```text
Items 13 and 15 are read on Part 2's diff.
```
```text
Every §8 item, the 1c form's items that §8 applies included, is read on each part's diff; items 13 and 15 bear on Part 2's diff in particular.
```
- **Clause check:** :327 and :342.

**N-39. The double count is reckoned once per line, but the counting command counts both columns** (:2192-2196, :2345).
- §2.11 counts with `git diff --numstat` (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:437`), summed over both columns (that form's :2344; AUTONOMY :357).
- A Part 1 line that Part 2 deletes or rewrites is counted in Part 1 as added and in Part 2 as deleted, and not at all in the whole. So the excess is twice those lines.
- I cannot tell whether lead-data's 25 to 50 is lines rewritten or lines counted. The words below are an upper bound under either reading.
```text
That is about 25 to 50 lines, and Part 2's figures carry them.
```
```text
That is about 25 to 50 lines that Part 2 rewrites. §2.11's command counts both numstat columns, so each Part 1 line that Part 2 deletes is counted twice in the parts and not at all in the whole: once as Part 1's addition and once as Part 2's deletion. The parts' counts together therefore pass the whole's by up to twice those lines, about 50 to 100, and Part 2's figures carry the share that falls in Part 2.
```
```text
So the sum of the parts' counts may pass 5,530 by up to about 35 lines.
```
```text
So the sum of the parts' counts may pass 5,530 by up to about 85 lines.
```
```text
so the sum may pass 5,530 by up to about 35 lines (item 6)
```
```text
so the sum may pass 5,530 by up to about 85 lines, twice the rewritten lines less the 15 unspent (item 6)
```
- **Clause check:** 2 × 50 − 15 = 85.

**N-40. Wrong ruling cite** (:2346). The 50 files are in ruling item 1 (:11). Item 3 (:22) names lines only.
```text
the 50 files of ADV-2026-11-23-29 item 3
```
```text
the 50 files of ADV-2026-11-23-29 item 1
```

**N-41. The note's draft drops a qualifier and over-states one offer** (:2335, :2336). These words go to the advisor, who rules the note.
- **(a)** The draft drops N-20's qualifier that U holds at least one kept step (:1554). Read literally, an `unsaved-` record with no step then qualifies as a twin of any project's record and would be removed with it. The form's rule leaves such a record.
```text
either its kept step ids, in order, are the first kept step ids of the project's record, or neither record holds a step
```
```text
either it holds at least one kept step and its kept step ids, in order, are the first kept step ids of the project's record, or neither record holds a step
```
- **(b)** The draft says such a session is offered as that project's. When that project's record has nothing after its last mark, it is instead cleared with its twin (:934-935; the note's item 1).
```text
it is offered as that project's, when the project is opened
```
```text
it is offered as that project's when the project is opened, or cleared with that project's record as item 1 says
```
- **Why this is Documentation and not Correctness.**
  - The rule in the form, which the code will follow, is right (:1554).
  - Nothing of the draft lands until the advisor rules its words after this gate (ruling :28; form :2325-2327).
  - The attempt-3 gate classed the same missing qualifier in the form as Documentation (N-20).
- **Risk.** If the draft's words were ruled unchanged, the gap would become ADR text. These words should therefore reach the advisor with the draft.

## Notes for the build (no finding)
- **K-C8's red reason.** Amendment 10 says K-C8 is red at B by behaviour (:2067). That needs a real `Dataset` at a path the store's writer refuses. The unit tests in `session_history.rs` build no `Dataset` today (:1883 onward). If K-C8 calls a new pure writer, it is red by compile instead, and the closing record should name the reason actually observed.
- **K-C36's two halves.** If the `unsaved-` record and the project's record sit in one root, with equal `locations.json` bytes and the same first step id, the start's dedupe reads the `unsaved-` record as a twin and does not list it (:1018-1021). The row would then fail even unmutated. Use separate roots, run the start half before R exists, or give the halves different locations.

## For the advisor (drafts with my recommendation; I rule nothing)
- **(i) The sum of the lines.** Accept now.
  - Your item 1 fixes the cap for the whole (:11). It is read over `B...H2` at the merge check (:2190), and the double count never reaches that figure.
  - Treat the two part figures as each part's gate budget.
  - A part that passes its figure by no more than twice the Part 1 lines Part 2 deletes should be recorded as class 8 with that deletion count shown, and need no further ruling.
  - Anything beyond that comes to you.
  - Read the size of the pass with N-39's words: up to about 85, not 35.
- **(ii) The count of files.** Recommend the union over `B...H2`, which is 48 at most (47 by my count). Your item 1 says "for the whole", and there is one diff into main. The per-part counts (45 and 6) are budgets only. The cite in the question is item 1, not item 3 (N-40).
- **(iii) The third case in which a twin stays.** Accept it, and name it.
  - Amendment 4 item 3's probe leaves a twin on any lock failure other than `WouldBlock` (:1568), and when it cannot be read. Leaving it is the fail-safe direction.
  - When item 76 is worded, add the same case to its third bullet. Otherwise that bullet lists two of three causes, and its limit claim is incomplete.
- **(iv) The clear of a folder with no history.** Recommend that the note name it, in one sentence in its item 1.
  - The note's title says it states what the offer clears unasked, and C-11 removes `locations.json` and the folder from the machine store unasked (:1709).
  - Suggested words: "A project's record folder that holds no history is removed at that open too, with no offer: it holds no step."
  - Clause check: an absent folder removes nothing, and a folder with no `history.jsonl` is cleared with removal errors ignored (:1709). N-32's timing cases are named (:1878).
- **Lead-data's question: may the dated note stand under the grant's item 2?** Yes.
  - Grant item 2 names "ADR notes, amendments and statuses" among the former red lines it delegates (`state/directives/2026-11-13-the-grant-…-the-advisor-merges.md:15`).
  - `.claude/agents/architect.md:19` paraphrases the human's 2026-10-11 rule, which predates the grant.
  - Its exclusion of red-line text still governs one thing: a gate's words for the note cannot be applied by a worker without a ruling. So they come to you, as N-41's do. They are not barred.
  - Precedent: ADR-036 Amendments 2 to 4 already carry the advisor's wording under the delegation (ADR-036 :285, :297, :305).
  - For consistency with those, the note's italic line could add the delegation's standard words, "the advisor's wording, under the delegation of 2026-11-13" (grant :17).
  - The human can overrule any ruling (grant :17), and your item 6 says you tell them.
- **K-C34 (not asked; offered).** Add a second mutation observable on Windows: on `WouldBlock`, the twin's files are removed unread. Under H2 (:32), the delete succeeds against the test's share-delete handle and takes effect when that handle closes, so the read by path finds the files gone. This is §8 item 13's case (:1232). It would give K-C34 a failing observation before the tag, without waiting on macOS or Linux.

## Files read (at f0718827, in C:/dev/wt/read-1123af)
- The form: :1-425, :425-1912 and :1912-2386 (whole), plus searches
- The ruling, whole
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-parts-view-lead-data.md`, whole
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`, whole
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-3.md`, a search for E-5
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-10-lead-data-draft.md`: :386-436, plus a marker search
- `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, whole
- `governance/AUTONOMY.md`: :306-391 and :530-551, plus a heading search
- `docs/PREREGISTRATION-TEMPLATE.md`: :58-178
- `.claude/agents/architect.md`: :15-19
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: :200-308, plus a heading search
- `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`: :158-163
- A search for dated-note headings across `docs/adr/`
- `docs/README.md`: :27
- `kernel/src/session_history.rs`: :280-600, :1255-1354 and :1883-1942
- `kernel/src/project/store.rs`: :45-64 and :455-504
- `protocol/skp/SKP-V0.md`: :300-321, :574-579 and :1127-1171, plus a heading search
- Searches of `frontends/shell/src-tauri/src/` for `record_step`
- A search for `skp/0\.14` outside state/governance/docs/site
- A search of `KNOWN-LIMITATIONS.md` for items 74 and up
- A search of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` for numstat

Opus 5.5 (claude-opus-5-5)
