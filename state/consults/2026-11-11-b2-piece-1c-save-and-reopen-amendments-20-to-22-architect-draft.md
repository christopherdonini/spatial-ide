*Custodian's filing note (2026-11-11): the architect's draft of 1c's Amendments 20, 21 and 22, from its hand-back (30374 bytes, sha256 9ca4062ccf8a9a504ae5a3930bb0208ef586bd0dd9cc252928f7eea4a813a290), below the rule unchanged; one final newline is added. Its brief by file (7827 bytes, sha256 a77b5012d34cf4556afcdf9f47cdb584df13604e9b6ec0df9927e50fe5794295); the run 2026-11-11T17:59:55.785Z to 2026-11-11T18:09:27.438Z by its transcript, 46 calls (Read 25, Glob 5, Grep 15, the hand-back), 1 errored, none writing, model claude-opus-5-5; the errored call is a Grep on a path that does not exist (docs/04_SKP_Protocol.md), and the draft's notes name the file it then read. A draft, a reading and not Authority. Before appending, the custodian checked by script: each of the three fenced blocks is appended to the form whole, each sha256:<H> filled at c1aea32a with the sha256 of the cited whole lines (one pin in each block), and nothing else changed; Amendment 19 was the form's last. Its red-line OPEN items go to the human for typed answers: OPEN-20-1 (which values of the new member show a notice), OPEN-21-1 (whether a later save of the second project also withholds its mark; R3's second commit waits on it) and OPEN-21-3 (no ADR-036 text in step 1). OPEN-21-2 is not a red line and takes the draft's recommendation, (a), its own KNOWN-LIMITATIONS item (the 2026-10-31 directive, item 4, held to 2026-11-16), recorded here with the date. Rule (00), the check Amendment 22 item 8 gives the custodian: port-2's branch, the one other built branch, touches no protocol/ path, no kernel/README.md and no new KNOWN-LIMITATIONS item.*

---

Drafted: b2-piece-1c-save-and-reopen Amendments 20 to 22

Reviewed: cut/b2-piece-1c-save-and-reopen @ 1e4a7b6fca29bc59866182719edcc67461ec7553 (the branch, read only at `C:/dev/wt/b2c`), with the form, the ledger-side sources and the gate reports read on main @ c1aea32a166ef9727b059d3038a559181df0a86d (`C:/dev/spatial-ide`).

I have no shell. Every hash slot is `<H>`, for the custodian to compute. I started no shell and I leave no background shell. I wrote no file.

---

```markdown

## Amendment 20 — C-2 (A): `save_project`'s reply gains `project_relative`, the resolver's judgment as closed values; S18 from it; one end-to-end test from the real shape (class 9, declared before its code)

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The new words in item 3 are the architect's, not the human's. The sources are the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:9` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>, C-2 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect.md`, and Amendment 18 item 2. Branch code is named by path and item at 1e4a7b6fca29bc59866182719edcc67461ec7553, with no line and no hash.*

1. **The member, on the wire.**
   - The reply becomes `{project, history_mark, project_relative}`.
   - `project_relative` is always present. It is never null, and it is one of four closed strings: `carried`, `outside`, `no-canonical-spelling` or `through-link`. It holds no free text and no path.
   - `carried`: the file carries a `project-relative` locator beside the `machine-recorded` one.
   - Each of the other three values: the file carries the `machine-recorded` locator only, and the value names which of §2.5's three conditions failed. The save is not refused (§2.3, carrying rule).
2. **The types.**
   - **Rust,** `protocol/skp/src/v0/commands.rs`:
     - `pub enum ProjectRelativeLocator { Carried, Outside, NoCanonicalSpelling, ThroughLink }`, with `#[serde(rename_all = "kebab-case")]` and the derives of `HistoryMarkState`;
     - `SaveProjectResponse` gains `pub project_relative: ProjectRelativeLocator` after `history_mark`;
     - `deny_unknown_fields` stays, and there is no `#[serde(default)]`, so a reply without the member is refused.
     - The precedent is `CoverageState` in the same file on main: closed, kebab-case, no fallback.
   - **TypeScript,** `frontends/shell/src/skp/types.ts`: `ProjectRelativeLocator` as the union of the four strings, and `SaveProjectResponse.project_relative: ProjectRelativeLocator`.
   - **Where the judgment is made:** `resolver::judge` (`kernel/src/project/resolver.rs`), called once by `Projects::save`, which returns it as `Saved::carried`.
   - **How it reaches the reply:** `Projects::save_project` (`kernel/src/project/mod.rs`) maps `saved.carried` through one new private function. It is one exhaustive `match` with no wildcard arm:
     - `Carried::ProjectRelative(_)` → `Carried` (the path is dropped);
     - `MachineRecordedOnly(Why::Outside)` → `Outside`;
     - `MachineRecordedOnly(Why::NoCanonicalSpelling)` → `NoCanonicalSpelling`;
     - `MachineRecordedOnly(Why::ThroughLink)` → `ThroughLink`.
     A new `Why` is then a compile error until it is mapped.
   - `Carried`, `Why` and `Saved::carried` thereby gain their product caller, which closes C-2's caller-rule half. No `pub` item is added in the kernel.
   - `skp/client.ts`'s `saveProject` is unchanged: it inspects nothing.
