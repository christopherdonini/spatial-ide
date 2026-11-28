# The recovery offer's Part 1, class 9 under ADV-2026-11-28-15 item 1: lead-data's draft (node:b2-piece-1c-step-3-recovery-offer@part-1-class-9-listing-refused-lead-data-draft)

*Filed by the custodian at the report path its brief named. Lead-data (Opus) read main at db1506c3 in D:/wt/read-1128r and the head ffef5945 in D:/wt/read-recov. By the facts script its records run from 2026-11-28T08:19:27Z to 2026-11-28T08:32:21Z, and 0 of its calls ran with the main checkout as its working folder. By its completion notice it took 773313 ms and 73 tool uses. It is a draft: nothing in it binds until an amendment of the form carries it. Its hand-back is below as received, with the harness indent removed: 34993 bytes, sha256 7d5d24ae566cdee44a2ba505d8fbf8fc321bde2af9d13b3b7884aa76ae1256b6. Its words are lead-data's.*

---

RESULT: I drafted the class 9 amendment. It has a kernel row (K-C43, mutations M-K43 and M-K43-A), a shell row (S-11, mutation M-S11) and SKP-V0's sentences. By the drafter's estimate it adds about 131 lines and no file: Part 1 comes to about 5,015 lines over 46 files, against 5,200 and 47. The kernel product group goes to about 1,430 against 1,040, which is class 8 and is recorded in the amendment before the code.
BLOCKING QUESTIONS: none.
REPORT PATH: state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-class-9-listing-refused-lead-data-draft.md
SHA256: not computed. I wrote no file and have no hashing tool, so the custodian computes it over the filed bytes.

Everything below is my wording unless it is marked verbatim. Byte-copied: the line name `recover-list-refused` and the fourth string, from ADV-2026-11-28-15 (lines 14 and 57 of its file); SKP-V0's Old texts, from `protocol/skp/SKP-V0.md` at ffef5945; D-4's New, from the architect's read part.

## Summary
- **Kernel (item 1 (ii)):** `folder_names` now passes on the `read_dir` error. `walk` keeps its signature, because K-C27 calls it, and hands the error back in a new `Walked` field. `list_recoverable`'s start arm then refuses with `skp.session_history_unwritable`, built as `cut` builds its own, `detail` `read_dir: {e}`, with the fourth string as its message. A missing folder still gives an empty list with `more` false.
- **Shell (item 1 (i)):** the rejection handler in `RecoveryOffer`'s one listing effect (line 149, `() => undefined`) writes one `recover-list-refused` line for a typed refusal, in the form of `recover-refused`. It shows nothing, and an untyped failure behaves as it does now.
- **Tests:** a test reaches an unreadable folder on all three CI runners without a product seam, through `icacls` on Windows and file mode on Unix. Both are already used in this repository (K-O6, E-1). That rests on H4, which each runner's red run of K-C43 checks.
- **SKP-V0:** a new §13.3 bullet; §13.4's reused list, given beside D-4's text for the same place, plus a combined text; §8's `skp/0.18` bullet becomes "two new paths". §10.4's row needs no clause.
- **Shared path:** `protocol/skp/SKP-V0.md` is the only one named in the form's list (the relink branch; PR 353's `protocol/` row). The other two counts are close to their ceilings: protocol at 324 of 330 by the first-phase worker's count, and src-tauri at 428 of 430. Those margins are for the custodian's count before the correction.

## 1. The kernel row
- **Where the refusal goes, at ffef5945.**
  - The start arm calls `walk` (`kernel/src/recovery.rs`, line 536).
  - `walk` reads `folder_names(root).unwrap_or_default()` (line 358).
  - `folder_names` maps every `read_dir` error other than `NotFound` to `None` (lines 338-348; the arm is line 342).
  - So an unreadable store answers `Ok`, with no record and `more` false.
  - `hex_folders` reads the same names with `?`, so its `None` withholds (lines 399-413 and 417-420). That is the ruling's "cannot decide".
- **Why the signature stays.** K-C27, a unit test, calls `walk` directly and reads `taken` and `more` (line 1101). Changing `walk`'s signature would edit an existing test, which I3 forbids. So the error travels in a new `Walked` field.
- **The refusal** is a new private `unreadable_store(e)`, built as `cut` builds its own (lines 793-801): `SkpError::protocol_with_fields("session_history_unwritable", format!(<the fourth string>), [("detail", detail)])`, with `detail = format!("read_dir: {e}")`.
  - The fourth string (verbatim): `[P6 placeholder] the session store could not be read, so no record is listed: {detail}`
  - No new code, and `error.rs` is not edited.
