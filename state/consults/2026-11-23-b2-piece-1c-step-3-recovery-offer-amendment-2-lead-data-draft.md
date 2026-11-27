*Filed by the custodian: lead-data's draft of Amendment 2 to `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, after the architect's form gate, attempt 1 (FAIL; `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md`, gate-log row 863), node:b2-piece-1c-step-3-recovery-offer@amendment-2-lead-data-draft, dispatched at 2026-11-23T15:09:26Z. Its run: Read 25, Grep 14, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:09:30Z to 2026-11-23T15:22:43Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 33292 bytes, sha256 91e1e3cb080d8fc3f60ccf776ee2c95c95afd7b6aeca088bbf1f05092fe2d390, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 3 follows it.*

---

Result: I drafted Amendment 2. It fixes C-1 to C-7, E-1, E-2 and N-1 to N-13, and it is written to my recommendations, OPEN-1 (C) and OPEN-4 (B), which the advisor has not ruled.

---AMENDMENT 2---
## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): C-1 to C-7, E-1, E-2 and the documentation findings

*Post-result amendment: written after the outcome of the architect's form gate, attempt 1 (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md`, FAIL), was seen. Lead-data drafted it before any code. Finding ids (C-, E-, N-) are that report's. Every `path:line` in this amendment is read at 96f56d28206e74d6992156f3f7735483d8063fa8. The drafter has no hashing tool, so the custodian adds each span's sha256 at filing, as Amendment 1 item 3 does. Each Old text below occurs once in the form above this amendment. Where an Old text is part of a line, only that part is replaced. Nothing is ruled here: OPEN items and strings go to the advisor (ADV-2026-11-23-15 item 8).*

1. **The drafter's recommendations on OPEN-1 (C-7) and OPEN-4 (C-4). They are not rulings.** The form below is sound under them.
   - **OPEN-1: recommend (C), the gate's middle way, added below as an option.** At the list, the kernel checks only that the data path exists, by metadata. The full `check` runs at accept and is shown (C-6). `SourceDescriptor::of` takes no cancel token and reads the file's tail (`engine/src/descriptor.rs:102-134`), so a `cancel_key` on the list could act only between records, never inside the read that waits. Under (C) the list waits on no byte of the data, and accept is already cancellable through `begin_open`/`open_under`.
     - *Under (A):* the gate's C-5 text and `kernel/src/dataset_ref.rs` replace item 2's C-5 text; `list_recoverable` gains `cancel_key` and the cancel codes; D3, K-C5 and R-S4's place stay as filed; the gate's N-10 download bullet replaces item 6's; K-C17 drops.
     - *Under (B):* entries carry no `data`, and K-C5 and K-C17 drop.
   - **OPEN-4: recommend (B).** Under (A), a record that cannot be offered never leaves, so any bound over records can starve (C-4 (ii)). Under (B), each record can leave by the user's Discard, and nothing is removed unasked.
     - *Under (A):* these drop: the `cannot-be-offered` state, the nullable members, R-S11, R-S12, K-C15 and S-8. Such records are skipped uncounted, under a second read bound whose starvation case item 76 names. K-C6's and K-C24's mutations then pass on Windows: each is observed on a macOS or Linux runner, with its Windows pass case named in its row (E-2).

2. **Correctness.**

**C-1** (the gate's texts).
````text
- **`Open` gains its bound project**, set in `reopened()` (`kernel/src/session_history.rs:392-401`). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
````
````text
- **`Open` gains `reopened_as: Option<ProjectUri>`**, set in `reopened()` (`kernel/src/session_history.rs:392-401`) on every reopen. `bound`, `holder()`, `adopt_project` and `reopened()`'s binding rule do not change. An open whose project's record another run left therefore stays unbound until `recover_session` binds it, and its steps before that go to a record of its own (item 70). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
````
````text
**At an open:** only `<hex>` for the project that `reopened()` bound to the given handle, and only if it holds a step after its last `saved-here` mark (OPEN-2).
````
````text
**At an open:** only `<root>/<project hex>`, read by name and not by walking, for the project whose reopen gave the handle (`reopened_as`), and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2).
````
````text
If `dataset` is a handle: the open must be bound by `reopened()` to the record's project, and must have no step and no record. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
````
````text
If `dataset` is a handle: the open's `reopened_as` must be the record's project, the header's dataset URI must equal the open's, and the open must have no step, no record and no binding. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
````
Checked against the code: `bound` is set only when this run holds the record (`kernel/src/session_history.rs:394-400`). `holder()` follows `bound` (:147-152). `adopt_project` returns early on a bound open (:357). In the handle arm the header's URI is the project file's, which `reopened()` gives the open (:397), so the equality holds for the project's own record.

