*Filed by the custodian: lead-data's draft of Amendment 10 to `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, after the architect's form gate, attempt 6 (PASS WITH NOTES; `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`) and the advisor's ruling ADV-2026-11-23-29 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`), node:b2-piece-1c-step-3-recovery-offer@amendment-10-lead-data, dispatched at 2026-11-23T20:08:43Z. Its run: Read 20, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T20:08:43Z to 2026-11-23T20:22:46Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 34093 bytes, sha256 0f4c80177c6e0a9ea151690f743684b2942234d29d451248125060d19f0fcb8e, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 11 follows it. Nothing in it is ruled.*

---

Result: Amendment 10 is drafted. It sets out Part 1 and Part 2, with each part's files, wire, seams, callers, tests and ceilings (4,670 and 860, together 5,530), the gates and their order, eight Old/New replacements, the ADR-036 note's draft and four questions for the advisor; nothing in it is ruled.

---AMENDMENT 10---
## Amendment 10 — 2026-11-23 — post-result amendment after ADV-2026-11-23-29 and the architect's form gate, attempt 6: the piece built in two gated parts inside one pull request, each part's files, tests and ceilings, the gates and their order, and the draft of the ADR-036 note

*Post-result amendment. It was written after two outcomes were seen: the architect's form gate, attempt 6, PASS WITH NOTES (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`), and the advisor's ruling ADV-2026-11-23-29 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`). Lead-data drafted it before any code. A ruling item is always cited as ADV-2026-11-23-29 item n. A bare "item n" is an item of this amendment. Every `path:line` is read at 55969f9849bce50230f7ae7c19c03bc73289517a. The drafter has no hashing tool, so the custodian pins each span's sha256 at filing. Amendment 9, the custodian's, carries N-34 to N-36, and this amendment changes none of their texts. Each Old text below occurs once in the form above Amendment 9, and none is inside an Old text of N-34 to N-36. Where an Old text is part of a line, only that part is replaced. Nothing here says anything about the base: the custodian compares it at dispatch (ADV-2026-11-23-29 item 11). No ceiling, note word, string or KNOWN-LIMITATIONS text is ruled here.*

1. **ADV-2026-11-23-29, recorded** (cited by item, not restated).
   - **Size.** At most 5,530 lines over at most 50 files is accepted for the whole piece, on the condition of item 2 of the ruling. Two gates reading the whole at once is not accepted (ADV-2026-11-23-29 items 1 and 2).
   - **Parts.** The piece is built in two gated parts inside one pull request, with one merge (ADV-2026-11-23-29 item 2). Items 2 to 6 below declare the parts.
   - **Version and the node.** No contract ruling, no second SKP version and no gap. The literal moves once, in Part 1, and the node is done at the one merge (ADV-2026-11-23-29 item 4). The human's OPEN-3 (A) of the 1c form is kept.
   - **(a):** not material. Amendment 4 item 2's clear stands, and its fallback is not taken (ADV-2026-11-23-29 item 5).
   - **(b) and (c):** one dated note is appended to ADR-036, in the advisor's words, from item 9's draft (ADV-2026-11-23-29 item 6). That draft supersedes Amendment 4 item 9's two drafts.
   - **(e):** not in this piece, and `end_session`'s rule stays (ADV-2026-11-23-29 item 7). The proposed node is the custodian's to add to the PLAN.
   - **(g):** the twin's bound is accepted (ADV-2026-11-23-29 item 8). See item 10.
   - **(f):** it and the other drafts (items 43, 70 and 76; R-S1 to R-S12) wait for the form's gate (ADV-2026-11-23-29 item 9).
   - **(h):** K-C34's red on macOS and Linux waits, on the gate's two conditions (ADV-2026-11-23-29 item 10). Item 4 records them. The line on the node is the custodian's.

2. **Part 1: the declared item first, then the three commands at one literal** (lead-data's Part A and Part 1; ADV-2026-11-23-29 item 2).
   - **Order.**
     - §2.5's declared writer comes first: K-C8 is committed and run red, then the writer lands.
     - Then come the three commands at the next unused literal (§2.4, as Amendment 2 N-6 has it), with their src-tauri handlers, the shell's callers and E-RECOVER.
   - **Rules it builds.** §2.3 to §2.8, as Amendments 2, 4 and 6 to 9 leave them, except what item 3 gives Part 2. In particular:
     - **At an open:**
       - A project's record that holds a step after its last `saved-here` mark, or steps and no mark, is offered.
       - A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed).
       - A `<hex>` folder with no `history.jsonl` is not listed and stays where it is, as Amendment 2 N-13's bullet has it.
     - **The open's step,** as Amendments 4, 6, 7 and 8 word it (Amendment 4 item 2's step 1). Part 1 builds:
       - the folder's metadata, where an absent folder means nothing is listed and nothing is removed;
       - the metadata of `history.jsonl`;
       - the 0-byte rule (C-13);
       - `try_lock`, with its `WouldBlock` outcome and its other-failure outcome.
     - **At a start and in the two acts.** Part 1 also builds:
       - the start's walk and dedupe (Amendment 4 item 4, with C-9, C-10 and N-19's candidate rule);
       - `recover_session` with its step 3a (Amendment 4 item 5);
       - `discard_recoverable`, with no twin search;
       - the OPEN-4 (B) entries;
       - the `restored` mark read as `later-version` (Amendment 4 item 7).
     - **No twin removal.** `recover_session` and `discard_recoverable` on a project's record remove no twin.
   - **Files.** §2.11's files, as Amendments 2, 4, 7 and 8 leave them, except `KNOWN-LIMITATIONS.md` and `frontends/shell/MANUAL-WALKTHROUGH.md`, which only Part 2 touches. That is at most 45 files. Part 1 touches nothing under `docs/adr/`.
   - **Wire.**
     - The three commands: `list_recoverable`, `recover_session` and `discard_recoverable` (§2.4, as Amendment 2 C-7 revises it), with the four codes.
     - The types in `protocol/skp/src/v0/commands.rs` and the codes in `error.rs`.
     - `SKP_VERSION` moves once, in §2.4's 29 files, with:
       - SKP-V0 §1's and §4's counts;
       - the new version's §8 entry;
       - §10.3's clause (Amendment 2 N-12);
       - §13 to §15.
     - The conformance rows and the moved version-refusal row (Amendment 2 N-6).
     - **Callers.** Each command's caller chain is:
       - its src-tauri handler in `frontends/shell/src-tauri/src/commands.rs`, registered in `frontends/shell/src-tauri/src/lib.rs` (T-1);
       - then its wrapper in `frontends/shell/src/skp/client.ts`;
       - then `RecoveryOffer`: the list with `null` at mount and with the handle after an `opened` reopen, Discard, and Recover's `admit` through `runAdmitPath`;
       - with `handleRecovered` in `App.tsx` applying the returned intents.
       E-RECOVER drives this chain from the real shape.
   - **Kernel seams and items.** Each has its product caller in Part 1:
     - `Open.reopened_as` (C-1) is set in `reopened()` and read by `list_recoverable(handle)` and by `recover_session`'s handle arm.
     - `recover_bytes`, made `pub(crate)` (N-13), is called by the listing and the adopt.
     - The bounded read of a history's first two lines in `kernel/src/session_history.rs` (Amendment 4 item 11) is called by the start's dedupe and step 3a.
     - `LOCATIONS_LIMITS.max_bytes`, exposed `pub(crate)` in `kernel/src/project/store.rs` (Amendment 2 item 7), is used by the listing's read of `locations.json`.
     - `MAX_RECOVERABLE_RECORDS` and `MAX_DEDUPE_RECORDS` sit in `kernel/src/recovery.rs` (§7, as Amendments 2 and 4 add them) and bound the walk and the dedupe.
     - The start's two private steps (C-9) are called by the start's listing; the dedupe is also called by step 3a.
     - The record writer through `store::locations_to_bytes` (§2.5) is called by `record_step`'s first step, the existing path that `frontends/shell/src-tauri/src/commands.rs` serves.
     - The recorder's entry points for the three commands (§2.3) are called by those commands' handlers.
     No `pub` item lands without its product caller in Part 1.
   - **Shell surfaces.** All of §2.7:
     - `RecoveryOffer.tsx` and `handleRecovered`;
     - the three wrappers and their types;
     - three class-A rows in `surfaceRegistry.ts`, with `surfaceCompleteness.test.ts`'s eleven commands (D9);
     - the four codes in `formatRefusal.ts`;
     - R-S1 to R-S12, under the P6 marking.
   - **Tests.** Each keeps its row's mutation as the form last words it:
     - K-C1 to K-C8;
     - K-C9 as Part 1 has it (item 8);
     - K-C10 to K-C27;
     - K-C36, with its mutation as item 8 rewords it for each part;
     - K-C37, K-C38 and K-C41;
     - P-1 and T-1;
     - S-1 to S-8;
     - E-RECOVER.
   - **Red at B.**
     - Every row except K-C8 calls a command, type, component or private step that does not exist at B, as §4's rows and Amendments 2 and 4 say.
     - K-C8 is red at B by behaviour: the inline writer writes a path that the store's writer refuses (lead-data's parts view, Part A).
   - **Known pass cases in Part 1:** none.
   - **What Part 1's tests may not build.** Otherwise Part 2 would change a Part 1 test other than K-C9 (§5 I3, read against main; ADV-2026-11-23-29 item 2). No Part 1 test:
     - builds a project's record that Amendment 4 item 2's clear would clear, except K-C9;
     - builds a `<hex>` folder with no `history.jsonl` that is read at an open;
     - asserts that an `unsaved-` record stays after its project's record is recovered or discarded.
   - **What Part 1's head holds that Part 2 changes.** At H1:
     - a project's record with nothing after its last mark stays, and item 70's sign shows for it;
     - a twin stays after its project's record is recovered or discarded, and a later start lists it;
     - a `<hex>` folder with no history stays;
     - KNOWN-LIMITATIONS items 43, 70 and 76 and the walkthrough are as they are on main.
     None of this reaches main, because there is one merge (ADV-2026-11-23-29 item 2), so none of it is a limitation to name. Part 1's gates read these as Part 2's.
   - **Ceiling:** item 6's table.

3. **Part 2: the clear at an open and the removal of the twin, with the operator Part whole** (Amendment 4 items 2 and 3; ADV-2026-11-23-29 item 2).
   - **Rules it builds.**
     - All of Amendment 4 item 2, as Amendments 6 to 9 revise it, except the parts of its step 1 that item 2 gives Part 1. That is:
       - the clear of a folder with no `history.jsonl` (C-11);
       - the clear's conditions and its order (its steps 2 to 4);
       - the Discard-only case of its step 5;
       - its §2.4 addition.
     - All of Amendment 4 item 3, with N-20's probe: the twin search, called from `recover_session`'s step 4a, from `discard_recoverable`'s step 3a and from the clear (Amendment 4 item 5).
     - `MAX_DEDUPE_RECORDS` takes the third use that Amendment 4 item 11 gives it: the `unsaved-` folders that a twin search examines.
   - **Files.** Six:
     - `kernel/src/recovery.rs`;
     - `kernel/tests/recovery.rs`;
     - `protocol/skp/SKP-V0.md`;
     - `KNOWN-LIMITATIONS.md` (items 43, 70 and 76);
     - `frontends/shell/MANUAL-WALKTHROUGH.md` (the operator Part);
     - `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (item 9's note).
     Any other file Part 2 needs is declared by amendment before its code.
   - **Wire.**
     - No command, field, code or literal is added.
     - SKP-V0 §13, §14 and §15 say what `list_recoverable(handle)`, `recover_session` and `discard_recoverable` remove. Part 2 says it in lines Part 1 added, which Part 2 changes, and in lines Part 2 adds (Amendment 4 item 2's §2.4 addition, with its section list corrected by item 8).
     - SKP-V0's append-only rule (`protocol/skp/SKP-V0.md:576-577`) is read against main, where all of these lines are new at the one merge (ADV-2026-11-23-29 item 2).
     - Part 2 adds no field. So it does not change the version's §8 entry, which is that version's full field set under condition (ii) of `protocol/skp/SKP-V0.md:314-319`. The literal freezes once, at the merge (condition (iv) of the same lines).
   - **Kernel seams.** None new, and no `pub` item. Part 2 adds two private functions in `kernel/src/recovery.rs`:
     - the clear, called from `list_recoverable(handle)`;
     - the twin search, called from `recover_session`'s step 4a, `discard_recoverable`'s step 3a and the clear.
     All three callers are Part 1's commands, which ship with their shell callers. No module seam is crossed.
   - **Shell surfaces:** none. The clear's reply lists nothing for the record, which Part 1's `RecoveryOffer` already shows as no offer.
   - **Tests.** Each keeps its row's mutation:
     - **K-C9,** changed to Amendment 4 item 8's row. This is Part 2's only edit of a Part 1 test (ADV-2026-11-23-29 item 2). Part 1 builds K-C9's fixture as that row describes it: a header, a step, a `saved-here` mark after the step and a torn last line, left by another recorder dropped without `end_session`. So Part 2 changes only its name, its assertions and its mutation.
     - **K-C28 to K-C35, K-C39 and K-C40,** added in `kernel/tests/recovery.rs`.
     - **Red at H1, and the tests that rest on their mutations:** item 4.
     - **Mutations observed again at H2:**
       - K-C36's and K-C41's, whose mutated lines are in the open's step, which Part 2 rewrites;
       - those of any other Part 1 row whose mutated line Part 2's diff changes.
       Part 2's closing record names each one.
     - **Known pass case:** K-C34's mutation on Windows (Amendment 6 item 7).
   - **§8.**
     - Items 13 and 15 are read on Part 2's diff.
     - Item 13 is also read on Part 1's `discard_recoverable`.
     - Item 14 is read on Part 1's dedupe.
   - **Records.**
     - Items 43, 70 and 76 are worded once (ADV-2026-11-23-29 item 2), under the placeholder mark until the advisor words them (ADV-2026-11-23-29 item 9).
     - The operator Part lands whole: OP-R1 to OP-R5 and OP6, with one blank log (Amendment 4 item 10).
     - Item 9's note lands in the advisor's words.
     This amendment does not change when the operator Part is run.
   - **Ceiling:** item 6's table.

4. **Red before the fix, by part** (ADV-2026-11-23-29 item 2, its last bullet).
   - **Part 1:** every row is red at B, as item 2 says.
   - **Part 2, red at H1 by behaviour.** Each is committed and run red on H1's line before Part 2's code:
     - **K-C9:** at H1 the record is not listed and its folder stays. The row's assertion that the folder is gone fails, and so does its assertion that the open's save writes the mark.
     - **K-C30:** at H1 the record keeps a header, s1 and the mark. So it holds nothing after its last mark and is not listed, while the row asserts an entry with Discard only.
     - **K-C31 and K-C32:** at H1 no twin is removed.
     - **K-C33:** at H1 no twin is removed, and the record is not cleared.
     - **K-C39:** at H1 the folder with no history stays where it is.
   - **Part 2, not red before Part 2's code; each rests on its mutation alone.**
     - **K-C28:** at H1, `WouldBlock` lists nothing and removes nothing, which is what the row asserts.
     - **K-C29:** at H1 the record is offered and its folder stays.
     - **K-C34:** at H1 no twin is removed. On Windows its mutation also passes (Amendment 6 item 7), so on Windows nothing shows K-C34 failing. Its one failing observation is its mutation on a macOS or Linux runner.
     - **K-C35:** at H1 the `unsaved-` record stays, and once R is gone it is listed.
     - **K-C40:** at H1 an open with no record folder lists nothing and removes nothing. It is added to the four that the advisor named (ADV-2026-11-23-29 item 2), because K-C40 came after the parts view (Amendment 7 item 3).
     These five are committed in Part 2 and pass at H1. Each one's evidence is its mutation alone, observed at H2: applied, run, recorded by name with its commit, and reverted. This is the exception to §4's heading rule, declared here before code.
   - **K-C34 on macOS and Linux** (ADV-2026-11-23-29 item 10).
     - Part 2's closing record says that K-C34's red under its mutation has not yet been observed on macOS or Linux, and names the Windows run as its pass case.
     - No record claims that K-C34 proves the probe there.
     - The advisor does not count a pushed mutation commit as covering it before the tag.
     - The observation is owed when the human's pause on the macOS and Linux work ends.

5. **The gates and the order** (ADV-2026-11-23-29 item 2).
   - **Part 1** ends at a pushed head H1 at which every suite of §9 is green. H1's commit id is named in the amendment that records it and in the PR body. Both gates read the diff from B to H1, with B as §2.11 and §9 name it.
   - **Part 2** is built on H1 and ends at a pushed head H2 at which every suite of §9 is green. Both gates read the diff from H1 to H2, with the Part 1 lines it touches.
   - Part 2's build does not wait for Part 1's gates.
   - **A correction to Part 1 after its gate:**
     - It is made on Part 1's line, from that line's last head.
     - It is merged forward into Part 2's line by a merge commit.
     - The gate that asked for it reads it narrowly.
     - Part 2's gates then read from the last Part 1 head merged into Part 2's line, up to H2.
     The branch names are the custodian's.
   - **One pull request and one merge.** The merge comes after both parts' gates have passed and every correction has had its narrow read, on §9's merge terms, which this amendment does not change. At that merge:
     - no state between the parts has reached main;
     - the literal freezes, once;
     - items 70 and 76 have been worded once;
     - the node is done (ADV-2026-11-23-29 item 4).
   - **Where Part 2 changes lines Part 1 added:**
     - `kernel/src/recovery.rs`: the open's step and the call sites in the two acts;
     - SKP-V0 §13 to §15;
     - K-C9.
     Of the records and tests, Part 2 changes no other Part 1 line.
   - **Mutations.** Each part's mutations are observed at that part's own head, as §4's last bullet says. Part 2's repeat observations are listed in item 3.

6. **The ceilings, by part.** These are §2.11's groups. Each figure is a ceiling: passing it is class 8, recorded before the code that passes it, and §7 is never edited.

| Group | Part 1 | Part 2 | Together (§2.11 as Amendments 2, 4, 7 and 8 leave it) |
|---|---|---|---|
| protocol (`SKP-V0.md`, `src/v0/{commands,error,mod}.rs`) | 330 | 20 (`SKP-V0.md` only) | 350 |
| conformance + fixtures | 220 | 0 | 220 |
| literal | 260 | 0 | 260 |
| kernel product | 950 | 210 (`recovery.rs` only) | 1,160 |
| kernel tests | 1,510 | 470 (`tests/recovery.rs` only) | 1,980 |
| src-tauri | 100 | 0 | 100 |
| shell product | 500 | 0 | 500 |
| shell tests | 500 | 0 | 500 |
| e2e | 300 | 0 | 300 |
| records (items 43, 70 and 76; the operator Part; item 9's note) | 0 | 160 | 160 |
| **Total** | **≤ 4,670, ≤ 45 files** | **≤ 860, ≤ 6 files** | **≤ 5,530; 48 files in the union** |

   - **Counting.** §2.11's counting command, with Amendment 2 N-8's exclusions, is run three times:
     - for Part 1, over `B...H1`;
     - for Part 2, over `H1...H2`, starting from the last Part 1 head merged in if a correction came after Part 1's gate;
     - for the whole, over `B...H2`, at the merge check, against at most 5,530 lines and at most 50 files.
   - **The added file.** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` joins the records group for item 9's note, which ADV-2026-11-23-29 item 6 brings. It is declared before any code. With it, the union is 48 files of 50.
   - **What the split costs.** Part 2's count includes the Part 1 lines it rewrites, which a count of the whole would count only once:
     - K-C9: about 10 to 20 lines;
     - SKP-V0 §13 to §15: about 6 to 10 lines;
     - the open's step and the two acts' call sites in `recovery.rs`: about 10 to 20 lines.
     That is about 25 to 50 lines, and Part 2's figures carry them. The figures they are cut from leave about 15 lines unspent: about 5 in kernel product, by the attempt-6 report's Ceilings section, and about 10 in records. So the sum of the parts' counts may pass 5,530 by up to about 35 lines. This goes to the advisor (item 11).
   - **Source comments.** The attempt-6 report's Ceilings section names the risk that the source comments §31(c) needs use up the kernel product headroom. That risk sits in both parts' kernel product figures.

7. **Records, by part.**
   - `KNOWN-LIMITATIONS.md` items 43, 70 and 76, the operator Part, and item 9's note are Part 2's alone.
   - Part 1's gates read their state at H1 as Part 2's, and not as a finding against Part 1 (item 2).

8. **The form text the split changes.**
   - **The title block, its line on form and gating.**

Old:

````text
**Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent).
````

New:

````text
**Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent), built in two gated parts inside one pull request with one merge (ADV-2026-11-23-29 items 1 and 2; Amendment 10 items 2 to 6).
````

   - **§1, the ADRs line.**

Old:

````text
**ADRs:** none is amended. ADR-036 §9 and the 2026-10-07 ruling are applied as read.
````

New:

````text
**ADRs:** none is amended. One dated note is appended to ADR-036 in Part 2, and no line of ADR-036 is edited; its words are the advisor's, from the draft of Amendment 10 item 9, once the form's gate has passed (ADV-2026-11-23-29 item 6). ADR-036 §9 and the 2026-10-07 ruling are otherwise applied as read.
````

   - **§5, Predicted.**

Old:

````text
every §4 test is red before its code and green after.
````

New:

````text
every §4 test is red before its code and green after, in its own part (Amendment 10 items 2 and 3), but for K-C28, K-C29, K-C34, K-C35 and K-C40, which pass at Part 2's base and rest on their mutations (Amendment 10 item 4).
````

   - **§5, Declared unchanged.**

Old:

````text
ADR-036's text; items 62, 71, 72 and 73.
````

New:

````text
ADR-036's text, but for the one dated note appended in Part 2 (Amendment 10 item 9); items 62, 71, 72 and 73.
````

   - **§9, the Reviewer's diff** (the New text of Amendment 2 N-7).

Old:

````text
The full diff: `B..HEAD`, with B the recorded base (§2.11);
````

New:

````text
The diff of each part, read by both gates (Amendment 10 item 5): Part 1's from B to its head H1, and Part 2's from H1, or from the last Part 1 head merged into it after a correction, to its head H2, with what it touches in Part 1; B is the recorded base (§2.11);
````

   - **Amendment 4 item 2's §2.4 addition, the SKP-V0 sections it names.** §2.4's §10.3 draft puts the restore in §14, so `recover_session`'s twin removal belongs in §14.

Old:

````text
The new §13 and §15 of SKP-V0 say so.
````

New:

````text
The new §13, §14 and §15 of SKP-V0 say so, in lines Part 2 adds or changes (Amendment 10 item 3).
````

   - **Amendment 4 item 8, Red before the fix.**

Old:

````text
Each K-C row, the changed ones included, calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of them exists at the red commit.
````

New:

````text
Each Part 1 K-C row but K-C8 calls `list_recoverable`, `recover_session` or `discard_recoverable`, or a private step of the start, and none of them exists at Part 1's red commit; K-C8 is red there by behaviour. Part 2's rows are red at Part 1's head by behaviour, or rest on their mutations, as Amendment 10 item 4 says.
````

   - **K-C36's mutation** (Amendment 6 item 22's New text).

Old:

````text
`restored` marks not considered (the record is then cleared)
````

New:

````text
`restored` marks not considered (in Part 1 the project's record is then not listed, and the `unsaved-` record is listed with its steps; in Part 2 the project's record is then cleared)
````

   - **K-C9, read by part** (added to §4 after its table).
     - In Part 1, K-C9 is §4's row as first filed, with its first name and its first mutation.
     - From Part 2 on, K-C9 is Amendment 4 item 8's row.
     - Both versions are in `kernel/tests/recovery.rs`.
   - **§2.12, a row added after D21:**
     - | D22 | gate | step 3 as one pull request, read whole by its gates | two gated parts inside one pull request, one merge (Amendment 10 items 2 to 6) | ADV-2026-11-23-29 items 1 and 2 |

9. **The ADR-036 note** (ADV-2026-11-23-29 item 6).
   - **Sources.** Drafted from Amendment 4 item 9's two drafts, the first as Amendment 6 item 20 rewords it, and from question (b).
   - **Whose words.** They are the advisor's, after the form's gate. The architect reads this draft with this amendment.
   - **Where it goes.** It is appended after ADR-036's last amendment, and no line above it is edited.
   - **When it lands.** Part 2 lands it in the advisor's words. If H2 is reached before those words are given, the merge waits for the commit that lands them, and that commit gets a narrow read. The note's date is that commit's.

````text
## Note <date> — what the recovery offer clears unasked, the record a first save moved from, and what a start withholds (b2-piece-1c-step-3-recovery-offer)

*Appended under the advisor's ruling ADV-2026-11-23-29, item 6, under the delegation of 2026-11-13. The text above is unchanged, Amendments 1 to 4 included.*

1. **A project's record with nothing after its last save** (§9, the bullet on when a history is cleared). When a project is opened, a record of it that another run left is cleared, with no offer, if no running session holds it, its header names no action this version lacks, its kept lines hold a `saved-here` mark with no step after the last one and hold no `restored` mark, and the reader refuses no line of it but a torn last one. Its steps reach the project file that mark followed, and a normal end of the run that left it would have cleared it.
2. **The `unsaved-` record a first save moved from** (Amendment 1, item 5). When a project's record is recovered, declined, or cleared at the project's open, an `unsaved-` record is removed with it if its `locations.json` is the project record's byte for byte, the reader accepts its header, and either its kept step ids, in order, are the first kept step ids of the project's record, or neither record holds a step. It stays when another run holds it, as a running session or a listing does, when it cannot be locked or read, or when it is not among the first 256 `unsaved-` records examined. It is then offered at a later start, once the project's record is gone, and holds only steps the project's record held.
3. **What a start withholds** (§9, the bullet on a session that never saved). A start does not offer a session that never saved whose `locations.json` is, byte for byte, that of a project's record that another run holds or that the start cannot lock or read. It offers no session that never saved while more than 256 project records hold a `locations.json`, or while one of them cannot be examined. When it withholds a session, it says that more are kept. A session whose steps a project's record already holds is not offered at a start either: it is offered as that project's, when the project is opened (Amendment 1, item 5).
````

10. **Item 76 and the twin's bound** (ADV-2026-11-23-29 item 8).
    - Item 76's third bullet, as Amendment 6 item 16 rewords it, already names both cases: a twin past the 256 examined, and a twin that another window's listing holds at that moment.
    - No sentence is added.
    - Its words wait for the form's gate, with item 76's other bullets (ADV-2026-11-23-29 item 9).

11. **For the advisor.** None of these is ruled here.
    - (i) **The sum of the lines.** The parts' ceilings sum to 5,530. But Part 2's count holds about 25 to 50 lines of Part 1 that it rewrites, and the figures leave about 15 lines unspent, so the sum may pass 5,530 by up to about 35 lines (item 6). Is a pass of that size accepted now, or ruled when it is recorded as class 8?
    - (ii) **The count of files.** The union is 48 of 50. Counted part by part, 45 and 6 sum to 51, because three files are in both parts. Which count do the 50 files of ADV-2026-11-23-29 item 3 mean?
    - (iii) **A third case in the note.** The note's item 2 names a third case in which a twin stays: a lock or a read that fails. Amendment 4 item 3's probe leaves the twin in that case, but ADV-2026-11-23-29 item 8 does not name it.
    - (iv) **A case the note leaves out.** The note does not name the clear at an open of a project's folder that holds no `history.jsonl` (C-11), because that folder holds no session history. If the note should name it, the advisor words it.

12. **Superseded by this amendment, by section:**
    - the title block (form and gating);
    - §1 (ADRs);
    - §2.10 (items 43, 70 and 76 land in Part 2);
    - §2.11, as Amendments 2, 4, 7 and 8 revise it: the ceilings by part, the records group's added file, and the counting by part;
    - §2.12 (D22 added);
    - §4: each row's part, K-C9 by part, K-C36's mutation, Amendment 4 item 8's red-before-fix bullet, and the five rows that rest on their mutations;
    - §5 (Predicted; Declared unchanged);
    - §9: the Reviewer's diff, and the gates and their order by part;
    - Amendment 4 item 2's §2.4 addition (the SKP-V0 sections it names);
    - Amendment 4 item 9 (its two drafts, replaced by item 9's note);
    - Amendment 4 item 12 (a), closed by ADV-2026-11-23-29 item 5.

13. **Next:** the architect reads this amendment alone (ADV-2026-11-23-29 item 3). No code is written before that gate ends PASS or PASS WITH NOTES. Amendment 8 item 9's hold for the sitting still applies.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**The Old texts, checked.** I searched for each one in the form at 55969f98. Each occurs exactly once, and none is inside the Old texts of N-34 to N-36 (form :1835 and :1878):
- `**Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent).` — :16 (part of the line)
- `**ADRs:** none is amended. ADR-036 §9 and the 2026-10-07 ruling are applied as read.` — :43 (part of the line)
- `every §4 test is red before its code and green after.` — :300 (part of the line)
- `ADR-036's text; items 62, 71, 72 and 73.` — :305 (part of the line)
- ``The full diff: `B..HEAD`, with B the recorded base (§2.11);`` — :764 (part of the line, inside Amendment 2 N-7's New text)
- `The new §13 and §15 of SKP-V0 say so.` — :979 (part of the line)
- ``Each K-C row, the changed ones included, calls `list_recoverable`, ...`` — :1219 (part of the line)
- `` `restored` marks not considered (the record is then cleared)`` — :1681 (part of the line). The similar string at :1675 has no parenthesis, so it does not match.

**Line estimates, and how I reached them.** I split the accepted group ceilings by where each declared row's work lands, so each group's two figures add up to its ceiling. I took the shares from Amendment 4 item 11's per-file figures and the gates' figures for Amendments 6 to 8, and checked them against my parts view.
- **Kernel product:**
  - Part 1 is about 950: Part A about 90, the parts view's Part 1 about 820, and Part 1's share of the Amendment 6 to 8 additions about 40 (C-9's two steps, N-19's candidate check, K-C27's unit test, C-13's 0-byte check).
  - Part 2 is about 180 to 220: the view's 160, plus N-19's clear of a folder with no history, N-20's probe and C-11 (about 30), plus rewritten lines and §31(c) comments (about 10 to 30).
- **Kernel tests:**
  - Part 2 is about 460: 8 rows (K-C28 to K-C35) at about 40 lines each, about 30 for twin fixtures, about 25 for K-C9's change, and about 70 for K-C39, K-C40 and K-C28's added assertion.
  - Part 1 has the rest of the 1,980, about 1,510.
- **Records:** item 76 about 20, items 43 and 70 about 10, comment markers about 5, the walkthrough Part about 110 (the view's figure), and the note about 10. That is about 155 against 160.
- **Every other group:** wholly in Part 1, at its ceiling.
- **The double count:** about 25 to 50 lines, which is why item 11 (i) goes to the advisor.
- **Files:** neither `KNOWN-LIMITATIONS.md` nor `frontends/shell/MANUAL-WALKTHROUGH.md` holds an `skp/0.1x` literal at 55969f98 (searched), so neither is in the literal's file set. Part 1 therefore stays at 45 files.

**Questions.** None blocks the gate:
- For the advisor: item 11's (i) to (iv).
- For the custodian: architect.md's paragraph on wording blocks lists ADR amendments among red-line texts. ADV-2026-11-23-29 item 6 places this dated note under the grant's item 2. I have drafted it as ruled; whether that placement holds is for the custodian, not me.
- Not acted on: question (e)'s node and question (h)'s line, which are the custodian's to put in the PLAN.
- The reuse miss stands as the form records it. This amendment adds no mechanism.

**Files read** (in `C:/dev/wt/read-1123ad` at 55969f98, except the gate report):
- `kernel/README.md:357-402` and `engine/README.md:533-567`;
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, whole (:1-1911), last amendment first;
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-parts-view-lead-data.md`, whole;
- the attempt-6 gate report at `<S>/report-recovery-gate-a6.md`, whole;
- `.claude/agents/architect.md`, whole;
- `protocol/skp/SKP-V0.md`: :300-339, :574-578 and :905-916, plus searches;
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: :200-308, plus a heading search;
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`: :1161-1170;
- `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`: :160-167;
- a search for dated-note headings across `docs/adr/`;
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: :435-438 and :1887-1946;
- searches of `KNOWN-LIMITATIONS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md` and `docs/PREREGISTRATION-TEMPLATE.md`.

Report path: `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-10-lead-data-draft.md` (I wrote no file; this message is the report).
sha256: not computed, because I have no hashing tool. The custodian hashes this message's bytes when filing it.

Opus 5.5 (claude-opus-5-5)
