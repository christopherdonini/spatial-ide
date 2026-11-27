Reviewed: main at 96f56d28206e74d6992156f3f7735483d8063fa8, in the detached read worktree C:/dev/wt/read-1123b (the custodian's filing note, 2026-11-23: the architect's form gate on the full form, attempt 1, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-1, dispatched at 2026-11-23T14:54:27Z; its run: Read 50, Grep 34, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T14:54:30Z to 2026-11-23T15:08:14Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 31600 bytes, sha256 b3f44ca4a155d3bcce2f32e94baa5c1002aa169db2d1c9eb70b0b2792eccda7e, byte for byte, nothing masked, with one final newline added. FAIL: C-1 to C-7 (Correctness: the open bound to a record another run left, the dataset identity at a recovery, the path rule, the 64 bound, a private field, the check returned and not shown, a listing that cannot be cancelled) and E-1, E-2 (Evidence: no test pins the check at accept; K-C6 mutation passes on Windows); N-1 to N-13 Documentation, N-9 drafts of shown words for the advisor; OPEN-1 to OPEN-4 and the three questions read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123b @ 96f56d28206e74d6992156f3f7735483d8063fa8

The form is `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` and the tag is `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-1`. Every cite below is read at 96f56d28.

The form is append-only. Each old/new pair below is therefore carried by an appended amendment, not by editing the filed line; the old text is the form's, byte for byte, and occurs once.

**The verdict in one line.** FAIL on seven Correctness findings and two Evidence findings. The class, the literal, §2.2's reading, the §2.12 quote and the pins hold.

## Correctness (each blocks)

**C-1. §2.3, "At an open" and the handle case of `recover_session`; the §2.9 seam from `reopened()` to `list_recoverable(handle)`. Written to an interface the code does not have.**
- `reopened()` binds an open only when this run already holds the project's record (`kernel/src/session_history.rs:392-401`; doc at :387-391).
- The doc of `Open::bound` says the same (:140-142).
- In the crash case, the record was left by another run, so `reopened()` binds nothing. "the project that `reopened()` bound to the given handle" (form line 73) and "the open must be bound by `reopened()`" (line 84) can therefore never hold. As written, no project's record is ever offered.
- "`Open` gains its bound project, set in `reopened()`" (line 92) collides with the existing `bound` field.
  - If `bound` were set on every reopen, the first step would go to `Holder::Project` (:147-152, :308).
  - `create` would then meet the other run's folder and refuse it (item 70's comment; `copy_under` uses `create_dir`), so every step would be refused.
  - `adopt_project` would also return early at :357.
  - Item 70's behaviour and ADR-036 Amendment 3 item 1 (no history replaced) both rest on `bound` staying unset.

```text
- **`Open` gains its bound project**, set in `reopened()` (`kernel/src/session_history.rs:392-401`). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
```
```text
- **`Open` gains `reopened_as: Option<ProjectUri>`**, set in `reopened()` (`kernel/src/session_history.rs:392-401`) on every reopen. `bound`, `holder()`, `adopt_project` and `reopened()`'s binding rule do not change. An open whose project's record another run left therefore stays unbound until `recover_session` binds it, and its steps before that go to a record of its own (item 70). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
```
```text
  - **At an open:** only `<hex>` for the project that `reopened()` bound to the given handle, and only if it holds a step after its last `saved-here` mark (OPEN-2).
```
```text
  - **At an open:** only `<root>/<project hex>`, read by name and not by walking, for the project whose reopen gave the handle (`reopened_as`), and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2).
```
```text
  - If `dataset` is a handle: the open must be bound by `reopened()` to the record's project, and must have no step and no record. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
```
```text
  - If `dataset` is a handle: the open's `reopened_as` must be the record's project, the header's dataset URI must equal the open's, and the open must have no step, no record and no binding. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
```

**C-2. §2.3, `recover_session` with a null dataset: the open's dataset identity is wrong (ADR-036 Amendment 2).**
- The new open is first named to the recorder through `State::open`, which mints a fresh `DatasetUri` (:176-184).
- `record_step` writes that URI into every later step's `data.dataset` (:307-308, :325-326), and a later save takes it too (`dataset_uri`, :280-283).
- The adopted record's header carries the earlier run's URI. Header and steps would disagree, and so would the project file after a save.
- The reader does not catch it, because no check compares a step's `data.dataset` with the header.
- `reopened()` sets `open.uri` for exactly this reason (:397). `recover_session` must do the same.

