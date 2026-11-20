Reviewed: PR #340 at 231b32cc388b293dc6030f5f92c8b044c85c663a (the custodian's filing note, 2026-11-20: the reviewer's gate of P3b-2, attempt 2, on the correction's changed lines, as ADV-2026-11-20-01 item 1 (b) sets it; Bash 35, SubagentHandback 1, one errored, by unique call ids, model claude-opus-5-5, from 2026-11-20T02:04:43Z to 2026-11-20T02:13:28Z by its transcript; the report below byte for byte from its hand-back of 10789 bytes, sha256 75bec186ae4fea28fd4dd70be155bfb5988e5fe953a2313ac0fbae6623771440, but for one masking by the custodian (one scratch-folder path as <S>), with this note in its first line and one final newline), gate, reviewer, attempt 2
Gate: PR #340, b2-piece-1c-save-and-reopen P3b-2, reviewer, attempt 2, at 231b32cc388b293dc6030f5f92c8b044c85c663a
Reviewed: cut/b2-piece-1c-p3b-2 @ 231b32cc388b293dc6030f5f92c8b044c85c663a (attempt 1 read ddd74c349091832ada443e78ae867fa4ad79371b)
Verdict: PASS WITH NOTES

Brief checked first: 7480 bytes, sha256 2f049ca975af6a68840e5abc91f2cda0f5dd1f3a57bd0f76be8af958574da049, equal. Worker report copy: 3947 bytes, sha256 24d69703…1f42ce1d, equal. `git -C C:/dev/spatial-ide fetch -q origin` gave rc 0. `<W>` is at H2 and its porcelain is empty.

`git log --oneline H..H2`:
- 231b32cc test: W-7's doc as ADV-2026-11-20-01 (i) rules it, its second copy of case (a) deleted, U+0085 as an escape (P3b-2)
- c759c2cc docs: the reopen's words as ADV-2026-11-20-01 and -02 rule them, and the architect's D-6, D-7 and item 7 (P3b-2)

`git diff --stat H H2`: shell commands.rs 8, kernel/src/project/mod.rs 16, kernel/src/skp.rs 10, kernel/tests/project_reopen_skp.rs 19, SKP-V0.md 12, protocol commands.rs 12, protocol v0/mod.rs 5. Total: 7 files, 43 insertions(+), 39 deletions(-).

## 1. The words (script `<S>/g340r2-words.mjs`)

**Sources.** I took the texts from the sources themselves, at origin/main, not from the data files:
- the 18 fences of ADV-2026-11-20-01 and the 8 fences of ADV-2026-11-20-02;
- (g)'s New from ADV-02 item 5. Its Old equals ADV-01 (g)'s Old: true;
- D-6's New from the architect report's D-6 line ("Suggested: …");
- item 7's six lines from the architect report's one ``` fence;
- item 7's Old from H's `skp.rs` lines 929-932, joined.

**How each file was compared.** J() joins Rust comment continuations with one space. For each file I applied every Old→New to J(file at H), in order, and compared the result with J(file at c759c2cc).

**Old occurs once at H.** Each Old occurs exactly once in J(file at H): a, b, c, d, e, f, g, h, i, j, k, l, m and o.

**Result J(H, Olds→News) == J(docs commit): true for all six files of the docs commit:**
- protocol commands.rs (a, b)
- protocol v0/mod.rs (c)
- SKP-V0.md (d to h, m)
- kernel project/mod.rs (j, k, l)
- kernel skp.rs (o)
- shell commands.rs (D-7: no pair, so J(H) == J(docs) shows a wrap only)

Each of the six files is also byte-equal at c759c2cc and at H2. Pair (i) in the test commit is checked under question 4.

**Item 7.** The six lines sit verbatim at `kernel/src/skp.rs:929-934` at H2, followed by `#[derive(Default)]`.

**Negative control.** J(H) == J(H2) for protocol commands.rs without the pairs applied gives false, so the comparison does detect a change.

**Widths.** Across H..H2 there are 37 added `.rs` lines. None is over 100 columns (counted in code points); the widest is exactly 100.

