Reviewed: PR #318 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6 (the custodian's filing note, 2026-11-14: the gate, the architect, at C4, the second part of its C3 gate (ADV-2026-11-14-20 item 8; ADV-2026-11-14-19 item 5 (e)), its first part `state/consults/gates/2026-11-14-second-open-history-before-1c-step-3-c3-gate-architect.md`, together this gate's attempt 2 in the gate log, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its message sent at 2026-11-14T18:28:06Z to the same run, whose resumed prompt at 2026-11-14T18:28:24Z holds it byte for byte (4026 bytes, sha256 daaa0aee64ecd98733931b9e941e12041a1b5eff5080f9643f7a5fed8490cfbb), naming the files <S>/adv-2026-11-14-19.copy.md (10756 bytes, sha256 54962341337e3c408e2f1dfa137e49a516d1dc4d5ec87381b59dc120270c324a), <S>/adv-2026-11-14-20.copy.md (12317 bytes, sha256 8b0bc0380fb64c66b4d3e88ffb22d7195cc5cea76aa9e67e3710537054ebdeda), <S>/so-318-c4-diff.patch (14545 bytes, sha256 279084da5cd75da20db6f24e7ae53a96032c0163345d9cce0e4bcce63d9a7d08), <S>/chk-318-c4.mjs (5873 bytes, sha256 91b40199b2e539e124434cccc86de00ee1fae3fc1860b69c65817ac1f5dc562d), <S>/chk-318-c4.out (955 bytes, sha256 03ceba8c59f2b69e03b0a180c31e3db2c7c7202b74223a7ce746ff0083cd71c5), <S>/rep-soc4-c4.md (5482 bytes, sha256 291199538adf979ccdcf98ddd8ac4d38513734840bbec0592361d13538d66dc8); this part 2026-11-14T18:28:24Z to 2026-11-14T18:30:12Z by its transcript, 16 calls (Read 14, Grep 1, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; it has no shell, and each claim rests on its reads and the custodian's script output; its count for both parts, 61, is the transcript's, which has Grep 21 where it says 20; below, the hand-back byte for byte (with one final newline, 8626 bytes, sha256 142dc145f0698b5e53ceaf1a2c9cb59acf6d35ffdae6606eb501d443f3a2c09a). Nothing is changed. Its verdict is the gate's, both parts together; its D-1 goes to the closing amendment, for lead-data's update after the merge (ADV-2026-11-14-19 item 6).)

Reviewed: PR #318 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, gate architect at C4, the second part of the C3 gate
Verdict: PASS WITH NOTES

C4 makes Amendment 2 of ADR-036 and item 43's second comment match ADV-2026-11-14-20 exactly. I read every clause I checked as true, so nothing goes back to the advisor under item 10. My C-1 from C3 is closed by check (b) below. My D-1 is closed for the merge by ADV-2026-11-14-19 item 6 (see D-1 below).

How I read: in `C:/dev/wt/so`. The branch ref `.git/refs/heads/cut/second-open-history-before-1c-step-3` reads c8f8bdca. I have no shell, so I ran nothing; the script results below are from the custodian's output file. Line cites are at C4. Text in quotation marks is byte-copied from the file named; anything else is my paraphrase.

## Findings

### Correctness
None. C-1 (C3) is closed by check (b): the topic 4 sentence it named is replaced, and each clause of the new words holds.

### Evidence
None. C4 changes only `.md` files (check (d)), so the code is as it was at dc0bd937. I did not re-read CI; the reviewer's attempt 2 does that (ADV-2026-11-14-20 item 9 (c)).

### Documentation
- **D-1 (from C3), `kernel/README.md:395`.** Unchanged here, as ADV-2026-11-14-19 item 6 (a) rules. The closing amendment must name the "Declared limits" line, with my replacement line, for lead-data's index update (item 6 (b)). That closes it for the merge (item 6 (c)).

### Observations
- **O1. The new comment clause covers the case that matters, not every case.** The clause names a failed removal "of the old folder's files". If both file removals succeed and only `remove_dir` fails (`session_history.rs:361`), an empty old folder stays. The comment does not name that case. Nothing in the comment is untrue, and no change is asked. This closes my C3 O5: the clause ADV-2026-11-14-20 item 6 (b) added is true.
- **O2. Where the script is weaker than its header:**
  - **B** proves equality with the scratch copy of the ruling, whose integrity rests on the custodian's hash. It does not prove equality with the advisor's own file. I also compared by eye: ADR `:283-293` matches the copy's `:55-65`.
  - **E**'s header says "each symbol the three new sentences name exists". The code checks only by regex that `fn adopt_project`, `fn save` and `fn history` exist in their files. It does not check that `save` and `history` are methods of `Projects`, and it does not check `project.spatial`. I read those myself: `mod.rs:236`, `:357`, `:54`.
  - **E**'s comparison of `adopt_project`'s callers is a good proxy that topic 4's "one caller" is unchanged. Its four lines are one call (`mod.rs:361`), the definition (`session_history.rs:343`) and two doc mentions (`:137`, `kernel/tests/project_save.rs:561`).
  - **A**'s check "origin branch head is C4" reads the local origin ref, so it is only as current as the custodian's last fetch.
  - The script checks no clause. Clause checking is this gate's work.
- **O3. The worker's departure.** The custodian corrected the brief's words check. With the fence holding item 4's new spans, each of `a_new`, `b_new` and `c_new` occurs twice in the ruling, so the original check was defective, and it edited nothing on its first run. It does not touch the result: script B and C prove the bytes on their own terms.