```text
    - holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds).
```
```text
    - holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds). In both cases the open's dataset identity is set to the header's dataset URI before the reply, as `reopened()` sets it, so every later step's `data.dataset` and a later save carry the header's (ADR-036 Amendment 2). A header that does not name exactly one dataset is refused as `skp.recoverable_record_refused`.
```

**C-3. §2.4, §2.9 and §8 item 1: the claimed guarantee that no reply carries a path is untrue.**
- The null-dataset arm reuses the engine's open refusals (form line 117).
- SKP §12.3 lets an engine refusal keep the engine's own message, which may name the path the engine was given (`protocol/skp/SKP-V0.md:1434`). `open_project` passes that message on unedited.
- So a refusal of `recover_session` can carry the data file's path. The built code could never meet block-on-sight item 1 as worded.

```text
- No reply carries a path. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
```
```text
- No reply carries a path, under SKP §12.3's rule and its one exception (`protocol/skp/SKP-V0.md:1434`): a reused engine open refusal keeps the engine's own message, which may name the path the engine was given. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
```
```text
  - SKP §12.3: no reply carries a path.
```
```text
  - SKP §12.3: no reply carries a path, but for its engine-message exception.
```
```text
1. a path in any reply;
```
```text
1. a path in any reply other than an engine refusal's own message (SKP §12.3);
```

**C-4. §2.3 bound with D6, OPEN-4 (A) and the item 76 draft. Unsaved sessions can be starved for good, and the item 76 limit is untrue.**
- Both name shapes count toward the 64, in folder-name order.
- Every 32-hex name (0-9, a-f) sorts before `unsaved-`. With 64 `<hex>` folders present, no `unsaved-` record is ever considered at a start.
- Under OPEN-4 (A), records that cannot be offered are left in place, and nothing ever removes them:
  - `end_session` removes only this run's records (:437-448);
  - `<hex>` records are never listed at a start.
- Each start therefore considers the same first 64. "Sessions beyond the first 64 are offered at later starts" (line 200) is an untrue claim of a limit, and ADR-036 §9 / round 70's offer at the next start fails for the starved records.
- Two further problems:
  - the dedupe scan of `<hex>` headers is not bounded by the 64;
  - the at-open case walks the root when one folder name is known.
- The fix needs both of these, and the drafter chooses the wording:
  - (i) at a start, consider only `unsaved-` names toward the bound, and read `<root>/<project hex>` by name at an open;
  - (ii) make every considered record able to leave: OPEN-4 (B), Discard only, or an equivalent.
- After that fix, item 76's bullet could read:

```text
  - Sessions beyond the first 64 are offered at later starts.
```
```text
  - At most 64 unsaved sessions are listed at a start; the others are listed at a later start, as listed ones are recovered or discarded.
```

**C-5. §2.3 "Each entry", the data's state: the listing reads a field the reference does not expose (seam rule).**
- The listing would compare against "the header's reference" by calling `observed.components_differing_from(&descriptor)`.
- `DatasetRef.observed` is private (`kernel/src/dataset_ref.rs:204-209`). Its only accessors are `uri()`, `locators()` and `admission()` (:251-261). The comparison runs only inside `check` (:322).
- `recovery.rs` is a separate module and cannot reach the field. `dataset_ref.rs` is not in Scope.
- The target, `SourceObservation::components_differing_from` (`engine/src/descriptor.rs:407`), is real and `pub`.

```text
    - the data's state. `engine::SourceDescriptor::of(path)` is compared by `observed.components_differing_from(&descriptor)` (`engine/src/descriptor.rs:407`) against the header's reference. Any failure to read the descriptor gives `not-found` (OPEN-1).
```
```text
    - the data's state. `engine::SourceDescriptor::of(path)` is compared with the header's reference by `SourceObservation::components_differing_from` (`engine/src/descriptor.rs:407`), reached through a new `pub(crate) fn observed(&self) -> &SourceObservation` on `DatasetRef` (`kernel/src/dataset_ref.rs`, whose product caller is this listing). Any failure to read the descriptor gives `not-found` (OPEN-1).
```
```text
| kernel product | `kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs` | 650 |
```
```text
| kernel product | `kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/dataset_ref.rs` (the accessor) | 650 |
```

