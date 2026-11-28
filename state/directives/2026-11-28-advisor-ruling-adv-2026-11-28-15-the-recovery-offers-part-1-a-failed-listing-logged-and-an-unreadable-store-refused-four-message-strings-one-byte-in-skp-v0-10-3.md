# The advisor's ruling ADV-2026-11-28-15, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's Part 1 after the architect's read part: a failed listing logged and an unreadable store refused (class 9); four message strings; one byte in SKP-V0 §10.3

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-15.md in the advisory folder, 8005 bytes, sha256 ab55130cb74688d79ece52e7ee4564b4c026e8b699b6745fe470db09e4144ed7, UTF-8, last modified at 2026-11-28T08:02:19Z by the file system. It was named by a session message received before 2026-11-28T08:02:37Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-15, to the custodian, 2026-11-28 (08:02Z). The recovery offer's Part 1 after the architect's read part at ffef5945: a listing that fails, four message strings, and one byte in SKP-V0 §10.3. It answers the three items of your message of about 07:55Z.

Read by me. On main at 961a5ab0: the architect's report whole. At ffef5945: `kernel/src/recovery.rs` lines 88 to 122, 300 to 430, 484 to 675, 786 to 806 and 836 to 855; `protocol/skp/src/v0/error.rs` whole; `protocol/skp/SKP-V0.md` lines 1222 to 1235, 1384 to 1393 and 1530 to 1641, and its "Record only" bullet; `frontends/shell/src-tauri/src/commands.rs` lines 186 to 207 and 276 to 423; `frontends/shell/src/project/RecoveryOffer.tsx` whole (for ADV-2026-11-28-12). On main: SKP-V0's "Record only" bullet. A `git grep` at ffef5945 for the two message texts D-5 names. Not read: the tests, `page.rs`, the rest of the kernel.

1. **Item 5 (a), a listing that fails: two changes, class 9, in Part 1's correction.**
   - **(i) The shell writes a line.** When the listing asked for at mount, or at a project's open, is refused with a typed refusal, the shell writes one session-log line, `recover-list-refused`, with the bounded code and message, as it writes `recover-refused` and `discard-refused`. It shows no offer and no new text. A failure that is not a typed refusal stays as it is now.
   - **(ii) The kernel refuses when it could not look.** At a start, when the session store's folder is there and cannot be read, `list_recoverable` is refused. It no longer answers an empty list with `more` false. That reply says that no record was left out, and the kernel does not know it. The dedupe already treats the same failure as "cannot decide" (`hex_folders`).
     - The code is `skp.session_history_unwritable`, built as `cut` builds it, with `detail` `read_dir: ` and the error's text. No new code. The binding already returns this code at this command when no per-user data directory resolves.
     - The message is item 2's fourth string.
     - A folder that is not there still gives an empty list with `more` false. Nothing else of the listing changes: not `more`, not the bound, not the dedupe.
   - **Why both.** None of the refusals is ordinary use, as the architect says. But in each a user can hold records and see nothing, and today nothing says why. With (ii) alone the shell would still drop the refusal. With (i) alone the unreadable store would still answer "nothing, and nothing left out".
   - **The record.** Class 9 on ADV-2026-11-27-46 items 2 to 4 and on the form's §2.3 and §2.4. It is recorded by amendment before its code. Lead-data drafts it, as it drafted Amendment 20:
     - one kernel row with its mutation: the unreadable folder is refused, with the code, a `detail` that begins `read_dir:` and the message; the absent folder gives the empty list;
     - one shell row with its mutation: a refused listing writes the line once and shows no offer; a listing that succeeds writes none;
     - SKP-V0's sentences for it: §13.3, §13.4's reused list, the `skp/0.18` entry of §8, and §10.4's row if it needs a clause. They are read together with the architect's D-3 and D-4.
     - Each new test is committed red before its code, as §4 has it.
   - **The budget.** It stays inside Part 1's 5,200 lines and 47 files. The kernel product group is already over its ceiling (Amendment 22 item 2). Its further lines are class 8, recorded before the code this time.
   - **If the reviewer's answer to (a) names a refusal or a case that is not above, or gives another view, it comes to me before the correction is dispatched.**