**Data files** (`1cp3b2c-pairs.json` and `1cp3b2c-more.json`) against my source extracts:
- every id has the right file, Old and New: a to m, and o's New;
- o's `new_lines` equal item 7's six lines;
- o's Old equals H's lines 929-932, joined;
- n carries no words, which is right for D-7.

## 2. No code changed (script `<S>/g340r2-code2.mjs`)

At H and at H2, with every line whose trimmed start is `//` removed, these five files are identical:

| File | Non-comment lines (H / H2) | Equal |
|---|---|---|
| protocol commands.rs | 1052 / 1052 | yes |
| protocol v0/mod.rs | 16 / 16 | yes |
| kernel project/mod.rs | 1168 / 1168 | yes |
| kernel skp.rs | 3942 / 3942 | yes |
| shell commands.rs | 427 / 427 | yes |

Control: the same comparison on the test file gives false, as it should.

## 3. The clauses, against the code at H2

Every clause is true. None goes to the advisor.

**(a) `ReopenAnswer`.**
- "copy… which then gets a new identity": `mint_identity()` at `mod.rs:751`; written at :761-762 and :795.
- "same… recorded beside the first": `with_same` pushes onto `same` and keeps `first` (`store.rs:371-381`).
- `[ReopenQuestion]` resolves in the same file (`commands.rs:928`).

**(b), (e), (j): the question.**
- "not one recorded": the `is_known` arm, :740. It requires `folders.json` to be present (:728-733).
- "first… holds a project file of this identity, or one the reader refuses, or cannot be read, it or its project file": `asks`, :1076-1093:
  - metadata error other than NotFound gives true;
  - same identity gives true;
  - `read_project` Err gives true;
  - read error other than NotFound gives true.
- "Nothing was written": `return Ok(Reopen::Question)` at :743 comes before any write. Nothing before it writes; `begin_open` only registers the key in memory.

**(c), (d): the other seven commands.**
- `save_project` can return `project_file_names_another_project` (:1253-1255).
- `MachineRecordRefused` maps to `project_machine_record_refused` (:1258) where base 45ce89da mapped it to `project_file_refused`.
- `project_file_refused`'s message changed (error.rs diff B..H2), and save still returns it (:1248-1250).
- `cancel_key_in_use`'s message changed, and it is built only in `OpenRegistry::begin` (`skp.rs:944`), which `open_dataset` reaches (:1110).
- No request or reply type of the seven changed: question 2, and attempt 1.

**(f): one open within one user's store.**
- The lock is `open.lock` under `record_dir(self.root, identity)` (`store.rs:241-246`).
- The shell's root is `projects_root()` = `data_dir()/spatial-ide/projects` (`lib.rs:460`, `store.rs:68`).
- `data_dir()` is `user_data_dir()`: LOCALAPPDATA on Windows, HOME on macOS, XDG/HOME elsewhere (`engine/src/app_dirs.rs:80-87`). Each is per user.
- `Held` maps to `OpenElsewhere` (:781-782).