**C-6. §2.4 and §2.7: `opened.check` lands with no product caller, and round 70's change notice is lost at accept.**
- `recover_session` returns `opened: { session, check }`, but §2.7's `handleRecovered` applies only the intents. Nothing shows the check.
- The list shows only the descriptor's state, so these are never shown:
  - a change made between the list and the accept;
  - any admission difference (`crs`, `identity`).
- That is a wire member with no consumer, and round 70's "If the data has changed …, the app says so" fails for those cases.

```text
  - `handleRecovered` (in `App.tsx`) applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`;
```
```text
  - `handleRecovered` (in `App.tsx`) applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`, and, when `opened.check` names a difference, shows it in the reopen's component words, as the reopen's notices are shown;
```

**C-7. §2.3 listing and OPEN-1 (A) against docs/01 principle 7: the listing cannot be cancelled.**
- `list_recoverable` takes no `cancel_key`.
- Under OPEN-1 (A) it reads the footer of up to 64 data files at every start, each up to `FOOTER_DESCRIPTOR_MAX_BYTES` (8 MiB, `engine/src/descriptor.rs:42`).
- By the form's own OPEN-1 text, this can start the download of an online-only file. That is a wait reachable in ordinary use, with no cancel and no progress.
- Either give `list_recoverable` a `cancel_key` and the cancel codes, or take OPEN-1 (B), or a middle way: only a not-found check (metadata) at the list, and the full check at accept, shown per C-6.

## Evidence (each blocks)