2. **D-5: the message strings. Four, each under the P6 marking, each mine and none the human's.** The architect names two. I found the third reading the binding. The fourth is item 1 (ii)'s. Five fenced texts follow, in this order: the first string, one rule that goes with it, the second, the third and the fourth.

   - **First: `skp.recoverable_record_refused`** (`error.rs`, the constructor's `format!`). It is returned by a recover and by a discard, so its message names no act. It follows `project_machine_record_refused`, whose message is `{file}: {rule}`:

````text
[P6 placeholder] {record}: {file}: {rule}
````

   - **With it, one rule.** The rule then has to be a whole statement. One is not: the rule at the discard's failed removal (`recovery.rs:610`), which is the operating system's error text alone. It becomes the text below, where `{error}` is that error text. The other rules stay as they are.

````text
the file could not be removed: {error}
````

   - **Second: the cut** (`recovery.rs`, in `cut`). After `set_len` has succeeded, "could not be cut" is untrue:

````text
[P6 placeholder] the cut of the history to its kept steps did not complete, so the record was not recovered: {detail}
````

   - **Third: no per-user data directory, at the three new commands** (`commands.rs:292`, `:319`, `:392`). They call `SkpError::session_history_unwritable`, whose message says "this step could not be written and flushed to the session history". No step is written there. At these three commands the refusal is built with its own message, as `cut` builds its own, with the same code and the same `detail`. `record_step`'s refusal is not changed.

````text
[P6 placeholder] the session store cannot be used: {detail}
````

   - **Fourth: the unreadable store** (item 1 (ii)):

````text
[P6 placeholder] the session store could not be read, so no record is listed: {detail}
````

   - A test that holds an old text changes with it. My `git grep` found none for the first two.
   - The reviewer checks each of the four against the code as corrected, clause by clause, in its run part. If one does not hold, it comes to me, and a changed text gets a new id.

3. **SKP-V0 §10.3: one byte.** The semicolon before "Outside" becomes a full stop. The form's sentence stays byte for byte.
   - Old, in the "Record only" bullet: `It applies nothing and holds no workspace state; Outside §14, nothing in SKP restores a step; nothing in SKP undoes or replays one.`
   - New: `It applies nothing and holds no workspace state. Outside §14, nothing in SKP restores a step; nothing in SKP undoes or replays one.`

4. **Taken from the report, with nothing ruled.**
   - ADV-2026-11-28-01 item 4: the page closes the open, with D-2's caveat on the wait. The record stays with the run. What the user is told then is for Part 2's gates, as Amendment 21 item 6 has it.
   - ADV-2026-11-28-02 item 3: the listing that comes too early is reached only by timing inside one request round trip, and is then refused as `unknown`, never as `locked`. So it is recorded in the source comment (AUTONOMY §31 (c)), and the ADR names no residual for it.
   - ADV-2026-11-28-02 item 4: each clause of ADR-037's Amendment 1 holds against the code, by the architect. Its first edge, a recover refused as a twin: I read the row's sentence "a later listing lists its record again" as said of a record that a listing lists. A twin is never listed, so the sentence claims nothing for it. The fence stands.
   - The group figures that bind are Amendment 21's. K-C1 and K-C4 are replaced by their two-edit forms in a post-result amendment, by the architect; they are not sent to me.

5. **Not ruled, held by you for the reviewer's read part:** C-1, C-2, D-1 to D-4 and D-6. Differing words come to me (ADV-2026-11-27-10 item 2). C-2's and D-3's and D-4's words are read with item 1's SKP-V0 sentences, so that one correction carries them all.

6. Nothing here is reserved. No dependency, lockfile, workflow or mod changes, and the posture does not change: one more line is logged. For the human, in the digest: the recovery offer's first gate found no fault in its design; I had the app's log and the kernel say so when the list of recoverable changes cannot be read; four message texts were corrected because each stated something untrue in one case.