**C-2** (the gate's text).
````text
holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds).
````
````text
holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds). In both cases the open's dataset identity is set to the header's dataset URI before the reply, as `reopened()` sets it, so every later step's `data.dataset` and a later save carry the header's (ADR-036 Amendment 2). A header that does not name exactly one dataset is refused as `skp.recoverable_record_refused`.
````
Checked against the code: `State::open` mints a fresh URI (`kernel/src/session_history.rs:176-184`), and `record_step` writes the open's URI into each step (:307-308, :325-326).

**C-3** (the gate's texts).
````text
No reply carries a path. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
````
````text
No reply carries a path, under SKP §12.3's rule and its one exception (`protocol/skp/SKP-V0.md:1434`): a reused engine open refusal keeps the engine's own message, which may name the path the engine was given. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
````
````text
SKP §12.3: no reply carries a path.
````
````text
SKP §12.3: no reply carries a path, but for its engine-message exception.
````
````text
1. a path in any reply;
````
````text
1. a path in any reply other than an engine refusal's own message (SKP §12.3);
````

**C-4** (C-4 (i), and (ii) through OPEN-4 (B); the walk's rules are in item 4).
````text
Reads `default_root()` in folder-name order and considers at most `MAX_RECOVERABLE_RECORDS` entries (§7). If more exist, the reply sets `more: true`.
````
````text
Reads the folder names under `default_root()` in name order. At a start, only `unsaved-` records count toward `MAX_RECOVERABLE_RECORDS` (§7). A record counts when it is listed, in any state, and a folder skipped under Amendment 2 item 4 does not count. `more` is `true` when an `unsaved-` folder is left unexamined at the bound, or is not listed because the dedupe could not be completed. At an open, one folder is read by name and none is walked.
````
````text
**Not listed, left in place:** a record with no kept step, a newer `actions`, or a refused `locations.json` (OPEN-4).
````
````text
**Listed with Discard only** (`cannot-be-offered`, OPEN-4 (B)): a record with no kept step (`no-step`), a header `actions` over `ACTIONS` (`later-version`), or a refused `locations.json` (`locations-refused`). A history that cannot be locked or read, for any reason but `WouldBlock`, is `no-step`. Listing removes nothing: such a record stays until Discard, and `recover_session` refuses it as `skp.recoverable_record_refused`.
````
````text
This reads only the header line and the first step line of each record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`.
````
````text
This reads only the header line and the first step line of each `<hex>` record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`, and of at most `MAX_DEDUPE_RECORDS` such records (§7, Amendment 2 item 4). A `<hex>` folder with no history, or an empty one, is not read and does not count. Past that bound the dedupe cannot be completed, and no `unsaved-` record is listed at that start. This fails closed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
Item 76 (the gate's text):
````text
Sessions beyond the first 64 are offered at later starts.
````
````text
At most 64 unsaved sessions are listed at a start; the others are listed at a later start, as listed ones are recovered or discarded.
````

**C-5** (under OPEN-1 (C) the listing reads no observation, so no accessor and no `kernel/src/dataset_ref.rs` edit is needed).
````text
the data's state. `engine::SourceDescriptor::of(path)` is compared by `observed.components_differing_from(&descriptor)` (`engine/src/descriptor.rs:407`) against the header's reference. Any failure to read the descriptor gives `not-found` (OPEN-1).
````
````text
the data's state, from metadata alone (OPEN-1 (C)): `std::fs::metadata` of the path `locations.json` records gives `found`, and any failure gives `not-found`. No byte of the data file is read at the list (`SourceDescriptor::of` opens and reads the file's tail, `engine/src/descriptor.rs:122-134`, so it is not called there). The reference's observation is not read at the list either: the comparison runs only inside `DatasetRef::check` at accept (`kernel/src/dataset_ref.rs:321-322`), and its result reaches the user through §2.7.
````
Also, in §2.12's D3 row:
````text
descriptor comparison at the list, full `check` at accept
````
````text
existence by metadata at the list, full `check` at accept, shown (§2.7)
````
````text
the list opens nothing (OPEN-1)
````
````text
the list opens and reads nothing of the data (OPEN-1 (C); C-7)
````
And in §2.9:
````text
`SourceDescriptor::of` + `components_differing_from` → listing;
````
````text
`std::fs::metadata` → listing; `DatasetRef::check` → `recover_session`'s `opened.check` → `handleRecovered`;
````

**C-6.**
````text
applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`;
````
````text
applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`. When `opened.check` names a difference, it shows R-S4 where the reopen's notices show (`setReopenNotices`, `frontends/shell/src/App.tsx:1238`). R-S4's `{components}` are the check's `observed` words, then its `admission` words, joined as the reopen's `partsOf` joins them (`frontends/shell/src/project/reopenNotices.ts:45-50`). That file is not edited;
````
In §2.8, R-S4's place:
````text
| entry, `changed` |
````
````text
| after Recover, when `opened.check` names a difference (§2.7) |
````

**C-7: the wire and OPEN-1.**
````text
{ record, file_name, last_step_at, steps,
````
````text
{ record, file_name: string | null, last_step_at: string | null, steps,
````
````text
data: {state:"unchanged"} | {state:"not-found"}
````
````text
data: {state:"found"} | {state:"not-found"}
````
````text
| {state:"changed", components:[ObservedChange…]} } ],
````
````text
| {state:"cannot-be-offered", reason:"no-step"|"later-version"|"locations-refused"} } ],
````
Added to §2.4 after the bullet that begins "`opened` is present":
- `file_name` is null only for a `cannot-be-offered` record whose `locations.json` is refused. For `cannot-be-offered`, `last_step_at` is null and `steps` is 0.
- `list_recoverable` is not cancellable and does not report progress, like `record_step` (`protocol/skp/SKP-V0.md:1309`). It reads no byte of a data file, only the machine's own store, within §7's and Amendment 2 item 4's bounds, and it calls `metadata` once on each listed record's data path.