**E-1. §4 and D10: no test or mutation pins the full check at accept, and D10's reason is untrue.**
- D10 drops E-RECOVER's mutation "the offer applied without the check" on the ground that "the check's mutation is K-C5's".
- K-C5's mutation here is "state always `unchanged`" at the list (line 277). The 1c form's K-C5 mutation was "`check` skipped" (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:666`).
- Skipping `DatasetRef::check` in `recover_session` therefore passes every §4 test.
- Add these, and name them in D8:
  - K-C14 `accepting_runs_the_full_check_and_returns_its_differences`, mutation "`check` skipped at accept", fails K-C14;
  - S-6 `recover_shows_the_check_it_returns`, mutation "check not shown", fails S-6.

```text
| D10 | test | E-RECOVER's mutation: "the offer applied without the check" | the shell applies no returned steps | the e2e uses unchanged data, so that mutation would not fail it; the check's mutation is K-C5's |
```
```text
| D10 | test | E-RECOVER's mutation: "the offer applied without the check" | the shell applies no returned steps | the e2e uses unchanged data, so that mutation would not fail it; the check at accept is pinned by K-C14 and its showing by S-6 |
```

**E-2. §4 K-C6: its listed mutation is known to pass on Windows.**
- §2.3's listing takes its own lock and reads through that handle.
- With the probe removed, the read of a record another handle holds fails on Windows, by the form's own H1. The record then has no kept step and is not listed, so K-C6 stays green.
- §5 even predicts that K-C6 passes on Windows "(H1)".
- Either observe the mutation on a runner with advisory locks and name the Windows pass case in the row, or choose a mutation that fails on Windows. One example is "a `WouldBlock` record listed from its header read under no lock", if the test can produce that state.

## Documentation (must be fixed before the merge; none blocks on its own)

**N-1. §2.3 discard: the claim "mirrors `end_session`" is untrue on order.** `end_session` drops the handle first, then removes the files (:443-446). Here the files are removed while the handle is held.
```text
This mirrors `end_session`'s removal (`kernel/src/session_history.rs:439-448`).
```
```text
It removes what `end_session` removes (`kernel/src/session_history.rs:439-448`), in another order: `end_session` drops the handle first, and here the files are removed while the handle holds the lock (H2), so no other run can take it in between.
```

**N-2. §2.12 D8 is untrue: K-C5's mutation changed.**
```text
| D8 | test | §4's seven K-C tests | K-C1 to K-C7 kept with their mutations; K-C8 to K-C13 added | the declared item, D5 to D7, the end-clear rule |
```
```text
| D8 | test | §4's seven K-C tests | K-C1 to K-C7 kept; K-C5's mutation changes from "`check` skipped" to "state always `unchanged`", because the list no longer runs `check` (D3); K-C8 to K-C14 added | the declared item, D3, D5 to D7, the end-clear rule |
```

**N-3. §2.12 D9: the quotation does not match its source.** The 1c form reads differently at `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:671`: capital N and a comma. These are not the human's words.
```text
"no existing test is edited except for the version literal"
```
```text
"No existing test is edited, except for the version literal."
```

**N-4. §2.12 leaves three new codes unnamed as departures.** The 1c form's §2.2 names only `recoverable_record_locked` for step 3 (:201).
```text
| D14 | declared item | not in §2.6 (Amendment 30 item 4 (a)) | §2.5 | Amendment 32 item 3; ADV-2026-11-16-20 item 7 |
```
```text
| D14 | declared item | not in §2.6 (Amendment 30 item 4 (a)) | §2.5 | Amendment 32 item 3; ADV-2026-11-16-20 item 7 |
| D15 | wire | §2.2 names one new code for step 3, `recoverable_record_locked` | four new codes (§2.4) | the unknown, refused and not-for-this-open cases of §2.3 |
```

**N-5. §5 declares `record_step` unchanged, which is untrue.** Under the §2.5 writer, a first step whose path the store refuses is now refused. The store's refusals are listed at `kernel/src/project/store.rs:458-460`.
```text
  - the wire and behaviour of `open_project`, `save_project` and `record_step` (other than the version);
```
```text
  - the wire and behaviour of `open_project` and `save_project` (other than the version), and of `record_step` other than the version and §2.5: a first step whose dataset path the store's writer refuses (not absolute, not valid Unicode, or over 4,096 bytes) is now refused as `skp.session_history_unwritable` naming `locations.json`, where the inline writer wrote it before, lossily and with no bound;
```

**N-6. §2.4, §2.11 and §4: the literal's duties are incomplete, and the literal needs one rule.**
- §1 and §4 of SKP-V0 say "eight commands".
- The version-refusal row names `skp/0.15` as the unsupported future: `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:57` and `protocol/skp/tests/conformance/README.md:81`, after the §8 0.14 entry at `protocol/skp/SKP-V0.md:1167`. Once 0.15 is supported, that row goes red. Editing it is an existing-test edit outside §4 (I3), and the README is not in Scope.
- On the literal: `skp/0.15` is the next unused literal at 96f56d28, since the re-link keeps 0.14 by its OPEN-2 (a). It can be named now only if it is re-checked when the code starts.
- At 96f56d28 the grep gives 29 files and 125 occurrences, as the form says.
```text
- The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434).
```
```text
- The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434 and at 96f56d28). `skp/0.15` is the next unused literal at 96f56d28; the worker re-checks it against main and every base head before the bump's commit, and takes the next unused one if it has moved. In the same commit: SKP-V0 §1 and §4 count eleven commands; §8 gains the new version's entry with its full field set; and the version-refusal row that names the next version as unsupported (`protocol/skp/tests/conformance/fixtures/refusals-any-layer.json` and the sentence on it in `protocol/skp/tests/conformance/README.md`) moves to the literal after the new one.
```
```text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows)
```
```text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows, and the version-refusal row's literal, §2.4), `protocol/skp/tests/conformance/README.md`
```
```text
- **Edited existing tests:** the version literal only, plus D9.
```
```text
- **Edited existing tests:** the version literal only, plus D9, plus the version-refusal row's unsupported literal (§2.4).
```

**N-7. §2.11 and §9: the base, the range and the merge order do not follow ADV-2026-11-23-15 item 4.**
- The table speaks of one "held branch", but this piece overlaps:
  - PR 356, PR 359 and PR 360;
  - the relink branch;
  - PR 353, through `protocol/` by rule (00);
  - PR 358, through `KNOWN-LIMITATIONS.md`.
- PR 353 and PR 358 are not named.
- A three-dot range against one branch would count PR 356's and PR 360's changes as this piece's. Item 4 says the range runs from the recorded base to the head.
- The merge line names PR 361 (an avoided path) but not PR 353 or PR 358.
- I could not check the held PRs' file lists: I had no git. I relied on PLAN.yaml and the ruling.
```text
**Paths shared with held pieces** (the custodian builds on the held branch, ADV-2026-11-23-15 item 4):
```
```text
**Paths shared with held pieces** (ADV-2026-11-23-15 item 4: the branch starts at main's tip and takes in by merge commits, in item 5's order, the heads of PR 356, PR 359 and PR 360 and the relink branch's head, which holds PR 353's, PR 358's and PR 359's; the commit after the last merge is the recorded base B, named in an amendment and in the PR body):
```
```text
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
```
```text
| PR 353 | `protocol/` (rule (00); taken in through the relink branch) |
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
| PR 358 | `KNOWN-LIMITATIONS.md` (taken in through the relink branch) |
```
```text
  - The full diff: `origin/<held branch>...HEAD` until that branch merges, then `origin/main...HEAD`.