**(g), (k), (l): the cancel.**
- `live()` is called at :722 (after step 1's read), :754 (after the place is decided), :805 (after the lineage, step 4) and :814 (after the path is found, before `open_under`).
- `is_cancelled` on the open's error, at :826-831.
- No check sits between the reads that decide `Question` (:728/:741 to :743) or `NotFound` (:773 to :774, :809 to :811) and their returns. No check follows :832.
- The token is used only during the engine's open, through `cancellable`'s attach and detach (`engine/src/dataset.rs:1687-1695`). It is not retained.
- So a later cancel has no effect, and "goes on as it would with none" holds.
- `Cancelled` maps to `error_of(&EngineError::Cancelled)`, code `engine.cancelled` (:926; `skp.rs:2712-2713`).

**(h): the no-data-directory detail.**
- Of the three bindings with the fixed text, only `open_project` uses `project_machine_store_failed` (shell `commands.rs:209-212`). `record_step` uses `session_history_unwritable` (:165) and `save_project` uses `project_file_unwritable` (:187).
- `Projects` is `None` exactly when `default_root()` or `projects_root()` is `None`, and both rest on the same `data_dir()` (`session_history.rs:254-255`, `lib.rs:454-461`).
- So "when no per-user data directory resolves" is the only route.

**(i): macOS rests on CI's run alone.** The `macos-latest` job of the Rust workspace run 44655045924 at H2 runs `cargo test --workspace --locked`. Its log shows `test basis_and_file_name_carry_a_text_read_from_a_file_only_bounded_and_with_no_control_character ... o[k]`.

**m (D-6).** `open_project` registers a key for `cancel` and has no progress channel.

**o (item 7):**
- Both calls register through `begin_open` (`skp.rs:1110`, `mod.rs:709`).
- The guard is a named binding, `_end_open_on_drop`, so it lives to the return.
- `OpenGuard::drop` calls `end`, which removes the entry (`skp.rs:950-955`, :980-984). An unwind drops it too.

**Attempt 1's findings, each closed by the ruled words:**
- C-1 by (f).
- C-2 by (a) and (b): "open elsewhere" and "moved here" are gone.
- D-1 by (c) and (d).
- D-2 by (h).
- D-3 by the test commit.
- The architect's D-1 to D-7, N-3 ((g), (k), (l)) and N-7 (the escape) are also applied.

## 4. The test commit (`<S>/g340r2-code2.mjs`, `<S>/g340r2-esc.rs`)

**The deleted copy.** At H, lines 632-642 (case (a) and its blank) equal lines 643-653 byte for byte. Line 654 is `#[cfg(not(target_os = "linux"))]`.

**The two changes are the whole change.** Take H, delete lines 643-653, replace the raw literal with `par\u{85}cels.parquet`, then apply pair (i) to J():
- the result equals J(H2): true;
- with comment lines excluded, the code lines also equal: true.

**The raw character.** H holds one raw U+0085, at line 674 (bytes `706172c28563656c732e70617271756574`). H2 holds none.

**The escape's value.** I built a tiny program (`<S>/g340r2-esc.rs`) from H's raw literal and H2's escaped literal, both extracted from git, compiled it with rustc and ran it:
- `assert_eq!` held, rc 0;
- printed `equal: "par\u{85}cels.parquet" == "par\u{85}cels.parquet", bytes [70, 61, 72, c2, 85, 63, 65, 6c, 73, 2e, 70, 61, 72, 71, 75, 65, 74]`.

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation, must-fix before the merge:** none.

**Notes:**
- N-a. (a) reads as the answer's meaning on success. A `same` that is then refused records nothing: `project_known_folders_full` at :744-750, or `project_open_elsewhere` before the `folders.json` write at :791. The same holds for `copy`'s new identity. Other refusals are documented in §12.4. I read this as consistent with every command's doc, not as an untrue clause.
- N-b. §4 item 5's line (`SKP-V0.md:249`) is now longer. It is Markdown, so the Rust 100-column rule does not apply; the line above it was already long at H.
- N-c. Script defect, disclosed. My first `<S>/g340r2-code.mjs` lost its double backslashes in the heredoc. Its last four Q4 lines (escape, J, decode and code-equality) are void. `<S>/g340r2-code2.mjs` supersedes them, built with no backslash literals. Its Q2 lines are unaffected and equal the second run.

## Runs reused and reproduced

**Reused:**
- the correction worker's `cargo test --locked -p spatial-kernel --test project_reopen_skp` at H2 (exit 0, 7 passed);
- the custodian's CI at H2: 12 runs, completed success. I read this myself with `gh run list --commit 231b32cc…` at 2026-11-20T02:11:32Z, and the Rust workspace's three jobs (windows, ubuntu-24.04, macos-latest) were success in both runs (44655045924 and 44655039843);
- my attempt 1's mutation and clippy runs, for the code the correction does not change (question 2).

**Reproduced:** nothing heavy, and no hold was taken, so there are no hold lines. The only build was one rustc compile of the 6-line `<S>/g340r2-esc.rs`, outside any hold as a small build.

**Mutations:** none. `<W>` is at 231b32cc with empty porcelain. No process I started is still running.

**Scratch files:** `<S>/g340r2-words.mjs`, `<S>/g340r2-code.mjs` (void in part, N-c), `<S>/g340r2-code2.mjs`, `<S>/g340r2-esc.rs`, `<S>/g340r2-esc.exe` and `<S>/g340r2-esc.pdb`, where `<S>` = <S>.

Model: claude-opus-5-5 (Opus 5.5).
