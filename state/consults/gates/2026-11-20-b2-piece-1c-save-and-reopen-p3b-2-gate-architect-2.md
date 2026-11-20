Reviewed: PR #340 at 231b32cc388b293dc6030f5f92c8b044c85c663a (the custodian's filing note, 2026-11-20: the architect's gate of P3b-2, attempt 2, short, as ADV-2026-11-20-01 item 1 (a) sets it; Read 26, Grep 15, Glob 1, SubagentHandback 1, none errored, by unique call ids, model claude-opus-5-5, from 2026-11-20T02:04:43Z to 2026-11-20T02:09:30Z by its transcript; the report below byte for byte from its hand-back of 7970 bytes, sha256 b6acc33d24f8157f1a64acc8f4f32935f8313d53e494f9c04cdf0dcbbf9bd2a7, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect, attempt 2
Gate: PR #340, b2-piece-1c-save-and-reopen P3b-2, architect, attempt 2, at 231b32cc388b293dc6030f5f92c8b044c85c663a
Reviewed: cut/b2-piece-1c-p3b-2 @ 231b32cc388b293dc6030f5f92c8b044c85c663a (read in the checkout C:/dev/wt/1c-p3b2-ga; the files at H read from the custodian's g340a2-H-* copies)
Verdict: PASS WITH NOTES

Against AUTONOMY §22: Correctness is closed, Evidence is closed, and there is no must-fix Documentation finding. The notes are below.

**1. E-1: closed.**
- The reviewer's filed report (§6, "The custodian's added check (2)") ran W-4 under the mutation "`bounded` returns its input". That is W-4's (c), as W-7's RECORDED MUTATION line names it. Every case before `key` was skipped (lines 404-479 and `number`).
- `key` failed at `:370`, with U+0001 in the message. `word` failed at `:376`, with "`rule` is 4123 bytes". The report says "Each was seen alone. No case passed under the mutation."
- That is the condition my attempt 1 set. The report shows two rc 101 runs, each in a shared hold, with selection by env-var guards that were not committed. After the revert, `git diff --quiet` gave rc 0.
- The result still holds at H2. W-4 is untouched by the correction, and the kernel product changes are comment lines only (question 2).

**2. The docs commit (c759c2cc): each Old is replaced by its New byte for byte, with only line breaks changed.**
I compared each New by reading it with its lines joined, against the H copy and the advisor's fence. Each clause was checked against the code at H2.
- **(a) `ReopenAnswer`** (protocol commands.rs:796-798). New matches.
  - "copy ... gets a new identity": `Answer::Copy` leads to `mint_identity()`, and the identity is written into the folder's file (mod.rs:751, 759-762).
  - "recorded beside the first": `with_same` (mod.rs:744).
  - True.
- **(b) `ReopenQuestion`** (:922-925). New matches.
  - "not one this user's machine store records": `is_known` over `record_dir(&self.root, …)`'s `folders.json`. The root is `projects_root()`, which is `data_dir()/spatial-ide/projects` (store.rs:68-69).
  - "still holds a project file of this identity, or one the reader refuses, or cannot be read, it or its project file": `asks` (mod.rs:1076-1092). This covers the `there.project == *project` arm, `Ok(Err(_))` giving true, and a metadata or read error other than NotFound giving true.
  - "Nothing was written": `return Ok(Reopen::Question)` at mod.rs:743 comes before any write.
  - True.
- **(c) the `skp/0.14` paragraph** (protocol mod.rs:130-133). New matches.
  - `save_project`: `skp_error_of` maps to `project_file_names_another_project` (mod.rs:1254) and to `project_machine_record_refused` (:1259), and still returns `project_file_refused` (:1250).
  - `open_dataset`: `cancel_key_in_use` is built only in `OpenRegistry::begin` (skp.rs:944), which `open_dataset` reaches through `begin_open` (skp.rs:1110).
  - "keep their requests and replies" agrees with my attempt 1 §4.
  - True.
- **(d) §8's entry** (SKP-V0.md:1160). New matches. Its clauses are the same as (c)'s, with the `skp.` prefix. True.
- **(e) §12.3 `question`** (:1430). New matches. The same `asks` reading as (b) applies. True, subject to note N-A.
- **(f) §12.3 the open** (:1433). New matches.
  - The lock is `open.lock` under `record_dir(root, identity)` (store.rs:241-251).
  - A held lock gives `LockRefused::Held`, which becomes `OpenElsewhere` (mod.rs:781-782).
  - The root is per user.
  - True.
- **(g), the New of ADV-2026-11-20-02 item 5** (:1435). New matches.
  - "sees ... refuses it as `engine.cancelled`": `live()` at mod.rs:722, 754, 805 and 814; the error arm of `open_under` (:826-831); `OpenFailure::Cancelled` maps to `error_of(&EngineError::Cancelled)` (:926).
  - "looks between its steps, so a `question`, a `not_found` or another refusal already decided can still be the reply": there is no `live()` between :728 and :743, after :773, or after :809. A cancel between :722 and :723 gives `FileRefused`.
  - "after the engine's open returned a dataset is not seen": lines 833-886 do not read the token.
  - True.
- **(h) §12.4 row** (:1449). New matches.
  - Only `open_project`'s binding sends the fixed text under `project_machine_store_failed` (shell commands.rs:210-211). `record_step` (:165) and `save_project` (:187) send it under their own codes.
  - `Projects` is `None` exactly when `default_root()` or `projects_root()` is `None` (lib.rs:453-461). Both come from `data_dir()` (session_history.rs:254-255, store.rs:68-69).
  - True.
- **(j) ADV-02 item 2, `Reopen::Question`** (kernel mod.rs:521-523). New matches. Its clauses are the same as (b)'s. True.
- **(k) ADV-02 item 3, `open_project` step 1** (mod.rs:660-663). New matches.
  - The checks are at :722 (after step 1's read), :754 (after the place is decided, with the `Question` return at :743 before it), :805 (after step 4's lineage), :814 (path found, before `open_under`), and :827 (the open's error).
  - The `NotFound` returns at :774 and :811 have no check after their `data_at`.
  - True.
- **(l) ADV-02 item 4, `OpenFailure::Cancelled`** (mod.rs:564-567). New matches. Its clauses are the same as (g)'s: the checks, plus the `is_cancelled` test on the host open's error. True.
- **(m) D-6** (SKP-V0.md:249). New matches my suggested words, and the sentence is true.
- **(n) D-7** (shell commands.rs:7-12). With lines joined, H's lines 8-10 equal H2's lines 8-12, so it is a wrap only.
- **(o) my item 7** (skp.rs:929-934). It is my six lines byte for byte, and its clauses hold as in attempt 1 §7 (skp.rs:1110, 1118-1134, 982-986).
- Untrue clauses: none.

**3. N-3: carried.**
- Pair (g) puts it in the contract a client reads.
- Pair (l) puts it in `OpenFailure::Cancelled`'s doc.
- Pair (k) puts it in `open_project`'s source comment.
- That goes beyond the source-comment-only form I asked for, which is what ADV-2026-11-20-01 item 2 (g) intends.

**4. The test commit (231b32cc): D-5, N-7 and (i) are each done.**
- **D-5.** H's second copy of case (a), lines 643-652 and the blank line at 653, is deleted. It was identical to the kept copy at 632-641.
- **N-7.** H's line 674 held one raw U+0085, between `par` and `cels`. H2's line 663 is `"par\u{85}cels.parquet"`, which is the same value. No raw U+0085 remains: a grep for `\x{85}` gives 0 at H2 and 1 at H.
- **(i).** New matches at lines 624-626. "for macOS this rests on CI's run alone" is consistent with the CI at 63950d36 that the reviewer reused on all three platforms, and the clause claims nothing more.
- The worker's numstat for this commit is 4/15: 3+1 lines added, and 3+11+1 deleted. That is exactly these three changes.

**5. Nothing else.**
- The worker's per-file numstat matches exactly the hunks I read:
  - shell commands.rs 5/3
  - kernel mod.rs 11/5
  - skp.rs 6/4
  - SKP-V0.md 6/6
  - protocol commands.rs 7/5
  - protocol mod.rs 4/1
  - test 4/15
- So neither commit goes beyond questions 2 to 4.
- That conclusion rests on the worker's numstat, which is Evidence I cannot recompute. I have no Bash. The reviewer's attempt 2 recomputes `git diff --numstat ddd74c34 231b32cc` and `git show --stat` for each commit.

**Findings**

*Blocking:* none.

*Must-fix wording:* none.

*Notes*
- **N-A (to the advisor, unreworded).** In pair (e)'s New, "the folder is not one the machine remembers for the project" (SKP-V0.md:1430) carries over the Old's "the machine". The store is per user (store.rs:68-69). This is the same two-account gap as pair (f), which ADV-2026-11-20-01 item 9 already carries for P5. I do not count it as untrue in context, because §12.3's open bullet now names the per-user store. It is recorded for the advisor's view only.
- **N-B.** SKP-V0.md:54 still names only `open_dataset` as "cancellable but not progress-reporting". That sentence is inside `open_dataset`'s own section, so it is not a defect. Line 248 and the new line 249 name both commands.

Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.