```
```text
  - The full diff: `B..HEAD`, with B the recorded base (§2.11); a base head that moves is taken in by a merge commit and gets ADV-2026-11-23-15 item 4's narrow read.
```
```text
- **Merge:** after the v0.2 tag; after step 2's node is done; after the held branch and PRs 356, 359, 360 and 361. A merge commit, never a squash.
```
```text
- **Merge:** after the v0.2 tag; after step 2's node is done; after every base (PRs 353, 356, 358, 359 and 360, and the relink branch) and after PR 361, in ADV-2026-11-23-15 item 5's order. A merge commit, never a squash.
```

**N-8. §2.11 counting: the 1c command's exclusions are stale paths.** At `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:437` it excludes `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` and `PLAN.yaml`. Neither excludes this form or `governance/PLAN.yaml`.
```text
It runs against the held branch's head until that branch merges, then against `origin/main`.
```
```text
B is the recorded base, and its exclusions are read at the present paths: this form's path, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.md` and `governance/CUSTODIAN-QUEUE.json`, in place of the 1c form's own path, `PLAN.yaml` and the two `CUSTODIAN-QUEUE` files.
```

**N-9. §2.8 and §2.10: clauses in the drafts that are not true.** None of these texts is the human's: §2.8 says so, and item 70's present text is the advisor's. All go to the advisor at P6.
- R-S10 is untrue in an ordinary case: the user changes something after the reopen and then presses Recover. The open has a record, the code refuses, and the cause is this open, not another.
- R-S6's "when the app last closed" is untrue when runs that ended normally came after the crash.
- R-S5's "cannot be found" is untrue for a file that exists but cannot be read: under OPEN-1 any descriptor failure gives `not-found`.
- Item 70's "withheld mark" is not what the shell shows (`KNOWN-LIMITATIONS.md:538`).
```text
| R-S10 | "These changes belong to another open of this project." | formatRefusal.ts, `…_not_for_this_open` |
```
```text
| R-S10 | "These changes can be recovered only right after the project is opened, before any change is made." | formatRefusal.ts, `…_not_for_this_open` |
```
```text
| R-S6 | "This project has changes that were not saved when the app last closed, last at {time}." | the offer at a project's open |
```
```text
| R-S6 | "This project has changes that were not saved before an earlier session of the app ended, last at {time}." | the offer at a project's open |
```
```text
| R-S5 (S15) | "{file} cannot be found, so these changes cannot be recovered. Discard removes them from this computer." | entry, `not-found` |
```
```text
| R-S5 (S15) | "{file} cannot be found or read, so these changes cannot be recovered. Discard removes them from this computer." | entry, `not-found` |
```
```text
the later run's save shows the withheld mark until that folder is removed.
```
```text
the later run's save shows the line that the session history holds no saved-here mark for the save, until that folder is removed.
```

**N-10. §2.10 item 76 is missing two disclosures.** OPEN-1 (A) and OPEN-4 (A) each say "disclosed in item 76", but the draft holds neither.
```text
  - A session whose data cannot be found can only be discarded, and no re-link is offered.
