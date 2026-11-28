# The recovery offer's Amendment 20, lead-data's draft: the three session-log lines of ADV-2026-11-27-46 items 2 to 4, their tests and mutations

*Filed by the custodian as a draft, not as an amendment of the form, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md`, items 2 to 4. lead-data (Opus) read D:/wt/read-1128a at 8b7f4eeee4478377da1bead3c18912fded5180e4 and D:/wt/recov at 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b, read only, and wrote no file. By the facts script its records run from 2026-11-28T00:27:40Z to 2026-11-28T00:36:28Z, with no call in the main checkout; by its completion notice it took 527957 ms and 39 tool uses. Its hand-back is below as received, with the harness indent removed: 26854 bytes, sha256 edfd35290e1c6df914312a1ee13de42ff5933a41451558f0de9a051e92c39afe. Its two blocking items, the whole at about 6,035 lines and the place of the discard line's writer, go to the advisor before the amendment is appended or Part 1's code starts. Its words are lead-data's.*

---

RESULT: I've drafted Amendment 20. It covers all three lines, each with its place, its test and its mutation. By my estimate it puts the whole piece at about 6,035 lines, which passes 6,000.
BLOCKING 1: The whole would be about 6,035 lines, against the 6,000 ceiling of ADV-2026-11-27-46 item 4 (and ADV-2026-11-27-38 item 2). By that item the overrun goes to the advisor before Part 1's code. I have shrunk nothing to fit.
BLOCKING 2: An existing commands.rs test, K-4 (`the_session_log_binding_calls_append_redacted_and_no_other_line_here_calls_append`), fails if any product line of `commands.rs` calls `.append(`. So the draft puts the session-log write in `lib.rs`, next to the write behind B's page-end line, and calls it from `commands.rs`. Does that placement meet ADV-2026-11-27-46 item 2's "as the page-end line of B does"? If not, item 2's last bullet sends the matter to the advisor before code. That call is the custodian's.
REPORT PATH: state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-amendment-20-lead-data-draft.md
SHA256: not computed. I have no hashing tool. The custodian computes it over the filed bytes.

---

## Summary

1. **The discard line.** The discard handler can reach the session log the way B's page-end line does: the managed `SessionLog` through `try_state`, then `SessionLog::append`. K-4 forbids that call in `commands.rs`, so the write is drafted as a small `lib.rs` function next to B's. The command calls it through a crate-private `discard_and_log` in `commands.rs`.
2. **The two refusal lines.** Both are written from `RecoveryOffer.tsx`, where Part 1 calls the commands. Each is a catch that logs the code and bounded message, exactly as `admitProject`'s `reopen-refused` line does.
3. **Tests.** T-6 (in `page.rs`'s tests, on the rig) and T-7 (in `commands.rs`'s tests) cover the discard line. S-9 and S-10 (in `RecoveryOffer.test.tsx`) cover the refusal lines. There are four mutations, and each fails at an assertion, not a compile error.
4. **Scope.** No new file: all five files are already in Part 1. About 150 counted lines are added. Part 1 goes to at most 5,175 lines and the whole to at most 6,035, which passes 6,000 by about 35.
5. **Shared paths.** `commands.rs` is shared with PR 356, and `page.rs` with the reload piece.

## Items 1 to 7, per line

### Line A: `recovery-discarded kind=<unsaved|project>` (verbatim, from ADV-2026-11-27-46 item 2)

1. **Where it is written.**
   - **Can the handler reach the session log the way B's page-end line does? Yes.**
     - B's line is written by `run_end` through `(parts.log)("info", …)` (`frontends/shell/src-tauri/src/page.rs`, lines 508-513 at 97e2156d).
     - `parts.log` is a closure built in `lib.rs`. It calls `for_log.try_state::<SessionLog>()` and then `session_log.append(level, message)` (`frontends/shell/src-tauri/src/lib.rs`, lines 224-228 at 97e2156d).
     - `SessionLog` is always managed (`lib.rs`, line 529 at 97e2156d). If it cannot be opened, the app refuses to start (`lib.rs`, lines 393-398).
     - A Tauri command can reach the same state through its `AppHandle`, as `projects_of` already does (`commands.rs`, lines 57-60 at 97e2156d).
   - **The constraint.** K-4 (`frontends/shell/src-tauri/src/commands.rs`, lines 879-918 at 97e2156d) fails if any product line of `commands.rs` contains `.append(` (its filter is at line 910). Its doc says `lib.rs` and `pool_poll.rs` write the host's own lines with `append`, and that the scan deliberately does not reach them (lines 868-870).
   - **The draft:**
     - In `lib.rs`, a new `pub(crate) fn write_host_line(app, level, message)` with the same two calls as the page-end closure.
     - In `commands.rs`, a new `pub(crate) fn discard_and_log(recorder, request, log: &dyn Fn(&str, &str))`. It runs the recorder's `discard_recoverable` entry point and, on an `Ok` reply only, calls `log("info", "recovery-discarded kind=…")`.
     - Part 1's `#[tauri::command] discard_recoverable` runs `discard_and_log` on `spawn_blocking`, passing a closure that calls `crate::write_host_line(&app, …)`.
     - K-4 and `state.rs` are unchanged.
   - **Not proposed:**
     - Path form, `SessionLog::append(&log, ..)`. K-4's doc says it does not see that form, so using it would defeat the scan.
     - `append_redacted`. It would make `state.rs`'s doc ("its one product caller", lines 83-84 at 97e2156d) untrue and add a 51st file to the piece.
     - Any edit of K-4.
2. **The kind field.**
   - `kind` is read from the request's `record` member as text: `unsaved` if the name begins `unsaved-`, `project` otherwise, in a private `discarded_kind(record: &str)`.
   - The message is `format!("recovery-discarded kind={kind}")` at level `info`. The level is my choice, following the page-end line (`page.rs`, line 509).
   - The written line is `<unix-ms> info recovery-discarded kind=unsaved` (`SessionLog::append`, `state.rs`, line 76).
   - It carries no record name, path or project identity: the format holds only the literal and one of two fixed words.
   - "A discard that removed a record" is read as the kernel's `Ok` reply. That `Ok` follows the removals is the kernel's step 4 (the form, Amendment 4 item 5's text for `discard_recoverable`).
3. **No line on a refused discard.** T-6 shows it: a second discard of the removed record is refused, and the capture still holds one line.
4. **Tests.**
   - **T-6** `a_discard_that_removed_a_record_writes_one_session_log_line_naming_only_its_kind`, in `page.rs`'s `mod tests` (place (a), as the gate chose).
     - **Interfaces it drives:** the real `Rig` with its `recorder` field (Amendment 17 item 3); a crashed `unsaved-` record made as Amendment 17 item 3's common part makes it; `crate::commands::discard_and_log` with `&*rig.recording_log()`, the same capture B's page-end tests use (`page.rs`, lines 757-765 at 97e2156d).
     - **It asserts:**
       - the reply is `Ok`, and the record's folder is gone;
       - `rig.seen.lines()` is exactly `["info recovery-discarded kind=unsaved"]`;
       - that line contains neither the record name, nor its 32-hex part, nor the sessions folder's path;
       - a second discard of the same name is `Err`, and the capture still holds one line.
   - **T-7** `the_discarded_kind_is_unsaved_for_an_unsaved_name_and_project_for_any_other`, in `commands.rs`'s `mod tests`. It calls `super::discarded_kind` on `unsaved-` followed by 32 zeros (expects `unsaved`) and on 32 zeros (expects `project`).
5. **Mutations** (each Old text stands once, in the function named):
   - **M-T6**, in `discard_and_log`. Old: `if reply.is_ok() {` New: `if reply.is_err() {`. T-6 fails at its line-equality assertion: the capture is empty.
   - **M-T7**, in `discarded_kind`. Old: `if record.starts_with("unsaved-") {` New: `if !record.starts_with("unsaved-") {`. T-7 fails at its first assertion, and T-6 at the line's equality.
6. **Scope.**
   - `commands.rs` is in Part 1 (§2.11; Amendment 10 item 2): about 42 lines. That is `discard_and_log` with its doc (about 17), `discarded_kind` (about 9), the command's change (about 4), the module doc (about 2) and T-7 (about 10).
   - `lib.rs` is in Part 1: about 9 lines.
   - `page.rs`'s tests are in Part 1 (Amendment 17 items 2 and 3; N-43): about 38 lines.
7. **Shared paths.** `commands.rs` is named shared with PR 356 (§2.11's table, as N-7 revises it). `page.rs` is named shared with the reload piece (Amendment 17 item 7). `lib.rs` is not named.

### Line B: `recover-refused` (verbatim, ADV-2026-11-27-46 item 3)

1. **Where it is written.** Part 1 places Recover's `admit` in `frontends/shell/src/project/RecoveryOffer.tsx` (§2.7). That file does not exist at 97e2156d.
   - The draft names an exported `admitRecovered(record, cancelKey, dataset)`. The component's `runAdmitPath` runs it, as `admitProject` is run (`AdmissionPanel.tsx`, line 487 at 97e2156d).
   - In its catch, as at `frontends/shell/src/project/openProject.ts`, lines 80-82 at 97e2156d:
     - `if (!(e instanceof SkpCallError)) throw e;`
     - `const refusal = shownRefusal(formatRefusal(e.skpError));`
     - `logSessionEvent("recover-refused", …)`
2. Not applicable.
3. **Code and message.** The line carries the code and the bounded message exactly as `reopen-refused` does: `${refusal.code}: ${refusal.message}`, after `shownRefusal(formatRefusal(...))`. A recover that succeeds writes no line: S-9's second case shows it.
4. **Test S-9** `a_refused_recover_logs_one_line_with_its_code_and_bounded_message_and_one_that_succeeds_logs_none`, in `RecoveryOffer.test.tsx`.
   - It mocks `../skp/client` and `../diagnostics/log` as `openProject.test.ts` does (lines 20-42 at 97e2156d). It calls the real `admitRecovered`, with the real `formatRefusal` and `shownRefusal`.
   - **Refused case:** the recover wrapper throws `skp.recoverable_record_locked` with a message holding U+202E. The outcome is `refused`, and the logs equal `[{level:"recover-refused", message:"skp.recoverable_record_locked: " + shownText(message)}]`.
   - **Success case:** the logs are reset; the wrapper resolves an `opened` reply and describe resolves. The outcome is not `refused`, and the logs equal `[]`.
5. **Mutation M-S9.**
   - Old: ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``
   - New: ``logSessionEvent("recover-refused", `${e.skpError.code}: ${e.skpError.message}`);``
   - S-9 fails at its logs equality: the message is unbounded.
6. **Scope.** `RecoveryOffer.tsx` is in Part 1 (§2.11, new): about 20 lines for both lines. That is two imports, the two catch lines, and `discardEntry` with its doc (about 14). `RecoveryOffer.test.tsx` is in Part 1 (§2.11, new): about 40 lines for S-9 and S-10 with their mocks.
7. **Shared paths.** Neither file is named in the form's shared-path list.

### Line C: `discard-refused` (verbatim, ADV-2026-11-27-46 item 3)

1. **Where it is written.** An exported `discardEntry(record)` in `RecoveryOffer.tsx`, which the Discard click calls (§2.7, "Discard calls `discard_recoverable`").
   - Its try calls the discard wrapper and returns `null`.
   - Its catch has the same three lines as above, with `logSessionEvent("discard-refused", …)`, and returns the refusal.
2. Not applicable.
3. **Code and message.** As for line B. A discard that succeeds writes no line of this kind: S-10's second case shows it. Its one line is the binding's line A, which T-6 shows.
4. **Test S-10** `a_refused_discard_logs_one_line_with_its_code_and_message_and_one_that_succeeds_logs_none`, in `RecoveryOffer.test.tsx`, with the same mocks.
   - **Refused case:** the wrapper throws `skp.recoverable_record_unknown`, message `m`. The refusal is returned, and the logs equal `[{level:"discard-refused", message:"skp.recoverable_record_unknown: m"}]`.
   - **Success case:** after a reset, the wrapper resolves `{}`. The result is `null`, and the logs equal `[]`.
5. **Mutation M-S10.**
   - Old: ``logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);``
   - New: the line removed.
   - S-10 fails at its logs equality.
6. **Scope.** As for line B.
7. **Shared paths.** As for line B.

### The count (item 6, whole)

| Group | Part 1 now | Adds | Part 1 with them |
|---|---|---|---|
| src-tauri | 340 | about 90 | 430 |
| shell product | 500 | about 20 | 520 |
| shell tests | 500 | about 40 | 540 |

- **Lines:** Part 1 goes from at most 5,025 to at most 5,175. Part 2 stays at 860. The whole goes to at most 6,035, which passes 6,000 by about 35.
- **Files:** Part 1 stays at 47 and the union at 50.

## The text of Amendment 20

````text
## Amendment 20 — DATE — class 9 on ADV-2026-11-27-46 items 2 to 4: the three session-log lines, their tests and mutations

*Lead-data drafted this before any code of Part 1. It was written after these had been seen: the form gate, attempt 8, PASS WITH NOTES (Amendment 19 item 1), and the ruling ADV-2026-11-27-46. No test outcome of this piece exists. Rulings are cited by id and item. Branch lines are cited at the base 97e2156d (Amendment 19 item 4). The drafter has no hashing tool, so the custodian pins each cited span at filing. No further form-gate attempt is asked (ADV-2026-11-27-46 item 5). Part 1's build gates read these rows, and the reviewer's report says where each line is written.*

1. **Authority and scope.**
   - ADV-2026-11-27-46 item 2 asks for the binding's discard line, item 3 for the two refusal lines, and item 4 for a test and a mutation for each, counted in Part 1.
   - No kernel file, wire item, capability entry or dependency changes. No file is added to Part 1.
   - Files: `frontends/shell/src-tauri/src/commands.rs`, `frontends/shell/src-tauri/src/lib.rs`, the tests of `frontends/shell/src-tauri/src/page.rs`, `frontends/shell/src/project/RecoveryOffer.tsx` and `frontends/shell/src/project/RecoveryOffer.test.tsx`. All are in Part 1 already (§2.11; Amendment 10 item 2; Amendment 17 items 2 and 3, with N-43).
   - **Not touched:**
     - `frontends/shell/src-tauri/src/state.rs`;
     - `frontends/shell/src/project/openProject.ts` and `frontends/shell/src/admission/admitDataset.ts`;
     - `admission/AdmissionPanel.tsx` (I8);
     - every existing test, K-4 among them.
   - Amendment 17 item 1's "Not touched" list names `discard_recoverable`. It is read as that amendment's own scope; this amendment adds item 2's line to that handler.

2. **The discard's line, written by the binding** (ADV-2026-11-27-46 item 2).
   - **How B's line reaches the session log.**
     - B's page-end line is written by `run_end` through its `log` closure (`frontends/shell/src-tauri/src/page.rs`, lines 508-513 at 97e2156d).
     - `lib.rs` builds that closure: `try_state::<SessionLog>()`, then `SessionLog::append` (`frontends/shell/src-tauri/src/lib.rs`, lines 224-228 at 97e2156d).
     - `SessionLog` is always managed (`lib.rs`, line 529 at 97e2156d; without it the app refuses to start, lines 393-398).
   - **Why the write is not in `commands.rs`.** K-4 (`frontends/shell/src-tauri/src/commands.rs`, lines 879-918 at 97e2156d) fails on any product line of `commands.rs` that contains `.append(`. Its doc puts the host's own lines in `lib.rs` and `pool_poll.rs`, outside its reach by design (lines 868-870). So the write is placed in `lib.rs`, next to the write behind B's line.
   - **`lib.rs`** gains `pub(crate) fn write_host_line(app: &tauri::AppHandle, level: &str, message: &str)`. Its body is the page-end closure's two calls:
     - `if let Some(session_log) = app.try_state::<SessionLog>() {`
     - `session_log.append(level, message);`
     - `}`
   - **`commands.rs`** gains two functions.
     - `pub(crate) fn discard_and_log(recorder: &StepRecorder, request: <Part 1's discard request type>, log: &dyn Fn(&str, &str))`. It returns the recorder entry point's own result unchanged. Its body, line for line:
       - `let kind = discarded_kind(&request.record);` (the record member read as `&str`; an accessor is added only if the member's type needs one);
       - `let reply = recorder.discard_recoverable(request);` (the recorder's entry point of §2.3, by its built name);
       - `if reply.is_ok() {`
       - `log("info", &format!("recovery-discarded kind={kind}"));`
       - `}`
       - `reply`
     - `fn discarded_kind(record: &str) -> &'static str`. Its body:
       - `if record.starts_with("unsaved-") {`
       - `"unsaved"`
       - `} else {`
       - `"project"`
       - `}`
   - **The command.**
     - Part 1's `#[tauri::command] discard_recoverable` takes `app: tauri::AppHandle`.
     - It refuses a missing recorder before any call, as `record_step` does (`commands.rs`, lines 195-199 at 97e2156d).
     - On `spawn_blocking` it runs `discard_and_log`, with a closure that calls `crate::write_host_line(&app, level, message)`.
     - It makes no `Pages` call (§8 item 16).
   - **The line.**
     - The message is `recovery-discarded kind=unsaved` or `recovery-discarded kind=project`, at level `info`, as the page-end line's level is (`page.rs`, line 509 at 97e2156d). `SessionLog::append` writes it after its millisecond stamp.
     - It carries no record name, no path and no project identity.
     - It is written only on the kernel's `Ok`, which comes after the removals of the form's step 4 (Amendment 4 item 5's text for `discard_recoverable`). A refused discard writes none.
   - **Doc comment.** The module's doc in `commands.rs` (lines 16-20 at 97e2156d, which Amendment 17 item 2 already edits) gains a clause: `discard_recoverable` also writes the binding's `recovery-discarded` line through `write_host_line`, in `lib.rs`.

3. **The refusal lines, from where the shell calls each command** (ADV-2026-11-27-46 item 3). Both are in `RecoveryOffer.tsx` (§2.7). Each catch has, in order, the three lines of `admitProject` (`frontends/shell/src/project/openProject.ts`, lines 80-82 at 97e2156d), with its own level.
   - **`export async function admitRecovered(record, cancelKey, dataset)`.**
     - It is Recover's `admit`, run through `runAdmitPath`, as `admitProject` is (`frontends/shell/src/admission/AdmissionPanel.tsx`, line 487 at 97e2156d).
     - Its catch:
       - `if (!(e instanceof SkpCallError)) throw e;`
       - `const refusal = shownRefusal(formatRefusal(e.skpError));`
       - ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``
     - It then returns the refused outcome.
   - **`export async function discardEntry(record)`.**
     - The Discard click calls it.
     - Its try calls the discard wrapper and returns `null`.
     - Its catch is the same three lines with ``logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);``, and it returns the refusal.
   - **What the lines carry.** Each carries the code and the bounded message, as `reopen-refused` does. A recover or a discard that succeeds writes no line of this kind.

4. **Tests**, added after T-4's row in §4.
   - **Red at the base:** the functions do not exist at 97e2156d, so T-6 and T-7 do not build, and S-9 and S-10 fail at their import.
   - **Known pass cases:** none.
   - Each mutation is applied, run, recorded by name with its commit, and reverted, at Part 1's head.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| T-6 | `a_discard_that_removed_a_record_writes_one_session_log_line_naming_only_its_kind` (`page.rs`'s `mod tests`). On the rig with its `recorder` (Amendment 17 item 3), a crashed `unsaved-` record is made as Amendment 17 item 3's common part makes it. Its name is the one `unsaved-` entry of the rig's sessions folder. `crate::commands::discard_and_log` is called with `&*rig.recording_log()` (`page.rs`, lines 757-765 at 97e2156d). It asserts: the reply is `Ok` and the folder is gone; `rig.seen.lines()` is exactly `["info recovery-discarded kind=unsaved"]`; that line contains neither the record name, nor its 32-hex part, nor the sessions folder's path; a second discard of the name is `Err`, and the lines are still one | in `discard_and_log`, Old `if reply.is_ok() {`, New `if reply.is_err() {` | T-6, at its line-equality assertion |
| T-7 | `the_discarded_kind_is_unsaved_for_an_unsaved_name_and_project_for_any_other` (`commands.rs`'s `mod tests`). `super::discarded_kind` of `unsaved-` followed by 32 `0` is `unsaved`; of 32 `0` it is `project` | in `discarded_kind`, Old `if record.starts_with("unsaved-") {`, New `if !record.starts_with("unsaved-") {` | T-7, at its first assertion; T-6 |
| S-9 | `a_refused_recover_logs_one_line_with_its_code_and_bounded_message_and_one_that_succeeds_logs_none` (`RecoveryOffer.test.tsx`). `../skp/client` and `../diagnostics/log` are mocked as `frontends/shell/src/project/openProject.test.ts` mocks them (lines 20-42 at 97e2156d); `formatRefusal` and `shownRefusal` are real. The recover wrapper throws `skp.recoverable_record_locked` with a message holding U+202E: the outcome is `refused`, and the logs are `[{level: "recover-refused", message: "skp.recoverable_record_locked: " + shownText(message)}]`. Then, reset, the wrapper resolves an `opened` reply and describe resolves: the outcome is not `refused`, and the logs are `[]` | Old ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``, New ``logSessionEvent("recover-refused", `${e.skpError.code}: ${e.skpError.message}`);`` | S-9, at its logs equality |
| S-10 | `a_refused_discard_logs_one_line_with_its_code_and_message_and_one_that_succeeds_logs_none` (`RecoveryOffer.test.tsx`, the same mocks). The discard wrapper throws `skp.recoverable_record_unknown` with message `m`: the refusal is returned, and the logs are `[{level: "discard-refused", message: "skp.recoverable_record_unknown: m"}]`. Then, reset, the wrapper resolves `{}`: `null` is returned, and the logs are `[]` | Old ``logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);``, New: the line removed | S-10, at its logs equality |

   - Each Old text stands once in its file, in the function named. Leading whitespace is not part of an Old text.
   - No test row asserts the `write_host_line` link to the real file. B's page-end closure has no such row either (`page.rs`'s tests capture through `recording_log`).
   - E-RECOVER gains no step.

5. **The budget** (ADV-2026-11-27-46 item 4; ADV-2026-11-27-38 item 2). These are the groups of Amendment 17 item 6, at place (a).

| Group | Part 1 (Amendment 17) | Part 1 now | Together now |
|---|---|---|---|
| src-tauri (`commands.rs` about 42 with T-7, `lib.rs` about 9, `page.rs` tests about 38) | 340 | 430 | 430 |
| shell product (`RecoveryOffer.tsx`) | 500 | 520 | 520 |
| shell tests (`RecoveryOffer.test.tsx`) | 500 | 540 | 540 |
| **Total** | **≤ 5,025, ≤ 47 files** | **≤ 5,175, ≤ 47 files** | **≤ 6,035; 50 files in the union** |

   - The whole passes 6,000 by about 35 lines. By ADV-2026-11-27-46 item 4 this goes to the advisor before Part 1's code. Nothing is shrunk here.
   - No file is added.

6. **Additions to the form's sections** (read with the sections named):
   - **§1, May claim:** a discard that removed a record leaves one session-log line naming only its kind (T-6, T-7); a refused recover or discard leaves one line with its code and bounded message, and a successful one leaves none (S-9, S-10).
   - **§2.9, Seams:** the managed `SessionLog` → `write_host_line` → `discard_and_log` → `discard_recoverable`; `logSessionEvent` → `admitRecovered` and `discardEntry`.
   - **§5, Declared unchanged:** K-4 and its text; `state.rs`; `openProject.ts`; `admitDataset.ts`.
   - **§5, Invalidators:** **I12**, a stop: the discard line needs an edit of K-4 or of `state.rs`, a write through `append_redacted`, or a call of `append` in `commands.rs`'s product lines. This goes to the advisor (ADV-2026-11-27-46 item 2).
   - **§8, item 18:** a `recovery-discarded` line that carries a record name, a path or a project identity, or that is written on a refused discard; or a `recover-refused` or `discard-refused` line written on a success.
   - **Amendment 10 item 2:**
     - Tests gain T-6, T-7, S-9 and S-10.
     - Callers: `discard_recoverable`'s chain gains `discard_and_log` and `write_host_line`, each with its product caller in Part 1.
   - **§2.12, after D23:** | D24 | rule | (none) | the binding's `recovery-discarded` line, and the `recover-refused` and `discard-refused` lines from `RecoveryOffer.tsx` (items 2 and 3); T-6, T-7, S-9 and S-10 | ADV-2026-11-27-46 items 2 to 4 |

7. **Shared paths** (§2.11's table, as N-7 revises it; Amendment 17 item 7), named and not ruled:
   - `commands.rs` (PR 356);
   - `page.rs` (the reload piece).
   - `lib.rs`, `RecoveryOffer.tsx` and `RecoveryOffer.test.tsx` are not named in that list.

8. **Named, not changed:**
   - **(a)** `admitRecovered`'s catch also covers the `describe` that follows an `opened` reply, as `admitProject`'s does. So a refused `describe` after a recover writes `recover-refused` with that refusal's code.
   - **(b)** An `engine.cancelled` refusal (at the gate, or at a page end) writes `recover-refused`, as `reopen-refused` is written for one.
   - **(c)** The two refusal lines carry the kernel's message, bounded. Whether the four new codes' messages name the record is §2.4's and the build's, and is not ruled here.
   - **(d)** The `info` level of the discard line is the drafter's, after the page-end line.

9. **For the custodian:**
   - (i) The whole at about 6,035 lines (item 5), which goes to the advisor before code.
   - (ii) Whether the writer in `lib.rs`, which K-4 makes necessary, is "as the page-end line of B does" in ADV-2026-11-27-46 item 2. If it is not, that item sends the case to the advisor before code.

Read the last amendment first.

Nothing above is edited.
````

## Files read (all read only)

- D:/wt/read-1128a/kernel/README.md (its owner's index)
- D:/wt/read-1128a/engine/README.md (only the line of its owner's-index heading, by Grep)
- D:/wt/read-1128a/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (lines 1-384, 600-699, 730-789, 1079-1103 and 1988-2387, then Amendments 17 to 19 whole, plus Greps)
- D:/wt/read-1128a/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md
- D:/wt/read-1128a/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-38-the-recovery-offers-posture-answer-to-the-human-the-overrun-accepted-the-whole-at-most-6000-not-class-8-the-open-left-on-a-refusal-closed-by-the-kernel.md
- D:/wt/read-1128a/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-41-adr-037-amendment-1-accepted-in-the-architects-words-with-two-changes-the-catalog-miss-needs-no-test-row-place-b-accepted-beforehand.md
- D:/wt/read-1128a/state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-8.md
- D:/wt/recov/frontends/shell/src-tauri/src/commands.rs (lines 1-420 and 700-920)
- D:/wt/recov/frontends/shell/src-tauri/src/state.rs
- D:/wt/recov/frontends/shell/src-tauri/src/page.rs (lines 1-560 and 600-929)
- D:/wt/recov/frontends/shell/src-tauri/src/lib.rs (lines 190-249 and 385-654)
- D:/wt/recov/frontends/shell/src/project/openProject.ts
- D:/wt/recov/frontends/shell/src/project/openProject.test.ts (lines 1-230)
- D:/wt/recov/frontends/shell/src/admission/admitDataset.ts
- D:/wt/recov/frontends/shell/src/diagnostics/log.ts
- By Grep or Glob only: D:/wt/recov/frontends/shell/src (the `logSessionEvent` calls), frontends/shell/src/admission/AdmissionPanel.tsx (`runAdmitPath` and its `admit`), frontends/shell/src/project (no `Recovery*` file at the base), frontends/shell (no recovery command names at the base), and src-tauri/src (session-log uses).

The ADV-2026-11-27-37 ruling was not opened. Its items are cited only as Amendment 17 cites them.
