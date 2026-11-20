*Filed by the custodian: P4a-2's worker-high, its first hand-back (claude-opus-5-5), 5497 bytes, sha256 9e03ff8c8c14c8de85a9fcde6e3ef1ee294aa01dde75ff0db560285cdbfd2f95, below the rule, byte for byte, with one final newline added. Calls Bash 49, Read 33, Grep 5, SubagentHandback 1, 3 errored, from 2026-11-20T07:14:38Z to 2026-11-20T07:23:40Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-2, worker-high

**I stopped at step 0 under stop 11. Nothing was written, committed or pushed, and no hold ran.** The answer to step 0 question 4 is yes, which is the stop your brief names. Paths below are relative to the worktree `C:/dev/wt/1c-p4a`, at base e1f21e87ea459b12a23b3a47e20dff91f9f30cb2. The kernel, renderer and protocol files cited there are the same as on main.

**Step 0's answers**
1. **The workspace apply's test file** is `frontends/shell/src/App.reopen.test.tsx`, new, beside `App.tsx`, where the reopen handler would go beside `handleAdmitted`. An existing file will not do: the `vi.mock("./skp/client", …)` factories in `App.workspace.test.tsx` and `App.save.test.tsx` have no `openProject`, and adding it would change an existing test's lines.
2. **Guidance that names the user's own assertion:** only `engine.crs_assertion_conflict` (`refusalGuidance` in `admission/formatRefusal.ts`, "The assertion you supplied was not applied…").
   - I looked at two others and left them out. The axis-order pair says "The definition does not establish…" and names no assertion of the user's. `engine.identity_ordinal_partitioned_unsupported` tells the user to declare a column; it does not name an assertion they made.
3. **The two unread facts:**
   - (a) **Yes, the grammar fixes `ProjectUri`'s length.** `FromStr for ProjectUri` in `kernel/src/project/mod.rs` accepts only `PROJECT_URI_PREFIX` ("spatial://project/") plus `PROJECT_HEX_LEN` (32) lowercase hex characters, so 50 characters. The reader's `typed` in `kernel/src/project/file.rs` parses `$.project` through it. So the `project` field in S9-other and S20 has a fixed length.
   - (b) **No, the copy's `project_file_unwritable` text does not name the folder path.**
     - The copy calls `store::replace` from `Projects::open_project` in `kernel/src/project/mod.rs`. The failure maps through `OpenFailure::ProjectFileUnwritable` to `SkpError::project_file_unwritable(&e.to_string())`.
     - That message is "the project could not be written: {detail}" (`protocol/skp/src/v0/error.rs`). `detail` is `SaveError`'s Display (`kernel/src/project/store.rs`): either a fixed phrase ("the temporary file"), a colon and the I/O error, or "the rename over project.spatial failed N times; the last error was: …".
     - Rust's `std::io::Error` Display for an OS error is the system's message and code, with no path. That is from reading, not from a run.
     - So Amendment 54 item 12's R-CODE clause "its text may name the folder" is untrue of the code. By Amendment 56 item 5 it goes to the advisor unreworded. The routing would not change, because the bound applies to every message anyway.
4. **Yes: `readStyleDocument` can return `null` for a style the kernel sends in `opened`. That is stop 11.**
   - The renderer's grammar (`renderer/src/style.rs`, header and `value()`) allows "literals plus at most one categorical `match`" on any of the four properties, `fill_opacity`, `outline_color` and `outline_width` included.
   - The kernel reader's `style_document` (`kernel/src/project/file.rs`) accepts any document `style::parse` accepts in canonical form. `opened_of` (`kernel/src/project/mod.rs`) sends it back as it stands.
   - The shell's `readStyleDocument` (`frontends/shell/src/style/document.ts`) returns `null` when any of those three is not a literal, because `literalOf` gives `undefined`. A hand-edited project file (the files are plain text) therefore reaches a reopen where the saved style cannot be applied and no place has words for it.
   - Options for the advisor, mine and unruled: (i) a new owner place, "the saved style was not applied", with the default or current style kept and a T-9 case added; (ii) refuse such a reopen. Neither fits inside this brief.

**Commits:** none. The head is still e1f21e87ea459b12a23b3a47e20dff91f9f30cb2, equal to `origin/cut/b2-piece-1c-p4a`, with a clean worktree (`git status -sb` saved to `1cp4a2-st2.txt` in the scratchpad). I did not push, since nothing was committed, and I did not fetch.

**Not reached, because of the stop:**
- P-base, P-head and the mutations;
- the counts and the lock-file check;
- the words script, so no word was copied or typed;
- exports, so there is no caller grep;
- doc texts;
- holds, so there are no MACHINE lines to mask.

**Other findings, none acted on:**
- **A defect in the first brief's commit 24833eeb.** In `frontends/shell/src/console/surfaceRegistry.ts`, the doc line ` * NEXT-CUT.md's three-class table:` became ` &`. The table's line "A -- one of the seven SKP commands" was also left at seven while the rest of the doc moved to eight. It is not my file, so I left it.
- **Amendment 56 and ADV-2026-11-20-08 are only staged in the main checkout, not committed on main.** So `formatRefusal.ts` and `RefusalBlock.tsx` stay held. `console/ConsolePanel.tsx`, which ADV-20-08 adds, is not in my brief's file list. It needs your message before I touch it.

**Pre-gate self-check of the four classes:** no code was written, so there is no cross-module code, no completion claim, no user-facing message and no test to check. Every fact above comes from a Read or Bash call in this run's transcript.

**Model and handoff:** I observe myself running as Opus 5.5 (claude-opus-5-5), with no override. I received one context handoff, a compaction summary partway through step 0's reading, and produced none.

**Processes:** I started no background shell or process, and none is running.