```
```text
  - A session whose data cannot be found can only be discarded, and no re-link is offered.
  - Listing the sessions at a start reads the end of each listed session's data file, which can start the download of a file kept online only.
  - A session the app cannot offer (one with no change it can read, one written by a later version, or one whose record of the data's place is refused) is not listed and stays on this computer; the app does not remove it.
```
The last bullet holds only if OPEN-4 stays (A); see C-4.

**N-11. §2.7: entries after an answer, and R-S8 in the same run.**
- Nothing removes an entry after Recover.
- If a second Recover is pressed on a record this run now holds, the try-lock in the same process gives `WouldBlock` on Windows (H1). R-S8 would then say "another window", which is untrue.
```text
  - an unanswered entry leaves the record;
```
```text
  - an unanswered entry leaves the record; an entry leaves the list once Recover or Discard succeeds, and `recover_session` or `discard_recoverable` on a record this run holds refuses `skp.recoverable_record_unknown`, never `…_locked`;
```
- R-S8 is also shown, briefly, when another instance is only reading the record to list it. That window is one listing read, inside one request round trip. It is named here and does not block.

**N-12. §2.4 §10.3: what the draft sentence replaces.**
```text
it replaces `protocol/skp/SKP-V0.md:1305`'s.
```
```text
it replaces the last clause of `protocol/skp/SKP-V0.md:1305`, from "nothing in SKP restores" to the end of that bullet, and leaves the rest of that bullet as it is.
```

**N-13. §2.3: behaviour the form leaves unsaid.**
```text
- **Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
```
```text
- **Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
- **Also specified:**
  - `recover_bytes` (:1264) becomes `pub(crate)`;
  - after `set_len`, the handle seeks to the new end and `History.bytes` is the prefix length, so the next append leaves no gap;
  - an open refused or cancelled at accept drops the handle and leaves the record;
  - a folder with no `history.jsonl` is not listed and is left in place;
  - a `<hex>` record whose dedupe read is refused by a lock makes the `unsaved-` record be skipped at that start;
  - `locations.json` is read bounded to `LOCATIONS_LIMITS.max_bytes` + 1, and since that constant is private to `kernel/src/project/store.rs`, the bound is exposed there (added to Scope) or restated with a test that pins the two equal;
  - a `restored` mark, which no product code writes today, is named as not read by the last-value computation.
```

## What else was checked
- **Class.** Full, with both gates, holds. The piece touches the wire, concurrency, a persistence format, what the user is told about their data, and cross-module seams, and it is over 260 lines (ADV-2026-11-16-06 item 2 (a); `governance/AUTONOMY.md` §21a and §21c).
- **§2.2 and the first question.** ADR-036 §9 needs no amendment for the offer at an open. §9:206 governs a session that never saved, and is silent on when a saved project's record is offered. The 2026-10-07 ruling, item 2's first bullet, and ADR-036 Amendment 1 item 5 cover that case.
- **§2.12 against 1c Amendment 32 item 3.** The quote is byte-identical. Every row is a gate matter, not a ruling, except:
  - D13: OP6's move is the custodian's to record;
  - the codes, which N-4 adds as D15.
- **Concurrency.**
  - Adopt in place is sound once C-1 and C-2 are fixed. A crash after `set_len` leaves a valid prefix that is offered again. A second instance meets `…_locked`.
  - The list-versus-accept race is covered once C-6 and E-1 are fixed.
  - The dedupe under a lock is in N-13.
- **Seams at 96f56d28.**
  - `begin_open` (`kernel/src/skp.rs:1118`), `open_under` (:1139) and `host()` (`kernel/src/session_history.rs:272`) are real `pub(crate)` items.
  - `store::locations_to_bytes` and `read_locations` are real and `pub` (`kernel/src/project/store.rs:462`, :483).
  - `SourceDescriptor::of` and `SourceObservation::components_differing_from` are real and `pub`.
  - `runAdmitPath` and `AdmitPathDeps` (`frontends/shell/src/admission/AdmissionPanel.tsx:187-292`) take an `admit` of the right shape.
  - Failures: C-1 (`reopened`), C-5 (`observed`) and C-6 (`opened.check`).
- **Tests.**
  - Red-before-fix holds for each, as new behaviour.
  - E-RECOVER is feasible with the suite's own launch, provided the restart reuses the killed run's data folder and waits for the port to be freed. Name both in the test.
  - Beyond E-2, none of the listed mutations has a known pass case.
- **Scope.**
  - With the literal files overlapping 12 of the group files, the union is about 45 files, and 47 with N-6 and C-5. That is ≤ 50.
  - The literal group's 260 is tight against 125 occurrences.
  - The block-on-sight items 2–9 can each be met. Item 1 needs C-3's wording.
- **Constitution.**
  - docs/02 module map: kernel, protocol and shell are each in their own place, and the commands are control-plane commands with no bulk data.
  - ADR-006: the restore is of workspace state, it records no step, and Discard is the user's choice over the app's own record.
  - ADR-018: the drafts say no "undo" or "replay".
  - ADR-010 is not touched.
  - docs/01 principle 7: see C-7.
- **Records.**
  - Every quotation I checked is byte-identical except D9 (N-3).
  - No line cite into the ledger. No bare self-line.
  - Amendment 1 says to read the last amendment first, and it does not read a pin as current.
  - Each Amendment 1 pin, the (r) entries included, names the lines the form means, and those lines are unchanged at 96f56d28:
    - `engine/README.md:533-567` is the owner's index, and line 567 is the file's last;
    - `commands.rs:790-793` is `key_present`;
    - `KNOWN-LIMITATIONS.md:510-512`;
    - `surfaceCompleteness.test.ts:203` is `expectedEight`.
  - I did not recompute any hash. The reviewer does.

## OPEN items and the three questions (soundness only, not ruled)
- **OPEN-1 (A)** is sound on `check` needing an opened `Dataset` (`kernel/src/dataset_ref.rs:321`). It is unsound as drafted because the list cannot be cancelled (C-7).
  - (B), or a check at the list for not-found only, meets round 70 if accept shows the check (C-6).
  - The stated reason reads round 70's placement more firmly than its text: round 70 does not fix when the app says so.
- **OPEN-2 (A)** is sound: such a record holds nothing to recover. But its stated reason, that clearing a history another run left touches Amendment 3 item 1, applies equally to Discard on every offer made at an open. The advisor should see that.
- **OPEN-3 (A)** is sound.
- **OPEN-4 (A)** is unsound together with the name-order bound (C-4). (B) lets such records leave.
- **Question 1:** no ADR-036 amendment is needed (see above).
- **Question 2:** item 43's title and the clause are the human's approved text (`KNOWN-LIMITATIONS.md:443`). Changing them is the human's, or the advisor's only under a delegation that covers the human's approved text.
- **Question 3:** OP6's move (D13) is the custodian's to record. It is sound, since OP6 needs step 3's code.

## Files read (at 96f56d28)
- the form;
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (§2.2, §2.6, §2.11 :434-439, §4 :660-671, Amendment 32);
- `state/directives/`:
  - `2026-11-23-the-humans-message-never-idle-…md`;
  - `2026-11-23-advisor-ruling-adv-2026-11-23-15-…md`;
  - `2026-11-16-advisor-ruling-adv-2026-11-16-06-…md`;
  - `2026-10-07-b2-brief-and-evening-rulings.md`;
  - `2026-10-08-round-70-rulings.md`;
- `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-lead-data-draft.md` (header and end note);
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (§7, §9, Amendments 1–4);
- `docs/adr/ADR-006-lineage-undo-side-effects.md`;
- `docs/01_Principles.md`;
- `governance/AUTONOMY.md` §21a–§21c;
- `governance/PLAN.yaml`;
- `kernel/src/session_history.rs`, `kernel/src/project/mod.rs`, `kernel/src/project/store.rs`, `kernel/src/dataset_ref.rs`, `kernel/src/skp.rs`;
- `engine/src/descriptor.rs`;
- `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs`, `protocol/skp/src/v0/mod.rs`;
- the conformance fixtures and README (by search);
- `frontends/shell/src/App.tsx`, `frontends/shell/src/admission/AdmissionPanel.tsx`, `frontends/shell/src/console/surfaceCompleteness.test.ts`;
- `KNOWN-LIMITATIONS.md` (items 43, 62, 70, 75);
- `kernel/README.md`, `engine/README.md` (the owner's indexes);
- the brief, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/brief-formgate-recovery.md`.

Opus 5.5 (claude-opus-5-5)
