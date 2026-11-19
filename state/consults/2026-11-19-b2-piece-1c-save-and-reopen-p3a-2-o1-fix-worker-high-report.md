*Filed by the custodian: the O1 worker-high's three hand-backs (claude-opus-5-5), from 2026-11-19T09:53:44Z to 10:05:23Z by its transcript (Read 4, Bash 46, Grep 2, Edit 7, Write 3, SubagentHandback 3; one call errored). Below the first rule, the final report (5993 bytes, sha256 262acb4c0c55e20d5b7327bcdb4128edfd9da677904b6a0b85a8f4f47821c835); below the second and third, the two stops it supersedes (2533 bytes, sha256 50ee48873402b87a568b610a71b91676d7fd86b22beeea44c4aab3f32fba9de7; 2542 bytes, sha256 939c975702d734dd457072afc633310bfa5a65398062a8f26fabecf3503a7783). Each is byte for byte with three masks applied: the scratch folder's path written <S>, this project's name in the hold lines written <m>, and in the second stop one file time in local clock time written <t>, its UTC time kept. Both stops were the custodian's defects: the brief named the row id K-O24, already P3a-1's, and the custodian's own script left a hand-back file in the worktree.*

---

Built: b2-piece-1c-save-and-reopen P3a-2, the re-link's check before the lock (Amendment 41 items 3 to 5), worker-high
Result: K-O25 was committed first and fails at b5c35156 at its "nothing written" assertion, naming both cases. The fix's commit makes it pass, with every lib and `project_reopen` test passing. The mutation fails K-O25 as predicted. Both commits are pushed: the branch is at c351ddb8.

**Your two corrections:** (1) `K-O24` reads as `K-O25` throughout. K-O25 occurred 0 times in the form, `kernel/tests/*.rs` and `kernel/src/project/*.rs`, checked before writing. (2) The stray `o1stop-rep-1.md` was yours and has been moved out. My two earlier hand-backs (STOP on K-O24; STOP on the porcelain) are superseded by this one.

**Start checks (third pass, `<S>/1cp3a2o1-start3.txt`):** HEAD b5c351564dd4798fdd341e783b9d71b0054242e9; porcelain empty; `ls-remote` gives the same id.

**Step 1: the test**
- Name: `a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy`, appended at the end of `kernel/tests/project_reopen.rs`.
- Its doc opens `**K-O25** (Amendment 41 item 4).` and carries `RECORDED MUTATION:`.
- The copy case runs first, because it needs the save's `folders.json` to ask. Then the identity's machine folder is removed, which is the first reopen on this machine. Both cases call `open_project` directly, not through `reopen_at`, which would take the lock.
- Run at base: asked 2026-11-19T09:59:47Z. Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:40348 also=<m> (commands started from now on inherit it; release when done)`. Release line: `MACHINE_RELEASED project=<m> shell=bash.exe:40348 affinity=FF (cores 0-7)`. rc 101.
  - Result line, byte-copied: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 39 filtered out; finished in 0.26s`
  - Panic lines, byte-copied: `thread 'a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy' (74436) panicked at kernel\tests\project_reopen.rs:1853:5:` / `nothing written: ["copy: the copy's project.spatial", "copy: a machine folder for a new identity", "first reopen: the identity's machine folder"]`
  - Line 1853 is the final assertion, after both cases' refusal asserts passed.
- Clippy: asked 10:00:42Z, hold and release lines of the same form (`also=<m>`). rc 0, 9 warnings, none naming a line I added (all in other files).
- Commit 6837444160ca66b5f058873b7d950c34a773bc95.

**Step 2: the fix**
- The five lines (`let uri` and `let relinked`) moved byte-identically from after step 4's `live()?` to just before `ProjectLock::try_lock`, after the identity/folders/copy match.
- Doc, step 2: one sentence added, `Then a \`relink\` is checked by \`locations.json\`'s writer and refused by name when the writer would refuse it; its bytes are kept for step 6.`
- Doc, step 5: old `A \`relink\` is used first, refused by name when \`locations.json\`'s writer would refuse it.` New `A \`relink\`, checked at step 2, is used first.` Every other clause is unchanged.
- Tests: asked 10:01:56Z, hold and release lines masked as above, rc 0. Result lines: `test result: ok. 193 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 7.65s` (lib) and `test result: ok. 40 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 7.26s` (`project_reopen`). No existing test was edited or failed.
- Clippy: asked 10:03:04Z, rc 0, 9 warnings, none in a touched file.
- Commit c351ddb8055c89fde6b6bb8e319c6347a581077d.