3. **The words** (the architect's, not the human's). The worker applies them. The gate checks each clause against `judge` and the `Why` docs at R3's head.
   - **`ProjectRelativeLocator`'s doc:** What the project file carries for the data beside its `machine-recorded` locator, as the kernel judged it at this save (ADR-036 §5; SKP-V0.md §11.2). `carried`: a `project-relative` locator too. `outside`: the data or the folder could not be resolved at the save, or the data is not under the folder. `no-canonical-spelling`: the data is inside the folder, and its path has no canonical spelling on this machine. `through-link`: the data is inside the folder, and the path it was opened by does not reach it from the folder without a link. In each of the last three the file carries the `machine-recorded` locator only. Closed, kebab-case, no fallback; no path crosses.
   - **`SaveProjectResponse`'s doc** gains one sentence: `project_relative` is the resolver's judgment at this save ([`ProjectRelativeLocator`]).
   - **SKP-V0.md §11.2:**
     - the shape line's response becomes `{ project, history_mark, project_relative }`;
     - the block gains the definition line `project_relative = "carried" | "outside" | "no-canonical-spelling" | "through-link"`;
     - a bullet is added after `history_mark`'s: **`project_relative`** says what the project file carries for the data beside its `machine-recorded` locator, as the kernel judged it at this save (ADR-036 §5), with the four meanings above, each in one clause; the save is not refused; no path crosses.
   - **SKP-V0.md §8, the `skp/0.13` entry:**
     - its first bullet's response shape becomes `{project, history_mark, project_relative}`;
     - its Mechanics sentence gains one clause: `project_relative` joined the response in a second commit on the branch, under the same literal, before the version reached main (this amendment).
   - **The version.** The literal stays `skp/0.13`, and no fixture is renumbered. This is the second wire commit on the branch under `skp/0.13`, and main sees `skp/0.13` once, at #307's merge (the ruling).
   - §2.2's Response line stays as written. It is superseded by item 1 here.
4. **S18.**
   - It is shown for `no-canonical-spelling` only (§2.3, carrying rule, last bullet; §2.12 S18; OPEN-4 (A)). `outside` and `through-link` show no notice (OPEN-20-1).
   - It is a P6 placeholder with the id S18: an exported constant in `frontends/shell/src/project/saveProject.ts` beside S3 to S7, marked as the shell marks placeholders. It states only §2.12's S18 entry. The text is the worker's, not the human's.
   - **Its path:**
     1. the kernel's `Projects::save_project`;
     2. the src-tauri `save_project` binding, unchanged;
     3. `skp/client.ts`'s `saveProject`, unchanged;
     4. `createProjectSaver().save`, which returns S3, then S5 when `withheld`, then S18 when `no-canonical-spelling`, then S6 when a selection stands;
     5. App's save notices, unchanged.
