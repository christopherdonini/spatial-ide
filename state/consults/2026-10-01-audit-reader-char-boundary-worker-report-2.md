# Consult — node 6, correction round 1, the worker's report (audit-reader-char-boundary, g1)

*Custodian's filing note: the worker's hand-back for correction round 1 of PR #152 (PLAN node `audit-reader-char-boundary`, g1), on both gate-1 reports' shared B1, delivered as a message on 2026-10-01. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing:*
- *The branch is pushed and clean at ad728d9 on efe19e6 from 1b112b1, both signed off.*
- *`git diff 1b112b1..ad728d9` changes T2's `at` literal and T2's doc comment, nothing else.*
- *The literal's bytes at ad728d9, read with `od -c`, are backslash, u, 0, 0, e, 9 inside the raw string, as the fix requires. The report's own rendering of the literal shows an é: that is the report's display, not the file.*
- *§7's command gives 18/0 and 78/21, 117 over 2 files.*

---

node:audit-reader-char-boundary@g1 (correction round 1). Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
- Two commits, pushed (porcelain empty, branch level with origin): efe19e6 (the T2 literal only: `r"2026-08-17T08:4é"`, six characters backslash u 0 0 e 9; confirmed by `git diff`), ad728d9 (T2 doc only). Stored and every assertion are untouched. Head is ad728d9.
- At efe19e6, T2 passes (1 passed). M1 (line 201, `at.len() >= 16`), observed by applying it and running T2: it fails by name `permission::audit::reader::tests::each_sentence_whose_at_cuts_a_character_at_byte_16_starts_with_the_stored_value`, panicked at reader.rs:202:41, "end byte index 16 is not a char boundary; it is inside 'é' (bytes 15..17 of string)". Reverted.
- M2 (line 201, `is_char_boundary(15)`), same method: same T2 name, same panic and message at 202:41. Reverted. Each mutation was applied by an edit, T2 run, and the file restored; the run was not a verify-mutation run.
- T2's doc now says M2 observed at efe19e6 (was 256154c) and adds an M1 paragraph at efe19e6, with the rest of the doc kept. I added M1 as a new paragraph, so a reader will see two paragraphs.
- `cargo test -p spatial-kernel` at the final tree: rc 0, lib 137 passed, no failures. rustfmt over stdin for reader.rs: 13 `Diff in` at 1b112b1 and 13 at ad728d9.
- §7 count at head (`git diff --numstat 7d7ea70...HEAD` with the form's exclusions): publish-bundle.rs 18/0 and reader.rs 78/21, i.e. 96 added and 21 deleted (117 changed lines).
- `git diff 1b112b1..HEAD` is exactly the hunk above: the M2 commit id changed, the M1 paragraph added, and the `at` literal changed. Nothing else changed.
- `gh pr checks 152` (text): all three jobs (cargo test --workspace windows-latest, tauri build NSIS, typecheck/build/vitest/cargo test) are pending, with no result yet.
- Self-check: (1) no cross-module code touched. (2) The claims above rest on the commands I ran. (3) No user-facing messages. (4) T2 reaches its assertions (it passes at efe19e6) and fails on the mutations at the product's slice line, not at setup.
- Process note: my first literal edit lost the backslash (sed turned `\u` into case conversion); I reverted it and redid it cleanly. The shipped diff is only the line shown.
- Off-scope, not done: nothing under state/, PLAN.yaml, queue or site was written, and no PR was opened.
