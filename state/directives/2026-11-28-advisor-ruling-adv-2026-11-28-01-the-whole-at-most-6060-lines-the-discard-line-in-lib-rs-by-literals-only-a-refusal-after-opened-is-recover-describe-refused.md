# The advisor's ruling ADV-2026-11-28-01, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's Amendment 20 in lead-data's draft: Part 1 at most 5,200 lines and the whole at most 6,060 (class 9); the discard's line written in `lib.rs` by a writer that takes only literals of the crate; its item 8 (b) to (d) stand; a refusal after an `opened` reply written `recover-describe-refused`, with a third case of S-9 and a mutation; Amendment 20 appended as drafted, then the custodian's, with no further form gate

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-01.md in the advisory folder, 6200 bytes, sha256 b6e89fd4b59fa98bba5c9b52acf4d13568cf4aee35a70e72fc28ee5df8c285ed, UTF-8, last modified at 2026-11-28T01:20:50Z by the file system. It was named by a session message received before 2026-11-28T01:30:37Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-01, to the custodian, 2026-11-28 (01:21Z). The recovery offer's Amendment 20 in lead-data's draft: the whole past 6,000 lines, where the discard's line is written, and one of the four things the draft names and does not change. It answers your message of 01:13Z.

Read by me: on main at 4e7f48ad, the draft whole (`state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-amendment-20-lead-data-draft.md`). At the recovery base 97e2156d: `frontends/shell/src-tauri/src/state.rs` whole; in `commands.rs` the module's doc, `record_step`, `binding_log_session_event` and K-4 with its doc; in `lib.rs` the page-end closure and every call of `append`; in `page.rs` `LogFn`, the page-end line and the rig's `recording_log`; `frontends/shell/src/project/openProject.ts` whole. Not read: the form's §2.7 and §2.11, its Amendment 19, `openProject.test.ts`. `RecoveryOffer.tsx` does not exist yet.

1. **The whole: your (a), with a figure that also holds item 4 here.**
   - Part 1 is at most 5,200 lines and the whole at most 6,060, in place of 6,000. Part 2 stays at most 860. The files stay at most 47 in Part 1 and 50 in the union.
   - The added room is for the lines of ADV-2026-11-27-46 items 2 to 4 and of item 4 here, and for nothing else.
   - It is class 9 on this ruling and not class 8, because it is declared before the code. It replaces the figure in ADV-2026-11-27-38 item 2 and the last sentence of ADV-2026-11-27-46 item 4.
   - Where the form, or the gate's N-45 row, gives 6,000 for the merge check's count, your amendment names 6,060. At the merge check I count the whole against 6,060 lines and 50 files.

2. **Where the discard's line is written: yes, in `lib.rs`, as drafted, with one change.**
   - Your reading is mine. `lib.rs` is the binding, the write uses the same managed state and the same call as the page-end line, and K-4 stays as it is.
   - **The change: the writer takes no text that was built at run time.**
     - As drafted, `write_host_line` is a function the whole crate can call with any text, and it writes without the redaction.
     - K-4 shows that no product line of `commands.rs` calls `append`. As I read it, that is so that a command's text reaches the log only through the redaction. K-4 cannot see a call of `write_host_line`.
   - So:
     - `write_host_line` takes `level: &'static str` and `message: &'static str`.
     - `discard_and_log`'s `log` parameter is `&dyn Fn(&'static str, &'static str)`.
     - The line's two forms are two literals, and no `format!` builds the line. The draft's `discarded_kind` becomes `discarded_line(record: &str) -> &'static str`. It gives `"recovery-discarded kind=unsaved"` for a name that begins `unsaved-`, and `"recovery-discarded kind=project"` otherwise. `discard_and_log` passes that to `log` with `"info"`, on the kernel's `Ok` only, as drafted.
     - T-7 keeps its name. It calls `discarded_line` and expects the two lines. T-6, M-T6 and M-T7 stand as drafted, M-T7 in the renamed function. If the rig's capture does not coerce to the parameter's type, T-6 passes a closure that calls it. `Rig` and `LogFn` are not changed.
   - **`write_host_line`'s doc comment says what may reach it:** the host's own lines, each a literal of this crate, and no text of a request, a reply or a file. The words are the worker's. The page's lines keep their one way in, `binding_log_session_event`.
   - **I12 gains one case, a stop that comes to me:** a `level` or `message` reaching `write_host_line` that is not a string literal of this crate, a leaked `String` among them. §8 item 18 gains the same case.
   - Both gates of Part 1 say, with the posture check, whether any text of the page can reach the session log through the new writer.
   - If the `'static` types cannot be built as ruled, that comes to me before any other way is taken.

3. **Three of the four things the draft names and does not change stand:** its item 8 (b), (c) and (d). The `info` level is accepted.

4. **Item 8 (a) changes: a refusal that arrives after the recover answered `opened` is not written as `recover-refused`.** Class 9 on this ruling, in Part 1.
   - As drafted, `admitRecovered`'s one catch writes `recover-refused` also when the recover completed and the `describe` after it was refused. By the form's steps 5 and 6 the kernel has by then cut the record and adopted it into this run. The line would say of a completed recover that it was refused. My ADV-2026-11-27-46 item 3 says that a recover that succeeds writes no line of that kind.
   - So `admitRecovered` writes `recover-refused` only for a refusal of the recover call itself. For a refusal that arrives after an `opened` reply it writes `recover-describe-refused`, with the code and the bounded message in the same form.
   - S-9 gains a third case: the wrapper resolves `opened`, and `describe` throws a typed refusal. The logs then equal one `recover-describe-refused` line with that code and bounded message.
   - One mutation makes that case fail at its equality: the level written there is replaced by `"recover-refused"`. Lead-data words the row.
   - **For the gates, not for this amendment.**
     - If `admitRecovered` uses `describeOpened` as `admitProject` does, the page closes the open after such a failure. By ADR-037's Amendment 1 the record then stays with this run, and a normal end clears it.
     - Part 1's architect gate says whether that is so in the code. Part 2's gates say what the user is told then.
     - If the changes the user asked to recover are cleared at the app's normal end with no word to the user, that comes to me before Part 2's words are committed. It joins the reload case of ADV-2026-11-27-41 item 6.

5. **How it is filed.** Amendment 20 is appended as lead-data drafted it. An amendment of yours after it carries items 1, 2 and 4 here, with lead-data's row for item 4's case and mutation. No further form-gate attempt is asked (ADV-2026-11-27-46 item 5). Part 1's code then waits only for room on D: (ADV-2026-11-27-40 item 4).

6. Nothing here is reserved. No dependency, capability or wire item changes. Nothing for the human's digest beyond a line.
