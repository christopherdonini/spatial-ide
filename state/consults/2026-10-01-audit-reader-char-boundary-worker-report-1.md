# Consult — node 6's worker report (audit-reader-char-boundary, g1)

*Custodian's filing note: the worker's hand-back for PLAN node `audit-reader-char-boundary` at g1 (the form `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`), delivered as a message on 2026-10-01. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 1b112b1 on 693f4f5, 256154c, e01b665 and 2a96670 from 7d7ea70, each with one sign-off; §7's command gives `kernel/src/bin/publish-bundle.rs` 18/0 and `kernel/src/permission/audit/reader.rs` 73/21, 112 over 2 files; the product condition changes from `at.len() >= 16` to `at.is_char_boundary(16)` and nothing else in it; P1 to P3 at 1b112b1 read as attributed paraphrase with no quotation marks, and "verbatim" survives in `reader.rs` only in T1's declared test name; Product CI (Rust workspace and shell) succeeded on 1b112b1. The report's line numbers are unpinned working pointers at the branch commits it names.*

---

node:audit-reader-char-boundary@g1 — DONE, no invalidator fired (I1-I8 clear). Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Branch cut/audit-reader-char-boundary pushed at 1b112b1; no PR; nothing written under state/, PLAN.yaml, queue or site/; form not edited.

Commits: B 2a96670 (tests only) · C e01b665 (guard + doc) · D 256154c (P1-P5 comments) · E 693f4f5 (mutation observations in test docs) · F 1b112b1 (T1 list wrapped for rustfmt). Worktree clean.

Step 1 greps at 7d7ea70:
- Clock grep (§6 item 2): the only `PublishAttempt` clocks are frontends/shell/src-tauri/src/publish.rs:705 and kernel/src/bin/publish-bundle.rs:617, both `clock: &rfc3339_utc_now`. The other hits are the type decl boundary.rs:129, a re-export, a doc line, and skp.rs:1515/1530, which are `rfc3339_utc_now()` calls, not clocks. H1 holds, I6 clear.
- Slice grep (§6 item 3): reader.rs:196 (`plain_date`) is the only input-derived slice in reader.rs. log.rs:324/327 and normalize.rs:145/146/159/257 are the form's Out/guarded cells. I4 clear.

P0 at B 2a96670, each fails with the standard library's panic at reader.rs:196:41, "end byte index 16 is not a char boundary; it is inside 'é' (bytes 15..17 of string)":
- T1 `a_timestamp_cut_by_a_multibyte_character_at_byte_16_is_returned_verbatim_not_sliced`
- T2 `each_sentence_whose_at_cuts_a_character_at_byte_16_starts_with_the_stored_value`
- T3 `an_audit_log_whose_at_cuts_a_character_at_byte_16_is_shown_not_a_panic`, workspace `audit-show-cut-at-byte-16`.

Mutations, applied and reverted at head 256154c, porcelain empty after each; the observations are recorded in the three tests' docs at 693f4f5:
- M1 on T1: FAILED, the same char-boundary panic (reader.rs:202:41 with the mutation).
- M1 on T3: FAILED, the same panic.
- M2 on T2 (16 to 15): FAILED, the same panic, at its first record.

Checks (rc read directly):
- `cargo test -p spatial-kernel`: rc 0, 317 passed, 0 failed (lib 137, publish-bundle bin 5). All 12 §5 declared-unchanged tests passed by name.
- `cargo clippy -p spatial-kernel --tests`: rc 0, only pre-existing warnings.
- rustfmt `Diff in` hunks over stdin: reader.rs 13 at 7d7ea70 and 13 at head; publish-bundle.rs 18 and 18. The first run of the new tests had 14 for reader.rs; fixed in F. rustfmt 1.9.0-stable.
- Quote grep (§6 item 5), reader.rs hits: lines 43-44 (the reader's own output text), 190 (example value) and 192 (clock.rs's reasoning phrase, pre-existing). P1-P5 do not appear. "verbatim" appears only in T1's declared test name.
- `node --test` scripts/plan and scripts/hooks, run from C:/dev/spatial-ide: 353 pass, 0 fail.
- verify-cites (522e448): PASS, run without file args because it takes none.
- verify-quotes (f9444a4): PASS. I ran it with the files as args; it printed repo-wide advisories and "0 checked".
- verify-test-claims (57c626f): PASS.
- verify-mutation (7d24ed1), `--base 7d7ea70 --head HEAD`: PASS, "all 3 new test(s) have a recorded mutation naming them". This is a recorded-mutation check, not the observation.
- Tool commits are the last commit touching each script in the worktree.

§7: `git diff --numstat 7d7ea70...HEAD` with the form's pathspecs gives publish-bundle.rs 18/0 and reader.rs 73/21. Total 112 of 175, 2 files, no overrun.

§8: only the two named files changed. In publish-bundle.rs the diff is test-only. No new string literal in product code and no new item, hook or cfg. Product change in reader.rs is the `plain_date` condition and doc only. P1-P5 are comment lines only; each source (ADR-017 1123-1125, log.rs 41-43, record.rs 47-51, boundary.rs 193) carries its content (I8 clear), and I only re-wrapped neighbouring comment lines to 100 columns.

CI at 1b112b1: Product CI Rust workspace success; Product CI shell success.

Off-scope, not done: verify-cites takes no file args, so the brief's file-arg form does not apply to it. The whole-log UTF-8 refusal is already routed by the form.

Pre-gate self-check (four classes):
1. Interface: T3 calls the real `audit_show_lines(Some(path)) -> Result<Vec<String>,String>` (publish-bundle.rs:177) over a real file. T2 calls the real `render_audit_log(&str)`. T1 calls the private `plain_date` from its own module's tests.
2. Evidence: every completion claim above names a test or command I ran.
3. User-facing messages: no new message, string or exit code.
4. Intended assertions: the three P0 panics and the three mutation failures show each test reaches its assertion path, not only setup. Under mutation each fails by the panic. The pass-case assertions (equality, prefix, markers, no CORRUPT) are exercised on the fix.
No usage figures.