- **What stays the same.**
  - A folder that is not there keeps its `NotFound` arm, so the reply is still an empty list with `more` false.
  - The bound, `more`, the dedupe (`hex_folders` with `.ok()?`, its results unchanged) and the at-open arm do not change.
- **The binding** passes the kernel's refusal through unchanged (`frontends/shell/src-tauri/src/commands.rs`, lines 286-300).

## 2. How a test makes a folder that is there and cannot be read
The kernel suite runs on three runners: windows-2022, ubuntu-24.04 and macos-latest (`.github/workflows/product-ci-rust.yml`, lines 200-209). No container is used.
- **Windows:** `icacls <store> /deny *S-1-1-0:(RD)`, removed again with `/remove:d *S-1-1-0`. (RD) is the list-folder right.
- **Linux and macOS:** `std::fs::set_permissions` to mode `0o000`, then back to `0o755`.
- **Both:** the result is checked, and a `Drop` guard restores access even if the test panics. Neither needs a new dependency or a product seam.
- **Precedent in this repository:** K-O6's `readable` helper (`kernel/tests/project_reopen.rs`, lines 1173-1192) makes a file unreadable the same way on all three runners and returns early on none. E-1's `icacls` helper and `DenyGuard` are in `kernel/tests/session_history.rs` (lines 589-629).
- **H4 (my reading; it holds only if each runner's red run agrees):**
  - On Windows, a deny of Everyone's list-folder right makes `read_dir` fail with a kind other than `NotFound`, even on an elevated runner.
  - The Linux and macOS jobs do not run the suite as root.
- **How the red run tests H4.** At the red commit:
  - If the folder really could not be read, the reply prints `Ok` with `records: []`.
  - A reply naming the record would mean the folder stayed readable on that runner.
- **If H4 is false on a runner,** the only route left is a seam: an injectable directory reader for `folder_names`, behind `#[cfg(test)]` or `pub(crate)`.
  - It would add a product item whose only caller is a test.
  - The test would then no longer drive the real `read_dir`.
  - It would have to be a unit test, because `kernel/tests` cannot reach `cfg(test)` items.
  - That is I13, a stop, for the advisor. Nothing is ruled here.
- **Not used:** a file in place of the folder. On Windows the error kind for that case is not established, and it may be `NotFound`.

## 3. The shell row
- **Where.** `RecoveryOffer`'s effect (`frontends/shell/src/project/RecoveryOffer.tsx`, lines 142-155) is the one place the list is asked for. `App.tsx` mounts it with `null` and with a reopen's handle (`frontends/shell/src/App.tsx`, lines 2337-2338). The handler at line 149 is replaced.
- **The line.** The name is `recover-list-refused` (verbatim). Its fields are `${refusal.code}: ${refusal.message}` after `shownRefusal(formatRefusal(e.skpError))`, as `recover-refused` and `discard-refused` carry them (lines 80-84 and 97-98).
- **How it reaches the session log:** `logSessionEvent` (`frontends/shell/src/diagnostics/log.ts`, lines 20-22) → `binding_log_session_event` → `append_redacted` (`commands.rs`, lines 463-470).
- **What S-11 shows:**
  - `listed` stays `null`, so the component renders nothing at line 206: no offer and no new text (cases 1 and 2).
  - A list that succeeds writes no line (case 3).
  - An untyped failure returns before any line is written, as now (case 4).

## 4. Tests
- **K-C43** `a_start_whose_session_store_cannot_be_read_is_refused_and_one_with_no_store_lists_nothing`, in `kernel/tests/recovery.rs`.
  - It drives a real `SkpHost`, `StepRecorder` and `list_recoverable`.
  - It asserts four things: the missing store gives `Ok`, (0, false); a crashed record is listed; the unreadable store is refused with the code, a `detail` of only `read_dir: …` with no path in it, and the exact message; once access is restored, the bytes are unchanged and the record is listed again.
  - It builds before the code. Its red run fails at the refused-listing assertion and prints `Ok`, `records: []`, `more: false`.
- **S-11** `a_refused_listing_logs_one_line_with_its_code_and_bounded_message_and_shows_no_offer_and_any_other_listing_logs_none`, in `RecoveryOffer.test.tsx`.
  - It uses the file's mocks. The component, `formatRefusal` and `shownRefusal` are real.
  - It has four cases: at mount, at an open, a success and an untyped failure.
  - Its red run fails at case 1's logs equality: `[]` against one line.

## 5. Mutations
- **M-K43:** Old `walked.unreadable = Some(e);`, New `drop(e);`. It fails K-C43 at the refused-listing assertion.
- **M-K43-A:** Old `Err(e) if e.kind() == ErrorKind::NotFound => return Ok(Vec::new()),`, New: the line removed. It fails K-C43 at its first assertion.
- **M-S11:** Old ``logSessionEvent("recover-list-refused", `${refusal.code}: ${refusal.message}`);``, New: the line removed. It fails S-11 at case 1's logs equality.
- Each mutation compiles. Each Old text stands once in its file: I checked the ffef5945 file, where none of them stands yet, and each is a new line by the draft.

## 6. SKP-V0's sentences
The exact texts are in amendment item 5.
- **§13.3:** a new bullet before line 1559. It is not D-3's place, since D-3 edits the `cannot-be-offered` bullet at line 1558.
- **§13.4:** line 1563 is the same place as D-4. Mine and D-4's are given side by side, with a combined text if both are taken. I rule nothing between them.
- **§8:** the bullet at line 1232 is touched by neither D-3 nor D-4.
- **§10.4:** no clause, by the same pattern the cut's refusal follows in §14.3 and §14.4.

## 7. Scope and count
Each file is already in Part 1, and none is added. Estimates:
| File | Group | Adds (about) |
|---|---|---|
| `kernel/src/recovery.rs` | kernel product | 25 |
| `kernel/tests/recovery.rs` | kernel tests | 65 |
| `protocol/skp/SKP-V0.md` | protocol | 1 |
| `RecoveryOffer.tsx` | shell product | 8 |
| `RecoveryOffer.test.tsx` | shell tests | 32 |

- **Kernel product:** 1,405 (Amendment 22 item 2; no kernel line since, by Amendment 24 item 1) plus 25 is about 1,430, against 1,040. That is over by about 390, of which these rows add about 25. It is class 8, recorded in the amendment before the code.
- **Other groups:**
  - shell product about 396 of 528;
  - shell tests about 484 of 550;
  - kernel tests about 1,253 of 1,510;
  - protocol about 325 of 330.
  - The kernel tests and protocol figures are the first-phase worker's counts at 96c3821a, not the custodian's.
- **Part 1:** about 5,015 lines over 46 files, against 5,200 and 47. Neither is passed.
- **Not counted by me:** C-1, C-2, D-1 to D-6, the ruling's item 2 strings, item 3's byte, and K-C1b and K-C4b. src-tauri is at 428 of 430, so the item 2 third string's builder or D-1's `commands.rs` line may pass that group. That is for the custodian's count before the correction.

## 8. Shared paths
- `protocol/skp/SKP-V0.md` is named in §2.11's table (the relink branch) and, as N-7 revises it, in PR 353's `protocol/` row (rule (00)). Named; nothing ruled.
- The other four files are not named in that list.
- I read no other checkout to see whether those pieces are still open.

## The amendment's text

````markdown
## Amendment N — DATE — class 9 under ADV-2026-11-28-15 item 1: a refused listing logged by the shell, an unreadable session store refused by the kernel

*Post-result for the piece: lead-data drafted this after Part 1's runs at ffef5945 (Amendment 24 item 3) and the architect's read part (Amendment 26) had been seen. No outcome of the two rows below exists, and none of their code. Rulings are cited by id and item. Branch lines are cited at ffef5945. Texts marked verbatim are byte-copied from the file named; everything else is lead-data's. The drafter has no hashing tool, so the custodian pins each cited span at filing.*

1. **Authority and scope.**
   - ADV-2026-11-28-15 item 1 (i) and (ii): class 9 on ADV-2026-11-27-46 items 2 to 4 and on §2.3 and §2.4. Amendment 27 item 2.
   - Files, all already in Part 1 (§2.11; Amendment 10 item 2): `kernel/src/recovery.rs`, `kernel/tests/recovery.rs`, `protocol/skp/SKP-V0.md`, `frontends/shell/src/project/RecoveryOffer.tsx` and `frontends/shell/src/project/RecoveryOffer.test.tsx`. No file is added.
   - No new code, wire member, capability entry, dependency, manifest or lockfile change. `protocol/skp/src/v0/error.rs` is not edited. The refusal is built by `SkpError::protocol_with_fields` (`protocol/skp/src/v0/error.rs`, lines 35-48 at ffef5945), as `cut` builds its own.
   - **Not touched:**
     - `hex_folders`'s results, the dedupe, `MAX_RECOVERABLE_RECORDS`, `MAX_DEDUPE_RECORDS`, `more` and the at-open arm of `list_recoverable`;
     - `frontends/shell/src-tauri/**` and `frontends/shell/src/App.tsx`;
     - every existing test, K-C27 among them.

2. **The kernel row** (ADV-2026-11-28-15 item 1 (ii)).
   - **At ffef5945:**
     - `list_recoverable`'s start arm calls `walk` (`kernel/src/recovery.rs`, line 536 at ffef5945).
     - `walk` reads `folder_names(root).unwrap_or_default()` (line 358).
     - `folder_names` gives `None` for every `read_dir` error but `NotFound` (lines 338-348; the arm is line 342).
     - So a store folder that is there and cannot be read answers `Ok`, with no record and `more` false.
   - **The change.** The worker may re-wrap lines for rustfmt; nothing else changes.
     - `folder_names` returns `std::io::Result<Vec<String>>`. Its arms become `Err(e) if e.kind() == ErrorKind::NotFound => return Ok(Vec::new()),` and `Err(e) => return Err(e),`, and its last line becomes `Ok(names)`. Its doc gains: a root that is there and cannot be read gives the error `read_dir` gave.
     - `hex_folders`: line 401 becomes `for name in folder_names(root).ok()? {`. Its results are unchanged.
     - `Walked` (lines 332-335) gains `unreadable: Option<std::io::Error>`, documented as `Some` when the store's folder is there and could not be read, in which case nothing was taken.
     - `walk` keeps its signature, because K-C27 calls it and reads `taken` and `more` (line 1101). Its first line becomes `let mut walked = Walked { taken: Vec::new(), more: false, unreadable: None };`. Then:
       ```text
       let names = folder_names(root).unwrap_or_else(|e| {
           walked.unreadable = Some(e);
           Vec::new()
       });
       ```
       Line 358 becomes `for name in names {`.
     - A new private function after `walk`, `fn unreadable_store(e: std::io::Error) -> SkpError`, built as `cut` builds its refusal (lines 793-801):
       ```text
       let detail = format!("read_dir: {e}");
       SkpError::protocol_with_fields(
           "session_history_unwritable",
           format!("[P6 placeholder] the session store could not be read, so no record is listed: {detail}"),
           [("detail", detail)],
       )
       ```
       The message is ADV-2026-11-28-15 item 2's fourth string (verbatim, from the ruling's fence): `[P6 placeholder] the session store could not be read, so no record is listed: {detail}`. Its doc comment, in the worker's words, says three things:
       - it is a start's refusal when the store's folder is there and cannot be read, because an empty list would say that no record was left out;
       - it is built as `cut`'s is;
       - the error's text names no path.
     - In the start arm, line 536 becomes `let Walked { taken, more: over, unreadable } = walk(&self.root, &held);`, followed by:
       ```text
       if let Some(e) = unreadable {
           return Err(unreadable_store(e));
       }
       ```
       Nothing has been taken at that point, so no lock is held. The doc comment of `list_recoverable` (lines 510-512) gains one sentence: at a start, a session store that is there and cannot be read refuses the list.
   - **The reply:**
     - the code is `skp.session_history_unwritable`;
     - `fields` holds only `detail`, which begins `read_dir: ` and goes on with the error's text;
     - `message` is the fourth string with that `detail`.
   - **Unchanged:** a store folder that is not there still gives an empty list with `more` false. The bound, `more`, the dedupe and the at-open arm do not change.
   - The binding passes the refusal through unchanged (`frontends/shell/src-tauri/src/commands.rs`, lines 286-300 at ffef5945).

