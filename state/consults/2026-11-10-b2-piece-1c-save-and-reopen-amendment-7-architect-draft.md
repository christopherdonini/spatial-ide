*Custodian's filing note (2026-11-10): the architect's draft of 1c's Amendment 7, from its hand-back (sha256 674abd003aea3af46fea41fdca3a98a91c567abc5c9a7d5b6ea01cb7f16fcea5, 22032 bytes), byte for byte below the rule. Its brief by file (7246 bytes, sha256 38f006e4c3372b0c72361a6ef1be007d369ae8e4c89ad11a0da7793d24f2761d); the run 2026-11-10T20:06:51Z to 2026-11-10T20:17:25Z by its transcript, 56 calls, model claude-opus-5-5. Checked by the custodian at d6f045ae: the two option texts it says conflict (OPEN-18 (b), step 1's first commit; OPEN-A2 (b), P2's version bump), and step 1's first commit dated 2026-10-22, before the ruling. Not yet appended to the form: its pins are computed by script first, and OPEN-7-1 is the human's.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 7

I read main at e57d75e191ea35fe44c3a26887d73b82f4b53262, and `cut/b2-piece-1c-save-and-reopen` at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 (read-only at the worktree the brief names; I read only the two files it allows).

**One departure from the brief, and why.** The brief asks for branch code to be cited as `path:line @ 4761ded8…`. A hash pinned at a branch commit in an append-only record is forbidden by round 15 (e) and by §8 item 12's fourth bullet. A line cite without a hash does not meet round 14's pin form. So the block cites branch code by path, item name and commit, with no line and no hash, the way Amendments 1 and 5 cite the probe. Every `path:line` below is at main e57d75e1 and carries `sha256:<H>` for the custodian's script. Nothing in the block is a quotation.

````markdown

## Amendment 7 — written after O1's result was seen, before P2's code: a code for a first save with no folder (class 9); the `record_step` widening, placed by the human's ruling of 2026-10-23 and declared before any of its code (class 9); its commit place, for the human (OPEN-7-1, a red line); the superseded index

*Drafted by the architect, read only, at main e57d75e191ea35fe44c3a26887d73b82f4b53262. References only. Self-references are by section, amendment and item. Branch code is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two phrase queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-10. The misses are noted and do not block. Every new test's mutation is observed under §4's rule. §7 is not edited, and an overrun is class 8.*