OPEN-1:
````text
(B) No state at the list; the state at accept only.
````
````text
(B) No state at the list; the state at accept only.
  - (C) At the list, only whether the data path exists, by metadata, with no byte of the data read; the full `check` at accept, shown (§2.7).
````
````text
**Recommend (A):** round 70 places "the app says so" in the offer.
````
````text
**Recommend (C)** (Amendment 2 item 1): the list waits on no byte of the data, and every change is still said, at accept.
````
OPEN-4:
````text
**Recommend (A):** nothing can be named for them.
````
````text
**Recommend (B)** (Amendment 2 item 1): under (A) such records never leave and can starve the bound (C-4).
````

3. **Evidence.**
   - **E-1.** K-C14 and S-6 are added as the gate names them (item 5). In D10:
````text
the check's mutation is K-C5's
````
````text
the check at accept is pinned by K-C14 and its showing by S-6
````
   - **E-2.** The new mutation fails on Windows: under OPEN-4 (B), a history the listing cannot read is listed `cannot-be-offered`. K-C6's lock is held by a `File` the test opens and locks itself, so the rule that skips this run's own records cannot hide the mutation.
````text
| no lock probe | K-C6 |
````
````text
| the lock probe removed: the listing reads the history through its own handle with no `try_lock` (Windows: the read fails, H1, and the record is listed `cannot-be-offered`; if H1 is false, it is listed with its steps; macOS/Linux: listed with its steps); K-C6 asserts the record absent in every state | K-C6 |
````

