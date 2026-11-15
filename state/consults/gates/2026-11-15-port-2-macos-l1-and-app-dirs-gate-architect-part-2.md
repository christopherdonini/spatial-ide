Reviewed: PR #324 at 45a945f80aef8a3193b75a4f41b94f9737f66516 (the custodian's filing note, 2026-11-15: the gate, the architect, at N, the second part of its gate (ADV-2026-11-15-12 item 5 (c); `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-12-open-43c-d-item-43s-first-source-comment-gains-two-passages-on-the-reviewers-sentences-the-other-words-stand.md`), its first part `state/consults/gates/2026-11-15-port-2-macos-l1-and-app-dirs-gate-architect.md`, together the gate's attempt 1, gate-log row 759, which stands, with no new row, since item 5 (c) asks for a re-read at the final head and not a new attempt; under the form `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, its section 9 and Amendments 9 and 10, PLAN node port-2-macos-l1-and-app-dirs; its message sent at 2026-11-15T11:27:04Z by the custodian's transcript to the same run, whose resumed prompt at 2026-11-15T11:27:18Z holds it byte for byte (3548 bytes, sha256 4ce8cf850f8c1125c15e722467b9e999fdc2f7a74d1ef554b900bbfff5b2a0b5); this part 2026-11-15T11:27:18Z to 2026-11-15T11:28:09Z by its transcript, 10 calls (Read 6, Grep 3, SubagentHandback 1), none errored by the transcript, no file written, and, as it says, it has no shell and gives no hash of its own, model claude-opus-5-5; received at 2026-11-15T11:28:09Z by the custodian's transcript; below, the hand-back byte for byte (5054 bytes, sha256 a18b17fb5837cc567827b900e451a7c0d9f157c862122c5e221aeb00ccbf06b1), with this note in its first line. Nothing else is changed.), gate architect at N, the second part of its gate
Verdict: PASS WITH NOTES

Nothing I read at N changes the first part's verdict. No clause of either passage in the ruling is untrue, so nothing goes back to the advisor under item 5 (c).

## The four checks

**1. Item 43, read whole** (`KNOWN-LIMITATIONS.md:436-438` at N).
- **Line 436, the item's own line:** unchanged from C. In the custodian's diff it is a context line. Its data-folder clause is still W3 byte for byte. I compared it with the form's §10 W3 block, as in the first part.
- **Line 438, the second comment:** unchanged; also a context line.
- **Line 437, the first comment:** it changes only by the ruling's two passages:
  - the first passage sits after "as the comment below says." and before "Where the code does this: the kernel's session_history module", with one space on each side;
  - the second passage sits after "clears it on the normal exit event." and before " -->".
  - Each passage reads character for character as the ruling's fenced blocks (items 2 and 3).
  - I have no shell, so the byte count and sha256 in item 5 (b) are not recomputed here. That comparison is the merge check's.

**2. The first passage**, clause by clause.
- **"its data-folder clause, the one naming the folder on Windows, macOS and Linux"**: holds. It is the span of line 436 from "on Windows under" to "set to an absolute path.", which is W3. That is §10 W3 of the form at lines 370-376, on main.
- **"is the architect's wording"**: holds. The form says at line 12 that the architect drafted it, and W3's text is the architect's.
- **"which the human approved on 2026-10-23 (…W3; … item 4)"**: holds. In the cited directive, line 11 (item 4) reads, byte-copied: "W3: yes to the architect's words for item 43."
- **"it replaces the clause first approved as drafted"**: holds.
  - The replaced clause is the removed text in the first part's diff, byte-copied: "on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS and Linux under `~/.local/share/spatial-ide/sessions` unless `XDG_DATA_HOME` is set."
  - That clause was part of the item that the comment's opening records as "Approved as drafted by the human (kernel/B2-1B-RECORDING-PREREGISTRATION.md, Amendment 1, item 1)".
  - Main's line still carried it (Amendment 6 item 2).

**3. The second passage**, clause by clause against the code at N.
- **"a LOCALAPPDATA (Windows) or HOME (macOS, and Linux when XDG_DATA_HOME is not set to an absolute path) that is unset, empty or not an absolute path"**: holds.
  - `absolute_value` (`engine/src/app_dirs.rs:70-77`) returns `None` for a value that is unset (`var(name)?`), empty, or not absolute.
  - `data_dir_for` (`engine/src/app_dirs.rs:80-88`) reads `LOCALAPPDATA` on Windows (:82) and `HOME` on macOS (:83). On other Unix it reads `XDG_DATA_HOME` and then `HOME` (:84-85).
- **"then no data folder resolves"**: holds. `default_root` (`kernel/src/session_history.rs:248-249`) is `data_dir().map(…)`, so it gives `None`.
- **"nothing is kept"**: holds. The recorder is built only from `default_root().map(…)` (`frontends/shell/src-tauri/src/lib.rs:454`), so it is `None`.
- **"each step is refused by name"**: holds. `record_step` (`frontends/shell/src-tauri/src/commands.rs:144-147`) returns `SkpError::session_history_unwritable("no per-user data directory is available")` on every call when the recorder is `None`.
- **"Ordinary use does not reach it, because the system sets both"**: this is a fact about the platforms, not about the code. Nothing at N contradicts it, and W3 named it for this comment.
- **"Where the code does this: …"**: holds. Each named file holds the named function or construction, at the lines given above.

**4. The rest of the diff** (`<S>/c324-diff.patch`): six files, the same six the worker's numstat lists, and exactly nine changes:
- item 43's first comment: the ruling's items 2 and 3;
- item 1's source comment: my D8, byte-identical;
- the `app_dirs.rs` module doc's "three variables": D2;
- the `user_data_dir` doc: D3, byte-identical;
- M3's comment: D6;
- the `data_dir` doc in `log.rs`: D4, byte-identical;
- the Location row in `kernel/PERMISSION-BOUNDARY.md`: D5, byte-identical;
- the module doc of `kernel/tests/app_data_dir_resolution.rs`: D7, byte-identical;
- K1's RECORDED MUTATION comment: the reviewer's D1, as Amendment 9 item 3 says. This was read as applied and not re-gated (AUTONOMY §31 (d)).

The diff holds nothing else.

## Findings
- **Correctness:** none.
- **Evidence:** none blocking. The first part's conditions still stand at N:
  - E1 and E2 read at N by run id;
  - §7 recounted at N and recorded as class 8;
  - checks 3 to 9 at N, which the worker did not run because its own timeout stopped it at check 3. The custodian runs them.
- **Documentation:** none new. D9 and D11 are still owed in the closing amendment, as Amendment 9 item 4 records.
- **Observation:** none new.

## Calls in this part
Read 6, Grep 3, SubagentHandback 1.
