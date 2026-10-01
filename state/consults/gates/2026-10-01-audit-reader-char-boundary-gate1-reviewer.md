*Custodian's filing note (2026-10-01): the reviewer's gate 1 on PR #152, for PLAN node `audit-reader-char-boundary` at g1, full gating. Reviewed: cut/audit-reader-char-boundary @ 1b112b1f9a7f4313d975219249d8487ea85ab4bf (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 12:16:48Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 1b112b1. Verdict FAIL on the same B1 as the architect, taken as correction round 1. Its P0 run at 2a96670, its mutation table at 1b112b1 and its guard harness are the observations of record for gate 1; M2 is re-observed on the corrected T2. Profile paths redacted at filing: none.*

---

Reviewed: cut/audit-reader-char-boundary @ 1b112b1f9a7f4313d975219249d8487ea85ab4bf
Verdict: FAIL, one blocker (B1). T2's fixture is not the S5 the form declares. Everything else passes.

## Checks

1. **Diff `7d7ea70...1b112b1`.** Two files changed: publish-bundle.rs +18/−0 and reader.rs +73/−21.
   - The product change is only `plain_date`'s condition and its doc (e01b665).
   - D (256154c) touches comment lines only: a grep for non-comment `+`/`-` lines returned rc=1, no hits.
   - publish-bundle.rs adds T3 only, after line 742.
   - P1 to P5 match the corrected texts in §2 item 6 word for word. I read each against its source at ee54158: ADR-017:1123-1125, log.rs:41-43, record.rs:47-51, boundary.rs:193. I8 is clear.
   - **Trying to break the guard:** I ran a standalone harness comparing the base and new `plain_date`. It covered the named edge cases (empty string, 15, 16 and 17 bytes, multi-byte characters at bytes 9-10 and 11, S1 to S4) plus 588,260 generated strings.
     - Results: 0 panics in the new guard, 0 output differences where the base returned, and 114,057 inputs where the base panicked and the new guard returns the input unchanged.
     - One example: `"éééééT08:44:08Z"` is sliced to `"ééééé 08:44"`. This matches the doc, which says a value passing the check is sliced whatever its other bytes are.

2. **§6 greps at 1b112b1.**
   - Clock grep: the only `PublishAttempt` clocks are publish.rs:705 and publish-bundle.rs:617, both `&rfc3339_utc_now`. The only `PublishAttempt {` literals are publish.rs:699 and publish-bundle.rs:611, and skp.rs:1515/1530 are direct calls, not clocks. H1 holds.
   - Slice grep: reader.rs:202 is the only slice in reader.rs. log.rs:324/327 and normalize.rs:159 are the form's Out rows. I4 is clear.
   - Quote grep (reader.rs) has four hits. Lines 43-44 are the reader's own output and line 190 is an example value. Line 192's span `no date crate is pulled in for one string` matches clock.rs:31 byte for byte. P1 to P5 are absent.

3. **P0 at 2a96670** (scratch worktree, since removed and pruned). T1, T2 and T3 each give rc=101 and panic at `reader.rs:196:41` with `end byte index 16 is not a char boundary; it is inside 'é' (bytes 15..17 of string)`.

4. **Mutations:** see the table.

5. **Suites.**
   - `cargo test -p spatial-kernel`: rc 0, lib 137 passed, publish-bundle bin 5 passed, 0 failed anywhere.
   - All §5 declared-unchanged tests pass: the 8 reader tests by name, the 4 audit_show tests by name, and the clock and normalize tests (10 ok).
   - `cargo clippy -p spatial-kernel --tests`: rc 0. Its one warning in a touched file, at publish-bundle.rs:135, is outside the diff.
   - rustfmt 1.9.0 over stdin, counting `Diff in`: reader.rs 13 at base and 13 at head, every hunk shifted +7 with none in new lines. publish-bundle.rs 18 and 18.
   - From main f527cd7:
     - `node --test` scripts/plan and scripts/hooks: rc 0, 353 pass, 0 fail.
     - verify-cites (522e448): PASS.
     - verify-quotes (f9444a4): PASS.
     - verify-test-claims (57c626f): PASS, with T1 to T3 shown as planned.
     - verify.mjs (2607202): PASS.
   - In the worktree:
     - verify-test-claims: PASS, with T1 to T3 resolving at reader.rs:441/458 and publish-bundle.rs:748.
     - verify-mutation (7d24ed1), `--base 7d7ea70 --head 1b112b1`: rc 0, PASS. This only checks that a mutation is recorded; it is not an observation.