5. **Tests**, in §4's form. Each mutation is observed under §4's rule.

   | Test | Mutation |
   |---|---|
   | E-SAVE, three new steps in `frontends/shell/e2e/project.mjs`, after SECOND-SAVE. **INSIDE-OPEN:** the suite's fixture is copied into a third `mkdtempSync` folder, under a name that holds U+007F (ADR-036 §5's canonical form refuses it, and Windows allows it), and opened by `openPath`. **INSIDE-SAVE:** `e2eSaveProjectToFolder` into that folder answers `asked`. **NOTICE-S18:** the page's save notices hold S18's text once, read by the driver from S18's constant in `saveProject.ts` by its name; the file's dataset entry holds the `machine-recorded` locator only. Real shape, from `judge` to the reply to the notice, with no mock. The third folder joins `dropFolders`. | m-s18: in the kernel's map, `NoCanonicalSpelling` → `Outside`. Expected: exit 1, failing at NOTICE-S18. Needs a rebuilt app, by THE MACHINE paragraph. |
   | K-S14 `the_save_reply_names_the_resolvers_judgment_carried_outside_no_canonical_spelling_or_through_link` (`kernel/tests/project_save_skp.rs`, from `SkpHost::open_dataset` through `Projects::save_project`). Four cases, each checking the reply's `project_relative`: F1 inside the folder; F2 outside it; F3 through a junction (Windows) or a symlink (Linux); inside the folder under a name holding U+007F. | `ThroughLink` → `Outside` in the map. |
   | P-U3 `the_project_relative_member_is_one_of_four_closed_values_and_is_required` (`commands.rs`, `mod tests`): the four kebab-case strings serialize and round-trip; a fifth string is refused; a reply without the member is refused. | `rename_all = "snake_case"` on the enum. |
   | SH-9 `a reply naming no canonical spelling shows S18 after the saved notice, and no other judgment shows it` (`project/saveProject.test.ts`). | S18's condition becomes `!== "carried"`. |

   - **Edited, all of them this piece's own text, not at B, so not I3:**
     - `protocol/skp/tests/data/v0-save_project-response.json` and `protocol/skp/tests/conformance/fixtures/responses-accept.json` gain the member;
     - the mocks in `App.save.test.tsx` and `project/saveProject.test.ts` gain `project_relative`;
     - any kernel test that builds or compares a whole `SaveProjectResponse` gains the member. The worker lists each one.
   - **Stop:** if the app or the engine refuses to open the U+007F name, the worker stops and reports it as I1. No other name is substituted without an amendment.