4. **The walk and the locks** (C-4, C-7, E-2, N-11, N-13). This is added to §2.3 after N-13's list (item 6).
   - **At a start, each `unsaved-` folder in name order:**
     - A record this run holds is skipped before any lock is tried.
     - A folder whose `history.jsonl` is absent or 0 bytes by its metadata is skipped and not locked. A history is created empty and locked before its header is written (`kernel/src/session_history.rs:516-532`), so an empty one may be another run's between those two steps.
     - `WouldBlock` skips the folder.
     - Any other failure to lock or read gives `cannot-be-offered` (`no-step`).
     - Then the dedupe runs, then the bounded read. The record is then listed, and it counts. Skipped folders do not count.
   - **The dedupe** reads at most `MAX_DEDUPE_RECORDS` `<hex>` histories that exist and are not empty. Past that bound, or when a `<hex>` history is held by a lock (N-13), no `unsaved-` record is listed at that start, and `more` is `true`.
   - **`recover_session`, in order:**
     1. validate the record name;
     2. refuse a record this run holds as `…_unknown` (N-11);
     3. lock and read;
     4. for a null `dataset`: open the data and run `check`; for a handle: check the C-1 conditions;
     5. `set_len` to the kept prefix, seek to its end, sync;
     6. set the identity (C-2), bind, and push.
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte.
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`.
   - **§7, added before any code** (no §7 line is edited): **`MAX_DEDUPE_RECORDS = 256`**, at its site in `recovery.rs`. It bounds the `<hex>` histories a start's dedupe reads, each to its header and first step line. The value is a draft; the gates check it.
   - **§0, added after H2:** "**H3:** on macOS and Linux, std's `File::try_lock` is an advisory `flock` held per open file description, so a second open of the same file in the same process meets `WouldBlock`. Discriminator: K-C21 and K-C22 on a macOS or Linux runner."
   - **§5, added after "Predicted":** K-C6, K-C21 and K-C22 fail under their mutations on Windows and on macOS/Linux (H3).
   - **§8, added:**
     - 10\. a byte of a data file read by `list_recoverable`;
     - 11\. an `unsaved-` record listed at a start whose dedupe was not completed;
     - 12\. a lock taken by the listing on an empty history.
   - **§2.7:**
````text
a `not-found` entry offers Discard only;
````
````text
a `not-found` or `cannot-be-offered` entry offers Discard only;
````
   - **§2.8, rows added at the end of its table** (P6 drafts):
     - | R-S11 | "These unsaved changes can no longer be read. Discard removes them from this computer." | entry, `cannot-be-offered` (`no-step`, `locations-refused`) |
     - | R-S12 | "These unsaved changes were made by a later version of the app, which this version cannot recover. Discard removes them from this computer." | entry, `cannot-be-offered` (`later-version`) |

5. **Tests.**

**Renamed row, K-C5:**
````text
| `the_offer_states_changed_or_not_found_data` | state always `unchanged` | K-C5 |
````
````text
| `the_offer_states_found_or_not_found_data` | state always `found` | K-C5 |
````

**E-RECOVER** (the restart the gate names):
````text
kill the process tree; start;
````
````text
kill the process tree; start again on the killed run's data folder, once its port is free;
````

**Rows added at the end of §4's table.** The file is `kernel/tests/recovery.rs` unless a row names another.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C14 | `accepting_runs_the_full_check_and_returns_its_differences` | `check` skipped at accept | K-C14 |
| K-C15 | `a_record_that_cannot_be_offered_is_listed_with_discard_only_and_refused_at_recover` | such a record not listed | K-C15 |
| K-C16 | `unsaved_records_are_listed_beside_more_than_64_project_records` (65 `<hex>` histories, each a header and a step) | every examined folder, `<hex>` included, counted toward `MAX_RECOVERABLE_RECORDS` | K-C16 |
| K-C17 | `the_listing_reads_no_byte_of_the_data_file` (data replaced by a 0-byte file: `found`) | the state taken from `SourceDescriptor::of` (it refuses a file under 8 bytes, `engine/src/descriptor.rs:124-129`) | K-C17 |
| K-C18 | `a_step_after_recovery_carries_the_headers_dataset_identity` | the open's identity not set at adopt | K-C18 |
| K-C19 | `recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record` (`recovery_crash.rs`) | the open not bound at adopt | K-C19 |
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` | `reopened_as` not compared | K-C20 |
| K-C21 | `a_second_recover_of_a_record_this_run_holds_is_refused_as_unknown` | the held check moved after the lock probe | K-C21 |
| K-C22 | `a_refused_open_at_accept_leaves_the_record_byte_for_byte_and_listed` | the history handle kept after the refused open | K-C22 |
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` histories) | the dedupe bound not applied | K-C23 |
| K-C24 | `a_folder_with_no_or_an_empty_history_is_not_listed` | the empty-history check removed (the empty one is listed `cannot-be-offered`) | K-C24 |
| S-6 | `recover_shows_the_check_it_returns` (`App.recover.test.tsx`) | check not shown | S-6 |
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` | the entry kept after Recover | S-7 |
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` | Recover shown for `cannot-be-offered` | S-8 |

- **Red before the fix.** Each K-C row calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of these exists at the red commit. S-6 to S-8 render `RecoveryOffer` or `handleRecovered`, and neither exists. P-1 also round-trips the `cannot-be-offered` state and the null members; its mutation is unchanged.
- **Known pass cases.** None is known for any of these mutations. K-C21 and K-C22 rest on H1 or H3 only for the lock, and LockFileEx refuses a second handle on Windows.

6. **Documentation.**
   - **N-1** (the gate's words):
````text
This mirrors `end_session`'s removal (`kernel/src/session_history.rs:439-448`).
````
````text
It removes what `end_session` removes (`kernel/src/session_history.rs:439-448`), in another order: `end_session` drops the handle first, and here the files are removed while the handle holds the lock (H2), so no other run can take it in between.
````
   - **N-2.** The gate's words assume OPEN-1 (A), so they are adapted to (C):
````text
K-C1 to K-C7 kept with their mutations; K-C8 to K-C13 added | the declared item, D5 to D7, the end-clear rule
````
````text
K-C1 to K-C7 kept; K-C5 renamed `the_offer_states_found_or_not_found_data`, its mutation changed from "`check` skipped" to "state always `found`", because the list no longer runs `check` (D3), and "`check` skipped" moves to K-C14 at accept; K-C8 to K-C24 and S-6 to S-8 added | the declared item, D3, D5 to D7, the end-clear rule, Amendment 2
````
   - **N-3:**
````text
"no existing test is edited except for the version literal"
````
````text
"No existing test is edited, except for the version literal."
````
   - **N-4:** rows added after D14:
     - | D15 | wire | §2.2 names one new code for step 3, `recoverable_record_locked` | four new codes (§2.4) | the unknown, refused and not-for-this-open cases of §2.3 |
     - | D16 | rule | (none) | the walk's order, the empty-history rule and `MAX_DEDUPE_RECORDS`, failing closed | C-4, N-13; Amendment 2 item 4 |
   - **N-5:**
````text
the wire and behaviour of `open_project`, `save_project` and `record_step` (other than the version);
````
````text
the wire and behaviour of `open_project` and `save_project` (other than the version), and of `record_step` other than the version and §2.5: a first step whose dataset path the store's writer refuses (not absolute, not valid Unicode, or over 4,096 bytes) is now refused as `skp.session_history_unwritable` naming `locations.json`, where the inline writer wrote it before, lossily and with no bound;
````
   - **N-6** (the gate's words; the conformance row carries item 7's ceiling):
````text
The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434).
````
````text
The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434 and at 96f56d28). `skp/0.15` is the next unused literal at 96f56d28; the worker re-checks it against main and every base head before the bump's commit, and takes the next unused one if it has moved. In the same commit: SKP-V0 §1 and §4 count eleven commands; §8 gains the new version's entry with its full field set; and the version-refusal row that names the next version as unsupported (`protocol/skp/tests/conformance/fixtures/refusals-any-layer.json` and the sentence on it in `protocol/skp/tests/conformance/README.md`) moves to the literal after the new one.
````
````text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows) | 200 |
````
````text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows, and the version-refusal row's literal, §2.4), `protocol/skp/tests/conformance/README.md` | 220 |
````
````text
**Edited existing tests:** the version literal only, plus D9.
````
````text
**Edited existing tests:** the version literal only, plus D9, plus the version-refusal row's unsupported literal (§2.4).
````
   - **N-7** (the gate's words; the base follows ADV-2026-11-23-15 items 4 and 5):
````text
**Paths shared with held pieces** (the custodian builds on the held branch, ADV-2026-11-23-15 item 4):
````
````text
**Paths shared with held pieces** (ADV-2026-11-23-15 item 4: the branch starts at main's tip and takes in by merge commits, in item 5's order, the heads of PR 356, PR 359 and PR 360 and the relink branch's head, which holds PR 353's, PR 358's and PR 359's; the commit after the last merge is the recorded base B, named in an amendment and in the PR body):
````
````text
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
````
````text
| PR 353 | `protocol/` (rule (00); taken in through the relink branch) |
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
| PR 358 | `KNOWN-LIMITATIONS.md` (taken in through the relink branch) |
````
````text
The full diff: `origin/<held branch>...HEAD` until that branch merges, then `origin/main...HEAD`.
````
````text
The full diff: `B..HEAD`, with B the recorded base (§2.11); a base head that moves is taken in by a merge commit and gets ADV-2026-11-23-15 item 4's narrow read.
````
````text
**Merge:** after the v0.2 tag; after step 2's node is done; after the held branch and PRs 356, 359, 360 and 361. A merge commit, never a squash.
````
````text
**Merge:** after the v0.2 tag; after step 2's node is done; after every base (PRs 353, 356, 358, 359 and 360, and the relink branch) and after PR 361, in ADV-2026-11-23-15 item 5's order. A merge commit, never a squash.
````
   - **N-8** (the gate's words):
````text
It runs against the held branch's head until that branch merges, then against `origin/main`.
````
````text
B is the recorded base, and its exclusions are read at the present paths: this form's path, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.md` and `governance/CUSTODIAN-QUEUE.json`, in place of the 1c form's own path, `PLAN.yaml` and the two `CUSTODIAN-QUEUE` files.
````
   - **N-9.** Not adopted. The gate's four texts (R-S10, R-S6, R-S5 and item 70's draft) go to the advisor at P6 as P6 drafts, with R-S11 and R-S12.
   - **N-10.** The second bullet is adapted to OPEN-1 (C), the third to OPEN-4 (B), and the fourth is new (item 4):
