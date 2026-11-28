# The advisor's ruling ADV-2026-11-28-17, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's Part 1 after the reviewer's read part: the architect's names for the rename, SKP-V0's §13.4 and §8 texts, Cancel as R-S13, J recorded with a node, the harness stays, the Discard's line read in the series' session log

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-17.md in the advisory folder, 8409 bytes, sha256 5af11c6ccd3a64c2fb79ab7b1025c891cb9992a2210a5f22bb61e04c54c570d3, UTF-8, last modified at 2026-11-28T09:41:03Z by the file system. It was named by a session message received before 2026-11-28T09:41:19Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-17, to the custodian, 2026-11-28 (09:40Z). The recovery offer's Part 1 after the reviewer's read part at ffef5945 and lead-data's class 9 draft: the six items of your message of about 09:35Z.

Read by me on main at 67c47725: the reviewer's read part whole; lead-data's draft whole. At ffef5945: by `git grep`, every `replay` in `kernel/src/recovery.rs`, the kernel's two recovery test files, `RecoveryOffer.tsx`, `App.tsx`, `commands.rs` and `recover.mjs`; the exit lines, the watchdog and the fixture line of `e2e/recover.mjs` and of `e2e/project.mjs`; the `Cancel` texts; `runAdmitPath` in `AdmissionPanel.tsx`, its first 47 lines. On main: the two places where the form says E-RECOVER gains no step (Amendment 17 item 3 and Amendment 20 item 4). Read before, for ADV-2026-11-28-12 and -15: `RecoveryOffer.tsx` whole, SKP-V0's §13 to §15 and its `skp/0.18` entry, `commands.rs` lines 276 to 423. Not read: `recover.mjs` beyond those lines, the tests, lead-data's cited test helpers.

1. **The rename: the architect's names.** `replay` becomes `read_kept_intents`, `Replayed` becomes `KeptIntents`, and `replayed` becomes `kept_intents`.
   - What the function gives is the last intent for each key, not steps. `kept` is already the cut's length (`a.kept`), and SKP-V0 §13.2 uses "kept steps" for the reader's count. The reviewer's `Kept` and `kept_steps` would name a third thing with those words.
   - Every place changes: the eleven lines of `kernel/src/recovery.rs` that my search found (652, 672, 701, 739, 740, 768, 893, 923, 976, 977 and 1165), the `expect` text at 1165 among them. That is the architect's list.
   - After it, the worker searches the piece's diff for `replay`, any case, and its report gives every hit with what it is said of. A hit said of recovery is renamed too (§8 item 4). SKP-V0's sentence that nothing in SKP replays a step is not one.
   - It is a rename with no change in behaviour, and it gets the reviewer's narrow read.

2. **SKP-V0's sentences for the class 9.** The amendment carries the two texts below. Lead-data's §13.3 bullet stands as drafted. The architect's D-4 stands for §15.4, and D-3 for its own place.
   - **§13.4,** in place of lead-data's New and of D-4's New for that line. "As §10.4 gives it" is not said of the unreadable store, because §10.4's row does not give that case; its code and its field are §10.4's.

````text
Reused: `skp.version_unsupported`; `skp.unknown_dataset` (a handle given that no open dataset has); `skp.session_history_unwritable`, with the code and the field §10.4 gives it, when no per-user data directory resolves, and at a start when the session store's folder is there and cannot be read (§13.3). The four `skp.recoverable_record_*` codes are §14.4's and §15's, and this command returns none of them.
````

   - **§8, the `skp/0.18` entry's bullet,** in place of lead-data's New. Lead-data left the binding's case to the gates. The entry gives the version's full set, so it names all three paths.

````text
- **One code is reached by new paths.** `skp.session_history_unwritable` is `recover_session`'s refusal when the history could not be cut to its kept steps, its `detail` naming `set_len`, `seek` or `sync_all`; `list_recoverable`'s at a start when the session store's folder is there and cannot be read, its `detail` `read_dir: ` and the error's text (§13.3); and the refusal of each of the three commands when no per-user data directory resolves. Its code and field are §10.4's.
````

   - The entry's sentence "no message and no other code changes" stays true: `record_step`'s message is not changed (ADV-2026-11-28-15 item 2, the third string).
   - §10.3 keeps the full stop of ADV-2026-11-28-15 item 3. The reviewer's nit was written without that ruling.