6. **Files and groups** (§2.11, step 1). None is new.
   - Protocol product: `protocol/skp/src/v0/commands.rs`, `protocol/skp/SKP-V0.md`.
   - Fixtures and protocol tests: the two fixtures in item 5.
   - Kernel product: `kernel/src/project/mod.rs`.
   - Kernel tests: `kernel/tests/project_save_skp.rs`.
   - Shell product: `frontends/shell/src/skp/types.ts`, `frontends/shell/src/project/saveProject.ts`.
   - Shell tests: `frontends/shell/src/project/saveProject.test.ts`, `frontends/shell/src/App.save.test.tsx`.
   - e2e: `frontends/shell/e2e/project.mjs`, `frontends/shell/e2e/README.md` (E-SAVE's entry gains its three steps).
   - **One commit,** R3's first (Amendment 22).
7. **Reuse.** `tools/reuse.mjs` has no prior art for the words the custodian ran, at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The shape follows the in-repo precedent named in item 2.

Nothing above is edited.
```

```markdown

## Amendment 21 — C1 (a): a save whose session record another project of this run holds writes no mark there and replies `withheld` (class 5); its kernel test; the KNOWN-LIMITATIONS sentence from the built code (class 9 for its item); the gate's question on the second open's steps; declared before its code

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The new words in item 2 are the architect's, not the human's. The sources are the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:11` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>, C1 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer.md`, and Amendment 18 item 2. Branch code is named by path and item at 1e4a7b6fca29bc59866182719edcc67461ec7553.*

1. **The behaviour, and where it is decided.**
   - **The decision.** `StepRecorder::mark_saved_here` (`kernel/src/session_history.rs`) takes the saving project's identity. Under the records lock it already takes, if the record `find` returns is held by a project other than the saving one, it writes nothing and returns a new `SavedHere` variant, `HeldByAnotherProject`.
   - **The reply.** `Projects::history` (`kernel/src/project/mod.rs`) passes the identity, and maps that variant to a new `Withheld::RecordHeldByAnotherProject`. The reply is then `history_mark: "withheld"`. The wire values are unchanged.
   - `adopt_project` is unchanged: it already does nothing when a project holds the record.
   - **Scope.** The ruling names the first save. Whether a later save of the same open does the same is OPEN-21-1, a red line. This commit is built on the human's answer, and the predicate above is the build under option (b).
   - **The doc sentences this change would make untrue** are brought current in the same commit, and the gate checks each:
     - `mod.rs`'s module doc, on `Projects::save`;
     - `Projects::save`'s doc, its last bullet;
     - `Withheld`'s doc;
     - `SavedHere`'s doc;
     - `mark_saved_here`'s doc;
     - SKP-V0.md §11.3, the "Every save" bullet.
2. **The reason, in words** (the architect's, not the human's). The gate checks each clause against the built code.
   - **`HistoryMarkState`'s doc in `commands.rs`:** Whether the session history took the `saved-here` mark. The project file was written in both cases; `withheld` says that the history holds no recorded step for the dataset, that the history's record for the dataset's file belongs to another project this run has saved, that the recorded steps do not reach the saved workspace, or that the history could not take the record move or the line.
   - **SKP-V0.md §11.2, `history_mark`'s last sentence:** `withheld` means the history holds no recorded step for the dataset, the history's record for the dataset's file belongs to another project this run has saved, the recorded steps do not reach the saved workspace, or the history could not take the record move or the line.
   - **SKP-V0.md §11.3, the "Every save" bullet's last sentence:** Only then does the history take its moves: the first save's record move, unless another project this run has saved holds the record, and a `saved-here` mark when the recorded steps reach the workspace and no other project holds the record.
   - **Under OPEN-21-1 (a)**, each "belongs to another project this run has saved" clause adds "at this project's first save".
3. **The kernel test,** in the reviewer's shape as the ruling gives it.

   | Test | Mutation |
   |---|---|
   | K-S15 `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged` (`kernel/tests/project_save_skp.rs`, through `SkpHost::open_dataset`, `record_step` and `Projects::save_project`). Open F, record a step, save to folder 1 (project A). Close F, open F again, record a step. Read A's record bytes. Save to folder 2 (project B). Assert that B's reply is `withheld`, that B's identity is not A's, and that A's record bytes are equal before and after B's save. Under OPEN-21-1 (b) only: a second save of B, with `folder` null, is also `withheld`, and A's bytes are still equal. | The project check in `mark_saved_here` removed. Expected: a failure at B's reply, which reads `written`. |

4. **The KNOWN-LIMITATIONS sentence.**
   - The worker writes it from the built code, with the file's DRAFT mark. Its comment names the code by path at R3's commit, with no hash.
   - The gate checks it clause by clause, and the PR body carries it to the human at the click. No wording is drafted here.
   - **Its place** (OPEN-21-2, recommendation taken): its own item, at the next free number at R3's base.
     - This is class 9 against §2.11's records group, which names one item for step 1.
     - `kernel/README.md`'s owner's-index line on declared limits names it beside item 62.
5. **The gate's question.** The ruling asks whether the second open's recorded steps are appended to A's record before any save. The gate answers it twice:
   - **By reading,** at R3's head:
     - `StepRecorder::record_step`'s match of a record: is it on path and claims only, or on the project too?
     - whether `close_dataset` reaches the recorder.
   - **By observation.** The reviewer adds one temporary assertion to K-S15: A's record bytes after A's save equal A's bytes just before B's save. The reviewer runs K-S15, records the pass or the failure by name with its commit, and reverts the assertion. Nothing of it lands.
   - **If they are appended,** the custodian proposes the S3 node, to be settled before lineage is written or recovery is offered, and a later amendment to this form says so. R3 builds no code for it. "The S3 node" is the ruling's name; §2.12's S3 placeholder is a different thing.
6. **Files and groups.** None is new.
   - Kernel product: `kernel/src/session_history.rs`, `kernel/src/project/mod.rs`.
   - Kernel tests: `kernel/tests/project_save_skp.rs`.
   - Protocol product, docs only: `protocol/skp/src/v0/commands.rs`, `protocol/skp/SKP-V0.md`.
   - Records: `KNOWN-LIMITATIONS.md` (the new item), `kernel/README.md`.
   - **Its own commit,** R3's second (Amendment 22).
7. **Qualified, not edited.**
   - §2.3's "First save and the session record" stands as written, and item 1 qualifies it for the case item 1 names.
   - ADR-036 Amendment 1 item 5 is the subject of OPEN-21-3.

Nothing above is edited.
```

```markdown

## Amendment 22 — R3, the correction round (class 1): Amendment 20, Amendment 21 and the attempt-2 words, in three commits; size, mutations, and gate 1's second attempt's scope; declared before its code

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The sources are Amendments 20 and 21; D-8 and D-9 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect-attempt-2.md`; DOC-1 to DOC-3 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer-attempt-2.md`; and the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:15` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>.*

1. **The commits,** on 1e4a7b6fca29bc59866182719edcc67461ec7553, after Amendments 20 to 22 are on main.
   - **R3-1:** Amendment 20.
   - **R3-2:** Amendment 21, built on the human's answer to OPEN-21-1.
   - **R3-3:** the attempt-2 words, each the report's own and none the human's. No re-gate is needed for them, and the PR body lists them.
     - D-8 and DOC-1 name one edit, in `frontends/shell/src/console/surfaceRegistry.ts`, applied once.
     - D-9 and DOC-3 name one edit, in `frontends/shell/src/console/surfaceCompleteness.test.ts`: the identifier, at both places. It is class 3 by named exception, because it is test text.
     - DOC-2 is one edit, in `frontends/shell/src/skp/client.ts`.
   - If OPEN-21-1 is not answered at dispatch, R3-1 and R3-3 are built and the worker stops before R3-2. The order is then recorded as class 1.
2. **Files, all of them already in the step's diff** (so the files stay at 75 of 77):
   - `protocol/skp/src/v0/commands.rs` (under `protocol/`)
   - `protocol/skp/SKP-V0.md` (under `protocol/`)
   - `protocol/skp/tests/data/v0-save_project-response.json` (under `protocol/`)
   - `protocol/skp/tests/conformance/fixtures/responses-accept.json` (under `protocol/`)
   - `kernel/src/project/mod.rs`
   - `kernel/src/session_history.rs`
   - `kernel/tests/project_save_skp.rs`
   - `frontends/shell/src/skp/types.ts`
   - `frontends/shell/src/skp/client.ts`
   - `frontends/shell/src/project/saveProject.ts`
   - `frontends/shell/src/project/saveProject.test.ts`
   - `frontends/shell/src/App.save.test.tsx`
   - `frontends/shell/src/console/surfaceRegistry.ts`
   - `frontends/shell/src/console/surfaceCompleteness.test.ts`
   - `frontends/shell/e2e/project.mjs`
   - `frontends/shell/e2e/README.md`
   - `KNOWN-LIMITATIONS.md` (the new item only)
   - `kernel/README.md`
3. **The expected size,** against §2.11 at B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208. These are estimates, not counts. R3's report counts by §2.11's command, and each group past its ceiling gets a class 8 row in the closing amendment. Nothing is trimmed.

   | Group | At 1e4a7b6f (gate 1, attempt 2, reviewer, check 1) | R3, estimated | Ceiling |
   |---|---|---|---|
   | protocol product | 408 | about +60 | 320 (class 8) |
   | fixtures, protocol tests and literal | 539 | about +4 | 390 (class 8) |
   | kernel product | 3,206 | about +45 | 1,350 (class 8) |
   | kernel tests | 1,547 | about +170 | 1,000 (class 8) |
   | shell product | 328 | about +20 | 380 |
   | shell tests | 421 | about +45 | 380 (class 8) |
   | e2e | 444 | about +90 | 320 (class 8) |
   | records | 51 | about +6 | 120 |
   | **Step** | **7,328 lines, 75 files** | **about +440, no new file** | **4,790 (class 8), 77** |

4. **Mutations**, each observed under §4's rule:
   - m-s18 (E-SAVE);
   - K-S14's;
   - P-U3's;
   - SH-9's;
   - K-S15's.
   - The reviewer also observes M-W5-1 again at R3's head, because R3-3 edits its test file.
   - Amendment 21 item 5's run is an observation of behaviour, not a mutation.
   - No `verify-mutation` run is called an observation.
5. **Gate 1's second attempt, completed.**
   - **The diff:** `git diff 791e7e9edb52328b7c430012c9a3a5e1105de8a2...<R3 head>`, reading R2 (b06bbbba5af7f8910f87b18d76e9d7e5ab3ca43e, 1e4a7b6fca29bc59866182719edcc67461ec7553) and R3 together (the ruling).
   - **Architect:**
     - §8, item by item;
     - the seam rule for shell → `save_project` → `judge` (E-SAVE's new steps) and for history → mark (K-S15);
     - the caller rule (`Carried`, `Why` and `Saved::carried` now have a product caller);
     - Amendments 20 and 21's words, clause by clause, and the new KNOWN-LIMITATIONS item, clause by clause;
     - the OPEN answers as applied;
     - Amendment 21 item 5.
   - **Reviewer:**
     - the mutations in item 4, and Amendment 21 item 5's observation;
     - §2.11, by its command;
     - every hash recomputed;
     - empty lock diffs.
   - **Then the suites, at the final head:** §9's suites and every e2e suite, E-SAVE included, by THE MACHINE paragraph; and green CI.
6. **H1** counts (the ruling, its #307 reviewer H1 paragraph). Amendment 16 item 1 stands, and the PR body names the consumer. Nothing is built for it.
7. **The PR body** gains:
   - S18 in its list of P6 strings;
   - Amendment 21's KNOWN-LIMITATIONS sentence, for the human at the click;
   - the R3-3 words.
8. **Rule (00)** at R3's dispatch is the custodian's, over item 2's paths and this form.
9. **Superseded index:** §2.2's Response line, by Amendment 20 item 1. Nothing else is superseded; §2.3 is qualified by Amendment 21 item 1.

Nothing above is edited.
```

---

## My answers to the lettered items, with reasons

**Amendment 20**
- **(a) Shape.** I chose one closed kebab-case value, not a `{state, reason}` pair.
  - It holds "carried or not, and why" with no combination that cannot happen, so no invariant needs checking at deserialize. The skp/0.5 `SourceCoverage` pair can hold such combinations.
  - It follows the `CoverageState` and `EndReason` precedent.
  - Reading the code at 1e4a7b6f, the judgment is made in `resolver::judge`, returned as `Judged.carried` and then as `Saved::carried`. `save_project` drops it today.
  - The map has no wildcard arm, so the protocol cannot drift from `Why`.
  - No path crosses, as SKP-V0 §11.2 requires.
- **(b) Version.** The words cover the type doc, the §11.2 shape and bullet, and the §8 `skp/0.13` entry. That entry's Mechanics sentence would otherwise become untrue, because it says the types landed in one commit. The literal does not change, under the ruling's sentence on one shape per literal on main.
- **(c) S18** is for `no-canonical-spelling` only. That is the only case OPEN-4 (A), §2.3 and §2.12 place it on. §2.5 step 4 gives a link no owner statement. The path is the existing one, and the only shell edit is in `saveProject.ts`.
- **(d) Tests.** E-SAVE's new steps are the one real-shape end-to-end test. Its mutation is in the kernel's map, so it proves the whole chain from `judge` through the reply to the notice. A shell-side mutation would prove only the last hop. K-S14, P-U3 and SH-9 each prove one layer. U+007F is the one name that ADR-036 §5's canonical form refuses and Windows allows without the `\\?\` prefix (dataset_ref's control-character check). I have not verified that the app opens such a name, so item 5 carries a named stop.
- **(e)** There is one commit and no new file. The groups are listed in item 6.