3. **The shell row** (ADV-2026-11-28-15 item 1 (i)).
   - **Where.** The shell asks for the list in one place, at mount and at a project's open: `RecoveryOffer`'s effect (`frontends/shell/src/project/RecoveryOffer.tsx`, lines 142-155 at ffef5945). `App.tsx` mounts it with `projectDataset` `null` and with a reopen's handle (`frontends/shell/src/App.tsx`, lines 2337-2338 at ffef5945).
   - **The handler.** The rejection handler `() => undefined` (line 149) becomes:
     ```text
     (e: unknown) => {
       if (!(e instanceof SkpCallError)) return;
       const refusal = shownRefusal(formatRefusal(e.skpError));
       logSessionEvent("recover-list-refused", `${refusal.code}: ${refusal.message}`);
     }
     ```
   - **The line.**
     - Its name is ADV-2026-11-28-15 item 1 (i)'s (verbatim): `recover-list-refused`.
     - Its fields are those of `recover-refused` and `discard-refused`: the code and the bounded message after `shownRefusal(formatRefusal(...))` (lines 80-84 and 97-98).
     - The imports are already present (lines 25, 27, 28 and 30).
     - It reaches the session log as those lines do: `logSessionEvent` (`frontends/shell/src/diagnostics/log.ts`, lines 20-22 at ffef5945), then `binding_log_session_event`, then `SessionLog::append_redacted` (`frontends/shell/src-tauri/src/commands.rs`, lines 463-470 at ffef5945).
   - **What it does not do:**
     - `listed` stays `null`, so the component renders nothing (line 206): no offer and no new text.
     - A list that succeeds writes no such line.
     - A failure that is not a typed refusal returns as before and writes nothing.
     - The handler does not read `current`, so a refusal that arrives after the offer unmounted is still written once.
   - **Comments** (in the worker's words):
     - line 144's comment adds that a typed refusal writes one `recover-list-refused` line and any other failure writes none;
     - the file's doc (lines 17-18) names the line beside `discard-refused`.

4. **Tests**, added after S-10's row (Amendment 20 item 4). Each is committed and run red at a named commit before its code (§4), then green. Each mutation is applied, run, recorded by name with its commit, and reverted at Part 1's head.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C43 | `a_start_whose_session_store_cannot_be_read_is_refused_and_one_with_no_store_lists_nothing` (`kernel/tests/recovery.rs`). A real `SkpHost` and `StepRecorder` through the file's `site` and `run` (lines 48-100 at ffef5945). `list_recoverable` is called with `ListRecoverableRequest { skp, dataset: None }`, not through `Run::list`, which expects `Ok`. In order: (1) with the site's store folder not there, the reply's `(records.len(), more)` is `Ok((0, false))`; (2) `crashed(&s, 2)` (lines 208-221) leaves a record, its two files are read, and the list names it; (3) the store folder is made unreadable (below), and the reply is `Err`, which the assertion's message prints otherwise: its `code` is `skp.session_history_unwritable`, its `fields` keys are exactly `["detail"]`, `detail` begins `read_dir: ` and is longer than that, `detail` holds neither the store's path nor the record's name, and `message` equals the fourth string with `{detail}` replaced by `detail`; (4) with access restored, the record's two files are byte for byte as in (2), and the list names the record again. To make the folder unreadable: on Windows, `icacls <store> /deny *S-1-1-0:(RD)`, removed with `/remove:d *S-1-1-0`; on Linux and macOS, mode `0o000`, restored to `0o755`. Each status is checked, and a guard's `Drop` restores access even if the test panics, as `DenyGuard` (`kernel/tests/session_history.rs`, lines 605-629 at ffef5945) and `readable` (`kernel/tests/project_reopen.rs`, lines 1173-1192 at ffef5945) do. No early return on any operating system | **M-K43:** in `walk`, Old `walked.unreadable = Some(e);`, New `drop(e);`. **M-K43-A:** in `folder_names`, Old `Err(e) if e.kind() == ErrorKind::NotFound => return Ok(Vec::new()),`, New: the line removed | M-K43: K-C43, at step (3)'s refusal assertion. M-K43-A: K-C43, at step (1)'s assertion, and any test that lists a start before a store folder exists |
| S-11 | `a_refused_listing_logs_one_line_with_its_code_and_bounded_message_and_shows_no_offer_and_any_other_listing_logs_none` (`RecoveryOffer.test.tsx`, with the file's mocks at lines 13-55 at ffef5945; the component, `formatRefusal` and `shownRefusal` are real). Each case renders `<RecoveryOffer>` afresh with a new `key` and settles as `mount` does (lines 100-107). `listed` and `logs` are reset between cases. **Case 1**, at mount: `listRecoverable` throws `skp.session_history_unwritable` with a message holding U+202E and longer than 1,024 characters. `listed` is `[null]`, the logs are `[{level: "recover-list-refused", message: "skp.session_history_unwritable: " + shownText(message)}]`, the container's text is empty, and no `.recovery-offer` stands. **Case 2**, at a project's open (`projectDataset` `"ds_1"`): it throws `skp.unknown_dataset` with the message `m`. `listed` is `["ds_1"]`, the logs are `[{level: "recover-list-refused", message: "skp.unknown_dataset: m"}]`, and nothing is rendered. **Case 3:** it resolves one `found` record; one `.recovery-entry` stands, and the logs are `[]`. **Case 4:** it rejects with a plain `Error`; the logs are `[]`, and nothing is rendered | **M-S11:** Old ``logSessionEvent("recover-list-refused", `${refusal.code}: ${refusal.message}`);``, New: the line removed | S-11, at case 1's logs equality |

   - **Red runs:**
     - K-C43 uses only items that are public at ffef5945, so it builds before its code. On each of the three entries of Product CI (Rust workspace) at the red commit, steps (1) and (2) pass, and step (3) fails at its refusal assertion, printing `Ok` with `records: []` and `more: false`. A reply there that names the record means the folder stayed readable on that runner (H4 false): that is a finding, not a red run.
     - S-11 fails at case 1's logs equality, `[]` against one line, while the handler is still `() => undefined`.
   - **Known pass cases:** no whole test passes before its code. The steps that pin unchanged behaviour do pass: K-C43's (1) and (2), and S-11's cases 3 and 4.
   - **Why each mutation fails at an assertion and not at a compile:**
     - M-K43's closure stops capturing `walked`, so `unreadable` is never `Some`.
     - Under M-K43-A, a missing folder falls to `Err(e) => return Err(e),`.
     - Under M-S11 `refusal` is unused, and vitest does not type-check. S-10's mutation has the same shape, and it was observed failing its test (Amendment 24 item 1).
   - Each Old text stands once in its file, in the function named. Leading whitespace is not part of an Old text.

5. **SKP-V0's sentences.** They are read together with the architect's D-3 and D-4 (ADV-2026-11-28-15 items 1 and 5).
   - **§13.3.** Old (verbatim, `protocol/skp/SKP-V0.md`, line 1559 at ffef5945):
     ```text
     - **Not cancellable, no progress:** one pass over the store's folders.
     ```
     New:
     ```text
     - **A store that cannot be read.** At a start, when the session store's folder is there and cannot be read, the list is refused `skp.session_history_unwritable`, its `detail` `read_dir: ` and the error's text: an empty list would say that no record was left out. A store whose folder is not there holds no record, and the reply is an empty list with `more` `false`.
     - **Not cancellable, no progress:** one pass over the store's folders.
     ```
     This is not D-3's place, since D-3 edits the `cannot-be-offered` bullet (line 1558). Read together: D-3's `no-step` is a record whose own history could not be opened, locked or read; this bullet is about the store's folder, before any record is reached.
   - **§13.4.** This is the same place as D-4. Old (verbatim, line 1563):
     ```text
     Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has). The four `skp.recoverable_record_*` codes are §14.4's and §15's, and this command returns none of them.
     ```
     Lead-data's New:
     ```text
     Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has); `skp.session_history_unwritable`, as §10.4 gives it, at a start whose session store's folder is there and cannot be read (§13.3). The four `skp.recoverable_record_*` codes are §14.4's and §15's, and this command returns none of them.
     ```
     D-4's New for the first sentence (verbatim, from the architect's read part, D-4):
     ```text
     Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has); `skp.session_history_unwritable`, as §10.4 gives it (no per-user data directory resolves).
     ```
     If both are taken, one text carries both:
     ```text
     Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has); `skp.session_history_unwritable`, as §10.4 gives it (no per-user data directory resolves; or, at a start, the session store's folder is there and cannot be read, §13.3). The four `skp.recoverable_record_*` codes are §14.4's and §15's, and this command returns none of them.
     ```
     Which of them is taken is not lead-data's to decide (ADV-2026-11-27-10 item 2).
   - **§8, the `skp/0.18` entry.** Old (verbatim, line 1232):
     ```text
     - **One code is reached by a new path.** `skp.session_history_unwritable` is `recover_session`'s refusal when the history could not be cut to its kept steps; its `detail` names `set_len`, `seek` or `sync_all`. Its code and field are §10.4's.
     ```
     New:
     ```text
     - **One code is reached by two new paths.** `skp.session_history_unwritable` is `recover_session`'s refusal when the history could not be cut to its kept steps, its `detail` naming `set_len`, `seek` or `sync_all`; and `list_recoverable`'s at a start when the session store's folder is there and cannot be read, its `detail` `read_dir: ` and the error's text (§13.3). Its code and field are §10.4's.
     ```
     Neither D-3 nor D-4 touches this line. The entry's "no message and no other code changes" (line 1228) stays true. The binding's no-recorder refusal at the three new commands, D-4's case, is not named in this bullet; whether it is named is for the gates.
   - **§10.4's row** (line 1390): no clause. Its code and field are what §13.4 and §8 point to. The case is said in §13.3, as the cut's case is said in §14.3 (line 1594) and pointed to from §14.4 (line 1600) with no clause in the row.

6. **The count**, by §2.11's counting over `97e2156d...` the head. These are estimates; the custodian's count before the code governs.

| File | Group | Adds (about) |
|---|---|---|
| `kernel/src/recovery.rs` | kernel product | 25 |
| `kernel/tests/recovery.rs` | kernel tests | 65 |
| `protocol/skp/SKP-V0.md` | protocol | 1 (the other two edits are of lines Part 1 added) |
| `frontends/shell/src/project/RecoveryOffer.tsx` | shell product | 8 |
| `frontends/shell/src/project/RecoveryOffer.test.tsx` | shell tests | 32 |

   - **Class 8, recorded here before the code** (ADV-2026-11-28-15 item 1; Amendment 27 item 2).
     - The kernel product group was 1,405 at 96c3821a (Amendment 22 item 2), and the second phase wrote no kernel line (Amendment 24 item 1).
     - With these rows it is about 1,430, against its Part 1 ceiling of 1,040 (Amendment 17 item 6): over by about 390, of which about 25 are these rows'.
     - §7 is not edited.
   - **The other groups:**
     - shell product, 388 now, about 396 of 528;
     - shell tests, 452 now, about 484 of 550 (Amendment 24 item 2; the figures that bind are Amendment 21's, by Amendment 27 item 6);
     - kernel tests, about 1,253 of 1,510;
     - protocol, about 325 of 330.
     - The kernel tests and protocol figures come from the first-phase worker's counts at 96c3821a, 1,188 and 324 by its report; those are not the custodian's counts.
   - **Part 1:** 4,884 lines over 46 files (Amendment 24 item 2) plus about 131 is about 5,015 over 46, against 5,200 and 47 (Amendment 21 item 2). Not passed.
   - **Not counted here:**
     - the held corrections: C-1, C-2, D-1 to D-6, ADV-2026-11-28-15 items 2 and 3, and K-C1b and K-C4b;
     - src-tauri is at 428 of 430 (Amendment 24 item 2), and the protocol group has about 5 lines to spare.

7. **Shared paths** (§2.11's table, as N-7 revises it; Amendment 17 item 7; Amendment 20 item 7). Named, not ruled:
   - `protocol/skp/SKP-V0.md` is named under the relink branch, and under PR 353's `protocol/` row (rule (00)).
   - `kernel/src/recovery.rs`, `kernel/tests/recovery.rs`, `RecoveryOffer.tsx` and `RecoveryOffer.test.tsx` are not named in that list.

8. **Additions to the form's sections** (read with the sections named):
   - **§0, Hypotheses: H4** (the drafter's reading, from K-O6's and E-1's practice in this repository): on each of Product CI (Rust workspace)'s three runners, the test process can make a folder it owns unreadable to itself. On Windows, a deny of Everyone's list-folder right makes `std::fs::read_dir` of that folder fail with a kind other than `NotFound`. On Linux and macOS the suite does not run as root, so mode `0o000` makes it fail with `PermissionDenied`. Discriminator: K-C43's red run on each runner (item 4).
   - **§1, May claim:**
     - a start whose session store's folder is there and cannot be read is refused, and a start with no store folder lists nothing (K-C43);
     - a typed refusal of the list leaves one session-log line and shows no offer, and any other listing leaves no such line (S-11).
   - **§2.3, Listing:** item 2's refusal.
   - **§2.4, Wire:** item 5's sentences.
   - **§2.9, Seams:**
     - `std::fs::read_dir` → `folder_names` → `walk` → `list_recoverable`'s refusal;
     - `logSessionEvent` → `RecoveryOffer`'s listing.
   - **§5, Declared unchanged:**
     - `walk`'s signature;
     - `hex_folders`'s results;
     - `more`, the bound, the dedupe and the at-open arm;
     - the path of an untyped failure of the list;
     - every existing test.
   - **§5, Invalidators: I13**, a stop. It applies if K-C43 cannot make the folder unreadable on one of the three runners without a product seam or a new dependency, or if the row needs `walk`'s signature changed or an existing test edited. It goes to the advisor (ADV-2026-11-28-15 item 1).
   - **§8, item 19:** any of these:
     - a start's list that answers `Ok` when the store's folder is there and was not read;
     - such a refusal whose `detail` or `message` carries a path;
     - a change by these rows to `more`, the bound, the dedupe or the at-open arm;
     - a `recover-list-refused` line written for a list that succeeded, or for a failure that is not a typed refusal.
   - **Amendment 10 item 2:**
     - Tests gain K-C43 and S-11.
     - Callers: `unreadable_store`'s product caller is `list_recoverable`.
   - **§2.12, after D24:** | D25 | rule | (none) | a start's list refused when the store's folder is there and cannot be read; the shell's `recover-list-refused` line; K-C43 and S-11 | ADV-2026-11-28-15 item 1 |

9. **Named, not changed:**
   - (a) A store path that is a file makes `read_dir` fail. On Unix the list is then refused. On Windows the error's kind is not established here, and if it is `NotFound` the list is empty, as for no folder. No test asserts this case.
   - (b) An entry error during the walk, or a name that is not UTF-8, is still dropped (line 344). Neither can have either shape.
   - (c) The at-open arm reads no list of folders. A store folder that cannot be read gives there what the probe gives (lines 554-558), unchanged.
   - (d) The dedupe's own later read of the names still withholds on a failure and sets `more`.
   - (e) In a development build, React's StrictMode (`frontends/shell/src/bootstrap.tsx`, line 26 at ffef5945) runs the effect twice. So a development run asks twice, and two refusals write two lines, one per call.
   - (f) The user is told nothing when the list is refused (item 1 (i)). Whether a record says so is not drafted here.

Read the last amendment first.

Nothing above is edited.
````

## Files read (all read only)
- D:/wt/read-1128r/kernel/README.md (its owner's index, lines 357-403)
- D:/wt/read-1128r/engine/README.md (its owner's index, lines 533-568)
- D:/wt/read-1128r/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (lines 1-384; 745-764; 2160-2204; 2650-2729; 2832-3057; and Greps)
- D:/wt/read-1128r/state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-15-the-recovery-offers-part-1-a-failed-listing-logged-and-an-unreadable-store-refused-four-message-strings-one-byte-in-skp-v0-10-3.md (whole)
- D:/wt/read-1128r/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md (whole)
- D:/wt/read-1128r/state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-part-1-build-gate-architect-read-part.md (whole)
- D:/wt/read-1128r/state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-s9-third-case-lead-data-draft.md (whole)
- D:/wt/read-1128r/state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-part-1-first-phase-wire-and-kernel-worker-report.md (lines 66-79, plus a Grep)
- D:/wt/read-recov/kernel/src/recovery.rs (lines 1-140, 330-619, 760-819, 1090-1139, plus Greps)
- D:/wt/read-recov/protocol/skp/src/v0/error.rs (lines 1-140, plus a Grep)
- D:/wt/read-recov/protocol/skp/SKP-V0.md (lines 1224-1236, 1371-1395, 1530-1641, plus Greps)
- D:/wt/read-recov/frontends/shell/src/project/RecoveryOffer.tsx (whole)
- D:/wt/read-recov/frontends/shell/src/project/RecoveryOffer.test.tsx (whole)
- D:/wt/read-recov/frontends/shell/src/App.recover.test.tsx (lines 10-59)
- D:/wt/read-recov/frontends/shell/src-tauri/src/commands.rs (lines 276-305, plus a Grep at 463-470 and 1046-1058)
- D:/wt/read-recov/frontends/shell/src/skp/client.ts (lines 185-204, plus a Grep)
- D:/wt/read-recov/kernel/tests/recovery.rs (lines 1-370, 686-745, 830-866, plus Greps)
- D:/wt/read-recov/kernel/tests/session_history.rs (lines 580-686)
- D:/wt/read-recov/kernel/tests/project_reopen.rs (lines 1100-1204, plus Greps)
- D:/wt/read-recov/kernel/Cargo.toml (whole)
- D:/wt/read-recov/.github/workflows/product-ci-rust.yml (whole)
- By Grep only: D:/wt/read-recov/kernel/src/session_history.rs (`StepRecorder::new`, `create_dir_all`); D:/wt/read-recov/frontends/shell/src/diagnostics/log.ts (`logSessionEvent`); D:/wt/read-recov/frontends/shell/src/admission/formatRefusal.ts; D:/wt/read-recov/frontends/shell/src/bootstrap.tsx (StrictMode); D:/wt/read-recov/frontends/shell/src/App.tsx (the `RecoveryOffer` mounts); D:/wt/read-recov/protocol/skp/src/v0/commands.rs (`ListRecoverableResponse`'s derive); D:/wt/read-recov/protocol/skp/tests (`list_recoverable`); D:/wt/read-recov/kernel/src (crate attributes; `walk`, `folder_names` and `hex_folders` callers)