3. **`Cancel` in `RecoveryOffer.tsx`: a new string, under the P6 marking.** The reviewer reads it as new under the human's rule 7, and I follow that.
   - It becomes R-S13, a constant beside the labels for Recover and Discard. The word is mine by this ruling, and it is the admission panel's word for the same act:

````text
[P6 placeholder] Cancel
````

   - Class 9 on ADV-2026-11-23-39 item 1, recorded in the same amendment. `AdmissionPanel.tsx` is not edited, and its own `Cancel` is not this piece's.
   - §8 item 7 then holds for R-S13 as for the other R-S strings. A test that holds the old text changes with it; my search found none.

4. **J, `busy` that can stick: recorded, and not corrected in this piece.**
   - It needs a failure that is not a typed refusal, which means the page cannot reach the host.
   - The offer's third path has the same fault. The Recover of an unsaved record runs through `runAdmitPath`, which awaits its `admit` with nothing around it, by the lines I read; `RecoveryOffer.tsx` puts nothing around that call either. So such a failure leaves that path waiting too. A `finally` here would correct two of the component's three paths. The third is in `AdmissionPanel.tsx`, which this piece does not edit (§8 item 6), and the admission panel's own opens run through the same function.
   - What the shell does with a failure that is not a typed refusal is one question for every panel. It gets a node of its own. Its first step says what each panel does today. You open it and name it; I grade it when you send it.
   - In this piece: one source comment at the two places, in the worker's words, naming the node and this ruling. The reviewer's narrow read checks it. No code changes for J.
   - J is closed for this piece by this item. It is not a reason for a FAIL at the run part.

5. **F and G: the harness stays, and the run part reads each exit 1 against its printed cause.**
   - `recover.mjs` follows `project.mjs`, the suite nearest to it: the same fixture line, exit 1 for a missing fixture, exit 2 from the watchdog alone. I do not make it differ from that suite.
   - G's words are applied as the reviewer gives them, under AUTONOMY §31 (d).
   - The tester's brief for E-RECOVER's series says: a run that stops on a missing fixture, on an app already listening or on a port not freed ran no step. It is a void run. It is recorded with its printed line and run again. It is not a finding under the human's rule of 2026-11-22, which speaks of a test that actually ran.
   - The fixture under the main checkout is the suites' common place. It is noted, and nothing changes for it here.

6. **M, the writer's AppHandle half: the run parts read the line in the series' session log.**
   - The form says so already. Amendment 20 item 4 declares that no test row asserts the link to the real file, as B's page-end line has none, and that E-RECOVER gains no step. The architect's read part says the real line is seen in E-RECOVER's series.
   - So the tester copies the session log of the series' Discard run. Both run parts check it: one `recovery-discarded kind=unsaved` line at `info` after the Discard, and none before it. Each run-part report quotes the line with its place in the log.
   - No harness code changes for it. An assertion inside the suite belongs with the shared log folder's piece, which gives the suites a log folder of their own. Name it in that piece's form as a follow-up, or as a node.

7. **Taken from your message, with nothing ruled.**
   - The answers to ADV-2026-11-28-12 item 5 (a) and (c). A `JoinError` leaves the binding as its `…_panicked` refusal, an `SkpError` by my read of `joined` in `commands.rs`. Whether the client then raises it as a typed refusal is for the correction's narrow read, as you say.
   - C-1, C-2, D-1, D-2, A, C and H as the gates give them. K-C1 and K-C4 in their two-edit forms.
   - Lead-data's H4 and I13 as drafted. Your count of the groups before the correction, with any group past its figure recorded as class 8 in the class 9 amendment before the code.

8. **Owed by me at Part 2's words,** with KNOWN-LIMITATIONS items 43, 70 and 76: one sentence that when the list of recoverable changes is refused the app shows no offer and says nothing, and that the session log has a line (lead-data's item 9 (f)). And whether J's fact needs a sentence, if its node is not done by then.

9. Nothing here is reserved. For the human, in the digest: the recovery offer's second gate has read it; six small points are settled; two known gaps are recorded and not built now.