**Amendment 21**
- **(a) Where it is decided.** I put the decision in `mark_saved_here`, under the lock the line is written under. The record's owner is `StepRecorder` state, so `Projects` cannot see it.
  - The predicate the kernel holds, "another project holds this record", is equally true at B's later saves.
  - Under option (a), B's second save would write B's mark into A's record. That is the defect C1 named, so OPEN-21-1 recommends (b).
- **(b) Words.** These are W2 and W3 with the reason added. The §11.3 bullet also changes, because "the first save's record move" is no longer always true.
- **(c) K-S15** is the ruling's shape, which is also the reviewer's. The mutation removes exactly the new check.
- **(d)** No wording is drafted here. On its place, item 62 is about the machine store and this sentence is about the session history, so it gets its own item.
- **(e)** My reading at 1e4a7b6f is evidence for the gate, not the gate's answer. `record_step` matches a record on `r.path == ds.path() && same_claims(...)` and not on the project. Records are removed only by `end_session`, and the reviewer's attempt-1 evidence for C1 found no recorder call at `close_dataset`. So I expect the second open's steps to be appended to A's record, and the S3 node to be proposed. The gate needs both a reading and an observation. A reading alone is the gate's inference. A landed test would pin behaviour that S3 has not decided, which is why the observation is run once and reverted.
- **(f)** Its own commit; the groups are in item 6.

