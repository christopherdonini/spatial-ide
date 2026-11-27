*Filed by the custodian: lead-data's draft preregistration for (f) of ADV-2026-11-21-15 item 4 (iv), a re-link offered after a refusal at the recorded place (KNOWN-LIMITATIONS item 73), node:relink-after-refusal-at-the-recorded-place@lead-data-draft-1, dispatched at 2026-11-22T20:56:56.757Z. It read the repository at 0a2f0022 in a detached read worktree and ran nothing. Its run: Grep 36, Read 39, Glob 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T20:57:05Z to 2026-11-22T21:07:47Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 28246 bytes, sha256 ed47773e84f271ea486fd6c7b84ceb9b37fda66b98c50add6a9365a05a69b60d, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

---

Result: I drafted the full form for node (f). My recommended mechanism, OPEN-1 (A), needs no kernel product code and no change to the wire types. It shares no path with node (g) or node (d).
Blocking questions: none. Each OPEN item is a question for the advisor or for the architect.
Report path: state/consults/2026-11-22-relink-after-refusal-at-the-recorded-place-lead-data-draft.md. I wrote no file, as the brief says. The report is this message. I have no Bash, so the custodian computes the sha256 from the hand-back.

# A re-link offered after a refusal at the recorded place (node (f), KNOWN-LIMITATIONS item 73): preregistration, full form

**Authority:**
- ADV-2026-11-21-15 item 4 (iv) (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:25` @ 0a2f0022), sub-line: "Full form, both gates: it changes section 12.3 of the SKP spec. It is the piece that carries R8's bullet for that section (ADV-2026-11-21-06 item 3)."
- ADV-2026-11-22-11 item 2, last bullet (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md:17` @ 0a2f0022): "each is built and gated on its branch now, and its merge request waits for the tag."
- R8's bullet, which this form carries:
  - ADV-2026-11-21-06 item 3 (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-06-p5s-words-ruled-seven-texts-changed-r8-out-of-p5-q1-to-q6-answered-four-files.md:13` @ 0a2f0022): "The bullet is carried on the 1c form to the next piece that edits that file under both gates, where the architect, whose note it answers, reads it."
  - `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` Amendment 70 item 3 (:4733 @ 0a2f0022).
  - Its text: `state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md:134`.
  - Its reasons: the same file, :127-136, and Q3 at :322.
- PLAN node: the custodian names it when placing it. Working name: `relink-after-refusal-at-the-recorded-place`.
- The reuse index (tools/reuse.mjs in the read-only reuse clone at 89bbac37, 2026-11-22, exit 1) gave, byte for byte:
  `No prior art recorded for "re-link a moved data file". Research it before planning an implementation.`
  This form records that miss. Its own research is §0's reading of the code.

**Drafted by:** lead-data, on the custodian's brief. I read only in the read worktree at main 0a2f0022f6247a8f0c00360a12eedca333b447f4, and every `path:line` below is at that commit. I had no Bash, so the custodian adds the span hashes by script. Every pin is historical: for the code, the piece's base on main is authoritative.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating:** full, with both gates (§1 gives the class).

**Merge:** the change ships in the app and is not on v0.2's list. ADV-2026-11-21-15 item 1 (:11 @ 0a2f0022): "A product piece outside the list may be built and gated on its branch; its merge request waits for the tag or for the human's word, and I tell them when one is ready."

## §0. Disclosure

**Reasoned from code.** Nothing was run.

**What the user meets today:**
- `data_at` (`kernel/src/project/mod.rs:1096-1130`) takes the project-relative locator first and never falls through to the location the machine recorded. `check_inside` (`kernel/src/project/resolver.rs:165-188`) refuses a missing segment as `CheckRefused::Unresolvable` (:174).
- `open_error_of` (`kernel/src/project/mod.rs:950-952`) sends that refusal as `skp.project_target_unresolvable` with `locator` and `segment` (`protocol/skp/src/v0/error.rs:308-317`).
- The shell's `reopenRefusalPlace` (`frontends/shell/src/project/openProject.ts:92`) gives that code with a `locator` the line `REOPEN_LOCATOR_REFUSAL_NOTICE` (`frontends/shell/src/project/reopenNotices.ts:104`).
- The re-link choice shows only in the `not_found` state (`frontends/shell/src/admission/AdmissionPanel.tsx:536-543`). The DEV hook `e2eRelinkFile` answers "not-asked" in any other state (:452-457).

**The kernel already takes a re-link here.**
- `open_project`'s step 5 uses `relink` before any locator (`kernel/src/project/mod.rs:807-813`; its doc, :687-693). The resolver runs only inside `data_at`.
- So a second call with `relink` after this refusal opens the chosen file and writes `locations.json` (:849-866).
- What blocks the user is the shell alone, which offers no choice. Item 73's comment (`KNOWN-LIMITATIONS.md:551`) names the same symbols.
- No test covers a re-link of a project whose file carries a project-relative locator. W-3 (`kernel/tests/project_reopen_skp.rs:327-348`) and K-O8 (`kernel/tests/project_reopen.rs:1263-1291`) cover only data saved outside the folder.

**Whether the re-link lasts.**
- `open_project` rewrites `project.spatial` only for a copy, and then only its identity (:759-764, :794-796).
- A later save judges the locators again from the open's path (`resolver::judge` at :351) and writes `locations.json` (:365-367, :401-402).
- So the old locator stays in the file until a save. Before that save, the next reopen is refused again.

**ADR-036 §5** says of the locator's target (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:104`, sub-line): "A refused target is not opened, and is refused by name". Under OPEN-1 (A) the target is still refused by name. The file opened afterwards is the one the user chose, which is not the target. The architect reads this.