````text
A session whose data cannot be found can only be discarded, and no re-link is offered.
````
````text
A session whose data cannot be found can only be discarded, and no re-link is offered.
  - Listing the sessions at a start reads none of their data, so a change to the data is found, and said, only when a session is recovered.
  - A session the app cannot offer (one with no change it can read, one written by a later version, or one whose record of the data's place is refused) is listed with Discard only, and stays on this computer until it is discarded.
  - While another window of the app holds a saved project's unsaved changes, or while more than 256 saved projects' unsaved changes are kept on this computer, a start offers no session that never saved, and says that more are kept.
````
   - **N-11** (the gate's words):
````text
an unanswered entry leaves the record;
````
````text
an unanswered entry leaves the record; an entry leaves the list once Recover or Discard succeeds, and `recover_session` or `discard_recoverable` on a record this run holds refuses `skp.recoverable_record_unknown`, never `…_locked`;
````
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block.
   - **N-12** (the gate's words):
````text
it replaces `protocol/skp/SKP-V0.md:1305`'s.
````
````text
it replaces the last clause of `protocol/skp/SKP-V0.md:1305`, from "nothing in SKP restores" to the end of that bullet, and leaves the rest of that bullet as it is.
````
   - **N-13.** These are the gate's words, with one change: the gate's bare `(:1264)` would be read against `kernel/src/project/mod.rs`, so it is written with its path. The bound is exposed in `kernel/src/project/store.rs` (item 7).
````text
**Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
````
````text
**Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
- **Also specified:**
  - `recover_bytes` (`kernel/src/session_history.rs:1264`) becomes `pub(crate)`;
  - after `set_len`, the handle seeks to the new end and `History.bytes` is the prefix length, so the next append leaves no gap;
  - an open refused or cancelled at accept drops the handle and leaves the record;
  - a folder with no `history.jsonl` is not listed and is left in place;
  - a `<hex>` record whose dedupe read is refused by a lock makes the `unsaved-` record be skipped at that start;
  - `locations.json` is read bounded to `LOCATIONS_LIMITS.max_bytes` + 1, and since that constant is private to `kernel/src/project/store.rs`, the bound is exposed there (added to Scope) or restated with a test that pins the two equal;
  - a `restored` mark, which no product code writes today, is named as not read by the last-value computation.
````

7. **Scope and budget.** These changes are declared before any code, so this is not an overrun.
   - **Files added:**
     - `protocol/skp/tests/conformance/README.md` (N-6), about 4 lines.
     - `kernel/src/project/store.rs` (N-13): `LOCATIONS_LIMITS.max_bytes` exposed `pub(crate)` (`kernel/src/project/store.rs:54-58`), about 4 lines. Before code, the custodian compares this file with every held PR's file list (ADV-2026-11-23-15 item 4).
     - `kernel/src/dataset_ref.rs` is not added under OPEN-1 (C).
   - **Files:** the ≤ 50 total holds (47 by the gate's union count, with these two files).
   - **Lines:** the old total does not hold. It is now ≤ 4,330:
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 300 |
````
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 330 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs` | 650 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 780 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 700 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,200 |
````
````text
`src/admission/formatRefusal.ts` | 450 |
````
````text
`src/admission/formatRefusal.ts` | 500 |
````
````text
`src/console/surfaceCompleteness.test.ts` | 400 |
````
````text
`src/console/surfaceCompleteness.test.ts` | 500 |
````
````text
(one new Part) | 120 |
````
````text
(one new Part) | 140 |
````
````text
**≤ 3,480, ≤ 50 files**
````
````text
**≤ 4,330, ≤ 50 files**
````
````text
§2.11; ≤ 3,480, ≤ 50 files
````
````text
§2.11 as Amendment 2 revises it; ≤ 4,330, ≤ 50 files
````

8. **Questions.** These go to the advisor with OPEN-1 to OPEN-4. (a) goes to the custodian.
   - (a) **Guarantee, to the custodian.** The dedupe skips an `unsaved-` twin but never removes it. Once its project's record is recovered and then cleared, or discarded, the twin is listed at a later start as a session that never saved. Whether recovering or discarding a project's record should also remove its twin touches ADR-036 Amendment 1 item 5. This amendment does not draft it.
   - (b) **The gate's note on OPEN-2.** Its stated reason applies to Discard on every offer made at an open (the gate report, "OPEN items").
   - (c) **The list's bound under docs/01 principle 7.** Under OPEN-1 (C) the list is declared not cancellable. Its bound is 64 histories of at most `MAX_SESSION_HISTORY_BYTES` + 1 bytes each, read from the machine's own store, plus 256 dedupe reads and one metadata call per listed record. A metadata call on a network path waits as long as the operating system makes it wait. The architect judges whether that holds.
   - (d) **P6 drafts:** item 76's bullets, R-S11 and R-S12.

9. **Superseded by this amendment, by section:** §0 (H3 added); §2.3; §2.4; §2.7; §2.8 (R-S4's place; R-S11 and R-S12 added); §2.9; §2.10 (item 76); §2.11; §2.12 (D2, D3, D8, D9, D10; D15 and D16 added); §4 (K-C5, K-C6, E-RECOVER; rows added); §5; §7 (added); §8 (item 1; items 10 to 12 added); §9 (the diff range and the merge); OPEN-1; OPEN-4.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**What I could not settle**
- **The gate's words, adapted.** N-2's text and N-10's download bullet assume OPEN-1 (A), so I adapted them to (C) and did not adopt them as written. If (A) is ruled, the gate's texts apply as item 1 says. I also changed one cite in N-13: the gate's bare `:1264` is now written with its path, `kernel/src/session_history.rs:1264`.
- **I had no git.** I could not check `kernel/src/project/store.rs`, or PR 362, against the held PRs' file lists. The custodian checks both.
- **Under OPEN-4 (A), K-C6 and K-C24 need a runner with advisory locks.** I do not know which CI runner, if any, runs the kernel tests on macOS or Linux. H3 (`flock` per open file description) is untested here.
- **The `rule` field of `…_refused`.** I did not check whether any reader rule text (strict JSON errors, `read_locations`) can echo a path read from the file.
- **The `restored` mark.** I adopted N-13 as the gate wrote it. A safer choice would list a record holding a `restored` mark as `cannot-be-offered`. That is for the gates to choose.
- **A gap I named but did not design.** `adopt_project` drops the old handle before removing the `unsaved-` files (`kernel/src/session_history.rs:373-378`). A listing in another run could open that history in the gap. The removal still goes through (H2), but the folder can stay empty. It is then never listed and never removed.
- **The line ceilings are my estimates**, mostly 11 kernel tests at about 45 lines each.
- **Two things are mine, not rulings.** The dedupe bound fails closed, and its value of 256 is a draft. Fail-closed keeps ADR-036 Amendment 1 item 5, but it brings back a narrower starvation, which item 76's fourth bullet discloses. The gate may object to that.

Report path: state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-2-lead-data-draft.md
sha256: not computed. This run had no hashing tool; the custodian computes it at filing.

Opus 5.5 (claude-opus-5-5)