## Checks
**(a) Amendment 2 at C4 against item 5's fence.** Holds.
- Script B: the ADR at C4 equals the ADR at dc0bd937 up to `\n## Amendment 2 — `, then the fence cut from the ruling copy (between the first `` ```text `` after "5. (c) of your message: yes." and the next fence close), with one final LF.
- The ADR before Amendment 2 equals B2's and main's (my C3 check 2).
- By eye: `:285` matches copy `:57`, and `:293` matches copy `:65`.

**(b) The three new sentences.**

The second sentence of topic 4 (`:293`), against the sources of item 1 (a):
- "step 2's reopen": options draft `:200` ("A same-run reopen (step 2)").
- "in the same run": options draft `:200`; 1c form Amendment 28 item 1 (`:1874`, "a same-run reopen").
- "of a saved project whose record this run holds": options draft `:200` and `:1874` ("a project whose record this run holds"). The word "saved" is implied: a reopen of a project is a reopen of a saved one.
- "binds the new open to the project at the reopen": option (a), `:201` ("the reopen is bound at the reopen"), and `:1874`.
- "before any step on it": not in option (a)'s words. It is the second-open form's §2.4, "Carried to step 2's form", item 1 ("The bind inside the reopen, before any step on the new handle"), and it follows from "at the reopen". It holds.
- "and continues that record": `:201` and `:1874`.
- The human's message, item 5 (a) (directive `:25`), rules "OPEN-N4: (a)" only, so the option's words in the draft are the ruling's content.

The third sentence, against the code at C4:
- "no save binds an open to a project whose record the run already holds": an open is bound only at `session_history.rs:363`, reached only while `bound` is None (`:345-347`).
- "a first save mints a new project identity": `mod.rs:251`.
- "refuses a folder that already holds `project.spatial`": `mod.rs:266-268`, with the name at `:54`.
- "a later save goes to the open's own project, found by the open's catalog name": `mod.rs:244` and `:247`.

The fourth sentence, against the code at C4:
- "A later save binds the open only if no save has bound it yet": `:345-347`.
- "which is so only after a record move that failed":
  - a later save means an earlier save completed `replace` (`mod.rs:305`) and the push (`:306-314`), then called `history` (`:316`), which calls `adopt_project` (`:361`);
  - `adopt_project` binds at `:363` unless `copy_under` returns early at `:352`, its only fallible step;
  - this matches topic 2's last sentence (`:289`).
- "until an open is bound to that project the project holds no record": a record held by `Project(P)` comes only from two places:
  - the move, which sets the holder at `:358` under the same lock (`:344`) in the call that binds at `:363`;
  - `create` at a step, whose holder is `Project(P)` only when the open is bound to P (`:144-145`, `:302`, `:313`).

Symbols at C4:
- `Projects::save`: `mod.rs:236`.
- `StepRecorder::adopt_project`: `session_history.rs:343`.
- `Projects::history`: `mod.rs:357`, called at `:316`.
- `project.spatial`: `mod.rs:54`.
- "item 2 of this amendment": ADR `:289`.

**(c) Item 6 (b)'s span against item 43's second comment.** Holds.
- `KNOWN-LIMITATIONS.md:438` at C4 carries the new span once (script C, and my read).
- "a crash between the move and the removal of the old folder, after which both folders stay": `:352` and `:526`, then the removals at `:359-361`.
- "a removal of the old folder's files that fails after the move, after which the old folder stays": each removal at `:359-361` discards its error, and a file left behind makes `remove_dir` fail (`:361`).
- "and a normal close does not remove it": `rec.dir` is already the new folder (`:353`), and `end_session` removes each record's own `dir` only (`:406-410`).
- This is outside ordinary use (an I/O failure), so naming it under §31 (c) is right.

**(d) C4 changes nothing else.** Holds.
- Script A: the parent is dc0bd937, and C4 changes only the ADR and `KNOWN-LIMITATIONS.md`.
- Script D: one-line hunks at ADR `:285` and `:293`, and at `KNOWN-LIMITATIONS.md:438`.
- Script C: item 43's line (`:436`) and its approval comment (`:437`) are unchanged.
- The patch `<S>/so-318-c4-diff.patch` agrees.
- No kernel file changed, so the item-9 pin check of C3 still holds. It must be re-shown at the final head, and the merge must be a merge commit.

**For the closing amendment, in addition to my C3 check 10:**
- Amendment 2's text is ADV-2026-11-14-17 item 7 as changed by ADV-2026-11-14-19 and ADV-2026-11-14-20.
- The text compared at the merge check is ADV-2026-11-14-20 item 5's fence (item 11).
- The PR body lists item 6 (b)'s words as §31 (d) record words.

**Calls (both parts, this run):** 61 in total.
- Read 37, Grep 20 (one timed out, a broad search with no result that I replaced with three narrower ones), Glob 1, SubagentHandback 2 (C3, and this one).
- No file was written.

**Model:** claude-opus-5-5 (Opus 5.5), as the harness reports it.

Files:
- `C:/dev/wt/so/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`
- `C:/dev/wt/so/KNOWN-LIMITATIONS.md`
- `C:/dev/wt/so/kernel/src/session_history.rs`
- `C:/dev/wt/so/kernel/src/project/mod.rs`
- `<S>/chk-318-c4.mjs`, `<S>/chk-318-c4.out`, `<S>/so-318-c4-diff.patch`, `<S>/rep-soc4-c4.md`, `<S>/adv-2026-11-14-19.copy.md`, `<S>/adv-2026-11-14-20.copy.md`