1. **A first save with no folder (class 9; Amendment 6 item 5, first bullet).**
   - *The behaviour, as built.* `Projects::save` in `kernel/src/project/mod.rs` at e36e951167fcad90e8ee07f1a4bfd3be12cd0e56 refuses a save whose open has no project in this process and whose `folder` is `None`, as `SaveFailure::FolderRequired`, before any file is read or written (`state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:130` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
   - *§2.2.* The new codes list gains `skp.project_folder_not_given`, with no fields. It states a kernel fact: the request's `folder` is `null`, and no save of this open has chosen a folder.
   - *Where it lands.*
     - P2: the constructor in `protocol/skp/src/v0/error.rs`. The row in the refusal table of `save_project`'s new SKP-V0 section is: code `skp.project_folder_not_given`; fields none; when the request's `folder` is `null` and no save of this open has chosen a folder. The skp version entry's field set counts it.
     - P3: the handler maps `FolderRequired` to it, in one exhaustive `match` with no wildcard arm. This follows SKP-V0's mapping rule (`protocol/skp/SKP-V0.md:359` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
   - *§2.12.* Its kernel message is one of §2.12's kernel messages and a P6 placeholder: `no folder was given, and this open of the dataset has no project to save to`. It replaces the `Display` arm of `FolderRequired` at P3. That arm states that the dataset has not been saved, which the kernel does not know: `Projects` keys its saves by the catalog name of this open.
   - *The shell.* It has no owner string for this code. At a first save the shell sends `folder` from the picker (§2.2), and §4's first step 1 shell test asserts that it does. A refusal that arrives anyway is shown as S4 with the kernel's `{message}` (§4's third step 1 shell test). S4 and the message are P6 placeholders, a red line (§2.12). Whether ordinary use of the shipped shell can reach this code is for P5's gate to show.
   - *§4, step 1.* The test is `a_first_save_without_a_folder_is_refused_and_writes_nothing` (`kernel/tests/project_save.rs` at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338), with its mutation as observed: the folder defaults to the data's own folder, and the test fails at that commit (`state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:110` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; the procedure at `state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:97` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The test proves the kernel's refusal. P2's error fixture proves the code's spelling. No test named in §4 asserts the P3 mapping.
   - *§8 item 12, second clause, for the gates.* The refusal, its variant and its test landed at e36e9511 and 4761ded8, before this amendment.

2. **The `record_step` widening (class 9).** It is placed in step 1, by class 9 to this form, by the human's ruling of 2026-10-23: the Milestone 4 line, OPEN-18 (b), and the Piece 1c line, OPEN-A2 (b) (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:18` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The option texts are `state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md:228` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H> and `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-amendment-1-architect-draft.md:313` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>. The node's option is (A′), at `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:631` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>. No code of it has landed.
   - **(a) What `record_step` admits.** This is ADR-036 §6 row 2 and the sentence below it, as accepted (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:177` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). No ADR text changes. The action stays `style.set`, and `actions` stays 2.
     - *The wire.* For `fillColor` only, `value` is `#rrggbb` text or §5a's match, `{match:{column, cases:[{when, then}…], on_null, on_unmatched}}`. It is closed, with `deny_unknown_fields`. `StyleSetParams::FillColor`'s value type widens. The other three properties are unchanged (`protocol/skp/src/v0/commands.rs:551-564` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). SKP-V0 §10.2's `fillColor` line (`protocol/skp/SKP-V0.md:1262` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) and §10.3's check (6) (`protocol/skp/SKP-V0.md:1272` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) are updated in place. The version is P2's, because any field change is a new version string (`protocol/skp/SKP-V0.md:305-306` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The shell's step value type is not widened here. Milestone 4's PR B adds it under its §2.3 (h)'s second case (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:266` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
     - *The kernel's check, at §10.3's (6), so a refusal writes nothing.*
       - The match is parsed by `style::parse`, as `style_params` parses a literal today (`kernel/src/session_history.rs:377-413` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
       - Then it is compiled by `spatial_renderer::compile` against the open's `file_schema()` names and Arrow types, with the match column alone as `published`, so that call's publish check passes by construction (`renderer/src/compiled.rs:166-188` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; the text-only key rule at `renderer/src/compiled.rs:231-239` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
       - Every colour in the match must be lowercase.
       - The match must have a canonical spelling through `spatial_renderer::canonical`.
       - No type rule is written in the kernel.
     - *Its dependencies.* `dependencies.fields` is exactly one entry: the match column, with its type as the open's file schema spells it, through `dependencies_json`'s `referenced` (`kernel/src/session_history.rs:416` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). Today `prepare` returns no columns for `style.set` (`kernel/src/session_history.rs:348` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). A literal `style.set` still names none. `crs` and `geometry_types` are as for every step.
     - *The reader.* The registry's `fillColor` value becomes a colour or the match shape. Its strings are bounded as every text is, and its cases at 64. No other property admits the match (`kernel/src/session_history.rs:557` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The line format, the lock and `recover` are unchanged.
     - *Refused, by name, with no new code.*
       - A match on `fillOpacity`, `outlineColor` or `outlineWidth`, an unknown key, or a missing `on_null` or `on_unmatched` is refused at deserialize, as §10.2's other shapes are.
       - A column the open's file lacks, a column whose type §5a's match does not admit, zero or more than 64 cases (`renderer/src/style.rs:56` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), a duplicate `when`, or an uppercase colour gets `skp.style_value_not_admitted` (`property` `fillColor`, `detail` the renderer's or the kernel's rule). §10.4's row gains these cases (`protocol/skp/SKP-V0.md:1291` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
       - A line over its ceiling gets `skp.step_line_over_ceiling`, and a member past a bound the reader holds gets `skp.session_history_unwritable`, as today.
     - *O1's comparison (OPEN-9 (A)).* `Reached`'s fill colour holds the last value a step set, a literal or the match, as the renderer's `Value<Rgb>`. A literal after a match replaces it, and a match after a literal replaces the literal. `differs` in `kernel/src/project/mod.rs` at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 compares it with the workspace's `style.fill_color` by that type's own equality, member for member, with the cases in order (`renderer/src/style.rs:113-128` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). No kernel-written bytes are compared. These stay unchanged: the filter is always compared; a style property is compared only if a step set it; and the withheld member is named `style`.
     - *Round 8.* The widened path has no product caller until milestone 4's PR B. The human pre-committed it (the ruling above). Its consumer is named: PR B's step recorder (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:264` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). Its consumer is gated: PR B's merge waits for it on main (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:265` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), and PB-R2 checks it (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:524` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). Step 1's PR body and the PLAN node name that consumer and its gate.
   - **(b) Tests, §4 step 1.**

     | Test | Mutation |
     |---|---|
     | W-P1 `record_step_admits_a_match_on_fill_color_only` (`protocol/skp/src/v0/commands.rs`, `mod tests`) | the match admitted on all four properties |
     | W-F1 `the_record_step_fill_match_fixture_decodes_and_re_encodes_byte_for_byte` (`protocol/skp/tests/fixtures.rs`; new `protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json`) | `on_unmatched` serialized under another name |
     | U-W1 `the_history_reader_admits_a_fill_color_match_and_refuses_one_on_another_property` (`kernel/src/session_history.rs`, `mod tests`) | the reader's registry admits the match on every `style.set` property |
     | K-W1 `a_recorded_fill_color_match_names_its_column_and_type_and_recover_chains` (new `kernel/tests/record_step_match.rs`; a real `open_dataset` of a file with a text column, and the request decoded from W-F1's fixture with the open's handle) | the match column left out of `dependencies.fields` |
     | K-W2 `a_match_the_style_model_refuses_against_the_open_is_refused_by_name_and_writes_nothing` (same file; cases: a column the file lacks, a non-text column, 65 cases, a duplicate `when`, an uppercase colour; the code and the history's unchanged bytes) | the match checked by `style::parse` alone, never compiled against the open's schema |
     | K-W3 `a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match` (`kernel/tests/project_save.rs`; the same match gives `Written`, one case's colour changed gives `Withheld(WorkspaceDiffers("style"))`, and a literal after the match with that literal held gives `Written`) | `Reached` does not note a match |

     - *§2.11 groups.* W-P1 and the SKP-V0 text count in protocol product. W-F1 and its fixture count in fixtures and protocol tests. U-W1 and the edits to `session_history.rs` and `project/mod.rs` count in kernel product, which is already over its ceiling (Amendment 6 item 2). K-W1 to K-W3 count in kernel tests, whose file list gains `kernel/tests/record_step_match.rs`. That group stands at 983 of 1,000, so an overrun is predicted; it is recorded as class 8 when counted, and nothing is trimmed. No shell, src-tauri or e2e file is edited. A `record_step` binding that needs an edit is I1.
     - *§9, the seams.* ADR-036 row 2's shape → `record_step` → the file → `recover` is K-W1. The kernel → `spatial_renderer::compile` is K-W2. The shell → `record_step` with the match is PR B's (PB-R2).
     - *§8.* Item 21: a match recorded on a property other than `fillColor`; a match step whose `dependencies.fields` is not its column alone; or a match column type rule written outside the renderer.
     - *Rule (00).* Step 1 is the one piece on `protocol/`. Of the in-flight branches, only port-2 touches `kernel/`, and its four paths are disjoint from these. `session_history.rs` reads `data_dir` from `kernel/src/permission/audit/log.rs`, a port-2 path, so a changed `data_dir` at P1's base is I1.
   - **(c) Commit place.** It is carried by P2's version bump, in P2's one commit, under OPEN-7-1 (a). P2 then also holds the kernel side, because `StyleSetParams`' exhaustive matches in `session_history.rs` do not compile without it (Amendment 1 item 6: each commit passes `cargo test`). P3 to P6 and R1 keep their order.
   - **(d)** OPEN-7-1 below.
   - **(e) The PLAN node.** It becomes as below once this amendment is on main, and is done with step 1's merge, with `{pr}` set in that done commit only.

3. **OPEN-7-1 (a red line: the human's typed ruling). The widening's commit place in step 1.** OPEN-18 (b) names step 1's first commit, and OPEN-A2 (b), ruled as the same ruling, names P2's version bump. Step 1's first commit (N0, Amendment 1 item 2) and N2 (Amendment 2 item 1) were committed on 2026-10-22, before the ruling. Any commit before P2 that widens `record_step` needs its own version (SKP-V0's schema-evolution item, item 2 (a)).
   - **(a)** In P2's one commit, under P2's version.
   - **(b)** Its own commit straight after P2, under P2's version, before P3.
   - **(c)** Its own piece after step 1's merge (OPEN-18 (a)). PR B then waits for it as well.
   - **Recommend (a).** It is OPEN-A2 (b)'s text. It keeps the whole field set of P2's version in one commit, as `skp/0.12`'s bump carried `record_step`'s types and fixtures (`protocol/skp/SKP-V0.md:1134` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). It keeps OPEN-18 (b)'s one fewer version step.

**Superseded index:**
- §2.2's new codes list: added to by item 1.
- §2.2's first Not-changed bullet and §5's six commands' shapes, for `record_step`: by item 2 (a).
- §2.14's `record-step-style-match-widening` bullet, and Amendment 1 item 7's last bullet: by item 2.
- Amendment 1 item 6's P2 contents: by item 2 (c), under OPEN-7-1.
- §2.11's kernel tests file list, §4's step 1 table, §8 and §9's seam list: added to by items 1 and 2.
- Amendment 6 item 5: declared by items 1 and 2.

Nothing above is edited.
````

**Item 1's last question: does §8 item 12's second clause apply?** The gates decide; I rule on nothing. By the clause's words, it applies. Amendment 6 item 4 counts the no-folder refusal among the behaviours §2.3 does not state. Its variant, its check and its test landed at e36e9511 and 4761ded8, before any amendment declared them. The opposite reading: §2.2 already says `folder` is present only at the first save, and §8 item 8 forbids a silent refusal, so a named refusal is §2.2's contract enforced. On that reading the only scope addition is the SKP code, and no code for it has landed. Under proportional gates this is a record finding. Since the record is append-only, the declaration in item 1 is the only fix available.

**Gate findings from the code as read, not ruled here:**
- (i) The `FolderRequired` `Display` arm at 4761ded8 states a fact the kernel does not hold, namely that the dataset has not been saved. This is not the human's wording. Exact replacement words: `no folder was given, and this open of the dataset has no project to save to`. Each clause checked against the code at 4761ded8:
  - "no folder was given" is `folder.ok_or(SaveFailure::FolderRequired)` in `Projects::save`;
  - "this open of the dataset" is `SavedProject.dataset`, the catalog name `open_dataset` mints once per open;
  - "has no project to save to" is `known` being `None` for that name.
  Today only a client that breaks §2.2 can reach it. If P5's shell can reach it in ordinary use, it shows through S4.
- (ii) No test named in §4 asserts the P3 mapping from `FolderRequired` to the new code.
- (iii) The gate reads the no-folder test at 4761ded8 to see whether it asserts the variant or only an error. That test is outside what the brief let me read.

**2 (c), my reading.** I agree with the brief: it lands with P2's bump. I read "with" as inside P2's one commit, for three reasons. OPEN-A2 (b)'s own text says it is carried by P2's version bump. `skp/0.12` set the precedent: one commit with the types and fixtures. And the protocol type and the kernel's exhaustive matches have to change in the same commit for every commit to pass `cargo test`. Option (b), its own commit straight after P2 under the same version, is also consistent with OPEN-3 (A). It gives a cleaner diff, but it splits the version's field set across two commits.

**2 (d): yes, it needs the human's word.** The item the human ruled is the widening's placement (OPEN-18). Their two ruled texts name different commits, and I cannot resolve a conflict between two of the human's rulings. So OPEN-7-1 is a red line. Three things make it small:
- the scope is the same: step 1, class 9, one version, the same files;
- the words "first commit" could not be met on the day of the ruling;
- P2 cannot start before the answer anyway, because the widening must be declared first.

**2 (e): the PLAN node `record-step-style-match-widening`, words to apply** once Amendment 7 is on main:
- `title`: record_step admits a style.set match value on fillColor, with the step's dependencies naming the match column and its type (milestone 4's OPEN-4 (A′)), carried in piece 1c's step 1 by class 9 (the 1c form's Amendment 7)
- `status: in-progress`
- `gate: governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`
- `evidence: {branch: cut/b2-piece-1c-save-and-reopen}`
- `depends_on` unchanged
- `generation: 2`
- `summary`, prepended: PLACED 2026-10-23 by the human (the 2026-10-23 directive's Milestone 4 line, OPEN-18 (b), and its Piece 1c line, OPEN-A2 (b)): inside 1c step 1 by class 9, declared in that form's Amendment 7; its commit place is OPEN-7-1 there. Its consumer is milestone 4's PR B (§2.3 (h); PB-R2), whose merge waits for it on main (round 8). It is done with step 1's merge, `{pr}` set only in that done commit.

The queue line in `governance/CUSTODIAN-QUEUE.md` that says the node is never queued until placed then needs regenerating.

**OPEN items:** OPEN-7-1 only, a red line, recommending (a). There are no others.

**Read, by path:**
- Main:
  - `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (header, §0 to §10, OPEN items, Amendments 1 to 6)
  - `state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md`
  - `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`
  - `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md` (OPEN-4)
  - `state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md` (OPEN-18)
  - `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-amendment-1-architect-draft.md` (OPEN-A2)
  - `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (§6)
  - `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` (§0.5, §2.3, §2.6's node bullet, PB-R2, the OPEN-4 ruling line)
  - `governance/PLAN.yaml` (the node, and the 1c node's fields)
  - `protocol/skp/SKP-V0.md` (§4 item 13, the `skp/0.12` entry, §10)
  - `protocol/skp/src/v0/commands.rs` (the `record_step` types)
  - `kernel/src/session_history.rs`
  - `renderer/src/compiled.rs`, `renderer/src/style.rs` and `renderer/src/lib.rs` (the match interface the kernel check is written against)
  - `frontends/shell/src/skp/types.ts` and `frontends/shell/src/skp/__tests__/fixtures.test.ts` (whether a new protocol fixture is read by the shell; it is not)
  - the file list of `protocol/skp/tests/data/`
- Branch at 4761ded8: `kernel/src/project/mod.rs` and `kernel/src/session_history.rs`.

**Background shells:** I have no shell and leave none, as `state/directives/2026-10-29-wait-loops-sleep-and-time-out-background-shells-killed-at-closing.md` requires.

**Model:** Opus 5.5, id claude-opus-5-5, as the harness reports it.