**Step 3: the mutation**
- `<S>/1cp3a2o1-mutate.mjs` checks that each anchor occurs exactly once, and they did. Its `git diff` shows the block removed before the lock and re-added after the lineage `live()?`, which is its b5c35156 place.
- Run: asked 10:04:02Z, hold and release lines masked, rc 101. Result line: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 39 filtered out; finished in 0.32s`. Panic line: `...panicked at kernel\tests\project_reopen.rs:1853:5:` / `nothing written: ["copy: the copy's project.spatial", "copy: a machine folder for a new identity", "first reopen: the identity's machine folder"]`.
- My reading: this meets the prediction, failing at "nothing written" in both cases.
- Revert: `git checkout -- kernel/src/project/mod.rs` rc 0; `git diff` empty (0 bytes); HEAD c351ddb8.

**Step 4: the push.** `b5c35156..c351ddb8  cut/b2-piece-1c-p3a-2 -> cut/b2-piece-1c-p3a-2`, in its own call. `ls-remote` then gives c351ddb8055c89fde6b6bb8e319c6347a581077d.

**Counts (`git diff --numstat`)**
- Test commit: 58 added, 0 removed in `kernel/tests/project_reopen.rs`, all test code.
- Fix commit: 9 added, 7 removed in `kernel/src/project/mod.rs`, all product code: 5 code lines moved (+5/-5) and the doc +4/-2.

**Not done (off-scope):** Amendment 41 item 3 (b) names only a held lock and a step 3 machine-store failure. Moving the check before the lock also puts a refused re-link before two refusals it does not name: a copy's `ProjectFileUnwritable` from step 3's `replace`, and the `Cancelled` check after the lineage read. That follows from "before the lock"; I did not declare it anywhere.

**End state:** HEAD c351ddb8055c89fde6b6bb8e319c6347a581077d; porcelain empty. All five background hold calls completed with notifications received, and no cargo process is running. There is nothing to kill.

**Self-check**
- Cross-module: none. The change is inside `kernel/src/project`, and the test calls `Projects::open_project` itself.
- Evidence: every claim above has a log in `<S>` (`1cp3a2o1-run1.log`, `-run3.log`, `-run5.log`, `-clippy1.log`, `-clippy2.log`, the `.hold`, `.release` and `.asked` files).
- User-facing text: none changed.
- K-O25 reaches its final assertion in all three runs.
- verify-quotes: not run, because no gate is requested. The doc comment has no verbatim quotes or path:line cites.
- No context handoff beyond your two corrections; no model override.

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.

---

Built: b2-piece-1c-save-and-reopen P3a-2, the re-link's check before the lock (Amendment 41 items 3 to 5), worker-high
Result: STOP, `K-O24` is already in use. It appears 27 times in the form and is an existing test row in `kernel/tests/project_save.rs`. The brief lists this as a stop, so I wrote, committed and pushed nothing.

- **Brief:** sha256 3fe860cb390a7372fd368a22c2e0123c44c19beb266159a7c76d88340d68305a, 13679 bytes. Both match the dispatch.
- **Start checks (all held):**
  - HEAD is b5c351564dd4798fdd341e783b9d71b0054242e9, on branch `cut/b2-piece-1c-p3a-2`.
  - The porcelain is empty.
  - `git ls-remote origin cut/b2-piece-1c-p3a-2` gives b5c351564dd4798fdd341e783b9d71b0054242e9 (rc 0).
- **The stop:** the brief's step 1 requires `K-O24` to occur nowhere in `kernel/tests/project_reopen.rs` or the form. Script output (`<S>/1cp3a2o1-ko24.txt`):
  - `grep -c K-O24` on the form: 27 (rc 0).
  - The same on `project_reopen.rs` in the worktree: 0 (rc 1).
  - `K-O24` is P3a-1's lock row, `a_first_save_refused_after_the_lock_leaves_it_free`: Amendment 36 item 6 (b), then Amendments 37 and 38. It is in `kernel/tests/project_save.rs` at lines 22, 1050 and 1124 of the worktree at b5c35156.
- **Brief against the governing texts:**
  - Amendment 41 item 4 gives no row id; the row is "named by the worker". The ruling ADV-2026-11-19-15 names no K-O2x id (grep rc 1).
  - So the brief's id comes from the brief alone. The ruling and the amendment do not conflict with each other.
- **Ids in use:** K-O1 to K-O24, from a sorted, de-duplicated grep over the form, `kernel/tests/*.rs` and `kernel/src/project/*.rs`. `K-O25` occurs 0 times in the form. Whether to use it is your call; I did not use it.
- **Steps 1 to 4 and the counts:** none run. There was no hold, no cargo call, no edit, no commit and no push. No `.asked` stamp was made.
- **End state:** HEAD b5c351564dd4798fdd341e783b9d71b0054242e9, porcelain empty. No background shell or process was started.
- **Files:** I wrote only these scratch files in `<S>/`: `1cp3a2o1-start.txt`, `1cp3a2o1-lsremote0.txt`, `1cp3a2o1-ko24.txt`, `1cp3a2o1-ruling-ids.txt`, `1cp3a2o1-koids.txt`, `1cp3a2o1-koids-sorted.txt` and `1cp3a2o1-end.txt`.
- **Pre-gate self-check:** not applicable, because no code or claims landed. No context handoff was received or produced. There was no model override.
- **Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.

---

Built: b2-piece-1c-save-and-reopen P3a-2, the re-link's check before the lock (Amendment 41 items 3 to 5), worker-high
Result: STOP, the start checks failed after your K-O25 correction: the worktree's porcelain is no longer empty. An untracked `o1stop-rep-1.md` appeared after my first report, and I didn't create it. Nothing was written, committed or pushed.

- **Your correction:** I read `K-O25` wherever the brief says `K-O24`. K-O25 is free: grep count 0 in the form, in every `kernel/tests/*.rs` file and in every `kernel/src/project/*.rs` file (grep rc 1). The same grep for `K-O8` on `project_reopen.rs` finds 1, so the grep works.
- **Start checks, re-run** (output in `<S>/1cp3a2o1-start2.txt`):
  - HEAD: b5c351564dd4798fdd341e783b9d71b0054242e9, as required.
  - `ls-remote`: b5c351564dd4798fdd341e783b9d71b0054242e9, as required.
  - **Porcelain: `?? o1stop-rep-1.md`**, not empty. At my first check (`<S>/1cp3a2o1-start.txt`) it was empty.
- **The stray file:** `C:/dev/wt/1c-p3a-2/o1stop-rep-1.md` is 2533 B, modified <t> (09:55:13Z). That is after my first hand-back. Its opening bytes are my first stop report.
  - None of my calls wrote it: my only writes went to `<S>` under `1cp3a2o1-` names.
  - I didn't delete or move it. The brief allows no edit of any file other than the test file and `mod.rs`, and the file isn't mine.
- **To resume:** remove the file, or tell me the porcelain may be `?? o1stop-rep-1.md` and that the file stays out of every commit. I'd stage only `kernel/tests/project_reopen.rs` and `kernel/src/project/mod.rs` by path. Then the steps run unchanged with K-O25.
- **Steps 1 to 4 and the counts:** not run. No hold, no cargo call, no `.asked` stamp, no edit, no commit, no push.
- **End state:** HEAD b5c351564dd4798fdd341e783b9d71b0054242e9; porcelain is only `?? o1stop-rep-1.md`, which isn't mine. No background shell or process was started.
- **My scratch files**, all in `<S>/`:
  - `1cp3a2o1-start.txt`, `1cp3a2o1-lsremote0.txt`, `1cp3a2o1-ko24.txt`, `1cp3a2o1-ruling-ids.txt`, `1cp3a2o1-koids.txt`, `1cp3a2o1-koids-sorted.txt` and `1cp3a2o1-end.txt` from the first pass;
  - `1cp3a2o1-start2.txt` and `1cp3a2o1-ko25.txt` from this one.
- **Pre-gate self-check:** not applicable, because no code or claims landed. Context handoff: none, apart from your correction message. No model override.
- **Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.