**Intake:**

| Item | Disposition |
|---|---|
| Item 73: no re-link offered after the refusal | In |
| R8's bullet in §12.3 | In (§2 item 2) |
| A notice after the re-linked open | OPEN-3 |
| Offering the choice for `through_link` or `wrong_kind` | OPEN-5 |
| `binding_pick_file`'s Console effect text, which names only `open_dataset` (`frontends/shell/src/console/surfaceRegistry.ts:126-129`) | Out: the Console piece owns that file. It goes to the docs lane. |

## §1. May and may not claim

**May claim:** after `skp.project_target_unresolvable` with a `locator` at a reopen:
- the refusal block offers the existing choice `RELINK_CHOICE` (`frontends/shell/src/project/reopenNotices.ts:65`);
- a file chosen there is sent as `relink` with the run's answer;
- the kernel opens it;
- the next save records its place.

**May not claim:**
- that the re-link lasts before a save;
- anything about `through_link` or `wrong_kind` (OPEN-5);
- any `docs/08` figure;
- any platform beyond the ones CI and the Windows e2e run.

**Class.**
- ADV-2026-11-16-06 item 0 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:13`) says the ruling "runs for a week from 2026-11-16". That week has ended, so `governance/AUTONOMY.md` §21a and §21c now govern.
- §21a lists "any SKP control- or data-plane message, literal, or field" (:323). This piece edits `protocol/skp/**` and §12.3's contract.
- §21a also lists "or any property currently under test" (:327). Item 69's check is under test (W-4's missing case, `kernel/tests/project_reopen_skp.rs:437-441`).
- §21c requires "no new user-visible behaviour" (:351), and this piece adds some. It is also over §21c's line bound (§7).
- So the class is full with both gates. That is the class item 2 (a) of the expired ruling gave too (:25: "anything on the wire"; "a piece that crosses a seam between modules").

**Unchanged:**
- the request and reply types and the literal `skp/0.14`;
- the codes and messages in `error.rs`;
- `kernel/src/**`;
- the persistence formats;
- `protocol/data-plane/`;
- ADR-006's class of `open_project`. Its `locations.json` write at a re-link exists today (:849-866).

## §2. The change (OPEN-1 (A), recommended)

1. **Shell: `frontends/shell/src/admission/AdmissionPanel.tsx`.**
   - (a) A new exported pure function `relinkOffer(state: State): { folder: string; options: AdmitOptions } | null`. It returns `{ folder, options }` in two cases:
     - the `not_found` state;
     - the `refused` state, when `options.reopen` is set, `inFlight` is false and `owner === REOPEN_LOCATOR_REFUSAL_NOTICE`.

     It returns `null` otherwise, and that is the whole rule. The owner place stays the one decision site (OPEN-4).
   - (b) The `refused` block renders the existing `admission-reopen-relink` button, labelled `RELINK_CHOICE`, after `RefusalBlock` (:545-547) when `relinkOffer(state)` is not null. Its click runs `handleRelink(offer.folder, offer.options)` (:393-401), which is unchanged.
   - (c) `e2eRelinkFile` (:452-457) uses `relinkOffer(stateRef.current)` in place of its `kind !== "not_found"` test.
   - (d) Declared unchanged:
     - `runAdmitPath` keeps the refused state across the re-link call (:232-236);
     - a Cancel of that call returns to the same refusal, with its choice (:250-258);
     - a dismissed picker ends at `Open cancelled` (:396), as it does at S11 today.
2. **Spec: `protocol/skp/SKP-V0.md` §12.3** (drafts for the architect; not the human's words).
   - Old (:1432 @ 0a2f0022): "- **A `relink`** is an absolute UTF-8 path to a file the client chose after `not_found`. It replaces the dataset's entry in the machine store whatever the entry held. A client sends one after a `not_found`."
   - New (draft): "- **A `relink`** is an absolute UTF-8 path to a file the client chose after a `not_found`, or after a refusal as `skp.project_target_unresolvable` that names a `locator`. It is used in place of every locator the project file carries, and the resolver's check is not made on it. It replaces the dataset's entry in the machine store whatever the entry held. The project file keeps its locators until a later `save_project` judges them again (§11.3), so a call without a `relink` before that save is refused again while the file is not at the place the locator records."
   - Clause check:
     - "used in place of every locator": :807-813.
     - "check is not made": `check_inside` is called only in `data_at` (:1103).
     - "replaces the entry": :767-770 and :849-866.
     - "keeps its locators": :759-764 and :794-796.
     - "judges them again": §11.3 (`protocol/skp/SKP-V0.md:1365`) and :351.
     - "refused again": :1102-1111.
   - R8's bullet is added after the bullet that begins "**The open**" (:1433), as carried (consult :134, byte for byte): "- **The machine.** Wherever this section says "the machine" or "this machine", it means one user's machine store: the `spatial-ide/projects` folder in the per-user data directory, with one folder for each project identity, holding that identity's `folders.json`, `locations.json`, `open.lock` and the lineage file kept on this machine. Another user of the same computer has a store of its own, which this user's calls neither read nor write."
   - Its clause check:
     - `projects_root` (`kernel/src/project/store.rs:67-70`);
     - `record_dir` (:73-75);
     - `LOCATIONS`, `FOLDERS` and `OPEN_LOCK` (:40-44);
     - `PREVIOUS_LINEAGE_FILE` (`kernel/src/project/mod.rs:505`).
   - "This section" in that bullet is ambiguous (OPEN-9).
3. **Spec: a §8 note** (draft), after the `skp/0.14` entry: "### Note: a `relink` after a refused locator (<date>; no literal change)". Its body, in draft:
   - `skp/0.14` stands, no literal is bumped and no fixture changes.
   - §12.3's `relink` bullet names a second case in which a client sends one, after `skp.project_target_unresolvable` with a `locator`. The kernel already used a `relink` before any locator at `skp/0.14`.
   - §12.3 gains the bullet on "the machine".
   - No key, value, code, message or command is added or removed, and `protocol/data-plane/` has an empty diff.

   The precedents are the notes at :1146-1156 (OPEN-2).
4. **Types' doc: `protocol/skp/src/v0/commands.rs:779-783`.** Paraphrase: today `OpenProjectRequest`'s doc says `relink` is the path chosen after a `not_found` reply. Draft: it also names a refusal as `skp.project_target_unresolvable` with a `locator`, and says that the `relink` is used in place of the file's locators (SKP-V0.md §12.3). No field, serde attribute or type changes.
5. **Strings, drafts for the advisor; none is the human's.**
   - `REOPEN_LOCATOR_REFUSAL_NOTICE` (`reopenNotices.ts:104`).
     - Old: "The project was not opened in this window. If its data file was moved or renamed, put it back where the project recorded it, then open the project again."
     - New (draft): "The project was not opened in this window. If its data file was moved or renamed, put it back where the project recorded it and open the project again, or choose the file where it is now. The project records the new place when you save it."
     - It goes in the same constant. `openProject.test.ts:97` uses it by name, so that test is untouched.
   - The app shows no other new string: the button's label is the existing `RELINK_CHOICE`.
6. **KNOWN-LIMITATIONS, drafts for the advisor; numbers unchanged.** Item 73's title (:549) becomes untrue, along with :550's "The app does not offer to choose the file again."
   - New item 73 (draft):
     - Title: "**A project whose file records its data by a path from the project folder, opened by choosing its moved data file, still records the old place until it is saved.**"
     - Paragraph: "If the project file records its data by a path from the project folder (item 69) and the file is no longer at that place in the folder, the open is refused. The line beside the refusal says that the project was not opened, and the app offers to choose the file where it is now. A file chosen there is opened without the check of item 69. The project file still records the old place until you save the project, so an open before that save is refused again and the choice is offered again. Saving records the file's new place: by its path from the project folder when it is inside the folder, reached without a link and spelled canonically, and otherwise by the path this machine records."
     - Its comment names `relinkOffer`, the button, `handleRelink`, :807-813, `data_at` and `judge`.
   - Item 69 (:534) gains one sentence (draft, OPEN-7): "A data file that you choose after such a refusal (item 73) is opened as you chose it, with no check of the names on its path."
7. **Portability.** No OS-dependent feature is added or changed. The picker and the re-link already exist on each platform. K-F1 runs on every CI platform. R10 and the operator Part run on Windows only, as E-REOPEN does.

## §3. Fixtures and predicted outcomes

- K-F1: F1 written by `spatial_engine::fixture::write_geoparquet`, as `write_f1` does (`kernel/tests/project_reopen_skp.rs:71-81`). It is generated per run, not hash-verified (disclosed).
- R10: `filter-zoned.parquet`, copied read-only as `reopen.mjs` copies it (:44).

| # | Scenario | Base | After |
|---|---|---|---|
| F-1 | inside data saved; file renamed in the folder; reopen | refused, `skp.project_target_unresolvable`, `segment` the old name | same |
| F-2 | F-1, then reopen with `relink` to the renamed file | `opened` (the kernel is unchanged) | same |
| F-3 | F-2 closed; reopen without relink | refused as F-1 | same (declared limit) |
| F-4 | F-2, saved, closed; reopen without relink | `opened`; the file's project-relative `at` is the new name | same |
| U-1 | the shell refused state, reopen, owner the locator line, not in flight | no offer | offer `{path, options}` |
| E-1 | real app: F-1 then the relink hook | the hook returns "not-asked" | "admitted" |

## §4. Tests, one mutation each

**P0, before the fix.**
- Commit 1 adds four things:
  - `relinkOffer` with today's rule, the `not_found` state alone;
  - its use in the hook;
  - S-1;
  - K-F1;
  - R10.
- S-1 (ii) fails, and R10 fails at the re-link. Both are recorded with the commit id.
- K-F1 passes at P0 and is declared so. It pins the kernel behaviour the shell now relies on: the kernel is unchanged, so it is no red-first test.
- Commit 2 widens `relinkOffer` and renders the button.

**S-1**, in `frontends/shell/src/admission/AdmissionPanel.test.ts`: `relinkOffer offers the re-link after a refused locator and nowhere else`. Its cases:
- (i) `not_found` gives an offer;
- (ii) a reopen refused with owner `REOPEN_LOCATOR_REFUSAL_NOTICE` gives `{folder: path, options}`;
- (iii) a reopen refused with `REOPEN_REFUSAL_NOTICE`, either `OPEN_ELSEWHERE_*` or `ENGINE_REFUSAL_NOTICE` gives null;
- (iv) a dataset-open refusal gives null;
- (v) case (ii) with `inFlight: true` gives null.

Mutations:
- M-S1: the owner test removed. S-1 fails at (iii).
- M-S2: the `inFlight` test removed. S-1 fails at (v).
- M-S3: the `options.reopen` test removed, with a dataset-open state built with that owner. S-1 fails at (iv).

**K-F1**, in a new `kernel/tests/project_relink_inside_folder_skp.rs` (its own rig, `mod watch_support;`, wire JSON as `project_reopen_skp.rs:157-170` builds it): `a_relink_after_a_refused_locator_opens_the_chosen_file_and_the_next_save_records_its_place`. It covers F-1 to F-4. It asserts:
- the code and `segment`;
- `opened`;
- the path in `locations.json`;
- the refusal again;
- after the save, the project file's `project-relative` `at`.

Mutations, applied in the worktree only, never committed:
- M-K1: in `open_project`, `data_at` is consulted before `relink`. K-F1 fails at F-2.
- M-K2: in `Projects::save`, `judge` is skipped and `reference` is written. K-F1 fails at F-4's `at`.

**R10** in `frontends/shell/e2e/reopen.mjs`, built as `stepR9` is (:338-354), with the data inside a new folder. It checks four things:
- the locators include `project-relative`;
- after the rename, `hookOpen` gives `skp.project_target_unresolvable`;
- `.admission-reopen-relink` shows in the refused block;
- `hookRelink` gives "admitted".

Mutation M-E1: the button's render is removed. R10 fails at the button check.

Each mutation is observed by applying it, running the named test, recording the failure by name with its commit, and reverting it. A `verify-mutation` run is not an observation. R10's runs are the tester's, inside the machine's holds.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:**
- P0 behaves as §4 says.
- S-1, K-F1 and R10 pass on the fix.
- Each mutation fails its test as §4 says.

**Declared unchanged:**
- W-3, and W-4's missing case (`kernel/tests/project_reopen_skp.rs:327-348`, :437-441);
- K-O8;
- `openProject.test.ts` (the place test at :97);
- the existing `AdmissionPanel.test.ts` cases;
- E-REOPEN R1 to R9 and E-CHANGED.

**Invalidators:**
- I1 (stop): K-F1 fails at P0, so the kernel needs a change. The form is re-drafted, and `mod.rs` meets node (d).
- I2 (stop): the architect rules a literal bump or a type change (OPEN-2 (b)). That is a class 9 addition before any of its code.
- I3 (invalid run): S-1 (ii) passes at P0.
- I4 (invalid run): R10 at P0 fails for any reason but "not-asked".
- I5 (stop): a declared-unchanged test fails.
- I6 (stop, to the custodian): the first step shows a fault of item 7's kind (ADV-2026-11-21-15 :32).

**Falsification:** the form is falsified if, after the fix, any of these holds:
- a user who meets item 73's refusal cannot open the project by choosing the moved file;
- the choice is offered outside OPEN-5's set or while a call is in flight;
- the next save does not record the chosen file's place.

## §6. Instruments

Assertions only:
- reply codes and fields;
- the file's locators;
- `locations.json`'s path;
- the DOM's button;
- the hook answers;
- `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit.

## §7. Declared values and ceilings

- No new constant.
- Size: at most 420 changed lines, insertions plus deletions, over at most 10 files.
- The files: `AdmissionPanel.tsx`, `AdmissionPanel.test.ts`, `reopenNotices.ts`, `SKP-V0.md`, `commands.rs`, the new kernel test, `reopen.mjs`, `frontends/shell/e2e/README.md` (the E-REOPEN entry), `KNOWN-LIMITATIONS.md` (items 69 and 73) and `frontends/shell/MANUAL-WALKTHROUGH.md` (a new Part AE).
- Estimate:
  - about 170 lines for K-F1;
  - about 95 for the shell product code and its test;
  - about 45 for R10;
  - about 15 for the spec;
  - about 30 for the words.
- Counting: `git diff --numstat <merge-base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
- An overrun is class 8, and this line is never edited to match.

## §8. Block-on-sight

1. Any diff outside §7's files, this form, PLAN and the records.
2. Any diff to node (g)'s five paths, or to `kernel/src/**` (node (d)'s `mod.rs` among them).
3. A change to the types, a serde attribute, the literal, a fixture, `error.rs`, a dependency, a lockfile or a workflow.
4. `surfaceRegistry.ts` touched.
5. An offer outside OPEN-5's set, or while a call is in flight. A second decision site beside the owner place (unless OPEN-4 (b) is ruled).
6. A new string beyond §2 item 5, or a draft string landed before the advisor's words.
7. A sleep or a timeout in S-1 or K-F1; a platform ignore.
8. A declared-unchanged test's assertions edited.
9. A `verify-mutation` run called an observation; a mutation without its commit.
10. A §7 overrun not recorded as class 8, or §7 edited.
11. A line cite into `governance/DECISIONS-PENDING.md`; a hash at a branch commit; a bare self-line.
12. A merge before the tag without the human's word; a squash or a rebase merge.

## §9. Gates

**Architect** reads:
- the R8 bullet, which answers its own note;
- §2 items 2 to 4 against `mod.rs:807-813` and ADR-036 §5 (:104);
- OPEN-1, OPEN-2 and OPEN-9;
- docs/01's never-block rule (the picker and the call are unchanged);
- ADR-006 and ADR-018;
- the seam rule for each interface below, and the caller rule for `relinkOffer`, whose callers are the render and the hook;
- §8, item by item.

**Reviewer** reads:
- the full diff;
- P0 and the six mutations, observed again;
- the §7 count;
- the clause checks of §2.

**Seams**, each against its actual interface. The end-to-end tests are K-F1, from the wire JSON, and R10, through the real app.
- `Projects::open_project(&self, folder: &Path, cancel_key: &str, answer: Option<Answer>, relink: Option<&Path>) -> Result<Reopen, OpenFailure>` (:701-707).
- `open_project_command(&self, req: OpenProjectRequest) -> Result<OpenProjectResponse, SkpError>` (:894-897).
- `OpenProjectRequest` (`commands.rs:786-794`).
- The shell's `openProject(folder, cancelKey, answer, relink)` (`frontends/shell/src/skp/client.ts:171`).
- `admitProject` and `reopenRefusalPlace` (`openProject.ts:62-94`).
- `runAdmitPath` (`AdmissionPanel.tsx:216`) and `handleRelink` (:393-401).

**Suites, green before either gate:**
- the shell's format check, typecheck and tests;
- `cargo test --locked -p spatial-kernel --test project_relink_inside_folder_skp`, then the kernel and `spatial-skp` suites on Windows, inside the machine's holds;
- `cargo fmt --check` and clippy;
- the four verify scripts and `verify:plan`;
- CI's `node --test` scripts suite;
- E-REOPEN with R10, a tester's series;
- the branch's CI, read before gating.

**Operator:** ordinary use reaches the change, so a new Part AE is committed with a blank result log. Its rows, in sketch (words for the advisor):
- AE0: read §10, the last amendment first.
- AE1: save a project whose data is inside its folder. Rename the data file. Open the project, and see the refusal with its line and the choice. Choose the renamed file, and the project opens.
- AE2: open the project again without saving, and it is refused again. Save, and the next open asks nothing.
- Each row gives the felt verdict and the strings for sight.

After the merge, lead-data writes the owner's-index pointers.

## OPEN questions

- **OPEN-1, the mechanism.**
  - (A) The shell offers the choice after the refusal. The kernel and the types are unchanged, and only §12.3's text changes. Recommended.
  - (B) The kernel replies `not_found` for a missing target. A refusal becomes a reply, against ADR-036 §5 (:104), which is a red line. It likely also needs a member saying which place, with a literal bump.
  - (C) The kernel falls through to `locations.json`. That alters item 69's guarantee and the point of the locator. Not recommended.
- **OPEN-2, the literal.**
  - (a) A §8 note with no bump, as at :1146-1156. Recommended.
  - (b) `skp/0.15`, with fixtures and the shell's literal (I2).
- **OPEN-3, a line after the re-linked open about saving.**
  - (a) None. The refusal's line carries the save sentence. Recommended, since it keeps clear of `openProject.ts`.
  - (b) A notice in `reopenApply`, which shares `openProject.ts` with node (g) and would wait for its merge.
- **OPEN-4, the offer's decision site.**
  - (a) Keyed on the owner place `reopenRefusalPlace` chose. Recommended.
  - (b) A second predicate on the code and its fields in `AdmissionPanel.tsx`.
- **OPEN-5, which refusals offer the choice.**
  - (a) `skp.project_target_unresolvable` with a `locator`, which is item 73. Recommended.
  - (b) Also `through_link` and `wrong_kind`. A chosen file passes the link check by the user's choice, so this reaches further into item 69.
- **OPEN-6, overlap.** Under (A), OPEN-3 (a) and OPEN-4 (a), the piece shares no path with node (g)'s five paths or with node (d)'s `kernel/src/project/mod.rs`. M-K1 and M-K2 touch `mod.rs` in the worktree only. Recommended order:
  - start when the place is free;
  - this piece is the one piece touching `protocol/`, so the custodian confirms that no in-progress or awaiting piece touches `protocol/` (I could not read the branches);
  - if OPEN-3 (b) is ruled, code waits for (g)'s merge.

  KNOWN-LIMITATIONS items 69 and 73 and Part AE are this piece's alone, as far as I read.
- **OPEN-7, item 69's added sentence (§2 item 6).** It changes the words of a guarantee under test, so it goes to the custodian as a question and to the advisor for the words.
- **OPEN-8, the form's path.** Recommended: `governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md`, beside node (g)'s, since the product code is the shell's.
- **OPEN-9, "this section" in R8's bullet.** It sits in §12.3 but covers §12.2 to §12.4. Recommended: "§12" in place of "this section", as one changed word for the architect. Otherwise the bullet stays as carried.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

---END OF FORM---

Note (lead-data, for the custodian):

1. **What I could not settle from the code:**
   - whether `openAndSave` in `reopen.mjs` copies the fixture itself, and how a later save is driven through the DEV hooks, so R10 stops at the admitted re-link and K-F1 covers the save;
   - whether any in-progress branch touches `protocol/` (OPEN-6);
   - whether the Console piece (PR 359) edits `AdmissionPanel.tsx`. If it does, that file is a shared path.
2. **Item 7:** I found no fault a user can meet in ordinary use that no limitation declares. The fix creates a new limit, a re-link that does not last until a save, and the new item 73 words declare it. Separately, `binding_pick_file`'s Console effect text (`surfaceRegistry.ts:126-129`) names only `open_dataset`, though the S11 re-link also uses that picker before `open_project`. That is a registry text, not a product fault. It goes to the docs lane with the Console piece's file.
3. **For the human:** no dependency, lockfile or workflow. OPEN-1 (B) would need an ADR-036 amendment, a red line, and I do not recommend it. OPEN-7 alters the words of a guarantee under test: it is a question for the custodian, not a decision of mine.
4. **My role's bounds:** the piece crosses into `frontends/shell` and `protocol/skp`. I drafted it because the brief asked for it. The architect may want to confirm the cross-module design at the form gate.
5. **Words:** every string and item text above is a draft for the advisor, and none is the human's. R8's bullet is the P5 drafter's text, carried byte for byte. The owner's index is unchanged.