**Amendment 22.** D-8 and DOC-1, and D-9 and DOC-3, are the same edits, applied once. DOC-2 is the one the architect did not name. The size figures are estimates and are labelled as such. M-W5-1 is observed again because R3-3 edits its file.

## OPEN items

- **OPEN-20-1 (red line: strings and scope).** Which `project_relative` values show a notice.
  - (a) S18 for `no-canonical-spelling` only, where the form places it.
  - (b) Also a new placeholder for `through-link`.
  - (c) A notice for each of the three values that are not `carried`.
  - **Recommend (a).** The ruling names S18 only. §2.5 gives a link no statement. `outside` is the ordinary case of data kept outside the project folder, which ADR-036's Consequences handle by re-linking.
- **OPEN-21-1 (red line: scope of a ruled item).** Does a later save of B also withhold the mark?
  - (a) The first save only, as the ruling's words say.
  - (b) Every save of an open whose record another project holds.
  - **Recommend (b).** Under (a), B's later save writes B's mark into A's record and replies `written`. That is C1 again, and A's record would change.
  - R3-2 waits for the human's answer.
- **OPEN-21-2 (not a red line).** Where Amendment 21's KNOWN-LIMITATIONS sentence goes.
  - (a) Its own item, at the next free number.
  - (b) A sentence in item 62.
  - **Recommend (a).** The recommendation is taken under `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4, which holds to 2026-11-16.
  - The custodian checks it under rule (00) against port-2's items in `KNOWN-LIMITATIONS.md`.
- **OPEN-21-3 (red line: ADR text).** ADR-036 Amendment 1 item 5 says the history moves at a project's first save. Under C1 (a), nothing moves at B's first save.
  - (a) No ADR text in step 1. The ruling, Amendment 21 and SKP-V0 §11.2 and §11.3 carry the case, and any ADR-036 text comes with the S3 node.
  - (b) A note in ADR-036, in the human's typed words, in this PR.
  - **Recommend (a).** Item 5 does not cover a record that has already moved. The S3 node decides what a second open's history is, and a note now would pre-empt that.

## Notes (none blocks)

- The name "S3" is overloaded. It is the ruling's node, and it is also §2.12's saved-notice placeholder. The amendments write "the S3 node" for the node.
- The brief lists `docs/04`. In this repo that is `docs/04_AI_and_MCP.md`, which has nothing on SKP versioning or replies; its only SKP line says AI acts through SKP/MCP. The versioning rules are in `protocol/skp/SKP-V0.md` §4 and §8.
- The reuse index missed both phrases, as noted in Amendment 20 item 7. Prior art in the repo: the closed kebab-case enums of skp/0.5 in `commands.rs`.
- I found the fixture paths and the kernel test file holding `history_mark` by a file-name Grep only. I did not read them: `project_save_skp.rs` and the fixtures are outside the brief's list of branch files. The worker lists every edit it makes in them.

## What I read

**On main @ c1aea32a:**
- `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md`
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: §2.1 to §2.14, §3 to §10, the OPEN section, Annex A and Amendments 16 to 19
- `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect.md`
- `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer.md`
- `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect-attempt-2.md`
- `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer-attempt-2.md`
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` §5 to the end (main carries no amendment; Amendment 1 was read as the form's Annex A)
- `docs/04_AI_and_MCP.md`, by Grep
- `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, existence only

**On the branch @ 1e4a7b6f, `C:/dev/wt/b2c`:**
- `protocol/skp/src/v0/commands.rs`: `save_project`'s types and `HistoryMarkState`, plus the skp/0.5 enums for precedent
- `protocol/skp/SKP-V0.md`: §8's `skp/0.13` entry and §11
- `kernel/src/project/mod.rs` up to `skp_error_of`
- `kernel/src/project/resolver.rs`, whole, for `judge`
- `kernel/src/session_history.rs`: `Record`, `SavedHere`, `record_step`, `adopt_project`, `mark_saved_here`, `end_session`, `create`, `find`
- `kernel/src/project/store.rs`, its items by Grep
- `frontends/shell/src/project/saveProject.ts`
- `frontends/shell/src/skp/client.ts` and `frontends/shell/src/skp/types.ts`: the `save_project` types only
- `frontends/shell/e2e/project.mjs`
- `KNOWN-LIMITATIONS.md`, item 62
- `kernel/src/dataset_ref.rs`'s canonical-form check, by Grep

## Waiting and background shells

I have no shell, so `state/directives/2026-10-29-wait-loops-sleep-and-time-out-background-shells-killed-at-closing.md` had nothing to act on. I leave no background shell.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports it.