6. **§7 and §8.**
   - §7, by the form's command (merge-base 7d7ea70): 18+0 and 73+21 = 112 of 175 over 2 files. No overrun.
   - §8 item 8: no sleep, timeout, thread, Instant or Duration in the added lines.
   - §8 item 9: no `cfg(` and no drive letter. The destination is `out/cut-cli`.
   - §8 item 11: `audit-show-cut-at-byte-16` appears only at publish-bundle.rs:749 and in the form.

7. **`gh pr checks 152`:** 7 of 7 pass (cargo test windows ×2, sign-off, tauri build ×2, shell ×2). No governance-CI job ran on the PR, so the local runs above stand in for it.

## Mutation table (observations of record, at 1b112b1; porcelain empty after each revert)

| Mutation | Test | Result | Message |
|---|---|---|---|
| M1 (`is_char_boundary(16)` back to `len() >= 16`) | T1 `a_timestamp_cut_by_a_multibyte_character_at_byte_16_is_returned_verbatim_not_sliced` | FAILED, rc 101 | panic at reader.rs:202:41, `end byte index 16 is not a char boundary; it is inside 'é' (bytes 15..17 of string)`. 'é' at 15..17 is S1, so it panics at the first value |
| M1, applied alone | T3 `an_audit_log_whose_at_cuts_a_character_at_byte_16_is_shown_not_a_panic` | FAILED, rc 101 | same panic, reader.rs:202:41 |
| M2 (index 16 to 15) | T2 `each_sentence_whose_at_cuts_a_character_at_byte_16_starts_with_the_stored_value` | FAILED, rc 101 | same panic, reader.rs:202:41 |

## Blocking

**B1. T2 does not encode S5 as the form declares it.**
- The form says each `at` is written in the JSON as `\u00e9` (kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md §3 S5, at 7d7ea70). §4 binds T2 to S5.
- T2 writes the character as raw UTF-8 instead. Its binding `let at = r"2026-08-17T08:4é";` (kernel/src/permission/audit/reader.rs:459 @ 1b112b1) holds bytes `c3 a9`; I confirmed this with od, and the same bytes are already there at 2a96670.
- So S5 and S6 both test raw bytes, and the JSON-escape decode path (§1 May 3's pair/orphan claim reached through serde's `\u` decoding) is never sampled. The worker report does not disclose this.
- The `r"…"` raw prefix and the separate `at` / `stored` bindings suggest the escape was intended.
- Fix: one literal, `r"2026-08-17T08:4\u00e9"`. In a scratch worktree I checked that this edit panics at 2a96670 (`reader.rs:196:41`, same message) and passes at 1b112b1. Changing T2's text also means M2 must be re-observed on the new T2, and T2's doc updated with that commit.

## Non-blocking

**N1.** The three test docs record their mutations as "observed at 256154c", a branch commit, while my observations above are at 1b112b1. The closing record should name which commit the observations of record were made at.

**N2.** The worker report's line numbers (`reader.rs:196`, `:202`) are unpinned, as its filing note says.

## Paths

- C:/dev/wt/audit-reader-char-boundary/kernel/src/permission/audit/reader.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/src/bin/publish-bundle.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md

The worktree is clean at 1b112b1. The scratch worktree D:/wt-targets/audit-reader-char-boundary/scratch-b has been removed and pruned. Main is untouched at f527cd7.
